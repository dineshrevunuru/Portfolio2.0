export type MetaField = {
  label: string;
  value: string;
};

export type CaseStudyMetaProps = {
  fields: MetaField[];
};

export default function CaseStudyMeta({ fields }: CaseStudyMetaProps) {
  return (
    <section className="cs-container pb-12 sm:pb-16">
      <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {fields.map((f) => (
          <div key={f.label}>
            <dt className="cs-meta-label">{f.label}</dt>
            <dd className="cs-meta-value">{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
