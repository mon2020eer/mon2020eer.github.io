/* ============================================================
   أيقونات الواجهة.
   قيد ملزم مأخوذ من الشعار: لا خط عمودي يعبر خطاً أفقياً.
   كل ما هنا إما منحنٍ أو خطوط متوازية — لا أشكال متصالبة.
   ============================================================ */

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function Logo({ className = "" }) {
  // الشعار الرسمي: حرف «س» مدمج مع «M» — موجتان تمثلان مسارات الطيران،
  // تصعد منهما طائرة. الموجتان منحنيتان، فلا تصالب مستقيم.
  return (
    <svg viewBox="0 0 128 72" className={className} role="img" aria-label="المسار المتحد">
      <defs>
        <linearGradient id="amtWave" x1="8" y1="48" x2="120" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1C786B" />
          <stop offset=".55" stopColor="#1C786B" />
          <stop offset="1" stopColor="#C0BAA4" />
        </linearGradient>
        <linearGradient id="amtWave2" x1="8" y1="40" x2="120" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C0BAA4" />
          <stop offset=".5" stopColor="#1C786B" />
          <stop offset="1" stopColor="#C0BAA4" />
        </linearGradient>
      </defs>

      {/* الموجة الخلفية — الرملي */}
      <path
        d="M6 46C22 18 44 18 60 46s38 28 54 0"
        fill="none"
        stroke="url(#amtWave2)"
        strokeWidth="5.5"
        strokeLinecap="round"
        opacity=".75"
      />
      {/* الموجة الأمامية — التركوازي */}
      <path
        d="M6 52C24 30 42 30 60 52s36 22 56 -6"
        fill="none"
        stroke="url(#amtWave)"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      {/* الطائرة الصاعدة */}
      <path
        d="M52 22c3.4-3.6 7.2-6.6 9-5.6 1.7 1 .3 5-2.2 8.9l7.7 2.6-2.6 3.4-8.6-.7-3.4 4 1.6 4.2-2.3 2.1-3.4-5.4-5.6-3 2.3-2.2 4.3 1.3z"
        fill="#C0BAA4"
      />
    </svg>
  );
}

export const Plane = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M10.5 13.2 3.6 10.9a.6.6 0 0 1-.1-1.1l1.6-.9a1 1 0 0 1 .8-.1l3.3 1" />
    <path d="M20.7 5.6c.7.7.4 2.2-.8 3.4l-8.2 8.2-1 4a.6.6 0 0 1-1 .3l-2-2.6-3-1.7a.6.6 0 0 1 .2-1.1l3.9-1.1 8.3-8.2c1.2-1.2 2.7-1.6 3.6-.8Z" />
  </svg>
);

export const Bed = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" />
    <path d="M3 14h18" />
    <path d="M7.5 9V7.4a1.4 1.4 0 0 1 1.4-1.4h6.2a1.4 1.4 0 0 1 1.4 1.4V9" />
  </svg>
);

export const Passport = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h9.4A1.8 1.8 0 0 1 19 4.8v14.4a1.8 1.8 0 0 1-1.8 1.8H7.8A1.8 1.8 0 0 1 6 19.2Z" />
    <circle cx="12.5" cy="10" r="3" />
    <path d="M9.8 16.4h5.4" />
  </svg>
);

export const Car = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 15.5v-2.1a2 2 0 0 1 .2-.9l1.7-3.4A2 2 0 0 1 7.7 8h8.6a2 2 0 0 1 1.8 1.1l1.7 3.4a2 2 0 0 1 .2.9v2.1" />
    <path d="M4 15.5h16" />
    <circle cx="7.5" cy="16.6" r="1.6" />
    <circle cx="16.5" cy="16.6" r="1.6" />
  </svg>
);

export const WhatsApp = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.16 8.16 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.19-.53.06-.25-.12-1.05-.38-1.99-1.23-.74-.65-1.23-1.46-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.09-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14 0-.31-.02-.47-.02-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.06s.89 2.39 1.01 2.56c.12.16 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
  </svg>
);

export const Facebook = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
  </svg>
);

export const Globe = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3c2.5 2.4 3.8 5.4 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.4-3.8-9S9.5 5.4 12 3Z" />
    <path d="M3.4 9.4h17.2M3.4 14.6h17.2" />
  </svg>
);

export const Pin = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 21c4-4.4 6-7.8 6-10.4A6 6 0 0 0 6 10.6C6 13.2 8 16.6 12 21Z" />
    <circle cx="12" cy="10.4" r="2.4" />
  </svg>
);

export const Sun = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 3.2v1.6M12 19.2v1.6M20.8 12h-1.6M4.8 12H3.2" />
    <path d="M18.2 5.8l-1.1 1.1M6.9 17.1l-1.1 1.1M18.2 18.2l-1.1-1.1M6.9 6.9 5.8 5.8" />
  </svg>
);

export const Moon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z" />
  </svg>
);

export const ArrowDown = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 4.5v14" />
    <path d="M6.5 13.2 12 18.7l5.5-5.5" />
  </svg>
);

/* خط فاصل منحنٍ — بديل الخط المستقيم، حفاظاً على قيد «لا تصالب» */
export const CurveRule = ({ className = "" }) => (
  <svg viewBox="0 0 1200 18" preserveAspectRatio="none" className={className} aria-hidden="true">
    <path
      d="M0 12C180 2 300 2 480 9s240 9 420 2 240-8 300-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export const SERVICE_ICONS = { plane: Plane, bed: Bed, passport: Passport, car: Car };
export const CHANNEL_ICONS = { whatsapp: WhatsApp, facebook: Facebook, globe: Globe, pin: Pin };
