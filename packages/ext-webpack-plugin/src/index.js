'use strict'
require('@babel/polyfill')
const v = require('./pluginUtil').logv
export default class ExtWebpackPlugin {

  constructor(options) {
    this.plugin = require(`./pluginUtil`)._constructor(options)
  }

  apply(compiler) {
    const vars = this.plugin.vars
    const options = this.plugin.options
    if (!compiler.hooks) {console.log('not webpack 4');return}

    compiler.hooks.thisCompilation.tap(`ext-this-compilation`, (compilation) => {
      require(`./pluginUtil`)._thisCompilation(compiler, compilation, vars, options)
      if (vars.pluginErrors.length > 0) {
        compilation.errors.push( new Error(vars.pluginErrors.join("")) )
        return
      }
    })

    compiler.hooks.compilation.tap(`ext-compilation`, (compilation) => {
      require(`./pluginUtil`)._compilation(compiler, compilation, vars, options)
    })

    compiler.hooks.emit.tapAsync(`ext-emit`, (compilation, callback) => {
      require(`./pluginUtil`)._emit(compiler, compilation, vars, options, callback)
    })

    compiler.hooks.afterCompile.tap('ext-after-compile', (compilation) => {
      require(`./pluginUtil`)._afterCompile(compiler, compilation, vars, options)
    })

    compiler.hooks.done.tap(`ext-done`, () => {
      require(`./pluginUtil`)._done(vars, options)
      require('./pluginUtil').log(vars.app + `Completed ext-webpack-plugin processing`)
    })
  }
}
