// node_modules/.bin/ts-node example/html.ts --html=example/color.html
import * as meow from "meow";
import * as fs from "fs";
import { htmlParse } from "../src/html";

const cli = meow(
  `
  node_modules/.bin/ts-node example/html.ts --html=example/color.html
`,
  {
    flags: {
      html: {
        type: "string"
      }
    }
  }
);

fs.promises
  .readFile(cli.flags["html"], "utf-8")
  .then(value => {
    console.dir(htmlParse(value), { depth: null });
  })
  .catch(error => {
    console.error(error);
  });
