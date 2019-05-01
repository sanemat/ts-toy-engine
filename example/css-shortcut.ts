// $ node_modules/.bin/ts-node example/css-shortcut.ts

// h1, h2, h3 { margin: auto; color: #cc0000; }
// div.note { margin-bottom: 20px; padding: 10px; }
// #answer { display: none; }
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
