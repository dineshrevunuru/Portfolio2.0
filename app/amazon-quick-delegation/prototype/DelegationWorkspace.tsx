'use client';
import { useEffect, useReducer, useRef, useState } from 'react';
import {
  ArrowUp,
  Check,
  ChevronRight,
  CircleAlert,
  FileText,
  Hash,
  History,
  LockKeyhole,
  Pause,
  PanelLeft,
  Play,
  RotateCcw,
  Sparkles,
  SquarePen,
  Users,
} from '../icons';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
import { initialWork, workReducer, type WorkAction, type WorkState } from './delegation-state';

// Direct-link states for screenshots and the participant test:
//   ?state=held | exception | edit | receipt | receipt-external | cancelled
const DEEP: Record<string, WorkAction[]> = {
  held: [{ type: 'start' }, { type: 'tick' }, { type: 'tick' }],
  exception: [{ type: 'start' }, { type: 'tick' }, { type: 'tick' }, { type: 'audience' }, { type: 'tick' }],
  edit: [{ type: 'start' }, { type: 'tick' }, { type: 'tick' }, { type: 'audience' }, { type: 'tick' }, { type: 'internal' }, { type: 'edit', value: '131200' }],
  receipt: [{ type: 'start' }, { type: 'tick' }, { type: 'tick' }, { type: 'audience' }, { type: 'tick' }, { type: 'internal' }, { type: 'edit', value: '131200' }, { type: 'refresh' }, { type: 'finish' }],
  'receipt-external': [{ type: 'start' }, { type: 'tick' }, { type: 'tick' }, { type: 'audience' }, { type: 'tick' }, { type: 'external' }, { type: 'finish' }],
  cancelled: [{ type: 'start' }, { type: 'tick' }, { type: 'tick' }, { type: 'audience' }, { type: 'tick' }, { type: 'cancel' }, { type: 'finish' }],
};
function deepState(): { state: WorkState; linked: boolean; shot: boolean } {
  if (typeof window === 'undefined') return { state: initialWork, linked: false, shot: false };
  const q = new URLSearchParams(window.location.search);
  const seq = DEEP[q.get('state') || ''];
  // ?shot=1 — screenshot mode: keep the deep-linked state but skip the focus
  // moves, so a capture never shows a focus ring the user did not put there.
  const shot = q.get('shot') === '1';
  if (!seq) return { state: initialWork, linked: false, shot };
  return { state: seq.reduce(workReducer, initialWork), linked: true, shot };
}
import './delegation.css';

export default function DelegationWorkspace() {
  const [deep] = useState(deepState);
  const [s, dispatch] = useReducer(workReducer, deep.state);
  const [tab, setTab] = useState('report');
  const [workOpen, setWorkOpen] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => {
    const viewport = window.matchMedia('(min-width: 1101px)');
    const syncNavigation = () => setNavOpen(viewport.matches);
    syncNavigation();
    viewport.addEventListener('change', syncNavigation);
    return () => viewport.removeEventListener('change', syncNavigation);
  }, []);
  const [input, setInput] = useState('');
  const [reply, setReply] = useState('');
  const [showAgreement, setShowAgreement] = useState(false);
  const [voice, setVoice] = useState(false);
  const [confirmExternal, setConfirmExternal] = useState(false);
  const decisionRef = useRef<HTMLParagraphElement>(null);
  const receiptRef = useRef<HTMLHeadingElement>(null);
  const autoFired = useRef(deep.linked);
  const stale = s.revision !== s.summaryRevision;
  const blocked =
    s.audience === 'changed' &&
    s.decision !== 'cancel' &&
    s.decision !== 'external';
  const delivered = s.receipt === 'sent' || s.receipt === 'sent-external';
  const announce =
    s.phase === 'done'
      ? s.receipt === 'held'
        ? 'Run complete. Report prepared. Nothing was sent.'
        : 'Run complete. The summary was delivered in simulation. Any exceptions are listed on the receipt.'
      : blocked
        ? 'One decision needed. An external supplier was added to the audience, so sending is held. Report preparation continues.'
        : s.decision === 'internal'
          ? 'Original audience kept. The external supplier was excluded.'
          : s.decision === 'external'
            ? 'External supplier confirmed. The audience is widened for this send only.'
            : s.decision === 'cancel'
              ? 'Sending cancelled. The report stays available.'
              : '';
  const money = Number(s.revenue).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  const held: string[] = [];
  if (s.fileHeld) held.push('a file export');
  if (s.sawException)
    held.push(
      s.decision === 'external'
        ? 'an external recipient you then confirmed'
        : 'an external recipient',
    );
  const heldPhrase =
    held.length === 2 ? `${held[0]} and ${held[1]}` : held[0] || '';
  const turns: string[] = [];
  if (s.phase === 'agreement') {
    turns.push(
      'I’ll check the figures, prepare the report, and share a short internal summary. Here’s what you’re handing over.',
    );
  } else {
    turns.push(
      'On it. I’m preparing the report — you can keep editing alongside me. I’ll speak up only if something falls outside our agreement.',
    );
    if (s.fileHeld)
      turns.push(
        'Something fell outside our agreement: a step asked to export this to a file. I held it and kept the update here in chat. Nothing was written.',
      );
    if (s.sawException)
      turns.push(
        'The ops roster just added Jordan · Northstar Supply to the destination — an external recipient. I didn’t add it, and I’ve held the send. Your report is still moving.',
      );
    if (s.decision === 'internal')
      turns.push('Kept it internal. Jordan won’t receive this update.');
    if (s.decision === 'external')
      turns.push(
        'Confirmed — Jordan · Northstar Supply is included for this send only.',
      );
    if (s.decision === 'cancel')
      turns.push('I’ve cancelled the send. The report stays here for you.');
    if (s.phase === 'review' && stale)
      turns.push(
        `You changed the figure to ${money}. I’ve held delivery so the old number can’t go out — refresh the summary and I’ll match it.`,
      );
    if (s.phase === 'done')
      turns.push(
        s.receipt === 'held'
          ? `Your report is ready and I left the message unsent, as you asked.${heldPhrase ? ` Along the way I held ${heldPhrase} — ${held.length > 1 ? 'both are' : 'it’s'} on the receipt.` : ''}`
          : s.receipt === 'sent-external'
            ? `All set — delivered (simulated) to your 8 teammates plus Jordan · Northstar, the external recipient you confirmed.${s.fileHeld ? ' I also held a file export along the way; it’s on the receipt.' : ''}`
            : `All set — the internal summary is delivered (simulated) to 8 teammates.${heldPhrase ? ` Along the way I held ${heldPhrase} — ${held.length > 1 ? 'both are' : 'it’s'} on the receipt.` : ''}`,
      );
  }
  useEffect(() => {
    if (s.phase !== 'working' || s.paused) return;
    const timer = setTimeout(() => dispatch({ type: 'tick' }), 2600);
    return () => clearTimeout(timer);
  }, [s.phase, s.step, s.paused]);
  // The exception is part of the narrative, not an optional demo control:
  // the roster change arrives on its own while the run is working.
  useEffect(() => {
    if (
      s.phase !== 'working' ||
      s.step !== 2 ||
      s.paused ||
      autoFired.current ||
      s.audience !== 'internal' ||
      s.decision !== 'pending'
    )
      return;
    autoFired.current = true;
    const timer = setTimeout(() => dispatch({ type: 'audience' }), 1100);
    return () => clearTimeout(timer);
  }, [s.phase, s.step, s.paused, s.audience, s.decision]);
  // Contract (08-STATE-MATRIX): major transitions announce politely and move focus.
  // The announcement is derived, not stored — it changes exactly when state does.
  useEffect(() => {
    if (deep.shot) return;
    if (blocked && s.phase !== 'done') decisionRef.current?.focus();
  }, [blocked, s.phase, deep.shot]);
  useEffect(() => {
    if (deep.shot) return;
    if (s.phase === 'done') receiptRef.current?.focus();
  }, [s.phase, deep.shot]);
  function command(text: string) {
    setInput('');
    const phrase = text.trim().toLowerCase().replace(/[.!]$/, '');
    if (
      (phrase === 'don’t send' ||
        phrase === "don't send" ||
        phrase === 'cancel') &&
      s.phase !== 'agreement' &&
      s.phase !== 'done'
    ) {
      dispatch({ type: 'cancel' });
      setReply('I’ll keep the report and leave the message unsent.');
    } else if (phrase === 'keep it internal' && blocked) {
      dispatch({ type: 'internal' });
      setReply('Kept it internal. The supplier will not receive this update.');
    } else if (
      phrase === 'refresh summary' &&
      s.phase === 'review' &&
      Number(s.revenue) > 0
    ) {
      dispatch({ type: 'refresh' });
      setReply('I checked the summary against your latest report.');
    } else if (
      (phrase === 'pause' || phrase === 'resume') &&
      s.phase === 'working'
    ) {
      dispatch({ type: phrase });
      setReply(
        phrase === 'resume'
          ? 'Resuming report preparation.'
          : 'Paused report preparation.',
      );
    } else
      setReply(
        'This is a scripted prototype. Use the action cards, or try “Keep it internal”, “Don’t send”, or “Refresh summary” when that action is available.',
      );
  }
  function reset() {
    dispatch({ type: 'reset' });
    setReply('');
    setVoice(false);
    setTab('report');
    setShowAgreement(false);
    setConfirmExternal(false);
    autoFired.current = false;
  }
  return (
    <div className={`dq-app ${navOpen ? 'dq-nav-open' : 'dq-nav-closed'}`}>
      {navOpen && (
        <button
          className="dq-nav-backdrop"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
        />
      )}
      <aside
        className="dq-nav"
        id="dq-navigation"
        hidden={!navOpen}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setNavOpen(false);
        }}
      >
        <div className="dq-brand">
          <Sparkles size={27} /> Amazon Quick
          <button
            aria-label="Collapse navigation"
            aria-expanded={navOpen}
            aria-controls="dq-navigation"
            onClick={() => setNavOpen(false)}
          >
            <PanelLeft size={20} />
          </button>
        </div>
        <button onClick={reset}>
          <SquarePen size={18} /> New chat
        </button>
        <div className="dq-nav-label">Recent</div>
        <div className="dq-current">
          <FileText size={17} /> Friday operating update
        </div>
        <button
          onClick={() => {
            setTab('activity');
            setWorkOpen(true);
          }}
        >
          <History size={18} /> This run’s activity
        </button>
        <div className="dq-nav-bottom">
          <div className="dq-person">
            <span>D</span>
            <div>
              Dinesh<small>Demo workspace</small>
            </div>
          </div>
        </div>
      </aside>
      <main className="dq-main">
        <header className="dq-top">
          <span>
            {!navOpen && (
              <button
                aria-label="Open navigation"
                aria-expanded={navOpen}
                aria-controls="dq-navigation"
                onClick={() => setNavOpen(true)}
              >
                <PanelLeft size={20} />
              </button>
            )}
            Operations <ChevronRight size={14} /> Friday update
          </span>
          <div>
            <span className="dq-demo">Interactive concept · simulated</span>
            <button
              aria-expanded={workOpen}
              aria-controls="dq-live-work"
              onClick={() => setWorkOpen(!workOpen)}
            >
              <FileText size={16} /> {workOpen ? 'Hide work' : 'View work'}
            </button>
            <button aria-label="Restart demo" onClick={reset}>
              <RotateCcw size={17} />
            </button>
          </div>
        </header>
        <div className="dq-title">
          <div>
            <h1>Friday operating update</h1>
          </div>
          <span className={`dq-run-status ${blocked ? 'attention' : ''}`}>
            {blocked ? (
              <CircleAlert size={14} aria-hidden="true" />
            ) : s.phase === 'done' ? (
              <Check size={14} aria-hidden="true" />
            ) : (
              <i />
            )}
            {s.phase === 'agreement'
              ? 'Ready when you are'
              : s.phase === 'done'
                ? 'Run complete'
                : blocked
                  ? 'One decision needed'
                  : s.paused
                    ? 'Paused'
                    : 'Within your agreement'}
          </span>
        </div>
        <div className={`dq-columns ${workOpen ? '' : 'dq-chat-only'}`}>
          <section
            className="dq-conversation"
            aria-label="Conversation with Quick"
          >
            <div className="dq-transcript">
              <div className="dq-user">
                Prepare Friday’s operating update and send the summary to our
                internal operations channel. Keep customer information out.
              </div>
              {turns.map((turn, i) => (
                <div className="dq-assistant" key={turn.slice(0, 28)}>
                  {i === 0 ? (
                    <Sparkles size={21} />
                  ) : (
                    <span className="dq-assistant-spacer" aria-hidden="true" />
                  )}
                  <div>
                    {i === 0 && <strong>Quick</strong>}
                    <p>{turn}</p>
                  </div>
                </div>
              ))}
              {(s.phase === 'agreement' || showAgreement) && (
                <section className="dq-agreement">
                  <div className="dq-card-heading">
                    <LockKeyhole size={17} />
                    <strong>For this update only</strong>
                  </div>
                  <dl>
                    <div>
                      <dt>Use</dt>
                      <dd>Weekly sales + operations notes</dd>
                    </div>
                    <div>
                      <dt>Prepare</dt>
                      <dd>Report and a short summary</dd>
                    </div>
                    <div>
                      <dt>Send to</dt>
                      <dd>#operations-internal · 8 teammates</dd>
                    </div>
                    <div>
                      <dt>Keep out</dt>
                      <dd>
                        Customer details, external recipients, and files outside
                        this chat
                      </dd>
                    </div>
                  </dl>
                  <p className="dq-small">
                    Permission ends when this run closes. No recurring access.
                  </p>
                  {s.phase === 'agreement' && (
                    <button
                      className="dq-primary"
                      onClick={() => dispatch({ type: 'start' })}
                    >
                      Start this update <ChevronRight size={16} />
                    </button>
                  )}
                </section>
              )}
              {s.phase !== 'agreement' && (
                <>
                  <button
                    className="dq-agreement-link"
                    onClick={() => setShowAgreement(!showAgreement)}
                  >
                    <LockKeyhole size={14} />
                    {showAgreement ? 'Hide' : 'View'} our agreement
                  </button>
                  <div className="dq-progress" aria-live="polite">
                    <div>
                      <span>
                        {s.step === 3
                          ? 'Report prepared'
                          : s.paused
                            ? 'Preparation paused'
                            : [
                                'Preparing your update',
                                'Checking sales figures',
                                'Removing customer details',
                              ][s.step]}
                      </span>
                      {s.phase === 'working' && (
                        <button
                          aria-label={
                            s.paused
                              ? 'Resume preparation'
                              : 'Pause preparation'
                          }
                          onClick={() =>
                            dispatch({ type: s.paused ? 'resume' : 'pause' })
                          }
                        >
                          {s.paused ? <Play size={15} /> : <Pause size={15} />}
                        </button>
                      )}
                    </div>
                    <div className="dq-track">
                      <span style={{ transform: `scaleX(${s.step / 3})` }} />
                    </div>
                    <p>
                      {blocked
                        ? 'Only the send is held. Report preparation continues.'
                        : 'Two sources · one report · one destination'}
                    </p>
                  </div>
                </>
              )}
              {blocked && s.phase !== 'done' && (
                <section className="dq-decision" aria-label="Audience changed">
                  <div className="dq-card-heading">
                    <CircleAlert size={19} />
                    <strong>The audience changed.</strong>
                  </div>
                  <p ref={decisionRef} tabIndex={-1}>
                    This crosses the internal-only limit you set. Nothing has
                    been sent — choose how you want to continue.
                  </p>
                  <div className="dq-diff">
                    <span>
                      <Check size={15} /> 8 internal teammates{' '}
                      <small>unchanged</small>
                    </span>
                    <span className="dq-added">
                      + Jordan · Northstar Supply <small>external</small>
                    </span>
                  </div>
                  <p className="dq-small">
                    The message has not been sent. Report prep stays in your
                    workspace and is reversible — nothing leaves until you
                    decide.
                  </p>
                  <button
                    className="dq-primary"
                    onClick={() => dispatch({ type: 'internal' })}
                  >
                    Keep the original audience
                  </button>
                  {confirmExternal ? (
                    <div className="dq-confirm">
                      <p>
                        This sends outside your company. Jordan · Northstar
                        Supply would receive the full summary.
                      </p>
                      <button
                        className="dq-confirm-go"
                        onClick={() => {
                          dispatch({ type: 'external' });
                          setConfirmExternal(false);
                        }}
                      >
                        Yes, include the external supplier
                      </button>
                      <button
                        className="dq-text-button"
                        onClick={() => setConfirmExternal(false)}
                      >
                        Back
                      </button>
                    </div>
                  ) : (
                    <button
                      className="dq-text-button"
                      onClick={() => setConfirmExternal(true)}
                    >
                      Include Jordan · Northstar (external) — needs confirming
                    </button>
                  )}
                  <button
                    className="dq-text-button"
                    onClick={() => dispatch({ type: 'cancel' })}
                  >
                    Don’t send this update
                  </button>
                </section>
              )}
              {s.decision === 'internal' && (
                <div className="dq-inline-success">
                  <Check size={17} /> Original audience kept. Supplier excluded.
                </div>
              )}
              {s.decision === 'external' && (
                <div className="dq-inline-success dq-inline-warn">
                  <CircleAlert size={17} /> You confirmed Jordan · Northstar
                  (external) for this send only.
                </div>
              )}
              {s.decision === 'cancel' && s.phase !== 'done' && (
                <div className="dq-inline-success">
                  <LockKeyhole size={17} /> Sending cancelled. The report stays
                  available.
                </div>
              )}
              {s.phase === 'review' && stale && (
                <section className="dq-change">
                  <strong>Your edit changed the summary.</strong>
                  <p>
                    The sales figure is now{' '}
                    {Number(s.revenue) > 0 ? money : 'invalid'}. I’ve held
                    delivery so the old number cannot be sent.
                  </p>
                  <button
                    disabled={!(Number(s.revenue) > 0)}
                    onClick={() => dispatch({ type: 'refresh' })}
                  >
                    Refresh the affected summary
                  </button>
                </section>
              )}
              {s.phase === 'review' && !stale && !blocked && (
                <div className="dq-ready">
                  <Check size={18} />
                  <p>
                    The report and summary match.{' '}
                    {s.decision === 'cancel'
                      ? 'Close this run with no send.'
                      : 'The internal send remains within your agreement.'}
                  </p>
                  <button
                    className="dq-primary"
                    onClick={() => {
                      dispatch({ type: 'finish' });
                      setTab('activity');
                    }}
                  >
                    {s.decision === 'cancel'
                      ? 'Finish without sending'
                      : 'Continue demo: simulate delivery'}
                  </button>
                  <small>
                    Demo pacing control, not an additional permission request.
                  </small>
                </div>
              )}
              {s.phase === 'done' && (
                <section className="dq-receipt">
                  <Check size={22} />
                  <h2 ref={receiptRef} tabIndex={-1}>
                    {s.receipt === 'sent'
                      ? 'Finished within your agreement.'
                      : s.receipt === 'sent-external'
                        ? 'Finished with one exception you approved.'
                        : 'Prepared. Not sent.'}
                  </h2>
                  {(s.sawException || s.fileHeld) && (
                    <div className="dq-receipt-exceptions">
                      <strong>Held along the way</strong>
                      {s.fileHeld && (
                        <p>
                          <CircleAlert size={15} /> File export requested, then
                          held — files are outside your agreement. Nothing was
                          written.
                        </p>
                      )}
                      {s.sawException && (
                        <p>
                          <CircleAlert size={15} />{' '}
                          {s.decision === 'external'
                            ? 'The ops roster added Jordan · Northstar Supply (external). You confirmed it.'
                            : 'The ops roster added Jordan · Northstar Supply (external). You kept it internal.'}
                        </p>
                      )}
                    </div>
                  )}
                  <p>Report · revision {s.revision} saved in this demo</p>
                  <p>
                    {delivered
                      ? `Internal summary · delivered (simulated) · 8 teammates`
                      : 'Internal summary · not sent · retained as a draft'}
                  </p>
                  <p>
                    {s.receipt === 'sent-external'
                      ? 'External supplier · delivered (simulated) · 1 recipient you confirmed'
                      : 'External supplier · not sent'}
                  </p>
                  <p>
                    {s.revision > 1
                      ? `Figure delivered · ${money} — your edit, revision ${s.revision}`
                      : `Figure delivered · ${money} — unchanged`}
                  </p>
                  <small>
                    {delivered
                      ? 'Simulated receipt DEMO-1042 · no real connector used · nothing left this demo'
                      : 'No delivery receipt. Sending was cancelled.'}
                  </small>
                  <button onClick={reset}>
                    Try another path <RotateCcw size={14} />
                  </button>
                </section>
              )}
              {reply && <output className="dq-command-reply">{reply}</output>}
            </div>
            <form
              className="dq-composer-shell"
              onSubmit={(e) => {
                e.preventDefault();
                command(input);
              }}
            >
              <div className="dq-composer">
                <div className="dq-composer-heading">Quick</div>
                <textarea
                  aria-label="Message Quick"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question…"
                  aria-describedby="dq-input-help"
                  rows={2}
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter' &&
                      !event.shiftKey &&
                      !event.nativeEvent.isComposing
                    ) {
                      event.preventDefault();
                      if (input.trim()) command(input);
                    }
                  }}
                />
                <div className="dq-composer-actions">
                  <div className="dq-voice-row">
                    <button
                      type="button"
                      aria-pressed={voice}
                      onClick={() => setVoice(!voice)}
                    >
                      <span
                        className={`dq-orb ${voice ? 'dq-orb-active' : ''}`}
                        aria-hidden="true"
                      />
                      Voice mode
                      <span className="dq-voice-toggle" aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    className="dq-send"
                    type="submit"
                    aria-label="Send instruction"
                    disabled={!input.trim()}
                  >
                    <ArrowUp size={20} />
                  </button>
                </div>
              </div>
              <details className="dq-phrase-chips">
                <summary>Example prompts</summary>
                {['Keep it internal', 'Don’t send', 'Refresh summary'].map(
                  (phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => setInput(phrase)}
                    >
                      {phrase}
                    </button>
                  ),
                )}
              </details>
              <span id="dq-input-help" className="dq-input-help">
                {voice
                  ? 'Voice is simulated. Your microphone stays off.'
                  : 'Scripted prototype · Try an example prompt'}
              </span>
              {voice && (
                <div className="dq-voice-phrases">
                  <span>Choose a spoken phrase:</span>
                  <button
                    type="button"
                    onClick={() => command('Keep it internal')}
                  >
                    “Keep it internal”
                  </button>
                  <button type="button" onClick={() => command('Don’t send')}>
                    “Don’t send”
                  </button>
                </div>
              )}
            </form>
          </section>
          <aside
            id="dq-live-work"
            className="dq-work"
            aria-label="Live work"
            hidden={!workOpen}
          >
            <Tabs value={tab} onValueChange={setTab}>
              <div className="dq-work-top">
                <TabsList variant="line">
                  <TabsTrigger value="report">Report</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                <FileText size={17} />
              </div>
              <TabsContent value="report">
                <div className="dq-paper">
                  <div className="dq-paper-meta">
                    Northline · Operations<span>Week 36</span>
                  </div>
                  <h2>Friday operating update</h2>
                  <p className="dq-paper-sub">
                    September 11, 2026 · Fictional business data
                  </p>
                  <div className="dq-metric">
                    <label htmlFor="dq-sales">Weekly sales</label>
                    <div>
                      <span>$</span>
                      <input
                        id="dq-sales"
                        inputMode="decimal"
                        type="number"
                        min="1"
                        value={s.revenue}
                        disabled={s.phase === 'agreement' || s.phase === 'done'}
                        onChange={(e) =>
                          dispatch({ type: 'edit', value: e.target.value })
                        }
                      />
                    </div>
                    <small>
                      {s.phase === 'agreement'
                        ? 'Editing opens when the run starts.'
                        : s.phase === 'done'
                          ? 'Run closed · restart to edit'
                          : 'You can edit this. Quick will preserve your changes.'}
                    </small>
                  </div>
                  <h3>This week</h3>
                  <p>
                    Sales are steady. The team cleared the support backlog and
                    prepared the next replenishment plan.
                  </p>
                  <div className="dq-report-row">
                    <span>Orders fulfilled</span>
                    <strong>1,240</strong>
                  </div>
                  <div className="dq-report-row">
                    <span>Open support requests</span>
                    <strong>18</strong>
                  </div>
                  <h3>Next week</h3>
                  <p>
                    Confirm the supplier’s delivery date before committing to
                    the autumn promotion.
                  </p>
                  <div className="dq-source-note">
                    <LockKeyhole size={15} />
                    <span>
                      No customer names, emails, or order-level details
                      included.
                    </span>
                  </div>
                  <footer>
                    Sales snapshot · Operations notes{' '}
                    <span>Revision {s.revision}</span>
                  </footer>
                </div>
              </TabsContent>
              <TabsContent value="summary">
                <div className="dq-paper">
                  <div className="dq-paper-meta">
                    Message preview{' '}
                    <span>{delivered ? 'Simulated delivery' : 'Not sent'}</span>
                  </div>
                  <h2>A short update for the team.</h2>
                  <p className="dq-destination">
                    <Hash size={17} /> operations-internal
                  </p>
                  {s.step < 3 ? (
                    <p>
                      The summary will appear when the report checks finish.
                    </p>
                  ) : stale ? (
                    <div className="dq-change">
                      <strong>Previous summary is out of date.</strong>
                      <p>
                        Refresh it from your edited report before continuing.
                        Delivery is held.
                      </p>
                    </div>
                  ) : (
                    <blockquote>
                      Weekly sales: {money}. We fulfilled 1,240 orders and have
                      18 open support requests. Next: confirm the supplier’s
                      delivery date before the autumn promotion.
                    </blockquote>
                  )}
                  <p className="dq-small">
                    Audience:{' '}
                    {blocked
                      ? '8 teammates + 1 external supplier (held)'
                      : '8 internal teammates'}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="activity">
                <div
                  className={`dq-paper dq-activity ${s.events.length === 0 ? 'dq-empty-activity' : ''}`}
                >
                  <div className="dq-paper-meta">This run only</div>
                  <h2>
                    {s.events.length === 0 ? 'No activity yet' : 'Run activity'}
                  </h2>
                  {s.events.length === 0 ? (
                    <p>
                      Steps and decisions will appear here when the update
                      starts.
                    </p>
                  ) : (
                    <ol className="dq-events">
                      {s.events.map((event, i) => (
                        <li key={`${i}-${event}`}>
                          <span>{String(i + 1).padStart(2, '0')}</span>
                          {event}
                        </li>
                      ))}
                    </ol>
                  )}
                  <p className="dq-small">
                    All activity is simulated. Nothing is sent to Slack or any
                    other service.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            <details className="dq-demo-controls">
              <summary>Demo controls</summary>
              <div>
                <strong>Explore a change</strong>
                <span>Demo controls · not part of Quick</span>
              </div>
              <button
                disabled={
                  s.phase === 'agreement' ||
                  s.phase === 'done' ||
                  s.audience === 'changed' ||
                  s.decision === 'cancel'
                }
                onClick={() => dispatch({ type: 'audience' })}
              >
                <Users size={16} /> Add an external recipient
              </button>
              <button
                disabled={s.phase !== 'review'}
                onClick={() => {
                  dispatch({ type: 'edit', value: '131200' });
                  setTab('report');
                }}
              >
                <SquarePen size={16} /> Edit sales to $131,200
              </button>
            </details>
          </aside>
        </div>
        <output className="dq-sr-only" aria-live="polite">
          {announce}
        </output>
        <footer className="dq-disclosure">
          Independent concept by Dinesh Revunuru · No live integrations ·
          Reloading resets this run
        </footer>
      </main>
    </div>
  );
}
