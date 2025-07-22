import fs from 'fs';
import path from 'path';
import Lox from '../main.js';

class TestRunner {
  constructor() {
    this.passedTests = 0;
    this.failedTests = 0;
    this.tests = [];
  }

  addTest(name, testFunction) {
    this.tests.push({ name, testFunction });
  }

  async runAllTests() {
    console.log('Executando testes do interpretador Lox...\n');
    
    for (const test of this.tests) {
      try {
        await test.testFunction();
        this.passedTests++;
        console.log(`${test.name}`);
      } catch (error) {
        this.failedTests++;
        console.log(`${test.name}`);
        console.log(`Erro: ${error.message}\n`);
      }
    }

    this.printSummary();
  }

  printSummary() {
    const total = this.passedTests + this.failedTests;
    console.log(`Resumo dos testes:`);
    console.log(`Total: ${total}`);
    console.log(`Passou: ${this.passedTests}`);
    console.log(`Falhou: ${this.failedTests}`);
    
    if (this.failedTests === 0) {
      console.log('\nTodos os testes passaram!');
    } else {
      console.log(`\n${this.failedTests} teste(s) falharam.`);
    }
  }

  captureOutput(callback) {
    const originalLog = console.log;
    const originalError = console.error;
    let output = '';
    let errors = '';

    console.log = (...args) => {
      output += args.join(' ') + '\n';
    };

    console.error = (...args) => {
      errors += args.join(' ') + '\n';
    };

    try {
      callback();
    } finally {
      console.log = originalLog;
      console.error = originalError;
    }

    return { output: output.trim(), errors: errors.trim() };
  }

  assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
      throw new Error(`${message}\nEsperado: ${expected}\nRecebido: ${actual}`);
    }
  }

  assertTrue(value, message = '') {
    if (!value) {
      throw new Error(`${message}\nEsperado: true\nRecebido: ${value}`);
    }
  }

  assertContains(text, substring, message = '') {
    if (!text.includes(substring)) {
      throw new Error(`${message}\nTexto não contém: "${substring}"\nTexto: "${text}"`);
    }
  }
}

export default TestRunner;
