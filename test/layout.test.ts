import { BoxType, Dimensions, EdgeSizes, LayoutBox, Rect } from "../src/layout";
import { StyledNode } from "../src/style";
import { DomNode } from "../src/dom";
import { CssValue } from "../src/css";

test("rect", () => {
  expect(new Rect(1, 2, 3, 4).height).toBe(4);
});

test("edge sizes", () => {
  expect(new EdgeSizes(1, 2, 3, 4).bottom).toBe(4);
});

test("dimensions", () => {
  const target = new Rect(1, 2, 3, 4);
  const edge = new EdgeSizes(1, 2, 3, 4);
  expect(new Dimensions(target, edge, edge, edge).content).toEqual(target);
});

const oneStyledNode = new StyledNode(
  new DomNode(),
  new Map([["key", new CssValue.Keyword("hoge")]]),
  []
);

test("block node", () => {
  expect(new BoxType.BlockNode(oneStyledNode).format).toEqual(BoxType.Format.BlockNode);
});

test("inline node", () => {
  expect(new BoxType.InlineNode(oneStyledNode).format).toEqual(BoxType.Format.InlineNode);
});

test("anonymous block", () => {
  expect(new BoxType.AnonymousBlock().format).toEqual(BoxType.Format.AnonymousBlock);
});

test("layout box", () => {
  expect(
    new LayoutBox(
      new Dimensions(
        new Rect(0, 0, 0, 0),
        new EdgeSizes(0, 0, 0, 0),
        new EdgeSizes(0, 0, 0, 0),
        new EdgeSizes(0, 0, 0, 0)
      ),
      new BoxType.AnonymousBlock(),
      []
    ).children
  ).toEqual([]);
});
