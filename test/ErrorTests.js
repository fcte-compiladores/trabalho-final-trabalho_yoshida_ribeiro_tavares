import TestRunner from './TestRunner.js';
import Lox from '../main.js';

const testRunner = new TestRunner();

testRunner.addTest('Undefined Variable Error', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print undefinedVar;');
  });
  testRunner.assertContains(result.errors, 'Variável indefinida');
});

testRunner.addTest('Division by Zero', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print 5 / 0;');
  });
  testRunner.assertEqual(result.output, 'Infinity');
});

testRunner.addTest('Invalid Operand Type - Number', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print -"hello";');
  });
  testRunner.assertContains(result.errors, 'Operando deve ser um número');
});

testRunner.addTest('Invalid Binary Operands', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print "hello" - 5;');
  });
  testRunner.assertContains(result.errors, 'Operandos devem ser números');
});

testRunner.addTest('Call Non-Function', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('var x = 42; x();');
  });
  testRunner.assertContains(result.errors, 'Só é possível chamar funções');
});

testRunner.addTest('Wrong Number of Arguments', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      fun add(a, b) {
        return a + b;
      }
      add(1);
    `);
  });
  testRunner.assertContains(result.errors, 'Esperado 2 argumentos');
});

testRunner.addTest('Property Access on Non-Instance', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('var x = 42; print x.prop;');
  });
  testRunner.assertContains(result.errors, 'Apenas instâncias têm propriedades');
});

testRunner.addTest('Undefined Property', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      class Test {}
      var t = Test();
      print t.undefinedProp;
    `);
  });
  testRunner.assertContains(result.errors, 'Propriedade indefinida');
});

export { testRunner };
