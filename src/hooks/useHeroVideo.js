import { useEffect, useState, useCallback, useRef } from "react";

/* ============================================================
   إدارة فيديو البطل.

   العطل الذي كان: الفيديو كان يُقاد بـ video.currentTime خلف مزلاج
   seekBusy لا يُفتح إلا عند حدث "seeked". وعلى iOS كثيراً ما لا يُطلق
   هذا الحدث أصلاً عند السعي خارج إيماءة مستخدم، فيبقى المزلاج مغلقاً
   إلى الأبد ويتجمّد البطل على إطار واحد. ولم يكن هناك أي حارس زمني.

   العلاج هنا رباعي:
   1) وضعان صريحان: سَحْب (scrub) على أجهزة المؤشر الدقيق والشاشات
      الكبيرة، وتشغيل حلقي (loop) حقيقي على أجهزة اللمس.
   2) حارس زمني يفكّ مزلاج السعي إن تأخر "seeked" — فلا جمود بعد اليوم.
   3) IntersectionObserver لا يُشغّل الفيديو إلا وهو داخل الشاشة،
      فلا نستدعي play() خارجها حيث تمنعه سياسات المتصفح.
   4) إن تبيّن أن السعي لا يتحرك فعلاً بعد عدة محاولات، ننزل تلقائياً
      إلى التشغيل الحلقي. نقيس الفشل الواقع، ولا نستجوب قدرة المتصفح:
      خاصية video.seekable تكذب على بعض المصادر فتبلّغ عن مدى صفري
      رغم أن السعي يعمل.
   ============================================================ */

const SCRUB_QUERY = "(min-width: 1024px) and (pointer: fine)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const SEEK_WATCHDOG_MS = 400;
const SCRUB_STRIKES = 3; // محاولات سعي متتالية بلا حراك قبل النزول

const prefersSaveData = () => {
  const c = navigator.connection || navigator.webkitConnection;
  return Boolean(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || "")));
};

/** يحدد الوضع المطلوب ثم يتابع تغيّره حيّاً في الاتجاهين */
export function useHeroMode() {
  const compute = useCallback(() => {
    if (typeof window === "undefined") return "static";
    if (window.matchMedia(REDUCED_QUERY).matches) return "static";
    if (prefersSaveData()) return "static";
    return window.matchMedia(SCRUB_QUERY).matches ? "scrub" : "loop";
  }, []);

  const [mode, setMode] = useState(compute);

  useEffect(() => {
    const queries = [window.matchMedia(SCRUB_QUERY), window.matchMedia(REDUCED_QUERY)];
    const onChange = () => setMode(compute());
    queries.forEach((q) => q.addEventListener("change", onChange));
    return () => queries.forEach((q) => q.removeEventListener("change", onChange));
  }, [compute]);

  return mode;
}

export default function useHeroVideo({ videoRef, sectionRef, mode }) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [durationUsable, setDurationUsable] = useState(true);
  const [scrubBroken, setScrubBroken] = useState(false);
  // حركة فعلية مؤكدة — حدث playing، لا مجرد canplay
  const [playing, setPlaying] = useState(false);
  // المتصفح رفض التشغيل التلقائي: نحتاج إيماءة من المستخدم
  const [needsGesture, setNeedsGesture] = useState(false);

  // مزلاج السعي وحارسه — يعيشان خارج دورة الرسم
  const seekBusy = useRef(false);
  const pendingTime = useRef(null);
  const watchdog = useRef(null);
  const lastTarget = useRef(null);
  const lastBefore = useRef(null);
  const strikes = useRef(0);

  /* ---------- السمات الإلزامية للتشغيل على الجوال ----------
     تُضبط عبر ref لأن بعضها غير قياسي ولا تضمن React تمريره. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true; // لا بد منها قبل play() وإلا رفضها المتصفح
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    v.setAttribute("x5-playsinline", "");
    v.setAttribute("x-webkit-airplay", "allow");
    v.disablePictureInPicture = true;
  }, [videoRef, mode]);

  /* ---------- جاهزية المصدر ---------- */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || mode === "static") return undefined;

    setFailed(false);
    const onReady = () => {
      setReady(true);
      // مدة غير منتهية أو صفرية تعني مصدراً لا يصلح للسحب إطلاقاً
      setDurationUsable(Number.isFinite(v.duration) && v.duration > 0);
    };
    const onError = () => {
      setFailed(true);
      setReady(false);
    };

    if (v.readyState >= 2) onReady();
    v.addEventListener("loadedmetadata", onReady);
    v.addEventListener("loadeddata", onReady);
    v.addEventListener("canplay", onReady);
    v.addEventListener("error", onError);
    return () => {
      v.removeEventListener("loadedmetadata", onReady);
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("canplay", onReady);
      v.removeEventListener("error", onError);
    };
  }, [videoRef, mode]);

  /* الوضع الفعلي: السحب المطلوب ينزل إلى الحلقي إن ثبت أنه لا يعمل */
  const effectiveMode =
    mode === "scrub" && (!durationUsable || scrubBroken) ? "loop" : mode;

  /* ---------- وضع التشغيل الحلقي: أجهزة اللمس ---------- */
  useEffect(() => {
    const v = videoRef.current;
    const section = sectionRef.current;
    if (!v || !section || effectiveMode !== "loop") return undefined;

    v.loop = true;

    let cancelled = false;

    /* تصنيف رفض play() — هنا كان العطل.
       كان أي رفض يُسقط الفيديو نهائياً، و AbortError يقع روتينياً حين
       يقاطع pause() (عند التمرير) نداءَ play() المعلّق. فكانت لمسة تمرير
       واحدة على الجوال تكفي لإزالة الفيديو وترك صورة ساكنة لا تتحرك.
       الآن: العابر يُتجاهَل ويُعاد، والمنع يطلب إيماءة، ولا شيء من هذا
       يُسقط الفيديو. السقوط لا يكون إلا من حدث error حقيقي على العنصر. */
    const attempt = () => {
      if (cancelled || !v.paused) return;
      const p = v.play();
      if (!p || typeof p.catch !== "function") return;
      p.then(() => {
        if (!cancelled) setNeedsGesture(false);
      }).catch((err) => {
        if (cancelled) return;
        const name = err && err.name;
        if (name === "AbortError") return; // عابر: قاطعه pause أو تحميل جديد
        if (name === "NotAllowedError") {
          setNeedsGesture(true); // التشغيل التلقائي ممنوع: نعرض زر تشغيل
          return;
        }
        // أي رفض آخر (NotSupportedError مثلاً) لا يعني بالضرورة موت المصدر،
        // فنكتفي بطلب الإيماءة ولا نزيل العنصر.
        setNeedsGesture(true);
      });
    };

    let inView = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          inView = e.isIntersecting;
          if (inView) attempt();
          else if (!v.paused) v.pause();
        });
      },
      { threshold: 0.15 }
    );
    io.observe(section);

    /* المراقب لا يُطلق إلا عند تغيّر التقاطع. فإن توقف الفيديو لأي سبب آخر
       وهو داخل الشاشة (مقاطعة، تبديل تطبيق، سياسة طاقة) فلا شيء يعيده،
       ويبقى إطاراً ساكناً. هذا المستمع هو ما يستأنفه. */
    const onPausedWhileVisible = () => {
      if (cancelled || !inView || v.ended) return;
      setTimeout(attempt, 120);
    };
    v.addEventListener("pause", onPausedWhileVisible);

    // إعادة المحاولة عند كل نقطة يصير فيها التشغيل ممكناً
    const onVisible = () => {
      if (document.visibilityState === "visible") attempt();
    };
    // إيماءة المستخدم تبقى مرصودة حتى يبدأ التشغيل فعلاً — لا { once: true }،
    // فقد كانت اللمسة الوحيدة تُستهلك في نقرة عابرة ثم لا تعود أبداً.
    const onGesture = () => attempt();

    document.addEventListener("visibilitychange", onVisible);
    document.addEventListener("pointerdown", onGesture, { passive: true });
    document.addEventListener("touchstart", onGesture, { passive: true });
    v.addEventListener("canplay", attempt);
    v.addEventListener("loadeddata", attempt);

    return () => {
      cancelled = true;
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
      document.removeEventListener("pointerdown", onGesture);
      document.removeEventListener("touchstart", onGesture);
      v.removeEventListener("canplay", attempt);
      v.removeEventListener("loadeddata", attempt);
      v.removeEventListener("pause", onPausedWhileVisible);
    };
  }, [videoRef, sectionRef, effectiveMode, ready]);

  /* ---------- رصد الحركة الحقيقية ---------- */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    const onPlaying = () => {
      setPlaying(true);
      setNeedsGesture(false);
    };
    const onPause = () => setPlaying(false);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("pause", onPause);
    };
  }, [videoRef, effectiveMode]);

  /** يستدعيه زر «شغّل الفيديو» — داخل إيماءة مستخدم حقيقية */
  const playByGesture = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => setNeedsGesture(true));
  }, [videoRef]);

  /* ---------- وضع السحب: سطح المكتب ---------- */
  useEffect(() => {
    const v = videoRef.current;
    const section = sectionRef.current;
    if (!v || !section || effectiveMode !== "scrub") return undefined;

    v.loop = false;
    if (!v.paused) v.pause();
    strikes.current = 0;

    const clearWatchdog = () => {
      if (watchdog.current !== null) {
        clearTimeout(watchdog.current);
        watchdog.current = null;
      }
    };

    const drainPending = () => {
      seekBusy.current = false;
      if (pendingTime.current !== null) {
        const t = pendingTime.current;
        pendingTime.current = null;
        requestSeek(t);
      }
    };

    // وصل "seeked" فعلاً: السعي يعمل، نصفّر العدّاد
    const onSeeked = () => {
      clearWatchdog();
      strikes.current = 0;
      drainPending();
    };

    // لم يصل "seeked" في الوقت: نفكّ المزلاج بأنفسنا — هذا ما يمنع الجمود.
    // ونتحقق هل تحرّك الزمن فعلاً؟ إن لم يتحرك مراراً، فالسحب لا يعمل هنا.
    const onWatchdog = () => {
      watchdog.current = null;
      const moved =
        lastBefore.current === null ||
        Math.abs(v.currentTime - lastBefore.current) > 0.01 ||
        Math.abs(v.currentTime - (lastTarget.current ?? 0)) < 0.05;

      if (moved) strikes.current = 0;
      else if (++strikes.current >= SCRUB_STRIKES) setScrubBroken(true);

      drainPending();
    };

    function requestSeek(t) {
      if (!Number.isFinite(v.duration) || v.duration <= 0) return;
      if (seekBusy.current) {
        pendingTime.current = t;
        return;
      }
      seekBusy.current = true;
      lastTarget.current = t;
      lastBefore.current = v.currentTime;
      clearWatchdog();
      watchdog.current = setTimeout(onWatchdog, SEEK_WATCHDOG_MS);
      try {
        v.currentTime = t;
      } catch {
        clearWatchdog();
        drainPending();
      }
    }

    let raf = null;
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const rect = section.getBoundingClientRect();
        const span = rect.height - window.innerHeight;
        const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
        setProgress(p);
        if (Number.isFinite(v.duration) && v.duration > 0) requestSeek(p * v.duration);
      });
    };

    v.addEventListener("seeked", onSeeked);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    return () => {
      clearWatchdog();
      seekBusy.current = false;
      pendingTime.current = null;
      if (raf !== null) cancelAnimationFrame(raf);
      v.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [videoRef, sectionRef, effectiveMode, ready]);

  return {
    ready,
    failed,
    progress,
    playing,
    needsGesture,
    playByGesture,
    mode: effectiveMode,
  };
}
