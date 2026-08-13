import type { CSSProperties } from "react";

export type CaseStudyImageProps = {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  wide?: boolean;
  maxWidth?: number;
  aspectRatio?: string;
  noRadius?: boolean;
};

export default function CaseStudyImage({
  src,
  alt,
  width,
  height,
  caption,
  wide = false,
  maxWidth,
  aspectRatio = "16 / 9",
  noRadius = false,
}: CaseStudyImageProps) {
  const containerClass = wide ? "cs-container-full" : "cs-container";
  const figureStyle: CSSProperties | undefined = maxWidth
    ? { maxWidth, marginLeft: "auto", marginRight: "auto" }
    : undefined;
  return (
    <figure
      className={`${containerClass} cs-figure mt-6 sm:mt-8`}
      style={figureStyle}
    >
      {src && width && height ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          style={noRadius ? { borderRadius: 0 } : undefined}
        />
      ) : (
        <div
          className="cs-placeholder"
          style={{ aspectRatio }}
          role="img"
          aria-label={alt}
        >
          {alt}
        </div>
      )}
      {caption && <figcaption className="cs-caption">{caption}</figcaption>}
    </figure>
  );
}
