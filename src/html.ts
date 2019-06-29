export class Parser {
  pos: number;
  input: string;
  constructor(pos: number, input: string) {
    this.pos = pos;
    this.input = input;
  }

  // Read the current character without consuming it.
  nextChar(): string {
    return this.input[this.pos + 1];
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
    return "a";
  }
}
