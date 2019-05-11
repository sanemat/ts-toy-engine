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

export namespace Selector {
  export enum Format {
    Simple
  }

  export class Simple {
    readonly format = Format.Simple;
    selector: SimpleSelector;

    constructor(selector: SimpleSelector) {
      this.selector = selector;
    }
  }
}

export type Selector = Selector.Simple;

export type Specificity = [number, number, number];

export class SimpleSelector {
  tagName: string | null;
  id: string | null;
  classValue: string[];

  constructor(tagName: string | null, id: string | null, classValue: string[]) {
    this.tagName = tagName;
    this.id = id;
    this.classValue = classValue;
  }

  specificity(): Specificity {
    // http://www.w3.org/TR/selectors/#specificity
    const a = this.id === null ? 0 : 1;
    const b = this.classValue.length;
    // NOTE: I don't support chained selectors now.
    const c = this.tagName === null ? 0 : 1;
    return [a, b, c];
  }
}

export class Rule {
  // Because our CSS parser stores the selectors from most- to least-specific
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
