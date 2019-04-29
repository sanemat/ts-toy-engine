import {
  buildDisplayList,
  Canvas,
  DisplayCommand,
  getColor,
  paint,
  renderBackground,
  renderBorders,
  renderLayoutBox
} from "../src/painting";
import { Color, CssValue } from "../src/css";
import { BoxType, Dimensions, EdgeSizes, LayoutBox, Rect } from "../src/layout";
import { StyledNode } from "../src/style";
import { DomNode } from "../src/dom";

test("canvas pixels length", () => {
  const canvas = Canvas.Create(2, 3);
  expect(canvas.pixels.length).toEqual(6);
});

const white = new Color(255, 255, 255, 255);
const black = new Color(0, 0, 0, 255);
const blue = new Color(0, 0, 255, 255);
const red = new Color(255, 0, 0, 255);
const green = new Color(0, 255, 0, 255);

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
  canvas.paintItem(new DisplayCommand.SolidColor(black, new Rect(0, 0, 1, 1)));
  expect(canvas.pixels).toEqual([black, white, white, white, white, white]);
});

test("get color", () => {
  const expectedColor = new Color(255, 255, 255, 255);
  expect(
    getColor(
      LayoutBox.Create(
        new BoxType.BlockNode(
          new StyledNode(
            new DomNode(),
            new Map([["target", new CssValue.ColorValue(expectedColor)]]),
            []
          )
        )
      ),
      "target"
    )
  ).toEqual(expectedColor);
});

test("get no color", () => {
  expect(
    getColor(
      LayoutBox.Create(new BoxType.BlockNode(new StyledNode(new DomNode(), new Map([]), []))),
      "target"
    )
  ).toEqual(null);
});

test("get no color2", () => {
  expect(getColor(LayoutBox.Create(new BoxType.AnonymousBlock()), "target")).toEqual(null);
});

test("get no color3", () => {
  const notColor = new CssValue.Keyword("example");
  expect(
    getColor(
      LayoutBox.Create(
        new BoxType.BlockNode(new StyledNode(new DomNode(), new Map([["target", notColor]]), []))
      ),
      "target"
    )
  ).toEqual(null);
});

const exampleDimensions = new Dimensions(
  new Rect(20, 30, 5, 5),
  new EdgeSizes(2, 3, 4, 5),
  new EdgeSizes(2, 3, 4, 5),
  new EdgeSizes(2, 3, 4, 5)
);

test("render background with color", () => {
  const displayList: DisplayCommand[] = [];
  renderBackground(
    displayList,
    new LayoutBox(
      exampleDimensions,
      new BoxType.BlockNode(
        new StyledNode(
          new DomNode(),
          new Map([["background", new CssValue.ColorValue(new Color(0, 0, 0, 0))]]),
          []
        )
      ),
      []
    )
  );
  expect(displayList[0]).toEqual(
    new DisplayCommand.SolidColor(new Color(0, 0, 0, 0), new Rect(16, 22, 15, 23))
  );
});

test("render background no color", () => {
  const displayList: DisplayCommand[] = [];
  renderBackground(
    displayList,
    LayoutBox.Create(new BoxType.BlockNode(new StyledNode(new DomNode(), new Map(), [])))
  );
  expect(displayList.length).toEqual(0);
});

test("render border no border", () => {
  const displayList: DisplayCommand[] = [];
  renderBorders(
    displayList,
    LayoutBox.Create(new BoxType.BlockNode(new StyledNode(new DomNode(), new Map(), [])))
  );
  expect(displayList.length).toEqual(0);
});

test("render border with color", () => {
  const displayList: DisplayCommand[] = [];
  renderBorders(
    displayList,
    new LayoutBox(
      exampleDimensions,
      new BoxType.BlockNode(
        new StyledNode(
          new DomNode(),
          new Map([["border-color", new CssValue.ColorValue(black)]]),
          []
        )
      ),
      []
    )
  );
  expect(displayList).toEqual([
    // left
    new DisplayCommand.SolidColor(black, new Rect(16, 22, 2, 23)),
    // right
    new DisplayCommand.SolidColor(black, new Rect(28, 22, 3, 23)),
    // top
    new DisplayCommand.SolidColor(black, new Rect(16, 22, 15, 4)),
    // bottom
    new DisplayCommand.SolidColor(black, new Rect(16, 40, 15, 5))
  ]);
});

test("render layout box", () => {
  const displayList: DisplayCommand[] = [];
  renderLayoutBox(
    displayList,
    new LayoutBox(
      exampleDimensions,
      new BoxType.BlockNode(
        new StyledNode(
          new DomNode(),
          new Map([
            ["border-color", new CssValue.ColorValue(black)],
            ["background", new CssValue.ColorValue(blue)]
          ]),
          []
        )
      ),
      []
    )
  );
  expect(displayList).toEqual([
    // background
    new DisplayCommand.SolidColor(blue, new Rect(16, 22, 15, 23)),
    // left
    new DisplayCommand.SolidColor(black, new Rect(16, 22, 2, 23)),
    // right
    new DisplayCommand.SolidColor(black, new Rect(28, 22, 3, 23)),
    // top
    new DisplayCommand.SolidColor(black, new Rect(16, 22, 15, 4)),
    // bottom
    new DisplayCommand.SolidColor(black, new Rect(16, 40, 15, 5))
  ]);
});

test("render layout box children", () => {
  const displayList: DisplayCommand[] = [];
  renderLayoutBox(
    displayList,
    new LayoutBox(
      exampleDimensions,
      new BoxType.BlockNode(
        new StyledNode(
          new DomNode(),
          new Map([
            ["border-color", new CssValue.ColorValue(black)],
            ["background", new CssValue.ColorValue(blue)]
          ]),
          []
        )
      ),
      [
        new LayoutBox(
          new Dimensions(
            new Rect(22, 32, 1, 1),
            new EdgeSizes(0, 0, 0, 0),
            new EdgeSizes(0, 0, 0, 0),
            new EdgeSizes(0, 0, 0, 0)
          ),
          new BoxType.BlockNode(
            new StyledNode(
              new DomNode(),
              new Map([
                ["border-color", new CssValue.ColorValue(red)],
                ["background", new CssValue.ColorValue(green)]
              ]),
              []
            )
          ),
          []
        )
      ]
    )
  );
  expect(displayList).toEqual([
    // background
    new DisplayCommand.SolidColor(blue, new Rect(16, 22, 15, 23)),
    // left
    new DisplayCommand.SolidColor(black, new Rect(16, 22, 2, 23)),
    // right
    new DisplayCommand.SolidColor(black, new Rect(28, 22, 3, 23)),
    // top
    new DisplayCommand.SolidColor(black, new Rect(16, 22, 15, 4)),
    // bottom
    new DisplayCommand.SolidColor(black, new Rect(16, 40, 15, 5)),
    // children background
    new DisplayCommand.SolidColor(green, new Rect(22, 32, 1, 1)),
    // children left
    new DisplayCommand.SolidColor(red, new Rect(22, 32, 0, 1)),
    // children right
    new DisplayCommand.SolidColor(red, new Rect(23, 32, 0, 1)),
    // children top
    new DisplayCommand.SolidColor(red, new Rect(22, 32, 1, 0)),
    // children bottom
    new DisplayCommand.SolidColor(red, new Rect(22, 33, 1, 0))
  ]);
});

test("build display list", () => {
  expect(
    buildDisplayList(
      new LayoutBox(
        exampleDimensions,
        new BoxType.BlockNode(
          new StyledNode(
            new DomNode(),
            new Map([
              ["border-color", new CssValue.ColorValue(black)],
              ["background", new CssValue.ColorValue(blue)]
            ]),
            []
          )
        ),
        []
      )
    )
  ).toEqual([
    // background
    new DisplayCommand.SolidColor(blue, new Rect(16, 22, 15, 23)),
    // left
    new DisplayCommand.SolidColor(black, new Rect(16, 22, 2, 23)),
    // right
    new DisplayCommand.SolidColor(black, new Rect(28, 22, 3, 23)),
    // top
    new DisplayCommand.SolidColor(black, new Rect(16, 22, 15, 4)),
    // bottom
    new DisplayCommand.SolidColor(black, new Rect(16, 40, 15, 5))
  ]);
});

test("build display list2", () => {
  expect(
    buildDisplayList(
      new LayoutBox(
        new Dimensions(
          new Rect(3, 3, 2, 1),
          new EdgeSizes(1, 1, 1, 1),
          new EdgeSizes(1, 1, 1, 1),
          new EdgeSizes(1, 1, 1, 1)
        ),
        new BoxType.BlockNode(
          new StyledNode(
            new DomNode(),
            new Map([
              ["border-color", new CssValue.ColorValue(red)],
              ["background", new CssValue.ColorValue(green)]
            ]),
            []
          )
        ),
        []
      )
    )
  ).toEqual([
    // background
    new DisplayCommand.SolidColor(green, new Rect(1, 1, 6, 5)),
    // left
    new DisplayCommand.SolidColor(red, new Rect(1, 1, 1, 5)),
    // right
    new DisplayCommand.SolidColor(red, new Rect(6, 1, 1, 5)),
    // top
    new DisplayCommand.SolidColor(red, new Rect(1, 1, 6, 1)),
    // bottom
    new DisplayCommand.SolidColor(red, new Rect(1, 5, 6, 1))
  ]);
});

test("display list override color", () => {
  const canvas = Canvas.Create(3, 2);
  const list: DisplayCommand[] = [
    new DisplayCommand.SolidColor(green, new Rect(0, 0, 2, 1)),
    new DisplayCommand.SolidColor(red, new Rect(1, 0, 1, 1))
  ];
  for (let item of list) {
    canvas.paintItem(item);
  }
  expect(canvas).toEqual(new Canvas([green, red, white].concat([white, white, white]), 3, 2));
});

test("display list layout", () => {
  const canvas = Canvas.Create(8, 7);
  const list: DisplayCommand[] = [
    // background
    new DisplayCommand.SolidColor(green, new Rect(1, 1, 6, 5)),
    // left
    new DisplayCommand.SolidColor(red, new Rect(1, 1, 1, 5)),
    // right
    new DisplayCommand.SolidColor(red, new Rect(6, 1, 1, 5)),
    // top
    new DisplayCommand.SolidColor(red, new Rect(1, 1, 6, 1)),
    // bottom
    new DisplayCommand.SolidColor(red, new Rect(1, 5, 6, 1))
  ];
  for (let item of list) {
    canvas.paintItem(item);
  }
  expect(canvas).toEqual(
    new Canvas(
      [white, white, white, white, white, white, white, white]
        .concat([white, red, red, red, red, red, red, white])
        .concat([white, red, green, green, green, green, red, white])
        .concat([white, red, green, green, green, green, red, white])
        .concat([white, red, green, green, green, green, red, white])
        .concat([white, red, red, red, red, red, red, white])
        .concat([white, white, white, white, white, white, white, white]),
      8,
      7
    )
  );
});

test("paint", () => {
  expect(
    paint(
      new LayoutBox(
        new Dimensions(
          new Rect(3, 3, 2, 1),
          new EdgeSizes(1, 1, 1, 1),
          new EdgeSizes(1, 1, 1, 1),
          new EdgeSizes(1, 1, 1, 1)
        ),
        new BoxType.BlockNode(
          new StyledNode(
            new DomNode(),
            new Map([
              ["border-color", new CssValue.ColorValue(red)],
              ["background", new CssValue.ColorValue(green)]
            ]),
            []
          )
        ),
        []
      ),
      new Rect(0, 0, 8, 7)
    )
  ).toEqual(
    new Canvas(
      [white, white, white, white, white, white, white, white]
        .concat([white, red, red, red, red, red, red, white])
        .concat([white, red, green, green, green, green, red, white])
        .concat([white, red, green, green, green, green, red, white])
        .concat([white, red, green, green, green, green, red, white])
        .concat([white, red, red, red, red, red, red, white])
        .concat([white, white, white, white, white, white, white, white]),
      8,
      7
    )
  );
});
