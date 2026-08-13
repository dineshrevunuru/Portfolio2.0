import { CaseStudyVideo } from "@portfolio/ds";

// Poster art as a data-URI so the video cell renders a real frame statically
// (autoplay has no loadable source in the sandbox, so the poster is shown).
const poster =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='720'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
      `<stop offset='0' stop-color='#e8edfd'/><stop offset='1' stop-color='#fbeae4'/>` +
      `</linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/>` +
      `<circle cx='640' cy='360' r='56' fill='#ffffff' opacity='0.85'/>` +
      `<path d='M620 330 L672 360 L620 390 Z' fill='#2a34c6'/>` +
      `<text x='50%' y='86%' font-family='Poppins,sans-serif' font-size='34' ` +
      `fill='#5b6472' text-anchor='middle'>Prototype walkthrough</text></svg>`,
  );

export const WithPoster = () => (
  <CaseStudyVideo
    src="/prototype-walkthrough.mp4"
    poster={poster}
    alt="Interactive UI prototype walkthrough"
    caption="Interactive prototype — the redesigned booking flow"
  />
);
