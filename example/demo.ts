// node_modules/.bin/ts-node example/demo.ts | display
import { elem } from "../src/dom";
import {
  Color,
  CssValue,
  Declaration,
  Rule,
  Selector,
  SimpleSelector,
  Stylesheet
} from "../src/css";
import { styleTree } from "../src/style";

// <html>
//   <body>
//     <div class="outer">
//       <div class="inner" />
//     <div>
//   </body>
// </html>

// .outer { color: maroon; } /* 800000 */
// .inner { color: blue; } /* 0000ff */

// <html>
//   <body>
//     <div class="outer">
//       <div class="inner" />
//     <div>
//   </body>
// </html>

const domNode = elem("html", new Map([]), []);
const body = elem("body", new Map([]), []);
const outer = elem("div", new Map([["class", "outer"]]), []);
const inner = elem("div", new Map([["class", "inner"]]), []);
domNode.children.push(body);
body.children.push(outer);
outer.children.push(inner);

// console.dir(domNode, { depth: null });
//
// DomNode {
//   children: [
//     DomNode {
//       children: [
//         DomNode {
//           children: [
//             DomNode {
//               children: [],
//               nodeType: Element {
//                 format: 0,
//                 element: ElementData {
//                   tagName: 'div',
//                   attributes: Map { 'class' => 'inner' }
//                 }
//               }
//             }
//           ],
//           nodeType: Element {
//             format: 0,
//             element: ElementData {
//               tagName: 'div',
//               attributes: Map { 'class' => 'outer' }
//             }
//           }
//         }
//       ],
//       nodeType: Element {
//         format: 0,
//         element: ElementData { tagName: 'body', attributes: Map {} }
//       }
//     }
//   ],
//   nodeType: Element {
//     format: 0,
//     element: ElementData { tagName: 'html', attributes: Map {} }
//   }
// }

// .outer { color: maroon; } /* 800000 */
// .inner { color: blue; } /* 0000ff */

const stylesheet = new Stylesheet([]);
stylesheet.rules.push(
  new Rule(
    [new Selector.Simple(new SimpleSelector(null, null, ["outer"]))],
    [new Declaration("color", new CssValue.ColorValue(new Color(128, 0, 0, 255)))]
  )
);
stylesheet.rules.push(
  new Rule(
    [new Selector.Simple(new SimpleSelector(null, null, ["inner"]))],
    [new Declaration("color", new CssValue.ColorValue(new Color(0, 0, 255, 255)))]
  )
);

// console.dir(stylesheet, { depth: null });
//
// Stylesheet {
//   rules: [
//     Rule {
//       selectors: [
//         Simple {
//           format: 0,
//           selector: SimpleSelector {
//             tagName: null,
//             id: null,
//             classValue: [ 'outer' ]
//           }
//         }
//       ],
//       declarations: [
//         Declaration {
//           name: 'color',
//           value: ColorValue {
//             format: 2,
//             colorValue: Color { r: 128, g: 0, b: 0, a: 255 }
//           }
//         }
//       ]
//     },
//     Rule {
//       selectors: [
//         Simple {
//           format: 0,
//           selector: SimpleSelector {
//             tagName: null,
//             id: null,
//             classValue: [ 'inner' ]
//           }
//         }
//       ],
//       declarations: [
//         Declaration {
//           name: 'color',
//           value: ColorValue {
//             format: 2,
//             colorValue: Color { r: 0, g: 0, b: 255, a: 255 }
//           }
//         }
//       ]
//     }
//   ]
// }

const styleNode = styleTree(domNode, stylesheet);
// console.dir(styleNode, { depth: null });
//
// StyledNode {
//   node: DomNode {
//     children: [
//       DomNode {
//         children: [
//           DomNode {
//             children: [
//               DomNode {
//                 children: [],
//                 nodeType: Element {
//                   format: 0,
//                   element: ElementData {
//                     tagName: 'div',
//                     attributes: Map { 'class' => 'inner' }
//                   }
//                 }
//               }
//             ],
//             nodeType: Element {
//               format: 0,
//               element: ElementData {
//                 tagName: 'div',
//                 attributes: Map { 'class' => 'outer' }
//               }
//             }
//           }
//         ],
//         nodeType: Element {
//           format: 0,
//           element: ElementData { tagName: 'body', attributes: Map {} }
//         }
//       }
//     ],
//     nodeType: Element {
//       format: 0,
//       element: ElementData { tagName: 'html', attributes: Map {} }
//     }
//   },
//   specifiedValues: Map {},
//   children: [
//     StyledNode {
//       node: DomNode {
//         children: [
//           DomNode {
//             children: [
//               DomNode {
//                 children: [],
//                 nodeType: Element {
//                   format: 0,
//                   element: ElementData {
//                     tagName: 'div',
//                     attributes: Map { 'class' => 'inner' }
//                   }
//                 }
//               }
//             ],
//             nodeType: Element {
//               format: 0,
//               element: ElementData {
//                 tagName: 'div',
//                 attributes: Map { 'class' => 'outer' }
//               }
//             }
//           }
//         ],
//         nodeType: Element {
//           format: 0,
//           element: ElementData { tagName: 'body', attributes: Map {} }
//         }
//       },
//       specifiedValues: Map {},
//       children: [
//         StyledNode {
//           node: DomNode {
//             children: [
//               DomNode {
//                 children: [],
//                 nodeType: Element {
//                   format: 0,
//                   element: ElementData {
//                     tagName: 'div',
//                     attributes: Map { 'class' => 'inner' }
//                   }
//                 }
//               }
//             ],
//             nodeType: Element {
//               format: 0,
//               element: ElementData {
//                 tagName: 'div',
//                 attributes: Map { 'class' => 'outer' }
//               }
//             }
//           },
//           specifiedValues: Map {
//             'color' => ColorValue {
//               format: 2,
//               colorValue: Color { r: 128, g: 0, b: 0, a: 255 }
//             }
//           },
//           children: [
//             StyledNode {
//               node: DomNode {
//                 children: [],
//                 nodeType: Element {
//                   format: 0,
//                   element: ElementData {
//                     tagName: 'div',
//                     attributes: Map { 'class' => 'inner' }
//                   }
//                 }
//               },
//               specifiedValues: Map {
//                 'color' => ColorValue {
//                   format: 2,
//                   colorValue: Color { r: 0, g: 0, b: 255, a: 255 }
//                 }
//               },
//               children: []
//             }
//           ]
//         }
//       ]
//     }
//   ]
// }
