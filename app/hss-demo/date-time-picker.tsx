'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAvailability, type Slot } from '@/lib/widget/api';
import { T } from './theme';
import {
  laToday, maxDate, toDateString, startOfWeek, addDays, buildWeek, buildMonth,
  fmtTime, laHour, fmtDayLabel, DAY_HEADERS, MONTH_NAMES,
} from './dates';

export function DateTimePicker({ serviceId, staffId, onPick, context }: { serviceId: string; staffId?: string; onPick: (slot: Slot, dateLabel: string) => void; context?: string }) {
  const today = useMemo(() => laToday(), []);
  const max = useMemo(() => maxDate(today), [today]);

  const [date, setDate] = useState<string>(today);
  const [expanded, setExpanded] = useState(false);
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const [y, m, d] = today.split('-').map(Number);
    return startOfWeek(new Date(y, m - 1, d));
  });
  const [vYear, setVYear] = useState(() => Number(today.split('-')[0]));
  const [vMonth, setVMonth] = useState(() => Number(today.split('-')[1]) - 1);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAvailability(serviceId, date, staffId)
      .then((s) => { if (!cancelled) setSlots(s); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [serviceId, date, staffId]);

  const week = useMemo(() => buildWeek(weekStart, today, max), [weekStart, today, max]);
  const month = useMemo(() => buildMonth(vYear, vMonth, today, max), [vYear, vMonth, today, max]);

  const morning = slots.filter((s) => laHour(s.slot_start) < 12);
  const afternoon = slots.filter((s) => { const h = laHour(s.slot_start); return h >= 12 && h < 17; });
  const evening = slots.filter((s) => laHour(s.slot_start) >= 17);

  const pick = (d: string) => { setDate(d); const [y, m, dd] = d.split('-').map(Number); setWeekStart(startOfWeek(new Date(y, m - 1, dd))); };

  const title = expanded ? `${MONTH_NAMES[vMonth]} ${vYear}` : (() => {
    const mid = toDateString(addDays(weekStart, 3));
    return `${MONTH_NAMES[Number(mid.split('-')[1]) - 1]} ${mid.split('-')[0]}`;
  })();

  const prevMonth = () => { if (vMonth === 0) { setVYear((y) => y - 1); setVMonth(11); } else setVMonth((m) => m - 1); };
  const nextMonth = () => { if (vMonth === 11) { setVYear((y) => y + 1); setVMonth(0); } else setVMonth((m) => m + 1); };
  const prevWeek = () => setWeekStart((w) => addDays(w, -7));
  const nextWeek = () => setWeekStart((w) => addDays(w, 7));

  const Group = ({ label, items }: { label: string; items: Slot[] }) =>
    items.length === 0 ? null : (
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {items.map((s) => (
            <button key={s.slot_start} onClick={() => onPick(s, `${fmtDayLabel(date)} at ${fmtTime(s.slot_start)}`)} style={st.slot}>
              {fmtTime(s.slot_start)}
            </button>
          ))}
        </div>
      </div>
    );

  return (
    <div style={st.card}>
      {context && (
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.teal, flexShrink: 0 }} />
          {context}
        </div>
      )}
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <button onClick={() => setExpanded((e) => !e)} style={st.titleBtn}>
          {title} <span style={{ fontSize: 12 }}>{expanded ? '▲' : '▼'}</span>
        </button>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={expanded ? prevMonth : prevWeek} style={st.nav}>←</button>
          <button onClick={expanded ? nextMonth : nextWeek} style={st.nav}>→</button>
        </div>
      </div>

      {/* week strip */}
      {!expanded && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {week.map((d) => {
            const sel = d.date === date;
            return (
              <button key={d.date} disabled={!d.selectable} onClick={() => pick(d.date)}
                style={{ ...st.weekCell, ...(sel ? st.weekCellSel : {}), ...(d.selectable ? {} : st.disabled) }}>
                <span style={{ fontSize: 11, color: sel ? T.white : T.muted }}>{d.abbr}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: sel ? T.white : (d.isToday ? T.teal : T.ink) }}>{d.dayNum}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* month grid */}
      {expanded && (
        <div>
          <div style={{ display: 'flex' }}>
            {DAY_HEADERS.map((a) => <div key={a} style={st.monthHead}>{a}</div>)}
          </div>
          {month.map((wk, i) => (
            <div key={i} style={{ display: 'flex' }}>
              {wk.map((d, j) => {
                const sel = d.date === date;
                return (
                  <button key={j} disabled={d.padding || !d.selectable}
                    onClick={() => d.date && pick(d.date)}
                    style={{ ...st.monthCell, ...(d.padding ? { visibility: 'hidden' as const } : {}) }}>
                    <span style={{ ...st.monthCircle, ...(sel ? st.monthCircleSel : {}), color: sel ? T.white : (!d.selectable ? T.faint : (d.date === today ? T.teal : T.ink)) }}>
                      {d.dayNum}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: 11, color: T.muted, textAlign: 'center', margin: '14px 0 10px' }}>
        Times shown in Pacific Time
      </div>
      <div style={{ fontWeight: 600, fontSize: 15, color: T.ink, marginBottom: 12 }}>{fmtDayLabel(date)}</div>

      {/* slots */}
      {loading ? (
        <div style={{ color: T.muted, fontSize: 14, padding: '12px 0' }}>Loading times&hellip;</div>
      ) : slots.length === 0 ? (
        <div style={{ color: T.muted, fontSize: 14, padding: '8px 0' }}>No open times that day &mdash; try another.</div>
      ) : (
        <>
          <Group label="Morning" items={morning} />
          <Group label="Afternoon" items={afternoon} />
          <Group label="Evening" items={evening} />
        </>
      )}
    </div>
  );
}

const st: Record<string, React.CSSProperties> = {
  card: { border: `1px solid ${T.line}`, borderRadius: 14, padding: 16, background: T.white },
  titleBtn: { background: 'none', border: 'none', fontWeight: 600, fontSize: 15, color: T.ink, cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 6 },
  nav: { width: 34, height: 34, borderRadius: 8, border: 'none', background: T.bone, color: T.ink, cursor: 'pointer', fontSize: 14 },
  weekCell: { flex: 1, margin: '0 1px', padding: '7px 0', borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minHeight: 48 },
  weekCellSel: { background: T.teal },
  disabled: { opacity: 0.3, cursor: 'default' },
  monthHead: { flex: 1, textAlign: 'center', fontSize: 11, color: T.muted, padding: '4px 0' },
  monthCell: { flex: 1, height: 40, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  monthCircle: { width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500 },
  monthCircleSel: { background: T.teal },
  slot: { padding: '11px 14px', borderRadius: 10, border: `1px solid ${T.line}`, background: T.white, color: T.ink, fontSize: 14, fontWeight: 600, cursor: 'pointer', minWidth: 84, minHeight: 44, boxSizing: 'border-box' },
};
