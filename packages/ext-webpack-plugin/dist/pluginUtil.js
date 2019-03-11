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

      case 'components':
        thisVars.pluginName = 'ext-webpack-plugin';
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

    if (thisVars.production == true && thisOptions.treeshake == true && (options.framework == 'angular' || options.framework == 'components')) {
      log(thisVars.app + 'Starting Production Build - Step 1');
      thisVars.buildstep = 1;

      require(`./${thisOptions.framework}Util`)._toProd(thisVars, thisOptions);
    }

    if (thisVars.production == true && thisOptions.treeshake == false && (options.framework == 'angular' || options.framework == 'components')) {
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
                vars.deps = [...(vars.deps || []), ...require(`./${vars.framework}Util`)._extractFromSource(module, options, compilation, extComponents)];
              }
            } else {
              vars.deps = [...(vars.deps || []), ...require(`./${vars.framework}Util`)._extractFromSource(module, options, compilation, extComponents)];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJmcyIsInJlcXVpcmUiLCJ0aGlzVmFycyIsInRoaXNPcHRpb25zIiwicGx1Z2luIiwiZnJhbWV3b3JrIiwidW5kZWZpbmVkIiwicGx1Z2luRXJyb3JzIiwicHVzaCIsInZhcnMiLCJ2YWxpZGF0ZU9wdGlvbnMiLCJnZXRWYWxpZGF0ZU9wdGlvbnMiLCJnZXREZWZhdWx0VmFycyIsInBsdWdpbk5hbWUiLCJhcHAiLCJfZ2V0QXBwIiwibG9naCIsImxvZ3YiLCJyYyIsImV4aXN0c1N5bmMiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJnZXREZWZhdWx0T3B0aW9ucyIsInN0cmluZ2lmeSIsImVudmlyb25tZW50IiwicHJvZHVjdGlvbiIsInRyZWVzaGFrZSIsImxvZyIsImJ1aWxkc3RlcCIsIl90b1Byb2QiLCJlIiwiY29uc29sZSIsIl90aGlzQ29tcGlsYXRpb24iLCJjb21waWxlciIsImNvbXBpbGF0aW9uIiwic2NyaXB0IiwicnVuU2NyaXB0IiwiZXJyIiwiZXJyb3JzIiwiX2NvbXBpbGF0aW9uIiwiZXh0Q29tcG9uZW50cyIsIl9nZXRBbGxDb21wb25lbnRzIiwiaG9va3MiLCJzdWNjZWVkTW9kdWxlIiwidGFwIiwibW9kdWxlIiwicmVzb3VyY2UiLCJtYXRjaCIsIl9zb3VyY2UiLCJfdmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiZGVwcyIsIl9leHRyYWN0RnJvbVNvdXJjZSIsImZpbmlzaE1vZHVsZXMiLCJtb2R1bGVzIiwiX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIiLCJodG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uIiwiZGF0YSIsInBhdGgiLCJqc1BhdGgiLCJqb2luIiwiZXh0UGF0aCIsImNzc1BhdGgiLCJhc3NldHMiLCJqcyIsInVuc2hpZnQiLCJjc3MiLCJfYWZ0ZXJDb21waWxlIiwiX2VtaXQiLCJjYWxsYmFjayIsImVtaXQiLCJfYnVpbGRFeHRCdW5kbGUiLCJvdXRwdXRQYXRoIiwiZGV2U2VydmVyIiwiY29udGVudEJhc2UiLCJfcHJlcGFyZUZvckJ1aWxkIiwiY29tbWFuZCIsIndhdGNoIiwicmVidWlsZCIsInBhcm1zIiwicHJvZmlsZSIsIndhdGNoU3RhcnRlZCIsIm91dHB1dCIsInJpbXJhZiIsIm1rZGlycCIsImZzeCIsInBhY2thZ2VzIiwidG9vbGtpdCIsInRoZW1lIiwiZmlyc3RUaW1lIiwic3luYyIsImJ1aWxkWE1MIiwiY3JlYXRlQXBwSnNvbiIsImNyZWF0ZVdvcmtzcGFjZUpzb24iLCJjcmVhdGVKU0RPTUVudmlyb25tZW50Iiwid3JpdGVGaWxlU3luYyIsInByb2Nlc3MiLCJjd2QiLCJmcm9tUGF0aCIsInRvUGF0aCIsImNvcHlTeW5jIiwicmVwbGFjZSIsImZyb21SZXNvdXJjZXMiLCJ0b1Jlc291cmNlcyIsIm1hbmlmZXN0IiwiYnVuZGxlRGlyIiwidHJpbSIsInNlbmNoYSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25CdWlsZERvbmUiLCJvcHRzIiwic2lsZW50Iiwic3RkaW8iLCJlbmNvZGluZyIsImV4ZWN1dGVBc3luYyIsInRoZW4iLCJyZWFzb24iLCJfZG9uZSIsIl90b0RldiIsImJyb3dzZXIiLCJicm93c2VyQ291bnQiLCJ1cmwiLCJwb3J0Iiwib3BuIiwiREVGQVVMVF9TVUJTVFJTIiwic3Vic3RyaW5ncyIsImNoYWxrIiwiY3Jvc3NTcGF3biIsImNoaWxkIiwib24iLCJjb2RlIiwic2lnbmFsIiwiRXJyb3IiLCJlcnJvciIsInN0ZG91dCIsInN0ciIsInRvU3RyaW5nIiwiZmlsZW5hbWUiLCJzb21lIiwidiIsImluZGV4T2YiLCJyZWQiLCJzdGRlcnIiLCJzdHJKYXZhT3B0cyIsInNjcmlwdFBhdGgiLCJjaGlsZFByb2Nlc3MiLCJpbnZva2VkIiwiZm9yayIsInByZWZpeCIsInBsYXRmb3JtIiwiZ3JlZW4iLCJfZ2V0VmVyc2lvbnMiLCJmcmFtZXdvcmtOYW1lIiwicGx1Z2luUGF0aCIsInBsdWdpblBrZyIsInBsdWdpblZlcnNpb24iLCJ2ZXJzaW9uIiwiX3Jlc29sdmVkIiwiZWRpdGlvbiIsIndlYnBhY2tQYXRoIiwid2VicGFja1BrZyIsIndlYnBhY2tWZXJzaW9uIiwiZXh0UGtnIiwiZXh0VmVyc2lvbiIsImNtZFBhdGgiLCJjbWRQa2ciLCJjbWRWZXJzaW9uIiwidmVyc2lvbl9mdWxsIiwiZnJhbWV3b3JrSW5mbyIsImZyYW1ld29ya1BhdGgiLCJmcmFtZXdvcmtQa2ciLCJmcmFtZXdvcmtWZXJzaW9uIiwicyIsImN1cnNvclRvIiwiY2xlYXJMaW5lIiwid3JpdGUiLCJoIiwidmVyYm9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ08sU0FBU0EsWUFBVCxDQUFzQkMsT0FBdEIsRUFBK0I7QUFDcEMsUUFBTUMsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxNQUFJQyxRQUFRLEdBQUcsRUFBZjtBQUNBLE1BQUlDLFdBQVcsR0FBRyxFQUFsQjtBQUNBLE1BQUlDLE1BQU0sR0FBRyxFQUFiOztBQUNBLE1BQUk7QUFDRixRQUFJTCxPQUFPLENBQUNNLFNBQVIsSUFBcUJDLFNBQXpCLEVBQW9DO0FBQ2xDSixNQUFBQSxRQUFRLENBQUNLLFlBQVQsR0FBd0IsRUFBeEI7QUFDQUwsTUFBQUEsUUFBUSxDQUFDSyxZQUFULENBQXNCQyxJQUF0QixDQUEyQixzSEFBM0I7QUFDQUosTUFBQUEsTUFBTSxDQUFDSyxJQUFQLEdBQWNQLFFBQWQ7QUFDQSxhQUFPRSxNQUFQO0FBQ0Q7O0FBQ0QsVUFBTU0sZUFBZSxHQUFHVCxPQUFPLENBQUMsY0FBRCxDQUEvQjs7QUFDQVMsSUFBQUEsZUFBZSxDQUFDVCxPQUFPLENBQUUsS0FBSUYsT0FBTyxDQUFDTSxTQUFVLE1BQXhCLENBQVAsQ0FBc0NNLGtCQUF0QyxFQUFELEVBQTZEWixPQUE3RCxFQUFzRSxFQUF0RSxDQUFmO0FBQ0FHLElBQUFB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QSxPQUFPLENBQUN3QyxNQUFSLENBQWV3QyxTQUFmO0FBQ0QsS0FGRCxDQUdBLE9BQU1uSixDQUFOLEVBQVMsQ0FBRTs7QUFDWG1FLElBQUFBLE9BQU8sQ0FBQ3dDLE1BQVIsQ0FBZXlDLEtBQWYsQ0FBc0IsYUFBWUgsQ0FBRSxFQUFwQztBQUNBOUUsSUFBQUEsT0FBTyxDQUFDd0MsTUFBUixDQUFleUMsS0FBZixDQUFxQixJQUFyQjtBQUNEO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfY29uc3RydWN0b3Iob3B0aW9ucykge1xuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgdmFyIHRoaXNWYXJzID0ge31cbiAgdmFyIHRoaXNPcHRpb25zID0ge31cbiAgdmFyIHBsdWdpbiA9IHt9XG4gIHRyeSB7XG4gICAgaWYgKG9wdGlvbnMuZnJhbWV3b3JrID09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpc1ZhcnMucGx1Z2luRXJyb3JzID0gW11cbiAgICAgIHRoaXNWYXJzLnBsdWdpbkVycm9ycy5wdXNoKCd3ZWJwYWNrIGNvbmZpZzogZnJhbWV3b3JrIHBhcmFtZXRlciBvbiBleHQtd2VicGFjay1wbHVnaW4gaXMgbm90IGRlZmluZWQgLSB2YWx1ZXM6IHJlYWN0LCBhbmd1bGFyLCBleHRqcywgY29tcG9uZW50cycpXG4gICAgICBwbHVnaW4udmFycyA9IHRoaXNWYXJzXG4gICAgICByZXR1cm4gcGx1Z2luXG4gICAgfVxuICAgIGNvbnN0IHZhbGlkYXRlT3B0aW9ucyA9IHJlcXVpcmUoJ3NjaGVtYS11dGlscycpXG4gICAgdmFsaWRhdGVPcHRpb25zKHJlcXVpcmUoYC4vJHtvcHRpb25zLmZyYW1ld29ya31VdGlsYCkuZ2V0VmFsaWRhdGVPcHRpb25zKCksIG9wdGlvbnMsICcnKVxuICAgIHRoaXNWYXJzID0gcmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5nZXREZWZhdWx0VmFycygpXG4gICAgdGhpc1ZhcnMuZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBzd2l0Y2godGhpc1ZhcnMuZnJhbWV3b3JrKSB7XG4gICAgICBjYXNlICdleHRqcyc6XG4gICAgICAgIHRoaXNWYXJzLnBsdWdpbk5hbWUgPSAnZXh0LXdlYnBhY2stcGx1Z2luJ1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlYWN0JzpcbiAgICAgICAgdGhpc1ZhcnMucGx1Z2luTmFtZSA9ICdleHQtcmVhY3Qtd2VicGFjay1wbHVnaW4nXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYW5ndWxhcic6XG4gICAgICAgIHRoaXNWYXJzLnBsdWdpbk5hbWUgPSAnZXh0LWFuZ3VsYXItd2VicGFjay1wbHVnaW4nXG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjb21wb25lbnRzJzpcbiAgICAgICAgdGhpc1ZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpc1ZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gICAgfVxuICAgIHRoaXNWYXJzLmFwcCA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLl9nZXRBcHAoKVxuICAgIHJlcXVpcmUoYC4vcGx1Z2luVXRpbGApLmxvZ2godGhpc1ZhcnMuYXBwICsgYEhPT0sgY29uc3RydWN0b3JgKVxuICAgIGxvZ3Yob3B0aW9ucywgYHBsdWdpbk5hbWUgLSAke3RoaXNWYXJzLnBsdWdpbk5hbWV9YClcbiAgICBsb2d2KG9wdGlvbnMsIGB0aGlzVmFycy5hcHAgLSAke3RoaXNWYXJzLmFwcH1gKVxuICAgIGNvbnN0IHJjID0gKGZzLmV4aXN0c1N5bmMoYC5leHQtJHt0aGlzVmFycy5mcmFtZXdvcmt9cmNgKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhgLmV4dC0ke3RoaXNWYXJzLmZyYW1ld29ya31yY2AsICd1dGYtOCcpKSB8fCB7fSlcbiAgICB0aGlzT3B0aW9ucyA9IHsgLi4ucmVxdWlyZShgLi8ke3RoaXNWYXJzLmZyYW1ld29ya31VdGlsYCkuZ2V0RGVmYXVsdE9wdGlvbnMoKSwgLi4ub3B0aW9ucywgLi4ucmMgfVxuICAgIGxvZ3Yob3B0aW9ucywgYHRoaXNPcHRpb25zIC0gJHtKU09OLnN0cmluZ2lmeSh0aGlzT3B0aW9ucyl9YClcbiAgICBpZiAodGhpc09wdGlvbnMuZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nKSBcbiAgICAgIHt0aGlzVmFycy5wcm9kdWN0aW9uID0gdHJ1ZX1cbiAgICBlbHNlIFxuICAgICAge3RoaXNWYXJzLnByb2R1Y3Rpb24gPSBmYWxzZX1cbiAgICBsb2d2KG9wdGlvbnMsIGB0aGlzVmFycyAtICR7SlNPTi5zdHJpbmdpZnkodGhpc1ZhcnMpfWApXG5cbiAgICBpZiAodGhpc1ZhcnMucHJvZHVjdGlvbiA9PSB0cnVlICYmIHRoaXNPcHRpb25zLnRyZWVzaGFrZSA9PSB0cnVlICYmIChvcHRpb25zLmZyYW1ld29yayA9PSAnYW5ndWxhcicgfHwgb3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2NvbXBvbmVudHMnKSApIHtcbiAgICAgIGxvZyh0aGlzVmFycy5hcHAgKyAnU3RhcnRpbmcgUHJvZHVjdGlvbiBCdWlsZCAtIFN0ZXAgMScpXG4gICAgICB0aGlzVmFycy5idWlsZHN0ZXAgPSAxXG4gICAgICByZXF1aXJlKGAuLyR7dGhpc09wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5fdG9Qcm9kKHRoaXNWYXJzLCB0aGlzT3B0aW9ucylcbiAgICB9XG4gICAgaWYgKHRoaXNWYXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSAmJiB0aGlzT3B0aW9ucy50cmVlc2hha2UgPT0gZmFsc2UgJiYgKG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJyB8fCBvcHRpb25zLmZyYW1ld29yayA9PSAnY29tcG9uZW50cycpKSB7XG4gICAgICAvL21qZyBsb2codGhpc1ZhcnMuYXBwICsgJyhjaGVjayBmb3IgcHJvZCBmb2xkZXIgYW5kIG1vZHVsZSBjaGFuZ2UpJylcbiAgICAgIGxvZyh0aGlzVmFycy5hcHAgKyAnU3RhcnRpbmcgUHJvZHVjdGlvbiBCdWlsZCAtIFN0ZXAgMicpXG4gICAgICB0aGlzVmFycy5idWlsZHN0ZXAgPSAyXG4gICAgfVxuICAgIGlmICh0aGlzVmFycy5idWlsZHN0ZXAgPT0gMCkge1xuICAgICAgbG9nKHRoaXNWYXJzLmFwcCArICdTdGFydGluZyBEZXZlbG9wbWVudCBCdWlsZCcpXG4gICAgfVxuICAgIC8vbWpnIGxvZyhyZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5fZ2V0VmVyc2lvbnModGhpc1ZhcnMuYXBwLCB0aGlzVmFycy5wbHVnaW5OYW1lLCB0aGlzVmFycy5mcmFtZXdvcmspKVxuICAgIGxvZ3YodGhpc1ZhcnMuYXBwICsgJ0J1aWxkaW5nIGZvciAnICsgdGhpc09wdGlvbnMuZW52aXJvbm1lbnQgKyAnLCAnICsgJ1RyZWVzaGFrZSBpcyAnICsgdGhpc09wdGlvbnMudHJlZXNoYWtlKVxuICAgIHBsdWdpbi52YXJzID0gdGhpc1ZhcnNcbiAgICBwbHVnaW4ub3B0aW9ucyA9IHRoaXNPcHRpb25zXG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnRlVOQ1RJT04gX2NvbnN0cnVjdG9yJylcbiAgICByZXR1cm4gcGx1Z2luXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF90aGlzQ29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnRlVOQ1RJT04gX3RoaXNDb21waWxhdGlvbicpXG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zICsgYG9wdGlvbnMuc2NyaXB0OiAke29wdGlvbnMuc2NyaXB0IH1gKVxuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyArIGBidWlsZHN0ZXA6ICR7dmFycy5idWlsZHN0ZXB9YClcblxuICAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gMCB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAxKSB7XG4gICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChvcHRpb25zLnNjcmlwdCAhPSBudWxsKSB7XG4gICAgICAgICAgcnVuU2NyaXB0KG9wdGlvbnMuc2NyaXB0LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMgKyBgRmluaXNoZWQgcnVubmluZyAke29wdGlvbnMuc2NyaXB0fWApXG4gICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zICsgYG9wdGlvbnMuc2NyaXB0OiAke29wdGlvbnMuc2NyaXB0IH1gKVxuICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMgKyBgYnVpbGRzdGVwOiAke3ZhcnMuYnVpbGRzdGVwfWApXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX3RoaXNDb21waWxhdGlvbjogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucywgJ0ZVTkNUSU9OIF9jb21waWxhdGlvbicpXG4gICAgaWYgKG9wdGlvbnMuZnJhbWV3b3JrICE9ICdleHRqcycpIHtcbiAgICAgIHZhciBleHRDb21wb25lbnRzID0gW11cbiAgICAgIGlmICh2YXJzLnByb2R1Y3Rpb24pIHtcbiAgICAgICAgaWYgKChvcHRpb25zLmZyYW1ld29yayA9PSAnYW5ndWxhcicgfHwgb3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2NvbXBvbmVudHMnKSAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSB0cnVlKSB7XG4gICAgICAgICAgZXh0Q29tcG9uZW50cyA9IHJlcXVpcmUoYC4vJHtvcHRpb25zLmZyYW1ld29ya31VdGlsYCkuX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucylcbiAgICAgICAgfVxuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5zdWNjZWVkTW9kdWxlLnRhcChgZXh0LXN1Y2NlZWQtbW9kdWxlYCwgbW9kdWxlID0+IHtcbiAgICAgICAgICBpZiAobW9kdWxlLnJlc291cmNlICYmICFtb2R1bGUucmVzb3VyY2UubWF0Y2goL25vZGVfbW9kdWxlcy8pKSB7XG4gICAgICAgICAgICBpZihtb2R1bGUucmVzb3VyY2UubWF0Y2goL1xcLmh0bWwkLykgIT0gbnVsbCkge1xuICAgICAgICAgICAgICBpZihtb2R1bGUuX3NvdXJjZS5fdmFsdWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnZG9jdHlwZSBodG1sJykgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4gICAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbiAgICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHt2YXJzLmZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgdmFycy5kZXBzID0gW1xuICAgICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHt2YXJzLmZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgaWYgKChvcHRpb25zLmZyYW1ld29yayA9PSAnYW5ndWxhcicgfHwgb3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2NvbXBvbmVudHMnKSAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSB0cnVlKSB7XG4gICAgICAgICAgY29tcGlsYXRpb24uaG9va3MuZmluaXNoTW9kdWxlcy50YXAoYGV4dC1maW5pc2gtbW9kdWxlc2AsIG1vZHVsZXMgPT4ge1xuICAgICAgICAgICAgcmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5fd3JpdGVGaWxlc1RvUHJvZEZvbGRlcih2YXJzLCBvcHRpb25zKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCAhPSAxKSB7XG4gICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLmh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24udGFwKGBleHQtaHRtbC1nZW5lcmF0aW9uYCwoZGF0YSkgPT4ge1xuICAgICAgICAgIGxvZ3Yob3B0aW9ucywnaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbicpXG4gICAgICAgICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgICAgIHZhciBqc1BhdGggPSBwYXRoLmpvaW4odmFycy5leHRQYXRoLCAnZXh0LmpzJylcbiAgICAgICAgICB2YXIgY3NzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuY3NzJylcbiAgICAgICAgICBkYXRhLmFzc2V0cy5qcy51bnNoaWZ0KGpzUGF0aClcbiAgICAgICAgICBkYXRhLmFzc2V0cy5jc3MudW5zaGlmdChjc3NQYXRoKVxuICAgICAgICAgIGxvZyh2YXJzLmFwcCArIGBBZGRpbmcgJHtqc1BhdGh9IGFuZCAke2Nzc1BhdGh9IHRvIGluZGV4Lmh0bWxgKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19jb21waWxhdGlvbjogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2FmdGVyQ29tcGlsZShjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZScpXG4gIGlmIChvcHRpb25zLmZyYW1ld29yayA9PSAnZXh0anMnKSB7XG4gICAgcmVxdWlyZShgLi9leHRqc1V0aWxgKS5fYWZ0ZXJDb21waWxlKGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIF9lbWl0KGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBsb2cgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2dcbiAgICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICAgIGxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gX2VtaXQnKVxuICAgIHZhciBlbWl0ID0gb3B0aW9ucy5lbWl0XG4gICAgdmFyIHRyZWVzaGFrZSA9IG9wdGlvbnMudHJlZXNoYWtlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgdmFyIGVudmlyb25tZW50ID0gIG9wdGlvbnMuZW52aXJvbm1lbnRcbiAgICBpZiAoZW1pdCkge1xuICAgICAgaWYgKChlbnZpcm9ubWVudCA9PSAncHJvZHVjdGlvbicgJiYgdHJlZXNoYWtlID09IHRydWUgICYmIGZyYW1ld29yayA9PSAnYW5ndWxhcicpIHx8XG4gICAgICAgICAgKGVudmlyb25tZW50ICE9ICdwcm9kdWN0aW9uJyAmJiB0cmVlc2hha2UgPT0gZmFsc2UgJiYgZnJhbWV3b3JrID09ICdhbmd1bGFyJykgfHxcbiAgICAgICAgICAoZnJhbWV3b3JrID09ICdyZWFjdCcpIHx8XG4gICAgICAgICAgKGZyYW1ld29yayA9PSAnY29tcG9uZW50cycpXG4gICAgICApIHtcbiAgICAgICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgICAgIHZhciBmcmFtZXdvcmsgPSB2YXJzLmZyYW1ld29ya1xuICAgICAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgICAgIGNvbnN0IF9idWlsZEV4dEJ1bmRsZSA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLl9idWlsZEV4dEJ1bmRsZVxuICAgICAgICBsZXQgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vdXRwdXRQYXRoLHZhcnMuZXh0UGF0aClcbiAgICAgICAgaWYgKGNvbXBpbGVyLm91dHB1dFBhdGggPT09ICcvJyAmJiBjb21waWxlci5vcHRpb25zLmRldlNlcnZlcikge1xuICAgICAgICAgIG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIuY29udGVudEJhc2UsIG91dHB1dFBhdGgpXG4gICAgICAgIH1cbiAgICAgICAgbG9ndihvcHRpb25zLCdvdXRwdXRQYXRoOiAnICsgb3V0cHV0UGF0aClcbiAgICAgICAgbG9ndihvcHRpb25zLCdmcmFtZXdvcms6ICcgKyBmcmFtZXdvcmspXG4gICAgICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgICAgIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInICYmIG9wdGlvbnMudHJlZXNoYWtlID09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0UGF0aCwgY29tcGlsYXRpb24pXG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dFBhdGgsIGNvbXBpbGF0aW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgY29tbWFuZCA9ICcnXG4gICAgICAgIGlmIChvcHRpb25zLndhdGNoID09ICd5ZXMnICYmIHZhcnMucHJvZHVjdGlvbiA9PSBmYWxzZSkge1xuICAgICAgICAgIGNvbW1hbmQgPSAnd2F0Y2gnXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgY29tbWFuZCA9ICdidWlsZCdcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFycy5yZWJ1aWxkID09IHRydWUpIHtcbiAgICAgICAgICB2YXIgcGFybXMgPSBbXVxuICAgICAgICAgIGlmIChvcHRpb25zLnByb2ZpbGUgPT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMucHJvZmlsZSA9PSAnJyB8fCBvcHRpb25zLnByb2ZpbGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT0gJ2J1aWxkJykge1xuICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMuZW52aXJvbm1lbnRdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT0gJ2J1aWxkJykge1xuICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgb3B0aW9ucy5wcm9maWxlLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHBhcm1zID0gWydhcHAnLCBjb21tYW5kLCAnLS13ZWItc2VydmVyJywgJ2ZhbHNlJywgb3B0aW9ucy5wcm9maWxlLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodmFycy53YXRjaFN0YXJ0ZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGF3YWl0IF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgb3B0aW9ucylcbiAgICAgICAgICAgIHZhcnMud2F0Y2hTdGFydGVkID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbG9ndihvcHRpb25zLCdOT1QgcnVubmluZyBlbWl0JylcbiAgICAgICAgY2FsbGJhY2soKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxvZ3Yob3B0aW9ucywnZW1pdCBpcyBmYWxzZScpXG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnZW1pdDogJyArIGUpXG4gICAgY2FsbGJhY2soKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXQsIGNvbXBpbGF0aW9uKSB7XG4gIHRyeSB7XG4gICAgbG9ndihvcHRpb25zLCdGVU5DVElPTiBfcHJlcGFyZUZvckJ1aWxkJylcbiAgICBjb25zdCByaW1yYWYgPSByZXF1aXJlKCdyaW1yYWYnKVxuICAgIGNvbnN0IG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpXG4gICAgY29uc3QgZnN4ID0gcmVxdWlyZSgnZnMtZXh0cmEnKVxuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICB2YXIgcGFja2FnZXMgPSBvcHRpb25zLnBhY2thZ2VzXG4gICAgdmFyIHRvb2xraXQgPSBvcHRpb25zLnRvb2xraXRcbiAgICB2YXIgdGhlbWUgPSBvcHRpb25zLnRoZW1lXG4gICAgdGhlbWUgPSB0aGVtZSB8fCAodG9vbGtpdCA9PT0gJ2NsYXNzaWMnID8gJ3RoZW1lLXRyaXRvbicgOiAndGhlbWUtbWF0ZXJpYWwnKVxuICAgIGxvZ3Yob3B0aW9ucywnZmlyc3RUaW1lOiAnICsgdmFycy5maXJzdFRpbWUpXG4gICAgaWYgKHZhcnMuZmlyc3RUaW1lKSB7XG4gICAgICByaW1yYWYuc3luYyhvdXRwdXQpXG4gICAgICBta2RpcnAuc3luYyhvdXRwdXQpXG4gICAgICBjb25zdCBidWlsZFhNTCA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuYnVpbGRYTUxcbiAgICAgIGNvbnN0IGNyZWF0ZUFwcEpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUFwcEpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZVdvcmtzcGFjZUpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZVdvcmtzcGFjZUpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZUpTRE9NRW52aXJvbm1lbnQgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUpTRE9NRW52aXJvbm1lbnRcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2J1aWxkLnhtbCcpLCBidWlsZFhNTCh2YXJzLnByb2R1Y3Rpb24sIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2FwcC5qc29uJyksIGNyZWF0ZUFwcEpzb24odGhlbWUsIHBhY2thZ2VzLCB0b29sa2l0LCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdqc2RvbS1lbnZpcm9ubWVudC5qcycpLCBjcmVhdGVKU0RPTUVudmlyb25tZW50KG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ3dvcmtzcGFjZS5qc29uJyksIGNyZWF0ZVdvcmtzcGFjZUpzb24ob3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgdmFyIGZyYW1ld29yayA9IHZhcnMuZnJhbWV3b3JrO1xuICAgICAgLy9iZWNhdXNlIG9mIGEgcHJvYmxlbSB3aXRoIGNvbG9ycGlja2VyXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3V4L2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAndXgnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCArICdDb3B5aW5nICh1eCkgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vcGFja2FnZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdwYWNrYWdlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwICsgJ0NvcHlpbmcgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L292ZXJyaWRlcy9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L292ZXJyaWRlcy9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ292ZXJyaWRlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwICsgJ0NvcHlpbmcgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCdyZXNvdXJjZXMvJykpKSB7XG4gICAgICAgIHZhciBmcm9tUmVzb3VyY2VzID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdyZXNvdXJjZXMvJylcbiAgICAgICAgdmFyIHRvUmVzb3VyY2VzID0gcGF0aC5qb2luKG91dHB1dCwgJy4uL3Jlc291cmNlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUmVzb3VyY2VzLCB0b1Jlc291cmNlcylcbiAgICAgICAgbG9nKGFwcCArICdDb3B5aW5nICcgKyBmcm9tUmVzb3VyY2VzLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUmVzb3VyY2VzLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgIH1cbiAgICB2YXJzLmZpcnN0VGltZSA9IGZhbHNlXG4gICAgdmFyIGpzID0gJydcbiAgICBpZiAodmFycy5wcm9kdWN0aW9uKSB7XG4gICAgICBqcyA9IHZhcnMuZGVwcy5qb2luKCc7XFxuJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAganMgPSAnRXh0LnJlcXVpcmUoXCJFeHQuKlwiKSdcbiAgICB9XG4gICAgaWYgKHZhcnMubWFuaWZlc3QgPT09IG51bGwgfHwganMgIT09IHZhcnMubWFuaWZlc3QpIHtcbiAgICAgIHZhcnMubWFuaWZlc3QgPSBqc1xuICAgICAgY29uc3QgbWFuaWZlc3QgPSBwYXRoLmpvaW4ob3V0cHV0LCAnbWFuaWZlc3QuanMnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhtYW5pZmVzdCwganMsICd1dGY4JylcbiAgICAgIHZhcnMucmVidWlsZCA9IHRydWVcbiAgICAgIHZhciBidW5kbGVEaXIgPSBvdXRwdXQucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJylcbiAgICAgIGlmIChidW5kbGVEaXIudHJpbSgpID09ICcnKSB7YnVuZGxlRGlyID0gJy4vJ31cbiAgICAgIGxvZyhhcHAgKyAnQnVpbGRpbmcgRXh0IGJ1bmRsZSBhdDogJyArIGJ1bmRsZURpcilcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXJzLnJlYnVpbGQgPSBmYWxzZVxuICAgICAgbG9nKGFwcCArICdFeHQgcmVidWlsZCBOT1QgbmVlZGVkJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfcHJlcGFyZUZvckJ1aWxkOiAnICsgZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICAgIGxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gX2J1aWxkRXh0QnVuZGxlJylcbiAgICBsZXQgc2VuY2hhOyB0cnkgeyBzZW5jaGEgPSByZXF1aXJlKCdAc2VuY2hhL2NtZCcpIH0gY2F0Y2ggKGUpIHsgc2VuY2hhID0gJ3NlbmNoYScgfVxuICAgIGlmIChmcy5leGlzdHNTeW5jKHNlbmNoYSkpIHtcbiAgICAgIGxvZ3Yob3B0aW9ucywnc2VuY2hhIGZvbGRlciBleGlzdHMnKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxvZ3Yob3B0aW9ucywnc2VuY2hhIGZvbGRlciBET0VTIE5PVCBleGlzdCcpXG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBvbkJ1aWxkRG9uZSA9ICgpID0+IHtcbiAgICAgICAgbG9ndihvcHRpb25zLCdvbkJ1aWxkRG9uZScpXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfVxuICAgICAgdmFyIG9wdHMgPSB7IGN3ZDogb3V0cHV0UGF0aCwgc2lsZW50OiB0cnVlLCBzdGRpbzogJ3BpcGUnLCBlbmNvZGluZzogJ3V0Zi04J31cbiAgICAgIGV4ZWN1dGVBc3luYyhhcHAsIHNlbmNoYSwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCBvcHRpb25zKS50aGVuIChcbiAgICAgICAgZnVuY3Rpb24oKSB7IG9uQnVpbGREb25lKCkgfSwgXG4gICAgICAgIGZ1bmN0aW9uKHJlYXNvbikgeyByZWplY3QocmVhc29uKSB9XG4gICAgICApXG4gICAgfSlcbiAgfVxuICBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coJ2UnKVxuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfYnVpbGRFeHRCdW5kbGU6ICcgKyBlKVxuICAgIGNhbGxiYWNrKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZG9uZSh2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9kb25lJylcbiAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gZmFsc2UgJiYgb3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICByZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLl90b0Rldih2YXJzLCBvcHRpb25zKVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgaWYob3B0aW9ucy5icm93c2VyID09IHRydWUgJiYgb3B0aW9ucy53YXRjaCA9PSAneWVzJyAmJiB2YXJzLnByb2R1Y3Rpb24gPT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHZhcnMuYnJvd3NlckNvdW50ID09IDApIHtcbiAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6JyArIG9wdGlvbnMucG9ydFxuICAgICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCArIGBPcGVuaW5nIGJyb3dzZXIgYXQgJHt1cmx9YClcbiAgICAgICAgICB2YXJzLmJyb3dzZXJDb3VudCsrXG4gICAgICAgICAgY29uc3Qgb3BuID0gcmVxdWlyZSgnb3BuJylcbiAgICAgICAgICBvcG4odXJsKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgLy9jb21waWxhdGlvbi5lcnJvcnMucHVzaCgnc2hvdyBicm93c2VyIHdpbmRvdyAtIGV4dC1kb25lOiAnICsgZSlcbiAgICB9XG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09IDApIHtcbiAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCArIGBFbmRpbmcgRGV2ZWxvcG1lbnQgQnVpbGRgKVxuICAgIH1cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gMikge1xuICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwICsgYEVuZGluZyBQcm9kdWN0aW9uIEJ1aWxkYClcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGVBc3luYyAoYXBwLCBjb21tYW5kLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICAvL2NvbnN0IERFRkFVTFRfU1VCU1RSUyA9IFsnW0lORl0gTG9hZGluZycsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFNlcnZlclwiLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgICBjb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbXCJbSU5GXSB4U2VydmVyXCIsICdbSU5GXSBMb2FkaW5nJywgJ1tJTkZdIEFwcGVuZCcsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tJTkZdIFByb2Nlc3NpbmcgQnVpbGQnLCAnW0xPR10gRmFzaGlvbiBidWlsZCBjb21wbGV0ZScsICdbRVJSXScsICdbV1JOXScsIFwiW0lORl0gV3JpdGluZ1wiLCBcIltJTkZdIExvYWRpbmcgQnVpbGRcIiwgXCJbSU5GXSBXYWl0aW5nXCIsIFwiW0xPR10gRmFzaGlvbiB3YWl0aW5nXCJdO1xuICAgIHZhciBzdWJzdHJpbmdzID0gREVGQVVMVF9TVUJTVFJTIFxuICAgIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbiAgICBjb25zdCBjcm9zc1NwYXduID0gcmVxdWlyZSgnY3Jvc3Mtc3Bhd24nKVxuICAgIGNvbnN0IGxvZyA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ1xuICAgIGxvZ3Yob3B0aW9ucywgJ0ZVTkNUSU9OIGV4ZWN1dGVBc3luYycpXG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbG9ndihvcHRpb25zLGBjb21tYW5kIC0gJHtjb21tYW5kfWApXG4gICAgICBsb2d2KG9wdGlvbnMsIGBwYXJtcyAtICR7cGFybXN9YClcbiAgICAgIGxvZ3Yob3B0aW9ucywgYG9wdHMgLSAke0pTT04uc3RyaW5naWZ5KG9wdHMpfWApXG4gICAgICBsZXQgY2hpbGQgPSBjcm9zc1NwYXduKGNvbW1hbmQsIHBhcm1zLCBvcHRzKVxuICAgICAgY2hpbGQub24oJ2Nsb3NlJywgKGNvZGUsIHNpZ25hbCkgPT4ge1xuICAgICAgICBsb2d2KG9wdGlvbnMsIGBvbiBjbG9zZTogYCArIGNvZGUpIFxuICAgICAgICBpZihjb2RlID09PSAwKSB7IHJlc29sdmUoMCkgfVxuICAgICAgICBlbHNlIHsgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goIG5ldyBFcnJvcihjb2RlKSApOyByZXNvbHZlKDApIH1cbiAgICAgIH0pXG4gICAgICBjaGlsZC5vbignZXJyb3InLCAoZXJyb3IpID0+IHsgXG4gICAgICAgIGxvZ3Yob3B0aW9ucywgYG9uIGVycm9yYCkgXG4gICAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGVycm9yKVxuICAgICAgICByZXNvbHZlKDApXG4gICAgICB9KVxuICAgICAgY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXG4gICAgICAgIGxvZ3Yob3B0aW9ucywgYCR7c3RyfWApXG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEudG9TdHJpbmcoKS5tYXRjaCgvRmFzaGlvbiB3YWl0aW5nIGZvciBjaGFuZ2VzXFwuXFwuXFwuLykpIHtcblxuICAgICAgICAgIC8vIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICAgICAgICAvLyB2YXIgZmlsZW5hbWUgPSBwcm9jZXNzLmN3ZCgpKycvc3JjL2luZGV4LmpzJztcbiAgICAgICAgICAvLyB2YXIgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSk7XG4gICAgICAgICAgLy8gZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgZGF0YSArICcgJywgJ3V0ZjgnKVxuICAgICAgICAgIC8vIGxvZ3Yob3B0aW9ucywgYHRvdWNoaW5nICR7ZmlsZW5hbWV9YClcblxuICAgICAgICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICAgICAgICB2YXIgZmlsZW5hbWUgPSBwcm9jZXNzLmN3ZCgpICsgJy9zcmMvaW5kZXguanMnO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSk7XG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVuYW1lLCBkYXRhICsgJyAnLCAndXRmOCcpO1xuICAgICAgICAgICAgbG9nKG9wdGlvbnMsIGB0b3VjaGluZyAke2ZpbGVuYW1lfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgICBsb2cob3B0aW9ucywgYE5PVCB0b3VjaGluZyAke2ZpbGVuYW1lfWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoMClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAoc3Vic3RyaW5ncy5zb21lKGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGRhdGEuaW5kZXhPZih2KSA+PSAwOyB9KSkgeyBcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0lORl1cIiwgXCJcIilcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0xPR11cIiwgXCJcIilcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKS50cmltKClcbiAgICAgICAgICAgIGlmIChzdHIuaW5jbHVkZXMoXCJbRVJSXVwiKSkge1xuICAgICAgICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChhcHAgKyBzdHIucmVwbGFjZSgvXlxcW0VSUlxcXSAvZ2ksICcnKSk7XG4gICAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0VSUl1cIiwgYCR7Y2hhbGsucmVkKFwiW0VSUl1cIil9YClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvZyhgJHthcHB9JHtzdHJ9YCkgXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgbG9ndihvcHRpb25zLCBgZXJyb3Igb24gY2xvc2U6IGAgKyBkYXRhKSBcbiAgICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXG4gICAgICAgIHZhciBzdHJKYXZhT3B0cyA9IFwiUGlja2VkIHVwIF9KQVZBX09QVElPTlNcIjtcbiAgICAgICAgdmFyIGluY2x1ZGVzID0gc3RyLmluY2x1ZGVzKHN0ckphdmFPcHRzKVxuICAgICAgICBpZiAoIWluY2x1ZGVzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7YXBwfSAke2NoYWxrLnJlZChcIltFUlJdXCIpfSAke3N0cn1gKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdleGVjdXRlQXN5bmM6ICcgKyBlKVxuICAgIGNhbGxiYWNrKClcbiAgfSBcbn1cblxuLy8qKioqKioqKioqXG5mdW5jdGlvbiBydW5TY3JpcHQoc2NyaXB0UGF0aCwgY2FsbGJhY2spIHtcbiAgdmFyIGNoaWxkUHJvY2VzcyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcbiAgLy8ga2VlcCB0cmFjayBvZiB3aGV0aGVyIGNhbGxiYWNrIGhhcyBiZWVuIGludm9rZWQgdG8gcHJldmVudCBtdWx0aXBsZSBpbnZvY2F0aW9uc1xuICB2YXIgaW52b2tlZCA9IGZhbHNlO1xuICB2YXIgcHJvY2VzcyA9IGNoaWxkUHJvY2Vzcy5mb3JrKHNjcmlwdFBhdGgpO1xuICAvLyBsaXN0ZW4gZm9yIGVycm9ycyBhcyB0aGV5IG1heSBwcmV2ZW50IHRoZSBleGl0IGV2ZW50IGZyb20gZmlyaW5nXG4gIHByb2Nlc3Mub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfSk7XG4gIC8vIGV4ZWN1dGUgdGhlIGNhbGxiYWNrIG9uY2UgdGhlIHByb2Nlc3MgaGFzIGZpbmlzaGVkIHJ1bm5pbmdcbiAgcHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uIChjb2RlKSB7XG4gICAgaWYgKGludm9rZWQpIHJldHVybjtcbiAgICBpbnZva2VkID0gdHJ1ZTtcbiAgICB2YXIgZXJyID0gY29kZSA9PT0gMCA/IG51bGwgOiBuZXcgRXJyb3IoJ2V4aXQgY29kZSAnICsgY29kZSk7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfSk7XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRBcHAoKSB7XG4gIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbiAgdmFyIHByZWZpeCA9IGBgXG4gIGNvbnN0IHBsYXRmb3JtID0gcmVxdWlyZSgnb3MnKS5wbGF0Zm9ybSgpXG4gIGlmIChwbGF0Zm9ybSA9PSAnZGFyd2luJykgeyBwcmVmaXggPSBg4oS5IO+9omV4dO+9ozpgIH1cbiAgZWxzZSB7IHByZWZpeCA9IGBpIFtleHRdOmAgfVxuICByZXR1cm4gYCR7Y2hhbGsuZ3JlZW4ocHJlZml4KX0gYFxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0VmVyc2lvbnMoYXBwLCBwbHVnaW5OYW1lLCBmcmFtZXdvcmtOYW1lKSB7XG4gIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gIHZhciB2ID0ge31cbiAgdmFyIHBsdWdpblBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEnLCBwbHVnaW5OYW1lKVxuICB2YXIgcGx1Z2luUGtnID0gKGZzLmV4aXN0c1N5bmMocGx1Z2luUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LnBsdWdpblZlcnNpb24gPSBwbHVnaW5Qa2cudmVyc2lvblxuICB2Ll9yZXNvbHZlZCA9IHBsdWdpblBrZy5fcmVzb2x2ZWRcbiAgaWYgKHYuX3Jlc29sdmVkID09IHVuZGVmaW5lZCkge1xuICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICB9XG4gIGVsc2Uge1xuICAgIGlmICgtMSA9PSB2Ll9yZXNvbHZlZC5pbmRleE9mKCdjb21tdW5pdHknKSkge1xuICAgICAgdi5lZGl0aW9uID0gYENvbW1lcmNpYWxgXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdi5lZGl0aW9uID0gYENvbW11bml0eWBcbiAgICB9XG4gIH1cbiAgdmFyIHdlYnBhY2tQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy93ZWJwYWNrJylcbiAgdmFyIHdlYnBhY2tQa2cgPSAoZnMuZXhpc3RzU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHdlYnBhY2tQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi53ZWJwYWNrVmVyc2lvbiA9IHdlYnBhY2tQa2cudmVyc2lvblxuICB2YXIgZXh0UGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQHNlbmNoYS9leHQnKVxuICB2YXIgZXh0UGtnID0gKGZzLmV4aXN0c1N5bmMoZXh0UGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LmV4dFZlcnNpb24gPSBleHRQa2cuc2VuY2hhLnZlcnNpb25cbiAgdmFyIGNtZFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSxgbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5jbWRWZXJzaW9uID0gY21kUGtnLnZlcnNpb25fZnVsbFxuICBpZiAodi5jbWRWZXJzaW9uID09IHVuZGVmaW5lZCkge1xuICAgIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhLyR7cGx1Z2luTmFtZX0vbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgICB2YXIgY21kUGtnID0gKGZzLmV4aXN0c1N5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICAgIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgfVxuICB2YXIgZnJhbWV3b3JrSW5mbyA9ICcnXG4gICBpZiAoZnJhbWV3b3JrTmFtZSAhPSB1bmRlZmluZWQgJiYgZnJhbWV3b3JrTmFtZSAhPSAnZXh0anMnKSB7XG4gICAgdmFyIGZyYW1ld29ya1BhdGggPSAnJ1xuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdyZWFjdCcpIHtcbiAgICAgIGZyYW1ld29ya1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL3JlYWN0JylcbiAgICB9XG4gICAgaWYgKGZyYW1ld29ya05hbWUgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9AYW5ndWxhci9jb3JlJylcbiAgICB9XG4gICAgdmFyIGZyYW1ld29ya1BrZyA9IChmcy5leGlzdHNTeW5jKGZyYW1ld29ya1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmZyYW1ld29ya1ZlcnNpb24gPSBmcmFtZXdvcmtQa2cudmVyc2lvblxuICAgIGZyYW1ld29ya0luZm8gPSAnLCAnICsgZnJhbWV3b3JrTmFtZSArICcgdicgKyB2LmZyYW1ld29ya1ZlcnNpb25cbiAgfVxuICByZXR1cm4gYXBwICsgJ2V4dC13ZWJwYWNrLXBsdWdpbiB2JyArIHYucGx1Z2luVmVyc2lvbiArICcsIEV4dCBKUyB2JyArIHYuZXh0VmVyc2lvbiArICcgJyArIHYuZWRpdGlvbiArICcgRWRpdGlvbiwgU2VuY2hhIENtZCB2JyArIHYuY21kVmVyc2lvbiArICcsIHdlYnBhY2sgdicgKyB2LndlYnBhY2tWZXJzaW9uICsgZnJhbWV3b3JrSW5mb1xuIH1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9nKHMpIHtcbiAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgdHJ5IHtwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKX1jYXRjaChlKSB7fVxuICBwcm9jZXNzLnN0ZG91dC53cml0ZShzKTtwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9naChzKSB7XG4gIHZhciBoID0gZmFsc2VcbiAgaWYgKGggPT0gdHJ1ZSkge1xuICAgIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgfVxuICAgIGNhdGNoKGUpIHt9XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocylcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBsb2d2KG9wdGlvbnMsIHMpIHtcbiAgaWYgKG9wdGlvbnMudmVyYm9zZSA9PSAneWVzJykge1xuICAgIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgfVxuICAgIGNhdGNoKGUpIHt9XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoYC12ZXJib3NlOiAke3N9YClcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbiAgfVxufVxuIl19