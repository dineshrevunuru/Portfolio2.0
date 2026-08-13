import { CaseStudyGallery } from "@portfolio/ds";

const mock = (w: number, h: number, label: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
      `<stop offset='0' stop-color='#def4f0'/><stop offset='1' stop-color='#e4daf2'/>` +
      `</linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/>` +
      `<text x='50%' y='50%' font-family='Poppins,sans-serif' font-size='${Math.round(h / 10)}' ` +
      `fill='#5b6472' text-anchor='middle' dominant-baseline='middle'>${label}</text></svg>`,
  );

export const TwoUp = () => (
  <CaseStudyGallery
    items={[
      {
        src: mock(800, 600, "Persona A"),
        width: 800,
        height: 600,
        alt: "Persona — Varsha Singh",
        caption: "Primary persona",
      },
      {
        src: mock(800, 600, "Persona B"),
        width: 800,
        height: 600,
        alt: "Persona — Praduman Choubey",
        caption: "Secondary persona",
      },
    ]}
  />
);

export const ThreeUpPlaceholders = () => (
  <CaseStudyGallery
    cols={3}
    items={[
      { alt: "Low-fi wireframe — home" },
      { alt: "Low-fi wireframe — search" },
      { alt: "Low-fi wireframe — profile" },
    ]}
  />
);
