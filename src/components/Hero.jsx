import { useRef } from "react";
import { HERO, SERVICES, A11Y, waLink } from "../content/ar.js";
import { WhatsApp, ArrowDown } from "./Icons.jsx";
import useHeroVideo, { useHeroMode } from "../hooks/useHeroVideo.js";

const VIDEO_SRC = "assets/hero-scrub.mp4";
const POSTER_SRC = "assets/hero-poster.jpg";
const STATIC_SRC = "assets/hero-ending.jpg";

export default function Hero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const requestedMode = useHeroMode();
  // الخطّاف قد يخفض الوضع من «سحب» إلى «حلقي» إن تبيّن أن المصدر غير قابل للسعي
  const { ready, failed, mode } = useHeroVideo({
    videoRef,
    sectionRef,
    mode: requestedMode,
  });

  const isScrub = mode === "scrub";
  const showVideo = mode !== "static" && !failed;

  const goToServices = (e) => {
    e.preventDefault();
    document.getElementById("services")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="المقدمة"
      /* في وضع السحب يحتاج القسم ارتفاعاً يُستهلك بالتمرير.
         في وضع الحلقة يكفي ملء الشاشة — فلا تمرير طويل على الجوال. */
      className={isScrub ? "relative h-[300vh]" : "relative"}
    >
      <div
        className={[
          "flex items-end overflow-hidden bg-brand-ink",
          isScrub ? "sticky top-0 h-[100svh]" : "relative min-h-[100svh]",
        ].join(" ")}
      >
        {/* الصورة الثابتة: تظهر دائماً كطبقة سفلى، فلا صندوق أسود إن تعثّر الفيديو */}
        <img
          src={mode === "static" || failed ? STATIC_SRC : POSTER_SRC}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-105 object-cover"
          loading="eager"
          fetchpriority="high"
        />

        {showVideo && (
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            /* السمات الإلزامية للجوال. تُعاد كتابتها في الـ hook عبر ref
               لأن webkit-playsinline وأخواتها غير قياسية. */
            autoPlay={!isScrub}
            muted
            loop={!isScrub}
            playsInline
            preload={isScrub ? "auto" : "metadata"}
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
            className={[
              "absolute inset-0 h-full w-full scale-105 object-cover",
              "transition-opacity duration-700 ease-e1",
              ready ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
        )}

        {/* حجاب التدرّج — يضمن قراءة النص فوق أي إطار من الفيديو */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/55 to-brand-ink/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-l from-brand-ink/70 via-transparent to-transparent"
        />

        <div className="shell relative z-[2] pb-20 pt-32 sm:pb-24">
          <p className="mb-4 font-mono text-[.72rem] uppercase tracking-[.14em] text-brand-sand">
            {HERO.eyebrow}
          </p>

          <h1 className="max-w-[18ch] whitespace-pre-line text-hero font-bold text-white [text-shadow:0_2px_18px_rgb(4_20_24/.75)]">
            {HERO.title}
          </h1>

          <p className="mt-6 max-w-[54ch] text-lede text-white/85 [text-shadow:0_1px_10px_rgb(4_20_24/.7)]">
            {HERO.lede}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={waLink(HERO.waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-[1.02rem] font-semibold text-on-accent no-underline transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-deep"
            >
              <WhatsApp className="h-5 w-5 flex-none" />
              {HERO.ctaPrimary}
            </a>
            <a
              href="#services"
              onClick={goToServices}
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-4 text-[1.02rem] font-semibold text-white no-underline backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
            >
              {HERO.ctaSecondary}
            </a>
          </div>

          <p className="mt-12 flex items-center gap-2 text-sm text-white/60">
            <ArrowDown className="h-4 w-4 animate-drift" aria-hidden="true" />
            {HERO.scrollCue}
          </p>
        </div>

        {/* شريط الخدمات السفلي — يربط البطل بما تحته */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 z-[2] hidden border-t border-white/10 bg-brand-ink/45 backdrop-blur-sm md:block"
        >
          <div className="shell flex items-center justify-between gap-6 py-3">
            {SERVICES.items.map((s) => (
              <span key={s.id} className="font-mono text-[.7rem] tracking-[.08em] text-white/55">
                {s.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
