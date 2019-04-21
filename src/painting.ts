import { Color } from "./css";
import { Rect } from "./layout";
const mathClamp = require("math-clamp");

export class Canvas {
  pixels: Array<Color>;
  width: number;
  height: number;

  constructor(pixels: Array<Color>, width: number, height: number) {
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
      case DisplayCommandFormat.SolidColor:
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

export enum DisplayCommandFormat {
  SolidColor
}

export class SolidColor {
  readonly format = DisplayCommandFormat.SolidColor;
  color: Color;
  rect: Rect;
  constructor(color: Color, rect: Rect) {
    this.color = color;
    this.rect = rect;
  }
}

export type DisplayCommand = SolidColor;
export type DisplayList = Array<DisplayCommand>;
