// $ node_modules/.bin/ts-node example/dom-shortcut.ts
// DomNode {
//   children: [ DomNode { children: [Array], nodeType: [Element] } ],
//     nodeType: Element {
//     format: 0,
//       element: ElementData { tagName: 'html', attributes: Map {} }
//   }
// }
//
// <html><body>Hello, world!</body></html>

import { DomNode, ElementData, NodeType, text } from "../src/dom";

// let root = element("html");
// let body = element("body");
// root.children.push(body);
// body.children.push(text("Hello, world!"));

const root = new DomNode([], new NodeType.Element(new ElementData("html", new Map([]))));
const body = new DomNode([], new NodeType.Element(new ElementData("body", new Map([]))));
root.children.push(body);
body.children.push(text("Hello, world!"));
console.log(root);
