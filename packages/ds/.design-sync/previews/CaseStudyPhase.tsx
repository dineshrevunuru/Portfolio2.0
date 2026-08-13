import { CaseStudyPhase } from "@portfolio/ds";

export const WithNumber = () => (
  <div className="cs-theme-uniquefit">
    <CaseStudyPhase number="01" label="Empathise" />
  </div>
);

export const LabelOnly = () => <CaseStudyPhase label="Prototype & Testing" />;
