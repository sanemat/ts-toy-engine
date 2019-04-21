import {
  AnonymousBlock,
  BlockNode,
  BoxTypeFormat,
  Dimensions,
  EdgeSizes,
  InlineNode,
  LayoutBox,
  Rect
} from "../src/layout";
import { StyledNode } from "../src/style";
import { Node } from "../src/dom";
import { Keyword } from "../src/css";

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

const oneStyledNode = new StyledNode(new Node(), new Map([["key", new Keyword("hoge")]]), []);

test("block node", () => {
  expect(new BlockNode(oneStyledNode).format).toEqual(BoxTypeFormat.BlockNode);
});

test("inline node", () => {
  expect(new InlineNode(oneStyledNode).format).toEqual(BoxTypeFormat.InlineNode);
});

test("anonymous block", () => {
  expect(new AnonymousBlock().format).toEqual(BoxTypeFormat.AnonymousBlock);
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
      new AnonymousBlock(),
      []
    ).children
  ).toEqual([]);
});
