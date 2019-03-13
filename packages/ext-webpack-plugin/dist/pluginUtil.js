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
exports._executeAsync = _executeAsync;
exports._toXtype = _toXtype;
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

    validateOptions(_getValidateOptions(), initialOptions, '');
    const rc = fs.existsSync(`.ext-${framework}rc`) && JSON.parse(fs.readFileSync(`.ext-${framework}rc`, 'utf-8')) || {};
    options = _objectSpread({}, _getDefaultOptions(), initialOptions, rc);
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
    } else {
      vars.production = false;
    } //logv(verbose, `options:`);if (verbose == 'yes') {console.dir(options)}
    //logv(verbose, `vars:`);if (verbose == 'yes') {console.dir(vars)}


    log(app, _getVersions(pluginName, framework));

    if (framework == 'react') {
      // || framework == 'extjs'
      if (vars.production == true) {
        vars.buildstep = '1 of 1';
        log(app, 'Starting Production Build');
      } else {
        vars.buildstep = '1 of 1';
        log(app, 'Starting Development Build');
      }
    } else if (vars.production == true) {
      if (treeshake == 'yes') {
        vars.buildstep = '1 of 2';
        log(app, 'Starting Production Build - ' + vars.buildstep);

        require(`./${framework}Util`)._toProd(vars, options);
      } else {
        vars.buildstep = '2 of 2';
        log(app, 'Starting Production Build - ' + vars.buildstep);
      }
    } else {
      vars.buildstep = '1 of 1';
      log(app, 'Starting Development Build');
    }

    logv(verbose, 'Building for ' + options.environment + ', ' + 'Treeshake is ' + options.treeshake);
    var o = {};
    o.vars = vars;
    o.options = options;
    return o;
  } catch (e) {
    console.log(e);
  }
} //**********


function _thisCompilation(compiler, compilation, vars, options) {
  try {
    var app = vars.app;
    var verbose = options.verbose;
    logv(verbose, 'FUNCTION _thisCompilation');
    logv(verbose, `options.script: ${options.script}`);
    logv(verbose, `buildstep: ${vars.buildstep}`);

    if (vars.buildstep == '1 of 1' || vars.buildstep == '1 of 2') {
      if (options.script != undefined) {
        if (options.script != null) {
          if (options.script != '') {
            log(app, `Started running ${options.script}`);
            runScript(options.script, function (err) {
              if (err) throw err;
              log(app, `Finished running ${options.script}`);
            });
          }
        }
      } else {
        logv(verbose, `options.script: ${options.script}`);
        logv(verbose, `buildstep: ${vars.buildstep}`);
      }
    }
  } catch (e) {
    logv(verbose, e);
    compilation.errors.push('_thisCompilation: ' + e);
  }
} //**********


function _compilation(compiler, compilation, vars, options) {
  try {
    var app = vars.app;
    var verbose = options.verbose;
    var framework = options.framework;
    logv(verbose, 'FUNCTION _compilation');

    if (framework == 'extjs') {
      return;
    }

    var extComponents = [];

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

    if (vars.buildstep == '1 of 1' || vars.buildstep == '2 of 2') {
      compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tap(`ext-html-generation`, data => {
        const path = require('path');

        var jsPath = path.join(vars.extPath, 'ext.js');
        var cssPath = path.join(vars.extPath, 'ext.css');
        data.assets.js.unshift(jsPath);
        data.assets.css.unshift(cssPath);
        log(app, `Adding ${jsPath} and ${cssPath} to index.html`);
      });
    }
  } catch (e) {
    logv(options.verbose, e);
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
          return _buildExtBundle(app, compilation, outputPath, parms, options);

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
          _context.next = 42;
          break;

        case 37:
          _context.prev = 37;
          _context.t0 = _context["catch"](0);
          logv(options.verbose, _context.t0);
          compilation.errors.push('_emit: ' + _context.t0);
          callback();

        case 42:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 37]]);
  }));
  return _emit2.apply(this, arguments);
}

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
    compilation.errors.push('_afterCompile: ' + e);
    logv(options.verbose, e);
  }
} //**********


function _done(vars, options) {
  try {
    var verbose = options.verbose;
    var framework = options.framework;
    logv(verbose, 'FUNCTION _done'); //mjg refactor

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
      console.log(e); //compilation.errors.push('show browser window - ext-done: ' + e)
    }

    if (vars.buildstep == '1 of 1') {
      if (vars.production == true) {
        require('./pluginUtil').log(vars.app, `Ending Production Build`);
      } else {
        require('./pluginUtil').log(vars.app, `Ending Development Build`);
      }
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

      _executeAsync(app, sencha, parms, opts, compilation, options).then(function () {
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


function _executeAsync(_x6, _x7, _x8, _x9, _x10, _x11) {
  return _executeAsync2.apply(this, arguments);
} //**********


function _executeAsync2() {
  _executeAsync2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(app, command, parms, opts, compilation, options) {
    var verbose, DEFAULT_SUBSTRS, substrings, chalk, crossSpawn;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          verbose = options.verbose; //const DEFAULT_SUBSTRS = ['[INF] Loading', '[INF] Processing', '[LOG] Fashion build complete', '[ERR]', '[WRN]', "[INF] Server", "[INF] Writing", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"];

          DEFAULT_SUBSTRS = ["[INF] xServer", '[INF] Loading', '[INF] Append', '[INF] Processing', '[INF] Processing Build', '[LOG] Fashion build complete', '[ERR]', '[WRN]', "[INF] Writing", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"];
          substrings = DEFAULT_SUBSTRS;
          chalk = require('chalk');
          crossSpawn = require('cross-spawn');
          logv(verbose, 'FUNCTION _executeAsync');
          _context2.next = 9;
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

        case 9:
          _context2.next = 16;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          logv(options, _context2.t0);
          compilation.errors.push('_executeAsync: ' + _context2.t0);
          callback();

        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 11]]);
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

  return 'ext-webpack-plugin v' + v.pluginVersion + ', Ext JS v' + v.extVersion + ' ' + v.edition + ' Edition, Sencha Cmd v' + v.cmdVersion + ', webpack v' + v.webpackVersion + frameworkInfo;
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
        "type": ["string"]
      },
      "treeshake": {
        "type": ["string"]
      },
      "browser": {
        "type": ["string"]
      },
      "watch": {
        "type": ["string"]
      },
      "verbose": {
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
    profile: 'desktop',
    environment: 'development',
    treeshake: 'no',
    browser: 'yes',
    watch: 'yes',
    verbose: 'no'
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsImluaXRpYWxPcHRpb25zIiwiZnMiLCJyZXF1aXJlIiwidmFycyIsIm9wdGlvbnMiLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwibyIsInRyZWVzaGFrZSIsInZlcmJvc2UiLCJ2YWxpZGF0ZU9wdGlvbnMiLCJfZ2V0VmFsaWRhdGVPcHRpb25zIiwicmMiLCJleGlzdHNTeW5jIiwiSlNPTiIsInBhcnNlIiwicmVhZEZpbGVTeW5jIiwiX2dldERlZmF1bHRPcHRpb25zIiwiX2dldERlZmF1bHRWYXJzIiwicGx1Z2luTmFtZSIsImFwcCIsIl9nZXRBcHAiLCJsb2d2IiwiZW52aXJvbm1lbnQiLCJwcm9kdWN0aW9uIiwibG9nIiwiX2dldFZlcnNpb25zIiwiYnVpbGRzdGVwIiwiX3RvUHJvZCIsImUiLCJjb25zb2xlIiwiX3RoaXNDb21waWxhdGlvbiIsImNvbXBpbGVyIiwiY29tcGlsYXRpb24iLCJzY3JpcHQiLCJydW5TY3JpcHQiLCJlcnIiLCJlcnJvcnMiLCJfY29tcGlsYXRpb24iLCJleHRDb21wb25lbnRzIiwiX2dldEFsbENvbXBvbmVudHMiLCJob29rcyIsInN1Y2NlZWRNb2R1bGUiLCJ0YXAiLCJtb2R1bGUiLCJyZXNvdXJjZSIsIm1hdGNoIiwiX3NvdXJjZSIsIl92YWx1ZSIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJkZXBzIiwiX2V4dHJhY3RGcm9tU291cmNlIiwiZmluaXNoTW9kdWxlcyIsIm1vZHVsZXMiLCJfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciIsImh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24iLCJkYXRhIiwicGF0aCIsImpzUGF0aCIsImpvaW4iLCJleHRQYXRoIiwiY3NzUGF0aCIsImFzc2V0cyIsImpzIiwidW5zaGlmdCIsImNzcyIsIl9lbWl0IiwiY2FsbGJhY2siLCJlbWl0Iiwib3V0cHV0UGF0aCIsImRldlNlcnZlciIsImNvbnRlbnRCYXNlIiwiX3ByZXBhcmVGb3JCdWlsZCIsImNvbW1hbmQiLCJ3YXRjaCIsInJlYnVpbGQiLCJwYXJtcyIsInByb2ZpbGUiLCJ3YXRjaFN0YXJ0ZWQiLCJfYnVpbGRFeHRCdW5kbGUiLCJfYWZ0ZXJDb21waWxlIiwiX2RvbmUiLCJfdG9EZXYiLCJicm93c2VyIiwiYnJvd3NlckNvdW50IiwidXJsIiwicG9ydCIsIm9wbiIsIm91dHB1dCIsInBhY2thZ2VzIiwidG9vbGtpdCIsInRoZW1lIiwicmltcmFmIiwibWtkaXJwIiwiZnN4IiwiZmlyc3RUaW1lIiwic3luYyIsImJ1aWxkWE1MIiwiY3JlYXRlQXBwSnNvbiIsImNyZWF0ZVdvcmtzcGFjZUpzb24iLCJjcmVhdGVKU0RPTUVudmlyb25tZW50Iiwid3JpdGVGaWxlU3luYyIsInByb2Nlc3MiLCJjd2QiLCJmcm9tUGF0aCIsInRvUGF0aCIsImNvcHlTeW5jIiwicmVwbGFjZSIsImZyb21SZXNvdXJjZXMiLCJ0b1Jlc291cmNlcyIsIm1hbmlmZXN0IiwiYnVuZGxlRGlyIiwidHJpbSIsInNlbmNoYSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25CdWlsZERvbmUiLCJvcHRzIiwic2lsZW50Iiwic3RkaW8iLCJlbmNvZGluZyIsIl9leGVjdXRlQXN5bmMiLCJ0aGVuIiwicmVhc29uIiwiREVGQVVMVF9TVUJTVFJTIiwic3Vic3RyaW5ncyIsImNoYWxrIiwiY3Jvc3NTcGF3biIsInN0cmluZ2lmeSIsImNoaWxkIiwib24iLCJjb2RlIiwic2lnbmFsIiwiRXJyb3IiLCJlcnJvciIsInN0ZG91dCIsInN0ciIsInRvU3RyaW5nIiwiZmlsZW5hbWUiLCJzb21lIiwidiIsImluZGV4T2YiLCJyZWQiLCJzdGRlcnIiLCJzdHJKYXZhT3B0cyIsInNjcmlwdFBhdGgiLCJjaGlsZFByb2Nlc3MiLCJpbnZva2VkIiwiZm9yayIsIl90b1h0eXBlIiwicHJlZml4IiwicGxhdGZvcm0iLCJncmVlbiIsImZyYW1ld29ya05hbWUiLCJwbHVnaW5QYXRoIiwicGx1Z2luUGtnIiwicGx1Z2luVmVyc2lvbiIsInZlcnNpb24iLCJfcmVzb2x2ZWQiLCJlZGl0aW9uIiwid2VicGFja1BhdGgiLCJ3ZWJwYWNrUGtnIiwid2VicGFja1ZlcnNpb24iLCJleHRQa2ciLCJleHRWZXJzaW9uIiwiY21kUGF0aCIsImNtZFBrZyIsImNtZFZlcnNpb24iLCJ2ZXJzaW9uX2Z1bGwiLCJmcmFtZXdvcmtJbmZvIiwiZnJhbWV3b3JrUGF0aCIsImZyYW1ld29ya1BrZyIsImZyYW1ld29ya1ZlcnNpb24iLCJtZXNzYWdlIiwicyIsImN1cnNvclRvIiwiY2xlYXJMaW5lIiwid3JpdGUiLCJsb2doIiwiaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNPLFNBQVNBLFlBQVQsQ0FBc0JDLGNBQXRCLEVBQXNDO0FBQzNDLFFBQU1DLEVBQUUsR0FBR0MsT0FBTyxDQUFDLElBQUQsQ0FBbEI7O0FBQ0EsTUFBSUMsSUFBSSxHQUFHLEVBQVg7QUFDQSxNQUFJQyxPQUFPLEdBQUcsRUFBZDs7QUFDQSxNQUFJO0FBQ0YsUUFBSUosY0FBYyxDQUFDSyxTQUFmLElBQTRCQyxTQUFoQyxFQUEyQztBQUN6Q0gsTUFBQUEsSUFBSSxDQUFDSSxZQUFMLEdBQW9CLEVBQXBCO0FBQ0FKLE1BQUFBLElBQUksQ0FBQ0ksWUFBTCxDQUFrQkMsSUFBbEIsQ0FBdUIsc0hBQXZCO0FBQ0EsVUFBSUMsQ0FBQyxHQUFHLEVBQVI7QUFDQUEsTUFBQUEsQ0FBQyxDQUFDTixJQUFGLEdBQVNBLElBQVQ7QUFDQSxhQUFPTSxDQUFQO0FBQ0Q7O0FBQ0QsUUFBSUosU0FBUyxHQUFHTCxjQUFjLENBQUNLLFNBQS9CO0FBQ0EsUUFBSUssU0FBUyxHQUFHVixjQUFjLENBQUNVLFNBQS9CO0FBQ0EsUUFBSUMsT0FBTyxHQUFHWCxjQUFjLENBQUNXLE9BQTdCOztBQUVBLFVBQU1DLGVBQWUsR0FBR1YsT0FBTyxDQUFDLGNBQUQsQ0FB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QUFDNUIsU0FBTztBQUNMZCxJQUFBQSxTQUFTLEVBQUUsT0FETjtBQUVMd0YsSUFBQUEsT0FBTyxFQUFFLFFBRko7QUFHTEMsSUFBQUEsS0FBSyxFQUFFLGdCQUhGO0FBSUx2QixJQUFBQSxJQUFJLEVBQUUsS0FKRDtBQUtMbkMsSUFBQUEsTUFBTSxFQUFFLElBTEg7QUFNTHFELElBQUFBLElBQUksRUFBRSxJQU5EO0FBT0xHLElBQUFBLFFBQVEsRUFBRSxFQVBMO0FBU0xaLElBQUFBLE9BQU8sRUFBRSxTQVRKO0FBVUx2RCxJQUFBQSxXQUFXLEVBQUUsYUFWUjtBQVdMZixJQUFBQSxTQUFTLEVBQUUsSUFYTjtBQVlMNEUsSUFBQUEsT0FBTyxFQUFFLEtBWko7QUFhTFQsSUFBQUEsS0FBSyxFQUFFLEtBYkY7QUFjTGxFLElBQUFBLE9BQU8sRUFBRTtBQWRKLEdBQVA7QUFnQkQiLCJzb3VyY2VzQ29udGVudCI6WyIvLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfY29uc3RydWN0b3IoaW5pdGlhbE9wdGlvbnMpIHtcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gIHZhciB2YXJzID0ge31cbiAgdmFyIG9wdGlvbnMgPSB7fVxuICB0cnkge1xuICAgIGlmIChpbml0aWFsT3B0aW9ucy5mcmFtZXdvcmsgPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXJzLnBsdWdpbkVycm9ycyA9IFtdXG4gICAgICB2YXJzLnBsdWdpbkVycm9ycy5wdXNoKCd3ZWJwYWNrIGNvbmZpZzogZnJhbWV3b3JrIHBhcmFtZXRlciBvbiBleHQtd2VicGFjay1wbHVnaW4gaXMgbm90IGRlZmluZWQgLSB2YWx1ZXM6IHJlYWN0LCBhbmd1bGFyLCBleHRqcywgY29tcG9uZW50cycpXG4gICAgICB2YXIgbyA9IHt9XG4gICAgICBvLnZhcnMgPSB2YXJzXG4gICAgICByZXR1cm4gb1xuICAgIH1cbiAgICB2YXIgZnJhbWV3b3JrID0gaW5pdGlhbE9wdGlvbnMuZnJhbWV3b3JrXG4gICAgdmFyIHRyZWVzaGFrZSA9IGluaXRpYWxPcHRpb25zLnRyZWVzaGFrZVxuICAgIHZhciB2ZXJib3NlID0gaW5pdGlhbE9wdGlvbnMudmVyYm9zZVxuXG4gICAgY29uc3QgdmFsaWRhdGVPcHRpb25zID0gcmVxdWlyZSgnc2NoZW1hLXV0aWxzJylcbiAgICB2YWxpZGF0ZU9wdGlvbnMoX2dldFZhbGlkYXRlT3B0aW9ucygpLCBpbml0aWFsT3B0aW9ucywgJycpXG5cbiAgICBjb25zdCByYyA9IChmcy5leGlzdHNTeW5jKGAuZXh0LSR7ZnJhbWV3b3JrfXJjYCkgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoYC5leHQtJHtmcmFtZXdvcmt9cmNgLCAndXRmLTgnKSkgfHwge30pXG4gICAgb3B0aW9ucyA9IHsgLi4uX2dldERlZmF1bHRPcHRpb25zKCksIC4uLmluaXRpYWxPcHRpb25zLCAuLi5yYyB9XG5cbiAgICB2YXJzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2dldERlZmF1bHRWYXJzKClcbiAgICB2YXJzLnBsdWdpbk5hbWUgPSAnZXh0LXdlYnBhY2stcGx1Z2luJ1xuICAgIHZhcnMuYXBwID0gX2dldEFwcCgpXG4gICAgdmFyIHBsdWdpbk5hbWUgPSB2YXJzLnBsdWdpbk5hbWVcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcblxuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9jb25zdHJ1Y3RvcicpXG4gICAgbG9ndih2ZXJib3NlLCBgcGx1Z2luTmFtZSAtICR7cGx1Z2luTmFtZX1gKVxuICAgIGxvZ3YodmVyYm9zZSwgYGFwcCAtICR7YXBwfWApXG5cbiAgICBpZiAob3B0aW9ucy5lbnZpcm9ubWVudCA9PSAncHJvZHVjdGlvbicpIHt2YXJzLnByb2R1Y3Rpb24gPSB0cnVlfVxuICAgIGVsc2Uge3ZhcnMucHJvZHVjdGlvbiA9IGZhbHNlfVxuICAgIFxuICAgIC8vbG9ndih2ZXJib3NlLCBgb3B0aW9uczpgKTtpZiAodmVyYm9zZSA9PSAneWVzJykge2NvbnNvbGUuZGlyKG9wdGlvbnMpfVxuICAgIC8vbG9ndih2ZXJib3NlLCBgdmFyczpgKTtpZiAodmVyYm9zZSA9PSAneWVzJykge2NvbnNvbGUuZGlyKHZhcnMpfVxuICAgIFxuICAgIGxvZyhhcHAsIF9nZXRWZXJzaW9ucyhwbHVnaW5OYW1lLCBmcmFtZXdvcmspKVxuXG4gICAgaWYgKGZyYW1ld29yayA9PSAncmVhY3QnKSB7IC8vIHx8IGZyYW1ld29yayA9PSAnZXh0anMnXG4gICAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUpIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJ1xuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgUHJvZHVjdGlvbiBCdWlsZCcpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJ1xuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgRGV2ZWxvcG1lbnQgQnVpbGQnKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgaWYgKHRyZWVzaGFrZSA9PSAneWVzJykge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDInXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBQcm9kdWN0aW9uIEJ1aWxkIC0gJyArIHZhcnMuYnVpbGRzdGVwKVxuICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fdG9Qcm9kKHZhcnMsIG9wdGlvbnMpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMiBvZiAyJ1xuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgUHJvZHVjdGlvbiBCdWlsZCAtICcgKyB2YXJzLmJ1aWxkc3RlcClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICBsb2coYXBwLCAnU3RhcnRpbmcgRGV2ZWxvcG1lbnQgQnVpbGQnKVxuICAgIH1cbiAgICBsb2d2KHZlcmJvc2UsICdCdWlsZGluZyBmb3IgJyArIG9wdGlvbnMuZW52aXJvbm1lbnQgKyAnLCAnICsgJ1RyZWVzaGFrZSBpcyAnICsgb3B0aW9ucy50cmVlc2hha2UpXG5cbiAgICB2YXIgbyA9IHt9XG4gICAgby52YXJzID0gdmFyc1xuICAgIG8ub3B0aW9ucyA9IG9wdGlvbnNcbiAgICByZXR1cm4gb1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfdGhpc0NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX3RoaXNDb21waWxhdGlvbicpXG4gICAgbG9ndih2ZXJib3NlLCBgb3B0aW9ucy5zY3JpcHQ6ICR7b3B0aW9ucy5zY3JpcHQgfWApXG4gICAgbG9ndih2ZXJib3NlLCBgYnVpbGRzdGVwOiAke3ZhcnMuYnVpbGRzdGVwfWApXG5cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScgfHwgdmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMicpIHtcbiAgICAgIGlmIChvcHRpb25zLnNjcmlwdCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2NyaXB0ICE9ICcnKSB7XG4gICAgICAgICAgICBsb2coYXBwLCBgU3RhcnRlZCBydW5uaW5nICR7b3B0aW9ucy5zY3JpcHR9YClcbiAgICAgICAgICAgIHJ1blNjcmlwdChvcHRpb25zLnNjcmlwdCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgIGxvZyhhcHAsIGBGaW5pc2hlZCBydW5uaW5nICR7b3B0aW9ucy5zY3JpcHR9YClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBsb2d2KHZlcmJvc2UsIGBvcHRpb25zLnNjcmlwdDogJHtvcHRpb25zLnNjcmlwdCB9YClcbiAgICAgICAgbG9ndih2ZXJib3NlLCBgYnVpbGRzdGVwOiAke3ZhcnMuYnVpbGRzdGVwfWApXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICBsb2d2KHZlcmJvc2UsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX3RoaXNDb21waWxhdGlvbjogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2NvbXBpbGF0aW9uJylcbiAgICBcbiAgICBpZiAoZnJhbWV3b3JrID09ICdleHRqcycpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdXG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgICBleHRDb21wb25lbnRzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucylcbiAgICB9XG4gICAgY29tcGlsYXRpb24uaG9va3Muc3VjY2VlZE1vZHVsZS50YXAoYGV4dC1zdWNjZWVkLW1vZHVsZWAsIG1vZHVsZSA9PiB7XG4gICAgICBpZiAobW9kdWxlLnJlc291cmNlICYmICFtb2R1bGUucmVzb3VyY2UubWF0Y2goL25vZGVfbW9kdWxlcy8pKSB7XG4gICAgICAgIGlmKG1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvXFwuaHRtbCQvKSAhPSBudWxsKSB7XG4gICAgICAgICAgaWYobW9kdWxlLl9zb3VyY2UuX3ZhbHVlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2RvY3R5cGUgaHRtbCcpID09IGZhbHNlKSB7XG4gICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4gICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgICAgICAgICAgLi4ucmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMicpIHtcbiAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLmZpbmlzaE1vZHVsZXMudGFwKGBleHQtZmluaXNoLW1vZHVsZXNgLCBtb2R1bGVzID0+IHtcbiAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIodmFycywgb3B0aW9ucylcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMiBvZiAyJykge1xuICAgICAgY29tcGlsYXRpb24uaG9va3MuaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbi50YXAoYGV4dC1odG1sLWdlbmVyYXRpb25gLChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAgICAgdmFyIGpzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuanMnKVxuICAgICAgICB2YXIgY3NzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuY3NzJylcbiAgICAgICAgZGF0YS5hc3NldHMuanMudW5zaGlmdChqc1BhdGgpXG4gICAgICAgIGRhdGEuYXNzZXRzLmNzcy51bnNoaWZ0KGNzc1BhdGgpXG4gICAgICAgIGxvZyhhcHAsIGBBZGRpbmcgJHtqc1BhdGh9IGFuZCAke2Nzc1BhdGh9IHRvIGluZGV4Lmh0bWxgKVxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIGxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19jb21waWxhdGlvbjogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2VtaXQoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB0cnkge1xuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBlbWl0ID0gb3B0aW9ucy5lbWl0XG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfZW1pdCcpXG4gICAgaWYgKGVtaXQgPT0gJ3llcycpIHtcbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgICAgICBsZXQgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vdXRwdXRQYXRoLHZhcnMuZXh0UGF0aClcbiAgICAgICAgaWYgKGNvbXBpbGVyLm91dHB1dFBhdGggPT09ICcvJyAmJiBjb21waWxlci5vcHRpb25zLmRldlNlcnZlcikge1xuICAgICAgICAgIG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIuY29udGVudEJhc2UsIG91dHB1dFBhdGgpXG4gICAgICAgIH1cbiAgICAgICAgbG9ndih2ZXJib3NlLCdvdXRwdXRQYXRoOiAnICsgb3V0cHV0UGF0aClcbiAgICAgICAgbG9ndih2ZXJib3NlLCdmcmFtZXdvcms6ICcgKyBmcmFtZXdvcmspXG4gICAgICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgICAgIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29tbWFuZCA9ICcnXG4gICAgICAgIGlmIChvcHRpb25zLndhdGNoID09ICd5ZXMnICYmIHZhcnMucHJvZHVjdGlvbiA9PSBmYWxzZSkge2NvbW1hbmQgPSAnd2F0Y2gnfVxuICAgICAgICBlbHNlIHtjb21tYW5kID0gJ2J1aWxkJ31cbiAgICAgICAgaWYgKHZhcnMucmVidWlsZCA9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHBhcm1zID0gW11cbiAgICAgICAgICBpZiAob3B0aW9ucy5wcm9maWxlID09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnByb2ZpbGUgPT0gJycgfHwgb3B0aW9ucy5wcm9maWxlID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMuZW52aXJvbm1lbnRdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhcnMud2F0Y2hTdGFydGVkID09IGZhbHNlKSB7XG4gICAgICAgICAgICBhd2FpdCBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIG9wdGlvbnMpXG4gICAgICAgICAgICB2YXJzLndhdGNoU3RhcnRlZCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwnTk9UIHJ1bm5pbmcgZW1pdCcpXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KHZlcmJvc2UsJ2VtaXQgaXMgbm8nKVxuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgbG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2VtaXQ6ICcgKyBlKVxuICAgIGNhbGxiYWNrKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfYWZ0ZXJDb21waWxlKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZScpXG4gICAgaWYgKGZyYW1ld29yayA9PSAnZXh0anMnKSB7XG4gICAgICByZXF1aXJlKGAuL2V4dGpzVXRpbGApLl9hZnRlckNvbXBpbGUoY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZSBub3QgcnVuJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfYWZ0ZXJDb21waWxlOiAnICsgZSlcbiAgICBsb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2RvbmUodmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfZG9uZScpXG4gICAgLy9tamcgcmVmYWN0b3JcbiAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gJ25vJyAmJiBmcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICByZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLl90b0Rldih2YXJzLCBvcHRpb25zKVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgaWYob3B0aW9ucy5icm93c2VyID09ICd5ZXMnICYmIG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKSB7XG4gICAgICAgIGlmICh2YXJzLmJyb3dzZXJDb3VudCA9PSAwKSB7XG4gICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OicgKyBvcHRpb25zLnBvcnRcbiAgICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBPcGVuaW5nIGJyb3dzZXIgYXQgJHt1cmx9YClcbiAgICAgICAgICB2YXJzLmJyb3dzZXJDb3VudCsrXG4gICAgICAgICAgY29uc3Qgb3BuID0gcmVxdWlyZSgnb3BuJylcbiAgICAgICAgICBvcG4odXJsKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgLy9jb21waWxhdGlvbi5lcnJvcnMucHVzaCgnc2hvdyBicm93c2VyIHdpbmRvdyAtIGV4dC1kb25lOiAnICsgZSlcbiAgICB9XG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnKSB7XG4gICAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUpIHtcbiAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIFByb2R1Y3Rpb24gQnVpbGRgKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBEZXZlbG9wbWVudCBCdWlsZGApXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMiBvZiAyJykge1xuICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIFByb2R1Y3Rpb24gQnVpbGRgKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0LCBjb21waWxhdGlvbikge1xuICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIHBhY2thZ2VzID0gb3B0aW9ucy5wYWNrYWdlc1xuICAgIHZhciB0b29sa2l0ID0gb3B0aW9ucy50b29sa2l0XG4gICAgdmFyIHRoZW1lID0gb3B0aW9ucy50aGVtZVxuICAgIGxvZ3YodmVyYm9zZSwnRlVOQ1RJT04gX3ByZXBhcmVGb3JCdWlsZCcpXG4gICAgY29uc3QgcmltcmFmID0gcmVxdWlyZSgncmltcmFmJylcbiAgICBjb25zdCBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKVxuICAgIGNvbnN0IGZzeCA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgdGhlbWUgPSB0aGVtZSB8fCAodG9vbGtpdCA9PT0gJ2NsYXNzaWMnID8gJ3RoZW1lLXRyaXRvbicgOiAndGhlbWUtbWF0ZXJpYWwnKVxuICAgIGxvZ3YodmVyYm9zZSwnZmlyc3RUaW1lOiAnICsgdmFycy5maXJzdFRpbWUpXG4gICAgaWYgKHZhcnMuZmlyc3RUaW1lKSB7XG4gICAgICByaW1yYWYuc3luYyhvdXRwdXQpXG4gICAgICBta2RpcnAuc3luYyhvdXRwdXQpXG4gICAgICBjb25zdCBidWlsZFhNTCA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuYnVpbGRYTUxcbiAgICAgIGNvbnN0IGNyZWF0ZUFwcEpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUFwcEpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZVdvcmtzcGFjZUpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZVdvcmtzcGFjZUpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZUpTRE9NRW52aXJvbm1lbnQgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUpTRE9NRW52aXJvbm1lbnRcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2J1aWxkLnhtbCcpLCBidWlsZFhNTCh2YXJzLnByb2R1Y3Rpb24sIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2FwcC5qc29uJyksIGNyZWF0ZUFwcEpzb24odGhlbWUsIHBhY2thZ2VzLCB0b29sa2l0LCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdqc2RvbS1lbnZpcm9ubWVudC5qcycpLCBjcmVhdGVKU0RPTUVudmlyb25tZW50KG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ3dvcmtzcGFjZS5qc29uJyksIGNyZWF0ZVdvcmtzcGFjZUpzb24ob3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgdmFyIGZyYW1ld29yayA9IHZhcnMuZnJhbWV3b3JrO1xuICAgICAgLy9iZWNhdXNlIG9mIGEgcHJvYmxlbSB3aXRoIGNvbG9ycGlja2VyXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3V4L2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAndXgnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgKHV4KSAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vcGFja2FnZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3BhY2thZ2VzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdvdmVycmlkZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCdyZXNvdXJjZXMvJykpKSB7XG4gICAgICAgIHZhciBmcm9tUmVzb3VyY2VzID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdyZXNvdXJjZXMvJylcbiAgICAgICAgdmFyIHRvUmVzb3VyY2VzID0gcGF0aC5qb2luKG91dHB1dCwgJy4uL3Jlc291cmNlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUmVzb3VyY2VzLCB0b1Jlc291cmNlcylcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21SZXNvdXJjZXMucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9SZXNvdXJjZXMucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgfVxuICAgIHZhcnMuZmlyc3RUaW1lID0gZmFsc2VcbiAgICB2YXIganMgPSAnJ1xuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24pIHtcbiAgICAgIGpzID0gdmFycy5kZXBzLmpvaW4oJztcXG4nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBqcyA9ICdFeHQucmVxdWlyZShcIkV4dC4qXCIpJ1xuICAgIH1cbiAgICBpZiAodmFycy5tYW5pZmVzdCA9PT0gbnVsbCB8fCBqcyAhPT0gdmFycy5tYW5pZmVzdCkge1xuICAgICAgdmFycy5tYW5pZmVzdCA9IGpzXG4gICAgICBjb25zdCBtYW5pZmVzdCA9IHBhdGguam9pbihvdXRwdXQsICdtYW5pZmVzdC5qcycpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKG1hbmlmZXN0LCBqcywgJ3V0ZjgnKVxuICAgICAgdmFycy5yZWJ1aWxkID0gdHJ1ZVxuICAgICAgdmFyIGJ1bmRsZURpciA9IG91dHB1dC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKVxuICAgICAgaWYgKGJ1bmRsZURpci50cmltKCkgPT0gJycpIHtidW5kbGVEaXIgPSAnLi8nfVxuICAgICAgbG9nKGFwcCwgJ0J1aWxkaW5nIEV4dCBidW5kbGUgYXQ6ICcgKyBidW5kbGVEaXIpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5yZWJ1aWxkID0gZmFsc2VcbiAgICAgIGxvZyhhcHAsICdFeHQgcmVidWlsZCBOT1QgbmVlZGVkJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19wcmVwYXJlRm9yQnVpbGQ6ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfYnVpbGRFeHRCdW5kbGUnKVxuICAgIGxldCBzZW5jaGE7IHRyeSB7IHNlbmNoYSA9IHJlcXVpcmUoJ0BzZW5jaGEvY21kJykgfSBjYXRjaCAoZSkgeyBzZW5jaGEgPSAnc2VuY2hhJyB9XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoc2VuY2hhKSkge1xuICAgICAgbG9ndih2ZXJib3NlLCdzZW5jaGEgZm9sZGVyIGV4aXN0cycpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndih2ZXJib3NlLCdzZW5jaGEgZm9sZGVyIERPRVMgTk9UIGV4aXN0JylcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IG9uQnVpbGREb25lID0gKCkgPT4ge1xuICAgICAgICBsb2d2KHZlcmJvc2UsJ29uQnVpbGREb25lJylcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9XG4gICAgICB2YXIgb3B0cyA9IHsgY3dkOiBvdXRwdXRQYXRoLCBzaWxlbnQ6IHRydWUsIHN0ZGlvOiAncGlwZScsIGVuY29kaW5nOiAndXRmLTgnfVxuICAgICAgX2V4ZWN1dGVBc3luYyhhcHAsIHNlbmNoYSwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCBvcHRpb25zKS50aGVuIChcbiAgICAgICAgZnVuY3Rpb24oKSB7IG9uQnVpbGREb25lKCkgfSwgXG4gICAgICAgIGZ1bmN0aW9uKHJlYXNvbikgeyByZWplY3QocmVhc29uKSB9XG4gICAgICApXG4gICAgfSlcbiAgfVxuICBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coJ2UnKVxuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19idWlsZEV4dEJ1bmRsZTogJyArIGUpXG4gICAgY2FsbGJhY2soKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIF9leGVjdXRlQXN5bmMgKGFwcCwgY29tbWFuZCwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICAvL2NvbnN0IERFRkFVTFRfU1VCU1RSUyA9IFsnW0lORl0gTG9hZGluZycsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFNlcnZlclwiLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgICBjb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbXCJbSU5GXSB4U2VydmVyXCIsICdbSU5GXSBMb2FkaW5nJywgJ1tJTkZdIEFwcGVuZCcsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tJTkZdIFByb2Nlc3NpbmcgQnVpbGQnLCAnW0xPR10gRmFzaGlvbiBidWlsZCBjb21wbGV0ZScsICdbRVJSXScsICdbV1JOXScsIFwiW0lORl0gV3JpdGluZ1wiLCBcIltJTkZdIExvYWRpbmcgQnVpbGRcIiwgXCJbSU5GXSBXYWl0aW5nXCIsIFwiW0xPR10gRmFzaGlvbiB3YWl0aW5nXCJdO1xuICAgIHZhciBzdWJzdHJpbmdzID0gREVGQVVMVF9TVUJTVFJTIFxuICAgIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbiAgICBjb25zdCBjcm9zc1NwYXduID0gcmVxdWlyZSgnY3Jvc3Mtc3Bhd24nKVxuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9leGVjdXRlQXN5bmMnKVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxvZ3YodmVyYm9zZSxgY29tbWFuZCAtICR7Y29tbWFuZH1gKVxuICAgICAgbG9ndih2ZXJib3NlLCBgcGFybXMgLSAke3Bhcm1zfWApXG4gICAgICBsb2d2KHZlcmJvc2UsIGBvcHRzIC0gJHtKU09OLnN0cmluZ2lmeShvcHRzKX1gKVxuICAgICAgbGV0IGNoaWxkID0gY3Jvc3NTcGF3bihjb21tYW5kLCBwYXJtcywgb3B0cylcbiAgICAgIGNoaWxkLm9uKCdjbG9zZScsIChjb2RlLCBzaWduYWwpID0+IHtcbiAgICAgICAgbG9ndih2ZXJib3NlLCBgb24gY2xvc2U6IGAgKyBjb2RlKSBcbiAgICAgICAgaWYoY29kZSA9PT0gMCkgeyByZXNvbHZlKDApIH1cbiAgICAgICAgZWxzZSB7IGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCBuZXcgRXJyb3IoY29kZSkgKTsgcmVzb2x2ZSgwKSB9XG4gICAgICB9KVxuICAgICAgY2hpbGQub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7IFxuICAgICAgICBsb2d2KHZlcmJvc2UsIGBvbiBlcnJvcmApIFxuICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChlcnJvcilcbiAgICAgICAgcmVzb2x2ZSgwKVxuICAgICAgfSlcbiAgICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICBsb2d2KHZlcmJvc2UsIGAke3N0cn1gKVxuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkubWF0Y2goL0Zhc2hpb24gd2FpdGluZyBmb3IgY2hhbmdlc1xcLlxcLlxcLi8pKSB7XG5cbiAgICAgICAgICAvLyBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICAgICAgLy8gdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSsnL3NyYy9pbmRleC5qcyc7XG4gICAgICAgICAgLy8gdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuICAgICAgICAgIC8vIGZzLndyaXRlRmlsZVN5bmMoZmlsZW5hbWUsIGRhdGEgKyAnICcsICd1dGY4JylcbiAgICAgICAgICAvLyBsb2d2KHZlcmJvc2UsIGB0b3VjaGluZyAke2ZpbGVuYW1lfWApXG5cbiAgICAgICAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICAgICAgdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSArICcvc3JjL2luZGV4LmpzJztcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgZGF0YSArICcgJywgJ3V0ZjgnKTtcbiAgICAgICAgICAgIGxvZyhhcHAsIGB0b3VjaGluZyAke2ZpbGVuYW1lfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgICBsb2coYXBwLCBgTk9UIHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZSgwKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmIChzdWJzdHJpbmdzLnNvbWUoZnVuY3Rpb24odikgeyByZXR1cm4gZGF0YS5pbmRleE9mKHYpID49IDA7IH0pKSB7IFxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbSU5GXVwiLCBcIlwiKVxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbTE9HXVwiLCBcIlwiKVxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpLnRyaW0oKVxuICAgICAgICAgICAgaWYgKHN0ci5pbmNsdWRlcyhcIltFUlJdXCIpKSB7XG4gICAgICAgICAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGFwcCArIHN0ci5yZXBsYWNlKC9eXFxbRVJSXFxdIC9naSwgJycpKTtcbiAgICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbRVJSXVwiLCBgJHtjaGFsay5yZWQoXCJbRVJSXVwiKX1gKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9nKGFwcCwgc3RyKSBcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBjaGlsZC5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICBsb2d2KG9wdGlvbnMsIGBlcnJvciBvbiBjbG9zZTogYCArIGRhdGEpIFxuICAgICAgICB2YXIgc3RyID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UoL1xccj9cXG58XFxyL2csIFwiIFwiKS50cmltKClcbiAgICAgICAgdmFyIHN0ckphdmFPcHRzID0gXCJQaWNrZWQgdXAgX0pBVkFfT1BUSU9OU1wiO1xuICAgICAgICB2YXIgaW5jbHVkZXMgPSBzdHIuaW5jbHVkZXMoc3RySmF2YU9wdHMpXG4gICAgICAgIGlmICghaW5jbHVkZXMpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJHthcHB9ICR7Y2hhbGsucmVkKFwiW0VSUl1cIil9ICR7c3RyfWApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuICBjYXRjaChlKSB7XG4gICAgbG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19leGVjdXRlQXN5bmM6ICcgKyBlKVxuICAgIGNhbGxiYWNrKClcbiAgfSBcbn1cblxuLy8qKioqKioqKioqXG5mdW5jdGlvbiBydW5TY3JpcHQoc2NyaXB0UGF0aCwgY2FsbGJhY2spIHtcbiAgdmFyIGNoaWxkUHJvY2VzcyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcbiAgLy8ga2VlcCB0cmFjayBvZiB3aGV0aGVyIGNhbGxiYWNrIGhhcyBiZWVuIGludm9rZWQgdG8gcHJldmVudCBtdWx0aXBsZSBpbnZvY2F0aW9uc1xuICB2YXIgaW52b2tlZCA9IGZhbHNlO1xuICB2YXIgcHJvY2VzcyA9IGNoaWxkUHJvY2Vzcy5mb3JrKHNjcmlwdFBhdGgpO1xuICAvLyBsaXN0ZW4gZm9yIGVycm9ycyBhcyB0aGV5IG1heSBwcmV2ZW50IHRoZSBleGl0IGV2ZW50IGZyb20gZmlyaW5nXG4gIHByb2Nlc3Mub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfSk7XG4gIC8vIGV4ZWN1dGUgdGhlIGNhbGxiYWNrIG9uY2UgdGhlIHByb2Nlc3MgaGFzIGZpbmlzaGVkIHJ1bm5pbmdcbiAgcHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uIChjb2RlKSB7XG4gICAgaWYgKGludm9rZWQpIHJldHVybjtcbiAgICBpbnZva2VkID0gdHJ1ZTtcbiAgICB2YXIgZXJyID0gY29kZSA9PT0gMCA/IG51bGwgOiBuZXcgRXJyb3IoJ2V4aXQgY29kZSAnICsgY29kZSk7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfSk7XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF90b1h0eXBlKHN0cikge1xuICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnLScpXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRBcHAoKSB7XG4gIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbiAgdmFyIHByZWZpeCA9IGBgXG4gIGNvbnN0IHBsYXRmb3JtID0gcmVxdWlyZSgnb3MnKS5wbGF0Zm9ybSgpXG4gIGlmIChwbGF0Zm9ybSA9PSAnZGFyd2luJykgeyBwcmVmaXggPSBg4oS5IO+9omV4dO+9ozpgIH1cbiAgZWxzZSB7IHByZWZpeCA9IGBpIFtleHRdOmAgfVxuICByZXR1cm4gYCR7Y2hhbGsuZ3JlZW4ocHJlZml4KX0gYFxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0VmVyc2lvbnMocGx1Z2luTmFtZSwgZnJhbWV3b3JrTmFtZSkge1xuICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICB2YXIgdiA9IHt9XG4gIHZhciBwbHVnaW5QYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhJywgcGx1Z2luTmFtZSlcbiAgdmFyIHBsdWdpblBrZyA9IChmcy5leGlzdHNTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwbHVnaW5QYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5wbHVnaW5WZXJzaW9uID0gcGx1Z2luUGtnLnZlcnNpb25cbiAgdi5fcmVzb2x2ZWQgPSBwbHVnaW5Qa2cuX3Jlc29sdmVkXG4gIGlmICh2Ll9yZXNvbHZlZCA9PSB1bmRlZmluZWQpIHtcbiAgICB2LmVkaXRpb24gPSBgQ29tbWVyY2lhbGBcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAoLTEgPT0gdi5fcmVzb2x2ZWQuaW5kZXhPZignY29tbXVuaXR5JykpIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tdW5pdHlgXG4gICAgfVxuICB9XG4gIHZhciB3ZWJwYWNrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvd2VicGFjaycpXG4gIHZhciB3ZWJwYWNrUGtnID0gKGZzLmV4aXN0c1N5bmMod2VicGFja1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYud2VicGFja1ZlcnNpb24gPSB3ZWJwYWNrUGtnLnZlcnNpb25cbiAgdmFyIGV4dFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0JylcbiAgdmFyIGV4dFBrZyA9IChmcy5leGlzdHNTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhleHRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5leHRWZXJzaW9uID0gZXh0UGtnLnNlbmNoYS52ZXJzaW9uXG4gIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gIHZhciBjbWRQa2cgPSAoZnMuZXhpc3RzU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgaWYgKHYuY21kVmVyc2lvbiA9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgY21kUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLGBub2RlX21vZHVsZXMvQHNlbmNoYS8ke3BsdWdpbk5hbWV9L25vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gICAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXG4gIH1cbiAgdmFyIGZyYW1ld29ya0luZm8gPSAnJ1xuICAgaWYgKGZyYW1ld29ya05hbWUgIT0gdW5kZWZpbmVkICYmIGZyYW1ld29ya05hbWUgIT0gJ2V4dGpzJykge1xuICAgIHZhciBmcmFtZXdvcmtQYXRoID0gJydcbiAgICBpZiAoZnJhbWV3b3JrTmFtZSA9PSAncmVhY3QnKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9yZWFjdCcpXG4gICAgfVxuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdhbmd1bGFyJykge1xuICAgICAgZnJhbWV3b3JrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQGFuZ3VsYXIvY29yZScpXG4gICAgfVxuICAgIHZhciBmcmFtZXdvcmtQa2cgPSAoZnMuZXhpc3RzU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZnJhbWV3b3JrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gICAgdi5mcmFtZXdvcmtWZXJzaW9uID0gZnJhbWV3b3JrUGtnLnZlcnNpb25cbiAgICBmcmFtZXdvcmtJbmZvID0gJywgJyArIGZyYW1ld29ya05hbWUgKyAnIHYnICsgdi5mcmFtZXdvcmtWZXJzaW9uXG4gIH1cbiAgcmV0dXJuICdleHQtd2VicGFjay1wbHVnaW4gdicgKyB2LnBsdWdpblZlcnNpb24gKyAnLCBFeHQgSlMgdicgKyB2LmV4dFZlcnNpb24gKyAnICcgKyB2LmVkaXRpb24gKyAnIEVkaXRpb24sIFNlbmNoYSBDbWQgdicgKyB2LmNtZFZlcnNpb24gKyAnLCB3ZWJwYWNrIHYnICsgdi53ZWJwYWNrVmVyc2lvbiArIGZyYW1ld29ya0luZm9cbiB9XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhhcHAsbWVzc2FnZSkge1xuICB2YXIgcyA9IGFwcCArIG1lc3NhZ2UgXG4gIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gIHRyeSB7cHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKCl9Y2F0Y2goZSkge31cbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocyk7cHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2goYXBwLG1lc3NhZ2UpIHtcbiAgdmFyIGggPSBmYWxzZVxuICB2YXIgcyA9IGFwcCArIG1lc3NhZ2UgXG4gIGlmIChoID09IHRydWUpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9ndih2ZXJib3NlLCBzKSB7XG4gIGlmICh2ZXJib3NlID09ICd5ZXMnKSB7XG4gICAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgICB0cnkge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKClcbiAgICB9XG4gICAgY2F0Y2goZSkge31cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShgLXZlcmJvc2U6ICR7c31gKVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxuICB9XG59XG5cbmZ1bmN0aW9uIF9nZXRWYWxpZGF0ZU9wdGlvbnMoKSB7XG4gIHJldHVybiB7XG4gICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgIFwiZnJhbWV3b3JrXCI6ICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcInRvb2xraXRcIjogICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJ0aGVtZVwiOiAgICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwiZW1pdFwiOiAgICAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcInNjcmlwdFwiOiAgICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJwb3J0XCI6ICAgICAgICB7XCJ0eXBlXCI6IFsgXCJpbnRlZ2VyXCIgXX0sXG4gICAgICBcInBhY2thZ2VzXCI6ICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiLCBcImFycmF5XCIgXX0sXG5cbiAgICAgIFwicHJvZmlsZVwiOiAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcImVudmlyb25tZW50XCI6IHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJ0cmVlc2hha2VcIjogICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwiYnJvd3NlclwiOiAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcIndhdGNoXCI6ICAgICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJ2ZXJib3NlXCI6ICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfVxuICAgIH0sXG4gICAgXCJhZGRpdGlvbmFsUHJvcGVydGllc1wiOiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIF9nZXREZWZhdWx0T3B0aW9ucygpIHtcbiAgcmV0dXJuIHtcbiAgICBmcmFtZXdvcms6ICdleHRqcycsXG4gICAgdG9vbGtpdDogJ21vZGVybicsXG4gICAgdGhlbWU6ICd0aGVtZS1tYXRlcmlhbCcsXG4gICAgZW1pdDogJ3llcycsXG4gICAgc2NyaXB0OiBudWxsLFxuICAgIHBvcnQ6IDE5NjIsXG4gICAgcGFja2FnZXM6IFtdLFxuXG4gICAgcHJvZmlsZTogJ2Rlc2t0b3AnLCBcbiAgICBlbnZpcm9ubWVudDogJ2RldmVsb3BtZW50JywgXG4gICAgdHJlZXNoYWtlOiAnbm8nLFxuICAgIGJyb3dzZXI6ICd5ZXMnLFxuICAgIHdhdGNoOiAneWVzJyxcbiAgICB2ZXJib3NlOiAnbm8nXG4gIH1cbn1cblxuXG4iXX0=