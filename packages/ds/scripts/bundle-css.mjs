// Post-tsup CSS step.
//  1. Compile the Tailwind entry (already run by the build script into
//     dist/.ds-tw.css) into the shipped stylesheet dist/ds.css, prepending
//     the remote font @import so it leads the file (imports must come first).
//  2. Mirror the raw source stylesheets into dist/styles/ for consumers who
//     want the granular files or the Tailwind bridge.
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  rmSync,
  existsSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src", "styles");
const dist = join(root, "dist");
const distStyles = join(dist, "styles");
const twOut = join(dist, ".ds-tw.css");

if (!existsSync(twOut)) {
  console.error("bundle-css: expected dist/.ds-tw.css (run the tailwind step first)");
  process.exit(1);
}

// Remote font @import must be the very first statement in the file.
const fontsImport = readFileSync(join(srcDir, "fonts.css"), "utf8").trim();
const compiled = readFileSync(twOut, "utf8");
writeFileSync(join(dist, "ds.css"), `${fontsImport}\n${compiled}`);
rmSync(twOut);

// Mirror raw source stylesheets (tokens, tailwind-theme bridge, etc.).
mkdirSync(distStyles, { recursive: true });
for (const file of readdirSync(srcDir)) {
  if (file.endsWith(".css")) {
    writeFileSync(join(distStyles, file), readFileSync(join(srcDir, file)));
  }
}

console.log("bundle-css: wrote dist/ds.css (tailwind-compiled) + dist/styles/");
