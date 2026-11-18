"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* A picture that draws itself when it comes on screen: it gets "is-seen" once, and its parts take
   their places in turn (story.css, --i). With reduced motion it is simply there. */
export default function Seen({ className = "", at = 0.35, children }: { className?: string; at?: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null), [seen, setSeen] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: at });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, [at]);
  return <div ref={ref} className={`${className}${seen ? " is-seen" : ""}`}>{children}</div>;
}
