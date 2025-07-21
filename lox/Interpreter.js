import TokenType from "./TokenType.js";
import RuntimeError from "./RuntimeError.js";
import Environment from "./Environment.js";
import { LoxFunction, ReturnValue } from "./LoxFunction.js";
import { LoxClass, LoxInstance } from "./LoxClass.js";

class Interpreter {
  constructor() {
    this.globals = new Environment();
    this.environment = this.globals;
    
    this.globals.define("clock", {
      arity: () => 0,
      call: (interpreter, args) => Date.now() / 1000.0,
      toString: () => "<native fn>"
    });
  }

  interpret(statements) {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      if (error instanceof RuntimeError) {
        console.error(error.toString());
      } else {
        throw error;
      }
    }
  }

  execute(stmt) {
    return stmt.accept(this);
  }

  executeBlock(statements, environment) {
    const previous = this.environment;
    try {
      this.environment = environment;
      for (const statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  evaluate(expr) {
    return expr.accept(this);
  }

  evaluateExpression(expr) {
    try {
      return this.evaluate(expr);
    } catch (error) {
      if (error instanceof RuntimeError) {
        console.error(error.toString());
        return null;
      }
      throw error;
    }
  }

  isTruthy(object) {
    if (object === null) return false;
    if (typeof object === "boolean") return object;
    return true;
  }

  isEqual(a, b) {
    return a === b;
  }

  stringify(object) {
    if (object === null) return "nil";
    if (typeof object === "number") {
      let text = object.toString();
      if (text.endsWith(".0")) {
        text = text.substring(0, text.length - 2);
      }
      return text;
    }
    return object.toString();
  }

  checkNumberOperand(operator, operand) {
    if (typeof operand === "number") return;
    throw new RuntimeError(operator, "Operando deve ser um número.");
  }

  checkNumberOperands(operator, left, right) {
    if (typeof left === "number" && typeof right === "number") return;
    throw new RuntimeError(operator, "Operandos devem ser números.");
  }

  visitLiteralExpr(expr) {
    return expr.value;
  }

  visitGroupingExpr(expr) {
    return this.evaluate(expr.expression);
  }

  visitUnaryExpr(expr) {
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.MINUS:
        this.checkNumberOperand(expr.operator, right);
        return -right;
      case TokenType.BANG:
        return !this.isTruthy(right);
    }

    return null;
  }

  visitBinaryExpr(expr) {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return left > right;
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return left >= right;
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return left < right;
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return left <= right;
      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right);
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right);
        return left - right;
      case TokenType.PLUS:
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }
        if (typeof left === "string" && typeof right === "string") {
          return left + right;
        }
        if (typeof left === "string" || typeof right === "string") {
          return this.stringify(left) + this.stringify(right);
        }
        throw new RuntimeError(expr.operator, 
          "Operandos devem ser dois números ou pelo menos uma string.");
      case TokenType.SLASH:
        this.checkNumberOperands(expr.operator, left, right);
        return left / right;
      case TokenType.STAR:
        this.checkNumberOperands(expr.operator, left, right);
        return left * right;
    }

    return null;
  }

  visitVariableExpr(expr) {
    return this.environment.get(expr.name);
  }

  visitAssignExpr(expr) {
    const value = this.evaluate(expr.value);
    this.environment.assign(expr.name, value);
    return value;
  }

  visitLogicalExpr(expr) {
    const left = this.evaluate(expr.left);

    if (expr.operator.type === TokenType.OR) {
      if (this.isTruthy(left)) return left;
    } else {
      if (!this.isTruthy(left)) return left;
    }

    return this.evaluate(expr.right);
  }

  visitCallExpr(expr) {
    const callee = this.evaluate(expr.callee);

    const args = [];
    for (const argument of expr.args) {
      args.push(this.evaluate(argument));
    }

    if (!callee.call) {
      throw new RuntimeError(expr.paren, "Só é possível chamar funções e classes.");
    }

    if (args.length !== callee.arity()) {
      throw new RuntimeError(expr.paren, 
        `Esperado ${callee.arity()} argumentos mas recebeu ${args.length}.`);
    }

    return callee.call(this, args);
  }

  visitGetExpr(expr) {
    const object = this.evaluate(expr.object);
    if (object instanceof LoxInstance) {
      return object.get(expr.name);
    }

    throw new RuntimeError(expr.name, "Apenas instâncias têm propriedades.");
  }

  visitSetExpr(expr) {
    const object = this.evaluate(expr.object);

    if (!(object instanceof LoxInstance)) {
      throw new RuntimeError(expr.name, "Apenas instâncias têm campos.");
    }

    const value = this.evaluate(expr.value);
    object.set(expr.name, value);
    return value;
  }

  visitThisExpr(expr) {
    return this.environment.get(expr.keyword);
  }

  visitSuperExpr(expr) {
    const superclass = this.environment.get({lexeme: "super"});
    const object = this.environment.get({lexeme: "this"});
    
    const method = superclass.findMethod(expr.method.lexeme);
    if (method === null) {
      throw new RuntimeError(expr.method, `Método indefinido '${expr.method.lexeme}'.`);
    }

    return method.bind(object);
  }

  visitExpressionStmt(stmt) {
    this.evaluate(stmt.expression);
    return null;
  }

  visitPrintStmt(stmt) {
    const value = this.evaluate(stmt.expression);
    console.log(this.stringify(value));
    return null;
  }

  visitVarStmt(stmt) {
    let value = null;
    if (stmt.initializer !== null) {
      value = this.evaluate(stmt.initializer);
    }

    this.environment.define(stmt.name.lexeme, value);
    return null;
  }

  visitBlockStmt(stmt) {
    this.executeBlock(stmt.statements, new Environment(this.environment));
    return null;
  }

  visitIfStmt(stmt) {
    if (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch);
    } else if (stmt.elseBranch !== null) {
      this.execute(stmt.elseBranch);
    }
    return null;
  }

  visitWhileStmt(stmt) {
    while (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.body);
    }
    return null;
  }

  visitFunctionStmt(stmt) {
    const func = new LoxFunction(stmt, this.environment, false);
    this.environment.define(stmt.name.lexeme, func);
    return null;
  }

  visitReturnStmt(stmt) {
    let value = null;
    if (stmt.value !== null) {
      value = this.evaluate(stmt.value);
    }

    throw new ReturnValue(value);
  }

  visitClassStmt(stmt) {
    let superclass = null;
    if (stmt.superclass !== null) {
      superclass = this.evaluate(stmt.superclass);
      if (!(superclass instanceof LoxClass)) {
        throw new RuntimeError(stmt.superclass.name, "Superclasse deve ser uma classe.");
      }
    }

    this.environment.define(stmt.name.lexeme, null);

    if (stmt.superclass !== null) {
      this.environment = new Environment(this.environment);
      this.environment.define("super", superclass);
    }

    const methods = new Map();
    for (const method of stmt.methods) {
      const isInitializer = method.name.lexeme === "init";
      const func = new LoxFunction(method, this.environment, isInitializer);
      methods.set(method.name.lexeme, func);
    }

    const klass = new LoxClass(stmt.name.lexeme, superclass, methods);

    if (superclass !== null) {
      this.environment = this.environment.enclosing;
    }

    this.environment.assign(stmt.name, klass);
    return null;
  }
}

export default Interpreter;
