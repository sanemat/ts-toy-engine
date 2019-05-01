// $ node_modules/.bin/ts-node example/css-shortcut.ts

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

// h1, h2, h3 { margin: auto; color: #cc0000; }
// div.note { margin-bottom: 20px; padding: 10px; }
// #answer { display: none; }

const stylesheet = new Stylesheet([]);
stylesheet.rules.push(
  new Rule(
    [
      new Selector.Simple(new SimpleSelector("h1", null, [])),
      new Selector.Simple(new SimpleSelector("h2", null, [])),
      new Selector.Simple(new SimpleSelector("h3", null, []))
    ],
    [
      new Declaration("margin", new CssValue.Keyword("auto")),
      new Declaration("color", new CssValue.ColorValue(new Color(204, 0, 0, 255)))
    ]
  )
);
stylesheet.rules.push(
  new Rule(
    [new Selector.Simple(new SimpleSelector("div", null, ["note"]))],
    [
      new Declaration("margin-bottom", new CssValue.Length(20, Unit.Px)),
      new Declaration("padding", new CssValue.Length(10, Unit.Px))
    ]
  )
);
stylesheet.rules.push(
  new Rule(
    [new Selector.Simple(new SimpleSelector(null, "answer", []))],
    [new Declaration("display", new CssValue.Keyword("none"))]
  )
);
console.dir(stylesheet, { depth: null });

// Stylesheet {
//   rules: [
//     Rule {
//       selectors: [
//         Simple {
//           format: 0,
//           selector: SimpleSelector { tagName: 'h1', id: null, classValue: [] }
//         },
//         Simple {
//           format: 0,
//           selector: SimpleSelector { tagName: 'h2', id: null, classValue: [] }
//         },
//         Simple {
//           format: 0,
//           selector: SimpleSelector { tagName: 'h3', id: null, classValue: [] }
//         }
//       ],
//       declarations: [
//         Declaration {
//           name: 'margin',
//           value: Keyword { format: 0, keyword: 'auto' }
//         },
//         Declaration {
//           name: 'color',
//           value: ColorValue {
//             format: 2,
//             colorValue: Color { r: 204, g: 0, b: 0, a: 255 }
//           }
//         }
//       ]
//     },
//     Rule {
//       selectors: [
//         Simple {
//           format: 0,
//           selector: SimpleSelector {
//             tagName: 'div',
//             id: null,
//             classValue: [ 'note' ]
//           }
//         }
//       ],
//       declarations: [
//         Declaration {
//           name: 'margin-bottom',
//           value: Length { format: 1, length: 20, unit: 0 }
//         },
//         Declaration {
//           name: 'padding',
//           value: Length { format: 1, length: 10, unit: 0 }
//         }
//       ]
//     },
//     Rule {
//       selectors: [
//         Simple {
//           format: 0,
//           selector: SimpleSelector {
//             tagName: null,
//             id: 'answer',
//             classValue: []
//           }
//         }
//       ],
//       declarations: [
//         Declaration {
//           name: 'display',
//           value: Keyword { format: 0, keyword: 'none' }
//         }
//       ]
//     }
//   ]
// }
