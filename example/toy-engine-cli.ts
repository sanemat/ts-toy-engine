// node_modules/.bin/ts-node example/toy-engine-cli.ts | display

import Jimp = require("jimp");
import { Canvas } from "../src/painting";
import { Color } from "../src/css";
const white = new Color(255, 255, 255, 255);
const black = new Color(0, 0, 0, 255);

const canvas = new Canvas(
  new Array(5 * 10).fill(white).concat(new Array(5 * 10).fill(black)),
  10,
  10
);

// tslint:disable-next-line:no-unused-expression
new Jimp(canvas.width, canvas.height, (err, image) => {
  if (err) {
    console.error(err);
    return;
  }

  let buffer = image.bitmap.data;
  for (let i = 0; i < canvas.pixels.length; i++) {
    buffer[i * 4] = canvas.pixels[i].r;
    buffer[i * 4 + 1] = canvas.pixels[i].g;
    buffer[i * 4 + 2] = canvas.pixels[i].b;
    buffer[i * 4 + 3] = canvas.pixels[i].a;
  }
  image.getBufferAsync(Jimp.MIME_PNG).then(value => {
    process.stdout.write(value);
  });
});
