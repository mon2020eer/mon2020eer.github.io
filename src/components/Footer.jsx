import { COMPANY, FOOTER, NAV, CONTACT, waLink } from "../content/ar.js";
import { Logo, WhatsApp, Facebook, Globe } from "./Icons.jsx";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="border-t border-hairline bg-panel">
      <div className="shell py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* الهوية */}
          <div>
            <a href="#main" className="flex items-center gap-3 no-underline">
              <Logo className="h-10 w-auto flex-none" />
              <span className="block leading-tight">
                <b className="block font-display text-[1.05rem] font-bold text-ink">
                  {COMPANY.name}
                </b>
                <span className="block font-mono text-[.65rem] tracking-[.08em] text-ink-2">
                  {COMPANY.latin}
                </span>
              </span>
            </a>
            <p className="mt-5 max-w-[42ch] text-[.94rem] text-ink-2">{FOOTER.blurb}</p>
          </div>

          {/* الروابط */}
          <nav aria-label={FOOTER.linksTitle}>
            <h2 className="font-mono text-[.68rem] uppercase tracking-[.12em] text-ink-2">
              {FOOTER.linksTitle}
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className="text-[.94rem] text-ink-2 no-underline transition-colors hover:text-accent"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* القنوات */}
          <nav aria-label={FOOTER.channelsTitle}>
            <h2 className="font-mono text-[.68rem] uppercase tracking-[.12em] text-ink-2">
              {FOOTER.channelsTitle}
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a
                  href={waLink(CONTACT.waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[.94rem] text-ink-2 no-underline transition-colors hover:text-accent"
                >
                  <WhatsApp className="h-4 w-4 flex-none" aria-hidden="true" />
                  <span dir="ltr">{COMPANY.whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={COMPANY.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[.94rem] text-ink-2 no-underline transition-colors hover:text-accent"
                >
                  <Facebook className="h-4 w-4 flex-none" aria-hidden="true" />
                  {COMPANY.facebookLabel}
                </a>
              </li>
              <li>
                <a
                  href={COMPANY.site}
                  className="inline-flex items-center gap-2 text-[.94rem] text-ink-2 no-underline transition-colors hover:text-accent"
                >
                  <Globe className="h-4 w-4 flex-none" aria-hidden="true" />
                  {COMPANY.domain}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* شريط الحقوق — خط منحنٍ فاصل بدل المستقيم */}
        <svg
          viewBox="0 0 1200 12"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="mt-14 h-3 w-full text-sand opacity-60"
        >
          <path
            d="M0 8C200 2 360 2 600 7s300 5 600 -1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[.86rem] text-ink-2">
          <p>
            © {year} — {FOOTER.rights}
          </p>
          <p className="font-mono tracking-[.06em]">{COMPANY.domain}</p>
        </div>
      </div>
    </footer>
  );
}
