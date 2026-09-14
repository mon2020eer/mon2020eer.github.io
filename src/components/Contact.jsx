import { useState } from "react";
import { CONTACT, COMPANY, waLink } from "../content/ar.js";
import { CHANNEL_ICONS, WhatsApp, Facebook, CurveRule } from "./Icons.jsx";

function Faq() {
  const [open, setOpen] = useState(null);

  return (
    <div className="mt-4">
      <h3 className="text-h3 text-ink">{CONTACT.faqTitle}</h3>
      <dl className="mt-6 divide-y divide-hairline border-y border-hairline">
        {CONTACT.faq.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <dt>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-center justify-between gap-4 py-5 text-start font-display text-[1.02rem] font-bold text-ink transition-colors hover:text-accent"
                >
                  {item.q}
                  {/* مؤشر منحنٍ يدور — لا علامة زائد متصالبة */}
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={[
                      "h-5 w-5 flex-none text-accent transition-transform duration-300 ease-e1",
                      isOpen ? "rotate-180" : "",
                    ].join(" ")}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9.5 12 15l6-5.5" />
                  </svg>
                </button>
              </dt>
              <dd
                id={`faq-panel-${i}`}
                hidden={!isOpen}
                className="pb-5 text-[.96rem] text-ink-2"
              >
                {item.a}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contactHeading"
      className="relative scroll-mt-24 bg-canvas py-24 sm:py-32"
    >
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          {/* العمود الأول: الدعوة والقنوات */}
          <div className="reveal">
            <p className="eyebrow">{CONTACT.eyebrow}</p>
            <h2 id="contactHeading" className="mt-3 text-h2 text-ink">
              {CONTACT.title}
            </h2>
            <p className="mt-4 max-w-[48ch] text-lede text-ink-2">{CONTACT.lede}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={waLink(CONTACT.waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 font-semibold text-on-accent no-underline transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-deep"
              >
                <WhatsApp className="h-5 w-5 flex-none" />
                {CONTACT.waCta}
              </a>
              <a
                href={COMPANY.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border-strong px-7 py-4 font-semibold text-ink no-underline transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/10"
              >
                <Facebook className="h-5 w-5 flex-none" />
                {CONTACT.fbCta}
              </a>
            </div>

            <CurveRule className="mt-10 h-4 w-full text-sand" />

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {CONTACT.channels.map((c) => {
                const Icon = CHANNEL_ICONS[c.icon];
                const inner = (
                  <>
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-accent/10 text-accent"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[.68rem] uppercase tracking-[.12em] text-ink-2">
                        {c.label}
                      </span>
                      <span
                        dir={c.icon === "whatsapp" ? "ltr" : undefined}
                        className="block truncate font-medium text-ink"
                        style={c.icon === "whatsapp" ? { textAlign: "right" } : undefined}
                      >
                        {c.value}
                      </span>
                    </span>
                  </>
                );

                return (
                  <li key={c.label}>
                    {c.href ? (
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-2xl border border-hairline bg-panel p-4 no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-muted hover:shadow-soft"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-panel p-4">
                        {inner}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* العمود الثاني: الأسئلة الشائعة */}
          <div className="reveal" style={{ transitionDelay: "90ms" }}>
            <Faq />
          </div>
        </div>
      </div>
    </section>
  );
}
