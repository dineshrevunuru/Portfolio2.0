import type { ReactNode } from "react";

export type CaseStudySectionProps = {
  heading?: string;
  subheading?: string;
  children: ReactNode;
  spacing?: "default" | "tight";
  headingVariant?: "default" | "prototype";
};

export default function CaseStudySection({
  heading,
  subheading,
  children,
  spacing = "default",
  headingVariant = "default",
}: CaseStudySectionProps) {
  const topPad = spacing === "tight" ? "pt-6 sm:pt-8" : "pt-12 sm:pt-16";
  const headClass =
    headingVariant === "prototype"
      ? "cs-section-head-prototype"
      : "cs-section-head";
  return (
    <section className={`cs-container ${topPad}`}>
      {heading && <h3 className={headClass}>{heading}</h3>}
      {subheading && <p className="mt-2 cs-meta-label">{subheading}</p>}
      <div className={`${heading || subheading ? "mt-3" : ""} cs-prose`}>
        {children}
      </div>
    </section>
  );
}
