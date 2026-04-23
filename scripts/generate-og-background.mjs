// Pre-renders the warm-paper OG background used by src/pages/og/[...route].ts.
// Run once (or whenever the palette changes): `node scripts/generate-og-background.mjs`.
// The resulting PNG is committed at public/og-templates/paper.png.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import CanvasKitInit from "canvaskit-wasm/bin/full/canvaskit.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "og-templates", "paper.png");

const WIDTH = 1200;
const HEIGHT = 630;

// Palette (matches src/styles/global.css)
const paper = [241 / 255, 230 / 255, 207 / 255, 1];
const paperDeep = [232 / 255, 217 / 255, 184 / 255, 1];
const ochre = [196 / 255, 137 / 255, 45 / 255];
const pine = [14 / 255, 65 / 255, 64 / 255];
const terracotta = [191 / 255, 64 / 255, 36 / 255];
const rule = [200 / 255, 182 / 255, 148 / 255, 1];
const ink = [27 / 255, 23 / 255, 19 / 255, 1];

const CanvasKit = await CanvasKitInit();

const surface = CanvasKit.MakeSurface(WIDTH, HEIGHT);
const canvas = surface.getCanvas();

// Base paper colour with a vertical grade toward the deeper cream at the fold.
const bgPaint = new CanvasKit.Paint();
bgPaint.setShader(
  CanvasKit.Shader.MakeLinearGradient(
    [0, 0],
    [0, HEIGHT],
    [CanvasKit.Color4f(...paper), CanvasKit.Color4f(...paperDeep)],
    null,
    CanvasKit.TileMode.Clamp,
  ),
);
canvas.drawRect(CanvasKit.XYWHRect(0, 0, WIDTH, HEIGHT), bgPaint);

// Atmospheric radial glows (ochre top-right, pine bottom-left, terracotta centre).
function glow(cx, cy, radius, [r, g, b], alpha) {
  const paint = new CanvasKit.Paint();
  paint.setShader(
    CanvasKit.Shader.MakeRadialGradient(
      [cx, cy],
      radius,
      [CanvasKit.Color4f(r, g, b, alpha), CanvasKit.Color4f(r, g, b, 0)],
      [0, 1],
      CanvasKit.TileMode.Clamp,
    ),
  );
  paint.setBlendMode(CanvasKit.BlendMode.SrcOver);
  canvas.drawRect(CanvasKit.XYWHRect(0, 0, WIDTH, HEIGHT), paint);
}

glow(WIDTH * 0.9, -80, 820, ochre, 0.22);
glow(-60, HEIGHT + 80, 780, pine, 0.18);
glow(WIDTH * 0.5, HEIGHT * 0.5, 540, terracotta, 0.07);

// Grain — fractal noise baked into the paper. Darken via multiply for a tactile feel.
const noisePaint = new CanvasKit.Paint();
noisePaint.setShader(
  CanvasKit.Shader.MakeFractalNoise(1.3, 1.3, 2, 0, 220, 220),
);
noisePaint.setBlendMode(CanvasKit.BlendMode.Multiply);
noisePaint.setAlphaf(0.18);
canvas.drawRect(CanvasKit.XYWHRect(0, 0, WIDTH, HEIGHT), noisePaint);

// Dashed masthead rule near the top edge.
function dashedRule(y, color, alpha) {
  const paint = new CanvasKit.Paint();
  paint.setStyle(CanvasKit.PaintStyle.Stroke);
  paint.setColor(CanvasKit.Color4f(color[0], color[1], color[2], alpha));
  paint.setStrokeWidth(1.5);
  const effect = CanvasKit.PathEffect.MakeDash([6, 4], 0);
  paint.setPathEffect(effect);
  canvas.drawLine(60, y, WIDTH - 60, y, paint);
  effect.delete();
  paint.delete();
}
dashedRule(92, rule, 0.9);
dashedRule(100, rule, 0.55);

// Bottom accent: thin pine rule above a slim terracotta stripe.
const pinePaint = new CanvasKit.Paint();
pinePaint.setColor(CanvasKit.Color4f(...pine, 0.55));
canvas.drawRect(CanvasKit.XYWHRect(0, HEIGHT - 10, WIDTH, 2), pinePaint);

const barPaint = new CanvasKit.Paint();
barPaint.setColor(CanvasKit.Color4f(...terracotta, 1));
canvas.drawRect(CanvasKit.XYWHRect(0, HEIGHT - 6, WIDTH, 6), barPaint);

// Encode.
const image = surface.makeImageSnapshot();
const bytes = image.encodeToBytes(CanvasKit.ImageFormat.PNG, 100);
surface.dispose();

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, Buffer.from(bytes));
console.log(`Wrote ${OUT} (${bytes.length} bytes)`);
