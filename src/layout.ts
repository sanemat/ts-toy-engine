import { Display, StyledNode } from "./style";
import { CssValue, Unit } from "./css";
const equal = require("fast-deep-equal");

export class Rect {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  expandedBy(edge: EdgeSizes): Rect {
    return new Rect(
      this.x - edge.left,
      this.y - edge.top,
      this.width + edge.left + edge.right,
      this.height + edge.top + edge.bottom
    );
  }
}

export class EdgeSizes {
  left: number;
  right: number;
  top: number;
  bottom: number;

  constructor(left: number, right: number, top: number, bottom: number) {
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
  }
}

export class Dimensions {
  content: Rect;
  padding: EdgeSizes;
  border: EdgeSizes;
  margin: EdgeSizes;

  constructor(content: Rect, padding: EdgeSizes, border: EdgeSizes, margin: EdgeSizes) {
    this.content = content;
    this.padding = padding;
    this.border = border;
    this.margin = margin;
  }

  // The area covered by the content area plus its padding.
  paddingBox(): Rect {
    return this.content.expandedBy(this.padding);
  }

  // The area covered by the content area plus padding and borders.
  borderBox(): Rect {
    return this.paddingBox().expandedBy(this.border);
  }

  // The area covered by the content area plus padding, borders, and margin.
  marginBox(): Rect {
    return this.borderBox().expandedBy(this.margin);
  }
}

export namespace BoxType {
  export enum Format {
    BlockNode,
    InlineNode,
    AnonymousBlock
  }

  export class BlockNode {
    readonly format = Format.BlockNode;
    styledNode: StyledNode;
    constructor(styledNode: StyledNode) {
      this.styledNode = styledNode;
    }
  }

  export class InlineNode {
    readonly format = Format.InlineNode;
    styledNode: StyledNode;
    constructor(styledNode: StyledNode) {
      this.styledNode = styledNode;
    }
  }

  export class AnonymousBlock {
    readonly format = Format.AnonymousBlock;
  }
}

export type BoxType = BoxType.BlockNode | BoxType.InlineNode | BoxType.AnonymousBlock;

export class LayoutBox {
  dimensions: Dimensions;
  boxType: BoxType;
  children: LayoutBox[];

  constructor(dimensions: Dimensions, boxType: BoxType, children: LayoutBox[]) {
    this.dimensions = dimensions;
    this.boxType = boxType;
    this.children = children;
  }

  static Create(boxType: BoxType) {
    return new LayoutBox(
      new Dimensions(
        new Rect(0, 0, 0, 0),
        new EdgeSizes(0, 0, 0, 0),
        new EdgeSizes(0, 0, 0, 0),
        new EdgeSizes(0, 0, 0, 0)
      ),
      boxType,
      []
    );
  }

  // NOTE: This may modify this.children :trollface:
  getInlineContainer(): LayoutBox {
    switch (this.boxType.format) {
      case BoxType.Format.AnonymousBlock:
      case BoxType.Format.InlineNode:
        return this;
      case BoxType.Format.BlockNode:
        if (
          this.children.length === 0 ||
          this.children[this.children.length - 1].boxType.format !== BoxType.Format.AnonymousBlock
        ) {
          this.children.push(LayoutBox.Create(new BoxType.AnonymousBlock()));
        }
        return this.children[this.children.length - 1];
    }
  }

  getStyleNode(): StyledNode {
    switch (this.boxType.format) {
      case BoxType.Format.AnonymousBlock:
        throw Error("Anonymous block box has no style node");
      case BoxType.Format.BlockNode:
      case BoxType.Format.InlineNode:
        return this.boxType.styledNode;
    }
  }

  // Calculate the width of a block-level non-replaced element in normal flow.
  //
  // http://www.w3.org/TR/CSS2/visudet.html#blockwidth
  //
  // Sets the horizontal margin/padding/border dimensions, and the `width`.
  calculateBlockWidth(containingBlock: Dimensions): void {
    const style = this.getStyleNode();

    // `width` has initial value `auto`.
    const auto = new CssValue.Keyword("auto");
    let width = style.value("width") || auto;

    // margin, border, and padding have initial value 0.
    const zeroLength = new CssValue.Length(0.0, Unit.Px);

    let marginLeft = style.lookup("margin-left", "margin", zeroLength);
    let marginRight = style.lookup("margin-right", "margin", zeroLength);

    const borderLeft = style.lookup("border-left-width", "border-width", zeroLength);
    const borderRight = style.lookup("border-right-width", "border-width", zeroLength);

    const paddingLeft = style.lookup("padding-left", "padding", zeroLength);
    const paddingRight = style.lookup("padding-right", "padding", zeroLength);

    const total = [
      marginLeft,
      marginRight,
      borderLeft,
      borderRight,
      paddingLeft,
      paddingRight,
      width
    ]
      .map(value => value.toPx())
      .reduce((a, b) => a + b);

    // If width is not auto and the total is wider than the container, treat auto margins as 0.
    if (!equal(width, auto) && total > containingBlock.content.width) {
      if (equal(marginLeft, auto)) {
        marginLeft = new CssValue.Length(0.0, Unit.Px);
      }
      if (equal(marginRight, auto)) {
        marginRight = new CssValue.Length(0.0, Unit.Px);
      }
    }

    // Adjust used values so that the above sum equals `containing_block.width`.
    // Each arm of the `match` should increase the total width by exactly `underflow`,
    // and afterward all values should be absolute lengths in px.
    const underflow = containingBlock.content.width - total;

    // pattern match
    if (!equal(width, auto) && !equal(marginLeft, auto) && !equal(marginRight, auto)) {
      marginRight = new CssValue.Length(marginRight.toPx() + underflow, Unit.Px);
    } else if (!equal(width, auto) && !equal(marginLeft, auto) && equal(marginRight, auto)) {
      // If exactly one size is auto, its used value follows from the equality.
      marginRight = new CssValue.Length(underflow, Unit.Px);
    } else if (!equal(width, auto) && equal(marginLeft, auto) && !equal(marginRight, auto)) {
      marginLeft = new CssValue.Length(underflow, Unit.Px);
    } else if (equal(width, auto)) {
      if (equal(marginLeft, auto)) {
        marginLeft = new CssValue.Length(0.0, Unit.Px);
      }
      if (equal(marginRight, auto)) {
        marginRight = new CssValue.Length(0.0, Unit.Px);
      }
      if (underflow >= 0.0) {
        // Expand width to fill the underflow.
        width = new CssValue.Length(underflow, Unit.Px);
      } else {
        // Width can't be negative. Adjust the right margin instead.
        width = new CssValue.Length(0.0, Unit.Px);
        marginRight = new CssValue.Length(marginRight.toPx() + underflow, Unit.Px);
      }
    } else if (!equal(width, auto) && equal(marginLeft, auto) && equal(marginRight, auto)) {
      // If margin-left and margin-right are both auto, their used values are equal.
      marginLeft = new CssValue.Length(underflow / 2.0, Unit.Px);
      marginRight = new CssValue.Length(underflow / 2.0, Unit.Px);
    }

    const d = this.dimensions;
    d.content.width = width.toPx();

    d.padding.left = paddingLeft.toPx();
    d.padding.right = paddingRight.toPx();

    d.border.left = borderLeft.toPx();
    d.border.right = borderRight.toPx();

    d.margin.left = marginLeft.toPx();
    d.margin.right = marginRight.toPx();
  }
}

export function buildLayoutTree(styleNode: StyledNode): LayoutBox {
  let root: LayoutBox;
  switch (styleNode.display()) {
    case Display.None: // NOTE: I'm not sure "Uncovered Line"
      throw Error("Root node has display: none.");
    case Display.Block:
      root = LayoutBox.Create(new BoxType.BlockNode(styleNode));
      break;
    case Display.Inline:
      root = LayoutBox.Create(new BoxType.InlineNode(styleNode));
      break;
    default:
      /* istanbul ignore next */
      throw Error("never");
  }

  for (const child of styleNode.children) {
    switch (child.display()) {
      case Display.Inline:
        root.getInlineContainer().children.push(buildLayoutTree(child));
        break;
      case Display.Block:
        root.children.push(buildLayoutTree(child));
        break;
      case Display.None:
        // do nothing
        break;
    }
  }
  return root;
}
