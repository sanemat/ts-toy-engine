import { Color, CssValue } from "./css";
import { BoxType, LayoutBox, Rect } from "./layout";
const mathClamp = require("math-clamp");

export class Canvas {
  pixels: Color[];
  width: number;
  height: number;

  constructor(pixels: Color[], width: number, height: number) {
    this.pixels = pixels;
    this.width = width;
    this.height = height;
  }

  static Create(width: number, height: number): Canvas {
    const white = new Color(255, 255, 255, 255);
    return new Canvas(new Array(width * height).fill(white), width, height);
  }

  paintItem(item: DisplayCommand) {
    switch (item.format) {
      case DisplayCommand.Format.SolidColor:
        const rect = item.rect;
        const color = item.color;
        let x0 = mathClamp(rect.x, 0.0, this.width);
        let y0 = mathClamp(rect.y, 0.0, this.height);
        let x1 = mathClamp(rect.x + rect.width, 0.0, this.width);
        let y1 = mathClamp(rect.y + rect.height, 0.0, this.height);
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            // TODO: alpha compositing with existing pixel
            this.pixels[x + y * this.width] = color;
          }
        }
    }
  }
}

export namespace DisplayCommand {
  export enum Format {
    SolidColor
  }

  export class SolidColor {
    readonly format = Format.SolidColor;
    color: Color;
    rect: Rect;
    constructor(color: Color, rect: Rect) {
      this.color = color;
      this.rect = rect;
    }
  }
}

export type DisplayCommand = DisplayCommand.SolidColor;
export type DisplayList = DisplayCommand[];

export function getColor(layoutBox: LayoutBox, name: string): Color | null {
  switch (layoutBox.boxType.format) {
    case BoxType.Format.BlockNode:
    case BoxType.Format.InlineNode:
      const style = layoutBox.boxType.styledNode.value(name);
      if (style === null) {
        return null;
      }
      switch (style.format) {
        case CssValue.Format.ColorValue:
          return style.colorValue;
        default:
          return null;
      }
    case BoxType.Format.AnonymousBlock:
      return null;
  }
}
