"use client";

import { useEffect, useState } from "react";

/**
 * The operable prototype, embedded after the outcome.
 *
 * Two-column at desktop: the left column says what this is and what to try, the
 * right column is the widget at phone size. The section breaks out of the 800px
 * prose rail to 1200px — the one place in the case study that earns extra
 * width, because the artifact and its explanation genuinely need to sit side by
 * side rather than stack.
 *
 * An iframe on purpose: the widget was built to run in one (it postMessages
 * `hss:ready` / `hss:close` to its parent), so this is how the real thing is
 * deployed — and it gives complete style isolation from the portfolio's CSS.
 *
 * Click-to-load, not auto-load. The demo boots a model-backed conversation, and
 * making every visitor pay for that on scroll is both slow and expensive.
 */
export function HssDemoEmbed() {
  const [live, setLive] = useState(false);

  /* The widget's own close button posts `hss:close` to its parent — that is
     how the real deployment dismisses it, and until now this embed never
     listened, so the X did nothing here. Closing returns to the poster (the
     stage's first screen), and because closing unmounts the iframe, the next
     "Start the demo" boots a fresh conversation rather than resuming a
     stranger's half-finished booking. */
  useEffect(() => {
    if (!live) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "hss:close") setLive(false);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [live]);

  return (
    <section className="cs-demo">
      {/* The house prototype pattern, from the Uniquefit case: a Playfair
          cs-section-head-prototype heading with prose under it, media beside
          it, items-center. There the phone chrome is baked into the video
          asset; here the artifact is live, so a plain stage stands where the
          mockup would. Copy stays spare — the widget is the information. */}
      <div className="cs-demo-copy">
        {/* The sandbox disclosure lives here, above the heading, not floating
            inside the widget — a strip over the conversation kept covering the
            thing it was explaining. Styled as a note card rather than a bare
            caption so it reads as deliberate disclosure, not fine print. */}
        <p className="cs-demo-note">
          {/* {" "} because JSX drops the space after a closing tag when the
              next text starts on a new line — it rendered "Demo mode:Your". */}
          <strong>Demo mode:</strong>{" "}
          Your verification code appears on screen, and no appointment is created.
        </p>
        <h3 className="cs-section-head-prototype mt-4">Try Tara for yourself</h3>
        <div className="cs-prose mt-3">
          <p>
            This demo runs the same code as the assistant on the client&rsquo;s website. Ask a
            question, choose a service, and complete the booking flow using live availability.
          </p>
        </div>
      </div>

      <div className="cs-demo-stage">
        {live ? (
          <iframe
            src="/hss-demo"
            title="Tara, the booking assistant — interactive sandbox"
            className="cs-demo-frame"
            /* allow-same-origin is required: without it the frame gets an
               opaque origin, its own /api call is cross-origin, and the widget
               renders empty. The isolation that matters is architectural — the
               portfolio has no credentials for, and no route to, the client's
               systems. */
            sandbox="allow-scripts allow-same-origin allow-forms"
            loading="lazy"
          />
        ) : (
          <button type="button" className="cs-demo-poster" onClick={() => setLive(true)}>
            <span className="cs-demo-poster-eyebrow">Interactive</span>
            <span className="cs-demo-poster-title">Talk to Tara</span>
            <span className="cs-demo-poster-body">
              Real slots, real verification, a real confirmation &mdash; and no real appointment.
            </span>
            <span className="cs-demo-poster-cta">
              Start the demo
              {/* The click prompt. Two nested elements on purpose: the outer
                  span carries the approach (a travel move), the inner image
                  carries the press (a scale dip). One element cannot run both
                  without the transforms fighting, and separating them lets each
                  use its own token — travel on the settle, press on the morph.
                  Decorative: hidden from AT, absent under reduced motion. */}
              <span className="cs-demo-cursor" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/case-studies/hss/pointer.svg" alt="" width={38} height={41} />
              </span>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
