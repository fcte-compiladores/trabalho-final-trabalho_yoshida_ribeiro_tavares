class ParseError extends Error {
  constructor(token, message) {
    super(message);
    this.token = token;
    this.name = "ParseError";
  }
}

export default ParseError;