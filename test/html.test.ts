import { Parser } from "../src/html";

test("#nextChar 1", () => {
  const currentParser = new Parser(0, "12abcあいう");
  expect(currentParser.nextChar()).toEqual("2");
});

test("#nextChar 2", () => {
  const currentParser = new Parser(5, "12abcあいう");
  expect(currentParser.nextChar()).toEqual("い");
});

test("startsWidth 1", () => {
  const currentParser = new Parser(0, "bananas");
  expect(currentParser.startsWith("bana")).toBeTruthy();
});

test("startsWidth 2", () => {
  const currentParser = new Parser(0, "bananas");
  expect(currentParser.startsWith("nana")).toBeFalsy();
});

test("startsWidth 3", () => {
  const currentParser = new Parser(2, "bananas");
  expect(currentParser.startsWith("nana")).toBeTruthy();
});

test("eof 1", () => {
  const currentParser = new Parser(0, "a");
  expect(currentParser.eof()).toBeFalsy();
});

test("eof 2", () => {
  const currentParser = new Parser(1, "a");
  expect(currentParser.eof()).toBeTruthy();
});

test("cousume char", () => {
  const currentParser = new Parser(2, "bananas");
  const target = currentParser.consumeChar();
  expect(target).toEqual("n");
  expect(currentParser).toEqual(new Parser(3, "bananas"));
});

test("consume while 1", () => {
  const currentParser = new Parser(2, "bananas");
  const returnFalse = () => {
    return false;
  };
  expect(currentParser.consumeWhile(returnFalse)).toEqual("");
});
