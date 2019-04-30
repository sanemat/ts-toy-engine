import { StyledNode } from "../src/style";
import { CssValue, Unit } from "../src/css";
import { DomNode, NodeType } from "../src/dom";

test("styled node", () => {
  expect(
    new StyledNode(
      new DomNode([], new NodeType.Text("no mean")),
      new Map([["1", new CssValue.Length(1, Unit.Px)]]),
      []
    ).children
  ).toEqual([]);
});

test("styled node hits", () => {
  const expected = new CssValue.Keyword("example");
  expect(
    new StyledNode(
      new DomNode([], new NodeType.Text("no mean")),
      new Map([["target", expected]]),
      []
    ).value("target")
  ).toEqual(expected);
});

test("styled node does not hit", () => {
  expect(
    new StyledNode(
      new DomNode([], new NodeType.Text("no mean")),
      new Map([["some", new CssValue.Keyword("example")]]),
      []
    ).value("different")
  ).toEqual(null);
});
