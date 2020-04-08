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
    usedExtComponents: [],
    rebuild: true
  }
}

export function _extractFromSource(module, options, compilation, extComponents) {
  const logv = require('./pluginUtil').logv
  logv(options.verbose,'FUNCTION _extractFromSource')
try {
    var js = module._source._value
    logv(options.verbose,'FUNCTION extractFromSource')

    var generate = require("@babel/generator").default
    var parse = require("babylon").parse
    var traverse = require("ast-traverse")

    const statements = []

    const ast = parse(js, {
      plugins: [
        'jsx',
        'flow',
        'doExpressions',
        'objectRestSpread',
        'classProperties',
        'exportExtensions',
        'asyncGenerators',
        'functionBind',
        'functionSent',
        'dynamicImport'
      ],
      sourceType: 'module'
    })

    traverse(ast, {
      pre: function(node) {
        if (node.type === 'CallExpression'
            && node.callee
            && node.callee.object
            && node.callee.object.name === 'Ext') {
          statements.push(generate(node).code)
        }
        if (node.type == 'ImportDeclaration') {
          if ( node.source.extra.rawValue == '@sencha/ext-react-classic' ||
               node.source.extra.rawValue == '@sencha/ext-react-modern') {
            node.specifiers.forEach(n => {
              var name = n.imported.name
              var prefix = name.substring(0, 3);
              if (prefix == 'Ext') {
                name = name.substring(3);
              }
              name = name.toLowerCase()
              statements.push(`Ext.create({xtype: '${name}'})`);
            })
          }
        }
      }
    })
    return statements
}
catch(e) {
  //console.log(module.resource)
  //console.log(js)
  //console.log(e)
  //compilation.errors.push('extractFromSource: ' + e)
  return []
}
}
