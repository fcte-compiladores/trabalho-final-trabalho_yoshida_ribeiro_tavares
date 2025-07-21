class RuntimeError extends Error {
  constructor(token, message) {
    super(message);
    this.token = token;
    this.name = "RuntimeError";
  }

  toString() {
    return `${this.message}\n[linha ${this.token.line}]`;
  }
}

export default RuntimeError;
