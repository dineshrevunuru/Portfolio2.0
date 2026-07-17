import type { CSSProperties } from "react";

export type CaseStudyVideoProps = {
  src: string;
  poster?: string;
  alt: string;
  caption?: string;
  wide?: boolean;
  maxWidth?: number;
  aspectRatio?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  width?: number;
  height?: number;
};

export default function CaseStudyVideo({
  src,
  poster,
  alt,
  caption,
  wide = false,
  maxWidth,
  aspectRatio = "16 / 9",
  autoPlay = true,
  loop = true,
  muted = true,
  width,
  height,
}: CaseStudyVideoProps) {
  const containerClass = wide ? "cs-container-full" : "cs-container";
  const isGif = src.toLowerCase().endsWith(".gif");
  const figureStyle: CSSProperties | undefined = maxWidth
    ? { maxWidth, marginLeft: "auto", marginRight: "auto" }
    : undefined;

  return (
    <figure
      className={`${containerClass} cs-figure mt-6 sm:mt-8`}
      style={figureStyle}
    >
      {isGif ? (
        width && height ? (
          <img src={src} alt={alt} width={width} height={height} />
        ) : (
          <div
            className="relative w-full"
            style={{ aspectRatio }}
            role="img"
            aria-label={alt}
          >
            <img
              src={src}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        )
      ) : (
        <video
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          aria-label={alt}
          style={{ aspectRatio }}
        />
      )}
      {caption && <figcaption className="cs-caption">{caption}</figcaption>}
    </figure>
  );
}
