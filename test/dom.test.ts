import { DomNode, elem, ElementData, NodeType, text } from "../src/dom";
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

test("elem", () => {
  expect(elem("a", new Map([["b", "c"]]), [])).toEqual(
    new DomNode([], new NodeType.Element(new ElementData("a", new Map([["b", "c"]]))))
  );
});

test("element id found", () => {
  expect(new ElementData("no mean", new Map([["id", "target"]])).id()).toEqual("target");
});

test("element id not found", () => {
  expect(new ElementData("no mean", new Map([["no mean", "no mean"]])).id()).toBeNull();
});

test("element class 1 found", () => {
  expect(new ElementData("no mean", new Map([["class", "target1"]])).classes()).toEqual(
    new Set(["target1"])
  );
});

test("element class 2 found", () => {
  expect(new ElementData("no mean", new Map([["class", "target1 target2"]])).classes()).toEqual(
    new Set(["target1", "target2"])
  );
});

test("element class 0 found", () => {
  expect(new ElementData("no mean", new Map([])).classes()).toEqual(new Set([]));
});
