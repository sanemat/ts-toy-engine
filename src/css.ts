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

export namespace CssValue {
  export enum Format {
    Keyword,
    Length,
    ColorValue
  }

  export class Keyword {
    readonly format = Format.Keyword;
    keyword: string;
    constructor(keyword: string) {
      this.keyword = keyword;
    }
  }

  export class Length {
    readonly format = Format.Length;
    length: number;
    unit: Unit;
    constructor(length: number, unit: Unit) {
      this.length = length;
      this.unit = unit;
    }
  }

  export class ColorValue {
    readonly format = Format.ColorValue;
    colorValue: Color;
    constructor(colorValue: Color) {
      this.colorValue = colorValue;
    }
  }
}

export type CssValue = CssValue.Keyword | CssValue.Length | CssValue.ColorValue;

export class Declaration {
  name: string;
  value: CssValue;

  constructor(name: string, value: CssValue) {
    this.name = name;
    this.value = value;
  }
}

export type Selector = Selector.Simple;

export namespace Selector {
  export enum Format {
    Simple
  }
  export type Simple = { tag: Format.Simple; value: SimpleSelector };
  export function Simple(value: SimpleSelector): Simple {
    return { tag: Format.Simple, value: value };
  }
}

export class SimpleSelector {
  tagName: string | null;
  id: string | null;
  classValue: string[];

  constructor(tagName: string | null, id: string | null, classValue: string[]) {
    this.tagName = tagName;
    this.id = id;
    this.classValue = classValue;
  }
}

export class Rule {
  selectors: Selector[];
  declarations: Declaration[];

  constructor(selectors: Selector[], declarations: Declaration[]) {
    this.selectors = selectors;
    this.declarations = declarations;
  }
}

export class Stylesheet {
  rules: Rule[];

  constructor(rules: Rule[]) {
    this.rules = rules;
  }
}
