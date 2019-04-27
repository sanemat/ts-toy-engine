import { StyledNode } from "../src/style";
import { CssValue, Unit } from "../src/css";
import { DomNode } from "../src/dom";

test("styled node", () => {
  expect(
    new StyledNode(new DomNode(), new Map([["1", new CssValue.Length(1, Unit.Px)]]), []).children
  ).toEqual([]);
});

test("styled node hits", () => {
  const expected = new CssValue.Keyword("example");
  expect(
    new StyledNode(new DomNode(), new Map([["target", expected]]), []).value("target")
  ).toEqual(expected);
});

test("styled node does not hit", () => {
  expect(
    new StyledNode(new DomNode(), new Map([["some", new CssValue.Keyword("example")]]), []).value(
      "different"
    )
  ).toEqual(null);
});
