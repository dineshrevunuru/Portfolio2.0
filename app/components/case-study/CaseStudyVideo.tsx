import Image from "next/image";

type Props = {
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
  /** Show native controls. Use for anything long enough to have a beginning:
      an autoplaying loop drops the reader into the middle of the story. */
  controls?: boolean;
  /** "none" keeps a heavy clip off the wire until the reader asks for it.
      The poster still paints, so the slot is never empty. */
  preload?: "none" | "metadata" | "auto";
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
  controls = false,
  preload,
}: Props) {
  const containerClass = wide ? "cs-container-full" : "cs-container";
  const isGif = src.toLowerCase().endsWith(".gif");

  return (
    <figure
      className={`${containerClass} cs-figure mt-6 sm:mt-8`}
      style={maxWidth ? { maxWidth, marginLeft: "auto", marginRight: "auto" } : undefined}
    >
      {isGif ? (
        width && height ? (
          <Image src={src} alt={alt} width={width} height={height} unoptimized />
        ) : (
          <div
            className="relative w-full"
            style={{ aspectRatio }}
            role="img"
            aria-label={alt}
          >
            <Image src={src} alt={alt} fill className="object-cover" unoptimized />
          </div>
        )
      ) : (
        <video
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={controls}
          preload={preload}
          playsInline
          aria-label={alt}
          style={{ aspectRatio }}
        />
      )}
      {caption && <figcaption className="cs-caption">{caption}</figcaption>}
    </figure>
  );
}
