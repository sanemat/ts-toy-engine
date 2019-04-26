import { DomNode, NodeType } from "../src/dom";
test("node", () => {
  expect(() => new DomNode([], new NodeType.Text("example"))).not.toThrow();
});

test("element data", () => {
  expect(() => new NodeType.ElementData("example", new Map([["key", "value"]]))).not.toThrow();
});

test("text", () => {
  expect(() => new NodeType.Text("example")).not.toThrow();
});

test("element", () => {
  expect(
    () => new NodeType.Element(new NodeType.ElementData("example", new Map([["key", "value"]])))
  ).not.toThrow();
});
