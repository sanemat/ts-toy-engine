import { Node } from "../src/dom";
test("node", () => {
  expect(() => new Node()).not.toThrow();
});
