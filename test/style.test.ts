import { StyledNode } from "../src/style";
import { CssValue, Unit } from "../src/css";
import { DomNode } from "../src/dom";

test("styled node", () => {
  expect(
    new StyledNode(new DomNode(), new Map([["1", new CssValue.Length(1, Unit.Px)]]), []).children
  ).toEqual([]);
});
