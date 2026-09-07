import Image from "next/image";
import type {ReactNode} from "react";
import styles from "./review-styles.module.css";
import prototypeStyles from "./Prototype.module.css";
import RecoveryVideo from "./V1Video";
import Source from "./Source";
const IMG="/images/publix-the-trip";
const PROTOTYPE="/publix-prototype/index.html";
function Chapter({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
  return <section id={id} className={styles.chapter}><div className={styles.intro}><p className={styles.eyebrow}>{number}</p><h2>{title}</h2></div>{children}</section>;
}
function Copy({ children }: { children: ReactNode }) { return <div className={styles.copy}>{children}</div>; }
function Phone({file,alt,listing=false}:{file:string;alt:string;listing?:boolean}){
if(file==="after-trip.png")return <RecoveryVideo kind="attention"/>;
if(file==="after-map.png")return <RecoveryVideo kind="control"/>;
const src=listing?"/images/publix-the-trip-v3/official-shopping-list.png":"/images/publix-the-trip-v3/screens/state-entrance.png";
return <a className={listing?styles.listing:styles.phone} href={src} target="_blank" rel="noreferrer"><Image src={src} alt={alt} width={listing?1206:780} height={listing?2622:1688} sizes="300px"/></a>;
}

export function V1Journey(){return <div className={styles.page}><section className={styles.chapter}>      <div className={styles.subhead}><h3>Customer journey</h3><p>The existing experience, reconstructed from public references. Actions, friction, and emotions are hypotheses to investigate.</p></div>
      <figure style={{margin:"32px 0"}}>
        <a href={`${IMG}/customer-journey.png`} target="_blank" rel="noreferrer" aria-label="Enlarge the customer journey map"><img src={`${IMG}/customer-journey.png`} alt="Customer journey map: Prepare, Arrive, Shop, Recover, Finish. Actions and touchpoints sit above an inferred emotional curve from prepared through orienting, concentrating and uncertain, to relieved if complete. Friction includes list completeness, encounter order, rescanning, unresolved items and final checking. These are hypotheses, not field observations." loading="lazy" style={{display:"block",width:"100%",height:"auto"}} /></a>
        <figcaption className={styles.caption}>Select to enlarge. Sources informing the map: <Source n={1} /><Source n={2} /><Source n={4} /><Source n={5} /></figcaption>
      </figure>
</section></div>;}
export function V1Exploration(){return <div className={styles.page}>    <Chapter id="exploration" number="03 / Explore" title="Four ways to turn a list into a trip.">
      <Copy><p>I compared four ways to present the same location groups. Now, Next, Later offered focus without hiding the rest of the trip.</p></Copy>
      <div className={styles.concepts}>{[
        {name:"Quiet Reorder",type:"list",parts:["Produce","Deli","Aisle 1","Aisle 3"],benefit:"The familiar list rearranges into a suggested sequence.",trade:"Low learning cost, but still asks for a long scan."},
        {name:"Store Chapters",type:"chapters",parts:["Produce · 2 items","Deli ›","Aisles ›"],benefit:"Departments become expandable chapters.",trade:"Keeps context, but adds opening and closing work."},
        {name:"Now, Next, Later",type:"focus",parts:["Now · Produce","Next · Deli","Later · remaining stops"],benefit:"One active stop, a preview, and the remainder within reach.",trade:"Chosen for a clear next action; must retain whole-list access."},
        {name:"Pleasant Stops",type:"steps",parts:["Stop 1 of 9","Produce","Continue →"],benefit:"A guided itinerary with explicit progress.",trade:"Strong progression, with a risk of feeling too rigid."},
      ].map((c,i)=><div className={`${styles.concept} ${i===2?styles.chosen:""}`} key={c.name}><span className={styles.tag}>{i===2?"Selected direction":"Exploration"}</span><div className={`${styles.wire} ${styles[c.type]}`} aria-label={`${c.name} schematic`}>{c.parts.map(p=><span key={p}>{p}</span>)}</div><h3>{c.name}</h3><p>{c.benefit}</p><p className={styles.tradeoff}>{c.trade}</p></div>)}</div>
      <p className={styles.caption}>Schematics reconstructed from exploration notes; not user-tested.</p>
      <div className={styles.subhead}><h3>Two revisions that clarified the interaction</h3></div>
      <ol className={styles.decisions}><li><span>01</span><div><h4>From a fixed start to an explicit origin</h4><p>The prototype asks which entrance the shopper used. That exposes an assumption for testing.</p></div></li><li><span>02</span><div><h4>From a drawn route to selectable stops</h4><p>The early dashed path implied spatial precision the sample layout could not support. The map became a way to inspect and select a stop.</p></div></li></ol>
    </Chapter>

</div>;}
export function V1Comparison(){return <div className={styles.page}><section className={styles.chapter}>      <div className={styles.comparison}><figure><span className={styles.screenLabel}>Existing · Publix&rsquo;s public App Store screen</span><Phone file="official-shopping-list.png" alt="Publix&#39;s public App Store shopping-list screenshot with aisle groups, checkboxes, and add-item control" listing /><figcaption>Location groups, check-off, and the add-item action.</figcaption></figure><div className={styles.comparisonMiddle}><span aria-hidden="true">→</span><h3>Extend what<br />already works</h3><p>Add a trip entry point.<br />Preserve the list.</p></div><figure><span className={styles.screenLabel}>Proposed · The Trip</span><Phone file="after-list.png" alt="Proposed trip entry point with sample entrance selector" /><figcaption>Entrance choice and a Start my trip action.</figcaption></figure></div>
</section></div>;}
export function V1Videos(){return <div className={styles.page}><section className={styles.chapter}>      <div className={styles.productRow}><div className={styles.productScreen}><Phone file="after-trip.png" alt="Now Next Later trip interface with active Produce items" /></div><div className={styles.annotations}><p className={styles.eyebrow}>Decision 01 / Attention</p><h3>Give the current stop room to work.</h3>{[["Now","The active items","The shopper sees the products they can collect at this stop."],["Next","A little orientation","The following stop stays visible, so focus does not become tunnel vision."],["Later","The remainder stays reachable","Whole-trip access keeps the full sequence available when the suggestion does not fit."]].map(([n,t,p])=><div className={styles.focusNote} key={n}><span>{n}</span><div><h4>{t}</h4><p>{p}</p></div></div>)}<p className={styles.caption}>Less repeated scanning is the intended benefit. It still needs to be measured.</p></div></div>
      <div className={`${styles.productRow} ${styles.reverse}`}><div className={styles.productScreen}><Phone file="after-map.png" alt="Illustrative whole-trip map with selectable departments and aisle locations" /></div><div className={styles.annotations}><p className={styles.eyebrow}>Decision 02 / Control</p><h3>Let the shopper change the plan.</h3><p>The map gives the shopper another way to inspect a location and choose <strong>Shop this stop next</strong>. Switching the entrance recomposes what remains while preserving collected items.</p><div className={styles.callout}><h4>Selection is different from commitment</h4><p>Tapping a stop previews its items. The explicit action makes that stop the next focus.</p></div><p>The sample map demonstrates the interaction. Real store geometry, entrance recognition, and a useful sequence would need validation before production.</p></div></div>
      <div className={styles.productRow}><div className={styles.productScreen}><RecoveryVideo /></div><div className={styles.annotations}><p className={styles.eyebrow}>Decision 03 / Recovery</p><h3>An unresolved item stays part of the trip.</h3><p><strong>Couldn’t find it?</strong> preserves the item for another look. It does not mark it collected or infer that the store has none.</p><p><strong>Look again</strong> returns it to active shopping. Undo restores the earlier state, so an accidental action does not erase the shopper’s intent.</p><div className={styles.callout}><h4>Completion has a clear meaning</h4><p>Collected, remaining, and to revisit must reconcile. An incomplete trip keeps its unresolved items visible.</p></div></div></div>
</section></div>;}
export function V1States(){return <div className={styles.page}><section className={styles.chapter}>      <div className={styles.subhead}><h3>The state model behind the screens</h3><p>The same item state feeds the focused stop, whole-trip list, map, and completion summary.</p></div>
      <div className={styles.recoveryModel}>
        <div className={styles.recoverySummary}><div><span className={styles.tag}>Illustrative example</span><h4>One item still needs a look.</h4><p>9 collected + 1 to revisit = an open trip.</p></div><div className={styles.tallyMarks} role="img" aria-label="Nine collected items and one unresolved item">{Array.from({length:10},(_,i)=><span key={i} className={i===9?styles.unresolvedMark:undefined}>{i===9?"?":"✓"}</span>)}</div></div>
        <div className={styles.states}><div><span className={styles.stateSymbol} aria-hidden="true">○</span><span className={styles.tag}>Remaining</span><h4>Ready to collect</h4><p>Collect → Collected<br />Couldn’t find it? → To revisit</p></div><div><span className={styles.stateSymbol} aria-hidden="true">↶</span><span className={styles.tag}>To revisit</span><h4>Keep it in the trip</h4><p>Look again → Remaining<br />Collect → Collected</p></div><div><span className={styles.stateSymbol} aria-hidden="true">✓</span><span className={styles.tag}>Collected</span><h4>Confirmed by the shopper</h4><p>Uncheck → Remaining<br />Undo → Previous state</p></div></div>
        <p className={styles.modelNote}>Every item has one state. Only collecting the final item completes the list.</p>
      </div>
</section></div>;}
export function V1Prototype(){return <div className={styles.page}>    <Chapter id="prototype" number="05 / Prototype" title="Try The Trip.">
      <Copy><p>One sample store, ten items. Try changing course without losing progress.</p></Copy>
      <div className={styles.demoTasks}><span>1. Choose an entrance</span><span>2. Collect or defer an item</span><span>3. Choose another stop</span><span>4. Undo a change</span></div>
      <div className={styles.prototypeFrame}><div className={styles.prototypeBar}><span>Interactive concept · sample data</span></div><div className={prototypeStyles.viewport}><iframe src={`${PROTOTYPE}?embed=1`} title="The Trip interactive shopping prototype" loading="lazy" className={prototypeStyles.iframe}>Your browser cannot display the embedded prototype. Use the link below to open it in a new tab.</iframe></div></div>
      <p className={styles.caption}>Trip behavior is operable. Account, search, and other surrounding app controls are outside the prototype’s scope.</p>
      <p className={prototypeStyles.caption}>Live prototype. If the embed doesn&rsquo;t load,{" "}<a href={PROTOTYPE} target="_blank" rel="noopener noreferrer">open it in a new tab ↗</a>.</p>
    </Chapter>

</div>;}
