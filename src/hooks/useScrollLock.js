import { useEffect, useRef } from "react";

/**
 * يقفل تمرير الصفحة أثناء فتح الدرج، ويعيدها إلى موضعها بالضبط عند الإغلاق.
 *
 * لماذا position:fixed وليس overflow:hidden؟
 * لأن overflow:hidden على body لا يمسك الصفحة على iOS Safari — تظل تتمرر
 * تحت الدرج المفتوح، وهو أحد أعراض العطل الذي كان في الموقع.
 * تثبيت body مع حفظ scrollY هو الصيغة الوحيدة الصامدة عبر المتصفحات.
 */
export default function useScrollLock(locked) {
  const savedY = useRef(0);

  useEffect(() => {
    const body = document.body;
    if (!locked) return undefined;

    savedY.current = window.scrollY || window.pageYOffset || 0;

    // تعويض عرض شريط التمرير حتى لا يقفز التخطيط على سطح المكتب
    const gap = window.innerWidth - document.documentElement.clientWidth;

    body.dataset.scrollLocked = "true";
    body.style.top = `-${savedY.current}px`;
    if (gap > 0) body.style.paddingInlineEnd = `${gap}px`;

    return () => {
      delete body.dataset.scrollLocked;
      body.style.top = "";
      body.style.paddingInlineEnd = "";
      // الإرجاع فوري وبلا حركة، وإلا انزلقت الصفحة أمام المستخدم
      const behavior = "instant";
      try {
        window.scrollTo({ top: savedY.current, left: 0, behavior });
      } catch {
        window.scrollTo(0, savedY.current);
      }
    };
  }, [locked]);
}
