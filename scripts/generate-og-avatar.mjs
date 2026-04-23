// Pre-renders a circular, softly-framed avatar PNG used as the OG card logo by
// src/pages/og/[...route].ts. Run: `node scripts/generate-og-avatar.mjs`.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import CanvasKitInit from "canvaskit-wasm/bin/full/canvaskit.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "..", "public", "images", "posts", "andras.png");
const OUT = join(__dirname, "..", "public", "og-templates", "avatar.png");

const SIZE = 256; // 2x the display size so the OG scaler gets crisp pixels.

const surface = (await CanvasKitInit()).MakeSurface;
const CanvasKit = await CanvasKitInit();

const avatarSurface = CanvasKit.MakeSurface(SIZE, SIZE);
const canvas = avatarSurface.getCanvas();

const srcBuf = await readFile(SRC);
const img = CanvasKit.MakeImageFromEncoded(srcBuf);
if (!img) throw new Error("failed to decode avatar source");

// Cream frame ring — a thin outer ring that picks up the paper colour.
const frame = new CanvasKit.Paint();
frame.setColor(CanvasKit.Color4f(251 / 255, 244 / 255, 226 / 255, 1));
canvas.drawCircle(SIZE / 2, SIZE / 2, SIZE / 2, frame);

// Clip to circle inset by a few pixels so the frame stays visible.
const inset = 6;
const radius = SIZE / 2 - inset;
canvas.save();
canvas.clipRRect(
  CanvasKit.RRectXY(
    CanvasKit.XYWHRect(inset, inset, SIZE - 2 * inset, SIZE - 2 * inset),
    radius,
    radius,
  ),
  CanvasKit.ClipOp.Intersect,
  true,
);

// Draw the portrait with a cover-fit to fill the circle.
const iw = img.width();
const ih = img.height();
const scale = Math.max((SIZE - 2 * inset) / iw, (SIZE - 2 * inset) / ih);
const dw = iw * scale;
const dh = ih * scale;
const dx = (SIZE - dw) / 2;
const dy = (SIZE - dh) / 2;
canvas.drawImageRect(
  img,
  CanvasKit.XYWHRect(0, 0, iw, ih),
  CanvasKit.XYWHRect(dx, dy, dw, dh),
  new CanvasKit.Paint(),
);
canvas.restore();

// Subtle dark ring (ink at ~30% alpha) around the portrait.
const stroke = new CanvasKit.Paint();
stroke.setStyle(CanvasKit.PaintStyle.Stroke);
stroke.setStrokeWidth(3);
stroke.setAntiAlias(true);
stroke.setColor(CanvasKit.Color4f(27 / 255, 23 / 255, 19 / 255, 0.28));
canvas.drawCircle(SIZE / 2, SIZE / 2, SIZE / 2 - inset / 2, stroke);

const snapshot = avatarSurface.makeImageSnapshot();
const bytes = snapshot.encodeToBytes(CanvasKit.ImageFormat.PNG, 100);
avatarSurface.dispose();

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, Buffer.from(bytes));
console.log(`Wrote ${OUT} (${bytes.length} bytes)`);
