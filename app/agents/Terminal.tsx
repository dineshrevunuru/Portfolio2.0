"use client";

/**
 * The interactive layer of /agents — a command line that actually answers.
 *
 * Progressive enhancement, strictly: every section of the dossier is already
 * server-rendered above this component, so a crawler (or a human with JS off)
 * has the complete content without ever touching this file. What the input
 * adds is the theater — `help`, `ls`, `cat`, `open lorem` — for the human who
 * wants to play the terminal like the object it's dressed as. It re-prints
 * from the same SECTIONS data the server rendered, so the two can't disagree.
 */
import { useRef, useState } from "react";
import { SECTIONS } from "./dossier";

type Line = { kind: "echo" | "out"; text: string };

const HELP = [
  "help              this list",
  "ls                the dossier's files",
  "cat <file>        print one (e.g. cat caveats.md)",
  "open lorem        talk to Dinesh's agent instead",
  "open resume       the full history",
  "email             the fastest route to him",
  "clear             clean the scrollback",
];

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    const echo: Line = { kind: "echo", text: raw.trim() };
    const out = (...texts: string[]) =>
      setLines((p) => [...p, echo, ...texts.map((t) => ({ kind: "out" as const, text: t }))]);

    if (cmd === "clear") return setLines([]);
    if (cmd === "help" || cmd === "?") return out(...HELP);
    if (cmd === "ls" || cmd === "ls projects" || cmd === "ls .")
      return out(...SECTIONS.map((s) => s.file));
    if (cmd === "open lorem" || cmd === "lorem") {
      window.location.href = "/lorem";
      return;
    }
    if (cmd === "open resume" || cmd === "resume") {
      window.location.href = "/resume";
      return;
    }
    if (cmd === "email" || cmd === "contact")
      return out("dineshrevunuru@gmail.com — he replies himself.");
    if (cmd.startsWith("cat ")) {
      const f = cmd.slice(4).trim();
      const hit = SECTIONS.find((s) => s.file === f || s.file === `${f}.md` || s.id === f);
      if (hit) return out(...hit.lines);
      return out(`cat: ${f}: no such file — try ls`);
    }
    if (cmd === "whoami") return out("a visitor. Lorem would like to know more — try: open lorem");
    if (cmd === "sudo" || cmd.startsWith("sudo "))
      return out("nice try. Dinesh reviews every line before it ships — this one included.");
    return out(`command not found: ${cmd} — try help`);
  };

  return (
    <>
      {lines.length > 0 && (
        <div className="agents-out" aria-live="polite">
          {lines.map((l, i) =>
            l.kind === "echo" ? (
              <div key={i} className="echo">
                → ~ <span className="cmd">{l.text}</span>
              </div>
            ) : (
              <pre key={i}>{l.text}</pre>
            ),
          )}
        </div>
      )}
      {/* Label the input via the visible arrow row; the terminal frame is the
          affordance. Autofocus deliberately NOT set — the page is a document
          first, and stealing focus breaks scroll-on-arrival for readers. */}
      <div className="agents-input" onClick={() => inputRef.current?.focus()}>
        <span className="arrow" aria-hidden>
          → ~
        </span>
        <input
          ref={inputRef}
          value={value}
          aria-label="Terminal command input. Type help for commands."
          placeholder="type help, or click a command above"
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              run(value);
              setValue("");
            }
          }}
        />
      </div>
    </>
  );
}
