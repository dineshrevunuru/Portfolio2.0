/**
 * Compiles the pieces the tests need to plain ESM under .test-build.
 *
 * tsc emits the extensionless relative imports it was given, which Node's ESM
 * loader rejects — the rewrite below adds the `.js` back.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = ".test-build";

export function build() {
  rmSync(OUT, { recursive: true, force: true });

  execFileSync(
    "npx",
    [
      "tsc",
      "app/components/lorem/guardrail.ts",
      "app/components/lorem/closing.ts",
      "app/components/lorem/greeting.ts",
      "app/components/lorem/prerendered.generated.ts",
      "app/components/lorem/protocol.ts",
      "app/api/lorem/prompt.ts",
      "app/site.ts",
      "--outDir", OUT,
      "--rootDir", "app",
      "--module", "esnext",
      "--target", "es2022",
      "--moduleResolution", "bundler",
      "--skipLibCheck",
      "--strict",
    ],
    { stdio: "inherit" },
  );

  // The repo's package.json has no "type", so Node reparses each emitted file as
  // CJS first and warns. A local marker keeps the run quiet.
  writeFileSync(join(OUT, "package.json"), '{"type":"module"}\n');

  for (const file of walk(OUT)) {
    if (!file.endsWith(".js")) continue;
    const src = readFileSync(file, "utf8");
    const fixed = src.replace(/(from\s+"\.\.?\/[^"]+?)"/g, (m, p) => (p.endsWith(".js") ? m : `${p}.js"`));
    if (fixed !== src) writeFileSync(file, fixed);
  }
}

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

// Compare decoded paths, not the raw URL — this repo lives under a directory
// with spaces, and import.meta.url percent-encodes them. The naive
// `file://${argv[1]}` form silently never matches, so the build no-ops and the
// tests run against whatever stale output happened to be lying around.
if (fileURLToPath(import.meta.url) === process.argv[1]) build();
