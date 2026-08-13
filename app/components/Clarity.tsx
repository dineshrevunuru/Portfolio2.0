import Script from "next/script";
import { SITE_URL } from "../site";

/**
 * Microsoft Clarity — session recordings, heatmaps, and rage/dead-click
 * detection.
 *
 * Installed as the raw tag rather than the @microsoft/clarity npm package. The
 * package is a thin wrapper that injects this same script from the same CDN, so
 * the dependency buys a typed init() and nothing else. next/script with
 * afterInteractive is the part that actually matters: it holds the request until
 * after hydration, so the analytics tag can never delay first paint on a
 * portfolio whose argument is craft.
 *
 * Two gates, both of which must pass before anything loads.
 *
 * 1. NEXT_PUBLIC_CLARITY_PROJECT_ID must be set. Absent, this renders null —
 *    so a clone of the repo with no env file is silently un-tracked rather than
 *    throwing or, worse, posting to a garbage project id.
 *
 * 2. The origin must be the real domain. Keyed off SITE_URL exactly as robots.ts
 *    is, and for the same reason: a *.vercel.app preview is a full public copy
 *    of the site, and every preview visit and every `next start` on localhost
 *    would otherwise land in the same heatmap as real traffic. Dinesh reloading
 *    his own hero forty times while tuning it is precisely the signal that would
 *    make the numbers useless, and it is indistinguishable from a visitor after
 *    the fact.
 *
 * PRIVACY. Clarity masks the contents of every input box and dropdown in all
 * masking modes — that is not configurable, so what a visitor types into the HSS
 * demo (email, mobile, verification code) is never sent. The default Balanced
 * mode additionally masks numbers and email addresses wherever they appear.
 * What Balanced does NOT mask is an ordinary name in ordinary body text, and the
 * demo echoes the visitor's first name back into the transcript on confirmation.
 * That is why the transcript carries an explicit data-clarity-mask in
 * hss-demo/chat-client.tsx rather than relying on the dashboard setting: the
 * attribute lives with the markup and survives someone flipping the project to
 * Relaxed a year from now.
 * https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking
 */
const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const IS_CANONICAL_HOST = SITE_URL.includes("dineshrevunuru.com");

export default function Clarity() {
  if (!PROJECT_ID || !IS_CANONICAL_HOST) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", ${JSON.stringify(PROJECT_ID)});`}
    </Script>
  );
}
