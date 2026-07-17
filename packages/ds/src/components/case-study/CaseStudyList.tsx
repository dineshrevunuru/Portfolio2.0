import type { ReactNode } from "react";

export type CaseStudyListProps = {
  items: ReactNode[];
  ordered?: boolean;
};

export default function CaseStudyList({
  items,
  ordered = false,
}: CaseStudyListProps) {
  const Tag = ordered ? "ol" : "ul";
  const variant = ordered ? "cs-list--ordered" : "cs-list--bulleted";
  return (
    <Tag className={`cs-list ${variant}`}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Tag>
  );
}
