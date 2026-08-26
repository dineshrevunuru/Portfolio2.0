import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./components/lorem/lorem.css";
import SeqReveal from "./components/SeqReveal";
import ScrollProgressPill from "./components/case-study/ScrollProgressPill";
import Clarity from "./components/Clarity";
import { SITE_URL } from "./site";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const TITLE = "Dinesh Revunuru — Senior Product Designer";
const DESCRIPTION =
  "Portfolio of Dinesh Revunuru, Senior Product Designer. HCI grad student at DePaul; earlier Generative A.I at Neudesic (an IBM Company).";

export const metadata: Metadata = {
  /* metadataBase is what makes a relative og:image resolve to an absolute URL.
     Without it Next emits the relative path, every scraper fails to fetch it,
     and links render as a grey box with no preview. It is the single most
     common reason a well-built site previews badly. */
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  /* Per-page metadata overrides title and description but inherits everything
     below, so each case study gets a correct card without repeating the OG
     block five times. */
  openGraph: {
    type: "website",
    siteName: "Dinesh Revunuru",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    /* No `images` key here on purpose. app/opengraph-image.tsx is a Next file
       convention: it is discovered automatically, injected into both the OG and
       Twitter tags, and given a hashed URL. Listing an image here would override
       that and pin a path by hand. */
  },
  twitter: {
    /* summary_large_image is the wide card. Without it a link posted to X or
       LinkedIn renders the thumbnail at postage-stamp size beside the title. */
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        {children}
        <SeqReveal />
        {/* Self-scoping: renders null unless the page has a cs-theme-* wrapper,
            so all four case studies get it without each page mounting it. */}
        <ScrollProgressPill />
        {/* Also self-scoping: renders null off the real domain or with no
            project id, so previews and localhost stay out of the heatmaps. */}
        <Clarity />
      </body>
    </html>
  );
}
