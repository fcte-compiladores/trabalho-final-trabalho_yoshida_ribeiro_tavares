import TestRunner from './TestRunner.js';
import Lox from '../main.js';

const testRunner = new TestRunner();

testRunner.addTest('Class Declaration and Instantiation', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      class Person {
        init(name) {
          this.name = name;
        }
      }
      var person = Person("Alice");
      print person;
    `);
  });
  testRunner.assertContains(result.output, 'Person instance');
});

testRunner.addTest('Class Method Call', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      class Person {
        init(name) {
          this.name = name;
        }
        
        greet() {
          print "Hello, I'm " + this.name;
        }
      }
      var person = Person("Alice");
      person.greet();
    `);
  });
  testRunner.assertEqual(result.output, "Hello, I'm Alice");
});

testRunner.addTest('Class Property Access', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      class Person {
        init(name) {
          this.name = name;
        }
      }
      var person = Person("Alice");
      print person.name;
    `);
  });
  testRunner.assertEqual(result.output, 'Alice');
});

testRunner.addTest('Class Property Assignment', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      class Person {
        init(name) {
          this.name = name;
        }
      }
      var person = Person("Alice");
      person.age = 30;
      print person.age;
    `);
  });
  testRunner.assertEqual(result.output, '30');
});

testRunner.addTest('Class Inheritance', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      class Animal {
        init(name) {
          this.name = name;
        }
        
        speak() {
          print this.name + " makes a sound";
        }
      }
      
      class Dog < Animal {
        speak() {
          print this.name + " barks";
        }
      }
      
      var dog = Dog("Rex");
      dog.speak();
    `);
  });
  testRunner.assertEqual(result.output, 'Rex barks');
});

testRunner.addTest('Super Method Call', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      class Animal {
        init(name) {
          this.name = name;
        }
        
        speak() {
          print this.name + " makes a sound";
        }
      }
      
      class Dog < Animal {
        init(name, breed) {
          super.init(name);
          this.breed = breed;
        }
        
        speak() {
          super.speak();
          print this.name + " barks";
        }
      }
      
      var dog = Dog("Rex", "Labrador");
      dog.speak();
    `);
  });
  testRunner.assertEqual(result.output, 'Rex makes a sound\nRex barks');
});

testRunner.addTest('Method Returns This', () => {
  const lox = new Lox();
  const result = testRunner.captureOutput(() => {
    lox.run(`
      class Builder {
        init() {
          this.value = 0;
        }
        
        add(n) {
          this.value = this.value + n;
          return this;
        }
        
        getValue() {
          return this.value;
        }
      }
      
      var builder = Builder();
      var result = builder.add(5).add(3).getValue();
      print result;
    `);
  });
  testRunner.assertEqual(result.output, '8');
});

export { testRunner };
