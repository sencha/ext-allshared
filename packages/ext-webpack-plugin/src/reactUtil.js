"use strict"

export function getValidateOptions() {
  return {
    "type": "object",
    "properties": {
      "framework":   {"type": [ "string" ]},
      "toolkit":     {"type": [ "string" ]},
      "theme":       {"type": [ "string" ]},
      "profile":     {"type": [ "string" ]},
      "environment": {"type": [ "string" ]},
      "treeshake":   {"type": [ "boolean" ]},
      "port":        {"type": [ "integer" ]},
      "emit":        {"type": [ "boolean" ]},
      "browser":     {"type": [ "boolean" ]},
      "watch":       {"type": [ "string" ]},
      "verbose":     {"type": [ "string" ]},
      "script":      {"type": [ "string" ]},
      "packages":    {"type": [ "string", "array" ]}
    },
    "additionalProperties": false
    // "errorMessage": {
    //   "option": "should be {Boolean} (https:/github.com/org/repo#anchor)"
    // }
  }
}

export function getDefaultOptions() {
  return {
    framework: null,
    toolkit: 'modern',
    theme: 'theme-material',
    profile: 'desktop', 
    environment: 'development', 
    treeshake: false,
    port: 1962,
    emit: true,
    browser: true,
    watch: 'yes',
    verbose: 'no',
    script: null,
    packages: null
  }
}

export function getDefaultVars() {
  return {
    watchStarted : false,
    buildstep: 0,
    firstTime : true,
    firstCompile: true,
    browserCount : 0,
    manifest: null,
    extPath: 'ext-react',
    pluginErrors: [],
    deps: [],
    usedExtComponents: [],
    rebuild: true
  }
}

function toXtype(str) {
  return str.toLowerCase().replace(/_/g, '-')
}

export function extractFromSource(module, options, compilation, extComponents) {
  const logv = require('./pluginUtil').logv
  logv(options,'FUNCTION _extractFromSource')
  try {
    var js = module._source._value
    const logv = require('./pluginUtil').logv
    logv(options,'FUNCTION extractFromSource')
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

    function addType(argNode) {
      var type
      if (argNode.type === 'StringLiteral') {
        var xtype = toXtype(argNode.value)
        if (xtype != 'extreact') {
          type = { xtype: toXtype(argNode.value) }
        }
      } else {
        type = { xclass: js.slice(argNode.start, argNode.end) }
      }
      if (type != undefined) {
        let config = JSON.stringify(type)
        statements.push(`Ext.create(${config})`)
      }
    }

    traverse(ast, {
      pre: function(node) {
        if (node.type === 'CallExpression'
            && node.callee
            && node.callee.object
            && node.callee.object.name === 'Ext'
        ) {
          statements.push(generate(node).code)
        }
        if (node.type == 'VariableDeclarator' 
            && node.init 
            && node.init.type === 'CallExpression' 
            && node.init.callee 
        ) {
          if (node.init.callee.name == 'reactify') {
            for (let i = 0; i < node.init.arguments.length; i++) {
              const valueNode = node.init.arguments[i];
              if (!valueNode) continue;
              addType(valueNode)
            }
          }
        }

        // // Convert React.createElement(...) calls to the equivalent Ext.create(...) calls to put in the manifest.
        // if (node.type === 'CallExpressionx' 
        //     && node.callee.object 
        //     && node.callee.object.name === 'React' 
        //     && node.callee.property.name === 'createElement') {
        //   const [props] = node.arguments
        //   let config
        //   if (Array.isArray(props.properties)) {
        //     config = generate(props).code
        //     for (let key in type) {
        //       config = `{\n  ${key}: '${type[key]}',${config.slice(1)}`
        //     }
        //   } else {
        //     config = JSON.stringify(type)
        //   }
        // }
      }
    })
    return statements
  }
  catch(e) {
    console.log(module.resource)
    console.log(js)
    console.log(e)
    compilation.errors.push('extractFromSource: ' + e)
    return []
  }
}

export function _toProd(vars, options) {
  const logv = require('./pluginUtil').logv
  logv(options,'FUNCTION _toProd (empty')
  try {
  }
  catch (e) {
    console.log(e)
    return []
  }
}

export function _toDev(vars, options) {
  const logv = require('./pluginUtil').logv
  logv(options,'FUNCTION _toDev (empty)')
  try {
  }
  catch (e) {
    console.log(e)
    return []
  }
}

export function _getAllComponents(vars, options) {
   const logv = require('./pluginUtil').logv
  logv(options,'FUNCTION _getAllComponents (empty)')
  try {
    var extComponents = []
     return extComponents
  }
  catch (e) {
    console.log(e)
    return []
  }
}

export function _writeFilesToProdFolder(vars, options) {
  const logv = require('./pluginUtil').logv
  logv(options,'FUNCTION _writeFilesToProdFolder (empty)')
  try {
  }
  catch (e) {
    console.log(e)
  }
}
