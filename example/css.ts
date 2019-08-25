// node_modules/.bin/ts-node example/css.ts --css=example/color.css
import * as meow from "meow";
import * as fs from "fs";
import { cssParse } from "../src/css";

const cli = meow(
  `
  node_modules/.bin/ts-node example/css.ts --css=example/color.css
`,
  { flags: { css: { type: "string" } } }
);

fs.promises
  .readFile(cli.flags["css"], "utf-8")
  .then(value => {
    console.dir(cssParse(value), { depth: null });
  })
  .catch(error => {
    console.error(error);
  });
