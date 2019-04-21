import { DomNode } from "./dom";
import { CssValue } from "./css";

type PropertyMap = Map<string, CssValue>;

export class StyledNode {
  node: DomNode;
  specifiedValues: PropertyMap;
  children: Array<StyledNode>;
  constructor(node: DomNode, specifiedValues: PropertyMap, children: Array<StyledNode>) {
    this.node = node;
    this.specifiedValues = specifiedValues;
    this.children = children;
  }
}
