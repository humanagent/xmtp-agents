import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const sizes = [192, 512];
const backgroundColor = "#0b0b0d";
const accentColor = "#2e7bff";

async function generateIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${backgroundColor}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.3}" fill="${accentColor}"/>
    </svg>
  `;

  const png = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

  const filename = `icon-${size}x${size}.png`;
  const path = join(process.cwd(), "public", filename);
  await writeFile(path, png);
  console.log(`Generated ${filename}`);
}

async function main() {
  for (const size of sizes) {
    await generateIcon(size);
  }
}

main().catch(console.error);
