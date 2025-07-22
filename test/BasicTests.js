import TestRunner from './TestRunner.js';
import Lox from '../main.js';

const testRunner = new TestRunner();

testRunner.addTest('Literals - Numbers', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print 42;');
  });
  testRunner.assertEqual(result.output, '42');
});

testRunner.addTest('Literals - Strings', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print "Hello, World!";');
  });
  testRunner.assertEqual(result.output, 'Hello, World!');
});

testRunner.addTest('Literals - Booleans', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print true; print false;');
  });
  testRunner.assertEqual(result.output, 'true\nfalse');
});

testRunner.addTest('Literals - Nil', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print nil;');
  });
  testRunner.assertEqual(result.output, 'nil');
});

testRunner.addTest('Arithmetic - Addition', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print 2 + 3;');
  });
  testRunner.assertEqual(result.output, '5');
});

testRunner.addTest('Arithmetic - Subtraction', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print 10 - 4;');
  });
  testRunner.assertEqual(result.output, '6');
});

testRunner.addTest('Arithmetic - Multiplication', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print 6 * 7;');
  });
  testRunner.assertEqual(result.output, '42');
});

testRunner.addTest('Arithmetic - Division', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print 8 / 2;');
  });
  testRunner.assertEqual(result.output, '4');
});

testRunner.addTest('String Concatenation', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print "Hello" + " " + "World";');
  });
  testRunner.assertEqual(result.output, 'Hello World');
});

testRunner.addTest('String + Number Concatenation', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print "Number: " + 42;');
  });
  testRunner.assertEqual(result.output, 'Number: 42');
});

testRunner.addTest('Comparison - Greater Than', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print 5 > 3; print 2 > 5;');
  });
  testRunner.assertEqual(result.output, 'true\nfalse');
});

testRunner.addTest('Comparison - Less Than', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print 3 < 5; print 5 < 2;');
  });
  testRunner.assertEqual(result.output, 'true\nfalse');
});

testRunner.addTest('Comparison - Equality', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print 5 == 5; print 5 == 3; print "hello" == "hello";');
  });
  testRunner.assertEqual(result.output, 'true\nfalse\ntrue');
});

testRunner.addTest('Logical - AND', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print true and true; print true and false; print false and true;');
  });
  testRunner.assertEqual(result.output, 'true\nfalse\nfalse');
});

testRunner.addTest('Logical - OR', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print true or false; print false or true; print false or false;');
  });
  testRunner.assertEqual(result.output, 'true\ntrue\nfalse');
});

testRunner.addTest('Unary - Negation', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('print -42; print !true; print !false;');
  });
  testRunner.assertEqual(result.output, '-42\nfalse\ntrue');
});

export { testRunner };
