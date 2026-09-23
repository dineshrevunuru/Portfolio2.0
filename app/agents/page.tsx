/**
 * /agents — the dossier, dressed as the terminal it logically is.
 *
 * STATIC BY DECISION (Dinesh, 2026-08-24, after parallel.ai's agent page):
 * this is a document, not a toy. The interactive command line shipped first
 * and was cut the same week — a dossier you can play with invites playing,
 * and the page's one job is to be read, by crawlers above all. The only
 * control left is the red window button, which closes the "window" back to
 * /lorem.
 *
 * AI crawlers get every section as real server-side HTML with passage-level
 * figures and schema.org JSON-LD — the things the 2026 evidence says
 * generative engines actually lift. The content lives in dossier.ts and
 * mirrors /llms.txt, which stays for the agents that genuinely fetch it
 * (IDE agents, MCP tools — the citation bots mostly don't).
 */
import { pageMetadata } from "../seo";
import { jsonLd } from "./dossier";
import AgentsTerminal from "./AgentsTerminal";
import CloseButton from "./CloseButton";
import "./agents.css";

const SEO = {
  path: "/agents",
  title: "Dinesh Revunuru — verified facts for AI agents",
  description:
    "Verified facts on Dinesh Reddy Revunuru, a product designer in Chicago: $105→$40 cost per new customer, 40%→72% returning (80% target), and caveats.",
};

export const metadata = pageMetadata(SEO);

export default function AgentsPage() {
  return (
    <main className="agents-wrap">
      <script
        type="application/ld+json"
        // Serialised from typed data in dossier.ts — nothing user-generated
        // flows through here, so this is safe by construction.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      <AgentsTerminal closeControl={<CloseButton />} />
    </main>
  );
}
