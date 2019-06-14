"use strict";

const { Console } = require('console');

const logger = new Console(process.stderr, process.stderr);

// If node version >= 12
// const logger = new Console({
//     stdout: process.stderr,
//     stderr: process.stderr,
//     inspectOptions: { colors: true, depth: 3 }
// });

module.exports = logger;
