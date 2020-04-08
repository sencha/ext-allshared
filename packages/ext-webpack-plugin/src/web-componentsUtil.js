
"use strict"

export function _getDefaultVars() {
  return {
    touchFile: '/src/themer.js',
    watchStarted : false,
    buildstep: '1 of 1',
    firstTime : true,
    firstCompile: true,
    browserCount : 0,
    manifest: null,
    extPath: 'ext',
    pluginErrors: [],
    deps: [],
    usedExtWebComponents: [],
    rebuild: true
  }
}

export function _extractFromSource(module, options, compilation, ExtWebComponents) {
  const logv = require('./pluginUtil').logv
  const verbose = options.verbose
  logv(verbose,'FUNCTION _extractFromSource')
  var js = module._source._value
  logv(verbose,module.resource)
  var statements = []

  var generate = require("@babel/generator").default
  var parse = require("babylon").parse
  var traverse = require("ast-traverse")

  var ast = parse(js, {
    plugins: [
      'typescript',
      'flow',
      'doExpressions',
      'objectRestSpread',
      'classProperties',
      'exportDefaultFrom',
      'exportExtensions',
      'asyncGenerators',
      'functionBind',
      'functionSent',
      'dynamicImport'
    ],
    sourceType: 'module'
  })

  traverse(ast, {
    pre: function (node) {
      if (node.type === 'CallExpression' && node.callee && node.callee.object && node.callee.object.name === 'Ext') {
        statements.push(generate(node).code)
      }
      if (node.type === 'CallExpression') {
        const code = generate(node).code;
        statements = statements.concat(getXtypeFromHTMLJS(code, statements, ExtWebComponents));
      }
      if(node.type === 'StringLiteral') {
        let code = node.value
        for (var i = 0; i < code.length; ++i) {
          if (code.charAt(i) == '<') {
            if (code.substr(i, 4) == '<!--') {
              i += 4
              i += code.substr(i).indexOf('-->') + 3
            } else if (code.charAt(i+1) !== '/') {
              var start = code.substring(i)
              var end = getEnd(start, [' ', '\n', '>']);

                var xtype = start.substring(1, end)
                if(ExtWebComponents.includes(xtype)) {
                  xtype = xtype.substring(4, end);
                  var theValue = node.value.toLowerCase()
                  if (theValue.indexOf('doctype html') == -1) {
                    var config = `Ext.create(${JSON.stringify({xtype: xtype})})`;

                    if (statements.indexOf(config) < 0) {
                      statements.push(config);
                    }
                  }
                }
                i += end
              }
            }
          }

          statements = statements.concat(getXtypeFromHTMLJS(code, statements, ExtWebComponents));
        }
      }
  });

  return statements
}

function getXtypeFromHTMLJS(code, statements, ExtWebComponents) {
  const logv = require('./pluginUtil').logv
  const result = [];
  const xtypeRepetitons = (code.match(/xtype/g) || []).length;

  if (xtypeRepetitons > 0) {
    for (var j=0; j<xtypeRepetitons; j++) {
      var start = code.substring(code.indexOf('xtype') + 5);
      var ifAsProps = start.indexOf(':');
      var ifAsAttribute = start.indexOf('=');
      start = start.substring(Math.min(ifAsProps, ifAsAttribute) + 1);
      start = start.trim();
      var end = getEnd(start, ['\n', '>','}', '\r'])
      var xtype = start.substring(1, end).trim().replace(/['",]/g, '');

      var config = `Ext.create(${JSON.stringify({xtype: xtype})})`;
      if(ExtWebComponents.includes('ext-' + xtype) && statements.indexOf(config) === -1) {
        result.push(config);
      }
      code = start.substr(end).trim();
    }
  }

  return result;
}

export function _toProd(vars, options) {
  const logv = require('./pluginUtil').logv
  logv(options.verbose,'FUNCTION _toProd (empty')
  try {
  }
  catch (e) {
    console.log(e)
    return []
  }
}

export function _toDev(vars, options) {
  try {
  }
  catch (e) {
    console.log(e)
    return []
  }
}

export function _getAllComponents(vars, options) {
  const log = require('./pluginUtil').log
  const logv = require('./pluginUtil').logv
  logv(options.verbose,'FUNCTION _getAllComponents')

  const path = require('path')
  const fsx = require('fs-extra')

  var ExtWebComponents = []
  const packageLibPath = path.resolve(process.cwd(), 'node_modules/@sencha/ext-web-components-modern/dist')
  var files = fsx.readdirSync(packageLibPath)
  files.forEach((fileName) => {
    if (fileName && fileName.substr(0, 4) == 'ext-') {
      var end = fileName.substr(4).indexOf('.component')
      if (end >= 0) {
        ExtWebComponents.push(fileName.substring(0, end + 4))
      }
    }
  })
  logv(options.verbose, `Identifying all ext-${options.framework}-modern modules`)
  //log(vars.app, `Identifying all ext-${options.framework} modules`)
  return ExtWebComponents
}

export function _writeFilesToProdFolder(vars, options) {
  const logv = require('./pluginUtil').logv
  logv(options.verbose,'FUNCTION _writeFilesToProdFolder (empty)')
  try {
  }
  catch (e) {
    console.log(e)
  }
}

function getEnd(start, setOfSymbolsToCheck) {
  var endingsArr = [];

  for (var i=0;i<setOfSymbolsToCheck.length;i++) {
     var symbolIndex = start.indexOf(setOfSymbolsToCheck[i]);

     if (symbolIndex !== -1) {
       endingsArr.push(symbolIndex);
     }
  }
  return Math.min(...endingsArr)
}
