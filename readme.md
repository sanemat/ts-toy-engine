# toy-engine

The follower of [Let's build a browser engine! Part 1: Getting started](https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html)

## Goal

Understand how to transform html and css to image.


## example

```
node_modules/.bin/ts-node example/toy-engine.ts --css=example/color.css --html=example/color.html --width=200 --height=100 | feh -
```

![generated image](./example/result.png)

```html
<html>
  <body>
    <div class="outer">
      <div class="inner"></div>
    </div>
  </body>
</html>
```

```css
* { display: block; padding: 12px; }
.outer { background: #800000; }
.inner { background: #0000ff; }
```

## Pipeline

Understand this rendering pipeline ![pipeline](./example/pipeline.svg) https://limpet.net/mbrubeck/images/2014/pipeline.svg .

Input html and css, then output pixels.

## How to run

```typescript
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
```

## Details

- [sanemat/ts-toy-engine](https://github.com/sanemat/ts-toy-engine)
- [Let's build browser engine! in typescript vol0 Toy browser engine](https://dev.to/sanemat/let-s-build-browser-engine-in-typescript-vol0-toy-browser-engine-egm)


## references

- [Let's build a browser engine! Part 1: Getting started](https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html)
- [mbrubeck/robinson](https://github.com/mbrubeck/robinson)
- [sanemat/js-toy-engine](https://github.com/sanemat/js-toy-engine)

## badges

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/sanemat/ts-toy-engine.svg)](https://greenkeeper.io/)
[![Circle](https://img.shields.io/circleci/project/github/sanemat/ts-toy-engine/master.svg)](https://circleci.com/gh/sanemat/ts-toy-engine)
[![Dev Dependencies](https://david-dm.org/sanemat/ts-toy-engine/dev-status.svg)](https://david-dm.org/sanemat/ts-toy-engine?type=dev)

### NPM scripts

 - `npm t`: Run test suite
 - `npm run lint`: Lints code
 - `npm run prettier`: Formats code
