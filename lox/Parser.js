import TokenType from "./TokenType.js";
import {
  Binary,
  Grouping,
  Literal,
  Unary,
  Variable,
  Assign,
  Logical,
  Call,
  Get,
  Set,
  This,
  Super
} from "./Expr.js";
import {
  Expression,
  Print,
  Var,
  Block,
  If,
  While,
  Function,
  Return,
  Class
} from "./Stmt.js";
import ParseError from "./ParserError.js";

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse() {
    const statements = [];
    while (!this.isAtEnd()) {
      const stmt = this.declaration();
      if (stmt !== null) {
        statements.push(stmt);
      }
    }
    return statements;
  }

  parseExpression() {
    try {
      return this.expression();
    } catch (error) {
      return null;
    }
  }

  declaration() {
    try {
      if (this.match(TokenType.CLASS)) return this.classDeclaration();
      if (this.match(TokenType.FUN)) return this.function("função");
      if (this.match(TokenType.VAR)) return this.varDeclaration();
      return this.statement();
    } catch (error) {
      if (error instanceof ParseError) {
        this.synchronize();
        return null;
      }
      throw error;
    }
  }

  classDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Esperado nome da classe.");
    
    let superclass = null;
    if (this.match(TokenType.LESS)) {
      this.consume(TokenType.IDENTIFIER, "Esperado nome da superclasse.");
      superclass = new Variable(this.previous());
    }

    this.consume(TokenType.LEFT_BRACE, "Esperado '{' antes do corpo da classe.");

    const methods = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      methods.push(this.function("método"));
    }

    this.consume(TokenType.RIGHT_BRACE, "Esperado '}' após o corpo da classe.");
    return new Class(name, superclass, methods);
  }

  function(kind) {
    const name = this.consume(TokenType.IDENTIFIER, `Esperado nome da ${kind}.`);
    this.consume(TokenType.LEFT_PAREN, `Esperado '(' após o nome da ${kind}.`);
    
    const parameters = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (parameters.length >= 255) {
          this.error(this.peek(), "Não é possível ter mais de 255 parâmetros.");
        }
        parameters.push(this.consume(TokenType.IDENTIFIER, "Esperado nome do parâmetro."));
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RIGHT_PAREN, "Esperado ')' após os parâmetros.");
    this.consume(TokenType.LEFT_BRACE, `Esperado '{' antes do corpo da ${kind}.`);
    
    const body = this.block();
    return new Function(name, parameters, body);
  }

  varDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Esperado nome da variável.");
    
    let initializer = null;
    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
    }
    
    this.consume(TokenType.SEMICOLON, "Esperado ';' após a declaração da variável.");
    return new Var(name, initializer);
  }

  statement() {
    if (this.match(TokenType.FOR)) return this.forStatement();
    if (this.match(TokenType.IF)) return this.ifStatement();
    if (this.match(TokenType.PRINT)) return this.printStatement();
    if (this.match(TokenType.RETURN)) return this.returnStatement();
    if (this.match(TokenType.WHILE)) return this.whileStatement();
    if (this.match(TokenType.LEFT_BRACE)) return new Block(this.block());
    return this.expressionStatement();
  }

  forStatement() {
    this.consume(TokenType.LEFT_PAREN, "Esperado '(' após 'for'.");
    
    let initializer;
    if (this.match(TokenType.SEMICOLON)) {
      initializer = null;
    } else if (this.match(TokenType.VAR)) {
      initializer = this.varDeclaration();
    } else {
      initializer = this.expressionStatement();
    }

    let condition = null;
    if (!this.check(TokenType.SEMICOLON)) {
      condition = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Esperado ';' após a condição do loop.");

    let increment = null;
    if (!this.check(TokenType.RIGHT_PAREN)) {
      increment = this.expression();
    }
    this.consume(TokenType.RIGHT_PAREN, "Esperado ')' após as cláusulas do for.");

    let body = this.statement();

    if (increment !== null) {
      body = new Block([body, new Expression(increment)]);
    }

    if (condition === null) condition = new Literal(true);
    body = new While(condition, body);

    if (initializer !== null) {
      body = new Block([initializer, body]);
    }

    return body;
  }

  ifStatement() {
    this.consume(TokenType.LEFT_PAREN, "Esperado '(' após 'if'.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Esperado ')' após a condição do if.");

    const thenBranch = this.statement();
    let elseBranch = null;
    if (this.match(TokenType.ELSE)) {
      elseBranch = this.statement();
    }

    return new If(condition, thenBranch, elseBranch);
  }

  printStatement() {
    const value = this.expression();
    this.consume(TokenType.SEMICOLON, "Esperado ';' após o valor.");
    return new Print(value);
  }

  returnStatement() {
    const keyword = this.previous();
    let value = null;
    if (!this.check(TokenType.SEMICOLON)) {
      value = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Esperado ';' após o valor de retorno.");
    return new Return(keyword, value);
  }

  whileStatement() {
    this.consume(TokenType.LEFT_PAREN, "Esperado '(' após 'while'.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Esperado ')' após a condição.");
    const body = this.statement();

    return new While(condition, body);
  }

  block() {
    const statements = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration());
    }

    this.consume(TokenType.RIGHT_BRACE, "Esperado '}' após o bloco.");
    return statements;
  }

  expressionStatement() {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Esperado ';' após a expressão.");
    return new Expression(expr);
  }

  expression() {
    return this.assignment();
  }

  assignment() {
    const expr = this.or();

    if (this.match(TokenType.EQUAL)) {
      const equals = this.previous();
      const value = this.assignment();

      if (expr instanceof Variable) {
        const name = expr.name;
        return new Assign(name, value);
      } else if (expr instanceof Get) {
        return new Set(expr.object, expr.name, value);
      }

      this.error(equals, "Alvo de atribuição inválido.");
    }

    return expr;
  }

  or() {
    let expr = this.and();

    while (this.match(TokenType.OR)) {
      const operator = this.previous();
      const right = this.and();
      expr = new Logical(expr, operator, right);
    }

    return expr;
  }

  and() {
    let expr = this.equality();

    while (this.match(TokenType.AND)) {
      const operator = this.previous();
      const right = this.equality();
      expr = new Logical(expr, operator, right);
    }

    return expr;
  }

  equality() {
    let expr = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  comparison() {
    let expr = this.term();

    while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
      const operator = this.previous();
      const right = this.term();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  term() {
    let expr = this.factor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous();
      const right = this.factor();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  factor() {
    let expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator = this.previous();
      const right = this.unary();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  unary() {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.unary();
      return new Unary(operator, right);
    }

    return this.call();
  }

  call() {
    let expr = this.primary();

    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else if (this.match(TokenType.DOT)) {
        const name = this.consume(TokenType.IDENTIFIER, "Esperado nome da propriedade após '.'.");
        expr = new Get(expr, name);
      } else {
        break;
      }
    }

    return expr;
  }

  finishCall(callee) {
    const args = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (args.length >= 255) {
          this.error(this.peek(), "Não é possível ter mais de 255 argumentos.");
        }
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }

    const paren = this.consume(TokenType.RIGHT_PAREN, "Esperado ')' após os argumentos.");
    return new Call(callee, paren, args);
  }

  primary() {
    if (this.match(TokenType.FALSE)) return new Literal(false);
    if (this.match(TokenType.TRUE)) return new Literal(true);
    if (this.match(TokenType.NIL)) return new Literal(null);

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal);
    }

    if (this.match(TokenType.SUPER)) {
      const keyword = this.previous();
      this.consume(TokenType.DOT, "Esperado '.' após 'super'.");
      const method = this.consume(TokenType.IDENTIFIER, "Esperado nome do método da superclasse.");
      return new Super(keyword, method);
    }

    if (this.match(TokenType.THIS)) {
      return new This(this.previous());
    }

    if (this.match(TokenType.IDENTIFIER)) {
      return new Variable(this.previous());
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Esperado ')' após a expressão.");
      return new Grouping(expr);
    }

    throw this.error(this.peek(), "Esperado expressão.");
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw this.error(this.peek(), message);
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  peek() {
    return this.tokens[this.current];
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  error(token, message) {
    console.error(`[linha ${token.line}] Erro em '${token.lexeme}': ${message}`);
    return new ParseError(token, message);
  }

  synchronize() {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }

      this.advance();
    }
  }
}

export default Parser;