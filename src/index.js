import { chromium } from "playwright";
import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const configPath = process.argv[2] ?? "config.json";
const config = JSON.parse(readFileSync(configPath, "utf8"));

const VIEWPORT = { width: 1920, height: 1080 };

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--use-angle=metal",
    "--enable-gpu-rasterization",
    "--ignore-gpu-blocklist",
    "--enable-zero-copy",
  ],
});
const context = await browser.newContext({ viewport: VIEWPORT });
const page = await context.newPage();

for (const town of config.towns) {
  console.log(`Processing: ${town.name}`);
  const imagePaths = [];

  for (let i = 0; i < town.views.length; i++) {
    console.log(`View ${i + 1}/${town.views.length}: ${town.views[i]}`);
    imagePaths.push(await takeScreenshot(page, town.views[i]));
  }

  await postToDiscord(town, imagePaths);

  for (const p of imagePaths) {
    unlinkSync(p);
  }
}

await browser.close();

async function takeScreenshot(page, url) {
  await page.goto(url, { waitUntil: "load", timeout: 60_000 });
  await page.waitForSelector("canvas", { timeout: 30_000 });

  console.log(`Waiting ${config.renderWaitMs / 1000}s for tiles to render...`);
  await page.waitForTimeout(config.renderWaitMs);

  const base64 = await page.evaluate(
    () => document.querySelector("canvas").toDataURL("image/png").split(",")[1],
  );

  const tmpPath = join(tmpdir(), `bluemap-${Date.now()}.png`);
  writeFileSync(tmpPath, Buffer.from(base64, "base64"));

  return tmpPath;
}

async function postToDiscord(town, imagePaths) {
  const timestamp = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const form = new FormData();

  form.append(
    "payload_json",
    JSON.stringify({
      content: `**${town.name}** - ${timestamp}`,
    }),
  );

  for (let i = 0; i < imagePaths.length; i++) {
    form.append(
      `files[${i}]`,
      new Blob([readFileSync(imagePaths[i])], { type: "image/png" }),
      `${town.name.toLowerCase().replace(/\s+/g, "-")}-${i + 1}.png`,
    );
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("DISCORD_WEBHOOK_URL is not set");
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    body: form,
  });

  if (res.ok) {
    console.log("Posted to Discord.");
  } else {
    const text = await res.text();
    console.error(`Error ${res.status}: ${text}`);
    process.exit(1);
  }
}
