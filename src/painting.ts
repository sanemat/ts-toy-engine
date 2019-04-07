import { Color } from "./css";

export class Canvas {
  pixels: Array<Color> = [];
  width: number = 0;
  height: number = 0;

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
