import RuntimeError from "./RuntimeError.js";

class Environment {
  constructor(enclosing = null) {
    this.values = new Map();
    this.enclosing = enclosing; 
  }

  define(name, value) {
    this.values.set(name, value);
  }

  get(name) {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }

    if (this.enclosing !== null) {
      return this.enclosing.get(name);
    }

    throw new RuntimeError(name, `Variável indefinida '${name.lexeme}'.`);
  }

  getAt(distance, name) {
    return this.ancestor(distance).values.get(name);
  }

  assign(name, value) {
    if (this.values.has(name.lexeme)) {
      this.values.set(name.lexeme, value);
      return;
    }

    if (this.enclosing !== null) {
      this.enclosing.assign(name, value);
      return;
    }

    throw new RuntimeError(name, `Variável indefinida '${name.lexeme}'.`);
  }

  assignAt(distance, name, value) {
    this.ancestor(distance).values.set(name.lexeme, value);
  }

  ancestor(distance) {
    let environment = this;
    for (let i = 0; i < distance; i++) {
      environment = environment.enclosing;
    }
    return environment;
  }
}

export default Environment;
