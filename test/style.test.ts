import {
  compareMatchedRule,
  Display,
  MatchedRule,
  matches,
  matchesSimpleSelector,
  matchingRules,
  matchRule,
  specifiedValues,
  StyledNode,
  styleTree
} from "../src/style";
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
import { elem, ElementData, text } from "../src/dom";

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

test("specifiedValues none", () => {
  expect(specifiedValues(new ElementData("no mean", new Map([])), new Stylesheet([]))).toEqual(
    new Map([])
  );
});

test("specifiedValues", () => {
  const rule1 = new Rule(
    [
      // specificity a=1, b=0, c=0
      new Selector.Simple(new SimpleSelector(null, "target", [])),
      // specificity a=0, b=0, c=1
      new Selector.Simple(new SimpleSelector("target", null, []))
    ],
    [
      new Declaration("override", new CssValue.Keyword("current")),
      new Declaration("not-override1", new CssValue.Keyword("value1"))
    ]
  );
  const rule2 = new Rule(
    [
      // specificity a=0, b=0, c=1
      new Selector.Simple(new SimpleSelector("target", null, []))
    ],
    [
      new Declaration("override", new CssValue.Keyword("prev")),
      new Declaration("not-override2", new CssValue.Keyword("value2"))
    ]
  );
  expect(
    specifiedValues(
      new ElementData("target", new Map([["id", "target"]])),
      new Stylesheet([rule1, rule2])
    )
  ).toEqual(
    new Map([
      ["not-override1", new CssValue.Keyword("value1")],
      ["not-override2", new CssValue.Keyword("value2")],
      ["override", new CssValue.Keyword("current")]
    ])
  );
});

test("compare matched rule right a", () => {
  expect(
    compareMatchedRule([[0, 0, 0], new Rule([], [])], [[1, 0, 0], new Rule([], [])])
  ).toBeLessThan(0);
});

test("compare matched rule left a", () => {
  expect(
    compareMatchedRule([[1, 0, 0], new Rule([], [])], [[0, 0, 0], new Rule([], [])])
  ).toBeGreaterThan(0);
});

test("compare matched rule right b", () => {
  expect(
    compareMatchedRule([[0, 0, 0], new Rule([], [])], [[0, 1, 0], new Rule([], [])])
  ).toBeLessThan(0);
});

test("compare matched rule left b", () => {
  expect(
    compareMatchedRule([[0, 1, 0], new Rule([], [])], [[0, 0, 0], new Rule([], [])])
  ).toBeGreaterThan(0);
});

test("compare matched rule right c", () => {
  expect(
    compareMatchedRule([[0, 0, 0], new Rule([], [])], [[0, 0, 1], new Rule([], [])])
  ).toBeLessThan(0);
});

test("compare matched rule left c", () => {
  expect(
    compareMatchedRule([[0, 0, 1], new Rule([], [])], [[0, 0, 0], new Rule([], [])])
  ).toBeGreaterThan(0);
});

test("compare matched rule same", () => {
  expect(compareMatchedRule([[0, 0, 0], new Rule([], [])], [[0, 0, 0], new Rule([], [])])).toBe(0);
});

test("sort compare matched rule", () => {
  const left: MatchedRule = [[0, 0, 0], new Rule([], [])];
  const right: MatchedRule = [[1, 0, 0], new Rule([], [])];
  expect([left, right].sort(compareMatchedRule)).toEqual([left, right]);
});

test("style node text", () => {
  expect(styleTree(text("hoge"), new Stylesheet([]))).toEqual(
    new StyledNode(text("hoge"), new Map([]), [])
  );
});

test("style node element", () => {
  const rule = new Rule(
    [new Selector.Simple(new SimpleSelector(null, "target", []))],
    [new Declaration("some", new CssValue.Keyword("foo"))]
  );
  const element = elem("no mean", new Map([["id", "target"]]), []);
  expect(styleTree(element, new Stylesheet([rule]))).toEqual(
    new StyledNode(element, new Map([["some", new CssValue.Keyword("foo")]]), [])
  );
});

test("style node children", () => {
  const rule = new Rule(
    [new Selector.Simple(new SimpleSelector(null, "target", []))],
    [new Declaration("some", new CssValue.Keyword("foo"))]
  );
  const element = elem("no mean", new Map([]), [elem("no mean", new Map([["id", "target"]]), [])]);
  expect(styleTree(element, new Stylesheet([rule]))).toEqual(
    new StyledNode(element, new Map([]), [
      new StyledNode(
        elem("no mean", new Map([["id", "target"]]), []),
        new Map([["some", new CssValue.Keyword("foo")]]),
        []
      )
    ])
  );
});

test("style node display inline default", () => {
  expect(new StyledNode(elem("no mean", new Map([]), []), new Map([]), []).display()).toBe(
    Display.Inline
  );
});

test("style node display none", () => {
  expect(
    new StyledNode(
      elem("no mean", new Map([["id", "target"]]), []),
      new Map([["display", new CssValue.Keyword("none")]]),
      []
    ).display()
  ).toBe(Display.None);
});

test("style node display block", () => {
  expect(
    new StyledNode(
      elem("no mean", new Map([["id", "target"]]), []),
      new Map([["display", new CssValue.Keyword("block")]]),
      []
    ).display()
  ).toBe(Display.Block);
});

test("style node display inline", () => {
  expect(
    new StyledNode(
      elem("no mean", new Map([["id", "target"]]), []),
      new Map([["display", new CssValue.Keyword("no mean")]]),
      []
    ).display()
  ).toBe(Display.Inline);
});

test("style node display inline2", () => {
  expect(
    new StyledNode(
      elem("no mean", new Map([["id", "target"]]), []),
      new Map([["display", new CssValue.ColorValue(new Color(0, 0, 0, 0))]]),
      []
    ).display()
  ).toBe(Display.Inline);
});
