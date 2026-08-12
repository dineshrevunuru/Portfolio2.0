import { SiteFooter } from "@portfolio/ds";

export const Default = () => (
  <SiteFooter
    name="Dinesh Revunuru"
    role="UI UX Designer"
    location="Chicago, IL USA"
    contactIntro="If you are thinking about hiring me or would like to discuss a project, get in touch with me at,"
    email="dineshrevunuru@gmail.com"
    phone="+1 (312) 838-4876"
    socials={[
      { label: "LinkedIn", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "Twitter", href: "#" },
    ]}
  />
);
