'use strict'
require('@babel/polyfill')
const p = require(`./pluginUtil`)
const v = p.logv
const h = p.logh
export default class ExtWebpackPlugin {

  constructor(options) {
    this.plugin = p._constructor(options)
  }

  apply(compiler) {
    const vars = this.plugin.vars
    const options = this.plugin.options
    if (!compiler.hooks) {console.log('not webpack 4');return}

    compiler.hooks.thisCompilation.tap(`ext-this-compilation`, (compilation) => {
      h(vars.app + `HOOK thisCompilation`)
      p._thisCompilation(compiler, compilation, vars, options)
      if (vars.pluginErrors.length > 0) {
        compilation.errors.push( new Error(vars.pluginErrors.join("")) )
        return
      }
    })

    compiler.hooks.compilation.tap(`ext-compilation`, (compilation) => {
      h(vars.app + `HOOK compilation`)
      p._compilation(compiler, compilation, vars, options)
    })

    compiler.hooks.emit.tapAsync(`ext-emit`, (compilation, callback) => {
      h(vars.app + `HOOK emit (async)`)
      p._emit(compiler, compilation, vars, options, callback)
    })

    compiler.hooks.afterCompile.tap('ext-after-compile', (compilation) => {
      h(vars.app + `HOOK afterCompile`)
      p._afterCompile(compiler, compilation, vars, options)
    })

    compiler.hooks.done.tap(`ext-done`, () => {
      h(vars.app + `HOOK done`)
      p._done(vars, options)
      if (vars.buildstep == 0) {
        require('./pluginUtil').log(vars.app + ` Development Build Completed`)
      }
      if (vars.buildstep == 0) {
        require('./pluginUtil').log(vars.app + `Production Build Completed`)
      }
    })
  }
}
