// node_modules/.bin/tsc example/display-command.ts -w
// node example/display-command.js | display

import * as Jimp from "jimp";

import { Rect } from "../src/layout";
import { Canvas, DisplayCommand } from "../src/painting";
import { Color } from "../src/css";
const black = new Color(0, 0, 0, 255);

const canvas = Canvas.Create(200, 100);
canvas.paintItem(new DisplayCommand.SolidColor(black, new Rect(10, 20, 30, 30)));

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
