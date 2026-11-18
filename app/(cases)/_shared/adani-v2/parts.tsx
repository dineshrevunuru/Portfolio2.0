import type { CSSProperties, ReactNode } from "react";

/* Everything drawn for the public half of the page. Nothing here is a screen of the product and no
   figure is the client's: every number, name and position is made up for this page. What IS the
   product's: the tile's layout, the measures' names and units (cement-industry terms), the kinds of
   chart, and the colours. */
export const I = (i: number) => ({ "--i": i }) as CSSProperties;

export type TileT = { name: string; unit: string; act: string; le: string; tar: string; good: boolean; tone: "violet" | "blue" | "orange" | "teal" | "navy" | "slate" };
export const TILES: TileT[] = [
  { name: "Clinker Production", unit: "Tons", act: "1000", le: "1100", tar: "1050", good: false, tone: "violet" },
  { name: "Cement Production", unit: "Tons", act: "1200", le: "1150", tar: "1100", good: true, tone: "blue" },
  { name: "SEEC Clin.", unit: "Kwh/T Clink", act: "62.0", le: "60", tar: "61", good: false, tone: "orange" },
];
// The cover: six of the summary's nine measures, each its own colour as on the screen. Figures made up.
export const COVER: TileT[] = [
  TILES[0], TILES[1],
  { name: "Clinker Factor", unit: "%", act: "70%", le: "70%", tar: "70%", good: true, tone: "blue" },
  { name: "TSR", unit: "%", act: "20%", le: "18", tar: "18%", good: true, tone: "navy" },
  { name: "STEC", unit: "Kcal/Kg Clink", act: "740", le: "760", tar: "750", good: true, tone: "teal" },
  TILES[2],
];
export const Arrow = ({ good }: { good: boolean }) => (
  <i className={good ? "ad-arrow is-good" : "ad-arrow"}><svg viewBox="0 0 16 16" aria-hidden="true"><path d={good ? "M8 12.5v-9M4 7.5l4-4 4 4" : "M8 3.5v9M4 8.5l4 4 4-4"} /></svg><u>{good ? "Better than target" : "Worse than target"}</u></i>
);
export const Tile = ({ t }: { t: TileT }) => (
  <div className={`ad-tile ad-tile--${t.tone}`}>
    <span className="ad-tile-h">{t.name} <small>({t.unit})</small></span>
    <span className="ad-tile-v"><small>Act. :</small><b>{t.act}</b><Arrow good={t.good} /></span>
    <span className="ad-tile-f"><span>LE : {t.le}</span><span>Tar. : {t.tar}</span></span>
  </div>
);

/* ---------- the kinds of chart, small ---------- */
const V = "#5b1fa6", O = "#f47b20", G = "#63c15a", Y = "#f2c318", T = "#19b5c8", B = "#1f78d1", R = "#e0242b", P = "#d6379b";
const Svg = ({ children, label }: { children: ReactNode; label: string }) => <svg viewBox="0 0 160 96" role="img" aria-label={label}>{children}</svg>;
const axis = <path d="M14 8v76h138" fill="none" stroke="#c9cbd6" strokeWidth="1" />;

const stacks: [number, number, number][] = [[34, 14, 0], [28, 0, 16], [40, 0, 0], [30, 22, 0], [36, 12, 0], [26, 0, 18], [38, 0, 0]];
const Stacked = () => (
  <Svg label="A stacked column chart.">{axis}{stacks.map(([a, o, g], k) => { const x = 24 + k * 18; return <g key={k}><rect x={x} y={84 - a} width="10" height={a} fill={V} />{o > 0 && <rect x={x} y={84 - a - o} width="10" height={o} fill={O} />}{g > 0 && <rect x={x} y={84 - a - g} width="10" height={g} fill={G} />}<rect x={x - 1} y={84 - a - 1} width="12" height="2" fill={Y} /></g>; })}</Svg>
);
const line = (ys: number[]) => ys.map((y, k) => `${k ? "L" : "M"}${22 + k * 20} ${y}`).join(" ");
const Lines = () => (
  <Svg label="A line chart with three series.">{axis}{([[O, [30, 44, 38, 26, 40, 48, 42]], [T, [52, 36, 46, 34, 50, 44, 40]], [B, [64, 68, 62, 70, 64, 60, 66]]] as [string, number[]][]).map(([c, ys]) => <g key={c}><path d={line(ys)} fill="none" stroke={c} strokeWidth="1.6" />{ys.map((y, k) => <circle key={k} cx={22 + k * 20} cy={y} r="2.2" fill={c} />)}</g>)}</Svg>
);
const Combo = () => (
  <Svg label="Columns with a line across them.">{axis}{[40, 52, 34, 46, 58, 62].map((h, k) => <rect key={k} x={24 + k * 21} y={84 - h} width="11" height={h} fill={V} />)}<path d="M29 30 L50 44 L71 52 L92 58 L113 64 L134 70" fill="none" stroke={O} strokeWidth="1.6" />{[30, 44, 52, 58, 64, 70].map((y, k) => <circle key={k} cx={29 + k * 21} cy={y} r="2.2" fill={O} />)}</Svg>
);
const ring = (from: number, to: number, c: string) => { const a = (t: number) => [80 + 30 * Math.sin(t * 2 * Math.PI), 48 - 30 * Math.cos(t * 2 * Math.PI)].map((n) => n.toFixed(2)).join(" "); return <path key={c} d={`M${a(from)} A30 30 0 ${to - from > 0.5 ? 1 : 0} 1 ${a(to)}`} fill="none" stroke={c} strokeWidth="13" />; };
const Donut = () => <Svg label="A donut chart in four parts.">{ring(0, 0.34, B)}{ring(0.34, 0.62, P)}{ring(0.62, 0.86, V)}{ring(0.86, 1, T)}</Svg>;
const Ranked = () => <Svg label="Horizontal bars in order of size.">{[124, 108, 96, 80, 66, 48, 34].map((w, k) => <rect key={k} x="16" y={9 + k * 11.5} width={w} height="7" rx="1" fill={k < 4 ? G : O} />)}</Svg>;
const Bubbles = () => (
  <Svg label="A bubble chart.">{axis}{([[30, 62, 6], [44, 54, 9], [58, 66, 5], [66, 44, 11], [84, 58, 7], [96, 36, 12], [112, 60, 6], [122, 46, 9], [138, 64, 5], [76, 70, 4], [104, 70, 5]] as number[][]).map(([x, y, r], k) => <circle key={k} cx={x} cy={y} r={r} fill={G} fillOpacity="0.62" />)}</Svg>
);
const Tree = () => (
  <Svg label="A tree that breaks one total into its parts.">
    {([[10, 46, 44, 22], [10, 46, 44, 46], [10, 46, 44, 70], [62, 22, 96, 12], [62, 22, 96, 32], [62, 46, 96, 52], [62, 70, 96, 72], [114, 12, 148, 12], [114, 32, 148, 30], [114, 52, 148, 48], [114, 52, 148, 62], [114, 72, 148, 80]] as number[][]).map(([x1, y1, x2, y2], k) => <path key={k} d={`M${x1 + 18} ${y1} C${x1 + 28} ${y1} ${x2 - 10} ${y2} ${x2} ${y2}`} fill="none" stroke="#b9a4de" strokeWidth="1.2" />)}
    {([[10, 46], [44, 22], [44, 46], [44, 70], [96, 12], [96, 32], [96, 52], [96, 72]] as number[][]).map(([x, y], k) => <rect key={k} x={x} y={y - 3} width="18" height="6" rx="1" fill={V} />)}
    {[12, 30, 48, 62, 80].map((y) => <rect key={y} x="148" y={y - 2.5} width="8" height="5" rx="1" fill="#b9a4de" />)}
  </Svg>
);
// Not a map of anywhere: a made-up outline, and dots placed for the picture.
const LAND = "M42 14 C58 6 82 10 96 8 C116 6 134 16 138 32 C142 46 128 52 122 62 C114 76 104 90 88 88 C74 86 70 72 58 66 C44 60 26 58 24 42 C22 30 30 20 42 14 Z";
const Dots = () => <Svg label="A map with a dot for each place."><path d={LAND} fill="#5d6a86" />{([[52, 26], [70, 20], [92, 24], [112, 28], [124, 38], [104, 44], [84, 40], [62, 44], [46, 40], [76, 58], [96, 62], [88, 76], [108, 56]] as number[][]).map(([x, y], k) => <circle key={k} cx={x} cy={y} r="3" fill="#f4f77c" stroke="#3c4763" strokeWidth="0.6" />)}</Svg>;
const Flows = () => <Svg label="A map with routes fanning out from one place."><path d={LAND} fill="#5d6a86" />{([[52, 26], [70, 20], [112, 28], [124, 38], [104, 44], [88, 76], [46, 40]] as number[][]).map(([x, y], k) => <path key={k} d={`M82 52 Q${(82 + x) / 2} ${Math.min(52, y) - 12} ${x} ${y}`} fill="none" stroke={[Y, T, "#fff"][k % 3]} strokeWidth="1" />)}<circle cx="82" cy="52" r="3.4" fill={O} /></Svg>;
const Rows = () => (
  <Svg label="A table whose first column is marked in red."><rect x="8" y="8" width="144" height="12" fill={V} />{[0, 1, 2, 3, 4, 5].map((k) => <g key={k}><rect x="12" y={27 + k * 11} width="34" height="4" rx="1" fill={R} />{[54, 76, 98, 120, 138].map((x, j) => <rect key={x} x={x} y={27 + k * 11} width={j === 4 ? 10 : 16} height="4" rx="1" fill={j === 4 && k % 3 === 0 ? R : "#c9cbd6"} />)}</g>)}</Svg>
);
export const CHARTS: [name: string, shows: string, chart: ReactNode][] = [
  ["Stacked columns", "Actual against target, with what is short or over", <Stacked key="s" />],
  ["Lines", "A measure over time, plants compared", <Lines key="l" />],
  ["Columns and a line", "A volume with a rate across it", <Combo key="c" />],
  ["Donut", "A total split into its shares", <Donut key="d" />],
  ["Ranked bars", "The top and the bottom of a list", <Ranked key="r" />],
  ["Bubbles", "Growth against volume, one bubble each", <Bubbles key="b" />],
  ["Tree", "One total broken down level by level", <Tree key="t" />],
  ["Dots on a map", "Where each plant is", <Dots key="m" />],
  ["Routes on a map", "Where dispatches go", <Flows key="f" />],
  ["Table with marks", "The rows that missed target", <Rows key="w" />],
];

// Full screens in the design file, by business area: counted in the file (frames 1,200px wide or more).
export const AREAS: [string, number][] = [["Manufacturing", 20], ["Sales", 16], ["Logistics", 13], ["Manual input forms", 12], ["FPC, logistics", 12], ["Procurement", 8], ["HR", 5], ["Benchmark", 5], ["Process safety", 5], ["EBITDA report", 5], ["Sales productivity", 5], ["Finance", 4], ["Build-your-own reports", 4], ["FPC, sales", 4], ["Daily inventory", 3], ["Micro market", 2], ["Sales report", 1]];
// 34 dots in 7 groups. The split between groups is made up.
export const CLUSTERS = [6, 5, 5, 5, 4, 5, 4];
