import { Color, ColorValue, Keyword, Length, Unit, Value, ValueFormat } from "../src/css";

test("a", () => {
  expect(new Color(0, 0, 0, 255).a).toEqual(255);
});

test("keyword foo", () => {
  expect(new Keyword("foo").keyword).toEqual("foo");
});

const switchFunction = (v: Value) => {
  switch (v.format) {
    case ValueFormat.Length:
      return "length";
    case ValueFormat.ColorValue:
      return "colorValue";
    case ValueFormat.Keyword:
      return "keyword";
    default:
      return "default";
  }
};

test("pattern keyword", () => {
  const keyword = new Keyword("foo");
  expect(switchFunction(keyword)).toEqual("keyword");
});

test("length 6", () => {
  expect(new Length(6, Unit.Px).length).toEqual(6);
});

test("color white", () => {
  const white = new Color(255, 255, 255, 255);
  expect(new ColorValue(white).colorValue).toEqual(white);
});
