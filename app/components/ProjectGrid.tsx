import Image from "next/image";
import Link from "next/link";
import { visibleProjects } from "../projects";

export function WArrow() {
  return (
    <span className="warrow" aria-hidden="true">
      &rarr;
    </span>
  );
}

/** The shipped case-study cards. Rendered on the homepage and on /work. */
export default function ProjectGrid() {
  return (
        <div
          className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10"
          data-seq-group
        >
          {visibleProjects.map((p) => (
            <article key={p.slug} className={`project-card card-${p.slug} group relative`}>
              {p.logo && (
                <div className="mb-6 flex h-[40px] items-center">
                  <Image
                    src={p.logo}
                    alt={p.logoAlt ?? ""}
                    width={200}
                    height={40}
                    loading="eager"
                    unoptimized
                    className="h-[38px] w-auto object-contain"
                  />
                </div>
              )}

              <h4 className="t-serif-title whitespace-pre-line">{p.title}</h4>
              <p className="mt-5 t-body">{p.description}</p>
              <Link
                href={p.href}
                aria-label={
                  p.cta === "case-study"
                    ? `View ${p.title.replace(/\n/g, " ")} case study`
                    : undefined
                }
                className={`group mt-5 inline-flex items-center t-cta${
                  p.cta === "case-study"
                    ? " after:absolute after:inset-0 after:z-[1] after:content-['']"
                    : ""
                }`}
              >
                {p.cta === "password"
                  ? "Updating (Required Password)"
                  : "View case study"}
                <WArrow />
              </Link>

              <div className={`thumb thumb-${p.thumbVariant} mt-8`}>
                <Image
                  src={p.thumb}
                  alt={p.title}
                  width={p.thumbW}
                  height={p.thumbH}
                  sizes="(min-width: 1024px) 508px, (min-width: 640px) 60vw, 90vw"
                  loading="eager"
                  unoptimized={p.unoptimized}
                  className="block h-auto w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </article>
          ))}
        </div>
  );
}
