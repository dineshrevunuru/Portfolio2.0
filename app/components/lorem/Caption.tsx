import { Fragment } from "react";

export interface CaptionProps {
  /** Words the recognizer is confident about (settled ink). */
  confirmed?: string;
  /** The uncertain tail (light). */
  interim?: string;
  /** Show the blinking caret. */
  caret?: boolean;
  className?: string;
}

/** Caption — the live speech read-out: confirmed words settle to ink, the interim tail stays light. */
export function Caption({
  confirmed = "",
  interim = "",
  caret = true,
  className,
}: CaptionProps) {
  const set = confirmed ? confirmed.trim().split(/\s+/) : [];
  const tail = interim ? interim.trim().split(/\s+/) : [];
  return (
    <div className={className ? `lorem-caption ${className}` : "lorem-caption"}>
      <span className="capline">
        {set.map((w, i) => (
          <Fragment key={`s${i}`}>
            <span className="w wset">{w}</span>{" "}
          </Fragment>
        ))}
        {tail.map((w, i) => (
          <Fragment key={`n${i}`}>
            <span className="w wnew">{w}</span>{" "}
          </Fragment>
        ))}
        {caret && <span className="car" aria-hidden="true" />}
      </span>
    </div>
  );
}
