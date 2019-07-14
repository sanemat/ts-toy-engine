import { AttrMap, DomNode, elem, text } from "./dom";
import * as assert from "assert";

const isWhitespace = require("is-whitespace-character");
export class Parser {
  pos: number;
  input: string;
  constructor(pos: number, input: string) {
    this.pos = pos;
    this.input = input;
  }

  // Read the current character without consuming it.
  nextChar(): string {
    return this.input[this.pos];
  }

  // Do the next characters start with the given string?
  startsWith(s: string): boolean {
    return this.input.slice(this.pos).startsWith(s);
  }

  // Return true if all input is consumed.
  eof(): boolean {
    return this.input.length <= this.pos;
  }

  // Return the current character, and advance this.pos to the next character.
  consumeChar(): string {
    const currentPos = this.pos;
    this.pos += 1;
    return this.input[currentPos];
  }

  // Consume characters until `test` returns false.
  consumeWhile(test: Function): string {
    let result = "";
    while (!this.eof() && test(this.nextChar())) {
      result += this.consumeChar();
    }
    return result;
  }

  consumeWhitespace(): string {
    return this.consumeWhile(isWhitespace);
  }

  parseTagName(): string {
    return this.consumeWhile((s: string) => {
      return /[0-9a-zA-Z]/.test(s);
    });
  }

  parseText(): DomNode {
    return text(
      this.consumeWhile((s: string) => {
        return s !== "<";
      })
    );
  }

  // Parse a quoted value.
  parseAttrValue(): string {
    const openQuote = this.consumeChar();
    assert(openQuote === "'" || openQuote === '"');
    const value = this.consumeWhile((s: string) => {
      return s !== openQuote;
    });
    assert(this.consumeChar() === openQuote);
    return value;
  }

  // Parse a single name="value" pair.
  parseAttr(): [string, string] {
    const name = this.parseTagName();
    assert(this.consumeChar() === "=");
    const value = this.parseAttrValue();
    return [name, value];
  }

  // Parse a list of name="value" pairs, separated by whitespace.
  parseAttributes(): AttrMap {
    const attributes = new Map<string, string>();
    while (true) {
      this.consumeWhitespace();
      if (this.nextChar() === ">") {
        break;
      }
      const [name, value] = this.parseAttr();
      attributes.set(name, value);
    }
    return attributes;
  }

  // Parse a single element, including its open tag, contents, and closing tag.
  parseElement(): DomNode {
    // opening tag
    assert(this.consumeChar() === "<");
    const tagName = this.parseTagName();
    const attributes = this.parseAttributes();
    assert(this.consumeChar() === ">");

    // contents
    const children = this.parseNodes();

    // closing tag
    assert(this.consumeChar() === "<");
    assert(this.consumeChar() === "/");
    assert(this.parseTagName() === tagName);
    assert(this.consumeChar() === ">");
    return elem(tagName, attributes, children);
  }

  // Parse a single node.
  parseNode(): DomNode {
    switch (this.nextChar()) {
      case "<":
        return this.parseElement();
      default:
        return this.parseText();
    }
  }

  // Parse a sequence of sibling nodes.
  parseNodes(): DomNode[] {
    const nodes: DomNode[] = [];
    while (true) {
      this.consumeWhitespace();
      if (this.eof() || this.startsWith("</")) {
        break;
      }
      nodes.push(this.parseNode());
    }
    return nodes;
  }
}
