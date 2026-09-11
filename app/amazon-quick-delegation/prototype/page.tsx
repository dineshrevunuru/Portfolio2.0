import type { Metadata } from "next";
import PrototypeClient from "./PrototypeClient";

export const metadata: Metadata = {
  title: "Amazon Quick · Work within your agreement — Concept by Dinesh Revunuru",
  description:
    "An independent interactive concept for change-aware delegation. Simulated business data and actions; no live integrations.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PrototypeClient />;
}
