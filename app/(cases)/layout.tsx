import { Inter } from "next/font/google";
import "./_shared/sketches.css";

// The Adani, AMN Healthcare and 3 Stripes case studies (2026-11-18) are the new site's pages, brought here
// as they are ahead of its launch. They carry their own page frame and styles (./_shared), so this group
// gives them the one wrapper those styles expect and nothing from the older case-study system (cs-*).
const text = Inter({ subsets: ["latin"], variable: "--font-sk" });

export default function CasesLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${text.variable} sk`}>{children}</div>;
}
