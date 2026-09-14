import { useEffect, useState } from "react";
import { A11Y, CONTACT, waLink } from "../content/ar.js";
import { WhatsApp } from "./Icons.jsx";

/** زر واتساب العائم — يظهر بعد مغادرة البطل حتى لا يزاحم دعوته الأساسية */
export default function WhatsAppFab() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={waLink(CONTACT.waMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={A11Y.whatsappFab}
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      className={[
        "fixed bottom-5 end-5 z-fab",
        "inline-flex h-14 w-14 items-center justify-center rounded-full",
        "bg-accent text-on-accent no-underline shadow-lift",
        "transition-all duration-400 ease-e1 hover:scale-105 hover:bg-accent-deep",
        shown
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      ].join(" ")}
    >
      <WhatsApp className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}
