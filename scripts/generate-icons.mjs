import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function generatePng(width, height) {
  // Signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image data with filter byte per scanline
  const scanlines = [];
  const cx = width / 2;
  const cy = height / 2;
  const r = width * 0.45;

  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0; // Filter: none
    for (let x = 0; x < width; x++) {
      const idx = 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background rounded shield/circle in Indigo/Purple gradient
      if (dist <= r) {
        // Gradient from indigo #6366F1 to purple #8B5CF6
        const t = (x + y) / (width + height);
        const red = Math.round(99 + (139 - 99) * t);
        const green = Math.round(102 + (92 - 102) * t);
        const blue = Math.round(241 + (246 - 241) * t);

        // Draw a minimalist flag shape in center (white flag with gold star/accent)
        const fx = (x - cx) / (width * 0.5);
        const fy = (y - cy) / (height * 0.5);

        // Flagpole: fx from -0.3 to -0.22, fy from -0.4 to 0.45
        if (fx >= -0.3 && fx <= -0.22 && fy >= -0.4 && fy <= 0.45) {
          row[idx] = 248;     // R
          row[idx + 1] = 250; // G
          row[idx + 2] = 252; // B
          row[idx + 3] = 255; // A
        }
        // Flag wavy cloth: fx from -0.22 to 0.35, fy from -0.4 to 0.1
        else if (fx > -0.22 && fx <= 0.32 && fy >= -0.4 && fy <= 0.1) {
          // Add gentle wave
          const wave = Math.sin((fx + 0.22) * 10) * 0.04;
          if (fy >= -0.4 + wave && fy <= 0.08 + wave) {
            // Amber/Emerald vibrant flag
            if (fy < -0.15 + wave) {
              row[idx] = 239;     // Emerald/Green or Red
              row[idx + 1] = 68;
              row[idx + 2] = 68;
            } else if (fy < 0.0 + wave) {
              row[idx] = 255;
              row[idx + 1] = 255;
              row[idx + 2] = 255;
            } else {
              row[idx] = 16;
              row[idx + 1] = 185;
              row[idx + 2] = 129;
            }
            row[idx + 3] = 255;
          } else {
            row[idx] = red;
            row[idx + 1] = green;
            row[idx + 2] = blue;
            row[idx + 3] = 255;
          }
        } else {
          row[idx] = red;
          row[idx + 1] = green;
          row[idx + 2] = blue;
          row[idx + 3] = 255;
        }
      } else {
        // Transparent outside circle
        row[idx] = 0;
        row[idx + 1] = 0;
        row[idx + 2] = 0;
        row[idx + 3] = 0;
      }
    }
    scanlines.push(row);
  }

  const rawBuffer = Buffer.concat(scanlines);
  const compressed = zlib.deflateSync(rawBuffer);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate 192x192
const pwa192 = generatePng(192, 192);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);

// Generate 512x512
const pwa512 = generatePng(512, 512);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);

// Generate 32x32 for favicon.ico
const pwa32 = generatePng(32, 32);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), pwa32);

// Generate SVG favicon
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="46" fill="#6366F1" />
  <path d="M32 20 L32 80 M32 25 C45 20, 55 30, 70 25 L70 55 C55 60, 45 50, 32 55" fill="#10B981" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svg);

console.log('Icons generated successfully in public/');
