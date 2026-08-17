/**
 * Wire conversation logging to Supabase, with every check done for you.
 *
 *   npm run setup:logging
 *
 * Asks for two values from YOUR Supabase project (Settings → API), then does
 * the rest: verifies the key actually reaches the project, verifies the table
 * exists and is the right shape, writes .env.local, and tells you exactly what
 * is left. Nothing is written until every check passes, so a wrong paste
 * leaves the repo untouched.
 *
 * WHY THIS EXISTS rather than "paste them into .env.local yourself": this
 * project already burned three rounds on whose Supabase account is whose — the
 * CLI here is authenticated to the CLIENT's org, and the anon key looks exactly
 * like the service key to the naked eye while silently logging nothing (the
 * table's RLS has no policies). Both mistakes are invisible until you wonder
 * weeks later why the table is empty. This catches both in about four seconds.
 *
 * The key is read from a hidden prompt and never echoed, never logged, and
 * never leaves this machine except to Supabase itself.
 */
import { createInterface } from "node:readline";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ENV = join(process.cwd(), ".env.local");
const ok = (s) => console.log(`  \x1b[32m✓\x1b[0m ${s}`);
const bad = (s) => console.log(`  \x1b[31m✗\x1b[0m ${s}`);

function ask(question, { hidden = false } = {}) {
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  return new Promise((resolve) => {
    if (!hidden) return rl.question(question, (a) => (rl.close(), resolve(a.trim())));
    // Hidden input: mute the echo while the secret is typed.
    process.stdout.write(question);
    const onData = (ch) => {
      if (["\n", "\r", ""].includes(ch.toString())) process.stdin.removeListener("data", onData);
      else process.stdout.write("*");
    };
    process.stdin.on("data", onData);
    rl.question("", (a) => {
      process.stdout.write("\n");
      rl.close();
      resolve(a.trim());
    });
  });
}

console.log("\n  Conversation logging → Supabase");
console.log("  Both values are in your project: Settings → API.\n");

let url = await ask("  Project URL (https://xxxx.supabase.co): ");
const key = await ask("  service_role key (hidden): ", { hidden: true });

url = url.replace(/\/+$/, "");
console.log("");

/* ── check 1: shape ────────────────────────────────────────────────────── */
if (!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url)) {
  bad(`That URL doesn't look like a Supabase project URL: ${url}`);
  process.exit(1);
}
const ref = url.match(/^https:\/\/([a-z0-9]+)\./)[1];
ok(`Project ref ${ref}`);

if (ref === "zmwjgglooadlqdrvsmkn") {
  bad("That is the Hair System Salons CLIENT project. Portfolio conversations");
  bad("must not go into a client's production database. Nothing written.");
  process.exit(1);
}
ok("Not the client project");

/* ── check 2: is this the service key, or the anon key? ────────────────── */
// A Supabase key is a JWT; its payload names the role. The anon key would be
// accepted by PostgREST and then see nothing, because the table's RLS has no
// policies — logging would appear configured and silently write nothing.
try {
  const payload = JSON.parse(Buffer.from(key.split(".")[1], "base64").toString());
  if (payload.role !== "service_role") {
    bad(`That is the "${payload.role}" key, not service_role.`);
    bad("The table's RLS has no policies, so that key would write nothing at all.");
    bad("Settings → API → service_role (click Reveal). Nothing written.");
    process.exit(1);
  }
  ok("Key is service_role");
  if (payload.ref && payload.ref !== ref) {
    bad(`Key belongs to project ${payload.ref}, but the URL is ${ref}. Nothing written.`);
    process.exit(1);
  }
} catch {
  bad("Could not read that key — is it the full value? Nothing written.");
  process.exit(1);
}

/* ── check 3: does it actually reach the table? ────────────────────────── */
const res = await fetch(`${url}/rest/v1/lorem_turns?select=id&limit=1`, {
  headers: { apikey: key, authorization: `Bearer ${key}` },
}).catch(() => null);

if (!res) {
  bad("Could not reach that project at all. Nothing written.");
  process.exit(1);
}
if (res.status === 404) {
  bad("Reached the project, but the lorem_turns table isn't there.");
  bad("Run scripts/lorem-turns.sql in that project's SQL editor, then re-run this.");
  process.exit(1);
}
if (!res.ok) {
  bad(`Project answered ${res.status}: ${(await res.text()).slice(0, 120)}`);
  process.exit(1);
}
ok("Table lorem_turns is reachable and writable");

/* ── check 4: a real round trip, then clean up after itself ────────────── */
const probe = `setup-probe-${Date.now()}`;
const ins = await fetch(`${url}/rest/v1/lorem_turns`, {
  method: "POST",
  headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json" },
  body: JSON.stringify({
    session_id: probe,
    mode: "text",
    message: "setup check",
    say: "setup check",
    show: [],
    chips: [],
    model: "setup",
    ms: 0,
  }),
});
if (!ins.ok) {
  bad(`Write failed (${ins.status}). Nothing written to .env.local.`);
  process.exit(1);
}
await fetch(`${url}/rest/v1/lorem_turns?session_id=eq.${probe}`, {
  method: "DELETE",
  headers: { apikey: key, authorization: `Bearer ${key}` },
});
ok("Wrote a test row and removed it — the round trip works");

/* ── only now, touch the repo ──────────────────────────────────────────── */
let env = existsSync(ENV) ? readFileSync(ENV, "utf8") : "";
const set = (name, value) =>
  new RegExp(`^${name}=.*$`, "m").test(env)
    ? (env = env.replace(new RegExp(`^${name}=.*$`, "m"), `${name}=${value}`))
    : (env += `\n${name}=${value}\n`);
set("SUPABASE_URL", url);
set("SUPABASE_SERVICE_ROLE_KEY", key);
writeFileSync(ENV, env);
ok(".env.local updated (gitignored — the key never enters git)");

console.log(`
  Local logging is live. Talk to Lorem on localhost:3000/lorem, then:

      npm run pull:conversations

  For REAL visitors, production needs the same two values:

      npx vercel env add SUPABASE_URL production
      npx vercel env add SUPABASE_SERVICE_ROLE_KEY production

  then redeploy so they bind. Until that, production logs nothing and
  Lorem is completely unaffected.
`);
