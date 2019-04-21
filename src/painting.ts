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
