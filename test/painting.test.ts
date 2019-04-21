import { Canvas, DisplayCommandFormat, SolidColor } from "../src/painting";
import { Color } from "../src/css";
import { Rect } from "../src/layout";

test("canvas pixels length", () => {
  const canvas = Canvas.Create(2, 3);
  expect(canvas.pixels.length).toEqual(6);
});

const white = new Color(255, 255, 255, 255);
const black = new Color(0, 0, 0, 255);
test("canvas is filled by white", () => {
  const canvas = Canvas.Create(2, 3);

  expect(canvas.pixels).toEqual([white, white, white, white, white, white]);
});

test("solid color", () => {
  expect(new SolidColor(white, new Rect(0, 0, 0, 0)).format).toEqual(
    DisplayCommandFormat.SolidColor
  );
});

test("canvas paint item", () => {
  const canvas = Canvas.Create(2, 3);
  canvas.paintItem(new SolidColor(black, new Rect(0, 0, 0, 0)));
  expect(canvas.pixels).toEqual([black, white, white, white, white, white]);
});
