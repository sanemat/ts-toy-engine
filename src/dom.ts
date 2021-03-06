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

export type AttrMap = Map<string, string>;

export class ElementData {
  tagName: string;
  attributes: AttrMap;

  constructor(tagName: string, attributes: AttrMap) {
    this.tagName = tagName;
    this.attributes = attributes;
  }

  id(): string | null {
    return this.attributes.get("id") || null;
  }

  classes(): Set<string> {
    const classes = this.attributes.get("class");
    if (!classes) {
      return new Set([]);
    }
    return new Set(classes.split(" "));
  }
}

export function text(data: string): DomNode {
  return new DomNode([], new NodeType.Text(data));
}

export function elem(name: string, attrs: AttrMap, children: DomNode[]): DomNode {
  return new DomNode(children, new NodeType.Element(new ElementData(name, attrs)));
}
