import { StyledNode } from "../src/style";
import { Length, Unit } from "../src/css";
import { Node } from "../src/dom";

test("styled node", () => {
  expect(new StyledNode(new Node(), new Map([["1", new Length(1, Unit.Px)]]), []).children).toEqual(
    []
  );
});
