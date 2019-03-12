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
    extPath: 'ext-components',
    pluginErrors: [],
    deps: [],
    usedExtComponents: [],
    rebuild: true
  }
}

function toXtype(str) {
  return str.toLowerCase().replace(/_/g, '-')
}

export function _extractFromSource(module, options, compilation, extComponents) {
  const logv = require('./pluginUtil').logv
  logv(options.verbose,'FUNCTION _extractFromSource (empty)')
  try {
    var statements = [
      'Ext.require("Ext.*")',
    ]
    return statements
  }
  catch(e) {
    console.log(e)
    compilation.errors.push('extractFromSource: ' + e)
    return []
  }
}

function changeIt(o) {
  const path = require('path')
  const fsx = require('fs-extra')
  const wherePath = path.resolve(process.cwd(), o.where)
  var js = fsx.readFileSync(wherePath).toString()
  var newJs = js.replace(o.from,o.to);
  fsx.writeFileSync(wherePath, newJs, 'utf-8', ()=>{return})
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
   const logv = require('./pluginUtil').logv
  logv(options.verbose,'FUNCTION _getAllComponents (empty)')
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
  logv(options.verbose,'FUNCTION _writeFilesToProdFolder (empty)')
  try {
  }
  catch (e) {
    console.log(e)
  }
}