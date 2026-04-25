import Image from "next/image";
import Link from "next/link";

type SiteNavProps = {
  active: "home" | "resume" | "case-study";
};

export default function SiteNav({ active }: SiteNavProps) {
  const homeColor =
    active === "home"
      ? "var(--color-footer-blue)"
      : "var(--color-ink)";
  const resumeColor =
    active === "resume"
      ? "var(--color-footer-blue)"
      : "var(--color-ink)";

  return (
    <nav className="pad-nav mx-auto flex w-full max-w-[1440px] items-center justify-between py-6">
      <Link href="/" aria-label="Home" className="flex items-center">
        <Image
          src="/hero/rd-logo.png"
          alt="Dinesh Revunuru"
          width={103}
          height={52}
          priority
          className="h-[30px] w-auto sm:h-[39px]"
        />
      </Link>
      <div className="flex items-center text-[16px] font-normal">
        <Link
          href="/"
          className="px-[15px] hover:opacity-70"
          style={{ color: homeColor }}
        >
          Home
        </Link>
        <Link
          href="/resume"
          className="px-[15px] hover:opacity-70"
          style={{ color: resumeColor }}
        >
          Resume
        </Link>
      </div>
    </nav>
  );
}
