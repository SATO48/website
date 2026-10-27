// Builds public/og.jpg, the 1200×630 image shown when a page is shared
// (Slack, iMessage, Facebook, etc). Re-run after changing the hero or logo:
//   bun run og-image
import sharp from "sharp";

const W = 1200, H = 630;
const hero = "public/images/ef3bd7078a8dc0596ebf136bf8f4d0f0.jpg";
const logo = "public/images/3895383ea4894dab2ac8a8e35b39d7d0.svg";

const shade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
<stop offset="0" stop-color="#0A0E1A" stop-opacity=".94"/>
<stop offset=".55" stop-color="#0A0E1A" stop-opacity=".78"/>
<stop offset="1" stop-color="#0A0E1A" stop-opacity=".35"/>
</linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#g)"/>
<rect y="${H - 12}" width="${W / 2}" height="12" fill="#3996B1"/>
<rect x="${W / 2}" y="${H - 12}" width="${W / 2}" height="12" fill="#FF6C00"/>
</svg>`);

const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<style>
.h{font-family:'Arial Black','Archivo Black',sans-serif;font-weight:900;font-size:64px;fill:#FFFFFF}
.s{font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:28px;fill:#E3E3EA}
</style>
<text class="h" x="72" y="330">48 hours. 5 minutes.</text>
<text class="h" x="72" y="408" style="fill:#FF6C00">Make it count.</text>
<text class="s" x="72" y="500">The Springfield &amp; the Ozarks</text>
<text class="s" x="72" y="540">48-Hour Film Challenge &amp; Festival</text>
</svg>`);

const logoPng = await sharp(logo, { density: 300 }).resize({ width: 560 }).png().toBuffer();

await sharp(hero)
  .resize(W, H, { fit: "cover", position: "right" })
  .composite([
    { input: shade },
    { input: logoPng, left: 72, top: 64 },
    { input: text },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("public/og.jpg");

console.log("wrote public/og.jpg");
