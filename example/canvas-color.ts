// node_modules/.bin/ts-node example/canvas-color.ts | display

import * as Jimp from "jimp";

import { Canvas } from "../src/painting";
import { Color } from "../src/css";
const white = new Color(255, 255, 255, 255);
const black = new Color(0, 0, 0, 255);

const canvas = new Canvas(
  new Array(5 * 10).fill(white).concat(new Array(5 * 10).fill(black)),
  10,
  10
);

Jimp.create(canvas.width, canvas.height)
  .then((value: Jimp) => {
    let buffer = value.bitmap.data;
    for (let i = 0; i < canvas.pixels.length; i++) {
      buffer[i * 4] = canvas.pixels[i].r;
      buffer[i * 4 + 1] = canvas.pixels[i].g;
      buffer[i * 4 + 2] = canvas.pixels[i].b;
      buffer[i * 4 + 3] = canvas.pixels[i].a;
    }
    return value.getBufferAsync(Jimp.MIME_PNG);
  })
  .then((value: Buffer) => {
    process.stdout.write(value);
  })
  .catch((error: Error) => {
    console.error(error);
  });
