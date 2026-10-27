// Helpers for syncing the SATO48 design canvas (a Claude Design artifact) into
// this codebase. design/ holds a copy of the canvas files as of the last sync,
// so the change to port is always `design/` → the freshly downloaded canvas.
//
//   bun scripts/design-sync.ts status <incoming>   what changed since the last sync
//   bun scripts/design-sync.ts adopt <incoming> --version <v> [--blobs <dir>]
//                                                   copy new images into public/images,
//                                                   then make <incoming> the new baseline
//   bun scripts/design-sync.ts check               every image the canvas or site uses exists
//
// <incoming> is the folder holding the downloaded `project/` directory.
import { existsSync, mkdirSync, readdirSync, readFileSync, copyFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const DESIGN = "design";
const IMAGES = "public/images";
const SYNC_FILE = join(DESIGN, "SYNC.json");
const BLOB = /\/_blob\/([0-9a-f]{32})/g;

// Artboard → the source file it was ported to. Keep in step with the table in
// .claude/skills/sync-design/SKILL.md.
export const BOARDS: Record<string, string> = {
  "Main.dc.html": "src/pages/index.astro",
  "FilmChallenge.dc.html": "src/pages/film-challenge.astro",
  "FiveFest.dc.html": "src/pages/fivefest.astro",
  "Resources.dc.html": "src/pages/resources/index.astro",
  "FilmChallengeGuidelines2026.dc.html": "src/pages/resources/challenge-guidelines-2026.astro",
  "FilmChallengeTerms2026.dc.html": "src/pages/resources/challenge-terms-2026.astro",
  "AwardsPrizes2026.dc.html": "src/pages/resources/awards-prizes-2026.astro",
  "FiveFestGuidelines2026.dc.html": "src/pages/resources/fivefest-guidelines-2026.astro",
  "Nav.dc.html": "src/components/Nav.astro",
  "Footer.dc.html": "src/components/Footer.astro",
};

const boardsIn = (dir: string) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".dc.html")).sort() : [];

const blobsIn = (dir: string) => {
  const ids = new Set<string>();
  for (const f of boardsIn(dir)) for (const m of readFileSync(join(dir, f), "utf8").matchAll(BLOB)) ids.add(m[1]);
  return ids;
};

const imageFor = (id: string) => readdirSync(IMAGES).find((f) => f.startsWith(id + "."));

// Uploaded assets carry no extension, so name them by their first bytes.
function sniffExt(file: string): string | undefined {
  const b = readFileSync(file);
  const ascii = b.subarray(0, 512).toString("latin1");
  if (b[0] === 0xff && b[1] === 0xd8) return "jpg";
  if (ascii.startsWith("\x89PNG")) return "png";
  if (ascii.startsWith("GIF8")) return "gif";
  if (ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP") return "webp";
  if (/^\s*(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*<svg/i.test(ascii) || ascii.includes("<svg")) return "svg";
}

function status(incoming: string) {
  const next = join(incoming, "project");
  if (!existsSync(next)) throw new Error(`${next} not found; download the canvas into ${incoming}/project first`);

  const before = new Set(boardsIn(DESIGN));
  const after = new Set(boardsIn(next));
  const changed: string[] = [];
  for (const f of after) {
    if (!before.has(f)) continue;
    if (readFileSync(join(DESIGN, f), "utf8") !== readFileSync(join(next, f), "utf8")) changed.push(f);
  }
  const added = [...after].filter((f) => !before.has(f));
  const removed = [...before].filter((f) => !after.has(f));
  const newBlobs = [...blobsIn(next)].filter((id) => !imageFor(id));
  const unmapped = [...after].filter((f) => !BOARDS[f]);

  const sync = existsSync(SYNC_FILE) ? JSON.parse(readFileSync(SYNC_FILE, "utf8")) : {};
  console.log(`Baseline: version ${sync.version ?? "unknown"} (synced ${sync.syncedAt ?? "never"})\n`);
  const list = (title: string, items: string[], fmt = (s: string) => s) =>
    console.log(`${title}: ${items.length ? "\n" + items.map((i) => "  - " + fmt(i)).join("\n") : "none"}`);
  list("Changed artboards", changed, (f) => `${f} → ${BOARDS[f] ?? "(no mapped source file)"}`);
  list("New artboards", added);
  list("Removed artboards", removed, (f) => `${f} (was ${BOARDS[f] ?? "unmapped"})`);
  list("Artboards with no mapped source file", unmapped);
  list("Images to download (asset ids)", newBlobs);

  for (const f of changed) {
    console.log(`\n===== ${f} → ${BOARDS[f] ?? "?"} =====`);
    // --word-diff keeps copy edits on long single-line elements readable.
    const r = spawnSync("git", ["diff", "--no-index", "--word-diff=plain", "-U2", join(DESIGN, f), join(next, f)], {
      encoding: "utf8",
    });
    process.stdout.write(r.stdout.split("\n").slice(4).join("\n"));
  }
  if (!changed.length && !added.length && !removed.length) console.log("\nNo changes since the last sync.");
}

function adopt(incoming: string, version: string, blobDir?: string) {
  const next = join(incoming, "project");
  const missing: string[] = [];
  for (const id of blobsIn(next)) {
    if (imageFor(id)) continue;
    const src = blobDir && readdirSync(blobDir).find((f) => f.startsWith(id));
    if (!src) {
      missing.push(id);
      continue;
    }
    const ext = sniffExt(join(blobDir!, src));
    if (!ext) throw new Error(`Can't tell what kind of image ${src} is`);
    copyFileSync(join(blobDir!, src), join(IMAGES, `${id}.${ext}`));
    console.log(`Added ${IMAGES}/${id}.${ext}`);
  }
  if (missing.length) throw new Error(`Download these assets into --blobs first: ${missing.join(", ")}`);

  mkdirSync(DESIGN, { recursive: true });
  for (const f of boardsIn(DESIGN)) if (!existsSync(join(next, f))) rmSync(join(DESIGN, f));
  for (const f of [...boardsIn(next), "canvas.json"]) if (existsSync(join(next, f))) copyFileSync(join(next, f), join(DESIGN, f));
  const sync = existsSync(SYNC_FILE) ? JSON.parse(readFileSync(SYNC_FILE, "utf8")) : {};
  writeFileSync(SYNC_FILE, JSON.stringify({ ...sync, version, syncedAt: new Date().toISOString() }, null, 2) + "\n");
  console.log(`Baseline is now version ${version}.`);
}

function check() {
  const problems: string[] = [];
  for (const id of blobsIn(DESIGN)) if (!imageFor(id)) problems.push(`design/ uses /_blob/${id}, missing from ${IMAGES}`);
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith(".astro") ? [join(dir, e.name)] : [],
    );
  for (const file of walk("src")) {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(/img\("([^"]+)"\)/g))
      if (!existsSync(join(IMAGES, m[1]))) problems.push(`${file}: img("${m[1]}") not in ${IMAGES}`);
    for (const m of text.matchAll(/_blob\/|\.dc\.html|\{\{\s*\w+\s*\}\}/g))
      problems.push(`${file}: canvas-only syntax left in source: ${m[0]}`);
  }
  if (problems.length) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
  console.log("OK: every image is present and no canvas syntax is left in src/.");
}

const [cmd, dir, ...rest] = process.argv.slice(2);
const flag = (name: string) => {
  const i = rest.indexOf(name);
  return i >= 0 ? rest[i + 1] : undefined;
};

if (cmd === "status" && dir) status(dir);
else if (cmd === "adopt" && dir && flag("--version")) adopt(dir, flag("--version")!, flag("--blobs"));
else if (cmd === "check") check();
else {
  console.error("usage: design-sync.ts status <dir> | adopt <dir> --version <v> [--blobs <dir>] | check");
  process.exit(2);
}
