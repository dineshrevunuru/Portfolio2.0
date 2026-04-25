import Image from "next/image";

type Item = {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  aspectRatio?: string;
};

type Props = {
  items: Item[];
  cols?: 2 | 3;
  wide?: boolean;
};

export default function CaseStudyGallery({
  items,
  cols = 2,
  wide = false,
}: Props) {
  const containerClass = wide ? "cs-container-full" : "cs-container";
  const gridCols = cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div className={`${containerClass} mt-6 sm:mt-8`}>
      <div className={`grid grid-cols-1 gap-4 sm:gap-6 ${gridCols}`}>
        {items.map((item, i) => (
          <figure key={i} className="cs-figure">
            {item.src && item.width && item.height ? (
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
              />
            ) : (
              <div
                className="cs-placeholder"
                style={{ aspectRatio: item.aspectRatio ?? "4 / 3" }}
                role="img"
                aria-label={item.alt}
              >
                {item.alt}
              </div>
            )}
            {item.caption && (
              <figcaption className="cs-caption">{item.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
