import { Color, Unit, CssValue } from "../src/css";

test("a", () => {
  expect(new Color(0, 0, 0, 255).a).toEqual(255);
});

test("keyword foo", () => {
  expect(new CssValue.Keyword("foo").keyword).toEqual("foo");
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
  expect(switchFunction(keyword)).toEqual("keyword");
});

test("length 6", () => {
  expect(new CssValue.Length(6, Unit.Px).length).toEqual(6);
});

test("color white", () => {
  const white = new Color(255, 255, 255, 255);
  expect(new CssValue.ColorValue(white).colorValue).toEqual(white);
});
