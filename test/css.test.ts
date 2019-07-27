import {
  Color,
  CssParser,
  CssValue,
  Declaration,
  Rule,
  Selector,
  SimpleSelector,
  Stylesheet,
  Unit
} from "../src/css";

test("a", () => {
  expect(new Color(0, 0, 0, 255).a).toBe(255);
});

test("keyword foo", () => {
  expect(new CssValue.Keyword("foo").keyword).toBe("foo");
});

const switchFunction = (v: CssValue) => {
  switch (v.format) {
    case CssValue.Format.Length:
      return "length";
    case CssValue.Format.ColorValue:
      return "colorValue";
    case CssValue.Format.Keyword:
      return "keyword";
    default:
      return "default";
  }
};

test("pattern keyword", () => {
  const keyword = new CssValue.Keyword("foo");
  expect(switchFunction(keyword)).toBe("keyword");
});

test("length 6", () => {
  expect(new CssValue.Length(6, Unit.Px).length).toBe(6);
});

test("color white", () => {
  const white = new Color(255, 255, 255, 255);
  expect(new CssValue.ColorValue(white).colorValue).toBe(white);
});

test("declaration", () => {
  expect(() => new Declaration("name", new CssValue.Keyword("keyword"))).not.toThrow();
});

test("simple selector", () => {
  expect(() => new SimpleSelector(null, null, [])).not.toThrow();
});

test("selector simple", () => {
  expect(() => new Selector.Simple(new SimpleSelector(null, null, []))).not.toThrow();
});

test("rule", () => {
  expect(() => new Rule([], [])).not.toThrow();
});

test("stylesheet", () => {
  expect(() => new Stylesheet([])).not.toThrow();
});

// Examples:
//
// *               /* a=0 b=0 c=0 */
// LI              /* a=0 b=0 c=1 */
// UL LI           /* a=0 b=0 c=2 */
// UL OL+LI        /* a=0 b=0 c=3 */
// H1 + *[REL=up]  /* a=0 b=1 c=1 */
// UL OL LI.red    /* a=0 b=1 c=3 */
// LI.red.level    /* a=0 b=2 c=1 */
// #x34y           /* a=1 b=0 c=0 */
// #s12:not(FOO)   /* a=1 b=0 c=1 */
// .foo :is(.bar, #baz)
//                 /* a=1 b=1 c=0 */

test("specificity li", () => {
  expect(new SimpleSelector("li", null, []).specificity()).toEqual([0, 0, 1]);
});

test("specificity li.red.level", () => {
  expect(new SimpleSelector("li", null, ["red", "level"]).specificity()).toEqual([0, 2, 1]);
});

test("specificity #x34y", () => {
  expect(new SimpleSelector(null, "x34y", []).specificity()).toEqual([1, 0, 0]);
});

test("value to px color", () => {
  expect(new CssValue.ColorValue(new Color(0, 0, 0, 0)).toPx()).toEqual(0.0);
});

test("value to px keyword", () => {
  expect(new CssValue.Keyword("example").toPx()).toEqual(0.0);
});

test("value to px length em", () => {
  expect(new CssValue.Length(1.0, Unit.Em).toPx()).toEqual(0.0);
});

test("value to px length px", () => {
  expect(new CssValue.Length(1.0, Unit.Px).toPx()).toEqual(1.0);
});

test("#nextChar 1", () => {
  const currentParser = new CssParser(0, "12abcあいう");
  expect(currentParser.nextChar()).toEqual("1");
});

test("#nextChar 2", () => {
  const currentParser = new CssParser(5, "12abcあいう");
  expect(currentParser.nextChar()).toEqual("あ");
});

test("startsWidth 1", () => {
  const currentParser = new CssParser(0, "bananas");
  expect(currentParser.startsWith("bana")).toBeTruthy();
});

test("startsWidth 2", () => {
  const currentParser = new CssParser(0, "bananas");
  expect(currentParser.startsWith("nana")).toBeFalsy();
});

test("startsWidth 3", () => {
  const currentParser = new CssParser(2, "bananas");
  expect(currentParser.startsWith("nana")).toBeTruthy();
});

test("eof 1", () => {
  const currentParser = new CssParser(0, "a");
  expect(currentParser.eof()).toBeFalsy();
});

test("eof 2", () => {
  const currentParser = new CssParser(1, "a");
  expect(currentParser.eof()).toBeTruthy();
});

test("consume char", () => {
  const currentParser = new CssParser(2, "bananas");
  const target = currentParser.consumeChar();
  expect(target).toEqual("n");
  expect(currentParser).toEqual(new CssParser(3, "bananas"));
});

test("consume while 1", () => {
  const currentParser = new CssParser(2, "bananas");
  const returnFalse = () => {
    return false;
  };
  expect(currentParser.consumeWhile(returnFalse)).toEqual("");
  expect(currentParser).toEqual(new CssParser(2, "bananas"));
});

test("consume while 2", () => {
  const currentParser = new CssParser(2, "bananas");
  const returnTrue = () => {
    return true;
  };
  expect(currentParser.consumeWhile(returnTrue)).toEqual("nanas");
  expect(currentParser).toEqual(new CssParser(7, "bananas"));
});

test("consume while 3", () => {
  const currentParser = new CssParser(2, "bananas");
  const returnAN = (s: string) => {
    return s === "a" || s === "n";
  };
  expect(currentParser.consumeWhile(returnAN)).toEqual("nana");
  expect(currentParser).toEqual(new CssParser(6, "bananas"));
});

test("consume whitespace 1", () => {
  const currentParser = new CssParser(2, "bananas");
  expect(currentParser.consumeWhitespace()).toEqual("");
  expect(currentParser).toEqual(new CssParser(2, "bananas"));
});

test("consume whitespace 2", () => {
  const currentParser = new CssParser(2, "ba  n anas");
  expect(currentParser.consumeWhitespace()).toEqual("  ");
  expect(currentParser).toEqual(new CssParser(4, "ba  n anas"));
});
