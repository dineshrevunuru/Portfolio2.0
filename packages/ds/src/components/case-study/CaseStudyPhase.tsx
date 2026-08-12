import type { ReactNode } from "react";

export type CaseStudyPhaseProps = {
  label: string;
  number?: string;
  /**
   * The act's argument in one sentence.
   *
   * Without it the band is a divider: "Diagnose" is a label, so the biggest
   * element on the screen carries no argument and a scanner learns nothing by
   * stopping here. With it the band becomes a landmark — the claim is the
   * level-1, and number + label demote to a single eyebrow line. A reader who
   * only ever reads the four claims still leaves with the whole case.
   */
  claim?: ReactNode;
};

export default function CaseStudyPhase({ label, number, claim }: CaseStudyPhaseProps) {
  // No claim — unchanged, so the other case studies keep their centred divider.
  if (!claim) {
    return (
      <div className="w-full cs-phase-wrapper">
        <div className="cs-container py-10 sm:py-12 text-center">
          {number && <p className="cs-phase-number">Phase {number}</p>}
          <h2 className="cs-phase-label">{label}</h2>
        </div>
      </div>
    );
  }

  // Landmark mode. Left-aligned, not centred: the claim runs to two lines at
  // this size and centred multi-line text is a scanning anti-pattern — it moves
  // the start of every line, which is the one place the eye returns to.
  return (
    <div className="w-full cs-phase-wrapper">
      <div className="cs-container py-14 sm:py-20">
        <p className="cs-phase-number">
          {number ? `Phase ${number} · ` : ""}
          {label}
        </p>
        {/* The claim is the h2 so heading navigation announces the argument
            rather than the filing label. */}
        <h2 className="cs-phase-claim mt-4">{claim}</h2>
      </div>
    </div>
  );
}
