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
}
