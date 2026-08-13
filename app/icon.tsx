import { ImageResponse } from "next/og";

/**
 * The browser-tab icon.
 *
 * Replaces app/favicon.ico, which was still the black-circle-and-triangle mark
 * that ships with create-next-app. That is Vercel's logo: every tab, bookmark
 * and phone home-screen shortcut was advertising the host rather than the site.
 *
 * Generated from the same two brand tokens the nav uses (--color-ink #202020,
 * --color-accent #e45684) so the tab matches the wordmark in the header.
 *
 * Design decisions specific to this size, which is not a small logo but a
 * different problem:
 *
 * - "Rd" not "Rd." — the full wordmark's period is a separate glyph with its
 *   own sidebearing, and at 32px it either collides with the d or vanishes.
 *   The accent survives instead as the dot below, which is the same idea with
 *   enough room to actually render.
 * - Dark tile rather than the site's white ground. A white icon disappears
 *   into a light tab strip; a dark tile holds its shape on light and dark
 *   browser chrome alike, which is the one thing a favicon has to do.
 * - Rendered at 64px and downscaled by the browser. Authoring at 32 leaves the
 *   letterforms coarse on a retina tab.
 *
 * Font note, same as opengraph-image: Satori resolves nothing from the host
 * system, so this sets in its default sans rather than the site's Playfair.
 * That is fine here and would not be on a larger surface — at 32px serifs are
 * below the resolution that can carry them, and the sans is marginally more
 * legible. Wiring Playfair in would mean a build-time font fetch for a
 * difference no one can see.
 */

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#202020",
          borderRadius: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 38,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-1px",
            lineHeight: 1,
          }}
        >
          Rd
        </div>
        {/* The accent, carried as a mark rather than a period. */}
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: 7,
            backgroundColor: "#e45684",
            marginTop: 4,
          }}
        />
      </div>
    ),
    size,
  );
}
