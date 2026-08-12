import Link from "next/link";

type SiteNavProps = {
  active?: "work" | "resume" | "case-study";
};

export default function SiteNav({ active }: SiteNavProps) {
  return (
    <nav className="top seq">
      <Link href="/" className="brand" aria-label="Home">
        Rd<b>.</b>
      </Link>
      <div className="links">
        <Link href="/#work" className={active === "work" ? "on" : undefined}>
          Work
        </Link>
        <Link href="/resume" className={active === "resume" ? "on" : undefined}>
          Resume
        </Link>
        {/* "Contact" used to sit here as a mailto:. A nav label that reads like a
            destination but fires the OS mail client is a broken promise — people
            expect contact details, not a half-composed email. The footer already
            carries the address, phone and socials, with the address itself as the
            link text, which sets the right expectation. */}
      </div>
    </nav>
  );
}
