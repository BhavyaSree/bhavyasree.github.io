//console.log(arguments);
//console.log(require('module').wrapper);

// module.exports
const Calc = require('./test-module1');
const calc1 = new Calc();

console.log(calc1.add(2,5));

// Exports

// const calc2 = require('./test-module2');
// console.log(calc2.multiply(2,5));

//another way , just import the functions whatever needed.
const {add,multiply} = require('./test-module2');
console.log(multiply(3,5));

//Caching
require('./test-module3')();
require('./test-module3')();
require('./test-module3')();
require('./test-module3')();

// module was imported only one once.