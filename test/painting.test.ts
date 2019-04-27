import { Canvas, DisplayCommand, getColor } from "../src/painting";
import { Color, CssValue } from "../src/css";
import { BoxType, LayoutBox, Rect } from "../src/layout";
import { StyledNode } from "../src/style";
import { DomNode, NodeType } from "../src/dom";

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
  expect(new DisplayCommand.SolidColor(white, new Rect(0, 0, 0, 0)).format).toEqual(
    DisplayCommand.Format.SolidColor
  );
});

test("canvas paint item", () => {
  const canvas = Canvas.Create(2, 3);
  canvas.paintItem(new DisplayCommand.SolidColor(black, new Rect(0, 0, 0, 0)));
  expect(canvas.pixels).toEqual([black, white, white, white, white, white]);
});

test("get color", () => {
  const expectedColor = new Color(255, 255, 255, 255);
  expect(
    getColor(
      LayoutBox.Create(
        new BoxType.BlockNode(
          new StyledNode(
            new DomNode([], new NodeType.Text("text")),
            new Map([["example", new CssValue.ColorValue(expectedColor)]]),
            []
          )
        )
      ),
      "example"
    )
  ).toEqual(expectedColor);
});

test("get no color", () => {
  expect(
    getColor(
      LayoutBox.Create(
        new BoxType.BlockNode(
          new StyledNode(new DomNode([], new NodeType.Text("example")), new Map([]), [])
        )
      ),
      "example"
    )
  ).toEqual(null);
});

test("get no color2", () => {
  expect(getColor(LayoutBox.Create(new BoxType.AnonymousBlock()), "example")).toEqual(null);
});

test("get no color3", () => {
  expect(
    getColor(
      LayoutBox.Create(
        new BoxType.BlockNode(
          new StyledNode(
            new DomNode([], new NodeType.Text("example")),
            new Map([["example", new CssValue.Keyword("example")]]),
            []
          )
        )
      ),
      "example"
    )
  ).toEqual(null);
});
