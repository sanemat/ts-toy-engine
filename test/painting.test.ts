import { Canvas } from "../src/painting";
import { Color } from "../src/css";

test("canvas pixels length", () => {
  const canvas = Canvas.Create(2, 3);
  expect(canvas.pixels.length).toEqual(6);
});

test("canvas is filled by white", () => {
  const canvas = Canvas.Create(2, 3);
  const white = new Color(255, 255, 255, 255);

  expect(canvas.pixels).toEqual([white, white, white, white, white, white]);
});
