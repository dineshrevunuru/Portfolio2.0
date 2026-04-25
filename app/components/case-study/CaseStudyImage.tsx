import Image from "next/image";

type Props = {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  wide?: boolean;
  maxWidth?: number;
  aspectRatio?: string;
  unoptimized?: boolean;
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
  unoptimized = false,
  noRadius = false,
}: Props) {
  const containerClass = wide ? "cs-container-full" : "cs-container";
  return (
    <figure
      className={`${containerClass} cs-figure mt-6 sm:mt-8`}
      style={maxWidth ? { maxWidth, marginLeft: "auto", marginRight: "auto" } : undefined}
    >
      {src && width && height ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          unoptimized={unoptimized}
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
