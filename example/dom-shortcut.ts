// $ node_modules/.bin/ts-node example/dom-shortcut.ts
import { elem, text } from "../src/dom";

// <html><body>Hello, world!</body></html>
//
// let root = element("html");
// let body = element("body");
// root.children.push(body);
// body.children.push(text("Hello, world!"));

const root = elem("html", new Map([]), []);
const body = elem("body", new Map([]), []);
root.children.push(body);
body.children.push(text("Hello, world!"));
console.dir(root, { depth: null });

// DomNode {
//   children: [
//     DomNode {
//       children: [
//         DomNode {
//           children: [],
//           nodeType: Text { format: 1, text: 'Hello, world!' }
//     }
//   ],
//     nodeType: Element {
//     format: 0,
//       element: ElementData { tagName: 'body', attributes: Map {} }
//   }
// }
// ],
//   nodeType: Element {
//     format: 0,
//       element: ElementData { tagName: 'html', attributes: Map {} }
//   }
// }
//
