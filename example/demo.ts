// node_modules/.bin/ts-node example/demo.ts | display
import { elem } from "../src/dom";
import {
  Color,
  CssValue,
  Declaration,
  Rule,
  Selector,
  SimpleSelector,
  Stylesheet,
  Unit
} from "../src/css";
import { styleTree } from "../src/style";
import { Dimensions, EdgeSizes, layoutTree, Rect } from "../src/layout";
import { paint } from "../src/painting";
import * as Jimp from "jimp";

// <html>
//   <body>
//     <div class="outer">
//       <div class="inner" />
//     <div>
//   </body>
// </html>

// * { display: block; padding: 12px; }
// .outer { background: maroon; /* 800000 */ }
// .inner { background: blue; /* 0000ff */ }

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

// * { display: block; padding: 12px; }
// .outer { background: maroon; /* 800000 */ }
// .inner { background: blue; /* 0000ff */ }

const stylesheet = new Stylesheet([]);
stylesheet.rules.push(
  new Rule(
    [new Selector.Simple(new SimpleSelector(null, null, []))],
    [
      new Declaration("display", new CssValue.Keyword("block")),
      new Declaration("padding", new CssValue.Length(12, Unit.Px))
    ]
  )
);
stylesheet.rules.push(
  new Rule(
    [new Selector.Simple(new SimpleSelector(null, null, ["outer"]))],
    [new Declaration("background", new CssValue.ColorValue(new Color(128, 0, 0, 255)))]
  )
);
stylesheet.rules.push(
  new Rule(
    [new Selector.Simple(new SimpleSelector(null, null, ["inner"]))],
    [new Declaration("background", new CssValue.ColorValue(new Color(0, 0, 255, 255)))]
  )
);

// console.dir(stylesheet, { depth: null });

const styleRoot = styleTree(domNode, stylesheet);
// console.dir(styleRoot, { depth: null });
// Stylesheet {
//   rules: [
//     Rule {
//       selectors: [
//         Simple {
//           format: 0,
//           selector: SimpleSelector { tagName: null, id: null, classValue: [] }
//         }
//       ],
//       declarations: [
//         Declaration {
//           name: 'display',
//           value: Keyword { format: 0, keyword: 'block' }
//         },
//         Declaration {
//           name: 'padding',
//           value: Length { format: 1, length: 12, unit: 0 }
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
//             classValue: [ 'outer' ]
//           }
//         }
//       ],
//       declarations: [
//         Declaration {
//           name: 'background',
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
//           name: 'background',
//           value: ColorValue {
//             format: 2,
//             colorValue: Color { r: 0, g: 0, b: 255, a: 255 }
//           }
//         }
//       ]
//     }
//   ]
// }

const viewport = new Dimensions(
  new Rect(0, 0, 200, 100),
  new EdgeSizes(0, 0, 0, 0),
  new EdgeSizes(0, 0, 0, 0),
  new EdgeSizes(0, 0, 0, 0)
);

const layoutRoot = layoutTree(styleRoot, viewport);
// console.dir(layoutRoot, { depth: null });
// LayoutBox {
//   dimensions: Dimensions {
//     content: Rect { x: 12, y: 12, width: 176, height: 72 },
//     padding: EdgeSizes { left: 12, right: 12, top: 12, bottom: 12 },
//     border: EdgeSizes { left: 0, right: 0, top: 0, bottom: 0 },
//     margin: EdgeSizes { left: 0, right: 0, top: 0, bottom: 0 }
//   },
//   boxType: BlockNode {
//     format: 0,
//     styledNode: StyledNode {
//       node: DomNode {
//         children: [
//           DomNode {
//             children: [
//               DomNode {
//                 children: [
//                   DomNode {
//                     children: [],
//                     nodeType: Element {
//                       format: 0,
//                       element: ElementData {
//                         tagName: 'div',
//                         attributes: Map { 'class' => 'inner' }
//                       }
//                     }
//                   }
//                 ],
//                 nodeType: Element {
//                   format: 0,
//                   element: ElementData {
//                     tagName: 'div',
//                     attributes: Map { 'class' => 'outer' }
//                   }
//                 }
//               }
//             ],
//             nodeType: Element {
//               format: 0,
//               element: ElementData { tagName: 'body', attributes: Map {} }
//             }
//           }
//         ],
//         nodeType: Element {
//           format: 0,
//           element: ElementData { tagName: 'html', attributes: Map {} }
//         }
//       },
//       specifiedValues: Map {
//         'display' => Keyword { format: 0, keyword: 'block' },
//         'padding' => Length { format: 1, length: 12, unit: 0 }
//       },
//       children: [
//         StyledNode {
//           node: DomNode {
//             children: [
//               DomNode {
//                 children: [
//                   DomNode {
//                     children: [],
//                     nodeType: Element {
//                       format: 0,
//                       element: ElementData {
//                         tagName: 'div',
//                         attributes: Map { 'class' => 'inner' }
//                       }
//                     }
//                   }
//                 ],
//                 nodeType: Element {
//                   format: 0,
//                   element: ElementData {
//                     tagName: 'div',
//                     attributes: Map { 'class' => 'outer' }
//                   }
//                 }
//               }
//             ],
//             nodeType: Element {
//               format: 0,
//               element: ElementData { tagName: 'body', attributes: Map {} }
//             }
//           },
//           specifiedValues: Map {
//             'display' => Keyword { format: 0, keyword: 'block' },
//             'padding' => Length { format: 1, length: 12, unit: 0 }
//           },
//           children: [
//             StyledNode {
//               node: DomNode {
//                 children: [
//                   DomNode {
//                     children: [],
//                     nodeType: Element {
//                       format: 0,
//                       element: ElementData {
//                         tagName: 'div',
//                         attributes: Map { 'class' => 'inner' }
//                       }
//                     }
//                   }
//                 ],
//                 nodeType: Element {
//                   format: 0,
//                   element: ElementData {
//                     tagName: 'div',
//                     attributes: Map { 'class' => 'outer' }
//                   }
//                 }
//               },
//               specifiedValues: Map {
//                 'display' => Keyword { format: 0, keyword: 'block' },
//                 'padding' => Length { format: 1, length: 12, unit: 0 },
//                 'background' => ColorValue {
//                   format: 2,
//                   colorValue: Color { r: 128, g: 0, b: 0, a: 255 }
//                 }
//               },
//               children: [
//                 StyledNode {
//                   node: DomNode {
//                     children: [],
//                     nodeType: Element {
//                       format: 0,
//                       element: ElementData {
//                         tagName: 'div',
//                         attributes: Map { 'class' => 'inner' }
//                       }
//                     }
//                   },
//                   specifiedValues: Map {
//                     'display' => Keyword { format: 0, keyword: 'block' },
//                     'padding' => Length { format: 1, length: 12, unit: 0 },
//                     'background' => ColorValue {
//                       format: 2,
//                       colorValue: Color { r: 0, g: 0, b: 255, a: 255 }
//                     }
//                   },
//                   children: []
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   },
//   children: [
//     LayoutBox {
//       dimensions: Dimensions {
//         content: Rect { x: 24, y: 24, width: 152, height: 48 },
//         padding: EdgeSizes { left: 12, right: 12, top: 12, bottom: 12 },
//         border: EdgeSizes { left: 0, right: 0, top: 0, bottom: 0 },
//         margin: EdgeSizes { left: 0, right: 0, top: 0, bottom: 0 }
//       },
//       boxType: BlockNode {
//         format: 0,
//         styledNode: StyledNode {
//           node: DomNode {
//             children: [
//               DomNode {
//                 children: [
//                   DomNode {
//                     children: [],
//                     nodeType: Element {
//                       format: 0,
//                       element: ElementData {
//                         tagName: 'div',
//                         attributes: Map { 'class' => 'inner' }
//                       }
//                     }
//                   }
//                 ],
//                 nodeType: Element {
//                   format: 0,
//                   element: ElementData {
//                     tagName: 'div',
//                     attributes: Map { 'class' => 'outer' }
//                   }
//                 }
//               }
//             ],
//             nodeType: Element {
//               format: 0,
//               element: ElementData { tagName: 'body', attributes: Map {} }
//             }
//           },
//           specifiedValues: Map {
//             'display' => Keyword { format: 0, keyword: 'block' },
//             'padding' => Length { format: 1, length: 12, unit: 0 }
//           },
//           children: [
//             StyledNode {
//               node: DomNode {
//                 children: [
//                   DomNode {
//                     children: [],
//                     nodeType: Element {
//                       format: 0,
//                       element: ElementData {
//                         tagName: 'div',
//                         attributes: Map { 'class' => 'inner' }
//                       }
//                     }
//                   }
//                 ],
//                 nodeType: Element {
//                   format: 0,
//                   element: ElementData {
//                     tagName: 'div',
//                     attributes: Map { 'class' => 'outer' }
//                   }
//                 }
//               },
//               specifiedValues: Map {
//                 'display' => Keyword { format: 0, keyword: 'block' },
//                 'padding' => Length { format: 1, length: 12, unit: 0 },
//                 'background' => ColorValue {
//                   format: 2,
//                   colorValue: Color { r: 128, g: 0, b: 0, a: 255 }
//                 }
//               },
//               children: [
//                 StyledNode {
//                   node: DomNode {
//                     children: [],
//                     nodeType: Element {
//                       format: 0,
//                       element: ElementData {
//                         tagName: 'div',
//                         attributes: Map { 'class' => 'inner' }
//                       }
//                     }
//                   },
//                   specifiedValues: Map {
//                     'display' => Keyword { format: 0, keyword: 'block' },
//                     'padding' => Length { format: 1, length: 12, unit: 0 },
//                     'background' => ColorValue {
//                       format: 2,
//                       colorValue: Color { r: 0, g: 0, b: 255, a: 255 }
//                     }
//                   },
//                   children: []
//                 }
//               ]
//             }
//           ]
//         }
//       },
//       children: [
//         LayoutBox {
//           dimensions: Dimensions {
//             content: Rect { x: 36, y: 36, width: 128, height: 24 },
//             padding: EdgeSizes { left: 12, right: 12, top: 12, bottom: 12 },
//             border: EdgeSizes { left: 0, right: 0, top: 0, bottom: 0 },
//             margin: EdgeSizes { left: 0, right: 0, top: 0, bottom: 0 }
//           },
//           boxType: BlockNode {
//             format: 0,
//             styledNode: StyledNode {
//               node: DomNode {
//                 children: [
//                   DomNode {
//                     children: [],
//                     nodeType: Element {
//                       format: 0,
//                       element: ElementData {
//                         tagName: 'div',
//                         attributes: Map { 'class' => 'inner' }
//                       }
//                     }
//                   }
//                 ],
//                 nodeType: Element {
//                   format: 0,
//                   element: ElementData {
//                     tagName: 'div',
//                     attributes: Map { 'class' => 'outer' }
//                   }
//                 }
//               },
//               specifiedValues: Map {
//                 'display' => Keyword { format: 0, keyword: 'block' },
//                 'padding' => Length { format: 1, length: 12, unit: 0 },
//                 'background' => ColorValue {
//                   format: 2,
//                   colorValue: Color { r: 128, g: 0, b: 0, a: 255 }
//                 }
//               },
//               children: [
//                 StyledNode {
//                   node: DomNode {
//                     children: [],
//                     nodeType: Element {
//                       format: 0,
//                       element: ElementData {
//                         tagName: 'div',
//                         attributes: Map { 'class' => 'inner' }
//                       }
//                     }
//                   },
//                   specifiedValues: Map {
//                     'display' => Keyword { format: 0, keyword: 'block' },
//                     'padding' => Length { format: 1, length: 12, unit: 0 },
//                     'background' => ColorValue {
//                       format: 2,
//                       colorValue: Color { r: 0, g: 0, b: 255, a: 255 }
//                     }
//                   },
//                   children: []
//                 }
//               ]
//             }
//           },
//           children: [
//             LayoutBox {
//               dimensions: Dimensions {
//                 content: Rect { x: 48, y: 48, width: 104, height: 0 },
//                 padding: EdgeSizes { left: 12, right: 12, top: 12, bottom: 12 },
//                 border: EdgeSizes { left: 0, right: 0, top: 0, bottom: 0 },
//                 margin: EdgeSizes { left: 0, right: 0, top: 0, bottom: 0 }
//               },
//               boxType: BlockNode {
//                 format: 0,
//                 styledNode: StyledNode {
//                   node: DomNode {
//                     children: [],
//                     nodeType: Element {
//                       format: 0,
//                       element: ElementData {
//                         tagName: 'div',
//                         attributes: Map { 'class' => 'inner' }
//                       }
//                     }
//                   },
//                   specifiedValues: Map {
//                     'display' => Keyword { format: 0, keyword: 'block' },
//                     'padding' => Length { format: 1, length: 12, unit: 0 },
//                     'background' => ColorValue {
//                       format: 2,
//                       colorValue: Color { r: 0, g: 0, b: 255, a: 255 }
//                     }
//                   },
//                   children: []
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
viewport.content.height = 100;
const canvas = paint(layoutRoot, viewport.content);
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
