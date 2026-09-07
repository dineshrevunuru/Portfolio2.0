"use client";
import styles from "./publix-case-study.module.css";
export default function Source({n}:{n:number}) {
  return <a className={styles.sourceRef} href={`#source-${n}`} aria-label={`Source ${n}`} onClick={()=>{
    const target=document.getElementById(`source-${n}`);
    let parent=target?.parentElement;
    while(parent){if(parent instanceof HTMLDetailsElement)parent.open=true;parent=parent.parentElement;}
    requestAnimationFrame(()=>target?.scrollIntoView({block:"center"}));
  }}>[{n}]</a>;
}
