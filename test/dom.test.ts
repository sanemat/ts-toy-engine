import { DomNode } from "../src/dom";
test("node", () => {
  expect(() => new DomNode()).not.toThrow();
});
