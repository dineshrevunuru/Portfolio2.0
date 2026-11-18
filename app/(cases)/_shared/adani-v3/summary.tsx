import { Arrow } from "../adani-v2/parts";
import { Ico } from "./icons";
import type { Measure } from "./charts";

/* The Leadership Summary's own parts, as designed (frame 505:2088 of the design file, measured 2026-11-17).
   His words on the cover that mixed the plant summary's tiles into this screen: "This isn't restored".
   So the tiles here are this screen's nine, in its order, rows and colors, each with its icon:
   three across, then four, then two beside the alarms. Kiln OEEN carries no arrow and no estimate or target,
   as on the design. EVERY FIGURE IS MADE UP and none is the design's; plants and clusters are numbered. */
export type LeadT = { name: string; unit: string; act: string; le?: string; tar?: string; good?: boolean; tone: string; icon: string };
export const LEAD: LeadT[] = [
  { name: "Clinker Production", unit: "Tons", act: "1540", le: "1700", tar: "1650", good: false, tone: "l-clk", icon: "clinkerProd" },
  { name: "Cement Production", unit: "Tons", act: "1320", le: "1250", tar: "1200", good: true, tone: "l-blue", icon: "cementProd" },
  { name: "Clinker Factor", unit: "%", act: "68%", le: "68%", tar: "67%", good: false, tone: "l-blue", icon: "clinkerFactor" },
  { name: "TSR", unit: "%", act: "21%", le: "19%", tar: "20%", good: true, tone: "l-tsr", icon: "tsr" },
  { name: "STEC", unit: "Kcal/Kg Clink", act: "742", le: "760", tar: "755", good: true, tone: "l-stec", icon: "stec" },
  { name: "SEEC Clin.", unit: "Kwh/T Clink", act: "63.4", le: "61", tar: "62", good: false, tone: "l-seec", icon: "seecClin" },
  { name: "SEEC Grind.", unit: "Kwh/T Cem", act: "31.0", le: "32", tar: "32", good: true, tone: "l-grey", icon: "seecGrind" },
  { name: "CFA/WFA", unit: "Mt", act: "1180", le: "1150", tar: "1100", good: true, tone: "l-purple", icon: "cfa" },
  { name: "Kiln OEEN", unit: "%", act: "84%", tone: "l-purple", icon: "kiln" },
];
export const LTile = ({ t }: { t: LeadT }) => (
  <div className={`ad-tile a3-lt ad-tile--${t.tone}`}>
    <span className="ad-tile-h"><Ico n={t.icon} /><span>{t.name} <small>({t.unit})</small></span></span>
    <span className="ad-tile-v"><small>Act. :</small><b>{t.act}</b>{t.good !== undefined && <Arrow good={t.good} />}</span>
    <span className="ad-tile-f">{t.le !== undefined && <><span>LE : {t.le}</span><span>Tar. : {t.tar}</span></>}</span>
  </div>
);

// The alarms tile: where, what, from when to when. The count matches the rows shown.
const ALARMS = [["Cluster 2 - Plant 7", "Kiln Down", "09:15 AM", "11:40 AM"], ["Cluster 5 - Plant 19", "Mill Down", "01:05 PM", "02:20 PM"], ["Cluster 1 - Plant 3", "Kiln Down", "03:10 PM", "05:25 PM"]];
export const Alarms = () => (
  <div className="a3s-alarm">
    <b><Ico n="bell" />Alarms <small>({ALARMS.length})</small></b>
    <table>
      <thead><tr><th scope="col">Plant</th><th scope="col">Issue Type</th><th scope="col">Time From</th><th scope="col">Time To</th></tr></thead>
      <tbody>{ALARMS.map((r) => <tr key={r[0]}>{r.map((c) => <td key={c}>{c}</td>)}</tr>)}</tbody>
    </table>
  </div>
);

// The side menu, drawn (it is not a control here): the second area is the one open.
const RAIL: [icon: string, top: number, width: number, on?: boolean][] = [["menu", 27, 20], ["grid", 85, 24], ["factory", 147, 25, true], ["bars", 213, 21], ["truck", 275, 27], ["people", 340, 24], ["doc1", 393, 17], ["doc2", 451, 17]];
export const Rail = () => (
  <div className="a3s-rail" aria-hidden="true">
    {RAIL.map(([n, top, w, on]) => <i key={n} className={on ? "is-on" : n === "menu" ? "is-menu" : undefined} style={{ top, width: w }}><Ico n={n} /></i>)}
  </div>
);

/* The chart under the tiles follows one measure day by day over the week to date, a tab per measure: the nine tabs
   are this screen's. The seven days of each measure add up (or average) to the figure on its tile above. */
const DAYS = ["Jan 17,23", "Jan 18,23", "Jan 19,23", "Jan 20,23", "Jan 21,23", "Jan 22,23", "Jan 23,23"];
const day = (tab: string, name: string, unit: string, max: number, step: number, act: number[], tar: number[]): Measure => ({ tab, name, unit, max, step, ticks: DAYS, weeks: act.map((a, k) => [a, tar[k]]) });
const flat = (v: number) => Array.from({ length: 7 }, () => v);
export const LEAD_MEASURES: Measure[] = [
  day("Clink. Prod.", "Clinker production", "Tons", 300, 100, [190, 268, 236, 150, 205, 262, 229], [236, 236, 236, 236, 236, 235, 235]),
  day("Cem. Prod.", "Cement production", "Tons", 300, 100, [182, 150, 205, 196, 172, 214, 201], [171, 171, 171, 171, 172, 172, 172]),
  day("Clink. Factor", "Clinker factor", "%", 100, 20, [67, 69, 68, 70, 66, 68, 68], flat(67)),
  day("TSR", "TSR", "%", 30, 10, [19, 22, 21, 18, 23, 22, 22], flat(20)),
  day("STEC", "STEC", "Kcal/Kg Clink", 1000, 200, [748, 739, 751, 760, 735, 738, 723], flat(755)),
  day("SEEC Clink.", "SEEC clinkering", "Kwh/T Clink", 80, 20, [63, 64, 62, 65, 63, 64, 63], flat(62)),
  day("SEEC Grind.", "SEEC grinding", "Kwh/T Cem", 40, 10, [31, 30, 32, 31, 33, 30, 30], flat(32)),
  day("CFA/WFA", "CFA/WFA", "Mt", 200, 50, [160, 175, 168, 150, 182, 171, 174], [157, 157, 157, 157, 157, 157, 158]),
  day("Kiln OEEN", "Kiln OEEN", "%", 100, 20, [81, 86, 84, 79, 88, 85, 85], flat(84)),
];
