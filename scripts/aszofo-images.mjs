// Builds the responsive photo set for the Aszófő pages.
//
// Source photos live with the Balaton cottage posts. This script crops them
// (keeping people out of frame), applies one quiet grade so the phone shots
// read as a set, and writes WebP widths to public/aszofo/img/. It also writes
// src/aszofo/images.json with dimensions and a tiny blurred placeholder for
// each photo, which the pages use for layout and loading.
//
// Run after changing a photo or crop: node scripts/aszofo-images.mjs
// Output is committed, so this is not part of the build.

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const SRC_DIR = "public/images/posts/balaton-cottage";
const OUT_DIR = "public/aszofo/img";
const MANIFEST = "src/aszofo/images.json";
const WIDTHS = [720, 1200, 1800];
const QUALITY = 74;

// crop is [left, top, width, height] as fractions of the source image.
const PHOTOS = [
  { name: "front", src: "cottage-front-sunset.jpeg" },
  { name: "terrace", src: "garden-view-terrace.jpeg", crop: [0, 0, 1, 0.9] },
  { name: "vines-lake", src: "vineyard-balaton-view.jpeg" },
  { name: "vines-house", src: "vineyard-cottage-wide.jpeg" },
  // Cropped below the old television, which is leaving with the renovation.
  { name: "table", src: "dining-room.jpeg", crop: [0, 0.45, 1, 0.55] },
  { name: "door", src: "living-room-garden-door.jpeg" },
  { name: "pergola", src: "terrace-pergola-side.jpeg" },
  { name: "stove", src: "tile-stove-living.jpeg", crop: [0.1, 0, 0.47, 0.68] },
  {
    name: "beams",
    src: "master-bedroom-beams.jpeg",
    crop: [0.4, 0, 0.6, 0.76],
  },
  { name: "cellar", src: "wine-cellar.jpeg", crop: [0, 0, 1, 0.46] },
];

function grade(pipeline) {
  return pipeline
    .modulate({ saturation: 0.84 })
    .linear(0.92, 10)
    .recomb([
      [1.02, 0.02, 0],
      [0, 1, 0],
      [0, 0.02, 0.94],
    ]);
}

async function base(photo) {
  const input = sharp(join(SRC_DIR, photo.src)).rotate();
  const meta = await input.metadata();
  if (!photo.crop) return { buffer: await input.toBuffer(), meta };
  const [l, t, w, h] = photo.crop;
  const region = {
    left: Math.round(meta.width * l),
    top: Math.round(meta.height * t),
    width: Math.round(meta.width * w),
    height: Math.round(meta.height * h),
  };
  const buffer = await input.extract(region).toBuffer();
  return { buffer, meta: { width: region.width, height: region.height } };
}

await mkdir(OUT_DIR, { recursive: true });

const manifest = {};
for (const photo of PHOTOS) {
  const { buffer, meta } = await base(photo);
  // Every standard width the photo can fill, plus its own width when that is
  // meaningfully larger than the last standard step.
  const widths = WIDTHS.filter((w) => w <= meta.width);
  const top = widths.at(-1) ?? 0;
  if (meta.width < WIDTHS.at(-1) && meta.width - top > 150) {
    widths.push(meta.width);
  }

  for (const width of widths) {
    await grade(sharp(buffer).resize({ width }))
      .webp({ quality: QUALITY })
      .toFile(join(OUT_DIR, `${photo.name}-${width}.webp`));
  }

  const placeholder = await grade(sharp(buffer).resize({ width: 16 }))
    .blur(0.6)
    .webp({ quality: 40 })
    .toBuffer();

  manifest[photo.name] = {
    width: meta.width,
    height: meta.height,
    widths,
    placeholder: `data:image/webp;base64,${placeholder.toString("base64")}`,
  };
  console.log(`${photo.name}: ${widths.join(", ")}`);
}

await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${MANIFEST}`);
