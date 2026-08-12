import type { ReactNode } from "react";

export type NavLink = {
  /** Stable identity used to match `active`. */
  key: string;
  label: string;
  href: string;
};

export type SiteNavProps = {
  /** Brand mark shown at the left. Defaults to the "Rd." wordmark. */
  logo?: ReactNode;
  /** Nav links at the right. Defaults to Work · Resume. */
  links?: NavLink[];
  /** `key` of the active link. */
  active?: string;
};

// "Contact" was removed 2026-08-07: as a mailto: it fired the OS mail client
// when the label promised contact details. The footer carries that instead,
// with the address itself as the link text.
const DEFAULT_LINKS: NavLink[] = [
  { key: "work", label: "Work", href: "/#work" },
  { key: "resume", label: "Resume", href: "/resume" },
];

/**
 * Framework-agnostic mirror of the app nav (design-sync source). The app ships
 * its own `next/link` variant in `app/components/SiteNav.tsx`; this plain-anchor
 * version keeps the design-tool copy in step with the current chrome.
 */
export default function SiteNav({
  logo,
  links = DEFAULT_LINKS,
  active,
}: SiteNavProps) {
  return (
    <nav className="top">
      <a className="brand" href="/" aria-label="Home">
        {logo ?? (
          <>
            Rd<b>.</b>
          </>
        )}
      </a>
      <div className="links">
        {links.map((link) => (
          <a
            key={link.key}
            href={link.href}
            className={link.key === active ? "on" : undefined}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
