import { DomNode, ElementData, NodeType } from "./dom";
import { CssValue, Rule, Selector, SimpleSelector, Specificity, Stylesheet } from "./css";

type PropertyMap = Map<string, CssValue>;

export enum Display {
  Inline,
  Block,
  None
}

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

  lookup(name: string, fallbackName: string, defaultValue: CssValue): CssValue {
    return this.value(name) || this.value(fallbackName) || defaultValue;
  }

  display(): Display {
    const displayValue = this.value("display");
    if (displayValue === null) {
      return Display.Inline;
    }
    switch (displayValue.format) {
      case CssValue.Format.Keyword:
        switch (displayValue.keyword) {
          case "block":
            return Display.Block;
          case "none":
            return Display.None;
          default:
            return Display.Inline;
        }
    }
    return Display.Inline;
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

export function compareMatchedRule(left: MatchedRule, right: MatchedRule): number {
  const [[la, lb, lc]] = left;
  const [[ra, rb, rc]] = right;
  if (la !== ra) {
    return la - ra;
  } else if (lb !== rb) {
    return lb - rb;
  } else if (lc !== rc) {
    return lc - rc;
  }
  return 0;
}

// Apply styles to a single element, returning the specified styles.
//
// To do: Allow multiple UA/author/user stylesheets, and implement the cascade.
export function specifiedValues(elem: ElementData, stylesheet: Stylesheet): PropertyMap {
  const values = new Map<string, CssValue>([]);
  const rules = matchingRules(elem, stylesheet);
  rules.sort(compareMatchedRule);
  for (const [, rule] of rules) {
    for (const declaration of rule.declarations) {
      values.set(declaration.name, declaration.value);
    }
  }
  return values;
}

// Apply a stylesheet to an entire DOM tree, returning a StyledNode tree.
export function styleTree(root: DomNode, stylesheet: Stylesheet): StyledNode {
  switch (root.nodeType.format) {
    case NodeType.Format.Text:
      return new StyledNode(
        root,
        new Map([]),
        // NOTE: text node has children??? I'm not sure
        []
      );
    case NodeType.Format.Element:
      return new StyledNode(
        root,
        specifiedValues(root.nodeType.element, stylesheet),
        root.children.map(child => {
          return styleTree(child, stylesheet);
        })
      );
  }
}
