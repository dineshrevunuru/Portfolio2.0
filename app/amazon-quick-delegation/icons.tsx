// Local copies of the 16 Lucide icons the concept uses (ISC-licensed path data
// from lucide-react 1.x). Kept inline so the portfolio adds no dependency.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function make(name: string, nodes: [string, Record<string, string>][]) {
  function Icon({ size = 24, ...rest }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`lucide lucide-${name}`}
        aria-hidden="true"
        {...rest}
      >
        {nodes.map(([tag, attrs], i) => {
          const Tag = tag as "path";
          return <Tag key={i} {...attrs} />;
        })}
      </svg>
    );
  }
  Icon.displayName = name;
  return Icon;
}

export const ArrowUp = make("arrow-up", [["path", { d: "m5 12 7-7 7 7" }], ["path", { d: "M12 19V5" }]]);
export const Check = make("check", [["path", { d: "M20 6 9 17l-5-5" }]]);
export const ChevronRight = make("chevron-right", [["path", { d: "m9 18 6-6-6-6" }]]);
export const CircleAlert = make("circle-alert", [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }],
]);
export const CirclePause = make("circle-pause", [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["line", { x1: "10", x2: "10", y1: "15", y2: "9" }],
  ["line", { x1: "14", x2: "14", y1: "15", y2: "9" }],
]);
export const FileText = make("file-text", [
  ["path", { d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5" }],
  ["path", { d: "M10 9H8" }],
  ["path", { d: "M16 13H8" }],
  ["path", { d: "M16 17H8" }],
]);
export const Hash = make("hash", [
  ["line", { x1: "4", x2: "20", y1: "9", y2: "9" }],
  ["line", { x1: "4", x2: "20", y1: "15", y2: "15" }],
  ["line", { x1: "10", x2: "8", y1: "3", y2: "21" }],
  ["line", { x1: "16", x2: "14", y1: "3", y2: "21" }],
]);
export const History = make("history", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
  ["path", { d: "M3 3v5h5" }],
  ["path", { d: "M12 7v5l4 2" }],
]);
export const LockKeyhole = make("lock-keyhole", [
  ["circle", { cx: "12", cy: "16", r: "1" }],
  ["rect", { x: "3", y: "10", width: "18", height: "12", rx: "2" }],
  ["path", { d: "M7 10V7a5 5 0 0 1 10 0v3" }],
]);
export const Pause = make("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1" }],
]);
export const PanelLeft = make("panel-left", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M9 3v18" }],
]);
export const Play = make("play", [
  ["path", { d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" }],
]);
export const RotateCcw = make("rotate-ccw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
  ["path", { d: "M3 3v5h5" }],
]);
export const Sparkles = make("sparkles", [
  ["path", { d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" }],
  ["path", { d: "M20 2v4" }],
  ["path", { d: "M22 4h-4" }],
  ["circle", { cx: "4", cy: "20", r: "2" }],
]);
export const SquarePen = make("square-pen", [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }],
  ["path", { d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" }],
]);
export const Users = make("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }],
  ["circle", { cx: "9", cy: "7", r: "4" }],
]);
