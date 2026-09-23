import type { ReactNode } from "react";

export type CaseStudyHeroProps = {
  /** Company mark above the title, as on the Indeed case: an editorial reference, not affiliation. */
  logo?: ReactNode;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
};

export default function CaseStudyHero({
  logo,
  eyebrow,
  title,
  subtitle,
}: CaseStudyHeroProps) {
  return (
    <section className="cs-container-wide pt-12 sm:pt-20 pb-8 sm:pb-12">
      {logo && <div className="cs-hero-logo">{logo}</div>}
      {eyebrow && <p className="cs-eyebrow">{eyebrow}</p>}
      <h1 className={`${logo ? "mt-6" : "mt-4"} cs-hero-title text-[color:var(--color-ink)]`}>
        {title}
      </h1>
      {subtitle && (
        <p className="mt-5 max-w-[640px] t-body-lg text-[color:var(--color-body-ink)]">
          {subtitle}
        </p>
      )}
    </section>
  );
}
