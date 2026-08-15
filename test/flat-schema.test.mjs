/**
 * The flat schema exists because Google accepts `oneOf` and then ignores it:
 * the request succeeds and the model answers `show: [{}]` — empty blocks,
 * every turn, while speech carries on sounding fine. Nothing throws. The
 * visual track just goes dark.
 *
 * That is the failure this file is here to catch, so the assertions are about
 * DERIVATION rather than shape: the flat schema is built from the strict one
 * at module load, and these checks fail the moment a new block type is added
 * to `blockSchema` without reaching the Gemini path. A hand-maintained copy
 * would pass a shape test forever while drifting out from under production.
 */
import assert from "node:assert/strict";
import {
  RESPOND_TOOL,
  RESPOND_TOOL_FLAT,
  unflattenBlocks,
} from "../.test-build/components/lorem/protocol.js";

const strictBranches = RESPOND_TOOL.input_schema.properties.show.items.oneOf;
const flatItems = RESPOND_TOOL_FLAT.input_schema.properties.show.items;

/* 1 ─ the schema Google rejected outright: `required` naming a property that
      exists only inside the branches. Its absence is load-bearing on BOTH
      paths, so it is asserted on the strict schema too. */
assert.equal(
  RESPOND_TOOL.input_schema.properties.show.items.required,
  undefined,
  "top-level `required` is back on blockSchema — Google 400s the entire request",
);

/* 2 ─ every block type reaches the flat path. This is the drift alarm: add a
      type to blockSchema, forget the Gemini path, and this fails. */
const strictKinds = strictBranches.map((b) => b.properties.type.const).sort();
const flatKinds = [...flatItems.properties.type.enum].sort();
assert.deepEqual(
  flatKinds,
  strictKinds,
  "a block type exists in the strict schema but not the flat one",
);

/* 3 ─ every branch FIELD reaches the flat path, or the model cannot emit it.
      `items` is deliberately merged rather than per-branch — see below. */
for (const branch of strictBranches) {
  const kind = branch.properties.type.const;
  for (const field of Object.keys(branch.properties)) {
    if (field === "type") continue;
    assert.ok(
      flatItems.properties[field],
      `field "${field}" of block "${kind}" is missing from the flat schema`,
    );
  }
}

/* 4 ─ the per-branch shapes survive in the description, which is the only
      place left for them once the union is gone. Without this the model sees
      fifteen optional fields and no idea which pair with which type. */
const desc = RESPOND_TOOL_FLAT.input_schema.properties.show.description;
for (const kind of strictKinds) {
  assert.ok(desc.includes(`${kind}:`), `block "${kind}" is not described in the flat schema`);
}

/* 5 ─ the flat schema stays inside Google's subset: no oneOf/anyOf/allOf/const
      anywhere beneath `show`, at any depth. */
(function noUnions(node, path) {
  if (!node || typeof node !== "object") return;
  for (const banned of ["oneOf", "anyOf", "allOf", "const"]) {
    assert.ok(!(banned in node), `flat schema still contains "${banned}" at ${path}`);
  }
  for (const [k, v] of Object.entries(node)) noUnions(v, `${path}.${k}`);
})(flatItems, "show.items");

/* 6 ─ the two tools ask for the same thing everywhere Google does not force a
      difference. `show` is the ONLY key allowed to differ. */
assert.equal(RESPOND_TOOL_FLAT.name, RESPOND_TOOL.name);
assert.equal(RESPOND_TOOL_FLAT.description, RESPOND_TOOL.description);
for (const key of Object.keys(RESPOND_TOOL.input_schema.properties)) {
  if (key === "show") continue;
  assert.deepEqual(
    RESPOND_TOOL_FLAT.input_schema.properties[key],
    RESPOND_TOOL.input_schema.properties[key],
    `"${key}" drifted between the strict and flat schemas`,
  );
}

/* 7 ─ `text` merged to the LOOSEST limit. heading caps at 90 and text at 320;
      taking the first would have silently truncated every text block. */
assert.equal(
  flatItems.properties.text.maxLength,
  Math.max(...strictBranches.filter((b) => b.properties.text).map((b) => b.properties.text.maxLength)),
  "merged `text` did not keep the loosest limit",
);

/* 8 ─ the steps round-trip. `steps` is the one block whose elements are bare
      strings; it rides the flat path as {label} and must come back unchanged. */
assert.deepEqual(
  unflattenBlocks([{ type: "steps", items: [{ label: "research" }, { label: "build" }] }]),
  [{ type: "steps", items: ["research", "build"] }],
  "steps items did not convert back to bare strings",
);
// every other block passes through untouched, items included
assert.deepEqual(
  unflattenBlocks([{ type: "metrics", items: [{ factId: "cac_before" }] }]),
  [{ type: "metrics", items: [{ factId: "cac_before" }] }],
  "a non-steps block was altered on the way through",
);
assert.deepEqual(
  unflattenBlocks([{ type: "arc", items: [{ label: "discovery", active: true }] }]),
  [{ type: "arc", items: [{ label: "discovery", active: true }] }],
  "arc items were flattened to strings — only steps should be",
);
// malformed input is passed through, not thrown on: a bad block is the
// guardrail's business, and this runs before it.
assert.deepEqual(unflattenBlocks("not an array"), "not an array");
assert.deepEqual(unflattenBlocks([null, { type: "steps" }]), [null, { type: "steps" }]);
assert.deepEqual(
  unflattenBlocks([{ type: "steps", items: ["already a string"] }]),
  [{ type: "steps", items: ["already a string"] }],
  "already-bare steps items were mangled",
);

console.log(
  `PASS — flat schema derived from ${strictKinds.length} block types, ` +
    `no unions survive, steps round-trips, strict and flat differ only in \`show\``,
);
