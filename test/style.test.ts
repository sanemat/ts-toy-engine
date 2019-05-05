import { matchesSimpleSelector, StyledNode } from "../src/style";
import { CssValue, SimpleSelector, Unit } from "../src/css";
import { ElementData, text } from "../src/dom";

test("styled node", () => {
  expect(
    new StyledNode(text("no mean"), new Map([["1", new CssValue.Length(1, Unit.Px)]]), []).children
  ).toEqual([]);
});

test("styled node hits", () => {
  const expected = new CssValue.Keyword("example");
  expect(new StyledNode(text("no mean"), new Map([["target", expected]]), []).value("target")).toBe(
    expected
  );
});

test("styled node does not hit", () => {
  expect(
    new StyledNode(text("no mean"), new Map([["some", new CssValue.Keyword("example")]]), []).value(
      "different"
    )
  ).toBeNull();
});

test("matches simple selector", () => {
  expect(
    matchesSimpleSelector(
      new ElementData("no mean", new Map([])),
      new SimpleSelector(null, null, [])
    )
  ).toBe(true);
});

test("matches simple selector different tag", () => {
  expect(
    matchesSimpleSelector(
      new ElementData("other", new Map([])),
      new SimpleSelector("some", null, [])
    )
  ).toBe(false);
});

test("matches simple selector same tag", () => {
  expect(
    matchesSimpleSelector(
      new ElementData("target", new Map([])),
      new SimpleSelector("target", null, [])
    )
  ).toBe(true);
});

test("matches simple selector different id", () => {
  expect(
    matchesSimpleSelector(
      new ElementData("no mean1", new Map([["id", "other"]])),
      new SimpleSelector(null, "some", [])
    )
  ).toBe(false);
});

test("matches simple selector same id", () => {
  expect(
    matchesSimpleSelector(
      new ElementData("no mean1", new Map([["id", "target"]])),
      new SimpleSelector(null, "target", [])
    )
  ).toBe(true);
});

test("matches simple selector different class", () => {
  expect(
    matchesSimpleSelector(
      new ElementData("no mean1", new Map([["class", "other1 other2"]])),
      new SimpleSelector(null, null, ["some1", "some2"])
    )
  ).toBe(false);
});

test("matches simple selector same class", () => {
  expect(
    matchesSimpleSelector(
      new ElementData("no mean1", new Map([["class", "target1 other2"]])),
      new SimpleSelector(null, null, ["target1", "some2"])
    )
  ).toBe(true);
});

test("matches simple selector same tag, other id", () => {
  expect(
    matchesSimpleSelector(
      new ElementData("same", new Map([["id", "other"]])),
      new SimpleSelector("same", "some", [])
    )
  ).toBe(false);
});

test("matches simple selector same tag, same id, different class", () => {
  expect(
    matchesSimpleSelector(
      new ElementData("same", new Map([["id", "same"], ["class", "other1 other2"]])),
      new SimpleSelector("same", "same", ["some1", "some2"])
    )
  ).toBe(false);
});
