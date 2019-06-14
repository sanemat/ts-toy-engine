import { BoxType, buildLayoutTree, Dimensions, EdgeSizes, LayoutBox, Rect } from "../src/layout";
import { StyledNode } from "../src/style";
import { elem, text } from "../src/dom";
import { CssValue, Unit } from "../src/css";

test("rect", () => {
  expect(new Rect(1, 2, 3, 4).height).toBe(4);
});

test("edge sizes", () => {
  expect(new EdgeSizes(1, 2, 3, 4).bottom).toBe(4);
});

test("dimensions", () => {
  const target = new Rect(1, 2, 3, 4);
  const edge = new EdgeSizes(1, 2, 3, 4);
  expect(new Dimensions(target, edge, edge, edge).content).toBe(target);
});

const oneStyledNode = new StyledNode(
  text("no mean"),
  new Map([["key", new CssValue.Keyword("hoge")]]),
  []
);

test("block node", () => {
  expect(new BoxType.BlockNode(oneStyledNode).format).toBe(BoxType.Format.BlockNode);
});

test("inline node", () => {
  expect(new BoxType.InlineNode(oneStyledNode).format).toBe(BoxType.Format.InlineNode);
});

test("anonymous block", () => {
  expect(new BoxType.AnonymousBlock().format).toBe(BoxType.Format.AnonymousBlock);
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

test("LayoutBox#getInlineContainer anonymous block", () => {
  const layoutBoxAnonymousBlock = new LayoutBox(
    new Dimensions(
      new Rect(1, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0)
    ),
    new BoxType.AnonymousBlock(),
    []
  );
  expect(layoutBoxAnonymousBlock.getInlineContainer()).toEqual(layoutBoxAnonymousBlock);
});

test("LayoutBox#getInlineContainer inline node", () => {
  const layoutBoxInlineNode = new LayoutBox(
    new Dimensions(
      new Rect(1, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0)
    ),
    new BoxType.InlineNode(oneStyledNode),
    []
  );
  expect(layoutBoxInlineNode.getInlineContainer()).toEqual(layoutBoxInlineNode);
});

test("LayoutBox#getInlineContainer block node 1", () => {
  const layoutBoxAnonymousBlock = new LayoutBox(
    new Dimensions(
      new Rect(1, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0)
    ),
    new BoxType.AnonymousBlock(),
    []
  );
  const layoutBoxBlockNode = new LayoutBox(
    new Dimensions(
      new Rect(0, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0)
    ),
    new BoxType.BlockNode(oneStyledNode),
    [layoutBoxAnonymousBlock]
  );
  expect(layoutBoxBlockNode.getInlineContainer()).toEqual(layoutBoxAnonymousBlock);
});

test("LayoutBox#getInlineContainer block node 2", () => {
  const layoutBoxBlockNode = new LayoutBox(
    new Dimensions(
      new Rect(0, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0),
      new EdgeSizes(0, 0, 0, 0)
    ),
    new BoxType.BlockNode(oneStyledNode),
    []
  );
  expect(layoutBoxBlockNode.getInlineContainer()).toEqual(
    LayoutBox.Create(new BoxType.AnonymousBlock())
  );
});

test("buildLayoutTree 1", () => {
  const displayNone = new StyledNode(
    elem("no mean", new Map([["id", "target"]]), []),
    new Map([["display", new CssValue.Keyword("none")]]),
    []
  );
  expect(() => {
    buildLayoutTree(displayNone);
  }).toThrow();
});

test("buildLayoutTree 2", () => {
  const displayBlock = new StyledNode(
    elem("no mean", new Map([["id", "target"]]), []),
    new Map([["display", new CssValue.Keyword("block")]]),
    []
  );
  expect(buildLayoutTree(displayBlock)).toEqual(
    LayoutBox.Create(new BoxType.BlockNode(displayBlock))
  );
});

test("buildLayoutTree 3", () => {
  const displayInline = new StyledNode(
    elem("no mean", new Map([["id", "target"]]), []),
    new Map([["display", new CssValue.Keyword("no mean")]]),
    []
  );
  expect(buildLayoutTree(displayInline)).toEqual(
    LayoutBox.Create(new BoxType.InlineNode(displayInline))
  );
});

test("buildLayoutTree 4", () => {
  const childDisplayBlock = new StyledNode(
    elem("no mean", new Map([["id", "target2"]]), []),
    new Map([["display", new CssValue.Keyword("block")]]),
    []
  );
  const displayBlock = new StyledNode(
    elem("no mean", new Map([["id", "target"]]), []),
    new Map([["display", new CssValue.Keyword("block")]]),
    [childDisplayBlock]
  );
  expect(buildLayoutTree(displayBlock)).toEqual(
    new LayoutBox(
      new Dimensions(
        new Rect(0, 0, 0, 0),
        new EdgeSizes(0, 0, 0, 0),
        new EdgeSizes(0, 0, 0, 0),
        new EdgeSizes(0, 0, 0, 0)
      ),
      new BoxType.BlockNode(displayBlock),
      [LayoutBox.Create(new BoxType.BlockNode(childDisplayBlock))]
    )
  );
});

test("buildLayoutTree 5", () => {
  const childDisplayInline = new StyledNode(
    elem("no mean", new Map([["id", "target2"]]), []),
    new Map([["display", new CssValue.Keyword("no mean")]]),
    []
  );
  const displayBlock = new StyledNode(
    elem("no mean", new Map([["id", "target"]]), []),
    new Map([["display", new CssValue.Keyword("block")]]),
    [childDisplayInline]
  );
  expect(buildLayoutTree(displayBlock)).toEqual(
    new LayoutBox(
      new Dimensions(
        new Rect(0, 0, 0, 0),
        new EdgeSizes(0, 0, 0, 0),
        new EdgeSizes(0, 0, 0, 0),
        new EdgeSizes(0, 0, 0, 0)
      ),
      new BoxType.BlockNode(displayBlock),
      [
        new LayoutBox(
          new Dimensions(
            new Rect(0, 0, 0, 0),
            new EdgeSizes(0, 0, 0, 0),
            new EdgeSizes(0, 0, 0, 0),
            new EdgeSizes(0, 0, 0, 0)
          ),
          new BoxType.AnonymousBlock(),
          [LayoutBox.Create(new BoxType.InlineNode(childDisplayInline))]
        )
      ]
    )
  );
});

test("buildLayoutTree 6", () => {
  const childDisplayNone = new StyledNode(
    elem("no mean", new Map([["id", "target2"]]), []),
    new Map([["display", new CssValue.Keyword("none")]]),
    []
  );
  const displayBlock = new StyledNode(
    elem("no mean", new Map([["id", "target"]]), []),
    new Map([["display", new CssValue.Keyword("block")]]),
    [childDisplayNone]
  );
  expect(buildLayoutTree(displayBlock)).toEqual(
    new LayoutBox(
      new Dimensions(
        new Rect(0, 0, 0, 0),
        new EdgeSizes(0, 0, 0, 0),
        new EdgeSizes(0, 0, 0, 0),
        new EdgeSizes(0, 0, 0, 0)
      ),
      new BoxType.BlockNode(displayBlock),
      []
    )
  );
});

test("getStyleNode anonymous block", () => {
  expect(() => {
    LayoutBox.Create(new BoxType.AnonymousBlock()).getStyleNode();
  }).toThrow();
});

test("getStyleNode block node", () => {
  expect(LayoutBox.Create(new BoxType.BlockNode(oneStyledNode)).getStyleNode()).toEqual(
    oneStyledNode
  );
});

test("getStyleNode inline node", () => {
  expect(LayoutBox.Create(new BoxType.InlineNode(oneStyledNode)).getStyleNode()).toEqual(
    oneStyledNode
  );
});

test("calculate block width1", () => {
  const styledNode = new StyledNode(
    text("obj"),
    new Map([["width", new CssValue.Length(40, Unit.Px)]]),
    []
  );
  const layout = LayoutBox.Create(new BoxType.InlineNode(styledNode));
  const content = new Dimensions(
    new Rect(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0)
  );
  layout.calculateBlockWidth(content);
  const dimensions = layout.dimensions;
  expect(dimensions.content.width).toEqual(40);
  expect(dimensions.padding.left).toEqual(0);
  expect(dimensions.padding.right).toEqual(0);
  expect(dimensions.border.left).toEqual(0);
  expect(dimensions.border.right).toEqual(0);
  expect(dimensions.margin.left).toEqual(0);
  expect(dimensions.margin.right).toEqual(-40);
});

test("calculate block width2", () => {
  const styledNode = new StyledNode(
    text("obj"),
    new Map([
      ["width", new CssValue.Length(40, Unit.Px) as CssValue],
      ["margin", new CssValue.Keyword("auto") as CssValue]
    ]),
    []
  );
  const layout = LayoutBox.Create(new BoxType.InlineNode(styledNode));
  const content = new Dimensions(
    new Rect(0, 0, 50, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0)
  );
  layout.calculateBlockWidth(content);
  const dimensions = layout.dimensions;
  expect(dimensions.content.width).toEqual(40);
  expect(dimensions.padding.left).toEqual(0);
  expect(dimensions.padding.right).toEqual(0);
  expect(dimensions.border.left).toEqual(0);
  expect(dimensions.border.right).toEqual(0);
  expect(dimensions.margin.left).toEqual(5);
  expect(dimensions.margin.right).toEqual(5);
});

test("calculate block width3", () => {
  const styledNode = new StyledNode(
    text("obj"),
    new Map([
      ["margin", new CssValue.Keyword("auto") as CssValue],
      ["padding", new CssValue.Length(30, Unit.Px) as CssValue]
    ]),
    []
  );
  const layout = LayoutBox.Create(new BoxType.InlineNode(styledNode));
  const content = new Dimensions(
    new Rect(0, 0, 30, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0)
  );
  layout.calculateBlockWidth(content);
  const dimensions = layout.dimensions;
  expect(dimensions.content.width).toEqual(0);
  expect(dimensions.padding.left).toEqual(30);
  expect(dimensions.padding.right).toEqual(30);
  expect(dimensions.border.left).toEqual(0);
  expect(dimensions.border.right).toEqual(0);
  expect(dimensions.margin.left).toEqual(0);
  expect(dimensions.margin.right).toEqual(-30);
});

test("calculate block width4", () => {
  const styledNode = new StyledNode(
    text("obj"),
    new Map([["margin-right", new CssValue.Keyword("auto") as CssValue]]),
    []
  );
  const layout = LayoutBox.Create(new BoxType.InlineNode(styledNode));
  const content = new Dimensions(
    new Rect(0, 0, 30, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0)
  );
  layout.calculateBlockWidth(content);
  const dimensions = layout.dimensions;
  expect(dimensions.content.width).toEqual(30);
  expect(dimensions.padding.left).toEqual(0);
  expect(dimensions.padding.right).toEqual(0);
  expect(dimensions.border.left).toEqual(0);
  expect(dimensions.border.right).toEqual(0);
  expect(dimensions.margin.left).toEqual(0);
  expect(dimensions.margin.right).toEqual(0);
});

test("calculate block width5", () => {
  const styledNode = new StyledNode(
    text("obj"),
    new Map([
      ["margin-right", new CssValue.Keyword("auto") as CssValue],
      ["width", new CssValue.Length(40, Unit.Px) as CssValue]
    ]),
    []
  );
  const layout = LayoutBox.Create(new BoxType.InlineNode(styledNode));
  const content = new Dimensions(
    new Rect(0, 0, 50, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0)
  );
  layout.calculateBlockWidth(content);
  const dimensions = layout.dimensions;
  expect(dimensions.content.width).toEqual(40);
  expect(dimensions.padding.left).toEqual(0);
  expect(dimensions.padding.right).toEqual(0);
  expect(dimensions.border.left).toEqual(0);
  expect(dimensions.border.right).toEqual(0);
  expect(dimensions.margin.left).toEqual(0);
  expect(dimensions.margin.right).toEqual(10);
});

test("calculate block width6", () => {
  const styledNode = new StyledNode(
    text("obj"),
    new Map([
      ["margin-left", new CssValue.Keyword("auto") as CssValue],
      ["width", new CssValue.Length(40, Unit.Px) as CssValue]
    ]),
    []
  );
  const layout = LayoutBox.Create(new BoxType.InlineNode(styledNode));
  const content = new Dimensions(
    new Rect(0, 0, 50, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0)
  );
  layout.calculateBlockWidth(content);
  const dimensions = layout.dimensions;
  expect(dimensions.content.width).toEqual(40);
  expect(dimensions.padding.left).toEqual(0);
  expect(dimensions.padding.right).toEqual(0);
  expect(dimensions.border.left).toEqual(0);
  expect(dimensions.border.right).toEqual(0);
  expect(dimensions.margin.left).toEqual(10);
  expect(dimensions.margin.right).toEqual(0);
});

test("calculate block width7", () => {
  const styledNode = new StyledNode(
    text("obj"),
    new Map([
      ["margin", new CssValue.Keyword("auto") as CssValue],
      ["padding", new CssValue.Length(20, Unit.Px) as CssValue],
      ["width", new CssValue.Length(40, Unit.Px) as CssValue]
    ]),
    []
  );
  const layout = LayoutBox.Create(new BoxType.InlineNode(styledNode));
  const content = new Dimensions(
    new Rect(0, 0, 50, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0)
  );
  layout.calculateBlockWidth(content);
  const dimensions = layout.dimensions;
  expect(dimensions.content.width).toEqual(40);
  expect(dimensions.padding.left).toEqual(20);
  expect(dimensions.padding.right).toEqual(20);
  expect(dimensions.border.left).toEqual(0);
  expect(dimensions.border.right).toEqual(0);
  expect(dimensions.margin.left).toEqual(0);
  expect(dimensions.margin.right).toEqual(-30);
});

test("calculate block position1", () => {
  const styledNode = new StyledNode(
    text("obj"),
    new Map([["width", new CssValue.Length(40, Unit.Px)]]),
    []
  );
  const layout = LayoutBox.Create(new BoxType.InlineNode(styledNode));
  const content = new Dimensions(
    new Rect(1, 2, 3, 4),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0)
  );
  layout.calculateBlockPosition(content);
  const dimensions = layout.dimensions;
  expect(dimensions.content.x).toEqual(1);
  expect(dimensions.content.y).toEqual(6);
  expect(dimensions.padding.top).toEqual(0);
  expect(dimensions.padding.bottom).toEqual(0);
  expect(dimensions.border.top).toEqual(0);
  expect(dimensions.border.bottom).toEqual(0);
  expect(dimensions.margin.top).toEqual(0);
  expect(dimensions.margin.bottom).toEqual(0);
});

test("calculate block height1", () => {
  const styledNode = new StyledNode(
    text("obj"),
    new Map([["height", new CssValue.Length(40, Unit.Px)]]),
    []
  );
  const layout = LayoutBox.Create(new BoxType.InlineNode(styledNode));
  const content = new Dimensions(
    new Rect(1, 2, 3, 4),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0)
  );
  layout.calculateBlockHeight(content);
  const dimensions = layout.dimensions;
  expect(dimensions.content.height).toEqual(40);
});

test("calculate block height2", () => {
  const styledNode = new StyledNode(
    text("obj"),
    new Map([["height", new CssValue.Length(40, Unit.Em)]]),
    []
  );
  const layout = LayoutBox.Create(new BoxType.InlineNode(styledNode));
  const content = new Dimensions(
    new Rect(1, 2, 3, 4),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0)
  );
  layout.calculateBlockHeight(content);
  const dimensions = layout.dimensions;
  expect(dimensions.content.height).toEqual(0);
});

test("calculate block height3", () => {
  const styledNode = new StyledNode(text("obj"), new Map([]), []);
  const layout = LayoutBox.Create(new BoxType.InlineNode(styledNode));
  const content = new Dimensions(
    new Rect(1, 2, 3, 4),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0),
    new EdgeSizes(0, 0, 0, 0)
  );
  layout.calculateBlockHeight(content);
  const dimensions = layout.dimensions;
  expect(dimensions.content.height).toEqual(0);
});
