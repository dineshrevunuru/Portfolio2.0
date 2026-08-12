import { ImageResponse } from "next/og";

/**
 * The link preview card, generated rather than designed as a flat asset.
 *
 * Next discovers this by filename and wires it into both the Open Graph and
 * Twitter tags automatically, so no metadata block has to name a path. It also
 * fingerprints the URL, which means a change here invalidates the copies
 * Slack, LinkedIn and X have cached, where a static /og.png at a fixed path can
 * stay stale for weeks.
 *
 * Generated, not hand-drawn, for one reason worth keeping: the card is
 * assembled from the same strings as the page, so it cannot say something the
 * site no longer says. A PNG exported once always eventually lies.
 *
 * Constraints of the renderer: this is Satori, not a browser. Flexbox only, no
 * CSS grid, and every element with more than one child needs an explicit
 * `display: flex`.
 *
 * ⚠ The `fontFamily: Georgia, serif` declarations below do NOT take effect.
 * Satori resolves nothing from the host system: a font must be fetched and
 * handed to ImageResponse in `fonts`, and none is. Verified by rendering the
 * card and looking at it, so the whole thing sets in the default sans.
 *
 * Left that way on purpose for now. Matching the site's Playfair wordmark means
 * fetching a .ttf at build time, and a network call inside the build is a bad
 * trade the week of a deploy: if Google Fonts is slow or blocked, the build
 * fails rather than the card looking slightly off-brand. The declarations stay
 * so the intent is legible when someone wires the font properly.
 */

export const alt = "Dinesh Revunuru, AI Product Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "80px",
        }}
      >
        {/* The wordmark, matching the site nav. The dot is the one brand accent
            on the site and it is the only colour on this card. */}
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 44, fontWeight: 700 }}>
          <span style={{ fontFamily: "Georgia, serif", color: "#101010" }}>Rd</span>
          <span style={{ fontFamily: "Georgia, serif", color: "#e5484d" }}>.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "-2px",
              color: "#101010",
              fontFamily: "Georgia, serif",
            }}
          >
            Dinesh Revunuru
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 38,
              fontWeight: 500,
              color: "#5b5b5b",
            }}
          >
            AI Product Designer
          </div>
          {/* The claim, not a tagline. This is the one line the whole portfolio
              argues, so it is the one line worth putting on the card. */}
          <div
            style={{
              display: "flex",
              marginTop: 34,
              fontSize: 30,
              lineHeight: 1.4,
              color: "#3d3d3d",
              maxWidth: 900,
            }}
          >
            I find the problem, then use AI to research, design, and build it.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
