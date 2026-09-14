import { useEffect } from "react";

/** ظهور تدريجي عند دخول العنصر الشاشة. يعمل مرة واحدة لكل عنصر. */
export default function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll(".reveal:not(.is-in)"));
    if (!nodes.length) return undefined;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    nodes.forEach((n) => io.observe(n));

    /* شبكة أمان: لو لم يعمل المراقب لأي سبب (لقطة مصغّرة، متصفح غريب،
       عرض خارج الشاشة) لا يجوز أن يبقى المحتوى مخفياً إلى الأبد. */
    const failsafe = setTimeout(() => {
      nodes.forEach((n) => n.classList.add("is-in"));
      io.disconnect();
    }, 2500);

    return () => {
      clearTimeout(failsafe);
      io.disconnect();
    };
  }, []);
}
