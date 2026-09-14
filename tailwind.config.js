/** @type {import('tailwindcss').Config} */

/*  ============================================================
    هوية المسار المتحد — الألوان مسحوبة حرفياً من الشعار الرسمي
    ثلاث لطخات معتمدة:
      #082B31  البترولي العميق   (الكحلي في وصف الهوية)
      #1C786B  التركوازي         (لون المسار)
      #C0BAA4  الرملي المطفي     (الذهبي المطفي)
    المحايدات منقولة كما هي من الموقع القائم.
    قيد ملزم: لا خط عمودي يعبر خطاً أفقياً في أي زخرفة.
    ============================================================ */

export default {
  content: ["./src/**/*.{js,jsx,html}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        /* الألوان الثابتة للعلامة — لا تتغير بين الوضعين */
        brand: {
          ink: "#082B31",
          teal: "#1C786B",
          sand: "#C0BAA4",
        },
        /* الرموز المتبدلة — تُقرأ من متغيرات CSS في index.css */
        canvas: "rgb(var(--c-canvas) / <alpha-value>)",
        "canvas-warm": "rgb(var(--c-canvas-warm) / <alpha-value>)",
        panel: "rgb(var(--c-panel) / <alpha-value>)",
        "panel-2": "rgb(var(--c-panel-2) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        "ink-2": "rgb(var(--c-ink-2) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        "accent-deep": "rgb(var(--c-accent-deep) / <alpha-value>)",
        "accent-muted": "rgb(var(--c-accent-muted) / <alpha-value>)",
        sand: "rgb(var(--c-sand) / <alpha-value>)",
        "sand-deep": "rgb(var(--c-sand-deep) / <alpha-value>)",
        hairline: "rgb(var(--c-hairline) / <alpha-value>)",
        "border-strong": "rgb(var(--c-border-strong) / <alpha-value>)",
        "on-accent": "rgb(var(--c-on-accent) / <alpha-value>)",
      },
      fontFamily: {
        display: ['"Reem Kufi"', '"Segoe UI"', "system-ui", "sans-serif"],
        body: ['"IBM Plex Sans Arabic"', '"Segoe UI"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        hero: ["clamp(2.5rem,6.4vw,5rem)", { lineHeight: "1.14" }],
        h2: ["clamp(1.9rem,4.2vw,3.2rem)", { lineHeight: "1.18" }],
        h3: ["clamp(1.15rem,1.9vw,1.5rem)", { lineHeight: "1.3" }],
        lede: ["clamp(1.05rem,1.5vw,1.3rem)", { lineHeight: "1.7" }],
      },
      /* سلم الطبقات صريح — سبب عُلوق القائمة سابقاً كان غيابه */
      zIndex: {
        backdrop: "90",
        header: "100",
        drawer: "110",
        fab: "120",
        skip: "200",
      },
      transitionTimingFunction: {
        e1: "cubic-bezier(.22,.61,.36,1)",
        e2: "cubic-bezier(.65,0,.35,1)",
      },
      maxWidth: { shell: "1240px" },
      boxShadow: {
        soft: "0 1px 2px rgb(8 43 49 / .05), 0 12px 40px -18px rgb(8 43 49 / .32)",
        lift: "0 2px 6px rgb(8 43 49 / .07), 0 26px 60px -22px rgb(8 43 49 / .42)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        drift: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up .7s cubic-bezier(.22,.61,.36,1) both",
        drift: "drift 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
