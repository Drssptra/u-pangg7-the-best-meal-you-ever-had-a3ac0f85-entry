// The Best Meal You Ever Had — make.fun entry, v2 resubmit.
//
// A single sentence about the best meal I ever had: a Rp10,000 bowl of
// soto ayam on a Solo station platform, its broth so hot and gingery
// that I drank it standing up and missed my train on purpose.
// The program assembles the sentence from parts, checks it
// against the 1–200 character single-line gate, then writes it to
// $MAKEFUN_OUTPUT_DIR/entry.txt with no trailing newline and echoes it
// to stdout. Node 22, standard library only, no network, same output
// on every run.

import * as fs from "node:fs";
import * as path from "node:path";

// The sentence, built from phrases so each clause stays readable.
const SEGMENTS: readonly string[] = [
  "The best meal I ever had was a ",
  "Rp10,000 bowl of soto ayam on a ",
  "Solo station platform, its broth so hot and gingery ",
  "I drank it standing up, then missed my train on purpose.",
];

const ENTRY: string = SEGMENTS.join("");

const GATE = { minChars: 1, maxChars: 200 } as const;

type Rule = { label: string; ok: (text: string) => boolean };

const RULES: readonly Rule[] = [
  {
    label: "must be 1-200 characters",
    ok: (t) => [...t].length >= GATE.minChars && [...t].length <= GATE.maxChars,
  },
  {
    label: "must be a single line",
    ok: (t) => !t.includes("\n") && !t.includes("\r"),
  },
  {
    label: "must not be blank or padded with whitespace",
    ok: (t) => t.length > 0 && t === t.trim(),
  },
  {
    label: "must be one sentence ending with a period",
    ok: (t) => t.endsWith(".") && t.split(".").length === 2,
  },
  {
    label: "must name the dish and the place",
    ok: (t) => t.includes("soto ayam") && t.includes("Solo station platform"),
  },
];

function validate(text: string): void {
  const failed = RULES.filter((rule) => !rule.ok(text)).map((rule) => rule.label);
  if (failed.length > 0) {
    const count = [...text].length;
    throw new Error(
      `entry failed gate at ${count} chars — ${failed.join("; ")}`,
    );
  }
}

function main(): void {
  validate(ENTRY);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  fs.mkdirSync(outDir, { recursive: true });
  const target = path.join(outDir, "entry.txt");
  fs.writeFileSync(target, Buffer.from(ENTRY, "utf8"));

  process.stdout.write(`${ENTRY}\n`);
}

main();
