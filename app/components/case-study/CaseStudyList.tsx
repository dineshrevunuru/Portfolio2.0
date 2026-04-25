import type { ReactNode } from "react";

type Props = {
  items: ReactNode[];
  ordered?: boolean;
};

export default function CaseStudyList({ items, ordered = false }: Props) {
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
