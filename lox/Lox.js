import Scanner from "./Scanner.js";
import Parser from "./Parser.js";

export function parse(tokens) {
  const parser = new Parser(tokens);
  return parser.parse();
}

export function parseExpression(tokens) {
  const parser = new Parser(tokens);
  return parser.expression();
}