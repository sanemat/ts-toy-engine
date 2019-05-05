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
      new ElementData("some", new Map([])),
      new SimpleSelector("other", null, [])
    )
  ).toBe(false);
});

test("matches simple selector different id", () => {
  expect(
    matchesSimpleSelector(
      new ElementData("no mean1", new Map([["id", "some"]])),
      new SimpleSelector(null, "other", [])
    )
  ).toBe(false);
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
