import { LoxFunction } from "./LoxFunction.js";
import RuntimeError from "./RuntimeError.js";

class LoxClass {
  constructor(name, superclass, methods) {
    this.name = name;
    this.superclass = superclass;
    this.methods = methods;
  }

  call(interpreter, args) {
    const instance = new LoxInstance(this);
    
    const initializer = this.findMethod("init");
    if (initializer !== null) {
      initializer.bind(instance).call(interpreter, args);
    }
    
    return instance;
  }

  arity() {
    const initializer = this.findMethod("init");
    if (initializer === null) return 0;
    return initializer.arity();
  }

  findMethod(name) {
    if (this.methods.has(name)) {
      return this.methods.get(name);
    }

    if (this.superclass !== null) {
      return this.superclass.findMethod(name);
    }

    return null;
  }

  toString() {
    return this.name;
  }
}

class LoxInstance {
  constructor(klass) {
    this.klass = klass;
    this.fields = new Map();
  }

  get(name) {
    if (this.fields.has(name.lexeme)) {
      return this.fields.get(name.lexeme);
    }

    const method = this.klass.findMethod(name.lexeme);
    if (method !== null) {
      return method.bind(this);
    }

    throw new RuntimeError(name, `Propriedade indefinida '${name.lexeme}'.`);
  }

  set(name, value) {
    this.fields.set(name.lexeme, value);
  }

  toString() {
    return `${this.klass.name} instance`;
  }
}

export { LoxClass, LoxInstance };
