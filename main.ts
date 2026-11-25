// The Best Meal You Ever Had — make.fun entry.
//
// One sentence about the best meal I ever had: my grandmother's rendang,
// eaten in her kitchen while the rain came down. Written to stdout and to
// $MAKEFUN_OUTPUT_DIR/entry.txt with no trailing newline in the file.
// Stdlib only, no network, deterministic on every run.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "My grandmother's beef rendang, slow-cooked for hours in her tiny Padang kitchen until the coconut gravy turned dark and glossy, made me lick the wok clean while rain drummed on the tin roof.";

const MAX_CHARS = 200;

const problems: string[] = [];
if (ENTRY.length === 0 || ENTRY.length > MAX_CHARS) {
  problems.push(`length ${ENTRY.length} is outside 1-${MAX_CHARS} characters`);
}
if (ENTRY.trim() !== ENTRY || ENTRY.trim().length === 0) {
  problems.push("entry has leading/trailing whitespace or is blank");
}
if ((ENTRY.match(/\./g) ?? []).length !== 1 || !ENTRY.endsWith(".")) {
  problems.push("entry must be exactly one sentence ending in a period");
}
if (problems.length > 0) {
  throw new Error(`invalid entry: ${problems.join("; ")}`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
console.log(ENTRY);
