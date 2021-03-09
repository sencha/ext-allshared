"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._constructor = _constructor;
exports._thisCompilation = _thisCompilation;
exports._compilation = _compilation;
exports._afterCompile = _afterCompile;
exports._emit = _emit;
exports._done = _done;
exports._prepareForBuild = _prepareForBuild;
exports._buildExtBundle = _buildExtBundle;
exports._executeAsync = _executeAsync;
exports._toXtype = _toXtype;
exports._getApp = _getApp;
exports._getVersions = _getVersions;
exports.log = log;
exports.logh = logh;
exports.logv = logv;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//**********
function _constructor(initialOptions) {
  const fs = require('fs');

  var vars = {};
  var options = {};

  try {
    if (initialOptions.framework == undefined) {
      vars.pluginErrors = [];
      vars.pluginErrors.push('webpack config: framework parameter on ext-webpack-plugin is not defined - values: react, angular, extjs, web-components');
      var result = {
        vars: vars
      };
      return result;
    }

    var framework = initialOptions.framework;
    var treeshake = initialOptions.treeshake;
    var verbose = initialOptions.verbose;

    const validateOptions = require('schema-utils');

    validateOptions(_getValidateOptions(), initialOptions, '');
    const rc = fs.existsSync(`.ext-${framework}rc`) && JSON.parse(fs.readFileSync(`.ext-${framework}rc`, 'utf-8')) || {};
    options = _objectSpread({}, _getDefaultOptions(), {}, initialOptions, {}, rc);
    vars = require(`./${framework}Util`)._getDefaultVars();
    vars.pluginName = 'ext-webpack-plugin';
    vars.app = _getApp();
    var pluginName = vars.pluginName;
    var app = vars.app;
    vars.testing = false;
    logv(verbose, 'FUNCTION _constructor');
    logv(verbose, `pluginName - ${pluginName}`);
    logv(verbose, `app - ${app}`);

    if (options.environment == 'production' || options.cmdopts.includes('--production') || options.cmdopts.includes('-pr') || options.cmdopts.includes('--environment=production')) {
      vars.production = true;
      options.browser = 'no';
      options.watch = 'no';
      options.buildEnvironment = 'production';
    } else if (options.cmdopts && (options.cmdopts.includes('--testing') || options.cmdopts.includes('-te') || options.cmdopts.includes('--environment=testing'))) {
      vars.production = false;
      vars.testing = true;
      options.browser = 'no';
      options.watch = 'no';
      options.buildEnvironment = 'testing';
    } else {
      options.buildEnvironment = 'development';
      vars.production = false;
    }

    log(app, _getVersions(pluginName, framework)); //mjg added for angular cli build

    if (framework == 'angular' && options.intellishake == 'no' && vars.production == true && treeshake == 'yes') {
      vars.buildstep = '1 of 1';
      log(app, 'Starting production build for ' + framework);
    } else if (framework == 'react' || framework == 'extjs' || framework == 'web-components') {
      if (vars.production == true) {
        vars.buildstep = '1 of 1';
        log(app, 'Starting production build for ' + framework);
      } else if (vars.testing == true) {
        vars.buildstep = '1 of 1';
        log(app, 'Starting testing build for ' + framework);
      } else {
        vars.buildstep = '1 of 1';
        log(app, 'Starting development build for ' + framework);
      }
    } else if (vars.production == true) {
      if (treeshake == 'yes') {
        vars.buildstep = '1 of 2';
        log(app, 'Starting production build for ' + framework + ' - ' + vars.buildstep);

        require(`./${framework}Util`)._toProd(vars, options);
      } else {
        vars.buildstep = '2 of 2';
        log(app, 'Continuing production build for ' + framework + ' - ' + vars.buildstep);
      }
    } else {
      vars.buildstep = '1 of 1';
      log(app, 'Starting development build for ' + framework);
    }

    logv(verbose, 'Building for ' + options.buildEnvironment + ', ' + 'treeshake is ' + options.treeshake + ', ' + 'intellishake is ' + options.intellishake);
    var configObj = {
      vars: vars,
      options: options
    };
    return configObj;
  } catch (e) {
    throw '_constructor: ' + e.toString();
  }
} //**********


function _thisCompilation(compiler, compilation, vars, options) {
  try {
    var app = vars.app;
    var verbose = options.verbose;
    logv(verbose, 'FUNCTION _thisCompilation');
    logv(verbose, `options.script: ${options.script}`);
    logv(verbose, `buildstep: ${vars.buildstep}`);

    if (vars.buildstep === '1 of 1' || vars.buildstep === '1 of 2') {
      if (options.script != undefined && options.script != null && options.script != '') {
        log(app, `Started running ${options.script}`);
        runScript(options.script, function (err) {
          if (err) {
            throw err;
          }

          log(app, `Finished running ${options.script}`);
        });
      }
    }
  } catch (e) {
    throw '_thisCompilation: ' + e.toString();
  }
} //**********


function _compilation(compiler, compilation, vars, options) {
  try {
    var app = vars.app;
    var verbose = options.verbose;
    var framework = options.framework;
    logv(verbose, 'FUNCTION _compilation');

    if (framework != 'extjs') {
      if (options.treeshake === 'yes' && options.buildEnvironment === 'production') {
        var extComponents = []; //mjg for 1 step build

        if (vars.buildstep == '1 of 1' && framework === 'angular' && options.intellishake == 'no') {
          extComponents = require(`./${framework}Util`)._getAllComponents(vars, options);
        }

        if (vars.buildstep == '1 of 2' || vars.buildstep == '1 of 1' && framework === 'web-components') {
          extComponents = require(`./${framework}Util`)._getAllComponents(vars, options);
        }

        compilation.hooks.succeedModule.tap(`ext-succeed-module`, module => {
          if (module.resource && !module.resource.match(/node_modules/)) {
            try {
              if (module.resource.match(/\.html$/) != null && module._source._value.toLowerCase().includes('doctype html') == false) {
                vars.deps = [...(vars.deps || []), ...require(`./${framework}Util`)._extractFromSource(module, options, compilation, extComponents)];
              } else {
                vars.deps = [...(vars.deps || []), ...require(`./${framework}Util`)._extractFromSource(module, options, compilation, extComponents)];
              }
            } catch (e) {
              console.log(e);
            }
          }
        });
      }

      if (vars.buildstep == '1 of 2') {
        compilation.hooks.finishModules.tap(`ext-finish-modules`, modules => {
          require(`./${framework}Util`)._writeFilesToProdFolder(vars, options);
        });
      }

      if (vars.buildstep == '1 of 1' || vars.buildstep == '2 of 2') {
        if (options.inject === 'yes') {
          if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration != undefined) {
            compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tap(`ext-html-generation`, data => {
              const path = require('path');

              var jsPath = path.join(vars.extPath, 'ext.js');
              var cssPath = path.join(vars.extPath, 'ext.css'); //var jsPath = vars.extPath + '/' +  'ext.js';
              //var cssPath = vars.extPath + '/' + 'ext.css';

              data.assets.js.unshift(jsPath);
              data.assets.css.unshift(cssPath);
              log(app, `Adding ${jsPath} and ${cssPath} to index.html`);
            });
          }
        }
      }
    }
  } catch (e) {
    throw '_compilation: ' + e.toString(); //    logv(options.verbose,e)
    //    compilation.errors.push('_compilation: ' + e)
  }
} //**********


function _afterCompile(compiler, compilation, vars, options) {
  try {
    var app = vars.app;
    var verbose = options.verbose;
    var framework = options.framework;
    logv(verbose, 'FUNCTION _afterCompile');

    if (framework == 'extjs') {
      require(`./extjsUtil`)._afterCompile(compilation, vars, options);
    } else {
      logv(verbose, 'FUNCTION _afterCompile not run');
    }
  } catch (e) {
    throw '_afterCompile: ' + e.toString();
  }
} //**********


function _emit(_x, _x2, _x3, _x4, _x5) {
  return _emit2.apply(this, arguments);
} //**********


function _emit2() {
  _emit2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(compiler, compilation, vars, options, callback) {
    var path, app, verbose, emit, framework, outputPath, command, parms;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          path = require('path');
          app = vars.app;
          verbose = options.verbose;
          emit = options.emit;
          framework = options.framework;
          vars.callback = callback;
          logv(verbose, 'FUNCTION _emit');

          if (!(emit == 'yes')) {
            _context.next = 38;
            break;
          }

          if (!(vars.buildstep == '1 of 1' || vars.buildstep == '1 of 2')) {
            _context.next = 34;
            break;
          }

          outputPath = path.join(compiler.outputPath, vars.extPath);

          if (compiler.outputPath === '/' && compiler.options.devServer) {
            outputPath = path.join(compiler.options.devServer.contentBase, outputPath);
          }

          logv(verbose, 'outputPath: ' + outputPath);
          logv(verbose, 'framework: ' + framework);

          if (framework != 'extjs') {
            _prepareForBuild(app, vars, options, outputPath, compilation);
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

          if (!Array.isArray(options.cmdopts)) {
            options.cmdopts = options.cmdopts.split(' ');
          }

          if (options.profile == undefined || options.profile == '' || options.profile == null) {
            if (command == 'build') {
              parms = ['app', command, options.buildEnvironment];
            } else {
              parms = ['app', command, '--web-server', 'false', options.buildEnvironment];
            }
          } else {
            if (command == 'build') {
              parms = ['app', command, options.profile, options.buildEnvironment];
            } else {
              parms = ['app', command, '--web-server', 'false', options.profile, options.buildEnvironment];
            }
          }

          options.cmdopts.forEach(function (element) {
            parms.splice(parms.indexOf(command) + 1, 0, element);
          }); // if (vars.watchStarted == false) {
          //   await _buildExtBundle(app, compilation, outputPath, parms, vars, options)
          //   vars.watchStarted = true
          // }

          if (!(vars.watchStarted == false)) {
            _context.next = 28;
            break;
          }

          _context.next = 25;
          return _buildExtBundle(app, compilation, outputPath, parms, vars, options);

        case 25:
          if (command == 'watch') {
            vars.watchStarted = true;
          } else {
            vars.callback();
          }

          _context.next = 29;
          break;

        case 28:
          vars.callback();

        case 29:
          _context.next = 32;
          break;

        case 31:
          vars.callback();

        case 32:
          _context.next = 36;
          break;

        case 34:
          logv(verbose, 'NOT running emit');
          vars.callback();

        case 36:
          _context.next = 40;
          break;

        case 38:
          logv(verbose, 'emit is no');
          vars.callback();

        case 40:
          _context.next = 46;
          break;

        case 42:
          _context.prev = 42;
          _context.t0 = _context["catch"](0);
          vars.callback();
          throw '_emit: ' + _context.t0.toString();

        case 46:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 42]]);
  }));
  return _emit2.apply(this, arguments);
}

function _done(stats, vars, options) {
  try {
    var verbose = options.verbose;
    var framework = options.framework;
    logv(verbose, 'FUNCTION _done');

    if (stats.compilation.errors && stats.compilation.errors.length) // && process.argv.indexOf('--watch') == -1)
      {
        var chalk = require('chalk');

        console.log(chalk.red('******************************************'));
        console.log(stats.compilation.errors[0]);
        console.log(chalk.red('******************************************')); //process.exit(0);
      } //mjg refactor


    if (vars.production == true && options.treeshake == 'no' && framework == 'angular') {
      require(`./${options.framework}Util`)._toDev(vars, options);
    }

    try {
      if (options.browser == 'yes' && options.watch == 'yes' && vars.production == false) {
        if (vars.browserCount == 0) {
          var url = 'http://localhost:' + options.port;

          require('./pluginUtil').log(vars.app, `Opening browser at ${url}`);

          vars.browserCount++;

          const opn = require('opn');

          opn(url);
        }
      }
    } catch (e) {
      console.log(e);
    }

    if (vars.buildstep == '1 of 1') {
      if (vars.production == true) {
        require('./pluginUtil').log(vars.app, `Ending production build for ${framework}`);
      } else if (vars.testing == true) {
        require('./pluginUtil').log(vars.app, `Ending testing build for ${framework}`);
      } else {
        require('./pluginUtil').log(vars.app, `Ending development build for ${framework}`);
      }
    }

    if (vars.buildstep == '2 of 2') {
      if (vars.testing == true) {
        require('./pluginUtil').log(vars.app, `Ending testing build for ${framework}`);
      }

      require('./pluginUtil').log(vars.app, `Ending production build for ${framework}`);
    }
  } catch (e) {
    //    require('./pluginUtil').logv(options.verbose,e)
    throw '_done: ' + e.toString();
  }
} //**********


function _prepareForBuild(app, vars, options, output, compilation) {
  try {
    var verbose = options.verbose;
    var packages = options.packages;
    var toolkit = options.toolkit;
    var theme = options.theme;
    logv(verbose, 'FUNCTION _prepareForBuild');

    const rimraf = require('rimraf');

    const mkdirp = require('mkdirp');

    const fsx = require('fs-extra');

    const fs = require('fs');

    const path = require('path');

    theme = theme || (toolkit === 'classic' ? 'theme-triton' : 'theme-material');
    logv(verbose, 'firstTime: ' + vars.firstTime);

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
        log(app, 'Copying (ux) ' + fromPath.replace(process.cwd(), '') + ' to: ' + toPath.replace(process.cwd(), ''));
      }

      if (fs.existsSync(path.join(process.cwd(), `ext-${framework}/packages/`))) {
        var fromPath = path.join(process.cwd(), `ext-${framework}/packages/`);
        var toPath = path.join(output, 'packages');
        fsx.copySync(fromPath, toPath);
        log(app, 'Copying ' + fromPath.replace(process.cwd(), '') + ' to: ' + toPath.replace(process.cwd(), ''));
      }

      if (fs.existsSync(path.join(process.cwd(), `ext-${framework}/overrides/`))) {
        var fromPath = path.join(process.cwd(), `ext-${framework}/overrides/`);
        var toPath = path.join(output, 'overrides');
        fsx.copySync(fromPath, toPath);
        log(app, 'Copying ' + fromPath.replace(process.cwd(), '') + ' to: ' + toPath.replace(process.cwd(), ''));
      }

      if (fs.existsSync(path.join(process.cwd(), 'resources/'))) {
        var fromResources = path.join(process.cwd(), 'resources/');
        var toResources = path.join(output, '../resources');
        fsx.copySync(fromResources, toResources);
        log(app, 'Copying ' + fromResources.replace(process.cwd(), '') + ' to: ' + toResources.replace(process.cwd(), ''));
      }
    }

    vars.firstTime = false;
    var js = '';

    if (vars.production) {
      vars.deps = vars.deps.filter(function (value, index) {
        return vars.deps.indexOf(value) == index;
      });
      js = vars.deps.join(';\n');
    } else {
      js = `Ext.require(["Ext.*","Ext.data.TreeStore"])`;
    }

    js = `Ext.require(["Ext.*","Ext.data.TreeStore"])`; //for now

    if (vars.manifest === null || js !== vars.manifest) {
      vars.manifest = js + ';\nExt.require(["Ext.layout.*"]);\n';
      const manifest = path.join(output, 'manifest.js');
      fs.writeFileSync(manifest, vars.manifest, 'utf8');
      vars.rebuild = true;
      var bundleDir = output.replace(process.cwd(), '');

      if (bundleDir.trim() == '') {
        bundleDir = './';
      }

      log(app, 'Building Ext bundle at: ' + bundleDir);
    } else {
      vars.rebuild = false;
      log(app, 'Ext rebuild NOT needed');
    }
  } catch (e) {
    require('./pluginUtil').logv(options.verbose, e);

    compilation.errors.push('_prepareForBuild: ' + e);
  }
} //**********


function _buildExtBundle(app, compilation, outputPath, parms, vars, options) {
  var verbose = options.verbose;

  const fs = require('fs');

  logv(verbose, 'FUNCTION _buildExtBundle');
  let sencha;

  try {
    sencha = require('@sencha/cmd');
  } catch (e) {
    sencha = 'sencha';
  }

  if (fs.existsSync(sencha)) {
    logv(verbose, 'sencha folder exists');
  } else {
    logv(verbose, 'sencha folder DOES NOT exist');
  }

  return new Promise((resolve, reject) => {
    const onBuildDone = () => {
      logv(verbose, 'onBuildDone');
      resolve();
    };

    var opts = {
      cwd: outputPath,
      silent: true,
      stdio: 'pipe',
      encoding: 'utf-8'
    };

    _executeAsync(app, sencha, parms, opts, compilation, vars, options).then(function () {
      onBuildDone();
    }, function (reason) {
      reject(reason);
    });
  });
} //**********


function _executeAsync(_x6, _x7, _x8, _x9, _x10, _x11, _x12) {
  return _executeAsync2.apply(this, arguments);
} //**********


function _executeAsync2() {
  _executeAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(app, command, parms, opts, compilation, vars, options) {
    var verbose, framework, DEFAULT_SUBSTRS, substrings, chalk, crossSpawn;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          verbose = options.verbose;
          framework = options.framework; //const DEFAULT_SUBSTRS = ['[INF] Loading', '[INF] Processing', '[LOG] Fashion build complete', '[ERR]', '[WRN]', "[INF] Server", "[INF] Writing", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"];

          DEFAULT_SUBSTRS = ["[INF] xServer", '[INF] Loading', '[INF] Append', '[INF] Processing', '[INF] Processing Build', '[LOG] Fashion build complete', '[ERR]', '[WRN]', "[INF] Writing", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"];
          substrings = DEFAULT_SUBSTRS;
          chalk = require('chalk');
          crossSpawn = require('cross-spawn-with-kill');
          logv(verbose, 'FUNCTION _executeAsync');
          _context2.next = 9;
          return new Promise((resolve, reject) => {
            logv(verbose, `command - ${command}`);
            logv(verbose, `parms - ${parms}`);
            logv(verbose, `opts - ${JSON.stringify(opts)}`);
            vars.child = crossSpawn(command, parms, opts);
            vars.child.on('close', (code, signal) => {
              logv(verbose, `on close: ` + code);

              if (code === 0) {
                resolve(0);
              } else {
                compilation.errors.push(new Error(code));
                resolve(0);
              }
            });
            vars.child.on('error', error => {
              logv(verbose, `on error`);
              compilation.errors.push(error);
              resolve(0);
            });
            vars.child.stdout.on('data', data => {
              var str = data.toString().replace(/\r?\n|\r/g, " ").trim();
              logv(verbose, `${str}`); //if (data && data.toString().match(/Fashion waiting for changes\.\.\./)) {

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
                str = str.replace("[INF]", "");
                str = str.replace("[LOG]", "");
                str = str.replace(process.cwd(), '').trim();

                if (str.includes("[ERR]")) {
                  compilation.errors.push(app + str.replace(/^\[ERR\] /gi, ''));
                  str = str.replace("[ERR]", `${chalk.red("[ERR]")}`);
                }

                log(app, str);
                vars.callback();
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

                  log(app, str);
                }
              }
            });
            vars.child.stderr.on('data', data => {
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
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _executeAsync2.apply(this, arguments);
}

function runScript(scriptPath, callback) {
  var childProcess = require('child_process'); // keep track of whether callback has been invoked to prevent multiple invocations


  var invoked = false;
  var process = childProcess.fork(scriptPath, [], {
    execArgv: ['--inspect=0']
  }); // listen for errors as they may prevent the exit event from firing

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


function _toXtype(str) {
  return str.toLowerCase().replace(/_/g, '-');
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


function _getVersions(pluginName, frameworkName) {
  try {
    const path = require('path');

    const fs = require('fs');

    var v = {};
    var frameworkInfo = 'n/a';
    v.pluginVersion = 'n/a';
    v.extVersion = 'n/a';
    v.edition = 'n/a';
    v.cmdVersion = 'n/a';
    v.webpackVersion = 'n/a';
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

      if (v.frameworkVersion == undefined) {
        frameworkInfo = ', ' + frameworkName;
      } else {
        frameworkInfo = ', ' + frameworkName + ' v' + v.frameworkVersion;
      }
    }

    return 'ext-webpack-plugin v' + v.pluginVersion + ', Ext JS v' + v.extVersion + ' ' + v.edition + ' Edition, Sencha Cmd v' + v.cmdVersion + ', webpack v' + v.webpackVersion + frameworkInfo;
  } catch (e) {
    return 'ext-webpack-plugin v' + v.pluginVersion + ', Ext JS v' + v.extVersion + ' ' + v.edition + ' Edition, Sencha Cmd v' + v.cmdVersion + ', webpack v' + v.webpackVersion + frameworkInfo;
  }
} //**********


function log(app, message) {
  var s = app + message;

  require('readline').cursorTo(process.stdout, 0);

  try {
    process.stdout.clearLine();
  } catch (e) {}

  process.stdout.write(s);
  process.stdout.write('\n');
} //**********


function logh(app, message) {
  var h = false;
  var s = app + message;

  if (h == true) {
    require('readline').cursorTo(process.stdout, 0);

    try {
      process.stdout.clearLine();
    } catch (e) {}

    process.stdout.write(s);
    process.stdout.write('\n');
  }
} //**********


function logv(verbose, s) {
  if (verbose == 'yes') {
    require('readline').cursorTo(process.stdout, 0);

    try {
      process.stdout.clearLine();
    } catch (e) {}

    process.stdout.write(`-verbose: ${s}`);
    process.stdout.write('\n');
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
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsImluaXRpYWxPcHRpb25zIiwiZnMiLCJyZXF1aXJlIiwidmFycyIsIm9wdGlvbnMiLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwicmVzdWx0IiwidHJlZXNoYWtlIiwidmVyYm9zZSIsInZhbGlkYXRlT3B0aW9ucyIsIl9nZXRWYWxpZGF0ZU9wdGlvbnMiLCJyYyIsImV4aXN0c1N5bmMiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJfZ2V0RGVmYXVsdE9wdGlvbnMiLCJfZ2V0RGVmYXVsdFZhcnMiLCJwbHVnaW5OYW1lIiwiYXBwIiwiX2dldEFwcCIsInRlc3RpbmciLCJsb2d2IiwiZW52aXJvbm1lbnQiLCJjbWRvcHRzIiwiaW5jbHVkZXMiLCJwcm9kdWN0aW9uIiwiYnJvd3NlciIsIndhdGNoIiwiYnVpbGRFbnZpcm9ubWVudCIsImxvZyIsIl9nZXRWZXJzaW9ucyIsImludGVsbGlzaGFrZSIsImJ1aWxkc3RlcCIsIl90b1Byb2QiLCJjb25maWdPYmoiLCJlIiwidG9TdHJpbmciLCJfdGhpc0NvbXBpbGF0aW9uIiwiY29tcGlsZXIiLCJjb21waWxhdGlvbiIsInNjcmlwdCIsInJ1blNjcmlwdCIsImVyciIsIl9jb21waWxhdGlvbiIsImV4dENvbXBvbmVudHMiLCJfZ2V0QWxsQ29tcG9uZW50cyIsImhvb2tzIiwic3VjY2VlZE1vZHVsZSIsInRhcCIsIm1vZHVsZSIsInJlc291cmNlIiwibWF0Y2giLCJfc291cmNlIiwiX3ZhbHVlIiwidG9Mb3dlckNhc2UiLCJkZXBzIiwiX2V4dHJhY3RGcm9tU291cmNlIiwiY29uc29sZSIsImZpbmlzaE1vZHVsZXMiLCJtb2R1bGVzIiwiX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIiLCJpbmplY3QiLCJodG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uIiwiZGF0YSIsInBhdGgiLCJqc1BhdGgiLCJqb2luIiwiZXh0UGF0aCIsImNzc1BhdGgiLCJhc3NldHMiLCJqcyIsInVuc2hpZnQiLCJjc3MiLCJfYWZ0ZXJDb21waWxlIiwiX2VtaXQiLCJjYWxsYmFjayIsImVtaXQiLCJvdXRwdXRQYXRoIiwiZGV2U2VydmVyIiwiY29udGVudEJhc2UiLCJfcHJlcGFyZUZvckJ1aWxkIiwiY29tbWFuZCIsInJlYnVpbGQiLCJwYXJtcyIsIkFycmF5IiwiaXNBcnJheSIsInNwbGl0IiwicHJvZmlsZSIsImZvckVhY2giLCJlbGVtZW50Iiwic3BsaWNlIiwiaW5kZXhPZiIsIndhdGNoU3RhcnRlZCIsIl9idWlsZEV4dEJ1bmRsZSIsIl9kb25lIiwic3RhdHMiLCJlcnJvcnMiLCJsZW5ndGgiLCJjaGFsayIsInJlZCIsIl90b0RldiIsImJyb3dzZXJDb3VudCIsInVybCIsInBvcnQiLCJvcG4iLCJvdXRwdXQiLCJwYWNrYWdlcyIsInRvb2xraXQiLCJ0aGVtZSIsInJpbXJhZiIsIm1rZGlycCIsImZzeCIsImZpcnN0VGltZSIsInN5bmMiLCJidWlsZFhNTCIsImNyZWF0ZUFwcEpzb24iLCJjcmVhdGVXb3Jrc3BhY2VKc29uIiwiY3JlYXRlSlNET01FbnZpcm9ubWVudCIsIndyaXRlRmlsZVN5bmMiLCJwcm9jZXNzIiwiY3dkIiwiZnJvbVBhdGgiLCJ0b1BhdGgiLCJjb3B5U3luYyIsInJlcGxhY2UiLCJmcm9tUmVzb3VyY2VzIiwidG9SZXNvdXJjZXMiLCJmaWx0ZXIiLCJ2YWx1ZSIsImluZGV4IiwibWFuaWZlc3QiLCJidW5kbGVEaXIiLCJ0cmltIiwic2VuY2hhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbkJ1aWxkRG9uZSIsIm9wdHMiLCJzaWxlbnQiLCJzdGRpbyIsImVuY29kaW5nIiwiX2V4ZWN1dGVBc3luYyIsInRoZW4iLCJyZWFzb24iLCJERUZBVUxUX1NVQlNUUlMiLCJzdWJzdHJpbmdzIiwiY3Jvc3NTcGF3biIsInN0cmluZ2lmeSIsImNoaWxkIiwib24iLCJjb2RlIiwic2lnbmFsIiwiRXJyb3IiLCJlcnJvciIsInN0ZG91dCIsInN0ciIsInNvbWUiLCJ2Iiwic3RkZXJyIiwic3RySmF2YU9wdHMiLCJzY3JpcHRQYXRoIiwiY2hpbGRQcm9jZXNzIiwiaW52b2tlZCIsImZvcmsiLCJleGVjQXJndiIsIl90b1h0eXBlIiwicHJlZml4IiwicGxhdGZvcm0iLCJncmVlbiIsImZyYW1ld29ya05hbWUiLCJmcmFtZXdvcmtJbmZvIiwicGx1Z2luVmVyc2lvbiIsImV4dFZlcnNpb24iLCJlZGl0aW9uIiwiY21kVmVyc2lvbiIsIndlYnBhY2tWZXJzaW9uIiwicGx1Z2luUGF0aCIsInBsdWdpblBrZyIsInZlcnNpb24iLCJfcmVzb2x2ZWQiLCJ3ZWJwYWNrUGF0aCIsIndlYnBhY2tQa2ciLCJleHRQa2ciLCJjbWRQYXRoIiwiY21kUGtnIiwidmVyc2lvbl9mdWxsIiwiZnJhbWV3b3JrUGF0aCIsImZyYW1ld29ya1BrZyIsImZyYW1ld29ya1ZlcnNpb24iLCJtZXNzYWdlIiwicyIsImN1cnNvclRvIiwiY2xlYXJMaW5lIiwid3JpdGUiLCJsb2doIiwiaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ08sU0FBU0EsWUFBVCxDQUFzQkMsY0FBdEIsRUFBc0M7QUFDM0MsUUFBTUMsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxNQUFJQyxJQUFJLEdBQUcsRUFBWDtBQUNBLE1BQUlDLE9BQU8sR0FBRyxFQUFkOztBQUNBLE1BQUk7QUFDRixRQUFJSixjQUFjLENBQUNLLFNBQWYsSUFBNEJDLFNBQWhDLEVBQTJDO0FBQ3pDSCxNQUFBQSxJQUFJLENBQUNJLFlBQUwsR0FBb0IsRUFBcEI7QUFDQUosTUFBQUEsSUFBSSxDQUFDSSxZQUFMLENBQWtCQyxJQUFsQixDQUF1QiwwSEFBdkI7QUFDQSxVQUFJQyxNQUFNLEdBQUc7QUFBRU4sUUFBQUEsSUFBSSxFQUFFQTtBQUFSLE9BQWI7QUFDQSxhQUFPTSxN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QlQ7QUFpQkxSLElBQUFBLE9BQU8sRUFBRTtBQWpCSixHQUFQO0FBbUJEIiwic291cmNlc0NvbnRlbnQiOlsiXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfY29uc3RydWN0b3IoaW5pdGlhbE9wdGlvbnMpIHtcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gIHZhciB2YXJzID0ge31cbiAgdmFyIG9wdGlvbnMgPSB7fVxuICB0cnkge1xuICAgIGlmIChpbml0aWFsT3B0aW9ucy5mcmFtZXdvcmsgPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXJzLnBsdWdpbkVycm9ycyA9IFtdXG4gICAgICB2YXJzLnBsdWdpbkVycm9ycy5wdXNoKCd3ZWJwYWNrIGNvbmZpZzogZnJhbWV3b3JrIHBhcmFtZXRlciBvbiBleHQtd2VicGFjay1wbHVnaW4gaXMgbm90IGRlZmluZWQgLSB2YWx1ZXM6IHJlYWN0LCBhbmd1bGFyLCBleHRqcywgd2ViLWNvbXBvbmVudHMnKVxuICAgICAgdmFyIHJlc3VsdCA9IHsgdmFyczogdmFycyB9O1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgdmFyIGZyYW1ld29yayA9IGluaXRpYWxPcHRpb25zLmZyYW1ld29ya1xuICAgIHZhciB0cmVlc2hha2UgPSBpbml0aWFsT3B0aW9ucy50cmVlc2hha2VcbiAgICB2YXIgdmVyYm9zZSA9IGluaXRpYWxPcHRpb25zLnZlcmJvc2VcblxuICAgIGNvbnN0IHZhbGlkYXRlT3B0aW9ucyA9IHJlcXVpcmUoJ3NjaGVtYS11dGlscycpXG4gICAgdmFsaWRhdGVPcHRpb25zKF9nZXRWYWxpZGF0ZU9wdGlvbnMoKSwgaW5pdGlhbE9wdGlvbnMsICcnKVxuXG4gICAgY29uc3QgcmMgPSAoZnMuZXhpc3RzU3luYyhgLmV4dC0ke2ZyYW1ld29ya31yY2ApICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGAuZXh0LSR7ZnJhbWV3b3JrfXJjYCwgJ3V0Zi04JykpIHx8IHt9KVxuICAgIG9wdGlvbnMgPSB7IC4uLl9nZXREZWZhdWx0T3B0aW9ucygpLCAuLi5pbml0aWFsT3B0aW9ucywgLi4ucmMgfVxuXG4gICAgdmFycyA9IHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9nZXREZWZhdWx0VmFycygpXG4gICAgdmFycy5wbHVnaW5OYW1lID0gJ2V4dC13ZWJwYWNrLXBsdWdpbidcbiAgICB2YXJzLmFwcCA9IF9nZXRBcHAoKVxuICAgIHZhciBwbHVnaW5OYW1lID0gdmFycy5wbHVnaW5OYW1lXG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgdmFycy50ZXN0aW5nID0gZmFsc2VcblxuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9jb25zdHJ1Y3RvcicpXG4gICAgbG9ndih2ZXJib3NlLCBgcGx1Z2luTmFtZSAtICR7cGx1Z2luTmFtZX1gKVxuICAgIGxvZ3YodmVyYm9zZSwgYGFwcCAtICR7YXBwfWApXG5cbiAgICBpZiAob3B0aW9ucy5lbnZpcm9ubWVudCA9PSAncHJvZHVjdGlvbicgfHxcbiAgICAgICAgb3B0aW9ucy5jbWRvcHRzLmluY2x1ZGVzKCctLXByb2R1Y3Rpb24nKSB8fFxuICAgICAgICBvcHRpb25zLmNtZG9wdHMuaW5jbHVkZXMoJy1wcicpIHx8XG4gICAgICAgIG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLS1lbnZpcm9ubWVudD1wcm9kdWN0aW9uJylcbiAgICAgICkge1xuICAgICAgdmFycy5wcm9kdWN0aW9uID0gdHJ1ZTtcbiAgICAgIG9wdGlvbnMuYnJvd3NlciA9ICdubyc7XG4gICAgICBvcHRpb25zLndhdGNoID0gJ25vJztcbiAgICAgIG9wdGlvbnMuYnVpbGRFbnZpcm9ubWVudCA9ICdwcm9kdWN0aW9uJztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuY21kb3B0cyAmJiAob3B0aW9ucy5jbWRvcHRzLmluY2x1ZGVzKCctLXRlc3RpbmcnKSB8fFxuICAgICAgICAgICAgICAgb3B0aW9ucy5jbWRvcHRzLmluY2x1ZGVzKCctdGUnKSB8fFxuICAgICAgICAgICAgICAgb3B0aW9ucy5jbWRvcHRzLmluY2x1ZGVzKCctLWVudmlyb25tZW50PXRlc3RpbmcnKSkpIHtcbiAgICAgIHZhcnMucHJvZHVjdGlvbiA9IGZhbHNlO1xuICAgICAgdmFycy50ZXN0aW5nID0gdHJ1ZTtcbiAgICAgIG9wdGlvbnMuYnJvd3NlciA9ICdubyc7XG4gICAgICBvcHRpb25zLndhdGNoID0gJ25vJztcbiAgICAgIG9wdGlvbnMuYnVpbGRFbnZpcm9ubWVudCA9ICd0ZXN0aW5nJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucy5idWlsZEVudmlyb25tZW50ID0gJ2RldmVsb3BtZW50JztcbiAgICAgIHZhcnMucHJvZHVjdGlvbiA9IGZhbHNlO1xuICAgIH1cblxuICAgIGxvZyhhcHAsIF9nZXRWZXJzaW9ucyhwbHVnaW5OYW1lLCBmcmFtZXdvcmspKVxuXG4gICAgLy9tamcgYWRkZWQgZm9yIGFuZ3VsYXIgY2xpIGJ1aWxkXG4gICAgaWYgKGZyYW1ld29yayA9PSAnYW5ndWxhcicgJiZcbiAgICAgICAgb3B0aW9ucy5pbnRlbGxpc2hha2UgPT0gJ25vJyAmJlxuICAgICAgICB2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZVxuICAgICAgICAmJiB0cmVlc2hha2UgPT0gJ3llcycpIHtcbiAgICAgICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSc7XG4gICAgICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJyArIGZyYW1ld29yayk7XG4gICAgfVxuXG4gICAgZWxzZSBpZiAoZnJhbWV3b3JrID09ICdyZWFjdCcgfHwgZnJhbWV3b3JrID09ICdleHRqcycgfHwgZnJhbWV3b3JrID09ICd3ZWItY29tcG9uZW50cycpIHtcbiAgICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKVxuICAgICAgfVxuICAgICAgZWxzZSBpZih2YXJzLnRlc3RpbmcgPT0gdHJ1ZSl7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIHRlc3RpbmcgYnVpbGQgZm9yICcgKyBmcmFtZXdvcmspXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJ1xuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgZGV2ZWxvcG1lbnQgYnVpbGQgZm9yICcgKyBmcmFtZXdvcmspXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlKSB7XG4gICAgICBpZiAodHJlZXNoYWtlID09ICd5ZXMnKSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMidcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICcgKyBmcmFtZXdvcmsgKyAnIC0gJyArIHZhcnMuYnVpbGRzdGVwKVxuICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fdG9Qcm9kKHZhcnMsIG9wdGlvbnMpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMiBvZiAyJ1xuICAgICAgICBsb2coYXBwLCAnQ29udGludWluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrICsgJyAtICcgKyB2YXJzLmJ1aWxkc3RlcClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICBsb2coYXBwLCAnU3RhcnRpbmcgZGV2ZWxvcG1lbnQgYnVpbGQgZm9yICcgKyBmcmFtZXdvcmspXG4gICAgfVxuICAgIGxvZ3YodmVyYm9zZSwgJ0J1aWxkaW5nIGZvciAnICsgb3B0aW9ucy5idWlsZEVudmlyb25tZW50ICsgJywgJyArICd0cmVlc2hha2UgaXMgJyArIG9wdGlvbnMudHJlZXNoYWtlKyAnLCAnICsgJ2ludGVsbGlzaGFrZSBpcyAnICsgb3B0aW9ucy5pbnRlbGxpc2hha2UpXG5cbiAgICB2YXIgY29uZmlnT2JqID0geyB2YXJzOiB2YXJzLCBvcHRpb25zOiBvcHRpb25zIH07XG4gICAgcmV0dXJuIGNvbmZpZ09iajtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIHRocm93ICdfY29uc3RydWN0b3I6ICcgKyBlLnRvU3RyaW5nKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfdGhpc0NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX3RoaXNDb21waWxhdGlvbicpXG4gICAgbG9ndih2ZXJib3NlLCBgb3B0aW9ucy5zY3JpcHQ6ICR7b3B0aW9ucy5zY3JpcHQgfWApXG4gICAgbG9ndih2ZXJib3NlLCBgYnVpbGRzdGVwOiAke3ZhcnMuYnVpbGRzdGVwfWApXG5cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09PSAnMSBvZiAyJykge1xuICAgICAgaWYgKG9wdGlvbnMuc2NyaXB0ICE9IHVuZGVmaW5lZCAmJiBvcHRpb25zLnNjcmlwdCAhPSBudWxsICYmIG9wdGlvbnMuc2NyaXB0ICE9ICcnKSB7XG4gICAgICAgIGxvZyhhcHAsIGBTdGFydGVkIHJ1bm5pbmcgJHtvcHRpb25zLnNjcmlwdH1gKVxuICAgICAgICBydW5TY3JpcHQob3B0aW9ucy5zY3JpcHQsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxvZyhhcHAsIGBGaW5pc2hlZCBydW5uaW5nICR7b3B0aW9ucy5zY3JpcHR9YClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICB0aHJvdyAnX3RoaXNDb21waWxhdGlvbjogJyArIGUudG9TdHJpbmcoKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9jb21waWxhdGlvbicpXG5cbiAgICBpZiAoZnJhbWV3b3JrICE9ICdleHRqcycpIHtcbiAgICAgIGlmIChvcHRpb25zLnRyZWVzaGFrZSA9PT0gJ3llcycgJiYgb3B0aW9ucy5idWlsZEVudmlyb25tZW50ID09PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgdmFyIGV4dENvbXBvbmVudHMgPSBbXTtcblxuICAgICAgICAvL21qZyBmb3IgMSBzdGVwIGJ1aWxkXG4gICAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyAmJiBmcmFtZXdvcmsgPT09ICdhbmd1bGFyJyAmJiBvcHRpb25zLmludGVsbGlzaGFrZSA9PSAnbm8nKSB7XG4gICAgICAgICAgICBleHRDb21wb25lbnRzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMicgfHwgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnICYmIGZyYW1ld29yayA9PT0gJ3dlYi1jb21wb25lbnRzJykpIHtcbiAgICAgICAgICBleHRDb21wb25lbnRzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucylcbiAgICAgICAgfVxuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5zdWNjZWVkTW9kdWxlLnRhcChgZXh0LXN1Y2NlZWQtbW9kdWxlYCwgbW9kdWxlID0+IHtcbiAgICAgICAgICBpZiAobW9kdWxlLnJlc291cmNlICYmICFtb2R1bGUucmVzb3VyY2UubWF0Y2goL25vZGVfbW9kdWxlcy8pKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChtb2R1bGUucmVzb3VyY2UubWF0Y2goL1xcLmh0bWwkLykgIT0gbnVsbFxuICAgICAgICAgICAgICAgICYmIG1vZHVsZS5fc291cmNlLl92YWx1ZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdkb2N0eXBlIGh0bWwnKSA9PSBmYWxzZVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5maW5pc2hNb2R1bGVzLnRhcChgZXh0LWZpbmlzaC1tb2R1bGVzYCwgbW9kdWxlcyA9PiB7XG4gICAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIodmFycywgb3B0aW9ucylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMiBvZiAyJykge1xuICAgICAgICBpZiAob3B0aW9ucy5pbmplY3QgPT09ICd5ZXMnKSB7XG4gICAgICAgICAgaWYoY29tcGlsYXRpb24uaG9va3MuaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLmh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24udGFwKGBleHQtaHRtbC1nZW5lcmF0aW9uYCwoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgICAgICAgICAgIHZhciBqc1BhdGggPSBwYXRoLmpvaW4odmFycy5leHRQYXRoLCAnZXh0LmpzJylcbiAgICAgICAgICAgICAgdmFyIGNzc1BhdGggPSBwYXRoLmpvaW4odmFycy5leHRQYXRoLCAnZXh0LmNzcycpXG4gICAgICAgICAgICAgIC8vdmFyIGpzUGF0aCA9IHZhcnMuZXh0UGF0aCArICcvJyArICAnZXh0LmpzJztcbiAgICAgICAgICAgICAgLy92YXIgY3NzUGF0aCA9IHZhcnMuZXh0UGF0aCArICcvJyArICdleHQuY3NzJztcbiAgICAgICAgICAgICAgZGF0YS5hc3NldHMuanMudW5zaGlmdChqc1BhdGgpXG4gICAgICAgICAgICAgIGRhdGEuYXNzZXRzLmNzcy51bnNoaWZ0KGNzc1BhdGgpXG4gICAgICAgICAgICAgIGxvZyhhcHAsIGBBZGRpbmcgJHtqc1BhdGh9IGFuZCAke2Nzc1BhdGh9IHRvIGluZGV4Lmh0bWxgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHRocm93ICdfY29tcGlsYXRpb246ICcgKyBlLnRvU3RyaW5nKClcbi8vICAgIGxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4vLyAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2NvbXBpbGF0aW9uOiAnICsgZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfYWZ0ZXJDb21waWxlKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZScpXG4gICAgaWYgKGZyYW1ld29yayA9PSAnZXh0anMnKSB7XG4gICAgICByZXF1aXJlKGAuL2V4dGpzVXRpbGApLl9hZnRlckNvbXBpbGUoY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZSBub3QgcnVuJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHRocm93ICdfYWZ0ZXJDb21waWxlOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2VtaXQoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB0cnkge1xuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBlbWl0ID0gb3B0aW9ucy5lbWl0XG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgdmFycy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfZW1pdCcpXG4gICAgaWYgKGVtaXQgPT0gJ3llcycpIHtcbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgICAgICBsZXQgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vdXRwdXRQYXRoLHZhcnMuZXh0UGF0aClcbiAgICAgICAgaWYgKGNvbXBpbGVyLm91dHB1dFBhdGggPT09ICcvJyAmJiBjb21waWxlci5vcHRpb25zLmRldlNlcnZlcikge1xuICAgICAgICAgIG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIuY29udGVudEJhc2UsIG91dHB1dFBhdGgpXG4gICAgICAgIH1cbiAgICAgICAgbG9ndih2ZXJib3NlLCdvdXRwdXRQYXRoOiAnICsgb3V0cHV0UGF0aClcbiAgICAgICAgbG9ndih2ZXJib3NlLCdmcmFtZXdvcms6ICcgKyBmcmFtZXdvcmspXG4gICAgICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgICAgIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29tbWFuZCA9ICcnXG4gICAgICAgIGlmIChvcHRpb25zLndhdGNoID09ICd5ZXMnICYmIHZhcnMucHJvZHVjdGlvbiA9PSBmYWxzZSlcbiAgICAgICAgICB7Y29tbWFuZCA9ICd3YXRjaCd9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB7Y29tbWFuZCA9ICdidWlsZCd9XG4gICAgICAgIGlmICh2YXJzLnJlYnVpbGQgPT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciBwYXJtcyA9IFtdXG4gICAgICAgICAgaWYoIUFycmF5LmlzQXJyYXkob3B0aW9ucy5jbWRvcHRzKSl7XG4gICAgICAgICAgICBvcHRpb25zLmNtZG9wdHMgPSBvcHRpb25zLmNtZG9wdHMuc3BsaXQoJyAnKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAob3B0aW9ucy5wcm9maWxlID09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnByb2ZpbGUgPT0gJycgfHwgb3B0aW9ucy5wcm9maWxlID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpXG4gICAgICAgICAgICAgIHsgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMuYnVpbGRFbnZpcm9ubWVudF0gfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB7IHBhcm1zID0gWydhcHAnLCBjb21tYW5kLCAnLS13ZWItc2VydmVyJywgJ2ZhbHNlJywgb3B0aW9ucy5idWlsZEVudmlyb25tZW50XSB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT0gJ2J1aWxkJylcbiAgICAgICAgICAgICAge3Bhcm1zID0gWydhcHAnLCBjb21tYW5kLCBvcHRpb25zLnByb2ZpbGUsIG9wdGlvbnMuYnVpbGRFbnZpcm9ubWVudF19XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHtwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5idWlsZEVudmlyb25tZW50XX1cbiAgICAgICAgICB9XG4gICAgICAgICAgb3B0aW9ucy5jbWRvcHRzLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCl7XG4gICAgICAgICAgICAgIHBhcm1zLnNwbGljZShwYXJtcy5pbmRleE9mKGNvbW1hbmQpKzEsIDAsIGVsZW1lbnQpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLy8gaWYgKHZhcnMud2F0Y2hTdGFydGVkID09IGZhbHNlKSB7XG4gICAgICAgICAgLy8gICBhd2FpdCBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIHZhcnMsIG9wdGlvbnMpXG4gICAgICAgICAgLy8gICB2YXJzLndhdGNoU3RhcnRlZCA9IHRydWVcbiAgICAgICAgICAvLyB9XG4gICAgICAgICAgaWYgKHZhcnMud2F0Y2hTdGFydGVkID09IGZhbHNlKSB7XG4gICAgICAgICAgICBhd2FpdCBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIHZhcnMsIG9wdGlvbnMpXG4gICAgICAgICAgICBpZiAoY29tbWFuZCA9PSAnd2F0Y2gnKSB7XG4gICAgICAgICAgICAgIHZhcnMud2F0Y2hTdGFydGVkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHZhcnMuY2FsbGJhY2soKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvL21qZ1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFycy5jYWxsYmFjaygpXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vbWpnXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFycy5jYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBsb2d2KHZlcmJvc2UsJ05PVCBydW5uaW5nIGVtaXQnKVxuICAgICAgICB2YXJzLmNhbGxiYWNrKClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KHZlcmJvc2UsJ2VtaXQgaXMgbm8nKVxuICAgICAgdmFycy5jYWxsYmFjaygpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICB2YXJzLmNhbGxiYWNrKClcbiAgICB0aHJvdyAnX2VtaXQ6ICcgKyBlLnRvU3RyaW5nKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZG9uZShzdGF0cywgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfZG9uZScpXG4gICAgaWYgKHN0YXRzLmNvbXBpbGF0aW9uLmVycm9ycyAmJiBzdGF0cy5jb21waWxhdGlvbi5lcnJvcnMubGVuZ3RoKSAvLyAmJiBwcm9jZXNzLmFyZ3YuaW5kZXhPZignLS13YXRjaCcpID09IC0xKVxuICAgIHtcbiAgICAgIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJyk7XG4gICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQoJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKicpKTtcbiAgICAgIGNvbnNvbGUubG9nKHN0YXRzLmNvbXBpbGF0aW9uLmVycm9yc1swXSk7XG4gICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQoJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKicpKTtcbiAgICAgIC8vcHJvY2Vzcy5leGl0KDApO1xuICAgIH1cblxuICAgIC8vbWpnIHJlZmFjdG9yXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlICYmIG9wdGlvbnMudHJlZXNoYWtlID09ICdubycgJiYgZnJhbWV3b3JrID09ICdhbmd1bGFyJykge1xuICAgICAgcmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5fdG9EZXYodmFycywgb3B0aW9ucylcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmKG9wdGlvbnMuYnJvd3NlciA9PSAneWVzJyAmJiBvcHRpb25zLndhdGNoID09ICd5ZXMnICYmIHZhcnMucHJvZHVjdGlvbiA9PSBmYWxzZSkge1xuICAgICAgICBpZiAodmFycy5icm93c2VyQ291bnQgPT0gMCkge1xuICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDonICsgb3B0aW9ucy5wb3J0XG4gICAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgT3BlbmluZyBicm93c2VyIGF0ICR7dXJsfWApXG4gICAgICAgICAgdmFycy5icm93c2VyQ291bnQrK1xuICAgICAgICAgIGNvbnN0IG9wbiA9IHJlcXVpcmUoJ29wbicpXG4gICAgICAgICAgb3BuKHVybClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICB9XG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnKSB7XG4gICAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUpIHtcbiAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICR7ZnJhbWV3b3JrfWApXG4gICAgICB9XG4gICAgICBlbHNlIGlmICh2YXJzLnRlc3RpbmcgPT0gdHJ1ZSkge1xuICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgdGVzdGluZyBidWlsZCBmb3IgJHtmcmFtZXdvcmt9YClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgZGV2ZWxvcG1lbnQgYnVpbGQgZm9yICR7ZnJhbWV3b3JrfWApXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMiBvZiAyJykge1xuICAgICAgaWYodmFycy50ZXN0aW5nID09IHRydWUpe1xuICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgdGVzdGluZyBidWlsZCBmb3IgJHtmcmFtZXdvcmt9YClcbiAgICAgIH1cbiAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAke2ZyYW1ld29ya31gKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4vLyAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuICAgIHRocm93ICdfZG9uZTogJyArIGUudG9TdHJpbmcoKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXQsIGNvbXBpbGF0aW9uKSB7XG4gIHRyeSB7XG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgcGFja2FnZXMgPSBvcHRpb25zLnBhY2thZ2VzXG4gICAgdmFyIHRvb2xraXQgPSBvcHRpb25zLnRvb2xraXRcbiAgICB2YXIgdGhlbWUgPSBvcHRpb25zLnRoZW1lXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfcHJlcGFyZUZvckJ1aWxkJylcbiAgICBjb25zdCByaW1yYWYgPSByZXF1aXJlKCdyaW1yYWYnKVxuICAgIGNvbnN0IG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpXG4gICAgY29uc3QgZnN4ID0gcmVxdWlyZSgnZnMtZXh0cmEnKVxuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICB0aGVtZSA9IHRoZW1lIHx8ICh0b29sa2l0ID09PSAnY2xhc3NpYycgPyAndGhlbWUtdHJpdG9uJyA6ICd0aGVtZS1tYXRlcmlhbCcpXG4gICAgbG9ndih2ZXJib3NlLCdmaXJzdFRpbWU6ICcgKyB2YXJzLmZpcnN0VGltZSlcbiAgICBpZiAodmFycy5maXJzdFRpbWUpIHtcbiAgICAgIHJpbXJhZi5zeW5jKG91dHB1dClcbiAgICAgIG1rZGlycC5zeW5jKG91dHB1dClcbiAgICAgIGNvbnN0IGJ1aWxkWE1MID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5idWlsZFhNTFxuICAgICAgY29uc3QgY3JlYXRlQXBwSnNvbiA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuY3JlYXRlQXBwSnNvblxuICAgICAgY29uc3QgY3JlYXRlV29ya3NwYWNlSnNvbiA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuY3JlYXRlV29ya3NwYWNlSnNvblxuICAgICAgY29uc3QgY3JlYXRlSlNET01FbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuY3JlYXRlSlNET01FbnZpcm9ubWVudFxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnYnVpbGQueG1sJyksIGJ1aWxkWE1MKHZhcnMucHJvZHVjdGlvbiwgb3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnYXBwLmpzb24nKSwgY3JlYXRlQXBwSnNvbih0aGVtZSwgcGFja2FnZXMsIHRvb2xraXQsIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2pzZG9tLWVudmlyb25tZW50LmpzJyksIGNyZWF0ZUpTRE9NRW52aXJvbm1lbnQob3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnd29ya3NwYWNlLmpzb24nKSwgY3JlYXRlV29ya3NwYWNlSnNvbihvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICB2YXIgZnJhbWV3b3JrID0gdmFycy5mcmFtZXdvcms7XG4gICAgICAvL2JlY2F1c2Ugb2YgYSBwcm9ibGVtIHdpdGggY29sb3JwaWNrZXJcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L3V4L2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vdXgvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICd1eCcpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAodXgpICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAncGFja2FnZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L292ZXJyaWRlcy9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L292ZXJyaWRlcy9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ292ZXJyaWRlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksJ3Jlc291cmNlcy8nKSkpIHtcbiAgICAgICAgdmFyIGZyb21SZXNvdXJjZXMgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3Jlc291cmNlcy8nKVxuICAgICAgICB2YXIgdG9SZXNvdXJjZXMgPSBwYXRoLmpvaW4ob3V0cHV0LCAnLi4vcmVzb3VyY2VzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21SZXNvdXJjZXMsIHRvUmVzb3VyY2VzKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAnICsgZnJvbVJlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1Jlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICB9XG4gICAgdmFycy5maXJzdFRpbWUgPSBmYWxzZVxuICAgIHZhciBqcyA9ICcnXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbikge1xuICAgICAgdmFycy5kZXBzID0gdmFycy5kZXBzLmZpbHRlcihmdW5jdGlvbih2YWx1ZSwgaW5kZXgpeyByZXR1cm4gdmFycy5kZXBzLmluZGV4T2YodmFsdWUpID09IGluZGV4IH0pO1xuICAgICAganMgPSB2YXJzLmRlcHMuam9pbignO1xcbicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGpzID0gYEV4dC5yZXF1aXJlKFtcIkV4dC4qXCIsXCJFeHQuZGF0YS5UcmVlU3RvcmVcIl0pYFxuICAgIH1cbiAgICBqcyA9IGBFeHQucmVxdWlyZShbXCJFeHQuKlwiLFwiRXh0LmRhdGEuVHJlZVN0b3JlXCJdKWA7IC8vZm9yIG5vd1xuICAgIGlmICh2YXJzLm1hbmlmZXN0ID09PSBudWxsIHx8IGpzICE9PSB2YXJzLm1hbmlmZXN0KSB7XG4gICAgICB2YXJzLm1hbmlmZXN0ID0ganMgKyAnO1xcbkV4dC5yZXF1aXJlKFtcIkV4dC5sYXlvdXQuKlwiXSk7XFxuJztcbiAgICAgIGNvbnN0IG1hbmlmZXN0ID0gcGF0aC5qb2luKG91dHB1dCwgJ21hbmlmZXN0LmpzJylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMobWFuaWZlc3QsIHZhcnMubWFuaWZlc3QsICd1dGY4JylcbiAgICAgIHZhcnMucmVidWlsZCA9IHRydWVcbiAgICAgIHZhciBidW5kbGVEaXIgPSBvdXRwdXQucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJylcbiAgICAgIGlmIChidW5kbGVEaXIudHJpbSgpID09ICcnKSB7YnVuZGxlRGlyID0gJy4vJ31cbiAgICAgIGxvZyhhcHAsICdCdWlsZGluZyBFeHQgYnVuZGxlIGF0OiAnICsgYnVuZGxlRGlyKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhcnMucmVidWlsZCA9IGZhbHNlXG4gICAgICBsb2coYXBwLCAnRXh0IHJlYnVpbGQgTk9UIG5lZWRlZCcpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfcHJlcGFyZUZvckJ1aWxkOiAnICsgZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIHZhcnMsIG9wdGlvbnMpIHtcbiAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gIGxvZ3YodmVyYm9zZSwnRlVOQ1RJT04gX2J1aWxkRXh0QnVuZGxlJylcbiAgbGV0IHNlbmNoYTsgdHJ5IHsgc2VuY2hhID0gcmVxdWlyZSgnQHNlbmNoYS9jbWQnKSB9IGNhdGNoIChlKSB7IHNlbmNoYSA9ICdzZW5jaGEnIH1cbiAgaWYgKGZzLmV4aXN0c1N5bmMoc2VuY2hhKSkge1xuICAgIGxvZ3YodmVyYm9zZSwnc2VuY2hhIGZvbGRlciBleGlzdHMnKVxuICB9XG4gIGVsc2Uge1xuICAgIGxvZ3YodmVyYm9zZSwnc2VuY2hhIGZvbGRlciBET0VTIE5PVCBleGlzdCcpXG4gIH1cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBvbkJ1aWxkRG9uZSA9ICgpID0+IHtcbiAgICAgIGxvZ3YodmVyYm9zZSwnb25CdWlsZERvbmUnKVxuICAgICAgcmVzb2x2ZSgpXG4gICAgfVxuICAgIHZhciBvcHRzID0geyBjd2Q6IG91dHB1dFBhdGgsIHNpbGVudDogdHJ1ZSwgc3RkaW86ICdwaXBlJywgZW5jb2Rpbmc6ICd1dGYtOCd9XG4gICAgX2V4ZWN1dGVBc3luYyhhcHAsIHNlbmNoYSwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKS50aGVuIChcbiAgICAgIGZ1bmN0aW9uKCkgeyBvbkJ1aWxkRG9uZSgpIH0sXG4gICAgICBmdW5jdGlvbihyZWFzb24pIHsgcmVqZWN0KHJlYXNvbikgfVxuICAgIClcbiAgfSlcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2V4ZWN1dGVBc3luYyAoYXBwLCBjb21tYW5kLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gIC8vY29uc3QgREVGQVVMVF9TVUJTVFJTID0gWydbSU5GXSBMb2FkaW5nJywgJ1tJTkZdIFByb2Nlc3NpbmcnLCAnW0xPR10gRmFzaGlvbiBidWlsZCBjb21wbGV0ZScsICdbRVJSXScsICdbV1JOXScsIFwiW0lORl0gU2VydmVyXCIsIFwiW0lORl0gV3JpdGluZ1wiLCBcIltJTkZdIExvYWRpbmcgQnVpbGRcIiwgXCJbSU5GXSBXYWl0aW5nXCIsIFwiW0xPR10gRmFzaGlvbiB3YWl0aW5nXCJdO1xuICBjb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbXCJbSU5GXSB4U2VydmVyXCIsICdbSU5GXSBMb2FkaW5nJywgJ1tJTkZdIEFwcGVuZCcsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tJTkZdIFByb2Nlc3NpbmcgQnVpbGQnLCAnW0xPR10gRmFzaGlvbiBidWlsZCBjb21wbGV0ZScsICdbRVJSXScsICdbV1JOXScsIFwiW0lORl0gV3JpdGluZ1wiLCBcIltJTkZdIExvYWRpbmcgQnVpbGRcIiwgXCJbSU5GXSBXYWl0aW5nXCIsIFwiW0xPR10gRmFzaGlvbiB3YWl0aW5nXCJdO1xuICB2YXIgc3Vic3RyaW5ncyA9IERFRkFVTFRfU1VCU1RSU1xuICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gIGNvbnN0IGNyb3NzU3Bhd24gPSByZXF1aXJlKCdjcm9zcy1zcGF3bi13aXRoLWtpbGwnKVxuICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfZXhlY3V0ZUFzeW5jJylcbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGxvZ3YodmVyYm9zZSxgY29tbWFuZCAtICR7Y29tbWFuZH1gKVxuICAgIGxvZ3YodmVyYm9zZSwgYHBhcm1zIC0gJHtwYXJtc31gKVxuICAgIGxvZ3YodmVyYm9zZSwgYG9wdHMgLSAke0pTT04uc3RyaW5naWZ5KG9wdHMpfWApXG4gICAgdmFycy5jaGlsZCA9IGNyb3NzU3Bhd24oY29tbWFuZCwgcGFybXMsIG9wdHMpXG5cbiAgICB2YXJzLmNoaWxkLm9uKCdjbG9zZScsIChjb2RlLCBzaWduYWwpID0+IHtcbiAgICAgIGxvZ3YodmVyYm9zZSwgYG9uIGNsb3NlOiBgICsgY29kZSlcbiAgICAgIGlmKGNvZGUgPT09IDApIHsgcmVzb2x2ZSgwKSB9XG4gICAgICBlbHNlIHsgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goIG5ldyBFcnJvcihjb2RlKSApOyByZXNvbHZlKDApIH1cbiAgICB9KVxuICAgIHZhcnMuY2hpbGQub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG4gICAgICBsb2d2KHZlcmJvc2UsIGBvbiBlcnJvcmApXG4gICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChlcnJvcilcbiAgICAgIHJlc29sdmUoMClcbiAgICB9KVxuICAgIHZhcnMuY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgbG9ndih2ZXJib3NlLCBgJHtzdHJ9YClcbiAgICAgIC8vaWYgKGRhdGEgJiYgZGF0YS50b1N0cmluZygpLm1hdGNoKC9GYXNoaW9uIHdhaXRpbmcgZm9yIGNoYW5nZXNcXC5cXC5cXC4vKSkge1xuICAgICAgaWYgKGRhdGEgJiYgZGF0YS50b1N0cmluZygpLm1hdGNoKC9haXRpbmcgZm9yIGNoYW5nZXNcXC5cXC5cXC4vKSkge1xuXG4vLyAgICAgICAgICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuLy8gICAgICAgICAgIHZhciBmaWxlbmFtZSA9IHByb2Nlc3MuY3dkKCkgKyB2YXJzLnRvdWNoRmlsZTtcbi8vICAgICAgICAgICB0cnkge1xuLy8gICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKClcbi8vICAgICAgICAgICAgIHZhciBkYXRhID0gZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lKTtcbi8vICAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZW5hbWUsICcvLycgKyBkLCAndXRmOCcpO1xuLy8gICAgICAgICAgICAgbG9ndihhcHAsIGB0b3VjaGluZyAke2ZpbGVuYW1lfWApO1xuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgICBjYXRjaChlKSB7XG4vLyAgICAgICAgICAgICBsb2d2KGFwcCwgYE5PVCB0b3VjaGluZyAke2ZpbGVuYW1lfWApO1xuLy8gICAgICAgICAgIH1cblxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltJTkZdXCIsIFwiXCIpXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0xPR11cIiwgXCJcIilcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpLnRyaW0oKVxuICAgICAgICBpZiAoc3RyLmluY2x1ZGVzKFwiW0VSUl1cIikpIHtcbiAgICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChhcHAgKyBzdHIucmVwbGFjZSgvXlxcW0VSUlxcXSAvZ2ksICcnKSk7XG4gICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbRVJSXVwiLCBgJHtjaGFsay5yZWQoXCJbRVJSXVwiKX1gKVxuICAgICAgICB9XG4gICAgICAgIGxvZyhhcHAsIHN0cilcblxuICAgICAgICB2YXJzLmNhbGxiYWNrKClcbiAgICAgICAgcmVzb2x2ZSgwKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmIChzdWJzdHJpbmdzLnNvbWUoZnVuY3Rpb24odikgeyByZXR1cm4gZGF0YS5pbmRleE9mKHYpID49IDA7IH0pKSB7XG4gICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbSU5GXVwiLCBcIlwiKVxuICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0xPR11cIiwgXCJcIilcbiAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykudHJpbSgpXG4gICAgICAgICAgaWYgKHN0ci5pbmNsdWRlcyhcIltFUlJdXCIpKSB7XG4gICAgICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChhcHAgKyBzdHIucmVwbGFjZSgvXlxcW0VSUlxcXSAvZ2ksICcnKSk7XG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltFUlJdXCIsIGAke2NoYWxrLnJlZChcIltFUlJdXCIpfWApXG4gICAgICAgICAgfVxuICAgICAgICAgIGxvZyhhcHAsIHN0cilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgdmFycy5jaGlsZC5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgbG9ndihvcHRpb25zLCBgZXJyb3Igb24gY2xvc2U6IGAgKyBkYXRhKVxuICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXG4gICAgICB2YXIgc3RySmF2YU9wdHMgPSBcIlBpY2tlZCB1cCBfSkFWQV9PUFRJT05TXCI7XG4gICAgICB2YXIgaW5jbHVkZXMgPSBzdHIuaW5jbHVkZXMoc3RySmF2YU9wdHMpXG4gICAgICBpZiAoIWluY2x1ZGVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGAke2FwcH0gJHtjaGFsay5yZWQoXCJbRVJSXVwiKX0gJHtzdHJ9YClcbiAgICAgIH1cbiAgICB9KVxuICB9KVxufVxuXG4vLyoqKioqKioqKipcbmZ1bmN0aW9uIHJ1blNjcmlwdChzY3JpcHRQYXRoLCBjYWxsYmFjaykge1xuICB2YXIgY2hpbGRQcm9jZXNzID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xuICAvLyBrZWVwIHRyYWNrIG9mIHdoZXRoZXIgY2FsbGJhY2sgaGFzIGJlZW4gaW52b2tlZCB0byBwcmV2ZW50IG11bHRpcGxlIGludm9jYXRpb25zXG4gIHZhciBpbnZva2VkID0gZmFsc2U7XG4gIHZhciBwcm9jZXNzID0gY2hpbGRQcm9jZXNzLmZvcmsoc2NyaXB0UGF0aCwgW10sIHsgZXhlY0FyZ3YgOiBbJy0taW5zcGVjdD0wJ10gfSk7XG4gIC8vIGxpc3RlbiBmb3IgZXJyb3JzIGFzIHRoZXkgbWF5IHByZXZlbnQgdGhlIGV4aXQgZXZlbnQgZnJvbSBmaXJpbmdcbiAgcHJvY2Vzcy5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKGludm9rZWQpIHJldHVybjtcbiAgICBpbnZva2VkID0gdHJ1ZTtcbiAgICBjYWxsYmFjayhlcnIpO1xuICB9KTtcbiAgLy8gZXhlY3V0ZSB0aGUgY2FsbGJhY2sgb25jZSB0aGUgcHJvY2VzcyBoYXMgZmluaXNoZWQgcnVubmluZ1xuICBwcm9jZXNzLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGUpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIHZhciBlcnIgPSBjb2RlID09PSAwID8gbnVsbCA6IG5ldyBFcnJvcignZXhpdCBjb2RlICcgKyBjb2RlKTtcbiAgICBjYWxsYmFjayhlcnIpO1xuICB9KTtcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3RvWHR5cGUoc3RyKSB7XG4gIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9fL2csICctJylcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2dldEFwcCgpIHtcbiAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKVxuICB2YXIgcHJlZml4ID0gYGBcbiAgY29uc3QgcGxhdGZvcm0gPSByZXF1aXJlKCdvcycpLnBsYXRmb3JtKClcbiAgaWYgKHBsYXRmb3JtID09ICdkYXJ3aW4nKSB7IHByZWZpeCA9IGDihLkg772iZXh0772jOmAgfVxuICBlbHNlIHsgcHJlZml4ID0gYGkgW2V4dF06YCB9XG4gIHJldHVybiBgJHtjaGFsay5ncmVlbihwcmVmaXgpfSBgXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRWZXJzaW9ucyhwbHVnaW5OYW1lLCBmcmFtZXdvcmtOYW1lKSB7XG50cnkge1xuICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICB2YXIgdiA9IHt9XG4gIHZhciBmcmFtZXdvcmtJbmZvID0gJ24vYSdcblxuICB2LnBsdWdpblZlcnNpb24gPSAnbi9hJztcbiAgdi5leHRWZXJzaW9uID0gJ24vYSc7XG4gIHYuZWRpdGlvbiA9ICduL2EnO1xuICB2LmNtZFZlcnNpb24gPSAnbi9hJztcbiAgdi53ZWJwYWNrVmVyc2lvbiA9ICduL2EnO1xuXG4gIHZhciBwbHVnaW5QYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhJywgcGx1Z2luTmFtZSlcbiAgdmFyIHBsdWdpblBrZyA9IChmcy5leGlzdHNTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwbHVnaW5QYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5wbHVnaW5WZXJzaW9uID0gcGx1Z2luUGtnLnZlcnNpb25cbiAgdi5fcmVzb2x2ZWQgPSBwbHVnaW5Qa2cuX3Jlc29sdmVkXG4gIGlmICh2Ll9yZXNvbHZlZCA9PSB1bmRlZmluZWQpIHtcbiAgICB2LmVkaXRpb24gPSBgQ29tbWVyY2lhbGBcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAoLTEgPT0gdi5fcmVzb2x2ZWQuaW5kZXhPZignY29tbXVuaXR5JykpIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tdW5pdHlgXG4gICAgfVxuICB9XG4gIHZhciB3ZWJwYWNrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvd2VicGFjaycpXG4gIHZhciB3ZWJwYWNrUGtnID0gKGZzLmV4aXN0c1N5bmMod2VicGFja1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYud2VicGFja1ZlcnNpb24gPSB3ZWJwYWNrUGtnLnZlcnNpb25cbiAgdmFyIGV4dFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0JylcbiAgdmFyIGV4dFBrZyA9IChmcy5leGlzdHNTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhleHRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5leHRWZXJzaW9uID0gZXh0UGtnLnNlbmNoYS52ZXJzaW9uXG4gIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gIHZhciBjbWRQa2cgPSAoZnMuZXhpc3RzU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgaWYgKHYuY21kVmVyc2lvbiA9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgY21kUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLGBub2RlX21vZHVsZXMvQHNlbmNoYS8ke3BsdWdpbk5hbWV9L25vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gICAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXG4gIH1cblxuICAgaWYgKGZyYW1ld29ya05hbWUgIT0gdW5kZWZpbmVkICYmIGZyYW1ld29ya05hbWUgIT0gJ2V4dGpzJykge1xuICAgIHZhciBmcmFtZXdvcmtQYXRoID0gJydcbiAgICBpZiAoZnJhbWV3b3JrTmFtZSA9PSAncmVhY3QnKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9yZWFjdCcpXG4gICAgfVxuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdhbmd1bGFyJykge1xuICAgICAgZnJhbWV3b3JrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQGFuZ3VsYXIvY29yZScpXG4gICAgfVxuICAgIHZhciBmcmFtZXdvcmtQa2cgPSAoZnMuZXhpc3RzU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZnJhbWV3b3JrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gICAgdi5mcmFtZXdvcmtWZXJzaW9uID0gZnJhbWV3b3JrUGtnLnZlcnNpb25cbiAgICBpZiAodi5mcmFtZXdvcmtWZXJzaW9uID09IHVuZGVmaW5lZCkge1xuICAgICAgZnJhbWV3b3JrSW5mbyA9ICcsICcgKyBmcmFtZXdvcmtOYW1lXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZnJhbWV3b3JrSW5mbyA9ICcsICcgKyBmcmFtZXdvcmtOYW1lICsgJyB2JyArIHYuZnJhbWV3b3JrVmVyc2lvblxuICAgIH1cbiAgfVxuICByZXR1cm4gJ2V4dC13ZWJwYWNrLXBsdWdpbiB2JyArIHYucGx1Z2luVmVyc2lvbiArICcsIEV4dCBKUyB2JyArIHYuZXh0VmVyc2lvbiArICcgJyArIHYuZWRpdGlvbiArICcgRWRpdGlvbiwgU2VuY2hhIENtZCB2JyArIHYuY21kVmVyc2lvbiArICcsIHdlYnBhY2sgdicgKyB2LndlYnBhY2tWZXJzaW9uICsgZnJhbWV3b3JrSW5mb1xuXG59XG5jYXRjaCAoZSkge1xuICByZXR1cm4gJ2V4dC13ZWJwYWNrLXBsdWdpbiB2JyArIHYucGx1Z2luVmVyc2lvbiArICcsIEV4dCBKUyB2JyArIHYuZXh0VmVyc2lvbiArICcgJyArIHYuZWRpdGlvbiArICcgRWRpdGlvbiwgU2VuY2hhIENtZCB2JyArIHYuY21kVmVyc2lvbiArICcsIHdlYnBhY2sgdicgKyB2LndlYnBhY2tWZXJzaW9uICsgZnJhbWV3b3JrSW5mb1xufVxuXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhhcHAsbWVzc2FnZSkge1xuICB2YXIgcyA9IGFwcCArIG1lc3NhZ2VcbiAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgdHJ5IHtwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKX1jYXRjaChlKSB7fVxuICBwcm9jZXNzLnN0ZG91dC53cml0ZShzKTtwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9naChhcHAsbWVzc2FnZSkge1xuICB2YXIgaCA9IGZhbHNlXG4gIHZhciBzID0gYXBwICsgbWVzc2FnZVxuICBpZiAoaCA9PSB0cnVlKSB7XG4gICAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgICB0cnkge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKClcbiAgICB9XG4gICAgY2F0Y2goZSkge31cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShzKVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZ3YodmVyYm9zZSwgcykge1xuICBpZiAodmVyYm9zZSA9PSAneWVzJykge1xuICAgIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgfVxuICAgIGNhdGNoKGUpIHt9XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoYC12ZXJib3NlOiAke3N9YClcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbiAgfVxufVxuXG5mdW5jdGlvbiBfZ2V0VmFsaWRhdGVPcHRpb25zKCkge1xuICByZXR1cm4ge1xuICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICBcImZyYW1ld29ya1wiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInRvb2xraXRcIjoge1xuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJ0aGVtZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImVtaXRcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInNjcmlwdFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInBvcnRcIjoge1xuICAgICAgICBcInR5cGVcIjogW1wiaW50ZWdlclwiXVxuICAgICAgfSxcbiAgICAgIFwicGFja2FnZXNcIjoge1xuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCIsIFwiYXJyYXlcIl1cbiAgICAgIH0sXG4gICAgICBcInByb2ZpbGVcIjoge1xuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJlbnZpcm9ubWVudFwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICdkZXZlbG9wbWVudCcgb3IgJ3Byb2R1Y3Rpb24nIHN0cmluZyB2YWx1ZVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJ0cmVlc2hha2VcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImJyb3dzZXJcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcIndhdGNoXCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ3llcycgb3IgJ25vJyBzdHJpbmcgdmFsdWUgKE5PVCB0cnVlIG9yIGZhbHNlKVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJ2ZXJib3NlXCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ3llcycgb3IgJ25vJyBzdHJpbmcgdmFsdWUgKE5PVCB0cnVlIG9yIGZhbHNlKVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJpbmplY3RcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImludGVsbGlzaGFrZVwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiY21kb3B0c1wiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlIGEgc2VuY2hhIGNtZCBvcHRpb24gb3IgYXJndW1lbnQgc3RyaW5nXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIiwgXCJhcnJheVwiXVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJhZGRpdGlvbmFsUHJvcGVydGllc1wiOiBmYWxzZVxuICB9O1xufVxuXG5cbmZ1bmN0aW9uIF9nZXREZWZhdWx0T3B0aW9ucygpIHtcbiAgcmV0dXJuIHtcbiAgICBmcmFtZXdvcms6ICdleHRqcycsXG4gICAgdG9vbGtpdDogJ21vZGVybicsXG4gICAgdGhlbWU6ICd0aGVtZS1tYXRlcmlhbCcsXG4gICAgZW1pdDogJ3llcycsXG4gICAgc2NyaXB0OiBudWxsLFxuICAgIHBvcnQ6IDE5NjIsXG4gICAgcGFja2FnZXM6IFtdLFxuXG4gICAgcHJvZmlsZTogJycsXG4gICAgZW52aXJvbm1lbnQ6ICdkZXZlbG9wbWVudCcsXG4gICAgdHJlZXNoYWtlOiAnbm8nLFxuICAgIGJyb3dzZXI6ICd5ZXMnLFxuICAgIHdhdGNoOiAneWVzJyxcbiAgICB2ZXJib3NlOiAnbm8nLFxuICAgIGluamVjdDogJ3llcycsXG4gICAgaW50ZWxsaXNoYWtlOiAneWVzJyxcbiAgICBjbWRvcHRzOiAnJ1xuICB9XG59XG4iXX0=