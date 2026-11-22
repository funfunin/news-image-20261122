import { copyFileSync, mkdirSync, renameSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const src = join(here, "entry.png");
const srcSize = statSync(src).size;
if (srcSize === 0) {
  throw new Error("entry.png is empty");
}
mkdirSync(outDir, { recursive: true });
// Copy to a temp file then rename, so a failed run never leaves a
// half-written entry.png in the output directory.
const tmp = join(outDir, ".entry.png.tmp");
copyFileSync(src, tmp);
if (statSync(tmp).size !== srcSize) {
  throw new Error("copied entry.png size mismatch");
}
renameSync(tmp, join(outDir, "entry.png"));
