import { ImageResponse } from "next/og";

/**
 * The iOS home-screen icon, for when someone saves the site to their phone.
 *
 * Separate from icon.tsx because Apple's tile is a different object: 180x180,
 * masked to a rounded square by the OS, and displayed at roughly six times the
 * size of a browser tab. Serving the 64px favicon here would upscale into a
 * blurred tile.
 *
 * Two differences from icon.tsx that follow from the size, not from taste:
 *
 * - No borderRadius. iOS applies its own corner mask, and a radius baked into
 *   the image shows up as a lighter halo inside Apple's curve.
 * - The full "Rd." wordmark. At 180px the accent has room to set beside the
 *   letters rather than below them, as it does in the header.
 *
 * The accent is drawn as a circle, not typed as a period. The default sans
 * renders "." as a square, which looked like a deliberate but different mark
 * next to the round dot in the site header and in icon.tsx. Drawing it keeps
 * all three consistent and removes the dependency on whatever glyph the
 * fallback font happens to supply.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#202020",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-3px",
              lineHeight: 1,
            }}
          >
            Rd
          </div>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 16,
              backgroundColor: "#e45684",
              marginLeft: 6,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
