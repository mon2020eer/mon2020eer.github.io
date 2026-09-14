import { useState } from "react";
import { SERVICES, waLink } from "../content/ar.js";
import { SERVICE_ICONS, WhatsApp } from "./Icons.jsx";

export default function Services() {
  const [openId, setOpenId] = useState(SERVICES.items[0].id);

  return (
    <section
      id="services"
      aria-labelledby="servicesHeading"
      className="relative scroll-mt-24 bg-panel py-24 sm:py-32"
    >
      <div className="shell">
        <div className="reveal max-w-[62ch]">
          <p className="eyebrow">{SERVICES.eyebrow}</p>
          <h2 id="servicesHeading" className="mt-3 text-h2 text-ink">
            {SERVICES.title}
          </h2>
          <p className="mt-4 text-lede text-ink-2">{SERVICES.lede}</p>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.items.map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon];
            const isOpen = openId === s.id;
            return (
              <li
                key={s.id}
                className="reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <article
                  /* البطاقة تتوسّع بالمرور وبالتركيز وباللمس — تعمل بلا فأرة */
                  onMouseEnter={() => setOpenId(s.id)}
                  onFocusCapture={() => setOpenId(s.id)}
                  onClick={() => setOpenId(s.id)}
                  className={[
                    "group flex h-full flex-col rounded-3xl border bg-canvas p-7",
                    "transition-all duration-400 ease-e1",
                    isOpen
                      ? "-translate-y-1.5 border-accent-muted shadow-lift"
                      : "border-hairline hover:-translate-y-1 hover:shadow-soft",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300",
                      isOpen ? "bg-accent text-on-accent" : "bg-accent/10 text-accent",
                    ].join(" ")}
                  >
                    <Icon className="h-6 w-6" />
                  </span>

                  <h3 className="mt-5 font-display text-h3 font-bold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[.96rem] text-ink-2">{s.body}</p>

                  <ul className="mt-5 space-y-2">
                    {s.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-center gap-2.5 text-[.9rem] text-ink-2"
                      >
                        {/* نقطة دائرية — لا علامات متصالبة */}
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 flex-none rounded-full bg-sand"
                        />
                        {pt}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={waLink(s.waMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={[
                      "mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3",
                      "text-[.92rem] font-semibold no-underline transition-colors duration-300",
                      isOpen
                        ? "bg-accent text-on-accent hover:bg-accent-deep"
                        : "border border-border-strong text-ink hover:bg-accent/10",
                    ].join(" ")}
                  >
                    <WhatsApp className="h-[17px] w-[17px] flex-none" />
                    {SERVICES.cta}
                    <span className="sr-only"> — {s.title}</span>
                  </a>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
