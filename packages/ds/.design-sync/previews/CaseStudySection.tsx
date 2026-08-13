import { CaseStudySection } from "@portfolio/ds";

export const Default = () => (
  <CaseStudySection heading="User research" subheading="Discovery">
    <p>
      Secondary research gave us a valuable starting point, but I wanted primary
      interviews to understand how freelancers actually work day to day.
    </p>
    <p>
      We spoke to <strong>12 journalists</strong> across staff and freelance
      roles, then synthesised the transcripts into themes.
    </p>
  </CaseStudySection>
);

export const PrototypeHeading = () => (
  <CaseStudySection heading="High-fidelity prototype" headingVariant="prototype">
    <p>The final flow, tested with eight users in moderated sessions.</p>
  </CaseStudySection>
);

export const Tight = () => (
  <CaseStudySection spacing="tight">
    <p>A tighter follow-on paragraph that sits close to the figure above it.</p>
  </CaseStudySection>
);
