// Generates 640px WebP thumbnails for the board-project photo roll.
//
// The board post's contact-sheet grid renders ~190 photos as small squares;
// serving the multi-MB originals there is wasted bandwidth. This script writes
// public/images/board-project/thumbs/<name>.webp for every image in the
// directory. The grid points src at the thumb and data-full at the original,
// which the site lightbox opens on click.
//
// Run after adding new photos: node scripts/make-board-thumbs.mjs
// Output is committed, so this is not part of the build.

import { mkdir, readdir, stat } from "node:fs/promises";
import { extname, join, parse } from "node:path";
import sharp from "sharp";

const SRC_DIR = "public/images/board-project";
const OUT_DIR = join(SRC_DIR, "thumbs");
const MAX_EDGE = 640;
const QUALITY = 70;

const files = (await readdir(SRC_DIR)).filter((name) =>
  [".jpg", ".jpeg", ".png"].includes(extname(name).toLowerCase()),
);

await mkdir(OUT_DIR, { recursive: true });

let made = 0;
let skipped = 0;
for (const name of files) {
  const outPath = join(OUT_DIR, `${parse(name).name}.webp`);
  const exists = await stat(outPath).then(
    () => true,
    () => false,
  );
  if (exists) {
    skipped++;
    continue;
  }
  await sharp(join(SRC_DIR, name))
    .rotate() // respect EXIF orientation
    .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outPath);
  made++;
}

console.log(`thumbs: ${made} generated, ${skipped} already existed`);
