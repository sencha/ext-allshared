const fs = require("fs-extra");

var packageNameThis = './package.json';
var packageThis = fs.readFileSync(packageNameThis, 'utf8');
const packageJsonAppThis = JSON.parse(packageThis);
var prefix = packageJsonAppThis.name + ':';

console.log(`${prefix} postinstall..`);