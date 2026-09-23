import { pageMetadata } from "../seo";
import LoremHome from "../components/lorem/LoremHome";

const SEO = {
  path: "/lorem",
  title: "Lorem — talk to Dinesh Revunuru's AI best friend",
  description:
    "Talk to Lorem, the AI voice agent Dinesh Revunuru designed and built for his site. Ask about his work, or just say hi.",
};

export const metadata = pageMetadata(SEO);

export default function LoremPage() {
  return <LoremHome />;
}
