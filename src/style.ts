import { Node } from "./dom";
import { Value } from "./css";

type PropertyMap = Map<string, Value>;

export class StyledNode {
  node: Node;
  specifiedValues: PropertyMap;
  children: Array<StyledNode>;
  constructor(node: Node, specifiedValues: PropertyMap, children: Array<StyledNode>) {
    this.node = node;
    this.specifiedValues = specifiedValues;
    this.children = children;
  }
}
