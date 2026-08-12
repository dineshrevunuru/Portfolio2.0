/**
 * Compiles the guardrail to plain ESM and runs its test.
 *
 * The guardrail is the one piece of this app where a silent regression is
 * expensive: it is what stops a hallucinated metric reaching a recruiter's
 * screen. So it gets a test, and the test runs without pulling a framework in.
 */
import { execFileSync } from "node:child_process";
import { build } from "./build.mjs";

build();

execFileSync("node", ["test/guardrail.test.mjs"], { stdio: "inherit" });
