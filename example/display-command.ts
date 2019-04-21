// node_modules/.bin/tsc example/display-command.ts -w
// node example/display-command.js | display

import { Rect } from "../src/layout";

const Jimp = require("jimp");
import { Canvas, DisplayCommand } from "../src/painting";
import { Color } from "../src/css";
const black = new Color(0, 0, 0, 255);

const canvas = Canvas.Create(200, 100);
canvas.paintItem(new DisplayCommand.SolidColor(black, new Rect(0, 0, 10, 10)));

// tslint:disable-next-line:no-unused-expression
new Jimp(canvas.width, canvas.height, (err: any, image: any) => {
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
  image.getBufferAsync(Jimp.MIME_PNG).then((value: any) => {
    process.stdout.write(value);
  });
});
