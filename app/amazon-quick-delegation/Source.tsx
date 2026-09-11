"use client";
import styles from "./quick-case-study.module.css";
export default function Source({ n }: { n: number }) {
  return (
    <a
      className={styles.sourceRef}
      href={`#source-${n}`}
      aria-label={`Source ${n}`}
      onClick={() => {
        const d = document.getElementById("sources-details") as HTMLDetailsElement | null;
        if (d) d.open = true;
        const t = document.getElementById(`source-${n}`);
        requestAnimationFrame(() => t?.scrollIntoView({ block: "center" }));
      }}
    >
      [{n}]
    </a>
  );
}
