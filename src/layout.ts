import { StyledNode } from "./style";

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
}
