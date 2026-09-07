"use client";
import {useState} from "react";
import styles from "./StoreMap.module.css";

const inventory:Record<string,string[]>={Produce:["Bananas","Lemons"],Deli:["Publix Chicken Tender Sub, Whole"],Bakery:["Publix Bakery French Bread"],"Aisle 1":["Publix Coffee, Ground, Light Roast, Breakfast Blend"],"Aisle 3":["Publix Bread Crumbs, Plain"],"Aisle 4":["Publix Tomatoes, Diced"],"Aisle 7":["Publix Pasta, Penne Rigate"],Dairy:["Publix Milk, Whole, Grade A"]};
export default function MapDemo(){
 const [selected,select]=useState("Produce");
 const [focus,setFocus]=useState("Produce");
 const items=inventory[selected]||[];
 const color=(name:string)=>name===focus?"#004C2A":inventory[name]?"#D5E6CF":"#F2F3F1";
 const keys=(event:React.KeyboardEvent,name:string)=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();select(name);}};
 const zone=(name:string,x:number,y:number,w:number,h:number)=> <g key={name} role="button" tabIndex={0} aria-label={`Show ${name} items`} aria-pressed={selected===name} onClick={()=>select(name)} onKeyDown={e=>keys(e,name)} className={styles.stop}><rect x={x} y={y} width={w} height={h} rx="8" fill={color(name)} stroke={selected===name?"#2D810E":"#CCD4CE"} strokeWidth={selected===name?3:1}/><text x={x+w/2} y={y+h/2+5} textAnchor="middle" fill={name===focus?"white":"#1D2F28"} fontSize="16" transform={name==="Frozen"?`rotate(90 ${x+w/2} ${y+h/2})`:undefined}>{name}</text></g>;
 return <section className={styles.section} id="interactive-map">
  <header><p className={styles.eyebrow}>The interaction idea</p><h2>Explore the trip on the map.</h2><p>Select a stop to inspect its items. Choose <strong>Shop this stop next</strong> to change focus.</p></header>
  <div className={styles.stage}>
   <div><svg className={styles.map} viewBox="0 0 640 460" role="group" aria-label="Interactive sample store map">
    <rect x="8" y="8" width="624" height="410" rx="16" fill="white" stroke="#CBD3CD"/>
    <text x="320" y="32" textAnchor="middle" fill="#637168" fontSize="12" letterSpacing="2">Back of store</text>
    {zone("Dairy",188,44,362,42)}{zone("Bakery",24,108,126,64)}{zone("Deli",24,200,126,64)}{zone("Produce",24,300,126,74)}{zone("Frozen",570,108,46,246)}
    <text x="370" y="104" textAnchor="middle" fontSize="11" fill="#637168">Cross aisle</text>
    {Array.from({length:13},(_,n)=><rect key={n} x={181+n*29} y="148" width="9" height="175" rx="3" fill="#DADFDA"/>)}
    {Array.from({length:12},(_,i)=>{const name="Aisle "+(i+1),x=190+i*29;return <g key={name} role="button" tabIndex={0} aria-label={`Show ${name} items`} aria-pressed={selected===name} onClick={()=>select(name)} onKeyDown={e=>keys(e,name)} className={styles.stop}><rect x={x} y="148" width="20" height="175" rx="3" fill={color(name)} stroke={selected===name?"#2D810E":"none"} strokeWidth="2"/><text x={x+10} y="136" textAnchor="middle" fontSize="14" fill="#1D2F28">{i+1}</text></g>;})}
    <text x="370" y="345" textAnchor="middle" fontSize="11" fill="#637168">Cross aisle</text><rect x="220" y="364" width="302" height="34" rx="6" fill="#ECEFEC"/><text x="371" y="386" textAnchor="middle" fontSize="15" fill="#637168">Checkout</text>
    <path d="M48 418h80 M552 418h64" stroke="white" strokeWidth="6"/><text x="88" y="444" textAnchor="middle" fontSize="14" fill="#637168">Main entrance</text><text x="550" y="444" textAnchor="middle" fontSize="14" fill="#637168">Side entrance</text>
   </svg><p className={styles.legend}>Dark green: current focus · Light green: list items · Gray: shelves or no list items</p></div>
   <aside className={styles.detail} aria-live="polite" aria-atomic="true"><p className={styles.eyebrow}>{selected===focus?"Shopping now":"Selected stop"}</p><h3>{selected}</h3>{items.length?<><p>{items.length} {items.length===1?"item":"items"} on the sample list</p><ul>{items.map(item=><li key={item}>{item}</li>)}</ul><button aria-disabled={selected===focus} onClick={()=>{if(selected!==focus)setFocus(selected);}}>{selected===focus?"Shopping here now":"Shop this stop next"}</button></>:<p>No items on the sample list at this stop.</p>}<p className={styles.note}>Selecting a stop previews it. Changing focus does not collect anything.</p></aside>
  </div>
  <p className={styles.footnote}>Sample layout, not a real floor plan or live navigation. This standalone demonstration does not change the prototype below.</p>
 </section>;
}
