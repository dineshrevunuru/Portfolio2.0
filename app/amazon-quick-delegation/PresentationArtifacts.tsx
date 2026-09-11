import Image from "next/image";
import { Check, CirclePause, FileText, LockKeyhole, Users } from "./icons";
const IMG = "/images/amazon-quick-delegation";
const approvalReport = { src: `${IMG}/repetitive-approvals.png`, width: 904, height: 770 };
const autonomyRequest = { src: `${IMG}/autonomous-mode-request.png`, width: 904, height: 770 };
import styles from "./presentation.module.css";

export function ForumEvidence() {
  return (
    <div className={styles.evidence}>
      <header>
        <span>From the Quick community</span>
        <h2>The requests behind the direction</h2>
        <p>
          Original forum screenshots, captured September 10, 2026. The reports describe individual
          experiences, not a measured rate across Quick users.
        </p>
      </header>
      <figure>
        <a
          href={approvalReport.src}
          target="_blank"
          rel="noreferrer"
          aria-label="Enlarge screenshot of the repetitive action approvals report"
        >
          <Image
            src={approvalReport.src}
            width={approvalReport.width}
            height={approvalReport.height}
            style={{ width: "100%", height: "auto" }}
            alt="Garry Johnston’s March 26 report asks whether repeated integration actions can be approved once and describes repeated approvals as distracting during many API calls."
            sizes="(max-width: 900px) 100vw, 840px"
          />
        </a>
        <figcaption>
          <span>March 26, 2026 · User report</span>
          <h3>Repeated permission requests interrupt the task.</h3>
          <p>
            The member asks to approve a repetitive integration action once instead of on every
            occurrence.
          </p>
          <a
            href="https://community.amazonquick.com/t/repetitive-action-approvals/51943"
            target="_blank"
            rel="noreferrer"
          >
            Read the original thread ↗
          </a>
        </figcaption>
      </figure>
      <figure>
        <a
          href={autonomyRequest.src}
          target="_blank"
          rel="noreferrer"
          aria-label="Enlarge screenshot of the autonomous mode request"
        >
          <Image
            src={autonomyRequest.src}
            width={autonomyRequest.width}
            height={autonomyRequest.height}
            style={{ width: "100%", height: "auto" }}
            alt="An August 28 feature request reports frequent manual approvals and asks for more autonomous multi-step workflows. This screenshot shows the opening of the post; follow the source link for the full request."
            sizes="(max-width: 900px) 100vw, 840px"
          />
        </a>
        <figcaption>
          <span>August 28, 2026 · Feature request</span>
          <h3>The requested fix is more autonomy.</h3>
          <p>
            The full post proposes global, per-connector, and session-level approval settings. It
            links the earlier report, so the two are related evidence, not independent prevalence
            estimates.
          </p>
          <a
            href="https://community.amazonquick.com/t/feature-request-full-autonomous-mode-auto-approve-all-actions-like-claude-code-chatgpt-work/53512"
            target="_blank"
            rel="noreferrer"
          >
            Read the full request ↗
          </a>
        </figcaption>
      </figure>
      <aside>
        <strong>My design question</strong>
        <p>
          How can a person authorize one job, stay informed about meaningful changes, and understand
          the outcome without approving every routine step?
        </p>
        <small>
          This is my interpretation of the opportunity, not a solution validated by the forum
          authors.
        </small>
      </aside>
    </div>
  );
}

export function ReturnNeeds() {
  const needs = [
    {
      Icon: FileText,
      title: "What finished?",
      answer: "The report is ready.",
      reason: "Show the useful output.",
    },
    {
      Icon: CirclePause,
      title: "What was held?",
      answer: "A file export stayed blocked.",
      reason: "Preserve the exceptions.",
    },
    {
      Icon: Users,
      title: "What was sent?",
      answer: "A summary to 8 internal teammates.",
      reason: "Name the destination.",
    },
    {
      Icon: Check,
      title: "What needs me?",
      answer: "No remaining decision in this ending.",
      reason: "Make the next step explicit.",
    },
  ];
  return (
    <div className={styles.returnNeeds}>
      <div className={styles.personaIntro}>
        <span>Scenario-based user · Not a validated persona</span>
        <h2>
          Delegates preparation.
          <br />
          Keeps responsibility.
        </h2>
        <p>
          A fictional operations lead asks Quick to prepare a weekly update, then returns while
          remaining accountable for accuracy and who receives it.
        </p>
      </div>
      <div className={styles.returnQuestions}>
        <h3>Four answers to find on return</h3>
        <div>
          {needs.map(({ Icon, title, answer, reason }) => (
            <article key={title}>
              <Icon size={20} aria-hidden="true" />
              <h4>{title}</h4>
              <p>{answer}</p>
              <small>{reason}</small>
            </article>
          ))}
        </div>
        <p className={styles.note}>
          Illustrative answers from the internal-delivery ending. All delivery is simulated.
        </p>
      </div>
    </div>
  );
}

export function DesignDecisions() {
  return (
    <div className={styles.decisions}>
      <article>
        <header>
          <LockKeyhole size={21} aria-hidden="true" />
          <span>01 · Agree</span>
        </header>
        <h3>Authorize a job, not everything.</h3>
        <div className={styles.agreement}>
          <span>This update only</span>
          <strong>Prepare report + internal summary</strong>
          <span>Use weekly sales and operations notes</span>
          <span>Keep out customer details, external recipients, and files</span>
        </div>
        <p>
          <strong>Why:</strong> make the permission concrete enough to review once. Whether this
          saves attention needs testing.
        </p>
      </article>
      <article>
        <header>
          <CirclePause size={21} aria-hidden="true" />
          <span>02 · Hold</span>
        </header>
        <h3>A changed send doesn’t stop the report.</h3>
        <div className={styles.splitWork}>
          <div>
            <span>Report</span>
            <strong>Continues</strong>
          </div>
          <div>
            <span>Send + new external recipient</span>
            <strong>Held for your decision</strong>
          </div>
        </div>
        <p>
          <strong>Why:</strong> the audience change affects delivery, not independent preparation.
          Keep internal, explicitly confirm the new recipient, or cancel sending. Silence never
          grants permission.
        </p>
      </article>
      <article>
        <header>
          <FileText size={21} aria-hidden="true" />
          <span>03 · Correct</span>
        </header>
        <h3>Let a correction reach the summary.</h3>
        <div className={styles.correction}>
          <div>
            <span>Earlier summary</span>
            <s>$128,400</s>
          </div>
          <b aria-hidden="true">→</b>
          <div>
            <span>Edited report</span>
            <strong>$131,200</strong>
          </div>
        </div>
        <p>
          <strong>Why:</strong> editing a prepared report makes the summary stale. Delivery waits
          for a refresh; refreshing content never authorizes a new audience.
        </p>
      </article>
      <article>
        <header>
          <Check size={21} aria-hidden="true" />
          <span>04 · Return</span>
        </header>
        <h3>“Done” includes what didn’t happen.</h3>
        <dl className={styles.receipt}>
          <div>
            <dt>Internal summary</dt>
            <dd>Delivered · simulated</dd>
          </div>
          <div>
            <dt>File export</dt>
            <dd>Held · no file created</dd>
          </div>
          <div>
            <dt>External supplier</dt>
            <dd>Excluded · not sent</dd>
          </div>
        </dl>
        <p>
          <strong>Why:</strong> a prevented action is part of the outcome. Keep it in the completion
          message and receipt, not only in the history.
        </p>
      </article>
    </div>
  );
}
