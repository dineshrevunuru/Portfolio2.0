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

/**
 * A discriminated union on `type`. Each branch carries its own
 * `required: ["type", …]`, so there is deliberately NO `required` at this
 * level — a top-level `required` naming a property that only exists inside the
 * branches is invalid JSON Schema. Anthropic accepted it anyway; Google
 * rejects the whole request:
 *
 *   properties[show].items.required[0]: property is not defined
 *
 * which arrives as an opaque `[lorem] upstream 400` and takes Lorem's every
 * turn down. Redundant here, load-bearing there — so it stays out.
 */
const blockSchema = {
  type: "object",
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

/* ── The same tool, in Google's schema subset ──────────────────────────────
   Google's function-declaration schema accepts `oneOf` and then ignores it:
   the request succeeds, and the model — which can no longer see any branch —
   answers with `show: [{}]`. Empty objects, every turn. `sanitizeBlocks` drops
   them correctly, so nothing breaks loudly; the visual track simply goes dark
   while speech carries on sounding fine. That is the worst shape of failure
   this project keeps meeting, and it is why this is derived rather than
   written: a hand-maintained second schema drifts from the first, silently,
   in exactly the same way.

   So the union is FLATTENED for that path — `type` becomes an enum and every
   branch field is merged in as optional — and the per-branch shapes move into
   the description, where the model can still read them. The strictness is not
   lost, only relocated: `sanitizeBlocks` was always the real gate, and it runs
   on both paths regardless of which schema produced the block.            */

type JsonSchema = Record<string, unknown>;

/** Merge two same-named string fields by keeping the LOOSER limit — the
 *  schema is a hint on this path, and `sanitizeBlocks` enforces the real one. */
function looser(a: JsonSchema, b: JsonSchema): JsonSchema {
  const max = (s: JsonSchema) => (typeof s.maxLength === "number" ? s.maxLength : Infinity);
  return max(b) > max(a) ? b : a;
}

function flattenBlockSchema(): { schema: JsonSchema; shapes: string[] } {
  const props: Record<string, JsonSchema> = {};
  const itemProps: Record<string, JsonSchema> = {};
  const kinds: string[] = [];
  const shapes: string[] = [];

  for (const branch of blockSchema.oneOf as unknown as {
    properties: Record<string, JsonSchema>;
    required: string[];
  }[]) {
    const kind = (branch.properties.type as { const: string }).const;
    kinds.push(kind);
    const fields: string[] = [];

    for (const [name, spec] of Object.entries(branch.properties)) {
      if (name === "type") continue;

      // `items` is the one genuinely polymorphic field: metrics, personas,
      // steps and arc each mean something different by it. Their element
      // shapes are merged into one optional bag; `steps`, whose elements are
      // bare strings, rides along as {label} and is converted back by
      // `unflattenBlocks` below.
      if (name === "items") {
        const el = (spec as { items: JsonSchema }).items;
        if (el.type === "string") {
          itemProps.label ??= { type: "string" };
          fields.push("items[].label");
        } else {
          for (const [k, v] of Object.entries((el.properties ?? {}) as Record<string, JsonSchema>))
            itemProps[k] = itemProps[k] ? looser(itemProps[k], v) : v;
          fields.push(`items[].{${Object.keys(el.properties ?? {}).join(",")}}`);
        }
        continue;
      }

      props[name] = props[name] ? looser(props[name], spec) : spec;
      fields.push(branch.required.includes(name) ? name : `${name}?`);
    }
    shapes.push(`${kind}: ${fields.join(" ") || "(no fields)"}`);
  }

  props.items = {
    type: "array",
    items: { type: "object", properties: itemProps },
    description:
      "For metrics, personas, steps and arc only. metrics → {factId}; " +
      "personas → {name, detail, need}; steps → {label}; arc → {label, active}.",
  };
  props.type = { type: "string", enum: kinds };

  return { schema: { type: "object", properties: props, required: ["type"] }, shapes };
}

/** Undo the `steps` accommodation above: {label} elements back to bare
 *  strings, which is what `LoremBlock` and every renderer expect. */
export function unflattenBlocks(show: unknown): unknown {
  if (!Array.isArray(show)) return show;
  return show.map((b) => {
    if (!b || typeof b !== "object") return b;
    const block = b as { type?: unknown; items?: unknown };
    if (block.type !== "steps" || !Array.isArray(block.items)) return b;
    return {
      ...block,
      items: block.items.map((i) =>
        i && typeof i === "object" && typeof (i as { label?: unknown }).label === "string"
          ? (i as { label: string }).label
          : i,
      ),
    };
  });
}

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

/**
 * `RESPOND_TOOL` with only the `show` items reshaped — same name, same
 * description, same every other field, so the two paths ask for the same thing
 * and differ only where Google forces them to. Built at module load from the
 * strict schema above, so adding a block type updates both.
 */
const flattened = flattenBlockSchema();

export const RESPOND_TOOL_FLAT = {
  ...RESPOND_TOOL,
  input_schema: {
    ...RESPOND_TOOL.input_schema,
    properties: {
      ...RESPOND_TOOL.input_schema.properties,
      show: {
        ...RESPOND_TOOL.input_schema.properties.show,
        description:
          RESPOND_TOOL.input_schema.properties.show.description +
          " Each block's fields, by type — " +
          flattened.shapes.join(" · ") +
          ". Fields not listed for a type do not belong on it.",
        items: flattened.schema,
      },
    },
  },
};
