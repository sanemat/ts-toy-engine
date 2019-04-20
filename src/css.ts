export class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}

export enum Unit {
  Px
}

export enum ValueFormat {
  Keyword,
  Length,
  ColorValue
}

export class Keyword {
  readonly format = ValueFormat.Keyword;
  keyword: string;
  constructor(keyword: string) {
    this.keyword = keyword;
  }
}

export class Length {
  readonly format = ValueFormat.Length;
  length: number;
  unit: Unit;
  constructor(length: number, unit: Unit) {
    this.length = length;
    this.unit = unit;
  }
}

export class ColorValue {
  readonly format = ValueFormat.ColorValue;
  colorValue: Color;
  constructor(colorValue: Color) {
    this.colorValue = colorValue;
  }
}

export type Value = Keyword | Length | ColorValue;
