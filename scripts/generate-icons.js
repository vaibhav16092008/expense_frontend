/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function generatePNG(width, height, bgColor, fgColor) {
  // Minimal PNG generator in Node.js
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA (6)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT raw scanlines (1 byte filter (0) per line + width * 4 bytes RGBA)
  const lineSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * lineSize);

  const [bgR, bgG, bgB] = bgColor;
  const [fgR, fgG, fgB] = fgColor;

  for (let y = 0; y < height; y++) {
    const offset = y * lineSize;
    rawData[offset] = 0; // Filter type None

    for (let x = 0; x < width; x++) {
      const pxOffset = offset + 1 + x * 4;

      // Draw stylized "E" or inner badge box
      const isInner =
        x >= width * 0.2 &&
        x <= width * 0.8 &&
        y >= height * 0.2 &&
        y <= height * 0.8;

      const isAccentLine =
        isInner &&
        (y <= height * 0.35 ||
          y >= height * 0.65 ||
          (x >= width * 0.2 && x <= width * 0.45));

      if (isAccentLine) {
        rawData[pxOffset] = fgR;
        rawData[pxOffset + 1] = fgG;
        rawData[pxOffset + 2] = fgB;
        rawData[pxOffset + 3] = 255;
      } else {
        rawData[pxOffset] = bgR;
        rawData[pxOffset + 1] = bgG;
        rawData[pxOffset + 2] = bgB;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const buf = Buffer.concat([typeBuf, data]);

  const crc = crc32(buf);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([len, buf, crcBuf]);
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    crc ^= byte;
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ -1) >>> 0;
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Background: #0f172a (15, 23, 42), Foreground: #6366f1 (99, 102, 241)
fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), generatePNG(192, 192, [15, 23, 42], [99, 102, 241]));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), generatePNG(512, 512, [15, 23, 42], [99, 102, 241]));
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), generatePNG(180, 180, [15, 23, 42], [99, 102, 241]));

console.log('Icons generated successfully.');
