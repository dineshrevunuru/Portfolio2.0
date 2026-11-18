import type { ReactNode } from "react";

/* The dashboard's charts, redrawn as designed (third version). His words: "We got to use and build
   charts as is", and "the whole case study needs to be positioned carefully especially data charts".

   What is the product's own here: each chart's kind, its parts and their order, its colors (the design
   file's hex values, set in ../adani3.css as --c-*), the tabs and legends, the measures' names and units.
   What is NOT: every figure is changed, plants are "Plant 1" to "Plant 7", departments are numbered, and
   no place is shown. Nothing here can be read back to the client's data.
   THE WEEKLY CHART IS THE DESIGN'S, NOT A CORRECTION OF IT. After a critique I redrew it with a hollow shortfall
   so the solid column was always the actual figure; his answer: "UX wise this is great. But this isn't our design."
   So it is back as designed: purple up to the lower of actual and target, a solid orange block for a shortfall or a
   green one for a surplus, a yellow bar at the target, the figures inside and the total on top. RULE: a redraw
   shows the design; an improvement belongs beside it, labelled as one, never in its place.
   (One strictness kept from the first redraw: a week is short OR over, never both, unlike the placeholder data.)
   Put back the same day for the same reason: a label on every point of the trend lines, the tab strips on the
   actual/budget panel and the regions' table (drawn as the design shows them, first tab chosen; they do not
   switch), left-aligned figures in both tables, and the arrow beside a variance of zero.
   Every figure shown is derived from one source, so parts sum to totals and percentages match their inputs.
   Each chart is followed by the same data as a table for screen readers (`Sr`).

   Every mark carries `data-tip`, the exact value the dashboard gives on hover; ./Live.tsx shows it. Colors
   are CSS variables so the library's theme switch can change them. */
const V = "var(--c-act)", SKY = "var(--c-bud)", O = "var(--c-short)", G = "var(--c-over)", Y = "var(--c-tar)", T = "#16b8b0", B = "#2a4bd7", Y2 = "#e5b000", AX = "var(--c-axis)", GRID = "var(--c-grid)";
const n = (v: number) => v.toLocaleString("en-US");

export const Panel = ({ tabs, title, legend, children, className = "" }: { tabs?: ReactNode; title?: string; legend?: ReactNode; children: ReactNode; className?: string }) => (
  <div className={`a3c ${className}`}>
    {tabs}
    {title && <p className="a3c-t">{title}</p>}
    {children}
    {legend}
  </div>
);
// The chart's data again as a table that only a screen reader meets: the picture's values are otherwise hover-only.
export const Sr = ({ cap, head, rows }: { cap: string; head: string[]; rows: (string | number)[][] }) => (
  // (In a block of its own: a table ignores a 1px width and would widen the page.)
  <div className="a3c-sr"><table><caption>{cap}</caption><thead><tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map((r, k) => <tr key={k}>{r.map((c, j) => j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>)}</tr>)}</tbody></table></div>
);
export const Tabs = ({ items }: { items: string[] }) => <div className="a3c-tabs" aria-hidden="true">{items.map((t, k) => <span key={t} className={k === 0 ? "is-on" : undefined}>{t}</span>)}</div>;
export const Legend = ({ items }: { items: [string, string][] }) => <ul className="a3c-leg" aria-hidden="true">{items.map(([t, c]) => <li key={t}><i style={{ background: c }} />{t}</li>)}</ul>;

// The plot's ground: dashed lines at each tick, the two axes with their arrowheads, the scale on the left.
function Ground({ x0, x1, y0, top, max, step, right = false }: { x0: number; x1: number; y0: number; top: number; max: number; step: number; right?: boolean }) {
  const y = (v: number) => y0 - (v / max) * (y0 - top), ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, k) => k * step);
  return (
    <g>
      {ticks.map((v) => <g key={v}>{v > 0 && <path d={`M${x0} ${y(v)}H${x1}`} stroke={GRID} strokeDasharray="3 3" />}<text x={x0 - 12} y={y(v) + 4} textAnchor="end" className="a3c-ax">{n(v)}</text>{right && <text x={x1 + 12} y={y(v) + 4} className="a3c-ax">{n(v)}</text>}</g>)}
      <path d={`M${x0} ${top - 14}V${y0}H${x1 + (right ? 0 : 12)}`} fill="none" stroke={AX} />
      <path d={`M${x0 - 3.5} ${top - 9}L${x0} ${top - 15}L${x0 + 3.5} ${top - 9}`} fill="none" stroke={AX} />
      {right ? <path d={`M${x1} ${top - 14}V${y0}M${x1 - 3.5} ${top - 9}L${x1} ${top - 15}L${x1 + 3.5} ${top - 9}`} fill="none" stroke={AX} /> : <path d={`M${x1 + 6} ${y0 - 3.5}L${x1 + 12} ${y0}L${x1 + 6} ${y0 + 3.5}`} fill="none" stroke={AX} />}
    </g>
  );
}

/* 1. Week by week against target. Purple is what was made, up to the target; the yellow line is the
   target; orange is what the week fell short by, green what it went over by. One chart serves every
   measure: the tabs change which one it shows (./Live.tsx). */
export type Measure = { tab: string; name: string; unit: string; max: number; step: number; weeks: [act: number, tar: number][]; ticks?: string[] };
export const MEASURES: Measure[] = [
  { tab: "Clink. Prod.", name: "Clinker production", unit: "Tons", max: 500, step: 100, weeks: [[300, 420], [370, 260], [340, 340], [280, 470], [410, 330]] },
  { tab: "Cem. Prod.", name: "Cement production", unit: "Tons", max: 500, step: 100, weeks: [[360, 340], [310, 380], [420, 400], [390, 390], [330, 410]] },
  { tab: "TSR", name: "TSR", unit: "%", max: 30, step: 5, weeks: [[19, 20], [22, 20], [21, 20], [17, 20], [23, 21]] },
  { tab: "Kiln Run. Hr.", name: "Kiln running hours", unit: "Hours", max: 200, step: 40, weeks: [[152, 160], [164, 160], [141, 160], [160, 160], [158, 150]] },
  { tab: "Kiln OEEN", name: "Kiln OEEN", unit: "%", max: 100, step: 20, weeks: [[81, 84], [86, 84], [84, 84], [78, 84], [88, 85]] },
];
const tk = (m: Measure, k: number) => m.ticks?.[k] ?? `Week ${k + 1}`;
export function WeeklyGap({ m = MEASURES[0], h = 340 }: { m?: Measure; h?: number }) {
  const x0 = 70, x1 = 920, y0 = h - 40, top = 40, bw = m.weeks.length > 5 ? 48 : 54, y = (v: number) => y0 - (v / m.max) * (y0 - top);
  return (
    <>
      <svg viewBox={`0 0 960 ${h}`} role="img" aria-label={`${m.name} for ${m.ticks ? "seven days" : "five weeks"} against target, in ${m.unit}: ${m.weeks.map(([a, t], k) => `${m.ticks ? tk(m, k) : `week ${k + 1}`} ${a === t ? "met target" : a < t ? `${t - a} short` : `${a - t} over`}`).join(", ")}. Figures are changed.`}>
        <Ground x0={x0} x1={x1} y0={y0} top={top} max={m.max} step={m.step} />
        {m.weeks.map(([act, tar], k) => {
          const x = x0 + (k + 0.5) * ((x1 - x0) / m.weeks.length) - bw / 2, low = Math.min(act, tar), hi = Math.max(act, tar), gap = hi - low, gh = y(low) - y(hi);
          return (
            <g key={k} data-tip={`${tk(m, k)}|Actual: ${act} ${m.unit}|Target: ${tar} ${m.unit}|Variance: ${act - tar > 0 ? "+" : ""}${act - tar}`}>
              <rect x={x - 14} y={top} width={bw + 28} height={y0 - top} fill="transparent" />
              <rect x={x} y={y(low)} width={bw} height={y0 - y(low)} fill={V} />
              {gap > 0 && <rect x={x} y={y(hi)} width={bw} height={gh} fill={act < tar ? O : G} />}
              <rect x={x} y={y(tar) - 2} width={bw} height="4" fill={Y} />
              <text x={x + bw / 2} y={y(low) + (y0 - y(low)) / 2 + 4} textAnchor="middle" className="a3c-in">{low}</text>
              {gh > 16 && <text x={x + bw / 2} y={y(hi) + gh / 2 + 5} textAnchor="middle" className="a3c-in">{gap}</text>}
              <text x={x + bw / 2} y={y(hi) - 9} textAnchor="middle" className="a3c-v">{hi}</text>
              <text x={x + bw / 2} y={y0 + 20} textAnchor="middle" className="a3c-ax">{tk(m, k)}</text>
            </g>
          );
        })}
      </svg>
      <Sr cap={`${m.name} by ${m.ticks ? "day" : "week"}, ${m.unit}`} head={[m.ticks ? "Day" : "Week", "Actual", "Target", "Variance"]} rows={m.weeks.map(([a, t], k) => [tk(m, k), a, t, a - t])} />
    </>
  );
}
export const LEG_WEEKLY: [string, string][] = [["Actual", V], ["Target", Y], ["Variance", O], ["Surplus Production", G]];

/* 2. Actual beside budget, month by month. */
const MONTHS: [string, number, number][] = [["Jan", 4900, 4500], ["Feb", 4700, 5100], ["Mar", 4400, 5300], ["Apr", 5200, 4600], ["May", 4800, 5000], ["Jun", 4300, 5400], ["Jul", 4600, 5200]];
export const TABS_LOGISTICS = ["Total Dispatch", "Sales", "TLC", "Primary Lead", "Direct Dispatch", "Rail", "Secondary", "Trade OET"];
export function ActualBudget() {
  const x0 = 80, x1 = 920, y0 = 300, top = 40, max = 6000, bw = 34, y = (v: number) => y0 - (v / max) * (y0 - top);
  return (
    <>
    <svg viewBox="0 0 960 340" role="img" aria-label="Dispatch for seven months, the actual figure beside the budget for each month. Figures are changed.">
      <Ground x0={x0} x1={x1} y0={y0} top={top} max={max} step={1000} />
      {MONTHS.map(([m, a, b], k) => {
        const c = x0 + (k + 0.5) * ((x1 - x0) / MONTHS.length);
        return (
          <g key={m} data-tip={`${m}|Actual: ${n(a)}|Budget: ${n(b)}|${a >= b ? "Over" : "Under"} budget by ${n(Math.abs(a - b))}`}>
            <rect x={c - bw - 12} y={top} width={bw * 2 + 24} height={y0 - top} fill="transparent" />
            <rect x={c - bw - 1} y={y(a)} width={bw} height={y0 - y(a)} fill={V} /><rect x={c + 1} y={y(b)} width={bw} height={y0 - y(b)} fill={SKY} />
            <text x={c - bw / 2 - 1} y={y(a) - 8} textAnchor="middle" className="a3c-v">{n(a)}</text><text x={c + bw / 2 + 1} y={y(b) - 8} textAnchor="middle" className="a3c-v">{n(b)}</text>
            <text x={c} y={y0 + 20} textAnchor="middle" className="a3c-ax">{m}</text>
          </g>
        );
      })}
    </svg>
    <Sr cap="Dispatch by month, actual and budget" head={["Month", "Actual", "Budget"]} rows={MONTHS.map(([m, a, b]) => [m, n(a), n(b)])} />
    </>
  );
}
export const LEG_BUDGET: [string, string][] = [["Actual", V], ["Budget", SKY]];

/* 3. Each plant now, with its own best ever as a line across. */
const PLANTS: [now: number, best: number][] = [[2900, 3200], [3400, 3900], [2300, 2900], [3100, 3300], [1100, 1900], [2950, 3100], [3150, 3400]];
export function BestEver() {
  const x0 = 62, x1 = 500, y0 = 300, top = 40, max = 5000, bw = 34, y = (v: number) => y0 - (v / max) * (y0 - top), cx = (k: number) => x0 + (k + 0.5) * ((x1 - x0) / PLANTS.length);
  return (
    <>
    <svg viewBox="0 0 560 340" role="img" aria-label="Seven plants as columns, with each plant's best-ever figure as a line above them. Plant 5 is furthest from its best. Figures and names are changed.">
      <Ground x0={x0} x1={x1} y0={y0} top={top} max={max} step={1000} right />
      <path d={PLANTS.map(([, best], k) => `${k ? "L" : "M"}${cx(k)} ${y(best)}`).join("")} fill="none" stroke={O} strokeWidth="2" />
      {PLANTS.map(([now, best], k) => (
        <g key={k} data-tip={`Plant ${k + 1}|Now: ${n(now)}|Best ever: ${n(best)}|${n(best - now)} below its best`}>
          <rect x={cx(k) - 30} y={top} width="60" height={y0 - top} fill="transparent" />
          <rect x={cx(k) - bw / 2} y={y(now)} width={bw} height={y0 - y(now)} fill={V} /><text x={cx(k)} y={y0 - 10} textAnchor="middle" className="a3c-in">{n(now)}</text><text x={cx(k)} y={y0 + 20} textAnchor="middle" className="a3c-ax">Plant {k + 1}</text>
          <circle cx={cx(k)} cy={y(best)} r="4" fill={O} /><text x={cx(k)} y={y(best) - 10} textAnchor="middle" className="a3c-v">{n(best)}</text>
        </g>
      ))}
    </svg>
    <Sr cap="Each plant now and its best ever" head={["Plant", "Now", "Best ever"]} rows={PLANTS.map(([now, best], k) => [`Plant ${k + 1}`, n(now), n(best)])} />
    </>
  );
}
export const LEG_BEST: [string, string][] = [["Selected plants", V], ["Individual best ever", O]];

/* 4. One quality measure for four plants over seven dates. A plant can be switched off in the legend. */
export const SERIES: [string, string, number[]][] = [["Plant 1", O, [31, 24, 26, 30, 27, 22, 21]], ["Plant 2", T, [20, 28, 25, 29, 23, 25, 24]], ["Plant 3", B, [15, 14, 15, 13, 14, 13, 14]], ["Plant 4", Y2, [9, 8, 9, 7, 9, 8, 8]]];
const DATES = ["01/01", "02/01", "03/01", "04/01", "05/01", "06/01", "07/01"];
// Every point carries its figure, as designed. Where the two upper lines cross, the higher one's figure sits above
// its point and the lower one's below, so the two never land on each other; the two lower lines read below.
const up = (s: number, k: number) => s === 0 ? SERIES[0][2][k] >= SERIES[1][2][k] : s === 1 && SERIES[1][2][k] > SERIES[0][2][k];
export function Trend({ off = [] }: { off?: number[] }) {
  const x0 = 56, x1 = 530, y0 = 300, top = 40, max = 50, y = (v: number) => y0 - (v / max) * (y0 - top), cx = (k: number) => x0 + 34 + k * ((x1 - x0 - 60) / 6);
  return (
    <>
    <svg viewBox="0 0 560 340" role="img" aria-label="One quality measure for four plants across seven dates, as four lines. Plant 1 falls over the period while Plants 3 and 4 hold steady. Figures and names are changed.">
      <Ground x0={x0} x1={x1} y0={y0} top={top} max={max} step={10} />
      {SERIES.map(([name, c, vs], s) => off.includes(s) ? null : (
        <g key={name}>
          <path d={vs.map((v, k) => `${k ? "L" : "M"}${cx(k)} ${y(v)}`).join("")} fill="none" stroke={c} strokeWidth="2" />
          {vs.map((v, k) => <g key={k} data-tip={`${name}|${DATES[k]}: ${v}%`}><circle cx={cx(k)} cy={y(v)} r="11" fill="transparent" /><circle cx={cx(k)} cy={y(v)} r="4" fill={c} /><text x={cx(k)} y={y(v) + (up(s, k) ? -9 : 19)} textAnchor="middle" className="a3c-pt">{v}%</text></g>)}
        </g>
      ))}
      {DATES.map((d, k) => <text key={d} x={cx(k)} y={y0 + 20} textAnchor="middle" className="a3c-ax">{d}</text>)}
    </svg>
    <Sr cap="One quality measure by plant and date, percent" head={["Plant", ...DATES]} rows={SERIES.map(([name, , vs]) => [name, ...vs])} />
    </>
  );
}

/* 5. A month-by-month trend: one series, every column labelled. */
const YEAR: [string, number][] = [["Jan", 138], ["Feb", 126], ["Mar", 97], ["Apr", 84], ["May", 71], ["Jun", 88], ["Jul", 109], ["Aug", 121], ["Sep", 93], ["Oct", 102], ["Nov", 82], ["Dec", 69]];
export function Monthly() {
  const x0 = 70, x1 = 920, y0 = 300, top = 40, max = 200, bw = 26, y = (v: number) => y0 - (v / max) * (y0 - top);
  return (
    <svg viewBox="0 0 960 340" role="img" aria-label="Sales for twelve months as columns: highest in January, lowest in December. Figures are changed.">
      <Ground x0={x0} x1={x1} y0={y0} top={top} max={max} step={50} />
      {YEAR.map(([m, v], k) => { const c = x0 + (k + 0.5) * ((x1 - x0) / YEAR.length); return <g key={m} data-tip={`${m}|Sales: ${v}`}><rect x={c - 26} y={top} width="52" height={y0 - top} fill="transparent" /><rect x={c - bw / 2} y={y(v)} width={bw} height={y0 - y(v)} fill="var(--c-one)" /><text x={c} y={y(v) - 8} textAnchor="middle" className="a3c-v">{v}</text><text x={c} y={y0 + 20} textAnchor="middle" className="a3c-ax">{m}</text></g>; })}
    </svg>
  );
}

/* 6. A total split into its shares: three donuts, one per count. */
const pt = (cx: number, cy: number, r: number, t: number) => [cx + r * Math.sin(t * 2 * Math.PI), cy - r * Math.cos(t * 2 * Math.PI)];
export function Donut({ shares, colors, label }: { shares: number[]; colors: string[]; label: string }) {
  let from = 0;
  return (
    <svg viewBox="0 0 280 210" role="img" aria-label={label}>
      {shares.map((s, k) => {
        const a = from, b = from + s / 100; from = b;
        const [x1, y1] = pt(140, 104, 62, a + 0.004), [x2, y2] = pt(140, 104, 62, b - 0.004), [lx, ly] = pt(140, 104, 98, (a + b) / 2);
        return <g key={k} data-tip={`Dept. ${k + 1}|${s}% of the total`}><path d={`M${x1.toFixed(2)} ${y1.toFixed(2)}A62 62 0 ${s > 50 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`} fill="none" stroke={colors[k]} strokeWidth="34" /><text x={lx} y={ly + 4} textAnchor="middle" className="a3c-v">{s}%</text></g>;
      })}
    </svg>
  );
}
export const DONUTS: { title: string; shares: number[]; colors: string[] }[] = [
  { title: "Headcount - Department Wise", shares: [38, 34, 28], colors: ["#d0408e", "#6a4bb3", "#4aa8ff"] },
  { title: "Hiring - Department Wise", shares: [42, 31, 27], colors: ["#f7c948", "#3d3d3d", T] },
  { title: "Turnover - Department Wise", shares: [36, 35, 29], colors: ["#58c400", "#e02fb3", "#ff9a4d"] },
];

/* 7. Growth against volume: one bubble per dealer, no names. */
const BUBBLES: [g: number, v: number, r: number][] = [[620, 9000, 13], [900, 14000, 16], [1180, 7000, 9], [1350, 21000, 22], [1600, 11000, 12], [1820, 26000, 15], [2100, 8000, 18], [2380, 12000, 10], [2600, 6000, 14], [2950, 9500, 11], [3200, 15000, 17], [3480, 5000, 9], [3700, 8000, 20], [3900, 4500, 12]];
export function Bubbles() {
  const x0 = 70, x1 = 920, y0 = 300, top = 40, max = 30000, y = (v: number) => y0 - (v / max) * (y0 - top), x = (g: number) => x0 + ((g - 400) / 3800) * (x1 - x0);
  return (
    <svg viewBox="0 0 960 340" role="img" aria-label="Growth against volume, one bubble per dealer: most dealers sit at low volume across the range of growth. Figures are changed and no dealer is named.">
      <Ground x0={x0} x1={x1} y0={y0} top={top} max={max} step={10000} />
      {[1000, 2000, 3000, 4000].map((g) => <g key={g}><path d={`M${x(g)} ${top}V${y0}`} stroke={GRID} /><text x={x(g)} y={y0 + 20} textAnchor="middle" className="a3c-ax">{n(g)}</text></g>)}
      {BUBBLES.map(([g, v, r], k) => <circle key={k} data-tip={`Dealer ${k + 1}|Growth: ${n(g)}|Volume: ${n(v)}`} cx={x(g)} cy={y(v)} r={r} fill="var(--c-over)" fillOpacity="0.72" />)}
      <text x={(x0 + x1) / 2} y={y0 + 36} textAnchor="middle" className="a3c-ax">Growth</text>
    </svg>
  );
}

/* 8 and 9 are tables: one plant's figures, and the regions' status. */
const PLANT: [string, string, number | string, number | string, number | string, number, boolean][] = [
  ["SACC", "Rs/Ton", 230, 225, 248, 23, false], ["STEC", "kcal/kg Clinker", 740, 760, 752, 8, true],
  ["Cement Production", "In Tons", 240, 260, 290, 30, true], ["Kiln OEEN", "%", "81%", "84%", "84%", 0, true],
];
export const PlantTable = () => (
  <div className="a3c a3t-plant">
    <p className="a3c-t">Plant 12 (MTD)</p>
    <div>{PLANT.map(([m, u, le, tar, act, vr, good]) => (
      <table key={m} aria-label={`${m}, ${u}. Figures changed.`}>
        <caption>{m} <small>({u})</small></caption>
        <thead><tr><th scope="col">LE</th><th scope="col">Target</th><th scope="col">Actual</th><th scope="col">Variance</th></tr></thead>
        <tbody><tr><td>{le}</td><td>{tar}</td><td><strong>{act}</strong></td><td className={vr === 0 ? undefined : good ? "is-good" : "is-bad"}><strong>{vr}</strong><svg viewBox="0 0 16 16" role="img" aria-label={vr === 0 ? "on target" : good ? "better than target" : "worse than target"}><path d={good ? "M8 12.500v-9M4 7.500l4-4 4 4" : "M8 3.500v9M4 8.500l4 4 4-4"} /></svg></td></tr></tbody>
      </table>
    ))}</div>
  </div>
);
// Region, this month to date, the same month last year, and the month's plan. Growth and the share of plan are worked out from them.
const REGIONS: [string, number, number, number][] = [["North", 1084.2, 1140.5, 1150.0], ["South", 512.6, 498.3, 520.0], ["West", 806.9, 842.0, 860.0], ["East", 1132.4, 1079.7, 1120.0], ["Central", 598.1, 571.2, 600.0]];
export const RegionTable = () => (
  <div className="a3c a3t-reg">
    <Tabs items={["Daily Status Report", "Revenue Mix Comparison"]} />
    <table aria-label="Daily status report by region. Figures are changed.">
      <thead><tr><th scope="col">Region</th><th scope="col">MTD Curren. Mth.</th><th scope="col">Lst. Yr. Same Mth.</th><th scope="col">YoY Growth %</th><th scope="col">Mth. Plan</th><th scope="col">Plan Ach.</th></tr></thead>
      <tbody>{REGIONS.map(([r, a, b, p]) => { const g = ((a - b) / b) * 100; return <tr key={r}><th scope="row">{r}</th><td>{a.toFixed(1)}</td><td>{b.toFixed(1)}</td><td className={g < 0 ? "is-bad" : "is-good"}>{g.toFixed(1)}%</td><td>{p.toFixed(1)}</td><td>{((a / p) * 100).toFixed(1)}%</td></tr>; })}</tbody>
    </table>
  </div>
);

/* 10. The tree's data: one quantity split five times. Each level splits its parent by fixed shares, so
   every branch can be opened (./Live.tsx draws it). Figures are made up; "K" as on the design. */
export const LEVELS: { dim: string; parts: [string, number][] }[] = [
  { dim: "Trade/Non-Trade", parts: [["NA", 0.495], ["TRADE", 0.416], ["NON-TRADE", 0.089]] },
  { dim: "Direct/Indirect", parts: [["Direct", 0.87], ["Indirect", 0.13]] },
  { dim: "Delivery Channel", parts: [["Primary", 0.75], ["Secondary", 0.25]] },
  { dim: "Transport Type", parts: [["Road", 0.6], ["Rail", 0.31], ["Ship", 0.09]] },
  { dim: "Package Type", parts: [["BAG", 0.77], ["Bulk", 0.23]] },
];
export const TREE_TOTAL = 81400;
export const fmtK = (v: number) => `${n(v)}K`;
// A parent split by shares into round hundreds that add up to it exactly (the largest part takes the remainder).
export function split(parent: number, shares: number[]) {
  const parts = shares.map((s) => Math.round((parent * s) / 100) * 100), big = shares.indexOf(Math.max(...shares));
  parts[big] += parent - parts.reduce((a, b) => a + b, 0);
  return parts;
}

/* 11. Volume by cluster and plant: an inner ring of the seven clusters, an outer ring of their 34 plants.
   Clusters and plants are numbered and every figure is changed (thousands; 7,400 in all). */
export const SUN: { name: string; c: string; t: string; plants: number[] }[] = [
  { name: "Cluster 1", c: "#1226a0", t: "#5b67bb", plants: [520, 410, 300, 260, 150, 140, 120, 100] },
  { name: "Cluster 2", c: "#6a0078", t: "#9a4d9f", plants: [330, 300, 290, 180, 100] },
  { name: "Cluster 3", c: "#e044a7", t: "#ea7fc0", plants: [400, 230, 190, 170, 110] },
  { name: "Cluster 4", c: "#e66f36", t: "#ee9a76", plants: [430, 200, 150, 90, 20, 10] },
  { name: "Cluster 5", c: "#7a4fc2", t: "#9f84d2", plants: [640, 180, 80] },
  { name: "Cluster 6", c: "#1690ff", t: "#5aacff", plants: [440, 210, 50] },
  { name: "Cluster 7", c: "#dcb400", t: "#e3cb52", plants: [330, 150, 70, 50] },
];
