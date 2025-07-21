import Environment from "./Environment.js";

class LoxFunction {
  constructor(declaration, closure, isInitializer = false) {
    this.declaration = declaration;
    this.closure = closure; // Ambiente onde a função foi declarada
    this.isInitializer = isInitializer;
  }

  bind(instance) {
    const environment = new Environment(this.closure);
    environment.define("this", instance);
    return new LoxFunction(this.declaration, environment, this.isInitializer);
  }

  call(interpreter, args) {
    const environment = new Environment(this.closure);
    
    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(
        this.declaration.params[i].lexeme,
        args[i]
      );
    }

    try {
      interpreter.executeBlock(this.declaration.body, environment);
    } catch (returnValue) {
      if (returnValue instanceof ReturnValue) {
        if (this.isInitializer) return this.closure.get({lexeme: "this"});
        return returnValue.value;
      }
      throw returnValue;
    }

    if (this.isInitializer) return this.closure.get({lexeme: "this"});
    
    return null;
  }

  arity() {
    return this.declaration.params.length;
  }

  toString() {
    return `<fn ${this.declaration.name.lexeme}>`;
  }
}

class ReturnValue extends Error {
  constructor(value) {
    super();
    this.value = value;
  }
}

export { LoxFunction, ReturnValue };
