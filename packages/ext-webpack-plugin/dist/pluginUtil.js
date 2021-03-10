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
    options = _objectSpread(_objectSpread(_objectSpread({}, _getDefaultOptions()), initialOptions), rc);
    vars = require(`./${framework}Util`)._getDefaultVars();
    vars.pluginName = 'ext-webpack-plugin';
    vars.app = _getApp();
    var pluginName = vars.pluginName;
    var app = vars.app;
    vars.testing = false;
    logv(verbose, 'FUNCTION _constructor');
    logv(verbose, `pluginName - ${pluginName}`);
    logv(verbose, `app - ${app}`);

    if (options.environment == 'production' || options.cmdopts.includes('--production') || options.cmdopts.includes('-pr') || options.cmdopts.includes('--environment=production') || options.cmdopts.includes('-e=production')) {
      vars.production = true;
      options.browser = 'no';
      options.watch = 'no';
      options.buildEnvironment = 'production';
    } else if (options.cmdopts && (options.cmdopts.includes('--testing') || options.cmdopts.includes('-te') || options.cmdopts.includes('--environment=testing') || options.cmdopts.includes('-e=testing'))) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsImluaXRpYWxPcHRpb25zIiwiZnMiLCJyZXF1aXJlIiwidmFycyIsIm9wdGlvbnMiLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwicmVzdWx0IiwidHJlZXNoYWtlIiwidmVyYm9zZSIsInZhbGlkYXRlT3B0aW9ucyIsIl9nZXRWYWxpZGF0ZU9wdGlvbnMiLCJyYyIsImV4aXN0c1N5bmMiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJfZ2V0RGVmYXVsdE9wdGlvbnMiLCJfZ2V0RGVmYXVsdFZhcnMiLCJwbHVnaW5OYW1lIiwiYXBwIiwiX2dldEFwcCIsInRlc3RpbmciLCJsb2d2IiwiZW52aXJvbm1lbnQiLCJjbWRvcHRzIiwiaW5jbHVkZXMiLCJwcm9kdWN0aW9uIiwiYnJvd3NlciIsIndhdGNoIiwiYnVpbGRFbnZpcm9ubWVudCIsImxvZyIsIl9nZXRWZXJzaW9ucyIsImludGVsbGlzaGFrZSIsImJ1aWxkc3RlcCIsIl90b1Byb2QiLCJjb25maWdPYmoiLCJlIiwidG9TdHJpbmciLCJfdGhpc0NvbXBpbGF0aW9uIiwiY29tcGlsZXIiLCJjb21waWxhdGlvbiIsInNjcmlwdCIsInJ1blNjcmlwdCIsImVyciIsIl9jb21waWxhdGlvbiIsImV4dENvbXBvbmVudHMiLCJfZ2V0QWxsQ29tcG9uZW50cyIsImhvb2tzIiwic3VjY2VlZE1vZHVsZSIsInRhcCIsIm1vZHVsZSIsInJlc291cmNlIiwibWF0Y2giLCJfc291cmNlIiwiX3ZhbHVlIiwidG9Mb3dlckNhc2UiLCJkZXBzIiwiX2V4dHJhY3RGcm9tU291cmNlIiwiY29uc29sZSIsImZpbmlzaE1vZHVsZXMiLCJtb2R1bGVzIiwiX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIiLCJpbmplY3QiLCJodG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uIiwiZGF0YSIsInBhdGgiLCJqc1BhdGgiLCJqb2luIiwiZXh0UGF0aCIsImNzc1BhdGgiLCJhc3NldHMiLCJqcyIsInVuc2hpZnQiLCJjc3MiLCJfYWZ0ZXJDb21waWxlIiwiX2VtaXQiLCJjYWxsYmFjayIsImVtaXQiLCJvdXRwdXRQYXRoIiwiZGV2U2VydmVyIiwiY29udGVudEJhc2UiLCJfcHJlcGFyZUZvckJ1aWxkIiwiY29tbWFuZCIsInJlYnVpbGQiLCJwYXJtcyIsIkFycmF5IiwiaXNBcnJheSIsInNwbGl0IiwicHJvZmlsZSIsImZvckVhY2giLCJlbGVtZW50Iiwic3BsaWNlIiwiaW5kZXhPZiIsIndhdGNoU3RhcnRlZCIsIl9idWlsZEV4dEJ1bmRsZSIsIl9kb25lIiwic3RhdHMiLCJlcnJvcnMiLCJsZW5ndGgiLCJjaGFsayIsInJlZCIsIl90b0RldiIsImJyb3dzZXJDb3VudCIsInVybCIsInBvcnQiLCJvcG4iLCJvdXRwdXQiLCJwYWNrYWdlcyIsInRvb2xraXQiLCJ0aGVtZSIsInJpbXJhZiIsIm1rZGlycCIsImZzeCIsImZpcnN0VGltZSIsInN5bmMiLCJidWlsZFhNTCIsImNyZWF0ZUFwcEpzb24iLCJjcmVhdGVXb3Jrc3BhY2VKc29uIiwiY3JlYXRlSlNET01FbnZpcm9ubWVudCIsIndyaXRlRmlsZVN5bmMiLCJwcm9jZXNzIiwiY3dkIiwiZnJvbVBhdGgiLCJ0b1BhdGgiLCJjb3B5U3luYyIsInJlcGxhY2UiLCJmcm9tUmVzb3VyY2VzIiwidG9SZXNvdXJjZXMiLCJmaWx0ZXIiLCJ2YWx1ZSIsImluZGV4IiwibWFuaWZlc3QiLCJidW5kbGVEaXIiLCJ0cmltIiwic2VuY2hhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbkJ1aWxkRG9uZSIsIm9wdHMiLCJzaWxlbnQiLCJzdGRpbyIsImVuY29kaW5nIiwiX2V4ZWN1dGVBc3luYyIsInRoZW4iLCJyZWFzb24iLCJERUZBVUxUX1NVQlNUUlMiLCJzdWJzdHJpbmdzIiwiY3Jvc3NTcGF3biIsInN0cmluZ2lmeSIsImNoaWxkIiwib24iLCJjb2RlIiwic2lnbmFsIiwiRXJyb3IiLCJlcnJvciIsInN0ZG91dCIsInN0ciIsInNvbWUiLCJ2Iiwic3RkZXJyIiwic3RySmF2YU9wdHMiLCJzY3JpcHRQYXRoIiwiY2hpbGRQcm9jZXNzIiwiaW52b2tlZCIsImZvcmsiLCJleGVjQXJndiIsIl90b1h0eXBlIiwicHJlZml4IiwicGxhdGZvcm0iLCJncmVlbiIsImZyYW1ld29ya05hbWUiLCJmcmFtZXdvcmtJbmZvIiwicGx1Z2luVmVyc2lvbiIsImV4dFZlcnNpb24iLCJlZGl0aW9uIiwiY21kVmVyc2lvbiIsIndlYnBhY2tWZXJzaW9uIiwicGx1Z2luUGF0aCIsInBsdWdpblBrZyIsInZlcnNpb24iLCJfcmVzb2x2ZWQiLCJ3ZWJwYWNrUGF0aCIsIndlYnBhY2tQa2ciLCJleHRQa2ciLCJjbWRQYXRoIiwiY21kUGtnIiwidmVyc2lvbl9mdWxsIiwiZnJhbWV3b3JrUGF0aCIsImZyYW1ld29ya1BrZyIsImZyYW1ld29ya1ZlcnNpb24iLCJtZXNzYWdlIiwicyIsImN1cnNvclRvIiwiY2xlYXJMaW5lIiwid3JpdGUiLCJsb2doIiwiaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ08sU0FBU0EsWUFBVCxDQUFzQkMsY0FBdEIsRUFBc0M7QUFDM0MsUUFBTUMsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxNQUFJQyxJQUFJLEdBQUcsRUFBWDtBQUNBLE1BQUlDLE9BQU8sR0FBRyxFQUFkOztBQUNBLE1BQUk7QUFDRixRQUFJSixjQUFjLENBQUNLLFNBQWYsSUFBNEJDLFNBQWhDLEVBQTJDO0FBQ3pDSCxNQUFBQSxJQUFJLENBQUNJLFlBQUwsR0FBb0IsRUFBcEI7QUFDQUosTUFBQUEsSUFBSSxDQUFDSSxZQUFMLENBQWtCQyxJQUFsQixDQUF1QiwwSEFBdkI7QUFDQSxVQUFJQyxNQUFNLEdBQUc7QUFBRU4sUUFBQUEsSUFBSSxFQUFFQTtBQUFSLE9BQWI7QUFDQSxhQUFPTSxN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YUxDLElBQUFBLEtBQUssRUFBRSxLQWJGO0FBY0xwQixJQUFBQSxPQUFPLEVBQUUsSUFkSjtBQWVMc0QsSUFBQUEsTUFBTSxFQUFFLEtBZkg7QUFnQkw5QixJQUFBQSxZQUFZLEVBQUUsS0FoQlQ7QUFpQkxSLElBQUFBLE9BQU8sRUFBRTtBQWpCSixHQUFQO0FBbUJEIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8vKioqKioqKioqKlxyXG5leHBvcnQgZnVuY3Rpb24gX2NvbnN0cnVjdG9yKGluaXRpYWxPcHRpb25zKSB7XHJcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXHJcbiAgdmFyIHZhcnMgPSB7fVxyXG4gIHZhciBvcHRpb25zID0ge31cclxuICB0cnkge1xyXG4gICAgaWYgKGluaXRpYWxPcHRpb25zLmZyYW1ld29yayA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdmFycy5wbHVnaW5FcnJvcnMgPSBbXVxyXG4gICAgICB2YXJzLnBsdWdpbkVycm9ycy5wdXNoKCd3ZWJwYWNrIGNvbmZpZzogZnJhbWV3b3JrIHBhcmFtZXRlciBvbiBleHQtd2VicGFjay1wbHVnaW4gaXMgbm90IGRlZmluZWQgLSB2YWx1ZXM6IHJlYWN0LCBhbmd1bGFyLCBleHRqcywgd2ViLWNvbXBvbmVudHMnKVxyXG4gICAgICB2YXIgcmVzdWx0ID0geyB2YXJzOiB2YXJzIH07XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICB2YXIgZnJhbWV3b3JrID0gaW5pdGlhbE9wdGlvbnMuZnJhbWV3b3JrXHJcbiAgICB2YXIgdHJlZXNoYWtlID0gaW5pdGlhbE9wdGlvbnMudHJlZXNoYWtlXHJcbiAgICB2YXIgdmVyYm9zZSA9IGluaXRpYWxPcHRpb25zLnZlcmJvc2VcclxuXHJcbiAgICBjb25zdCB2YWxpZGF0ZU9wdGlvbnMgPSByZXF1aXJlKCdzY2hlbWEtdXRpbHMnKVxyXG4gICAgdmFsaWRhdGVPcHRpb25zKF9nZXRWYWxpZGF0ZU9wdGlvbnMoKSwgaW5pdGlhbE9wdGlvbnMsICcnKVxyXG5cclxuICAgIGNvbnN0IHJjID0gKGZzLmV4aXN0c1N5bmMoYC5leHQtJHtmcmFtZXdvcmt9cmNgKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhgLmV4dC0ke2ZyYW1ld29ya31yY2AsICd1dGYtOCcpKSB8fCB7fSlcclxuICAgIG9wdGlvbnMgPSB7IC4uLl9nZXREZWZhdWx0T3B0aW9ucygpLCAuLi5pbml0aWFsT3B0aW9ucywgLi4ucmMgfVxyXG5cclxuICAgIHZhcnMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0RGVmYXVsdFZhcnMoKVxyXG4gICAgdmFycy5wbHVnaW5OYW1lID0gJ2V4dC13ZWJwYWNrLXBsdWdpbidcclxuICAgIHZhcnMuYXBwID0gX2dldEFwcCgpXHJcbiAgICB2YXIgcGx1Z2luTmFtZSA9IHZhcnMucGx1Z2luTmFtZVxyXG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXHJcbiAgICB2YXJzLnRlc3RpbmcgPSBmYWxzZVxyXG5cclxuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9jb25zdHJ1Y3RvcicpXHJcbiAgICBsb2d2KHZlcmJvc2UsIGBwbHVnaW5OYW1lIC0gJHtwbHVnaW5OYW1lfWApXHJcbiAgICBsb2d2KHZlcmJvc2UsIGBhcHAgLSAke2FwcH1gKVxyXG5cclxuICAgIGlmIChvcHRpb25zLmVudmlyb25tZW50ID09ICdwcm9kdWN0aW9uJyB8fFxyXG4gICAgICAgIG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLS1wcm9kdWN0aW9uJykgfHxcclxuICAgICAgICBvcHRpb25zLmNtZG9wdHMuaW5jbHVkZXMoJy1wcicpIHx8XHJcbiAgICAgICAgb3B0aW9ucy5jbWRvcHRzLmluY2x1ZGVzKCctLWVudmlyb25tZW50PXByb2R1Y3Rpb24nKSB8fFxyXG4gICAgICAgIG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLWU9cHJvZHVjdGlvbicpXHJcbiAgICAgICkge1xyXG4gICAgICB2YXJzLnByb2R1Y3Rpb24gPSB0cnVlO1xyXG4gICAgICBvcHRpb25zLmJyb3dzZXIgPSAnbm8nO1xyXG4gICAgICBvcHRpb25zLndhdGNoID0gJ25vJztcclxuICAgICAgb3B0aW9ucy5idWlsZEVudmlyb25tZW50ID0gJ3Byb2R1Y3Rpb24nO1xyXG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmNtZG9wdHMgJiYgKG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLS10ZXN0aW5nJykgfHxcclxuICAgICAgICAgICAgICAgb3B0aW9ucy5jbWRvcHRzLmluY2x1ZGVzKCctdGUnKSB8fFxyXG4gICAgICAgICAgICAgICBvcHRpb25zLmNtZG9wdHMuaW5jbHVkZXMoJy0tZW52aXJvbm1lbnQ9dGVzdGluZycpIHx8XHJcbiAgICAgICAgICAgICAgIG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLWU9dGVzdGluZycpKVxyXG4gICAgKSB7XHJcbiAgICAgIHZhcnMucHJvZHVjdGlvbiA9IGZhbHNlO1xyXG4gICAgICB2YXJzLnRlc3RpbmcgPSB0cnVlO1xyXG4gICAgICBvcHRpb25zLmJyb3dzZXIgPSAnbm8nO1xyXG4gICAgICBvcHRpb25zLndhdGNoID0gJ25vJztcclxuICAgICAgb3B0aW9ucy5idWlsZEVudmlyb25tZW50ID0gJ3Rlc3RpbmcnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3B0aW9ucy5idWlsZEVudmlyb25tZW50ID0gJ2RldmVsb3BtZW50JztcclxuICAgICAgdmFycy5wcm9kdWN0aW9uID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nKGFwcCwgX2dldFZlcnNpb25zKHBsdWdpbk5hbWUsIGZyYW1ld29yaykpXHJcblxyXG4gICAgLy9tamcgYWRkZWQgZm9yIGFuZ3VsYXIgY2xpIGJ1aWxkXHJcbiAgICBpZiAoZnJhbWV3b3JrID09ICdhbmd1bGFyJyAmJlxyXG4gICAgICAgIG9wdGlvbnMuaW50ZWxsaXNoYWtlID09ICdubycgJiZcclxuICAgICAgICB2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZVxyXG4gICAgICAgICYmIHRyZWVzaGFrZSA9PSAneWVzJykge1xyXG4gICAgICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnO1xyXG4gICAgICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJyArIGZyYW1ld29yayk7XHJcbiAgICB9XHJcblxyXG4gICAgZWxzZSBpZiAoZnJhbWV3b3JrID09ICdyZWFjdCcgfHwgZnJhbWV3b3JrID09ICdleHRqcycgfHwgZnJhbWV3b3JrID09ICd3ZWItY29tcG9uZW50cycpIHtcclxuICAgICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlKSB7XHJcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJ1xyXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYodmFycy50ZXN0aW5nID09IHRydWUpe1xyXG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcclxuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgdGVzdGluZyBidWlsZCBmb3IgJyArIGZyYW1ld29yaylcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXHJcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIGRldmVsb3BtZW50IGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xyXG4gICAgICBpZiAodHJlZXNoYWtlID09ICd5ZXMnKSB7XHJcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAyJ1xyXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrICsgJyAtICcgKyB2YXJzLmJ1aWxkc3RlcClcclxuICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fdG9Qcm9kKHZhcnMsIG9wdGlvbnMpXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMiBvZiAyJ1xyXG4gICAgICAgIGxvZyhhcHAsICdDb250aW51aW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICcgKyBmcmFtZXdvcmsgKyAnIC0gJyArIHZhcnMuYnVpbGRzdGVwKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJ1xyXG4gICAgICBsb2coYXBwLCAnU3RhcnRpbmcgZGV2ZWxvcG1lbnQgYnVpbGQgZm9yICcgKyBmcmFtZXdvcmspXHJcbiAgICB9XHJcbiAgICBsb2d2KHZlcmJvc2UsICdCdWlsZGluZyBmb3IgJyArIG9wdGlvbnMuYnVpbGRFbnZpcm9ubWVudCArICcsICcgKyAndHJlZXNoYWtlIGlzICcgKyBvcHRpb25zLnRyZWVzaGFrZSsgJywgJyArICdpbnRlbGxpc2hha2UgaXMgJyArIG9wdGlvbnMuaW50ZWxsaXNoYWtlKVxyXG5cclxuICAgIHZhciBjb25maWdPYmogPSB7IHZhcnM6IHZhcnMsIG9wdGlvbnM6IG9wdGlvbnMgfTtcclxuICAgIHJldHVybiBjb25maWdPYmo7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICB0aHJvdyAnX2NvbnN0cnVjdG9yOiAnICsgZS50b1N0cmluZygpXHJcbiAgfVxyXG59XHJcblxyXG4vLyoqKioqKioqKipcclxuZXhwb3J0IGZ1bmN0aW9uIF90aGlzQ29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxyXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcclxuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF90aGlzQ29tcGlsYXRpb24nKVxyXG4gICAgbG9ndih2ZXJib3NlLCBgb3B0aW9ucy5zY3JpcHQ6ICR7b3B0aW9ucy5zY3JpcHQgfWApXHJcbiAgICBsb2d2KHZlcmJvc2UsIGBidWlsZHN0ZXA6ICR7dmFycy5idWlsZHN0ZXB9YClcclxuXHJcbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09PSAnMSBvZiAyJykge1xyXG4gICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuc2NyaXB0ICE9IG51bGwgJiYgb3B0aW9ucy5zY3JpcHQgIT0gJycpIHtcclxuICAgICAgICBsb2coYXBwLCBgU3RhcnRlZCBydW5uaW5nICR7b3B0aW9ucy5zY3JpcHR9YClcclxuICAgICAgICBydW5TY3JpcHQob3B0aW9ucy5zY3JpcHQsIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbG9nKGFwcCwgYEZpbmlzaGVkIHJ1bm5pbmcgJHtvcHRpb25zLnNjcmlwdH1gKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGNhdGNoKGUpIHtcclxuICAgIHRocm93ICdfdGhpc0NvbXBpbGF0aW9uOiAnICsgZS50b1N0cmluZygpXHJcbiAgfVxyXG59XHJcblxyXG4vLyoqKioqKioqKipcclxuZXhwb3J0IGZ1bmN0aW9uIF9jb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXHJcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxyXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXHJcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfY29tcGlsYXRpb24nKVxyXG5cclxuICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xyXG4gICAgICBpZiAob3B0aW9ucy50cmVlc2hha2UgPT09ICd5ZXMnICYmIG9wdGlvbnMuYnVpbGRFbnZpcm9ubWVudCA9PT0gJ3Byb2R1Y3Rpb24nKSB7XHJcbiAgICAgICAgdmFyIGV4dENvbXBvbmVudHMgPSBbXTtcclxuXHJcbiAgICAgICAgLy9tamcgZm9yIDEgc3RlcCBidWlsZFxyXG4gICAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyAmJiBmcmFtZXdvcmsgPT09ICdhbmd1bGFyJyAmJiBvcHRpb25zLmludGVsbGlzaGFrZSA9PSAnbm8nKSB7XHJcbiAgICAgICAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0QWxsQ29tcG9uZW50cyh2YXJzLCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJyB8fCAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScgJiYgZnJhbWV3b3JrID09PSAnd2ViLWNvbXBvbmVudHMnKSkge1xyXG4gICAgICAgICAgZXh0Q29tcG9uZW50cyA9IHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9nZXRBbGxDb21wb25lbnRzKHZhcnMsIG9wdGlvbnMpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLnN1Y2NlZWRNb2R1bGUudGFwKGBleHQtc3VjY2VlZC1tb2R1bGVgLCBtb2R1bGUgPT4ge1xyXG4gICAgICAgICAgaWYgKG1vZHVsZS5yZXNvdXJjZSAmJiAhbW9kdWxlLnJlc291cmNlLm1hdGNoKC9ub2RlX21vZHVsZXMvKSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvXFwuaHRtbCQvKSAhPSBudWxsXHJcbiAgICAgICAgICAgICAgICAmJiBtb2R1bGUuX3NvdXJjZS5fdmFsdWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnZG9jdHlwZSBodG1sJykgPT0gZmFsc2VcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uKHZhcnMuZGVwcyB8fCBbXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMicpIHtcclxuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5maW5pc2hNb2R1bGVzLnRhcChgZXh0LWZpbmlzaC1tb2R1bGVzYCwgbW9kdWxlcyA9PiB7XHJcbiAgICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fd3JpdGVGaWxlc1RvUHJvZEZvbGRlcih2YXJzLCBvcHRpb25zKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09ICcyIG9mIDInKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuaW5qZWN0ID09PSAneWVzJykge1xyXG4gICAgICAgICAgaWYoY29tcGlsYXRpb24uaG9va3MuaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbiAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29tcGlsYXRpb24uaG9va3MuaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbi50YXAoYGV4dC1odG1sLWdlbmVyYXRpb25gLChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxyXG4gICAgICAgICAgICAgIHZhciBqc1BhdGggPSBwYXRoLmpvaW4odmFycy5leHRQYXRoLCAnZXh0LmpzJylcclxuICAgICAgICAgICAgICB2YXIgY3NzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuY3NzJylcclxuICAgICAgICAgICAgICAvL3ZhciBqc1BhdGggPSB2YXJzLmV4dFBhdGggKyAnLycgKyAgJ2V4dC5qcyc7XHJcbiAgICAgICAgICAgICAgLy92YXIgY3NzUGF0aCA9IHZhcnMuZXh0UGF0aCArICcvJyArICdleHQuY3NzJztcclxuICAgICAgICAgICAgICBkYXRhLmFzc2V0cy5qcy51bnNoaWZ0KGpzUGF0aClcclxuICAgICAgICAgICAgICBkYXRhLmFzc2V0cy5jc3MudW5zaGlmdChjc3NQYXRoKVxyXG4gICAgICAgICAgICAgIGxvZyhhcHAsIGBBZGRpbmcgJHtqc1BhdGh9IGFuZCAke2Nzc1BhdGh9IHRvIGluZGV4Lmh0bWxgKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBjYXRjaChlKSB7XHJcbiAgICB0aHJvdyAnX2NvbXBpbGF0aW9uOiAnICsgZS50b1N0cmluZygpXHJcbi8vICAgIGxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXHJcbi8vICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfY29tcGlsYXRpb246ICcgKyBlKVxyXG4gIH1cclxufVxyXG5cclxuLy8qKioqKioqKioqXHJcbmV4cG9ydCBmdW5jdGlvbiBfYWZ0ZXJDb21waWxlKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcclxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXHJcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcclxuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9hZnRlckNvbXBpbGUnKVxyXG4gICAgaWYgKGZyYW1ld29yayA9PSAnZXh0anMnKSB7XHJcbiAgICAgIHJlcXVpcmUoYC4vZXh0anNVdGlsYCkuX2FmdGVyQ29tcGlsZShjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucylcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfYWZ0ZXJDb21waWxlIG5vdCBydW4nKVxyXG4gICAgfVxyXG4gIH1cclxuICBjYXRjaChlKSB7XHJcbiAgICB0aHJvdyAnX2FmdGVyQ29tcGlsZTogJyArIGUudG9TdHJpbmcoKVxyXG4gIH1cclxufVxyXG5cclxuLy8qKioqKioqKioqXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZW1pdChjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcclxuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxyXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcclxuICAgIHZhciBlbWl0ID0gb3B0aW9ucy5lbWl0XHJcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcclxuICAgIHZhcnMuY2FsbGJhY2sgPSBjYWxsYmFja1xyXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfZW1pdCcpXHJcbiAgICBpZiAoZW1pdCA9PSAneWVzJykge1xyXG4gICAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScgfHwgdmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMicpIHtcclxuICAgICAgICBsZXQgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vdXRwdXRQYXRoLHZhcnMuZXh0UGF0aClcclxuICAgICAgICBpZiAoY29tcGlsZXIub3V0cHV0UGF0aCA9PT0gJy8nICYmIGNvbXBpbGVyLm9wdGlvbnMuZGV2U2VydmVyKSB7XHJcbiAgICAgICAgICBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGNvbXBpbGVyLm9wdGlvbnMuZGV2U2VydmVyLmNvbnRlbnRCYXNlLCBvdXRwdXRQYXRoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBsb2d2KHZlcmJvc2UsJ291dHB1dFBhdGg6ICcgKyBvdXRwdXRQYXRoKVxyXG4gICAgICAgIGxvZ3YodmVyYm9zZSwnZnJhbWV3b3JrOiAnICsgZnJhbWV3b3JrKVxyXG4gICAgICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xyXG4gICAgICAgICAgX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dFBhdGgsIGNvbXBpbGF0aW9uKVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29tbWFuZCA9ICcnXHJcbiAgICAgICAgaWYgKG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKVxyXG4gICAgICAgICAge2NvbW1hbmQgPSAnd2F0Y2gnfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHtjb21tYW5kID0gJ2J1aWxkJ31cclxuICAgICAgICBpZiAodmFycy5yZWJ1aWxkID09IHRydWUpIHtcclxuICAgICAgICAgIHZhciBwYXJtcyA9IFtdXHJcbiAgICAgICAgICBpZighQXJyYXkuaXNBcnJheShvcHRpb25zLmNtZG9wdHMpKXtcclxuICAgICAgICAgICAgb3B0aW9ucy5jbWRvcHRzID0gb3B0aW9ucy5jbWRvcHRzLnNwbGl0KCcgJylcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChvcHRpb25zLnByb2ZpbGUgPT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMucHJvZmlsZSA9PSAnJyB8fCBvcHRpb25zLnByb2ZpbGUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoY29tbWFuZCA9PSAnYnVpbGQnKVxyXG4gICAgICAgICAgICAgIHsgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMuYnVpbGRFbnZpcm9ubWVudF0gfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgeyBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMuYnVpbGRFbnZpcm9ubWVudF0gfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpXHJcbiAgICAgICAgICAgICAge3Bhcm1zID0gWydhcHAnLCBjb21tYW5kLCBvcHRpb25zLnByb2ZpbGUsIG9wdGlvbnMuYnVpbGRFbnZpcm9ubWVudF19XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICB7cGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLnByb2ZpbGUsIG9wdGlvbnMuYnVpbGRFbnZpcm9ubWVudF19XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvcHRpb25zLmNtZG9wdHMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KXtcclxuICAgICAgICAgICAgICBwYXJtcy5zcGxpY2UocGFybXMuaW5kZXhPZihjb21tYW5kKSsxLCAwLCBlbGVtZW50KTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAvLyBpZiAodmFycy53YXRjaFN0YXJ0ZWQgPT0gZmFsc2UpIHtcclxuICAgICAgICAgIC8vICAgYXdhaXQgX2J1aWxkRXh0QnVuZGxlKGFwcCwgY29tcGlsYXRpb24sIG91dHB1dFBhdGgsIHBhcm1zLCB2YXJzLCBvcHRpb25zKVxyXG4gICAgICAgICAgLy8gICB2YXJzLndhdGNoU3RhcnRlZCA9IHRydWVcclxuICAgICAgICAgIC8vIH1cclxuICAgICAgICAgIGlmICh2YXJzLndhdGNoU3RhcnRlZCA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBhd2FpdCBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIHZhcnMsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICd3YXRjaCcpIHtcclxuICAgICAgICAgICAgICB2YXJzLndhdGNoU3RhcnRlZCA9IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICB2YXJzLmNhbGxiYWNrKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy9tamdcclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXJzLmNhbGxiYWNrKClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vbWpnXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgdmFycy5jYWxsYmFjaygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGxvZ3YodmVyYm9zZSwnTk9UIHJ1bm5pbmcgZW1pdCcpXHJcbiAgICAgICAgdmFycy5jYWxsYmFjaygpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBsb2d2KHZlcmJvc2UsJ2VtaXQgaXMgbm8nKVxyXG4gICAgICB2YXJzLmNhbGxiYWNrKClcclxuICAgIH1cclxuICB9XHJcbiAgY2F0Y2goZSkge1xyXG4gICAgdmFycy5jYWxsYmFjaygpXHJcbiAgICB0aHJvdyAnX2VtaXQ6ICcgKyBlLnRvU3RyaW5nKClcclxuICB9XHJcbn1cclxuXHJcbi8vKioqKioqKioqKlxyXG5leHBvcnQgZnVuY3Rpb24gX2RvbmUoc3RhdHMsIHZhcnMsIG9wdGlvbnMpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcclxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xyXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfZG9uZScpXHJcbiAgICBpZiAoc3RhdHMuY29tcGlsYXRpb24uZXJyb3JzICYmIHN0YXRzLmNvbXBpbGF0aW9uLmVycm9ycy5sZW5ndGgpIC8vICYmIHByb2Nlc3MuYXJndi5pbmRleE9mKCctLXdhdGNoJykgPT0gLTEpXHJcbiAgICB7XHJcbiAgICAgIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZCgnKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqJykpO1xyXG4gICAgICBjb25zb2xlLmxvZyhzdGF0cy5jb21waWxhdGlvbi5lcnJvcnNbMF0pO1xyXG4gICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQoJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKicpKTtcclxuICAgICAgLy9wcm9jZXNzLmV4aXQoMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9tamcgcmVmYWN0b3JcclxuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSAnbm8nICYmIGZyYW1ld29yayA9PSAnYW5ndWxhcicpIHtcclxuICAgICAgcmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5fdG9EZXYodmFycywgb3B0aW9ucylcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgIGlmKG9wdGlvbnMuYnJvd3NlciA9PSAneWVzJyAmJiBvcHRpb25zLndhdGNoID09ICd5ZXMnICYmIHZhcnMucHJvZHVjdGlvbiA9PSBmYWxzZSkge1xyXG4gICAgICAgIGlmICh2YXJzLmJyb3dzZXJDb3VudCA9PSAwKSB7XHJcbiAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6JyArIG9wdGlvbnMucG9ydFxyXG4gICAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgT3BlbmluZyBicm93c2VyIGF0ICR7dXJsfWApXHJcbiAgICAgICAgICB2YXJzLmJyb3dzZXJDb3VudCsrXHJcbiAgICAgICAgICBjb25zdCBvcG4gPSByZXF1aXJlKCdvcG4nKVxyXG4gICAgICAgICAgb3BuKHVybClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICB9XHJcbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScpIHtcclxuICAgICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlKSB7XHJcbiAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICR7ZnJhbWV3b3JrfWApXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAodmFycy50ZXN0aW5nID09IHRydWUpIHtcclxuICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgdGVzdGluZyBidWlsZCBmb3IgJHtmcmFtZXdvcmt9YClcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgZGV2ZWxvcG1lbnQgYnVpbGQgZm9yICR7ZnJhbWV3b3JrfWApXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMiBvZiAyJykge1xyXG4gICAgICBpZih2YXJzLnRlc3RpbmcgPT0gdHJ1ZSl7XHJcbiAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIHRlc3RpbmcgYnVpbGQgZm9yICR7ZnJhbWV3b3JrfWApXHJcbiAgICAgIH1cclxuICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICR7ZnJhbWV3b3JrfWApXHJcbiAgICB9XHJcbiAgfVxyXG4gIGNhdGNoKGUpIHtcclxuLy8gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLnZlcmJvc2UsZSlcclxuICAgIHRocm93ICdfZG9uZTogJyArIGUudG9TdHJpbmcoKVxyXG4gIH1cclxufVxyXG5cclxuLy8qKioqKioqKioqXHJcbmV4cG9ydCBmdW5jdGlvbiBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0LCBjb21waWxhdGlvbikge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxyXG4gICAgdmFyIHBhY2thZ2VzID0gb3B0aW9ucy5wYWNrYWdlc1xyXG4gICAgdmFyIHRvb2xraXQgPSBvcHRpb25zLnRvb2xraXRcclxuICAgIHZhciB0aGVtZSA9IG9wdGlvbnMudGhlbWVcclxuICAgIGxvZ3YodmVyYm9zZSwnRlVOQ1RJT04gX3ByZXBhcmVGb3JCdWlsZCcpXHJcbiAgICBjb25zdCByaW1yYWYgPSByZXF1aXJlKCdyaW1yYWYnKVxyXG4gICAgY29uc3QgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJylcclxuICAgIGNvbnN0IGZzeCA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcclxuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxyXG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxyXG4gICAgdGhlbWUgPSB0aGVtZSB8fCAodG9vbGtpdCA9PT0gJ2NsYXNzaWMnID8gJ3RoZW1lLXRyaXRvbicgOiAndGhlbWUtbWF0ZXJpYWwnKVxyXG4gICAgbG9ndih2ZXJib3NlLCdmaXJzdFRpbWU6ICcgKyB2YXJzLmZpcnN0VGltZSlcclxuICAgIGlmICh2YXJzLmZpcnN0VGltZSkge1xyXG4gICAgICByaW1yYWYuc3luYyhvdXRwdXQpXHJcbiAgICAgIG1rZGlycC5zeW5jKG91dHB1dClcclxuICAgICAgY29uc3QgYnVpbGRYTUwgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmJ1aWxkWE1MXHJcbiAgICAgIGNvbnN0IGNyZWF0ZUFwcEpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUFwcEpzb25cclxuICAgICAgY29uc3QgY3JlYXRlV29ya3NwYWNlSnNvbiA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuY3JlYXRlV29ya3NwYWNlSnNvblxyXG4gICAgICBjb25zdCBjcmVhdGVKU0RPTUVudmlyb25tZW50ID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVKU0RPTUVudmlyb25tZW50XHJcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2J1aWxkLnhtbCcpLCBidWlsZFhNTCh2YXJzLnByb2R1Y3Rpb24sIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcclxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnYXBwLmpzb24nKSwgY3JlYXRlQXBwSnNvbih0aGVtZSwgcGFja2FnZXMsIHRvb2xraXQsIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcclxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnanNkb20tZW52aXJvbm1lbnQuanMnKSwgY3JlYXRlSlNET01FbnZpcm9ubWVudChvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXHJcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ3dvcmtzcGFjZS5qc29uJyksIGNyZWF0ZVdvcmtzcGFjZUpzb24ob3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxyXG4gICAgICB2YXIgZnJhbWV3b3JrID0gdmFycy5mcmFtZXdvcms7XHJcbiAgICAgIC8vYmVjYXVzZSBvZiBhIHByb2JsZW0gd2l0aCBjb2xvcnBpY2tlclxyXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKSkpIHtcclxuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vdXgvYClcclxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3V4JylcclxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcclxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAodXgpICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vcGFja2FnZXMvYCkpKSB7XHJcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApXHJcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdwYWNrYWdlcycpXHJcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXHJcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcclxuICAgICAgfVxyXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYCkpKSB7XHJcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L292ZXJyaWRlcy9gKVxyXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAnb3ZlcnJpZGVzJylcclxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcclxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCdyZXNvdXJjZXMvJykpKSB7XHJcbiAgICAgICAgdmFyIGZyb21SZXNvdXJjZXMgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3Jlc291cmNlcy8nKVxyXG4gICAgICAgIHZhciB0b1Jlc291cmNlcyA9IHBhdGguam9pbihvdXRwdXQsICcuLi9yZXNvdXJjZXMnKVxyXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUmVzb3VyY2VzLCB0b1Jlc291cmNlcylcclxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAnICsgZnJvbVJlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1Jlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFycy5maXJzdFRpbWUgPSBmYWxzZVxyXG4gICAgdmFyIGpzID0gJydcclxuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24pIHtcclxuICAgICAgdmFycy5kZXBzID0gdmFycy5kZXBzLmZpbHRlcihmdW5jdGlvbih2YWx1ZSwgaW5kZXgpeyByZXR1cm4gdmFycy5kZXBzLmluZGV4T2YodmFsdWUpID09IGluZGV4IH0pO1xyXG4gICAgICBqcyA9IHZhcnMuZGVwcy5qb2luKCc7XFxuJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAganMgPSBgRXh0LnJlcXVpcmUoW1wiRXh0LipcIixcIkV4dC5kYXRhLlRyZWVTdG9yZVwiXSlgXHJcbiAgICB9XHJcbiAgICBqcyA9IGBFeHQucmVxdWlyZShbXCJFeHQuKlwiLFwiRXh0LmRhdGEuVHJlZVN0b3JlXCJdKWA7IC8vZm9yIG5vd1xyXG4gICAgaWYgKHZhcnMubWFuaWZlc3QgPT09IG51bGwgfHwganMgIT09IHZhcnMubWFuaWZlc3QpIHtcclxuICAgICAgdmFycy5tYW5pZmVzdCA9IGpzICsgJztcXG5FeHQucmVxdWlyZShbXCJFeHQubGF5b3V0LipcIl0pO1xcbic7XHJcbiAgICAgIGNvbnN0IG1hbmlmZXN0ID0gcGF0aC5qb2luKG91dHB1dCwgJ21hbmlmZXN0LmpzJylcclxuICAgICAgZnMud3JpdGVGaWxlU3luYyhtYW5pZmVzdCwgdmFycy5tYW5pZmVzdCwgJ3V0ZjgnKVxyXG4gICAgICB2YXJzLnJlYnVpbGQgPSB0cnVlXHJcbiAgICAgIHZhciBidW5kbGVEaXIgPSBvdXRwdXQucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJylcclxuICAgICAgaWYgKGJ1bmRsZURpci50cmltKCkgPT0gJycpIHtidW5kbGVEaXIgPSAnLi8nfVxyXG4gICAgICBsb2coYXBwLCAnQnVpbGRpbmcgRXh0IGJ1bmRsZSBhdDogJyArIGJ1bmRsZURpcilcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YXJzLnJlYnVpbGQgPSBmYWxzZVxyXG4gICAgICBsb2coYXBwLCAnRXh0IHJlYnVpbGQgTk9UIG5lZWRlZCcpXHJcbiAgICB9XHJcbiAgfVxyXG4gIGNhdGNoKGUpIHtcclxuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXHJcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX3ByZXBhcmVGb3JCdWlsZDogJyArIGUpXHJcbiAgfVxyXG59XHJcblxyXG4vLyoqKioqKioqKipcclxuZXhwb3J0IGZ1bmN0aW9uIF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgdmFycywgb3B0aW9ucykge1xyXG4gIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXHJcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXHJcbiAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfYnVpbGRFeHRCdW5kbGUnKVxyXG4gIGxldCBzZW5jaGE7IHRyeSB7IHNlbmNoYSA9IHJlcXVpcmUoJ0BzZW5jaGEvY21kJykgfSBjYXRjaCAoZSkgeyBzZW5jaGEgPSAnc2VuY2hhJyB9XHJcbiAgaWYgKGZzLmV4aXN0c1N5bmMoc2VuY2hhKSkge1xyXG4gICAgbG9ndih2ZXJib3NlLCdzZW5jaGEgZm9sZGVyIGV4aXN0cycpXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbG9ndih2ZXJib3NlLCdzZW5jaGEgZm9sZGVyIERPRVMgTk9UIGV4aXN0JylcclxuICB9XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGNvbnN0IG9uQnVpbGREb25lID0gKCkgPT4ge1xyXG4gICAgICBsb2d2KHZlcmJvc2UsJ29uQnVpbGREb25lJylcclxuICAgICAgcmVzb2x2ZSgpXHJcbiAgICB9XHJcbiAgICB2YXIgb3B0cyA9IHsgY3dkOiBvdXRwdXRQYXRoLCBzaWxlbnQ6IHRydWUsIHN0ZGlvOiAncGlwZScsIGVuY29kaW5nOiAndXRmLTgnfVxyXG4gICAgX2V4ZWN1dGVBc3luYyhhcHAsIHNlbmNoYSwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKS50aGVuIChcclxuICAgICAgZnVuY3Rpb24oKSB7IG9uQnVpbGREb25lKCkgfSxcclxuICAgICAgZnVuY3Rpb24ocmVhc29uKSB7IHJlamVjdChyZWFzb24pIH1cclxuICAgIClcclxuICB9KVxyXG59XHJcblxyXG4vLyoqKioqKioqKipcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIF9leGVjdXRlQXN5bmMgKGFwcCwgY29tbWFuZCwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XHJcbiAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcclxuICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcclxuICAvL2NvbnN0IERFRkFVTFRfU1VCU1RSUyA9IFsnW0lORl0gTG9hZGluZycsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFNlcnZlclwiLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcclxuICBjb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbXCJbSU5GXSB4U2VydmVyXCIsICdbSU5GXSBMb2FkaW5nJywgJ1tJTkZdIEFwcGVuZCcsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tJTkZdIFByb2Nlc3NpbmcgQnVpbGQnLCAnW0xPR10gRmFzaGlvbiBidWlsZCBjb21wbGV0ZScsICdbRVJSXScsICdbV1JOXScsIFwiW0lORl0gV3JpdGluZ1wiLCBcIltJTkZdIExvYWRpbmcgQnVpbGRcIiwgXCJbSU5GXSBXYWl0aW5nXCIsIFwiW0xPR10gRmFzaGlvbiB3YWl0aW5nXCJdO1xyXG4gIHZhciBzdWJzdHJpbmdzID0gREVGQVVMVF9TVUJTVFJTXHJcbiAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKVxyXG4gIGNvbnN0IGNyb3NzU3Bhd24gPSByZXF1aXJlKCdjcm9zcy1zcGF3bi13aXRoLWtpbGwnKVxyXG4gIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9leGVjdXRlQXN5bmMnKVxyXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGxvZ3YodmVyYm9zZSxgY29tbWFuZCAtICR7Y29tbWFuZH1gKVxyXG4gICAgbG9ndih2ZXJib3NlLCBgcGFybXMgLSAke3Bhcm1zfWApXHJcbiAgICBsb2d2KHZlcmJvc2UsIGBvcHRzIC0gJHtKU09OLnN0cmluZ2lmeShvcHRzKX1gKVxyXG4gICAgdmFycy5jaGlsZCA9IGNyb3NzU3Bhd24oY29tbWFuZCwgcGFybXMsIG9wdHMpXHJcblxyXG4gICAgdmFycy5jaGlsZC5vbignY2xvc2UnLCAoY29kZSwgc2lnbmFsKSA9PiB7XHJcbiAgICAgIGxvZ3YodmVyYm9zZSwgYG9uIGNsb3NlOiBgICsgY29kZSlcclxuICAgICAgaWYoY29kZSA9PT0gMCkgeyByZXNvbHZlKDApIH1cclxuICAgICAgZWxzZSB7IGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCBuZXcgRXJyb3IoY29kZSkgKTsgcmVzb2x2ZSgwKSB9XHJcbiAgICB9KVxyXG4gICAgdmFycy5jaGlsZC5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcclxuICAgICAgbG9ndih2ZXJib3NlLCBgb24gZXJyb3JgKVxyXG4gICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChlcnJvcilcclxuICAgICAgcmVzb2x2ZSgwKVxyXG4gICAgfSlcclxuICAgIHZhcnMuY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGEpID0+IHtcclxuICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXHJcbiAgICAgIGxvZ3YodmVyYm9zZSwgYCR7c3RyfWApXHJcbiAgICAgIC8vaWYgKGRhdGEgJiYgZGF0YS50b1N0cmluZygpLm1hdGNoKC9GYXNoaW9uIHdhaXRpbmcgZm9yIGNoYW5nZXNcXC5cXC5cXC4vKSkge1xyXG4gICAgICBpZiAoZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkubWF0Y2goL2FpdGluZyBmb3IgY2hhbmdlc1xcLlxcLlxcLi8pKSB7XHJcblxyXG4vLyAgICAgICAgICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xyXG4vLyAgICAgICAgICAgdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSArIHZhcnMudG91Y2hGaWxlO1xyXG4vLyAgICAgICAgICAgdHJ5IHtcclxuLy8gICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKClcclxuLy8gICAgICAgICAgICAgdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xyXG4vLyAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVuYW1lLCAnLy8nICsgZCwgJ3V0ZjgnKTtcclxuLy8gICAgICAgICAgICAgbG9ndihhcHAsIGB0b3VjaGluZyAke2ZpbGVuYW1lfWApO1xyXG4vLyAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgY2F0Y2goZSkge1xyXG4vLyAgICAgICAgICAgICBsb2d2KGFwcCwgYE5PVCB0b3VjaGluZyAke2ZpbGVuYW1lfWApO1xyXG4vLyAgICAgICAgICAgfVxyXG5cclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltJTkZdXCIsIFwiXCIpXHJcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbTE9HXVwiLCBcIlwiKVxyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKS50cmltKClcclxuICAgICAgICBpZiAoc3RyLmluY2x1ZGVzKFwiW0VSUl1cIikpIHtcclxuICAgICAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGFwcCArIHN0ci5yZXBsYWNlKC9eXFxbRVJSXFxdIC9naSwgJycpKTtcclxuICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0VSUl1cIiwgYCR7Y2hhbGsucmVkKFwiW0VSUl1cIil9YClcclxuICAgICAgICB9XHJcbiAgICAgICAgbG9nKGFwcCwgc3RyKVxyXG5cclxuICAgICAgICB2YXJzLmNhbGxiYWNrKClcclxuICAgICAgICByZXNvbHZlKDApXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKHN1YnN0cmluZ3Muc29tZShmdW5jdGlvbih2KSB7IHJldHVybiBkYXRhLmluZGV4T2YodikgPj0gMDsgfSkpIHtcclxuICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0lORl1cIiwgXCJcIilcclxuICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0xPR11cIiwgXCJcIilcclxuICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKS50cmltKClcclxuICAgICAgICAgIGlmIChzdHIuaW5jbHVkZXMoXCJbRVJSXVwiKSkge1xyXG4gICAgICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChhcHAgKyBzdHIucmVwbGFjZSgvXlxcW0VSUlxcXSAvZ2ksICcnKSk7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0VSUl1cIiwgYCR7Y2hhbGsucmVkKFwiW0VSUl1cIil9YClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGxvZyhhcHAsIHN0cilcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICB2YXJzLmNoaWxkLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XHJcbiAgICAgIGxvZ3Yob3B0aW9ucywgYGVycm9yIG9uIGNsb3NlOiBgICsgZGF0YSlcclxuICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXHJcbiAgICAgIHZhciBzdHJKYXZhT3B0cyA9IFwiUGlja2VkIHVwIF9KQVZBX09QVElPTlNcIjtcclxuICAgICAgdmFyIGluY2x1ZGVzID0gc3RyLmluY2x1ZGVzKHN0ckphdmFPcHRzKVxyXG4gICAgICBpZiAoIWluY2x1ZGVzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYCR7YXBwfSAke2NoYWxrLnJlZChcIltFUlJdXCIpfSAke3N0cn1gKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0pXHJcbn1cclxuXHJcbi8vKioqKioqKioqKlxyXG5mdW5jdGlvbiBydW5TY3JpcHQoc2NyaXB0UGF0aCwgY2FsbGJhY2spIHtcclxuICB2YXIgY2hpbGRQcm9jZXNzID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xyXG4gIC8vIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBjYWxsYmFjayBoYXMgYmVlbiBpbnZva2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgaW52b2NhdGlvbnNcclxuICB2YXIgaW52b2tlZCA9IGZhbHNlO1xyXG4gIHZhciBwcm9jZXNzID0gY2hpbGRQcm9jZXNzLmZvcmsoc2NyaXB0UGF0aCwgW10sIHsgZXhlY0FyZ3YgOiBbJy0taW5zcGVjdD0wJ10gfSk7XHJcbiAgLy8gbGlzdGVuIGZvciBlcnJvcnMgYXMgdGhleSBtYXkgcHJldmVudCB0aGUgZXhpdCBldmVudCBmcm9tIGZpcmluZ1xyXG4gIHByb2Nlc3Mub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xyXG4gICAgaWYgKGludm9rZWQpIHJldHVybjtcclxuICAgIGludm9rZWQgPSB0cnVlO1xyXG4gICAgY2FsbGJhY2soZXJyKTtcclxuICB9KTtcclxuICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjayBvbmNlIHRoZSBwcm9jZXNzIGhhcyBmaW5pc2hlZCBydW5uaW5nXHJcbiAgcHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uIChjb2RlKSB7XHJcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xyXG4gICAgaW52b2tlZCA9IHRydWU7XHJcbiAgICB2YXIgZXJyID0gY29kZSA9PT0gMCA/IG51bGwgOiBuZXcgRXJyb3IoJ2V4aXQgY29kZSAnICsgY29kZSk7XHJcbiAgICBjYWxsYmFjayhlcnIpO1xyXG4gIH0pO1xyXG59XHJcblxyXG4vLyoqKioqKioqKipcclxuZXhwb3J0IGZ1bmN0aW9uIF90b1h0eXBlKHN0cikge1xyXG4gIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9fL2csICctJylcclxufVxyXG5cclxuLy8qKioqKioqKioqXHJcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0QXBwKCkge1xyXG4gIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcclxuICB2YXIgcHJlZml4ID0gYGBcclxuICBjb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKVxyXG4gIGlmIChwbGF0Zm9ybSA9PSAnZGFyd2luJykgeyBwcmVmaXggPSBg4oS5IO+9omV4dO+9ozpgIH1cclxuICBlbHNlIHsgcHJlZml4ID0gYGkgW2V4dF06YCB9XHJcbiAgcmV0dXJuIGAke2NoYWxrLmdyZWVuKHByZWZpeCl9IGBcclxufVxyXG5cclxuLy8qKioqKioqKioqXHJcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0VmVyc2lvbnMocGx1Z2luTmFtZSwgZnJhbWV3b3JrTmFtZSkge1xyXG50cnkge1xyXG4gIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcclxuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcclxuICB2YXIgdiA9IHt9XHJcbiAgdmFyIGZyYW1ld29ya0luZm8gPSAnbi9hJ1xyXG5cclxuICB2LnBsdWdpblZlcnNpb24gPSAnbi9hJztcclxuICB2LmV4dFZlcnNpb24gPSAnbi9hJztcclxuICB2LmVkaXRpb24gPSAnbi9hJztcclxuICB2LmNtZFZlcnNpb24gPSAnbi9hJztcclxuICB2LndlYnBhY2tWZXJzaW9uID0gJ24vYSc7XHJcblxyXG4gIHZhciBwbHVnaW5QYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhJywgcGx1Z2luTmFtZSlcclxuICB2YXIgcGx1Z2luUGtnID0gKGZzLmV4aXN0c1N5bmMocGx1Z2luUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xyXG4gIHYucGx1Z2luVmVyc2lvbiA9IHBsdWdpblBrZy52ZXJzaW9uXHJcbiAgdi5fcmVzb2x2ZWQgPSBwbHVnaW5Qa2cuX3Jlc29sdmVkXHJcbiAgaWYgKHYuX3Jlc29sdmVkID09IHVuZGVmaW5lZCkge1xyXG4gICAgdi5lZGl0aW9uID0gYENvbW1lcmNpYWxgXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgaWYgKC0xID09IHYuX3Jlc29sdmVkLmluZGV4T2YoJ2NvbW11bml0eScpKSB7XHJcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tdW5pdHlgXHJcbiAgICB9XHJcbiAgfVxyXG4gIHZhciB3ZWJwYWNrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvd2VicGFjaycpXHJcbiAgdmFyIHdlYnBhY2tQa2cgPSAoZnMuZXhpc3RzU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHdlYnBhY2tQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcclxuICB2LndlYnBhY2tWZXJzaW9uID0gd2VicGFja1BrZy52ZXJzaW9uXHJcbiAgdmFyIGV4dFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0JylcclxuICB2YXIgZXh0UGtnID0gKGZzLmV4aXN0c1N5bmMoZXh0UGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xyXG4gIHYuZXh0VmVyc2lvbiA9IGV4dFBrZy5zZW5jaGEudmVyc2lvblxyXG4gIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXHJcbiAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcclxuICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXHJcbiAgaWYgKHYuY21kVmVyc2lvbiA9PSB1bmRlZmluZWQpIHtcclxuICAgIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhLyR7cGx1Z2luTmFtZX0vbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcclxuICAgIHZhciBjbWRQa2cgPSAoZnMuZXhpc3RzU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XHJcbiAgICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXHJcbiAgfVxyXG5cclxuICAgaWYgKGZyYW1ld29ya05hbWUgIT0gdW5kZWZpbmVkICYmIGZyYW1ld29ya05hbWUgIT0gJ2V4dGpzJykge1xyXG4gICAgdmFyIGZyYW1ld29ya1BhdGggPSAnJ1xyXG4gICAgaWYgKGZyYW1ld29ya05hbWUgPT0gJ3JlYWN0Jykge1xyXG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9yZWFjdCcpXHJcbiAgICB9XHJcbiAgICBpZiAoZnJhbWV3b3JrTmFtZSA9PSAnYW5ndWxhcicpIHtcclxuICAgICAgZnJhbWV3b3JrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQGFuZ3VsYXIvY29yZScpXHJcbiAgICB9XHJcbiAgICB2YXIgZnJhbWV3b3JrUGtnID0gKGZzLmV4aXN0c1N5bmMoZnJhbWV3b3JrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGZyYW1ld29ya1BhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xyXG4gICAgdi5mcmFtZXdvcmtWZXJzaW9uID0gZnJhbWV3b3JrUGtnLnZlcnNpb25cclxuICAgIGlmICh2LmZyYW1ld29ya1ZlcnNpb24gPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGZyYW1ld29ya0luZm8gPSAnLCAnICsgZnJhbWV3b3JrTmFtZVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGZyYW1ld29ya0luZm8gPSAnLCAnICsgZnJhbWV3b3JrTmFtZSArICcgdicgKyB2LmZyYW1ld29ya1ZlcnNpb25cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuICdleHQtd2VicGFjay1wbHVnaW4gdicgKyB2LnBsdWdpblZlcnNpb24gKyAnLCBFeHQgSlMgdicgKyB2LmV4dFZlcnNpb24gKyAnICcgKyB2LmVkaXRpb24gKyAnIEVkaXRpb24sIFNlbmNoYSBDbWQgdicgKyB2LmNtZFZlcnNpb24gKyAnLCB3ZWJwYWNrIHYnICsgdi53ZWJwYWNrVmVyc2lvbiArIGZyYW1ld29ya0luZm9cclxuXHJcbn1cclxuY2F0Y2ggKGUpIHtcclxuICByZXR1cm4gJ2V4dC13ZWJwYWNrLXBsdWdpbiB2JyArIHYucGx1Z2luVmVyc2lvbiArICcsIEV4dCBKUyB2JyArIHYuZXh0VmVyc2lvbiArICcgJyArIHYuZWRpdGlvbiArICcgRWRpdGlvbiwgU2VuY2hhIENtZCB2JyArIHYuY21kVmVyc2lvbiArICcsIHdlYnBhY2sgdicgKyB2LndlYnBhY2tWZXJzaW9uICsgZnJhbWV3b3JrSW5mb1xyXG59XHJcblxyXG59XHJcblxyXG4vLyoqKioqKioqKipcclxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhhcHAsbWVzc2FnZSkge1xyXG4gIHZhciBzID0gYXBwICsgbWVzc2FnZVxyXG4gIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXHJcbiAgdHJ5IHtwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKX1jYXRjaChlKSB7fVxyXG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpO3Byb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxyXG59XHJcblxyXG4vLyoqKioqKioqKipcclxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2goYXBwLG1lc3NhZ2UpIHtcclxuICB2YXIgaCA9IGZhbHNlXHJcbiAgdmFyIHMgPSBhcHAgKyBtZXNzYWdlXHJcbiAgaWYgKGggPT0gdHJ1ZSkge1xyXG4gICAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcclxuICAgIHRyeSB7XHJcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpXHJcbiAgICB9XHJcbiAgICBjYXRjaChlKSB7fVxyXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocylcclxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxyXG4gIH1cclxufVxyXG5cclxuLy8qKioqKioqKioqXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2d2KHZlcmJvc2UsIHMpIHtcclxuICBpZiAodmVyYm9zZSA9PSAneWVzJykge1xyXG4gICAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcclxuICAgIHRyeSB7XHJcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpXHJcbiAgICB9XHJcbiAgICBjYXRjaChlKSB7fVxyXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoYC12ZXJib3NlOiAke3N9YClcclxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gX2dldFZhbGlkYXRlT3B0aW9ucygpIHtcclxuICByZXR1cm4ge1xyXG4gICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXHJcbiAgICBcInByb3BlcnRpZXNcIjoge1xyXG4gICAgICBcImZyYW1ld29ya1wiOiB7XHJcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxyXG4gICAgICB9LFxyXG4gICAgICBcInRvb2xraXRcIjoge1xyXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cclxuICAgICAgfSxcclxuICAgICAgXCJ0aGVtZVwiOiB7XHJcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxyXG4gICAgICB9LFxyXG4gICAgICBcImVtaXRcIjoge1xyXG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcclxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXHJcbiAgICAgIH0sXHJcbiAgICAgIFwic2NyaXB0XCI6IHtcclxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXHJcbiAgICAgIH0sXHJcbiAgICAgIFwicG9ydFwiOiB7XHJcbiAgICAgICAgXCJ0eXBlXCI6IFtcImludGVnZXJcIl1cclxuICAgICAgfSxcclxuICAgICAgXCJwYWNrYWdlc1wiOiB7XHJcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiLCBcImFycmF5XCJdXHJcbiAgICAgIH0sXHJcbiAgICAgIFwicHJvZmlsZVwiOiB7XHJcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxyXG4gICAgICB9LFxyXG4gICAgICBcImVudmlyb25tZW50XCI6IHtcclxuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAnZGV2ZWxvcG1lbnQnIG9yICdwcm9kdWN0aW9uJyBzdHJpbmcgdmFsdWVcIixcclxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXHJcbiAgICAgIH0sXHJcbiAgICAgIFwidHJlZXNoYWtlXCI6IHtcclxuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxyXG4gICAgICB9LFxyXG4gICAgICBcImJyb3dzZXJcIjoge1xyXG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcclxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXHJcbiAgICAgIH0sXHJcbiAgICAgIFwid2F0Y2hcIjoge1xyXG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcclxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXHJcbiAgICAgIH0sXHJcbiAgICAgIFwidmVyYm9zZVwiOiB7XHJcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ3llcycgb3IgJ25vJyBzdHJpbmcgdmFsdWUgKE5PVCB0cnVlIG9yIGZhbHNlKVwiLFxyXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cclxuICAgICAgfSxcclxuICAgICAgXCJpbmplY3RcIjoge1xyXG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcclxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXHJcbiAgICAgIH0sXHJcbiAgICAgIFwiaW50ZWxsaXNoYWtlXCI6IHtcclxuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxyXG4gICAgICB9LFxyXG4gICAgICBcImNtZG9wdHNcIjoge1xyXG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlIGEgc2VuY2hhIGNtZCBvcHRpb24gb3IgYXJndW1lbnQgc3RyaW5nXCIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiLCBcImFycmF5XCJdXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCI6IGZhbHNlXHJcbiAgfTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIF9nZXREZWZhdWx0T3B0aW9ucygpIHtcclxuICByZXR1cm4ge1xyXG4gICAgZnJhbWV3b3JrOiAnZXh0anMnLFxyXG4gICAgdG9vbGtpdDogJ21vZGVybicsXHJcbiAgICB0aGVtZTogJ3RoZW1lLW1hdGVyaWFsJyxcclxuICAgIGVtaXQ6ICd5ZXMnLFxyXG4gICAgc2NyaXB0OiBudWxsLFxyXG4gICAgcG9ydDogMTk2MixcclxuICAgIHBhY2thZ2VzOiBbXSxcclxuXHJcbiAgICBwcm9maWxlOiAnJyxcclxuICAgIGVudmlyb25tZW50OiAnZGV2ZWxvcG1lbnQnLFxyXG4gICAgdHJlZXNoYWtlOiAnbm8nLFxyXG4gICAgYnJvd3NlcjogJ3llcycsXHJcbiAgICB3YXRjaDogJ3llcycsXHJcbiAgICB2ZXJib3NlOiAnbm8nLFxyXG4gICAgaW5qZWN0OiAneWVzJyxcclxuICAgIGludGVsbGlzaGFrZTogJ3llcycsXHJcbiAgICBjbWRvcHRzOiAnJ1xyXG4gIH1cclxufVxyXG4iXX0=