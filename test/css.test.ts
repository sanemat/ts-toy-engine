import { Color, Unit, Value } from "../src/css";

test("a", () => {
  expect(new Color(0, 0, 0, 255).a).toEqual(255);
});

test("keyword foo", () => {
  expect(new Value.Keyword("foo").keyword).toEqual("foo");
});

const switchFunction = (v: Value) => {
  switch (v.format) {
    case Value.Format.Length:
      return "length";
    case Value.Format.ColorValue:
      return "colorValue";
    case Value.Format.Keyword:
      return "keyword";
    default:
      return "default";
  }
};

test("pattern keyword", () => {
  const keyword = new Value.Keyword("foo");
  expect(switchFunction(keyword)).toEqual("keyword");
});

test("length 6", () => {
  expect(new Value.Length(6, Unit.Px).length).toEqual(6);
});

test("color white", () => {
  const white = new Color(255, 255, 255, 255);
  expect(new Value.ColorValue(white).colorValue).toEqual(white);
});
