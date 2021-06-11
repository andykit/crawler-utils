var smath = require('../src/utils/smath.js');

var num = 0.1*7;
console.log(num);
console.log(smath.fixFloat(num));

console.log("0.0.1, 1.0", smath.compareVersion("0.0.1", "1.0"));
console.log("1.0, 0.0.1", smath.compareVersion("1.0", "0.0.1"));
console.log("1.1.0, 1.0.1", smath.compareVersion("1.1.0", "1.0.1"));
console.log("1.1.0, 1.1.0", smath.compareVersion("1.1.0", "1.1.0"));
console.log("10.0.0, 0.0.1", smath.compareVersion("10.0.0", "0.0.1"));