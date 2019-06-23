import { Parser } from "../src/html";

test("#nextChar 1", () => {
  const currentParser = new Parser(0, "12abcあいう");
  expect(currentParser.nextChar()).toEqual("2");
});

test("#nextChar 2", () => {
  const currentParser = new Parser(5, "12abcあいう");
  expect(currentParser.nextChar()).toEqual("い");
});
