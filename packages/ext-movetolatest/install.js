const path = require('path');
const fs = require('fs')

function boldGreen (s) {
  var boldgreencolor = `\x1b[32m\x1b[1m`
  var endMarker = `\x1b[0m`
  return (`${boldgreencolor}${s}${endMarker}`)
}

var nodeDir = path.resolve(__dirname)
var pkg = (fs.existsSync(nodeDir + '/package.json') && JSON.parse(fs.readFileSync(nodeDir + '/package.json', 'utf-8')) || {});
version = pkg.version

console.log (`Welcome to ${boldGreen('Sencha Ext MoveToLatest')} v${version}

This tool upgrades applications generated with previous versions of ext-gen, ext-react-gen, ext-angular-gen, or ExtJSReactor to the 7.8.0 version of the same product.

Ext MoveToLatest must be run in an existing ExtGen, ExtReact, ExtAngular, or ExtJSReactor project folder

${boldGreen('Quick Start:')} 
ext-movetolatest
`)