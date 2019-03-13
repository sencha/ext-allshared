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
      logv(verbose, 'FUNCTION _compilation end (extjs)');
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
            _context.next = 37;
            break;
          }

          if (!(vars.buildstep == '1 of 1' || vars.buildstep == '1 of 2')) {
            _context.next = 33;
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

          console.log('after fr');
          command = '';
          console.log(options.watch);

          if (options.watch == 'yes' && vars.production == false) {
            command = 'watch';
          } else {
            command = 'build';
          }

          console.log(command);
          console.log(vars.rebuild);

          if (!(vars.rebuild == true)) {
            _context.next = 30;
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
            _context.next = 27;
            break;
          }

          _context.next = 26;
          return _buildExtBundle(app, compilation, outputPath, parms, options);

        case 26:
          vars.watchStarted = true;

        case 27:
          callback();
          _context.next = 31;
          break;

        case 30:
          callback();

        case 31:
          _context.next = 35;
          break;

        case 33:
          logv(verbose, 'NOT running emit');
          callback();

        case 35:
          _context.next = 39;
          break;

        case 37:
          logv(verbose, 'emit is no');
          callback();

        case 39:
          _context.next = 46;
          break;

        case 41:
          _context.prev = 41;
          _context.t0 = _context["catch"](0);
          logv(options.verbose, _context.t0);
          compilation.errors.push('_emit: ' + _context.t0);
          callback();

        case 46:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 41]]);
  }));
  return _emit2.apply(this, arguments);
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsImluaXRpYWxPcHRpb25zIiwiZnMiLCJyZXF1aXJlIiwidmFycyIsIm9wdGlvbnMiLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwibyIsInRyZWVzaGFrZSIsInZlcmJvc2UiLCJ2YWxpZGF0ZU9wdGlvbnMiLCJfZ2V0VmFsaWRhdGVPcHRpb25zIiwicmMiLCJleGlzdHNTeW5jIiwiSlNPTiIsInBhcnNlIiwicmVhZEZpbGVTeW5jIiwiX2dldERlZmF1bHRPcHRpb25zIiwiX2dldERlZmF1bHRWYXJzIiwicGx1Z2luTmFtZSIsImFwcCIsIl9nZXRBcHAiLCJsb2d2IiwiZW52aXJvbm1lbnQiLCJwcm9kdWN0aW9uIiwibG9nIiwiX2dldFZlcnNpb25zIiwiYnVpbGRzdGVwIiwiX3RvUHJvZCIsImUiLCJjb25zb2xlIiwiX3RoaXNDb21waWxhdGlvbiIsImNvbXBpbGVyIiwiY29tcGlsYXRpb24iLCJzY3JpcHQiLCJydW5TY3JpcHQiLCJlcnIiLCJlcnJvcnMiLCJfY29tcGlsYXRpb24iLCJleHRDb21wb25lbnRzIiwiX2dldEFsbENvbXBvbmVudHMiLCJob29rcyIsInN1Y2NlZWRNb2R1bGUiLCJ0YXAiLCJtb2R1bGUiLCJyZXNvdXJjZSIsIm1hdGNoIiwiX3NvdXJjZSIsIl92YWx1ZSIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJkZXBzIiwiX2V4dHJhY3RGcm9tU291cmNlIiwiZmluaXNoTW9kdWxlcyIsIm1vZHVsZXMiLCJfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciIsImh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24iLCJkYXRhIiwicGF0aCIsImpzUGF0aCIsImpvaW4iLCJleHRQYXRoIiwiY3NzUGF0aCIsImFzc2V0cyIsImpzIiwidW5zaGlmdCIsImNzcyIsIl9hZnRlckNvbXBpbGUiLCJ0b1N0cmluZyIsIl9lbWl0IiwiY2FsbGJhY2siLCJlbWl0Iiwib3V0cHV0UGF0aCIsImRldlNlcnZlciIsImNvbnRlbnRCYXNlIiwiX3ByZXBhcmVGb3JCdWlsZCIsImNvbW1hbmQiLCJ3YXRjaCIsInJlYnVpbGQiLCJwYXJtcyIsInByb2ZpbGUiLCJ3YXRjaFN0YXJ0ZWQiLCJfYnVpbGRFeHRCdW5kbGUiLCJfZG9uZSIsIl90b0RldiIsImJyb3dzZXIiLCJicm93c2VyQ291bnQiLCJ1cmwiLCJwb3J0Iiwib3BuIiwib3V0cHV0IiwicGFja2FnZXMiLCJ0b29sa2l0IiwidGhlbWUiLCJyaW1yYWYiLCJta2RpcnAiLCJmc3giLCJmaXJzdFRpbWUiLCJzeW5jIiwiYnVpbGRYTUwiLCJjcmVhdGVBcHBKc29uIiwiY3JlYXRlV29ya3NwYWNlSnNvbiIsImNyZWF0ZUpTRE9NRW52aXJvbm1lbnQiLCJ3cml0ZUZpbGVTeW5jIiwicHJvY2VzcyIsImN3ZCIsImZyb21QYXRoIiwidG9QYXRoIiwiY29weVN5bmMiLCJyZXBsYWNlIiwiZnJvbVJlc291cmNlcyIsInRvUmVzb3VyY2VzIiwibWFuaWZlc3QiLCJidW5kbGVEaXIiLCJ0cmltIiwic2VuY2hhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbkJ1aWxkRG9uZSIsIm9wdHMiLCJzaWxlbnQiLCJzdGRpbyIsImVuY29kaW5nIiwiX2V4ZWN1dGVBc3luYyIsInRoZW4iLCJyZWFzb24iLCJERUZBVUxUX1NVQlNUUlMiLCJzdWJzdHJpbmdzIiwiY2hhbGsiLCJjcm9zc1NwYXduIiwic3RyaW5naWZ5IiwiY2hpbGQiLCJvbiIsImNvZGUiLCJzaWduYWwiLCJFcnJvciIsImVycm9yIiwic3Rkb3V0Iiwic3RyIiwiZmlsZW5hbWUiLCJzb21lIiwidiIsImluZGV4T2YiLCJyZWQiLCJzdGRlcnIiLCJzdHJKYXZhT3B0cyIsInNjcmlwdFBhdGgiLCJjaGlsZFByb2Nlc3MiLCJpbnZva2VkIiwiZm9yayIsIl90b1h0eXBlIiwicHJlZml4IiwicGxhdGZvcm0iLCJncmVlbiIsImZyYW1ld29ya05hbWUiLCJwbHVnaW5QYXRoIiwicGx1Z2luUGtnIiwicGx1Z2luVmVyc2lvbiIsInZlcnNpb24iLCJfcmVzb2x2ZWQiLCJlZGl0aW9uIiwid2VicGFja1BhdGgiLCJ3ZWJwYWNrUGtnIiwid2VicGFja1ZlcnNpb24iLCJleHRQa2ciLCJleHRWZXJzaW9uIiwiY21kUGF0aCIsImNtZFBrZyIsImNtZFZlcnNpb24iLCJ2ZXJzaW9uX2Z1bGwiLCJmcmFtZXdvcmtJbmZvIiwiZnJhbWV3b3JrUGF0aCIsImZyYW1ld29ya1BrZyIsImZyYW1ld29ya1ZlcnNpb24iLCJtZXNzYWdlIiwicyIsImN1cnNvclRvIiwiY2xlYXJMaW5lIiwid3JpdGUiLCJsb2doIiwiaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNPLFNBQVNBLFlBQVQsQ0FBc0JDLGNBQXRCLEVBQXNDO0FBQzNDLFFBQU1DLEVBQUUsR0FBR0MsT0FBTyxDQUFDLElBQUQsQ0FBbEI7O0FBQ0EsTUFBSUMsSUFBSSxHQUFHLEVBQVg7QUFDQSxNQUFJQyxPQUFPLEdBQUcsRUFBZDs7QUFDQSxNQUFJO0FBQ0YsUUFBSUosY0FBYyxDQUFDSyxTQUFmLElBQTRCQyxTQUFoQyxFQUEyQztBQUN6Q0gsTUFBQUEsSUFBSSxDQUFDSSxZQUFMLEdBQW9CLEVBQXBCO0FBQ0FKLE1BQUFBLElBQUksQ0FBQ0ksWUFBTCxDQUFrQkMsSUFBbEIsQ0FBdUIsc0hBQXZCO0FBQ0EsVUFBSUMsQ0FBQyxHQUFHLEVBQVI7QUFDQUEsTUFBQUEsQ0FBQyxDQUFDTixJQUFGLEdBQVNBLElBQVQ7QUFDQSxhQUFPTSxDQUFQO0FBQ0Q7O0FBQ0QsUUFBSUosU0FBUyxHQUFHTCxjQUFjLENBQUNLLFNBQS9CO0FBQ0EsUUFBSUssU0FBUyxHQUFHVixjQUFjLENBQUNVLFNBQS9CO0FBQ0EsUUFBSUMsT0FBTyxHQUFHWCxjQUFjLENBQUNXLE9BQTdCOztBQUVBLFVBQU1DLGVBQWUsR0FBR1YsT0FBTyxDQUFDLGNBQUQsQ0FB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QUFPO0FBQ0xkLElBQUFBLFNBQVMsRUFBRSxPQUROO0FBRUx5RixJQUFBQSxPQUFPLEVBQUUsUUFGSjtBQUdMQyxJQUFBQSxLQUFLLEVBQUUsZ0JBSEY7QUFJTHRCLElBQUFBLElBQUksRUFBRSxLQUpEO0FBS0xyQyxJQUFBQSxNQUFNLEVBQUUsSUFMSDtBQU1Mc0QsSUFBQUEsSUFBSSxFQUFFLElBTkQ7QUFPTEcsSUFBQUEsUUFBUSxFQUFFLEVBUEw7QUFTTFgsSUFBQUEsT0FBTyxFQUFFLFNBVEo7QUFVTHpELElBQUFBLFdBQVcsRUFBRSxhQVZSO0FBV0xmLElBQUFBLFNBQVMsRUFBRSxJQVhOO0FBWUw2RSxJQUFBQSxPQUFPLEVBQUUsS0FaSjtBQWFMUixJQUFBQSxLQUFLLEVBQUUsS0FiRjtBQWNMcEUsSUFBQUEsT0FBTyxFQUFFO0FBZEosR0FBUDtBQWdCRCIsInNvdXJjZXNDb250ZW50IjpbIi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb25zdHJ1Y3Rvcihpbml0aWFsT3B0aW9ucykge1xuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgdmFyIHZhcnMgPSB7fVxuICB2YXIgb3B0aW9ucyA9IHt9XG4gIHRyeSB7XG4gICAgaWYgKGluaXRpYWxPcHRpb25zLmZyYW1ld29yayA9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhcnMucGx1Z2luRXJyb3JzID0gW11cbiAgICAgIHZhcnMucGx1Z2luRXJyb3JzLnB1c2goJ3dlYnBhY2sgY29uZmlnOiBmcmFtZXdvcmsgcGFyYW1ldGVyIG9uIGV4dC13ZWJwYWNrLXBsdWdpbiBpcyBub3QgZGVmaW5lZCAtIHZhbHVlczogcmVhY3QsIGFuZ3VsYXIsIGV4dGpzLCBjb21wb25lbnRzJylcbiAgICAgIHZhciBvID0ge31cbiAgICAgIG8udmFycyA9IHZhcnNcbiAgICAgIHJldHVybiBvXG4gICAgfVxuICAgIHZhciBmcmFtZXdvcmsgPSBpbml0aWFsT3B0aW9ucy5mcmFtZXdvcmtcbiAgICB2YXIgdHJlZXNoYWtlID0gaW5pdGlhbE9wdGlvbnMudHJlZXNoYWtlXG4gICAgdmFyIHZlcmJvc2UgPSBpbml0aWFsT3B0aW9ucy52ZXJib3NlXG5cbiAgICBjb25zdCB2YWxpZGF0ZU9wdGlvbnMgPSByZXF1aXJlKCdzY2hlbWEtdXRpbHMnKVxuICAgIHZhbGlkYXRlT3B0aW9ucyhfZ2V0VmFsaWRhdGVPcHRpb25zKCksIGluaXRpYWxPcHRpb25zLCAnJylcblxuICAgIGNvbnN0IHJjID0gKGZzLmV4aXN0c1N5bmMoYC5leHQtJHtmcmFtZXdvcmt9cmNgKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhgLmV4dC0ke2ZyYW1ld29ya31yY2AsICd1dGYtOCcpKSB8fCB7fSlcbiAgICBvcHRpb25zID0geyAuLi5fZ2V0RGVmYXVsdE9wdGlvbnMoKSwgLi4uaW5pdGlhbE9wdGlvbnMsIC4uLnJjIH1cblxuICAgIHZhcnMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0RGVmYXVsdFZhcnMoKVxuICAgIHZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gICAgdmFycy5hcHAgPSBfZ2V0QXBwKClcbiAgICB2YXIgcGx1Z2luTmFtZSA9IHZhcnMucGx1Z2luTmFtZVxuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2NvbnN0cnVjdG9yJylcbiAgICBsb2d2KHZlcmJvc2UsIGBwbHVnaW5OYW1lIC0gJHtwbHVnaW5OYW1lfWApXG4gICAgbG9ndih2ZXJib3NlLCBgYXBwIC0gJHthcHB9YClcblxuICAgIGlmIChvcHRpb25zLmVudmlyb25tZW50ID09ICdwcm9kdWN0aW9uJykge3ZhcnMucHJvZHVjdGlvbiA9IHRydWV9XG4gICAgZWxzZSB7dmFycy5wcm9kdWN0aW9uID0gZmFsc2V9XG4gICAgXG4gICAgLy9sb2d2KHZlcmJvc2UsIGBvcHRpb25zOmApO2lmICh2ZXJib3NlID09ICd5ZXMnKSB7Y29uc29sZS5kaXIob3B0aW9ucyl9XG4gICAgLy9sb2d2KHZlcmJvc2UsIGB2YXJzOmApO2lmICh2ZXJib3NlID09ICd5ZXMnKSB7Y29uc29sZS5kaXIodmFycyl9XG4gICAgXG4gICAgbG9nKGFwcCwgX2dldFZlcnNpb25zKHBsdWdpbk5hbWUsIGZyYW1ld29yaykpXG5cbiAgICBpZiAoZnJhbWV3b3JrID09ICdyZWFjdCcpIHsgLy8gfHwgZnJhbWV3b3JrID09ICdleHRqcydcbiAgICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBQcm9kdWN0aW9uIEJ1aWxkJylcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBEZXZlbG9wbWVudCBCdWlsZCcpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlKSB7XG4gICAgICBpZiAodHJlZXNoYWtlID09ICd5ZXMnKSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMidcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIFByb2R1Y3Rpb24gQnVpbGQgLSAnICsgdmFycy5idWlsZHN0ZXApXG4gICAgICAgIHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl90b1Byb2QodmFycywgb3B0aW9ucylcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcyIG9mIDInXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBQcm9kdWN0aW9uIEJ1aWxkIC0gJyArIHZhcnMuYnVpbGRzdGVwKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgIGxvZyhhcHAsICdTdGFydGluZyBEZXZlbG9wbWVudCBCdWlsZCcpXG4gICAgfVxuICAgIGxvZ3YodmVyYm9zZSwgJ0J1aWxkaW5nIGZvciAnICsgb3B0aW9ucy5lbnZpcm9ubWVudCArICcsICcgKyAnVHJlZXNoYWtlIGlzICcgKyBvcHRpb25zLnRyZWVzaGFrZSlcblxuICAgIHZhciBvID0ge31cbiAgICBvLnZhcnMgPSB2YXJzXG4gICAgby5vcHRpb25zID0gb3B0aW9uc1xuICAgIHJldHVybiBvXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF90aGlzQ29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfdGhpc0NvbXBpbGF0aW9uJylcbiAgICBsb2d2KHZlcmJvc2UsIGBvcHRpb25zLnNjcmlwdDogJHtvcHRpb25zLnNjcmlwdCB9YClcbiAgICBsb2d2KHZlcmJvc2UsIGBidWlsZHN0ZXA6ICR7dmFycy5idWlsZHN0ZXB9YClcblxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgICAgaWYgKG9wdGlvbnMuc2NyaXB0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNjcmlwdCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gJycpIHtcbiAgICAgICAgICAgIGxvZyhhcHAsIGBTdGFydGVkIHJ1bm5pbmcgJHtvcHRpb25zLnNjcmlwdH1gKVxuICAgICAgICAgICAgcnVuU2NyaXB0KG9wdGlvbnMuc2NyaXB0LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgICAgICAgbG9nKGFwcCwgYEZpbmlzaGVkIHJ1bm5pbmcgJHtvcHRpb25zLnNjcmlwdH1gKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgbG9ndih2ZXJib3NlLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ190aGlzQ29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9jb21waWxhdGlvbicpXG4gICAgXG4gICAgaWYgKGZyYW1ld29yayA9PSAnZXh0anMnKSB7XG4gICAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfY29tcGlsYXRpb24gZW5kIChleHRqcyknKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHZhciBleHRDb21wb25lbnRzID0gW11cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMicpIHtcbiAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0QWxsQ29tcG9uZW50cyh2YXJzLCBvcHRpb25zKVxuICAgIH1cbiAgICBjb21waWxhdGlvbi5ob29rcy5zdWNjZWVkTW9kdWxlLnRhcChgZXh0LXN1Y2NlZWQtbW9kdWxlYCwgbW9kdWxlID0+IHtcbiAgICAgIGlmIChtb2R1bGUucmVzb3VyY2UgJiYgIW1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvbm9kZV9tb2R1bGVzLykpIHtcbiAgICAgICAgaWYobW9kdWxlLnJlc291cmNlLm1hdGNoKC9cXC5odG1sJC8pICE9IG51bGwpIHtcbiAgICAgICAgICBpZihtb2R1bGUuX3NvdXJjZS5fdmFsdWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnZG9jdHlwZSBodG1sJykgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgLi4uKHZhcnMuZGVwcyB8fCBbXSksXG4gICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFycy5kZXBzID0gW1xuICAgICAgICAgICAgLi4uKHZhcnMuZGVwcyB8fCBbXSksXG4gICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgICAgY29tcGlsYXRpb24uaG9va3MuZmluaXNoTW9kdWxlcy50YXAoYGV4dC1maW5pc2gtbW9kdWxlc2AsIG1vZHVsZXMgPT4ge1xuICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fd3JpdGVGaWxlc1RvUHJvZEZvbGRlcih2YXJzLCBvcHRpb25zKVxuICAgICAgfSlcbiAgICB9XG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09ICcyIG9mIDInKSB7XG4gICAgICBjb21waWxhdGlvbi5ob29rcy5odG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uLnRhcChgZXh0LWh0bWwtZ2VuZXJhdGlvbmAsKGRhdGEpID0+IHtcbiAgICAgICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgICB2YXIganNQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5qcycpXG4gICAgICAgIHZhciBjc3NQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5jc3MnKVxuICAgICAgICBkYXRhLmFzc2V0cy5qcy51bnNoaWZ0KGpzUGF0aClcbiAgICAgICAgZGF0YS5hc3NldHMuY3NzLnVuc2hpZnQoY3NzUGF0aClcbiAgICAgICAgbG9nKGFwcCwgYEFkZGluZyAke2pzUGF0aH0gYW5kICR7Y3NzUGF0aH0gdG8gaW5kZXguaHRtbGApXG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgbG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2NvbXBpbGF0aW9uOiAnICsgZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfYWZ0ZXJDb21waWxlKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZScpXG4gICAgaWYgKGZyYW1ld29yayA9PSAnZXh0anMnKSB7XG4gICAgICByZXF1aXJlKGAuL2V4dGpzVXRpbGApLl9hZnRlckNvbXBpbGUoY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZSBub3QgcnVuJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHRocm93ICdfYWZ0ZXJDb21waWxlOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2VtaXQoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB0cnkge1xuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBlbWl0ID0gb3B0aW9ucy5lbWl0XG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfZW1pdCcpXG4gICAgaWYgKGVtaXQgPT0gJ3llcycpIHtcbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgICAgICBsZXQgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vdXRwdXRQYXRoLHZhcnMuZXh0UGF0aClcbiAgICAgICAgaWYgKGNvbXBpbGVyLm91dHB1dFBhdGggPT09ICcvJyAmJiBjb21waWxlci5vcHRpb25zLmRldlNlcnZlcikge1xuICAgICAgICAgIG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIuY29udGVudEJhc2UsIG91dHB1dFBhdGgpXG4gICAgICAgIH1cbiAgICAgICAgbG9ndih2ZXJib3NlLCdvdXRwdXRQYXRoOiAnICsgb3V0cHV0UGF0aClcbiAgICAgICAgbG9ndih2ZXJib3NlLCdmcmFtZXdvcms6ICcgKyBmcmFtZXdvcmspXG4gICAgICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgICAgIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZygnYWZ0ZXIgZnInKVxuICAgICAgICB2YXIgY29tbWFuZCA9ICcnXG4gICAgICAgIGNvbnNvbGUubG9nKG9wdGlvbnMud2F0Y2gpXG4gICAgICAgIGlmIChvcHRpb25zLndhdGNoID09ICd5ZXMnICYmIHZhcnMucHJvZHVjdGlvbiA9PSBmYWxzZSkge1xuICAgICAgICAgIGNvbW1hbmQgPSAnd2F0Y2gnXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7Y29tbWFuZCA9ICdidWlsZCd9XG4gICAgICAgIGNvbnNvbGUubG9nKGNvbW1hbmQpXG4gICAgICAgIGNvbnNvbGUubG9nKHZhcnMucmVidWlsZClcbiAgICAgICAgaWYgKHZhcnMucmVidWlsZCA9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHBhcm1zID0gW11cbiAgICAgICAgICBpZiAob3B0aW9ucy5wcm9maWxlID09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnByb2ZpbGUgPT0gJycgfHwgb3B0aW9ucy5wcm9maWxlID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMuZW52aXJvbm1lbnRdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhcnMud2F0Y2hTdGFydGVkID09IGZhbHNlKSB7XG4gICAgICAgICAgICBhd2FpdCBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIG9wdGlvbnMpXG4gICAgICAgICAgICB2YXJzLndhdGNoU3RhcnRlZCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwnTk9UIHJ1bm5pbmcgZW1pdCcpXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KHZlcmJvc2UsJ2VtaXQgaXMgbm8nKVxuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgbG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2VtaXQ6ICcgKyBlKVxuICAgIGNhbGxiYWNrKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZG9uZSh2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9kb25lJylcbiAgICAvL21qZyByZWZhY3RvclxuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSAnbm8nICYmIGZyYW1ld29yayA9PSAnYW5ndWxhcicpIHtcbiAgICAgIHJlcXVpcmUoYC4vJHtvcHRpb25zLmZyYW1ld29ya31VdGlsYCkuX3RvRGV2KHZhcnMsIG9wdGlvbnMpXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBpZihvcHRpb25zLmJyb3dzZXIgPT0gJ3llcycgJiYgb3B0aW9ucy53YXRjaCA9PSAneWVzJyAmJiB2YXJzLnByb2R1Y3Rpb24gPT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHZhcnMuYnJvd3NlckNvdW50ID09IDApIHtcbiAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6JyArIG9wdGlvbnMucG9ydFxuICAgICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYE9wZW5pbmcgYnJvd3NlciBhdCAke3VybH1gKVxuICAgICAgICAgIHZhcnMuYnJvd3NlckNvdW50KytcbiAgICAgICAgICBjb25zdCBvcG4gPSByZXF1aXJlKCdvcG4nKVxuICAgICAgICAgIG9wbih1cmwpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAvL2NvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdzaG93IGJyb3dzZXIgd2luZG93IC0gZXh0LWRvbmU6ICcgKyBlKVxuICAgIH1cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScpIHtcbiAgICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgUHJvZHVjdGlvbiBCdWlsZGApXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIERldmVsb3BtZW50IEJ1aWxkYClcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcyIG9mIDInKSB7XG4gICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgUHJvZHVjdGlvbiBCdWlsZGApXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXQsIGNvbXBpbGF0aW9uKSB7XG4gIHRyeSB7XG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgcGFja2FnZXMgPSBvcHRpb25zLnBhY2thZ2VzXG4gICAgdmFyIHRvb2xraXQgPSBvcHRpb25zLnRvb2xraXRcbiAgICB2YXIgdGhlbWUgPSBvcHRpb25zLnRoZW1lXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfcHJlcGFyZUZvckJ1aWxkJylcbiAgICBjb25zdCByaW1yYWYgPSByZXF1aXJlKCdyaW1yYWYnKVxuICAgIGNvbnN0IG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpXG4gICAgY29uc3QgZnN4ID0gcmVxdWlyZSgnZnMtZXh0cmEnKVxuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICB0aGVtZSA9IHRoZW1lIHx8ICh0b29sa2l0ID09PSAnY2xhc3NpYycgPyAndGhlbWUtdHJpdG9uJyA6ICd0aGVtZS1tYXRlcmlhbCcpXG4gICAgbG9ndih2ZXJib3NlLCdmaXJzdFRpbWU6ICcgKyB2YXJzLmZpcnN0VGltZSlcbiAgICBpZiAodmFycy5maXJzdFRpbWUpIHtcbiAgICAgIHJpbXJhZi5zeW5jKG91dHB1dClcbiAgICAgIG1rZGlycC5zeW5jKG91dHB1dClcbiAgICAgIGNvbnN0IGJ1aWxkWE1MID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5idWlsZFhNTFxuICAgICAgY29uc3QgY3JlYXRlQXBwSnNvbiA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuY3JlYXRlQXBwSnNvblxuICAgICAgY29uc3QgY3JlYXRlV29ya3NwYWNlSnNvbiA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuY3JlYXRlV29ya3NwYWNlSnNvblxuICAgICAgY29uc3QgY3JlYXRlSlNET01FbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuY3JlYXRlSlNET01FbnZpcm9ubWVudFxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnYnVpbGQueG1sJyksIGJ1aWxkWE1MKHZhcnMucHJvZHVjdGlvbiwgb3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnYXBwLmpzb24nKSwgY3JlYXRlQXBwSnNvbih0aGVtZSwgcGFja2FnZXMsIHRvb2xraXQsIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2pzZG9tLWVudmlyb25tZW50LmpzJyksIGNyZWF0ZUpTRE9NRW52aXJvbm1lbnQob3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnd29ya3NwYWNlLmpzb24nKSwgY3JlYXRlV29ya3NwYWNlSnNvbihvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICB2YXIgZnJhbWV3b3JrID0gdmFycy5mcmFtZXdvcms7XG4gICAgICAvL2JlY2F1c2Ugb2YgYSBwcm9ibGVtIHdpdGggY29sb3JwaWNrZXJcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L3V4L2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vdXgvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICd1eCcpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAodXgpICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAncGFja2FnZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L292ZXJyaWRlcy9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L292ZXJyaWRlcy9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ292ZXJyaWRlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksJ3Jlc291cmNlcy8nKSkpIHtcbiAgICAgICAgdmFyIGZyb21SZXNvdXJjZXMgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3Jlc291cmNlcy8nKVxuICAgICAgICB2YXIgdG9SZXNvdXJjZXMgPSBwYXRoLmpvaW4ob3V0cHV0LCAnLi4vcmVzb3VyY2VzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21SZXNvdXJjZXMsIHRvUmVzb3VyY2VzKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAnICsgZnJvbVJlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1Jlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICB9XG4gICAgdmFycy5maXJzdFRpbWUgPSBmYWxzZVxuICAgIHZhciBqcyA9ICcnXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbikge1xuICAgICAganMgPSB2YXJzLmRlcHMuam9pbignO1xcbicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGpzID0gJ0V4dC5yZXF1aXJlKFwiRXh0LipcIiknXG4gICAgfVxuICAgIGlmICh2YXJzLm1hbmlmZXN0ID09PSBudWxsIHx8IGpzICE9PSB2YXJzLm1hbmlmZXN0KSB7XG4gICAgICB2YXJzLm1hbmlmZXN0ID0ganNcbiAgICAgIGNvbnN0IG1hbmlmZXN0ID0gcGF0aC5qb2luKG91dHB1dCwgJ21hbmlmZXN0LmpzJylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMobWFuaWZlc3QsIGpzLCAndXRmOCcpXG4gICAgICB2YXJzLnJlYnVpbGQgPSB0cnVlXG4gICAgICB2YXIgYnVuZGxlRGlyID0gb3V0cHV0LnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpXG4gICAgICBpZiAoYnVuZGxlRGlyLnRyaW0oKSA9PSAnJykge2J1bmRsZURpciA9ICcuLyd9XG4gICAgICBsb2coYXBwLCAnQnVpbGRpbmcgRXh0IGJ1bmRsZSBhdDogJyArIGJ1bmRsZURpcilcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXJzLnJlYnVpbGQgPSBmYWxzZVxuICAgICAgbG9nKGFwcCwgJ0V4dCByZWJ1aWxkIE5PVCBuZWVkZWQnKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX3ByZXBhcmVGb3JCdWlsZDogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2J1aWxkRXh0QnVuZGxlKGFwcCwgY29tcGlsYXRpb24sIG91dHB1dFBhdGgsIHBhcm1zLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9idWlsZEV4dEJ1bmRsZScpXG4gICAgbGV0IHNlbmNoYTsgdHJ5IHsgc2VuY2hhID0gcmVxdWlyZSgnQHNlbmNoYS9jbWQnKSB9IGNhdGNoIChlKSB7IHNlbmNoYSA9ICdzZW5jaGEnIH1cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhzZW5jaGEpKSB7XG4gICAgICBsb2d2KHZlcmJvc2UsJ3NlbmNoYSBmb2xkZXIgZXhpc3RzJylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KHZlcmJvc2UsJ3NlbmNoYSBmb2xkZXIgRE9FUyBOT1QgZXhpc3QnKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgb25CdWlsZERvbmUgPSAoKSA9PiB7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwnb25CdWlsZERvbmUnKVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH1cbiAgICAgIHZhciBvcHRzID0geyBjd2Q6IG91dHB1dFBhdGgsIHNpbGVudDogdHJ1ZSwgc3RkaW86ICdwaXBlJywgZW5jb2Rpbmc6ICd1dGYtOCd9XG4gICAgICBfZXhlY3V0ZUFzeW5jKGFwcCwgc2VuY2hhLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIG9wdGlvbnMpLnRoZW4gKFxuICAgICAgICBmdW5jdGlvbigpIHsgb25CdWlsZERvbmUoKSB9LCBcbiAgICAgICAgZnVuY3Rpb24ocmVhc29uKSB7IHJlamVjdChyZWFzb24pIH1cbiAgICAgIClcbiAgICB9KVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZygnZScpXG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2J1aWxkRXh0QnVuZGxlOiAnICsgZSlcbiAgICBjYWxsYmFjaygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2V4ZWN1dGVBc3luYyAoYXBwLCBjb21tYW5kLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIC8vY29uc3QgREVGQVVMVF9TVUJTVFJTID0gWydbSU5GXSBMb2FkaW5nJywgJ1tJTkZdIFByb2Nlc3NpbmcnLCAnW0xPR10gRmFzaGlvbiBidWlsZCBjb21wbGV0ZScsICdbRVJSXScsICdbV1JOXScsIFwiW0lORl0gU2VydmVyXCIsIFwiW0lORl0gV3JpdGluZ1wiLCBcIltJTkZdIExvYWRpbmcgQnVpbGRcIiwgXCJbSU5GXSBXYWl0aW5nXCIsIFwiW0xPR10gRmFzaGlvbiB3YWl0aW5nXCJdO1xuICAgIGNvbnN0IERFRkFVTFRfU1VCU1RSUyA9IFtcIltJTkZdIHhTZXJ2ZXJcIiwgJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gQXBwZW5kJywgJ1tJTkZdIFByb2Nlc3NpbmcnLCAnW0lORl0gUHJvY2Vzc2luZyBCdWlsZCcsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gICAgdmFyIHN1YnN0cmluZ3MgPSBERUZBVUxUX1NVQlNUUlMgXG4gICAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKVxuICAgIGNvbnN0IGNyb3NzU3Bhd24gPSByZXF1aXJlKCdjcm9zcy1zcGF3bicpXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2V4ZWN1dGVBc3luYycpXG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbG9ndih2ZXJib3NlLGBjb21tYW5kIC0gJHtjb21tYW5kfWApXG4gICAgICBsb2d2KHZlcmJvc2UsIGBwYXJtcyAtICR7cGFybXN9YClcbiAgICAgIGxvZ3YodmVyYm9zZSwgYG9wdHMgLSAke0pTT04uc3RyaW5naWZ5KG9wdHMpfWApXG4gICAgICBsZXQgY2hpbGQgPSBjcm9zc1NwYXduKGNvbW1hbmQsIHBhcm1zLCBvcHRzKVxuICAgICAgY2hpbGQub24oJ2Nsb3NlJywgKGNvZGUsIHNpZ25hbCkgPT4ge1xuICAgICAgICBsb2d2KHZlcmJvc2UsIGBvbiBjbG9zZTogYCArIGNvZGUpIFxuICAgICAgICBpZihjb2RlID09PSAwKSB7IHJlc29sdmUoMCkgfVxuICAgICAgICBlbHNlIHsgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goIG5ldyBFcnJvcihjb2RlKSApOyByZXNvbHZlKDApIH1cbiAgICAgIH0pXG4gICAgICBjaGlsZC5vbignZXJyb3InLCAoZXJyb3IpID0+IHsgXG4gICAgICAgIGxvZ3YodmVyYm9zZSwgYG9uIGVycm9yYCkgXG4gICAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGVycm9yKVxuICAgICAgICByZXNvbHZlKDApXG4gICAgICB9KVxuICAgICAgY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXG4gICAgICAgIGxvZ3YodmVyYm9zZSwgYCR7c3RyfWApXG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEudG9TdHJpbmcoKS5tYXRjaCgvRmFzaGlvbiB3YWl0aW5nIGZvciBjaGFuZ2VzXFwuXFwuXFwuLykpIHtcblxuICAgICAgICAgIC8vIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICAgICAgICAvLyB2YXIgZmlsZW5hbWUgPSBwcm9jZXNzLmN3ZCgpKycvc3JjL2luZGV4LmpzJztcbiAgICAgICAgICAvLyB2YXIgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSk7XG4gICAgICAgICAgLy8gZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgZGF0YSArICcgJywgJ3V0ZjgnKVxuICAgICAgICAgIC8vIGxvZ3YodmVyYm9zZSwgYHRvdWNoaW5nICR7ZmlsZW5hbWV9YClcblxuICAgICAgICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICAgICAgICB2YXIgZmlsZW5hbWUgPSBwcm9jZXNzLmN3ZCgpICsgJy9zcmMvaW5kZXguanMnO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSk7XG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVuYW1lLCBkYXRhICsgJyAnLCAndXRmOCcpO1xuICAgICAgICAgICAgbG9nKGFwcCwgYHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGxvZyhhcHAsIGBOT1QgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKDApXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKHN1YnN0cmluZ3Muc29tZShmdW5jdGlvbih2KSB7IHJldHVybiBkYXRhLmluZGV4T2YodikgPj0gMDsgfSkpIHsgXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltJTkZdXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltMT0ddXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykudHJpbSgpXG4gICAgICAgICAgICBpZiAoc3RyLmluY2x1ZGVzKFwiW0VSUl1cIikpIHtcbiAgICAgICAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goYXBwICsgc3RyLnJlcGxhY2UoL15cXFtFUlJcXF0gL2dpLCAnJykpO1xuICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltFUlJdXCIsIGAke2NoYWxrLnJlZChcIltFUlJdXCIpfWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2coYXBwLCBzdHIpIFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNoaWxkLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywgYGVycm9yIG9uIGNsb3NlOiBgICsgZGF0YSkgXG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICB2YXIgc3RySmF2YU9wdHMgPSBcIlBpY2tlZCB1cCBfSkFWQV9PUFRJT05TXCI7XG4gICAgICAgIHZhciBpbmNsdWRlcyA9IHN0ci5pbmNsdWRlcyhzdHJKYXZhT3B0cylcbiAgICAgICAgaWYgKCFpbmNsdWRlcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2FwcH0gJHtjaGFsay5yZWQoXCJbRVJSXVwiKX0gJHtzdHJ9YClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICBsb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2V4ZWN1dGVBc3luYzogJyArIGUpXG4gICAgY2FsbGJhY2soKVxuICB9IFxufVxuXG4vLyoqKioqKioqKipcbmZ1bmN0aW9uIHJ1blNjcmlwdChzY3JpcHRQYXRoLCBjYWxsYmFjaykge1xuICB2YXIgY2hpbGRQcm9jZXNzID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xuICAvLyBrZWVwIHRyYWNrIG9mIHdoZXRoZXIgY2FsbGJhY2sgaGFzIGJlZW4gaW52b2tlZCB0byBwcmV2ZW50IG11bHRpcGxlIGludm9jYXRpb25zXG4gIHZhciBpbnZva2VkID0gZmFsc2U7XG4gIHZhciBwcm9jZXNzID0gY2hpbGRQcm9jZXNzLmZvcmsoc2NyaXB0UGF0aCk7XG4gIC8vIGxpc3RlbiBmb3IgZXJyb3JzIGFzIHRoZXkgbWF5IHByZXZlbnQgdGhlIGV4aXQgZXZlbnQgZnJvbSBmaXJpbmdcbiAgcHJvY2Vzcy5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKGludm9rZWQpIHJldHVybjtcbiAgICBpbnZva2VkID0gdHJ1ZTtcbiAgICBjYWxsYmFjayhlcnIpO1xuICB9KTtcbiAgLy8gZXhlY3V0ZSB0aGUgY2FsbGJhY2sgb25jZSB0aGUgcHJvY2VzcyBoYXMgZmluaXNoZWQgcnVubmluZ1xuICBwcm9jZXNzLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGUpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIHZhciBlcnIgPSBjb2RlID09PSAwID8gbnVsbCA6IG5ldyBFcnJvcignZXhpdCBjb2RlICcgKyBjb2RlKTtcbiAgICBjYWxsYmFjayhlcnIpO1xuICB9KTtcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3RvWHR5cGUoc3RyKSB7XG4gIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9fL2csICctJylcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2dldEFwcCgpIHtcbiAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKVxuICB2YXIgcHJlZml4ID0gYGBcbiAgY29uc3QgcGxhdGZvcm0gPSByZXF1aXJlKCdvcycpLnBsYXRmb3JtKClcbiAgaWYgKHBsYXRmb3JtID09ICdkYXJ3aW4nKSB7IHByZWZpeCA9IGDihLkg772iZXh0772jOmAgfVxuICBlbHNlIHsgcHJlZml4ID0gYGkgW2V4dF06YCB9XG4gIHJldHVybiBgJHtjaGFsay5ncmVlbihwcmVmaXgpfSBgXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRWZXJzaW9ucyhwbHVnaW5OYW1lLCBmcmFtZXdvcmtOYW1lKSB7XG4gIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gIHZhciB2ID0ge31cbiAgdmFyIHBsdWdpblBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEnLCBwbHVnaW5OYW1lKVxuICB2YXIgcGx1Z2luUGtnID0gKGZzLmV4aXN0c1N5bmMocGx1Z2luUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LnBsdWdpblZlcnNpb24gPSBwbHVnaW5Qa2cudmVyc2lvblxuICB2Ll9yZXNvbHZlZCA9IHBsdWdpblBrZy5fcmVzb2x2ZWRcbiAgaWYgKHYuX3Jlc29sdmVkID09IHVuZGVmaW5lZCkge1xuICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICB9XG4gIGVsc2Uge1xuICAgIGlmICgtMSA9PSB2Ll9yZXNvbHZlZC5pbmRleE9mKCdjb21tdW5pdHknKSkge1xuICAgICAgdi5lZGl0aW9uID0gYENvbW1lcmNpYWxgXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdi5lZGl0aW9uID0gYENvbW11bml0eWBcbiAgICB9XG4gIH1cbiAgdmFyIHdlYnBhY2tQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy93ZWJwYWNrJylcbiAgdmFyIHdlYnBhY2tQa2cgPSAoZnMuZXhpc3RzU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHdlYnBhY2tQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi53ZWJwYWNrVmVyc2lvbiA9IHdlYnBhY2tQa2cudmVyc2lvblxuICB2YXIgZXh0UGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQHNlbmNoYS9leHQnKVxuICB2YXIgZXh0UGtnID0gKGZzLmV4aXN0c1N5bmMoZXh0UGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LmV4dFZlcnNpb24gPSBleHRQa2cuc2VuY2hhLnZlcnNpb25cbiAgdmFyIGNtZFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSxgbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5jbWRWZXJzaW9uID0gY21kUGtnLnZlcnNpb25fZnVsbFxuICBpZiAodi5jbWRWZXJzaW9uID09IHVuZGVmaW5lZCkge1xuICAgIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhLyR7cGx1Z2luTmFtZX0vbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgICB2YXIgY21kUGtnID0gKGZzLmV4aXN0c1N5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICAgIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgfVxuICB2YXIgZnJhbWV3b3JrSW5mbyA9ICcnXG4gICBpZiAoZnJhbWV3b3JrTmFtZSAhPSB1bmRlZmluZWQgJiYgZnJhbWV3b3JrTmFtZSAhPSAnZXh0anMnKSB7XG4gICAgdmFyIGZyYW1ld29ya1BhdGggPSAnJ1xuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdyZWFjdCcpIHtcbiAgICAgIGZyYW1ld29ya1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL3JlYWN0JylcbiAgICB9XG4gICAgaWYgKGZyYW1ld29ya05hbWUgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9AYW5ndWxhci9jb3JlJylcbiAgICB9XG4gICAgdmFyIGZyYW1ld29ya1BrZyA9IChmcy5leGlzdHNTeW5jKGZyYW1ld29ya1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmZyYW1ld29ya1ZlcnNpb24gPSBmcmFtZXdvcmtQa2cudmVyc2lvblxuICAgIGZyYW1ld29ya0luZm8gPSAnLCAnICsgZnJhbWV3b3JrTmFtZSArICcgdicgKyB2LmZyYW1ld29ya1ZlcnNpb25cbiAgfVxuICByZXR1cm4gJ2V4dC13ZWJwYWNrLXBsdWdpbiB2JyArIHYucGx1Z2luVmVyc2lvbiArICcsIEV4dCBKUyB2JyArIHYuZXh0VmVyc2lvbiArICcgJyArIHYuZWRpdGlvbiArICcgRWRpdGlvbiwgU2VuY2hhIENtZCB2JyArIHYuY21kVmVyc2lvbiArICcsIHdlYnBhY2sgdicgKyB2LndlYnBhY2tWZXJzaW9uICsgZnJhbWV3b3JrSW5mb1xuIH1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9nKGFwcCxtZXNzYWdlKSB7XG4gIHZhciBzID0gYXBwICsgbWVzc2FnZSBcbiAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgdHJ5IHtwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKX1jYXRjaChlKSB7fVxuICBwcm9jZXNzLnN0ZG91dC53cml0ZShzKTtwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9naChhcHAsbWVzc2FnZSkge1xuICB2YXIgaCA9IGZhbHNlXG4gIHZhciBzID0gYXBwICsgbWVzc2FnZSBcbiAgaWYgKGggPT0gdHJ1ZSkge1xuICAgIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgfVxuICAgIGNhdGNoKGUpIHt9XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocylcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBsb2d2KHZlcmJvc2UsIHMpIHtcbiAgaWYgKHZlcmJvc2UgPT0gJ3llcycpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGAtdmVyYm9zZTogJHtzfWApXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2dldFZhbGlkYXRlT3B0aW9ucygpIHtcbiAgcmV0dXJuIHtcbiAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICBcInByb3BlcnRpZXNcIjoge1xuICAgICAgXCJmcmFtZXdvcmtcIjogICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwidG9vbGtpdFwiOiAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcInRoZW1lXCI6ICAgICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJlbWl0XCI6ICAgICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwic2NyaXB0XCI6ICAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcInBvcnRcIjogICAgICAgIHtcInR5cGVcIjogWyBcImludGVnZXJcIiBdfSxcbiAgICAgIFwicGFja2FnZXNcIjogICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIsIFwiYXJyYXlcIiBdfSxcblxuICAgICAgXCJwcm9maWxlXCI6ICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwiZW52aXJvbm1lbnRcIjoge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcInRyZWVzaGFrZVwiOiAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJicm93c2VyXCI6ICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwid2F0Y2hcIjogICAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcInZlcmJvc2VcIjogICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19XG4gICAgfSxcbiAgICBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCI6IGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24gX2dldERlZmF1bHRPcHRpb25zKCkge1xuICByZXR1cm4ge1xuICAgIGZyYW1ld29yazogJ2V4dGpzJyxcbiAgICB0b29sa2l0OiAnbW9kZXJuJyxcbiAgICB0aGVtZTogJ3RoZW1lLW1hdGVyaWFsJyxcbiAgICBlbWl0OiAneWVzJyxcbiAgICBzY3JpcHQ6IG51bGwsXG4gICAgcG9ydDogMTk2MixcbiAgICBwYWNrYWdlczogW10sXG5cbiAgICBwcm9maWxlOiAnZGVza3RvcCcsIFxuICAgIGVudmlyb25tZW50OiAnZGV2ZWxvcG1lbnQnLCBcbiAgICB0cmVlc2hha2U6ICdubycsXG4gICAgYnJvd3NlcjogJ3llcycsXG4gICAgd2F0Y2g6ICd5ZXMnLFxuICAgIHZlcmJvc2U6ICdubydcbiAgfVxufVxuXG5cbiJdfQ==