// node_modules/.bin/ts-node example/image.ts | display

const pngjs = require("pngjs");
const width = 100;
const height = 100;
const buffer = Buffer.alloc(2 * width * height * 4);
const bitmap = new Uint16Array(buffer.buffer);
for (let i = 0; i < height; i++) {
  for (let j = 0; j < width; j++) {
    bitmap[i * 4 * width + 4 * j] = (i * 65535) / height;
    bitmap[i * 4 * width + 4 * j + 1] = (j * 65535) / width;
    bitmap[i * 4 * width + 4 * j + 2] = ((height - i) * 65535) / height;
    bitmap[i * 4 * width + 4 * j + 3] = 65535;
  }
}
const png = new pngjs.PNG({ width: width, height: height });
png.data = buffer;

png.pack().pipe(process.stdout);
