import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./components/lorem/lorem.css";
import SeqReveal from "./components/SeqReveal";
import ScrollProgressPill from "./components/case-study/ScrollProgressPill";

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

export const metadata: Metadata = {
  title: "Dinesh Revunuru — AI Product Designer",
  description:
    "Portfolio of Dinesh Revunuru, AI Product Designer. HCI grad student at DePaul; earlier Generative A.I at Neudesic (an IBM Company).",
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
      </body>
    </html>
  );
}
