"use client";

import { useState } from "react";
import styles from "./presentation.module.css";

export default function ConceptElements() {
  const [voice, setVoice] = useState(false);
  return (
    <div className={styles.elements}>
      <article className={styles.voiceFeature}>
        <div>
          <span>01 · Persistent voice mode</span>
          <h3>Stay in the conversation while the work moves.</h3>
          <p>
            The proposed voice session stays available until the person turns it off. An orb and a
            persistent toggle keep that state visible, so speaking does not require reopening a
            separate voice screen.
          </p>
          <p>
            <strong>In this prototype:</strong> the toggle and scripted phrases demonstrate the
            interaction. It does not listen, record, or run speech recognition.
          </p>
          <p>
            <strong>To validate:</strong> interruptions while Quick speaks, clear listening versus
            speaking states, microphone failure, and an immediate stop control.
          </p>
        </div>
        <div className={styles.voiceSample}>
          <div className={styles.sampleBar}>
            Quick <span>Component demonstration</span>
          </div>
          <p>Ask a question or steer the current task.</p>
          <button
            type="button"
            role="switch"
            aria-checked={voice}
            onClick={() => setVoice(!voice)}
            aria-describedby="voice-component-status"
          >
            <span className={styles.orb} data-on={voice} aria-hidden="true" />
            <span>Voice mode</span>
            <span className={styles.switchTrack} data-on={voice} aria-hidden="true">
              <i />
            </span>
          </button>
          <p id="voice-component-status" role="status">
            {voice
              ? "Voice mode on · simulated. Your microphone is off."
              : "Voice mode off. Your microphone is off."}
          </p>
          <small>Opt-in availability, not permission to take new actions.</small>
        </div>
      </article>
      <div className={styles.elementGrid}>
        <article>
          <span>02 · Work beside the conversation</span>
          <h3>Words explain. Artifacts show.</h3>
          <div className={styles.workspaceSample} aria-hidden="true">
            <span>Conversation</span>
            <div>
              <b>Report</b>
              <span>Summary</span>
              <span>Activity</span>
            </div>
          </div>
          <p>
            The report remains inspectable while Quick narrates progress. Report, Summary, and
            Activity separate the output from its history. The concept pairs human editing with
            simulated agent preparation.
          </p>
        </article>
        <article>
          <span>03 · A decision about the change</span>
          <h3>Show the difference before the choice.</h3>
          <div className={styles.audienceSample}>
            <span>Original · 8 internal teammates</span>
            <strong>Added · 1 external supplier</strong>
          </div>
          <p>
            The exception card explains who was added and why delivery waits. It asks about the
            changed audience, without making the person review the whole job again.
          </p>
        </article>
        <article>
          <span>04 · A completion receipt</span>
          <h3>Keep the history that matters.</h3>
          <div className={styles.receiptSample}>
            <span>Prepared</span>
            <span>Sent / not sent</span>
            <span>Held along the way</span>
          </div>
          <p>
            The closing message and receipt preserve blocked actions and the actual simulated
            destination. A cancelled send keeps the report and ends with nothing sent.
          </p>
        </article>
      </div>
      <p className={styles.note}>
        These are my concept-specific arrangements and behaviors, not claims that I invented voice
        interfaces, tabs, permission controls, or activity history. Quick already had task
        visibility and approval controls in the inspected build.
      </p>
    </div>
  );
}
