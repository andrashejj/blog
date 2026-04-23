// Custom OG renderer. astro-og-canvas only supports top-left, left-aligned
// content; that leaves our 1200×630 share card with a tiny masthead avatar and
// an empty bottom half. This module renders a proper newspaper-style card on
// top of the baked paper.png: centered masthead, rules, centered title +
// italic deck, and a byline footer with portrait and URL.

import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const WIDTH = 1200;
const HEIGHT = 630;

type RGBA = [number, number, number, number];

const ink: RGBA = [27 / 255, 23 / 255, 19 / 255, 1];
const inkSoft: RGBA = [60 / 255, 49 / 255, 38 / 255, 1];
const muted: RGBA = [111 / 255, 95 / 255, 79 / 255, 1];
const ruleColor: RGBA = [200 / 255, 182 / 255, 148 / 255, 1];
const terracotta: RGBA = [191 / 255, 64 / 255, 36 / 255, 1];

type CanvasKit = any;
type Paragraph = any;
type Canvas = any;

let ckPromise: Promise<CanvasKit> | null = null;
async function getCanvasKit(): Promise<CanvasKit> {
  if (!ckPromise) {
    ckPromise = (async () => {
      const { default: init } = await import("canvaskit-wasm/full");
      return init({
        locateFile: (file: string) =>
          require.resolve(`canvaskit-wasm/bin/full/${file}`),
      });
    })();
  }
  return ckPromise;
}

let mgrPromise: Promise<any> | null = null;
async function getFontMgr() {
  if (!mgrPromise) {
    mgrPromise = (async () => {
      const CK = await getCanvasKit();
      const files = [
        "./public/fonts/Fraunces-SemiBold.ttf",
        "./public/fonts/Fraunces-Regular.ttf",
        "./public/fonts/Fraunces-Italic.ttf",
      ];
      const datas = await Promise.all(files.map((f) => readFile(f)));
      return CK.FontMgr.FromData(...datas.map((d) => d.buffer));
    })();
  }
  return mgrPromise;
}

let paperBytes: Uint8Array | null = null;
async function getPaperBytes(): Promise<Uint8Array> {
  if (!paperBytes) {
    paperBytes = await readFile("./public/og-templates/paper.png");
  }
  return paperBytes;
}

let avatarBytes: Uint8Array | null = null;
async function getAvatarBytes(): Promise<Uint8Array> {
  if (!avatarBytes) {
    avatarBytes = await readFile("./public/og-templates/avatar.png");
  }
  return avatarBytes;
}

interface TextOpts {
  text: string;
  fontSize: number;
  color: RGBA;
  align: "left" | "center" | "right";
  weight?: "Normal" | "SemiBold";
  italic?: boolean;
  lineHeight?: number;
  letterSpacing?: number;
  maxLines?: number;
}

function buildParagraph(
  CK: CanvasKit,
  fontMgr: any,
  opts: TextOpts,
): Paragraph {
  const alignMap = {
    left: CK.TextAlign.Left,
    center: CK.TextAlign.Center,
    right: CK.TextAlign.Right,
  };
  const weightMap = {
    Normal: CK.FontWeight.Normal,
    SemiBold: CK.FontWeight.SemiBold,
  };
  const paragraphStyle = new CK.ParagraphStyle({
    textAlign: alignMap[opts.align],
    textStyle: {
      color: CK.Color4f(...opts.color),
      fontFamilies: ["Fraunces"],
      fontSize: opts.fontSize,
      fontStyle: {
        weight: weightMap[opts.weight ?? "Normal"],
        slant: opts.italic ? CK.FontSlant.Italic : CK.FontSlant.Upright,
      },
      heightMultiplier: opts.lineHeight ?? 1.15,
      letterSpacing: opts.letterSpacing ?? 0,
    },
    maxLines: opts.maxLines,
    ellipsis: "…",
  });
  const builder = CK.ParagraphBuilder.Make(paragraphStyle, fontMgr);
  builder.addText(opts.text);
  return builder.build();
}

function drawDashedRule(
  CK: CanvasKit,
  canvas: Canvas,
  x1: number,
  x2: number,
  y: number,
  color: RGBA,
  alpha = 1,
  dash: [number, number] = [6, 4],
  strokeWidth = 1.4,
) {
  const paint = new CK.Paint();
  paint.setStyle(CK.PaintStyle.Stroke);
  paint.setColor(CK.Color4f(color[0], color[1], color[2], color[3] * alpha));
  paint.setStrokeWidth(strokeWidth);
  paint.setAntiAlias(true);
  const effect = CK.PathEffect.MakeDash(dash, 0);
  paint.setPathEffect(effect);
  canvas.drawLine(x1, y, x2, y, paint);
  effect.delete();
  paint.delete();
}

function drawSolidRule(
  CK: CanvasKit,
  canvas: Canvas,
  x1: number,
  x2: number,
  y: number,
  color: RGBA,
  alpha = 1,
  strokeWidth = 1.4,
) {
  const paint = new CK.Paint();
  paint.setStyle(CK.PaintStyle.Stroke);
  paint.setColor(CK.Color4f(color[0], color[1], color[2], color[3] * alpha));
  paint.setStrokeWidth(strokeWidth);
  paint.setAntiAlias(true);
  canvas.drawLine(x1, y, x2, y, paint);
  paint.delete();
}

export interface RenderOGParams {
  title: string;
  description?: string;
  kicker?: string;
}

export async function renderOG(params: RenderOGParams): Promise<Buffer> {
  const CK = await getCanvasKit();
  const fontMgr = await getFontMgr();
  const paper = await getPaperBytes();
  const avatar = await getAvatarBytes();

  const surface = CK.MakeSurface(WIDTH, HEIGHT);
  const canvas = surface.getCanvas();

  // Paper background (radial glows + grain baked in).
  const paperImg = CK.MakeImageFromEncoded(paper);
  if (paperImg) {
    canvas.drawImageRect(
      paperImg,
      CK.XYWHRect(0, 0, paperImg.width(), paperImg.height()),
      CK.XYWHRect(0, 0, WIDTH, HEIGHT),
      new CK.Paint(),
    );
  }

  const gutter = 80;
  const innerW = WIDTH - gutter * 2;

  // ── Masthead ───────────────────────────────────────────────────────────
  drawDashedRule(CK, canvas, gutter, WIDTH - gutter, 52, ruleColor, 0.9);
  drawDashedRule(CK, canvas, gutter, WIDTH - gutter, 60, ruleColor, 0.5);

  const masthead = buildParagraph(CK, fontMgr, {
    text: "ANDRAS HEJJ · FIELD NOTES",
    fontSize: 18,
    color: muted,
    align: "center",
    letterSpacing: 6,
  });
  masthead.layout(innerW);
  canvas.drawParagraph(masthead, gutter, 78);

  drawDashedRule(CK, canvas, gutter, WIDTH - gutter, 116, ruleColor, 0.9);
  drawDashedRule(CK, canvas, gutter, WIDTH - gutter, 124, ruleColor, 0.5);

  // ── Kicker row (section label + domain) ────────────────────────────────
  const kickerText = (params.kicker ?? "Dispatch").toUpperCase();
  const kicker = buildParagraph(CK, fontMgr, {
    text: kickerText,
    fontSize: 14,
    color: terracotta,
    weight: "SemiBold",
    align: "left",
    letterSpacing: 3.5,
  });
  kicker.layout(innerW);
  canvas.drawParagraph(kicker, gutter, 148);

  const url = buildParagraph(CK, fontMgr, {
    text: "andrashejj.com",
    fontSize: 14,
    color: muted,
    align: "right",
    letterSpacing: 3.5,
  });
  url.layout(innerW);
  canvas.drawParagraph(url, gutter, 148);

  // ── Title + deck (centered, vertically balanced) ───────────────────────
  const titleBoxW = WIDTH - 160;
  const title = buildParagraph(CK, fontMgr, {
    text: params.title,
    fontSize: pickTitleSize(params.title),
    color: ink,
    weight: "SemiBold",
    align: "center",
    lineHeight: 1.05,
    letterSpacing: -1,
    maxLines: 3,
  });
  title.layout(titleBoxW);
  const titleH = title.getHeight();

  let deck: Paragraph | null = null;
  let deckH = 0;
  if (params.description) {
    deck = buildParagraph(CK, fontMgr, {
      text: params.description,
      fontSize: 28,
      color: inkSoft,
      italic: true,
      align: "center",
      lineHeight: 1.4,
      maxLines: 2,
    });
    deck.layout(WIDTH - 240);
    deckH = deck.getHeight();
  }

  const gap = deck ? 28 : 0;
  const blockH = titleH + gap + deckH;
  const bandTop = 170;
  const bandBottom = 490;
  const blockTop = bandTop + Math.max(0, (bandBottom - bandTop - blockH) / 2);

  canvas.drawParagraph(title, 80, blockTop);
  if (deck) {
    canvas.drawParagraph(deck, 120, blockTop + titleH + gap);
  }

  // ── Byline footer ──────────────────────────────────────────────────────
  drawSolidRule(CK, canvas, gutter, WIDTH - gutter, 522, ruleColor, 0.7, 1);

  const avImg = CK.MakeImageFromEncoded(avatar);
  if (avImg) {
    const size = 64;
    canvas.drawImageRect(
      avImg,
      CK.XYWHRect(0, 0, avImg.width(), avImg.height()),
      CK.XYWHRect(gutter, 540, size, size),
      new CK.Paint(),
    );
  }

  const byline = buildParagraph(CK, fontMgr, {
    text: "Andras Hejj",
    fontSize: 22,
    color: ink,
    weight: "SemiBold",
    align: "left",
    lineHeight: 1.1,
  });
  byline.layout(600);
  canvas.drawParagraph(byline, gutter + 80, 546);

  const tag = buildParagraph(CK, fontMgr, {
    text: "Founder · builder · writing on the practice",
    fontSize: 15,
    color: muted,
    italic: true,
    align: "left",
    lineHeight: 1.2,
  });
  tag.layout(600);
  canvas.drawParagraph(tag, gutter + 80, 578);

  const stamp = buildParagraph(CK, fontMgr, {
    text: "№ 016",
    fontSize: 30,
    color: terracotta,
    weight: "SemiBold",
    italic: true,
    align: "right",
    lineHeight: 1,
  });
  stamp.layout(innerW);
  canvas.drawParagraph(stamp, gutter, 556);

  // Encode.
  const image = surface.makeImageSnapshot();
  const bytes = image.encodeToBytes(CK.ImageFormat.PNG, 100);
  surface.dispose();
  return Buffer.from(bytes);
}

function pickTitleSize(text: string): number {
  const len = text.length;
  if (len <= 24) return 88;
  if (len <= 40) return 76;
  if (len <= 60) return 64;
  if (len <= 90) return 54;
  return 46;
}
