import { Alarms, LEAD, LTile, Rail } from "../_shared/adani-v3/summary";
import { Ico } from "../_shared/adani-v3/icons";

/* SAVED FOR REUSE (2026-11-17). His words, after the hero went behind the Adani case study's lock: "Save this though
   for home page or elsewhere."
   The Leadership Summary's tiles in the screen's own frame: top bar, side menu, title, filters, the nine measures in
   the design's rows (three, four, two) and the alarms. EVERY FIGURE IS MADE UP; plants and clusters are numbered; no
   map, no chart, no logo, no user name. Nothing in it is the client's data, so it can sit on a public page.
   To use it anywhere:
     import { AdaniTiles } from ".../case/adani-v5/AdaniTiles";   and the styles: adani.css, adani3.css, adani5.css
     wrap it in an element with the classes "lv st--adani st--adani3 st--adani5" (they carry the colors and fonts).
   It is 1149px wide at true size and zooms down by window width; under 900px the tiles go two to a row, under 600px
   a row to swipe. Give it `className` to place it. Stills: t-portfolio-redo/proof/live-v44/case-adani-v5-hero*.png. */
export function AdaniTiles({ className = "" }: { className?: string }) {
  return (
    <div className={`a3s a5s ${className}`}>
        <div className="a3s-bar"><b>AAA Visualization</b><span>Theme:<i>Light<u /></i><Ico n="avatar" className="a3s-av" /><svg className="a3s-caret" viewBox="0 0 11 6" aria-hidden="true"><path d="M0 0h11L5.5 6z" /></svg></span></div>
        <Rail />
        <div className="a3s-main">
          <div className="a3s-head">
            <h3>Leadership Summary <small>(7 Cluster - 34 Plants) &nbsp;LE as on 23/01/2023</small></h3>
            <div className="a3p-filters"><div>{[["Cluster:", "All Clusters"], ["Plant:", "All Plants"], ["Date Range:", "WTD"]].map(([l, v]) => <span key={l}>{l}<b>{v}<svg viewBox="0 0 10 6" aria-hidden="true"><path d="M0 0h10L5 6z" /></svg></b></span>)}</div></div>
          </div>
          <div className="a3s-body">
            <div className="a3s-l">
              <div className="a3s-tiles">
                {LEAD.map((t) => <LTile key={t.name} t={t} />)}
                <Alarms />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
