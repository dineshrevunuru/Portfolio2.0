import Script from "next/script";
import { IS_CANONICAL_HOST } from "../site";

/**
 * Microsoft Clarity — session recordings, heatmaps, and rage/dead-click
 * detection.
 *
 * ⚠ THE INLINE SNIPPET IS LOAD-BEARING. DO NOT REPLACE IT WITH <Script src>.
 *
 * It looks like boilerplate whose only job is queueing window.clarity() calls
 * until the CDN script lands, and since nothing in this repo ever calls
 * window.clarity(), it reads as removable. It was removed on exactly that
 * reasoning and it broke Clarity in production, silently: tag present in the
 * HTML, network request fine, zero data collected.
 *
 * The queue is not for our code. It is for Clarity's own tag file, whose first
 * executable statement is a[c]("metadata", ...) — that is window.clarity(...).
 * The stub below is what defines it. Without it the fetched tag throws
 * `TypeError: a[c] is not a function` on its first line and never initializes.
 *
 * Verify after any change here by loading the site and checking that
 * window.clarity is a function and a _clck cookie is set. "The script tag is in
 * the HTML" proves nothing; that was true the whole time it was broken.
 *
 * Three gates, all of which must pass before anything loads.
 *
 * 1. NEXT_PUBLIC_CLARITY_PROJECT_ID must be set. Absent, this renders null —
 *    so a clone of the repo with no env file is silently un-tracked rather than
 *    throwing or, worse, posting to a garbage project id.
 *
 * 2. The id must look like a Clarity project id (short alphanumeric token).
 *    The id becomes part of a URL in served HTML; a malformed value from a
 *    mis-templated env file should fail to nothing, not ship.
 *
 * 3. IS_CANONICAL_HOST — the shared predicate from site.ts, which fails closed:
 *    previews and localhost identify as themselves and refuse the tag, so
 *    Dinesh reloading his own hero forty times while tuning it can never land
 *    in the same heatmap as a real visitor.
 *
 * PRIVACY. Clarity masks the contents of every input box and dropdown in all
 * masking modes — that is not configurable, so what a visitor types into the
 * HSS demo (email, mobile, verification code) is never sent. The default
 * Balanced mode additionally masks numbers and email addresses wherever they
 * appear. What Balanced does NOT mask is ordinary text a page echoes back —
 * a first name in a chat bubble, spoken words in a live caption. Every surface
 * that renders visitor-supplied text therefore carries an explicit
 * data-clarity-mask in its own markup (the HSS demo transcript in
 * hss-demo/chat-client.tsx; the Lorem caption, question echo, greeting, and
 * transcript in components/lorem/) rather than relying on a dashboard setting:
 * the attribute lives with the markup and survives someone flipping the
 * project to Relaxed a year from now.
 * https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking
 */
const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const ID_SHAPE = /^[a-z0-9]{6,16}$/i;

export default function Clarity() {
  if (!PROJECT_ID || !ID_SHAPE.test(PROJECT_ID) || !IS_CANONICAL_HOST) {
    return null;
  }

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
