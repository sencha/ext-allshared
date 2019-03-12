"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._constructor = _constructor;
exports._thisCompilation = _thisCompilation;
exports._compilation = _compilation;
exports._emit = _emit;
exports._afterCompile = _afterCompile;
exports._done = _done;
exports._prepareForBuild = _prepareForBuild;
exports._buildExtBundle = _buildExtBundle;
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
function _constructor(initialOptions) {
  const fs = require('fs');

  var vars = {};
  var options = {};

  try {
    if (initialOptions.framework == undefined) {
      vars.pluginErrors = [];
      vars.pluginErrors.push('webpack config: framework parameter on ext-webpack-plugin is not defined - values: react, angular, extjs, components');
      var o = {};
      o.vars = vars;
      return o;
    }

    var framework = initialOptions.framework;
    var treeshake = initialOptions.treeshake;
    var verbose = initialOptions.verbose;

    const validateOptions = require('schema-utils');

    validateOptions(require(`./${framework}Util`).getValidateOptions(), initialOptions, '');
    const rc = fs.existsSync(`.ext-${framework}rc`) && JSON.parse(fs.readFileSync(`.ext-${framework}rc`, 'utf-8')) || {};
    options = _objectSpread({}, require(`./${framework}Util`).getDefaultOptions(), initialOptions, rc);
    vars = require(`./${framework}Util`).getDefaultVars();
    vars.pluginName = 'ext-webpack-plugin';
    vars.app = require('./pluginUtil')._getApp();
    var app = vars.app;
    logh(app, `HOOK constructor`);
    logv(verbose, `pluginName - ${vars.pluginName}`);
    logv(verbose, `vars.app - ${vars.app}`); // const rc = (fs.existsSync(`.ext-${vars.framework}rc`) && JSON.parse(fs.readFileSync(`.ext-${vars.framework}rc`, 'utf-8')) || {})
    // options = { ...require(`./${vars.framework}Util`).getDefaultOptions(), ...options, ...rc }

    logv(verbose, `options:`);

    if (verbose == 'yes') {
      console.dir(options);
    }

    if (options.environment == 'production') {
      vars.production = true;
    } else {
      vars.production = false;
    }

    logv(verbose, `vars:`);

    if (verbose == 'yes') {
      console.dir(vars);
    }

    if (vars.production == true) {
      if (treeshake == true) {
        vars.buildstep = '1 of 2';
        log(app, 'Starting Production Build - ' + vars.buildstep);

        require(`./${framework}Util`)._toProd(vars, options);
      } else {
        vars.buildstep = '2 of 2';
        log(app, 'Starting Production Build - ' + vars.buildstep);
      }
    } else {
      vars.buildstep = '1 of 1';
      log(app, 'Starting Development Build - ' + vars.buildstep);
    }

    logv(verbose, 'Building for ' + options.environment + ', ' + 'Treeshake is ' + options.treeshake);
    var o = {};
    o.vars = vars;
    o.options = options;

    require('./pluginUtil').logv(verbose, 'FUNCTION _constructor');

    return o;
  } catch (e) {
    console.log(e);
  }
} //**********


function _thisCompilation(compiler, compilation, vars, options) {
  try {
    var app = vars.app;
    var verbose = options.verbose;

    require('./pluginUtil').logv(verbose, 'FUNCTION _thisCompilation');

    require('./pluginUtil').logv(verbose, `options.script: ${options.script}`);

    require('./pluginUtil').logv(verbose, `buildstep: ${vars.buildstep}`);

    if (vars.buildstep == '1 of 1' || vars.buildstep == '1 of 2') {
      if (options.script != undefined) {
        if (options.script != null) {
          runScript(options.script, function (err) {
            if (err) throw err;

            require('./pluginUtil').log(vars.app, `Finished running ${options.script}`);
          });
        }
      } else {
        require('./pluginUtil').logv(verbose, `options.script: ${options.script}`);

        require('./pluginUtil').logv(verbose, `buildstep: ${vars.buildstep}`);
      }
    }
  } catch (e) {
    require('./pluginUtil').logv(verbose, e);

    compilation.errors.push('_thisCompilation: ' + e);
  }
} //**********


function _compilation(compiler, compilation, vars, options) {
  try {
    var verbose = options.verbose;
    var framework = options.framework;

    require('./pluginUtil').logv(verbose, 'FUNCTION _compilation');

    if (framework != 'extjs') {
      var extComponents = []; //      if (vars.production) {
      //if ((options.framework == 'angular' || options.framework == 'components') && options.treeshake == true) {
      //if (options.treeshake == true) {

      if (vars.buildstep == '1 of 2') {
        extComponents = require(`./${framework}Util`)._getAllComponents(vars, options);
      }

      compilation.hooks.succeedModule.tap(`ext-succeed-module`, module => {
        if (module.resource && !module.resource.match(/node_modules/)) {
          if (module.resource.match(/\.html$/) != null) {
            if (module._source._value.toLowerCase().includes('doctype html') == false) {
              vars.deps = [...(vars.deps || []), ...require(`./${framework}Util`)._extractFromSource(module, options, compilation, extComponents)];
            }
          } else {
            vars.deps = [...(vars.deps || []), ...require(`./${framework}Util`)._extractFromSource(module, options, compilation, extComponents)];
          }
        }
      });

      if (vars.buildstep == '1 of 2') {
        compilation.hooks.finishModules.tap(`ext-finish-modules`, modules => {
          require(`./${framework}Util`)._writeFilesToProdFolder(vars, options);
        });
      }
    }

    if (vars.buildstep == '1 of 1' || vars.buildstep == '2 of 2') {
      compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tap(`ext-html-generation`, data => {
        logv(verbose, 'htmlWebpackPluginBeforeHtmlGeneration');

        const path = require('path');

        var jsPath = path.join(vars.extPath, 'ext.js');
        var cssPath = path.join(vars.extPath, 'ext.css');
        data.assets.js.unshift(jsPath);
        data.assets.css.unshift(cssPath);
        log(vars.app, `Adding ${jsPath} and ${cssPath} to index.html`);
      });
    }
  } catch (e) {
    require('./pluginUtil').logv(options.verbose, e);

    compilation.errors.push('_compilation: ' + e);
  }
} //**********


function _emit(_x, _x2, _x3, _x4, _x5) {
  return _emit2.apply(this, arguments);
} //**********


function _emit2() {
  _emit2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(compiler, compilation, vars, options, callback) {
    var verbose, logv, emit, framework, app, path, outputPath, command, parms, _buildExtBundle;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          verbose = options.verbose; //const log = require('./pluginUtil').log

          logv = require('./pluginUtil').logv;
          logv(verbose, 'FUNCTION _emit');
          emit = options.emit; //var treeshake = options.treeshake

          framework = options.framework; //var environment =  options.environment

          if (!emit) {
            _context.next = 35;
            break;
          }

          if (!(vars.buildstep == '1 of 1' || vars.buildstep == '1 of 2')) {
            _context.next = 31;
            break;
          }

          app = vars.app; //        var framework = options.framework

          path = require('path'); //        const _buildExtBundle = require('./pluginUtil')._buildExtBundle

          outputPath = path.join(compiler.outputPath, vars.extPath);

          if (compiler.outputPath === '/' && compiler.options.devServer) {
            outputPath = path.join(compiler.options.devServer.contentBase, outputPath);
          }

          logv(verbose, 'outputPath: ' + outputPath);
          logv(verbose, 'framework: ' + framework);

          if (framework != 'extjs') {
            _prepareForBuild(app, vars, options, outputPath, compilation);
          } // else {
          //   if (options.framework == 'angular' && options.treeshake == false) {
          //     require(`./${framework}Util`)._prepareForBuild(app, vars, options, outputPath, compilation)
          //   }
          //   else {
          //     require(`./${framework}Util`)._prepareForBuild(app, vars, options, outputPath, compilation)
          //   }
          // }


          command = '';

          if (options.watch == 'yes' && vars.production == false) {
            command = 'watch';
          } else {
            command = 'build';
          }

          if (!(vars.rebuild == true)) {
            _context.next = 28;
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
            _context.next = 25;
            break;
          }

          _buildExtBundle = require('./pluginUtil')._buildExtBundle;
          _context.next = 24;
          return _buildExtBundle(app, compilation, outputPath, parms, options);

        case 24:
          vars.watchStarted = true;

        case 25:
          callback();
          _context.next = 29;
          break;

        case 28:
          callback();

        case 29:
          _context.next = 33;
          break;

        case 31:
          logv(verbose, 'NOT running emit');
          callback();

        case 33:
          _context.next = 37;
          break;

        case 35:
          logv(verbose, 'emit is false');
          callback();

        case 37:
          _context.next = 44;
          break;

        case 39:
          _context.prev = 39;
          _context.t0 = _context["catch"](0);

          require('./pluginUtil').logv(options.verbose, _context.t0);

          compilation.errors.push('emit: ' + _context.t0);
          callback();

        case 44:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 39]]);
  }));
  return _emit2.apply(this, arguments);
}

function _afterCompile(compiler, compilation, vars, options) {
  try {
    var verbose = options.verbose;

    require('./pluginUtil').logv(verbose, 'FUNCTION _afterCompile');

    if (options.framework == 'extjs') {
      require(`./extjsUtil`)._afterCompile(compilation, vars, options);
    } else {
      require('./pluginUtil').logv(verbose, 'FUNCTION _afterCompile not run');
    }
  } catch (e) {
    compilation.errors.push('_afterCompile: ' + e);

    require('./pluginUtil').logv(options.verbose, e);
  }
} //**********


function _done(vars, options) {
  try {
    var verbose = options.verbose;

    const log = require('./pluginUtil').log;

    const logv = require('./pluginUtil').logv;

    logv(verbose, 'FUNCTION _done');

    if (vars.production == true && options.treeshake == false && options.framework == 'angular') {
      require(`./${options.framework}Util`)._toDev(vars, options);
    }

    try {
      if (options.browser == true && options.watch == 'yes' && vars.production == false) {
        if (vars.browserCount == 0) {
          var url = 'http://localhost:' + options.port;

          require('./pluginUtil').log(vars.app, `Opening browser at ${url}`);

          vars.browserCount++;

          const opn = require('opn');

          opn(url);
        }
      }
    } catch (e) {
      console.log(e); //compilation.errors.push('show browser window - ext-done: ' + e)
    }

    if (vars.buildstep == '1 of 1') {
      require('./pluginUtil').log(vars.app, `Ending Development Build`);
    }

    if (vars.buildstep == '2 of 2') {
      require('./pluginUtil').log(vars.app, `Ending Production Build`);
    }
  } catch (e) {
    require('./pluginUtil').logv(options.verbose, e);
  }
} //**********


function _prepareForBuild(app, vars, options, output, compilation) {
  try {
    var verbose = options.verbose;
    logv(verbose, 'FUNCTION _prepareForBuild');

    const rimraf = require('rimraf');

    const mkdirp = require('mkdirp');

    const fsx = require('fs-extra');

    const fs = require('fs');

    const path = require('path');

    var packages = options.packages;
    var toolkit = options.toolkit;
    var theme = options.theme;
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


function _buildExtBundle(app, compilation, outputPath, parms, options) {
  try {
    var verbose = options.verbose;

    const fs = require('fs');

    const logv = require('./pluginUtil').logv;

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
      executeAsync(app, sencha, parms, opts, compilation, options).then(function () {
        onBuildDone();
      }, function (reason) {
        reject(reason);
      });
    });
  } catch (e) {
    console.log('e');

    require('./pluginUtil').logv(options.verbose, e);

    compilation.errors.push('_buildExtBundle: ' + e);
    callback();
  }
} //**********


function executeAsync(_x6, _x7, _x8, _x9, _x10, _x11) {
  return _executeAsync.apply(this, arguments);
} //**********


function _executeAsync() {
  _executeAsync = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(app, command, parms, opts, compilation, options) {
    var verbose, DEFAULT_SUBSTRS, substrings, chalk, crossSpawn, log;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          verbose = options.verbose; //const DEFAULT_SUBSTRS = ['[INF] Loading', '[INF] Processing', '[LOG] Fashion build complete', '[ERR]', '[WRN]', "[INF] Server", "[INF] Writing", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"];

          DEFAULT_SUBSTRS = ["[INF] xServer", '[INF] Loading', '[INF] Append', '[INF] Processing', '[INF] Processing Build', '[LOG] Fashion build complete', '[ERR]', '[WRN]', "[INF] Writing", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"];
          substrings = DEFAULT_SUBSTRS;
          chalk = require('chalk');
          crossSpawn = require('cross-spawn');
          log = require('./pluginUtil').log;
          logv(verbose, 'FUNCTION executeAsync');
          _context2.next = 10;
          return new Promise((resolve, reject) => {
            logv(verbose, `command - ${command}`);
            logv(verbose, `parms - ${parms}`);
            logv(verbose, `opts - ${JSON.stringify(opts)}`);
            let child = crossSpawn(command, parms, opts);
            child.on('close', (code, signal) => {
              logv(verbose, `on close: ` + code);

              if (code === 0) {
                resolve(0);
              } else {
                compilation.errors.push(new Error(code));
                resolve(0);
              }
            });
            child.on('error', error => {
              logv(verbose, `on error`);
              compilation.errors.push(error);
              resolve(0);
            });
            child.stdout.on('data', data => {
              var str = data.toString().replace(/\r?\n|\r/g, " ").trim();
              logv(verbose, `${str}`);

              if (data && data.toString().match(/Fashion waiting for changes\.\.\./)) {
                // const fs = require('fs');
                // var filename = process.cwd()+'/src/index.js';
                // var data = fs.readFileSync(filename);
                // fs.writeFileSync(filename, data + ' ', 'utf8')
                // logv(verbose, `touching ${filename}`)
                const fs = require('fs');

                var filename = process.cwd() + '/src/index.js';

                try {
                  var data = fs.readFileSync(filename);
                  fs.writeFileSync(filename, data + ' ', 'utf8');
                  log(app, `touching ${filename}`);
                } catch (e) {
                  log(app, `NOT touching ${filename}`);
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

                  log(app, str);
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

        case 10:
          _context2.next = 17;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);

          require('./pluginUtil').logv(options, _context2.t0);

          compilation.errors.push('executeAsync: ' + _context2.t0);
          callback();

        case 17:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 12]]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsImluaXRpYWxPcHRpb25zIiwiZnMiLCJyZXF1aXJlIiwidmFycyIsIm9wdGlvbnMiLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwibyIsInRyZWVzaGFrZSIsInZlcmJvc2UiLCJ2YWxpZGF0ZU9wdGlvbnMiLCJnZXRWYWxpZGF0ZU9wdGlvbnMiLCJyYyIsImV4aXN0c1N5bmMiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJnZXREZWZhdWx0T3B0aW9ucyIsImdldERlZmF1bHRWYXJzIiwicGx1Z2luTmFtZSIsImFwcCIsIl9nZXRBcHAiLCJsb2doIiwibG9ndiIsImNvbnNvbGUiLCJkaXIiLCJlbnZpcm9ubWVudCIsInByb2R1Y3Rpb24iLCJidWlsZHN0ZXAiLCJsb2ciLCJfdG9Qcm9kIiwiZSIsIl90aGlzQ29tcGlsYXRpb24iLCJjb21waWxlciIsImNvbXBpbGF0aW9uIiwic2NyaXB0IiwicnVuU2NyaXB0IiwiZXJyIiwiZXJyb3JzIiwiX2NvbXBpbGF0aW9uIiwiZXh0Q29tcG9uZW50cyIsIl9nZXRBbGxDb21wb25lbnRzIiwiaG9va3MiLCJzdWNjZWVkTW9kdWxlIiwidGFwIiwibW9kdWxlIiwicmVzb3VyY2UiLCJtYXRjaCIsIl9zb3VyY2UiLCJfdmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiZGVwcyIsIl9leHRyYWN0RnJvbVNvdXJjZSIsImZpbmlzaE1vZHVsZXMiLCJtb2R1bGVzIiwiX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIiLCJodG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uIiwiZGF0YSIsInBhdGgiLCJqc1BhdGgiLCJqb2luIiwiZXh0UGF0aCIsImNzc1BhdGgiLCJhc3NldHMiLCJqcyIsInVuc2hpZnQiLCJjc3MiLCJfZW1pdCIsImNhbGxiYWNrIiwiZW1pdCIsIm91dHB1dFBhdGgiLCJkZXZTZXJ2ZXIiLCJjb250ZW50QmFzZSIsIl9wcmVwYXJlRm9yQnVpbGQiLCJjb21tYW5kIiwid2F0Y2giLCJyZWJ1aWxkIiwicGFybXMiLCJwcm9maWxlIiwid2F0Y2hTdGFydGVkIiwiX2J1aWxkRXh0QnVuZGxlIiwiX2FmdGVyQ29tcGlsZSIsIl9kb25lIiwiX3RvRGV2IiwiYnJvd3NlciIsImJyb3dzZXJDb3VudCIsInVybCIsInBvcnQiLCJvcG4iLCJvdXRwdXQiLCJyaW1yYWYiLCJta2RpcnAiLCJmc3giLCJwYWNrYWdlcyIsInRvb2xraXQiLCJ0aGVtZSIsImZpcnN0VGltZSIsInN5bmMiLCJidWlsZFhNTCIsImNyZWF0ZUFwcEpzb24iLCJjcmVhdGVXb3Jrc3BhY2VKc29uIiwiY3JlYXRlSlNET01FbnZpcm9ubWVudCIsIndyaXRlRmlsZVN5bmMiLCJwcm9jZXNzIiwiY3dkIiwiZnJvbVBhdGgiLCJ0b1BhdGgiLCJjb3B5U3luYyIsInJlcGxhY2UiLCJmcm9tUmVzb3VyY2VzIiwidG9SZXNvdXJjZXMiLCJtYW5pZmVzdCIsImJ1bmRsZURpciIsInRyaW0iLCJzZW5jaGEiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm9uQnVpbGREb25lIiwib3B0cyIsInNpbGVudCIsInN0ZGlvIiwiZW5jb2RpbmciLCJleGVjdXRlQXN5bmMiLCJ0aGVuIiwicmVhc29uIiwiREVGQVVMVF9TVUJTVFJTIiwic3Vic3RyaW5ncyIsImNoYWxrIiwiY3Jvc3NTcGF3biIsInN0cmluZ2lmeSIsImNoaWxkIiwib24iLCJjb2RlIiwic2lnbmFsIiwiRXJyb3IiLCJlcnJvciIsInN0ZG91dCIsInN0ciIsInRvU3RyaW5nIiwiZmlsZW5hbWUiLCJzb21lIiwidiIsImluZGV4T2YiLCJyZWQiLCJzdGRlcnIiLCJzdHJKYXZhT3B0cyIsInNjcmlwdFBhdGgiLCJjaGlsZFByb2Nlc3MiLCJpbnZva2VkIiwiZm9yayIsInByZWZpeCIsInBsYXRmb3JtIiwiZ3JlZW4iLCJfZ2V0VmVyc2lvbnMiLCJmcmFtZXdvcmtOYW1lIiwicGx1Z2luUGF0aCIsInBsdWdpblBrZyIsInBsdWdpblZlcnNpb24iLCJ2ZXJzaW9uIiwiX3Jlc29sdmVkIiwiZWRpdGlvbiIsIndlYnBhY2tQYXRoIiwid2VicGFja1BrZyIsIndlYnBhY2tWZXJzaW9uIiwiZXh0UGtnIiwiZXh0VmVyc2lvbiIsImNtZFBhdGgiLCJjbWRQa2ciLCJjbWRWZXJzaW9uIiwidmVyc2lvbl9mdWxsIiwiZnJhbWV3b3JrSW5mbyIsImZyYW1ld29ya1BhdGgiLCJmcmFtZXdvcmtQa2ciLCJmcmFtZXdvcmtWZXJzaW9uIiwibWVzc2FnZSIsInMiLCJjdXJzb3JUbyIsImNsZWFyTGluZSIsIndyaXRlIiwiaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ08sU0FBU0EsWUFBVCxDQUFzQkMsY0FBdEIsRUFBc0M7QUFDM0MsUUFBTUMsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxNQUFJQyxJQUFJLEdBQUcsRUFBWDtBQUNBLE1BQUlDLE9BQU8sR0FBRyxFQUFkOztBQUNBLE1BQUk7QUFDRixRQUFJSixjQUFjLENBQUNLLFNBQWYsSUFBNEJDLFNBQWhDLEVBQTJDO0FBQ3pDSCxNQUFBQSxJQUFJLENBQUNJLFlBQUwsR0FBb0IsRUFBcEI7QUFDQUosTUFBQUEsSUFBSSxDQUFDSSxZQUFMLENBQWtCQyxJQUFsQixDQUF1QixzSEFBdkI7QUFDQSxVQUFJQyxDQUFDLEdBQUcsRUFBUjtBQUNBQSxNQUFBQSxDQUFDLENBQUNOLElBQUYsR0FBU0EsSUFBVDtBQUNBLGFBQU9NLENBQVA7QUFDRDs7QUFDRCxRQUFJSixTQUFTLEdBQUdMLGNBQWMsQ0FBQ0ssU0FBL0I7QUFDQSxRQUFJSyxTQUFTLEdBQUdWLGNBQWMsQ0FBQ1UsU0FBL0I7QUFDQSxRQUFJQyxPQUFPLEdBQUdYLGNBQWMsQ0FBQ1csT0FBN0I7O0FBRUEsVUFBTUMsZUFBZSxHQUFHVixPQUFPLENBQUMsY0FBRCxDQUEvQjs7QUFDQVUs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TCxJQUFBQSxPQUFPLENBQUMsVUFBRCxDQUFQLENBQW9Ca0wsUUFBcEIsQ0FBNkIxRSxPQUFPLENBQUNrQyxNQUFyQyxFQUE2QyxDQUE3Qzs7QUFDQSxRQUFJO0FBQ0ZsQyxNQUFBQSxPQUFPLENBQUNrQyxNQUFSLENBQWV5QyxTQUFmO0FBQ0QsS0FGRCxDQUdBLE9BQU1wSixDQUFOLEVBQVMsQ0FBRTs7QUFDWHlFLElBQUFBLE9BQU8sQ0FBQ2tDLE1BQVIsQ0FBZTBDLEtBQWYsQ0FBcUJILENBQXJCO0FBQ0F6RSxJQUFBQSxPQUFPLENBQUNrQyxNQUFSLENBQWUwQyxLQUFmLENBQXFCLElBQXJCO0FBQ0Q7QUFDRixDLENBRUQ7OztBQUNPLFNBQVM3SixJQUFULENBQWNkLE9BQWQsRUFBdUJ3SyxDQUF2QixFQUEwQjtBQUMvQixNQUFJeEssT0FBTyxJQUFJLEtBQWYsRUFBc0I7QUFDcEJULElBQUFBLE9BQU8sQ0FBQyxVQUFELENBQVAsQ0FBb0JrTCxRQUFwQixDQUE2QjFFLE9BQU8sQ0FBQ2tDLE1BQXJDLEVBQTZDLENBQTdDOztBQUNBLFFBQUk7QUFDRmxDLE1BQUFBLE9BQU8sQ0FBQ2tDLE1BQVIsQ0FBZXlDLFNBQWY7QUFDRCxLQUZELENBR0EsT0FBTXBKLENBQU4sRUFBUyxDQUFFOztBQUNYeUUsSUFBQUEsT0FBTyxDQUFDa0MsTUFBUixDQUFlMEMsS0FBZixDQUFzQixhQUFZSCxDQUFFLEVBQXBDO0FBQ0F6RSxJQUFBQSxPQUFPLENBQUNrQyxNQUFSLENBQWUwQyxLQUFmLENBQXFCLElBQXJCO0FBQ0Q7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb25zdHJ1Y3Rvcihpbml0aWFsT3B0aW9ucykge1xuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgdmFyIHZhcnMgPSB7fVxuICB2YXIgb3B0aW9ucyA9IHt9XG4gIHRyeSB7XG4gICAgaWYgKGluaXRpYWxPcHRpb25zLmZyYW1ld29yayA9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhcnMucGx1Z2luRXJyb3JzID0gW11cbiAgICAgIHZhcnMucGx1Z2luRXJyb3JzLnB1c2goJ3dlYnBhY2sgY29uZmlnOiBmcmFtZXdvcmsgcGFyYW1ldGVyIG9uIGV4dC13ZWJwYWNrLXBsdWdpbiBpcyBub3QgZGVmaW5lZCAtIHZhbHVlczogcmVhY3QsIGFuZ3VsYXIsIGV4dGpzLCBjb21wb25lbnRzJylcbiAgICAgIHZhciBvID0ge31cbiAgICAgIG8udmFycyA9IHZhcnNcbiAgICAgIHJldHVybiBvXG4gICAgfVxuICAgIHZhciBmcmFtZXdvcmsgPSBpbml0aWFsT3B0aW9ucy5mcmFtZXdvcmtcbiAgICB2YXIgdHJlZXNoYWtlID0gaW5pdGlhbE9wdGlvbnMudHJlZXNoYWtlXG4gICAgdmFyIHZlcmJvc2UgPSBpbml0aWFsT3B0aW9ucy52ZXJib3NlXG5cbiAgICBjb25zdCB2YWxpZGF0ZU9wdGlvbnMgPSByZXF1aXJlKCdzY2hlbWEtdXRpbHMnKVxuICAgIHZhbGlkYXRlT3B0aW9ucyhyZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5nZXRWYWxpZGF0ZU9wdGlvbnMoKSwgaW5pdGlhbE9wdGlvbnMsICcnKVxuXG4gICAgY29uc3QgcmMgPSAoZnMuZXhpc3RzU3luYyhgLmV4dC0ke2ZyYW1ld29ya31yY2ApICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGAuZXh0LSR7ZnJhbWV3b3JrfXJjYCwgJ3V0Zi04JykpIHx8IHt9KVxuICAgIG9wdGlvbnMgPSB7IC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLmdldERlZmF1bHRPcHRpb25zKCksIC4uLmluaXRpYWxPcHRpb25zLCAuLi5yYyB9XG5cbiAgICB2YXJzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuZ2V0RGVmYXVsdFZhcnMoKVxuICAgIHZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gICAgdmFycy5hcHAgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5fZ2V0QXBwKClcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcblxuICAgIGxvZ2goYXBwLCBgSE9PSyBjb25zdHJ1Y3RvcmApXG4gICAgbG9ndih2ZXJib3NlLCBgcGx1Z2luTmFtZSAtICR7dmFycy5wbHVnaW5OYW1lfWApXG4gICAgbG9ndih2ZXJib3NlLCBgdmFycy5hcHAgLSAke3ZhcnMuYXBwfWApXG5cbiAgICAvLyBjb25zdCByYyA9IChmcy5leGlzdHNTeW5jKGAuZXh0LSR7dmFycy5mcmFtZXdvcmt9cmNgKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhgLmV4dC0ke3ZhcnMuZnJhbWV3b3JrfXJjYCwgJ3V0Zi04JykpIHx8IHt9KVxuICAgIC8vIG9wdGlvbnMgPSB7IC4uLnJlcXVpcmUoYC4vJHt2YXJzLmZyYW1ld29ya31VdGlsYCkuZ2V0RGVmYXVsdE9wdGlvbnMoKSwgLi4ub3B0aW9ucywgLi4ucmMgfVxuICAgIFxuICAgIGxvZ3YodmVyYm9zZSwgYG9wdGlvbnM6YCk7aWYgKHZlcmJvc2UgPT0gJ3llcycpIHtjb25zb2xlLmRpcihvcHRpb25zKX1cblxuICAgIGlmIChvcHRpb25zLmVudmlyb25tZW50ID09ICdwcm9kdWN0aW9uJykgXG4gICAgICB7dmFycy5wcm9kdWN0aW9uID0gdHJ1ZX1cbiAgICBlbHNlIFxuICAgICAge3ZhcnMucHJvZHVjdGlvbiA9IGZhbHNlfVxuICAgIGxvZ3YodmVyYm9zZSwgYHZhcnM6YCk7aWYgKHZlcmJvc2UgPT0gJ3llcycpIHtjb25zb2xlLmRpcih2YXJzKX1cblxuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgaWYgKHRyZWVzaGFrZSA9PSB0cnVlKSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMidcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIFByb2R1Y3Rpb24gQnVpbGQgLSAnICsgdmFycy5idWlsZHN0ZXApXG4gICAgICAgIHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl90b1Byb2QodmFycywgb3B0aW9ucylcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcyIG9mIDInXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBQcm9kdWN0aW9uIEJ1aWxkIC0gJyArIHZhcnMuYnVpbGRzdGVwKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgIGxvZyhhcHAsICdTdGFydGluZyBEZXZlbG9wbWVudCBCdWlsZCAtICcgKyB2YXJzLmJ1aWxkc3RlcClcbiAgICB9XG4gICAgbG9ndih2ZXJib3NlLCAnQnVpbGRpbmcgZm9yICcgKyBvcHRpb25zLmVudmlyb25tZW50ICsgJywgJyArICdUcmVlc2hha2UgaXMgJyArIG9wdGlvbnMudHJlZXNoYWtlKVxuXG4gICAgdmFyIG8gPSB7fVxuICAgIG8udmFycyA9IHZhcnNcbiAgICBvLm9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfY29uc3RydWN0b3InKVxuICAgIHJldHVybiBvXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF90aGlzQ29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfdGhpc0NvbXBpbGF0aW9uJylcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KHZlcmJvc2UsIGBvcHRpb25zLnNjcmlwdDogJHtvcHRpb25zLnNjcmlwdCB9YClcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KHZlcmJvc2UsIGBidWlsZHN0ZXA6ICR7dmFycy5idWlsZHN0ZXB9YClcblxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgICAgaWYgKG9wdGlvbnMuc2NyaXB0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gbnVsbCkge1xuICAgICAgICAgIHJ1blNjcmlwdChvcHRpb25zLnNjcmlwdCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRmluaXNoZWQgcnVubmluZyAke29wdGlvbnMuc2NyaXB0fWApXG4gICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndih2ZXJib3NlLCBgb3B0aW9ucy5zY3JpcHQ6ICR7b3B0aW9ucy5zY3JpcHQgfWApXG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3YodmVyYm9zZSwgYGJ1aWxkc3RlcDogJHt2YXJzLmJ1aWxkc3RlcH1gKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndih2ZXJib3NlLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ190aGlzQ29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9jb21waWxhdGlvbicpXG4gICAgaWYgKGZyYW1ld29yayAhPSAnZXh0anMnKSB7XG4gICAgICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdXG4vLyAgICAgIGlmICh2YXJzLnByb2R1Y3Rpb24pIHtcbiAgICAgICAgLy9pZiAoKG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJyB8fCBvcHRpb25zLmZyYW1ld29yayA9PSAnY29tcG9uZW50cycpICYmIG9wdGlvbnMudHJlZXNoYWtlID09IHRydWUpIHtcbiAgICAgICAgLy9pZiAob3B0aW9ucy50cmVlc2hha2UgPT0gdHJ1ZSkge1xuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0QWxsQ29tcG9uZW50cyh2YXJzLCBvcHRpb25zKVxuICAgICAgfVxuICAgICAgY29tcGlsYXRpb24uaG9va3Muc3VjY2VlZE1vZHVsZS50YXAoYGV4dC1zdWNjZWVkLW1vZHVsZWAsIG1vZHVsZSA9PiB7XG4gICAgICAgIGlmIChtb2R1bGUucmVzb3VyY2UgJiYgIW1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvbm9kZV9tb2R1bGVzLykpIHtcbiAgICAgICAgICBpZihtb2R1bGUucmVzb3VyY2UubWF0Y2goL1xcLmh0bWwkLykgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYobW9kdWxlLl9zb3VyY2UuX3ZhbHVlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2RvY3R5cGUgaHRtbCcpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbiAgICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFycy5kZXBzID0gW1xuICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbiAgICAgICAgICAgICAgLi4ucmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5maW5pc2hNb2R1bGVzLnRhcChgZXh0LWZpbmlzaC1tb2R1bGVzYCwgbW9kdWxlcyA9PiB7XG4gICAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIodmFycywgb3B0aW9ucylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09ICcyIG9mIDInKSB7XG4gICAgICBjb21waWxhdGlvbi5ob29rcy5odG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uLnRhcChgZXh0LWh0bWwtZ2VuZXJhdGlvbmAsKGRhdGEpID0+IHtcbiAgICAgICAgbG9ndih2ZXJib3NlLCdodG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uJylcbiAgICAgICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgICB2YXIganNQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5qcycpXG4gICAgICAgIHZhciBjc3NQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5jc3MnKVxuICAgICAgICBkYXRhLmFzc2V0cy5qcy51bnNoaWZ0KGpzUGF0aClcbiAgICAgICAgZGF0YS5hc3NldHMuY3NzLnVuc2hpZnQoY3NzUGF0aClcbiAgICAgICAgbG9nKHZhcnMuYXBwLCBgQWRkaW5nICR7anNQYXRofSBhbmQgJHtjc3NQYXRofSB0byBpbmRleC5odG1sYClcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfY29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIF9lbWl0KGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdHJ5IHtcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIC8vY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9lbWl0JylcbiAgICB2YXIgZW1pdCA9IG9wdGlvbnMuZW1pdFxuICAgIC8vdmFyIHRyZWVzaGFrZSA9IG9wdGlvbnMudHJlZXNoYWtlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgLy92YXIgZW52aXJvbm1lbnQgPSAgb3B0aW9ucy5lbnZpcm9ubWVudFxuICAgIGlmIChlbWl0KSB7XG4gICAgICAvLyBpZiAoKGVudmlyb25tZW50ID09ICdwcm9kdWN0aW9uJyAmJiB0cmVlc2hha2UgPT0gdHJ1ZSAgJiYgZnJhbWV3b3JrID09ICdhbmd1bGFyJykgfHxcbiAgICAgIC8vICAgICAoZW52aXJvbm1lbnQgIT0gJ3Byb2R1Y3Rpb24nICYmIHRyZWVzaGFrZSA9PSBmYWxzZSAmJiBmcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB8fFxuICAgICAgLy8gICAgIChmcmFtZXdvcmsgPT0gJ3JlYWN0JykgfHxcbiAgICAgIC8vICAgICAoZnJhbWV3b3JrID09ICdjb21wb25lbnRzJylcbiAgICAgIC8vICkge1xuXG4gICAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScgfHwgdmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMicpIHtcbiAgICAgICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4vLyAgICAgICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbi8vICAgICAgICBjb25zdCBfYnVpbGRFeHRCdW5kbGUgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5fYnVpbGRFeHRCdW5kbGVcbiAgICAgICAgbGV0IG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3V0cHV0UGF0aCx2YXJzLmV4dFBhdGgpXG4gICAgICAgIGlmIChjb21waWxlci5vdXRwdXRQYXRoID09PSAnLycgJiYgY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIpIHtcbiAgICAgICAgICBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGNvbXBpbGVyLm9wdGlvbnMuZGV2U2VydmVyLmNvbnRlbnRCYXNlLCBvdXRwdXRQYXRoKVxuICAgICAgICB9XG4gICAgICAgIGxvZ3YodmVyYm9zZSwnb3V0cHV0UGF0aDogJyArIG91dHB1dFBhdGgpXG4gICAgICAgIGxvZ3YodmVyYm9zZSwnZnJhbWV3b3JrOiAnICsgZnJhbWV3b3JrKVxuICAgICAgICBpZiAoZnJhbWV3b3JrICE9ICdleHRqcycpIHtcbiAgICAgICAgICBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0UGF0aCwgY29tcGlsYXRpb24pXG4gICAgICAgIH1cbiAgICAgICAgLy8gZWxzZSB7XG4gICAgICAgIC8vICAgaWYgKG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJyAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSBmYWxzZSkge1xuICAgICAgICAvLyAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dFBhdGgsIGNvbXBpbGF0aW9uKVxuICAgICAgICAvLyAgIH1cbiAgICAgICAgLy8gICBlbHNlIHtcbiAgICAgICAgLy8gICAgIHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgLy8gICB9XG4gICAgICAgIC8vIH1cbiAgICAgICAgdmFyIGNvbW1hbmQgPSAnJ1xuICAgICAgICBpZiAob3B0aW9ucy53YXRjaCA9PSAneWVzJyAmJiB2YXJzLnByb2R1Y3Rpb24gPT0gZmFsc2UpIHtcbiAgICAgICAgICBjb21tYW5kID0gJ3dhdGNoJ1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNvbW1hbmQgPSAnYnVpbGQnXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhcnMucmVidWlsZCA9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHBhcm1zID0gW11cbiAgICAgICAgICBpZiAob3B0aW9ucy5wcm9maWxlID09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnByb2ZpbGUgPT0gJycgfHwgb3B0aW9ucy5wcm9maWxlID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMuZW52aXJvbm1lbnRdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhcnMud2F0Y2hTdGFydGVkID09IGZhbHNlKSB7XG4gICAgICAgICAgICBjb25zdCBfYnVpbGRFeHRCdW5kbGUgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5fYnVpbGRFeHRCdW5kbGVcbiAgICAgICAgICAgIGF3YWl0IF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgb3B0aW9ucylcbiAgICAgICAgICAgIHZhcnMud2F0Y2hTdGFydGVkID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbG9ndih2ZXJib3NlLCdOT1QgcnVubmluZyBlbWl0JylcbiAgICAgICAgY2FsbGJhY2soKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxvZ3YodmVyYm9zZSwnZW1pdCBpcyBmYWxzZScpXG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdlbWl0OiAnICsgZSlcbiAgICBjYWxsYmFjaygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2FmdGVyQ29tcGlsZShjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9hZnRlckNvbXBpbGUnKVxuICAgIGlmIChvcHRpb25zLmZyYW1ld29yayA9PSAnZXh0anMnKSB7XG4gICAgICByZXF1aXJlKGAuL2V4dGpzVXRpbGApLl9hZnRlckNvbXBpbGUoY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZSBub3QgcnVuJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfYWZ0ZXJDb21waWxlOiAnICsgZSlcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2RvbmUodmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9kb25lJylcbiAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gZmFsc2UgJiYgb3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICByZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLl90b0Rldih2YXJzLCBvcHRpb25zKVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgaWYob3B0aW9ucy5icm93c2VyID09IHRydWUgJiYgb3B0aW9ucy53YXRjaCA9PSAneWVzJyAmJiB2YXJzLnByb2R1Y3Rpb24gPT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHZhcnMuYnJvd3NlckNvdW50ID09IDApIHtcbiAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6JyArIG9wdGlvbnMucG9ydFxuICAgICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYE9wZW5pbmcgYnJvd3NlciBhdCAke3VybH1gKVxuICAgICAgICAgIHZhcnMuYnJvd3NlckNvdW50KytcbiAgICAgICAgICBjb25zdCBvcG4gPSByZXF1aXJlKCdvcG4nKVxuICAgICAgICAgIG9wbih1cmwpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAvL2NvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdzaG93IGJyb3dzZXIgd2luZG93IC0gZXh0LWRvbmU6ICcgKyBlKVxuICAgIH1cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScpIHtcbiAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBEZXZlbG9wbWVudCBCdWlsZGApXG4gICAgfVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMiBvZiAyJykge1xuICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIFByb2R1Y3Rpb24gQnVpbGRgKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0LCBjb21waWxhdGlvbikge1xuICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfcHJlcGFyZUZvckJ1aWxkJylcbiAgICBjb25zdCByaW1yYWYgPSByZXF1aXJlKCdyaW1yYWYnKVxuICAgIGNvbnN0IG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpXG4gICAgY29uc3QgZnN4ID0gcmVxdWlyZSgnZnMtZXh0cmEnKVxuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICB2YXIgcGFja2FnZXMgPSBvcHRpb25zLnBhY2thZ2VzXG4gICAgdmFyIHRvb2xraXQgPSBvcHRpb25zLnRvb2xraXRcbiAgICB2YXIgdGhlbWUgPSBvcHRpb25zLnRoZW1lXG4gICAgdGhlbWUgPSB0aGVtZSB8fCAodG9vbGtpdCA9PT0gJ2NsYXNzaWMnID8gJ3RoZW1lLXRyaXRvbicgOiAndGhlbWUtbWF0ZXJpYWwnKVxuICAgIGxvZ3YodmVyYm9zZSwnZmlyc3RUaW1lOiAnICsgdmFycy5maXJzdFRpbWUpXG4gICAgaWYgKHZhcnMuZmlyc3RUaW1lKSB7XG4gICAgICByaW1yYWYuc3luYyhvdXRwdXQpXG4gICAgICBta2RpcnAuc3luYyhvdXRwdXQpXG4gICAgICBjb25zdCBidWlsZFhNTCA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuYnVpbGRYTUxcbiAgICAgIGNvbnN0IGNyZWF0ZUFwcEpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUFwcEpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZVdvcmtzcGFjZUpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZVdvcmtzcGFjZUpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZUpTRE9NRW52aXJvbm1lbnQgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUpTRE9NRW52aXJvbm1lbnRcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2J1aWxkLnhtbCcpLCBidWlsZFhNTCh2YXJzLnByb2R1Y3Rpb24sIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2FwcC5qc29uJyksIGNyZWF0ZUFwcEpzb24odGhlbWUsIHBhY2thZ2VzLCB0b29sa2l0LCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdqc2RvbS1lbnZpcm9ubWVudC5qcycpLCBjcmVhdGVKU0RPTUVudmlyb25tZW50KG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ3dvcmtzcGFjZS5qc29uJyksIGNyZWF0ZVdvcmtzcGFjZUpzb24ob3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgdmFyIGZyYW1ld29yayA9IHZhcnMuZnJhbWV3b3JrO1xuICAgICAgLy9iZWNhdXNlIG9mIGEgcHJvYmxlbSB3aXRoIGNvbG9ycGlja2VyXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3V4L2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAndXgnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgKHV4KSAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vcGFja2FnZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3BhY2thZ2VzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdvdmVycmlkZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCdyZXNvdXJjZXMvJykpKSB7XG4gICAgICAgIHZhciBmcm9tUmVzb3VyY2VzID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdyZXNvdXJjZXMvJylcbiAgICAgICAgdmFyIHRvUmVzb3VyY2VzID0gcGF0aC5qb2luKG91dHB1dCwgJy4uL3Jlc291cmNlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUmVzb3VyY2VzLCB0b1Jlc291cmNlcylcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21SZXNvdXJjZXMucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9SZXNvdXJjZXMucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgfVxuICAgIHZhcnMuZmlyc3RUaW1lID0gZmFsc2VcbiAgICB2YXIganMgPSAnJ1xuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24pIHtcbiAgICAgIGpzID0gdmFycy5kZXBzLmpvaW4oJztcXG4nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBqcyA9ICdFeHQucmVxdWlyZShcIkV4dC4qXCIpJ1xuICAgIH1cbiAgICBpZiAodmFycy5tYW5pZmVzdCA9PT0gbnVsbCB8fCBqcyAhPT0gdmFycy5tYW5pZmVzdCkge1xuICAgICAgdmFycy5tYW5pZmVzdCA9IGpzXG4gICAgICBjb25zdCBtYW5pZmVzdCA9IHBhdGguam9pbihvdXRwdXQsICdtYW5pZmVzdC5qcycpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKG1hbmlmZXN0LCBqcywgJ3V0ZjgnKVxuICAgICAgdmFycy5yZWJ1aWxkID0gdHJ1ZVxuICAgICAgdmFyIGJ1bmRsZURpciA9IG91dHB1dC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKVxuICAgICAgaWYgKGJ1bmRsZURpci50cmltKCkgPT0gJycpIHtidW5kbGVEaXIgPSAnLi8nfVxuICAgICAgbG9nKGFwcCwgJ0J1aWxkaW5nIEV4dCBidW5kbGUgYXQ6ICcgKyBidW5kbGVEaXIpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5yZWJ1aWxkID0gZmFsc2VcbiAgICAgIGxvZyhhcHAsICdFeHQgcmVidWlsZCBOT1QgbmVlZGVkJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19wcmVwYXJlRm9yQnVpbGQ6ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9idWlsZEV4dEJ1bmRsZScpXG4gICAgbGV0IHNlbmNoYTsgdHJ5IHsgc2VuY2hhID0gcmVxdWlyZSgnQHNlbmNoYS9jbWQnKSB9IGNhdGNoIChlKSB7IHNlbmNoYSA9ICdzZW5jaGEnIH1cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhzZW5jaGEpKSB7XG4gICAgICBsb2d2KHZlcmJvc2UsJ3NlbmNoYSBmb2xkZXIgZXhpc3RzJylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KHZlcmJvc2UsJ3NlbmNoYSBmb2xkZXIgRE9FUyBOT1QgZXhpc3QnKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgb25CdWlsZERvbmUgPSAoKSA9PiB7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwnb25CdWlsZERvbmUnKVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH1cbiAgICAgIHZhciBvcHRzID0geyBjd2Q6IG91dHB1dFBhdGgsIHNpbGVudDogdHJ1ZSwgc3RkaW86ICdwaXBlJywgZW5jb2Rpbmc6ICd1dGYtOCd9XG4gICAgICBleGVjdXRlQXN5bmMoYXBwLCBzZW5jaGEsIHBhcm1zLCBvcHRzLCBjb21waWxhdGlvbiwgb3B0aW9ucykudGhlbiAoXG4gICAgICAgIGZ1bmN0aW9uKCkgeyBvbkJ1aWxkRG9uZSgpIH0sIFxuICAgICAgICBmdW5jdGlvbihyZWFzb24pIHsgcmVqZWN0KHJlYXNvbikgfVxuICAgICAgKVxuICAgIH0pXG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIGNvbnNvbGUubG9nKCdlJylcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfYnVpbGRFeHRCdW5kbGU6ICcgKyBlKVxuICAgIGNhbGxiYWNrKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlQXN5bmMgKGFwcCwgY29tbWFuZCwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICAvL2NvbnN0IERFRkFVTFRfU1VCU1RSUyA9IFsnW0lORl0gTG9hZGluZycsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFNlcnZlclwiLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgICBjb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbXCJbSU5GXSB4U2VydmVyXCIsICdbSU5GXSBMb2FkaW5nJywgJ1tJTkZdIEFwcGVuZCcsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tJTkZdIFByb2Nlc3NpbmcgQnVpbGQnLCAnW0xPR10gRmFzaGlvbiBidWlsZCBjb21wbGV0ZScsICdbRVJSXScsICdbV1JOXScsIFwiW0lORl0gV3JpdGluZ1wiLCBcIltJTkZdIExvYWRpbmcgQnVpbGRcIiwgXCJbSU5GXSBXYWl0aW5nXCIsIFwiW0xPR10gRmFzaGlvbiB3YWl0aW5nXCJdO1xuICAgIHZhciBzdWJzdHJpbmdzID0gREVGQVVMVF9TVUJTVFJTIFxuICAgIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbiAgICBjb25zdCBjcm9zc1NwYXduID0gcmVxdWlyZSgnY3Jvc3Mtc3Bhd24nKVxuICAgIGNvbnN0IGxvZyA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ1xuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIGV4ZWN1dGVBc3luYycpXG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbG9ndih2ZXJib3NlLGBjb21tYW5kIC0gJHtjb21tYW5kfWApXG4gICAgICBsb2d2KHZlcmJvc2UsIGBwYXJtcyAtICR7cGFybXN9YClcbiAgICAgIGxvZ3YodmVyYm9zZSwgYG9wdHMgLSAke0pTT04uc3RyaW5naWZ5KG9wdHMpfWApXG4gICAgICBsZXQgY2hpbGQgPSBjcm9zc1NwYXduKGNvbW1hbmQsIHBhcm1zLCBvcHRzKVxuICAgICAgY2hpbGQub24oJ2Nsb3NlJywgKGNvZGUsIHNpZ25hbCkgPT4ge1xuICAgICAgICBsb2d2KHZlcmJvc2UsIGBvbiBjbG9zZTogYCArIGNvZGUpIFxuICAgICAgICBpZihjb2RlID09PSAwKSB7IHJlc29sdmUoMCkgfVxuICAgICAgICBlbHNlIHsgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goIG5ldyBFcnJvcihjb2RlKSApOyByZXNvbHZlKDApIH1cbiAgICAgIH0pXG4gICAgICBjaGlsZC5vbignZXJyb3InLCAoZXJyb3IpID0+IHsgXG4gICAgICAgIGxvZ3YodmVyYm9zZSwgYG9uIGVycm9yYCkgXG4gICAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGVycm9yKVxuICAgICAgICByZXNvbHZlKDApXG4gICAgICB9KVxuICAgICAgY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXG4gICAgICAgIGxvZ3YodmVyYm9zZSwgYCR7c3RyfWApXG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEudG9TdHJpbmcoKS5tYXRjaCgvRmFzaGlvbiB3YWl0aW5nIGZvciBjaGFuZ2VzXFwuXFwuXFwuLykpIHtcblxuICAgICAgICAgIC8vIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICAgICAgICAvLyB2YXIgZmlsZW5hbWUgPSBwcm9jZXNzLmN3ZCgpKycvc3JjL2luZGV4LmpzJztcbiAgICAgICAgICAvLyB2YXIgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSk7XG4gICAgICAgICAgLy8gZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgZGF0YSArICcgJywgJ3V0ZjgnKVxuICAgICAgICAgIC8vIGxvZ3YodmVyYm9zZSwgYHRvdWNoaW5nICR7ZmlsZW5hbWV9YClcblxuICAgICAgICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICAgICAgICB2YXIgZmlsZW5hbWUgPSBwcm9jZXNzLmN3ZCgpICsgJy9zcmMvaW5kZXguanMnO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSk7XG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVuYW1lLCBkYXRhICsgJyAnLCAndXRmOCcpO1xuICAgICAgICAgICAgbG9nKGFwcCwgYHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGxvZyhhcHAsIGBOT1QgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKDApXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKHN1YnN0cmluZ3Muc29tZShmdW5jdGlvbih2KSB7IHJldHVybiBkYXRhLmluZGV4T2YodikgPj0gMDsgfSkpIHsgXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltJTkZdXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltMT0ddXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykudHJpbSgpXG4gICAgICAgICAgICBpZiAoc3RyLmluY2x1ZGVzKFwiW0VSUl1cIikpIHtcbiAgICAgICAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goYXBwICsgc3RyLnJlcGxhY2UoL15cXFtFUlJcXF0gL2dpLCAnJykpO1xuICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltFUlJdXCIsIGAke2NoYWxrLnJlZChcIltFUlJdXCIpfWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2coYXBwLCBzdHIpIFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNoaWxkLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywgYGVycm9yIG9uIGNsb3NlOiBgICsgZGF0YSkgXG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICB2YXIgc3RySmF2YU9wdHMgPSBcIlBpY2tlZCB1cCBfSkFWQV9PUFRJT05TXCI7XG4gICAgICAgIHZhciBpbmNsdWRlcyA9IHN0ci5pbmNsdWRlcyhzdHJKYXZhT3B0cylcbiAgICAgICAgaWYgKCFpbmNsdWRlcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2FwcH0gJHtjaGFsay5yZWQoXCJbRVJSXVwiKX0gJHtzdHJ9YClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnZXhlY3V0ZUFzeW5jOiAnICsgZSlcbiAgICBjYWxsYmFjaygpXG4gIH0gXG59XG5cbi8vKioqKioqKioqKlxuZnVuY3Rpb24gcnVuU2NyaXB0KHNjcmlwdFBhdGgsIGNhbGxiYWNrKSB7XG4gIHZhciBjaGlsZFByb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG4gIC8vIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBjYWxsYmFjayBoYXMgYmVlbiBpbnZva2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgaW52b2NhdGlvbnNcbiAgdmFyIGludm9rZWQgPSBmYWxzZTtcbiAgdmFyIHByb2Nlc3MgPSBjaGlsZFByb2Nlc3MuZm9yayhzY3JpcHRQYXRoKTtcbiAgLy8gbGlzdGVuIGZvciBlcnJvcnMgYXMgdGhleSBtYXkgcHJldmVudCB0aGUgZXhpdCBldmVudCBmcm9tIGZpcmluZ1xuICBwcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xuICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjayBvbmNlIHRoZSBwcm9jZXNzIGhhcyBmaW5pc2hlZCBydW5uaW5nXG4gIHByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZSkge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgdmFyIGVyciA9IGNvZGUgPT09IDAgPyBudWxsIDogbmV3IEVycm9yKCdleGl0IGNvZGUgJyArIGNvZGUpO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0QXBwKCkge1xuICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gIHZhciBwcmVmaXggPSBgYFxuICBjb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKVxuICBpZiAocGxhdGZvcm0gPT0gJ2RhcndpbicpIHsgcHJlZml4ID0gYOKEuSDvvaJleHTvvaM6YCB9XG4gIGVsc2UgeyBwcmVmaXggPSBgaSBbZXh0XTpgIH1cbiAgcmV0dXJuIGAke2NoYWxrLmdyZWVuKHByZWZpeCl9IGBcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2dldFZlcnNpb25zKGFwcCwgcGx1Z2luTmFtZSwgZnJhbWV3b3JrTmFtZSkge1xuICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICB2YXIgdiA9IHt9XG4gIHZhciBwbHVnaW5QYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhJywgcGx1Z2luTmFtZSlcbiAgdmFyIHBsdWdpblBrZyA9IChmcy5leGlzdHNTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwbHVnaW5QYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5wbHVnaW5WZXJzaW9uID0gcGx1Z2luUGtnLnZlcnNpb25cbiAgdi5fcmVzb2x2ZWQgPSBwbHVnaW5Qa2cuX3Jlc29sdmVkXG4gIGlmICh2Ll9yZXNvbHZlZCA9PSB1bmRlZmluZWQpIHtcbiAgICB2LmVkaXRpb24gPSBgQ29tbWVyY2lhbGBcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAoLTEgPT0gdi5fcmVzb2x2ZWQuaW5kZXhPZignY29tbXVuaXR5JykpIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tdW5pdHlgXG4gICAgfVxuICB9XG4gIHZhciB3ZWJwYWNrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvd2VicGFjaycpXG4gIHZhciB3ZWJwYWNrUGtnID0gKGZzLmV4aXN0c1N5bmMod2VicGFja1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYud2VicGFja1ZlcnNpb24gPSB3ZWJwYWNrUGtnLnZlcnNpb25cbiAgdmFyIGV4dFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0JylcbiAgdmFyIGV4dFBrZyA9IChmcy5leGlzdHNTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhleHRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5leHRWZXJzaW9uID0gZXh0UGtnLnNlbmNoYS52ZXJzaW9uXG4gIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gIHZhciBjbWRQa2cgPSAoZnMuZXhpc3RzU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgaWYgKHYuY21kVmVyc2lvbiA9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgY21kUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLGBub2RlX21vZHVsZXMvQHNlbmNoYS8ke3BsdWdpbk5hbWV9L25vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gICAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXG4gIH1cbiAgdmFyIGZyYW1ld29ya0luZm8gPSAnJ1xuICAgaWYgKGZyYW1ld29ya05hbWUgIT0gdW5kZWZpbmVkICYmIGZyYW1ld29ya05hbWUgIT0gJ2V4dGpzJykge1xuICAgIHZhciBmcmFtZXdvcmtQYXRoID0gJydcbiAgICBpZiAoZnJhbWV3b3JrTmFtZSA9PSAncmVhY3QnKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9yZWFjdCcpXG4gICAgfVxuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdhbmd1bGFyJykge1xuICAgICAgZnJhbWV3b3JrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQGFuZ3VsYXIvY29yZScpXG4gICAgfVxuICAgIHZhciBmcmFtZXdvcmtQa2cgPSAoZnMuZXhpc3RzU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZnJhbWV3b3JrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gICAgdi5mcmFtZXdvcmtWZXJzaW9uID0gZnJhbWV3b3JrUGtnLnZlcnNpb25cbiAgICBmcmFtZXdvcmtJbmZvID0gJywgJyArIGZyYW1ld29ya05hbWUgKyAnIHYnICsgdi5mcmFtZXdvcmtWZXJzaW9uXG4gIH1cbiAgcmV0dXJuIGFwcCArICdleHQtd2VicGFjay1wbHVnaW4gdicgKyB2LnBsdWdpblZlcnNpb24gKyAnLCBFeHQgSlMgdicgKyB2LmV4dFZlcnNpb24gKyAnICcgKyB2LmVkaXRpb24gKyAnIEVkaXRpb24sIFNlbmNoYSBDbWQgdicgKyB2LmNtZFZlcnNpb24gKyAnLCB3ZWJwYWNrIHYnICsgdi53ZWJwYWNrVmVyc2lvbiArIGZyYW1ld29ya0luZm9cbiB9XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhhcHAsbWVzc2FnZSkge1xuICB2YXIgcyA9IGFwcCArIG1lc3NhZ2UgXG4gIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gIHRyeSB7cHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKCl9Y2F0Y2goZSkge31cbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocyk7cHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2goYXBwLG1lc3NhZ2UpIHtcbiAgdmFyIGggPSBmYWxzZVxuICB2YXIgcyA9IGFwcCArIG1lc3NhZ2UgXG4gIGlmIChoID09IHRydWUpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9ndih2ZXJib3NlLCBzKSB7XG4gIGlmICh2ZXJib3NlID09ICd5ZXMnKSB7XG4gICAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgICB0cnkge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKClcbiAgICB9XG4gICAgY2F0Y2goZSkge31cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShgLXZlcmJvc2U6ICR7c31gKVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxuICB9XG59XG4iXX0=