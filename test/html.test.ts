import { htmlParse, HtmlParser } from "../src/html";
import { elem, text } from "../src/dom";

test("#nextChar 1", () => {
  const currentParser = new HtmlParser(0, "12abcあいう");
  expect(currentParser.nextChar()).toEqual("1");
});

test("#nextChar 2", () => {
  const currentParser = new HtmlParser(5, "12abcあいう");
  expect(currentParser.nextChar()).toEqual("あ");
});

test("startsWidth 1", () => {
  const currentParser = new HtmlParser(0, "bananas");
  expect(currentParser.startsWith("bana")).toBeTruthy();
});

test("startsWidth 2", () => {
  const currentParser = new HtmlParser(0, "bananas");
  expect(currentParser.startsWith("nana")).toBeFalsy();
});

test("startsWidth 3", () => {
  const currentParser = new HtmlParser(2, "bananas");
  expect(currentParser.startsWith("nana")).toBeTruthy();
});

test("eof 1", () => {
  const currentParser = new HtmlParser(0, "a");
  expect(currentParser.eof()).toBeFalsy();
});

test("eof 2", () => {
  const currentParser = new HtmlParser(1, "a");
  expect(currentParser.eof()).toBeTruthy();
});

test("cousume char", () => {
  const currentParser = new HtmlParser(2, "bananas");
  const target = currentParser.consumeChar();
  expect(target).toEqual("n");
  expect(currentParser).toEqual(new HtmlParser(3, "bananas"));
});

test("consume while 1", () => {
  const currentParser = new HtmlParser(2, "bananas");
  const returnFalse = () => {
    return false;
  };
  expect(currentParser.consumeWhile(returnFalse)).toEqual("");
  expect(currentParser).toEqual(new HtmlParser(2, "bananas"));
});

test("consume while 2", () => {
  const currentParser = new HtmlParser(2, "bananas");
  const returnTrue = () => {
    return true;
  };
  expect(currentParser.consumeWhile(returnTrue)).toEqual("nanas");
  expect(currentParser).toEqual(new HtmlParser(7, "bananas"));
});

test("consume while 3", () => {
  const currentParser = new HtmlParser(2, "bananas");
  const returnAN = (s: string) => {
    return s === "a" || s === "n";
  };
  expect(currentParser.consumeWhile(returnAN)).toEqual("nana");
  expect(currentParser).toEqual(new HtmlParser(6, "bananas"));
});

test("consume whitespace 1", () => {
  const currentParser = new HtmlParser(2, "bananas");
  expect(currentParser.consumeWhitespace()).toEqual("");
  expect(currentParser).toEqual(new HtmlParser(2, "bananas"));
});

test("consume whitespace 2", () => {
  const currentParser = new HtmlParser(2, "ba  n anas");
  expect(currentParser.consumeWhitespace()).toEqual("  ");
  expect(currentParser).toEqual(new HtmlParser(4, "ba  n anas"));
});

test("parse tag name 1", () => {
  const currentParser = new HtmlParser(2, "bananas apples");
  expect(currentParser.parseTagName()).toEqual("nanas");
  expect(currentParser).toEqual(new HtmlParser(7, "bananas apples"));
});

test("parse text 1", () => {
  const currentParser = new HtmlParser(5, "<div>bananas apples</div>");
  expect(currentParser.parseText()).toEqual(text("bananas apples"));
  expect(currentParser).toEqual(new HtmlParser(19, "<div>bananas apples</div>"));
});

test("parse attr value 1", () => {
  const currentParser = new HtmlParser(11, "<div class='foo'>bananas</div>");
  expect(currentParser.parseAttrValue()).toEqual("foo");
  expect(currentParser).toEqual(new HtmlParser(16, "<div class='foo'>bananas</div>"));
});

test("parse attr value 2", () => {
  const currentParser = new HtmlParser(11, `<div class="foo">bananas</div>`);
  expect(currentParser.parseAttrValue()).toEqual("foo");
  expect(currentParser).toEqual(new HtmlParser(16, `<div class="foo">bananas</div>`));
});

test("parse attr value 3", () => {
  const currentParser = new HtmlParser(11, `<div class="foo`);
  expect(() => {
    currentParser.parseAttrValue();
  }).toThrow();
});

test("parse attr 1", () => {
  const currentParser = new HtmlParser(5, `<div class="foo">bananas</div>`);
  expect(currentParser.parseAttr()).toEqual(["class", "foo"]);
  expect(currentParser).toEqual(new HtmlParser(16, `<div class="foo">bananas</div>`));
});

test("parse attr 2", () => {
  const currentParser = new HtmlParser(5, `<div class ="foo">bananas</div>`);
  expect(() => {
    currentParser.parseAttr();
  }).toThrow();
});

test("parse attributes 1", () => {
  const currentParser = new HtmlParser(5, `<div foo="foo1" bar="bar2">bananas</div>`);
  expect(currentParser.parseAttributes()).toEqual(new Map([["foo", "foo1"], ["bar", "bar2"]]));
  expect(currentParser).toEqual(new HtmlParser(26, `<div foo="foo1" bar="bar2">bananas</div>`));
});

test("parse element 1", () => {
  const currentParser = new HtmlParser(0, `<div foo="foo1" bar="bar2">bananas</div>`);
  expect(currentParser.parseElement()).toEqual(
    elem("div", new Map([["foo", "foo1"], ["bar", "bar2"]]), [text("bananas")])
  );
  expect(currentParser).toEqual(new HtmlParser(40, `<div foo="foo1" bar="bar2">bananas</div>`));
});

test("parse element 2", () => {
  const currentParser = new HtmlParser(5, `<div foo="foo1" bar="bar2">bananas</div>`);
  expect(() => {
    currentParser.parseElement();
  }).toThrow();
});

test("parse element 3", () => {
  const currentParser = new HtmlParser(0, `<div foo="foo1" bar="bar2" bananas</div>`);
  expect(() => {
    currentParser.parseElement();
  }).toThrow();
});

test("parse element 4", () => {
  const currentParser = new HtmlParser(0, `<div foo="foo1" bar="bar2"> bananas`);
  expect(() => {
    currentParser.parseElement();
  }).toThrow();
});

test("parse element 5", () => {
  const currentParser = new HtmlParser(0, `<div foo="foo1" bar="bar2">bananas<div>`);
  expect(() => {
    currentParser.parseElement();
  }).toThrow();
});

test("parse element 6", () => {
  const currentParser = new HtmlParser(0, `<div foo="foo1" bar="bar2">bananas</foo>`);
  expect(() => {
    currentParser.parseElement();
  }).toThrow();
});

test("parse element 7", () => {
  const currentParser = new HtmlParser(0, `<div foo="foo1" bar="bar2">bananas</div`);
  expect(() => {
    currentParser.parseElement();
  }).toThrow();
});

test("parse node 1", () => {
  const currentParser = new HtmlParser(5, "<div>bananas apples</div>");
  expect(currentParser.parseNode()).toEqual(text("bananas apples"));
  expect(currentParser).toEqual(new HtmlParser(19, "<div>bananas apples</div>"));
});

test("parse node 2", () => {
  const currentParser = new HtmlParser(0, `<div foo="foo1" bar="bar2">bananas</div>`);
  expect(currentParser.parseNode()).toEqual(
    elem("div", new Map([["foo", "foo1"], ["bar", "bar2"]]), [text("bananas")])
  );
  expect(currentParser).toEqual(new HtmlParser(40, `<div foo="foo1" bar="bar2">bananas</div>`));
});

test("parse nodes 1", () => {
  const currentParser = new HtmlParser(5, "<div>bananas apples</div>");
  expect(currentParser.parseNodes()).toEqual([text("bananas apples")]);
  expect(currentParser).toEqual(new HtmlParser(19, "<div>bananas apples</div>"));
});

test("parse nodes 2", () => {
  const currentParser = new HtmlParser(
    0,
    `<div foo="foo1" bar="bar2">bananas <div moo="moo3">apples</div></div>`
  );
  expect(currentParser.parseNodes()).toEqual([
    elem("div", new Map([["foo", "foo1"], ["bar", "bar2"]]), [
      text("bananas "),
      elem("div", new Map([["moo", "moo3"]]), [text("apples")])
    ])
  ]);
  expect(currentParser).toEqual(
    new HtmlParser(69, `<div foo="foo1" bar="bar2">bananas <div moo="moo3">apples</div></div>`)
  );
});

test("htmlParse 1", () => {
  const html = `<html><body></body></html>`;
  expect(htmlParse(html)).toEqual(elem("html", new Map([]), [elem("body", new Map([]), [])]));
});

test("htmlParse 2", () => {
  const html = `<div>bananas apples</div> <div>oranges</div>`;
  expect(htmlParse(html)).toEqual(
    elem("html", new Map([]), [
      elem("div", new Map(), [text("bananas apples")]),
      elem("div", new Map(), [text("oranges")])
    ])
  );
});
