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

    if (options.environment == 'production') {
      vars.production = true;
      options.browser = 'no';
      options.watch = 'no';
    } else {
      vars.production = false;
    }

    if (options.cmdopts && (options.cmdopts.includes('--testing') || options.cmdopts.includes('--environment=testing'))) {
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
    var path, app, verbose, emit, framework, outputPath, command, parms, buildEnviroment;
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
            _context.next = 39;
            break;
          }

          if (!(vars.buildstep == '1 of 1' || vars.buildstep == '1 of 2')) {
            _context.next = 35;
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
            _context.next = 32;
            break;
          }

          parms = [];
          buildEnviroment = vars.testing === true ? 'testing' : options.environment;

          if (!Array.isArray(options.cmdopts)) {
            options.cmdopts = options.cmdopts.split(' ');
          }

          if (options.profile == undefined || options.profile == '' || options.profile == null) {
            if (command == 'build') {
              parms = ['app', command, buildEnviroment];
            } else {
              parms = ['app', command, '--web-server', 'false', buildEnviroment];
            }
          } else {
            if (command == 'build') {
              parms = ['app', command, options.profile, buildEnviroment];
            } else {
              parms = ['app', command, '--web-server', 'false', options.profile, buildEnviroment];
            }
          }

          options.cmdopts.forEach(function (element) {
            parms.splice(parms.indexOf(command) + 1, 0, element);
          }); // if (vars.watchStarted == false) {
          //   await _buildExtBundle(app, compilation, outputPath, parms, vars, options)
          //   vars.watchStarted = true
          // }

          if (!(vars.watchStarted == false)) {
            _context.next = 29;
            break;
          }

          _context.next = 26;
          return _buildExtBundle(app, compilation, outputPath, parms, vars, options);

        case 26:
          if (command == 'watch') {
            vars.watchStarted = true;
          } else {
            vars.callback();
          }

          _context.next = 30;
          break;

        case 29:
          vars.callback();

        case 30:
          _context.next = 33;
          break;

        case 32:
          vars.callback();

        case 33:
          _context.next = 37;
          break;

        case 35:
          logv(verbose, 'NOT running emit');
          vars.callback();

        case 37:
          _context.next = 41;
          break;

        case 39:
          logv(verbose, 'emit is no');
          vars.callback();

        case 41:
          _context.next = 47;
          break;

        case 43:
          _context.prev = 43;
          _context.t0 = _context["catch"](0);
          vars.callback();
          throw '_emit: ' + _context.t0.toString();

        case 47:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 43]]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsImluaXRpYWxPcHRpb25zIiwiZnMiLCJyZXF1aXJlIiwidmFycyIsIm9wdGlvbnMiLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwicmVzdWx0IiwidHJlZXNoYWtlIiwidmVyYm9zZSIsInZhbGlkYXRlT3B0aW9ucyIsIl9nZXRWYWxpZGF0ZU9wdGlvbnMiLCJyYyIsImV4aXN0c1N5bmMiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJfZ2V0RGVmYXVsdE9wdGlvbnMiLCJfZ2V0RGVmYXVsdFZhcnMiLCJwbHVnaW5OYW1lIiwiYXBwIiwiX2dldEFwcCIsInRlc3RpbmciLCJsb2d2IiwiZW52aXJvbm1lbnQiLCJwcm9kdWN0aW9uIiwiYnJvd3NlciIsIndhdGNoIiwiY21kb3B0cyIsImluY2x1ZGVzIiwibG9nIiwiX2dldFZlcnNpb25zIiwiaW50ZWxsaXNoYWtlIiwiYnVpbGRzdGVwIiwiX3RvUHJvZCIsImNvbmZpZ09iaiIsImUiLCJ0b1N0cmluZyIsIl90aGlzQ29tcGlsYXRpb24iLCJjb21waWxlciIsImNvbXBpbGF0aW9uIiwic2NyaXB0IiwicnVuU2NyaXB0IiwiZXJyIiwiX2NvbXBpbGF0aW9uIiwiZXh0Q29tcG9uZW50cyIsIl9nZXRBbGxDb21wb25lbnRzIiwiaG9va3MiLCJzdWNjZWVkTW9kdWxlIiwidGFwIiwibW9kdWxlIiwicmVzb3VyY2UiLCJtYXRjaCIsIl9zb3VyY2UiLCJfdmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImRlcHMiLCJfZXh0cmFjdEZyb21Tb3VyY2UiLCJjb25zb2xlIiwiZmluaXNoTW9kdWxlcyIsIm1vZHVsZXMiLCJfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciIsImluamVjdCIsImh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24iLCJkYXRhIiwicGF0aCIsImpzUGF0aCIsImpvaW4iLCJleHRQYXRoIiwiY3NzUGF0aCIsImFzc2V0cyIsImpzIiwidW5zaGlmdCIsImNzcyIsIl9hZnRlckNvbXBpbGUiLCJfZW1pdCIsImNhbGxiYWNrIiwiZW1pdCIsIm91dHB1dFBhdGgiLCJkZXZTZXJ2ZXIiLCJjb250ZW50QmFzZSIsIl9wcmVwYXJlRm9yQnVpbGQiLCJjb21tYW5kIiwicmVidWlsZCIsInBhcm1zIiwiYnVpbGRFbnZpcm9tZW50IiwiQXJyYXkiLCJpc0FycmF5Iiwic3BsaXQiLCJwcm9maWxlIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJzcGxpY2UiLCJpbmRleE9mIiwid2F0Y2hTdGFydGVkIiwiX2J1aWxkRXh0QnVuZGxlIiwiX2RvbmUiLCJzdGF0cyIsImVycm9ycyIsImxlbmd0aCIsImNoYWxrIiwicmVkIiwiX3RvRGV2IiwiYnJvd3NlckNvdW50IiwidXJsIiwicG9ydCIsIm9wbiIsIm91dHB1dCIsInBhY2thZ2VzIiwidG9vbGtpdCIsInRoZW1lIiwicmltcmFmIiwibWtkaXJwIiwiZnN4IiwiZmlyc3RUaW1lIiwic3luYyIsImJ1aWxkWE1MIiwiY3JlYXRlQXBwSnNvbiIsImNyZWF0ZVdvcmtzcGFjZUpzb24iLCJjcmVhdGVKU0RPTUVudmlyb25tZW50Iiwid3JpdGVGaWxlU3luYyIsInByb2Nlc3MiLCJjd2QiLCJmcm9tUGF0aCIsInRvUGF0aCIsImNvcHlTeW5jIiwicmVwbGFjZSIsImZyb21SZXNvdXJjZXMiLCJ0b1Jlc291cmNlcyIsImZpbHRlciIsInZhbHVlIiwiaW5kZXgiLCJtYW5pZmVzdCIsImJ1bmRsZURpciIsInRyaW0iLCJzZW5jaGEiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm9uQnVpbGREb25lIiwib3B0cyIsInNpbGVudCIsInN0ZGlvIiwiZW5jb2RpbmciLCJfZXhlY3V0ZUFzeW5jIiwidGhlbiIsInJlYXNvbiIsIkRFRkFVTFRfU1VCU1RSUyIsInN1YnN0cmluZ3MiLCJjcm9zc1NwYXduIiwic3RyaW5naWZ5IiwiY2hpbGQiLCJvbiIsImNvZGUiLCJzaWduYWwiLCJFcnJvciIsImVycm9yIiwic3Rkb3V0Iiwic3RyIiwic29tZSIsInYiLCJzdGRlcnIiLCJzdHJKYXZhT3B0cyIsInNjcmlwdFBhdGgiLCJjaGlsZFByb2Nlc3MiLCJpbnZva2VkIiwiZm9yayIsImV4ZWNBcmd2IiwiX3RvWHR5cGUiLCJwcmVmaXgiLCJwbGF0Zm9ybSIsImdyZWVuIiwiZnJhbWV3b3JrTmFtZSIsImZyYW1ld29ya0luZm8iLCJwbHVnaW5WZXJzaW9uIiwiZXh0VmVyc2lvbiIsImVkaXRpb24iLCJjbWRWZXJzaW9uIiwid2VicGFja1ZlcnNpb24iLCJwbHVnaW5QYXRoIiwicGx1Z2luUGtnIiwidmVyc2lvbiIsIl9yZXNvbHZlZCIsIndlYnBhY2tQYXRoIiwid2VicGFja1BrZyIsImV4dFBrZyIsImNtZFBhdGgiLCJjbWRQa2ciLCJ2ZXJzaW9uX2Z1bGwiLCJmcmFtZXdvcmtQYXRoIiwiZnJhbWV3b3JrUGtnIiwiZnJhbWV3b3JrVmVyc2lvbiIsIm1lc3NhZ2UiLCJzIiwiY3Vyc29yVG8iLCJjbGVhckxpbmUiLCJ3cml0ZSIsImxvZ2giLCJoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDTyxTQUFTQSxZQUFULENBQXNCQyxjQUF0QixFQUFzQztBQUMzQyxRQUFNQyxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBLE1BQUlDLElBQUksR0FBRyxFQUFYO0FBQ0EsTUFBSUMsT0FBTyxHQUFHLEVBQWQ7O0FBQ0EsTUFBSTtBQUNGLFFBQUlKLGNBQWMsQ0FBQ0ssU0FBZixJQUE0QkMsU0FBaEMsRUFBMkM7QUFDekNILE1BQUFBLElBQUksQ0FBQ0ksWUFBTCxHQUFvQixFQUFwQjtBQUNBSixNQUFBQSxJQUFJLENBQUNJLFlBQUwsQ0FBa0JDLElBQWxCLENBQXVCLDBIQUF2QjtBQUNBLFVBQUlDLE1BQU0sR0FBRztBQUFFTixRQUFBQSxJQUFJLEVBQUVBO0FBQVIsT0FBYjtBQUNBLGFBQU9NLE1B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Z0JBQVEsQ0FBQyxRQUFEO0FBRk0sT0FsREo7QUFzRFosaUJBQVc7QUFDVCx3QkFBZ0Isa0RBRFA7QUFFVCxnQkFBUSxDQUFDLFFBQUQsRUFBVyxPQUFYO0FBRkM7QUF0REMsS0FGVDtBQTZETCw0QkFBd0I7QUE3RG5CLEdBQVA7QUErREQ7O0FBR0QsU0FBU00sa0JBQVQsR0FBOEI7QUFDNUIsU0FBTztBQUNMZCxJQUFBQSxTQUFTLEVBQUUsT0FETjtBQUVMMEcsSUFBQUEsT0FBTyxFQUFFLFFBRko7QUFHTEMsSUFBQUEsS0FBSyxFQUFFLGdCQUhGO0FBSUxqQyxJQUFBQSxJQUFJLEVBQUUsS0FKRDtBQUtMcEMsSUFBQUEsTUFBTSxFQUFFLElBTEg7QUFNTGdFLElBQUFBLElBQUksRUFBRSxJQU5EO0FBT0xHLElBQUFBLFFBQVEsRUFBRSxFQVBMO0FBU0xuQixJQUFBQSxPQUFPLEVBQUUsRUFUSjtBQVVMakUsSUFBQUEsV0FBVyxFQUFFLGFBVlI7QUFXTGhCLElBQUFBLFNBQVMsRUFBRSxJQVhOO0FBWUxrQixJQUFBQSxPQUFPLEVBQUUsS0FaSjtBQWFMQyxJQUFBQSxLQUFLLEVBQUUsS0FiRjtBQWNMbEIsSUFBQUEsT0FBTyxFQUFFLElBZEo7QUFlTHFELElBQUFBLE1BQU0sRUFBRSxLQWZIO0FBZ0JMOUIsSUFBQUEsWUFBWSxFQUFFLEtBaEJUO0FBaUJMSixJQUFBQSxPQUFPLEVBQUU7QUFqQkosR0FBUDtBQW1CRCIsInNvdXJjZXNDb250ZW50IjpbIlxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbnN0cnVjdG9yKGluaXRpYWxPcHRpb25zKSB7XG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICB2YXIgdmFycyA9IHt9XG4gIHZhciBvcHRpb25zID0ge31cbiAgdHJ5IHtcbiAgICBpZiAoaW5pdGlhbE9wdGlvbnMuZnJhbWV3b3JrID09IHVuZGVmaW5lZCkge1xuICAgICAgdmFycy5wbHVnaW5FcnJvcnMgPSBbXVxuICAgICAgdmFycy5wbHVnaW5FcnJvcnMucHVzaCgnd2VicGFjayBjb25maWc6IGZyYW1ld29yayBwYXJhbWV0ZXIgb24gZXh0LXdlYnBhY2stcGx1Z2luIGlzIG5vdCBkZWZpbmVkIC0gdmFsdWVzOiByZWFjdCwgYW5ndWxhciwgZXh0anMsIHdlYi1jb21wb25lbnRzJylcbiAgICAgIHZhciByZXN1bHQgPSB7IHZhcnM6IHZhcnMgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHZhciBmcmFtZXdvcmsgPSBpbml0aWFsT3B0aW9ucy5mcmFtZXdvcmtcbiAgICB2YXIgdHJlZXNoYWtlID0gaW5pdGlhbE9wdGlvbnMudHJlZXNoYWtlXG4gICAgdmFyIHZlcmJvc2UgPSBpbml0aWFsT3B0aW9ucy52ZXJib3NlXG5cbiAgICBjb25zdCB2YWxpZGF0ZU9wdGlvbnMgPSByZXF1aXJlKCdzY2hlbWEtdXRpbHMnKVxuICAgIHZhbGlkYXRlT3B0aW9ucyhfZ2V0VmFsaWRhdGVPcHRpb25zKCksIGluaXRpYWxPcHRpb25zLCAnJylcblxuICAgIGNvbnN0IHJjID0gKGZzLmV4aXN0c1N5bmMoYC5leHQtJHtmcmFtZXdvcmt9cmNgKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhgLmV4dC0ke2ZyYW1ld29ya31yY2AsICd1dGYtOCcpKSB8fCB7fSlcbiAgICBvcHRpb25zID0geyAuLi5fZ2V0RGVmYXVsdE9wdGlvbnMoKSwgLi4uaW5pdGlhbE9wdGlvbnMsIC4uLnJjIH1cblxuICAgIHZhcnMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0RGVmYXVsdFZhcnMoKVxuICAgIHZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gICAgdmFycy5hcHAgPSBfZ2V0QXBwKClcbiAgICB2YXIgcGx1Z2luTmFtZSA9IHZhcnMucGx1Z2luTmFtZVxuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhcnMudGVzdGluZyA9IGZhbHNlXG5cbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfY29uc3RydWN0b3InKVxuICAgIGxvZ3YodmVyYm9zZSwgYHBsdWdpbk5hbWUgLSAke3BsdWdpbk5hbWV9YClcbiAgICBsb2d2KHZlcmJvc2UsIGBhcHAgLSAke2FwcH1gKVxuXG4gICAgaWYgKG9wdGlvbnMuZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXJzLnByb2R1Y3Rpb24gPSB0cnVlXG4gICAgICBvcHRpb25zLmJyb3dzZXIgPSAnbm8nXG4gICAgICBvcHRpb25zLndhdGNoID0gJ25vJ1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhcnMucHJvZHVjdGlvbiA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYob3B0aW9ucy5jbWRvcHRzICYmIChvcHRpb25zLmNtZG9wdHMuaW5jbHVkZXMoJy0tdGVzdGluZycpIHx8IG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLS1lbnZpcm9ubWVudD10ZXN0aW5nJykpKXtcbiAgICAgIHZhcnMucHJvZHVjdGlvbiA9IGZhbHNlXG4gICAgICB2YXJzLnRlc3RpbmcgPSB0cnVlXG4gICAgICBvcHRpb25zLmJyb3dzZXIgPSAnbm8nXG4gICAgICBvcHRpb25zLndhdGNoID0gJ25vJ1xuICAgIH1cblxuICAgIGxvZyhhcHAsIF9nZXRWZXJzaW9ucyhwbHVnaW5OYW1lLCBmcmFtZXdvcmspKVxuXG4gICAgLy9tamcgYWRkZWQgZm9yIGFuZ3VsYXIgY2xpIGJ1aWxkXG4gICAgaWYgKGZyYW1ld29yayA9PSAnYW5ndWxhcicgJiZcbiAgICAgICAgb3B0aW9ucy5pbnRlbGxpc2hha2UgPT0gJ25vJyAmJlxuICAgICAgICB2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZVxuICAgICAgICAmJiB0cmVlc2hha2UgPT0gJ3llcycpIHtcbiAgICAgICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSc7XG4gICAgICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJyArIGZyYW1ld29yayk7XG4gICAgfVxuXG4gICAgZWxzZSBpZiAoZnJhbWV3b3JrID09ICdyZWFjdCcgfHwgZnJhbWV3b3JrID09ICdleHRqcycgfHwgZnJhbWV3b3JrID09ICd3ZWItY29tcG9uZW50cycpIHtcbiAgICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKVxuICAgICAgfVxuICAgICAgZWxzZSBpZih2YXJzLnRlc3RpbmcgPT0gdHJ1ZSl7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIHRlc3RpbmcgYnVpbGQgZm9yICcgKyBmcmFtZXdvcmspXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJ1xuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgZGV2ZWxvcG1lbnQgYnVpbGQgZm9yICcgKyBmcmFtZXdvcmspXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlKSB7XG4gICAgICBpZiAodHJlZXNoYWtlID09ICd5ZXMnKSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMidcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICcgKyBmcmFtZXdvcmsgKyAnIC0gJyArIHZhcnMuYnVpbGRzdGVwKVxuICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fdG9Qcm9kKHZhcnMsIG9wdGlvbnMpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMiBvZiAyJ1xuICAgICAgICBsb2coYXBwLCAnQ29udGludWluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrICsgJyAtICcgKyB2YXJzLmJ1aWxkc3RlcClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICBsb2coYXBwLCAnU3RhcnRpbmcgZGV2ZWxvcG1lbnQgYnVpbGQgZm9yICcgKyBmcmFtZXdvcmspXG4gICAgfVxuICAgIGxvZ3YodmVyYm9zZSwgJ0J1aWxkaW5nIGZvciAnICsgb3B0aW9ucy5lbnZpcm9ubWVudCArICcsICcgKyAndHJlZXNoYWtlIGlzICcgKyBvcHRpb25zLnRyZWVzaGFrZSsgJywgJyArICdpbnRlbGxpc2hha2UgaXMgJyArIG9wdGlvbnMuaW50ZWxsaXNoYWtlKVxuXG4gICAgdmFyIGNvbmZpZ09iaiA9IHsgdmFyczogdmFycywgb3B0aW9uczogb3B0aW9ucyB9O1xuICAgIHJldHVybiBjb25maWdPYmo7XG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyAnX2NvbnN0cnVjdG9yOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3RoaXNDb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF90aGlzQ29tcGlsYXRpb24nKVxuICAgIGxvZ3YodmVyYm9zZSwgYG9wdGlvbnMuc2NyaXB0OiAke29wdGlvbnMuc2NyaXB0IH1gKVxuICAgIGxvZ3YodmVyYm9zZSwgYGJ1aWxkc3RlcDogJHt2YXJzLmJ1aWxkc3RlcH1gKVxuXG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PT0gJzEgb2YgMicpIHtcbiAgICAgIGlmIChvcHRpb25zLnNjcmlwdCAhPSB1bmRlZmluZWQgJiYgb3B0aW9ucy5zY3JpcHQgIT0gbnVsbCAmJiBvcHRpb25zLnNjcmlwdCAhPSAnJykge1xuICAgICAgICBsb2coYXBwLCBgU3RhcnRlZCBydW5uaW5nICR7b3B0aW9ucy5zY3JpcHR9YClcbiAgICAgICAgcnVuU2NyaXB0KG9wdGlvbnMuc2NyaXB0LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsb2coYXBwLCBgRmluaXNoZWQgcnVubmluZyAke29wdGlvbnMuc2NyaXB0fWApXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgdGhyb3cgJ190aGlzQ29tcGlsYXRpb246ICcgKyBlLnRvU3RyaW5nKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfY29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfY29tcGlsYXRpb24nKVxuXG4gICAgaWYgKGZyYW1ld29yayAhPSAnZXh0anMnKSB7XG4gICAgICBpZiAob3B0aW9ucy50cmVlc2hha2UgPT09ICd5ZXMnICYmIG9wdGlvbnMuZW52aXJvbm1lbnQgPT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdO1xuXG4gICAgICAgIC8vbWpnIGZvciAxIHN0ZXAgYnVpbGRcbiAgICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnICYmIGZyYW1ld29yayA9PT0gJ2FuZ3VsYXInICYmIG9wdGlvbnMuaW50ZWxsaXNoYWtlID09ICdubycpIHtcbiAgICAgICAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0QWxsQ29tcG9uZW50cyh2YXJzLCBvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJyB8fCAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScgJiYgZnJhbWV3b3JrID09PSAnd2ViLWNvbXBvbmVudHMnKSkge1xuICAgICAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0QWxsQ29tcG9uZW50cyh2YXJzLCBvcHRpb25zKVxuICAgICAgICB9XG4gICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLnN1Y2NlZWRNb2R1bGUudGFwKGBleHQtc3VjY2VlZC1tb2R1bGVgLCBtb2R1bGUgPT4ge1xuICAgICAgICAgIGlmIChtb2R1bGUucmVzb3VyY2UgJiYgIW1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvbm9kZV9tb2R1bGVzLykpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvXFwuaHRtbCQvKSAhPSBudWxsXG4gICAgICAgICAgICAgICAgJiYgbW9kdWxlLl9zb3VyY2UuX3ZhbHVlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2RvY3R5cGUgaHRtbCcpID09IGZhbHNlXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4ucmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4ucmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLmZpbmlzaE1vZHVsZXMudGFwKGBleHQtZmluaXNoLW1vZHVsZXNgLCBtb2R1bGVzID0+IHtcbiAgICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fd3JpdGVGaWxlc1RvUHJvZEZvbGRlcih2YXJzLCBvcHRpb25zKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09ICcyIG9mIDInKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmluamVjdCA9PT0gJ3llcycpIHtcbiAgICAgICAgICBpZihjb21waWxhdGlvbi5ob29rcy5odG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29tcGlsYXRpb24uaG9va3MuaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbi50YXAoYGV4dC1odG1sLWdlbmVyYXRpb25gLChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAgICAgICAgICAgdmFyIGpzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuanMnKVxuICAgICAgICAgICAgICB2YXIgY3NzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuY3NzJylcbiAgICAgICAgICAgICAgLy92YXIganNQYXRoID0gdmFycy5leHRQYXRoICsgJy8nICsgICdleHQuanMnO1xuICAgICAgICAgICAgICAvL3ZhciBjc3NQYXRoID0gdmFycy5leHRQYXRoICsgJy8nICsgJ2V4dC5jc3MnO1xuICAgICAgICAgICAgICBkYXRhLmFzc2V0cy5qcy51bnNoaWZ0KGpzUGF0aClcbiAgICAgICAgICAgICAgZGF0YS5hc3NldHMuY3NzLnVuc2hpZnQoY3NzUGF0aClcbiAgICAgICAgICAgICAgbG9nKGFwcCwgYEFkZGluZyAke2pzUGF0aH0gYW5kICR7Y3NzUGF0aH0gdG8gaW5kZXguaHRtbGApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgdGhyb3cgJ19jb21waWxhdGlvbjogJyArIGUudG9TdHJpbmcoKVxuLy8gICAgbG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbi8vICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfY29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9hZnRlckNvbXBpbGUoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfYWZ0ZXJDb21waWxlJylcbiAgICBpZiAoZnJhbWV3b3JrID09ICdleHRqcycpIHtcbiAgICAgIHJlcXVpcmUoYC4vZXh0anNVdGlsYCkuX2FmdGVyQ29tcGlsZShjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfYWZ0ZXJDb21waWxlIG5vdCBydW4nKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgdGhyb3cgJ19hZnRlckNvbXBpbGU6ICcgKyBlLnRvU3RyaW5nKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZW1pdChjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGVtaXQgPSBvcHRpb25zLmVtaXRcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICB2YXJzLmNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9lbWl0JylcbiAgICBpZiAoZW1pdCA9PSAneWVzJykge1xuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgICAgIGxldCBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGNvbXBpbGVyLm91dHB1dFBhdGgsdmFycy5leHRQYXRoKVxuICAgICAgICBpZiAoY29tcGlsZXIub3V0cHV0UGF0aCA9PT0gJy8nICYmIGNvbXBpbGVyLm9wdGlvbnMuZGV2U2VydmVyKSB7XG4gICAgICAgICAgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vcHRpb25zLmRldlNlcnZlci5jb250ZW50QmFzZSwgb3V0cHV0UGF0aClcbiAgICAgICAgfVxuICAgICAgICBsb2d2KHZlcmJvc2UsJ291dHB1dFBhdGg6ICcgKyBvdXRwdXRQYXRoKVxuICAgICAgICBsb2d2KHZlcmJvc2UsJ2ZyYW1ld29yazogJyArIGZyYW1ld29yaylcbiAgICAgICAgaWYgKGZyYW1ld29yayAhPSAnZXh0anMnKSB7XG4gICAgICAgICAgX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dFBhdGgsIGNvbXBpbGF0aW9uKVxuICAgICAgICB9XG4gICAgICAgIHZhciBjb21tYW5kID0gJydcbiAgICAgICAgaWYgKG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKVxuICAgICAgICAgIHtjb21tYW5kID0gJ3dhdGNoJ31cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHtjb21tYW5kID0gJ2J1aWxkJ31cbiAgICAgICAgaWYgKHZhcnMucmVidWlsZCA9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHBhcm1zID0gW11cbiAgICAgICAgICB2YXIgYnVpbGRFbnZpcm9tZW50ID0gdmFycy50ZXN0aW5nID09PSB0cnVlID8gJ3Rlc3RpbmcnIDogb3B0aW9ucy5lbnZpcm9ubWVudFxuICAgICAgICAgIGlmKCFBcnJheS5pc0FycmF5KG9wdGlvbnMuY21kb3B0cykpe1xuICAgICAgICAgICAgb3B0aW9ucy5jbWRvcHRzID0gb3B0aW9ucy5jbWRvcHRzLnNwbGl0KCcgJylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG9wdGlvbnMucHJvZmlsZSA9PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5wcm9maWxlID09ICcnIHx8IG9wdGlvbnMucHJvZmlsZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoY29tbWFuZCA9PSAnYnVpbGQnKVxuICAgICAgICAgICAgICB7IHBhcm1zID0gWydhcHAnLCBjb21tYW5kLCBidWlsZEVudmlyb21lbnRdIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgeyBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIGJ1aWxkRW52aXJvbWVudF0gfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpXG4gICAgICAgICAgICAgIHtwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgb3B0aW9ucy5wcm9maWxlLCBidWlsZEVudmlyb21lbnRdfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB7cGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLnByb2ZpbGUsIGJ1aWxkRW52aXJvbWVudF19XG4gICAgICAgICAgfVxuICAgICAgICAgIG9wdGlvbnMuY21kb3B0cy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAgICAgICAgICAgICBwYXJtcy5zcGxpY2UocGFybXMuaW5kZXhPZihjb21tYW5kKSsxLCAwLCBlbGVtZW50KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC8vIGlmICh2YXJzLndhdGNoU3RhcnRlZCA9PSBmYWxzZSkge1xuICAgICAgICAgIC8vICAgYXdhaXQgX2J1aWxkRXh0QnVuZGxlKGFwcCwgY29tcGlsYXRpb24sIG91dHB1dFBhdGgsIHBhcm1zLCB2YXJzLCBvcHRpb25zKVxuICAgICAgICAgIC8vICAgdmFycy53YXRjaFN0YXJ0ZWQgPSB0cnVlXG4gICAgICAgICAgLy8gfVxuICAgICAgICAgIGlmICh2YXJzLndhdGNoU3RhcnRlZCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgYXdhaXQgX2J1aWxkRXh0QnVuZGxlKGFwcCwgY29tcGlsYXRpb24sIG91dHB1dFBhdGgsIHBhcm1zLCB2YXJzLCBvcHRpb25zKVxuICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT0gJ3dhdGNoJykge1xuICAgICAgICAgICAgICB2YXJzLndhdGNoU3RhcnRlZCA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB2YXJzLmNhbGxiYWNrKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy9tamdcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhcnMuY2FsbGJhY2soKVxuICAgICAgICAgIH1cbiAgICAgICAgICAvL21qZ1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhcnMuY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbG9ndih2ZXJib3NlLCdOT1QgcnVubmluZyBlbWl0JylcbiAgICAgICAgdmFycy5jYWxsYmFjaygpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndih2ZXJib3NlLCdlbWl0IGlzIG5vJylcbiAgICAgIHZhcnMuY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgdmFycy5jYWxsYmFjaygpXG4gICAgdGhyb3cgJ19lbWl0OiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2RvbmUoc3RhdHMsIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAgIGxvZ3YodmVyYm9zZSwnRlVOQ1RJT04gX2RvbmUnKVxuICAgIGlmIChzdGF0cy5jb21waWxhdGlvbi5lcnJvcnMgJiYgc3RhdHMuY29tcGlsYXRpb24uZXJyb3JzLmxlbmd0aCkgLy8gJiYgcHJvY2Vzcy5hcmd2LmluZGV4T2YoJy0td2F0Y2gnKSA9PSAtMSlcbiAgICB7XG4gICAgICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpO1xuICAgICAgY29uc29sZS5sb2coY2hhbGsucmVkKCcqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKionKSk7XG4gICAgICBjb25zb2xlLmxvZyhzdGF0cy5jb21waWxhdGlvbi5lcnJvcnNbMF0pO1xuICAgICAgY29uc29sZS5sb2coY2hhbGsucmVkKCcqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKionKSk7XG4gICAgICAvL3Byb2Nlc3MuZXhpdCgwKTtcbiAgICB9XG5cbiAgICAvL21qZyByZWZhY3RvclxuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSAnbm8nICYmIGZyYW1ld29yayA9PSAnYW5ndWxhcicpIHtcbiAgICAgIHJlcXVpcmUoYC4vJHtvcHRpb25zLmZyYW1ld29ya31VdGlsYCkuX3RvRGV2KHZhcnMsIG9wdGlvbnMpXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBpZihvcHRpb25zLmJyb3dzZXIgPT0gJ3llcycgJiYgb3B0aW9ucy53YXRjaCA9PSAneWVzJyAmJiB2YXJzLnByb2R1Y3Rpb24gPT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHZhcnMuYnJvd3NlckNvdW50ID09IDApIHtcbiAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6JyArIG9wdGlvbnMucG9ydFxuICAgICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYE9wZW5pbmcgYnJvd3NlciBhdCAke3VybH1gKVxuICAgICAgICAgIHZhcnMuYnJvd3NlckNvdW50KytcbiAgICAgICAgICBjb25zdCBvcG4gPSByZXF1aXJlKCdvcG4nKVxuICAgICAgICAgIG9wbih1cmwpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJykge1xuICAgICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlKSB7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAke2ZyYW1ld29ya31gKVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAodmFycy50ZXN0aW5nID09IHRydWUpIHtcbiAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIHRlc3RpbmcgYnVpbGQgZm9yICR7ZnJhbWV3b3JrfWApXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIGRldmVsb3BtZW50IGJ1aWxkIGZvciAke2ZyYW1ld29ya31gKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzIgb2YgMicpIHtcbiAgICAgIGlmKHZhcnMudGVzdGluZyA9PSB0cnVlKXtcbiAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIHRlc3RpbmcgYnVpbGQgZm9yICR7ZnJhbWV3b3JrfWApXG4gICAgICB9XG4gICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJHtmcmFtZXdvcmt9YClcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuLy8gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgICB0aHJvdyAnX2RvbmU6ICcgKyBlLnRvU3RyaW5nKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0LCBjb21waWxhdGlvbikge1xuICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIHBhY2thZ2VzID0gb3B0aW9ucy5wYWNrYWdlc1xuICAgIHZhciB0b29sa2l0ID0gb3B0aW9ucy50b29sa2l0XG4gICAgdmFyIHRoZW1lID0gb3B0aW9ucy50aGVtZVxuICAgIGxvZ3YodmVyYm9zZSwnRlVOQ1RJT04gX3ByZXBhcmVGb3JCdWlsZCcpXG4gICAgY29uc3QgcmltcmFmID0gcmVxdWlyZSgncmltcmFmJylcbiAgICBjb25zdCBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKVxuICAgIGNvbnN0IGZzeCA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgdGhlbWUgPSB0aGVtZSB8fCAodG9vbGtpdCA9PT0gJ2NsYXNzaWMnID8gJ3RoZW1lLXRyaXRvbicgOiAndGhlbWUtbWF0ZXJpYWwnKVxuICAgIGxvZ3YodmVyYm9zZSwnZmlyc3RUaW1lOiAnICsgdmFycy5maXJzdFRpbWUpXG4gICAgaWYgKHZhcnMuZmlyc3RUaW1lKSB7XG4gICAgICByaW1yYWYuc3luYyhvdXRwdXQpXG4gICAgICBta2RpcnAuc3luYyhvdXRwdXQpXG4gICAgICBjb25zdCBidWlsZFhNTCA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuYnVpbGRYTUxcbiAgICAgIGNvbnN0IGNyZWF0ZUFwcEpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUFwcEpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZVdvcmtzcGFjZUpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZVdvcmtzcGFjZUpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZUpTRE9NRW52aXJvbm1lbnQgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUpTRE9NRW52aXJvbm1lbnRcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2J1aWxkLnhtbCcpLCBidWlsZFhNTCh2YXJzLnByb2R1Y3Rpb24sIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2FwcC5qc29uJyksIGNyZWF0ZUFwcEpzb24odGhlbWUsIHBhY2thZ2VzLCB0b29sa2l0LCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdqc2RvbS1lbnZpcm9ubWVudC5qcycpLCBjcmVhdGVKU0RPTUVudmlyb25tZW50KG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ3dvcmtzcGFjZS5qc29uJyksIGNyZWF0ZVdvcmtzcGFjZUpzb24ob3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgdmFyIGZyYW1ld29yayA9IHZhcnMuZnJhbWV3b3JrO1xuICAgICAgLy9iZWNhdXNlIG9mIGEgcHJvYmxlbSB3aXRoIGNvbG9ycGlja2VyXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3V4L2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAndXgnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgKHV4KSAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vcGFja2FnZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3BhY2thZ2VzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdvdmVycmlkZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCdyZXNvdXJjZXMvJykpKSB7XG4gICAgICAgIHZhciBmcm9tUmVzb3VyY2VzID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdyZXNvdXJjZXMvJylcbiAgICAgICAgdmFyIHRvUmVzb3VyY2VzID0gcGF0aC5qb2luKG91dHB1dCwgJy4uL3Jlc291cmNlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUmVzb3VyY2VzLCB0b1Jlc291cmNlcylcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21SZXNvdXJjZXMucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9SZXNvdXJjZXMucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgfVxuICAgIHZhcnMuZmlyc3RUaW1lID0gZmFsc2VcbiAgICB2YXIganMgPSAnJ1xuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24pIHtcbiAgICAgIHZhcnMuZGVwcyA9IHZhcnMuZGVwcy5maWx0ZXIoZnVuY3Rpb24odmFsdWUsIGluZGV4KXsgcmV0dXJuIHZhcnMuZGVwcy5pbmRleE9mKHZhbHVlKSA9PSBpbmRleCB9KTtcbiAgICAgIGpzID0gdmFycy5kZXBzLmpvaW4oJztcXG4nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBqcyA9IGBFeHQucmVxdWlyZShbXCJFeHQuKlwiLFwiRXh0LmRhdGEuVHJlZVN0b3JlXCJdKWBcbiAgICB9XG4gICAganMgPSBgRXh0LnJlcXVpcmUoW1wiRXh0LipcIixcIkV4dC5kYXRhLlRyZWVTdG9yZVwiXSlgOyAvL2ZvciBub3dcbiAgICBpZiAodmFycy5tYW5pZmVzdCA9PT0gbnVsbCB8fCBqcyAhPT0gdmFycy5tYW5pZmVzdCkge1xuICAgICAgdmFycy5tYW5pZmVzdCA9IGpzICsgJztcXG5FeHQucmVxdWlyZShbXCJFeHQubGF5b3V0LipcIl0pO1xcbic7XG4gICAgICBjb25zdCBtYW5pZmVzdCA9IHBhdGguam9pbihvdXRwdXQsICdtYW5pZmVzdC5qcycpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKG1hbmlmZXN0LCB2YXJzLm1hbmlmZXN0LCAndXRmOCcpXG4gICAgICB2YXJzLnJlYnVpbGQgPSB0cnVlXG4gICAgICB2YXIgYnVuZGxlRGlyID0gb3V0cHV0LnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpXG4gICAgICBpZiAoYnVuZGxlRGlyLnRyaW0oKSA9PSAnJykge2J1bmRsZURpciA9ICcuLyd9XG4gICAgICBsb2coYXBwLCAnQnVpbGRpbmcgRXh0IGJ1bmRsZSBhdDogJyArIGJ1bmRsZURpcilcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXJzLnJlYnVpbGQgPSBmYWxzZVxuICAgICAgbG9nKGFwcCwgJ0V4dCByZWJ1aWxkIE5PVCBuZWVkZWQnKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX3ByZXBhcmVGb3JCdWlsZDogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2J1aWxkRXh0QnVuZGxlKGFwcCwgY29tcGlsYXRpb24sIG91dHB1dFBhdGgsIHBhcm1zLCB2YXJzLCBvcHRpb25zKSB7XG4gIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9idWlsZEV4dEJ1bmRsZScpXG4gIGxldCBzZW5jaGE7IHRyeSB7IHNlbmNoYSA9IHJlcXVpcmUoJ0BzZW5jaGEvY21kJykgfSBjYXRjaCAoZSkgeyBzZW5jaGEgPSAnc2VuY2hhJyB9XG4gIGlmIChmcy5leGlzdHNTeW5jKHNlbmNoYSkpIHtcbiAgICBsb2d2KHZlcmJvc2UsJ3NlbmNoYSBmb2xkZXIgZXhpc3RzJylcbiAgfVxuICBlbHNlIHtcbiAgICBsb2d2KHZlcmJvc2UsJ3NlbmNoYSBmb2xkZXIgRE9FUyBOT1QgZXhpc3QnKVxuICB9XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3Qgb25CdWlsZERvbmUgPSAoKSA9PiB7XG4gICAgICBsb2d2KHZlcmJvc2UsJ29uQnVpbGREb25lJylcbiAgICAgIHJlc29sdmUoKVxuICAgIH1cbiAgICB2YXIgb3B0cyA9IHsgY3dkOiBvdXRwdXRQYXRoLCBzaWxlbnQ6IHRydWUsIHN0ZGlvOiAncGlwZScsIGVuY29kaW5nOiAndXRmLTgnfVxuICAgIF9leGVjdXRlQXN5bmMoYXBwLCBzZW5jaGEsIHBhcm1zLCBvcHRzLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykudGhlbiAoXG4gICAgICBmdW5jdGlvbigpIHsgb25CdWlsZERvbmUoKSB9LFxuICAgICAgZnVuY3Rpb24ocmVhc29uKSB7IHJlamVjdChyZWFzb24pIH1cbiAgICApXG4gIH0pXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIF9leGVjdXRlQXN5bmMgKGFwcCwgY29tbWFuZCwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAvL2NvbnN0IERFRkFVTFRfU1VCU1RSUyA9IFsnW0lORl0gTG9hZGluZycsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFNlcnZlclwiLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgY29uc3QgREVGQVVMVF9TVUJTVFJTID0gW1wiW0lORl0geFNlcnZlclwiLCAnW0lORl0gTG9hZGluZycsICdbSU5GXSBBcHBlbmQnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbSU5GXSBQcm9jZXNzaW5nIEJ1aWxkJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgdmFyIHN1YnN0cmluZ3MgPSBERUZBVUxUX1NVQlNUUlNcbiAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKVxuICBjb25zdCBjcm9zc1NwYXduID0gcmVxdWlyZSgnY3Jvc3Mtc3Bhd24td2l0aC1raWxsJylcbiAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2V4ZWN1dGVBc3luYycpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBsb2d2KHZlcmJvc2UsYGNvbW1hbmQgLSAke2NvbW1hbmR9YClcbiAgICBsb2d2KHZlcmJvc2UsIGBwYXJtcyAtICR7cGFybXN9YClcbiAgICBsb2d2KHZlcmJvc2UsIGBvcHRzIC0gJHtKU09OLnN0cmluZ2lmeShvcHRzKX1gKVxuICAgIHZhcnMuY2hpbGQgPSBjcm9zc1NwYXduKGNvbW1hbmQsIHBhcm1zLCBvcHRzKVxuXG4gICAgdmFycy5jaGlsZC5vbignY2xvc2UnLCAoY29kZSwgc2lnbmFsKSA9PiB7XG4gICAgICBsb2d2KHZlcmJvc2UsIGBvbiBjbG9zZTogYCArIGNvZGUpXG4gICAgICBpZihjb2RlID09PSAwKSB7IHJlc29sdmUoMCkgfVxuICAgICAgZWxzZSB7IGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCBuZXcgRXJyb3IoY29kZSkgKTsgcmVzb2x2ZSgwKSB9XG4gICAgfSlcbiAgICB2YXJzLmNoaWxkLm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xuICAgICAgbG9ndih2ZXJib3NlLCBgb24gZXJyb3JgKVxuICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goZXJyb3IpXG4gICAgICByZXNvbHZlKDApXG4gICAgfSlcbiAgICB2YXJzLmNoaWxkLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICB2YXIgc3RyID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UoL1xccj9cXG58XFxyL2csIFwiIFwiKS50cmltKClcbiAgICAgIGxvZ3YodmVyYm9zZSwgYCR7c3RyfWApXG4gICAgICAvL2lmIChkYXRhICYmIGRhdGEudG9TdHJpbmcoKS5tYXRjaCgvRmFzaGlvbiB3YWl0aW5nIGZvciBjaGFuZ2VzXFwuXFwuXFwuLykpIHtcbiAgICAgIGlmIChkYXRhICYmIGRhdGEudG9TdHJpbmcoKS5tYXRjaCgvYWl0aW5nIGZvciBjaGFuZ2VzXFwuXFwuXFwuLykpIHtcblxuLy8gICAgICAgICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbi8vICAgICAgICAgICB2YXIgZmlsZW5hbWUgPSBwcm9jZXNzLmN3ZCgpICsgdmFycy50b3VjaEZpbGU7XG4vLyAgICAgICAgICAgdHJ5IHtcbi8vICAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpXG4vLyAgICAgICAgICAgICB2YXIgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSk7XG4vLyAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVuYW1lLCAnLy8nICsgZCwgJ3V0ZjgnKTtcbi8vICAgICAgICAgICAgIGxvZ3YoYXBwLCBgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbi8vICAgICAgICAgICB9XG4vLyAgICAgICAgICAgY2F0Y2goZSkge1xuLy8gICAgICAgICAgICAgbG9ndihhcHAsIGBOT1QgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbi8vICAgICAgICAgICB9XG5cbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbSU5GXVwiLCBcIlwiKVxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltMT0ddXCIsIFwiXCIpXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKS50cmltKClcbiAgICAgICAgaWYgKHN0ci5pbmNsdWRlcyhcIltFUlJdXCIpKSB7XG4gICAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goYXBwICsgc3RyLnJlcGxhY2UoL15cXFtFUlJcXF0gL2dpLCAnJykpO1xuICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0VSUl1cIiwgYCR7Y2hhbGsucmVkKFwiW0VSUl1cIil9YClcbiAgICAgICAgfVxuICAgICAgICBsb2coYXBwLCBzdHIpXG5cbiAgICAgICAgdmFycy5jYWxsYmFjaygpXG4gICAgICAgIHJlc29sdmUoMClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAoc3Vic3RyaW5ncy5zb21lKGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGRhdGEuaW5kZXhPZih2KSA+PSAwOyB9KSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0lORl1cIiwgXCJcIilcbiAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltMT0ddXCIsIFwiXCIpXG4gICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpLnRyaW0oKVxuICAgICAgICAgIGlmIChzdHIuaW5jbHVkZXMoXCJbRVJSXVwiKSkge1xuICAgICAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goYXBwICsgc3RyLnJlcGxhY2UoL15cXFtFUlJcXF0gL2dpLCAnJykpO1xuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbRVJSXVwiLCBgJHtjaGFsay5yZWQoXCJbRVJSXVwiKX1gKVxuICAgICAgICAgIH1cbiAgICAgICAgICBsb2coYXBwLCBzdHIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIHZhcnMuY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgIGxvZ3Yob3B0aW9ucywgYGVycm9yIG9uIGNsb3NlOiBgICsgZGF0YSlcbiAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgdmFyIHN0ckphdmFPcHRzID0gXCJQaWNrZWQgdXAgX0pBVkFfT1BUSU9OU1wiO1xuICAgICAgdmFyIGluY2x1ZGVzID0gc3RyLmluY2x1ZGVzKHN0ckphdmFPcHRzKVxuICAgICAgaWYgKCFpbmNsdWRlcykge1xuICAgICAgICBjb25zb2xlLmxvZyhgJHthcHB9ICR7Y2hhbGsucmVkKFwiW0VSUl1cIil9ICR7c3RyfWApXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbn1cblxuLy8qKioqKioqKioqXG5mdW5jdGlvbiBydW5TY3JpcHQoc2NyaXB0UGF0aCwgY2FsbGJhY2spIHtcbiAgdmFyIGNoaWxkUHJvY2VzcyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcbiAgLy8ga2VlcCB0cmFjayBvZiB3aGV0aGVyIGNhbGxiYWNrIGhhcyBiZWVuIGludm9rZWQgdG8gcHJldmVudCBtdWx0aXBsZSBpbnZvY2F0aW9uc1xuICB2YXIgaW52b2tlZCA9IGZhbHNlO1xuICB2YXIgcHJvY2VzcyA9IGNoaWxkUHJvY2Vzcy5mb3JrKHNjcmlwdFBhdGgsIFtdLCB7IGV4ZWNBcmd2IDogWyctLWluc3BlY3Q9MCddIH0pO1xuICAvLyBsaXN0ZW4gZm9yIGVycm9ycyBhcyB0aGV5IG1heSBwcmV2ZW50IHRoZSBleGl0IGV2ZW50IGZyb20gZmlyaW5nXG4gIHByb2Nlc3Mub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfSk7XG4gIC8vIGV4ZWN1dGUgdGhlIGNhbGxiYWNrIG9uY2UgdGhlIHByb2Nlc3MgaGFzIGZpbmlzaGVkIHJ1bm5pbmdcbiAgcHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uIChjb2RlKSB7XG4gICAgaWYgKGludm9rZWQpIHJldHVybjtcbiAgICBpbnZva2VkID0gdHJ1ZTtcbiAgICB2YXIgZXJyID0gY29kZSA9PT0gMCA/IG51bGwgOiBuZXcgRXJyb3IoJ2V4aXQgY29kZSAnICsgY29kZSk7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfSk7XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF90b1h0eXBlKHN0cikge1xuICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnLScpXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRBcHAoKSB7XG4gIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbiAgdmFyIHByZWZpeCA9IGBgXG4gIGNvbnN0IHBsYXRmb3JtID0gcmVxdWlyZSgnb3MnKS5wbGF0Zm9ybSgpXG4gIGlmIChwbGF0Zm9ybSA9PSAnZGFyd2luJykgeyBwcmVmaXggPSBg4oS5IO+9omV4dO+9ozpgIH1cbiAgZWxzZSB7IHByZWZpeCA9IGBpIFtleHRdOmAgfVxuICByZXR1cm4gYCR7Y2hhbGsuZ3JlZW4ocHJlZml4KX0gYFxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0VmVyc2lvbnMocGx1Z2luTmFtZSwgZnJhbWV3b3JrTmFtZSkge1xudHJ5IHtcbiAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgdmFyIHYgPSB7fVxuICB2YXIgZnJhbWV3b3JrSW5mbyA9ICduL2EnXG5cbiAgdi5wbHVnaW5WZXJzaW9uID0gJ24vYSc7XG4gIHYuZXh0VmVyc2lvbiA9ICduL2EnO1xuICB2LmVkaXRpb24gPSAnbi9hJztcbiAgdi5jbWRWZXJzaW9uID0gJ24vYSc7XG4gIHYud2VicGFja1ZlcnNpb24gPSAnbi9hJztcblxuICB2YXIgcGx1Z2luUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQHNlbmNoYScsIHBsdWdpbk5hbWUpXG4gIHZhciBwbHVnaW5Qa2cgPSAoZnMuZXhpc3RzU3luYyhwbHVnaW5QYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGx1Z2luUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYucGx1Z2luVmVyc2lvbiA9IHBsdWdpblBrZy52ZXJzaW9uXG4gIHYuX3Jlc29sdmVkID0gcGx1Z2luUGtnLl9yZXNvbHZlZFxuICBpZiAodi5fcmVzb2x2ZWQgPT0gdW5kZWZpbmVkKSB7XG4gICAgdi5lZGl0aW9uID0gYENvbW1lcmNpYWxgXG4gIH1cbiAgZWxzZSB7XG4gICAgaWYgKC0xID09IHYuX3Jlc29sdmVkLmluZGV4T2YoJ2NvbW11bml0eScpKSB7XG4gICAgICB2LmVkaXRpb24gPSBgQ29tbWVyY2lhbGBcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2LmVkaXRpb24gPSBgQ29tbXVuaXR5YFxuICAgIH1cbiAgfVxuICB2YXIgd2VicGFja1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL3dlYnBhY2snKVxuICB2YXIgd2VicGFja1BrZyA9IChmcy5leGlzdHNTeW5jKHdlYnBhY2tQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMod2VicGFja1BhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LndlYnBhY2tWZXJzaW9uID0gd2VicGFja1BrZy52ZXJzaW9uXG4gIHZhciBleHRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dCcpXG4gIHZhciBleHRQa2cgPSAoZnMuZXhpc3RzU3luYyhleHRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZXh0UGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYuZXh0VmVyc2lvbiA9IGV4dFBrZy5zZW5jaGEudmVyc2lvblxuICB2YXIgY21kUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLGBub2RlX21vZHVsZXMvQHNlbmNoYS9jbWRgKVxuICB2YXIgY21kUGtnID0gKGZzLmV4aXN0c1N5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXG4gIGlmICh2LmNtZFZlcnNpb24gPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGNtZFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSxgbm9kZV9tb2R1bGVzL0BzZW5jaGEvJHtwbHVnaW5OYW1lfS9ub2RlX21vZHVsZXMvQHNlbmNoYS9jbWRgKVxuICAgIHZhciBjbWRQa2cgPSAoZnMuZXhpc3RzU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gICAgdi5jbWRWZXJzaW9uID0gY21kUGtnLnZlcnNpb25fZnVsbFxuICB9XG5cbiAgIGlmIChmcmFtZXdvcmtOYW1lICE9IHVuZGVmaW5lZCAmJiBmcmFtZXdvcmtOYW1lICE9ICdleHRqcycpIHtcbiAgICB2YXIgZnJhbWV3b3JrUGF0aCA9ICcnXG4gICAgaWYgKGZyYW1ld29ya05hbWUgPT0gJ3JlYWN0Jykge1xuICAgICAgZnJhbWV3b3JrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvcmVhY3QnKVxuICAgIH1cbiAgICBpZiAoZnJhbWV3b3JrTmFtZSA9PSAnYW5ndWxhcicpIHtcbiAgICAgIGZyYW1ld29ya1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL2NvcmUnKVxuICAgIH1cbiAgICB2YXIgZnJhbWV3b3JrUGtnID0gKGZzLmV4aXN0c1N5bmMoZnJhbWV3b3JrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGZyYW1ld29ya1BhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICAgIHYuZnJhbWV3b3JrVmVyc2lvbiA9IGZyYW1ld29ya1BrZy52ZXJzaW9uXG4gICAgaWYgKHYuZnJhbWV3b3JrVmVyc2lvbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgIGZyYW1ld29ya0luZm8gPSAnLCAnICsgZnJhbWV3b3JrTmFtZVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGZyYW1ld29ya0luZm8gPSAnLCAnICsgZnJhbWV3b3JrTmFtZSArICcgdicgKyB2LmZyYW1ld29ya1ZlcnNpb25cbiAgICB9XG4gIH1cbiAgcmV0dXJuICdleHQtd2VicGFjay1wbHVnaW4gdicgKyB2LnBsdWdpblZlcnNpb24gKyAnLCBFeHQgSlMgdicgKyB2LmV4dFZlcnNpb24gKyAnICcgKyB2LmVkaXRpb24gKyAnIEVkaXRpb24sIFNlbmNoYSBDbWQgdicgKyB2LmNtZFZlcnNpb24gKyAnLCB3ZWJwYWNrIHYnICsgdi53ZWJwYWNrVmVyc2lvbiArIGZyYW1ld29ya0luZm9cblxufVxuY2F0Y2ggKGUpIHtcbiAgcmV0dXJuICdleHQtd2VicGFjay1wbHVnaW4gdicgKyB2LnBsdWdpblZlcnNpb24gKyAnLCBFeHQgSlMgdicgKyB2LmV4dFZlcnNpb24gKyAnICcgKyB2LmVkaXRpb24gKyAnIEVkaXRpb24sIFNlbmNoYSBDbWQgdicgKyB2LmNtZFZlcnNpb24gKyAnLCB3ZWJwYWNrIHYnICsgdi53ZWJwYWNrVmVyc2lvbiArIGZyYW1ld29ya0luZm9cbn1cblxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBsb2coYXBwLG1lc3NhZ2UpIHtcbiAgdmFyIHMgPSBhcHAgKyBtZXNzYWdlXG4gIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gIHRyeSB7cHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKCl9Y2F0Y2goZSkge31cbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocyk7cHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2goYXBwLG1lc3NhZ2UpIHtcbiAgdmFyIGggPSBmYWxzZVxuICB2YXIgcyA9IGFwcCArIG1lc3NhZ2VcbiAgaWYgKGggPT0gdHJ1ZSkge1xuICAgIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgfVxuICAgIGNhdGNoKGUpIHt9XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocylcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBsb2d2KHZlcmJvc2UsIHMpIHtcbiAgaWYgKHZlcmJvc2UgPT0gJ3llcycpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGAtdmVyYm9zZTogJHtzfWApXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2dldFZhbGlkYXRlT3B0aW9ucygpIHtcbiAgcmV0dXJuIHtcbiAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICBcInByb3BlcnRpZXNcIjoge1xuICAgICAgXCJmcmFtZXdvcmtcIjoge1xuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJ0b29sa2l0XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwidGhlbWVcIjoge1xuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJlbWl0XCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ3llcycgb3IgJ25vJyBzdHJpbmcgdmFsdWUgKE5PVCB0cnVlIG9yIGZhbHNlKVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJzY3JpcHRcIjoge1xuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJwb3J0XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcImludGVnZXJcIl1cbiAgICAgIH0sXG4gICAgICBcInBhY2thZ2VzXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiLCBcImFycmF5XCJdXG4gICAgICB9LFxuICAgICAgXCJwcm9maWxlXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiZW52aXJvbm1lbnRcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAnZGV2ZWxvcG1lbnQnIG9yICdwcm9kdWN0aW9uJyBzdHJpbmcgdmFsdWVcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwidHJlZXNoYWtlXCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ3llcycgb3IgJ25vJyBzdHJpbmcgdmFsdWUgKE5PVCB0cnVlIG9yIGZhbHNlKVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJicm93c2VyXCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ3llcycgb3IgJ25vJyBzdHJpbmcgdmFsdWUgKE5PVCB0cnVlIG9yIGZhbHNlKVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJ3YXRjaFwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwidmVyYm9zZVwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiaW5qZWN0XCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ3llcycgb3IgJ25vJyBzdHJpbmcgdmFsdWUgKE5PVCB0cnVlIG9yIGZhbHNlKVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJpbnRlbGxpc2hha2VcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImNtZG9wdHNcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSBhIHNlbmNoYSBjbWQgb3B0aW9uIG9yIGFyZ3VtZW50IHN0cmluZ1wiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCIsIFwiYXJyYXlcIl1cbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjogZmFsc2VcbiAgfTtcbn1cblxuXG5mdW5jdGlvbiBfZ2V0RGVmYXVsdE9wdGlvbnMoKSB7XG4gIHJldHVybiB7XG4gICAgZnJhbWV3b3JrOiAnZXh0anMnLFxuICAgIHRvb2xraXQ6ICdtb2Rlcm4nLFxuICAgIHRoZW1lOiAndGhlbWUtbWF0ZXJpYWwnLFxuICAgIGVtaXQ6ICd5ZXMnLFxuICAgIHNjcmlwdDogbnVsbCxcbiAgICBwb3J0OiAxOTYyLFxuICAgIHBhY2thZ2VzOiBbXSxcblxuICAgIHByb2ZpbGU6ICcnLFxuICAgIGVudmlyb25tZW50OiAnZGV2ZWxvcG1lbnQnLFxuICAgIHRyZWVzaGFrZTogJ25vJyxcbiAgICBicm93c2VyOiAneWVzJyxcbiAgICB3YXRjaDogJ3llcycsXG4gICAgdmVyYm9zZTogJ25vJyxcbiAgICBpbmplY3Q6ICd5ZXMnLFxuICAgIGludGVsbGlzaGFrZTogJ3llcycsXG4gICAgY21kb3B0czogJydcbiAgfVxufVxuIl19