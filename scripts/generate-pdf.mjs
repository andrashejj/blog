import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PORT = 4322;
const BASE_URL = `http://localhost:${PORT}`;
const WORKSHEET_PATH = "/blog/2026/03/noahs-daily-exercises";

function startDevServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn("pnpm", ["astro", "dev", "--port", String(PORT)], {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const timeout = setTimeout(() => {
      reject(new Error("Dev server did not start within 30s"));
    }, 30_000);

    proc.stdout.on("data", (chunk) => {
      if (chunk.toString().includes(`localhost:${PORT}`)) {
        clearTimeout(timeout);
        resolve(proc);
      }
    });
    proc.stderr.on("data", (chunk) => {
      const msg = chunk.toString();
      if (msg.includes(`localhost:${PORT}`)) {
        clearTimeout(timeout);
        resolve(proc);
      }
    });
    proc.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

async function generatePDF() {
  console.log("Starting dev server...");
  const server = await startDevServer();

  try {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(`${BASE_URL}${WORKSHEET_PATH}`, {
      waitUntil: "networkidle0",
      timeout: 60_000,
    });

    // Wait for AI-generated content to load (loading skeletons disappear)
    await page.waitForFunction(
      () => !document.querySelector(".loading-skeleton"),
      { timeout: 30_000 },
    );
    // Extra settle time for any final renders
    await new Promise((r) => setTimeout(r, 1000));

    // Hide site chrome and make worksheet full-width for print
    await page.evaluate(() => {
      const header = document.querySelector("body > div > header");
      const footer = document.querySelector("body > div > footer");
      const main = document.querySelector("body > div > main");
      const proseEls = document.querySelectorAll(
        ".prose > *:not(.worksheet-container)",
      );

      if (header) header.style.display = "none";
      if (footer) footer.style.display = "none";
      if (main) {
        main.style.width = "100%";
        main.style.maxWidth = "100%";
        main.style.padding = "0";
        main.style.margin = "0";
      }
      for (const el of proseEls) {
        el.style.display = "none";
      }
      document.body.style.background = "white";

      // Hide all print:hidden elements
      for (const el of document.querySelectorAll("[class*='print:hidden']")) {
        el.style.display = "none";
      }
    });

    const pdfPath = join(ROOT, "public", "assets", "noahs-exercises.pdf");
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", right: "5mm", bottom: "10mm", left: "5mm" },
    });

    await browser.close();
    console.log(`PDF generated: ${pdfPath}`);
  } finally {
    server.kill("SIGTERM");
  }
}

generatePDF().catch((err) => {
  console.error("PDF generation failed:", err);
  process.exit(1);
});
