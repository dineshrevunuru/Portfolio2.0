import type { ReactNode } from "react";

type Props = {
  label?: string;
  children: ReactNode;
};

export default function CaseStudyCallout({ label, children }: Props) {
  return (
    <div className="cs-container mt-6 sm:mt-8">
      <div className="cs-callout">
        {label && <p className="cs-callout-label">{label}</p>}
        <div className="cs-callout-body">{children}</div>
      </div>
    </div>
  );
}
