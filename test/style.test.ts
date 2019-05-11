import { matches, matchesSimpleSelector, matchingRules, matchRule, StyledNode } from "../src/style";
import { CssValue, Rule, Selector, SimpleSelector, Stylesheet, Unit } from "../src/css";
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

test("matches no none-match", () => {
  expect(
    matches(
      new ElementData("no mean", new Map([])),
      new Selector.Simple(new SimpleSelector(null, null, []))
    )
  ).toBe(true);
});

test("matches none-match", () => {
  expect(
    matches(
      new ElementData("no mean", new Map([])),
      new Selector.Simple(new SimpleSelector(null, "some", []))
    )
  ).toBe(false);
});

test("matches match", () => {
  expect(
    matches(
      new ElementData("no mean", new Map([["id", "target"]])),
      new Selector.Simple(new SimpleSelector(null, "target", []))
    )
  ).toBe(true);
});

test("matchRule none-match", () => {
  expect(matchRule(new ElementData("no mean", new Map([])), new Rule([], []))).toBeNull();
});

test("matchRule match first", () => {
  const rule = new Rule(
    [
      // specificity a=1, b=0, c=0
      new Selector.Simple(new SimpleSelector(null, "target", [])),
      // specificity a=0, b=0, c=1
      new Selector.Simple(new SimpleSelector("target", null, []))
    ],
    []
  );
  expect(matchRule(new ElementData("target", new Map([["id", "target"]])), rule)).toEqual([
    [1, 0, 0],
    rule
  ]);
});

test("matchingRules none-match", () => {
  expect(matchingRules(new ElementData("no mean", new Map([])), new Stylesheet([]))).toEqual([]);
});

test("matchingRules matches", () => {
  const rule1 = new Rule(
    [
      // specificity a=1, b=0, c=0
      new Selector.Simple(new SimpleSelector(null, "target", [])),
      // specificity a=0, b=0, c=1
      new Selector.Simple(new SimpleSelector("target", null, []))
    ],
    []
  );
  const rule2 = new Rule(
    [
      // specificity a=0, b=0, c=1
      new Selector.Simple(new SimpleSelector("target", null, []))
    ],
    []
  );
  expect(
    matchingRules(
      new ElementData("target", new Map([["id", "target"]])),
      new Stylesheet([rule1, rule2])
    )
  ).toEqual([[[1, 0, 0], rule1], [[0, 0, 1], rule2]]);
});
