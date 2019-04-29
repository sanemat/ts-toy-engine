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

test("expandedBy", () => {
  expect(new Rect(12, 13, 4, 5).expandedBy(new EdgeSizes(1, 2, 3, 4))).toEqual(
    new Rect(11, 10, 7, 12)
  );
});

test("layout box create", () => {
  expect(() => LayoutBox.Create(new BoxType.AnonymousBlock())).not.toThrow();
});

const exampleDimensions = new Dimensions(
  new Rect(20, 30, 5, 5),
  new EdgeSizes(2, 3, 4, 5),
  new EdgeSizes(2, 3, 4, 5),
  new EdgeSizes(2, 3, 4, 5)
);

test("Dimensions#paddingBox", () => {
  expect(exampleDimensions.paddingBox()).toEqual(new Rect(18, 26, 10, 14));
});

test("Dimensions#borderBox", () => {
  expect(exampleDimensions.borderBox()).toEqual(new Rect(16, 22, 15, 23));
});

test("Dimensions#marginBox", () => {
  expect(exampleDimensions.marginBox()).toEqual(new Rect(14, 18, 20, 32));
});
