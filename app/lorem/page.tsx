import type { Metadata } from "next";
import LoremHome from "../components/lorem/LoremHome";

export const metadata: Metadata = {
  title: "Lorem — Dinesh's voice portfolio",
  description:
    "A portfolio you talk to. Lorem answers out loud and draws the parts you can't hold in your head. Ask it about the work, the numbers, or how it was built.",
};

export default function LoremPage() {
  return <LoremHome />;
}
