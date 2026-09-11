export type WorkState = {
  phase: 'agreement' | 'working' | 'review' | 'done';
  step: number;
  audience: 'internal' | 'changed';
  decision: 'pending' | 'internal' | 'cancel' | 'external';
  revenue: string;
  revision: number;
  summaryRevision: number;
  paused: boolean;
  receipt: 'none' | 'sent' | 'sent-external' | 'held';
  fileHeld: boolean;
  sawException: boolean;
  events: string[];
};
export const initialWork: WorkState = {
  phase: 'agreement',
  step: 0,
  audience: 'internal',
  decision: 'pending',
  revenue: '128400',
  revision: 1,
  summaryRevision: 0,
  paused: false,
  receipt: 'none',
  fileHeld: false,
  sawException: false,
  events: [],
};
export type WorkAction =
  | {
      type:
        | 'start'
        | 'tick'
        | 'pause'
        | 'resume'
        | 'audience'
        | 'internal'
        | 'external'
        | 'cancel'
        | 'refresh'
        | 'finish'
        | 'reset';
    }
  | { type: 'edit'; value: string };
export const validRevenue = (value: string) =>
  Number.isFinite(Number(value)) && Number(value) > 0;
export function workReducer(s: WorkState, a: WorkAction): WorkState {
  if (a.type === 'reset') return { ...initialWork, events: [] };
  if (a.type === 'start' && s.phase === 'agreement')
    return {
      ...s,
      phase: 'working',
      events: [
        'Permission granted for this run: internal operations summary only.',
      ],
    };
  if (a.type === 'tick' && s.phase === 'working' && !s.paused) {
    const step = Math.min(3, s.step + 1);
    // Step 2 reproduces the observed failure mode: a delegated step asks for
    // something the agreement excludes (a file), it is held, and the run
    // continues inline. The held attempt is recorded, never flattened away.
    const held = step === 2 ? true : s.fileHeld;
    const line = [
      '',
      'Sales snapshot checked.',
      'Export to a file requested, then held — files are outside this agreement. I kept the update in chat.',
      validRevenue(s.revenue)
        ? 'Report and summary prepared.'
        : 'Report requires a valid sales figure. Delivery held.',
    ][step];
    return {
      ...s,
      step,
      fileHeld: held,
      summaryRevision:
        step === 3 && validRevenue(s.revenue) ? s.revision : s.summaryRevision,
      phase: step === 3 ? 'review' : 'working',
      events: [...s.events, line],
    };
  }
  if ((a.type === 'pause' || a.type === 'resume') && s.phase === 'working')
    return { ...s, paused: a.type === 'pause' };
  if (
    a.type === 'audience' &&
    s.phase !== 'agreement' &&
    s.phase !== 'done' &&
    s.audience === 'internal' &&
    s.decision === 'pending'
  )
    return {
      ...s,
      audience: 'changed',
      decision: 'pending',
      sawException: true,
      events: [
        ...s.events,
        'The ops roster added an external supplier to the destination. I did not add it. Sending held; report work unaffected.',
      ],
    };
  if (a.type === 'internal' && s.audience === 'changed')
    return {
      ...s,
      audience: 'internal',
      decision: 'internal',
      events: [
        ...s.events,
        'You kept the original internal audience. External supplier excluded.',
      ],
    };
  if (a.type === 'external' && s.audience === 'changed')
    return {
      ...s,
      decision: 'external',
      events: [
        ...s.events,
        'You confirmed the external supplier. Audience widened for this send only.',
      ],
    };
  if (a.type === 'cancel' && s.phase !== 'done')
    return {
      ...s,
      decision: 'cancel',
      events: [...s.events, 'Send cancelled. Report preparation continues.'],
    };
  if (a.type === 'edit' && s.phase !== 'done')
    return { ...s, revenue: a.value, revision: s.revision + 1 };
  if (a.type === 'refresh' && s.phase === 'review' && validRevenue(s.revenue))
    return {
      ...s,
      summaryRevision: s.revision,
      events: [
        ...s.events,
        `Summary refreshed from your report, revision ${s.revision}.`,
      ],
    };
  if (
    a.type === 'finish' &&
    s.phase === 'review' &&
    s.summaryRevision === s.revision &&
    validRevenue(s.revenue) &&
    (s.audience === 'internal' ||
      s.decision === 'cancel' ||
      s.decision === 'external')
  )
    return {
      ...s,
      phase: 'done',
      receipt:
        s.decision === 'cancel'
          ? 'held'
          : s.decision === 'external'
            ? 'sent-external'
            : 'sent',
      events: [
        ...s.events,
        s.decision === 'cancel'
          ? 'Run closed with report prepared. Nothing sent.'
          : s.decision === 'external'
            ? 'SIMULATION: summary delivered to 8 teammates + 1 external supplier you confirmed. Receipt DEMO-1042.'
            : 'SIMULATION: internal summary delivered. Receipt DEMO-1042.',
      ],
    };
  return s;
}
