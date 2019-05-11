import {
  Color,
  Unit,
  CssValue,
  Declaration,
  SimpleSelector,
  Selector,
  Rule,
  Stylesheet
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
