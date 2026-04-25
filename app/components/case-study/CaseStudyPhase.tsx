type Props = {
  label: string;
  number?: string;
};

export default function CaseStudyPhase({ label, number }: Props) {
  return (
    <div className="w-full cs-phase-wrapper">
      <div className="cs-container py-10 sm:py-12 text-center">
        {number && <p className="cs-phase-number">Phase {number}</p>}
        <h2 className="cs-phase-label">{label}</h2>
      </div>
    </div>
  );
}
