"use client";
import "./walkthrough.css";

import { useState } from "react";
import { Check, CirclePause, FileText, LockKeyhole, Sparkles } from "./icons";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./prototype/tabs";
import { initialWork, workReducer, type WorkAction } from "./prototype/delegation-state";

const moments = [
  {
    id: "agree",
    label: "Set the limits",
    title: "A job with clear limits.",
    note: "The person authorizes this update, not every future action.",
    says: "I’ll check the figures, prepare the report, and share a short internal summary. Here’s what you’re handing over.",
    actions: [],
  },
  {
    id: "hold",
    label: "Hold a file",
    title: "Keep the work. Hold the export.",
    note: "An existing limit can be respected without asking the person to repeat it.",
    says: "A step asked to export this to a file. I held it and kept the update here in chat. Nothing was written.",
    actions: ["start", "tick", "tick"],
  },
  {
    id: "change",
    label: "Audience changes",
    title: "The audience changed. The agreement didn’t.",
    note: "Sending waits for a decision. Independent report preparation continues.",
    says: "The ops roster added an external supplier to the destination. I’ve held the send. Your report is still moving.",
    actions: ["start", "tick", "tick", "audience", "tick"],
  },
  {
    id: "edit",
    label: "Correct a figure",
    title: "A changed figure needs a current summary.",
    note: "Refreshing content does not grant permission to widen the audience.",
    says: "You changed weekly sales to $131,200. The summary is out of date, so delivery is held until it matches your edit.",
    actions: ["start", "tick", "tick", "audience", "tick", "internal", "edit"],
  },
  {
    id: "receipt",
    label: "See the outcome",
    title: "The result includes what didn’t happen.",
    note: "Held actions remain in the completion story, not only in activity history.",
    says: "The internal summary is delivered (simulated) to 8 teammates. Along the way I held a file export and an external recipient. Both are on the receipt.",
    actions: ["start", "tick", "tick", "audience", "tick", "internal", "edit", "refresh", "finish"],
  },
] as const;

function Moment({ index }: { index: number }) {
  const moment = moments[index];
  const state = moment.actions.reduce(
    (current, action) =>
      workReducer(
        current,
        action === "edit" ? { type: "edit", value: "131200" } : ({ type: action } as WorkAction),
      ),
    initialWork,
  );
  return (
    <>
      <div className="qw-scene">
        <div className="qw-scene-chat">
          <div className="qw-scene-brand">
            <Sparkles size={21} aria-hidden="true" /> Quick <span>Friday operating update</span>
          </div>
          <p className="qw-user-bubble">
            Prepare Friday’s operating update and send the summary to our internal operations
            channel. Keep customer information out.
          </p>
          <div className="qw-quick-turn">
            <Sparkles size={21} aria-hidden="true" />
            <p>{moment.says}</p>
          </div>
          <div className="qw-scene-status">
            {state.phase === "done" ? (
              <Check size={16} />
            ) : state.phase === "agreement" ? (
              <LockKeyhole size={16} />
            ) : (
              <CirclePause size={16} />
            )}
            <span>
              {state.phase === "done"
                ? "Run complete · simulated"
                : state.phase === "agreement"
                  ? "Waiting for the person to start"
                  : index === 1
                    ? "File export held · work continues"
                    : "Delivery held · nothing sent"}
            </span>
          </div>
        </div>
        <div className="qw-scene-work">
          <div className="qw-scene-workbar">
            <FileText size={16} aria-hidden="true" />
            {index === 0
              ? "For this update only"
              : index === 4
                ? "Completion receipt"
                : "Work in view"}
          </div>
          {index === 0 && (
            <dl className="qw-fields">
              <div>
                <dt>Use</dt>
                <dd>Weekly sales + operations notes</dd>
              </div>
              <div>
                <dt>Prepare</dt>
                <dd>Report and short summary</dd>
              </div>
              <div>
                <dt>Send to</dt>
                <dd>8 internal teammates</dd>
              </div>
              <div>
                <dt>Keep out</dt>
                <dd>Customer details, external recipients, and files outside this chat</dd>
              </div>
              <div>
                <dt>Expires</dt>
                <dd>When this run closes</dd>
              </div>
            </dl>
          )}
          {index === 1 && (
            <>
              <div className="qw-state-card">
                <span className="qw-state-label">
                  <CirclePause size={16} /> Held, not created
                </span>
                <h4>Export to a file</h4>
                <p>Files are outside this agreement. The update stays in chat.</p>
              </div>
              <div className="qw-inline-result">
                <Check size={17} /> Sales snapshot checked
              </div>
              <p className="qw-scene-small">The held attempt stays in the run’s history.</p>
            </>
          )}
          {index === 2 && (
            <>
              <div className="qw-state-card">
                <span className="qw-state-label">
                  <CirclePause size={16} /> Sending held
                </span>
                <h4>An external recipient was added.</h4>
                <div className="qw-audience">
                  <span>Original</span>
                  <strong>8 internal teammates</strong>
                  <span>Changed</span>
                  <strong>+ Jordan · Northstar Supply</strong>
                </div>
                <p>This crosses the internal-only limit.</p>
              </div>
              <p className="qw-choice-label">The person can choose</p>
              <ul className="qw-choice-list">
                <li>Keep the original audience</li>
                <li>Confirm the external recipient</li>
                <li>Don’t send the summary</li>
              </ul>
            </>
          )}
          {index === 3 && (
            <>
              <div className="qw-state-card">
                <span className="qw-state-label">
                  <CirclePause size={16} /> Summary out of date
                </span>
                <h4>Your report changed.</h4>
                <div className="qw-figure-change">
                  <span>
                    <small>Earlier summary</small>
                    <s>$128,400</s>
                  </span>
                  <span>
                    <small>Edited report</small>
                    <strong>$131,200</strong>
                  </span>
                </div>
                <p>Refresh the summary before delivery. The audience stays internal.</p>
              </div>
              <p className="qw-scene-small">
                Report revision {state.revision} · Summary revision {state.summaryRevision}
              </p>
            </>
          )}
          {index === 4 && (
            <>
              <span className="qw-state-label qw-state-success">
                <Check size={16} /> Delivered · simulated
              </span>
              <h4 className="qw-receipt-heading">Friday update, accounted for.</h4>
              <dl className="qw-fields">
                <div>
                  <dt>Delivered to</dt>
                  <dd>8 internal teammates</dd>
                </div>
                <div>
                  <dt>Figure used</dt>
                  <dd>$131,200 · your correction</dd>
                </div>
                <div>
                  <dt>File export</dt>
                  <dd>Held · nothing written</dd>
                </div>
                <div>
                  <dt>External supplier</dt>
                  <dd>Excluded · not sent</dd>
                </div>
              </dl>
              <p className="qw-scene-small">No real message leaves this prototype.</p>
            </>
          )}
        </div>
      </div>
      <div className="qw-scene-caption">
        <span>0{index + 1} / 05</span>
        <div>
          <h3>{moment.title}</h3>
          <p>{moment.note}</p>
        </div>
      </div>
    </>
  );
}

export default function Walkthrough() {
  const [moment, setMoment] = useState("agree");
  const current = moments.findIndex((item) => item.id === moment);
  return (
    <div className="qw-walkthrough">
      <Tabs value={moment} onValueChange={setMoment}>
        <div className="qw-walkthrough-top">
          <span>Follow one update, from handoff to outcome</span>
          <span>Interactive storyboard · simulated</span>
        </div>
        <p className="qw-walkthrough-help">
          Choose a step or use Next. With the step bar focused, use the arrow keys to move between
          moments.
        </p>
        <TabsList aria-label="Walkthrough moments" className="qw-moment-tabs">
          {moments.map((item, index) => (
            <TabsTrigger key={item.id} value={item.id}>
              <span>0{index + 1}</span>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {moments.map((item, index) => (
          <TabsContent key={item.id} value={item.id}>
            <Moment index={index} />
          </TabsContent>
        ))}
      </Tabs>
      <div className="qw-step-navigation" aria-label="Storyboard navigation">
        <button
          type="button"
          disabled={current === 0}
          onClick={() => setMoment(moments[current - 1].id)}
        >
          ← Previous
        </button>
        <span role="status" aria-live="polite" aria-atomic="true">
          Step {current + 1} of {moments.length}
        </span>
        <button
          type="button"
          onClick={() => setMoment(moments[current === moments.length - 1 ? 0 : current + 1].id)}
        >
          {current === moments.length - 1 ? "Start again ↺" : "Next →"}
        </button>
      </div>
      <p className="qw-storyboard-note">
        Selected moments, simplified for this story and driven by the prototype’s state logic. Not
        screenshots of the shipped Amazon product.
      </p>
    </div>
  );
}
