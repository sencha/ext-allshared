
'use strict'
require('@babel/polyfill')
const fs = require('fs');
const path = require('path');
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
      this.postBuildProcess(stats.compilation.outputOptions)
      pluginUtil._done(stats, vars, options)
    })
  }

  postBuildProcess(options) {
    /**
       * 1. Read the temp file written by the Cmd plugin to get the app.json configured build path
       * 2. Extract the path as a String, trimmed to the location of the build folder
       * 3. Copy webpack bundle to destination directory
       * 4. Delete the temp file
       */ 
      const outputPath = options.path;
      const bundleName = ((options.filename == "[name].js") ? "main.js" : options.filename);
      const tempFilePath = outputPath+'temp.txt';
      const buildFolder = "build"

      if (fs.existsSync(tempFilePath)) {
        const configProdPath = fs.readFileSync(tempFilePath, "utf8").toString().trim();
        fs.unlinkSync(tempFilePath);
        const trimmedProdPathIndex = configProdPath.indexOf(buildFolder);
        const prodBuildPath = configProdPath.substring(trimmedProdPathIndex)
        const copyBundleDest = path.join(prodBuildPath, bundleName);
        if (fs.existsSync(bundleName)) {
          fs.copyFileSync(bundleName, copyBundleDest);
        }
      }
  }
}
