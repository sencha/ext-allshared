'use strict'
require('@babel/polyfill')
const fs = require('fs');
const path = require('path');
const pluginUtil = require(`./pluginUtil`)
const replace = require("replace");

const configBundleName = "[name].js";
const defaultBundleName = "main.js"
const tmpCmdPluginFile = "temp.txt"

export default class ExtWebpackPlugin {

  constructor(options) {
    var constructorOutput = pluginUtil._constructor(options)
    this.vars = constructorOutput.vars
    this.options = constructorOutput.options

    this.vars.child = null;
    var me = this;

    var v = [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`]
    v.forEach(eventType => {
      process.on(eventType, function (eventType) {
        if (v.includes(eventType)) {
          if (me.vars.child != null) {
            console.log('\nnode process and sencha cmd process ended');
            me.vars.child.kill();
            me.vars.child = null;
          } else {
            if (eventType != 0) {
              console.log('\nnode process ended');
            }
          }

          process.exit();
        }
      });
    });
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
        compilation.errors.push(new Error(vars.pluginErrors.join("")))
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

    compiler.hooks.afterEmit.tapAsync('ext-after-emit', (compilation, callback) => {
      pluginUtil._emit(compiler, compilation, vars, options, callback)
    })

    compiler.hooks.done.tap(`ext-done`, (stats) => {
      pluginUtil.logh(app, `HOOK done`)
      // this.postBuildProcess(stats.compilation.outputOptions)
      pluginUtil._done(stats, vars, options)
    })
  }
}
