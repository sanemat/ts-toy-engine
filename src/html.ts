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
}
