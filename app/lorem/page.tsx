import type { Metadata } from "next";
import LoremHome from "../components/lorem/LoremHome";

export const metadata: Metadata = {
  title: "Lorem — talk to Dinesh's best friend",
  description:
    "Lorem is Dinesh Revunuru's best friend and work buddy, on the door of his site. Say hi, talk about whatever you're into, and if you want to know about Dinesh or reach him, Lorem knows the way.",
};

export default function LoremPage() {
  return <LoremHome />;
}
