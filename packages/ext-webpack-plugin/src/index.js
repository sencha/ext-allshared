'use strict'
require('@babel/polyfill')
const p = require(`./pluginUtil`)

export default class ExtWebpackPlugin {

  constructor(options) {
    this.plugin = p._constructor(options)
  }

  apply(compiler) {
    const vars = this.plugin.vars
    const options = this.plugin.options
    
    if (!compiler.hooks) {console.log('not webpack 4');return}

    compiler.hooks.thisCompilation.tap(`ext-this-compilation`, (compilation) => {
      p.logh(vars.app + `HOOK thisCompilation`)
      p._thisCompilation(compiler, compilation, vars, options)
      if (vars.pluginErrors.length > 0) {
        compilation.errors.push( new Error(vars.pluginErrors.join("")) )
        return
      }
    })

    compiler.hooks.compilation.tap(`ext-compilation`, (compilation) => {
      p.logh(vars.app + `HOOK compilation`)
      p._compilation(compiler, compilation, vars, options)
    })

    compiler.hooks.emit.tapAsync(`ext-emit`, (compilation, callback) => {
      p.logh(vars.app + `HOOK emit (async)`)
      p._emit(compiler, compilation, vars, options, callback)
    })

    compiler.hooks.afterCompile.tap('ext-after-compile', (compilation) => {
      p.logh(vars.app + `HOOK afterCompile`)
      p._afterCompile(compiler, compilation, vars, options)
    })

    compiler.hooks.done.tap(`ext-done`, () => {
      p.logh(vars.app + `HOOK done`)
      p._done(vars, options)
    })
  }
}
