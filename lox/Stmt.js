class Stmt {
  accept(visitor) {
    throw new Error("O método accept deve ser implementado pelas subclasses");
  }
}

class Expression extends Stmt {
  constructor(expression) {
    super();
    this.expression = expression;
  }

  accept(visitor) {
    return visitor.visitExpressionStmt(this);
  }
}

class Print extends Stmt {
  constructor(expression) {
    super();
    this.expression = expression;
  }

  accept(visitor) {
    return visitor.visitPrintStmt(this);
  }
}

class Var extends Stmt {
  constructor(name, initializer) {
    super();
    this.name = name;
    this.initializer = initializer;
  }

  accept(visitor) {
    return visitor.visitVarStmt(this);
  }
}

class Block extends Stmt {
  constructor(statements) {
    super();
    this.statements = statements;
  }

  accept(visitor) {
    return visitor.visitBlockStmt(this);
  }
}

class If extends Stmt {
  constructor(condition, thenBranch, elseBranch) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }

  accept(visitor) {
    return visitor.visitIfStmt(this);
  }
}

class While extends Stmt {
  constructor(condition, body) {
    super();
    this.condition = condition;
    this.body = body;
  }

  accept(visitor) {
    return visitor.visitWhileStmt(this);
  }
}

class Function extends Stmt {
  constructor(name, params, body) {
    super();
    this.name = name;
    this.params = params;
    this.body = body;
  }

  accept(visitor) {
    return visitor.visitFunctionStmt(this);
  }
}

class Return extends Stmt {
  constructor(keyword, value) {
    super();
    this.keyword = keyword;
    this.value = value;
  }

  accept(visitor) {
    return visitor.visitReturnStmt(this);
  }
}

class Class extends Stmt {
  constructor(name, superclass, methods) {
    super();
    this.name = name;
    this.superclass = superclass;
    this.methods = methods;
  }

  accept(visitor) {
    return visitor.visitClassStmt(this);
  }
}

export {
  Stmt,
  Expression,
  Print,
  Var,
  Block,
  If,
  While,
  Function,
  Return,
  Class
};