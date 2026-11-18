"use client";

import { useEffect, useRef, useState } from "react";
import { ITEMS } from "../_shared/adani-v3/Live";

/* The chart library, scaled down (2026-11-17). His words on the fourth version's library, where every chart sat at
   reading size in a band wider than the text: "Everything real big like are hard to follow. got to scale these down
   making them comfortable to follow".
   So the library is now a compact grid inside the page's own figure width: all twelve charts at once as small
   pictures, each with its name and the question it answers. A small picture cannot be read closely, so choosing one
   opens it large and live (values on hover, tabs, the tree, the rings); Escape or Close goes back. One theme switch
   still darkens everything, the open chart included.
   The charts are the third version's own (../adani-v3/Live.tsx), unchanged. In the grid each is drawn at its normal
   width and zoomed down, and cannot be clicked or reached by keyboard there: one button per card opens it. */
const ORDER: [name: string, wide: boolean][] = [
  ["Gap to target", true], ["Measure tile", false], ["Actual and budget", true],
  ["Against the best ever", false], ["Month by month", true], ["Trend by plant", false],
  ["Breakdown tree", true], ["Share of a total", false], ["Growth and volume", true],
  ["Cluster and plant", false], ["Status by region", true], ["A plant's figures", false],
];

export function Library5() {
  const [night, setNight] = useState(false), [at, setAt] = useState<number | null>(null);
  const box = useRef<HTMLDialogElement>(null);
  useEffect(() => { const d = box.current; if (!d) return; if (at !== null && !d.open) d.showModal(); if (at === null && d.open) d.close(); }, [at]);
  const cur = at === null ? null : ITEMS.find((x) => x.name === ORDER[at][0])!;
  return (
    <div className={`a3x a5l${night ? " is-night" : ""}`}>
      <div className="a3x-top">
        <b>Chart library <small>{ORDER.length} charts</small></b>
        <button type="button" className="a3x-theme" role="switch" aria-checked={night} aria-label="Dark theme for the whole library" onClick={() => setNight(!night)}>Theme:<span>{night ? "Dark" : "Light"}<i /></span></button>
      </div>
      <ul className="a5l-grid">
        {ORDER.map(([name, wide], k) => {
          const it = ITEMS.find((x) => x.name === name)!;
          return (
            <li key={name} className="a5l-card">
              <div className="a5l-thumb" aria-hidden="true" inert><div className={wide ? "a5l-fit is-wide" : "a5l-fit"}>{it.chart}</div></div>
              <h3>{it.name}</h3>
              <p>{it.asks}</p>
              <button type="button" className="a5l-open" aria-label={`${it.name}: open large`} onClick={() => setAt(k)} />
            </li>
          );
        })}
      </ul>
      <dialog ref={box} className="a5l-big" aria-label={cur ? cur.name : "Chart"} onClose={() => setAt(null)} onClick={(e) => { if (e.target === e.currentTarget) setAt(null); }}>
        {cur && (
          <div className="a5l-bigin">
            <div className="a5l-bighead">
              <div><h3>{cur.name}</h3><p>{cur.asks}</p></div>
              <small>{cur.visual}</small>
              <button type="button" className="a5l-close" onClick={() => setAt(null)}>Close</button>
            </div>
            <div className={ORDER[at!][1] ? "a5l-bigchart" : "a5l-bigchart is-narrow"} key={cur.name}>{cur.chart}</div>
          </div>
        )}
      </dialog>
    </div>
  );
}
