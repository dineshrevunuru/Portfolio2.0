"use client";
// Rendered client-only so ?state= deep links can seed the reducer from the URL
// without a server/client hydration mismatch.
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter", display: "swap" });

const DelegationWorkspace = dynamic(() => import("./DelegationWorkspace"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "100vh", background: "#fafafd" }} />,
});

export default function PrototypeClient() {
  return (
    <div className={inter.variable}>
      <DelegationWorkspace />
    </div>
  );
}
