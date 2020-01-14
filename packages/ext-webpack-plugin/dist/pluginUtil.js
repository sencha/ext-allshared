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

    log(app, _getVersions(pluginName, framework)); //mjg added for angular cli build

    if (framework == 'angular' && options.intellishake == 'no' && vars.production == true && treeshake == 'yes') {
      vars.buildstep = '1 of 1';
      log(app, 'Starting production build for ' + framework);
    } else if (framework == 'react' || framework == 'extjs' || framework == 'web-components') {
      if (vars.production == true) {
        vars.buildstep = '1 of 1';
        log(app, 'Starting production build for ' + framework);
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
          compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tap(`ext-html-generation`, data => {
            const path = require('path');

            var jsPath = path.join(vars.extPath, 'ext.js');
            var cssPath = path.join(vars.extPath, 'ext.css'); //             var jsPath = vars.extPath + '/' +  'ext.js';
            //             var cssPath = vars.extPath + '/' + 'ext.css';

            data.assets.js.unshift(jsPath);
            data.assets.css.unshift(cssPath);
            log(app, `Adding ${jsPath} and ${cssPath} to index.html`);
          });
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
  _emit2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(compiler, compilation, vars, options, callback) {
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
          logv(verbose, 'FUNCTION _emit');

          if (!(emit == 'yes')) {
            _context.next = 33;
            break;
          }

          if (!(vars.buildstep == '1 of 1' || vars.buildstep == '1 of 2')) {
            _context.next = 29;
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
            _context.next = 26;
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
            _context.next = 23;
            break;
          }

          _context.next = 22;
          return _buildExtBundle(app, compilation, outputPath, parms, vars, options);

        case 22:
          vars.watchStarted = true;

        case 23:
          callback();
          _context.next = 27;
          break;

        case 26:
          callback();

        case 27:
          _context.next = 31;
          break;

        case 29:
          logv(verbose, 'NOT running emit');
          callback();

        case 31:
          _context.next = 35;
          break;

        case 33:
          logv(verbose, 'emit is no');
          callback();

        case 35:
          _context.next = 41;
          break;

        case 37:
          _context.prev = 37;
          _context.t0 = _context["catch"](0);
          callback();
          throw '_emit: ' + _context.t0.toString();

        case 41:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 37]]);
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
        console.log(chalk.red('******************************************'));
        process.exit(0);
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
      } else {
        require('./pluginUtil').log(vars.app, `Ending development build for ${framework}`);
      }
    }

    if (vars.buildstep == '2 of 2') {
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
  //  try {
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
  }); // }
  // catch(e) {
  //   console.log('e')
  //   require('./pluginUtil').logv(options.verbose,e)
  //   compilation.errors.push('_buildExtBundle: ' + e)
  //   callback()
  // }
} //**********


function _executeAsync(_x6, _x7, _x8, _x9, _x10, _x11, _x12) {
  return _executeAsync2.apply(this, arguments);
} //**********


function _executeAsync2() {
  _executeAsync2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(app, command, parms, opts, compilation, vars, options) {
    var verbose, framework, DEFAULT_SUBSTRS, substrings, chalk, crossSpawn;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          //  try {
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
            logv(verbose, `opts - ${JSON.stringify(opts)}`); //let child = crossSpawn(command, parms, opts)
            //console.log('child')
            //console.log(vars.child)

            vars.child = crossSpawn(command, parms, opts); //console.log('child')
            //console.log(vars.child)

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
              logv(verbose, `${str}`);

              if (data && data.toString().match(/Fashion waiting for changes\.\.\./)) {
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
    intellishake: 'yes'
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsImluaXRpYWxPcHRpb25zIiwiZnMiLCJyZXF1aXJlIiwidmFycyIsIm9wdGlvbnMiLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwicmVzdWx0IiwidHJlZXNoYWtlIiwidmVyYm9zZSIsInZhbGlkYXRlT3B0aW9ucyIsIl9nZXRWYWxpZGF0ZU9wdGlvbnMiLCJyYyIsImV4aXN0c1N5bmMiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJfZ2V0RGVmYXVsdE9wdGlvbnMiLCJfZ2V0RGVmYXVsdFZhcnMiLCJwbHVnaW5OYW1lIiwiYXBwIiwiX2dldEFwcCIsImxvZ3YiLCJlbnZpcm9ubWVudCIsInByb2R1Y3Rpb24iLCJicm93c2VyIiwid2F0Y2giLCJsb2ciLCJfZ2V0VmVyc2lvbnMiLCJpbnRlbGxpc2hha2UiLCJidWlsZHN0ZXAiLCJfdG9Qcm9kIiwiY29uZmlnT2JqIiwiZSIsInRvU3RyaW5nIiwiX3RoaXNDb21waWxhdGlvbiIsImNvbXBpbGVyIiwiY29tcGlsYXRpb24iLCJzY3JpcHQiLCJydW5TY3JpcHQiLCJlcnIiLCJfY29tcGlsYXRpb24iLCJleHRDb21wb25lbnRzIiwiX2dldEFsbENvbXBvbmVudHMiLCJob29rcyIsInN1Y2NlZWRNb2R1bGUiLCJ0YXAiLCJtb2R1bGUiLCJyZXNvdXJjZSIsIm1hdGNoIiwiX3NvdXJjZSIsIl92YWx1ZSIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJkZXBzIiwiX2V4dHJhY3RGcm9tU291cmNlIiwiY29uc29sZSIsImZpbmlzaE1vZHVsZXMiLCJtb2R1bGVzIiwiX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIiLCJpbmplY3QiLCJodG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uIiwiZGF0YSIsInBhdGgiLCJqc1BhdGgiLCJqb2luIiwiZXh0UGF0aCIsImNzc1BhdGgiLCJhc3NldHMiLCJqcyIsInVuc2hpZnQiLCJjc3MiLCJfYWZ0ZXJDb21waWxlIiwiX2VtaXQiLCJjYWxsYmFjayIsImVtaXQiLCJvdXRwdXRQYXRoIiwiZGV2U2VydmVyIiwiY29udGVudEJhc2UiLCJfcHJlcGFyZUZvckJ1aWxkIiwiY29tbWFuZCIsInJlYnVpbGQiLCJwYXJtcyIsInByb2ZpbGUiLCJ3YXRjaFN0YXJ0ZWQiLCJfYnVpbGRFeHRCdW5kbGUiLCJfZG9uZSIsInN0YXRzIiwiZXJyb3JzIiwibGVuZ3RoIiwiY2hhbGsiLCJyZWQiLCJwcm9jZXNzIiwiZXhpdCIsIl90b0RldiIsImJyb3dzZXJDb3VudCIsInVybCIsInBvcnQiLCJvcG4iLCJvdXRwdXQiLCJwYWNrYWdlcyIsInRvb2xraXQiLCJ0aGVtZSIsInJpbXJhZiIsIm1rZGlycCIsImZzeCIsImZpcnN0VGltZSIsInN5bmMiLCJidWlsZFhNTCIsImNyZWF0ZUFwcEpzb24iLCJjcmVhdGVXb3Jrc3BhY2VKc29uIiwiY3JlYXRlSlNET01FbnZpcm9ubWVudCIsIndyaXRlRmlsZVN5bmMiLCJjd2QiLCJmcm9tUGF0aCIsInRvUGF0aCIsImNvcHlTeW5jIiwicmVwbGFjZSIsImZyb21SZXNvdXJjZXMiLCJ0b1Jlc291cmNlcyIsImZpbHRlciIsInZhbHVlIiwiaW5kZXgiLCJpbmRleE9mIiwibWFuaWZlc3QiLCJidW5kbGVEaXIiLCJ0cmltIiwic2VuY2hhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbkJ1aWxkRG9uZSIsIm9wdHMiLCJzaWxlbnQiLCJzdGRpbyIsImVuY29kaW5nIiwiX2V4ZWN1dGVBc3luYyIsInRoZW4iLCJyZWFzb24iLCJERUZBVUxUX1NVQlNUUlMiLCJzdWJzdHJpbmdzIiwiY3Jvc3NTcGF3biIsInN0cmluZ2lmeSIsImNoaWxkIiwib24iLCJjb2RlIiwic2lnbmFsIiwiRXJyb3IiLCJlcnJvciIsInN0ZG91dCIsInN0ciIsInNvbWUiLCJ2Iiwic3RkZXJyIiwic3RySmF2YU9wdHMiLCJzY3JpcHRQYXRoIiwiY2hpbGRQcm9jZXNzIiwiaW52b2tlZCIsImZvcmsiLCJfdG9YdHlwZSIsInByZWZpeCIsInBsYXRmb3JtIiwiZ3JlZW4iLCJmcmFtZXdvcmtOYW1lIiwiZnJhbWV3b3JrSW5mbyIsInBsdWdpblZlcnNpb24iLCJleHRWZXJzaW9uIiwiZWRpdGlvbiIsImNtZFZlcnNpb24iLCJ3ZWJwYWNrVmVyc2lvbiIsInBsdWdpblBhdGgiLCJwbHVnaW5Qa2ciLCJ2ZXJzaW9uIiwiX3Jlc29sdmVkIiwid2VicGFja1BhdGgiLCJ3ZWJwYWNrUGtnIiwiZXh0UGtnIiwiY21kUGF0aCIsImNtZFBrZyIsInZlcnNpb25fZnVsbCIsImZyYW1ld29ya1BhdGgiLCJmcmFtZXdvcmtQa2ciLCJmcmFtZXdvcmtWZXJzaW9uIiwibWVzc2FnZSIsInMiLCJjdXJzb3JUbyIsImNsZWFyTGluZSIsIndyaXRlIiwibG9naCIsImgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTtBQUNPLFNBQVNBLFlBQVQsQ0FBc0JDLGNBQXRCLEVBQXNDO0FBQzNDLFFBQU1DLEVBQUUsR0FBR0MsT0FBTyxDQUFDLElBQUQsQ0FBbEI7O0FBQ0EsTUFBSUMsSUFBSSxHQUFHLEVBQVg7QUFDQSxNQUFJQyxPQUFPLEdBQUcsRUFBZDs7QUFDQSxNQUFJO0FBQ0YsUUFBSUosY0FBYyxDQUFDSyxTQUFmLElBQTRCQyxTQUFoQyxFQUEyQztBQUN6Q0gsTUFBQUEsSUFBSSxDQUFDSSxZQUFMLEdBQW9CLEVBQXBCO0FBQ0FKLE1BQUFBLElBQUksQ0FBQ0ksWUFBTCxDQUFrQkMsSUFBbEIsQ0FBdUIsMEhBQXZCO0FBQ0EsVUFBSUMsTUFBTSxHQUFHO0FBQUVOLFFBQUFBLElBQUksRUFBRUE7QUFBUixPQUFiO0FBQ0EsYUFBT00sTUFBUDtBQUNEOztBQUNELFFBQUlKLFNBQVMsR0FBR0wsY0FBYyxDQUFDSyxTQUEvQjtBQUNBLFFBQUlLLFNBQVMsR0FBR1YsY0FBYyxDQUFDVSxTQUEvQjtBQUNBLFFBQUlD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RSxFQVRKO0FBVUw1RCxJQUFBQSxXQUFXLEVBQUUsYUFWUjtBQVdMZixJQUFBQSxTQUFTLEVBQUUsSUFYTjtBQVlMaUIsSUFBQUEsT0FBTyxFQUFFLEtBWko7QUFhTEMsSUFBQUEsS0FBSyxFQUFFLEtBYkY7QUFjTGpCLElBQUFBLE9BQU8sRUFBRSxJQWRKO0FBZUxtRCxJQUFBQSxNQUFNLEVBQUUsS0FmSDtBQWdCTC9CLElBQUFBLFlBQVksRUFBRTtBQWhCVCxHQUFQO0FBa0JEIiwic291cmNlc0NvbnRlbnQiOlsiXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfY29uc3RydWN0b3IoaW5pdGlhbE9wdGlvbnMpIHtcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gIHZhciB2YXJzID0ge31cbiAgdmFyIG9wdGlvbnMgPSB7fVxuICB0cnkge1xuICAgIGlmIChpbml0aWFsT3B0aW9ucy5mcmFtZXdvcmsgPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXJzLnBsdWdpbkVycm9ycyA9IFtdXG4gICAgICB2YXJzLnBsdWdpbkVycm9ycy5wdXNoKCd3ZWJwYWNrIGNvbmZpZzogZnJhbWV3b3JrIHBhcmFtZXRlciBvbiBleHQtd2VicGFjay1wbHVnaW4gaXMgbm90IGRlZmluZWQgLSB2YWx1ZXM6IHJlYWN0LCBhbmd1bGFyLCBleHRqcywgd2ViLWNvbXBvbmVudHMnKVxuICAgICAgdmFyIHJlc3VsdCA9IHsgdmFyczogdmFycyB9O1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgdmFyIGZyYW1ld29yayA9IGluaXRpYWxPcHRpb25zLmZyYW1ld29ya1xuICAgIHZhciB0cmVlc2hha2UgPSBpbml0aWFsT3B0aW9ucy50cmVlc2hha2VcbiAgICB2YXIgdmVyYm9zZSA9IGluaXRpYWxPcHRpb25zLnZlcmJvc2VcblxuICAgIGNvbnN0IHZhbGlkYXRlT3B0aW9ucyA9IHJlcXVpcmUoJ3NjaGVtYS11dGlscycpXG4gICAgdmFsaWRhdGVPcHRpb25zKF9nZXRWYWxpZGF0ZU9wdGlvbnMoKSwgaW5pdGlhbE9wdGlvbnMsICcnKVxuXG4gICAgY29uc3QgcmMgPSAoZnMuZXhpc3RzU3luYyhgLmV4dC0ke2ZyYW1ld29ya31yY2ApICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGAuZXh0LSR7ZnJhbWV3b3JrfXJjYCwgJ3V0Zi04JykpIHx8IHt9KVxuICAgIG9wdGlvbnMgPSB7IC4uLl9nZXREZWZhdWx0T3B0aW9ucygpLCAuLi5pbml0aWFsT3B0aW9ucywgLi4ucmMgfVxuXG4gICAgdmFycyA9IHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9nZXREZWZhdWx0VmFycygpXG4gICAgdmFycy5wbHVnaW5OYW1lID0gJ2V4dC13ZWJwYWNrLXBsdWdpbidcbiAgICB2YXJzLmFwcCA9IF9nZXRBcHAoKVxuICAgIHZhciBwbHVnaW5OYW1lID0gdmFycy5wbHVnaW5OYW1lXG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG5cbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfY29uc3RydWN0b3InKVxuICAgIGxvZ3YodmVyYm9zZSwgYHBsdWdpbk5hbWUgLSAke3BsdWdpbk5hbWV9YClcbiAgICBsb2d2KHZlcmJvc2UsIGBhcHAgLSAke2FwcH1gKVxuXG4gICAgaWYgKG9wdGlvbnMuZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXJzLnByb2R1Y3Rpb24gPSB0cnVlXG4gICAgICBvcHRpb25zLmJyb3dzZXIgPSAnbm8nXG4gICAgICBvcHRpb25zLndhdGNoID0gJ25vJ1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhcnMucHJvZHVjdGlvbiA9IGZhbHNlXG4gICAgfVxuXG4gICAgbG9nKGFwcCwgX2dldFZlcnNpb25zKHBsdWdpbk5hbWUsIGZyYW1ld29yaykpXG5cbiAgICAvL21qZyBhZGRlZCBmb3IgYW5ndWxhciBjbGkgYnVpbGRcbiAgICBpZiAoZnJhbWV3b3JrID09ICdhbmd1bGFyJyAmJlxuICAgICAgICBvcHRpb25zLmludGVsbGlzaGFrZSA9PSAnbm8nICYmXG4gICAgICAgIHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlXG4gICAgICAgICYmIHRyZWVzaGFrZSA9PSAneWVzJykge1xuICAgICAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJztcbiAgICAgICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKTtcbiAgICB9XG5cbiAgICBlbHNlIGlmIChmcmFtZXdvcmsgPT0gJ3JlYWN0JyB8fCBmcmFtZXdvcmsgPT0gJ2V4dGpzJyB8fCBmcmFtZXdvcmsgPT0gJ3dlYi1jb21wb25lbnRzJykge1xuICAgICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlKSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICcgKyBmcmFtZXdvcmspXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJ1xuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgZGV2ZWxvcG1lbnQgYnVpbGQgZm9yICcgKyBmcmFtZXdvcmspXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlKSB7XG4gICAgICBpZiAodHJlZXNoYWtlID09ICd5ZXMnKSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMidcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICcgKyBmcmFtZXdvcmsgKyAnIC0gJyArIHZhcnMuYnVpbGRzdGVwKVxuICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fdG9Qcm9kKHZhcnMsIG9wdGlvbnMpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMiBvZiAyJ1xuICAgICAgICBsb2coYXBwLCAnQ29udGludWluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrICsgJyAtICcgKyB2YXJzLmJ1aWxkc3RlcClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICBsb2coYXBwLCAnU3RhcnRpbmcgZGV2ZWxvcG1lbnQgYnVpbGQgZm9yICcgKyBmcmFtZXdvcmspXG4gICAgfVxuICAgIGxvZ3YodmVyYm9zZSwgJ0J1aWxkaW5nIGZvciAnICsgb3B0aW9ucy5lbnZpcm9ubWVudCArICcsICcgKyAndHJlZXNoYWtlIGlzICcgKyBvcHRpb25zLnRyZWVzaGFrZSsgJywgJyArICdpbnRlbGxpc2hha2UgaXMgJyArIG9wdGlvbnMuaW50ZWxsaXNoYWtlKVxuXG4gICAgdmFyIGNvbmZpZ09iaiA9IHsgdmFyczogdmFycywgb3B0aW9uczogb3B0aW9ucyB9O1xuICAgIHJldHVybiBjb25maWdPYmo7XG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyAnX2NvbnN0cnVjdG9yOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3RoaXNDb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF90aGlzQ29tcGlsYXRpb24nKVxuICAgIGxvZ3YodmVyYm9zZSwgYG9wdGlvbnMuc2NyaXB0OiAke29wdGlvbnMuc2NyaXB0IH1gKVxuICAgIGxvZ3YodmVyYm9zZSwgYGJ1aWxkc3RlcDogJHt2YXJzLmJ1aWxkc3RlcH1gKVxuXG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PT0gJzEgb2YgMicpIHtcbiAgICAgIGlmIChvcHRpb25zLnNjcmlwdCAhPSB1bmRlZmluZWQgJiYgb3B0aW9ucy5zY3JpcHQgIT0gbnVsbCAmJiBvcHRpb25zLnNjcmlwdCAhPSAnJykge1xuICAgICAgICBsb2coYXBwLCBgU3RhcnRlZCBydW5uaW5nICR7b3B0aW9ucy5zY3JpcHR9YClcbiAgICAgICAgcnVuU2NyaXB0KG9wdGlvbnMuc2NyaXB0LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsb2coYXBwLCBgRmluaXNoZWQgcnVubmluZyAke29wdGlvbnMuc2NyaXB0fWApXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgdGhyb3cgJ190aGlzQ29tcGlsYXRpb246ICcgKyBlLnRvU3RyaW5nKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfY29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfY29tcGlsYXRpb24nKVxuXG4gICAgaWYgKGZyYW1ld29yayAhPSAnZXh0anMnKSB7XG4gICAgICBpZiAob3B0aW9ucy50cmVlc2hha2UgPT09ICd5ZXMnICYmIG9wdGlvbnMuZW52aXJvbm1lbnQgPT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdO1xuXG4gICAgICAgIC8vbWpnIGZvciAxIHN0ZXAgYnVpbGRcbiAgICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnICYmIGZyYW1ld29yayA9PT0gJ2FuZ3VsYXInICYmIG9wdGlvbnMuaW50ZWxsaXNoYWtlID09ICdubycpIHtcbiAgICAgICAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0QWxsQ29tcG9uZW50cyh2YXJzLCBvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJyB8fCAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScgJiYgZnJhbWV3b3JrID09PSAnd2ViLWNvbXBvbmVudHMnKSkge1xuICAgICAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0QWxsQ29tcG9uZW50cyh2YXJzLCBvcHRpb25zKVxuICAgICAgICB9XG4gICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLnN1Y2NlZWRNb2R1bGUudGFwKGBleHQtc3VjY2VlZC1tb2R1bGVgLCBtb2R1bGUgPT4ge1xuICAgICAgICAgIGlmIChtb2R1bGUucmVzb3VyY2UgJiYgIW1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvbm9kZV9tb2R1bGVzLykpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvXFwuaHRtbCQvKSAhPSBudWxsXG4gICAgICAgICAgICAgICAgJiYgbW9kdWxlLl9zb3VyY2UuX3ZhbHVlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2RvY3R5cGUgaHRtbCcpID09IGZhbHNlXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4ucmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4ucmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLmZpbmlzaE1vZHVsZXMudGFwKGBleHQtZmluaXNoLW1vZHVsZXNgLCBtb2R1bGVzID0+IHtcbiAgICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fd3JpdGVGaWxlc1RvUHJvZEZvbGRlcih2YXJzLCBvcHRpb25zKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09ICcyIG9mIDInKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmluamVjdCA9PT0gJ3llcycpIHtcbiAgICAgICAgICBjb21waWxhdGlvbi5ob29rcy5odG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uLnRhcChgZXh0LWh0bWwtZ2VuZXJhdGlvbmAsKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAgICAgICAgIHZhciBqc1BhdGggPSBwYXRoLmpvaW4odmFycy5leHRQYXRoLCAnZXh0LmpzJylcbiAgICAgICAgICAgIHZhciBjc3NQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5jc3MnKVxuLy8gICAgICAgICAgICAgdmFyIGpzUGF0aCA9IHZhcnMuZXh0UGF0aCArICcvJyArICAnZXh0LmpzJztcbi8vICAgICAgICAgICAgIHZhciBjc3NQYXRoID0gdmFycy5leHRQYXRoICsgJy8nICsgJ2V4dC5jc3MnO1xuICAgICAgICAgICAgZGF0YS5hc3NldHMuanMudW5zaGlmdChqc1BhdGgpXG4gICAgICAgICAgICBkYXRhLmFzc2V0cy5jc3MudW5zaGlmdChjc3NQYXRoKVxuICAgICAgICAgICAgbG9nKGFwcCwgYEFkZGluZyAke2pzUGF0aH0gYW5kICR7Y3NzUGF0aH0gdG8gaW5kZXguaHRtbGApXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgdGhyb3cgJ19jb21waWxhdGlvbjogJyArIGUudG9TdHJpbmcoKVxuLy8gICAgbG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbi8vICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfY29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9hZnRlckNvbXBpbGUoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfYWZ0ZXJDb21waWxlJylcbiAgICBpZiAoZnJhbWV3b3JrID09ICdleHRqcycpIHtcbiAgICAgIHJlcXVpcmUoYC4vZXh0anNVdGlsYCkuX2FmdGVyQ29tcGlsZShjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfYWZ0ZXJDb21waWxlIG5vdCBydW4nKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgdGhyb3cgJ19hZnRlckNvbXBpbGU6ICcgKyBlLnRvU3RyaW5nKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZW1pdChjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGVtaXQgPSBvcHRpb25zLmVtaXRcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9lbWl0JylcbiAgICBpZiAoZW1pdCA9PSAneWVzJykge1xuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgICAgIGxldCBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGNvbXBpbGVyLm91dHB1dFBhdGgsdmFycy5leHRQYXRoKVxuICAgICAgICBpZiAoY29tcGlsZXIub3V0cHV0UGF0aCA9PT0gJy8nICYmIGNvbXBpbGVyLm9wdGlvbnMuZGV2U2VydmVyKSB7XG4gICAgICAgICAgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vcHRpb25zLmRldlNlcnZlci5jb250ZW50QmFzZSwgb3V0cHV0UGF0aClcbiAgICAgICAgfVxuICAgICAgICBsb2d2KHZlcmJvc2UsJ291dHB1dFBhdGg6ICcgKyBvdXRwdXRQYXRoKVxuICAgICAgICBsb2d2KHZlcmJvc2UsJ2ZyYW1ld29yazogJyArIGZyYW1ld29yaylcbiAgICAgICAgaWYgKGZyYW1ld29yayAhPSAnZXh0anMnKSB7XG4gICAgICAgICAgX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dFBhdGgsIGNvbXBpbGF0aW9uKVxuICAgICAgICB9XG4gICAgICAgIHZhciBjb21tYW5kID0gJydcbiAgICAgICAgaWYgKG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKVxuICAgICAgICAgIHtjb21tYW5kID0gJ3dhdGNoJ31cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHtjb21tYW5kID0gJ2J1aWxkJ31cbiAgICAgICAgaWYgKHZhcnMucmVidWlsZCA9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHBhcm1zID0gW11cbiAgICAgICAgICBpZiAob3B0aW9ucy5wcm9maWxlID09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnByb2ZpbGUgPT0gJycgfHwgb3B0aW9ucy5wcm9maWxlID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpXG4gICAgICAgICAgICAgIHsgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMuZW52aXJvbm1lbnRdIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgeyBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMuZW52aXJvbm1lbnRdIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoY29tbWFuZCA9PSAnYnVpbGQnKVxuICAgICAgICAgICAgICB7cGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF19XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHtwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF19XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh2YXJzLndhdGNoU3RhcnRlZCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgYXdhaXQgX2J1aWxkRXh0QnVuZGxlKGFwcCwgY29tcGlsYXRpb24sIG91dHB1dFBhdGgsIHBhcm1zLCB2YXJzLCBvcHRpb25zKVxuICAgICAgICAgICAgdmFycy53YXRjaFN0YXJ0ZWQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBsb2d2KHZlcmJvc2UsJ05PVCBydW5uaW5nIGVtaXQnKVxuICAgICAgICBjYWxsYmFjaygpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndih2ZXJib3NlLCdlbWl0IGlzIG5vJylcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIGNhbGxiYWNrKClcbiAgICB0aHJvdyAnX2VtaXQ6ICcgKyBlLnRvU3RyaW5nKClcbiAgICAvLyBsb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuICAgIC8vIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfZW1pdDogJyArIGUpXG4gICAgLy8gY2FsbGJhY2soKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9kb25lKHN0YXRzLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9kb25lJylcbiAgICBpZiAoc3RhdHMuY29tcGlsYXRpb24uZXJyb3JzICYmIHN0YXRzLmNvbXBpbGF0aW9uLmVycm9ycy5sZW5ndGgpIC8vICYmIHByb2Nlc3MuYXJndi5pbmRleE9mKCctLXdhdGNoJykgPT0gLTEpXG4gICAge1xuICAgICAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKTtcbiAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZCgnKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqJykpO1xuICAgICAgY29uc29sZS5sb2coc3RhdHMuY29tcGlsYXRpb24uZXJyb3JzWzBdKTtcbiAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZCgnKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqJykpO1xuICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgIH1cblxuICAgIC8vbWpnIHJlZmFjdG9yXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlICYmIG9wdGlvbnMudHJlZXNoYWtlID09ICdubycgJiYgZnJhbWV3b3JrID09ICdhbmd1bGFyJykge1xuICAgICAgcmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5fdG9EZXYodmFycywgb3B0aW9ucylcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmKG9wdGlvbnMuYnJvd3NlciA9PSAneWVzJyAmJiBvcHRpb25zLndhdGNoID09ICd5ZXMnICYmIHZhcnMucHJvZHVjdGlvbiA9PSBmYWxzZSkge1xuICAgICAgICBpZiAodmFycy5icm93c2VyQ291bnQgPT0gMCkge1xuICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDonICsgb3B0aW9ucy5wb3J0XG4gICAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgT3BlbmluZyBicm93c2VyIGF0ICR7dXJsfWApXG4gICAgICAgICAgdmFycy5icm93c2VyQ291bnQrK1xuICAgICAgICAgIGNvbnN0IG9wbiA9IHJlcXVpcmUoJ29wbicpXG4gICAgICAgICAgb3BuKHVybClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICB9XG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnKSB7XG4gICAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUpIHtcbiAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICR7ZnJhbWV3b3JrfWApXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIGRldmVsb3BtZW50IGJ1aWxkIGZvciAke2ZyYW1ld29ya31gKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzIgb2YgMicpIHtcbiAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAke2ZyYW1ld29ya31gKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4vLyAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuICAgIHRocm93ICdfZG9uZTogJyArIGUudG9TdHJpbmcoKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXQsIGNvbXBpbGF0aW9uKSB7XG4gIHRyeSB7XG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgcGFja2FnZXMgPSBvcHRpb25zLnBhY2thZ2VzXG4gICAgdmFyIHRvb2xraXQgPSBvcHRpb25zLnRvb2xraXRcbiAgICB2YXIgdGhlbWUgPSBvcHRpb25zLnRoZW1lXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfcHJlcGFyZUZvckJ1aWxkJylcbiAgICBjb25zdCByaW1yYWYgPSByZXF1aXJlKCdyaW1yYWYnKVxuICAgIGNvbnN0IG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpXG4gICAgY29uc3QgZnN4ID0gcmVxdWlyZSgnZnMtZXh0cmEnKVxuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICB0aGVtZSA9IHRoZW1lIHx8ICh0b29sa2l0ID09PSAnY2xhc3NpYycgPyAndGhlbWUtdHJpdG9uJyA6ICd0aGVtZS1tYXRlcmlhbCcpXG4gICAgbG9ndih2ZXJib3NlLCdmaXJzdFRpbWU6ICcgKyB2YXJzLmZpcnN0VGltZSlcbiAgICBpZiAodmFycy5maXJzdFRpbWUpIHtcbiAgICAgIHJpbXJhZi5zeW5jKG91dHB1dClcbiAgICAgIG1rZGlycC5zeW5jKG91dHB1dClcbiAgICAgIGNvbnN0IGJ1aWxkWE1MID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5idWlsZFhNTFxuICAgICAgY29uc3QgY3JlYXRlQXBwSnNvbiA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuY3JlYXRlQXBwSnNvblxuICAgICAgY29uc3QgY3JlYXRlV29ya3NwYWNlSnNvbiA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuY3JlYXRlV29ya3NwYWNlSnNvblxuICAgICAgY29uc3QgY3JlYXRlSlNET01FbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuY3JlYXRlSlNET01FbnZpcm9ubWVudFxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnYnVpbGQueG1sJyksIGJ1aWxkWE1MKHZhcnMucHJvZHVjdGlvbiwgb3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnYXBwLmpzb24nKSwgY3JlYXRlQXBwSnNvbih0aGVtZSwgcGFja2FnZXMsIHRvb2xraXQsIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2pzZG9tLWVudmlyb25tZW50LmpzJyksIGNyZWF0ZUpTRE9NRW52aXJvbm1lbnQob3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnd29ya3NwYWNlLmpzb24nKSwgY3JlYXRlV29ya3NwYWNlSnNvbihvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICB2YXIgZnJhbWV3b3JrID0gdmFycy5mcmFtZXdvcms7XG4gICAgICAvL2JlY2F1c2Ugb2YgYSBwcm9ibGVtIHdpdGggY29sb3JwaWNrZXJcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L3V4L2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vdXgvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICd1eCcpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAodXgpICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAncGFja2FnZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L292ZXJyaWRlcy9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L292ZXJyaWRlcy9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ292ZXJyaWRlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksJ3Jlc291cmNlcy8nKSkpIHtcbiAgICAgICAgdmFyIGZyb21SZXNvdXJjZXMgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3Jlc291cmNlcy8nKVxuICAgICAgICB2YXIgdG9SZXNvdXJjZXMgPSBwYXRoLmpvaW4ob3V0cHV0LCAnLi4vcmVzb3VyY2VzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21SZXNvdXJjZXMsIHRvUmVzb3VyY2VzKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAnICsgZnJvbVJlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1Jlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICB9XG4gICAgdmFycy5maXJzdFRpbWUgPSBmYWxzZVxuICAgIHZhciBqcyA9ICcnXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbikge1xuICAgICAgdmFycy5kZXBzID0gdmFycy5kZXBzLmZpbHRlcihmdW5jdGlvbih2YWx1ZSwgaW5kZXgpeyByZXR1cm4gdmFycy5kZXBzLmluZGV4T2YodmFsdWUpID09IGluZGV4IH0pO1xuICAgICAganMgPSB2YXJzLmRlcHMuam9pbignO1xcbicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGpzID0gYEV4dC5yZXF1aXJlKFtcIkV4dC4qXCIsXCJFeHQuZGF0YS5UcmVlU3RvcmVcIl0pYFxuICAgIH1cbiAgICBqcyA9IGBFeHQucmVxdWlyZShbXCJFeHQuKlwiLFwiRXh0LmRhdGEuVHJlZVN0b3JlXCJdKWA7IC8vZm9yIG5vd1xuICAgIGlmICh2YXJzLm1hbmlmZXN0ID09PSBudWxsIHx8IGpzICE9PSB2YXJzLm1hbmlmZXN0KSB7XG4gICAgICB2YXJzLm1hbmlmZXN0ID0ganMgKyAnO1xcbkV4dC5yZXF1aXJlKFtcIkV4dC5sYXlvdXQuKlwiXSk7XFxuJztcbiAgICAgIGNvbnN0IG1hbmlmZXN0ID0gcGF0aC5qb2luKG91dHB1dCwgJ21hbmlmZXN0LmpzJylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMobWFuaWZlc3QsIHZhcnMubWFuaWZlc3QsICd1dGY4JylcbiAgICAgIHZhcnMucmVidWlsZCA9IHRydWVcbiAgICAgIHZhciBidW5kbGVEaXIgPSBvdXRwdXQucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJylcbiAgICAgIGlmIChidW5kbGVEaXIudHJpbSgpID09ICcnKSB7YnVuZGxlRGlyID0gJy4vJ31cbiAgICAgIGxvZyhhcHAsICdCdWlsZGluZyBFeHQgYnVuZGxlIGF0OiAnICsgYnVuZGxlRGlyKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhcnMucmVidWlsZCA9IGZhbHNlXG4gICAgICBsb2coYXBwLCAnRXh0IHJlYnVpbGQgTk9UIG5lZWRlZCcpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfcHJlcGFyZUZvckJ1aWxkOiAnICsgZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIHZhcnMsIG9wdGlvbnMpIHtcbi8vICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfYnVpbGRFeHRCdW5kbGUnKVxuICAgIGxldCBzZW5jaGE7IHRyeSB7IHNlbmNoYSA9IHJlcXVpcmUoJ0BzZW5jaGEvY21kJykgfSBjYXRjaCAoZSkgeyBzZW5jaGEgPSAnc2VuY2hhJyB9XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoc2VuY2hhKSkge1xuICAgICAgbG9ndih2ZXJib3NlLCdzZW5jaGEgZm9sZGVyIGV4aXN0cycpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndih2ZXJib3NlLCdzZW5jaGEgZm9sZGVyIERPRVMgTk9UIGV4aXN0JylcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IG9uQnVpbGREb25lID0gKCkgPT4ge1xuICAgICAgICBsb2d2KHZlcmJvc2UsJ29uQnVpbGREb25lJylcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9XG4gICAgICB2YXIgb3B0cyA9IHsgY3dkOiBvdXRwdXRQYXRoLCBzaWxlbnQ6IHRydWUsIHN0ZGlvOiAncGlwZScsIGVuY29kaW5nOiAndXRmLTgnfVxuICAgICAgX2V4ZWN1dGVBc3luYyhhcHAsIHNlbmNoYSwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKS50aGVuIChcbiAgICAgICAgZnVuY3Rpb24oKSB7IG9uQnVpbGREb25lKCkgfSxcbiAgICAgICAgZnVuY3Rpb24ocmVhc29uKSB7IHJlamVjdChyZWFzb24pIH1cbiAgICAgIClcbiAgICB9KVxuICAvLyB9XG4gIC8vIGNhdGNoKGUpIHtcbiAgLy8gICBjb25zb2xlLmxvZygnZScpXG4gIC8vICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgLy8gICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2J1aWxkRXh0QnVuZGxlOiAnICsgZSlcbiAgLy8gICBjYWxsYmFjaygpXG4gIC8vIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2V4ZWN1dGVBc3luYyAoYXBwLCBjb21tYW5kLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbi8vICB0cnkge1xuXG5cblxuXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICAvL2NvbnN0IERFRkFVTFRfU1VCU1RSUyA9IFsnW0lORl0gTG9hZGluZycsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFNlcnZlclwiLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgICBjb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbXCJbSU5GXSB4U2VydmVyXCIsICdbSU5GXSBMb2FkaW5nJywgJ1tJTkZdIEFwcGVuZCcsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tJTkZdIFByb2Nlc3NpbmcgQnVpbGQnLCAnW0xPR10gRmFzaGlvbiBidWlsZCBjb21wbGV0ZScsICdbRVJSXScsICdbV1JOXScsIFwiW0lORl0gV3JpdGluZ1wiLCBcIltJTkZdIExvYWRpbmcgQnVpbGRcIiwgXCJbSU5GXSBXYWl0aW5nXCIsIFwiW0xPR10gRmFzaGlvbiB3YWl0aW5nXCJdO1xuICAgIHZhciBzdWJzdHJpbmdzID0gREVGQVVMVF9TVUJTVFJTXG4gICAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKVxuICAgIGNvbnN0IGNyb3NzU3Bhd24gPSByZXF1aXJlKCdjcm9zcy1zcGF3bi13aXRoLWtpbGwnKVxuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9leGVjdXRlQXN5bmMnKVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxvZ3YodmVyYm9zZSxgY29tbWFuZCAtICR7Y29tbWFuZH1gKVxuICAgICAgbG9ndih2ZXJib3NlLCBgcGFybXMgLSAke3Bhcm1zfWApXG4gICAgICBsb2d2KHZlcmJvc2UsIGBvcHRzIC0gJHtKU09OLnN0cmluZ2lmeShvcHRzKX1gKVxuICAgICAgLy9sZXQgY2hpbGQgPSBjcm9zc1NwYXduKGNvbW1hbmQsIHBhcm1zLCBvcHRzKVxuICAgICAgLy9jb25zb2xlLmxvZygnY2hpbGQnKVxuICAgICAgLy9jb25zb2xlLmxvZyh2YXJzLmNoaWxkKVxuICAgICAgdmFycy5jaGlsZCA9IGNyb3NzU3Bhd24oY29tbWFuZCwgcGFybXMsIG9wdHMpXG4gICAgICAvL2NvbnNvbGUubG9nKCdjaGlsZCcpXG4gICAgICAvL2NvbnNvbGUubG9nKHZhcnMuY2hpbGQpXG5cbiAgICAgIHZhcnMuY2hpbGQub24oJ2Nsb3NlJywgKGNvZGUsIHNpZ25hbCkgPT4ge1xuICAgICAgICBsb2d2KHZlcmJvc2UsIGBvbiBjbG9zZTogYCArIGNvZGUpXG4gICAgICAgIGlmKGNvZGUgPT09IDApIHsgcmVzb2x2ZSgwKSB9XG4gICAgICAgIGVsc2UgeyBjb21waWxhdGlvbi5lcnJvcnMucHVzaCggbmV3IEVycm9yKGNvZGUpICk7IHJlc29sdmUoMCkgfVxuICAgICAgfSlcbiAgICAgIHZhcnMuY2hpbGQub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwgYG9uIGVycm9yYClcbiAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goZXJyb3IpXG4gICAgICAgIHJlc29sdmUoMClcbiAgICAgIH0pXG4gICAgICB2YXJzLmNoaWxkLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICBsb2d2KHZlcmJvc2UsIGAke3N0cn1gKVxuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkubWF0Y2goL0Zhc2hpb24gd2FpdGluZyBmb3IgY2hhbmdlc1xcLlxcLlxcLi8pKSB7XG5cbi8vICAgICAgICAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4vLyAgICAgICAgICAgdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSArIHZhcnMudG91Y2hGaWxlO1xuLy8gICAgICAgICAgIHRyeSB7XG4vLyAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKVxuLy8gICAgICAgICAgICAgdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuLy8gICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgJy8vJyArIGQsICd1dGY4Jyk7XG4vLyAgICAgICAgICAgICBsb2d2KGFwcCwgYHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICAgIGNhdGNoKGUpIHtcbi8vICAgICAgICAgICAgIGxvZ3YoYXBwLCBgTk9UIHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4vLyAgICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZSgwKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmIChzdWJzdHJpbmdzLnNvbWUoZnVuY3Rpb24odikgeyByZXR1cm4gZGF0YS5pbmRleE9mKHYpID49IDA7IH0pKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltJTkZdXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltMT0ddXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykudHJpbSgpXG4gICAgICAgICAgICBpZiAoc3RyLmluY2x1ZGVzKFwiW0VSUl1cIikpIHtcbiAgICAgICAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goYXBwICsgc3RyLnJlcGxhY2UoL15cXFtFUlJcXF0gL2dpLCAnJykpO1xuICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltFUlJdXCIsIGAke2NoYWxrLnJlZChcIltFUlJdXCIpfWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2coYXBwLCBzdHIpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdmFycy5jaGlsZC5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICBsb2d2KG9wdGlvbnMsIGBlcnJvciBvbiBjbG9zZTogYCArIGRhdGEpXG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICB2YXIgc3RySmF2YU9wdHMgPSBcIlBpY2tlZCB1cCBfSkFWQV9PUFRJT05TXCI7XG4gICAgICAgIHZhciBpbmNsdWRlcyA9IHN0ci5pbmNsdWRlcyhzdHJKYXZhT3B0cylcbiAgICAgICAgaWYgKCFpbmNsdWRlcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2FwcH0gJHtjaGFsay5yZWQoXCJbRVJSXVwiKX0gJHtzdHJ9YClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICAvLyB9XG4gIC8vIGNhdGNoKGUpIHtcbiAgLy8gICBsb2d2KG9wdGlvbnMsZSlcbiAgLy8gICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2V4ZWN1dGVBc3luYzogJyArIGUpXG4gIC8vICAgY2FsbGJhY2soKVxuICAvLyB9XG59XG5cbi8vKioqKioqKioqKlxuZnVuY3Rpb24gcnVuU2NyaXB0KHNjcmlwdFBhdGgsIGNhbGxiYWNrKSB7XG4gIHZhciBjaGlsZFByb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG4gIC8vIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBjYWxsYmFjayBoYXMgYmVlbiBpbnZva2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgaW52b2NhdGlvbnNcbiAgdmFyIGludm9rZWQgPSBmYWxzZTtcbiAgdmFyIHByb2Nlc3MgPSBjaGlsZFByb2Nlc3MuZm9yayhzY3JpcHRQYXRoKTtcbiAgLy8gbGlzdGVuIGZvciBlcnJvcnMgYXMgdGhleSBtYXkgcHJldmVudCB0aGUgZXhpdCBldmVudCBmcm9tIGZpcmluZ1xuICBwcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xuICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjayBvbmNlIHRoZSBwcm9jZXNzIGhhcyBmaW5pc2hlZCBydW5uaW5nXG4gIHByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZSkge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgdmFyIGVyciA9IGNvZGUgPT09IDAgPyBudWxsIDogbmV3IEVycm9yKCdleGl0IGNvZGUgJyArIGNvZGUpO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfdG9YdHlwZShzdHIpIHtcbiAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL18vZywgJy0nKVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0QXBwKCkge1xuICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gIHZhciBwcmVmaXggPSBgYFxuICBjb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKVxuICBpZiAocGxhdGZvcm0gPT0gJ2RhcndpbicpIHsgcHJlZml4ID0gYOKEuSDvvaJleHTvvaM6YCB9XG4gIGVsc2UgeyBwcmVmaXggPSBgaSBbZXh0XTpgIH1cbiAgcmV0dXJuIGAke2NoYWxrLmdyZWVuKHByZWZpeCl9IGBcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2dldFZlcnNpb25zKHBsdWdpbk5hbWUsIGZyYW1ld29ya05hbWUpIHtcbnRyeSB7XG4gIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gIHZhciB2ID0ge31cbiAgdmFyIGZyYW1ld29ya0luZm8gPSAnbi9hJ1xuXG4gIHYucGx1Z2luVmVyc2lvbiA9ICduL2EnO1xuICB2LmV4dFZlcnNpb24gPSAnbi9hJztcbiAgdi5lZGl0aW9uID0gJ24vYSc7XG4gIHYuY21kVmVyc2lvbiA9ICduL2EnO1xuICB2LndlYnBhY2tWZXJzaW9uID0gJ24vYSc7XG5cbiAgdmFyIHBsdWdpblBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEnLCBwbHVnaW5OYW1lKVxuICB2YXIgcGx1Z2luUGtnID0gKGZzLmV4aXN0c1N5bmMocGx1Z2luUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LnBsdWdpblZlcnNpb24gPSBwbHVnaW5Qa2cudmVyc2lvblxuICB2Ll9yZXNvbHZlZCA9IHBsdWdpblBrZy5fcmVzb2x2ZWRcbiAgaWYgKHYuX3Jlc29sdmVkID09IHVuZGVmaW5lZCkge1xuICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICB9XG4gIGVsc2Uge1xuICAgIGlmICgtMSA9PSB2Ll9yZXNvbHZlZC5pbmRleE9mKCdjb21tdW5pdHknKSkge1xuICAgICAgdi5lZGl0aW9uID0gYENvbW1lcmNpYWxgXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdi5lZGl0aW9uID0gYENvbW11bml0eWBcbiAgICB9XG4gIH1cbiAgdmFyIHdlYnBhY2tQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy93ZWJwYWNrJylcbiAgdmFyIHdlYnBhY2tQa2cgPSAoZnMuZXhpc3RzU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHdlYnBhY2tQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi53ZWJwYWNrVmVyc2lvbiA9IHdlYnBhY2tQa2cudmVyc2lvblxuICB2YXIgZXh0UGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQHNlbmNoYS9leHQnKVxuICB2YXIgZXh0UGtnID0gKGZzLmV4aXN0c1N5bmMoZXh0UGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LmV4dFZlcnNpb24gPSBleHRQa2cuc2VuY2hhLnZlcnNpb25cbiAgdmFyIGNtZFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSxgbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5jbWRWZXJzaW9uID0gY21kUGtnLnZlcnNpb25fZnVsbFxuICBpZiAodi5jbWRWZXJzaW9uID09IHVuZGVmaW5lZCkge1xuICAgIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhLyR7cGx1Z2luTmFtZX0vbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgICB2YXIgY21kUGtnID0gKGZzLmV4aXN0c1N5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICAgIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgfVxuXG4gICBpZiAoZnJhbWV3b3JrTmFtZSAhPSB1bmRlZmluZWQgJiYgZnJhbWV3b3JrTmFtZSAhPSAnZXh0anMnKSB7XG4gICAgdmFyIGZyYW1ld29ya1BhdGggPSAnJ1xuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdyZWFjdCcpIHtcbiAgICAgIGZyYW1ld29ya1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL3JlYWN0JylcbiAgICB9XG4gICAgaWYgKGZyYW1ld29ya05hbWUgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9AYW5ndWxhci9jb3JlJylcbiAgICB9XG4gICAgdmFyIGZyYW1ld29ya1BrZyA9IChmcy5leGlzdHNTeW5jKGZyYW1ld29ya1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmZyYW1ld29ya1ZlcnNpb24gPSBmcmFtZXdvcmtQa2cudmVyc2lvblxuICAgIGlmICh2LmZyYW1ld29ya1ZlcnNpb24gPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmcmFtZXdvcmtJbmZvID0gJywgJyArIGZyYW1ld29ya05hbWVcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBmcmFtZXdvcmtJbmZvID0gJywgJyArIGZyYW1ld29ya05hbWUgKyAnIHYnICsgdi5mcmFtZXdvcmtWZXJzaW9uXG4gICAgfVxuICB9XG4gIHJldHVybiAnZXh0LXdlYnBhY2stcGx1Z2luIHYnICsgdi5wbHVnaW5WZXJzaW9uICsgJywgRXh0IEpTIHYnICsgdi5leHRWZXJzaW9uICsgJyAnICsgdi5lZGl0aW9uICsgJyBFZGl0aW9uLCBTZW5jaGEgQ21kIHYnICsgdi5jbWRWZXJzaW9uICsgJywgd2VicGFjayB2JyArIHYud2VicGFja1ZlcnNpb24gKyBmcmFtZXdvcmtJbmZvXG5cbn1cbmNhdGNoIChlKSB7XG4gIHJldHVybiAnZXh0LXdlYnBhY2stcGx1Z2luIHYnICsgdi5wbHVnaW5WZXJzaW9uICsgJywgRXh0IEpTIHYnICsgdi5leHRWZXJzaW9uICsgJyAnICsgdi5lZGl0aW9uICsgJyBFZGl0aW9uLCBTZW5jaGEgQ21kIHYnICsgdi5jbWRWZXJzaW9uICsgJywgd2VicGFjayB2JyArIHYud2VicGFja1ZlcnNpb24gKyBmcmFtZXdvcmtJbmZvXG59XG5cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9nKGFwcCxtZXNzYWdlKSB7XG4gIHZhciBzID0gYXBwICsgbWVzc2FnZVxuICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICB0cnkge3Byb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpfWNhdGNoKGUpIHt9XG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpO3Byb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBsb2doKGFwcCxtZXNzYWdlKSB7XG4gIHZhciBoID0gZmFsc2VcbiAgdmFyIHMgPSBhcHAgKyBtZXNzYWdlXG4gIGlmIChoID09IHRydWUpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9ndih2ZXJib3NlLCBzKSB7XG4gIGlmICh2ZXJib3NlID09ICd5ZXMnKSB7XG4gICAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgICB0cnkge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKClcbiAgICB9XG4gICAgY2F0Y2goZSkge31cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShgLXZlcmJvc2U6ICR7c31gKVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxuICB9XG59XG5cbmZ1bmN0aW9uIF9nZXRWYWxpZGF0ZU9wdGlvbnMoKSB7XG4gIHJldHVybiB7XG4gICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgIFwiZnJhbWV3b3JrXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwidG9vbGtpdFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInRoZW1lXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiZW1pdFwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwic2NyaXB0XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwicG9ydFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJpbnRlZ2VyXCJdXG4gICAgICB9LFxuICAgICAgXCJwYWNrYWdlc1wiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIiwgXCJhcnJheVwiXVxuICAgICAgfSxcbiAgICAgIFwicHJvZmlsZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImVudmlyb25tZW50XCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ2RldmVsb3BtZW50JyBvciAncHJvZHVjdGlvbicgc3RyaW5nIHZhbHVlXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInRyZWVzaGFrZVwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiYnJvd3NlclwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwid2F0Y2hcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInZlcmJvc2VcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImluamVjdFwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiaW50ZWxsaXNoYWtlXCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ3llcycgb3IgJ25vJyBzdHJpbmcgdmFsdWUgKE5PVCB0cnVlIG9yIGZhbHNlKVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgIH0sXG4gICAgXCJhZGRpdGlvbmFsUHJvcGVydGllc1wiOiBmYWxzZVxuICB9O1xufVxuXG5cbmZ1bmN0aW9uIF9nZXREZWZhdWx0T3B0aW9ucygpIHtcbiAgcmV0dXJuIHtcbiAgICBmcmFtZXdvcms6ICdleHRqcycsXG4gICAgdG9vbGtpdDogJ21vZGVybicsXG4gICAgdGhlbWU6ICd0aGVtZS1tYXRlcmlhbCcsXG4gICAgZW1pdDogJ3llcycsXG4gICAgc2NyaXB0OiBudWxsLFxuICAgIHBvcnQ6IDE5NjIsXG4gICAgcGFja2FnZXM6IFtdLFxuXG4gICAgcHJvZmlsZTogJycsXG4gICAgZW52aXJvbm1lbnQ6ICdkZXZlbG9wbWVudCcsXG4gICAgdHJlZXNoYWtlOiAnbm8nLFxuICAgIGJyb3dzZXI6ICd5ZXMnLFxuICAgIHdhdGNoOiAneWVzJyxcbiAgICB2ZXJib3NlOiAnbm8nLFxuICAgIGluamVjdDogJ3llcycsXG4gICAgaW50ZWxsaXNoYWtlOiAneWVzJ1xuICB9XG59XG4iXX0=