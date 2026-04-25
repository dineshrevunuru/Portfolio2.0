import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
};

export default function CaseStudyHero({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="cs-container-wide pt-12 sm:pt-20 pb-8 sm:pb-12">
      {eyebrow && <p className="cs-eyebrow">{eyebrow}</p>}
      <h1 className="mt-4 cs-hero-title text-[color:var(--color-ink)]">
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
