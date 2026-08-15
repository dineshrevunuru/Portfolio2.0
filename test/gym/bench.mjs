/**
 * The review bench: read every simulated conversation and grade it, turn by
 * turn, in Dinesh's own words.
 *
 * WHY THIS IS NOT A ROUTE IN THE APP. It would have been less code to add
 * /gym to Next and gate it on NODE_ENV. This repo has already published files
 * it did not mean to, and a dev-only page is one careless env var away from
 * being a public page that exposes prompt internals and unreleased copy. A
 * separate local server has no production surface to get wrong.
 *
 * WHY IT EXISTS AT ALL. simulate.mjs already runs the conversations, applies
 * regex checks, and asks a model to grade them. What it cannot do is tell us
 * whether a turn sounded like Dinesh. An AI judge scoring "naturalness 3" is a
 * number with no taste behind it; the thing that actually moves this agent is a
 * human saying "this line is the problem, here is why". That is what gets
 * captured here and distilled into prompt changes by distill.mjs.
 *
 *   node test/gym-server.mjs        then open http://localhost:4321
 *
 * Feedback is keyed by a hash of the turn text, not its position, so re-running
 * the simulation does not silently reattach yesterday's note to a different
 * sentence. A note whose text has changed is kept and marked stale, which is
 * how you see whether a complaint was actually addressed.
 */
import { createServer } from "node:http";
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const ROOT = process.cwd();
const RUNS = join(ROOT, "test", "gym", "runs");
const PORT = 4321;

// Which run to grade: the newest unless one is named. Feedback is stored INSIDE
// the run directory, because a note is about a specific conversation on a
// specific day. Detached from its run it becomes an opinion about nothing.
const runId =
  process.argv[2] ??
  (existsSync(join(RUNS, "latest")) ? readFileSync(join(RUNS, "latest"), "utf8").trim() : null);
if (!runId || !existsSync(join(RUNS, runId))) {
  console.error(`No run to grade. Run one first:  node test/gym/run.mjs`);
  process.exit(1);
}
const TRANSCRIPTS = join(RUNS, runId);
const FEEDBACK = join(RUNS, runId, "feedback");

mkdirSync(FEEDBACK, { recursive: true });

/** Stable short id for a turn: content, not position. */
const turnId = (text) => createHash("sha256").update(text.trim()).digest("hex").slice(0, 12);

/**
 * Parse a transcript. Unlike simulate.mjs's own parser this keeps SHOW and
 * CHIPS, because they are half of what a turn actually did — a reviewer judging
 * `say` alone would penalise exactly the answers that correctly moved detail
 * onto the screen.
 */
function parse(md) {
  const turns = [];
  let cur = null;
  const push = () => {
    if (!cur) return;
    cur.text = cur.text.trim();
    if (cur.text) {
      cur.id = turnId(cur.text);
      turns.push(cur);
    }
    cur = null;
  };
  for (const line of md.split("\n")) {
    const m = /^\*\*(VISITOR|LOREM)\*\* — (.*)$/.exec(line);
    if (m) {
      push();
      cur = { who: m[1].toLowerCase(), text: m[2], show: "", chips: "" };
      continue;
    }
    if (!cur) continue;
    const s = /^`SHOW`\s*(.*)$/.exec(line);
    const c = /^`CHIPS`\s*(.*)$/.exec(line);
    if (s) cur.show = s[1];
    else if (c) cur.chips = c[1];
    else if (line.trim()) cur.text += `\n${line}`;
  }
  push();
  return turns;
}

const personas = () =>
  readdirSync(TRANSCRIPTS)
    // EVAL.md is the eval's own report, written into the same directory. It
    // sorts first alphabetically, so the bench opened on it by default and
    // showed "0 of 0 turns" — the review tool's own front page looked broken.
    .filter((f) => f.endsWith(".md") && f !== "EVAL.md")
    .map((f) => f.replace(/\.md$/, ""))
    .sort();

const fbPath = (p) => join(FEEDBACK, `${p}.json`);
const loadFb = (p) => (existsSync(fbPath(p)) ? JSON.parse(readFileSync(fbPath(p), "utf8")) : {});

function bundle(persona) {
  const md = readFileSync(join(TRANSCRIPTS, `${persona}.md`), "utf8");
  const turns = parse(md);
  const fb = loadFb(persona);
  const live = new Set(turns.map((t) => t.id));
  // Notes whose turn no longer exists: the line was rewritten since. Kept, so a
  // re-run shows whether the complaint was answered rather than losing it.
  const stale = Object.entries(fb)
    .filter(([id]) => id !== "_overall" && !live.has(id))
    .map(([id, v]) => ({ id, ...v }));
  const brief = (/^> ([\s\S]*?)\n\n---/m.exec(md)?.[1] ?? "").replace(/^> ?/gm, "");
  return { persona, brief, turns: turns.map((t) => ({ ...t, fb: fb[t.id] ?? null })), stale, overall: fb._overall ?? null };
}

const send = (res, code, body, type = "application/json") => {
  res.writeHead(code, { "content-type": type, "cache-control": "no-store" });
  res.end(typeof body === "string" ? body : JSON.stringify(body));
};

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/") return send(res, 200, HTML, "text/html; charset=utf-8");
  if (url.pathname === "/api/personas") return send(res, 200, personas());
  if (url.pathname === "/api/bundle") {
    const p = url.searchParams.get("p");
    if (!personas().includes(p)) return send(res, 404, { error: "unknown persona" });
    return send(res, 200, bundle(p));
  }
  if (url.pathname === "/api/feedback" && req.method === "POST") {
    const raw = await new Promise((r) => {
      let b = "";
      req.on("data", (c) => (b += c));
      req.on("end", () => r(b));
    });
    const { persona, id, verdict, note } = JSON.parse(raw);
    if (!personas().includes(persona)) return send(res, 400, { error: "unknown persona" });
    const fb = loadFb(persona);
    if (!verdict && !note) delete fb[id];
    else fb[id] = { verdict: verdict || null, note: note || "", at: new Date().toISOString() };
    writeFileSync(fbPath(persona), JSON.stringify(fb, null, 2) + "\n");
    return send(res, 200, { ok: true, count: Object.keys(fb).length });
  }
  send(res, 404, { error: "not found" });
}).listen(PORT, () => {
  const n = personas().length;
  console.log(`\n  Review bench → http://localhost:${PORT}`);
  console.log(`  run ${runId} · ${n} conversation${n === 1 ? "" : "s"}`);
  console.log(`  Notes save as you type, into test/gym/runs/${runId}/feedback/\n`);
  console.log(`  When you are done:  node test/gym/distill.mjs\n`);
});

/* ── UI ────────────────────────────────────────────────────────────────────
   One file, no build step, no dependencies. It is a review tool: it has to be
   fast to open and impossible to break, not pretty.                        */
const HTML = /* html */ `<!doctype html><meta charset="utf-8">
<title>Lorem review bench</title>
<style>
  :root{--ink:#14181f;--mut:#5f6773;--line:#e5e9f0;--bad:#c4361e;--weak:#b26a00;--good:#1a7f4b;--accent:#1c7cf5}
  *{box-sizing:border-box}
  body{margin:0;font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:#fafbfc}
  header{position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid var(--line);padding:12px 20px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
  header b{font-size:15px}
  select{font:inherit;padding:6px 10px;border:1px solid var(--line);border-radius:8px;background:#fff}
  .prog{margin-left:auto;font-size:13px;color:var(--mut)}
  main{max-width:860px;margin:0 auto;padding:22px 20px 120px}
  .brief{background:#fff;border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:10px;padding:14px 16px;color:var(--mut);font-size:14px;white-space:pre-wrap;margin-bottom:26px}
  .turn{margin-bottom:22px}
  .who{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-bottom:5px}
  .bubble{background:#fff;border:1px solid var(--line);border-radius:12px;padding:13px 16px;white-space:pre-wrap}
  .visitor .bubble{background:#f2f5f9;border-color:#dfe5ee}
  .meta{font-size:12px;color:var(--mut);margin-top:7px;font-family:ui-monospace,monospace}
  .rate{display:flex;gap:7px;align-items:center;margin-top:9px;flex-wrap:wrap}
  .rate button{font:inherit;font-size:13px;padding:5px 13px;border-radius:999px;border:1px solid var(--line);background:#fff;cursor:pointer}
  .rate button[data-on="1"]{color:#fff;border-color:transparent}
  button.good[data-on="1"]{background:var(--good)} button.weak[data-on="1"]{background:var(--weak)} button.bad[data-on="1"]{background:var(--bad)}
  textarea{width:100%;margin-top:8px;font:inherit;font-size:14px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;resize:vertical;min-height:38px;background:#fff}
  textarea:focus{outline:2px solid var(--accent);outline-offset:1px}
  .saved{font-size:12px;color:var(--good);margin-left:6px;opacity:0;transition:opacity .2s}
  .saved.on{opacity:1}
  .stale{background:#fff8e6;border:1px solid #f0dfae;border-radius:10px;padding:12px 14px;margin-bottom:20px;font-size:13px}
  .overall{position:sticky;bottom:0;background:#fff;border-top:1px solid var(--line);padding:14px 20px;margin:30px -20px -120px}
</style>
<header>
  <b>Lorem review bench</b>
  <select id="pick"></select>
  <span class="prog" id="prog"></span>
</header>
<main>
  <div class="brief" id="brief"></div>
  <div id="stale"></div>
  <div id="turns"></div>
  <div class="overall">
    <div class="who">Whole conversation</div>
    <div class="rate" id="orate">
      <button class="good" data-v="good">Good</button>
      <button class="weak" data-v="weak">Weak</button>
      <button class="bad" data-v="bad">Bad</button>
      <span class="saved" id="osaved">saved</span>
    </div>
    <textarea id="onote" placeholder="What would you change about this whole conversation?"></textarea>
  </div>
</main>
<script>
const $ = (s) => document.querySelector(s);
let P = null, DATA = null;

const save = async (id, verdict, note, flash) => {
  await fetch("/api/feedback", { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ persona: P, id, verdict, note }) });
  if (flash) { flash.classList.add("on"); setTimeout(() => flash.classList.remove("on"), 900); }
  progress();
};

const debounce = (fn, ms = 500) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

function progress() {
  const rated = DATA.turns.filter((t) => t.fb && (t.fb.verdict || t.fb.note)).length;
  const lorem = DATA.turns.filter((t) => t.who === "lorem").length;
  $("#prog").textContent = rated + " of " + DATA.turns.length + " turns annotated · " + lorem + " Lorem turns";
}

function turnEl(t) {
  const wrap = document.createElement("div");
  wrap.className = "turn " + t.who;
  const meta = [t.show && ("SHOW " + t.show), t.chips && ("CHIPS " + t.chips)].filter(Boolean).join("   ");
  wrap.innerHTML =
    '<div class="who">' + (t.who === "lorem" ? "Lorem" : "Visitor") + '</div>' +
    '<div class="bubble"></div>' +
    (meta ? '<div class="meta"></div>' : '') +
    '<div class="rate">' +
      '<button class="good" data-v="good">Good</button>' +
      '<button class="weak" data-v="weak">Weak</button>' +
      '<button class="bad" data-v="bad">Bad</button>' +
      '<span class="saved">saved</span>' +
    '</div>' +
    '<textarea placeholder="What is wrong with this, or right about it?"></textarea>';
  wrap.querySelector(".bubble").textContent = t.text;
  if (meta) wrap.querySelector(".meta").textContent = meta;

  const ta = wrap.querySelector("textarea");
  const flash = wrap.querySelector(".saved");
  const btns = [...wrap.querySelectorAll(".rate button")];
  let verdict = t.fb?.verdict ?? null;
  ta.value = t.fb?.note ?? "";
  const paint = () => btns.forEach((b) => b.dataset.on = b.dataset.v === verdict ? "1" : "0");
  paint();

  btns.forEach((b) => b.onclick = () => {
    verdict = verdict === b.dataset.v ? null : b.dataset.v;
    paint();
    t.fb = { verdict, note: ta.value };
    save(t.id, verdict, ta.value, flash);
  });
  ta.oninput = debounce(() => { t.fb = { verdict, note: ta.value }; save(t.id, verdict, ta.value, flash); });
  return wrap;
}

async function load(p) {
  P = p;
  DATA = await (await fetch("/api/bundle?p=" + encodeURIComponent(p))).json();
  $("#brief").textContent = DATA.brief.trim();
  $("#turns").replaceChildren(...DATA.turns.map(turnEl));
  $("#stale").innerHTML = DATA.stale.length
    ? '<div class="stale"><b>' + DATA.stale.length + ' note(s) from a previous version of this conversation.</b> The turn they were written about has changed since, so they are kept here rather than shown inline: ' +
      DATA.stale.map((s) => (s.verdict ? "[" + s.verdict + "] " : "") + (s.note || "")).join(" · ") + '</div>'
    : "";
  let ov = DATA.overall?.verdict ?? null;
  const obtns = [...document.querySelectorAll("#orate button")];
  const opaint = () => obtns.forEach((b) => b.dataset.on = b.dataset.v === ov ? "1" : "0");
  $("#onote").value = DATA.overall?.note ?? "";
  opaint();
  obtns.forEach((b) => b.onclick = () => { ov = ov === b.dataset.v ? null : b.dataset.v; opaint(); save("_overall", ov, $("#onote").value, $("#osaved")); });
  $("#onote").oninput = debounce(() => save("_overall", ov, $("#onote").value, $("#osaved")));
  progress();
  location.hash = p;
}

(async () => {
  const list = await (await fetch("/api/personas")).json();
  $("#pick").innerHTML = list.map((p) => '<option>' + p + '</option>').join("");
  const start = list.includes(location.hash.slice(1)) ? location.hash.slice(1) : list[0];
  $("#pick").value = start;
  $("#pick").onchange = (e) => load(e.target.value);
  load(start);
})();
</script>`;
