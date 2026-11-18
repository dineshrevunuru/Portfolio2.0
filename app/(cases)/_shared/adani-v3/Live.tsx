"use client";

import { useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { ActualBudget, BestEver, Bubbles, Donut, DONUTS, fmtK, Legend, LEG_BEST, LEG_BUDGET, LEG_WEEKLY, LEVELS, MEASURES, Monthly, Panel, PlantTable, RegionTable, SERIES, split, Sr, SUN, Tabs, TABS_LOGISTICS, TREE_TOTAL, Trend, WeeklyGap, type Measure } from "./charts";
import { LEAD, LTile } from "./summary";

/* The charts, live (2026-11-17). His words: "I want to build a chart library we used in this project and
   if users can interact with charts, that would be a big plus."

   Every interaction here is one the dashboard itself has, in the designs: the exact value on hover, tabs
   that change which measure one chart shows, a tree that opens a level at a time, and the theme switch.
   One is added for the page: switching a plant off in the trend's legend. Nothing is a toy: each is how a
   reader of the dashboard gets from the shape to the number. Works with a pointer, a finger and the keyboard. */

/* The exact value on hover: any mark with `data-tip` shows its lines in the dashboard's own tooltip. */
export function Tips({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null), [tip, setTip] = useState<{ x: number; y: number; lines: string[] } | null>(null);
  const over = (e: PointerEvent<HTMLDivElement> | FocusEvent<HTMLDivElement>) => {
    const t = (e.target as Element).closest("[data-tip]"), box = ref.current;
    if (!t || !box) { setTip(null); return; }
    const r = t.getBoundingClientRect(), b = box.getBoundingClientRect(), mark = t.querySelector("rect:not([fill=transparent]), circle:not([fill=transparent]), path")?.getBoundingClientRect() ?? r;
    setTip({ x: Math.min(Math.max(r.left + r.width / 2 - b.left, 84), b.width - 84), y: mark.top - b.top, lines: (t.getAttribute("data-tip") ?? "").split("|") });
  };
  return (
    <div ref={ref} className={`a3l ${className}`} onPointerOver={over} onPointerLeave={() => setTip(null)} onFocus={over} onBlur={() => setTip(null)}>
      {children}
      {tip && <div className="a3l-tip" style={{ left: tip.x, top: tip.y }} role="status">{tip.lines.map((l, k) => k === 0 ? <b key={k}>{l}</b> : <span key={k}>{l}</span>)}</div>}
    </div>
  );
}

// A strip of tabs that works: arrow keys move, as on a tab list.
function TabStrip({ items, at, pick, label }: { items: string[]; at: number; pick: (k: number) => void; label: string }) {
  const key = (e: KeyboardEvent) => { const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return; e.preventDefault(); const k = (at + d + items.length) % items.length; pick(k); (e.currentTarget.children[k] as HTMLElement).focus(); };
  return <div className="a3c-tabs a3c-tabs--live" role="tablist" aria-label={label} onKeyDown={key}>{items.map((t, k) => <button key={t} type="button" role="tab" aria-selected={k === at} tabIndex={k === at ? 0 : -1} className={k === at ? "is-on" : undefined} onClick={() => pick(k)}>{t}</button>)}</div>;
}

/* One chart, many measures: the tabs change what the weekly chart shows. */
export function LiveWeekly({ tips = true, measures = MEASURES, h }: { tips?: boolean; measures?: Measure[]; h?: number }) {
  const [at, setAt] = useState(0);
  const panel = <Panel tabs={<TabStrip items={measures.map((m) => m.tab)} at={at} pick={setAt} label="Measure" />} legend={<Legend items={LEG_WEEKLY} />}><WeeklyGap m={measures[at]} h={h} /></Panel>;
  return tips ? <Tips>{panel}</Tips> : panel;
}
// The tab strip on its own, for the board of shared parts: it works there too.
export function DemoTabs() {
  const [at, setAt] = useState(0);
  return <TabStrip items={["Clink. Prod.", "Cem. Prod.", "STEC", "TSR", "SEEC Clink.", "SEEC Grind."]} at={at} pick={setAt} label="Measure, as an example" />;
}

/* Four plants over time: a plant can be switched off in the legend to read the others. */
export function LiveTrend() {
  const [off, setOff] = useState<number[]>([]);
  return (
    <Tips>
      <Panel title="Quality &amp; Emission Trend" legend={<ul className="a3c-leg a3c-leg--live">{SERIES.map(([t, c], k) => <li key={t}><button type="button" aria-pressed={!off.includes(k)} onClick={() => setOff(off.includes(k) ? off.filter((x) => x !== k) : off.length === SERIES.length - 1 ? off : [...off, k])}><i style={{ background: c }} />{t}</button></li>)}</ul>}>
        <Trend off={off} />
      </Panel>
    </Tips>
  );
}

/* The tree: one quantity, opened a level at a time. A node opens its own level; the open path is darker. */
const BW = 104, COL = 152, ROW = 96;
export function LiveTree() {
  const [path, setPath] = useState<number[]>([0, 0, 0, 0]); // which node is open at each level
  const open = (level: number, k: number) => setPath((p) => [...p.slice(0, level), k]);
  const act = (e: KeyboardEvent, level: number, k: number) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(level, k); } };
  let total = TREE_TOTAL, py = 232; const cols: ReactNode[] = [];
  for (let level = 0; level <= path.length && level < LEVELS.length; level++) {
    const { parts } = LEVELS[level], x = 176 + level * COL, top = Math.max(64, Math.min(py - ((parts.length - 1) * ROW) / 2, 400 - 60 - (parts.length - 1) * ROW)), fromX = x - COL + BW, fromY = py, parent = total, vals = split(parent, parts.map(([, s]) => s));
    cols.push(
      <g key={level}>
        {parts.map(([name], k) => {
          const y = top + k * ROW, on = path[level] === k, last = level === LEVELS.length - 1;
          return (
            <g key={name} className={`a3tr-n${on ? " is-on" : ""}`} role={last ? undefined : "button"} tabIndex={last ? undefined : 0} aria-expanded={last ? undefined : on} aria-label={`${name}, ${fmtK(vals[k])}${last ? "" : on ? ", open" : ", open this level"}`} onClick={last ? undefined : () => open(level, k)} onKeyDown={last ? undefined : (e) => act(e, level, k)} data-tip={`${name}|${fmtK(vals[k])}|${Math.round((vals[k] / parent) * 100)}% of ${level === 0 ? "the total" : "its parent"}`}>
              <path d={`M${level === 0 ? 24 + BW : fromX} ${fromY}C${(level === 0 ? 24 + BW : fromX) + 30} ${fromY} ${x - 30} ${y} ${x} ${y}`} fill="none" className="a3tr-l" />
              <rect x={x - 6} y={y - 16} width={BW + 12} height="70" fill="transparent" />
              <rect x={x} y={y - 5} width={BW} height="10" className="a3tr-t" /><rect x={x} y={y - 5} width={BW * (vals[k] / parent)} height="10" fill="var(--c-act)" />
              <text x={x} y={y + 24} className="a3c-ax">{name}</text><text x={x} y={y + 44} className="a3c-node">{fmtK(vals[k])}</text>
            </g>
          );
        })}
      </g>,
    );
    if (level < path.length) { total = vals[path[level]]; py = top + path[level] * ROW; }
  }
  return (
    <Tips>
      <Panel title="Regional Sales Office Dimension">
        <svg viewBox="0 0 960 400" role="group" aria-label="A total quantity broken down level by level: by trade type, then direct or indirect, then delivery channel, then transport type, then package type. Choose a part to open the level beneath it. Figures are changed.">
          {LEVELS.map((l, k) => <g key={l.dim} opacity={k <= path.length ? 1 : 0.35}><text x={176 + k * COL} y="26" className="a3c-ax">{l.dim}</text><path d={`M${176 + k * COL} 34h${BW}`} stroke="var(--c-grid)" /></g>)}
          <rect x="24" y="227" width={BW} height="10" fill="var(--c-act)" /><text x="24" y="256" className="a3c-ax">Quantity</text><text x="24" y="276" className="a3c-node">{fmtK(TREE_TOTAL)}</text>
          {cols}
        </svg>
      </Panel>
    </Tips>
  );
}

/* Volume by cluster and plant: an inner ring of clusters, an outer ring of their plants. Choosing a cluster
   holds it and lets the others step back; the middle then reads that cluster's total. */
const SUM = SUN.reduce((a, c) => a + c.plants.reduce((x, y) => x + y, 0), 0), TAU = Math.PI * 2;
const pos = (r: number, a: number) => `${(250 + r * Math.sin(a)).toFixed(2)} ${(250 - r * Math.cos(a)).toFixed(2)}`;
const ring = (r0: number, r1: number, a0: number, a1: number) => `M${pos(r1, a0)}A${r1} ${r1} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${pos(r1, a1)}L${pos(r0, a1)}A${r0} ${r0} 0 ${a1 - a0 > Math.PI ? 1 : 0} 0 ${pos(r0, a0)}Z`;
const M = (v: number) => `${(v / 1000).toFixed(1)}M`;
export function LiveSun() {
  const [held, setHeld] = useState<number | null>(null);
  let a = 0, plant = 0; const arcs: ReactNode[] = [];
  SUN.forEach((cl, c) => {
    const total = cl.plants.reduce((x, y) => x + y, 0), a0 = a, a1 = a + (total / SUM) * TAU, mid = (a0 + a1) / 2, deg = (mid * 180) / Math.PI, dim = held !== null && held !== c;
    const pick = () => setHeld(held === c ? null : c);
    let b = a0;
    arcs.push(
      <g key={cl.name} className={dim ? "a3su is-dim" : "a3su"}>
        <g role="button" tabIndex={0} aria-pressed={held === c} aria-label={`${cl.name}, ${M(total)}, ${Math.round((total / SUM) * 100)} percent of the total`} className="a3su-c" onClick={pick} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } }} data-tip={`${cl.name}|${M(total)}|${Math.round((total / SUM) * 100)}% of the total`}>
          <path d={ring(82, 156, a0, a1)} fill={cl.c} />
          <text transform={`translate(${pos(119, mid).replace(" ", ",")}) rotate(${deg > 180 ? deg + 90 : deg - 90})`} textAnchor="middle" dy="4" className="a3su-t">{cl.name}</text>
        </g>
        {cl.plants.map((v) => {
          const p0 = b, p1 = b + (v / SUM) * TAU, pm = (p0 + p1) / 2, pd = (pm * 180) / Math.PI; b = p1; plant += 1;
          return (
            <g key={plant} data-tip={`Plant ${plant}|${cl.name}|${v}K|${((v / SUM) * 100).toFixed(1)}% of the total`}>
              <path d={ring(156, 236, p0, p1)} fill={cl.t} />
              {p1 - p0 > 0.19 && <text transform={`translate(${pos(196, pm).replace(" ", ",")}) rotate(${pd > 180 ? pd + 90 : pd - 90})`} textAnchor="middle" dy="4" className="a3su-t a3su-t--s">Plant {plant}</text>}
            </g>
          );
        })}
      </g>,
    );
    a = a1;
  });
  const shown = held === null ? SUM : SUN[held].plants.reduce((x, y) => x + y, 0);
  let n = 0;
  return (
    <Tips>
      <Panel title="Volume by Cluster and Plant">
        <svg viewBox="0 0 500 500" role="group" aria-label="Volume by cluster and plant: an inner ring of seven clusters and an outer ring of their 34 plants. Choose a cluster to hold it. Clusters and plants are numbered and figures are changed." className="a3su-svg">
          {arcs}
          <text x="250" y="244" textAnchor="middle" className="a3su-mid">{held === null ? "Total" : SUN[held].name}</text>
          <text x="250" y="272" textAnchor="middle" className="a3su-mid">{M(shown)}</text>
        </svg>
        <Sr cap="Volume by cluster and plant, thousands" head={["Plant", "Cluster", "Volume"]} rows={SUN.flatMap((cl) => cl.plants.map((v) => [`Plant ${++n}`, cl.name, v]))} />
      </Panel>
    </Tips>
  );
}

/* ---------- the chart library ---------- */
export type Item = { name: string; asks: string; reads: string; visual: string; chart: ReactNode; narrow?: boolean };
export const ITEMS: Item[] = [
  { name: "Measure tile", asks: "How is this measure doing?", reads: "The actual figure first; the estimate and the target beneath; one mark for better or worse than target.", visual: "Card", narrow: true, chart: <div className="a3x-tiles"><LTile t={LEAD[0]} /><LTile t={LEAD[1]} /></div> },
  { name: "Gap to target", asks: "Are we on target this week?", reads: "Orange is what fell short, green what went over, the yellow line is the target. The tabs change the measure.", visual: "Stacked column chart", chart: <LiveWeekly /> },
  { name: "Actual and budget", asks: "Did we meet budget each month?", reads: "Two columns a month, actual beside budget, each labelled.", visual: "Clustered column chart", chart: <Tips><Panel tabs={<Tabs items={TABS_LOGISTICS} />} legend={<Legend items={LEG_BUDGET} />}><ActualBudget /></Panel></Tips> },
  { name: "Against the best ever", asks: "How far is each plant from its best?", reads: "A column for now; the line above is that plant's best ever.", visual: "Line and clustered column chart", narrow: true, chart: <Tips><Panel title="Bench Marking Comparison" legend={<Legend items={LEG_BEST} />}><BestEver /></Panel></Tips> },
  { name: "Trend by plant", asks: "Which plant is drifting?", reads: "One line per plant, a figure on every point. Switch a plant off in the legend to read the others.", visual: "Line chart", narrow: true, chart: <LiveTrend /> },
  { name: "Month by month", asks: "How did the year go?", reads: "One column a month, each labelled with its figure.", visual: "Clustered column chart", chart: <Tips><Panel title="Month Wise Trend - Overall"><Monthly /></Panel></Tips> },
  { name: "Breakdown tree", asks: "Where did the quantity go?", reads: "Choose a part to open the level beneath it. Each bar is that part's size among its level.", visual: "Decomposition tree", chart: <LiveTree /> },
  { name: "Cluster and plant", asks: "Which cluster, and which plant in it, carries the volume?", reads: "The inner ring is the seven clusters, the outer ring their plants. Choose a cluster to hold it.", visual: "Sunburst (a custom visual)", narrow: true, chart: <LiveSun /> },
  { name: "Share of a total", asks: "What share is each department?", reads: "A ring in three parts, the share written on each.", visual: "Donut chart", narrow: true, chart: <Tips><Panel title={DONUTS[0].title} legend={<Legend items={DONUTS[0].colors.map((c, j) => [`Dept. ${j + 1}`, c])} />}><Donut shares={DONUTS[0].shares} colors={DONUTS[0].colors} label="Headcount by department, three parts. Figures changed." /></Panel></Tips> },
  { name: "Growth and volume", asks: "Which dealers are large, and which are growing?", reads: "One bubble per dealer: across for growth, up for volume.", visual: "Scatter chart", chart: <Tips><Panel title="Growth VS Volume"><Bubbles /></Panel></Tips> },
  { name: "A plant's figures", asks: "What is the exact figure?", reads: "Estimate, target, actual and variance; variance in a color and an arrow.", visual: "Table", narrow: true, chart: <PlantTable /> },
  { name: "Status by region", asks: "Which region fell against last year?", reads: "Growth on last year, in red where it fell.", visual: "Table with conditional formatting", narrow: true, chart: <RegionTable /> },
];

export function Library() {
  const [at, setAt] = useState(1), [night, setNight] = useState(false), it = ITEMS[at];
  const key = (e: KeyboardEvent) => { const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0; if (!d) return; e.preventDefault(); const k = (at + d + ITEMS.length) % ITEMS.length; setAt(k); (e.currentTarget.querySelectorAll("button")[k] as HTMLElement).focus(); };
  return (
    <div className={`a3x${night ? " is-night" : ""}`}>
      <div className="a3x-top">
        <b>Chart library</b>
        <button type="button" className="a3x-theme" role="switch" aria-checked={night} onClick={() => setNight(!night)}>Theme:<span>{night ? "Dark" : "Light"}<i /></span></button>
      </div>
      <div className="a3x-body">
        <div className="a3x-list" role="tablist" aria-label="Charts" onKeyDown={key}>{ITEMS.map((x, k) => <button key={x.name} type="button" role="tab" aria-selected={k === at} tabIndex={k === at ? 0 : -1} className={k === at ? "is-on" : undefined} onClick={() => setAt(k)}>{x.name}</button>)}</div>
        <div className="a3x-view" role="tabpanel" aria-label={it.name}>
          <div className={it.narrow ? "a3x-chart is-narrow" : "a3x-chart"} key={it.name}>{it.chart}</div>
          <dl>
            <div><dt>Answers</dt><dd>{it.asks}</dd></div>
            <div><dt>Reads as</dt><dd>{it.reads}</dd></div>
            <div><dt>Nearest Power BI visual</dt><dd>{it.visual}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}
