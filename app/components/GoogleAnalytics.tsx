import Script from "next/script";
import { IS_CANONICAL_HOST } from "../site";

/**
 * Google Analytics 4 (gtag.js).
 *
 * WHY THIS EXISTS. The old WordPress site tracked GA through the Site Kit
 * plugin. The WordPress -> Next.js rebuild ported Clarity but not this, so GA
 * property 472514405 went dark at the cutover — Clarity saw 371 sessions while
 * GA read a flat zero. Google's own stream page said it plainly: "Data
 * collection isn't active for your website." This is the tag that was missing.
 *
 * MIRRORS Clarity.tsx by design — same IS_CANONICAL_HOST gate, same
 * next/script approach, no new dependency (@next/third-parties would be one
 * for a nine-line snippet). Read that file's header for the gate reasoning.
 *
 * ONE DELIBERATE DIFFERENCE: the id is hardcoded with an env override, where
 * Clarity's is pure env var. A GA Measurement ID is not a secret — it ships in
 * the HTML of every page that loads gtag, visible to anyone viewing source —
 * so there is nothing to protect by enving it. And pure-env-var is exactly the
 * failure being fixed here: if the Vercel var were ever unset, the tag would
 * silently vanish again, which is how weeks of data were already lost. A
 * hardcoded default cannot go dark by omission; NEXT_PUBLIC_GA_ID still wins
 * when set, for a staging property or a future id change.
 *
 * TWO SCRIPTS, in order. The external loader defines gtag.js; the inline block
 * defines the dataLayer queue and calls config. gtag is resilient to load
 * order (dataLayer is a plain array it drains), but the canonical Google order
 * is loader first, so that is what ships.
 *
 * PRIVACY posture matches Clarity: no consent banner, consistent with the
 * existing decision for this personal site. GA4 does not capture typed input;
 * enhanced measurement (page_view, scroll, outbound click) is configured in
 * the GA property, not here.
 *
 * VERIFY after any change on the LIVE domain only — the gate renders null on
 * localhost and previews, so "it builds" proves nothing. Load dineshrevunuru.com
 * and confirm a request to googletagmanager.com/gtag/js?id=G-... fires and GA
 * Realtime shows the hit.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-56D3TFK3YC";
const ID_SHAPE = /^G-[A-Z0-9]{6,12}$/i;

export default function GoogleAnalytics() {
  if (!GA_ID || !ID_SHAPE.test(GA_ID) || !IS_CANONICAL_HOST) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(GA_ID)});`}
      </Script>
    </>
  );
}
