"use client";

import { useEffect, useState } from "react";
import { peekDemoOtp } from "@/lib/widget/api";
import { T } from "./theme";

/**
 * The verification code, delivered the way it would actually arrive: as a
 * notification dropping in from the top of the phone. The sandbox cannot send
 * email, so the "email" lands here — same metaphor, honest mechanics.
 *
 * Renders only while a code exists; the widget's own verification logic is
 * untouched, so a wrong code still fails. pointer-events: none keeps the
 * header's own buttons clickable underneath it.
 */
export function DemoNotice() {
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    // The widget owns the OTP lifecycle; this only observes it.
    const t = setInterval(() => setCode(peekDemoOtp()), 400);
    return () => clearInterval(t);
  }, []);

  if (!code) return null;

  return (
    <>
      <style>{`
        /* Entrance: transform on the settle, opacity on the soft curve —
           design-taste's locked pair, referenced through the global tokens
           this route inherits. Never scale(0) and never past the target.
           translate3d keeps it on the compositor. */
        @keyframes hssNotifIn {
          from { transform: translate3d(0, -130%, 0); opacity: 0; }
          to   { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        .hss-notif {
          animation:
            hssNotifIn var(--dur-standard, 400ms) var(--ease-enter, cubic-bezier(0.22,1,0.36,1)) both;
        }
        /* Follow-through: the code line resolves just after the card lands —
           80ms, inside the 50–100ms window, so it reads as one event with a
           tail rather than two separate arrivals. */
        .hss-notif-body {
          animation:
            hssNotifBody var(--dur-quick, 200ms) var(--ease-enter-soft, cubic-bezier(0,0,0.2,1)) 80ms both;
        }
        @keyframes hssNotifBody {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        /* Reduced motion: same information, no travel. Opacity only, half
           duration — the prescribed equivalent, not a blanket kill. */
        @media (prefers-reduced-motion: reduce) {
          .hss-notif {
            animation: hssNotifBody 200ms var(--ease-enter-soft, cubic-bezier(0,0,0.2,1)) both;
          }
          .hss-notif-body { animation: none; }
        }
      `}</style>
      <div
        key={code}
        className="hss-notif"
        role="status"
        aria-live="polite"
        style={{
          position: "fixed",
          top: 10,
          left: 10,
          right: 10,
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          padding: "10px 12px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
          zIndex: 60,
          pointerEvents: "none",
          font: "400 12.5px/1.45 system-ui, sans-serif",
          color: T.ink,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: T.gold,
            color: T.teal,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            font: "700 15px/1 system-ui, sans-serif",
            flex: "none",
          }}
        >
          T
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <strong style={{ fontSize: 12.5 }}>Tara &mdash; verification code</strong>
            <span style={{ opacity: 0.5, fontSize: 11 }}>now</span>
          </div>
          <div className="hss-notif-body">
            Your code is <strong>{code}</strong>. The sandbox cannot send email, so it arrives
            here. A wrong code still fails.
          </div>
        </div>
      </div>
    </>
  );
}
