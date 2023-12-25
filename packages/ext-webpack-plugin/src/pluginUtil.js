
//**********
export function _constructor(initialOptions) {
  const fs = require('fs')
  var vars = {}
  var options = {}
  try {
    if (initialOptions.framework == undefined) {
      vars.pluginErrors = []
      vars.pluginErrors.push('webpack config: framework parameter on ext-webpack-plugin is not defined - values: react, angular, extjs, web-components')
      var result = { vars: vars };
      return result;
    }
    var framework = initialOptions.framework
    var treeshake = initialOptions.treeshake
    var verbose = initialOptions.verbose

    const validateOptions = require('schema-utils')
    validateOptions(_getValidateOptions(), initialOptions, '')

    const rc = (fs.existsSync(`.ext-${framework}rc`) && JSON.parse(fs.readFileSync(`.ext-${framework}rc`, 'utf-8')) || {})
    options = { ..._getDefaultOptions(), ...initialOptions, ...rc }

    vars = require(`./${framework}Util`)._getDefaultVars()
    vars.pluginName = 'ext-webpack-plugin'
    vars.app = _getApp()
    var pluginName = vars.pluginName
    var app = vars.app
    vars.testing = false

    logv(verbose, 'FUNCTION _constructor')
    logv(verbose, `pluginName - ${pluginName}`)
    logv(verbose, `app - ${app}`)

    if (options.environment == 'production' ||
        options.cmdopts.includes('--production') ||
        options.cmdopts.includes('-pr') ||
        options.cmdopts.includes('--environment=production') ||
        options.cmdopts.includes('-e=production')
      ) {
      vars.production = true;
      options.browser = 'no';
      options.watch = 'no';
      options.buildEnvironment = 'production';
    } else if (options.cmdopts && (options.cmdopts.includes('--testing') ||
               options.cmdopts.includes('-te') ||
               options.cmdopts.includes('--environment=testing') ||
               options.cmdopts.includes('-e=testing'))
    ) {
      vars.production = false;
      vars.testing = true;
      options.browser = 'no';
      options.watch = 'no';
      options.buildEnvironment = 'testing';
    } else {
      options.buildEnvironment = 'development';
      vars.production = false;
    }

    log(app, _getVersions(pluginName, framework))

    //mjg added for angular cli build
    if (framework == 'angular' &&
        options.intellishake == 'no' &&
        vars.production == true
        && treeshake == 'yes') {
            vars.buildstep = '1 of 1';
            log(app, 'Starting production build for ' + framework);
    }

    else if (framework == 'react' || framework == 'extjs' || framework == 'web-components') {
      if (vars.production == true) {
        vars.buildstep = '1 of 1'
        log(app, 'Starting production build for ' + framework)
      }
      else if(vars.testing == true){
        vars.buildstep = '1 of 1'
        log(app, 'Starting testing build for ' + framework)
      }
      else {
        vars.buildstep = '1 of 1'
        log(app, 'Starting development build for ' + framework)
      }
    }
    else if (vars.production == true) {
      if (treeshake == 'yes') {
        vars.buildstep = '1 of 2'
        log(app, 'Starting production build for ' + framework + ' - ' + vars.buildstep)
        require(`./${framework}Util`)._toProd(vars, options)
      }
      else {
        vars.buildstep = '2 of 2'
        log(app, 'Continuing production build for ' + framework + ' - ' + vars.buildstep)
      }
    }
    else {
      vars.buildstep = '1 of 1'
      log(app, 'Starting development build for ' + framework)
    }
    logv(verbose, 'Building for ' + options.buildEnvironment + ', ' + 'treeshake is ' + options.treeshake+ ', ' + 'intellishake is ' + options.intellishake)

    var configObj = { vars: vars, options: options };
    return configObj;
  }
  catch (e) {
    throw '_constructor: ' + e.toString()
  }
}

//**********
export function _thisCompilation(compiler, compilation, vars, options) {
  try {
    var app = vars.app
    var verbose = options.verbose
    logv(verbose, 'FUNCTION _thisCompilation')
    logv(verbose, `options.script: ${options.script }`)
    logv(verbose, `buildstep: ${vars.buildstep}`)

    if (vars.buildstep === '1 of 1' || vars.buildstep === '1 of 2') {
      if (options.script != undefined && options.script != null && options.script != '') {
        log(app, `Started running ${options.script}`)
        runScript(options.script, function (err) {
          if (err) {
            throw err;
          }
          log(app, `Finished running ${options.script}`)
        });
      }
    }
  }
  catch(e) {
    throw '_thisCompilation: ' + e.toString()
  }
}

//**********
export function _compilation(compiler, compilation, vars, options) {
  try {
    var app = vars.app
    var verbose = options.verbose
    var framework = options.framework
    logv(verbose, 'FUNCTION _compilation')

    if (framework != 'extjs') {
      if (options.treeshake === 'yes' && options.buildEnvironment === 'production') {
        var extComponents = [];

        //mjg for 1 step build
        if (vars.buildstep == '1 of 1' && framework === 'angular' && options.intellishake == 'no') {
            extComponents = require(`./${framework}Util`)._getAllComponents(vars, options);
        }

        if (vars.buildstep == '1 of 2' || (vars.buildstep == '1 of 1' && framework === 'web-components')) {
          extComponents = require(`./${framework}Util`)._getAllComponents(vars, options)
        }
        compilation.hooks.succeedModule.tap(`ext-succeed-module`, module => {
          if (module.resource && !module.resource.match(/node_modules/)) {
            try {
                if (module.resource.match(/\.html$/) != null
                && module._source._value.toLowerCase().includes('doctype html') == false
                ) {
                    vars.deps = [
                        ...(vars.deps || []),
                        ...require(`./${framework}Util`)._extractFromSource(module, options, compilation, extComponents)]
                    }
                else {
                    vars.deps = [
                        ...(vars.deps || []),
                        ...require(`./${framework}Util`)._extractFromSource(module, options, compilation, extComponents)]
                    }
            }
            catch(e) {
                console.log(e)
            }
          }
        });
      }
      if (vars.buildstep == '1 of 2') {
        compilation.hooks.finishModules.tap(`ext-finish-modules`, modules => {
          require(`./${framework}Util`)._writeFilesToProdFolder(vars, options)
        })
      }
      if (vars.buildstep == '1 of 1' || vars.buildstep == '2 of 2') {
        if (options.inject === 'yes') {
          if(compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration != undefined) {
            compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tap(`ext-html-generation`,(data) => {
              const path = require('path')
              var jsPath = path.join(vars.extPath, 'ext.js')
              var cssPath = path.join(vars.extPath, 'ext.css')
              //var jsPath = vars.extPath + '/' +  'ext.js';
              //var cssPath = vars.extPath + '/' + 'ext.css';
              data.assets.js.unshift(jsPath)
              data.assets.css.unshift(cssPath)
              log(app, `Adding ${jsPath} and ${cssPath} to index.html`)
            })
          }
        }
      }
    }
  }
  catch(e) {
    throw '_compilation: ' + e.toString()
//    logv(options.verbose,e)
//    compilation.errors.push('_compilation: ' + e)
  }
}

//**********
export function _afterCompile(compiler, compilation, vars, options) {
  try {
    var app = vars.app
    var verbose = options.verbose
    var framework = options.framework
    logv(verbose, 'FUNCTION _afterCompile')
    if (framework == 'extjs') {
      require(`./extjsUtil`)._afterCompile(compilation, vars, options)
    }
    else {
      logv(verbose, 'FUNCTION _afterCompile not run')
    }
  }
  catch(e) {
    throw '_afterCompile: ' + e.toString()
  }
}

//**********
export async function _emit(compiler, compilation, vars, options, callback) {
  try {
    const path = require('path')
    var app = vars.app
    var verbose = options.verbose
    var emit = options.emit
    var framework = options.framework
    vars.callback = callback
    logv(verbose,'FUNCTION _emit')
    if (emit == 'yes') {
      if (vars.buildstep == '1 of 1' || vars.buildstep == '1 of 2') {
        let outputPath = path.join(compiler.outputPath,vars.extPath)
        if (compiler.outputPath === '/' && compiler.options.devServer) {
          outputPath = path.join(compiler.options.devServer.contentBase, outputPath)
        }
        logv(verbose,'outputPath: ' + outputPath)
        logv(verbose,'framework: ' + framework)
        if (framework != 'extjs') {
          _prepareForBuild(app, vars, options, outputPath, compilation)
        }
        var command = ''
        if (options.watch == 'yes' && vars.production == false)
          {command = 'watch'}
        else
          {command = 'build'}
        if (vars.rebuild == true) {
          var parms = []
          if(!Array.isArray(options.cmdopts)){
            options.cmdopts = options.cmdopts.split(' ')
          }
          if (options.profile == undefined || options.profile == '' || options.profile == null) {
            if (command == 'build')
              { parms = ['app', command, options.buildEnvironment] }
            else
              { parms = ['app', command, '--web-server', 'false', options.buildEnvironment] }
          }
          else {
            if (command == 'build')
              {parms = ['app', command, options.profile, options.buildEnvironment]}
            else
              {parms = ['app', command, '--web-server', 'false', options.profile, options.buildEnvironment]}
          }
          options.cmdopts.forEach(function(element){
              parms.splice(parms.indexOf(command)+1, 0, element);
          })
          // if (vars.watchStarted == false) {
          //   await _buildExtBundle(app, compilation, outputPath, parms, vars, options)
          //   vars.watchStarted = true
          // }
          if (vars.watchStarted == false) {
            await _buildExtBundle(app, compilation, outputPath, parms, vars, options)
            if (command == 'watch') {
              vars.watchStarted = true
            }
            else {
              vars.callback()
            }
          }
          //mjg
          else {
            vars.callback()
          }
          //mjg
        }
        else {
          vars.callback()
        }
      }
      else {
        logv(verbose,'NOT running emit')
        vars.callback()
      }
    }
    else {
      logv(verbose,'emit is no')
      vars.callback()
    }
  }
  catch(e) {
    vars.callback()
    throw '_emit: ' + e.toString()
  }
}

//**********
export function _done(stats, vars, options) {
  try {
    var verbose = options.verbose
    var framework = options.framework
    logv(verbose,'FUNCTION _done')
    if (stats.compilation.errors && stats.compilation.errors.length) // && process.argv.indexOf('--watch') == -1)
    {
      var chalk = require('chalk');
      console.log(chalk.red('******************************************'));
      console.log(stats.compilation.errors[0]);
      console.log(chalk.red('******************************************'));
      //process.exit(0);
    }

    //mjg refactor
    if (vars.production == true && options.treeshake == 'no' && framework == 'angular') {
      require(`./${options.framework}Util`)._toDev(vars, options)
    }
    try {
      if(options.browser == 'yes' && options.watch == 'yes' && vars.production == false) {
        if (vars.browserCount == 0) {
          var url = 'http://localhost:' + options.port
          require('./pluginUtil').log(vars.app, `Opening browser at ${url}`)
          vars.browserCount++
          const opn = require('opn')
          opn(url)
        }
      }
    }
    catch (e) {
      console.log(e)
    }
    if (vars.buildstep == '1 of 1') {
      if (vars.production == true) {
        require('./pluginUtil').log(vars.app, `Ending production build for ${framework}`)
      }
      else if (vars.testing == true) {
        require('./pluginUtil').log(vars.app, `Ending testing build for ${framework}`)
      }
      else {
        require('./pluginUtil').log(vars.app, `Ending development build for ${framework}`)
      }
    }
    if (vars.buildstep == '2 of 2') {
      if(vars.testing == true){
        require('./pluginUtil').log(vars.app, `Ending testing build for ${framework}`)
      }
      require('./pluginUtil').log(vars.app, `Ending production build for ${framework}`)
    }
  }
  catch(e) {
//    require('./pluginUtil').logv(options.verbose,e)
    throw '_done: ' + e.toString()
  }
}

//**********
export function _prepareForBuild(app, vars, options, output, compilation) {
  try {
    var verbose = options.verbose
    var packages = options.packages
    var toolkit = options.toolkit
    var theme = options.theme
    logv(verbose,'FUNCTION _prepareForBuild')
    const rimraf = require('rimraf')
    const mkdirp = require('mkdirp')
    const fsx = require('fs-extra')
    const fs = require('fs')
    const path = require('path')
    theme = theme || (toolkit === 'classic' ? 'theme-triton' : 'theme-material')
    logv(verbose,'firstTime: ' + vars.firstTime)
    if (vars.firstTime) {
      rimraf.sync(output)
      mkdirp.sync(output)
      const buildXML = require('./artifacts').buildXML
      const createAppJson = require('./artifacts').createAppJson
      const createWorkspaceJson = require('./artifacts').createWorkspaceJson
      const createJSDOMEnvironment = require('./artifacts').createJSDOMEnvironment
      fs.writeFileSync(path.join(output, 'build.xml'), buildXML(vars.production, options, output), 'utf8')
      fs.writeFileSync(path.join(output, 'app.json'), createAppJson(theme, packages, toolkit, options, output), 'utf8')
      fs.writeFileSync(path.join(output, 'jsdom-environment.js'), createJSDOMEnvironment(options, output), 'utf8')
      fs.writeFileSync(path.join(output, 'workspace.json'), createWorkspaceJson(options, output), 'utf8')
      var framework = vars.framework;
      //because of a problem with colorpicker
      if (fs.existsSync(path.join(process.cwd(),`ext-${framework}/ux/`))) {
        var fromPath = path.join(process.cwd(), `ext-${framework}/ux/`)
        var toPath = path.join(output, 'ux')
        fsx.copySync(fromPath, toPath)
        log(app, 'Copying (ux) ' + fromPath.replace(process.cwd(), '') + ' to: ' + toPath.replace(process.cwd(), ''))
      }
      if (fs.existsSync(path.join(process.cwd(),`ext-${framework}/packages/`))) {
        var fromPath = path.join(process.cwd(), `ext-${framework}/packages/`)
        var toPath = path.join(output, 'packages')
        fsx.copySync(fromPath, toPath)
        log(app, 'Copying ' + fromPath.replace(process.cwd(), '') + ' to: ' + toPath.replace(process.cwd(), ''))
      }
      if (fs.existsSync(path.join(process.cwd(),`ext-${framework}/overrides/`))) {
        var fromPath = path.join(process.cwd(), `ext-${framework}/overrides/`)
        var toPath = path.join(output, 'overrides')
        fsx.copySync(fromPath, toPath)
        log(app, 'Copying ' + fromPath.replace(process.cwd(), '') + ' to: ' + toPath.replace(process.cwd(), ''))
      }
      if (fs.existsSync(path.join(process.cwd(),'resources/'))) {
        var fromResources = path.join(process.cwd(), 'resources/')
        var toResources = path.join(output, '../resources')
        fsx.copySync(fromResources, toResources)
        log(app, 'Copying ' + fromResources.replace(process.cwd(), '') + ' to: ' + toResources.replace(process.cwd(), ''))
      }
    }
    vars.firstTime = false
    var js = ''
    if (vars.production) {
      vars.deps = vars.deps.filter(function(value, index){ return vars.deps.indexOf(value) == index });
      js = vars.deps.join(';\n');
    }
    else {
      js = `Ext.require(["Ext.*","Ext.data.TreeStore"])`
    }
    js = `Ext.require(["Ext.*","Ext.data.TreeStore"])`; //for now
    if (vars.manifest === null || js !== vars.manifest) {
      vars.manifest = js + ';\nExt.require(["Ext.layout.*"]);\n';
      const manifest = path.join(output, 'manifest.js')
      fs.writeFileSync(manifest, vars.manifest, 'utf8')
      vars.rebuild = true
      var bundleDir = output.replace(process.cwd(), '')
      if (bundleDir.trim() == '') {bundleDir = './'}
      log(app, 'Building Ext bundle at: ' + bundleDir)
    }
    else {
      vars.rebuild = false
      log(app, 'Ext rebuild NOT needed')
    }
  }
  catch(e) {
    require('./pluginUtil').logv(options.verbose,e)
    compilation.errors.push('_prepareForBuild: ' + e)
  }
}

//**********
export function _buildExtBundle(app, compilation, outputPath, parms, vars, options) {
  var verbose = options.verbose
  const fs = require('fs')
  logv(verbose,'FUNCTION _buildExtBundle')
  let sencha; try { sencha = require('@sencha/cmd') } catch (e) { sencha = 'sencha' }
  if (fs.existsSync(sencha)) {
    logv(verbose,'sencha folder exists')
  }
  else {
    logv(verbose,'sencha folder DOES NOT exist')
  }
  return new Promise((resolve, reject) => {
    const onBuildDone = () => {
      logv(verbose,'onBuildDone')
      resolve()
    }
    var opts = { cwd: outputPath, silent: true, stdio: 'pipe', encoding: 'utf-8'}
    _executeAsync(app, sencha, parms, opts, compilation, vars, options).then (
      function() { onBuildDone() },
      function(reason) { reject(reason) }
    )
  })
}

//**********
export async function _executeAsync (app, command, parms, opts, compilation, vars, options) {
  var verbose = options.verbose
  var framework = options.framework
  //const DEFAULT_SUBSTRS = ['[INF] Loading', '[INF] Processing', '[LOG] Fashion build complete', '[ERR]', '[WRN]', "[INF] Server", "[INF] Writing", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"];
  const DEFAULT_SUBSTRS = ["[INF] xServer", '[INF] Loading', '[INF] Append', '[INF] Processing', '[INF] Processing Build', '[LOG] Fashion build complete', '[ERR]', '[WRN]', "[INF] Writing", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"];
  var substrings = DEFAULT_SUBSTRS
  var chalk = require('chalk')
  const crossSpawn = require('cross-spawn-with-kill')
  logv(verbose, 'FUNCTION _executeAsync')
  await new Promise((resolve, reject) => {
    logv(verbose,`command - ${command}`)
    logv(verbose, `parms - ${parms}`)
    logv(verbose, `opts - ${JSON.stringify(opts)}`)
    vars.child = crossSpawn(command, parms, opts)

    vars.child.on('close', (code, signal) => {
      logv(verbose, `on close: ` + code)
      if(code === 0) { resolve(0) }
      else { compilation.errors.push( new Error(code) ); resolve(0) }
    })
    vars.child.on('error', (error) => {
      logv(verbose, `on error`)
      compilation.errors.push(error)
      resolve(0)
    })
    vars.child.stdout.on('data', (data) => {
      var str = data.toString().replace(/\r?\n|\r/g, " ").trim()
      logv(verbose, `${str}`)
      //if (data && data.toString().match(/Fashion waiting for changes\.\.\./)) {
      if (data && data.toString().match(/aiting for changes\.\.\./)) {

//           const fs = require('fs');
//           var filename = process.cwd() + vars.touchFile;
//           try {
//             var d = new Date().toLocaleString()
//             var data = fs.readFileSync(filename);
//             fs.writeFileSync(filename, '//' + d, 'utf8');
//             logv(app, `touching ${filename}`);
//           }
//           catch(e) {
//             logv(app, `NOT touching ${filename}`);
//           }

        str = str.replace("[INF]", "")
        str = str.replace("[LOG]", "")
        str = str.replace(process.cwd(), '').trim()
        if (str.includes("[ERR]")) {
          compilation.errors.push(app + str.replace(/^\[ERR\] /gi, ''));
          str = str.replace("[ERR]", `${chalk.red("[ERR]")}`)
        }
        log(app, str)

        vars.callback()
        resolve(0)
      }
      else {
        if (substrings.some(function(v) { return data.indexOf(v) >= 0; })) {
          str = str.replace("[INF]", "")
          str = str.replace("[LOG]", "")
          str = str.replace(process.cwd(), '').trim()
          if (str.includes("[ERR]")) {
            compilation.errors.push(app + str.replace(/^\[ERR\] /gi, ''));
            str = str.replace("[ERR]", `${chalk.red("[ERR]")}`)
          }
          log(app, str)
        }
      }
    })
    vars.child.stderr.on('data', (data) => {
      logv(options, `error on close: ` + data)
      var str = data.toString().replace(/\r?\n|\r/g, " ").trim()
      var strJavaOpts = "Picked up _JAVA_OPTIONS";
      var includes = str.includes(strJavaOpts)
      if (!includes) {
        console.log(`${app} ${chalk.red("[ERR]")} ${str}`)
      }
    })
  })
}

//**********
function runScript(scriptPath, callback) {
  var childProcess = require('child_process');
  // keep track of whether callback has been invoked to prevent multiple invocations
  var invoked = false;
  var process = childProcess.fork(scriptPath, [], { execArgv : ['--inspect=0'] });
  // listen for errors as they may prevent the exit event from firing
  process.on('error', function (err) {
    if (invoked) return;
    invoked = true;
    callback(err);
  });
  // execute the callback once the process has finished running
  process.on('exit', function (code) {
    if (invoked) return;
    invoked = true;
    var err = code === 0 ? null : new Error('exit code ' + code);
    callback(err);
  });
}

//**********
export function _toXtype(str) {
  return str.toLowerCase().replace(/_/g, '-')
}

//**********
export function _getApp() {
  var chalk = require('chalk')
  var prefix = ``
  const platform = require('os').platform()
  if (platform == 'darwin') { prefix = `ℹ ｢ext｣:` }
  else { prefix = `i [ext]:` }
  return `${chalk.green(prefix)} `
}

//**********
export function _getVersions(pluginName, frameworkName) {
try {
  const path = require('path')
  const fs = require('fs')
  var v = {}
  var frameworkInfo = 'n/a'

  v.pluginVersion = 'n/a';
  v.extVersion = 'n/a';
  v.edition = 'n/a';
  v.cmdVersion = 'n/a';
  v.webpackVersion = 'n/a';

  var pluginPath = path.resolve(process.cwd(),'node_modules/@sencha', pluginName)
  var pluginPkg = (fs.existsSync(pluginPath+'/package.json') && JSON.parse(fs.readFileSync(pluginPath+'/package.json', 'utf-8')) || {});
  v.pluginVersion = pluginPkg.version
  v._resolved = pluginPkg._resolved
  if (v._resolved == undefined) {
    v.edition = `Commercial`
  }
  else {
    if (-1 == v._resolved.indexOf('community')) {
      v.edition = `Commercial`
    }
    else {
      v.edition = `Community`
    }
  }
  var webpackPath = path.resolve(process.cwd(),'node_modules/webpack')
  var webpackPkg = (fs.existsSync(webpackPath+'/package.json') && JSON.parse(fs.readFileSync(webpackPath+'/package.json', 'utf-8')) || {});
  v.webpackVersion = webpackPkg.version
  var extPath = path.resolve(process.cwd(),'node_modules/@sencha/ext')
  var extPkg = (fs.existsSync(extPath+'/package.json') && JSON.parse(fs.readFileSync(extPath+'/package.json', 'utf-8')) || {});
  v.extVersion = extPkg.sencha.version
  var cmdPath = path.resolve(process.cwd(),`node_modules/@sencha/cmd`)
  var cmdPkg = (fs.existsSync(cmdPath+'/package.json') && JSON.parse(fs.readFileSync(cmdPath+'/package.json', 'utf-8')) || {});
  v.cmdVersion = cmdPkg.version_full
  if (v.cmdVersion == undefined) {
    var cmdPath = path.resolve(process.cwd(),`node_modules/@sencha/${pluginName}/node_modules/@sencha/cmd`)
    var cmdPkg = (fs.existsSync(cmdPath+'/package.json') && JSON.parse(fs.readFileSync(cmdPath+'/package.json', 'utf-8')) || {});
    v.cmdVersion = cmdPkg.version_full
  }

   if (frameworkName != undefined && frameworkName != 'extjs') {
    var frameworkPath = ''
    if (frameworkName == 'react') {
      frameworkPath = path.resolve(process.cwd(),'node_modules/react')
    }
    if (frameworkName == 'angular') {
      frameworkPath = path.resolve(process.cwd(),'node_modules/@angular/core')
    }
    var frameworkPkg = (fs.existsSync(frameworkPath+'/package.json') && JSON.parse(fs.readFileSync(frameworkPath+'/package.json', 'utf-8')) || {});
    v.frameworkVersion = frameworkPkg.version
    if (v.frameworkVersion == undefined) {
      frameworkInfo = ', ' + frameworkName
    }
    else {
      frameworkInfo = ', ' + frameworkName + ' v' + v.frameworkVersion
    }
  }
  return 'ext-webpack-plugin v' + v.pluginVersion + ', Ext JS v' + v.extVersion + ' ' + v.edition + ' Edition, Sencha Cmd v' + v.cmdVersion + ', webpack v' + v.webpackVersion + frameworkInfo

}
catch (e) {
  return 'ext-webpack-plugin v' + v.pluginVersion + ', Ext JS v' + v.extVersion + ' ' + v.edition + ' Edition, Sencha Cmd v' + v.cmdVersion + ', webpack v' + v.webpackVersion + frameworkInfo
}

}

//**********
export function log(app,message) {
  var s = app + message
  require('readline').cursorTo(process.stdout, 0)
  try {process.stdout.clearLine()}catch(e) {}
  process.stdout.write(s);process.stdout.write('\n')
}

//**********
export function logh(app,message) {
  var h = false
  var s = app + message
  if (h == true) {
    require('readline').cursorTo(process.stdout, 0)
    try {
      process.stdout.clearLine()
    }
    catch(e) {}
    process.stdout.write(s)
    process.stdout.write('\n')
  }
}

//**********
export function logv(verbose, s) {
  if (verbose == 'yes') {
    require('readline').cursorTo(process.stdout, 0)
    try {
      process.stdout.clearLine()
    }
    catch(e) {}
    process.stdout.write(`-verbose: ${s}`)
    process.stdout.write('\n')
  }
}

function _getValidateOptions() {
  return {
    "type": "object",
    "properties": {
      "framework": {
        "type": ["string"]
      },
      "toolkit": {
        "type": ["string"]
      },
      "theme": {
        "type": ["string"]
      },
      "emit": {
        "errorMessage": "should be 'yes' or 'no' string value (NOT true or false)",
        "type": ["string"]
      },
      "script": {
        "type": ["string"]
      },
      "port": {
        "type": ["integer"]
      },
      "packages": {
        "type": ["string", "array"]
      },
      "profile": {
        "type": ["string"]
      },
      "environment": {
        "errorMessage": "should be 'development' or 'production' string value",
        "type": ["string"]
      },
      "treeshake": {
        "errorMessage": "should be 'yes' or 'no' string value (NOT true or false)",
        "type": ["string"]
      },
      "browser": {
        "errorMessage": "should be 'yes' or 'no' string value (NOT true or false)",
        "type": ["string"]
      },
      "watch": {
        "errorMessage": "should be 'yes' or 'no' string value (NOT true or false)",
        "type": ["string"]
      },
      "verbose": {
        "errorMessage": "should be 'yes' or 'no' string value (NOT true or false)",
        "type": ["string"]
      },
      "inject": {
        "errorMessage": "should be 'yes' or 'no' string value (NOT true or false)",
        "type": ["string"]
      },
      "intellishake": {
        "errorMessage": "should be 'yes' or 'no' string value (NOT true or false)",
        "type": ["string"]
      },
      "cmdopts": {
        "errorMessage": "should be a sencha cmd option or argument string",
        "type": ["string", "array"]
      }
    },
    "additionalProperties": false
  };
}


function _getDefaultOptions() {
  return {
    framework: 'extjs',
    toolkit: 'modern',
    theme: 'theme-material',
    emit: 'yes',
    script: null,
    port: 1962,
    packages: [],

    profile: '',
    environment: 'development',
    treeshake: 'no',
    browser: 'yes',
    watch: 'yes',
    verbose: 'no',
    inject: 'yes',
    intellishake: 'yes',
    cmdopts: ''
  }
}

export function smartFlowPing(packageJsonPath, appJsonPath) {
  const { exec } = require('child_process');
  const path = require('path');
  const fs = require('fs');

  fs.readFile(packageJsonPath, 'utf8', (errPackage, dataPackage) => {
    if (errPackage) {
      console.error('Error reading package.json:', errPackage);
      return;
    }

    const packageJson = JSON.parse(dataPackage);

    fs.readFile(appJsonPath, 'utf8', (errApp, dataApp) => {
      if (errApp) {
        console.error('Error reading app.json:', errApp);
        return;
      }


      console.log("reading the file")
      const appJson = JSON.parse(dataApp);
      const requiresArray = appJson.requires;// Assuming appJson.requires is an array

      // Convert the array to a string
      const modifiedString = requiresArray[0].replace(/[\[\]']+/g, '');

      const homeDirectory = process.env.HOME || process.env.USERPROFILE;

      // Specify the relative path from the home directory to your file
      const relativeFilePath = '.npmrc';

      // Combine the home directory and relative file path to get the generalized file path
      const filePath = path.join(homeDirectory, relativeFilePath);

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading file: ${err.message}`);
          return;
        }
        const registryRegex = /@sencha:registry=(.+)/;

        // Extract the registry URL using the regular expression
        const match = data.match(registryRegex);

        // Check if a match is found
        if (match && match[1]) {
          const registryUrl = match[1];
          // Use npm-config to set the registry temporarily for the current process
          process.env.npm_config_registry = registryUrl;

          // Run the npm whoami command
          exec(`npm --registry ${registryUrl} whoami`, (error, stdout, stderr) => {
            if (error) {
              return;
            }

            const username = `${stdout.trim().replace('..', '@')}`;

            const scriptType = process.env.npm_lifecycle_event;
                      let triggerevent = 'build';
            
                      if (scriptType === 'dev') {
                        console.log('Running on npm start');
                        triggerevent = `npm start`;
                        // Additional code for npm start
                      } else if (scriptType === 'build') {
                        console.log('Running on npm run build');
                        triggerevent = `npm run build`;
                        // Additional code for npm run build
                      } else {
                        console.log('Unknown script type');
                      }

            const licenseinfo = `"license=Commercial, framework=EXTJS, License Content Text=Sencha RapidExtJS-JavaScript Library Copyright, Sencha Inc. All rights reserved. licensing@sencha.com options:http://www.sencha.com/license license: http://www.sencha.com/legal/sencha-software-license-agreement Commercial License.-----------------------------------------------------------------------------------------Sencha RapidExtJS is licensed commercially. See http://www.sencha.com/legal/sencha-software-license-agreement for license terms.Beta License------------------------------------------------------------------------------------------ If this is a Beta version , use is permitted for internal evaluation and review purposes and not use for production purposes. See http://www.sencha.com/legal/sencha-software-license-agreement (Beta License) for license terms.  Third Party Content------------------------------------------------------------------------------------------The following third party software is distributed with RapidExtJS and is provided under other licenses and/or has source available from other locations. Library: YUI 0.6 (BSD Licensed) for drag-and-drop code. Location: http://developer.yahoo.com/yui License: http://developer.yahoo.com/yui/license.html (BSD 3-Clause License) Library: JSON parser Location: http://www.JSON.org/js.html License: http://www.json.org/license.html (MIT License) Library: flexible-js-formatting Location: http://code.google.com/p/flexible-js-formatting/ License: http://www.opensource.org/licenses/mit-license.php (MIT License) Library: sparkline.js Location: http://omnipotent.net/jquery.sparkline License  http://omnipotent.net/jquery.sparkline (BSD 3-Clause License) Library: DeftJS Location: http://deftjs.org/ License: http://www.opensource.org/licenses/mit-license.php (MIT License) Library: Open-Sans Location: http://www.fontsquirrel.com/fonts/open-sans License:  http://www.fontsquirrel.com/fonts/open-sans (Apache 2.0 License) Examples: Library: Silk Icons Location: http://www.famfamfam.com/lab/icons/silk/ License: http://www.famfamfam.com/lab/icons/silk/ (Creative Commons Attribution 2.5 License) Library: Font Awesome CSS Location: http://fontawesome.io/ License: http://fontawesome.io/3.2.1/license/ (MIT) Library: Material Design Icons Location: https://github.com/google/material-design-icons License: https://github.com/google/material-design-icons/blob/master/LICENSE (Apache) THIS SOFTWARE IS DISTRIBUTED 'AS-IS' WITHOUT ANY WARRANTIES, CONDITIONS AND REPRESENTATIONS WHETHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION THE IMPLIED WARRANTIES AND CONDITIONS OF MERCHANTABILITY, MERCHANTABLE QUALITY, FITNESS FOR A PARTICULAR PURPOSE, DURABILITY, NON-INFRINGEMENT, PERFORMANCE AND THOSE ARISING BY STATUTE OR FROM CUSTOM OR USAGE OF TRADE OR COURSE OF DEALING. , message=This version of Sencha RapidExtJS is licensed commercially "`;
            const jarPath = path.join(__dirname, '..', 'resources', 'utils.jar');
          

              const command = `java -jar ${jarPath} ` +
      `-product ext-gen -productVersion ${packageJson.version} ` +
      `-eventType LEGAL -trigger ${triggerevent} ` +
      `-licensedTo ${username} ` +
      `-additionalLicenseInfo hello12 -validLicenseInfo ${licenseinfo} -featuresUsed ${modifiedString}`;

              console.log(command)
            exec(command, (error, stdout, stderr) => {
              if (error) {
                console.log(error)
                return;
              }

              if (stderr) {
                console.log(stderr)
                return;
              }

            });
          });
        } else {
          console.error('Registry URL not found in the data.');
        }
      });
    });
  });
}
