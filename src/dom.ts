export class DomNode {
  children: DomNode[];
  nodeType: NodeType;

  constructor(children: DomNode[], nodeType: NodeType) {
    this.children = children;
    this.nodeType = nodeType;
  }
}

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

  export class Text {
    readonly format = Format.Text;
    text: string;

    constructor(text: string) {
      this.text = text;
    }
  }
}

export type NodeType = NodeType.Element | NodeType.Text;

type AttrMap = Map<string, string>;

export class ElementData {
  tagName: string;
  attributes: AttrMap;

  constructor(tagName: string, attributes: AttrMap) {
    this.tagName = tagName;
    this.attributes = attributes;
  }
}
