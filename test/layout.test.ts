import { Rect } from "../src/layout";

test("rect", () => {
  expect(new Rect(1, 2, 3, 4).height).toBe(4);
});
