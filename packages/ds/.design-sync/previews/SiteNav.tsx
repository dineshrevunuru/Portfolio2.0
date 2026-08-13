import { SiteNav } from "@portfolio/ds";

export const HomeActive = () => <SiteNav active="home" />;

export const ResumeActive = () => <SiteNav active="resume" />;

export const CustomLinks = () => (
  <SiteNav
    active="work"
    links={[
      { key: "work", label: "Work", href: "/" },
      { key: "about", label: "About", href: "/about" },
      { key: "contact", label: "Contact", href: "/contact" },
    ]}
  />
);
