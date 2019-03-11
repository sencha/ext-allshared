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

    const validateOptions = require('schema-utils');

    validateOptions(require(`./${options.framework}Util`).getValidateOptions(), options, '');
    const rc = fs.existsSync(`.ext-${options.framework}rc`) && JSON.parse(fs.readFileSync(`.ext-${options.framework}rc`, 'utf-8')) || {};
    thisOptions = _objectSpread({}, require(`./${thisVars.framework}Util`).getDefaultOptions(), options, rc);
    thisVars = require(`./${thisOptions.framework}Util`).getDefaultVars(); //thisVars.framework = thisOptions.framework

    thisVars.pluginName = 'ext-webpack-plugin'; // switch(thisVars.framework) {
    //   case 'extjs':
    //     thisVars.pluginName = 'ext-webpack-plugin'
    //     break;
    //   case 'react':
    //     thisVars.pluginName = 'ext-webpack-plugin'
    //     break;
    //   case 'angular':
    //     thisVars.pluginName = 'ext-webpack-plugin'
    //     break;
    //     case 'components':
    //     thisVars.pluginName = 'ext-webpack-plugin'
    //     break;
    //   default:
    //     thisVars.pluginName = 'ext-webpack-plugin'
    // }

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

    if (thisVars.production == true && thisOptions.treeshake == true && (thisOptions.framework == 'angular' || thisOptions.framework == 'components')) {
      log(thisVars.app + 'Starting Production Build - Step 1');
      thisVars.buildstep = 1;

      require(`./${thisOptions.framework}Util`)._toProd(thisVars, thisOptions);
    }

    if (thisVars.production == true && thisOptions.treeshake == false && (thisOptions.framework == 'angular' || thisOptions.framework == 'components')) {
      //mjg log(thisVars.app + '(check for prod folder and module change)')
      log(thisVars.app + 'Starting Production Build - Step 2');
      thisVars.buildstep = 2;
    }

    if (thisVars.buildstep == 0) {
      log(thisVars.app + 'Starting Development Build');
    } //mjg log(require('./pluginUtil')._getVersions(thisVars.app, thisVars.pluginName, thisVars.framework))


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJmcyIsInJlcXVpcmUiLCJ0aGlzVmFycyIsInRoaXNPcHRpb25zIiwicGx1Z2luIiwiZnJhbWV3b3JrIiwidW5kZWZpbmVkIiwicGx1Z2luRXJyb3JzIiwicHVzaCIsInZhcnMiLCJ2YWxpZGF0ZU9wdGlvbnMiLCJnZXRWYWxpZGF0ZU9wdGlvbnMiLCJyYyIsImV4aXN0c1N5bmMiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJnZXREZWZhdWx0T3B0aW9ucyIsImdldERlZmF1bHRWYXJzIiwicGx1Z2luTmFtZSIsImFwcCIsIl9nZXRBcHAiLCJsb2doIiwibG9ndiIsInN0cmluZ2lmeSIsImVudmlyb25tZW50IiwicHJvZHVjdGlvbiIsInRyZWVzaGFrZSIsImxvZyIsImJ1aWxkc3RlcCIsIl90b1Byb2QiLCJlIiwiY29uc29sZSIsIl90aGlzQ29tcGlsYXRpb24iLCJjb21waWxlciIsImNvbXBpbGF0aW9uIiwic2NyaXB0IiwicnVuU2NyaXB0IiwiZXJyIiwiZXJyb3JzIiwiX2NvbXBpbGF0aW9uIiwiZXh0Q29tcG9uZW50cyIsIl9nZXRBbGxDb21wb25lbnRzIiwiaG9va3MiLCJzdWNjZWVkTW9kdWxlIiwidGFwIiwibW9kdWxlIiwicmVzb3VyY2UiLCJtYXRjaCIsIl9zb3VyY2UiLCJfdmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiZGVwcyIsIl9leHRyYWN0RnJvbVNvdXJjZSIsImZpbmlzaE1vZHVsZXMiLCJtb2R1bGVzIiwiX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIiLCJodG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uIiwiZGF0YSIsInBhdGgiLCJqc1BhdGgiLCJqb2luIiwiZXh0UGF0aCIsImNzc1BhdGgiLCJhc3NldHMiLCJqcyIsInVuc2hpZnQiLCJjc3MiLCJfYWZ0ZXJDb21waWxlIiwiX2VtaXQiLCJjYWxsYmFjayIsImVtaXQiLCJfYnVpbGRFeHRCdW5kbGUiLCJvdXRwdXRQYXRoIiwiZGV2U2VydmVyIiwiY29udGVudEJhc2UiLCJfcHJlcGFyZUZvckJ1aWxkIiwiY29tbWFuZCIsIndhdGNoIiwicmVidWlsZCIsInBhcm1zIiwicHJvZmlsZSIsIndhdGNoU3RhcnRlZCIsIm91dHB1dCIsInJpbXJhZiIsIm1rZGlycCIsImZzeCIsInBhY2thZ2VzIiwidG9vbGtpdCIsInRoZW1lIiwiZmlyc3RUaW1lIiwic3luYyIsImJ1aWxkWE1MIiwiY3JlYXRlQXBwSnNvbiIsImNyZWF0ZVdvcmtzcGFjZUpzb24iLCJjcmVhdGVKU0RPTUVudmlyb25tZW50Iiwid3JpdGVGaWxlU3luYyIsInByb2Nlc3MiLCJjd2QiLCJmcm9tUGF0aCIsInRvUGF0aCIsImNvcHlTeW5jIiwicmVwbGFjZSIsImZyb21SZXNvdXJjZXMiLCJ0b1Jlc291cmNlcyIsIm1hbmlmZXN0IiwiYnVuZGxlRGlyIiwidHJpbSIsInNlbmNoYSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25CdWlsZERvbmUiLCJvcHRzIiwic2lsZW50Iiwic3RkaW8iLCJlbmNvZGluZyIsImV4ZWN1dGVBc3luYyIsInRoZW4iLCJyZWFzb24iLCJfZG9uZSIsIl90b0RldiIsImJyb3dzZXIiLCJicm93c2VyQ291bnQiLCJ1cmwiLCJwb3J0Iiwib3BuIiwiREVGQVVMVF9TVUJTVFJTIiwic3Vic3RyaW5ncyIsImNoYWxrIiwiY3Jvc3NTcGF3biIsImNoaWxkIiwib24iLCJjb2RlIiwic2lnbmFsIiwiRXJyb3IiLCJlcnJvciIsInN0ZG91dCIsInN0ciIsInRvU3RyaW5nIiwiZmlsZW5hbWUiLCJzb21lIiwidiIsImluZGV4T2YiLCJyZWQiLCJzdGRlcnIiLCJzdHJKYXZhT3B0cyIsInNjcmlwdFBhdGgiLCJjaGlsZFByb2Nlc3MiLCJpbnZva2VkIiwiZm9yayIsInByZWZpeCIsInBsYXRmb3JtIiwiZ3JlZW4iLCJfZ2V0VmVyc2lvbnMiLCJmcmFtZXdvcmtOYW1lIiwicGx1Z2luUGF0aCIsInBsdWdpblBrZyIsInBsdWdpblZlcnNpb24iLCJ2ZXJzaW9uIiwiX3Jlc29sdmVkIiwiZWRpdGlvbiIsIndlYnBhY2tQYXRoIiwid2VicGFja1BrZyIsIndlYnBhY2tWZXJzaW9uIiwiZXh0UGtnIiwiZXh0VmVyc2lvbiIsImNtZFBhdGgiLCJjbWRQa2ciLCJjbWRWZXJzaW9uIiwidmVyc2lvbl9mdWxsIiwiZnJhbWV3b3JrSW5mbyIsImZyYW1ld29ya1BhdGgiLCJmcmFtZXdvcmtQa2ciLCJmcmFtZXdvcmtWZXJzaW9uIiwicyIsImN1cnNvclRvIiwiY2xlYXJMaW5lIiwid3JpdGUiLCJoIiwidmVyYm9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ08sU0FBU0EsWUFBVCxDQUFzQkMsT0FBdEIsRUFBK0I7QUFDcEMsUUFBTUMsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxNQUFJQyxRQUFRLEdBQUcsRUFBZjtBQUNBLE1BQUlDLFdBQVcsR0FBRyxFQUFsQjtBQUNBLE1BQUlDLE1BQU0sR0FBRyxFQUFiOztBQUNBLE1BQUk7QUFDRixRQUFJTCxPQUFPLENBQUNNLFNBQVIsSUFBcUJDLFNBQXpCLEVBQW9DO0FBQ2xDSixNQUFBQSxRQUFRLENBQUNLLFlBQVQsR0FBd0IsRUFBeEI7QUFDQUwsTUFBQUEsUUFBUSxDQUFDSyxZQUFULENBQXNCQyxJQUF0QixDQUEyQixzSEFBM0I7QUFDQUosTUFBQUEsTUFBTSxDQUFDSyxJQUFQLEdBQWNQLFFBQWQ7QUFDQSxhQUFPRSxNQUFQO0FBQ0Q7O0FBQ0QsVUFBTU0sZUFBZSxHQUFHVCxPQUFPLENBQUMsY0FBRCxDQUEvQjs7QUFDQVMsSUFBQUEsZUFBZSxDQUFDVCxPQUFPLENBQUUsS0FBSUYsT0FBTyxDQUFDTSxTQUFVLE1BQXhCLENBQVAsQ0FBc0NNLGtCQUF0QyxFQUFELEVBQTZEWixPQUE3RCxFQUFzRSxFQUF0RSxDQUFmO0FBRUEsVUFBTWEs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dGlvbnMpIHtcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gIHZhciB0aGlzVmFycyA9IHt9XG4gIHZhciB0aGlzT3B0aW9ucyA9IHt9XG4gIHZhciBwbHVnaW4gPSB7fVxuICB0cnkge1xuICAgIGlmIChvcHRpb25zLmZyYW1ld29yayA9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXNWYXJzLnBsdWdpbkVycm9ycyA9IFtdXG4gICAgICB0aGlzVmFycy5wbHVnaW5FcnJvcnMucHVzaCgnd2VicGFjayBjb25maWc6IGZyYW1ld29yayBwYXJhbWV0ZXIgb24gZXh0LXdlYnBhY2stcGx1Z2luIGlzIG5vdCBkZWZpbmVkIC0gdmFsdWVzOiByZWFjdCwgYW5ndWxhciwgZXh0anMsIGNvbXBvbmVudHMnKVxuICAgICAgcGx1Z2luLnZhcnMgPSB0aGlzVmFyc1xuICAgICAgcmV0dXJuIHBsdWdpblxuICAgIH1cbiAgICBjb25zdCB2YWxpZGF0ZU9wdGlvbnMgPSByZXF1aXJlKCdzY2hlbWEtdXRpbHMnKVxuICAgIHZhbGlkYXRlT3B0aW9ucyhyZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLmdldFZhbGlkYXRlT3B0aW9ucygpLCBvcHRpb25zLCAnJylcblxuICAgIGNvbnN0IHJjID0gKGZzLmV4aXN0c1N5bmMoYC5leHQtJHtvcHRpb25zLmZyYW1ld29ya31yY2ApICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGAuZXh0LSR7b3B0aW9ucy5mcmFtZXdvcmt9cmNgLCAndXRmLTgnKSkgfHwge30pXG4gICAgdGhpc09wdGlvbnMgPSB7IC4uLnJlcXVpcmUoYC4vJHt0aGlzVmFycy5mcmFtZXdvcmt9VXRpbGApLmdldERlZmF1bHRPcHRpb25zKCksIC4uLm9wdGlvbnMsIC4uLnJjIH1cblxuICAgIHRoaXNWYXJzID0gcmVxdWlyZShgLi8ke3RoaXNPcHRpb25zLmZyYW1ld29ya31VdGlsYCkuZ2V0RGVmYXVsdFZhcnMoKVxuXG4gICAgLy90aGlzVmFycy5mcmFtZXdvcmsgPSB0aGlzT3B0aW9ucy5mcmFtZXdvcmtcbiAgICB0aGlzVmFycy5wbHVnaW5OYW1lID0gJ2V4dC13ZWJwYWNrLXBsdWdpbidcblxuICAgIC8vIHN3aXRjaCh0aGlzVmFycy5mcmFtZXdvcmspIHtcbiAgICAvLyAgIGNhc2UgJ2V4dGpzJzpcbiAgICAvLyAgICAgdGhpc1ZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gICAgLy8gICAgIGJyZWFrO1xuICAgIC8vICAgY2FzZSAncmVhY3QnOlxuICAgIC8vICAgICB0aGlzVmFycy5wbHVnaW5OYW1lID0gJ2V4dC13ZWJwYWNrLXBsdWdpbidcbiAgICAvLyAgICAgYnJlYWs7XG4gICAgLy8gICBjYXNlICdhbmd1bGFyJzpcbiAgICAvLyAgICAgdGhpc1ZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gICAgLy8gICAgIGJyZWFrO1xuICAgIC8vICAgICBjYXNlICdjb21wb25lbnRzJzpcbiAgICAvLyAgICAgdGhpc1ZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gICAgLy8gICAgIGJyZWFrO1xuICAgIC8vICAgZGVmYXVsdDpcbiAgICAvLyAgICAgdGhpc1ZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gICAgLy8gfVxuXG4gICAgdGhpc1ZhcnMuYXBwID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykuX2dldEFwcCgpXG5cbiAgICBsb2doKHRoaXNWYXJzLmFwcCArIGBIT09LIGNvbnN0cnVjdG9yYClcbiAgICBsb2d2KHRoaXNPcHRpb25zLCBgcGx1Z2luTmFtZSAtICR7dGhpc1ZhcnMucGx1Z2luTmFtZX1gKVxuICAgIGxvZ3YodGhpc09wdGlvbnMsIGB0aGlzVmFycy5hcHAgLSAke3RoaXNWYXJzLmFwcH1gKVxuXG4gICAgLy8gY29uc3QgcmMgPSAoZnMuZXhpc3RzU3luYyhgLmV4dC0ke3RoaXNWYXJzLmZyYW1ld29ya31yY2ApICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGAuZXh0LSR7dGhpc1ZhcnMuZnJhbWV3b3JrfXJjYCwgJ3V0Zi04JykpIHx8IHt9KVxuICAgIC8vIHRoaXNPcHRpb25zID0geyAuLi5yZXF1aXJlKGAuLyR7dGhpc1ZhcnMuZnJhbWV3b3JrfVV0aWxgKS5nZXREZWZhdWx0T3B0aW9ucygpLCAuLi5vcHRpb25zLCAuLi5yYyB9XG4gICAgXG4gICAgbG9ndih0aGlzT3B0aW9ucywgYHRoaXNPcHRpb25zIC0gJHtKU09OLnN0cmluZ2lmeSh0aGlzT3B0aW9ucyl9YClcbiAgICBpZiAodGhpc09wdGlvbnMuZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nKSBcbiAgICAgIHt0aGlzVmFycy5wcm9kdWN0aW9uID0gdHJ1ZX1cbiAgICBlbHNlIFxuICAgICAge3RoaXNWYXJzLnByb2R1Y3Rpb24gPSBmYWxzZX1cbiAgICBsb2d2KHRoaXNPcHRpb25zLCBgdGhpc1ZhcnMgLSAke0pTT04uc3RyaW5naWZ5KHRoaXNWYXJzKX1gKVxuXG4gICAgaWYgKHRoaXNWYXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSAmJiB0aGlzT3B0aW9ucy50cmVlc2hha2UgPT0gdHJ1ZSAmJiAodGhpc09wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJyB8fCB0aGlzT3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2NvbXBvbmVudHMnKSApIHtcbiAgICAgIGxvZyh0aGlzVmFycy5hcHAgKyAnU3RhcnRpbmcgUHJvZHVjdGlvbiBCdWlsZCAtIFN0ZXAgMScpXG4gICAgICB0aGlzVmFycy5idWlsZHN0ZXAgPSAxXG4gICAgICByZXF1aXJlKGAuLyR7dGhpc09wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5fdG9Qcm9kKHRoaXNWYXJzLCB0aGlzT3B0aW9ucylcbiAgICB9XG4gICAgaWYgKHRoaXNWYXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSAmJiB0aGlzT3B0aW9ucy50cmVlc2hha2UgPT0gZmFsc2UgJiYgKHRoaXNPcHRpb25zLmZyYW1ld29yayA9PSAnYW5ndWxhcicgfHwgdGhpc09wdGlvbnMuZnJhbWV3b3JrID09ICdjb21wb25lbnRzJykpIHtcbiAgICAgIC8vbWpnIGxvZyh0aGlzVmFycy5hcHAgKyAnKGNoZWNrIGZvciBwcm9kIGZvbGRlciBhbmQgbW9kdWxlIGNoYW5nZSknKVxuICAgICAgbG9nKHRoaXNWYXJzLmFwcCArICdTdGFydGluZyBQcm9kdWN0aW9uIEJ1aWxkIC0gU3RlcCAyJylcbiAgICAgIHRoaXNWYXJzLmJ1aWxkc3RlcCA9IDJcbiAgICB9XG4gICAgaWYgKHRoaXNWYXJzLmJ1aWxkc3RlcCA9PSAwKSB7XG4gICAgICBsb2codGhpc1ZhcnMuYXBwICsgJ1N0YXJ0aW5nIERldmVsb3BtZW50IEJ1aWxkJylcbiAgICB9XG4gICAgLy9tamcgbG9nKHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLl9nZXRWZXJzaW9ucyh0aGlzVmFycy5hcHAsIHRoaXNWYXJzLnBsdWdpbk5hbWUsIHRoaXNWYXJzLmZyYW1ld29yaykpXG4gICAgbG9ndih0aGlzVmFycy5hcHAgKyAnQnVpbGRpbmcgZm9yICcgKyB0aGlzT3B0aW9ucy5lbnZpcm9ubWVudCArICcsICcgKyAnVHJlZXNoYWtlIGlzICcgKyB0aGlzT3B0aW9ucy50cmVlc2hha2UpXG5cbiAgICBwbHVnaW4udmFycyA9IHRoaXNWYXJzXG4gICAgcGx1Z2luLm9wdGlvbnMgPSB0aGlzT3B0aW9uc1xuXG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndih0aGlzT3B0aW9ucywgJ0ZVTkNUSU9OIF9jb25zdHJ1Y3RvcicpXG4gICAgcmV0dXJuIHBsdWdpblxuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfdGhpc0NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucywgJ0ZVTkNUSU9OIF90aGlzQ29tcGlsYXRpb24nKVxuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyArIGBvcHRpb25zLnNjcmlwdDogJHtvcHRpb25zLnNjcmlwdCB9YClcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMgKyBgYnVpbGRzdGVwOiAke3ZhcnMuYnVpbGRzdGVwfWApXG5cbiAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09IDAgfHwgdmFycy5idWlsZHN0ZXAgPT0gMSkge1xuICAgICAgaWYgKG9wdGlvbnMuc2NyaXB0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gbnVsbCkge1xuICAgICAgICAgIHJ1blNjcmlwdChvcHRpb25zLnNjcmlwdCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zICsgYEZpbmlzaGVkIHJ1bm5pbmcgJHtvcHRpb25zLnNjcmlwdH1gKVxuICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyArIGBvcHRpb25zLnNjcmlwdDogJHtvcHRpb25zLnNjcmlwdCB9YClcbiAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zICsgYGJ1aWxkc3RlcDogJHt2YXJzLmJ1aWxkc3RlcH1gKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ190aGlzQ29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsICdGVU5DVElPTiBfY29tcGlsYXRpb24nKVxuICAgIGlmIChvcHRpb25zLmZyYW1ld29yayAhPSAnZXh0anMnKSB7XG4gICAgICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdXG4gICAgICBpZiAodmFycy5wcm9kdWN0aW9uKSB7XG4gICAgICAgIGlmICgob3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInIHx8IG9wdGlvbnMuZnJhbWV3b3JrID09ICdjb21wb25lbnRzJykgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gdHJ1ZSkge1xuICAgICAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLl9nZXRBbGxDb21wb25lbnRzKHZhcnMsIG9wdGlvbnMpXG4gICAgICAgIH1cbiAgICAgICAgY29tcGlsYXRpb24uaG9va3Muc3VjY2VlZE1vZHVsZS50YXAoYGV4dC1zdWNjZWVkLW1vZHVsZWAsIG1vZHVsZSA9PiB7XG4gICAgICAgICAgaWYgKG1vZHVsZS5yZXNvdXJjZSAmJiAhbW9kdWxlLnJlc291cmNlLm1hdGNoKC9ub2RlX21vZHVsZXMvKSkge1xuICAgICAgICAgICAgaWYobW9kdWxlLnJlc291cmNlLm1hdGNoKC9cXC5odG1sJC8pICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgaWYobW9kdWxlLl9zb3VyY2UuX3ZhbHVlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2RvY3R5cGUgaHRtbCcpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdmFycy5kZXBzID0gW1xuICAgICAgICAgICAgICAgICAgLi4uKHZhcnMuZGVwcyB8fCBbXSksXG4gICAgICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbiAgICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGlmICgob3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInIHx8IG9wdGlvbnMuZnJhbWV3b3JrID09ICdjb21wb25lbnRzJykgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gdHJ1ZSkge1xuICAgICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLmZpbmlzaE1vZHVsZXMudGFwKGBleHQtZmluaXNoLW1vZHVsZXNgLCBtb2R1bGVzID0+IHtcbiAgICAgICAgICAgIHJlcXVpcmUoYC4vJHtvcHRpb25zLmZyYW1ld29ya31VdGlsYCkuX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIodmFycywgb3B0aW9ucylcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmFycy5idWlsZHN0ZXAgIT0gMSkge1xuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5odG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uLnRhcChgZXh0LWh0bWwtZ2VuZXJhdGlvbmAsKGRhdGEpID0+IHtcbiAgICAgICAgICBsb2d2KG9wdGlvbnMsJ2h0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24nKVxuICAgICAgICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAgICAgICB2YXIganNQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5qcycpXG4gICAgICAgICAgdmFyIGNzc1BhdGggPSBwYXRoLmpvaW4odmFycy5leHRQYXRoLCAnZXh0LmNzcycpXG4gICAgICAgICAgZGF0YS5hc3NldHMuanMudW5zaGlmdChqc1BhdGgpXG4gICAgICAgICAgZGF0YS5hc3NldHMuY3NzLnVuc2hpZnQoY3NzUGF0aClcbiAgICAgICAgICBsb2codmFycy5hcHAgKyBgQWRkaW5nICR7anNQYXRofSBhbmQgJHtjc3NQYXRofSB0byBpbmRleC5odG1sYClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfY29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9hZnRlckNvbXBpbGUoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucywgJ0ZVTkNUSU9OIF9hZnRlckNvbXBpbGUnKVxuICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2V4dGpzJykge1xuICAgIHJlcXVpcmUoYC4vZXh0anNVdGlsYCkuX2FmdGVyQ29tcGlsZShjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucylcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZW1pdChjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9lbWl0JylcbiAgICB2YXIgZW1pdCA9IG9wdGlvbnMuZW1pdFxuICAgIHZhciB0cmVlc2hha2UgPSBvcHRpb25zLnRyZWVzaGFrZVxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAgIHZhciBlbnZpcm9ubWVudCA9ICBvcHRpb25zLmVudmlyb25tZW50XG4gICAgaWYgKGVtaXQpIHtcbiAgICAgIGlmICgoZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nICYmIHRyZWVzaGFrZSA9PSB0cnVlICAmJiBmcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB8fFxuICAgICAgICAgIChlbnZpcm9ubWVudCAhPSAncHJvZHVjdGlvbicgJiYgdHJlZXNoYWtlID09IGZhbHNlICYmIGZyYW1ld29yayA9PSAnYW5ndWxhcicpIHx8XG4gICAgICAgICAgKGZyYW1ld29yayA9PSAncmVhY3QnKSB8fFxuICAgICAgICAgIChmcmFtZXdvcmsgPT0gJ2NvbXBvbmVudHMnKVxuICAgICAgKSB7XG4gICAgICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgICAgICB2YXIgZnJhbWV3b3JrID0gdmFycy5mcmFtZXdvcmtcbiAgICAgICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgICBjb25zdCBfYnVpbGRFeHRCdW5kbGUgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5fYnVpbGRFeHRCdW5kbGVcbiAgICAgICAgbGV0IG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3V0cHV0UGF0aCx2YXJzLmV4dFBhdGgpXG4gICAgICAgIGlmIChjb21waWxlci5vdXRwdXRQYXRoID09PSAnLycgJiYgY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIpIHtcbiAgICAgICAgICBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGNvbXBpbGVyLm9wdGlvbnMuZGV2U2VydmVyLmNvbnRlbnRCYXNlLCBvdXRwdXRQYXRoKVxuICAgICAgICB9XG4gICAgICAgIGxvZ3Yob3B0aW9ucywnb3V0cHV0UGF0aDogJyArIG91dHB1dFBhdGgpXG4gICAgICAgIGxvZ3Yob3B0aW9ucywnZnJhbWV3b3JrOiAnICsgZnJhbWV3b3JrKVxuICAgICAgICBpZiAoZnJhbWV3b3JrICE9ICdleHRqcycpIHtcbiAgICAgICAgICBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0UGF0aCwgY29tcGlsYXRpb24pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJyAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dFBhdGgsIGNvbXBpbGF0aW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbW1hbmQgPSAnJ1xuICAgICAgICBpZiAob3B0aW9ucy53YXRjaCA9PSAneWVzJyAmJiB2YXJzLnByb2R1Y3Rpb24gPT0gZmFsc2UpIHtcbiAgICAgICAgICBjb21tYW5kID0gJ3dhdGNoJ1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNvbW1hbmQgPSAnYnVpbGQnXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhcnMucmVidWlsZCA9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHBhcm1zID0gW11cbiAgICAgICAgICBpZiAob3B0aW9ucy5wcm9maWxlID09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnByb2ZpbGUgPT0gJycgfHwgb3B0aW9ucy5wcm9maWxlID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMuZW52aXJvbm1lbnRdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhcnMud2F0Y2hTdGFydGVkID09IGZhbHNlKSB7XG4gICAgICAgICAgICBhd2FpdCBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIG9wdGlvbnMpXG4gICAgICAgICAgICB2YXJzLndhdGNoU3RhcnRlZCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywnTk9UIHJ1bm5pbmcgZW1pdCcpXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KG9wdGlvbnMsJ2VtaXQgaXMgZmFsc2UnKVxuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ2VtaXQ6ICcgKyBlKVxuICAgIGNhbGxiYWNrKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0LCBjb21waWxhdGlvbikge1xuICB0cnkge1xuICAgIGxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gX3ByZXBhcmVGb3JCdWlsZCcpXG4gICAgY29uc3QgcmltcmFmID0gcmVxdWlyZSgncmltcmFmJylcbiAgICBjb25zdCBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKVxuICAgIGNvbnN0IGZzeCA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgdmFyIHBhY2thZ2VzID0gb3B0aW9ucy5wYWNrYWdlc1xuICAgIHZhciB0b29sa2l0ID0gb3B0aW9ucy50b29sa2l0XG4gICAgdmFyIHRoZW1lID0gb3B0aW9ucy50aGVtZVxuICAgIHRoZW1lID0gdGhlbWUgfHwgKHRvb2xraXQgPT09ICdjbGFzc2ljJyA/ICd0aGVtZS10cml0b24nIDogJ3RoZW1lLW1hdGVyaWFsJylcbiAgICBsb2d2KG9wdGlvbnMsJ2ZpcnN0VGltZTogJyArIHZhcnMuZmlyc3RUaW1lKVxuICAgIGlmICh2YXJzLmZpcnN0VGltZSkge1xuICAgICAgcmltcmFmLnN5bmMob3V0cHV0KVxuICAgICAgbWtkaXJwLnN5bmMob3V0cHV0KVxuICAgICAgY29uc3QgYnVpbGRYTUwgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmJ1aWxkWE1MXG4gICAgICBjb25zdCBjcmVhdGVBcHBKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVBcHBKc29uXG4gICAgICBjb25zdCBjcmVhdGVXb3Jrc3BhY2VKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVXb3Jrc3BhY2VKc29uXG4gICAgICBjb25zdCBjcmVhdGVKU0RPTUVudmlyb25tZW50ID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVKU0RPTUVudmlyb25tZW50XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdidWlsZC54bWwnKSwgYnVpbGRYTUwodmFycy5wcm9kdWN0aW9uLCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdhcHAuanNvbicpLCBjcmVhdGVBcHBKc29uKHRoZW1lLCBwYWNrYWdlcywgdG9vbGtpdCwgb3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnanNkb20tZW52aXJvbm1lbnQuanMnKSwgY3JlYXRlSlNET01FbnZpcm9ubWVudChvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICd3b3Jrc3BhY2UuanNvbicpLCBjcmVhdGVXb3Jrc3BhY2VKc29uKG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIHZhciBmcmFtZXdvcmsgPSB2YXJzLmZyYW1ld29yaztcbiAgICAgIC8vYmVjYXVzZSBvZiBhIHByb2JsZW0gd2l0aCBjb2xvcnBpY2tlclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vdXgvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3V4JylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAgKyAnQ29weWluZyAodXgpICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAncGFja2FnZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCArICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdvdmVycmlkZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCArICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwncmVzb3VyY2VzLycpKSkge1xuICAgICAgICB2YXIgZnJvbVJlc291cmNlcyA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncmVzb3VyY2VzLycpXG4gICAgICAgIHZhciB0b1Jlc291cmNlcyA9IHBhdGguam9pbihvdXRwdXQsICcuLi9yZXNvdXJjZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVJlc291cmNlcywgdG9SZXNvdXJjZXMpXG4gICAgICAgIGxvZyhhcHAgKyAnQ29weWluZyAnICsgZnJvbVJlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1Jlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICB9XG4gICAgdmFycy5maXJzdFRpbWUgPSBmYWxzZVxuICAgIHZhciBqcyA9ICcnXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbikge1xuICAgICAganMgPSB2YXJzLmRlcHMuam9pbignO1xcbicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGpzID0gJ0V4dC5yZXF1aXJlKFwiRXh0LipcIiknXG4gICAgfVxuICAgIGlmICh2YXJzLm1hbmlmZXN0ID09PSBudWxsIHx8IGpzICE9PSB2YXJzLm1hbmlmZXN0KSB7XG4gICAgICB2YXJzLm1hbmlmZXN0ID0ganNcbiAgICAgIGNvbnN0IG1hbmlmZXN0ID0gcGF0aC5qb2luKG91dHB1dCwgJ21hbmlmZXN0LmpzJylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMobWFuaWZlc3QsIGpzLCAndXRmOCcpXG4gICAgICB2YXJzLnJlYnVpbGQgPSB0cnVlXG4gICAgICB2YXIgYnVuZGxlRGlyID0gb3V0cHV0LnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpXG4gICAgICBpZiAoYnVuZGxlRGlyLnRyaW0oKSA9PSAnJykge2J1bmRsZURpciA9ICcuLyd9XG4gICAgICBsb2coYXBwICsgJ0J1aWxkaW5nIEV4dCBidW5kbGUgYXQ6ICcgKyBidW5kbGVEaXIpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5yZWJ1aWxkID0gZmFsc2VcbiAgICAgIGxvZyhhcHAgKyAnRXh0IHJlYnVpbGQgTk9UIG5lZWRlZCcpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX3ByZXBhcmVGb3JCdWlsZDogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2J1aWxkRXh0QnVuZGxlKGFwcCwgY29tcGlsYXRpb24sIG91dHB1dFBhdGgsIHBhcm1zLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9idWlsZEV4dEJ1bmRsZScpXG4gICAgbGV0IHNlbmNoYTsgdHJ5IHsgc2VuY2hhID0gcmVxdWlyZSgnQHNlbmNoYS9jbWQnKSB9IGNhdGNoIChlKSB7IHNlbmNoYSA9ICdzZW5jaGEnIH1cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhzZW5jaGEpKSB7XG4gICAgICBsb2d2KG9wdGlvbnMsJ3NlbmNoYSBmb2xkZXIgZXhpc3RzJylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KG9wdGlvbnMsJ3NlbmNoYSBmb2xkZXIgRE9FUyBOT1QgZXhpc3QnKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgb25CdWlsZERvbmUgPSAoKSA9PiB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywnb25CdWlsZERvbmUnKVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH1cbiAgICAgIHZhciBvcHRzID0geyBjd2Q6IG91dHB1dFBhdGgsIHNpbGVudDogdHJ1ZSwgc3RkaW86ICdwaXBlJywgZW5jb2Rpbmc6ICd1dGYtOCd9XG4gICAgICBleGVjdXRlQXN5bmMoYXBwLCBzZW5jaGEsIHBhcm1zLCBvcHRzLCBjb21waWxhdGlvbiwgb3B0aW9ucykudGhlbiAoXG4gICAgICAgIGZ1bmN0aW9uKCkgeyBvbkJ1aWxkRG9uZSgpIH0sIFxuICAgICAgICBmdW5jdGlvbihyZWFzb24pIHsgcmVqZWN0KHJlYXNvbikgfVxuICAgICAgKVxuICAgIH0pXG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIGNvbnNvbGUubG9nKCdlJylcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2J1aWxkRXh0QnVuZGxlOiAnICsgZSlcbiAgICBjYWxsYmFjaygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2RvbmUodmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIGNvbnN0IGxvZyA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ1xuICAgIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gICAgbG9ndihvcHRpb25zLCdGVU5DVElPTiBfZG9uZScpXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlICYmIG9wdGlvbnMudHJlZXNoYWtlID09IGZhbHNlICYmIG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJykge1xuICAgICAgcmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5fdG9EZXYodmFycywgb3B0aW9ucylcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmKG9wdGlvbnMuYnJvd3NlciA9PSB0cnVlICYmIG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKSB7XG4gICAgICAgIGlmICh2YXJzLmJyb3dzZXJDb3VudCA9PSAwKSB7XG4gICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OicgKyBvcHRpb25zLnBvcnRcbiAgICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAgKyBgT3BlbmluZyBicm93c2VyIGF0ICR7dXJsfWApXG4gICAgICAgICAgdmFycy5icm93c2VyQ291bnQrK1xuICAgICAgICAgIGNvbnN0IG9wbiA9IHJlcXVpcmUoJ29wbicpXG4gICAgICAgICAgb3BuKHVybClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgIC8vY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ3Nob3cgYnJvd3NlciB3aW5kb3cgLSBleHQtZG9uZTogJyArIGUpXG4gICAgfVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAwKSB7XG4gICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAgKyBgRW5kaW5nIERldmVsb3BtZW50IEJ1aWxkYClcbiAgICB9XG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09IDIpIHtcbiAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCArIGBFbmRpbmcgUHJvZHVjdGlvbiBCdWlsZGApXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlQXN5bmMgKGFwcCwgY29tbWFuZCwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgLy9jb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBTZXJ2ZXJcIiwgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gICAgY29uc3QgREVGQVVMVF9TVUJTVFJTID0gW1wiW0lORl0geFNlcnZlclwiLCAnW0lORl0gTG9hZGluZycsICdbSU5GXSBBcHBlbmQnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbSU5GXSBQcm9jZXNzaW5nIEJ1aWxkJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgICB2YXIgc3Vic3RyaW5ncyA9IERFRkFVTFRfU1VCU1RSUyBcbiAgICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gICAgY29uc3QgY3Jvc3NTcGF3biA9IHJlcXVpcmUoJ2Nyb3NzLXNwYXduJylcbiAgICBjb25zdCBsb2cgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2dcbiAgICBsb2d2KG9wdGlvbnMsICdGVU5DVElPTiBleGVjdXRlQXN5bmMnKVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxvZ3Yob3B0aW9ucyxgY29tbWFuZCAtICR7Y29tbWFuZH1gKVxuICAgICAgbG9ndihvcHRpb25zLCBgcGFybXMgLSAke3Bhcm1zfWApXG4gICAgICBsb2d2KG9wdGlvbnMsIGBvcHRzIC0gJHtKU09OLnN0cmluZ2lmeShvcHRzKX1gKVxuICAgICAgbGV0IGNoaWxkID0gY3Jvc3NTcGF3bihjb21tYW5kLCBwYXJtcywgb3B0cylcbiAgICAgIGNoaWxkLm9uKCdjbG9zZScsIChjb2RlLCBzaWduYWwpID0+IHtcbiAgICAgICAgbG9ndihvcHRpb25zLCBgb24gY2xvc2U6IGAgKyBjb2RlKSBcbiAgICAgICAgaWYoY29kZSA9PT0gMCkgeyByZXNvbHZlKDApIH1cbiAgICAgICAgZWxzZSB7IGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCBuZXcgRXJyb3IoY29kZSkgKTsgcmVzb2x2ZSgwKSB9XG4gICAgICB9KVxuICAgICAgY2hpbGQub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7IFxuICAgICAgICBsb2d2KG9wdGlvbnMsIGBvbiBlcnJvcmApIFxuICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChlcnJvcilcbiAgICAgICAgcmVzb2x2ZSgwKVxuICAgICAgfSlcbiAgICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICBsb2d2KG9wdGlvbnMsIGAke3N0cn1gKVxuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkubWF0Y2goL0Zhc2hpb24gd2FpdGluZyBmb3IgY2hhbmdlc1xcLlxcLlxcLi8pKSB7XG5cbiAgICAgICAgICAvLyBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICAgICAgLy8gdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSsnL3NyYy9pbmRleC5qcyc7XG4gICAgICAgICAgLy8gdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuICAgICAgICAgIC8vIGZzLndyaXRlRmlsZVN5bmMoZmlsZW5hbWUsIGRhdGEgKyAnICcsICd1dGY4JylcbiAgICAgICAgICAvLyBsb2d2KG9wdGlvbnMsIGB0b3VjaGluZyAke2ZpbGVuYW1lfWApXG5cbiAgICAgICAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICAgICAgdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSArICcvc3JjL2luZGV4LmpzJztcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgZGF0YSArICcgJywgJ3V0ZjgnKTtcbiAgICAgICAgICAgIGxvZyhvcHRpb25zLCBgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2goZSkge1xuICAgICAgICAgICAgbG9nKG9wdGlvbnMsIGBOT1QgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKDApXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKHN1YnN0cmluZ3Muc29tZShmdW5jdGlvbih2KSB7IHJldHVybiBkYXRhLmluZGV4T2YodikgPj0gMDsgfSkpIHsgXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltJTkZdXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltMT0ddXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykudHJpbSgpXG4gICAgICAgICAgICBpZiAoc3RyLmluY2x1ZGVzKFwiW0VSUl1cIikpIHtcbiAgICAgICAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goYXBwICsgc3RyLnJlcGxhY2UoL15cXFtFUlJcXF0gL2dpLCAnJykpO1xuICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltFUlJdXCIsIGAke2NoYWxrLnJlZChcIltFUlJdXCIpfWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2coYCR7YXBwfSR7c3RyfWApIFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNoaWxkLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywgYGVycm9yIG9uIGNsb3NlOiBgICsgZGF0YSkgXG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICB2YXIgc3RySmF2YU9wdHMgPSBcIlBpY2tlZCB1cCBfSkFWQV9PUFRJT05TXCI7XG4gICAgICAgIHZhciBpbmNsdWRlcyA9IHN0ci5pbmNsdWRlcyhzdHJKYXZhT3B0cylcbiAgICAgICAgaWYgKCFpbmNsdWRlcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2FwcH0gJHtjaGFsay5yZWQoXCJbRVJSXVwiKX0gJHtzdHJ9YClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnZXhlY3V0ZUFzeW5jOiAnICsgZSlcbiAgICBjYWxsYmFjaygpXG4gIH0gXG59XG5cbi8vKioqKioqKioqKlxuZnVuY3Rpb24gcnVuU2NyaXB0KHNjcmlwdFBhdGgsIGNhbGxiYWNrKSB7XG4gIHZhciBjaGlsZFByb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG4gIC8vIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBjYWxsYmFjayBoYXMgYmVlbiBpbnZva2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgaW52b2NhdGlvbnNcbiAgdmFyIGludm9rZWQgPSBmYWxzZTtcbiAgdmFyIHByb2Nlc3MgPSBjaGlsZFByb2Nlc3MuZm9yayhzY3JpcHRQYXRoKTtcbiAgLy8gbGlzdGVuIGZvciBlcnJvcnMgYXMgdGhleSBtYXkgcHJldmVudCB0aGUgZXhpdCBldmVudCBmcm9tIGZpcmluZ1xuICBwcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xuICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjayBvbmNlIHRoZSBwcm9jZXNzIGhhcyBmaW5pc2hlZCBydW5uaW5nXG4gIHByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZSkge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgdmFyIGVyciA9IGNvZGUgPT09IDAgPyBudWxsIDogbmV3IEVycm9yKCdleGl0IGNvZGUgJyArIGNvZGUpO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0QXBwKCkge1xuICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gIHZhciBwcmVmaXggPSBgYFxuICBjb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKVxuICBpZiAocGxhdGZvcm0gPT0gJ2RhcndpbicpIHsgcHJlZml4ID0gYOKEuSDvvaJleHTvvaM6YCB9XG4gIGVsc2UgeyBwcmVmaXggPSBgaSBbZXh0XTpgIH1cbiAgcmV0dXJuIGAke2NoYWxrLmdyZWVuKHByZWZpeCl9IGBcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2dldFZlcnNpb25zKGFwcCwgcGx1Z2luTmFtZSwgZnJhbWV3b3JrTmFtZSkge1xuICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICB2YXIgdiA9IHt9XG4gIHZhciBwbHVnaW5QYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhJywgcGx1Z2luTmFtZSlcbiAgdmFyIHBsdWdpblBrZyA9IChmcy5leGlzdHNTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwbHVnaW5QYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5wbHVnaW5WZXJzaW9uID0gcGx1Z2luUGtnLnZlcnNpb25cbiAgdi5fcmVzb2x2ZWQgPSBwbHVnaW5Qa2cuX3Jlc29sdmVkXG4gIGlmICh2Ll9yZXNvbHZlZCA9PSB1bmRlZmluZWQpIHtcbiAgICB2LmVkaXRpb24gPSBgQ29tbWVyY2lhbGBcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAoLTEgPT0gdi5fcmVzb2x2ZWQuaW5kZXhPZignY29tbXVuaXR5JykpIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tdW5pdHlgXG4gICAgfVxuICB9XG4gIHZhciB3ZWJwYWNrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvd2VicGFjaycpXG4gIHZhciB3ZWJwYWNrUGtnID0gKGZzLmV4aXN0c1N5bmMod2VicGFja1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYud2VicGFja1ZlcnNpb24gPSB3ZWJwYWNrUGtnLnZlcnNpb25cbiAgdmFyIGV4dFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0JylcbiAgdmFyIGV4dFBrZyA9IChmcy5leGlzdHNTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhleHRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5leHRWZXJzaW9uID0gZXh0UGtnLnNlbmNoYS52ZXJzaW9uXG4gIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gIHZhciBjbWRQa2cgPSAoZnMuZXhpc3RzU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgaWYgKHYuY21kVmVyc2lvbiA9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgY21kUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLGBub2RlX21vZHVsZXMvQHNlbmNoYS8ke3BsdWdpbk5hbWV9L25vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gICAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXG4gIH1cbiAgdmFyIGZyYW1ld29ya0luZm8gPSAnJ1xuICAgaWYgKGZyYW1ld29ya05hbWUgIT0gdW5kZWZpbmVkICYmIGZyYW1ld29ya05hbWUgIT0gJ2V4dGpzJykge1xuICAgIHZhciBmcmFtZXdvcmtQYXRoID0gJydcbiAgICBpZiAoZnJhbWV3b3JrTmFtZSA9PSAncmVhY3QnKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9yZWFjdCcpXG4gICAgfVxuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdhbmd1bGFyJykge1xuICAgICAgZnJhbWV3b3JrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQGFuZ3VsYXIvY29yZScpXG4gICAgfVxuICAgIHZhciBmcmFtZXdvcmtQa2cgPSAoZnMuZXhpc3RzU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZnJhbWV3b3JrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gICAgdi5mcmFtZXdvcmtWZXJzaW9uID0gZnJhbWV3b3JrUGtnLnZlcnNpb25cbiAgICBmcmFtZXdvcmtJbmZvID0gJywgJyArIGZyYW1ld29ya05hbWUgKyAnIHYnICsgdi5mcmFtZXdvcmtWZXJzaW9uXG4gIH1cbiAgcmV0dXJuIGFwcCArICdleHQtd2VicGFjay1wbHVnaW4gdicgKyB2LnBsdWdpblZlcnNpb24gKyAnLCBFeHQgSlMgdicgKyB2LmV4dFZlcnNpb24gKyAnICcgKyB2LmVkaXRpb24gKyAnIEVkaXRpb24sIFNlbmNoYSBDbWQgdicgKyB2LmNtZFZlcnNpb24gKyAnLCB3ZWJwYWNrIHYnICsgdi53ZWJwYWNrVmVyc2lvbiArIGZyYW1ld29ya0luZm9cbiB9XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhzKSB7XG4gIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gIHRyeSB7cHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKCl9Y2F0Y2goZSkge31cbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocyk7cHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2gocykge1xuICB2YXIgaCA9IGZhbHNlXG4gIGlmIChoID09IHRydWUpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9ndihvcHRpb25zLCBzKSB7XG4gIGlmIChvcHRpb25zLnZlcmJvc2UgPT0gJ3llcycpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGAtdmVyYm9zZTogJHtzfWApXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cbiJdfQ==