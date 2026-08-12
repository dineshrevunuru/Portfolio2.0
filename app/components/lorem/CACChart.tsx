import { DATASETS, type ChartPoint, type DatasetId } from "./protocol";

const W = 560;
const H = 210;
// Generous top/bottom so alternating labels have room without clipping.
const PAD = { l: 44, r: 44, t: 52, b: 56 };

const DANGER = "#B42318";
const SUCCESS = "#15803D";
const NEUTRAL = "#727A86";

export interface CACChartProps {
  dataset?: DatasetId;
  caption?: string;
  className?: string;
}

/**
 * A narrative line chart for the canonical datasets in `protocol.ts`.
 *
 * Geometry is computed from the values, never hand-drawn. The previous version
 * encoded one story in fixed bezier paths with overridable labels — swap in a
 * true series and you got a "spike" drawn level with its own baseline, and an
 * endpoint below a target it exactly met. Labels and position can no longer
 * disagree, because only one of them exists.
 *
 * Segments colour themselves: rising cost is a loss, falling cost is a win.
 */
export function CACChart({ dataset = "cac", caption, className }: CACChartProps) {
  const ds = DATASETS[dataset];
  const pts: ChartPoint[] = [...ds.points];
  const target = ds.target;

  const values = [...pts.map((p) => p.value), target];
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  // 12% headroom so the extreme points never sit on the frame.
  const min = lo - span * 0.12;
  const max = hi + span * 0.12;

  const x = (i: number) =>
    PAD.l + (i / Math.max(1, pts.length - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) =>
    PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b);

  const fmt = (v: number) => (ds.unit === "$" ? `$${v}` : `${v}${ds.unit}`);

  return (
    <div className={className ? `lorem-cac ${className}` : "lorem-cac"}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`${caption ?? ds.caption}. ${pts
          .map((p) => `${p.label}: ${fmt(p.value)}`)
          .join(", ")}. Target ${fmt(target)}.`}
      >
        <text x={PAD.l} y="18" className="caclab">
          {caption ?? ds.caption}
        </text>

        {/* Target — drawn at its true value, so "met" looks met. */}
        <line
          x1={PAD.l}
          y1={y(target)}
          x2={W - PAD.r}
          y2={y(target)}
          stroke="#AEB4BE"
          strokeDasharray="4 5"
          strokeWidth="1.5"
        />
        {/* Anchored left: the final point usually lands at or near the target,
            and a right-anchored label collided with it every time. */}
        <text x={PAD.l} y={y(target) - 8} textAnchor="start" className="caclab">
          target {fmt(target)}
        </text>

        {/* One segment per interval, coloured by direction. */}
        {pts.slice(1).map((p, i) => {
          const prev = pts[i];
          const worse = p.value > prev.value;
          return (
            <line
              key={`seg-${i}`}
              x1={x(i)}
              y1={y(prev.value)}
              x2={x(i + 1)}
              y2={y(p.value)}
              stroke={worse ? DANGER : i === 0 ? NEUTRAL : SUCCESS}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })}

        {pts.map((p, i) => {
          const prev = pts[i - 1];
          const colour =
            i === 0 ? NEUTRAL : p.value > (prev?.value ?? p.value) ? DANGER : SUCCESS;
          // Alternate above/below so neighbouring labels can never overlap —
          // point spacing is fixed but label width is not, so side-by-side
          // placement collides as soon as a caption runs long.
          const above = i % 2 === 0;
          const vy = above ? y(p.value) - 26 : y(p.value) + 20;
          const anchor = i === 0 ? "start" : i === pts.length - 1 ? "end" : "middle";
          return (
            <g key={`pt-${i}`}>
              <circle cx={x(i)} cy={y(p.value)} r="4.5" fill={colour} />
              <text
                x={x(i)}
                y={vy}
                textAnchor={anchor}
                className={
                  colour === DANGER ? "caclab hot" : colour === SUCCESS ? "caclab win" : "caclab"
                }
                style={{ fontWeight: 600 }}
              >
                {fmt(p.value)}
              </text>
              <text x={x(i)} y={vy + 13} textAnchor={anchor} className="caclab">
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
