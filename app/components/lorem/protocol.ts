/**
 * The say/show protocol — Lorem's rendering vocabulary.
 *
 * The problem this exists to solve: speech is serial and it evaporates. A person
 * listening cannot hold four numbers, a before/after, and a timeline in working
 * memory at once. So Lorem answers on two tracks — a `say` track that is spoken and
 * a `show` track that persists on screen — and the *model* decides the split.
 * Narrative goes in the ear; anything the ear can't hold goes on the glass.
 *
 * The block union below is not a set of pages. It is the vocabulary the model
 * composes with, turn by turn. Every block maps to markup that already exists in
 * the Lorem design system (`lorem.css`), so anything the model assembles is on-brand
 * by construction.
 *
 * Numbers are the exception to "the model decides": see `facts.ts`.
 */

import type { FactId, QuoteId } from "./facts";

/* ── Blocks ───────────────────────────────────────────────────────────── */

export type Block =
  /** A statement. One per answer at most — this is the line that lands. */
  | { type: "heading"; text: string }
  /** Supporting prose. Keep it short; the say track carries the talking. */
  | { type: "text"; text: string }
  /** The metric grid. Values come from the fact store, never from the model. */
  | { type: "metrics"; items: { factId: FactId }[] }
  /** A framed problem with what it was costing. */
  | { type: "problem"; statement: string; cost?: string }
  /** Before / after. The single most load-bearing visual for a change story. */
  | { type: "split"; before: { title: string; body: string }; after: { title: string; body: string } }
  /** A verbatim stakeholder quote, by id. */
  | { type: "quote"; quoteId: QuoteId }
  /** Who this was designed for. */
  | { type: "personas"; items: { name: string; detail: string; need?: string }[] }
  /** An ordered flow — research → decision → build. */
  | { type: "steps"; items: string[] }
  /** Phases of the engagement, with the current one marked. */
  | { type: "arc"; items: { label: string; active?: boolean }[] }
  /** An evidence pill. One line, factual, no numerals unless fact-backed. */
  | { type: "proof"; text: string }
  /** A canonical chart. Datasets are server-side; the model picks one by id. */
  | { type: "chart"; dataset: DatasetId; caption?: string }
  /** A short excerpt of a real conversation. */
  | { type: "chat"; title?: string; turns: { from: "them" | "u"; text: string }[]; note?: string }
  /** A way out of the conversation and into the real thing. */
  | { type: "link"; label: string; href: string };

export type BlockType = Block["type"];

/* ── Charts ───────────────────────────────────────────────────────────── */

export type ChartPoint = { label: string; value: number; note?: string };

/**
 * Canonical datasets. The model selects by id; it never supplies coordinates.
 * Geometry is computed from the values at render time, so a label and its
 * position cannot drift apart the way they did in the hand-drawn version.
 */
export const DATASETS = {
  cac: {
    id: "cac",
    unit: "$",
    target: 40,
    caption: "Cost per new customer, before and after",
    points: [
      { label: "before", value: 105 },
      { label: "conversions went invisible", value: 110, note: "worst month" },
      { label: "after the rebuild", value: 50 },
      { label: "where it landed", value: 40 },
    ] as ChartPoint[],
  },
  retention: {
    id: "retention",
    unit: "%",
    target: 80,
    caption: "Customers who came back",
    points: [
      { label: "before", value: 40 },
      { label: "after", value: 72, note: "target was 80" },
    ] as ChartPoint[],
  },
} as const;

export type DatasetId = keyof typeof DATASETS;

export const isDatasetId = (v: string): v is DatasetId =>
  Object.prototype.hasOwnProperty.call(DATASETS, v);

/* ── The turn ─────────────────────────────────────────────────────────── */

export type LoremTurn = {
  /** Spoken aloud and shown as the lead line. Conversational. No bare numerals. */
  say: string;
  /** The visual scaffold. Empty is legitimate for small talk. */
  show: Block[];
  /** Follow-ups Lorem offers. Written as the visitor would say them. */
  chips: string[];
  /** A first name the visitor volunteered, for the client to store locally. */
  rememberName?: string;
  /** The visitor disowned a name we had. The client erases it. */
  forgetName?: boolean;
};

export type LoremRequest = {
  message: string;
  /** Prior turns — this is Lorem's memory. The server is stateless. */
  history: { role: "user" | "assistant"; content: string }[];
};

/* ── Tool schema handed to the model ──────────────────────────────────── */

const blockSchema = {
  type: "object",
  required: ["type"],
  oneOf: [
    {
      properties: { type: { const: "heading" }, text: { type: "string", maxLength: 90 } },
      required: ["type", "text"],
      additionalProperties: false,
    },
    {
      properties: { type: { const: "text" }, text: { type: "string", maxLength: 320 } },
      required: ["type", "text"],
      additionalProperties: false,
    },
    {
      properties: {
        type: { const: "metrics" },
        items: {
          type: "array",
          minItems: 1,
          maxItems: 3,
          items: {
            type: "object",
            properties: { factId: { type: "string" } },
            required: ["factId"],
            additionalProperties: false,
          },
        },
      },
      required: ["type", "items"],
      additionalProperties: false,
    },
    {
      properties: {
        type: { const: "problem" },
        statement: { type: "string", maxLength: 180 },
        cost: { type: "string", maxLength: 180 },
      },
      required: ["type", "statement"],
      additionalProperties: false,
    },
    {
      properties: {
        type: { const: "split" },
        before: {
          type: "object",
          properties: {
            title: { type: "string", maxLength: 30 },
            body: { type: "string", maxLength: 180 },
          },
          required: ["title", "body"],
          additionalProperties: false,
        },
        after: {
          type: "object",
          properties: {
            title: { type: "string", maxLength: 30 },
            body: { type: "string", maxLength: 180 },
          },
          required: ["title", "body"],
          additionalProperties: false,
        },
      },
      required: ["type", "before", "after"],
      additionalProperties: false,
    },
    {
      properties: { type: { const: "quote" }, quoteId: { type: "string" } },
      required: ["type", "quoteId"],
      additionalProperties: false,
    },
    {
      properties: {
        type: { const: "personas" },
        items: {
          type: "array",
          minItems: 2,
          maxItems: 4,
          items: {
            type: "object",
            properties: {
              name: { type: "string", maxLength: 28 },
              detail: { type: "string", maxLength: 90 },
              need: { type: "string", maxLength: 90 },
            },
            required: ["name", "detail"],
            additionalProperties: false,
          },
        },
      },
      required: ["type", "items"],
      additionalProperties: false,
    },
    {
      properties: {
        type: { const: "steps" },
        items: { type: "array", minItems: 2, maxItems: 6, items: { type: "string", maxLength: 40 } },
      },
      required: ["type", "items"],
      additionalProperties: false,
    },
    {
      properties: {
        type: { const: "arc" },
        items: {
          type: "array",
          minItems: 2,
          maxItems: 5,
          items: {
            type: "object",
            properties: { label: { type: "string", maxLength: 24 }, active: { type: "boolean" } },
            required: ["label"],
            additionalProperties: false,
          },
        },
      },
      required: ["type", "items"],
      additionalProperties: false,
    },
    {
      properties: { type: { const: "proof" }, text: { type: "string", maxLength: 110 } },
      required: ["type", "text"],
      additionalProperties: false,
    },
    {
      properties: {
        type: { const: "chart" },
        dataset: { type: "string", enum: Object.keys(DATASETS) },
        caption: { type: "string", maxLength: 90 },
      },
      required: ["type", "dataset"],
      additionalProperties: false,
    },
    {
      properties: {
        type: { const: "chat" },
        title: { type: "string", maxLength: 40 },
        turns: {
          type: "array",
          minItems: 2,
          maxItems: 6,
          items: {
            type: "object",
            properties: {
              from: { type: "string", enum: ["them", "u"] },
              text: { type: "string", maxLength: 160 },
            },
            required: ["from", "text"],
            additionalProperties: false,
          },
        },
        note: { type: "string", maxLength: 90 },
      },
      required: ["type", "turns"],
      additionalProperties: false,
    },
    {
      properties: {
        type: { const: "link" },
        label: { type: "string", maxLength: 40 },
        href: { type: "string", maxLength: 200 },
      },
      required: ["type", "label", "href"],
      additionalProperties: false,
    },
  ],
} as const;

export const RESPOND_TOOL = {
  name: "respond",
  description:
    "Answer the visitor on two tracks at once. `say` is spoken aloud — it is the " +
    "conversation. `show` is what stays on the glass so the visitor does not have " +
    "to hold it in their head. Always call this tool; never reply in plain text.",
  input_schema: {
    type: "object" as const,
    properties: {
      say: {
        type: "string",
        maxLength: 480,
        description:
          "What Lorem says out loud. Conversational, first-name-basis, two or three " +
          "sentences. Never read the visual blocks aloud — say the meaning, show the " +
          "detail. Do not write bare numerals here; name the figure in words or let " +
          "the metrics block carry it.",
      },
      show: {
        type: "array",
        maxItems: 4,
        description:
          "The visual scaffold for this turn, in reading order. Empty for small talk. " +
          "Add a block only when it carries something speech cannot: a number, a " +
          "comparison, a sequence, a verbatim quote. Never decorate.",
        items: blockSchema,
      },
      chips: {
        type: "array",
        maxItems: 3,
        description:
          "Follow-ups, phrased the way the visitor would say them ('what did that " +
          "cost?', 'who did you talk to?'). Draw them from what this specific person " +
          "has been asking about, not a fixed menu.",
        items: { type: "string", maxLength: 34 },
      },
      forgetName: {
        type: "boolean",
        description:
          "Set true when the visitor corrects who you thought they were, denies " +
          "a name you used, or asks to be forgotten ('that's not me', 'I'm not " +
          "Dinesh', 'forget that'). Clears the stored name immediately. When in " +
          "doubt, set it — being forgotten is recoverable, being greeted as the " +
          "wrong person on a later visit is not.",
      },
      rememberName: {
        type: "string",
        maxLength: 24,
        description:
          "ONLY when the visitor volunteered their own first name in this turn " +
          "('I'm Priya', 'Sam here'). First name only. Never guess from an email " +
          "address, never infer from context, never fill this from a name they " +
          "mentioned about someone else. Omit the field entirely if unsure — a " +
          "wrong name greeting them next visit is worse than no name at all.",
      },
    },
    required: ["say"],
    additionalProperties: false,
  },
};
