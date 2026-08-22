/**
 * /conversations — read real visitor conversations from anywhere, behind a
 * password. The deployed sibling of `npm run conversations`: same data, same
 * grouping, reachable from a phone instead of only the laptop that has the
 * keys.
 *
 * A server component on purpose. The Supabase service key is read and used
 * ONLY here, server-side; the browser receives rendered conversation HTML and
 * never the key. force-dynamic because it reads a cookie and live data, and
 * noindex because a page of real people's words must never reach a search
 * result even by accident.
 */
import { isAuthed } from "./auth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Conversations",
  robots: { index: false, follow: false },
};

type Row = {
  session_id: string;
  mode: string;
  message: string;
  say: string;
  show: { type?: string }[] | null;
  chips: string[] | null;
  model: string;
  ms: number;
  created_at: string;
};

type ContactRow = {
  session_id: string;
  name: string | null;
  email: string | null;
  linkedin: string | null;
  note: string | null;
  created_at: string;
};

/**
 * People who asked Lorem to have Dinesh follow up. Tolerant of the table not
 * existing yet — contact capture ships behind LOREM_CONTACT_CAPTURE, and the
 * table is created when that is turned on. A 404 here is "not enabled", not
 * an error worth a red line.
 */
async function fetchContacts(): Promise<ContactRow[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/lorem_contacts?order=created_at.desc&limit=200`, {
      headers: { apikey: key, authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as ContactRow[];
  } catch {
    return [];
  }
}

async function fetchRows(): Promise<{ rows: Row[]; error: string | null }> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { rows: [], error: "Logging isn't configured (SUPABASE_* unset)." };
  try {
    const res = await fetch(
      `${url}/rest/v1/lorem_turns?order=created_at.desc&limit=1000`,
      { headers: { apikey: key, authorization: `Bearer ${key}` }, cache: "no-store" },
    );
    if (!res.ok) return { rows: [], error: `Supabase ${res.status}` };
    return { rows: (await res.json()) as Row[], error: null };
  } catch {
    return { rows: [], error: "Couldn't reach Supabase." };
  }
}

function Locked({ error }: { error?: string }) {
  return (
    <main style={S.wrap}>
      <div style={S.lockCard}>
        <h1 style={S.lockTitle}>Conversations</h1>
        <p style={S.lockSub}>
          Real visitor conversations with Lorem. Private — enter the password to read them.
        </p>
        <form method="POST" action="/api/conversations/auth" style={S.form}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            autoComplete="current-password"
            style={S.input}
          />
          <button type="submit" style={S.button}>Open</button>
        </form>
        {error === "1" && <p style={S.err}>Wrong password.</p>}
        {error === "slow" && <p style={S.err}>Too many tries — wait a minute.</p>}
      </div>
    </main>
  );
}

export default async function ConversationsPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  if (!(await isAuthed())) {
    const { e } = await searchParams;
    return <Locked error={e} />;
  }

  const [{ rows, error }, contacts] = await Promise.all([fetchRows(), fetchContacts()]);

  // Group turns into conversations, most recent conversation first.
  const bySession = new Map<string, Row[]>();
  for (const r of [...rows].reverse()) {
    if (!bySession.has(r.session_id)) bySession.set(r.session_id, []);
    bySession.get(r.session_id)!.push(r);
  }
  const convos = [...bySession.entries()]
    .map(([session, turns]) => ({ session, turns }))
    .sort((a, b) => b.turns[b.turns.length - 1].created_at.localeCompare(a.turns[a.turns.length - 1].created_at));

  const totalTurns = rows.length;

  return (
    <main style={S.wrap}>
      <header style={S.head}>
        <div>
          <h1 style={S.h1}>Conversations</h1>
          <p style={S.meta}>
            {convos.length} conversation{convos.length === 1 ? "" : "s"} · {totalTurns} turns
            {rows[0] ? ` · newest ${new Date(convos[0]?.turns.at(-1)!.created_at).toLocaleString()}` : ""}
          </p>
        </div>
        <form method="POST" action="/api/conversations/logout" style={{ margin: 0 }}>
          <button type="submit" style={S.signout}>Sign out</button>
        </form>
      </header>

      {contacts.length > 0 && (
        <section style={{ ...S.convo, marginBottom: 40, borderColor: "#cfe0ff", background: "#f7faff" }}>
          <div style={S.convoHead}>
            <span style={{ ...S.sid, color: "#1c7cf5" }}>wants to hear from you</span>
            <span style={S.convoMeta}>{contacts.length} · newest first</span>
          </div>
          {contacts.map((c, i) => (
            <div key={i} style={S.turn}>
              <p style={S.visitor}>
                {c.name ?? "Someone"}
                {c.email ? ` · ${c.email}` : ""}
                {c.linkedin ? ` · ${c.linkedin}` : ""}
              </p>
              <p style={S.lorem}>{c.note ?? "No note — they just wanted you to follow up."}</p>
              <p style={S.aux}>
                {new Date(c.created_at).toLocaleString()} · conversation {c.session_id.slice(0, 8)}
              </p>
            </div>
          ))}
        </section>
      )}

      {error && <p style={S.err}>{error}</p>}
      {!error && !convos.length && (
        <p style={S.empty}>No conversations yet. They appear here as visitors talk to Lorem.</p>
      )}

      <div style={S.list}>
        {convos.map(({ session, turns }) => (
          <section key={session} style={S.convo}>
            <div style={S.convoHead}>
              <span style={S.sid}>{session.slice(0, 8)}</span>
              <span style={S.convoMeta}>
                {turns.length} turns · {turns[0].mode} · {turns[0].model}
                {" · "}
                {new Date(turns[0].created_at).toLocaleString()}
              </span>
            </div>
            {turns.map((t, i) => (
              <div key={i} style={S.turn}>
                <p style={S.visitor}>{t.message}</p>
                <p style={S.lorem}>{t.say}</p>
                {(t.show?.length || t.chips?.length) && (
                  <p style={S.aux}>
                    {t.show?.length ? `▦ ${t.show.map((b) => b.type ?? "?").join(" · ")}` : ""}
                    {t.show?.length && t.chips?.length ? "    " : ""}
                    {t.chips?.length ? `◇ ${t.chips.join(" · ")}` : ""}
                  </p>
                )}
              </div>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 760, margin: "0 auto", padding: "56px 24px 120px", fontFamily: "system-ui, sans-serif", color: "#14181f" },
  head: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, gap: 16 },
  h1: { fontSize: 30, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" },
  meta: { color: "#5f6773", fontSize: 14, margin: "8px 0 0" },
  signout: { border: "1px solid #e5e9f0", background: "#fff", color: "#5f6773", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer" },
  list: { display: "flex", flexDirection: "column", gap: 40 },
  convo: { border: "1px solid #eceef2", borderRadius: 14, padding: "22px 24px", background: "#fff" },
  convoHead: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid #f2f4f7", flexWrap: "wrap" },
  sid: { fontFamily: "ui-monospace, monospace", fontSize: 13, color: "#9aa1ac", fontWeight: 600 },
  convoMeta: { fontSize: 12.5, color: "#9aa1ac" },
  turn: { marginBottom: 20 },
  visitor: { margin: "0 0 6px", fontSize: 15.5, color: "#14181f", fontWeight: 500 },
  lorem: { margin: 0, fontSize: 15.5, color: "#3a424e", lineHeight: 1.6, paddingLeft: 14, borderLeft: "2px solid #e5e9f0" },
  aux: { margin: "6px 0 0 14px", fontSize: 12.5, color: "#adb4bf", fontFamily: "ui-monospace, monospace" },
  empty: { color: "#5f6773", fontSize: 15 },
  err: { color: "#c4361e", fontSize: 14, marginTop: 12 },
  lockCard: { maxWidth: 380, margin: "12vh auto 0", textAlign: "center" },
  lockTitle: { fontSize: 26, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" },
  lockSub: { color: "#5f6773", fontSize: 14.5, lineHeight: 1.6, margin: "12px 0 28px" },
  form: { display: "flex", gap: 10 },
  input: { flex: 1, border: "1px solid #d9dee6", borderRadius: 10, padding: "12px 14px", fontSize: 15, outline: "none" },
  button: { border: 0, background: "#14181f", color: "#fff", borderRadius: 10, padding: "12px 20px", fontSize: 15, fontWeight: 500, cursor: "pointer" },
};
