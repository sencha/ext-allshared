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

  if (options.framework == undefined) {
    thisVars.pluginErrors = [];
    thisVars.pluginErrors.push('webpack config: framework parameter on ext-webpack-plugin is not defined - values: react, angular, extjs');
    plugin.vars = thisVars;
    return plugin;
  }

  const validateOptions = require('schema-utils');

  validateOptions(require(`./${options.framework}Util`).getValidateOptions(), options, '');
  thisVars = require(`./${options.framework}Util`).getDefaultVars();
  thisVars.framework = options.framework;

  switch (thisVars.framework) {
    case 'extjs':
      thisVars.pluginName = 'ext-webpack-plugin';
      break;

    case 'react':
      thisVars.pluginName = 'ext-react-webpack-plugin';
      break;

    case 'angular':
      thisVars.pluginName = 'ext-angular-webpack-plugin';
      break;

    default:
      thisVars.pluginName = 'ext-webpack-plugin';
  }

  thisVars.app = require('./pluginUtil')._getApp();

  require(`./pluginUtil`).logh(thisVars.app + `HOOK constructor`);

  logv(options, `pluginName - ${thisVars.pluginName}`);
  logv(options, `thisVars.app - ${thisVars.app}`);
  const rc = fs.existsSync(`.ext-${thisVars.framework}rc`) && JSON.parse(fs.readFileSync(`.ext-${thisVars.framework}rc`, 'utf-8')) || {};
  thisOptions = _objectSpread({}, require(`./${thisVars.framework}Util`).getDefaultOptions(), options, rc);
  logv(options, `thisOptions - ${JSON.stringify(thisOptions)}`);

  if (thisOptions.environment == 'production') {
    thisVars.production = true;
  } else {
    thisVars.production = false;
  }

  logv(options, `thisVars - ${JSON.stringify(thisVars)}`);

  if (thisVars.production == true && thisOptions.treeshake == true && options.framework == 'angular') {
    log(thisVars.app + 'Starting Production Build - Step 1');
    thisVars.buildstep = 1;

    require(`./angularUtil`)._toProd(thisVars, thisOptions);
  }

  if (thisVars.production == true && thisOptions.treeshake == false && options.framework == 'angular') {
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

  require('./pluginUtil').logv(options, 'FUNCTION _constructor');

  return plugin;
} //**********


function _thisCompilation(compiler, compilation, vars, options) {
  try {
    require('./pluginUtil').logv(options, 'FUNCTION _thisCompilation');

    if (vars.buildstep == 0 || vars.buildstep == 1) {
      if (options.script != undefined) {
        if (options.script != null) {
          runScript(options.script, function (err) {
            if (err) throw err;

            require('./pluginUtil').logv(vars.app + `Finished running ${options.script}`);
          });
        }
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
        if (options.framework == 'angular' && options.treeshake == true) {
          extComponents = require('./angularUtil')._getAllComponents(vars, options);
        }

        compilation.hooks.succeedModule.tap(`ext-succeed-module`, module => {
          if (module.resource && !module.resource.match(/node_modules/)) {
            if (module.resource.match(/\.html$/) != null) {
              if (module._source._value.toLowerCase().includes('doctype html') == false) {
                vars.deps = [...(vars.deps || []), ...require(`./${vars.framework}Util`).extractFromSource(module, options, compilation, extComponents)];
              }
            } else {
              vars.deps = [...(vars.deps || []), ...require(`./${vars.framework}Util`).extractFromSource(module, options, compilation, extComponents)];
            }
          }
        });

        if (options.framework == 'angular' && options.treeshake == true) {
          compilation.hooks.finishModules.tap(`ext-finish-modules`, modules => {
            require('./angularUtil')._writeFilesToProdFolder(vars, options);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJmcyIsInJlcXVpcmUiLCJ0aGlzVmFycyIsInRoaXNPcHRpb25zIiwicGx1Z2luIiwiZnJhbWV3b3JrIiwidW5kZWZpbmVkIiwicGx1Z2luRXJyb3JzIiwicHVzaCIsInZhcnMiLCJ2YWxpZGF0ZU9wdGlvbnMiLCJnZXRWYWxpZGF0ZU9wdGlvbnMiLCJnZXREZWZhdWx0VmFycyIsInBsdWdpbk5hbWUiLCJhcHAiLCJfZ2V0QXBwIiwibG9naCIsImxvZ3YiLCJyYyIsImV4aXN0c1N5bmMiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJnZXREZWZhdWx0T3B0aW9ucyIsInN0cmluZ2lmeSIsImVudmlyb25tZW50IiwicHJvZHVjdGlvbiIsInRyZWVzaGFrZSIsImxvZyIsImJ1aWxkc3RlcCIsIl90b1Byb2QiLCJfdGhpc0NvbXBpbGF0aW9uIiwiY29tcGlsZXIiLCJjb21waWxhdGlvbiIsInNjcmlwdCIsInJ1blNjcmlwdCIsImVyciIsImUiLCJlcnJvcnMiLCJfY29tcGlsYXRpb24iLCJleHRDb21wb25lbnRzIiwiX2dldEFsbENvbXBvbmVudHMiLCJob29rcyIsInN1Y2NlZWRNb2R1bGUiLCJ0YXAiLCJtb2R1bGUiLCJyZXNvdXJjZSIsIm1hdGNoIiwiX3NvdXJjZSIsIl92YWx1ZSIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJkZXBzIiwiZXh0cmFjdEZyb21Tb3VyY2UiLCJmaW5pc2hNb2R1bGVzIiwibW9kdWxlcyIsIl93cml0ZUZpbGVzVG9Qcm9kRm9sZGVyIiwiaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbiIsImRhdGEiLCJwYXRoIiwianNQYXRoIiwiam9pbiIsImV4dFBhdGgiLCJjc3NQYXRoIiwiYXNzZXRzIiwianMiLCJ1bnNoaWZ0IiwiY3NzIiwiX2FmdGVyQ29tcGlsZSIsIl9lbWl0IiwiY2FsbGJhY2siLCJlbWl0IiwiX2J1aWxkRXh0QnVuZGxlIiwib3V0cHV0UGF0aCIsImRldlNlcnZlciIsImNvbnRlbnRCYXNlIiwiX3ByZXBhcmVGb3JCdWlsZCIsImNvbW1hbmQiLCJ3YXRjaCIsInJlYnVpbGQiLCJwYXJtcyIsInByb2ZpbGUiLCJ3YXRjaFN0YXJ0ZWQiLCJvdXRwdXQiLCJyaW1yYWYiLCJta2RpcnAiLCJmc3giLCJwYWNrYWdlcyIsInRvb2xraXQiLCJ0aGVtZSIsImZpcnN0VGltZSIsInN5bmMiLCJidWlsZFhNTCIsImNyZWF0ZUFwcEpzb24iLCJjcmVhdGVXb3Jrc3BhY2VKc29uIiwiY3JlYXRlSlNET01FbnZpcm9ubWVudCIsIndyaXRlRmlsZVN5bmMiLCJwcm9jZXNzIiwiY3dkIiwiZnJvbVBhdGgiLCJ0b1BhdGgiLCJjb3B5U3luYyIsInJlcGxhY2UiLCJmcm9tUmVzb3VyY2VzIiwidG9SZXNvdXJjZXMiLCJtYW5pZmVzdCIsImJ1bmRsZURpciIsInRyaW0iLCJzZW5jaGEiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm9uQnVpbGREb25lIiwib3B0cyIsInNpbGVudCIsInN0ZGlvIiwiZW5jb2RpbmciLCJleGVjdXRlQXN5bmMiLCJ0aGVuIiwicmVhc29uIiwiY29uc29sZSIsIl9kb25lIiwiX3RvRGV2IiwiYnJvd3NlciIsImJyb3dzZXJDb3VudCIsInVybCIsInBvcnQiLCJvcG4iLCJERUZBVUxUX1NVQlNUUlMiLCJzdWJzdHJpbmdzIiwiY2hhbGsiLCJjcm9zc1NwYXduIiwiY2hpbGQiLCJvbiIsImNvZGUiLCJzaWduYWwiLCJFcnJvciIsImVycm9yIiwic3Rkb3V0Iiwic3RyIiwidG9TdHJpbmciLCJmaWxlbmFtZSIsInNvbWUiLCJ2IiwiaW5kZXhPZiIsInJlZCIsInN0ZGVyciIsInN0ckphdmFPcHRzIiwic2NyaXB0UGF0aCIsImNoaWxkUHJvY2VzcyIsImludm9rZWQiLCJmb3JrIiwicHJlZml4IiwicGxhdGZvcm0iLCJncmVlbiIsIl9nZXRWZXJzaW9ucyIsImZyYW1ld29ya05hbWUiLCJwbHVnaW5QYXRoIiwicGx1Z2luUGtnIiwicGx1Z2luVmVyc2lvbiIsInZlcnNpb24iLCJfcmVzb2x2ZWQiLCJlZGl0aW9uIiwid2VicGFja1BhdGgiLCJ3ZWJwYWNrUGtnIiwid2VicGFja1ZlcnNpb24iLCJleHRQa2ciLCJleHRWZXJzaW9uIiwiY21kUGF0aCIsImNtZFBrZyIsImNtZFZlcnNpb24iLCJ2ZXJzaW9uX2Z1bGwiLCJmcmFtZXdvcmtJbmZvIiwiZnJhbWV3b3JrUGF0aCIsImZyYW1ld29ya1BrZyIsImZyYW1ld29ya1ZlcnNpb24iLCJzIiwiY3Vyc29yVG8iLCJjbGVhckxpbmUiLCJ3cml0ZSIsImgiLCJ2ZXJib3NlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDTyxTQUFTQSxZQUFULENBQXNCQyxPQUF0QixFQUErQjtBQUNwQyxRQUFNQyxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBLE1BQUlDLFFBQVEsR0FBRyxFQUFmO0FBQ0EsTUFBSUMsV0FBVyxHQUFHLEVBQWxCO0FBQ0EsTUFBSUMsTUFBTSxHQUFHLEVBQWI7O0FBQ0EsTUFBSUwsT0FBTyxDQUFDTSxTQUFSLElBQXFCQyxTQUF6QixFQUFvQztBQUNsQ0osSUFBQUEsUUFBUSxDQUFDSyxZQUFULEdBQXdCLEVBQXhCO0FBQ0FMLElBQUFBLFFBQVEsQ0FBQ0ssWUFBVCxDQUFzQkMsSUFBdEIsQ0FBMkIsMEdBQTNCO0FBQ0FKLElBQUFBLE1BQU0sQ0FBQ0ssSUFBUCxHQUFjUCxRQUFkO0FBQ0EsV0FBT0UsTUFBUDtBQUNEOztBQUNELFFBQU1NLGVBQWUsR0FBR1QsT0FBTyxDQUFDLGNBQUQsQ0FBL0I7O0FBQ0FTLEVBQUFBLGVBQWUsQ0FBQ1QsT0FBTyxDQUFFLEtBQUlGLE9BQU8sQ0FBQ00sU0FBVSxNQUF4QixDQUFQLENBQXNDTSxrQkFBdEMsRUFBRCxFQUE2RFosT0FBN0QsRUFBc0UsRUFBdEUsQ0FBZjtBQUNBRyxFQUFBQSxRQUFRLEdBQUdE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TyxDQUFDc0wsT0FBUixJQUFtQixLQUF2QixFQUE4QjtBQUM1QnBMLElBQUFBLE9BQU8sQ0FBQyxVQUFELENBQVAsQ0FBb0JnTCxRQUFwQixDQUE2QmhGLE9BQU8sQ0FBQ3lDLE1BQXJDLEVBQTZDLENBQTdDOztBQUNBLFFBQUk7QUFDRnpDLE1BQUFBLE9BQU8sQ0FBQ3lDLE1BQVIsQ0FBZXdDLFNBQWY7QUFDRCxLQUZELENBR0EsT0FBTTdJLENBQU4sRUFBUyxDQUFFOztBQUNYNEQsSUFBQUEsT0FBTyxDQUFDeUMsTUFBUixDQUFleUMsS0FBZixDQUFzQixhQUFZSCxDQUFFLEVBQXBDO0FBQ0EvRSxJQUFBQSxPQUFPLENBQUN5QyxNQUFSLENBQWV5QyxLQUFmLENBQXFCLElBQXJCO0FBQ0Q7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICB2YXIgdGhpc1ZhcnMgPSB7fVxuICB2YXIgdGhpc09wdGlvbnMgPSB7fVxuICB2YXIgcGx1Z2luID0ge31cbiAgaWYgKG9wdGlvbnMuZnJhbWV3b3JrID09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNWYXJzLnBsdWdpbkVycm9ycyA9IFtdXG4gICAgdGhpc1ZhcnMucGx1Z2luRXJyb3JzLnB1c2goJ3dlYnBhY2sgY29uZmlnOiBmcmFtZXdvcmsgcGFyYW1ldGVyIG9uIGV4dC13ZWJwYWNrLXBsdWdpbiBpcyBub3QgZGVmaW5lZCAtIHZhbHVlczogcmVhY3QsIGFuZ3VsYXIsIGV4dGpzJylcbiAgICBwbHVnaW4udmFycyA9IHRoaXNWYXJzXG4gICAgcmV0dXJuIHBsdWdpblxuICB9XG4gIGNvbnN0IHZhbGlkYXRlT3B0aW9ucyA9IHJlcXVpcmUoJ3NjaGVtYS11dGlscycpXG4gIHZhbGlkYXRlT3B0aW9ucyhyZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLmdldFZhbGlkYXRlT3B0aW9ucygpLCBvcHRpb25zLCAnJylcbiAgdGhpc1ZhcnMgPSByZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLmdldERlZmF1bHRWYXJzKClcbiAgdGhpc1ZhcnMuZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgc3dpdGNoKHRoaXNWYXJzLmZyYW1ld29yaykge1xuICAgIGNhc2UgJ2V4dGpzJzpcbiAgICAgIHRoaXNWYXJzLnBsdWdpbk5hbWUgPSAnZXh0LXdlYnBhY2stcGx1Z2luJ1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncmVhY3QnOlxuICAgICAgdGhpc1ZhcnMucGx1Z2luTmFtZSA9ICdleHQtcmVhY3Qtd2VicGFjay1wbHVnaW4nXG4gICAgICBicmVhaztcbiAgICBjYXNlICdhbmd1bGFyJzpcbiAgICAgIHRoaXNWYXJzLnBsdWdpbk5hbWUgPSAnZXh0LWFuZ3VsYXItd2VicGFjay1wbHVnaW4nXG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpc1ZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gIH1cbiAgdGhpc1ZhcnMuYXBwID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykuX2dldEFwcCgpXG4gIHJlcXVpcmUoYC4vcGx1Z2luVXRpbGApLmxvZ2godGhpc1ZhcnMuYXBwICsgYEhPT0sgY29uc3RydWN0b3JgKVxuICBsb2d2KG9wdGlvbnMsIGBwbHVnaW5OYW1lIC0gJHt0aGlzVmFycy5wbHVnaW5OYW1lfWApXG4gIGxvZ3Yob3B0aW9ucywgYHRoaXNWYXJzLmFwcCAtICR7dGhpc1ZhcnMuYXBwfWApXG4gIGNvbnN0IHJjID0gKGZzLmV4aXN0c1N5bmMoYC5leHQtJHt0aGlzVmFycy5mcmFtZXdvcmt9cmNgKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhgLmV4dC0ke3RoaXNWYXJzLmZyYW1ld29ya31yY2AsICd1dGYtOCcpKSB8fCB7fSlcbiAgdGhpc09wdGlvbnMgPSB7IC4uLnJlcXVpcmUoYC4vJHt0aGlzVmFycy5mcmFtZXdvcmt9VXRpbGApLmdldERlZmF1bHRPcHRpb25zKCksIC4uLm9wdGlvbnMsIC4uLnJjIH1cbiAgbG9ndihvcHRpb25zLCBgdGhpc09wdGlvbnMgLSAke0pTT04uc3RyaW5naWZ5KHRoaXNPcHRpb25zKX1gKVxuICBpZiAodGhpc09wdGlvbnMuZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nKSBcbiAgICB7dGhpc1ZhcnMucHJvZHVjdGlvbiA9IHRydWV9XG4gIGVsc2UgXG4gICAge3RoaXNWYXJzLnByb2R1Y3Rpb24gPSBmYWxzZX1cbiAgbG9ndihvcHRpb25zLCBgdGhpc1ZhcnMgLSAke0pTT04uc3RyaW5naWZ5KHRoaXNWYXJzKX1gKVxuXG4gIGlmICh0aGlzVmFycy5wcm9kdWN0aW9uID09IHRydWUgJiYgdGhpc09wdGlvbnMudHJlZXNoYWtlID09IHRydWUgJiYgb3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB7XG4gICAgbG9nKHRoaXNWYXJzLmFwcCArICdTdGFydGluZyBQcm9kdWN0aW9uIEJ1aWxkIC0gU3RlcCAxJylcbiAgICB0aGlzVmFycy5idWlsZHN0ZXAgPSAxXG4gICAgcmVxdWlyZShgLi9hbmd1bGFyVXRpbGApLl90b1Byb2QodGhpc1ZhcnMsIHRoaXNPcHRpb25zKVxuICB9XG4gIGlmICh0aGlzVmFycy5wcm9kdWN0aW9uID09IHRydWUgJiYgdGhpc09wdGlvbnMudHJlZXNoYWtlID09IGZhbHNlICYmIG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJykge1xuICAgIC8vbWpnIGxvZyh0aGlzVmFycy5hcHAgKyAnKGNoZWNrIGZvciBwcm9kIGZvbGRlciBhbmQgbW9kdWxlIGNoYW5nZSknKVxuICAgIGxvZyh0aGlzVmFycy5hcHAgKyAnU3RhcnRpbmcgUHJvZHVjdGlvbiBCdWlsZCAtIFN0ZXAgMicpXG4gICAgdGhpc1ZhcnMuYnVpbGRzdGVwID0gMlxuICB9XG4gIGlmICh0aGlzVmFycy5idWlsZHN0ZXAgPT0gMCkge1xuICAgIGxvZyh0aGlzVmFycy5hcHAgKyAnU3RhcnRpbmcgRGV2ZWxvcG1lbnQgQnVpbGQnKVxuICB9XG4gIC8vbWpnIGxvZyhyZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5fZ2V0VmVyc2lvbnModGhpc1ZhcnMuYXBwLCB0aGlzVmFycy5wbHVnaW5OYW1lLCB0aGlzVmFycy5mcmFtZXdvcmspKVxuICBsb2d2KHRoaXNWYXJzLmFwcCArICdCdWlsZGluZyBmb3IgJyArIHRoaXNPcHRpb25zLmVudmlyb25tZW50ICsgJywgJyArICdUcmVlc2hha2UgaXMgJyArIHRoaXNPcHRpb25zLnRyZWVzaGFrZSlcbiAgcGx1Z2luLnZhcnMgPSB0aGlzVmFyc1xuICBwbHVnaW4ub3B0aW9ucyA9IHRoaXNPcHRpb25zXG4gIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucywgJ0ZVTkNUSU9OIF9jb25zdHJ1Y3RvcicpXG4gIHJldHVybiBwbHVnaW5cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3RoaXNDb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsICdGVU5DVElPTiBfdGhpc0NvbXBpbGF0aW9uJylcbiAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09IDAgfHwgdmFycy5idWlsZHN0ZXAgPT0gMSkge1xuICAgICAgaWYgKG9wdGlvbnMuc2NyaXB0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gbnVsbCkge1xuICAgICAgICAgIHJ1blNjcmlwdChvcHRpb25zLnNjcmlwdCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndih2YXJzLmFwcCArIGBGaW5pc2hlZCBydW5uaW5nICR7b3B0aW9ucy5zY3JpcHR9YClcbiAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ190aGlzQ29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsICdGVU5DVElPTiBfY29tcGlsYXRpb24nKVxuICAgIGlmIChvcHRpb25zLmZyYW1ld29yayAhPSAnZXh0anMnKSB7XG4gICAgICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdXG4gICAgICBpZiAodmFycy5wcm9kdWN0aW9uKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmZyYW1ld29yayA9PSAnYW5ndWxhcicgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gdHJ1ZSkge1xuICAgICAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKCcuL2FuZ3VsYXJVdGlsJykuX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucylcbiAgICAgICAgfVxuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5zdWNjZWVkTW9kdWxlLnRhcChgZXh0LXN1Y2NlZWQtbW9kdWxlYCwgbW9kdWxlID0+IHtcbiAgICAgICAgICBpZiAobW9kdWxlLnJlc291cmNlICYmICFtb2R1bGUucmVzb3VyY2UubWF0Y2goL25vZGVfbW9kdWxlcy8pKSB7XG4gICAgICAgICAgICBpZihtb2R1bGUucmVzb3VyY2UubWF0Y2goL1xcLmh0bWwkLykgIT0gbnVsbCkge1xuICAgICAgICAgICAgICBpZihtb2R1bGUuX3NvdXJjZS5fdmFsdWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnZG9jdHlwZSBodG1sJykgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbLi4uKHZhcnMuZGVwcyB8fCBbXSksIC4uLnJlcXVpcmUoYC4vJHt2YXJzLmZyYW1ld29ya31VdGlsYCkuZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbLi4uKHZhcnMuZGVwcyB8fCBbXSksIC4uLnJlcXVpcmUoYC4vJHt2YXJzLmZyYW1ld29ya31VdGlsYCkuZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInICYmIG9wdGlvbnMudHJlZXNoYWtlID09IHRydWUpIHtcbiAgICAgICAgICBjb21waWxhdGlvbi5ob29rcy5maW5pc2hNb2R1bGVzLnRhcChgZXh0LWZpbmlzaC1tb2R1bGVzYCwgbW9kdWxlcyA9PiB7XG4gICAgICAgICAgICByZXF1aXJlKCcuL2FuZ3VsYXJVdGlsJykuX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIodmFycywgb3B0aW9ucylcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmFycy5idWlsZHN0ZXAgIT0gMSkge1xuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5odG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uLnRhcChgZXh0LWh0bWwtZ2VuZXJhdGlvbmAsKGRhdGEpID0+IHtcbiAgICAgICAgICBsb2d2KG9wdGlvbnMsJ2h0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24nKVxuICAgICAgICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAgICAgICB2YXIganNQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5qcycpXG4gICAgICAgICAgdmFyIGNzc1BhdGggPSBwYXRoLmpvaW4odmFycy5leHRQYXRoLCAnZXh0LmNzcycpXG4gICAgICAgICAgZGF0YS5hc3NldHMuanMudW5zaGlmdChqc1BhdGgpXG4gICAgICAgICAgZGF0YS5hc3NldHMuY3NzLnVuc2hpZnQoY3NzUGF0aClcbiAgICAgICAgICBsb2codmFycy5hcHAgKyBgQWRkaW5nICR7anNQYXRofSBhbmQgJHtjc3NQYXRofSB0byBpbmRleC5odG1sYClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfY29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9hZnRlckNvbXBpbGUoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucywgJ0ZVTkNUSU9OIF9hZnRlckNvbXBpbGUnKVxuICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2V4dGpzJykge1xuICAgIHJlcXVpcmUoYC4vZXh0anNVdGlsYCkuX2FmdGVyQ29tcGlsZShjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucylcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZW1pdChjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9lbWl0JylcbiAgICB2YXIgZW1pdCA9IG9wdGlvbnMuZW1pdFxuICAgIHZhciB0cmVlc2hha2UgPSBvcHRpb25zLnRyZWVzaGFrZVxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAgIHZhciBlbnZpcm9ubWVudCA9ICBvcHRpb25zLmVudmlyb25tZW50XG4gICAgaWYgKGVtaXQpIHtcbiAgICAgIGlmICgoZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nICYmIHRyZWVzaGFrZSA9PSB0cnVlICAmJiBmcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB8fFxuICAgICAgICAgIChlbnZpcm9ubWVudCAhPSAncHJvZHVjdGlvbicgJiYgdHJlZXNoYWtlID09IGZhbHNlICYmIGZyYW1ld29yayA9PSAnYW5ndWxhcicpIHx8XG4gICAgICAgICAgKGZyYW1ld29yayA9PSAncmVhY3QnKSB8fFxuICAgICAgICAgIChmcmFtZXdvcmsgPT0gJ2NvbXBvbmVudHMnKVxuICAgICAgKSB7XG4gICAgICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgICAgICB2YXIgZnJhbWV3b3JrID0gdmFycy5mcmFtZXdvcmtcbiAgICAgICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgICBjb25zdCBfYnVpbGRFeHRCdW5kbGUgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5fYnVpbGRFeHRCdW5kbGVcbiAgICAgICAgbGV0IG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3V0cHV0UGF0aCx2YXJzLmV4dFBhdGgpXG4gICAgICAgIGlmIChjb21waWxlci5vdXRwdXRQYXRoID09PSAnLycgJiYgY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIpIHtcbiAgICAgICAgICBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGNvbXBpbGVyLm9wdGlvbnMuZGV2U2VydmVyLmNvbnRlbnRCYXNlLCBvdXRwdXRQYXRoKVxuICAgICAgICB9XG4gICAgICAgIGxvZ3Yob3B0aW9ucywnb3V0cHV0UGF0aDogJyArIG91dHB1dFBhdGgpXG4gICAgICAgIGxvZ3Yob3B0aW9ucywnZnJhbWV3b3JrOiAnICsgZnJhbWV3b3JrKVxuICAgICAgICBpZiAoZnJhbWV3b3JrICE9ICdleHRqcycpIHtcbiAgICAgICAgICBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0UGF0aCwgY29tcGlsYXRpb24pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJyAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dFBhdGgsIGNvbXBpbGF0aW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbW1hbmQgPSAnJ1xuICAgICAgICBpZiAob3B0aW9ucy53YXRjaCA9PSAneWVzJyAmJiB2YXJzLnByb2R1Y3Rpb24gPT0gZmFsc2UpIHtcbiAgICAgICAgICBjb21tYW5kID0gJ3dhdGNoJ1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNvbW1hbmQgPSAnYnVpbGQnXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhcnMucmVidWlsZCA9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHBhcm1zID0gW11cbiAgICAgICAgICBpZiAob3B0aW9ucy5wcm9maWxlID09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnByb2ZpbGUgPT0gJycgfHwgb3B0aW9ucy5wcm9maWxlID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMuZW52aXJvbm1lbnRdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhcnMud2F0Y2hTdGFydGVkID09IGZhbHNlKSB7XG4gICAgICAgICAgICBhd2FpdCBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIG9wdGlvbnMpXG4gICAgICAgICAgICB2YXJzLndhdGNoU3RhcnRlZCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywnTk9UIHJ1bm5pbmcgZW1pdCcpXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KG9wdGlvbnMsJ2VtaXQgaXMgZmFsc2UnKVxuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ2VtaXQ6ICcgKyBlKVxuICAgIGNhbGxiYWNrKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0LCBjb21waWxhdGlvbikge1xuICB0cnkge1xuICAgIGxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gX3ByZXBhcmVGb3JCdWlsZCcpXG4gICAgY29uc3QgcmltcmFmID0gcmVxdWlyZSgncmltcmFmJylcbiAgICBjb25zdCBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKVxuICAgIGNvbnN0IGZzeCA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgdmFyIHBhY2thZ2VzID0gb3B0aW9ucy5wYWNrYWdlc1xuICAgIHZhciB0b29sa2l0ID0gb3B0aW9ucy50b29sa2l0XG4gICAgdmFyIHRoZW1lID0gb3B0aW9ucy50aGVtZVxuICAgIHRoZW1lID0gdGhlbWUgfHwgKHRvb2xraXQgPT09ICdjbGFzc2ljJyA/ICd0aGVtZS10cml0b24nIDogJ3RoZW1lLW1hdGVyaWFsJylcbiAgICBsb2d2KG9wdGlvbnMsJ2ZpcnN0VGltZTogJyArIHZhcnMuZmlyc3RUaW1lKVxuICAgIGlmICh2YXJzLmZpcnN0VGltZSkge1xuICAgICAgcmltcmFmLnN5bmMob3V0cHV0KVxuICAgICAgbWtkaXJwLnN5bmMob3V0cHV0KVxuICAgICAgY29uc3QgYnVpbGRYTUwgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmJ1aWxkWE1MXG4gICAgICBjb25zdCBjcmVhdGVBcHBKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVBcHBKc29uXG4gICAgICBjb25zdCBjcmVhdGVXb3Jrc3BhY2VKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVXb3Jrc3BhY2VKc29uXG4gICAgICBjb25zdCBjcmVhdGVKU0RPTUVudmlyb25tZW50ID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVKU0RPTUVudmlyb25tZW50XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdidWlsZC54bWwnKSwgYnVpbGRYTUwodmFycy5wcm9kdWN0aW9uLCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdhcHAuanNvbicpLCBjcmVhdGVBcHBKc29uKHRoZW1lLCBwYWNrYWdlcywgdG9vbGtpdCwgb3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnanNkb20tZW52aXJvbm1lbnQuanMnKSwgY3JlYXRlSlNET01FbnZpcm9ubWVudChvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICd3b3Jrc3BhY2UuanNvbicpLCBjcmVhdGVXb3Jrc3BhY2VKc29uKG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIHZhciBmcmFtZXdvcmsgPSB2YXJzLmZyYW1ld29yaztcbiAgICAgIC8vYmVjYXVzZSBvZiBhIHByb2JsZW0gd2l0aCBjb2xvcnBpY2tlclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vdXgvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3V4JylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAgKyAnQ29weWluZyAodXgpICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAncGFja2FnZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCArICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdvdmVycmlkZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCArICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwncmVzb3VyY2VzLycpKSkge1xuICAgICAgICB2YXIgZnJvbVJlc291cmNlcyA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncmVzb3VyY2VzLycpXG4gICAgICAgIHZhciB0b1Jlc291cmNlcyA9IHBhdGguam9pbihvdXRwdXQsICcuLi9yZXNvdXJjZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVJlc291cmNlcywgdG9SZXNvdXJjZXMpXG4gICAgICAgIGxvZyhhcHAgKyAnQ29weWluZyAnICsgZnJvbVJlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1Jlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICB9XG4gICAgdmFycy5maXJzdFRpbWUgPSBmYWxzZVxuICAgIHZhciBqcyA9ICcnXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbikge1xuICAgICAganMgPSB2YXJzLmRlcHMuam9pbignO1xcbicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGpzID0gJ0V4dC5yZXF1aXJlKFwiRXh0LipcIiknXG4gICAgfVxuICAgIGlmICh2YXJzLm1hbmlmZXN0ID09PSBudWxsIHx8IGpzICE9PSB2YXJzLm1hbmlmZXN0KSB7XG4gICAgICB2YXJzLm1hbmlmZXN0ID0ganNcbiAgICAgIGNvbnN0IG1hbmlmZXN0ID0gcGF0aC5qb2luKG91dHB1dCwgJ21hbmlmZXN0LmpzJylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMobWFuaWZlc3QsIGpzLCAndXRmOCcpXG4gICAgICB2YXJzLnJlYnVpbGQgPSB0cnVlXG4gICAgICB2YXIgYnVuZGxlRGlyID0gb3V0cHV0LnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpXG4gICAgICBpZiAoYnVuZGxlRGlyLnRyaW0oKSA9PSAnJykge2J1bmRsZURpciA9ICcuLyd9XG4gICAgICBsb2coYXBwICsgJ0J1aWxkaW5nIEV4dCBidW5kbGUgYXQ6ICcgKyBidW5kbGVEaXIpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5yZWJ1aWxkID0gZmFsc2VcbiAgICAgIGxvZyhhcHAgKyAnRXh0IHJlYnVpbGQgTk9UIG5lZWRlZCcpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX3ByZXBhcmVGb3JCdWlsZDogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2J1aWxkRXh0QnVuZGxlKGFwcCwgY29tcGlsYXRpb24sIG91dHB1dFBhdGgsIHBhcm1zLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9idWlsZEV4dEJ1bmRsZScpXG4gICAgbGV0IHNlbmNoYTsgdHJ5IHsgc2VuY2hhID0gcmVxdWlyZSgnQHNlbmNoYS9jbWQnKSB9IGNhdGNoIChlKSB7IHNlbmNoYSA9ICdzZW5jaGEnIH1cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhzZW5jaGEpKSB7XG4gICAgICBsb2d2KG9wdGlvbnMsJ3NlbmNoYSBmb2xkZXIgZXhpc3RzJylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KG9wdGlvbnMsJ3NlbmNoYSBmb2xkZXIgRE9FUyBOT1QgZXhpc3QnKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgb25CdWlsZERvbmUgPSAoKSA9PiB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywnb25CdWlsZERvbmUnKVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH1cbiAgICAgIHZhciBvcHRzID0geyBjd2Q6IG91dHB1dFBhdGgsIHNpbGVudDogdHJ1ZSwgc3RkaW86ICdwaXBlJywgZW5jb2Rpbmc6ICd1dGYtOCd9XG4gICAgICBleGVjdXRlQXN5bmMoYXBwLCBzZW5jaGEsIHBhcm1zLCBvcHRzLCBjb21waWxhdGlvbiwgb3B0aW9ucykudGhlbiAoXG4gICAgICAgIGZ1bmN0aW9uKCkgeyBvbkJ1aWxkRG9uZSgpIH0sIFxuICAgICAgICBmdW5jdGlvbihyZWFzb24pIHsgcmVqZWN0KHJlYXNvbikgfVxuICAgICAgKVxuICAgIH0pXG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIGNvbnNvbGUubG9nKCdlJylcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2J1aWxkRXh0QnVuZGxlOiAnICsgZSlcbiAgICBjYWxsYmFjaygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2RvbmUodmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIGNvbnN0IGxvZyA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ1xuICAgIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gICAgbG9ndihvcHRpb25zLCdGVU5DVElPTiBfZG9uZScpXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlICYmIG9wdGlvbnMudHJlZXNoYWtlID09IGZhbHNlICYmIG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJykge1xuICAgICAgcmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5fdG9EZXYodmFycywgb3B0aW9ucylcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmKG9wdGlvbnMuYnJvd3NlciA9PSB0cnVlICYmIG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKSB7XG4gICAgICAgIGlmICh2YXJzLmJyb3dzZXJDb3VudCA9PSAwKSB7XG4gICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OicgKyBvcHRpb25zLnBvcnRcbiAgICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAgKyBgT3BlbmluZyBicm93c2VyIGF0ICR7dXJsfWApXG4gICAgICAgICAgdmFycy5icm93c2VyQ291bnQrK1xuICAgICAgICAgIGNvbnN0IG9wbiA9IHJlcXVpcmUoJ29wbicpXG4gICAgICAgICAgb3BuKHVybClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgIC8vY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ3Nob3cgYnJvd3NlciB3aW5kb3cgLSBleHQtZG9uZTogJyArIGUpXG4gICAgfVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAwKSB7XG4gICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAgKyBgRW5kaW5nIERldmVsb3BtZW50IEJ1aWxkYClcbiAgICB9XG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09IDIpIHtcbiAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCArIGBFbmRpbmcgUHJvZHVjdGlvbiBCdWlsZGApXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlQXN5bmMgKGFwcCwgY29tbWFuZCwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgLy9jb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBTZXJ2ZXJcIiwgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gICAgY29uc3QgREVGQVVMVF9TVUJTVFJTID0gW1wiW0lORl0geFNlcnZlclwiLCAnW0lORl0gTG9hZGluZycsICdbSU5GXSBBcHBlbmQnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbSU5GXSBQcm9jZXNzaW5nIEJ1aWxkJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgICB2YXIgc3Vic3RyaW5ncyA9IERFRkFVTFRfU1VCU1RSUyBcbiAgICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gICAgY29uc3QgY3Jvc3NTcGF3biA9IHJlcXVpcmUoJ2Nyb3NzLXNwYXduJylcbiAgICBjb25zdCBsb2cgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2dcbiAgICBsb2d2KG9wdGlvbnMsICdGVU5DVElPTiBleGVjdXRlQXN5bmMnKVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxvZ3Yob3B0aW9ucyxgY29tbWFuZCAtICR7Y29tbWFuZH1gKVxuICAgICAgbG9ndihvcHRpb25zLCBgcGFybXMgLSAke3Bhcm1zfWApXG4gICAgICBsb2d2KG9wdGlvbnMsIGBvcHRzIC0gJHtKU09OLnN0cmluZ2lmeShvcHRzKX1gKVxuICAgICAgbGV0IGNoaWxkID0gY3Jvc3NTcGF3bihjb21tYW5kLCBwYXJtcywgb3B0cylcbiAgICAgIGNoaWxkLm9uKCdjbG9zZScsIChjb2RlLCBzaWduYWwpID0+IHtcbiAgICAgICAgbG9ndihvcHRpb25zLCBgb24gY2xvc2U6IGAgKyBjb2RlKSBcbiAgICAgICAgaWYoY29kZSA9PT0gMCkgeyByZXNvbHZlKDApIH1cbiAgICAgICAgZWxzZSB7IGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCBuZXcgRXJyb3IoY29kZSkgKTsgcmVzb2x2ZSgwKSB9XG4gICAgICB9KVxuICAgICAgY2hpbGQub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7IFxuICAgICAgICBsb2d2KG9wdGlvbnMsIGBvbiBlcnJvcmApIFxuICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChlcnJvcilcbiAgICAgICAgcmVzb2x2ZSgwKVxuICAgICAgfSlcbiAgICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICBsb2d2KG9wdGlvbnMsIGAke3N0cn1gKVxuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkubWF0Y2goL0Zhc2hpb24gd2FpdGluZyBmb3IgY2hhbmdlc1xcLlxcLlxcLi8pKSB7XG5cbiAgICAgICAgICAvLyBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICAgICAgLy8gdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSsnL3NyYy9pbmRleC5qcyc7XG4gICAgICAgICAgLy8gdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuICAgICAgICAgIC8vIGZzLndyaXRlRmlsZVN5bmMoZmlsZW5hbWUsIGRhdGEgKyAnICcsICd1dGY4JylcbiAgICAgICAgICAvLyBsb2d2KG9wdGlvbnMsIGB0b3VjaGluZyAke2ZpbGVuYW1lfWApXG5cbiAgICAgICAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICAgICAgdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSArICcvc3JjL2luZGV4LmpzJztcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgZGF0YSArICcgJywgJ3V0ZjgnKTtcbiAgICAgICAgICAgIGxvZyhvcHRpb25zLCBgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2goZSkge1xuICAgICAgICAgICAgbG9nKG9wdGlvbnMsIGBOT1QgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKDApXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKHN1YnN0cmluZ3Muc29tZShmdW5jdGlvbih2KSB7IHJldHVybiBkYXRhLmluZGV4T2YodikgPj0gMDsgfSkpIHsgXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltJTkZdXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltMT0ddXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykudHJpbSgpXG4gICAgICAgICAgICBpZiAoc3RyLmluY2x1ZGVzKFwiW0VSUl1cIikpIHtcbiAgICAgICAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goYXBwICsgc3RyLnJlcGxhY2UoL15cXFtFUlJcXF0gL2dpLCAnJykpO1xuICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltFUlJdXCIsIGAke2NoYWxrLnJlZChcIltFUlJdXCIpfWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2coYCR7YXBwfSR7c3RyfWApIFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNoaWxkLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywgYGVycm9yIG9uIGNsb3NlOiBgICsgZGF0YSkgXG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICB2YXIgc3RySmF2YU9wdHMgPSBcIlBpY2tlZCB1cCBfSkFWQV9PUFRJT05TXCI7XG4gICAgICAgIHZhciBpbmNsdWRlcyA9IHN0ci5pbmNsdWRlcyhzdHJKYXZhT3B0cylcbiAgICAgICAgaWYgKCFpbmNsdWRlcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2FwcH0gJHtjaGFsay5yZWQoXCJbRVJSXVwiKX0gJHtzdHJ9YClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnZXhlY3V0ZUFzeW5jOiAnICsgZSlcbiAgICBjYWxsYmFjaygpXG4gIH0gXG59XG5cbi8vKioqKioqKioqKlxuZnVuY3Rpb24gcnVuU2NyaXB0KHNjcmlwdFBhdGgsIGNhbGxiYWNrKSB7XG4gIHZhciBjaGlsZFByb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG4gIC8vIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBjYWxsYmFjayBoYXMgYmVlbiBpbnZva2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgaW52b2NhdGlvbnNcbiAgdmFyIGludm9rZWQgPSBmYWxzZTtcbiAgdmFyIHByb2Nlc3MgPSBjaGlsZFByb2Nlc3MuZm9yayhzY3JpcHRQYXRoKTtcbiAgLy8gbGlzdGVuIGZvciBlcnJvcnMgYXMgdGhleSBtYXkgcHJldmVudCB0aGUgZXhpdCBldmVudCBmcm9tIGZpcmluZ1xuICBwcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xuICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjayBvbmNlIHRoZSBwcm9jZXNzIGhhcyBmaW5pc2hlZCBydW5uaW5nXG4gIHByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZSkge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgdmFyIGVyciA9IGNvZGUgPT09IDAgPyBudWxsIDogbmV3IEVycm9yKCdleGl0IGNvZGUgJyArIGNvZGUpO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0QXBwKCkge1xuICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gIHZhciBwcmVmaXggPSBgYFxuICBjb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKVxuICBpZiAocGxhdGZvcm0gPT0gJ2RhcndpbicpIHsgcHJlZml4ID0gYOKEuSDvvaJleHTvvaM6YCB9XG4gIGVsc2UgeyBwcmVmaXggPSBgaSBbZXh0XTpgIH1cbiAgcmV0dXJuIGAke2NoYWxrLmdyZWVuKHByZWZpeCl9IGBcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2dldFZlcnNpb25zKGFwcCwgcGx1Z2luTmFtZSwgZnJhbWV3b3JrTmFtZSkge1xuICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICB2YXIgdiA9IHt9XG4gIHZhciBwbHVnaW5QYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhJywgcGx1Z2luTmFtZSlcbiAgdmFyIHBsdWdpblBrZyA9IChmcy5leGlzdHNTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwbHVnaW5QYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5wbHVnaW5WZXJzaW9uID0gcGx1Z2luUGtnLnZlcnNpb25cbiAgdi5fcmVzb2x2ZWQgPSBwbHVnaW5Qa2cuX3Jlc29sdmVkXG4gIGlmICh2Ll9yZXNvbHZlZCA9PSB1bmRlZmluZWQpIHtcbiAgICB2LmVkaXRpb24gPSBgQ29tbWVyY2lhbGBcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAoLTEgPT0gdi5fcmVzb2x2ZWQuaW5kZXhPZignY29tbXVuaXR5JykpIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tdW5pdHlgXG4gICAgfVxuICB9XG4gIHZhciB3ZWJwYWNrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvd2VicGFjaycpXG4gIHZhciB3ZWJwYWNrUGtnID0gKGZzLmV4aXN0c1N5bmMod2VicGFja1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYud2VicGFja1ZlcnNpb24gPSB3ZWJwYWNrUGtnLnZlcnNpb25cbiAgdmFyIGV4dFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0JylcbiAgdmFyIGV4dFBrZyA9IChmcy5leGlzdHNTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhleHRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5leHRWZXJzaW9uID0gZXh0UGtnLnNlbmNoYS52ZXJzaW9uXG4gIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gIHZhciBjbWRQa2cgPSAoZnMuZXhpc3RzU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgaWYgKHYuY21kVmVyc2lvbiA9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgY21kUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLGBub2RlX21vZHVsZXMvQHNlbmNoYS8ke3BsdWdpbk5hbWV9L25vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gICAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXG4gIH1cbiAgdmFyIGZyYW1ld29ya0luZm8gPSAnJ1xuICAgaWYgKGZyYW1ld29ya05hbWUgIT0gdW5kZWZpbmVkICYmIGZyYW1ld29ya05hbWUgIT0gJ2V4dGpzJykge1xuICAgIHZhciBmcmFtZXdvcmtQYXRoID0gJydcbiAgICBpZiAoZnJhbWV3b3JrTmFtZSA9PSAncmVhY3QnKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9yZWFjdCcpXG4gICAgfVxuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdhbmd1bGFyJykge1xuICAgICAgZnJhbWV3b3JrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQGFuZ3VsYXIvY29yZScpXG4gICAgfVxuICAgIHZhciBmcmFtZXdvcmtQa2cgPSAoZnMuZXhpc3RzU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZnJhbWV3b3JrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gICAgdi5mcmFtZXdvcmtWZXJzaW9uID0gZnJhbWV3b3JrUGtnLnZlcnNpb25cbiAgICBmcmFtZXdvcmtJbmZvID0gJywgJyArIGZyYW1ld29ya05hbWUgKyAnIHYnICsgdi5mcmFtZXdvcmtWZXJzaW9uXG4gIH1cbiAgcmV0dXJuIGFwcCArICdleHQtd2VicGFjay1wbHVnaW4gdicgKyB2LnBsdWdpblZlcnNpb24gKyAnLCBFeHQgSlMgdicgKyB2LmV4dFZlcnNpb24gKyAnICcgKyB2LmVkaXRpb24gKyAnIEVkaXRpb24sIFNlbmNoYSBDbWQgdicgKyB2LmNtZFZlcnNpb24gKyAnLCB3ZWJwYWNrIHYnICsgdi53ZWJwYWNrVmVyc2lvbiArIGZyYW1ld29ya0luZm9cbiB9XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhzKSB7XG4gIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gIHRyeSB7cHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKCl9Y2F0Y2goZSkge31cbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocyk7cHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2gocykge1xuICB2YXIgaCA9IGZhbHNlXG4gIGlmIChoID09IHRydWUpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9ndihvcHRpb25zLCBzKSB7XG4gIGlmIChvcHRpb25zLnZlcmJvc2UgPT0gJ3llcycpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGAtdmVyYm9zZTogJHtzfWApXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cbiJdfQ==