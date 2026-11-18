import { Inter } from "next/font/google";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import "./_shared/sketches.css";
import "./_shared/chrome.css";

// The Adani, AMN Healthcare and 3 Stripes case studies (2026-11-18) are the new site's pages, brought here
// as they are ahead of its launch. They carry their own page frame and styles (./_shared), so this group
// gives them the one wrapper those styles expect and nothing from the older case-study system (cs-*).
// The site's own nav and footer sit outside that wrapper, so they keep the site's fonts and look exactly
// as on every other page ("Update header and footer of these sites as per the current site").
const text = Inter({ subsets: ["latin"], variable: "--font-sk" });

export default function CasesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cases-chrome">
      <SiteNav active="case-study" />
      <div className={`${text.variable} sk`}>{children}</div>
      <SiteFooter />
    </div>
  );
}
