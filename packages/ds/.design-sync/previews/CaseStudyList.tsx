import { CaseStudyList } from "@portfolio/ds";

export const Bulleted = () => (
  <CaseStudyList
    items={[
      "Online ethnography and forum analysis to understand user habits and challenges.",
      "Freelancer demographics to clearly define the target audience.",
      "Interviews and daily-routine accounts to surface non-billable work.",
    ]}
  />
);

export const Ordered = () => (
  <CaseStudyList
    ordered
    items={[
      "Empathise — user research and secondary analysis.",
      "Define — synthesise data into personas and problems.",
      "Ideate — brainstorm and prioritise solutions.",
      "Prototype & test — validate with real users.",
    ]}
  />
);
