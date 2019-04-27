import { DomNode } from "./dom";
import { CssValue } from "./css";

type PropertyMap = Map<string, CssValue>;

export class StyledNode {
  node: DomNode;
  specifiedValues: PropertyMap;
  children: StyledNode[];

  constructor(node: DomNode, specifiedValues: PropertyMap, children: StyledNode[]) {
    this.node = node;
    this.specifiedValues = specifiedValues;
    this.children = children;
  }

  value(name: string): CssValue | null {
    return this.specifiedValues.get(name) || null;
  }
}
