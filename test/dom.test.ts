import { DomNode, NodeType } from "../src/dom";
test("node", () => {
  expect(() => new DomNode([], new NodeType.Text("no mean"))).not.toThrow();
});
