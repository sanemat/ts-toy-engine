// node_modules/.bin/ts-node example/layout-tree.ts | display

import * as Jimp from "jimp";

import { BoxType, Dimensions, EdgeSizes, LayoutBox, Rect } from "../src/layout";
import { paint } from "../src/painting";
import { Color, CssValue } from "../src/css";
import { StyledNode } from "../src/style";
import { DomNode } from "../src/dom";

const red = new Color(255, 0, 0, 255);
const green = new Color(0, 255, 0, 255);

const canvas = paint(
  new LayoutBox(
    new Dimensions(
      new Rect(3, 3, 2, 1),
      new EdgeSizes(1, 1, 1, 1),
      new EdgeSizes(1, 1, 1, 1),
      new EdgeSizes(1, 1, 1, 1)
    ),
    new BoxType.BlockNode(
      new StyledNode(
        new DomNode(),
        new Map([
          ["border-color", new CssValue.ColorValue(red)],
          ["background", new CssValue.ColorValue(green)]
        ]),
        []
      )
    ),
    []
  ),
  new Rect(0, 0, 8, 7)
);

Jimp.create(canvas.width, canvas.height)
  .then(value => {
    let buffer = value.bitmap.data;
    for (let i = 0; i < canvas.pixels.length; i++) {
      buffer[i * 4] = canvas.pixels[i].r;
      buffer[i * 4 + 1] = canvas.pixels[i].g;
      buffer[i * 4 + 2] = canvas.pixels[i].b;
      buffer[i * 4 + 3] = canvas.pixels[i].a;
    }
    return value.getBufferAsync(Jimp.MIME_PNG);
  })
  .then(value => {
    process.stdout.write(value);
  })
  .catch(error => {
    console.error(error);
  });
