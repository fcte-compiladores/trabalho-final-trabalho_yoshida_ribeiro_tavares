import TestRunner from './TestRunner.js';
import Lox from '../main.js';

const testRunner = new TestRunner();

testRunner.addTest('Variable Declaration', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('var x = 10; print x;');
  });
  testRunner.assertEqual(result.output, '10');
});

testRunner.addTest('Variable Assignment', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('var x = 10; x = 20; print x;');
  });
  testRunner.assertEqual(result.output, '20');
});

testRunner.addTest('Variable Scope - Block', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      var x = 10;
      {
        var x = 20;
        print x;
      }
      print x;
    `);
  });
  testRunner.assertEqual(result.output, '20\n10');
});

testRunner.addTest('If Statement - True', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('if (true) print "executed";');
  });
  testRunner.assertEqual(result.output, 'executed');
});

testRunner.addTest('If Statement - False', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('if (false) print "not executed";');
  });
  testRunner.assertEqual(result.output, '');
});

testRunner.addTest('If-Else Statement', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run('if (false) print "not executed"; else print "executed";');
  });
  testRunner.assertEqual(result.output, 'executed');
});

testRunner.addTest('While Loop', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      var i = 0;
      while (i < 3) {
        print i;
        i = i + 1;
      }
    `);
  });
  testRunner.assertEqual(result.output, '0\n1\n2');
});

testRunner.addTest('For Loop', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      for (var i = 0; i < 3; i = i + 1) {
        print i;
      }
    `);
  });
  testRunner.assertEqual(result.output, '0\n1\n2');
});

testRunner.addTest('Nested Blocks', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      var x = 1;
      {
        var x = 2;
        {
          var x = 3;
          print x;
        }
        print x;
      }
      print x;
    `);
  });
  testRunner.assertEqual(result.output, '3\n2\n1');
});

export { testRunner };
