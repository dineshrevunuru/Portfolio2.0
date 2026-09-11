"use client";
// Dependency-free tabs with the same data-slot / data-active contract the
// concept's CSS targets (it was written against Base UI's Tabs).
import { createContext, useContext, useId, type KeyboardEvent, type ReactNode } from "react";

type Ctx = { value: string; set: (v: string) => void; id: string };
const TabsCtx = createContext<Ctx | null>(null);
const use = () => {
  const c = useContext(TabsCtx);
  if (!c) throw new Error("Tabs.* must be inside <Tabs>");
  return c;
};

export function Tabs({ value, onValueChange, children, className }: {
  value: string; onValueChange: (v: string) => void; children: ReactNode; className?: string;
}) {
  const id = useId();
  return (
    <TabsCtx.Provider value={{ value, set: onValueChange, id }}>
      <div data-slot="tabs" data-orientation="horizontal" className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ children, className, variant, ...rest }: {
  children: ReactNode; className?: string; variant?: "line" | "default"; "aria-label"?: string;
}) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const i = tabs.findIndex((t) => t === document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const n = e.key === "ArrowRight" ? (i + 1) % tabs.length
      : e.key === "ArrowLeft" ? (i - 1 + tabs.length) % tabs.length
      : e.key === "Home" ? 0 : tabs.length - 1;
    tabs[n].focus();
    tabs[n].click();
  };
  return (
    <div role="tablist" data-slot="tabs-list" data-variant={variant ?? "default"} className={className} onKeyDown={onKeyDown} {...rest}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const { value: cur, set, id } = use();
  const active = cur === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${id}-tab-${value}`}
      aria-selected={active}
      aria-controls={`${id}-panel-${value}`}
      tabIndex={active ? 0 : -1}
      data-slot="tabs-trigger"
      {...(active ? { "data-active": "" } : {})}
      className={className}
      onClick={() => set(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className, hidden }: { value: string; children: ReactNode; className?: string; hidden?: boolean }) {
  const { value: cur, id } = use();
  if (cur !== value) return null;
  return (
    <div role="tabpanel" id={`${id}-panel-${value}`} aria-labelledby={`${id}-tab-${value}`} tabIndex={0} data-slot="tabs-content" className={className} hidden={hidden}>
      {children}
    </div>
  );
}
