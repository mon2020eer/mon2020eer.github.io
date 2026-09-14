import { useCallback, useEffect, useRef, useState } from "react";
import { NAV, A11Y, COMPANY, HERO, waLink } from "../content/ar.js";
import { Logo, WhatsApp, Sun, Moon } from "./Icons.jsx";
import useScrollLock from "../hooks/useScrollLock.js";

/* ============================================================
   الترويسة والدرج.

   العطل الذي كان: الدرج كان ابناً لعنصر الترويسة التي تحمل
   backdrop-filter. وخاصية backdrop-filter تُنشئ كتلة احتواء
   للأبناء ذوي position:fixed، فيصير «الثابت» ثابتاً بالنسبة
   للترويسة لا للنافذة — ومعه translateY(-102%) يستقر الدرج
   جزئياً داخل الشاشة بلا إمكانية لمسه: «يظهر ولا ينغلق».

   إضافة إلى ذلك: لم تكن هناك طبقة تعتيم أصلاً، ولا إغلاق عند
   التمرير، ولا قفل لتمرير الصفحة، وكانت الحالة تُقرأ من الـ DOM
   (aria-expanded) بدل مصدر واحد في React.

   العلاج: الدرج شقيق للترويسة لا ابن لها، وحالة واحدة isOpen
   تشتق منها كل السمات، وإغلاق من ست جهات، وسلم z-index صريح.
   ============================================================ */

const DRAWER_BREAKPOINT = "(min-width: 1024px)";

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") return null;
    return document.documentElement.getAttribute("data-theme");
  });

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const isDark = root.getAttribute("data-theme")
      ? root.getAttribute("data-theme") === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = isDark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("amt-theme", next);
    } catch {
      /* الوضع الخاص يمنع التخزين — لا يضر */
    }
    setTheme(next);
  }, []);

  return { theme, toggle };
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false); // مصدر الحقيقة الوحيد
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState("");
  const toggleRef = useRef(null);
  const drawerRef = useRef(null);
  const { theme, toggle: toggleTheme } = useTheme();

  const close = useCallback(() => setIsOpen(false), []);

  useScrollLock(isOpen);

  /* ---------- خلفية الترويسة + القسم النشط ---------- */
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean);
    if (!sections.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* ---------- الإغلاق عند التمرير ----------
     كان غائباً تماماً: القائمة تبقى مفتوحة والصفحة تتحرك تحتها. */
  useEffect(() => {
    if (!isOpen) return undefined;
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 8) close();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOpen, close]);

  /* ---------- الإغلاق عند تجاوز نقطة الكسر ---------- */
  useEffect(() => {
    const mq = window.matchMedia(DRAWER_BREAKPOINT);
    const onChange = (e) => {
      if (e.matches) close();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [close]);

  /* ---------- Escape + حبس التنقل بالمفاتيح داخل الدرج ---------- */
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        toggleRef.current?.focus(); // إرجاع التركيز إلى الزر الذي فتحها
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = drawerRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || !focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // أول رابط يستقبل التركيز عند الفتح
    const t = setTimeout(() => {
      drawerRef.current?.querySelector("a, button")?.focus();
    }, 60);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      clearTimeout(t);
    };
  }, [isOpen, close]);

  /* ---------- عزل بقية الصفحة عن القارئات والمؤشر ---------- */
  useEffect(() => {
    const main = document.getElementById("main");
    const footer = document.getElementById("site-footer");
    [main, footer].forEach((el) => {
      if (!el) return;
      if (isOpen) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });
    return () => {
      [main, footer].forEach((el) => el?.removeAttribute("inert"));
    };
  }, [isOpen]);

  const onNavClick = (e, id) => {
    e.preventDefault();
    close(); // الحالة تُصفَّر دائماً عند اختيار عنصر
    const el = document.getElementById(id);
    if (!el) return;
    // ننتظر رفع قفل التمرير قبل القفز، وإلا ضاع الموضع
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      });
    });
  };

  const isDark =
    theme === "dark" ||
    (theme === null &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <>
      <a
        href="#main"
        className="fixed top-2 start-2 z-skip -translate-y-[160%] rounded-full bg-accent px-5 py-3 text-sm font-semibold text-on-accent no-underline transition-transform duration-300 focus:translate-y-0"
      >
        {A11Y.skip}
      </a>

      {/* الترويسة — تحمل backdrop-filter، ولذلك لا شيء ثابت بداخلها */}
      <header
        className={[
          "fixed inset-x-0 top-0 z-header",
          "supports-[backdrop-filter]:backdrop-blur-xl supports-[backdrop-filter]:backdrop-saturate-150",
          "transition-[background-color,border-color,padding] duration-500 ease-e1",
          "border-b",
          solid
            ? "border-hairline bg-canvas/95 py-2"
            : "border-transparent bg-canvas/75 py-3",
        ].join(" ")}
      >
        <div className="shell flex items-center gap-4">
          <a
            href="#main"
            onClick={(e) => onNavClick(e, "main")}
            className="me-auto flex items-center gap-3 no-underline"
          >
            <Logo className="h-9 w-auto flex-none" />
            <span className="block leading-tight">
              <b className="block font-display text-[1.05rem] font-bold text-ink">
                {COMPANY.name}
              </b>
              <span className="block font-mono text-[.65rem] tracking-[.08em] text-ink-2">
                {COMPANY.latin}
              </span>
            </span>
          </a>

          {/* روابط سطح المكتب */}
          <nav aria-label={A11Y.mainNav} className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => onNavClick(e, item.id)}
                aria-current={active === item.id ? "true" : undefined}
                className={[
                  "rounded-full px-3 py-2 text-[.93rem] font-medium no-underline transition-colors duration-300",
                  active === item.id
                    ? "bg-accent/10 text-ink"
                    : "text-ink-2 hover:bg-accent/10 hover:text-ink",
                ].join(" ")}
              >
                {item.label}
              </a>
            ))}
            <a
              href={waLink(HERO.waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="ms-2 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[.93rem] font-semibold text-on-accent no-underline transition-colors duration-300 hover:bg-accent-deep"
            >
              <WhatsApp className="h-[18px] w-[18px] flex-none" />
              واتساب
            </a>
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={A11Y.themeToggle}
            className="rounded-xl p-2 text-ink-2 transition-colors hover:bg-accent/10 hover:text-ink"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* زر الدرج — السمات مشتقة من isOpen، لا تُقرأ من الـ DOM */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="amt-drawer"
            aria-label={isOpen ? A11Y.closeMenu : A11Y.openMenu}
            className="rounded-xl p-2 text-ink transition-colors hover:bg-accent/10 lg:hidden"
          >
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" fill="currentColor">
              <rect
                x="4" y="7" width="18" height="2" rx="1"
                className="origin-center transition-transform duration-300 ease-e1"
                style={{ transform: isOpen ? "translateY(5px)" : "none" }}
              />
              <rect
                x="4" y="12" width="18" height="2" rx="1"
                className="transition-opacity duration-200"
                style={{ opacity: isOpen ? 0 : 1 }}
              />
              <rect
                x="4" y="17" width="18" height="2" rx="1"
                className="origin-center transition-transform duration-300 ease-e1"
                style={{ transform: isOpen ? "translateY(-5px)" : "none" }}
              />
            </svg>
          </button>
        </div>
      </header>

      {/* طبقة التعتيم — لم تكن موجودة إطلاقاً، وغيابها هو سبب تعذّر
          الإغلاق باللمس خارج القائمة. زر حقيقي ليعمل بلوحة المفاتيح. */}
      <button
        type="button"
        aria-label={A11Y.closeOverlay}
        tabIndex={isOpen ? 0 : -1}
        onClick={close}
        className={[
          "fixed inset-0 z-backdrop border-0 bg-brand-ink/55 lg:hidden",
          "transition-opacity duration-300 ease-e1",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* الدرج — شقيق للترويسة، خارج كتلة احتواء backdrop-filter */}
      <div
        id="amt-drawer"
        ref={drawerRef}
        hidden={!isOpen}
        className={[
          "fixed inset-x-0 top-0 z-drawer lg:hidden",
          "bg-panel shadow-lift",
          "border-b border-hairline",
          "px-[clamp(1.15rem,4vw,4.5rem)] pb-8 pt-24",
          "transition-transform duration-500 ease-e1 motion-reduce:transition-none",
          isOpen ? "translate-y-0" : "-translate-y-full",
        ].join(" ")}
        style={{ visibility: isOpen ? "visible" : "hidden" }}
      >
        <nav aria-label={A11Y.mainNav} className="flex flex-col gap-1">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => onNavClick(e, item.id)}
              className="rounded-xl px-2 py-3.5 text-[1.05rem] font-medium text-ink no-underline transition-colors hover:bg-accent/10"
            >
              {item.label}
            </a>
          ))}
          <a
            href={waLink(HERO.waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-on-accent no-underline transition-colors hover:bg-accent-deep"
          >
            <WhatsApp className="h-5 w-5 flex-none" />
            واتساب — {COMPANY.whatsappDisplay}
          </a>
        </nav>
      </div>
    </>
  );
}
