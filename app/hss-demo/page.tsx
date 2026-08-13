import { ChatClient } from "./chat-client";
import { DemoNotice } from "./demo-notice";

export const metadata = {
  title: "Tara — sandbox demo",
  // A sandbox of a client's product should never be indexed as the product.
  robots: { index: false, follow: false },
};

/**
 * Standalone sandbox page, embedded by the case study in an iframe.
 *
 * The iframe is not laziness — the widget was BUILT to run in one (it
 * postMessages `hss:ready` / `hss:close` to its parent), so hosting it this way
 * is how the real thing works, and it gives complete style isolation from the
 * portfolio's own CSS for free.
 */
export default function HssDemoPage() {
  return (
    <>
      <ChatClient />
      <DemoNotice />
    </>
  );
}
