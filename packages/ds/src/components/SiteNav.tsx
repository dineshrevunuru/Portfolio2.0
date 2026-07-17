import type { ReactNode } from "react";

export type NavLink = {
  /** Stable identity used to match `active`. */
  key: string;
  label: string;
  href: string;
};

export type SiteNavProps = {
  /** Brand mark shown at the left. Defaults to a text wordmark. */
  logo?: ReactNode;
  /** Nav links at the right. Defaults to Home + Resume. */
  links?: NavLink[];
  /** `key` of the active link. */
  active?: string;
  /** Color of the active link. */
  activeColor?: string;
  /** Color of inactive links. */
  inactiveColor?: string;
};

const DEFAULT_LINKS: NavLink[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "resume", label: "Resume", href: "/resume" },
];

export default function SiteNav({
  logo,
  links = DEFAULT_LINKS,
  active,
  activeColor = "var(--color-footer-blue)",
  inactiveColor = "var(--color-ink)",
}: SiteNavProps) {
  return (
    <nav className="pad-nav mx-auto flex w-full max-w-[1440px] items-center justify-between py-6">
      <a href="/" aria-label="Home" className="flex items-center">
        {logo ?? (
          <span
            className="t-footer-brand"
            style={{ fontSize: 32, color: "var(--color-ink)" }}
          >
            Rd<span style={{ color: "var(--color-accent)" }}>.</span>
          </span>
        )}
      </a>
      <div className="flex items-center text-[16px] font-normal">
        {links.map((link) => (
          <a
            key={link.key}
            href={link.href}
            className="px-[15px] hover:opacity-70"
            style={{ color: link.key === active ? activeColor : inactiveColor }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
