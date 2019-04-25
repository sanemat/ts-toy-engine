export class DomNode {}
export type AttrMap = Map<string, string>;

export namespace NodeType {
  export enum Format {
    Element,
    Text
  }

  export class Element {
    readonly format = Format.Element;
    element: ElementData;
    constructor(element: ElementData) {
      this.element = element;
    }
  }

  export class ElementData {
    tagName: string;
    attributes: AttrMap;
    constructor(tagName: string, attributes: AttrMap) {
      this.tagName = tagName;
      this.attributes = attributes;
    }
  }

  export class Text {
    readonly format = Format.Text;
    text: string;
    constructor(text: string) {
      this.text = text;
    }
  }
}
