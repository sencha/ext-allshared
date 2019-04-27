
'use strict'
require('@babel/polyfill')
const pluginUtil = require(`./pluginUtil`)

// process.stdin.resume();

// process.on('SIGINT', function () {
//   console.log('Got SIGINT.  Press Control-D to exit.');
// });


export default class ExtWebpackPlugin {

  constructor(options) {
    var constructorOutput = pluginUtil._constructor(options)
    this.vars = constructorOutput.vars
    this.options = constructorOutput.options
  }

  apply(compiler) {
    const vars = this.vars
    const options = this.options
    const app = this.app

    if (!compiler.hooks) {
      console.log('not webpack 4');
      return;
    }

    compiler.hooks.thisCompilation.tap(`ext-this-compilation`, (compilation) => {
      pluginUtil.logh(app, `HOOK thisCompilation`)
      pluginUtil._thisCompilation(compiler, compilation, vars, options)

      if (vars.pluginErrors.length > 0) {
        compilation.errors.push( new Error(vars.pluginErrors.join("")) )
        return
      }
    })

    //var cRun = 0;
    compiler.hooks.compilation.tap(`ext-compilation`, (compilation) => {
      pluginUtil.logh(app, `HOOK compilation`)
      //if (cRun == 0) {
        pluginUtil._compilation(compiler, compilation, vars, options);
      //}
      //cRun++;
    })

    compiler.hooks.afterCompile.tap('ext-after-compile', (compilation) => {
      pluginUtil.logh(app, `HOOK afterCompile`)
      pluginUtil._afterCompile(compiler, compilation, vars, options)
    })

    compiler.hooks.emit.tapAsync(`ext-emit`, (compilation, callback) => {
      pluginUtil.logh(app, `HOOK emit (async)`)
      pluginUtil._emit(compiler, compilation, vars, options, callback)
    })

    compiler.hooks.done.tap(`ext-done`, (stats) => {
      pluginUtil.logh(app, `HOOK done`)
      pluginUtil._done(stats, vars, options)
    })
  }
}
