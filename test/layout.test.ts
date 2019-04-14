import { Dimensions, EdgeSizes, Rect } from "../src/layout";

test("rect", () => {
  expect(new Rect(1, 2, 3, 4).height).toBe(4);
});

test("edge sizes", () => {
  expect(new EdgeSizes(1, 2, 3, 4).bottom).toBe(4);
});

test("dimensions", () => {
  const target = new Rect(1, 2, 3, 4);
  const edge = new EdgeSizes(1, 2, 3, 4);
  expect(new Dimensions(target, edge, edge, edge).content).toEqual(target);
});
