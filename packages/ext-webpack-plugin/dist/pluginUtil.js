"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._constructor = _constructor;
exports._thisCompilation = _thisCompilation;
exports._compilation = _compilation;
exports._afterCompile = _afterCompile;
exports._emit = _emit;
exports._prepareForBuild = _prepareForBuild;
exports._buildExtBundle = _buildExtBundle;
exports._done = _done;
exports.executeAsync = executeAsync;
exports._getApp = _getApp;
exports._getVersions = _getVersions;
exports.log = log;
exports.logh = logh;
exports.logv = logv;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//**********
function _constructor(options) {
  const fs = require('fs');

  var thisVars = {};
  var thisOptions = {};
  var plugin = {};

  try {
    if (options.framework == undefined) {
      thisVars.pluginErrors = [];
      thisVars.pluginErrors.push('webpack config: framework parameter on ext-webpack-plugin is not defined - values: react, angular, extjs, components');
      plugin.vars = thisVars;
      return plugin;
    }

    var framework = options.framework;
    var treeshake = options.treeshake;

    const validateOptions = require('schema-utils');

    validateOptions(require(`./${framework}Util`).getValidateOptions(), options, '');
    const rc = fs.existsSync(`.ext-${framework}rc`) && JSON.parse(fs.readFileSync(`.ext-${options.framework}rc`, 'utf-8')) || {};
    thisOptions = _objectSpread({}, require(`./${framework}Util`).getDefaultOptions(), options, rc);
    thisVars = require(`./${framework}Util`).getDefaultVars();
    thisVars.pluginName = 'ext-webpack-plugin';
    thisVars.app = require('./pluginUtil')._getApp();
    logh(thisVars.app + `HOOK constructor`);
    logv(thisOptions, `pluginName - ${thisVars.pluginName}`);
    logv(thisOptions, `thisVars.app - ${thisVars.app}`); // const rc = (fs.existsSync(`.ext-${thisVars.framework}rc`) && JSON.parse(fs.readFileSync(`.ext-${thisVars.framework}rc`, 'utf-8')) || {})
    // thisOptions = { ...require(`./${thisVars.framework}Util`).getDefaultOptions(), ...options, ...rc }

    logv(thisOptions, `thisOptions - ${JSON.stringify(thisOptions)}`);

    if (thisOptions.environment == 'production') {
      thisVars.production = true;
    } else {
      thisVars.production = false;
    }

    logv(thisOptions, `thisVars - ${JSON.stringify(thisVars)}`);

    if (thisVars.production == true && treeshake == true && (framework == 'angular' || framework == 'components')) {
      log(thisVars.app + 'Starting Production Build - Step 1');
      thisVars.buildstep = 1;

      require(`./${framework}Util`)._toProd(thisVars, thisOptions);
    }

    if (thisVars.production == true && treeshake == false && (framework == 'angular' || framework == 'components')) {
      //mjg log(thisVars.app + '(check for prod folder and module change)')
      log(thisVars.app + 'Starting Production Build - Step 2');
      thisVars.buildstep = 2;
    }

    if (thisVars.buildstep == 0) {
      log(thisVars.app + 'Starting Development Build');
    } //mjg log(require('./pluginUtil')._getVersions(thisVars.app, thisVars.pluginName, framework))


    logv(thisVars.app + 'Building for ' + thisOptions.environment + ', ' + 'Treeshake is ' + thisOptions.treeshake);
    plugin.vars = thisVars;
    plugin.options = thisOptions;

    require('./pluginUtil').logv(thisOptions, 'FUNCTION _constructor');

    return plugin;
  } catch (e) {
    console.log(e);
  }
} //**********


function _thisCompilation(compiler, compilation, vars, options) {
  try {
    require('./pluginUtil').logv(options, 'FUNCTION _thisCompilation');

    require('./pluginUtil').logv(options + `options.script: ${options.script}`);

    require('./pluginUtil').logv(options + `buildstep: ${vars.buildstep}`);

    if (vars.buildstep == 0 || vars.buildstep == 1) {
      if (options.script != undefined) {
        if (options.script != null) {
          runScript(options.script, function (err) {
            if (err) throw err;

            require('./pluginUtil').logv(options + `Finished running ${options.script}`);
          });
        }
      } else {
        require('./pluginUtil').logv(options + `options.script: ${options.script}`);

        require('./pluginUtil').logv(options + `buildstep: ${vars.buildstep}`);
      }
    }
  } catch (e) {
    require('./pluginUtil').logv(options, e);

    compilation.errors.push('_thisCompilation: ' + e);
  }
} //**********


function _compilation(compiler, compilation, vars, options) {
  try {
    require('./pluginUtil').logv(options, 'FUNCTION _compilation');

    if (options.framework != 'extjs') {
      var extComponents = [];

      if (vars.production) {
        if ((options.framework == 'angular' || options.framework == 'components') && options.treeshake == true) {
          extComponents = require(`./${options.framework}Util`)._getAllComponents(vars, options);
        }

        compilation.hooks.succeedModule.tap(`ext-succeed-module`, module => {
          if (module.resource && !module.resource.match(/node_modules/)) {
            if (module.resource.match(/\.html$/) != null) {
              if (module._source._value.toLowerCase().includes('doctype html') == false) {
                vars.deps = [...(vars.deps || []), ...require(`./${options.framework}Util`)._extractFromSource(module, options, compilation, extComponents)];
              }
            } else {
              vars.deps = [...(vars.deps || []), ...require(`./${options.framework}Util`)._extractFromSource(module, options, compilation, extComponents)];
            }
          }
        });

        if ((options.framework == 'angular' || options.framework == 'components') && options.treeshake == true) {
          compilation.hooks.finishModules.tap(`ext-finish-modules`, modules => {
            require(`./${options.framework}Util`)._writeFilesToProdFolder(vars, options);
          });
        }
      }

      if (vars.buildstep != 1) {
        compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tap(`ext-html-generation`, data => {
          logv(options, 'htmlWebpackPluginBeforeHtmlGeneration');

          const path = require('path');

          var jsPath = path.join(vars.extPath, 'ext.js');
          var cssPath = path.join(vars.extPath, 'ext.css');
          data.assets.js.unshift(jsPath);
          data.assets.css.unshift(cssPath);
          log(vars.app + `Adding ${jsPath} and ${cssPath} to index.html`);
        });
      }
    }
  } catch (e) {
    require('./pluginUtil').logv(options, e);

    compilation.errors.push('_compilation: ' + e);
  }
} //**********


function _afterCompile(compiler, compilation, vars, options) {
  require('./pluginUtil').logv(options, 'FUNCTION _afterCompile');

  if (options.framework == 'extjs') {
    require(`./extjsUtil`)._afterCompile(compilation, vars, options);
  }
} //**********


function _emit(_x, _x2, _x3, _x4, _x5) {
  return _emit2.apply(this, arguments);
} //**********


function _emit2() {
  _emit2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(compiler, compilation, vars, options, callback) {
    var log, logv, emit, treeshake, framework, environment, app, path, _buildExtBundle, outputPath, command, parms;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          log = require('./pluginUtil').log;
          logv = require('./pluginUtil').logv;
          logv(options, 'FUNCTION _emit');
          emit = options.emit;
          treeshake = options.treeshake;
          framework = options.framework;
          environment = options.environment;

          if (!emit) {
            _context.next = 38;
            break;
          }

          if (!(environment == 'production' && treeshake == true && framework == 'angular' || environment != 'production' && treeshake == false && framework == 'angular' || framework == 'react' || framework == 'components')) {
            _context.next = 34;
            break;
          }

          app = vars.app;
          framework = vars.framework;
          path = require('path');
          _buildExtBundle = require('./pluginUtil')._buildExtBundle;
          outputPath = path.join(compiler.outputPath, vars.extPath);

          if (compiler.outputPath === '/' && compiler.options.devServer) {
            outputPath = path.join(compiler.options.devServer.contentBase, outputPath);
          }

          logv(options, 'outputPath: ' + outputPath);
          logv(options, 'framework: ' + framework);

          if (framework != 'extjs') {
            _prepareForBuild(app, vars, options, outputPath, compilation);
          } else {
            if (options.framework == 'angular' && options.treeshake == false) {
              require(`./${framework}Util`)._prepareForBuild(app, vars, options, outputPath, compilation);
            } else {
              require(`./${framework}Util`)._prepareForBuild(app, vars, options, outputPath, compilation);
            }
          }

          command = '';

          if (options.watch == 'yes' && vars.production == false) {
            command = 'watch';
          } else {
            command = 'build';
          }

          if (!(vars.rebuild == true)) {
            _context.next = 31;
            break;
          }

          parms = [];

          if (options.profile == undefined || options.profile == '' || options.profile == null) {
            if (command == 'build') {
              parms = ['app', command, options.environment];
            } else {
              parms = ['app', command, '--web-server', 'false', options.environment];
            }
          } else {
            if (command == 'build') {
              parms = ['app', command, options.profile, options.environment];
            } else {
              parms = ['app', command, '--web-server', 'false', options.profile, options.environment];
            }
          }

          if (!(vars.watchStarted == false)) {
            _context.next = 28;
            break;
          }

          _context.next = 27;
          return _buildExtBundle(app, compilation, outputPath, parms, options);

        case 27:
          vars.watchStarted = true;

        case 28:
          callback();
          _context.next = 32;
          break;

        case 31:
          callback();

        case 32:
          _context.next = 36;
          break;

        case 34:
          logv(options, 'NOT running emit');
          callback();

        case 36:
          _context.next = 40;
          break;

        case 38:
          logv(options, 'emit is false');
          callback();

        case 40:
          _context.next = 47;
          break;

        case 42:
          _context.prev = 42;
          _context.t0 = _context["catch"](0);

          require('./pluginUtil').logv(options, _context.t0);

          compilation.errors.push('emit: ' + _context.t0);
          callback();

        case 47:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 42]]);
  }));
  return _emit2.apply(this, arguments);
}

function _prepareForBuild(app, vars, options, output, compilation) {
  try {
    logv(options, 'FUNCTION _prepareForBuild');

    const rimraf = require('rimraf');

    const mkdirp = require('mkdirp');

    const fsx = require('fs-extra');

    const fs = require('fs');

    const path = require('path');

    var packages = options.packages;
    var toolkit = options.toolkit;
    var theme = options.theme;
    theme = theme || (toolkit === 'classic' ? 'theme-triton' : 'theme-material');
    logv(options, 'firstTime: ' + vars.firstTime);

    if (vars.firstTime) {
      rimraf.sync(output);
      mkdirp.sync(output);

      const buildXML = require('./artifacts').buildXML;

      const createAppJson = require('./artifacts').createAppJson;

      const createWorkspaceJson = require('./artifacts').createWorkspaceJson;

      const createJSDOMEnvironment = require('./artifacts').createJSDOMEnvironment;

      fs.writeFileSync(path.join(output, 'build.xml'), buildXML(vars.production, options, output), 'utf8');
      fs.writeFileSync(path.join(output, 'app.json'), createAppJson(theme, packages, toolkit, options, output), 'utf8');
      fs.writeFileSync(path.join(output, 'jsdom-environment.js'), createJSDOMEnvironment(options, output), 'utf8');
      fs.writeFileSync(path.join(output, 'workspace.json'), createWorkspaceJson(options, output), 'utf8');
      var framework = vars.framework; //because of a problem with colorpicker

      if (fs.existsSync(path.join(process.cwd(), `ext-${framework}/ux/`))) {
        var fromPath = path.join(process.cwd(), `ext-${framework}/ux/`);
        var toPath = path.join(output, 'ux');
        fsx.copySync(fromPath, toPath);
        log(app + 'Copying (ux) ' + fromPath.replace(process.cwd(), '') + ' to: ' + toPath.replace(process.cwd(), ''));
      }

      if (fs.existsSync(path.join(process.cwd(), `ext-${framework}/packages/`))) {
        var fromPath = path.join(process.cwd(), `ext-${framework}/packages/`);
        var toPath = path.join(output, 'packages');
        fsx.copySync(fromPath, toPath);
        log(app + 'Copying ' + fromPath.replace(process.cwd(), '') + ' to: ' + toPath.replace(process.cwd(), ''));
      }

      if (fs.existsSync(path.join(process.cwd(), `ext-${framework}/overrides/`))) {
        var fromPath = path.join(process.cwd(), `ext-${framework}/overrides/`);
        var toPath = path.join(output, 'overrides');
        fsx.copySync(fromPath, toPath);
        log(app + 'Copying ' + fromPath.replace(process.cwd(), '') + ' to: ' + toPath.replace(process.cwd(), ''));
      }

      if (fs.existsSync(path.join(process.cwd(), 'resources/'))) {
        var fromResources = path.join(process.cwd(), 'resources/');
        var toResources = path.join(output, '../resources');
        fsx.copySync(fromResources, toResources);
        log(app + 'Copying ' + fromResources.replace(process.cwd(), '') + ' to: ' + toResources.replace(process.cwd(), ''));
      }
    }

    vars.firstTime = false;
    var js = '';

    if (vars.production) {
      js = vars.deps.join(';\n');
    } else {
      js = 'Ext.require("Ext.*")';
    }

    if (vars.manifest === null || js !== vars.manifest) {
      vars.manifest = js;
      const manifest = path.join(output, 'manifest.js');
      fs.writeFileSync(manifest, js, 'utf8');
      vars.rebuild = true;
      var bundleDir = output.replace(process.cwd(), '');

      if (bundleDir.trim() == '') {
        bundleDir = './';
      }

      log(app + 'Building Ext bundle at: ' + bundleDir);
    } else {
      vars.rebuild = false;
      log(app + 'Ext rebuild NOT needed');
    }
  } catch (e) {
    require('./pluginUtil').logv(options, e);

    compilation.errors.push('_prepareForBuild: ' + e);
  }
} //**********


function _buildExtBundle(app, compilation, outputPath, parms, options) {
  try {
    const fs = require('fs');

    const logv = require('./pluginUtil').logv;

    logv(options, 'FUNCTION _buildExtBundle');
    let sencha;

    try {
      sencha = require('@sencha/cmd');
    } catch (e) {
      sencha = 'sencha';
    }

    if (fs.existsSync(sencha)) {
      logv(options, 'sencha folder exists');
    } else {
      logv(options, 'sencha folder DOES NOT exist');
    }

    return new Promise((resolve, reject) => {
      const onBuildDone = () => {
        logv(options, 'onBuildDone');
        resolve();
      };

      var opts = {
        cwd: outputPath,
        silent: true,
        stdio: 'pipe',
        encoding: 'utf-8'
      };
      executeAsync(app, sencha, parms, opts, compilation, options).then(function () {
        onBuildDone();
      }, function (reason) {
        reject(reason);
      });
    });
  } catch (e) {
    console.log('e');

    require('./pluginUtil').logv(options, e);

    compilation.errors.push('_buildExtBundle: ' + e);
    callback();
  }
} //**********


function _done(vars, options) {
  try {
    const log = require('./pluginUtil').log;

    const logv = require('./pluginUtil').logv;

    logv(options, 'FUNCTION _done');

    if (vars.production == true && options.treeshake == false && options.framework == 'angular') {
      require(`./${options.framework}Util`)._toDev(vars, options);
    }

    try {
      if (options.browser == true && options.watch == 'yes' && vars.production == false) {
        if (vars.browserCount == 0) {
          var url = 'http://localhost:' + options.port;

          require('./pluginUtil').log(vars.app + `Opening browser at ${url}`);

          vars.browserCount++;

          const opn = require('opn');

          opn(url);
        }
      }
    } catch (e) {
      console.log(e); //compilation.errors.push('show browser window - ext-done: ' + e)
    }

    if (vars.buildstep == 0) {
      require('./pluginUtil').log(vars.app + `Ending Development Build`);
    }

    if (vars.buildstep == 2) {
      require('./pluginUtil').log(vars.app + `Ending Production Build`);
    }
  } catch (e) {
    require('./pluginUtil').logv(options, e);
  }
} //**********


function executeAsync(_x6, _x7, _x8, _x9, _x10, _x11) {
  return _executeAsync.apply(this, arguments);
} //**********


function _executeAsync() {
  _executeAsync = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(app, command, parms, opts, compilation, options) {
    var DEFAULT_SUBSTRS, substrings, chalk, crossSpawn, log;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          //const DEFAULT_SUBSTRS = ['[INF] Loading', '[INF] Processing', '[LOG] Fashion build complete', '[ERR]', '[WRN]', "[INF] Server", "[INF] Writing", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"];
          DEFAULT_SUBSTRS = ["[INF] xServer", '[INF] Loading', '[INF] Append', '[INF] Processing', '[INF] Processing Build', '[LOG] Fashion build complete', '[ERR]', '[WRN]', "[INF] Writing", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"];
          substrings = DEFAULT_SUBSTRS;
          chalk = require('chalk');
          crossSpawn = require('cross-spawn');
          log = require('./pluginUtil').log;
          logv(options, 'FUNCTION executeAsync');
          _context2.next = 9;
          return new Promise((resolve, reject) => {
            logv(options, `command - ${command}`);
            logv(options, `parms - ${parms}`);
            logv(options, `opts - ${JSON.stringify(opts)}`);
            let child = crossSpawn(command, parms, opts);
            child.on('close', (code, signal) => {
              logv(options, `on close: ` + code);

              if (code === 0) {
                resolve(0);
              } else {
                compilation.errors.push(new Error(code));
                resolve(0);
              }
            });
            child.on('error', error => {
              logv(options, `on error`);
              compilation.errors.push(error);
              resolve(0);
            });
            child.stdout.on('data', data => {
              var str = data.toString().replace(/\r?\n|\r/g, " ").trim();
              logv(options, `${str}`);

              if (data && data.toString().match(/Fashion waiting for changes\.\.\./)) {
                // const fs = require('fs');
                // var filename = process.cwd()+'/src/index.js';
                // var data = fs.readFileSync(filename);
                // fs.writeFileSync(filename, data + ' ', 'utf8')
                // logv(options, `touching ${filename}`)
                const fs = require('fs');

                var filename = process.cwd() + '/src/index.js';

                try {
                  var data = fs.readFileSync(filename);
                  fs.writeFileSync(filename, data + ' ', 'utf8');
                  log(options, `touching ${filename}`);
                } catch (e) {
                  log(options, `NOT touching ${filename}`);
                }

                resolve(0);
              } else {
                if (substrings.some(function (v) {
                  return data.indexOf(v) >= 0;
                })) {
                  str = str.replace("[INF]", "");
                  str = str.replace("[LOG]", "");
                  str = str.replace(process.cwd(), '').trim();

                  if (str.includes("[ERR]")) {
                    compilation.errors.push(app + str.replace(/^\[ERR\] /gi, ''));
                    str = str.replace("[ERR]", `${chalk.red("[ERR]")}`);
                  }

                  log(`${app}${str}`);
                }
              }
            });
            child.stderr.on('data', data => {
              logv(options, `error on close: ` + data);
              var str = data.toString().replace(/\r?\n|\r/g, " ").trim();
              var strJavaOpts = "Picked up _JAVA_OPTIONS";
              var includes = str.includes(strJavaOpts);

              if (!includes) {
                console.log(`${app} ${chalk.red("[ERR]")} ${str}`);
              }
            });
          });

        case 9:
          _context2.next = 16;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);

          require('./pluginUtil').logv(options, _context2.t0);

          compilation.errors.push('executeAsync: ' + _context2.t0);
          callback();

        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 11]]);
  }));
  return _executeAsync.apply(this, arguments);
}

function runScript(scriptPath, callback) {
  var childProcess = require('child_process'); // keep track of whether callback has been invoked to prevent multiple invocations


  var invoked = false;
  var process = childProcess.fork(scriptPath); // listen for errors as they may prevent the exit event from firing

  process.on('error', function (err) {
    if (invoked) return;
    invoked = true;
    callback(err);
  }); // execute the callback once the process has finished running

  process.on('exit', function (code) {
    if (invoked) return;
    invoked = true;
    var err = code === 0 ? null : new Error('exit code ' + code);
    callback(err);
  });
} //**********


function _getApp() {
  var chalk = require('chalk');

  var prefix = ``;

  const platform = require('os').platform();

  if (platform == 'darwin') {
    prefix = `ℹ ｢ext｣:`;
  } else {
    prefix = `i [ext]:`;
  }

  return `${chalk.green(prefix)} `;
} //**********


function _getVersions(app, pluginName, frameworkName) {
  const path = require('path');

  const fs = require('fs');

  var v = {};
  var pluginPath = path.resolve(process.cwd(), 'node_modules/@sencha', pluginName);
  var pluginPkg = fs.existsSync(pluginPath + '/package.json') && JSON.parse(fs.readFileSync(pluginPath + '/package.json', 'utf-8')) || {};
  v.pluginVersion = pluginPkg.version;
  v._resolved = pluginPkg._resolved;

  if (v._resolved == undefined) {
    v.edition = `Commercial`;
  } else {
    if (-1 == v._resolved.indexOf('community')) {
      v.edition = `Commercial`;
    } else {
      v.edition = `Community`;
    }
  }

  var webpackPath = path.resolve(process.cwd(), 'node_modules/webpack');
  var webpackPkg = fs.existsSync(webpackPath + '/package.json') && JSON.parse(fs.readFileSync(webpackPath + '/package.json', 'utf-8')) || {};
  v.webpackVersion = webpackPkg.version;
  var extPath = path.resolve(process.cwd(), 'node_modules/@sencha/ext');
  var extPkg = fs.existsSync(extPath + '/package.json') && JSON.parse(fs.readFileSync(extPath + '/package.json', 'utf-8')) || {};
  v.extVersion = extPkg.sencha.version;
  var cmdPath = path.resolve(process.cwd(), `node_modules/@sencha/cmd`);
  var cmdPkg = fs.existsSync(cmdPath + '/package.json') && JSON.parse(fs.readFileSync(cmdPath + '/package.json', 'utf-8')) || {};
  v.cmdVersion = cmdPkg.version_full;

  if (v.cmdVersion == undefined) {
    var cmdPath = path.resolve(process.cwd(), `node_modules/@sencha/${pluginName}/node_modules/@sencha/cmd`);
    var cmdPkg = fs.existsSync(cmdPath + '/package.json') && JSON.parse(fs.readFileSync(cmdPath + '/package.json', 'utf-8')) || {};
    v.cmdVersion = cmdPkg.version_full;
  }

  var frameworkInfo = '';

  if (frameworkName != undefined && frameworkName != 'extjs') {
    var frameworkPath = '';

    if (frameworkName == 'react') {
      frameworkPath = path.resolve(process.cwd(), 'node_modules/react');
    }

    if (frameworkName == 'angular') {
      frameworkPath = path.resolve(process.cwd(), 'node_modules/@angular/core');
    }

    var frameworkPkg = fs.existsSync(frameworkPath + '/package.json') && JSON.parse(fs.readFileSync(frameworkPath + '/package.json', 'utf-8')) || {};
    v.frameworkVersion = frameworkPkg.version;
    frameworkInfo = ', ' + frameworkName + ' v' + v.frameworkVersion;
  }

  return app + 'ext-webpack-plugin v' + v.pluginVersion + ', Ext JS v' + v.extVersion + ' ' + v.edition + ' Edition, Sencha Cmd v' + v.cmdVersion + ', webpack v' + v.webpackVersion + frameworkInfo;
} //**********


function log(s) {
  require('readline').cursorTo(process.stdout, 0);

  try {
    process.stdout.clearLine();
  } catch (e) {}

  process.stdout.write(s);
  process.stdout.write('\n');
} //**********


function logh(s) {
  var h = false;

  if (h == true) {
    require('readline').cursorTo(process.stdout, 0);

    try {
      process.stdout.clearLine();
    } catch (e) {}

    process.stdout.write(s);
    process.stdout.write('\n');
  }
} //**********


function logv(options, s) {
  if (options.verbose == 'yes') {
    require('readline').cursorTo(process.stdout, 0);

    try {
      process.stdout.clearLine();
    } catch (e) {}

    process.stdout.write(`-verbose: ${s}`);
    process.stdout.write('\n');
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJmcyIsInJlcXVpcmUiLCJ0aGlzVmFycyIsInRoaXNPcHRpb25zIiwicGx1Z2luIiwiZnJhbWV3b3JrIiwidW5kZWZpbmVkIiwicGx1Z2luRXJyb3JzIiwicHVzaCIsInZhcnMiLCJ0cmVlc2hha2UiLCJ2YWxpZGF0ZU9wdGlvbnMiLCJnZXRWYWxpZGF0ZU9wdGlvbnMiLCJyYyIsImV4aXN0c1N5bmMiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJnZXREZWZhdWx0T3B0aW9ucyIsImdldERlZmF1bHRWYXJzIiwicGx1Z2luTmFtZSIsImFwcCIsIl9nZXRBcHAiLCJsb2doIiwibG9ndiIsInN0cmluZ2lmeSIsImVudmlyb25tZW50IiwicHJvZHVjdGlvbiIsImxvZyIsImJ1aWxkc3RlcCIsIl90b1Byb2QiLCJlIiwiY29uc29sZSIsIl90aGlzQ29tcGlsYXRpb24iLCJjb21waWxlciIsImNvbXBpbGF0aW9uIiwic2NyaXB0IiwicnVuU2NyaXB0IiwiZXJyIiwiZXJyb3JzIiwiX2NvbXBpbGF0aW9uIiwiZXh0Q29tcG9uZW50cyIsIl9nZXRBbGxDb21wb25lbnRzIiwiaG9va3MiLCJzdWNjZWVkTW9kdWxlIiwidGFwIiwibW9kdWxlIiwicmVzb3VyY2UiLCJtYXRjaCIsIl9zb3VyY2UiLCJfdmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiZGVwcyIsIl9leHRyYWN0RnJvbVNvdXJjZSIsImZpbmlzaE1vZHVsZXMiLCJtb2R1bGVzIiwiX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIiLCJodG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uIiwiZGF0YSIsInBhdGgiLCJqc1BhdGgiLCJqb2luIiwiZXh0UGF0aCIsImNzc1BhdGgiLCJhc3NldHMiLCJqcyIsInVuc2hpZnQiLCJjc3MiLCJfYWZ0ZXJDb21waWxlIiwiX2VtaXQiLCJjYWxsYmFjayIsImVtaXQiLCJfYnVpbGRFeHRCdW5kbGUiLCJvdXRwdXRQYXRoIiwiZGV2U2VydmVyIiwiY29udGVudEJhc2UiLCJfcHJlcGFyZUZvckJ1aWxkIiwiY29tbWFuZCIsIndhdGNoIiwicmVidWlsZCIsInBhcm1zIiwicHJvZmlsZSIsIndhdGNoU3RhcnRlZCIsIm91dHB1dCIsInJpbXJhZiIsIm1rZGlycCIsImZzeCIsInBhY2thZ2VzIiwidG9vbGtpdCIsInRoZW1lIiwiZmlyc3RUaW1lIiwic3luYyIsImJ1aWxkWE1MIiwiY3JlYXRlQXBwSnNvbiIsImNyZWF0ZVdvcmtzcGFjZUpzb24iLCJjcmVhdGVKU0RPTUVudmlyb25tZW50Iiwid3JpdGVGaWxlU3luYyIsInByb2Nlc3MiLCJjd2QiLCJmcm9tUGF0aCIsInRvUGF0aCIsImNvcHlTeW5jIiwicmVwbGFjZSIsImZyb21SZXNvdXJjZXMiLCJ0b1Jlc291cmNlcyIsIm1hbmlmZXN0IiwiYnVuZGxlRGlyIiwidHJpbSIsInNlbmNoYSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25CdWlsZERvbmUiLCJvcHRzIiwic2lsZW50Iiwic3RkaW8iLCJlbmNvZGluZyIsImV4ZWN1dGVBc3luYyIsInRoZW4iLCJyZWFzb24iLCJfZG9uZSIsIl90b0RldiIsImJyb3dzZXIiLCJicm93c2VyQ291bnQiLCJ1cmwiLCJwb3J0Iiwib3BuIiwiREVGQVVMVF9TVUJTVFJTIiwic3Vic3RyaW5ncyIsImNoYWxrIiwiY3Jvc3NTcGF3biIsImNoaWxkIiwib24iLCJjb2RlIiwic2lnbmFsIiwiRXJyb3IiLCJlcnJvciIsInN0ZG91dCIsInN0ciIsInRvU3RyaW5nIiwiZmlsZW5hbWUiLCJzb21lIiwidiIsImluZGV4T2YiLCJyZWQiLCJzdGRlcnIiLCJzdHJKYXZhT3B0cyIsInNjcmlwdFBhdGgiLCJjaGlsZFByb2Nlc3MiLCJpbnZva2VkIiwiZm9yayIsInByZWZpeCIsInBsYXRmb3JtIiwiZ3JlZW4iLCJfZ2V0VmVyc2lvbnMiLCJmcmFtZXdvcmtOYW1lIiwicGx1Z2luUGF0aCIsInBsdWdpblBrZyIsInBsdWdpblZlcnNpb24iLCJ2ZXJzaW9uIiwiX3Jlc29sdmVkIiwiZWRpdGlvbiIsIndlYnBhY2tQYXRoIiwid2VicGFja1BrZyIsIndlYnBhY2tWZXJzaW9uIiwiZXh0UGtnIiwiZXh0VmVyc2lvbiIsImNtZFBhdGgiLCJjbWRQa2ciLCJjbWRWZXJzaW9uIiwidmVyc2lvbl9mdWxsIiwiZnJhbWV3b3JrSW5mbyIsImZyYW1ld29ya1BhdGgiLCJmcmFtZXdvcmtQa2ciLCJmcmFtZXdvcmtWZXJzaW9uIiwicyIsImN1cnNvclRvIiwiY2xlYXJMaW5lIiwid3JpdGUiLCJoIiwidmVyYm9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ08sU0FBU0EsWUFBVCxDQUFzQkMsT0FBdEIsRUFBK0I7QUFDcEMsUUFBTUMsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxNQUFJQyxRQUFRLEdBQUcsRUFBZjtBQUNBLE1BQUlDLFdBQVcsR0FBRyxFQUFsQjtBQUNBLE1BQUlDLE1BQU0sR0FBRyxFQUFiOztBQUNBLE1BQUk7QUFDRixRQUFJTCxPQUFPLENBQUNNLFNBQVIsSUFBcUJDLFNBQXpCLEVBQW9DO0FBQ2xDSixNQUFBQSxRQUFRLENBQUNLLFlBQVQsR0FBd0IsRUFBeEI7QUFDQUwsTUFBQUEsUUFBUSxDQUFDSyxZQUFULENBQXNCQyxJQUF0QixDQUEyQixzSEFBM0I7QUFDQUosTUFBQUEsTUFBTSxDQUFDSyxJQUFQLEdBQWNQLFFBQWQ7QUFDQSxhQUFPRSxNQUFQO0FBQ0Q7O0FBQ0QsUUFBSUMsU0FBUyxHQUFHTixPQUFPLENBQUNNLFNBQXhCO0FBQ0EsUUFBSUssU0FBUyxHQUFHWCxPQUFPLENBQUNXLFNBQXhCOztBQUVBLFVBQU1DLGVBQWUsR0FBR1YsT0FBTyxDQUFDLGNBQUQsQ0FBL0I7O0FBQ0FVLElBQUFBLGVBQWUsQ0FBQ1YsT0FBTyxDQUFFLEtBQUlJLFNBQVUsTUFB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QUFELENBQVAsQ0FBb0JnTCxRQUFwQixDQUE2Qi9FLE9BQU8sQ0FBQ3dDLE1BQXJDLEVBQTZDLENBQTdDOztBQUNBLFFBQUk7QUFDRnhDLE1BQUFBLE9BQU8sQ0FBQ3dDLE1BQVIsQ0FBZXdDLFNBQWY7QUFDRCxLQUZELENBR0EsT0FBTW5KLENBQU4sRUFBUyxDQUFFOztBQUNYbUUsSUFBQUEsT0FBTyxDQUFDd0MsTUFBUixDQUFleUMsS0FBZixDQUFxQkgsQ0FBckI7QUFDQTlFLElBQUFBLE9BQU8sQ0FBQ3dDLE1BQVIsQ0FBZXlDLEtBQWYsQ0FBcUIsSUFBckI7QUFDRDtBQUNGLEMsQ0FFRDs7O0FBQ08sU0FBUzNKLElBQVQsQ0FBY3pCLE9BQWQsRUFBdUJpTCxDQUF2QixFQUEwQjtBQUMvQixNQUFJakwsT0FBTyxDQUFDc0wsT0FBUixJQUFtQixLQUF2QixFQUE4QjtBQUM1QnBMLElBQUFBLE9BQU8sQ0FBQyxVQUFELENBQVAsQ0FBb0JnTCxRQUFwQixDQUE2Qi9FLE9BQU8sQ0FBQ3dDLE1BQXJDLEVBQTZDLENBQTdDOztBQUNBLFFBQUk7QUFDRnhDLE1BQUFBLE9BQU8sQ0FBQ3dDLE1BQVIsQ0FBZXdDLFNBQWY7QUFDRCxLQUZELENBR0EsT0FBTW5KLENBQU4sRUFBUyxDQUFFOztBQUNYbUUsSUFBQUEsT0FBTyxDQUFDd0MsTUFBUixDQUFleUMsS0FBZixDQUFzQixhQUFZSCxDQUFFLEVBQXBDO0FBQ0E5RSxJQUFBQSxPQUFPLENBQUN3QyxNQUFSLENBQWV5QyxLQUFmLENBQXFCLElBQXJCO0FBQ0Q7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICB2YXIgdGhpc1ZhcnMgPSB7fVxuICB2YXIgdGhpc09wdGlvbnMgPSB7fVxuICB2YXIgcGx1Z2luID0ge31cbiAgdHJ5IHtcbiAgICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzVmFycy5wbHVnaW5FcnJvcnMgPSBbXVxuICAgICAgdGhpc1ZhcnMucGx1Z2luRXJyb3JzLnB1c2goJ3dlYnBhY2sgY29uZmlnOiBmcmFtZXdvcmsgcGFyYW1ldGVyIG9uIGV4dC13ZWJwYWNrLXBsdWdpbiBpcyBub3QgZGVmaW5lZCAtIHZhbHVlczogcmVhY3QsIGFuZ3VsYXIsIGV4dGpzLCBjb21wb25lbnRzJylcbiAgICAgIHBsdWdpbi52YXJzID0gdGhpc1ZhcnNcbiAgICAgIHJldHVybiBwbHVnaW5cbiAgICB9XG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgdmFyIHRyZWVzaGFrZSA9IG9wdGlvbnMudHJlZXNoYWtlXG5cbiAgICBjb25zdCB2YWxpZGF0ZU9wdGlvbnMgPSByZXF1aXJlKCdzY2hlbWEtdXRpbHMnKVxuICAgIHZhbGlkYXRlT3B0aW9ucyhyZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5nZXRWYWxpZGF0ZU9wdGlvbnMoKSwgb3B0aW9ucywgJycpXG5cbiAgICBjb25zdCByYyA9IChmcy5leGlzdHNTeW5jKGAuZXh0LSR7ZnJhbWV3b3JrfXJjYCkgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoYC5leHQtJHtvcHRpb25zLmZyYW1ld29ya31yY2AsICd1dGYtOCcpKSB8fCB7fSlcbiAgICB0aGlzT3B0aW9ucyA9IHsgLi4ucmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuZ2V0RGVmYXVsdE9wdGlvbnMoKSwgLi4ub3B0aW9ucywgLi4ucmMgfVxuXG4gICAgdGhpc1ZhcnMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5nZXREZWZhdWx0VmFycygpXG4gICAgdGhpc1ZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gICAgdGhpc1ZhcnMuYXBwID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykuX2dldEFwcCgpXG5cbiAgICBsb2doKHRoaXNWYXJzLmFwcCArIGBIT09LIGNvbnN0cnVjdG9yYClcbiAgICBsb2d2KHRoaXNPcHRpb25zLCBgcGx1Z2luTmFtZSAtICR7dGhpc1ZhcnMucGx1Z2luTmFtZX1gKVxuICAgIGxvZ3YodGhpc09wdGlvbnMsIGB0aGlzVmFycy5hcHAgLSAke3RoaXNWYXJzLmFwcH1gKVxuXG4gICAgLy8gY29uc3QgcmMgPSAoZnMuZXhpc3RzU3luYyhgLmV4dC0ke3RoaXNWYXJzLmZyYW1ld29ya31yY2ApICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGAuZXh0LSR7dGhpc1ZhcnMuZnJhbWV3b3JrfXJjYCwgJ3V0Zi04JykpIHx8IHt9KVxuICAgIC8vIHRoaXNPcHRpb25zID0geyAuLi5yZXF1aXJlKGAuLyR7dGhpc1ZhcnMuZnJhbWV3b3JrfVV0aWxgKS5nZXREZWZhdWx0T3B0aW9ucygpLCAuLi5vcHRpb25zLCAuLi5yYyB9XG4gICAgXG4gICAgbG9ndih0aGlzT3B0aW9ucywgYHRoaXNPcHRpb25zIC0gJHtKU09OLnN0cmluZ2lmeSh0aGlzT3B0aW9ucyl9YClcbiAgICBpZiAodGhpc09wdGlvbnMuZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nKSBcbiAgICAgIHt0aGlzVmFycy5wcm9kdWN0aW9uID0gdHJ1ZX1cbiAgICBlbHNlIFxuICAgICAge3RoaXNWYXJzLnByb2R1Y3Rpb24gPSBmYWxzZX1cbiAgICBsb2d2KHRoaXNPcHRpb25zLCBgdGhpc1ZhcnMgLSAke0pTT04uc3RyaW5naWZ5KHRoaXNWYXJzKX1gKVxuXG4gICAgaWYgKHRoaXNWYXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSAmJiB0cmVlc2hha2UgPT0gdHJ1ZSAmJiAoZnJhbWV3b3JrID09ICdhbmd1bGFyJyB8fCBmcmFtZXdvcmsgPT0gJ2NvbXBvbmVudHMnKSApIHtcbiAgICAgIGxvZyh0aGlzVmFycy5hcHAgKyAnU3RhcnRpbmcgUHJvZHVjdGlvbiBCdWlsZCAtIFN0ZXAgMScpXG4gICAgICB0aGlzVmFycy5idWlsZHN0ZXAgPSAxXG4gICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fdG9Qcm9kKHRoaXNWYXJzLCB0aGlzT3B0aW9ucylcbiAgICB9XG4gICAgaWYgKHRoaXNWYXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSAmJiB0cmVlc2hha2UgPT0gZmFsc2UgJiYgKGZyYW1ld29yayA9PSAnYW5ndWxhcicgfHwgZnJhbWV3b3JrID09ICdjb21wb25lbnRzJykpIHtcbiAgICAgIC8vbWpnIGxvZyh0aGlzVmFycy5hcHAgKyAnKGNoZWNrIGZvciBwcm9kIGZvbGRlciBhbmQgbW9kdWxlIGNoYW5nZSknKVxuICAgICAgbG9nKHRoaXNWYXJzLmFwcCArICdTdGFydGluZyBQcm9kdWN0aW9uIEJ1aWxkIC0gU3RlcCAyJylcbiAgICAgIHRoaXNWYXJzLmJ1aWxkc3RlcCA9IDJcbiAgICB9XG4gICAgaWYgKHRoaXNWYXJzLmJ1aWxkc3RlcCA9PSAwKSB7XG4gICAgICBsb2codGhpc1ZhcnMuYXBwICsgJ1N0YXJ0aW5nIERldmVsb3BtZW50IEJ1aWxkJylcbiAgICB9XG4gICAgLy9tamcgbG9nKHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLl9nZXRWZXJzaW9ucyh0aGlzVmFycy5hcHAsIHRoaXNWYXJzLnBsdWdpbk5hbWUsIGZyYW1ld29yaykpXG4gICAgbG9ndih0aGlzVmFycy5hcHAgKyAnQnVpbGRpbmcgZm9yICcgKyB0aGlzT3B0aW9ucy5lbnZpcm9ubWVudCArICcsICcgKyAnVHJlZXNoYWtlIGlzICcgKyB0aGlzT3B0aW9ucy50cmVlc2hha2UpXG5cbiAgICBwbHVnaW4udmFycyA9IHRoaXNWYXJzXG4gICAgcGx1Z2luLm9wdGlvbnMgPSB0aGlzT3B0aW9uc1xuXG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndih0aGlzT3B0aW9ucywgJ0ZVTkNUSU9OIF9jb25zdHJ1Y3RvcicpXG4gICAgcmV0dXJuIHBsdWdpblxuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfdGhpc0NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucywgJ0ZVTkNUSU9OIF90aGlzQ29tcGlsYXRpb24nKVxuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyArIGBvcHRpb25zLnNjcmlwdDogJHtvcHRpb25zLnNjcmlwdCB9YClcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMgKyBgYnVpbGRzdGVwOiAke3ZhcnMuYnVpbGRzdGVwfWApXG5cbiAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09IDAgfHwgdmFycy5idWlsZHN0ZXAgPT0gMSkge1xuICAgICAgaWYgKG9wdGlvbnMuc2NyaXB0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gbnVsbCkge1xuICAgICAgICAgIHJ1blNjcmlwdChvcHRpb25zLnNjcmlwdCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zICsgYEZpbmlzaGVkIHJ1bm5pbmcgJHtvcHRpb25zLnNjcmlwdH1gKVxuICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyArIGBvcHRpb25zLnNjcmlwdDogJHtvcHRpb25zLnNjcmlwdCB9YClcbiAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zICsgYGJ1aWxkc3RlcDogJHt2YXJzLmJ1aWxkc3RlcH1gKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ190aGlzQ29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsICdGVU5DVElPTiBfY29tcGlsYXRpb24nKVxuICAgIGlmIChvcHRpb25zLmZyYW1ld29yayAhPSAnZXh0anMnKSB7XG4gICAgICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdXG4gICAgICBpZiAodmFycy5wcm9kdWN0aW9uKSB7XG4gICAgICAgIGlmICgob3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInIHx8IG9wdGlvbnMuZnJhbWV3b3JrID09ICdjb21wb25lbnRzJykgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gdHJ1ZSkge1xuICAgICAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLl9nZXRBbGxDb21wb25lbnRzKHZhcnMsIG9wdGlvbnMpXG4gICAgICAgIH1cbiAgICAgICAgY29tcGlsYXRpb24uaG9va3Muc3VjY2VlZE1vZHVsZS50YXAoYGV4dC1zdWNjZWVkLW1vZHVsZWAsIG1vZHVsZSA9PiB7XG4gICAgICAgICAgaWYgKG1vZHVsZS5yZXNvdXJjZSAmJiAhbW9kdWxlLnJlc291cmNlLm1hdGNoKC9ub2RlX21vZHVsZXMvKSkge1xuICAgICAgICAgICAgaWYobW9kdWxlLnJlc291cmNlLm1hdGNoKC9cXC5odG1sJC8pICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgaWYobW9kdWxlLl9zb3VyY2UuX3ZhbHVlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2RvY3R5cGUgaHRtbCcpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdmFycy5kZXBzID0gW1xuICAgICAgICAgICAgICAgICAgLi4uKHZhcnMuZGVwcyB8fCBbXSksXG4gICAgICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbiAgICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGlmICgob3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInIHx8IG9wdGlvbnMuZnJhbWV3b3JrID09ICdjb21wb25lbnRzJykgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gdHJ1ZSkge1xuICAgICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLmZpbmlzaE1vZHVsZXMudGFwKGBleHQtZmluaXNoLW1vZHVsZXNgLCBtb2R1bGVzID0+IHtcbiAgICAgICAgICAgIHJlcXVpcmUoYC4vJHtvcHRpb25zLmZyYW1ld29ya31VdGlsYCkuX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIodmFycywgb3B0aW9ucylcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmFycy5idWlsZHN0ZXAgIT0gMSkge1xuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5odG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uLnRhcChgZXh0LWh0bWwtZ2VuZXJhdGlvbmAsKGRhdGEpID0+IHtcbiAgICAgICAgICBsb2d2KG9wdGlvbnMsJ2h0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24nKVxuICAgICAgICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAgICAgICB2YXIganNQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5qcycpXG4gICAgICAgICAgdmFyIGNzc1BhdGggPSBwYXRoLmpvaW4odmFycy5leHRQYXRoLCAnZXh0LmNzcycpXG4gICAgICAgICAgZGF0YS5hc3NldHMuanMudW5zaGlmdChqc1BhdGgpXG4gICAgICAgICAgZGF0YS5hc3NldHMuY3NzLnVuc2hpZnQoY3NzUGF0aClcbiAgICAgICAgICBsb2codmFycy5hcHAgKyBgQWRkaW5nICR7anNQYXRofSBhbmQgJHtjc3NQYXRofSB0byBpbmRleC5odG1sYClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfY29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9hZnRlckNvbXBpbGUoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucywgJ0ZVTkNUSU9OIF9hZnRlckNvbXBpbGUnKVxuICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2V4dGpzJykge1xuICAgIHJlcXVpcmUoYC4vZXh0anNVdGlsYCkuX2FmdGVyQ29tcGlsZShjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucylcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZW1pdChjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9lbWl0JylcbiAgICB2YXIgZW1pdCA9IG9wdGlvbnMuZW1pdFxuICAgIHZhciB0cmVlc2hha2UgPSBvcHRpb25zLnRyZWVzaGFrZVxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAgIHZhciBlbnZpcm9ubWVudCA9ICBvcHRpb25zLmVudmlyb25tZW50XG4gICAgaWYgKGVtaXQpIHtcbiAgICAgIGlmICgoZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nICYmIHRyZWVzaGFrZSA9PSB0cnVlICAmJiBmcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB8fFxuICAgICAgICAgIChlbnZpcm9ubWVudCAhPSAncHJvZHVjdGlvbicgJiYgdHJlZXNoYWtlID09IGZhbHNlICYmIGZyYW1ld29yayA9PSAnYW5ndWxhcicpIHx8XG4gICAgICAgICAgKGZyYW1ld29yayA9PSAncmVhY3QnKSB8fFxuICAgICAgICAgIChmcmFtZXdvcmsgPT0gJ2NvbXBvbmVudHMnKVxuICAgICAgKSB7XG4gICAgICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgICAgICB2YXIgZnJhbWV3b3JrID0gdmFycy5mcmFtZXdvcmtcbiAgICAgICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgICBjb25zdCBfYnVpbGRFeHRCdW5kbGUgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5fYnVpbGRFeHRCdW5kbGVcbiAgICAgICAgbGV0IG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3V0cHV0UGF0aCx2YXJzLmV4dFBhdGgpXG4gICAgICAgIGlmIChjb21waWxlci5vdXRwdXRQYXRoID09PSAnLycgJiYgY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIpIHtcbiAgICAgICAgICBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGNvbXBpbGVyLm9wdGlvbnMuZGV2U2VydmVyLmNvbnRlbnRCYXNlLCBvdXRwdXRQYXRoKVxuICAgICAgICB9XG4gICAgICAgIGxvZ3Yob3B0aW9ucywnb3V0cHV0UGF0aDogJyArIG91dHB1dFBhdGgpXG4gICAgICAgIGxvZ3Yob3B0aW9ucywnZnJhbWV3b3JrOiAnICsgZnJhbWV3b3JrKVxuICAgICAgICBpZiAoZnJhbWV3b3JrICE9ICdleHRqcycpIHtcbiAgICAgICAgICBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0UGF0aCwgY29tcGlsYXRpb24pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJyAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dFBhdGgsIGNvbXBpbGF0aW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbW1hbmQgPSAnJ1xuICAgICAgICBpZiAob3B0aW9ucy53YXRjaCA9PSAneWVzJyAmJiB2YXJzLnByb2R1Y3Rpb24gPT0gZmFsc2UpIHtcbiAgICAgICAgICBjb21tYW5kID0gJ3dhdGNoJ1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNvbW1hbmQgPSAnYnVpbGQnXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhcnMucmVidWlsZCA9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHBhcm1zID0gW11cbiAgICAgICAgICBpZiAob3B0aW9ucy5wcm9maWxlID09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnByb2ZpbGUgPT0gJycgfHwgb3B0aW9ucy5wcm9maWxlID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMuZW52aXJvbm1lbnRdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhcnMud2F0Y2hTdGFydGVkID09IGZhbHNlKSB7XG4gICAgICAgICAgICBhd2FpdCBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIG9wdGlvbnMpXG4gICAgICAgICAgICB2YXJzLndhdGNoU3RhcnRlZCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywnTk9UIHJ1bm5pbmcgZW1pdCcpXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KG9wdGlvbnMsJ2VtaXQgaXMgZmFsc2UnKVxuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ2VtaXQ6ICcgKyBlKVxuICAgIGNhbGxiYWNrKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0LCBjb21waWxhdGlvbikge1xuICB0cnkge1xuICAgIGxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gX3ByZXBhcmVGb3JCdWlsZCcpXG4gICAgY29uc3QgcmltcmFmID0gcmVxdWlyZSgncmltcmFmJylcbiAgICBjb25zdCBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKVxuICAgIGNvbnN0IGZzeCA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgdmFyIHBhY2thZ2VzID0gb3B0aW9ucy5wYWNrYWdlc1xuICAgIHZhciB0b29sa2l0ID0gb3B0aW9ucy50b29sa2l0XG4gICAgdmFyIHRoZW1lID0gb3B0aW9ucy50aGVtZVxuICAgIHRoZW1lID0gdGhlbWUgfHwgKHRvb2xraXQgPT09ICdjbGFzc2ljJyA/ICd0aGVtZS10cml0b24nIDogJ3RoZW1lLW1hdGVyaWFsJylcbiAgICBsb2d2KG9wdGlvbnMsJ2ZpcnN0VGltZTogJyArIHZhcnMuZmlyc3RUaW1lKVxuICAgIGlmICh2YXJzLmZpcnN0VGltZSkge1xuICAgICAgcmltcmFmLnN5bmMob3V0cHV0KVxuICAgICAgbWtkaXJwLnN5bmMob3V0cHV0KVxuICAgICAgY29uc3QgYnVpbGRYTUwgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmJ1aWxkWE1MXG4gICAgICBjb25zdCBjcmVhdGVBcHBKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVBcHBKc29uXG4gICAgICBjb25zdCBjcmVhdGVXb3Jrc3BhY2VKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVXb3Jrc3BhY2VKc29uXG4gICAgICBjb25zdCBjcmVhdGVKU0RPTUVudmlyb25tZW50ID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVKU0RPTUVudmlyb25tZW50XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdidWlsZC54bWwnKSwgYnVpbGRYTUwodmFycy5wcm9kdWN0aW9uLCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdhcHAuanNvbicpLCBjcmVhdGVBcHBKc29uKHRoZW1lLCBwYWNrYWdlcywgdG9vbGtpdCwgb3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnanNkb20tZW52aXJvbm1lbnQuanMnKSwgY3JlYXRlSlNET01FbnZpcm9ubWVudChvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICd3b3Jrc3BhY2UuanNvbicpLCBjcmVhdGVXb3Jrc3BhY2VKc29uKG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIHZhciBmcmFtZXdvcmsgPSB2YXJzLmZyYW1ld29yaztcbiAgICAgIC8vYmVjYXVzZSBvZiBhIHByb2JsZW0gd2l0aCBjb2xvcnBpY2tlclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vdXgvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3V4JylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAgKyAnQ29weWluZyAodXgpICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAncGFja2FnZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCArICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdvdmVycmlkZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCArICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwncmVzb3VyY2VzLycpKSkge1xuICAgICAgICB2YXIgZnJvbVJlc291cmNlcyA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncmVzb3VyY2VzLycpXG4gICAgICAgIHZhciB0b1Jlc291cmNlcyA9IHBhdGguam9pbihvdXRwdXQsICcuLi9yZXNvdXJjZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVJlc291cmNlcywgdG9SZXNvdXJjZXMpXG4gICAgICAgIGxvZyhhcHAgKyAnQ29weWluZyAnICsgZnJvbVJlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1Jlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICB9XG4gICAgdmFycy5maXJzdFRpbWUgPSBmYWxzZVxuICAgIHZhciBqcyA9ICcnXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbikge1xuICAgICAganMgPSB2YXJzLmRlcHMuam9pbignO1xcbicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGpzID0gJ0V4dC5yZXF1aXJlKFwiRXh0LipcIiknXG4gICAgfVxuICAgIGlmICh2YXJzLm1hbmlmZXN0ID09PSBudWxsIHx8IGpzICE9PSB2YXJzLm1hbmlmZXN0KSB7XG4gICAgICB2YXJzLm1hbmlmZXN0ID0ganNcbiAgICAgIGNvbnN0IG1hbmlmZXN0ID0gcGF0aC5qb2luKG91dHB1dCwgJ21hbmlmZXN0LmpzJylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMobWFuaWZlc3QsIGpzLCAndXRmOCcpXG4gICAgICB2YXJzLnJlYnVpbGQgPSB0cnVlXG4gICAgICB2YXIgYnVuZGxlRGlyID0gb3V0cHV0LnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpXG4gICAgICBpZiAoYnVuZGxlRGlyLnRyaW0oKSA9PSAnJykge2J1bmRsZURpciA9ICcuLyd9XG4gICAgICBsb2coYXBwICsgJ0J1aWxkaW5nIEV4dCBidW5kbGUgYXQ6ICcgKyBidW5kbGVEaXIpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5yZWJ1aWxkID0gZmFsc2VcbiAgICAgIGxvZyhhcHAgKyAnRXh0IHJlYnVpbGQgTk9UIG5lZWRlZCcpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX3ByZXBhcmVGb3JCdWlsZDogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2J1aWxkRXh0QnVuZGxlKGFwcCwgY29tcGlsYXRpb24sIG91dHB1dFBhdGgsIHBhcm1zLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9idWlsZEV4dEJ1bmRsZScpXG4gICAgbGV0IHNlbmNoYTsgdHJ5IHsgc2VuY2hhID0gcmVxdWlyZSgnQHNlbmNoYS9jbWQnKSB9IGNhdGNoIChlKSB7IHNlbmNoYSA9ICdzZW5jaGEnIH1cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhzZW5jaGEpKSB7XG4gICAgICBsb2d2KG9wdGlvbnMsJ3NlbmNoYSBmb2xkZXIgZXhpc3RzJylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KG9wdGlvbnMsJ3NlbmNoYSBmb2xkZXIgRE9FUyBOT1QgZXhpc3QnKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgb25CdWlsZERvbmUgPSAoKSA9PiB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywnb25CdWlsZERvbmUnKVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH1cbiAgICAgIHZhciBvcHRzID0geyBjd2Q6IG91dHB1dFBhdGgsIHNpbGVudDogdHJ1ZSwgc3RkaW86ICdwaXBlJywgZW5jb2Rpbmc6ICd1dGYtOCd9XG4gICAgICBleGVjdXRlQXN5bmMoYXBwLCBzZW5jaGEsIHBhcm1zLCBvcHRzLCBjb21waWxhdGlvbiwgb3B0aW9ucykudGhlbiAoXG4gICAgICAgIGZ1bmN0aW9uKCkgeyBvbkJ1aWxkRG9uZSgpIH0sIFxuICAgICAgICBmdW5jdGlvbihyZWFzb24pIHsgcmVqZWN0KHJlYXNvbikgfVxuICAgICAgKVxuICAgIH0pXG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIGNvbnNvbGUubG9nKCdlJylcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2J1aWxkRXh0QnVuZGxlOiAnICsgZSlcbiAgICBjYWxsYmFjaygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2RvbmUodmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIGNvbnN0IGxvZyA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ1xuICAgIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gICAgbG9ndihvcHRpb25zLCdGVU5DVElPTiBfZG9uZScpXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlICYmIG9wdGlvbnMudHJlZXNoYWtlID09IGZhbHNlICYmIG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJykge1xuICAgICAgcmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5fdG9EZXYodmFycywgb3B0aW9ucylcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmKG9wdGlvbnMuYnJvd3NlciA9PSB0cnVlICYmIG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKSB7XG4gICAgICAgIGlmICh2YXJzLmJyb3dzZXJDb3VudCA9PSAwKSB7XG4gICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OicgKyBvcHRpb25zLnBvcnRcbiAgICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAgKyBgT3BlbmluZyBicm93c2VyIGF0ICR7dXJsfWApXG4gICAgICAgICAgdmFycy5icm93c2VyQ291bnQrK1xuICAgICAgICAgIGNvbnN0IG9wbiA9IHJlcXVpcmUoJ29wbicpXG4gICAgICAgICAgb3BuKHVybClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgIC8vY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ3Nob3cgYnJvd3NlciB3aW5kb3cgLSBleHQtZG9uZTogJyArIGUpXG4gICAgfVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAwKSB7XG4gICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAgKyBgRW5kaW5nIERldmVsb3BtZW50IEJ1aWxkYClcbiAgICB9XG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09IDIpIHtcbiAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCArIGBFbmRpbmcgUHJvZHVjdGlvbiBCdWlsZGApXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlQXN5bmMgKGFwcCwgY29tbWFuZCwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgLy9jb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBTZXJ2ZXJcIiwgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gICAgY29uc3QgREVGQVVMVF9TVUJTVFJTID0gW1wiW0lORl0geFNlcnZlclwiLCAnW0lORl0gTG9hZGluZycsICdbSU5GXSBBcHBlbmQnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbSU5GXSBQcm9jZXNzaW5nIEJ1aWxkJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgICB2YXIgc3Vic3RyaW5ncyA9IERFRkFVTFRfU1VCU1RSUyBcbiAgICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gICAgY29uc3QgY3Jvc3NTcGF3biA9IHJlcXVpcmUoJ2Nyb3NzLXNwYXduJylcbiAgICBjb25zdCBsb2cgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2dcbiAgICBsb2d2KG9wdGlvbnMsICdGVU5DVElPTiBleGVjdXRlQXN5bmMnKVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxvZ3Yob3B0aW9ucyxgY29tbWFuZCAtICR7Y29tbWFuZH1gKVxuICAgICAgbG9ndihvcHRpb25zLCBgcGFybXMgLSAke3Bhcm1zfWApXG4gICAgICBsb2d2KG9wdGlvbnMsIGBvcHRzIC0gJHtKU09OLnN0cmluZ2lmeShvcHRzKX1gKVxuICAgICAgbGV0IGNoaWxkID0gY3Jvc3NTcGF3bihjb21tYW5kLCBwYXJtcywgb3B0cylcbiAgICAgIGNoaWxkLm9uKCdjbG9zZScsIChjb2RlLCBzaWduYWwpID0+IHtcbiAgICAgICAgbG9ndihvcHRpb25zLCBgb24gY2xvc2U6IGAgKyBjb2RlKSBcbiAgICAgICAgaWYoY29kZSA9PT0gMCkgeyByZXNvbHZlKDApIH1cbiAgICAgICAgZWxzZSB7IGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCBuZXcgRXJyb3IoY29kZSkgKTsgcmVzb2x2ZSgwKSB9XG4gICAgICB9KVxuICAgICAgY2hpbGQub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7IFxuICAgICAgICBsb2d2KG9wdGlvbnMsIGBvbiBlcnJvcmApIFxuICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChlcnJvcilcbiAgICAgICAgcmVzb2x2ZSgwKVxuICAgICAgfSlcbiAgICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICBsb2d2KG9wdGlvbnMsIGAke3N0cn1gKVxuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkubWF0Y2goL0Zhc2hpb24gd2FpdGluZyBmb3IgY2hhbmdlc1xcLlxcLlxcLi8pKSB7XG5cbiAgICAgICAgICAvLyBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICAgICAgLy8gdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSsnL3NyYy9pbmRleC5qcyc7XG4gICAgICAgICAgLy8gdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuICAgICAgICAgIC8vIGZzLndyaXRlRmlsZVN5bmMoZmlsZW5hbWUsIGRhdGEgKyAnICcsICd1dGY4JylcbiAgICAgICAgICAvLyBsb2d2KG9wdGlvbnMsIGB0b3VjaGluZyAke2ZpbGVuYW1lfWApXG5cbiAgICAgICAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICAgICAgdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSArICcvc3JjL2luZGV4LmpzJztcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgZGF0YSArICcgJywgJ3V0ZjgnKTtcbiAgICAgICAgICAgIGxvZyhvcHRpb25zLCBgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2goZSkge1xuICAgICAgICAgICAgbG9nKG9wdGlvbnMsIGBOT1QgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKDApXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKHN1YnN0cmluZ3Muc29tZShmdW5jdGlvbih2KSB7IHJldHVybiBkYXRhLmluZGV4T2YodikgPj0gMDsgfSkpIHsgXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltJTkZdXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltMT0ddXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykudHJpbSgpXG4gICAgICAgICAgICBpZiAoc3RyLmluY2x1ZGVzKFwiW0VSUl1cIikpIHtcbiAgICAgICAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goYXBwICsgc3RyLnJlcGxhY2UoL15cXFtFUlJcXF0gL2dpLCAnJykpO1xuICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltFUlJdXCIsIGAke2NoYWxrLnJlZChcIltFUlJdXCIpfWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2coYCR7YXBwfSR7c3RyfWApIFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNoaWxkLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywgYGVycm9yIG9uIGNsb3NlOiBgICsgZGF0YSkgXG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICB2YXIgc3RySmF2YU9wdHMgPSBcIlBpY2tlZCB1cCBfSkFWQV9PUFRJT05TXCI7XG4gICAgICAgIHZhciBpbmNsdWRlcyA9IHN0ci5pbmNsdWRlcyhzdHJKYXZhT3B0cylcbiAgICAgICAgaWYgKCFpbmNsdWRlcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2FwcH0gJHtjaGFsay5yZWQoXCJbRVJSXVwiKX0gJHtzdHJ9YClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnZXhlY3V0ZUFzeW5jOiAnICsgZSlcbiAgICBjYWxsYmFjaygpXG4gIH0gXG59XG5cbi8vKioqKioqKioqKlxuZnVuY3Rpb24gcnVuU2NyaXB0KHNjcmlwdFBhdGgsIGNhbGxiYWNrKSB7XG4gIHZhciBjaGlsZFByb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG4gIC8vIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBjYWxsYmFjayBoYXMgYmVlbiBpbnZva2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgaW52b2NhdGlvbnNcbiAgdmFyIGludm9rZWQgPSBmYWxzZTtcbiAgdmFyIHByb2Nlc3MgPSBjaGlsZFByb2Nlc3MuZm9yayhzY3JpcHRQYXRoKTtcbiAgLy8gbGlzdGVuIGZvciBlcnJvcnMgYXMgdGhleSBtYXkgcHJldmVudCB0aGUgZXhpdCBldmVudCBmcm9tIGZpcmluZ1xuICBwcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xuICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjayBvbmNlIHRoZSBwcm9jZXNzIGhhcyBmaW5pc2hlZCBydW5uaW5nXG4gIHByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZSkge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgdmFyIGVyciA9IGNvZGUgPT09IDAgPyBudWxsIDogbmV3IEVycm9yKCdleGl0IGNvZGUgJyArIGNvZGUpO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0QXBwKCkge1xuICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gIHZhciBwcmVmaXggPSBgYFxuICBjb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKVxuICBpZiAocGxhdGZvcm0gPT0gJ2RhcndpbicpIHsgcHJlZml4ID0gYOKEuSDvvaJleHTvvaM6YCB9XG4gIGVsc2UgeyBwcmVmaXggPSBgaSBbZXh0XTpgIH1cbiAgcmV0dXJuIGAke2NoYWxrLmdyZWVuKHByZWZpeCl9IGBcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2dldFZlcnNpb25zKGFwcCwgcGx1Z2luTmFtZSwgZnJhbWV3b3JrTmFtZSkge1xuICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICB2YXIgdiA9IHt9XG4gIHZhciBwbHVnaW5QYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhJywgcGx1Z2luTmFtZSlcbiAgdmFyIHBsdWdpblBrZyA9IChmcy5leGlzdHNTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwbHVnaW5QYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5wbHVnaW5WZXJzaW9uID0gcGx1Z2luUGtnLnZlcnNpb25cbiAgdi5fcmVzb2x2ZWQgPSBwbHVnaW5Qa2cuX3Jlc29sdmVkXG4gIGlmICh2Ll9yZXNvbHZlZCA9PSB1bmRlZmluZWQpIHtcbiAgICB2LmVkaXRpb24gPSBgQ29tbWVyY2lhbGBcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAoLTEgPT0gdi5fcmVzb2x2ZWQuaW5kZXhPZignY29tbXVuaXR5JykpIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tdW5pdHlgXG4gICAgfVxuICB9XG4gIHZhciB3ZWJwYWNrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvd2VicGFjaycpXG4gIHZhciB3ZWJwYWNrUGtnID0gKGZzLmV4aXN0c1N5bmMod2VicGFja1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYud2VicGFja1ZlcnNpb24gPSB3ZWJwYWNrUGtnLnZlcnNpb25cbiAgdmFyIGV4dFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0JylcbiAgdmFyIGV4dFBrZyA9IChmcy5leGlzdHNTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhleHRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5leHRWZXJzaW9uID0gZXh0UGtnLnNlbmNoYS52ZXJzaW9uXG4gIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gIHZhciBjbWRQa2cgPSAoZnMuZXhpc3RzU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgaWYgKHYuY21kVmVyc2lvbiA9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgY21kUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLGBub2RlX21vZHVsZXMvQHNlbmNoYS8ke3BsdWdpbk5hbWV9L25vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gICAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXG4gIH1cbiAgdmFyIGZyYW1ld29ya0luZm8gPSAnJ1xuICAgaWYgKGZyYW1ld29ya05hbWUgIT0gdW5kZWZpbmVkICYmIGZyYW1ld29ya05hbWUgIT0gJ2V4dGpzJykge1xuICAgIHZhciBmcmFtZXdvcmtQYXRoID0gJydcbiAgICBpZiAoZnJhbWV3b3JrTmFtZSA9PSAncmVhY3QnKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9yZWFjdCcpXG4gICAgfVxuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdhbmd1bGFyJykge1xuICAgICAgZnJhbWV3b3JrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQGFuZ3VsYXIvY29yZScpXG4gICAgfVxuICAgIHZhciBmcmFtZXdvcmtQa2cgPSAoZnMuZXhpc3RzU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZnJhbWV3b3JrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gICAgdi5mcmFtZXdvcmtWZXJzaW9uID0gZnJhbWV3b3JrUGtnLnZlcnNpb25cbiAgICBmcmFtZXdvcmtJbmZvID0gJywgJyArIGZyYW1ld29ya05hbWUgKyAnIHYnICsgdi5mcmFtZXdvcmtWZXJzaW9uXG4gIH1cbiAgcmV0dXJuIGFwcCArICdleHQtd2VicGFjay1wbHVnaW4gdicgKyB2LnBsdWdpblZlcnNpb24gKyAnLCBFeHQgSlMgdicgKyB2LmV4dFZlcnNpb24gKyAnICcgKyB2LmVkaXRpb24gKyAnIEVkaXRpb24sIFNlbmNoYSBDbWQgdicgKyB2LmNtZFZlcnNpb24gKyAnLCB3ZWJwYWNrIHYnICsgdi53ZWJwYWNrVmVyc2lvbiArIGZyYW1ld29ya0luZm9cbiB9XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhzKSB7XG4gIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gIHRyeSB7cHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKCl9Y2F0Y2goZSkge31cbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocyk7cHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2gocykge1xuICB2YXIgaCA9IGZhbHNlXG4gIGlmIChoID09IHRydWUpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9ndihvcHRpb25zLCBzKSB7XG4gIGlmIChvcHRpb25zLnZlcmJvc2UgPT0gJ3llcycpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGAtdmVyYm9zZTogJHtzfWApXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cbiJdfQ==