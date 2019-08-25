// node_modules/.bin/ts-node example/toy-engine.ts --css=example/color.css --html=example/color.html --width=200 --height=100 | feh -
import * as meow from "meow";
import * as fs from "fs";
import { htmlParse } from "../src/html";
import { cssParse } from "../src/css";
import { styleTree } from "../src/style";
import { Dimensions, EdgeSizes, layoutTree, Rect } from "../src/layout";
import { Canvas, paint } from "../src/painting";
import * as Jimp from "jimp";

const cli = meow(
  `
  node_modules/.bin/ts-node example/toy-engine.ts --css=example/color.css --html=example/color.html --width=200 --height=100 | feh -
`,
  {
    flags: {
      css: { type: "string" },
      html: { type: "string" },
      width: { type: "string", default: 200 },
      height: { type: "string", default: 100 }
    },
    inferType: true
  }
);

let canvas: Canvas;

Promise.all([
  fs.promises.readFile(cli.flags["html"], "utf-8").then(value => {
    return htmlParse(value);
  }),
  fs.promises.readFile(cli.flags["css"], "utf-8").then(value => {
    return cssParse(value);
  })
])
  .then(values => {
    const [domNode, stylesheet] = values;
    const styleRoot = styleTree(domNode, stylesheet);
    const viewport = new Dimensions(
      new Rect(0, 0, cli.flags["width"], cli.flags["height"]),
      new EdgeSizes(0, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0)
    );
    const layoutRoot = layoutTree(styleRoot, viewport);
    canvas = paint(layoutRoot, viewport.content);
    return Jimp.create(canvas.width, canvas.height);
  })
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
