import { DomNode, ElementData, NodeType, text } from "../src/dom";
test("node", () => {
  expect(() => new DomNode([], new NodeType.Text("no mean"))).not.toThrow();
});

test("node type text", () => {
  expect(() => new NodeType.Text("no mean")).not.toThrow();
});

test("node type element", () => {
  expect(() => new NodeType.Element(new ElementData("no mean", new Map([])))).not.toThrow();
});

test("text", () => {
  expect(text("target")).toEqual(new DomNode([], new NodeType.Text("target")));
});
