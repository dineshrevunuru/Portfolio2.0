import { CaseStudyHero } from "@portfolio/ds";

export const WithEyebrow = () => (
  <div className="cs-theme-jira">
    <CaseStudyHero
      eyebrow="Case study"
      title={
        <>
          Rebuilding the B2B
          <br />
          booking flow
        </>
      }
      subtitle="Cutting a six-step form down to two, and lifting completion by 38%."
    />
  </div>
);

export const TitleOnly = () => (
  <CaseStudyHero title="The future of custom clothing made easy" />
);
