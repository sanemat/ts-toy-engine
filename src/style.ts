import { DomNode, ElementData } from "./dom";
import { CssValue, SimpleSelector } from "./css";

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

// returns true if there are no none-match
export function matchesSimpleSelector(elem: ElementData, selector: SimpleSelector): boolean {
  const tagName = selector.tagName;
  if (tagName && tagName !== elem.tagName) {
    return false;
  }

  const id = selector.id;
  if (id && id !== elem.id()) {
    return false;
  }

  const classes = selector.classValue;
  if (classes.length !== 0) {
    let included = false;
    for (let className of classes) {
      if (elem.classes().has(className)) {
        included = true;
        break;
      }
    }
    if (!included) {
      return false;
    }
  }

  return true;
}
