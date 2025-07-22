import TestRunner from './TestRunner.js';
import Lox from '../main.js';

const testRunner = new TestRunner();

testRunner.addTest('Function Declaration and Call', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      fun greet() {
        print "Hello!";
      }
      greet();
    `);
  });
  testRunner.assertEqual(result.output, 'Hello!');
});

testRunner.addTest('Function with Parameters', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      fun greet(name) {
        print "Hello, " + name + "!";
      }
      greet("Alice");
    `);
  });
  testRunner.assertEqual(result.output, 'Hello, Alice!');
});

testRunner.addTest('Function with Return Value', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      fun add(a, b) {
        return a + b;
      }
      print add(3, 4);
    `);
  });
  testRunner.assertEqual(result.output, '7');
});

testRunner.addTest('Recursive Function - Fibonacci', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      fun fib(n) {
        if (n <= 1) return n;
        return fib(n - 2) + fib(n - 1);
      }
      print fib(5);
    `);
  });
  testRunner.assertEqual(result.output, '5');
});

testRunner.addTest('Function Closure', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      fun makeCounter() {
        var count = 0;
        fun counter() {
          count = count + 1;
          return count;
        }
        return counter;
      }
      var c = makeCounter();
      print c();
      print c();
    `);
  });
  testRunner.assertEqual(result.output, '1\n2');
});

testRunner.addTest('Function without Return', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      fun noReturn() {
        print "executed";
      }
      var result = noReturn();
      print result;
    `);
  });
  testRunner.assertEqual(result.output, 'executed\nnil');
});

testRunner.addTest('Native Function - clock', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      var time = clock();
      print time > 0;
    `);
  });
  testRunner.assertEqual(result.output, 'true');
});

export { testRunner };
