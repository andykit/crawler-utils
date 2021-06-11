const { recursive, recursivePromise } = require('./utils/recursive.js');

const sfs = require('./utils/sfs.js');
const spath = require('./utils/spath.js');
const smath = require('./utils/smath.js');
const snet = require('./utils/snet.js');
const szip = require('./utils/szip.js');

let Util = { recursive, recursivePromise, sfs, spath, smath, snet, szip };

module.exports = Util;