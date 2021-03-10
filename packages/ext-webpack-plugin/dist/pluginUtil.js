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
    } else {
      vars.production = false;
    }

    if (options.cmdopts && (options.cmdopts.includes('--testing') || options.cmdopts.includes('-te') || options.cmdopts.includes('--environment=testing') || options.cmdopts.includes('-e=testing'))) {
      vars.production = false;
      vars.testing = true;
      options.browser = 'no';
      options.watch = 'no';
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

    logv(verbose, 'Building for ' + options.environment + ', ' + 'treeshake is ' + options.treeshake + ', ' + 'intellishake is ' + options.intellishake);
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
      if (options.treeshake === 'yes' && options.environment === 'production') {
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
    var path, app, verbose, emit, framework, outputPath, command, parms, buildEnvironment;
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
            _context.next = 40;
            break;
          }

          if (!(vars.buildstep == '1 of 1' || vars.buildstep == '1 of 2')) {
            _context.next = 36;
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
            _context.next = 33;
            break;
          }

          parms = [];

          if (vars.testing === true) {
            buildEnvironment = 'testing';
          } else if (vars.production === true) {
            buildEnvironment = 'production';
          } else {
            buildEnvironment = 'development';
          }

          logv(verbose, `buildEnvironment: ${buildEnvironment}`);

          if (!Array.isArray(options.cmdopts)) {
            options.cmdopts = options.cmdopts.split(' ');
          }

          if (options.profile == undefined || options.profile == '' || options.profile == null) {
            if (command == 'build') {
              parms = ['app', command, buildEnvironment];
            } else {
              parms = ['app', command, '--web-server', 'false', buildEnvironment];
            }
          } else {
            if (command == 'build') {
              parms = ['app', command, options.profile, buildEnvironment];
            } else {
              parms = ['app', command, '--web-server', 'false', options.profile, buildEnvironment];
            }
          }

          options.cmdopts.forEach(function (element) {
            parms.splice(parms.indexOf(command) + 1, 0, element);
          }); // if (vars.watchStarted == false) {
          //   await _buildExtBundle(app, compilation, outputPath, parms, vars, options)
          //   vars.watchStarted = true
          // }

          if (!(vars.watchStarted == false)) {
            _context.next = 30;
            break;
          }

          _context.next = 27;
          return _buildExtBundle(app, compilation, outputPath, parms, vars, options);

        case 27:
          if (command == 'watch') {
            vars.watchStarted = true;
          } else {
            vars.callback();
          }

          _context.next = 31;
          break;

        case 30:
          vars.callback();

        case 31:
          _context.next = 34;
          break;

        case 33:
          vars.callback();

        case 34:
          _context.next = 38;
          break;

        case 36:
          logv(verbose, 'NOT running emit');
          vars.callback();

        case 38:
          _context.next = 42;
          break;

        case 40:
          logv(verbose, 'emit is no');
          vars.callback();

        case 42:
          _context.next = 48;
          break;

        case 44:
          _context.prev = 44;
          _context.t0 = _context["catch"](0);
          vars.callback();
          throw '_emit: ' + _context.t0.toString();

        case 48:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 44]]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsImluaXRpYWxPcHRpb25zIiwiZnMiLCJyZXF1aXJlIiwidmFycyIsIm9wdGlvbnMiLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwicmVzdWx0IiwidHJlZXNoYWtlIiwidmVyYm9zZSIsInZhbGlkYXRlT3B0aW9ucyIsIl9nZXRWYWxpZGF0ZU9wdGlvbnMiLCJyYyIsImV4aXN0c1N5bmMiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJfZ2V0RGVmYXVsdE9wdGlvbnMiLCJfZ2V0RGVmYXVsdFZhcnMiLCJwbHVnaW5OYW1lIiwiYXBwIiwiX2dldEFwcCIsInRlc3RpbmciLCJsb2d2IiwiZW52aXJvbm1lbnQiLCJjbWRvcHRzIiwiaW5jbHVkZXMiLCJwcm9kdWN0aW9uIiwiYnJvd3NlciIsIndhdGNoIiwibG9nIiwiX2dldFZlcnNpb25zIiwiaW50ZWxsaXNoYWtlIiwiYnVpbGRzdGVwIiwiX3RvUHJvZCIsImNvbmZpZ09iaiIsImUiLCJ0b1N0cmluZyIsIl90aGlzQ29tcGlsYXRpb24iLCJjb21waWxlciIsImNvbXBpbGF0aW9uIiwic2NyaXB0IiwicnVuU2NyaXB0IiwiZXJyIiwiX2NvbXBpbGF0aW9uIiwiZXh0Q29tcG9uZW50cyIsIl9nZXRBbGxDb21wb25lbnRzIiwiaG9va3MiLCJzdWNjZWVkTW9kdWxlIiwidGFwIiwibW9kdWxlIiwicmVzb3VyY2UiLCJtYXRjaCIsIl9zb3VyY2UiLCJfdmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImRlcHMiLCJfZXh0cmFjdEZyb21Tb3VyY2UiLCJjb25zb2xlIiwiZmluaXNoTW9kdWxlcyIsIm1vZHVsZXMiLCJfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciIsImluamVjdCIsImh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24iLCJkYXRhIiwicGF0aCIsImpzUGF0aCIsImpvaW4iLCJleHRQYXRoIiwiY3NzUGF0aCIsImFzc2V0cyIsImpzIiwidW5zaGlmdCIsImNzcyIsIl9hZnRlckNvbXBpbGUiLCJfZW1pdCIsImNhbGxiYWNrIiwiZW1pdCIsIm91dHB1dFBhdGgiLCJkZXZTZXJ2ZXIiLCJjb250ZW50QmFzZSIsIl9wcmVwYXJlRm9yQnVpbGQiLCJjb21tYW5kIiwicmVidWlsZCIsInBhcm1zIiwiYnVpbGRFbnZpcm9ubWVudCIsIkFycmF5IiwiaXNBcnJheSIsInNwbGl0IiwicHJvZmlsZSIsImZvckVhY2giLCJlbGVtZW50Iiwic3BsaWNlIiwiaW5kZXhPZiIsIndhdGNoU3RhcnRlZCIsIl9idWlsZEV4dEJ1bmRsZSIsIl9kb25lIiwic3RhdHMiLCJlcnJvcnMiLCJsZW5ndGgiLCJjaGFsayIsInJlZCIsIl90b0RldiIsImJyb3dzZXJDb3VudCIsInVybCIsInBvcnQiLCJvcG4iLCJvdXRwdXQiLCJwYWNrYWdlcyIsInRvb2xraXQiLCJ0aGVtZSIsInJpbXJhZiIsIm1rZGlycCIsImZzeCIsImZpcnN0VGltZSIsInN5bmMiLCJidWlsZFhNTCIsImNyZWF0ZUFwcEpzb24iLCJjcmVhdGVXb3Jrc3BhY2VKc29uIiwiY3JlYXRlSlNET01FbnZpcm9ubWVudCIsIndyaXRlRmlsZVN5bmMiLCJwcm9jZXNzIiwiY3dkIiwiZnJvbVBhdGgiLCJ0b1BhdGgiLCJjb3B5U3luYyIsInJlcGxhY2UiLCJmcm9tUmVzb3VyY2VzIiwidG9SZXNvdXJjZXMiLCJmaWx0ZXIiLCJ2YWx1ZSIsImluZGV4IiwibWFuaWZlc3QiLCJidW5kbGVEaXIiLCJ0cmltIiwic2VuY2hhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbkJ1aWxkRG9uZSIsIm9wdHMiLCJzaWxlbnQiLCJzdGRpbyIsImVuY29kaW5nIiwiX2V4ZWN1dGVBc3luYyIsInRoZW4iLCJyZWFzb24iLCJERUZBVUxUX1NVQlNUUlMiLCJzdWJzdHJpbmdzIiwiY3Jvc3NTcGF3biIsInN0cmluZ2lmeSIsImNoaWxkIiwib24iLCJjb2RlIiwic2lnbmFsIiwiRXJyb3IiLCJlcnJvciIsInN0ZG91dCIsInN0ciIsInNvbWUiLCJ2Iiwic3RkZXJyIiwic3RySmF2YU9wdHMiLCJzY3JpcHRQYXRoIiwiY2hpbGRQcm9jZXNzIiwiaW52b2tlZCIsImZvcmsiLCJleGVjQXJndiIsIl90b1h0eXBlIiwicHJlZml4IiwicGxhdGZvcm0iLCJncmVlbiIsImZyYW1ld29ya05hbWUiLCJmcmFtZXdvcmtJbmZvIiwicGx1Z2luVmVyc2lvbiIsImV4dFZlcnNpb24iLCJlZGl0aW9uIiwiY21kVmVyc2lvbiIsIndlYnBhY2tWZXJzaW9uIiwicGx1Z2luUGF0aCIsInBsdWdpblBrZyIsInZlcnNpb24iLCJfcmVzb2x2ZWQiLCJ3ZWJwYWNrUGF0aCIsIndlYnBhY2tQa2ciLCJleHRQa2ciLCJjbWRQYXRoIiwiY21kUGtnIiwidmVyc2lvbl9mdWxsIiwiZnJhbWV3b3JrUGF0aCIsImZyYW1ld29ya1BrZyIsImZyYW1ld29ya1ZlcnNpb24iLCJtZXNzYWdlIiwicyIsImN1cnNvclRvIiwiY2xlYXJMaW5lIiwid3JpdGUiLCJsb2doIiwiaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ08sU0FBU0EsWUFBVCxDQUFzQkMsY0FBdEIsRUFBc0M7QUFDM0MsUUFBTUMsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxNQUFJQyxJQUFJLEdBQUcsRUFBWDtBQUNBLE1BQUlDLE9BQU8sR0FBRyxFQUFkOztBQUNBLE1BQUk7QUFDRixRQUFJSixjQUFjLENBQUNLLFNBQWYsSUFBNEJDLFNBQWhDLEVBQTJDO0FBQ3pDSCxNQUFBQSxJQUFJLENBQUNJLFlBQUwsR0FBb0IsRUFBcEI7QUFDQUosTUFBQUEsSUFBSSxDQUFDSSxZQUFMLENBQWtCQyxJQUFsQixDQUF1QiwwSEFBdkI7QUFDQSxVQUFJQyxNQUFNLEdBQUc7QUFBRU4sUUFBQUEsSUFBSSxFQUFFQTtBQUFSLE9BQWI7QUFDQSxhQUFPTSxNQUFQO0FBQ0Q7O0FBQ0QsUUFBSUosU0FBUyxHQUFHTCxjQUFjLENBQUNLLFNBQS9CO0FBQ0EsUUFBSUssU0FBUyxHQUFHVixjQUFjLENBQUNVLFNBQS9CO0FBQ0EsUUFBSUMsT0FBTyxHQUFHWCxjQUFjLENBQUNXLE9BQTdCOztBQUVBLFVBQU1DLGVBQWUsR0FBR1YsT0FBTyxDQUFDLGNBQUQsQ0FBL0I7O0FBQ0FVLElBQUFBLGVBQWUsQ0FBQ0MsbUJBQW1CLEVBQXBCLEVBQXdCYixjQUF4QixFQUF3QyxFQUF4QyxDQUFmO0FBRUEsVUFBTWMsRUFBRSxHQUFJYixFQUFFLENBQUNjLFVBQUgsQ0FBZSxRQUFPVixTQUFVLElBQWhDLEtBQXdDVyxJQUFJLENBQUNDLEtBQUwsQ0FBV2hCLEVBQUUsQ0FBQ2lCLFlBQUgsQ0FBaUIsUUFBT2IsU0FBVSxJQUFsQyxFQUF1QyxPQUF2QyxDQUFYLENBQXhDLElBQXVHLEVBQW5IO0FBQ0FELElBQUFBLE9BQU8saURBQVFlLGtCQUFrQixFQUExQixHQUFpQ25CLGNBQWpDLEdBQW9EYyxFQUFwRCxDQUFQO0FBRUFYLElBQUFBLElBQUksR0FBR0QsT0FBTyxDQUFFLEtBQUlHLFNBQVUsTUFBaEIsQ0FBUCxDQUE4QmUsZUFBOUIsRUFBUDtBQUNBakIsSUFBQUEsSUFBSSxDQUFDa0IsVUFBTCxHQUFrQixvQkFBbEI7QUFDQWxCLElBQUFBLElBQUksQ0FBQ21CLEdBQUwsR0FBV0MsT0FBTyxFQUFsQjtBQUNBLFFBQUlGLFVBQVUsR0FBR2xCLElBQUksQ0FBQ2tCLFVBQXRCO0FBQ0EsUUFBSUMsR0FBRyxHQUFHbkIsSUFBSSxDQUFDbUIsR0FBZjtBQUNBbkIsSUFBQUEsSUFBSSxDQUFDcUIsT0FBTCxHQUFlLEtBQWY7QUFFQUMsSUFBQUEsSUFBSSxDQUFDZCxPQUFELEVBQVUsdUJBQVYsQ0FBSjtBQUNBYyxJQUFBQSxJQUFJLENBQUNkLE9BQUQsRUFBVyxnQkFBZVUsVUFBVyxFQUFyQyxDQUFKO0FBQ0FJLElBQUFBLElBQUksQ0FBQ2QsT0FBRCxFQUFXLFNBQVFXLEdBQUksRUFBdkIsQ0FBSjs7QUFFQSxRQUFJbEIsT0FBTyxDQUFDc0IsV0FBUixJQUF1QixZQUF2QixJQUNDdEIsT0FBTyxDQUFDdUIsT0FBUixDQUFnQkMsUUFBaEIsQ0FBeUIsY0FBekIsS0FBNEN4QixPQUFPLENBQUN1QixPQUFSLENBQWdCQyxRQUFoQixDQUF5QixLQUF6QixDQUE1QyxJQUNHeEIsT0FBTyxDQUFDdUIsT0FBUixDQUFnQkMsUUFBaEIsQ0FBeUIsMEJBQXpCLENBREgsSUFDMkR4QixPQUFPLENBQUN1QixPQUFSLENBQWdCQyxRQUFoQixDQUF5QixlQUF6QixDQUZoRSxFQUU0RztBQUMxR3pCLE1BQUFBLElBQUksQ0FBQzBCLFVBQUwsR0FBa0IsSUFBbEI7QUFDQXpCLE1BQUFBLE9BQU8sQ0FBQzBCLE9BQVIsR0FBa0IsSUFBbEI7QUFDQTFCLE1BQUFBLE9BQU8sQ0FBQzJCLEtBQVIsR0FBZ0IsSUFBaEI7QUFDRCxLQU5ELE1BT0s7QUFDSDVCLE1BQUFBLElBQUksQ0FBQzBCLFVBQUwsR0FBa0IsS0FBbEI7QUFDRDs7QUFFRCxRQUFHekIsT0FBTyxDQUFDdUIsT0FBUixLQUNFdkIsT0FBTyxDQUFDdUIsT0FBUixDQUFnQkMsUUFBaEIsQ0FBeUIsV0FBekIsS0FBeUN4QixPQUFPLENBQUN1QixPQUFSLENBQWdCQyxRQUFoQixDQUF5QixLQUF6QixDQUF6QyxJQUNHeEIsT0FBTyxDQUFDdUIsT0FBUixDQUFnQkMsUUFBaEIsQ0FBeUIsdUJBQXpCLENBREgsSUFDd0R4QixPQUFPLENBQUN1QixPQUFSLENBQWdCQyxRQUFoQixDQUF5QixZQUF6QixDQUYxRCxDQUFILEVBRXFHO0FBQ25HekIsTUFBQUEsSUFBSSxDQUFDMEIsVUFBTCxHQUFrQixLQUFsQjtBQUNBMUIsTUFBQUEsSUFBSSxDQUFDcUIsT0FBTCxHQUFlLElBQWY7QUFDQXBCLE1BQUFBLE9BQU8sQ0FBQzBCLE9BQVIsR0FBa0IsSUFBbEI7QUFDQTFCLE1BQUFBLE9BQU8sQ0FBQzJCLEtBQVIsR0FBZ0IsSUFBaEI7QUFDRDs7QUFFREMsSUFBQUEsR0FBRyxDQUFDVixHQUFELEVBQU1XLFlBQVksQ0FBQ1osVUFBRCxFQUFhaEIsU0FBYixDQUFsQixDQUFILENBaERFLENBa0RGOztBQUNBLFFBQUlBLFNBQVMsSUFBSSxTQUFiLElBQ0FELE9BQU8sQ0FBQzhCLFlBQVIsSUFBd0IsSUFEeEIsSUFFQS9CLElBQUksQ0FBQzBCLFVBQUwsSUFBbUIsSUFGbkIsSUFHR25CLFNBQVMsSUFBSSxLQUhwQixFQUcyQjtBQUNuQlAsTUFBQUEsSUFBSSxDQUFDZ0MsU0FBTCxHQUFpQixRQUFqQjtBQUNBSCxNQUFBQSxHQUFHLENBQUNWLEdBQUQsRUFBTSxtQ0FBbUNqQixTQUF6QyxDQUFIO0FBQ1AsS0FORCxNQVFLLElBQUlBLFNBQVMsSUFBSSxPQUFiLElBQXdCQSxTQUFTLElBQUksT0FBckMsSUFBZ0RBLFNBQVMsSUFBSSxnQkFBakUsRUFBbUY7QUFDdEYsVUFBSUYsSUFBSSxDQUFDMEIsVUFBTCxJQUFtQixJQUF2QixFQUE2QjtBQUMzQjFCLFFBQUFBLElBQUksQ0FBQ2dDLFNBQUwsR0FBaUIsUUFBakI7QUFDQUgsUUFBQUEsR0FBRyxDQUFDVixHQUFELEVBQU0sbUNBQW1DakIsU0FBekMsQ0FBSDtBQUNELE9BSEQsTUFJSyxJQUFHRixJQUFJLENBQUNxQixPQUFMLElBQWdCLElBQW5CLEVBQXdCO0FBQzNCckIsUUFBQUEsSUFBSSxDQUFDZ0MsU0FBTCxHQUFpQixRQUFqQjtBQUNBSCxRQUFBQSxHQUFHLENBQUNWLEdBQUQsRUFBTSxnQ0FBZ0NqQixTQUF0QyxDQUFIO0FBQ0QsT0FISSxNQUlBO0FBQ0hGLFFBQUFBLElBQUksQ0FBQ2dDLFNBQUwsR0FBaUIsUUFBakI7QUFDQUgsUUFBQUEsR0FBRyxDQUFDVixHQUFELEVBQU0sb0NBQW9DakIsU0FBMUMsQ0FBSDtBQUNEO0FBQ0YsS0FiSSxNQWNBLElBQUlGLElBQUksQ0FBQzBCLFVBQUwsSUFBbUIsSUFBdkIsRUFBNkI7QUFDaEMsVUFBSW5CLFNBQVMsSUFBSSxLQUFqQixFQUF3QjtBQUN0QlAsUUFBQUEsSUFBSSxDQUFDZ0MsU0FBTCxHQUFpQixRQUFqQjtBQUNBSCxRQUFBQSxHQUFHLENBQUNWLEdBQUQsRUFBTSxtQ0FBbUNqQixTQUFuQyxHQUErQyxLQUEvQyxHQUF1REYsSUFBSSxDQUFDZ0MsU0FBbEUsQ0FBSDs7QUFDQWpDLFFBQUFBLE9BQU8sQ0FBRSxLQUFJRyxTQUFVLE1BQWhCLENBQVAsQ0FBOEIrQixPQUE5QixDQUFzQ2pDLElBQXRDLEVBQTRDQyxPQUE1QztBQUNELE9BSkQsTUFLSztBQUNIRCxRQUFBQSxJQUFJLENBQUNnQyxTQUFMLEdBQWlCLFFBQWpCO0FBQ0FILFFBQUFBLEdBQUcsQ0FBQ1YsR0FBRCxFQUFNLHFDQUFxQ2pCLFNBQXJDLEdBQWlELEtBQWpELEdBQXlERixJQUFJLENBQUNnQyxTQUFwRSxDQUFIO0FBQ0Q7QUFDRixLQVZJLE1BV0E7QUFDSGhDLE1BQUFBLElBQUksQ0FBQ2dDLFNBQUwsR0FBaUIsUUFBakI7QUFDQUgsTUFBQUEsR0FBRyxDQUFDVixHQUFELEVBQU0sb0NBQW9DakIsU0FBMUMsQ0FBSDtBQUNEOztBQUNEb0IsSUFBQUEsSUFBSSxDQUFDZCxPQUFELEVBQVUsa0JBQWtCUCxPQUFPLENBQUNzQixXQUExQixHQUF3QyxJQUF4QyxHQUErQyxlQUEvQyxHQUFpRXRCLE9BQU8sQ0FBQ00sU0FBekUsR0FBb0YsSUFBcEYsR0FBMkYsa0JBQTNGLEdBQWdITixPQUFPLENBQUM4QixZQUFsSSxDQUFKO0FBRUEsUUFBSUcsU0FBUyxHQUFHO0FBQUVsQyxNQUFBQSxJQUFJLEVBQUVBLElBQVI7QUFBY0MsTUFBQUEsT0FBTyxFQUFFQTtBQUF2QixLQUFoQjtBQUNBLFdBQU9pQyxTQUFQO0FBQ0QsR0E1RkQsQ0E2RkEsT0FBT0MsQ0FBUCxFQUFVO0FBQ1IsVUFBTSxtQkFBbUJBLENBQUMsQ0FBQ0MsUUFBRixFQUF6QjtBQUNEO0FBQ0YsQyxDQUVEOzs7QUFDTyxTQUFTQyxnQkFBVCxDQUEwQkMsUUFBMUIsRUFBb0NDLFdBQXBDLEVBQWlEdkMsSUFBakQsRUFBdURDLE9BQXZELEVBQWdFO0FBQ3JFLE1BQUk7QUFDRixRQUFJa0IsR0FBRyxHQUFHbkIsSUFBSSxDQUFDbUIsR0FBZjtBQUNBLFFBQUlYLE9BQU8sR0FBR1AsT0FBTyxDQUFDTyxPQUF0QjtBQUNBYyxJQUFBQSxJQUFJLENBQUNkLE9BQUQsRUFBVSwyQkFBVixDQUFKO0FBQ0FjLElBQUFBLElBQUksQ0FBQ2QsT0FBRCxFQUFXLG1CQUFrQlAsT0FBTyxDQUFDdUMsTUFBUSxFQUE3QyxDQUFKO0FBQ0FsQixJQUFBQSxJQUFJLENBQUNkLE9BQUQsRUFBVyxjQUFhUixJQUFJLENBQUNnQyxTQUFVLEVBQXZDLENBQUo7O0FBRUEsUUFBSWhDLElBQUksQ0FBQ2dDLFNBQUwsS0FBbUIsUUFBbkIsSUFBK0JoQyxJQUFJLENBQUNnQyxTQUFMLEtBQW1CLFFBQXRELEVBQWdFO0FBQzlELFVBQUkvQixPQUFPLENBQUN1QyxNQUFSLElBQWtCckMsU0FBbEIsSUFBK0JGLE9BQU8sQ0FBQ3VDLE1BQVIsSUFBa0IsSUFBakQsSUFBeUR2QyxPQUFPLENBQUN1QyxNQUFSLElBQWtCLEVBQS9FLEVBQW1GO0FBQ2pGWCxRQUFBQSxHQUFHLENBQUNWLEdBQUQsRUFBTyxtQkFBa0JsQixPQUFPLENBQUN1QyxNQUFPLEVBQXhDLENBQUg7QUFDQUMsUUFBQUEsU0FBUyxDQUFDeEMsT0FBTyxDQUFDdUMsTUFBVCxFQUFpQixVQUFVRSxHQUFWLEVBQWU7QUFDdkMsY0FBSUEsR0FBSixFQUFTO0FBQ1Asa0JBQU1BLEdBQU47QUFDRDs7QUFDRGIsVUFBQUEsR0FBRyxDQUFDVixHQUFELEVBQU8sb0JBQW1CbEIsT0FBTyxDQUFDdUMsTUFBTyxFQUF6QyxDQUFIO0FBQ0QsU0FMUSxDQUFUO0FBTUQ7QUFDRjtBQUNGLEdBbEJELENBbUJBLE9BQU1MLENBQU4sRUFBUztBQUNQLFVBQU0sdUJBQXVCQSxDQUFDLENBQUNDLFFBQUYsRUFBN0I7QUFDRDtBQUNGLEMsQ0FFRDs7O0FBQ08sU0FBU08sWUFBVCxDQUFzQkwsUUFBdEIsRUFBZ0NDLFdBQWhDLEVBQTZDdkMsSUFBN0MsRUFBbURDLE9BQW5ELEVBQTREO0FBQ2pFLE1BQUk7QUFDRixRQUFJa0IsR0FBRyxHQUFHbkIsSUFBSSxDQUFDbUIsR0FBZjtBQUNBLFFBQUlYLE9BQU8sR0FBR1AsT0FBTyxDQUFDTyxPQUF0QjtBQUNBLFFBQUlOLFNBQVMsR0FBR0QsT0FBTyxDQUFDQyxTQUF4QjtBQUNBb0IsSUFBQUEsSUFBSSxDQUFDZCxPQUFELEVBQVUsdUJBQVYsQ0FBSjs7QUFFQSxRQUFJTixTQUFTLElBQUksT0FBakIsRUFBMEI7QUFDeEIsVUFBSUQsT0FBTyxDQUFDTSxTQUFSLEtBQXNCLEtBQXRCLElBQStCTixPQUFPLENBQUNzQixXQUFSLEtBQXdCLFlBQTNELEVBQXlFO0FBQ3ZFLFlBQUlxQixhQUFhLEdBQUcsRUFBcEIsQ0FEdUUsQ0FHdkU7O0FBQ0EsWUFBSTVDLElBQUksQ0FBQ2dDLFNBQUwsSUFBa0IsUUFBbEIsSUFBOEI5QixTQUFTLEtBQUssU0FBNUMsSUFBeURELE9BQU8sQ0FBQzhCLFlBQVIsSUFBd0IsSUFBckYsRUFBMkY7QUFDdkZhLFVBQUFBLGFBQWEsR0FBRzdDLE9BQU8sQ0FBRSxLQUFJRyxTQUFVLE1BQWhCLENBQVAsQ0FBOEIyQyxpQkFBOUIsQ0FBZ0Q3QyxJQUFoRCxFQUFzREMsT0FBdEQsQ0FBaEI7QUFDSDs7QUFFRCxZQUFJRCxJQUFJLENBQUNnQyxTQUFMLElBQWtCLFFBQWxCLElBQStCaEMsSUFBSSxDQUFDZ0MsU0FBTCxJQUFrQixRQUFsQixJQUE4QjlCLFNBQVMsS0FBSyxnQkFBL0UsRUFBa0c7QUFDaEcwQyxVQUFBQSxhQUFhLEdBQUc3QyxPQUFPLENBQUUsS0FBSUcsU0FBVSxNQUFoQixDQUFQLENBQThCMkMsaUJBQTlCLENBQWdEN0MsSUFBaEQsRUFBc0RDLE9BQXRELENBQWhCO0FBQ0Q7O0FBQ0RzQyxRQUFBQSxXQUFXLENBQUNPLEtBQVosQ0FBa0JDLGFBQWxCLENBQWdDQyxHQUFoQyxDQUFxQyxvQkFBckMsRUFBMERDLE1BQU0sSUFBSTtBQUNsRSxjQUFJQSxNQUFNLENBQUNDLFFBQVAsSUFBbUIsQ0FBQ0QsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxLQUFoQixDQUFzQixjQUF0QixDQUF4QixFQUErRDtBQUM3RCxnQkFBSTtBQUNBLGtCQUFJRixNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLEtBQWhCLENBQXNCLFNBQXRCLEtBQW9DLElBQXBDLElBQ0RGLE1BQU0sQ0FBQ0csT0FBUCxDQUFlQyxNQUFmLENBQXNCQyxXQUF0QixHQUFvQzdCLFFBQXBDLENBQTZDLGNBQTdDLEtBQWdFLEtBRG5FLEVBRUU7QUFDRXpCLGdCQUFBQSxJQUFJLENBQUN1RCxJQUFMLEdBQVksQ0FDUixJQUFJdkQsSUFBSSxDQUFDdUQsSUFBTCxJQUFhLEVBQWpCLENBRFEsRUFFUixHQUFHeEQsT0FBTyxDQUFFLEtBQUlHLFNBQVUsTUFBaEIsQ0FBUCxDQUE4QnNELGtCQUE5QixDQUFpRFAsTUFBakQsRUFBeURoRCxPQUF6RCxFQUFrRXNDLFdBQWxFLEVBQStFSyxhQUEvRSxDQUZLLENBQVo7QUFHQyxlQU5MLE1BT0s7QUFDRDVDLGdCQUFBQSxJQUFJLENBQUN1RCxJQUFMLEdBQVksQ0FDUixJQUFJdkQsSUFBSSxDQUFDdUQsSUFBTCxJQUFhLEVBQWpCLENBRFEsRUFFUixHQUFHeEQsT0FBTyxDQUFFLEtBQUlHLFNBQVUsTUFBaEIsQ0FBUCxDQUE4QnNELGtCQUE5QixDQUFpRFAsTUFBakQsRUFBeURoRCxPQUF6RCxFQUFrRXNDLFdBQWxFLEVBQStFSyxhQUEvRSxDQUZLLENBQVo7QUFHQztBQUNSLGFBYkQsQ0FjQSxPQUFNVCxDQUFOLEVBQVM7QUFDTHNCLGNBQUFBLE9BQU8sQ0FBQzVCLEdBQVIsQ0FBWU0sQ0FBWjtBQUNIO0FBQ0Y7QUFDRixTQXBCRDtBQXFCRDs7QUFDRCxVQUFJbkMsSUFBSSxDQUFDZ0MsU0FBTCxJQUFrQixRQUF0QixFQUFnQztBQUM5Qk8sUUFBQUEsV0FBVyxDQUFDTyxLQUFaLENBQWtCWSxhQUFsQixDQUFnQ1YsR0FBaEMsQ0FBcUMsb0JBQXJDLEVBQTBEVyxPQUFPLElBQUk7QUFDbkU1RCxVQUFBQSxPQUFPLENBQUUsS0FBSUcsU0FBVSxNQUFoQixDQUFQLENBQThCMEQsdUJBQTlCLENBQXNENUQsSUFBdEQsRUFBNERDLE9BQTVEO0FBQ0QsU0FGRDtBQUdEOztBQUNELFVBQUlELElBQUksQ0FBQ2dDLFNBQUwsSUFBa0IsUUFBbEIsSUFBOEJoQyxJQUFJLENBQUNnQyxTQUFMLElBQWtCLFFBQXBELEVBQThEO0FBQzVELFlBQUkvQixPQUFPLENBQUM0RCxNQUFSLEtBQW1CLEtBQXZCLEVBQThCO0FBQzVCLGNBQUd0QixXQUFXLENBQUNPLEtBQVosQ0FBa0JnQixxQ0FBbEIsSUFBMkQzRCxTQUE5RCxFQUF5RTtBQUN2RW9DLFlBQUFBLFdBQVcsQ0FBQ08sS0FBWixDQUFrQmdCLHFDQUFsQixDQUF3RGQsR0FBeEQsQ0FBNkQscUJBQTdELEVBQW1GZSxJQUFELElBQVU7QUFDMUYsb0JBQU1DLElBQUksR0FBR2pFLE9BQU8sQ0FBQyxNQUFELENBQXBCOztBQUNBLGtCQUFJa0UsTUFBTSxHQUFHRCxJQUFJLENBQUNFLElBQUwsQ0FBVWxFLElBQUksQ0FBQ21FLE9BQWYsRUFBd0IsUUFBeEIsQ0FBYjtBQUNBLGtCQUFJQyxPQUFPLEdBQUdKLElBQUksQ0FBQ0UsSUFBTCxDQUFVbEUsSUFBSSxDQUFDbUUsT0FBZixFQUF3QixTQUF4QixDQUFkLENBSDBGLENBSTFGO0FBQ0E7O0FBQ0FKLGNBQUFBLElBQUksQ0FBQ00sTUFBTCxDQUFZQyxFQUFaLENBQWVDLE9BQWYsQ0FBdUJOLE1BQXZCO0FBQ0FGLGNBQUFBLElBQUksQ0FBQ00sTUFBTCxDQUFZRyxHQUFaLENBQWdCRCxPQUFoQixDQUF3QkgsT0FBeEI7QUFDQXZDLGNBQUFBLEdBQUcsQ0FBQ1YsR0FBRCxFQUFPLFVBQVM4QyxNQUFPLFFBQU9HLE9BQVEsZ0JBQXRDLENBQUg7QUFDRCxhQVREO0FBVUQ7QUFDRjtBQUNGO0FBQ0Y7QUFDRixHQTlERCxDQStEQSxPQUFNakMsQ0FBTixFQUFTO0FBQ1AsVUFBTSxtQkFBbUJBLENBQUMsQ0FBQ0MsUUFBRixFQUF6QixDQURPLENBRVg7QUFDQTtBQUNHO0FBQ0YsQyxDQUVEOzs7QUFDTyxTQUFTcUMsYUFBVCxDQUF1Qm5DLFFBQXZCLEVBQWlDQyxXQUFqQyxFQUE4Q3ZDLElBQTlDLEVBQW9EQyxPQUFwRCxFQUE2RDtBQUNsRSxNQUFJO0FBQ0YsUUFBSWtCLEdBQUcsR0FBR25CLElBQUksQ0FBQ21CLEdBQWY7QUFDQSxRQUFJWCxPQUFPLEdBQUdQLE9BQU8sQ0FBQ08sT0FBdEI7QUFDQSxRQUFJTixTQUFTLEdBQUdELE9BQU8sQ0FBQ0MsU0FBeEI7QUFDQW9CLElBQUFBLElBQUksQ0FBQ2QsT0FBRCxFQUFVLHdCQUFWLENBQUo7O0FBQ0EsUUFBSU4sU0FBUyxJQUFJLE9BQWpCLEVBQTBCO0FBQ3hCSCxNQUFBQSxPQUFPLENBQUUsYUFBRixDQUFQLENBQXVCMEUsYUFBdkIsQ0FBcUNsQyxXQUFyQyxFQUFrRHZDLElBQWxELEVBQXdEQyxPQUF4RDtBQUNELEtBRkQsTUFHSztBQUNIcUIsTUFBQUEsSUFBSSxDQUFDZCxPQUFELEVBQVUsZ0NBQVYsQ0FBSjtBQUNEO0FBQ0YsR0FYRCxDQVlBLE9BQU0yQixDQUFOLEVBQVM7QUFDUCxVQUFNLG9CQUFvQkEsQ0FBQyxDQUFDQyxRQUFGLEVBQTFCO0FBQ0Q7QUFDRixDLENBRUQ7OztTQUNzQnNDLEs7O0VBOEZ0Qjs7OzttRUE5Rk8saUJBQXFCcEMsUUFBckIsRUFBK0JDLFdBQS9CLEVBQTRDdkMsSUFBNUMsRUFBa0RDLE9BQWxELEVBQTJEMEUsUUFBM0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUdYLFVBQUFBLElBRkgsR0FFVWpFLE9BQU8sQ0FBQyxNQUFELENBRmpCO0FBR0NvQixVQUFBQSxHQUhELEdBR09uQixJQUFJLENBQUNtQixHQUhaO0FBSUNYLFVBQUFBLE9BSkQsR0FJV1AsT0FBTyxDQUFDTyxPQUpuQjtBQUtDb0UsVUFBQUEsSUFMRCxHQUtRM0UsT0FBTyxDQUFDMkUsSUFMaEI7QUFNQzFFLFVBQUFBLFNBTkQsR0FNYUQsT0FBTyxDQUFDQyxTQU5yQjtBQU9IRixVQUFBQSxJQUFJLENBQUMyRSxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBckQsVUFBQUEsSUFBSSxDQUFDZCxPQUFELEVBQVMsZ0JBQVQsQ0FBSjs7QUFSRyxnQkFTQ29FLElBQUksSUFBSSxLQVRUO0FBQUE7QUFBQTtBQUFBOztBQUFBLGdCQVVHNUUsSUFBSSxDQUFDZ0MsU0FBTCxJQUFrQixRQUFsQixJQUE4QmhDLElBQUksQ0FBQ2dDLFNBQUwsSUFBa0IsUUFWbkQ7QUFBQTtBQUFBO0FBQUE7O0FBV0s2QyxVQUFBQSxVQVhMLEdBV2tCYixJQUFJLENBQUNFLElBQUwsQ0FBVTVCLFFBQVEsQ0FBQ3VDLFVBQW5CLEVBQThCN0UsSUFBSSxDQUFDbUUsT0FBbkMsQ0FYbEI7O0FBWUMsY0FBSTdCLFFBQVEsQ0FBQ3VDLFVBQVQsS0FBd0IsR0FBeEIsSUFBK0J2QyxRQUFRLENBQUNyQyxPQUFULENBQWlCNkUsU0FBcEQsRUFBK0Q7QUFDN0RELFlBQUFBLFVBQVUsR0FBR2IsSUFBSSxDQUFDRSxJQUFMLENBQVU1QixRQUFRLENBQUNyQyxPQUFULENBQWlCNkUsU0FBakIsQ0FBMkJDLFdBQXJDLEVBQWtERixVQUFsRCxDQUFiO0FBQ0Q7O0FBQ0R2RCxVQUFBQSxJQUFJLENBQUNkLE9BQUQsRUFBUyxpQkFBaUJxRSxVQUExQixDQUFKO0FBQ0F2RCxVQUFBQSxJQUFJLENBQUNkLE9BQUQsRUFBUyxnQkFBZ0JOLFNBQXpCLENBQUo7O0FBQ0EsY0FBSUEsU0FBUyxJQUFJLE9BQWpCLEVBQTBCO0FBQ3hCOEUsWUFBQUEsZ0JBQWdCLENBQUM3RCxHQUFELEVBQU1uQixJQUFOLEVBQVlDLE9BQVosRUFBcUI0RSxVQUFyQixFQUFpQ3RDLFdBQWpDLENBQWhCO0FBQ0Q7O0FBQ0cwQyxVQUFBQSxPQXBCTCxHQW9CZSxFQXBCZjs7QUFxQkMsY0FBSWhGLE9BQU8sQ0FBQzJCLEtBQVIsSUFBaUIsS0FBakIsSUFBMEI1QixJQUFJLENBQUMwQixVQUFMLElBQW1CLEtBQWpELEVBQ0U7QUFBQ3VELFlBQUFBLE9BQU8sR0FBRyxPQUFWO0FBQWtCLFdBRHJCLE1BR0U7QUFBQ0EsWUFBQUEsT0FBTyxHQUFHLE9BQVY7QUFBa0I7O0FBeEJ0QixnQkF5QktqRixJQUFJLENBQUNrRixPQUFMLElBQWdCLElBekJyQjtBQUFBO0FBQUE7QUFBQTs7QUEwQk9DLFVBQUFBLEtBMUJQLEdBMEJlLEVBMUJmOztBQTZCRyxjQUFHbkYsSUFBSSxDQUFDcUIsT0FBTCxLQUFpQixJQUFwQixFQUF5QjtBQUN2QitELFlBQUFBLGdCQUFnQixHQUFHLFNBQW5CO0FBQ0QsV0FGRCxNQUVNLElBQUlwRixJQUFJLENBQUMwQixVQUFMLEtBQW9CLElBQXhCLEVBQTZCO0FBQ2pDMEQsWUFBQUEsZ0JBQWdCLEdBQUcsWUFBbkI7QUFDRCxXQUZLLE1BRUQ7QUFDSEEsWUFBQUEsZ0JBQWdCLEdBQUcsYUFBbkI7QUFDRDs7QUFDRDlELFVBQUFBLElBQUksQ0FBQ2QsT0FBRCxFQUFXLHFCQUFvQjRFLGdCQUFpQixFQUFoRCxDQUFKOztBQUNBLGNBQUcsQ0FBQ0MsS0FBSyxDQUFDQyxPQUFOLENBQWNyRixPQUFPLENBQUN1QixPQUF0QixDQUFKLEVBQW1DO0FBQ2pDdkIsWUFBQUEsT0FBTyxDQUFDdUIsT0FBUixHQUFrQnZCLE9BQU8sQ0FBQ3VCLE9BQVIsQ0FBZ0IrRCxLQUFoQixDQUFzQixHQUF0QixDQUFsQjtBQUNEOztBQUNELGNBQUl0RixPQUFPLENBQUN1RixPQUFSLElBQW1CckYsU0FBbkIsSUFBZ0NGLE9BQU8sQ0FBQ3VGLE9BQVIsSUFBbUIsRUFBbkQsSUFBeUR2RixPQUFPLENBQUN1RixPQUFSLElBQW1CLElBQWhGLEVBQXNGO0FBQ3BGLGdCQUFJUCxPQUFPLElBQUksT0FBZixFQUNFO0FBQUVFLGNBQUFBLEtBQUssR0FBRyxDQUFDLEtBQUQsRUFBUUYsT0FBUixFQUFpQkcsZ0JBQWpCLENBQVI7QUFBNEMsYUFEaEQsTUFHRTtBQUFFRCxjQUFBQSxLQUFLLEdBQUcsQ0FBQyxLQUFELEVBQVFGLE9BQVIsRUFBaUIsY0FBakIsRUFBaUMsT0FBakMsRUFBMENHLGdCQUExQyxDQUFSO0FBQXFFO0FBQzFFLFdBTEQsTUFNSztBQUNILGdCQUFJSCxPQUFPLElBQUksT0FBZixFQUNFO0FBQUNFLGNBQUFBLEtBQUssR0FBRyxDQUFDLEtBQUQsRUFBUUYsT0FBUixFQUFpQmhGLE9BQU8sQ0FBQ3VGLE9BQXpCLEVBQWtDSixnQkFBbEMsQ0FBUjtBQUE0RCxhQUQvRCxNQUdFO0FBQUNELGNBQUFBLEtBQUssR0FBRyxDQUFDLEtBQUQsRUFBUUYsT0FBUixFQUFpQixjQUFqQixFQUFpQyxPQUFqQyxFQUEwQ2hGLE9BQU8sQ0FBQ3VGLE9BQWxELEVBQTJESixnQkFBM0QsQ0FBUjtBQUFxRjtBQUN6Rjs7QUFDRG5GLFVBQUFBLE9BQU8sQ0FBQ3VCLE9BQVIsQ0FBZ0JpRSxPQUFoQixDQUF3QixVQUFTQyxPQUFULEVBQWlCO0FBQ3JDUCxZQUFBQSxLQUFLLENBQUNRLE1BQU4sQ0FBYVIsS0FBSyxDQUFDUyxPQUFOLENBQWNYLE9BQWQsSUFBdUIsQ0FBcEMsRUFBdUMsQ0FBdkMsRUFBMENTLE9BQTFDO0FBQ0gsV0FGRCxFQXBESCxDQXVERztBQUNBO0FBQ0E7QUFDQTs7QUExREgsZ0JBMkRPMUYsSUFBSSxDQUFDNkYsWUFBTCxJQUFxQixLQTNENUI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxpQkE0RFdDLGVBQWUsQ0FBQzNFLEdBQUQsRUFBTW9CLFdBQU4sRUFBbUJzQyxVQUFuQixFQUErQk0sS0FBL0IsRUFBc0NuRixJQUF0QyxFQUE0Q0MsT0FBNUMsQ0E1RDFCOztBQUFBO0FBNkRLLGNBQUlnRixPQUFPLElBQUksT0FBZixFQUF3QjtBQUN0QmpGLFlBQUFBLElBQUksQ0FBQzZGLFlBQUwsR0FBb0IsSUFBcEI7QUFDRCxXQUZELE1BR0s7QUFDSDdGLFlBQUFBLElBQUksQ0FBQzJFLFFBQUw7QUFDRDs7QUFsRU47QUFBQTs7QUFBQTtBQXNFSzNFLFVBQUFBLElBQUksQ0FBQzJFLFFBQUw7O0FBdEVMO0FBQUE7QUFBQTs7QUFBQTtBQTJFRzNFLFVBQUFBLElBQUksQ0FBQzJFLFFBQUw7O0FBM0VIO0FBQUE7QUFBQTs7QUFBQTtBQStFQ3JELFVBQUFBLElBQUksQ0FBQ2QsT0FBRCxFQUFTLGtCQUFULENBQUo7QUFDQVIsVUFBQUEsSUFBSSxDQUFDMkUsUUFBTDs7QUFoRkQ7QUFBQTtBQUFBOztBQUFBO0FBb0ZEckQsVUFBQUEsSUFBSSxDQUFDZCxPQUFELEVBQVMsWUFBVCxDQUFKO0FBQ0FSLFVBQUFBLElBQUksQ0FBQzJFLFFBQUw7O0FBckZDO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUF5RkgzRSxVQUFBQSxJQUFJLENBQUMyRSxRQUFMO0FBekZHLGdCQTBGRyxZQUFZLFlBQUV2QyxRQUFGLEVBMUZmOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOzs7O0FBK0ZBLFNBQVMyRCxLQUFULENBQWVDLEtBQWYsRUFBc0JoRyxJQUF0QixFQUE0QkMsT0FBNUIsRUFBcUM7QUFDMUMsTUFBSTtBQUNGLFFBQUlPLE9BQU8sR0FBR1AsT0FBTyxDQUFDTyxPQUF0QjtBQUNBLFFBQUlOLFNBQVMsR0FBR0QsT0FBTyxDQUFDQyxTQUF4QjtBQUNBb0IsSUFBQUEsSUFBSSxDQUFDZCxPQUFELEVBQVMsZ0JBQVQsQ0FBSjs7QUFDQSxRQUFJd0YsS0FBSyxDQUFDekQsV0FBTixDQUFrQjBELE1BQWxCLElBQTRCRCxLQUFLLENBQUN6RCxXQUFOLENBQWtCMEQsTUFBbEIsQ0FBeUJDLE1BQXpELEVBQWlFO0FBQ2pFO0FBQ0UsWUFBSUMsS0FBSyxHQUFHcEcsT0FBTyxDQUFDLE9BQUQsQ0FBbkI7O0FBQ0EwRCxRQUFBQSxPQUFPLENBQUM1QixHQUFSLENBQVlzRSxLQUFLLENBQUNDLEdBQU4sQ0FBVSw0Q0FBVixDQUFaO0FBQ0EzQyxRQUFBQSxPQUFPLENBQUM1QixHQUFSLENBQVltRSxLQUFLLENBQUN6RCxXQUFOLENBQWtCMEQsTUFBbEIsQ0FBeUIsQ0FBekIsQ0FBWjtBQUNBeEMsUUFBQUEsT0FBTyxDQUFDNUIsR0FBUixDQUFZc0UsS0FBSyxDQUFDQyxHQUFOLENBQVUsNENBQVYsQ0FBWixFQUpGLENBS0U7QUFDRCxPQVhDLENBYUY7OztBQUNBLFFBQUlwRyxJQUFJLENBQUMwQixVQUFMLElBQW1CLElBQW5CLElBQTJCekIsT0FBTyxDQUFDTSxTQUFSLElBQXFCLElBQWhELElBQXdETCxTQUFTLElBQUksU0FBekUsRUFBb0Y7QUFDbEZILE1BQUFBLE9BQU8sQ0FBRSxLQUFJRSxPQUFPLENBQUNDLFNBQVUsTUFBeEIsQ0FBUCxDQUFzQ21HLE1BQXRDLENBQTZDckcsSUFBN0MsRUFBbURDLE9BQW5EO0FBQ0Q7O0FBQ0QsUUFBSTtBQUNGLFVBQUdBLE9BQU8sQ0FBQzBCLE9BQVIsSUFBbUIsS0FBbkIsSUFBNEIxQixPQUFPLENBQUMyQixLQUFSLElBQWlCLEtBQTdDLElBQXNENUIsSUFBSSxDQUFDMEIsVUFBTCxJQUFtQixLQUE1RSxFQUFtRjtBQUNqRixZQUFJMUIsSUFBSSxDQUFDc0csWUFBTCxJQUFxQixDQUF6QixFQUE0QjtBQUMxQixjQUFJQyxHQUFHLEdBQUcsc0JBQXNCdEcsT0FBTyxDQUFDdUcsSUFBeEM7O0FBQ0F6RyxVQUFBQSxPQUFPLENBQUMsY0FBRCxDQUFQLENBQXdCOEIsR0FBeEIsQ0FBNEI3QixJQUFJLENBQUNtQixHQUFqQyxFQUF1QyxzQkFBcUJvRixHQUFJLEVBQWhFOztBQUNBdkcsVUFBQUEsSUFBSSxDQUFDc0csWUFBTDs7QUFDQSxnQkFBTUcsR0FBRyxHQUFHMUcsT0FBTyxDQUFDLEtBQUQsQ0FBbkI7O0FBQ0EwRyxVQUFBQSxHQUFHLENBQUNGLEdBQUQsQ0FBSDtBQUNEO0FBQ0Y7QUFDRixLQVZELENBV0EsT0FBT3BFLENBQVAsRUFBVTtBQUNSc0IsTUFBQUEsT0FBTyxDQUFDNUIsR0FBUixDQUFZTSxDQUFaO0FBQ0Q7O0FBQ0QsUUFBSW5DLElBQUksQ0FBQ2dDLFNBQUwsSUFBa0IsUUFBdEIsRUFBZ0M7QUFDOUIsVUFBSWhDLElBQUksQ0FBQzBCLFVBQUwsSUFBbUIsSUFBdkIsRUFBNkI7QUFDM0IzQixRQUFBQSxPQUFPLENBQUMsY0FBRCxDQUFQLENBQXdCOEIsR0FBeEIsQ0FBNEI3QixJQUFJLENBQUNtQixHQUFqQyxFQUF1QywrQkFBOEJqQixTQUFVLEVBQS9FO0FBQ0QsT0FGRCxNQUdLLElBQUlGLElBQUksQ0FBQ3FCLE9BQUwsSUFBZ0IsSUFBcEIsRUFBMEI7QUFDN0J0QixRQUFBQSxPQUFPLENBQUMsY0FBRCxDQUFQLENBQXdCOEIsR0FBeEIsQ0FBNEI3QixJQUFJLENBQUNtQixHQUFqQyxFQUF1Qyw0QkFBMkJqQixTQUFVLEVBQTVFO0FBQ0QsT0FGSSxNQUdBO0FBQ0hILFFBQUFBLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0I4QixHQUF4QixDQUE0QjdCLElBQUksQ0FBQ21CLEdBQWpDLEVBQXVDLGdDQUErQmpCLFNBQVUsRUFBaEY7QUFDRDtBQUNGOztBQUNELFFBQUlGLElBQUksQ0FBQ2dDLFNBQUwsSUFBa0IsUUFBdEIsRUFBZ0M7QUFDOUIsVUFBR2hDLElBQUksQ0FBQ3FCLE9BQUwsSUFBZ0IsSUFBbkIsRUFBd0I7QUFDdEJ0QixRQUFBQSxPQUFPLENBQUMsY0FBRCxDQUFQLENBQXdCOEIsR0FBeEIsQ0FBNEI3QixJQUFJLENBQUNtQixHQUFqQyxFQUF1Qyw0QkFBMkJqQixTQUFVLEVBQTVFO0FBQ0Q7O0FBQ0RILE1BQUFBLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0I4QixHQUF4QixDQUE0QjdCLElBQUksQ0FBQ21CLEdBQWpDLEVBQXVDLCtCQUE4QmpCLFNBQVUsRUFBL0U7QUFDRDtBQUNGLEdBaERELENBaURBLE9BQU1pQyxDQUFOLEVBQVM7QUFDWDtBQUNJLFVBQU0sWUFBWUEsQ0FBQyxDQUFDQyxRQUFGLEVBQWxCO0FBQ0Q7QUFDRixDLENBRUQ7OztBQUNPLFNBQVM0QyxnQkFBVCxDQUEwQjdELEdBQTFCLEVBQStCbkIsSUFBL0IsRUFBcUNDLE9BQXJDLEVBQThDeUcsTUFBOUMsRUFBc0RuRSxXQUF0RCxFQUFtRTtBQUN4RSxNQUFJO0FBQ0YsUUFBSS9CLE9BQU8sR0FBR1AsT0FBTyxDQUFDTyxPQUF0QjtBQUNBLFFBQUltRyxRQUFRLEdBQUcxRyxPQUFPLENBQUMwRyxRQUF2QjtBQUNBLFFBQUlDLE9BQU8sR0FBRzNHLE9BQU8sQ0FBQzJHLE9BQXRCO0FBQ0EsUUFBSUMsS0FBSyxHQUFHNUcsT0FBTyxDQUFDNEcsS0FBcEI7QUFDQXZGLElBQUFBLElBQUksQ0FBQ2QsT0FBRCxFQUFTLDJCQUFULENBQUo7O0FBQ0EsVUFBTXNHLE1BQU0sR0FBRy9HLE9BQU8sQ0FBQyxRQUFELENBQXRCOztBQUNBLFVBQU1nSCxNQUFNLEdBQUdoSCxPQUFPLENBQUMsUUFBRCxDQUF0Qjs7QUFDQSxVQUFNaUgsR0FBRyxHQUFHakgsT0FBTyxDQUFDLFVBQUQsQ0FBbkI7O0FBQ0EsVUFBTUQsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxVQUFNaUUsSUFBSSxHQUFHakUsT0FBTyxDQUFDLE1BQUQsQ0FBcEI7O0FBQ0E4RyxJQUFBQSxLQUFLLEdBQUdBLEtBQUssS0FBS0QsT0FBTyxLQUFLLFNBQVosR0FBd0IsY0FBeEIsR0FBeUMsZ0JBQTlDLENBQWI7QUFDQXRGLElBQUFBLElBQUksQ0FBQ2QsT0FBRCxFQUFTLGdCQUFnQlIsSUFBSSxDQUFDaUgsU0FBOUIsQ0FBSjs7QUFDQSxRQUFJakgsSUFBSSxDQUFDaUgsU0FBVCxFQUFvQjtBQUNsQkgsTUFBQUEsTUFBTSxDQUFDSSxJQUFQLENBQVlSLE1BQVo7QUFDQUssTUFBQUEsTUFBTSxDQUFDRyxJQUFQLENBQVlSLE1BQVo7O0FBQ0EsWUFBTVMsUUFBUSxHQUFHcEgsT0FBTyxDQUFDLGFBQUQsQ0FBUCxDQUF1Qm9ILFFBQXhDOztBQUNBLFlBQU1DLGFBQWEsR0FBR3JILE9BQU8sQ0FBQyxhQUFELENBQVAsQ0FBdUJxSCxhQUE3Qzs7QUFDQSxZQUFNQyxtQkFBbUIsR0FBR3RILE9BQU8sQ0FBQyxhQUFELENBQVAsQ0FBdUJzSCxtQkFBbkQ7O0FBQ0EsWUFBTUMsc0JBQXNCLEdBQUd2SCxPQUFPLENBQUMsYUFBRCxDQUFQLENBQXVCdUgsc0JBQXREOztBQUNBeEgsTUFBQUEsRUFBRSxDQUFDeUgsYUFBSCxDQUFpQnZELElBQUksQ0FBQ0UsSUFBTCxDQUFVd0MsTUFBVixFQUFrQixXQUFsQixDQUFqQixFQUFpRFMsUUFBUSxDQUFDbkgsSUFBSSxDQUFDMEIsVUFBTixFQUFrQnpCLE9BQWxCLEVBQTJCeUcsTUFBM0IsQ0FBekQsRUFBNkYsTUFBN0Y7QUFDQTVHLE1BQUFBLEVBQUUsQ0FBQ3lILGFBQUgsQ0FBaUJ2RCxJQUFJLENBQUNFLElBQUwsQ0FBVXdDLE1BQVYsRUFBa0IsVUFBbEIsQ0FBakIsRUFBZ0RVLGFBQWEsQ0FBQ1AsS0FBRCxFQUFRRixRQUFSLEVBQWtCQyxPQUFsQixFQUEyQjNHLE9BQTNCLEVBQW9DeUcsTUFBcEMsQ0FBN0QsRUFBMEcsTUFBMUc7QUFDQTVHLE1BQUFBLEVBQUUsQ0FBQ3lILGFBQUgsQ0FBaUJ2RCxJQUFJLENBQUNFLElBQUwsQ0FBVXdDLE1BQVYsRUFBa0Isc0JBQWxCLENBQWpCLEVBQTREWSxzQkFBc0IsQ0FBQ3JILE9BQUQsRUFBVXlHLE1BQVYsQ0FBbEYsRUFBcUcsTUFBckc7QUFDQTVHLE1BQUFBLEVBQUUsQ0FBQ3lILGFBQUgsQ0FBaUJ2RCxJQUFJLENBQUNFLElBQUwsQ0FBVXdDLE1BQVYsRUFBa0IsZ0JBQWxCLENBQWpCLEVBQXNEVyxtQkFBbUIsQ0FBQ3BILE9BQUQsRUFBVXlHLE1BQVYsQ0FBekUsRUFBNEYsTUFBNUY7QUFDQSxVQUFJeEcsU0FBUyxHQUFHRixJQUFJLENBQUNFLFNBQXJCLENBWGtCLENBWWxCOztBQUNBLFVBQUlKLEVBQUUsQ0FBQ2MsVUFBSCxDQUFjb0QsSUFBSSxDQUFDRSxJQUFMLENBQVVzRCxPQUFPLENBQUNDLEdBQVIsRUFBVixFQUF5QixPQUFNdkgsU0FBVSxNQUF6QyxDQUFkLENBQUosRUFBb0U7QUFDbEUsWUFBSXdILFFBQVEsR0FBRzFELElBQUksQ0FBQ0UsSUFBTCxDQUFVc0QsT0FBTyxDQUFDQyxHQUFSLEVBQVYsRUFBMEIsT0FBTXZILFNBQVUsTUFBMUMsQ0FBZjtBQUNBLFlBQUl5SCxNQUFNLEdBQUczRCxJQUFJLENBQUNFLElBQUwsQ0FBVXdDLE1BQVYsRUFBa0IsSUFBbEIsQ0FBYjtBQUNBTSxRQUFBQSxHQUFHLENBQUNZLFFBQUosQ0FBYUYsUUFBYixFQUF1QkMsTUFBdkI7QUFDQTlGLFFBQUFBLEdBQUcsQ0FBQ1YsR0FBRCxFQUFNLGtCQUFrQnVHLFFBQVEsQ0FBQ0csT0FBVCxDQUFpQkwsT0FBTyxDQUFDQyxHQUFSLEVBQWpCLEVBQWdDLEVBQWhDLENBQWxCLEdBQXdELE9BQXhELEdBQWtFRSxNQUFNLENBQUNFLE9BQVAsQ0FBZUwsT0FBTyxDQUFDQyxHQUFSLEVBQWYsRUFBOEIsRUFBOUIsQ0FBeEUsQ0FBSDtBQUNEOztBQUNELFVBQUkzSCxFQUFFLENBQUNjLFVBQUgsQ0FBY29ELElBQUksQ0FBQ0UsSUFBTCxDQUFVc0QsT0FBTyxDQUFDQyxHQUFSLEVBQVYsRUFBeUIsT0FBTXZILFNBQVUsWUFBekMsQ0FBZCxDQUFKLEVBQTBFO0FBQ3hFLFlBQUl3SCxRQUFRLEdBQUcxRCxJQUFJLENBQUNFLElBQUwsQ0FBVXNELE9BQU8sQ0FBQ0MsR0FBUixFQUFWLEVBQTBCLE9BQU12SCxTQUFVLFlBQTFDLENBQWY7QUFDQSxZQUFJeUgsTUFBTSxHQUFHM0QsSUFBSSxDQUFDRSxJQUFMLENBQVV3QyxNQUFWLEVBQWtCLFVBQWxCLENBQWI7QUFDQU0sUUFBQUEsR0FBRyxDQUFDWSxRQUFKLENBQWFGLFFBQWIsRUFBdUJDLE1BQXZCO0FBQ0E5RixRQUFBQSxHQUFHLENBQUNWLEdBQUQsRUFBTSxhQUFhdUcsUUFBUSxDQUFDRyxPQUFULENBQWlCTCxPQUFPLENBQUNDLEdBQVIsRUFBakIsRUFBZ0MsRUFBaEMsQ0FBYixHQUFtRCxPQUFuRCxHQUE2REUsTUFBTSxDQUFDRSxPQUFQLENBQWVMLE9BQU8sQ0FBQ0MsR0FBUixFQUFmLEVBQThCLEVBQTlCLENBQW5FLENBQUg7QUFDRDs7QUFDRCxVQUFJM0gsRUFBRSxDQUFDYyxVQUFILENBQWNvRCxJQUFJLENBQUNFLElBQUwsQ0FBVXNELE9BQU8sQ0FBQ0MsR0FBUixFQUFWLEVBQXlCLE9BQU12SCxTQUFVLGFBQXpDLENBQWQsQ0FBSixFQUEyRTtBQUN6RSxZQUFJd0gsUUFBUSxHQUFHMUQsSUFBSSxDQUFDRSxJQUFMLENBQVVzRCxPQUFPLENBQUNDLEdBQVIsRUFBVixFQUEwQixPQUFNdkgsU0FBVSxhQUExQyxDQUFmO0FBQ0EsWUFBSXlILE1BQU0sR0FBRzNELElBQUksQ0FBQ0UsSUFBTCxDQUFVd0MsTUFBVixFQUFrQixXQUFsQixDQUFiO0FBQ0FNLFFBQUFBLEdBQUcsQ0FBQ1ksUUFBSixDQUFhRixRQUFiLEVBQXVCQyxNQUF2QjtBQUNBOUYsUUFBQUEsR0FBRyxDQUFDVixHQUFELEVBQU0sYUFBYXVHLFFBQVEsQ0FBQ0csT0FBVCxDQUFpQkwsT0FBTyxDQUFDQyxHQUFSLEVBQWpCLEVBQWdDLEVBQWhDLENBQWIsR0FBbUQsT0FBbkQsR0FBNkRFLE1BQU0sQ0FBQ0UsT0FBUCxDQUFlTCxPQUFPLENBQUNDLEdBQVIsRUFBZixFQUE4QixFQUE5QixDQUFuRSxDQUFIO0FBQ0Q7O0FBQ0QsVUFBSTNILEVBQUUsQ0FBQ2MsVUFBSCxDQUFjb0QsSUFBSSxDQUFDRSxJQUFMLENBQVVzRCxPQUFPLENBQUNDLEdBQVIsRUFBVixFQUF3QixZQUF4QixDQUFkLENBQUosRUFBMEQ7QUFDeEQsWUFBSUssYUFBYSxHQUFHOUQsSUFBSSxDQUFDRSxJQUFMLENBQVVzRCxPQUFPLENBQUNDLEdBQVIsRUFBVixFQUF5QixZQUF6QixDQUFwQjtBQUNBLFlBQUlNLFdBQVcsR0FBRy9ELElBQUksQ0FBQ0UsSUFBTCxDQUFVd0MsTUFBVixFQUFrQixjQUFsQixDQUFsQjtBQUNBTSxRQUFBQSxHQUFHLENBQUNZLFFBQUosQ0FBYUUsYUFBYixFQUE0QkMsV0FBNUI7QUFDQWxHLFFBQUFBLEdBQUcsQ0FBQ1YsR0FBRCxFQUFNLGFBQWEyRyxhQUFhLENBQUNELE9BQWQsQ0FBc0JMLE9BQU8sQ0FBQ0MsR0FBUixFQUF0QixFQUFxQyxFQUFyQyxDQUFiLEdBQXdELE9BQXhELEdBQWtFTSxXQUFXLENBQUNGLE9BQVosQ0FBb0JMLE9BQU8sQ0FBQ0MsR0FBUixFQUFwQixFQUFtQyxFQUFuQyxDQUF4RSxDQUFIO0FBQ0Q7QUFDRjs7QUFDRHpILElBQUFBLElBQUksQ0FBQ2lILFNBQUwsR0FBaUIsS0FBakI7QUFDQSxRQUFJM0MsRUFBRSxHQUFHLEVBQVQ7O0FBQ0EsUUFBSXRFLElBQUksQ0FBQzBCLFVBQVQsRUFBcUI7QUFDbkIxQixNQUFBQSxJQUFJLENBQUN1RCxJQUFMLEdBQVl2RCxJQUFJLENBQUN1RCxJQUFMLENBQVV5RSxNQUFWLENBQWlCLFVBQVNDLEtBQVQsRUFBZ0JDLEtBQWhCLEVBQXNCO0FBQUUsZUFBT2xJLElBQUksQ0FBQ3VELElBQUwsQ0FBVXFDLE9BQVYsQ0FBa0JxQyxLQUFsQixLQUE0QkMsS0FBbkM7QUFBMEMsT0FBbkYsQ0FBWjtBQUNBNUQsTUFBQUEsRUFBRSxHQUFHdEUsSUFBSSxDQUFDdUQsSUFBTCxDQUFVVyxJQUFWLENBQWUsS0FBZixDQUFMO0FBQ0QsS0FIRCxNQUlLO0FBQ0hJLE1BQUFBLEVBQUUsR0FBSSw2Q0FBTjtBQUNEOztBQUNEQSxJQUFBQSxFQUFFLEdBQUksNkNBQU4sQ0E1REUsQ0E0RGtEOztBQUNwRCxRQUFJdEUsSUFBSSxDQUFDbUksUUFBTCxLQUFrQixJQUFsQixJQUEwQjdELEVBQUUsS0FBS3RFLElBQUksQ0FBQ21JLFFBQTFDLEVBQW9EO0FBQ2xEbkksTUFBQUEsSUFBSSxDQUFDbUksUUFBTCxHQUFnQjdELEVBQUUsR0FBRyxxQ0FBckI7QUFDQSxZQUFNNkQsUUFBUSxHQUFHbkUsSUFBSSxDQUFDRSxJQUFMLENBQVV3QyxNQUFWLEVBQWtCLGFBQWxCLENBQWpCO0FBQ0E1RyxNQUFBQSxFQUFFLENBQUN5SCxhQUFILENBQWlCWSxRQUFqQixFQUEyQm5JLElBQUksQ0FBQ21JLFFBQWhDLEVBQTBDLE1BQTFDO0FBQ0FuSSxNQUFBQSxJQUFJLENBQUNrRixPQUFMLEdBQWUsSUFBZjtBQUNBLFVBQUlrRCxTQUFTLEdBQUcxQixNQUFNLENBQUNtQixPQUFQLENBQWVMLE9BQU8sQ0FBQ0MsR0FBUixFQUFmLEVBQThCLEVBQTlCLENBQWhCOztBQUNBLFVBQUlXLFNBQVMsQ0FBQ0MsSUFBVixNQUFvQixFQUF4QixFQUE0QjtBQUFDRCxRQUFBQSxTQUFTLEdBQUcsSUFBWjtBQUFpQjs7QUFDOUN2RyxNQUFBQSxHQUFHLENBQUNWLEdBQUQsRUFBTSw2QkFBNkJpSCxTQUFuQyxDQUFIO0FBQ0QsS0FSRCxNQVNLO0FBQ0hwSSxNQUFBQSxJQUFJLENBQUNrRixPQUFMLEdBQWUsS0FBZjtBQUNBckQsTUFBQUEsR0FBRyxDQUFDVixHQUFELEVBQU0sd0JBQU4sQ0FBSDtBQUNEO0FBQ0YsR0ExRUQsQ0EyRUEsT0FBTWdCLENBQU4sRUFBUztBQUNQcEMsSUFBQUEsT0FBTyxDQUFDLGNBQUQsQ0FBUCxDQUF3QnVCLElBQXhCLENBQTZCckIsT0FBTyxDQUFDTyxPQUFyQyxFQUE2QzJCLENBQTdDOztBQUNBSSxJQUFBQSxXQUFXLENBQUMwRCxNQUFaLENBQW1CNUYsSUFBbkIsQ0FBd0IsdUJBQXVCOEIsQ0FBL0M7QUFDRDtBQUNGLEMsQ0FFRDs7O0FBQ08sU0FBUzJELGVBQVQsQ0FBeUIzRSxHQUF6QixFQUE4Qm9CLFdBQTlCLEVBQTJDc0MsVUFBM0MsRUFBdURNLEtBQXZELEVBQThEbkYsSUFBOUQsRUFBb0VDLE9BQXBFLEVBQTZFO0FBQ2xGLE1BQUlPLE9BQU8sR0FBR1AsT0FBTyxDQUFDTyxPQUF0Qjs7QUFDQSxRQUFNVixFQUFFLEdBQUdDLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBdUIsRUFBQUEsSUFBSSxDQUFDZCxPQUFELEVBQVMsMEJBQVQsQ0FBSjtBQUNBLE1BQUk4SCxNQUFKOztBQUFZLE1BQUk7QUFBRUEsSUFBQUEsTUFBTSxHQUFHdkksT0FBTyxDQUFDLGFBQUQsQ0FBaEI7QUFBaUMsR0FBdkMsQ0FBd0MsT0FBT29DLENBQVAsRUFBVTtBQUFFbUcsSUFBQUEsTUFBTSxHQUFHLFFBQVQ7QUFBbUI7O0FBQ25GLE1BQUl4SSxFQUFFLENBQUNjLFVBQUgsQ0FBYzBILE1BQWQsQ0FBSixFQUEyQjtBQUN6QmhILElBQUFBLElBQUksQ0FBQ2QsT0FBRCxFQUFTLHNCQUFULENBQUo7QUFDRCxHQUZELE1BR0s7QUFDSGMsSUFBQUEsSUFBSSxDQUFDZCxPQUFELEVBQVMsOEJBQVQsQ0FBSjtBQUNEOztBQUNELFNBQU8sSUFBSStILE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDdEMsVUFBTUMsV0FBVyxHQUFHLE1BQU07QUFDeEJwSCxNQUFBQSxJQUFJLENBQUNkLE9BQUQsRUFBUyxhQUFULENBQUo7QUFDQWdJLE1BQUFBLE9BQU87QUFDUixLQUhEOztBQUlBLFFBQUlHLElBQUksR0FBRztBQUFFbEIsTUFBQUEsR0FBRyxFQUFFNUMsVUFBUDtBQUFtQitELE1BQUFBLE1BQU0sRUFBRSxJQUEzQjtBQUFpQ0MsTUFBQUEsS0FBSyxFQUFFLE1BQXhDO0FBQWdEQyxNQUFBQSxRQUFRLEVBQUU7QUFBMUQsS0FBWDs7QUFDQUMsSUFBQUEsYUFBYSxDQUFDNUgsR0FBRCxFQUFNbUgsTUFBTixFQUFjbkQsS0FBZCxFQUFxQndELElBQXJCLEVBQTJCcEcsV0FBM0IsRUFBd0N2QyxJQUF4QyxFQUE4Q0MsT0FBOUMsQ0FBYixDQUFvRStJLElBQXBFLENBQ0UsWUFBVztBQUFFTixNQUFBQSxXQUFXO0FBQUksS0FEOUIsRUFFRSxVQUFTTyxNQUFULEVBQWlCO0FBQUVSLE1BQUFBLE1BQU0sQ0FBQ1EsTUFBRCxDQUFOO0FBQWdCLEtBRnJDO0FBSUQsR0FWTSxDQUFQO0FBV0QsQyxDQUVEOzs7U0FDc0JGLGE7O0VBZ0Z0Qjs7OzsyRUFoRk8sa0JBQThCNUgsR0FBOUIsRUFBbUM4RCxPQUFuQyxFQUE0Q0UsS0FBNUMsRUFBbUR3RCxJQUFuRCxFQUF5RHBHLFdBQXpELEVBQXNFdkMsSUFBdEUsRUFBNEVDLE9BQTVFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRE8sVUFBQUEsT0FEQyxHQUNTUCxPQUFPLENBQUNPLE9BRGpCO0FBRUROLFVBQUFBLFNBRkMsR0FFV0QsT0FBTyxDQUFDQyxTQUZuQixFQUdMOztBQUNNZ0osVUFBQUEsZUFKRCxHQUltQixDQUFDLGVBQUQsRUFBa0IsZUFBbEIsRUFBbUMsY0FBbkMsRUFBbUQsa0JBQW5ELEVBQXVFLHdCQUF2RSxFQUFpRyw4QkFBakcsRUFBaUksT0FBakksRUFBMEksT0FBMUksRUFBbUosZUFBbkosRUFBb0sscUJBQXBLLEVBQTJMLGVBQTNMLEVBQTRNLHVCQUE1TSxDQUpuQjtBQUtEQyxVQUFBQSxVQUxDLEdBS1lELGVBTFo7QUFNRC9DLFVBQUFBLEtBTkMsR0FNT3BHLE9BQU8sQ0FBQyxPQUFELENBTmQ7QUFPQ3FKLFVBQUFBLFVBUEQsR0FPY3JKLE9BQU8sQ0FBQyx1QkFBRCxDQVByQjtBQVFMdUIsVUFBQUEsSUFBSSxDQUFDZCxPQUFELEVBQVUsd0JBQVYsQ0FBSjtBQVJLO0FBQUEsaUJBU0MsSUFBSStILE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDckNuSCxZQUFBQSxJQUFJLENBQUNkLE9BQUQsRUFBVSxhQUFZeUUsT0FBUSxFQUE5QixDQUFKO0FBQ0EzRCxZQUFBQSxJQUFJLENBQUNkLE9BQUQsRUFBVyxXQUFVMkUsS0FBTSxFQUEzQixDQUFKO0FBQ0E3RCxZQUFBQSxJQUFJLENBQUNkLE9BQUQsRUFBVyxVQUFTSyxJQUFJLENBQUN3SSxTQUFMLENBQWVWLElBQWYsQ0FBcUIsRUFBekMsQ0FBSjtBQUNBM0ksWUFBQUEsSUFBSSxDQUFDc0osS0FBTCxHQUFhRixVQUFVLENBQUNuRSxPQUFELEVBQVVFLEtBQVYsRUFBaUJ3RCxJQUFqQixDQUF2QjtBQUVBM0ksWUFBQUEsSUFBSSxDQUFDc0osS0FBTCxDQUFXQyxFQUFYLENBQWMsT0FBZCxFQUF1QixDQUFDQyxJQUFELEVBQU9DLE1BQVAsS0FBa0I7QUFDdkNuSSxjQUFBQSxJQUFJLENBQUNkLE9BQUQsRUFBVyxZQUFELEdBQWVnSixJQUF6QixDQUFKOztBQUNBLGtCQUFHQSxJQUFJLEtBQUssQ0FBWixFQUFlO0FBQUVoQixnQkFBQUEsT0FBTyxDQUFDLENBQUQsQ0FBUDtBQUFZLGVBQTdCLE1BQ0s7QUFBRWpHLGdCQUFBQSxXQUFXLENBQUMwRCxNQUFaLENBQW1CNUYsSUFBbkIsQ0FBeUIsSUFBSXFKLEtBQUosQ0FBVUYsSUFBVixDQUF6QjtBQUE0Q2hCLGdCQUFBQSxPQUFPLENBQUMsQ0FBRCxDQUFQO0FBQVk7QUFDaEUsYUFKRDtBQUtBeEksWUFBQUEsSUFBSSxDQUFDc0osS0FBTCxDQUFXQyxFQUFYLENBQWMsT0FBZCxFQUF3QkksS0FBRCxJQUFXO0FBQ2hDckksY0FBQUEsSUFBSSxDQUFDZCxPQUFELEVBQVcsVUFBWCxDQUFKO0FBQ0ErQixjQUFBQSxXQUFXLENBQUMwRCxNQUFaLENBQW1CNUYsSUFBbkIsQ0FBd0JzSixLQUF4QjtBQUNBbkIsY0FBQUEsT0FBTyxDQUFDLENBQUQsQ0FBUDtBQUNELGFBSkQ7QUFLQXhJLFlBQUFBLElBQUksQ0FBQ3NKLEtBQUwsQ0FBV00sTUFBWCxDQUFrQkwsRUFBbEIsQ0FBcUIsTUFBckIsRUFBOEJ4RixJQUFELElBQVU7QUFDckMsa0JBQUk4RixHQUFHLEdBQUc5RixJQUFJLENBQUMzQixRQUFMLEdBQWdCeUYsT0FBaEIsQ0FBd0IsV0FBeEIsRUFBcUMsR0FBckMsRUFBMENRLElBQTFDLEVBQVY7QUFDQS9HLGNBQUFBLElBQUksQ0FBQ2QsT0FBRCxFQUFXLEdBQUVxSixHQUFJLEVBQWpCLENBQUosQ0FGcUMsQ0FHckM7O0FBQ0Esa0JBQUk5RixJQUFJLElBQUlBLElBQUksQ0FBQzNCLFFBQUwsR0FBZ0JlLEtBQWhCLENBQXNCLDBCQUF0QixDQUFaLEVBQStEO0FBRXJFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFUTBHLGdCQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ2hDLE9BQUosQ0FBWSxPQUFaLEVBQXFCLEVBQXJCLENBQU47QUFDQWdDLGdCQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ2hDLE9BQUosQ0FBWSxPQUFaLEVBQXFCLEVBQXJCLENBQU47QUFDQWdDLGdCQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ2hDLE9BQUosQ0FBWUwsT0FBTyxDQUFDQyxHQUFSLEVBQVosRUFBMkIsRUFBM0IsRUFBK0JZLElBQS9CLEVBQU47O0FBQ0Esb0JBQUl3QixHQUFHLENBQUNwSSxRQUFKLENBQWEsT0FBYixDQUFKLEVBQTJCO0FBQ3pCYyxrQkFBQUEsV0FBVyxDQUFDMEQsTUFBWixDQUFtQjVGLElBQW5CLENBQXdCYyxHQUFHLEdBQUcwSSxHQUFHLENBQUNoQyxPQUFKLENBQVksYUFBWixFQUEyQixFQUEzQixDQUE5QjtBQUNBZ0Msa0JBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDaEMsT0FBSixDQUFZLE9BQVosRUFBc0IsR0FBRTFCLEtBQUssQ0FBQ0MsR0FBTixDQUFVLE9BQVYsQ0FBbUIsRUFBM0MsQ0FBTjtBQUNEOztBQUNEdkUsZ0JBQUFBLEdBQUcsQ0FBQ1YsR0FBRCxFQUFNMEksR0FBTixDQUFIO0FBRUE3SixnQkFBQUEsSUFBSSxDQUFDMkUsUUFBTDtBQUNBNkQsZ0JBQUFBLE9BQU8sQ0FBQyxDQUFELENBQVA7QUFDRCxlQXpCRCxNQTBCSztBQUNILG9CQUFJVyxVQUFVLENBQUNXLElBQVgsQ0FBZ0IsVUFBU0MsQ0FBVCxFQUFZO0FBQUUseUJBQU9oRyxJQUFJLENBQUM2QixPQUFMLENBQWFtRSxDQUFiLEtBQW1CLENBQTFCO0FBQThCLGlCQUE1RCxDQUFKLEVBQW1FO0FBQ2pFRixrQkFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNoQyxPQUFKLENBQVksT0FBWixFQUFxQixFQUFyQixDQUFOO0FBQ0FnQyxrQkFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNoQyxPQUFKLENBQVksT0FBWixFQUFxQixFQUFyQixDQUFOO0FBQ0FnQyxrQkFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNoQyxPQUFKLENBQVlMLE9BQU8sQ0FBQ0MsR0FBUixFQUFaLEVBQTJCLEVBQTNCLEVBQStCWSxJQUEvQixFQUFOOztBQUNBLHNCQUFJd0IsR0FBRyxDQUFDcEksUUFBSixDQUFhLE9BQWIsQ0FBSixFQUEyQjtBQUN6QmMsb0JBQUFBLFdBQVcsQ0FBQzBELE1BQVosQ0FBbUI1RixJQUFuQixDQUF3QmMsR0FBRyxHQUFHMEksR0FBRyxDQUFDaEMsT0FBSixDQUFZLGFBQVosRUFBMkIsRUFBM0IsQ0FBOUI7QUFDQWdDLG9CQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ2hDLE9BQUosQ0FBWSxPQUFaLEVBQXNCLEdBQUUxQixLQUFLLENBQUNDLEdBQU4sQ0FBVSxPQUFWLENBQW1CLEVBQTNDLENBQU47QUFDRDs7QUFDRHZFLGtCQUFBQSxHQUFHLENBQUNWLEdBQUQsRUFBTTBJLEdBQU4sQ0FBSDtBQUNEO0FBQ0Y7QUFDRixhQTFDRDtBQTJDQTdKLFlBQUFBLElBQUksQ0FBQ3NKLEtBQUwsQ0FBV1UsTUFBWCxDQUFrQlQsRUFBbEIsQ0FBcUIsTUFBckIsRUFBOEJ4RixJQUFELElBQVU7QUFDckN6QyxjQUFBQSxJQUFJLENBQUNyQixPQUFELEVBQVcsa0JBQUQsR0FBcUI4RCxJQUEvQixDQUFKO0FBQ0Esa0JBQUk4RixHQUFHLEdBQUc5RixJQUFJLENBQUMzQixRQUFMLEdBQWdCeUYsT0FBaEIsQ0FBd0IsV0FBeEIsRUFBcUMsR0FBckMsRUFBMENRLElBQTFDLEVBQVY7QUFDQSxrQkFBSTRCLFdBQVcsR0FBRyx5QkFBbEI7QUFDQSxrQkFBSXhJLFFBQVEsR0FBR29JLEdBQUcsQ0FBQ3BJLFFBQUosQ0FBYXdJLFdBQWIsQ0FBZjs7QUFDQSxrQkFBSSxDQUFDeEksUUFBTCxFQUFlO0FBQ2JnQyxnQkFBQUEsT0FBTyxDQUFDNUIsR0FBUixDQUFhLEdBQUVWLEdBQUksSUFBR2dGLEtBQUssQ0FBQ0MsR0FBTixDQUFVLE9BQVYsQ0FBbUIsSUFBR3lELEdBQUksRUFBaEQ7QUFDRDtBQUNGLGFBUkQ7QUFTRCxXQXBFSyxDQVREOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOzs7O0FBaUZQLFNBQVNwSCxTQUFULENBQW1CeUgsVUFBbkIsRUFBK0J2RixRQUEvQixFQUF5QztBQUN2QyxNQUFJd0YsWUFBWSxHQUFHcEssT0FBTyxDQUFDLGVBQUQsQ0FBMUIsQ0FEdUMsQ0FFdkM7OztBQUNBLE1BQUlxSyxPQUFPLEdBQUcsS0FBZDtBQUNBLE1BQUk1QyxPQUFPLEdBQUcyQyxZQUFZLENBQUNFLElBQWIsQ0FBa0JILFVBQWxCLEVBQThCLEVBQTlCLEVBQWtDO0FBQUVJLElBQUFBLFFBQVEsRUFBRyxDQUFDLGFBQUQ7QUFBYixHQUFsQyxDQUFkLENBSnVDLENBS3ZDOztBQUNBOUMsRUFBQUEsT0FBTyxDQUFDK0IsRUFBUixDQUFXLE9BQVgsRUFBb0IsVUFBVTdHLEdBQVYsRUFBZTtBQUNqQyxRQUFJMEgsT0FBSixFQUFhO0FBQ2JBLElBQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0F6RixJQUFBQSxRQUFRLENBQUNqQyxHQUFELENBQVI7QUFDRCxHQUpELEVBTnVDLENBV3ZDOztBQUNBOEUsRUFBQUEsT0FBTyxDQUFDK0IsRUFBUixDQUFXLE1BQVgsRUFBbUIsVUFBVUMsSUFBVixFQUFnQjtBQUNqQyxRQUFJWSxPQUFKLEVBQWE7QUFDYkEsSUFBQUEsT0FBTyxHQUFHLElBQVY7QUFDQSxRQUFJMUgsR0FBRyxHQUFHOEcsSUFBSSxLQUFLLENBQVQsR0FBYSxJQUFiLEdBQW9CLElBQUlFLEtBQUosQ0FBVSxlQUFlRixJQUF6QixDQUE5QjtBQUNBN0UsSUFBQUEsUUFBUSxDQUFDakMsR0FBRCxDQUFSO0FBQ0QsR0FMRDtBQU1ELEMsQ0FFRDs7O0FBQ08sU0FBUzZILFFBQVQsQ0FBa0JWLEdBQWxCLEVBQXVCO0FBQzVCLFNBQU9BLEdBQUcsQ0FBQ3ZHLFdBQUosR0FBa0J1RSxPQUFsQixDQUEwQixJQUExQixFQUFnQyxHQUFoQyxDQUFQO0FBQ0QsQyxDQUVEOzs7QUFDTyxTQUFTekcsT0FBVCxHQUFtQjtBQUN4QixNQUFJK0UsS0FBSyxHQUFHcEcsT0FBTyxDQUFDLE9BQUQsQ0FBbkI7O0FBQ0EsTUFBSXlLLE1BQU0sR0FBSSxFQUFkOztBQUNBLFFBQU1DLFFBQVEsR0FBRzFLLE9BQU8sQ0FBQyxJQUFELENBQVAsQ0FBYzBLLFFBQWQsRUFBakI7O0FBQ0EsTUFBSUEsUUFBUSxJQUFJLFFBQWhCLEVBQTBCO0FBQUVELElBQUFBLE1BQU0sR0FBSSxVQUFWO0FBQXFCLEdBQWpELE1BQ0s7QUFBRUEsSUFBQUEsTUFBTSxHQUFJLFVBQVY7QUFBcUI7O0FBQzVCLFNBQVEsR0FBRXJFLEtBQUssQ0FBQ3VFLEtBQU4sQ0FBWUYsTUFBWixDQUFvQixHQUE5QjtBQUNELEMsQ0FFRDs7O0FBQ08sU0FBUzFJLFlBQVQsQ0FBc0JaLFVBQXRCLEVBQWtDeUosYUFBbEMsRUFBaUQ7QUFDeEQsTUFBSTtBQUNGLFVBQU0zRyxJQUFJLEdBQUdqRSxPQUFPLENBQUMsTUFBRCxDQUFwQjs7QUFDQSxVQUFNRCxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBLFFBQUlnSyxDQUFDLEdBQUcsRUFBUjtBQUNBLFFBQUlhLGFBQWEsR0FBRyxLQUFwQjtBQUVBYixJQUFBQSxDQUFDLENBQUNjLGFBQUYsR0FBa0IsS0FBbEI7QUFDQWQsSUFBQUEsQ0FBQyxDQUFDZSxVQUFGLEdBQWUsS0FBZjtBQUNBZixJQUFBQSxDQUFDLENBQUNnQixPQUFGLEdBQVksS0FBWjtBQUNBaEIsSUFBQUEsQ0FBQyxDQUFDaUIsVUFBRixHQUFlLEtBQWY7QUFDQWpCLElBQUFBLENBQUMsQ0FBQ2tCLGNBQUYsR0FBbUIsS0FBbkI7QUFFQSxRQUFJQyxVQUFVLEdBQUdsSCxJQUFJLENBQUN3RSxPQUFMLENBQWFoQixPQUFPLENBQUNDLEdBQVIsRUFBYixFQUEyQixzQkFBM0IsRUFBbUR2RyxVQUFuRCxDQUFqQjtBQUNBLFFBQUlpSyxTQUFTLEdBQUlyTCxFQUFFLENBQUNjLFVBQUgsQ0FBY3NLLFVBQVUsR0FBQyxlQUF6QixLQUE2Q3JLLElBQUksQ0FBQ0MsS0FBTCxDQUFXaEIsRUFBRSxDQUFDaUIsWUFBSCxDQUFnQm1LLFVBQVUsR0FBQyxlQUEzQixFQUE0QyxPQUE1QyxDQUFYLENBQTdDLElBQWlILEVBQWxJO0FBQ0FuQixJQUFBQSxDQUFDLENBQUNjLGFBQUYsR0FBa0JNLFNBQVMsQ0FBQ0MsT0FBNUI7QUFDQXJCLElBQUFBLENBQUMsQ0FBQ3NCLFNBQUYsR0FBY0YsU0FBUyxDQUFDRSxTQUF4Qjs7QUFDQSxRQUFJdEIsQ0FBQyxDQUFDc0IsU0FBRixJQUFlbEwsU0FBbkIsRUFBOEI7QUFDNUI0SixNQUFBQSxDQUFDLENBQUNnQixPQUFGLEdBQWEsWUFBYjtBQUNELEtBRkQsTUFHSztBQUNILFVBQUksQ0FBQyxDQUFELElBQU1oQixDQUFDLENBQUNzQixTQUFGLENBQVl6RixPQUFaLENBQW9CLFdBQXBCLENBQVYsRUFBNEM7QUFDMUNtRSxRQUFBQSxDQUFDLENBQUNnQixPQUFGLEdBQWEsWUFBYjtBQUNELE9BRkQsTUFHSztBQUNIaEIsUUFBQUEsQ0FBQyxDQUFDZ0IsT0FBRixHQUFhLFdBQWI7QUFDRDtBQUNGOztBQUNELFFBQUlPLFdBQVcsR0FBR3RILElBQUksQ0FBQ3dFLE9BQUwsQ0FBYWhCLE9BQU8sQ0FBQ0MsR0FBUixFQUFiLEVBQTJCLHNCQUEzQixDQUFsQjtBQUNBLFFBQUk4RCxVQUFVLEdBQUl6TCxFQUFFLENBQUNjLFVBQUgsQ0FBYzBLLFdBQVcsR0FBQyxlQUExQixLQUE4Q3pLLElBQUksQ0FBQ0MsS0FBTCxDQUFXaEIsRUFBRSxDQUFDaUIsWUFBSCxDQUFnQnVLLFdBQVcsR0FBQyxlQUE1QixFQUE2QyxPQUE3QyxDQUFYLENBQTlDLElBQW1ILEVBQXJJO0FBQ0F2QixJQUFBQSxDQUFDLENBQUNrQixjQUFGLEdBQW1CTSxVQUFVLENBQUNILE9BQTlCO0FBQ0EsUUFBSWpILE9BQU8sR0FBR0gsSUFBSSxDQUFDd0UsT0FBTCxDQUFhaEIsT0FBTyxDQUFDQyxHQUFSLEVBQWIsRUFBMkIsMEJBQTNCLENBQWQ7QUFDQSxRQUFJK0QsTUFBTSxHQUFJMUwsRUFBRSxDQUFDYyxVQUFILENBQWN1RCxPQUFPLEdBQUMsZUFBdEIsS0FBMEN0RCxJQUFJLENBQUNDLEtBQUwsQ0FBV2hCLEVBQUUsQ0FBQ2lCLFlBQUgsQ0FBZ0JvRCxPQUFPLEdBQUMsZUFBeEIsRUFBeUMsT0FBekMsQ0FBWCxDQUExQyxJQUEyRyxFQUF6SDtBQUNBNEYsSUFBQUEsQ0FBQyxDQUFDZSxVQUFGLEdBQWVVLE1BQU0sQ0FBQ2xELE1BQVAsQ0FBYzhDLE9BQTdCO0FBQ0EsUUFBSUssT0FBTyxHQUFHekgsSUFBSSxDQUFDd0UsT0FBTCxDQUFhaEIsT0FBTyxDQUFDQyxHQUFSLEVBQWIsRUFBNEIsMEJBQTVCLENBQWQ7QUFDQSxRQUFJaUUsTUFBTSxHQUFJNUwsRUFBRSxDQUFDYyxVQUFILENBQWM2SyxPQUFPLEdBQUMsZUFBdEIsS0FBMEM1SyxJQUFJLENBQUNDLEtBQUwsQ0FBV2hCLEVBQUUsQ0FBQ2lCLFlBQUgsQ0FBZ0IwSyxPQUFPLEdBQUMsZUFBeEIsRUFBeUMsT0FBekMsQ0FBWCxDQUExQyxJQUEyRyxFQUF6SDtBQUNBMUIsSUFBQUEsQ0FBQyxDQUFDaUIsVUFBRixHQUFlVSxNQUFNLENBQUNDLFlBQXRCOztBQUNBLFFBQUk1QixDQUFDLENBQUNpQixVQUFGLElBQWdCN0ssU0FBcEIsRUFBK0I7QUFDN0IsVUFBSXNMLE9BQU8sR0FBR3pILElBQUksQ0FBQ3dFLE9BQUwsQ0FBYWhCLE9BQU8sQ0FBQ0MsR0FBUixFQUFiLEVBQTRCLHdCQUF1QnZHLFVBQVcsMkJBQTlELENBQWQ7QUFDQSxVQUFJd0ssTUFBTSxHQUFJNUwsRUFBRSxDQUFDYyxVQUFILENBQWM2SyxPQUFPLEdBQUMsZUFBdEIsS0FBMEM1SyxJQUFJLENBQUNDLEtBQUwsQ0FBV2hCLEVBQUUsQ0FBQ2lCLFlBQUgsQ0FBZ0IwSyxPQUFPLEdBQUMsZUFBeEIsRUFBeUMsT0FBekMsQ0FBWCxDQUExQyxJQUEyRyxFQUF6SDtBQUNBMUIsTUFBQUEsQ0FBQyxDQUFDaUIsVUFBRixHQUFlVSxNQUFNLENBQUNDLFlBQXRCO0FBQ0Q7O0FBRUEsUUFBSWhCLGFBQWEsSUFBSXhLLFNBQWpCLElBQThCd0ssYUFBYSxJQUFJLE9BQW5ELEVBQTREO0FBQzNELFVBQUlpQixhQUFhLEdBQUcsRUFBcEI7O0FBQ0EsVUFBSWpCLGFBQWEsSUFBSSxPQUFyQixFQUE4QjtBQUM1QmlCLFFBQUFBLGFBQWEsR0FBRzVILElBQUksQ0FBQ3dFLE9BQUwsQ0FBYWhCLE9BQU8sQ0FBQ0MsR0FBUixFQUFiLEVBQTJCLG9CQUEzQixDQUFoQjtBQUNEOztBQUNELFVBQUlrRCxhQUFhLElBQUksU0FBckIsRUFBZ0M7QUFDOUJpQixRQUFBQSxhQUFhLEdBQUc1SCxJQUFJLENBQUN3RSxPQUFMLENBQWFoQixPQUFPLENBQUNDLEdBQVIsRUFBYixFQUEyQiw0QkFBM0IsQ0FBaEI7QUFDRDs7QUFDRCxVQUFJb0UsWUFBWSxHQUFJL0wsRUFBRSxDQUFDYyxVQUFILENBQWNnTCxhQUFhLEdBQUMsZUFBNUIsS0FBZ0QvSyxJQUFJLENBQUNDLEtBQUwsQ0FBV2hCLEVBQUUsQ0FBQ2lCLFlBQUgsQ0FBZ0I2SyxhQUFhLEdBQUMsZUFBOUIsRUFBK0MsT0FBL0MsQ0FBWCxDQUFoRCxJQUF1SCxFQUEzSTtBQUNBN0IsTUFBQUEsQ0FBQyxDQUFDK0IsZ0JBQUYsR0FBcUJELFlBQVksQ0FBQ1QsT0FBbEM7O0FBQ0EsVUFBSXJCLENBQUMsQ0FBQytCLGdCQUFGLElBQXNCM0wsU0FBMUIsRUFBcUM7QUFDbkN5SyxRQUFBQSxhQUFhLEdBQUcsT0FBT0QsYUFBdkI7QUFDRCxPQUZELE1BR0s7QUFDSEMsUUFBQUEsYUFBYSxHQUFHLE9BQU9ELGFBQVAsR0FBdUIsSUFBdkIsR0FBOEJaLENBQUMsQ0FBQytCLGdCQUFoRDtBQUNEO0FBQ0Y7O0FBQ0QsV0FBTyx5QkFBeUIvQixDQUFDLENBQUNjLGFBQTNCLEdBQTJDLFlBQTNDLEdBQTBEZCxDQUFDLENBQUNlLFVBQTVELEdBQXlFLEdBQXpFLEdBQStFZixDQUFDLENBQUNnQixPQUFqRixHQUEyRix3QkFBM0YsR0FBc0hoQixDQUFDLENBQUNpQixVQUF4SCxHQUFxSSxhQUFySSxHQUFxSmpCLENBQUMsQ0FBQ2tCLGNBQXZKLEdBQXdLTCxhQUEvSztBQUVELEdBN0RELENBOERBLE9BQU96SSxDQUFQLEVBQVU7QUFDUixXQUFPLHlCQUF5QjRILENBQUMsQ0FBQ2MsYUFBM0IsR0FBMkMsWUFBM0MsR0FBMERkLENBQUMsQ0FBQ2UsVUFBNUQsR0FBeUUsR0FBekUsR0FBK0VmLENBQUMsQ0FBQ2dCLE9BQWpGLEdBQTJGLHdCQUEzRixHQUFzSGhCLENBQUMsQ0FBQ2lCLFVBQXhILEdBQXFJLGFBQXJJLEdBQXFKakIsQ0FBQyxDQUFDa0IsY0FBdkosR0FBd0tMLGFBQS9LO0FBQ0Q7QUFFQSxDLENBRUQ7OztBQUNPLFNBQVMvSSxHQUFULENBQWFWLEdBQWIsRUFBaUI0SyxPQUFqQixFQUEwQjtBQUMvQixNQUFJQyxDQUFDLEdBQUc3SyxHQUFHLEdBQUc0SyxPQUFkOztBQUNBaE0sRUFBQUEsT0FBTyxDQUFDLFVBQUQsQ0FBUCxDQUFvQmtNLFFBQXBCLENBQTZCekUsT0FBTyxDQUFDb0MsTUFBckMsRUFBNkMsQ0FBN0M7O0FBQ0EsTUFBSTtBQUFDcEMsSUFBQUEsT0FBTyxDQUFDb0MsTUFBUixDQUFlc0MsU0FBZjtBQUEyQixHQUFoQyxDQUFnQyxPQUFNL0osQ0FBTixFQUFTLENBQUU7O0FBQzNDcUYsRUFBQUEsT0FBTyxDQUFDb0MsTUFBUixDQUFldUMsS0FBZixDQUFxQkgsQ0FBckI7QUFBd0J4RSxFQUFBQSxPQUFPLENBQUNvQyxNQUFSLENBQWV1QyxLQUFmLENBQXFCLElBQXJCO0FBQ3pCLEMsQ0FFRDs7O0FBQ08sU0FBU0MsSUFBVCxDQUFjakwsR0FBZCxFQUFrQjRLLE9BQWxCLEVBQTJCO0FBQ2hDLE1BQUlNLENBQUMsR0FBRyxLQUFSO0FBQ0EsTUFBSUwsQ0FBQyxHQUFHN0ssR0FBRyxHQUFHNEssT0FBZDs7QUFDQSxNQUFJTSxDQUFDLElBQUksSUFBVCxFQUFlO0FBQ2J0TSxJQUFBQSxPQUFPLENBQUMsVUFBRCxDQUFQLENBQW9Ca00sUUFBcEIsQ0FBNkJ6RSxPQUFPLENBQUNvQyxNQUFyQyxFQUE2QyxDQUE3Qzs7QUFDQSxRQUFJO0FBQ0ZwQyxNQUFBQSxPQUFPLENBQUNvQyxNQUFSLENBQWVzQyxTQUFmO0FBQ0QsS0FGRCxDQUdBLE9BQU0vSixDQUFOLEVBQVMsQ0FBRTs7QUFDWHFGLElBQUFBLE9BQU8sQ0FBQ29DLE1BQVIsQ0FBZXVDLEtBQWYsQ0FBcUJILENBQXJCO0FBQ0F4RSxJQUFBQSxPQUFPLENBQUNvQyxNQUFSLENBQWV1QyxLQUFmLENBQXFCLElBQXJCO0FBQ0Q7QUFDRixDLENBRUQ7OztBQUNPLFNBQVM3SyxJQUFULENBQWNkLE9BQWQsRUFBdUJ3TCxDQUF2QixFQUEwQjtBQUMvQixNQUFJeEwsT0FBTyxJQUFJLEtBQWYsRUFBc0I7QUFDcEJULElBQUFBLE9BQU8sQ0FBQyxVQUFELENBQVAsQ0FBb0JrTSxRQUFwQixDQUE2QnpFLE9BQU8sQ0FBQ29DLE1BQXJDLEVBQTZDLENBQTdDOztBQUNBLFFBQUk7QUFDRnBDLE1BQUFBLE9BQU8sQ0FBQ29DLE1BQVIsQ0FBZXNDLFNBQWY7QUFDRCxLQUZELENBR0EsT0FBTS9KLENBQU4sRUFBUyxDQUFFOztBQUNYcUYsSUFBQUEsT0FBTyxDQUFDb0MsTUFBUixDQUFldUMsS0FBZixDQUFzQixhQUFZSCxDQUFFLEVBQXBDO0FBQ0F4RSxJQUFBQSxPQUFPLENBQUNvQyxNQUFSLENBQWV1QyxLQUFmLENBQXFCLElBQXJCO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTekwsbUJBQVQsR0FBK0I7QUFDN0IsU0FBTztBQUNMLFlBQVEsUUFESDtBQUVMLGtCQUFjO0FBQ1osbUJBQWE7QUFDWCxnQkFBUSxDQUFDLFFBQUQ7QUFERyxPQUREO0FBSVosaUJBQVc7QUFDVCxnQkFBUSxDQUFDLFFBQUQ7QUFEQyxPQUpDO0FBT1osZUFBUztBQUNQLGdCQUFRLENBQUMsUUFBRDtBQURELE9BUEc7QUFVWixjQUFRO0FBQ04sd0JBQWdCLDBEQURWO0FBRU4sZ0JBQVEsQ0FBQyxRQUFEO0FBRkYsT0FWSTtBQWNaLGdCQUFVO0FBQ1IsZ0JBQVEsQ0FBQyxRQUFEO0FBREEsT0FkRTtBQWlCWixjQUFRO0FBQ04sZ0JBQVEsQ0FBQyxTQUFEO0FBREYsT0FqQkk7QUFvQlosa0JBQVk7QUFDVixnQkFBUSxDQUFDLFFBQUQsRUFBVyxPQUFYO0FBREUsT0FwQkE7QUF1QlosaUJBQVc7QUFDVCxnQkFBUSxDQUFDLFFBQUQ7QUFEQyxPQXZCQztBQTBCWixxQkFBZTtBQUNiLHdCQUFnQixzREFESDtBQUViLGdCQUFRLENBQUMsUUFBRDtBQUZLLE9BMUJIO0FBOEJaLG1CQUFhO0FBQ1gsd0JBQWdCLDBEQURMO0FBRVgsZ0JBQVEsQ0FBQyxRQUFEO0FBRkcsT0E5QkQ7QUFrQ1osaUJBQVc7QUFDVCx3QkFBZ0IsMERBRFA7QUFFVCxnQkFBUSxDQUFDLFFBQUQ7QUFGQyxPQWxDQztBQXNDWixlQUFTO0FBQ1Asd0JBQWdCLDBEQURUO0FBRVAsZ0JBQVEsQ0FBQyxRQUFEO0FBRkQsT0F0Q0c7QUEwQ1osaUJBQVc7QUFDVCx3QkFBZ0IsMERBRFA7QUFFVCxnQkFBUSxDQUFDLFFBQUQ7QUFGQyxPQTFDQztBQThDWixnQkFBVTtBQUNSLHdCQUFnQiwwREFEUjtBQUVSLGdCQUFRLENBQUMsUUFBRDtBQUZBLE9BOUNFO0FBa0RaLHNCQUFnQjtBQUNkLHdCQUFnQiwwREFERjtBQUVkLGdCQUFRLENBQUMsUUFBRDtBQUZNLE9BbERKO0FBc0RaLGlCQUFXO0FBQ1Qsd0JBQWdCLGtEQURQO0FBRVQsZ0JBQVEsQ0FBQyxRQUFELEVBQVcsT0FBWDtBQUZDO0FBdERDLEtBRlQ7QUE2REwsNEJBQXdCO0FBN0RuQixHQUFQO0FBK0REOztBQUdELFNBQVNNLGtCQUFULEdBQThCO0FBQzVCLFNBQU87QUFDTGQsSUFBQUEsU0FBUyxFQUFFLE9BRE47QUFFTDBHLElBQUFBLE9BQU8sRUFBRSxRQUZKO0FBR0xDLElBQUFBLEtBQUssRUFBRSxnQkFIRjtBQUlMakMsSUFBQUEsSUFBSSxFQUFFLEtBSkQ7QUFLTHBDLElBQUFBLE1BQU0sRUFBRSxJQUxIO0FBTUxnRSxJQUFBQSxJQUFJLEVBQUUsSUFORDtBQU9MRyxJQUFBQSxRQUFRLEVBQUUsRUFQTDtBQVNMbkIsSUFBQUEsT0FBTyxFQUFFLEVBVEo7QUFVTGpFLElBQUFBLFdBQVcsRUFBRSxhQVZSO0FBV0xoQixJQUFBQSxTQUFTLEVBQUUsSUFYTjtBQVlMb0IsSUFBQUEsT0FBTyxFQUFFLEtBWko7QUFhTEMsSUFBQUEsS0FBSyxFQUFFLEtBYkY7QUFjTHBCLElBQUFBLE9BQU8sRUFBRSxJQWRKO0FBZUxxRCxJQUFBQSxNQUFNLEVBQUUsS0FmSDtBQWdCTDlCLElBQUFBLFlBQVksRUFBRSxLQWhCVDtBQWlCTFAsSUFBQUEsT0FBTyxFQUFFO0FBakJKLEdBQVA7QUFtQkQiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb25zdHJ1Y3Rvcihpbml0aWFsT3B0aW9ucykge1xuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgdmFyIHZhcnMgPSB7fVxuICB2YXIgb3B0aW9ucyA9IHt9XG4gIHRyeSB7XG4gICAgaWYgKGluaXRpYWxPcHRpb25zLmZyYW1ld29yayA9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhcnMucGx1Z2luRXJyb3JzID0gW11cbiAgICAgIHZhcnMucGx1Z2luRXJyb3JzLnB1c2goJ3dlYnBhY2sgY29uZmlnOiBmcmFtZXdvcmsgcGFyYW1ldGVyIG9uIGV4dC13ZWJwYWNrLXBsdWdpbiBpcyBub3QgZGVmaW5lZCAtIHZhbHVlczogcmVhY3QsIGFuZ3VsYXIsIGV4dGpzLCB3ZWItY29tcG9uZW50cycpXG4gICAgICB2YXIgcmVzdWx0ID0geyB2YXJzOiB2YXJzIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICB2YXIgZnJhbWV3b3JrID0gaW5pdGlhbE9wdGlvbnMuZnJhbWV3b3JrXG4gICAgdmFyIHRyZWVzaGFrZSA9IGluaXRpYWxPcHRpb25zLnRyZWVzaGFrZVxuICAgIHZhciB2ZXJib3NlID0gaW5pdGlhbE9wdGlvbnMudmVyYm9zZVxuXG4gICAgY29uc3QgdmFsaWRhdGVPcHRpb25zID0gcmVxdWlyZSgnc2NoZW1hLXV0aWxzJylcbiAgICB2YWxpZGF0ZU9wdGlvbnMoX2dldFZhbGlkYXRlT3B0aW9ucygpLCBpbml0aWFsT3B0aW9ucywgJycpXG5cbiAgICBjb25zdCByYyA9IChmcy5leGlzdHNTeW5jKGAuZXh0LSR7ZnJhbWV3b3JrfXJjYCkgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoYC5leHQtJHtmcmFtZXdvcmt9cmNgLCAndXRmLTgnKSkgfHwge30pXG4gICAgb3B0aW9ucyA9IHsgLi4uX2dldERlZmF1bHRPcHRpb25zKCksIC4uLmluaXRpYWxPcHRpb25zLCAuLi5yYyB9XG5cbiAgICB2YXJzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2dldERlZmF1bHRWYXJzKClcbiAgICB2YXJzLnBsdWdpbk5hbWUgPSAnZXh0LXdlYnBhY2stcGx1Z2luJ1xuICAgIHZhcnMuYXBwID0gX2dldEFwcCgpXG4gICAgdmFyIHBsdWdpbk5hbWUgPSB2YXJzLnBsdWdpbk5hbWVcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXJzLnRlc3RpbmcgPSBmYWxzZVxuXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2NvbnN0cnVjdG9yJylcbiAgICBsb2d2KHZlcmJvc2UsIGBwbHVnaW5OYW1lIC0gJHtwbHVnaW5OYW1lfWApXG4gICAgbG9ndih2ZXJib3NlLCBgYXBwIC0gJHthcHB9YClcblxuICAgIGlmIChvcHRpb25zLmVudmlyb25tZW50ID09ICdwcm9kdWN0aW9uJyB8fFxuICAgICAgICAob3B0aW9ucy5jbWRvcHRzLmluY2x1ZGVzKCctLXByb2R1Y3Rpb24nKSB8fCBvcHRpb25zLmNtZG9wdHMuaW5jbHVkZXMoJy1wcicpIHx8XG4gICAgICAgICAgICBvcHRpb25zLmNtZG9wdHMuaW5jbHVkZXMoJy0tZW52aXJvbm1lbnQ9cHJvZHVjdGlvbicpIHx8IG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLWU9cHJvZHVjdGlvbicpKSkge1xuICAgICAgdmFycy5wcm9kdWN0aW9uID0gdHJ1ZVxuICAgICAgb3B0aW9ucy5icm93c2VyID0gJ25vJ1xuICAgICAgb3B0aW9ucy53YXRjaCA9ICdubydcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXJzLnByb2R1Y3Rpb24gPSBmYWxzZVxuICAgIH1cblxuICAgIGlmKG9wdGlvbnMuY21kb3B0cyAmJlxuICAgICAgICAob3B0aW9ucy5jbWRvcHRzLmluY2x1ZGVzKCctLXRlc3RpbmcnKSB8fCBvcHRpb25zLmNtZG9wdHMuaW5jbHVkZXMoJy10ZScpIHx8XG4gICAgICAgICAgICBvcHRpb25zLmNtZG9wdHMuaW5jbHVkZXMoJy0tZW52aXJvbm1lbnQ9dGVzdGluZycpIHx8IG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLWU9dGVzdGluZycpKSl7XG4gICAgICB2YXJzLnByb2R1Y3Rpb24gPSBmYWxzZVxuICAgICAgdmFycy50ZXN0aW5nID0gdHJ1ZVxuICAgICAgb3B0aW9ucy5icm93c2VyID0gJ25vJ1xuICAgICAgb3B0aW9ucy53YXRjaCA9ICdubydcbiAgICB9XG5cbiAgICBsb2coYXBwLCBfZ2V0VmVyc2lvbnMocGx1Z2luTmFtZSwgZnJhbWV3b3JrKSlcblxuICAgIC8vbWpnIGFkZGVkIGZvciBhbmd1bGFyIGNsaSBidWlsZFxuICAgIGlmIChmcmFtZXdvcmsgPT0gJ2FuZ3VsYXInICYmXG4gICAgICAgIG9wdGlvbnMuaW50ZWxsaXNoYWtlID09ICdubycgJiZcbiAgICAgICAgdmFycy5wcm9kdWN0aW9uID09IHRydWVcbiAgICAgICAgJiYgdHJlZXNoYWtlID09ICd5ZXMnKSB7XG4gICAgICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnO1xuICAgICAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICcgKyBmcmFtZXdvcmspO1xuICAgIH1cblxuICAgIGVsc2UgaWYgKGZyYW1ld29yayA9PSAncmVhY3QnIHx8IGZyYW1ld29yayA9PSAnZXh0anMnIHx8IGZyYW1ld29yayA9PSAnd2ViLWNvbXBvbmVudHMnKSB7XG4gICAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUpIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJ1xuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJyArIGZyYW1ld29yaylcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYodmFycy50ZXN0aW5nID09IHRydWUpe1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyB0ZXN0aW5nIGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIGRldmVsb3BtZW50IGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgaWYgKHRyZWVzaGFrZSA9PSAneWVzJykge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDInXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrICsgJyAtICcgKyB2YXJzLmJ1aWxkc3RlcClcbiAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3RvUHJvZCh2YXJzLCBvcHRpb25zKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzIgb2YgMidcbiAgICAgICAgbG9nKGFwcCwgJ0NvbnRpbnVpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJyArIGZyYW1ld29yayArICcgLSAnICsgdmFycy5idWlsZHN0ZXApXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJ1xuICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIGRldmVsb3BtZW50IGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKVxuICAgIH1cbiAgICBsb2d2KHZlcmJvc2UsICdCdWlsZGluZyBmb3IgJyArIG9wdGlvbnMuZW52aXJvbm1lbnQgKyAnLCAnICsgJ3RyZWVzaGFrZSBpcyAnICsgb3B0aW9ucy50cmVlc2hha2UrICcsICcgKyAnaW50ZWxsaXNoYWtlIGlzICcgKyBvcHRpb25zLmludGVsbGlzaGFrZSlcblxuICAgIHZhciBjb25maWdPYmogPSB7IHZhcnM6IHZhcnMsIG9wdGlvbnM6IG9wdGlvbnMgfTtcbiAgICByZXR1cm4gY29uZmlnT2JqO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgdGhyb3cgJ19jb25zdHJ1Y3RvcjogJyArIGUudG9TdHJpbmcoKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF90aGlzQ29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfdGhpc0NvbXBpbGF0aW9uJylcbiAgICBsb2d2KHZlcmJvc2UsIGBvcHRpb25zLnNjcmlwdDogJHtvcHRpb25zLnNjcmlwdCB9YClcbiAgICBsb2d2KHZlcmJvc2UsIGBidWlsZHN0ZXA6ICR7dmFycy5idWlsZHN0ZXB9YClcblxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PT0gJzEgb2YgMScgfHwgdmFycy5idWlsZHN0ZXAgPT09ICcxIG9mIDInKSB7XG4gICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuc2NyaXB0ICE9IG51bGwgJiYgb3B0aW9ucy5zY3JpcHQgIT0gJycpIHtcbiAgICAgICAgbG9nKGFwcCwgYFN0YXJ0ZWQgcnVubmluZyAke29wdGlvbnMuc2NyaXB0fWApXG4gICAgICAgIHJ1blNjcmlwdChvcHRpb25zLnNjcmlwdCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG4gICAgICAgICAgbG9nKGFwcCwgYEZpbmlzaGVkIHJ1bm5pbmcgJHtvcHRpb25zLnNjcmlwdH1gKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHRocm93ICdfdGhpc0NvbXBpbGF0aW9uOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2NvbXBpbGF0aW9uJylcblxuICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgaWYgKG9wdGlvbnMudHJlZXNoYWtlID09PSAneWVzJyAmJiBvcHRpb25zLmVudmlyb25tZW50ID09PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgdmFyIGV4dENvbXBvbmVudHMgPSBbXTtcblxuICAgICAgICAvL21qZyBmb3IgMSBzdGVwIGJ1aWxkXG4gICAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyAmJiBmcmFtZXdvcmsgPT09ICdhbmd1bGFyJyAmJiBvcHRpb25zLmludGVsbGlzaGFrZSA9PSAnbm8nKSB7XG4gICAgICAgICAgICBleHRDb21wb25lbnRzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMicgfHwgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnICYmIGZyYW1ld29yayA9PT0gJ3dlYi1jb21wb25lbnRzJykpIHtcbiAgICAgICAgICBleHRDb21wb25lbnRzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucylcbiAgICAgICAgfVxuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5zdWNjZWVkTW9kdWxlLnRhcChgZXh0LXN1Y2NlZWQtbW9kdWxlYCwgbW9kdWxlID0+IHtcbiAgICAgICAgICBpZiAobW9kdWxlLnJlc291cmNlICYmICFtb2R1bGUucmVzb3VyY2UubWF0Y2goL25vZGVfbW9kdWxlcy8pKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChtb2R1bGUucmVzb3VyY2UubWF0Y2goL1xcLmh0bWwkLykgIT0gbnVsbFxuICAgICAgICAgICAgICAgICYmIG1vZHVsZS5fc291cmNlLl92YWx1ZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdkb2N0eXBlIGh0bWwnKSA9PSBmYWxzZVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5maW5pc2hNb2R1bGVzLnRhcChgZXh0LWZpbmlzaC1tb2R1bGVzYCwgbW9kdWxlcyA9PiB7XG4gICAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIodmFycywgb3B0aW9ucylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMiBvZiAyJykge1xuICAgICAgICBpZiAob3B0aW9ucy5pbmplY3QgPT09ICd5ZXMnKSB7XG4gICAgICAgICAgaWYoY29tcGlsYXRpb24uaG9va3MuaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLmh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24udGFwKGBleHQtaHRtbC1nZW5lcmF0aW9uYCwoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgICAgICAgICAgIHZhciBqc1BhdGggPSBwYXRoLmpvaW4odmFycy5leHRQYXRoLCAnZXh0LmpzJylcbiAgICAgICAgICAgICAgdmFyIGNzc1BhdGggPSBwYXRoLmpvaW4odmFycy5leHRQYXRoLCAnZXh0LmNzcycpXG4gICAgICAgICAgICAgIC8vdmFyIGpzUGF0aCA9IHZhcnMuZXh0UGF0aCArICcvJyArICAnZXh0LmpzJztcbiAgICAgICAgICAgICAgLy92YXIgY3NzUGF0aCA9IHZhcnMuZXh0UGF0aCArICcvJyArICdleHQuY3NzJztcbiAgICAgICAgICAgICAgZGF0YS5hc3NldHMuanMudW5zaGlmdChqc1BhdGgpXG4gICAgICAgICAgICAgIGRhdGEuYXNzZXRzLmNzcy51bnNoaWZ0KGNzc1BhdGgpXG4gICAgICAgICAgICAgIGxvZyhhcHAsIGBBZGRpbmcgJHtqc1BhdGh9IGFuZCAke2Nzc1BhdGh9IHRvIGluZGV4Lmh0bWxgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHRocm93ICdfY29tcGlsYXRpb246ICcgKyBlLnRvU3RyaW5nKClcbi8vICAgIGxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4vLyAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2NvbXBpbGF0aW9uOiAnICsgZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfYWZ0ZXJDb21waWxlKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZScpXG4gICAgaWYgKGZyYW1ld29yayA9PSAnZXh0anMnKSB7XG4gICAgICByZXF1aXJlKGAuL2V4dGpzVXRpbGApLl9hZnRlckNvbXBpbGUoY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZSBub3QgcnVuJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHRocm93ICdfYWZ0ZXJDb21waWxlOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2VtaXQoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB0cnkge1xuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBlbWl0ID0gb3B0aW9ucy5lbWl0XG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgdmFycy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfZW1pdCcpXG4gICAgaWYgKGVtaXQgPT0gJ3llcycpIHtcbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgICAgICBsZXQgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vdXRwdXRQYXRoLHZhcnMuZXh0UGF0aClcbiAgICAgICAgaWYgKGNvbXBpbGVyLm91dHB1dFBhdGggPT09ICcvJyAmJiBjb21waWxlci5vcHRpb25zLmRldlNlcnZlcikge1xuICAgICAgICAgIG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIuY29udGVudEJhc2UsIG91dHB1dFBhdGgpXG4gICAgICAgIH1cbiAgICAgICAgbG9ndih2ZXJib3NlLCdvdXRwdXRQYXRoOiAnICsgb3V0cHV0UGF0aClcbiAgICAgICAgbG9ndih2ZXJib3NlLCdmcmFtZXdvcms6ICcgKyBmcmFtZXdvcmspXG4gICAgICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgICAgIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29tbWFuZCA9ICcnXG4gICAgICAgIGlmIChvcHRpb25zLndhdGNoID09ICd5ZXMnICYmIHZhcnMucHJvZHVjdGlvbiA9PSBmYWxzZSlcbiAgICAgICAgICB7Y29tbWFuZCA9ICd3YXRjaCd9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB7Y29tbWFuZCA9ICdidWlsZCd9XG4gICAgICAgIGlmICh2YXJzLnJlYnVpbGQgPT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciBwYXJtcyA9IFtdLFxuICAgICAgICAgIGJ1aWxkRW52aXJvbm1lbnQ7XG5cbiAgICAgICAgICBpZih2YXJzLnRlc3RpbmcgPT09IHRydWUpe1xuICAgICAgICAgICAgYnVpbGRFbnZpcm9ubWVudCA9ICd0ZXN0aW5nJztcbiAgICAgICAgICB9ZWxzZSBpZiAodmFycy5wcm9kdWN0aW9uID09PSB0cnVlKXtcbiAgICAgICAgICAgIGJ1aWxkRW52aXJvbm1lbnQgPSAncHJvZHVjdGlvbic7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBidWlsZEVudmlyb25tZW50ID0gJ2RldmVsb3BtZW50JztcbiAgICAgICAgICB9XG4gICAgICAgICAgbG9ndih2ZXJib3NlLCBgYnVpbGRFbnZpcm9ubWVudDogJHtidWlsZEVudmlyb25tZW50fWApO1xuICAgICAgICAgIGlmKCFBcnJheS5pc0FycmF5KG9wdGlvbnMuY21kb3B0cykpe1xuICAgICAgICAgICAgb3B0aW9ucy5jbWRvcHRzID0gb3B0aW9ucy5jbWRvcHRzLnNwbGl0KCcgJylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG9wdGlvbnMucHJvZmlsZSA9PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5wcm9maWxlID09ICcnIHx8IG9wdGlvbnMucHJvZmlsZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoY29tbWFuZCA9PSAnYnVpbGQnKVxuICAgICAgICAgICAgICB7IHBhcm1zID0gWydhcHAnLCBjb21tYW5kLCBidWlsZEVudmlyb25tZW50XSB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHsgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBidWlsZEVudmlyb25tZW50XSB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT0gJ2J1aWxkJylcbiAgICAgICAgICAgICAge3Bhcm1zID0gWydhcHAnLCBjb21tYW5kLCBvcHRpb25zLnByb2ZpbGUsIGJ1aWxkRW52aXJvbm1lbnRdfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB7cGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLnByb2ZpbGUsIGJ1aWxkRW52aXJvbm1lbnRdfVxuICAgICAgICAgIH1cbiAgICAgICAgICBvcHRpb25zLmNtZG9wdHMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KXtcbiAgICAgICAgICAgICAgcGFybXMuc3BsaWNlKHBhcm1zLmluZGV4T2YoY29tbWFuZCkrMSwgMCwgZWxlbWVudCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAvLyBpZiAodmFycy53YXRjaFN0YXJ0ZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAvLyAgIGF3YWl0IF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgdmFycywgb3B0aW9ucylcbiAgICAgICAgICAvLyAgIHZhcnMud2F0Y2hTdGFydGVkID0gdHJ1ZVxuICAgICAgICAgIC8vIH1cbiAgICAgICAgICBpZiAodmFycy53YXRjaFN0YXJ0ZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGF3YWl0IF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgdmFycywgb3B0aW9ucylcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICd3YXRjaCcpIHtcbiAgICAgICAgICAgICAgdmFycy53YXRjaFN0YXJ0ZWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgdmFycy5jYWxsYmFjaygpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vbWpnXG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXJzLmNhbGxiYWNrKClcbiAgICAgICAgICB9XG4gICAgICAgICAgLy9tamdcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YXJzLmNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwnTk9UIHJ1bm5pbmcgZW1pdCcpXG4gICAgICAgIHZhcnMuY2FsbGJhY2soKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxvZ3YodmVyYm9zZSwnZW1pdCBpcyBubycpXG4gICAgICB2YXJzLmNhbGxiYWNrKClcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHZhcnMuY2FsbGJhY2soKVxuICAgIHRocm93ICdfZW1pdDogJyArIGUudG9TdHJpbmcoKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9kb25lKHN0YXRzLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9kb25lJylcbiAgICBpZiAoc3RhdHMuY29tcGlsYXRpb24uZXJyb3JzICYmIHN0YXRzLmNvbXBpbGF0aW9uLmVycm9ycy5sZW5ndGgpIC8vICYmIHByb2Nlc3MuYXJndi5pbmRleE9mKCctLXdhdGNoJykgPT0gLTEpXG4gICAge1xuICAgICAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKTtcbiAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZCgnKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqJykpO1xuICAgICAgY29uc29sZS5sb2coc3RhdHMuY29tcGlsYXRpb24uZXJyb3JzWzBdKTtcbiAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZCgnKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqJykpO1xuICAgICAgLy9wcm9jZXNzLmV4aXQoMCk7XG4gICAgfVxuXG4gICAgLy9tamcgcmVmYWN0b3JcbiAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gJ25vJyAmJiBmcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICByZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLl90b0Rldih2YXJzLCBvcHRpb25zKVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgaWYob3B0aW9ucy5icm93c2VyID09ICd5ZXMnICYmIG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKSB7XG4gICAgICAgIGlmICh2YXJzLmJyb3dzZXJDb3VudCA9PSAwKSB7XG4gICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OicgKyBvcHRpb25zLnBvcnRcbiAgICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBPcGVuaW5nIGJyb3dzZXIgYXQgJHt1cmx9YClcbiAgICAgICAgICB2YXJzLmJyb3dzZXJDb3VudCsrXG4gICAgICAgICAgY29uc3Qgb3BuID0gcmVxdWlyZSgnb3BuJylcbiAgICAgICAgICBvcG4odXJsKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScpIHtcbiAgICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJHtmcmFtZXdvcmt9YClcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHZhcnMudGVzdGluZyA9PSB0cnVlKSB7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyB0ZXN0aW5nIGJ1aWxkIGZvciAke2ZyYW1ld29ya31gKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBkZXZlbG9wbWVudCBidWlsZCBmb3IgJHtmcmFtZXdvcmt9YClcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcyIG9mIDInKSB7XG4gICAgICBpZih2YXJzLnRlc3RpbmcgPT0gdHJ1ZSl7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyB0ZXN0aW5nIGJ1aWxkIGZvciAke2ZyYW1ld29ya31gKVxuICAgICAgfVxuICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICR7ZnJhbWV3b3JrfWApXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbi8vICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gICAgdGhyb3cgJ19kb25lOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dCwgY29tcGlsYXRpb24pIHtcbiAgdHJ5IHtcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBwYWNrYWdlcyA9IG9wdGlvbnMucGFja2FnZXNcbiAgICB2YXIgdG9vbGtpdCA9IG9wdGlvbnMudG9vbGtpdFxuICAgIHZhciB0aGVtZSA9IG9wdGlvbnMudGhlbWVcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9wcmVwYXJlRm9yQnVpbGQnKVxuICAgIGNvbnN0IHJpbXJhZiA9IHJlcXVpcmUoJ3JpbXJhZicpXG4gICAgY29uc3QgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJylcbiAgICBjb25zdCBmc3ggPSByZXF1aXJlKCdmcy1leHRyYScpXG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgIHRoZW1lID0gdGhlbWUgfHwgKHRvb2xraXQgPT09ICdjbGFzc2ljJyA/ICd0aGVtZS10cml0b24nIDogJ3RoZW1lLW1hdGVyaWFsJylcbiAgICBsb2d2KHZlcmJvc2UsJ2ZpcnN0VGltZTogJyArIHZhcnMuZmlyc3RUaW1lKVxuICAgIGlmICh2YXJzLmZpcnN0VGltZSkge1xuICAgICAgcmltcmFmLnN5bmMob3V0cHV0KVxuICAgICAgbWtkaXJwLnN5bmMob3V0cHV0KVxuICAgICAgY29uc3QgYnVpbGRYTUwgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmJ1aWxkWE1MXG4gICAgICBjb25zdCBjcmVhdGVBcHBKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVBcHBKc29uXG4gICAgICBjb25zdCBjcmVhdGVXb3Jrc3BhY2VKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVXb3Jrc3BhY2VKc29uXG4gICAgICBjb25zdCBjcmVhdGVKU0RPTUVudmlyb25tZW50ID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVKU0RPTUVudmlyb25tZW50XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdidWlsZC54bWwnKSwgYnVpbGRYTUwodmFycy5wcm9kdWN0aW9uLCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdhcHAuanNvbicpLCBjcmVhdGVBcHBKc29uKHRoZW1lLCBwYWNrYWdlcywgdG9vbGtpdCwgb3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnanNkb20tZW52aXJvbm1lbnQuanMnKSwgY3JlYXRlSlNET01FbnZpcm9ubWVudChvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICd3b3Jrc3BhY2UuanNvbicpLCBjcmVhdGVXb3Jrc3BhY2VKc29uKG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIHZhciBmcmFtZXdvcmsgPSB2YXJzLmZyYW1ld29yaztcbiAgICAgIC8vYmVjYXVzZSBvZiBhIHByb2JsZW0gd2l0aCBjb2xvcnBpY2tlclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vdXgvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3V4JylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICh1eCkgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vcGFja2FnZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdwYWNrYWdlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vb3ZlcnJpZGVzL2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vb3ZlcnJpZGVzL2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAnb3ZlcnJpZGVzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwncmVzb3VyY2VzLycpKSkge1xuICAgICAgICB2YXIgZnJvbVJlc291cmNlcyA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncmVzb3VyY2VzLycpXG4gICAgICAgIHZhciB0b1Jlc291cmNlcyA9IHBhdGguam9pbihvdXRwdXQsICcuLi9yZXNvdXJjZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVJlc291cmNlcywgdG9SZXNvdXJjZXMpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICcgKyBmcm9tUmVzb3VyY2VzLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUmVzb3VyY2VzLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgIH1cbiAgICB2YXJzLmZpcnN0VGltZSA9IGZhbHNlXG4gICAgdmFyIGpzID0gJydcbiAgICBpZiAodmFycy5wcm9kdWN0aW9uKSB7XG4gICAgICB2YXJzLmRlcHMgPSB2YXJzLmRlcHMuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCl7IHJldHVybiB2YXJzLmRlcHMuaW5kZXhPZih2YWx1ZSkgPT0gaW5kZXggfSk7XG4gICAgICBqcyA9IHZhcnMuZGVwcy5qb2luKCc7XFxuJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAganMgPSBgRXh0LnJlcXVpcmUoW1wiRXh0LipcIixcIkV4dC5kYXRhLlRyZWVTdG9yZVwiXSlgXG4gICAgfVxuICAgIGpzID0gYEV4dC5yZXF1aXJlKFtcIkV4dC4qXCIsXCJFeHQuZGF0YS5UcmVlU3RvcmVcIl0pYDsgLy9mb3Igbm93XG4gICAgaWYgKHZhcnMubWFuaWZlc3QgPT09IG51bGwgfHwganMgIT09IHZhcnMubWFuaWZlc3QpIHtcbiAgICAgIHZhcnMubWFuaWZlc3QgPSBqcyArICc7XFxuRXh0LnJlcXVpcmUoW1wiRXh0LmxheW91dC4qXCJdKTtcXG4nO1xuICAgICAgY29uc3QgbWFuaWZlc3QgPSBwYXRoLmpvaW4ob3V0cHV0LCAnbWFuaWZlc3QuanMnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhtYW5pZmVzdCwgdmFycy5tYW5pZmVzdCwgJ3V0ZjgnKVxuICAgICAgdmFycy5yZWJ1aWxkID0gdHJ1ZVxuICAgICAgdmFyIGJ1bmRsZURpciA9IG91dHB1dC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKVxuICAgICAgaWYgKGJ1bmRsZURpci50cmltKCkgPT0gJycpIHtidW5kbGVEaXIgPSAnLi8nfVxuICAgICAgbG9nKGFwcCwgJ0J1aWxkaW5nIEV4dCBidW5kbGUgYXQ6ICcgKyBidW5kbGVEaXIpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5yZWJ1aWxkID0gZmFsc2VcbiAgICAgIGxvZyhhcHAsICdFeHQgcmVidWlsZCBOT1QgbmVlZGVkJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19wcmVwYXJlRm9yQnVpbGQ6ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgdmFycywgb3B0aW9ucykge1xuICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfYnVpbGRFeHRCdW5kbGUnKVxuICBsZXQgc2VuY2hhOyB0cnkgeyBzZW5jaGEgPSByZXF1aXJlKCdAc2VuY2hhL2NtZCcpIH0gY2F0Y2ggKGUpIHsgc2VuY2hhID0gJ3NlbmNoYScgfVxuICBpZiAoZnMuZXhpc3RzU3luYyhzZW5jaGEpKSB7XG4gICAgbG9ndih2ZXJib3NlLCdzZW5jaGEgZm9sZGVyIGV4aXN0cycpXG4gIH1cbiAgZWxzZSB7XG4gICAgbG9ndih2ZXJib3NlLCdzZW5jaGEgZm9sZGVyIERPRVMgTk9UIGV4aXN0JylcbiAgfVxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IG9uQnVpbGREb25lID0gKCkgPT4ge1xuICAgICAgbG9ndih2ZXJib3NlLCdvbkJ1aWxkRG9uZScpXG4gICAgICByZXNvbHZlKClcbiAgICB9XG4gICAgdmFyIG9wdHMgPSB7IGN3ZDogb3V0cHV0UGF0aCwgc2lsZW50OiB0cnVlLCBzdGRpbzogJ3BpcGUnLCBlbmNvZGluZzogJ3V0Zi04J31cbiAgICBfZXhlY3V0ZUFzeW5jKGFwcCwgc2VuY2hhLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpLnRoZW4gKFxuICAgICAgZnVuY3Rpb24oKSB7IG9uQnVpbGREb25lKCkgfSxcbiAgICAgIGZ1bmN0aW9uKHJlYXNvbikgeyByZWplY3QocmVhc29uKSB9XG4gICAgKVxuICB9KVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZXhlY3V0ZUFzeW5jIChhcHAsIGNvbW1hbmQsIHBhcm1zLCBvcHRzLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgLy9jb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBTZXJ2ZXJcIiwgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gIGNvbnN0IERFRkFVTFRfU1VCU1RSUyA9IFtcIltJTkZdIHhTZXJ2ZXJcIiwgJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gQXBwZW5kJywgJ1tJTkZdIFByb2Nlc3NpbmcnLCAnW0lORl0gUHJvY2Vzc2luZyBCdWlsZCcsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gIHZhciBzdWJzdHJpbmdzID0gREVGQVVMVF9TVUJTVFJTXG4gIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbiAgY29uc3QgY3Jvc3NTcGF3biA9IHJlcXVpcmUoJ2Nyb3NzLXNwYXduLXdpdGgta2lsbCcpXG4gIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9leGVjdXRlQXN5bmMnKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbG9ndih2ZXJib3NlLGBjb21tYW5kIC0gJHtjb21tYW5kfWApXG4gICAgbG9ndih2ZXJib3NlLCBgcGFybXMgLSAke3Bhcm1zfWApXG4gICAgbG9ndih2ZXJib3NlLCBgb3B0cyAtICR7SlNPTi5zdHJpbmdpZnkob3B0cyl9YClcbiAgICB2YXJzLmNoaWxkID0gY3Jvc3NTcGF3bihjb21tYW5kLCBwYXJtcywgb3B0cylcblxuICAgIHZhcnMuY2hpbGQub24oJ2Nsb3NlJywgKGNvZGUsIHNpZ25hbCkgPT4ge1xuICAgICAgbG9ndih2ZXJib3NlLCBgb24gY2xvc2U6IGAgKyBjb2RlKVxuICAgICAgaWYoY29kZSA9PT0gMCkgeyByZXNvbHZlKDApIH1cbiAgICAgIGVsc2UgeyBjb21waWxhdGlvbi5lcnJvcnMucHVzaCggbmV3IEVycm9yKGNvZGUpICk7IHJlc29sdmUoMCkgfVxuICAgIH0pXG4gICAgdmFycy5jaGlsZC5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAgIGxvZ3YodmVyYm9zZSwgYG9uIGVycm9yYClcbiAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGVycm9yKVxuICAgICAgcmVzb2x2ZSgwKVxuICAgIH0pXG4gICAgdmFycy5jaGlsZC5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXG4gICAgICBsb2d2KHZlcmJvc2UsIGAke3N0cn1gKVxuICAgICAgLy9pZiAoZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkubWF0Y2goL0Zhc2hpb24gd2FpdGluZyBmb3IgY2hhbmdlc1xcLlxcLlxcLi8pKSB7XG4gICAgICBpZiAoZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkubWF0Y2goL2FpdGluZyBmb3IgY2hhbmdlc1xcLlxcLlxcLi8pKSB7XG5cbi8vICAgICAgICAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4vLyAgICAgICAgICAgdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSArIHZhcnMudG91Y2hGaWxlO1xuLy8gICAgICAgICAgIHRyeSB7XG4vLyAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKVxuLy8gICAgICAgICAgICAgdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuLy8gICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgJy8vJyArIGQsICd1dGY4Jyk7XG4vLyAgICAgICAgICAgICBsb2d2KGFwcCwgYHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICAgIGNhdGNoKGUpIHtcbi8vICAgICAgICAgICAgIGxvZ3YoYXBwLCBgTk9UIHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4vLyAgICAgICAgICAgfVxuXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0lORl1cIiwgXCJcIilcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbTE9HXVwiLCBcIlwiKVxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykudHJpbSgpXG4gICAgICAgIGlmIChzdHIuaW5jbHVkZXMoXCJbRVJSXVwiKSkge1xuICAgICAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGFwcCArIHN0ci5yZXBsYWNlKC9eXFxbRVJSXFxdIC9naSwgJycpKTtcbiAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltFUlJdXCIsIGAke2NoYWxrLnJlZChcIltFUlJdXCIpfWApXG4gICAgICAgIH1cbiAgICAgICAgbG9nKGFwcCwgc3RyKVxuXG4gICAgICAgIHZhcnMuY2FsbGJhY2soKVxuICAgICAgICByZXNvbHZlKDApXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKHN1YnN0cmluZ3Muc29tZShmdW5jdGlvbih2KSB7IHJldHVybiBkYXRhLmluZGV4T2YodikgPj0gMDsgfSkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltJTkZdXCIsIFwiXCIpXG4gICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbTE9HXVwiLCBcIlwiKVxuICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKS50cmltKClcbiAgICAgICAgICBpZiAoc3RyLmluY2x1ZGVzKFwiW0VSUl1cIikpIHtcbiAgICAgICAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGFwcCArIHN0ci5yZXBsYWNlKC9eXFxbRVJSXFxdIC9naSwgJycpKTtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0VSUl1cIiwgYCR7Y2hhbGsucmVkKFwiW0VSUl1cIil9YClcbiAgICAgICAgICB9XG4gICAgICAgICAgbG9nKGFwcCwgc3RyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICB2YXJzLmNoaWxkLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICBsb2d2KG9wdGlvbnMsIGBlcnJvciBvbiBjbG9zZTogYCArIGRhdGEpXG4gICAgICB2YXIgc3RyID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UoL1xccj9cXG58XFxyL2csIFwiIFwiKS50cmltKClcbiAgICAgIHZhciBzdHJKYXZhT3B0cyA9IFwiUGlja2VkIHVwIF9KQVZBX09QVElPTlNcIjtcbiAgICAgIHZhciBpbmNsdWRlcyA9IHN0ci5pbmNsdWRlcyhzdHJKYXZhT3B0cylcbiAgICAgIGlmICghaW5jbHVkZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coYCR7YXBwfSAke2NoYWxrLnJlZChcIltFUlJdXCIpfSAke3N0cn1gKVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG59XG5cbi8vKioqKioqKioqKlxuZnVuY3Rpb24gcnVuU2NyaXB0KHNjcmlwdFBhdGgsIGNhbGxiYWNrKSB7XG4gIHZhciBjaGlsZFByb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG4gIC8vIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBjYWxsYmFjayBoYXMgYmVlbiBpbnZva2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgaW52b2NhdGlvbnNcbiAgdmFyIGludm9rZWQgPSBmYWxzZTtcbiAgdmFyIHByb2Nlc3MgPSBjaGlsZFByb2Nlc3MuZm9yayhzY3JpcHRQYXRoLCBbXSwgeyBleGVjQXJndiA6IFsnLS1pbnNwZWN0PTAnXSB9KTtcbiAgLy8gbGlzdGVuIGZvciBlcnJvcnMgYXMgdGhleSBtYXkgcHJldmVudCB0aGUgZXhpdCBldmVudCBmcm9tIGZpcmluZ1xuICBwcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xuICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjayBvbmNlIHRoZSBwcm9jZXNzIGhhcyBmaW5pc2hlZCBydW5uaW5nXG4gIHByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZSkge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgdmFyIGVyciA9IGNvZGUgPT09IDAgPyBudWxsIDogbmV3IEVycm9yKCdleGl0IGNvZGUgJyArIGNvZGUpO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfdG9YdHlwZShzdHIpIHtcbiAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL18vZywgJy0nKVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0QXBwKCkge1xuICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gIHZhciBwcmVmaXggPSBgYFxuICBjb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKVxuICBpZiAocGxhdGZvcm0gPT0gJ2RhcndpbicpIHsgcHJlZml4ID0gYOKEuSDvvaJleHTvvaM6YCB9XG4gIGVsc2UgeyBwcmVmaXggPSBgaSBbZXh0XTpgIH1cbiAgcmV0dXJuIGAke2NoYWxrLmdyZWVuKHByZWZpeCl9IGBcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2dldFZlcnNpb25zKHBsdWdpbk5hbWUsIGZyYW1ld29ya05hbWUpIHtcbnRyeSB7XG4gIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gIHZhciB2ID0ge31cbiAgdmFyIGZyYW1ld29ya0luZm8gPSAnbi9hJ1xuXG4gIHYucGx1Z2luVmVyc2lvbiA9ICduL2EnO1xuICB2LmV4dFZlcnNpb24gPSAnbi9hJztcbiAgdi5lZGl0aW9uID0gJ24vYSc7XG4gIHYuY21kVmVyc2lvbiA9ICduL2EnO1xuICB2LndlYnBhY2tWZXJzaW9uID0gJ24vYSc7XG5cbiAgdmFyIHBsdWdpblBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEnLCBwbHVnaW5OYW1lKVxuICB2YXIgcGx1Z2luUGtnID0gKGZzLmV4aXN0c1N5bmMocGx1Z2luUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LnBsdWdpblZlcnNpb24gPSBwbHVnaW5Qa2cudmVyc2lvblxuICB2Ll9yZXNvbHZlZCA9IHBsdWdpblBrZy5fcmVzb2x2ZWRcbiAgaWYgKHYuX3Jlc29sdmVkID09IHVuZGVmaW5lZCkge1xuICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICB9XG4gIGVsc2Uge1xuICAgIGlmICgtMSA9PSB2Ll9yZXNvbHZlZC5pbmRleE9mKCdjb21tdW5pdHknKSkge1xuICAgICAgdi5lZGl0aW9uID0gYENvbW1lcmNpYWxgXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdi5lZGl0aW9uID0gYENvbW11bml0eWBcbiAgICB9XG4gIH1cbiAgdmFyIHdlYnBhY2tQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy93ZWJwYWNrJylcbiAgdmFyIHdlYnBhY2tQa2cgPSAoZnMuZXhpc3RzU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHdlYnBhY2tQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi53ZWJwYWNrVmVyc2lvbiA9IHdlYnBhY2tQa2cudmVyc2lvblxuICB2YXIgZXh0UGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQHNlbmNoYS9leHQnKVxuICB2YXIgZXh0UGtnID0gKGZzLmV4aXN0c1N5bmMoZXh0UGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LmV4dFZlcnNpb24gPSBleHRQa2cuc2VuY2hhLnZlcnNpb25cbiAgdmFyIGNtZFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSxgbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5jbWRWZXJzaW9uID0gY21kUGtnLnZlcnNpb25fZnVsbFxuICBpZiAodi5jbWRWZXJzaW9uID09IHVuZGVmaW5lZCkge1xuICAgIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhLyR7cGx1Z2luTmFtZX0vbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgICB2YXIgY21kUGtnID0gKGZzLmV4aXN0c1N5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICAgIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgfVxuXG4gICBpZiAoZnJhbWV3b3JrTmFtZSAhPSB1bmRlZmluZWQgJiYgZnJhbWV3b3JrTmFtZSAhPSAnZXh0anMnKSB7XG4gICAgdmFyIGZyYW1ld29ya1BhdGggPSAnJ1xuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdyZWFjdCcpIHtcbiAgICAgIGZyYW1ld29ya1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL3JlYWN0JylcbiAgICB9XG4gICAgaWYgKGZyYW1ld29ya05hbWUgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9AYW5ndWxhci9jb3JlJylcbiAgICB9XG4gICAgdmFyIGZyYW1ld29ya1BrZyA9IChmcy5leGlzdHNTeW5jKGZyYW1ld29ya1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmZyYW1ld29ya1ZlcnNpb24gPSBmcmFtZXdvcmtQa2cudmVyc2lvblxuICAgIGlmICh2LmZyYW1ld29ya1ZlcnNpb24gPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmcmFtZXdvcmtJbmZvID0gJywgJyArIGZyYW1ld29ya05hbWVcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBmcmFtZXdvcmtJbmZvID0gJywgJyArIGZyYW1ld29ya05hbWUgKyAnIHYnICsgdi5mcmFtZXdvcmtWZXJzaW9uXG4gICAgfVxuICB9XG4gIHJldHVybiAnZXh0LXdlYnBhY2stcGx1Z2luIHYnICsgdi5wbHVnaW5WZXJzaW9uICsgJywgRXh0IEpTIHYnICsgdi5leHRWZXJzaW9uICsgJyAnICsgdi5lZGl0aW9uICsgJyBFZGl0aW9uLCBTZW5jaGEgQ21kIHYnICsgdi5jbWRWZXJzaW9uICsgJywgd2VicGFjayB2JyArIHYud2VicGFja1ZlcnNpb24gKyBmcmFtZXdvcmtJbmZvXG5cbn1cbmNhdGNoIChlKSB7XG4gIHJldHVybiAnZXh0LXdlYnBhY2stcGx1Z2luIHYnICsgdi5wbHVnaW5WZXJzaW9uICsgJywgRXh0IEpTIHYnICsgdi5leHRWZXJzaW9uICsgJyAnICsgdi5lZGl0aW9uICsgJyBFZGl0aW9uLCBTZW5jaGEgQ21kIHYnICsgdi5jbWRWZXJzaW9uICsgJywgd2VicGFjayB2JyArIHYud2VicGFja1ZlcnNpb24gKyBmcmFtZXdvcmtJbmZvXG59XG5cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9nKGFwcCxtZXNzYWdlKSB7XG4gIHZhciBzID0gYXBwICsgbWVzc2FnZVxuICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICB0cnkge3Byb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpfWNhdGNoKGUpIHt9XG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpO3Byb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBsb2doKGFwcCxtZXNzYWdlKSB7XG4gIHZhciBoID0gZmFsc2VcbiAgdmFyIHMgPSBhcHAgKyBtZXNzYWdlXG4gIGlmIChoID09IHRydWUpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9ndih2ZXJib3NlLCBzKSB7XG4gIGlmICh2ZXJib3NlID09ICd5ZXMnKSB7XG4gICAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgICB0cnkge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKClcbiAgICB9XG4gICAgY2F0Y2goZSkge31cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShgLXZlcmJvc2U6ICR7c31gKVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxuICB9XG59XG5cbmZ1bmN0aW9uIF9nZXRWYWxpZGF0ZU9wdGlvbnMoKSB7XG4gIHJldHVybiB7XG4gICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgIFwiZnJhbWV3b3JrXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwidG9vbGtpdFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInRoZW1lXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiZW1pdFwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwic2NyaXB0XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwicG9ydFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJpbnRlZ2VyXCJdXG4gICAgICB9LFxuICAgICAgXCJwYWNrYWdlc1wiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIiwgXCJhcnJheVwiXVxuICAgICAgfSxcbiAgICAgIFwicHJvZmlsZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImVudmlyb25tZW50XCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ2RldmVsb3BtZW50JyBvciAncHJvZHVjdGlvbicgc3RyaW5nIHZhbHVlXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInRyZWVzaGFrZVwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiYnJvd3NlclwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwid2F0Y2hcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInZlcmJvc2VcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImluamVjdFwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiaW50ZWxsaXNoYWtlXCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ3llcycgb3IgJ25vJyBzdHJpbmcgdmFsdWUgKE5PVCB0cnVlIG9yIGZhbHNlKVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJjbWRvcHRzXCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgYSBzZW5jaGEgY21kIG9wdGlvbiBvciBhcmd1bWVudCBzdHJpbmdcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiLCBcImFycmF5XCJdXG4gICAgICB9XG4gICAgfSxcbiAgICBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCI6IGZhbHNlXG4gIH07XG59XG5cblxuZnVuY3Rpb24gX2dldERlZmF1bHRPcHRpb25zKCkge1xuICByZXR1cm4ge1xuICAgIGZyYW1ld29yazogJ2V4dGpzJyxcbiAgICB0b29sa2l0OiAnbW9kZXJuJyxcbiAgICB0aGVtZTogJ3RoZW1lLW1hdGVyaWFsJyxcbiAgICBlbWl0OiAneWVzJyxcbiAgICBzY3JpcHQ6IG51bGwsXG4gICAgcG9ydDogMTk2MixcbiAgICBwYWNrYWdlczogW10sXG5cbiAgICBwcm9maWxlOiAnJyxcbiAgICBlbnZpcm9ubWVudDogJ2RldmVsb3BtZW50JyxcbiAgICB0cmVlc2hha2U6ICdubycsXG4gICAgYnJvd3NlcjogJ3llcycsXG4gICAgd2F0Y2g6ICd5ZXMnLFxuICAgIHZlcmJvc2U6ICdubycsXG4gICAgaW5qZWN0OiAneWVzJyxcbiAgICBpbnRlbGxpc2hha2U6ICd5ZXMnLFxuICAgIGNtZG9wdHM6ICcnXG4gIH1cbn1cbiJdfQ==