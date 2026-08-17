/**
 * End-to-end logging setup, driven by a personal access token.
 *
 *   1. Put SUPABASE_ACCESS_TOKEN=sbp_... in .env.local  (Supabase → Account →
 *      Access Tokens → Generate new token)
 *   2. npm run setup:supabase
 *
 * Lists YOUR projects, picks or confirms the one to log into, fetches its
 * service key, verifies the table, writes .env.local, and reports what is
 * left. The alternative — npm run setup:logging — asks you to paste the two
 * values by hand and does the same verification.
 *
 * WHY A TOKEN AND NOT A LOGIN. The Supabase CLI on this machine is
 * authenticated to the Hair System Salons org — the CLIENT's account, whose
 * only project is theirs. Running a login flow to change that is not something
 * an assistant should do with someone's credentials. A token you generate and
 * revoke is the version of "give me access" that stays under your control.
 *
 * The client project is refused explicitly below. That is not paranoia: the
 * whole reason this file exists is that the two accounts were one dashboard
 * tab apart, and a portfolio's visitor log inside a client's production
 * database would be a real breach of that relationship.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const ENV = join(ROOT, ".env.local");
const CLIENT_REF = "zmwjgglooadlqdrvsmkn"; // Hair System Salons — never this one
const ok = (s) => console.log(`  \x1b[32m✓\x1b[0m ${s}`);
const bad = (s) => console.log(`  \x1b[31m✗\x1b[0m ${s}`);

function env(name) {
  if (process.env[name]) return process.env[name];
  if (!existsSync(ENV)) return "";
  const l = readFileSync(ENV, "utf8").split("\n").find((x) => x.startsWith(`${name}=`));
  return l ? l.slice(name.length + 1).trim() : "";
}

const TOKEN = env("SUPABASE_ACCESS_TOKEN");
if (!TOKEN) {
  console.log(`
  No SUPABASE_ACCESS_TOKEN found.

  Generate one at  https://supabase.com/dashboard/account/tokens
  (signed in as YOU, not the client), paste it into .env.local:

      SUPABASE_ACCESS_TOKEN=sbp_...

  then re-run:  npm run setup:supabase

  Revoke it in that same screen when this finishes — nothing needs it after.
  Prefer not to? \`npm run setup:logging\` takes the two values by hand instead.
`);
  process.exit(1);
}

const api = async (path) => {
  const r = await fetch(`https://api.supabase.com/v1${path}`, {
    headers: { authorization: `Bearer ${TOKEN}` },
  });
  if (!r.ok) throw new Error(`${path} → ${r.status} ${(await r.text()).slice(0, 140)}`);
  return r.json();
};

/* ── whose account is this? ────────────────────────────────────────────── */
let projects;
try {
  projects = await api("/projects");
} catch (e) {
  bad(`That token was rejected: ${e.message}`);
  bad("Generate a fresh one at https://supabase.com/dashboard/account/tokens");
  process.exit(1);
}

const mine = projects.filter((p) => p.id !== CLIENT_REF && p.ref !== CLIENT_REF);
const sawClient = projects.length !== mine.length;

console.log(`\n  ${projects.length} project(s) on this token${sawClient ? " (client project ignored)" : ""}:`);
for (const p of mine) console.log(`    · ${p.name}  [${p.id ?? p.ref}]  ${p.region ?? ""}`);

if (!mine.length) {
  bad("\n  This token only sees the client's account — it is the same login as the CLI.");
  bad("  Generate the token while signed in as YOU, then re-run.");
  process.exit(1);
}

/* Pick: an explicit ref on argv, else the only one, else ask for a choice. */
const wanted = process.argv[2];
let target = wanted ? mine.find((p) => (p.id ?? p.ref) === wanted || p.name === wanted) : null;
if (!target && mine.length === 1) target = mine[0];
if (!target) {
  console.log(`
  More than one project. Re-run naming the one to log into:

      npm run setup:supabase ${mine[0].id ?? mine[0].ref}
`);
  process.exit(1);
}

const ref = target.id ?? target.ref;
const url = `https://${ref}.supabase.co`;
ok(`Using ${target.name} [${ref}]`);

/* ── the service key ───────────────────────────────────────────────────── */
let key;
try {
  const keys = await api(`/projects/${ref}/api-keys`);
  key = keys.find((k) => k.name === "service_role")?.api_key;
} catch (e) {
  bad(`Could not read that project's keys: ${e.message}`);
  process.exit(1);
}
if (!key) {
  bad("No service_role key returned for that project.");
  process.exit(1);
}
ok("Fetched service_role key (never printed)");

/* ── the table, created if missing ─────────────────────────────────────── */
let probe = await fetch(`${url}/rest/v1/lorem_turns?select=id&limit=1`, {
  headers: { apikey: key, authorization: `Bearer ${key}` },
});

if (probe.status === 404) {
  console.log("  · table not there — creating it");
  const sql = readFileSync(join(ROOT, "scripts", "lorem-turns.sql"), "utf8");
  try {
    // The CLI carries the token in its own env, so it acts as YOU here.
    execFileSync("supabase", ["db", "query", "--project-ref", ref, sql], {
      env: { ...process.env, SUPABASE_ACCESS_TOKEN: TOKEN },
      stdio: "pipe",
    });
    ok("Created lorem_turns");
  } catch {
    bad("Could not create the table from here.");
    bad(`Paste scripts/lorem-turns.sql into ${url.replace(".supabase.co", "")} → SQL Editor, then re-run.`);
    process.exit(1);
  }
  probe = await fetch(`${url}/rest/v1/lorem_turns?select=id&limit=1`, {
    headers: { apikey: key, authorization: `Bearer ${key}` },
  });
}
if (!probe.ok) {
  bad(`Table check failed: ${probe.status} ${(await probe.text()).slice(0, 120)}`);
  process.exit(1);
}
ok("Table lorem_turns is reachable");

/* ── a real round trip, cleaned up after ───────────────────────────────── */
const tag = `setup-probe-${Date.now()}`;
const ins = await fetch(`${url}/rest/v1/lorem_turns`, {
  method: "POST",
  headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json" },
  body: JSON.stringify({
    session_id: tag, mode: "text", message: "setup check", say: "setup check",
    show: [], chips: [], model: "setup", ms: 0,
  }),
});
if (!ins.ok) {
  bad(`Write failed (${ins.status}) — nothing written to .env.local.`);
  process.exit(1);
}
await fetch(`${url}/rest/v1/lorem_turns?session_id=eq.${tag}`, {
  method: "DELETE",
  headers: { apikey: key, authorization: `Bearer ${key}` },
});
ok("Wrote a row and removed it — the round trip works");

/* ── only now, the repo ────────────────────────────────────────────────── */
let text = existsSync(ENV) ? readFileSync(ENV, "utf8") : "";
const set = (n, v) =>
  new RegExp(`^${n}=.*$`, "m").test(text)
    ? (text = text.replace(new RegExp(`^${n}=.*$`, "m"), `${n}=${v}`))
    : (text += `\n${n}=${v}\n`);
set("SUPABASE_URL", url);
set("SUPABASE_SERVICE_ROLE_KEY", key);
writeFileSync(ENV, text);
ok(".env.local updated (gitignored — the key never enters git)");

/* ── production, when Vercel is authenticated here ─────────────────────────
   Same two values into Vercel's Production scope, so REAL visitors' turns
   land in the table and not just local dev ones. Adding an env var is
   reversible and changes nothing live on its own — production only picks it
   up on the next build, which is why the redeploy is a separate, reported
   step and NOT `vercel --prod` (that uploads the working tree, the leak this
   project has already been bitten by). Skipped silently if Vercel is not
   linked/authed here — the printed steps below cover that case.            */
let prodWired = false;
try {
  execFileSync("npx", ["vercel", "whoami"], { stdio: "pipe" });
  for (const [name, value] of [
    ["SUPABASE_URL", url],
    ["SUPABASE_SERVICE_ROLE_KEY", key],
  ]) {
    // Remove-then-add so a re-run overwrites cleanly; both are quiet on a
    // first run where nothing exists yet.
    try {
      execFileSync("npx", ["vercel", "env", "rm", name, "production", "-y"], { stdio: "pipe" });
    } catch {
      /* not previously set — fine */
    }
    execFileSync("npx", ["vercel", "env", "add", name, "production"], {
      input: `${value}\n`,
      stdio: ["pipe", "pipe", "pipe"],
    });
  }
  prodWired = true;
  ok("Vercel Production env set (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)");
} catch {
  console.log("  · Vercel not wired from here — add the two vars in the dashboard, Production scope");
}

console.log(`
  \x1b[32mLocal logging is live.\x1b[0m Talk to Lorem on localhost:3000/lorem, then:

      npm run pull:conversations
${
  prodWired
    ? `
  Production has the vars but reads them at BUILD time, so it needs one
  redeploy to start logging real visitors. Safe redeploy (no working-tree
  upload — reruns the latest git commit):

      npx vercel redeploy $(npx vercel ls portfolio-2 2>/dev/null | grep -oE "https://[^ ]*vercel.app" | head -1)

  or just push any commit. Until it redeploys, production logs nothing.`
    : `
  For REAL visitors, add the two values to Vercel → Production, then redeploy.`
}

  \x1b[33mRevoke the access token now\x1b[0m — nothing here needs it again:
  https://supabase.com/dashboard/account/tokens
`);
