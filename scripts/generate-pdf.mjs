import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generatePDF() {
  console.log("Starting PDF generation...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Point to the local HTML file in public/assets
  const htmlPath = join(
    __dirname,
    "..",
    "public",
    "assets",
    "noahs-exercises-worksheet.html",
  );
  const pdfPath = join(
    __dirname,
    "..",
    "public",
    "assets",
    "noahs-exercises.pdf",
  );

  await page.goto(`file://${htmlPath}`, {
    waitUntil: "networkidle0",
  });

  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });

  await browser.close();
  console.log(`PDF successfully generated at: ${pdfPath}`);
}

generatePDF().catch(console.error);
