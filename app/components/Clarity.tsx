import Script from "next/script";
import { IS_CANONICAL_HOST } from "../site";

/**
 * Microsoft Clarity — session recordings, heatmaps, and rage/dead-click
 * detection.
 *
 * Loaded as a plain external script rather than Clarity's inline IIFE snippet.
 * The snippet's only addition is a window.clarity command queue for calls made
 * before the CDN script arrives — and nothing in this repo calls
 * window.clarity() at all, so the queue was an untyped, unlintable string
 * buying nothing. A src-prop Script fetches the identical file with identical
 * afterInteractive timing in checked TSX, and removes the one injection seam
 * the inline form had (interpolating the id into markup). If a consent API or
 * custom tags are ever needed, that is the moment to bring the queue back.
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
    <Script
      src={`https://www.clarity.ms/tag/${PROJECT_ID}`}
      strategy="afterInteractive"
    />
  );
}
