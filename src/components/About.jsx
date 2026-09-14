import { STORY, COMPANY } from "../content/ar.js";
import { CurveRule, Pin } from "./Icons.jsx";

export default function About() {
  return (
    <section
      id="story"
      aria-labelledby="storyHeading"
      className="relative scroll-mt-24 bg-canvas py-24 sm:py-32"
    >
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          {/* العمود الأول: العنوان والمقر */}
          <div className="reveal">
            <p className="eyebrow">{STORY.eyebrow}</p>
            <h2 id="storyHeading" className="mt-3 text-h2 text-ink">
              {STORY.title}
            </h2>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-panel px-4 py-2 text-sm text-ink-2">
              <Pin className="h-4 w-4 flex-none text-accent" aria-hidden="true" />
              {COMPANY.city}
            </span>

            <CurveRule className="mt-8 h-4 w-full text-sand" />
          </div>

          {/* العمود الثاني: السرد */}
          <div className="reveal space-y-6" style={{ transitionDelay: "90ms" }}>
            {STORY.paragraphs.map((p, i) => (
              <p
                key={i}
                className={i === 0 ? "text-lede text-ink" : "text-ink-2"}
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* كيف نعمل — ثلاث خطوات */}
        <div className="mt-24">
          <h3 className="reveal text-h3 text-ink">{STORY.stepsTitle}</h3>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {STORY.steps.map((s, i) => (
              <li
                key={s.n}
                className="reveal rounded-3xl border border-hairline bg-panel p-7"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/12 font-display text-lg font-bold text-accent"
                >
                  {s.n}
                </span>
                <h4 className="mt-5 font-display text-[1.1rem] font-bold text-ink">
                  {s.title}
                </h4>
                <p className="mt-2 text-[.96rem] text-ink-2">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* تعهداتنا */}
        <div className="mt-20">
          <h3 className="reveal text-h3 text-ink">{STORY.pledgesTitle}</h3>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {STORY.pledges.map((p, i) => (
              <li
                key={p.title}
                className="reveal group flex gap-4 rounded-2xl border border-hairline bg-canvas-warm/40 p-6 transition-all duration-300 hover:border-sand hover:shadow-soft"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                {/* علامة منحنية لا متصالبة — التزاماً بقيد الهوية */}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 flex-none text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4.5 13.2c2.6 1 4.4 2.6 5.4 4.6 2-5.6 5-9.6 9.6-12.6" />
                </svg>
                <div>
                  <h4 className="font-display text-[1.02rem] font-bold text-ink">
                    {p.title}
                  </h4>
                  <p className="mt-1.5 text-[.94rem] text-ink-2">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
