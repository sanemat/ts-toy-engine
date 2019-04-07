import { Color } from "../src/css";

test("a", () => {
  expect(new Color(0, 0, 0, 255).a).toEqual(255);
});
