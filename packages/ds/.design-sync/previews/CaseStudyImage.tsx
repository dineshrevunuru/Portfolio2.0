import { CaseStudyImage } from "@portfolio/ds";

// Self-contained mock artwork so the preview needs no shipped assets.
const mock = (w: number, h: number, label: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
      `<stop offset='0' stop-color='#e0eefd'/><stop offset='1' stop-color='#f4d6dc'/>` +
      `</linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/>` +
      `<text x='50%' y='50%' font-family='Poppins,sans-serif' font-size='${Math.round(h / 12)}' ` +
      `fill='#5b6472' text-anchor='middle' dominant-baseline='middle'>${label}</text></svg>`,
  );

export const WithImage = () => (
  <CaseStudyImage
    src={mock(1200, 675, "Empathy map")}
    width={1200}
    height={675}
    alt="Empathy map for freelance journalists"
    caption="Empathy map synthesised from 12 interviews"
  />
);

export const Placeholder = () => (
  <CaseStudyImage
    alt="Secondary research snapshot"
    caption="A snippet of secondary user research"
  />
);
