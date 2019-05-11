import { DomNode, ElementData } from "./dom";
import { CssValue, Rule, Selector, SimpleSelector, Specificity, Stylesheet } from "./css";

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

export function matches(elem: ElementData, selector: Selector): boolean {
  switch (selector.format) {
    case Selector.Format.Simple:
      return matchesSimpleSelector(elem, selector.selector);
  }
}

export type MatchedRule = [Specificity, Rule];

// If `rule` matches `elem`, return a `MatchedRule`. Otherwise return null.
export function matchRule(elem: ElementData, rule: Rule): null | MatchedRule {
  // Find the first (most specific) matching selector.
  // Because our CSS parser stores the selectors from most- to least-specific,
  const found = rule.selectors.find(selector => {
    return matches(elem, selector);
  });
  if (found === undefined) {
    return null;
  }
  return [found.selector.specificity(), rule];
}

export function matchingRules(elem: ElementData, stylesheet: Stylesheet): MatchedRule[] {
  return stylesheet.rules
    .map(rule => {
      return matchRule(elem, rule);
    })
    .filter(
      (matchedOrNull): matchedOrNull is MatchedRule => {
        return matchedOrNull !== null;
      }
    );
}
