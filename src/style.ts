import { DomNode } from "./dom";
import { Value } from "./css";

type PropertyMap = Map<string, Value>;

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
