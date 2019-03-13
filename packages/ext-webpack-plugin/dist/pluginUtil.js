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
    vars = _getDefaultVars();
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
          log(app, `Started running ${options.script}`);
          runScript(options.script, function (err) {
            if (err) throw err;
            log(app, `Finished running ${options.script}`);
          });
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

          if (!emit) {
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
          logv(verbose, 'emit is false');
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
    logv(verbose, 'FUNCTION _done');

    if (vars.production == true && options.treeshake == false && framework == 'angular') {
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
      "profile": {
        "type": ["string"]
      },
      "environment": {
        "type": ["string"]
      },
      "treeshake": {
        "type": ["boolean"]
      },
      "port": {
        "type": ["integer"]
      },
      "emit": {
        "type": ["boolean"]
      },
      "browser": {
        "type": ["boolean"]
      },
      "watch": {
        "type": ["string"]
      },
      "verbose": {
        "type": ["string"]
      },
      "script": {
        "type": ["string"]
      },
      "packages": {
        "type": ["string", "array"]
      }
    },
    "additionalProperties": false
  };
}

function _getDefaultOptions() {
  return {
    framework: null,
    toolkit: 'modern',
    theme: 'theme-material',
    profile: 'desktop',
    environment: 'development',
    treeshake: false,
    port: 1962,
    emit: true,
    browser: true,
    watch: 'yes',
    verbose: 'no',
    script: null,
    packages: null
  };
}

function _getDefaultVars() {
  return {
    watchStarted: false,
    buildstep: '1 of 1',
    firstTime: true,
    firstCompile: true,
    browserCount: 0,
    manifest: null,
    extPath: 'ext-angular',
    pluginErrors: [],
    deps: [],
    usedExtComponents: [],
    rebuild: true
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsImluaXRpYWxPcHRpb25zIiwiZnMiLCJyZXF1aXJlIiwidmFycyIsIm9wdGlvbnMiLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwibyIsInRyZWVzaGFrZSIsInZlcmJvc2UiLCJ2YWxpZGF0ZU9wdGlvbnMiLCJfZ2V0VmFsaWRhdGVPcHRpb25zIiwicmMiLCJleGlzdHNTeW5jIiwiSlNPTiIsInBhcnNlIiwicmVhZEZpbGVTeW5jIiwiX2dldERlZmF1bHRPcHRpb25zIiwiX2dldERlZmF1bHRWYXJzIiwicGx1Z2luTmFtZSIsImFwcCIsIl9nZXRBcHAiLCJsb2d2IiwiZW52aXJvbm1lbnQiLCJwcm9kdWN0aW9uIiwibG9nIiwiX2dldFZlcnNpb25zIiwiYnVpbGRzdGVwIiwiX3RvUHJvZCIsImUiLCJjb25zb2xlIiwiX3RoaXNDb21waWxhdGlvbiIsImNvbXBpbGVyIiwiY29tcGlsYXRpb24iLCJzY3JpcHQiLCJydW5TY3JpcHQiLCJlcnIiLCJlcnJvcnMiLCJfY29tcGlsYXRpb24iLCJleHRDb21wb25lbnRzIiwiX2dldEFsbENvbXBvbmVudHMiLCJob29rcyIsInN1Y2NlZWRNb2R1bGUiLCJ0YXAiLCJtb2R1bGUiLCJyZXNvdXJjZSIsIm1hdGNoIiwiX3NvdXJjZSIsIl92YWx1ZSIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJkZXBzIiwiX2V4dHJhY3RGcm9tU291cmNlIiwiZmluaXNoTW9kdWxlcyIsIm1vZHVsZXMiLCJfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciIsImh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24iLCJkYXRhIiwicGF0aCIsImpzUGF0aCIsImpvaW4iLCJleHRQYXRoIiwiY3NzUGF0aCIsImFzc2V0cyIsImpzIiwidW5zaGlmdCIsImNzcyIsIl9lbWl0IiwiY2FsbGJhY2siLCJlbWl0Iiwib3V0cHV0UGF0aCIsImRldlNlcnZlciIsImNvbnRlbnRCYXNlIiwiX3ByZXBhcmVGb3JCdWlsZCIsImNvbW1hbmQiLCJ3YXRjaCIsInJlYnVpbGQiLCJwYXJtcyIsInByb2ZpbGUiLCJ3YXRjaFN0YXJ0ZWQiLCJfYnVpbGRFeHRCdW5kbGUiLCJfYWZ0ZXJDb21waWxlIiwiX2RvbmUiLCJfdG9EZXYiLCJicm93c2VyIiwiYnJvd3NlckNvdW50IiwidXJsIiwicG9ydCIsIm9wbiIsIm91dHB1dCIsInBhY2thZ2VzIiwidG9vbGtpdCIsInRoZW1lIiwicmltcmFmIiwibWtkaXJwIiwiZnN4IiwiZmlyc3RUaW1lIiwic3luYyIsImJ1aWxkWE1MIiwiY3JlYXRlQXBwSnNvbiIsImNyZWF0ZVdvcmtzcGFjZUpzb24iLCJjcmVhdGVKU0RPTUVudmlyb25tZW50Iiwid3JpdGVGaWxlU3luYyIsInByb2Nlc3MiLCJjd2QiLCJmcm9tUGF0aCIsInRvUGF0aCIsImNvcHlTeW5jIiwicmVwbGFjZSIsImZyb21SZXNvdXJjZXMiLCJ0b1Jlc291cmNlcyIsIm1hbmlmZXN0IiwiYnVuZGxlRGlyIiwidHJpbSIsInNlbmNoYSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25CdWlsZERvbmUiLCJvcHRzIiwic2lsZW50Iiwic3RkaW8iLCJlbmNvZGluZyIsIl9leGVjdXRlQXN5bmMiLCJ0aGVuIiwicmVhc29uIiwiREVGQVVMVF9TVUJTVFJTIiwic3Vic3RyaW5ncyIsImNoYWxrIiwiY3Jvc3NTcGF3biIsInN0cmluZ2lmeSIsImNoaWxkIiwib24iLCJjb2RlIiwic2lnbmFsIiwiRXJyb3IiLCJlcnJvciIsInN0ZG91dCIsInN0ciIsInRvU3RyaW5nIiwiZmlsZW5hbWUiLCJzb21lIiwidiIsImluZGV4T2YiLCJyZWQiLCJzdGRlcnIiLCJzdHJKYXZhT3B0cyIsInNjcmlwdFBhdGgiLCJjaGlsZFByb2Nlc3MiLCJpbnZva2VkIiwiZm9yayIsIl90b1h0eXBlIiwicHJlZml4IiwicGxhdGZvcm0iLCJncmVlbiIsImZyYW1ld29ya05hbWUiLCJwbHVnaW5QYXRoIiwicGx1Z2luUGtnIiwicGx1Z2luVmVyc2lvbiIsInZlcnNpb24iLCJfcmVzb2x2ZWQiLCJlZGl0aW9uIiwid2VicGFja1BhdGgiLCJ3ZWJwYWNrUGtnIiwid2VicGFja1ZlcnNpb24iLCJleHRQa2ciLCJleHRWZXJzaW9uIiwiY21kUGF0aCIsImNtZFBrZyIsImNtZFZlcnNpb24iLCJ2ZXJzaW9uX2Z1bGwiLCJmcmFtZXdvcmtJbmZvIiwiZnJhbWV3b3JrUGF0aCIsImZyYW1ld29ya1BrZyIsImZyYW1ld29ya1ZlcnNpb24iLCJtZXNzYWdlIiwicyIsImN1cnNvclRvIiwiY2xlYXJMaW5lIiwid3JpdGUiLCJsb2doIiwiaCIsImZpcnN0Q29tcGlsZSIsInVzZWRFeHRDb21wb25lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ08sU0FBU0EsWUFBVCxDQUFzQkMsY0FBdEIsRUFBc0M7QUFDM0MsUUFBTUMsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxNQUFJQyxJQUFJLEdBQUcsRUFBWDtBQUNBLE1BQUlDLE9BQU8sR0FBRyxFQUFkOztBQUNBLE1BQUk7QUFDRixRQUFJSixjQUFjLENBQUNLLFNBQWYsSUFBNEJDLFNBQWhDLEVBQTJDO0FBQ3pDSCxNQUFBQSxJQUFJLENBQUNJLFlBQUwsR0FBb0IsRUFBcEI7QUFDQUosTUFBQUEsSUFBSSxDQUFDSSxZQUFMLENBQWtCQyxJQUFsQixDQUF1QixzSEFBdkI7QUFDQSxVQUFJQyxDQUFDLEdBQUcsRUFBUjtBQUNBQSxNQUFBQSxDQUFDLENBQUNOLElBQUYsR0FBU0EsSUFBVDtBQUNBLGFBQU9NLENBQVA7QUFDRDs7QUFDRCxRQUFJSixTQUFTLEdBQUdMLGNBQWMsQ0FBQ0ssU0FBL0I7QUFDQSxRQUFJSyxTQUFTLEdBQUdWLGNBQWMsQ0FBQ1UsU0FBL0I7QUFDQSxRQUFJQyxPQUFPLEdBQUdYLGNBQWMsQ0FBQ1csT0FBN0I7O0FBRUEs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LEtBQUssRUFBRSxnQkFIRjtBQUlMZCxJQUFBQSxPQUFPLEVBQUUsU0FKSjtBQUtMdkQsSUFBQUEsV0FBVyxFQUFFLGFBTFI7QUFNTGYsSUFBQUEsU0FBUyxFQUFFLEtBTk47QUFPTCtFLElBQUFBLElBQUksRUFBRSxJQVBEO0FBUUxsQixJQUFBQSxJQUFJLEVBQUUsSUFSRDtBQVNMZSxJQUFBQSxPQUFPLEVBQUUsSUFUSjtBQVVMVCxJQUFBQSxLQUFLLEVBQUUsS0FWRjtBQVdMbEUsSUFBQUEsT0FBTyxFQUFFLElBWEo7QUFZTHlCLElBQUFBLE1BQU0sRUFBRSxJQVpIO0FBYUx3RCxJQUFBQSxRQUFRLEVBQUU7QUFiTCxHQUFQO0FBZUQ7O0FBRUQsU0FBU3hFLGVBQVQsR0FBMkI7QUFDekIsU0FBTztBQUNMNkQsSUFBQUEsWUFBWSxFQUFHLEtBRFY7QUFFTHBELElBQUFBLFNBQVMsRUFBRSxRQUZOO0FBR0xxRSxJQUFBQSxTQUFTLEVBQUcsSUFIUDtBQUlMc0YsSUFBQUEsWUFBWSxFQUFFLElBSlQ7QUFLTGpHLElBQUFBLFlBQVksRUFBRyxDQUxWO0FBTUwwQixJQUFBQSxRQUFRLEVBQUUsSUFOTDtBQU9MbEQsSUFBQUEsT0FBTyxFQUFFLGFBUEo7QUFRTHhELElBQUFBLFlBQVksRUFBRSxFQVJUO0FBU0w4QyxJQUFBQSxJQUFJLEVBQUUsRUFURDtBQVVMb0ksSUFBQUEsaUJBQWlCLEVBQUUsRUFWZDtBQVdMM0csSUFBQUEsT0FBTyxFQUFFO0FBWEosR0FBUDtBQWFEIiwic291cmNlc0NvbnRlbnQiOlsiLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbnN0cnVjdG9yKGluaXRpYWxPcHRpb25zKSB7XG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICB2YXIgdmFycyA9IHt9XG4gIHZhciBvcHRpb25zID0ge31cbiAgdHJ5IHtcbiAgICBpZiAoaW5pdGlhbE9wdGlvbnMuZnJhbWV3b3JrID09IHVuZGVmaW5lZCkge1xuICAgICAgdmFycy5wbHVnaW5FcnJvcnMgPSBbXVxuICAgICAgdmFycy5wbHVnaW5FcnJvcnMucHVzaCgnd2VicGFjayBjb25maWc6IGZyYW1ld29yayBwYXJhbWV0ZXIgb24gZXh0LXdlYnBhY2stcGx1Z2luIGlzIG5vdCBkZWZpbmVkIC0gdmFsdWVzOiByZWFjdCwgYW5ndWxhciwgZXh0anMsIGNvbXBvbmVudHMnKVxuICAgICAgdmFyIG8gPSB7fVxuICAgICAgby52YXJzID0gdmFyc1xuICAgICAgcmV0dXJuIG9cbiAgICB9XG4gICAgdmFyIGZyYW1ld29yayA9IGluaXRpYWxPcHRpb25zLmZyYW1ld29ya1xuICAgIHZhciB0cmVlc2hha2UgPSBpbml0aWFsT3B0aW9ucy50cmVlc2hha2VcbiAgICB2YXIgdmVyYm9zZSA9IGluaXRpYWxPcHRpb25zLnZlcmJvc2VcblxuICAgIGNvbnN0IHZhbGlkYXRlT3B0aW9ucyA9IHJlcXVpcmUoJ3NjaGVtYS11dGlscycpXG4gICAgdmFsaWRhdGVPcHRpb25zKF9nZXRWYWxpZGF0ZU9wdGlvbnMoKSwgaW5pdGlhbE9wdGlvbnMsICcnKVxuXG4gICAgY29uc3QgcmMgPSAoZnMuZXhpc3RzU3luYyhgLmV4dC0ke2ZyYW1ld29ya31yY2ApICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGAuZXh0LSR7ZnJhbWV3b3JrfXJjYCwgJ3V0Zi04JykpIHx8IHt9KVxuICAgIG9wdGlvbnMgPSB7IC4uLl9nZXREZWZhdWx0T3B0aW9ucygpLCAuLi5pbml0aWFsT3B0aW9ucywgLi4ucmMgfVxuXG4gICAgdmFycyA9IF9nZXREZWZhdWx0VmFycygpXG4gICAgdmFycy5wbHVnaW5OYW1lID0gJ2V4dC13ZWJwYWNrLXBsdWdpbidcbiAgICB2YXJzLmFwcCA9IF9nZXRBcHAoKVxuICAgIHZhciBwbHVnaW5OYW1lID0gdmFycy5wbHVnaW5OYW1lXG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG5cbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfY29uc3RydWN0b3InKVxuICAgIGxvZ3YodmVyYm9zZSwgYHBsdWdpbk5hbWUgLSAke3BsdWdpbk5hbWV9YClcbiAgICBsb2d2KHZlcmJvc2UsIGBhcHAgLSAke2FwcH1gKVxuXG4gICAgaWYgKG9wdGlvbnMuZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nKSB7dmFycy5wcm9kdWN0aW9uID0gdHJ1ZX1cbiAgICBlbHNlIHt2YXJzLnByb2R1Y3Rpb24gPSBmYWxzZX1cbiAgICBcbiAgICAvL2xvZ3YodmVyYm9zZSwgYG9wdGlvbnM6YCk7aWYgKHZlcmJvc2UgPT0gJ3llcycpIHtjb25zb2xlLmRpcihvcHRpb25zKX1cbiAgICAvL2xvZ3YodmVyYm9zZSwgYHZhcnM6YCk7aWYgKHZlcmJvc2UgPT0gJ3llcycpIHtjb25zb2xlLmRpcih2YXJzKX1cbiAgICBcbiAgICBsb2coYXBwLCBfZ2V0VmVyc2lvbnMocGx1Z2luTmFtZSwgZnJhbWV3b3JrKSlcblxuICAgIGlmIChmcmFtZXdvcmsgPT0gJ3JlYWN0JykgeyAvLyB8fCBmcmFtZXdvcmsgPT0gJ2V4dGpzJ1xuICAgICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlKSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIFByb2R1Y3Rpb24gQnVpbGQnKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIERldmVsb3BtZW50IEJ1aWxkJylcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUpIHtcbiAgICAgIGlmICh0cmVlc2hha2UgPT0gdHJ1ZSkge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDInXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBQcm9kdWN0aW9uIEJ1aWxkIC0gJyArIHZhcnMuYnVpbGRzdGVwKVxuICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fdG9Qcm9kKHZhcnMsIG9wdGlvbnMpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMiBvZiAyJ1xuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgUHJvZHVjdGlvbiBCdWlsZCAtICcgKyB2YXJzLmJ1aWxkc3RlcClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICBsb2coYXBwLCAnU3RhcnRpbmcgRGV2ZWxvcG1lbnQgQnVpbGQnKVxuICAgIH1cbiAgICBsb2d2KHZlcmJvc2UsICdCdWlsZGluZyBmb3IgJyArIG9wdGlvbnMuZW52aXJvbm1lbnQgKyAnLCAnICsgJ1RyZWVzaGFrZSBpcyAnICsgb3B0aW9ucy50cmVlc2hha2UpXG5cbiAgICB2YXIgbyA9IHt9XG4gICAgby52YXJzID0gdmFyc1xuICAgIG8ub3B0aW9ucyA9IG9wdGlvbnNcbiAgICByZXR1cm4gb1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfdGhpc0NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX3RoaXNDb21waWxhdGlvbicpXG4gICAgbG9ndih2ZXJib3NlLCBgb3B0aW9ucy5zY3JpcHQ6ICR7b3B0aW9ucy5zY3JpcHQgfWApXG4gICAgbG9ndih2ZXJib3NlLCBgYnVpbGRzdGVwOiAke3ZhcnMuYnVpbGRzdGVwfWApXG5cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScgfHwgdmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMicpIHtcbiAgICAgIGlmIChvcHRpb25zLnNjcmlwdCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuc2NyaXB0ICE9IG51bGwpIHtcbiAgICAgICAgICBsb2coYXBwLCBgU3RhcnRlZCBydW5uaW5nICR7b3B0aW9ucy5zY3JpcHR9YClcbiAgICAgICAgICBydW5TY3JpcHQob3B0aW9ucy5zY3JpcHQsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgICAgIGxvZyhhcHAsIGBGaW5pc2hlZCBydW5uaW5nICR7b3B0aW9ucy5zY3JpcHR9YClcbiAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBsb2d2KHZlcmJvc2UsIGBvcHRpb25zLnNjcmlwdDogJHtvcHRpb25zLnNjcmlwdCB9YClcbiAgICAgICAgbG9ndih2ZXJib3NlLCBgYnVpbGRzdGVwOiAke3ZhcnMuYnVpbGRzdGVwfWApXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICBsb2d2KHZlcmJvc2UsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX3RoaXNDb21waWxhdGlvbjogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2NvbXBpbGF0aW9uJylcbiAgICBcbiAgICBpZiAoZnJhbWV3b3JrID09ICdleHRqcycpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdXG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgICBleHRDb21wb25lbnRzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucylcbiAgICB9XG4gICAgY29tcGlsYXRpb24uaG9va3Muc3VjY2VlZE1vZHVsZS50YXAoYGV4dC1zdWNjZWVkLW1vZHVsZWAsIG1vZHVsZSA9PiB7XG4gICAgICBpZiAobW9kdWxlLnJlc291cmNlICYmICFtb2R1bGUucmVzb3VyY2UubWF0Y2goL25vZGVfbW9kdWxlcy8pKSB7XG4gICAgICAgIGlmKG1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvXFwuaHRtbCQvKSAhPSBudWxsKSB7XG4gICAgICAgICAgaWYobW9kdWxlLl9zb3VyY2UuX3ZhbHVlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2RvY3R5cGUgaHRtbCcpID09IGZhbHNlKSB7XG4gICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4gICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgICAgICAgICAgLi4ucmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMicpIHtcbiAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLmZpbmlzaE1vZHVsZXMudGFwKGBleHQtZmluaXNoLW1vZHVsZXNgLCBtb2R1bGVzID0+IHtcbiAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIodmFycywgb3B0aW9ucylcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMiBvZiAyJykge1xuICAgICAgY29tcGlsYXRpb24uaG9va3MuaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbi50YXAoYGV4dC1odG1sLWdlbmVyYXRpb25gLChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAgICAgdmFyIGpzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuanMnKVxuICAgICAgICB2YXIgY3NzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuY3NzJylcbiAgICAgICAgZGF0YS5hc3NldHMuanMudW5zaGlmdChqc1BhdGgpXG4gICAgICAgIGRhdGEuYXNzZXRzLmNzcy51bnNoaWZ0KGNzc1BhdGgpXG4gICAgICAgIGxvZyhhcHAsIGBBZGRpbmcgJHtqc1BhdGh9IGFuZCAke2Nzc1BhdGh9IHRvIGluZGV4Lmh0bWxgKVxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIGxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19jb21waWxhdGlvbjogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2VtaXQoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB0cnkge1xuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBlbWl0ID0gb3B0aW9ucy5lbWl0XG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfZW1pdCcpXG4gICAgaWYgKGVtaXQpIHtcbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgICAgICBsZXQgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vdXRwdXRQYXRoLHZhcnMuZXh0UGF0aClcbiAgICAgICAgaWYgKGNvbXBpbGVyLm91dHB1dFBhdGggPT09ICcvJyAmJiBjb21waWxlci5vcHRpb25zLmRldlNlcnZlcikge1xuICAgICAgICAgIG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIuY29udGVudEJhc2UsIG91dHB1dFBhdGgpXG4gICAgICAgIH1cbiAgICAgICAgbG9ndih2ZXJib3NlLCdvdXRwdXRQYXRoOiAnICsgb3V0cHV0UGF0aClcbiAgICAgICAgbG9ndih2ZXJib3NlLCdmcmFtZXdvcms6ICcgKyBmcmFtZXdvcmspXG4gICAgICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgICAgIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29tbWFuZCA9ICcnXG4gICAgICAgIGlmIChvcHRpb25zLndhdGNoID09ICd5ZXMnICYmIHZhcnMucHJvZHVjdGlvbiA9PSBmYWxzZSkge2NvbW1hbmQgPSAnd2F0Y2gnfVxuICAgICAgICBlbHNlIHtjb21tYW5kID0gJ2J1aWxkJ31cbiAgICAgICAgaWYgKHZhcnMucmVidWlsZCA9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHBhcm1zID0gW11cbiAgICAgICAgICBpZiAob3B0aW9ucy5wcm9maWxlID09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnByb2ZpbGUgPT0gJycgfHwgb3B0aW9ucy5wcm9maWxlID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMuZW52aXJvbm1lbnRdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhcnMud2F0Y2hTdGFydGVkID09IGZhbHNlKSB7XG4gICAgICAgICAgICBhd2FpdCBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIG9wdGlvbnMpXG4gICAgICAgICAgICB2YXJzLndhdGNoU3RhcnRlZCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwnTk9UIHJ1bm5pbmcgZW1pdCcpXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KHZlcmJvc2UsJ2VtaXQgaXMgZmFsc2UnKVxuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgbG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2VtaXQ6ICcgKyBlKVxuICAgIGNhbGxiYWNrKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfYWZ0ZXJDb21waWxlKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZScpXG4gICAgaWYgKGZyYW1ld29yayA9PSAnZXh0anMnKSB7XG4gICAgICByZXF1aXJlKGAuL2V4dGpzVXRpbGApLl9hZnRlckNvbXBpbGUoY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZSBub3QgcnVuJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfYWZ0ZXJDb21waWxlOiAnICsgZSlcbiAgICBsb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2RvbmUodmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfZG9uZScpXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlICYmIG9wdGlvbnMudHJlZXNoYWtlID09IGZhbHNlICYmIGZyYW1ld29yayA9PSAnYW5ndWxhcicpIHtcbiAgICAgIHJlcXVpcmUoYC4vJHtvcHRpb25zLmZyYW1ld29ya31VdGlsYCkuX3RvRGV2KHZhcnMsIG9wdGlvbnMpXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBpZihvcHRpb25zLmJyb3dzZXIgPT0gdHJ1ZSAmJiBvcHRpb25zLndhdGNoID09ICd5ZXMnICYmIHZhcnMucHJvZHVjdGlvbiA9PSBmYWxzZSkge1xuICAgICAgICBpZiAodmFycy5icm93c2VyQ291bnQgPT0gMCkge1xuICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDonICsgb3B0aW9ucy5wb3J0XG4gICAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgT3BlbmluZyBicm93c2VyIGF0ICR7dXJsfWApXG4gICAgICAgICAgdmFycy5icm93c2VyQ291bnQrK1xuICAgICAgICAgIGNvbnN0IG9wbiA9IHJlcXVpcmUoJ29wbicpXG4gICAgICAgICAgb3BuKHVybClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgIC8vY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ3Nob3cgYnJvd3NlciB3aW5kb3cgLSBleHQtZG9uZTogJyArIGUpXG4gICAgfVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJykge1xuICAgICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlKSB7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBQcm9kdWN0aW9uIEJ1aWxkYClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgRGV2ZWxvcG1lbnQgQnVpbGRgKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzIgb2YgMicpIHtcbiAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBQcm9kdWN0aW9uIEJ1aWxkYClcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dCwgY29tcGlsYXRpb24pIHtcbiAgdHJ5IHtcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBwYWNrYWdlcyA9IG9wdGlvbnMucGFja2FnZXNcbiAgICB2YXIgdG9vbGtpdCA9IG9wdGlvbnMudG9vbGtpdFxuICAgIHZhciB0aGVtZSA9IG9wdGlvbnMudGhlbWVcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9wcmVwYXJlRm9yQnVpbGQnKVxuICAgIGNvbnN0IHJpbXJhZiA9IHJlcXVpcmUoJ3JpbXJhZicpXG4gICAgY29uc3QgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJylcbiAgICBjb25zdCBmc3ggPSByZXF1aXJlKCdmcy1leHRyYScpXG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgIHRoZW1lID0gdGhlbWUgfHwgKHRvb2xraXQgPT09ICdjbGFzc2ljJyA/ICd0aGVtZS10cml0b24nIDogJ3RoZW1lLW1hdGVyaWFsJylcbiAgICBsb2d2KHZlcmJvc2UsJ2ZpcnN0VGltZTogJyArIHZhcnMuZmlyc3RUaW1lKVxuICAgIGlmICh2YXJzLmZpcnN0VGltZSkge1xuICAgICAgcmltcmFmLnN5bmMob3V0cHV0KVxuICAgICAgbWtkaXJwLnN5bmMob3V0cHV0KVxuICAgICAgY29uc3QgYnVpbGRYTUwgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmJ1aWxkWE1MXG4gICAgICBjb25zdCBjcmVhdGVBcHBKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVBcHBKc29uXG4gICAgICBjb25zdCBjcmVhdGVXb3Jrc3BhY2VKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVXb3Jrc3BhY2VKc29uXG4gICAgICBjb25zdCBjcmVhdGVKU0RPTUVudmlyb25tZW50ID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVKU0RPTUVudmlyb25tZW50XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdidWlsZC54bWwnKSwgYnVpbGRYTUwodmFycy5wcm9kdWN0aW9uLCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdhcHAuanNvbicpLCBjcmVhdGVBcHBKc29uKHRoZW1lLCBwYWNrYWdlcywgdG9vbGtpdCwgb3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnanNkb20tZW52aXJvbm1lbnQuanMnKSwgY3JlYXRlSlNET01FbnZpcm9ubWVudChvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICd3b3Jrc3BhY2UuanNvbicpLCBjcmVhdGVXb3Jrc3BhY2VKc29uKG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIHZhciBmcmFtZXdvcmsgPSB2YXJzLmZyYW1ld29yaztcbiAgICAgIC8vYmVjYXVzZSBvZiBhIHByb2JsZW0gd2l0aCBjb2xvcnBpY2tlclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vdXgvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3V4JylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICh1eCkgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vcGFja2FnZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdwYWNrYWdlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vb3ZlcnJpZGVzL2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vb3ZlcnJpZGVzL2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAnb3ZlcnJpZGVzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwncmVzb3VyY2VzLycpKSkge1xuICAgICAgICB2YXIgZnJvbVJlc291cmNlcyA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncmVzb3VyY2VzLycpXG4gICAgICAgIHZhciB0b1Jlc291cmNlcyA9IHBhdGguam9pbihvdXRwdXQsICcuLi9yZXNvdXJjZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVJlc291cmNlcywgdG9SZXNvdXJjZXMpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICcgKyBmcm9tUmVzb3VyY2VzLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUmVzb3VyY2VzLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgIH1cbiAgICB2YXJzLmZpcnN0VGltZSA9IGZhbHNlXG4gICAgdmFyIGpzID0gJydcbiAgICBpZiAodmFycy5wcm9kdWN0aW9uKSB7XG4gICAgICBqcyA9IHZhcnMuZGVwcy5qb2luKCc7XFxuJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAganMgPSAnRXh0LnJlcXVpcmUoXCJFeHQuKlwiKSdcbiAgICB9XG4gICAgaWYgKHZhcnMubWFuaWZlc3QgPT09IG51bGwgfHwganMgIT09IHZhcnMubWFuaWZlc3QpIHtcbiAgICAgIHZhcnMubWFuaWZlc3QgPSBqc1xuICAgICAgY29uc3QgbWFuaWZlc3QgPSBwYXRoLmpvaW4ob3V0cHV0LCAnbWFuaWZlc3QuanMnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhtYW5pZmVzdCwganMsICd1dGY4JylcbiAgICAgIHZhcnMucmVidWlsZCA9IHRydWVcbiAgICAgIHZhciBidW5kbGVEaXIgPSBvdXRwdXQucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJylcbiAgICAgIGlmIChidW5kbGVEaXIudHJpbSgpID09ICcnKSB7YnVuZGxlRGlyID0gJy4vJ31cbiAgICAgIGxvZyhhcHAsICdCdWlsZGluZyBFeHQgYnVuZGxlIGF0OiAnICsgYnVuZGxlRGlyKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhcnMucmVidWlsZCA9IGZhbHNlXG4gICAgICBsb2coYXBwLCAnRXh0IHJlYnVpbGQgTk9UIG5lZWRlZCcpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfcHJlcGFyZUZvckJ1aWxkOiAnICsgZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICAgIGxvZ3YodmVyYm9zZSwnRlVOQ1RJT04gX2J1aWxkRXh0QnVuZGxlJylcbiAgICBsZXQgc2VuY2hhOyB0cnkgeyBzZW5jaGEgPSByZXF1aXJlKCdAc2VuY2hhL2NtZCcpIH0gY2F0Y2ggKGUpIHsgc2VuY2hhID0gJ3NlbmNoYScgfVxuICAgIGlmIChmcy5leGlzdHNTeW5jKHNlbmNoYSkpIHtcbiAgICAgIGxvZ3YodmVyYm9zZSwnc2VuY2hhIGZvbGRlciBleGlzdHMnKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxvZ3YodmVyYm9zZSwnc2VuY2hhIGZvbGRlciBET0VTIE5PVCBleGlzdCcpXG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBvbkJ1aWxkRG9uZSA9ICgpID0+IHtcbiAgICAgICAgbG9ndih2ZXJib3NlLCdvbkJ1aWxkRG9uZScpXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfVxuICAgICAgdmFyIG9wdHMgPSB7IGN3ZDogb3V0cHV0UGF0aCwgc2lsZW50OiB0cnVlLCBzdGRpbzogJ3BpcGUnLCBlbmNvZGluZzogJ3V0Zi04J31cbiAgICAgIF9leGVjdXRlQXN5bmMoYXBwLCBzZW5jaGEsIHBhcm1zLCBvcHRzLCBjb21waWxhdGlvbiwgb3B0aW9ucykudGhlbiAoXG4gICAgICAgIGZ1bmN0aW9uKCkgeyBvbkJ1aWxkRG9uZSgpIH0sIFxuICAgICAgICBmdW5jdGlvbihyZWFzb24pIHsgcmVqZWN0KHJlYXNvbikgfVxuICAgICAgKVxuICAgIH0pXG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIGNvbnNvbGUubG9nKCdlJylcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfYnVpbGRFeHRCdW5kbGU6ICcgKyBlKVxuICAgIGNhbGxiYWNrKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZXhlY3V0ZUFzeW5jIChhcHAsIGNvbW1hbmQsIHBhcm1zLCBvcHRzLCBjb21waWxhdGlvbiwgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgLy9jb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBTZXJ2ZXJcIiwgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gICAgY29uc3QgREVGQVVMVF9TVUJTVFJTID0gW1wiW0lORl0geFNlcnZlclwiLCAnW0lORl0gTG9hZGluZycsICdbSU5GXSBBcHBlbmQnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbSU5GXSBQcm9jZXNzaW5nIEJ1aWxkJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgICB2YXIgc3Vic3RyaW5ncyA9IERFRkFVTFRfU1VCU1RSUyBcbiAgICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gICAgY29uc3QgY3Jvc3NTcGF3biA9IHJlcXVpcmUoJ2Nyb3NzLXNwYXduJylcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfZXhlY3V0ZUFzeW5jJylcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsb2d2KHZlcmJvc2UsYGNvbW1hbmQgLSAke2NvbW1hbmR9YClcbiAgICAgIGxvZ3YodmVyYm9zZSwgYHBhcm1zIC0gJHtwYXJtc31gKVxuICAgICAgbG9ndih2ZXJib3NlLCBgb3B0cyAtICR7SlNPTi5zdHJpbmdpZnkob3B0cyl9YClcbiAgICAgIGxldCBjaGlsZCA9IGNyb3NzU3Bhd24oY29tbWFuZCwgcGFybXMsIG9wdHMpXG4gICAgICBjaGlsZC5vbignY2xvc2UnLCAoY29kZSwgc2lnbmFsKSA9PiB7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwgYG9uIGNsb3NlOiBgICsgY29kZSkgXG4gICAgICAgIGlmKGNvZGUgPT09IDApIHsgcmVzb2x2ZSgwKSB9XG4gICAgICAgIGVsc2UgeyBjb21waWxhdGlvbi5lcnJvcnMucHVzaCggbmV3IEVycm9yKGNvZGUpICk7IHJlc29sdmUoMCkgfVxuICAgICAgfSlcbiAgICAgIGNoaWxkLm9uKCdlcnJvcicsIChlcnJvcikgPT4geyBcbiAgICAgICAgbG9ndih2ZXJib3NlLCBgb24gZXJyb3JgKSBcbiAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goZXJyb3IpXG4gICAgICAgIHJlc29sdmUoMClcbiAgICAgIH0pXG4gICAgICBjaGlsZC5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICB2YXIgc3RyID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UoL1xccj9cXG58XFxyL2csIFwiIFwiKS50cmltKClcbiAgICAgICAgbG9ndih2ZXJib3NlLCBgJHtzdHJ9YClcbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS50b1N0cmluZygpLm1hdGNoKC9GYXNoaW9uIHdhaXRpbmcgZm9yIGNoYW5nZXNcXC5cXC5cXC4vKSkge1xuXG4gICAgICAgICAgLy8gY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuICAgICAgICAgIC8vIHZhciBmaWxlbmFtZSA9IHByb2Nlc3MuY3dkKCkrJy9zcmMvaW5kZXguanMnO1xuICAgICAgICAgIC8vIHZhciBkYXRhID0gZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lKTtcbiAgICAgICAgICAvLyBmcy53cml0ZUZpbGVTeW5jKGZpbGVuYW1lLCBkYXRhICsgJyAnLCAndXRmOCcpXG4gICAgICAgICAgLy8gbG9ndih2ZXJib3NlLCBgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKVxuXG4gICAgICAgICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuICAgICAgICAgIHZhciBmaWxlbmFtZSA9IHByb2Nlc3MuY3dkKCkgKyAnL3NyYy9pbmRleC5qcyc7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lKTtcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZW5hbWUsIGRhdGEgKyAnICcsICd1dGY4Jyk7XG4gICAgICAgICAgICBsb2coYXBwLCBgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2goZSkge1xuICAgICAgICAgICAgbG9nKGFwcCwgYE5PVCB0b3VjaGluZyAke2ZpbGVuYW1lfWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoMClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAoc3Vic3RyaW5ncy5zb21lKGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGRhdGEuaW5kZXhPZih2KSA+PSAwOyB9KSkgeyBcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0lORl1cIiwgXCJcIilcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0xPR11cIiwgXCJcIilcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKS50cmltKClcbiAgICAgICAgICAgIGlmIChzdHIuaW5jbHVkZXMoXCJbRVJSXVwiKSkge1xuICAgICAgICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChhcHAgKyBzdHIucmVwbGFjZSgvXlxcW0VSUlxcXSAvZ2ksICcnKSk7XG4gICAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0VSUl1cIiwgYCR7Y2hhbGsucmVkKFwiW0VSUl1cIil9YClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvZyhhcHAsIHN0cikgXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgbG9ndihvcHRpb25zLCBgZXJyb3Igb24gY2xvc2U6IGAgKyBkYXRhKSBcbiAgICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXG4gICAgICAgIHZhciBzdHJKYXZhT3B0cyA9IFwiUGlja2VkIHVwIF9KQVZBX09QVElPTlNcIjtcbiAgICAgICAgdmFyIGluY2x1ZGVzID0gc3RyLmluY2x1ZGVzKHN0ckphdmFPcHRzKVxuICAgICAgICBpZiAoIWluY2x1ZGVzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7YXBwfSAke2NoYWxrLnJlZChcIltFUlJdXCIpfSAke3N0cn1gKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIGxvZ3Yob3B0aW9ucyxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfZXhlY3V0ZUFzeW5jOiAnICsgZSlcbiAgICBjYWxsYmFjaygpXG4gIH0gXG59XG5cbi8vKioqKioqKioqKlxuZnVuY3Rpb24gcnVuU2NyaXB0KHNjcmlwdFBhdGgsIGNhbGxiYWNrKSB7XG4gIHZhciBjaGlsZFByb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG4gIC8vIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBjYWxsYmFjayBoYXMgYmVlbiBpbnZva2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgaW52b2NhdGlvbnNcbiAgdmFyIGludm9rZWQgPSBmYWxzZTtcbiAgdmFyIHByb2Nlc3MgPSBjaGlsZFByb2Nlc3MuZm9yayhzY3JpcHRQYXRoKTtcbiAgLy8gbGlzdGVuIGZvciBlcnJvcnMgYXMgdGhleSBtYXkgcHJldmVudCB0aGUgZXhpdCBldmVudCBmcm9tIGZpcmluZ1xuICBwcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xuICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjayBvbmNlIHRoZSBwcm9jZXNzIGhhcyBmaW5pc2hlZCBydW5uaW5nXG4gIHByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZSkge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgdmFyIGVyciA9IGNvZGUgPT09IDAgPyBudWxsIDogbmV3IEVycm9yKCdleGl0IGNvZGUgJyArIGNvZGUpO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfdG9YdHlwZShzdHIpIHtcbiAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL18vZywgJy0nKVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0QXBwKCkge1xuICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gIHZhciBwcmVmaXggPSBgYFxuICBjb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKVxuICBpZiAocGxhdGZvcm0gPT0gJ2RhcndpbicpIHsgcHJlZml4ID0gYOKEuSDvvaJleHTvvaM6YCB9XG4gIGVsc2UgeyBwcmVmaXggPSBgaSBbZXh0XTpgIH1cbiAgcmV0dXJuIGAke2NoYWxrLmdyZWVuKHByZWZpeCl9IGBcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2dldFZlcnNpb25zKHBsdWdpbk5hbWUsIGZyYW1ld29ya05hbWUpIHtcbiAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgdmFyIHYgPSB7fVxuICB2YXIgcGx1Z2luUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQHNlbmNoYScsIHBsdWdpbk5hbWUpXG4gIHZhciBwbHVnaW5Qa2cgPSAoZnMuZXhpc3RzU3luYyhwbHVnaW5QYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGx1Z2luUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYucGx1Z2luVmVyc2lvbiA9IHBsdWdpblBrZy52ZXJzaW9uXG4gIHYuX3Jlc29sdmVkID0gcGx1Z2luUGtnLl9yZXNvbHZlZFxuICBpZiAodi5fcmVzb2x2ZWQgPT0gdW5kZWZpbmVkKSB7XG4gICAgdi5lZGl0aW9uID0gYENvbW1lcmNpYWxgXG4gIH1cbiAgZWxzZSB7XG4gICAgaWYgKC0xID09IHYuX3Jlc29sdmVkLmluZGV4T2YoJ2NvbW11bml0eScpKSB7XG4gICAgICB2LmVkaXRpb24gPSBgQ29tbWVyY2lhbGBcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2LmVkaXRpb24gPSBgQ29tbXVuaXR5YFxuICAgIH1cbiAgfVxuICB2YXIgd2VicGFja1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL3dlYnBhY2snKVxuICB2YXIgd2VicGFja1BrZyA9IChmcy5leGlzdHNTeW5jKHdlYnBhY2tQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMod2VicGFja1BhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LndlYnBhY2tWZXJzaW9uID0gd2VicGFja1BrZy52ZXJzaW9uXG4gIHZhciBleHRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dCcpXG4gIHZhciBleHRQa2cgPSAoZnMuZXhpc3RzU3luYyhleHRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZXh0UGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYuZXh0VmVyc2lvbiA9IGV4dFBrZy5zZW5jaGEudmVyc2lvblxuICB2YXIgY21kUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLGBub2RlX21vZHVsZXMvQHNlbmNoYS9jbWRgKVxuICB2YXIgY21kUGtnID0gKGZzLmV4aXN0c1N5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXG4gIGlmICh2LmNtZFZlcnNpb24gPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGNtZFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSxgbm9kZV9tb2R1bGVzL0BzZW5jaGEvJHtwbHVnaW5OYW1lfS9ub2RlX21vZHVsZXMvQHNlbmNoYS9jbWRgKVxuICAgIHZhciBjbWRQa2cgPSAoZnMuZXhpc3RzU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gICAgdi5jbWRWZXJzaW9uID0gY21kUGtnLnZlcnNpb25fZnVsbFxuICB9XG4gIHZhciBmcmFtZXdvcmtJbmZvID0gJydcbiAgIGlmIChmcmFtZXdvcmtOYW1lICE9IHVuZGVmaW5lZCAmJiBmcmFtZXdvcmtOYW1lICE9ICdleHRqcycpIHtcbiAgICB2YXIgZnJhbWV3b3JrUGF0aCA9ICcnXG4gICAgaWYgKGZyYW1ld29ya05hbWUgPT0gJ3JlYWN0Jykge1xuICAgICAgZnJhbWV3b3JrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvcmVhY3QnKVxuICAgIH1cbiAgICBpZiAoZnJhbWV3b3JrTmFtZSA9PSAnYW5ndWxhcicpIHtcbiAgICAgIGZyYW1ld29ya1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL2NvcmUnKVxuICAgIH1cbiAgICB2YXIgZnJhbWV3b3JrUGtnID0gKGZzLmV4aXN0c1N5bmMoZnJhbWV3b3JrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGZyYW1ld29ya1BhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICAgIHYuZnJhbWV3b3JrVmVyc2lvbiA9IGZyYW1ld29ya1BrZy52ZXJzaW9uXG4gICAgZnJhbWV3b3JrSW5mbyA9ICcsICcgKyBmcmFtZXdvcmtOYW1lICsgJyB2JyArIHYuZnJhbWV3b3JrVmVyc2lvblxuICB9XG4gIHJldHVybiAnZXh0LXdlYnBhY2stcGx1Z2luIHYnICsgdi5wbHVnaW5WZXJzaW9uICsgJywgRXh0IEpTIHYnICsgdi5leHRWZXJzaW9uICsgJyAnICsgdi5lZGl0aW9uICsgJyBFZGl0aW9uLCBTZW5jaGEgQ21kIHYnICsgdi5jbWRWZXJzaW9uICsgJywgd2VicGFjayB2JyArIHYud2VicGFja1ZlcnNpb24gKyBmcmFtZXdvcmtJbmZvXG4gfVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBsb2coYXBwLG1lc3NhZ2UpIHtcbiAgdmFyIHMgPSBhcHAgKyBtZXNzYWdlIFxuICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICB0cnkge3Byb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpfWNhdGNoKGUpIHt9XG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpO3Byb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBsb2doKGFwcCxtZXNzYWdlKSB7XG4gIHZhciBoID0gZmFsc2VcbiAgdmFyIHMgPSBhcHAgKyBtZXNzYWdlIFxuICBpZiAoaCA9PSB0cnVlKSB7XG4gICAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgICB0cnkge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKClcbiAgICB9XG4gICAgY2F0Y2goZSkge31cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShzKVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZ3YodmVyYm9zZSwgcykge1xuICBpZiAodmVyYm9zZSA9PSAneWVzJykge1xuICAgIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgfVxuICAgIGNhdGNoKGUpIHt9XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoYC12ZXJib3NlOiAke3N9YClcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbiAgfVxufVxuXG5mdW5jdGlvbiBfZ2V0VmFsaWRhdGVPcHRpb25zKCkge1xuICByZXR1cm4ge1xuICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICBcImZyYW1ld29ya1wiOiAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJ0b29sa2l0XCI6ICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwidGhlbWVcIjogICAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcInByb2ZpbGVcIjogICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJlbnZpcm9ubWVudFwiOiB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwidHJlZXNoYWtlXCI6ICAge1widHlwZVwiOiBbIFwiYm9vbGVhblwiIF19LFxuICAgICAgXCJwb3J0XCI6ICAgICAgICB7XCJ0eXBlXCI6IFsgXCJpbnRlZ2VyXCIgXX0sXG4gICAgICBcImVtaXRcIjogICAgICAgIHtcInR5cGVcIjogWyBcImJvb2xlYW5cIiBdfSxcbiAgICAgIFwiYnJvd3NlclwiOiAgICAge1widHlwZVwiOiBbIFwiYm9vbGVhblwiIF19LFxuICAgICAgXCJ3YXRjaFwiOiAgICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwidmVyYm9zZVwiOiAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcInNjcmlwdFwiOiAgICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJwYWNrYWdlc1wiOiAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiwgXCJhcnJheVwiIF19XG4gICAgfSxcbiAgICBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCI6IGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24gX2dldERlZmF1bHRPcHRpb25zKCkge1xuICByZXR1cm4ge1xuICAgIGZyYW1ld29yazogbnVsbCxcbiAgICB0b29sa2l0OiAnbW9kZXJuJyxcbiAgICB0aGVtZTogJ3RoZW1lLW1hdGVyaWFsJyxcbiAgICBwcm9maWxlOiAnZGVza3RvcCcsIFxuICAgIGVudmlyb25tZW50OiAnZGV2ZWxvcG1lbnQnLCBcbiAgICB0cmVlc2hha2U6IGZhbHNlLFxuICAgIHBvcnQ6IDE5NjIsXG4gICAgZW1pdDogdHJ1ZSxcbiAgICBicm93c2VyOiB0cnVlLFxuICAgIHdhdGNoOiAneWVzJyxcbiAgICB2ZXJib3NlOiAnbm8nLFxuICAgIHNjcmlwdDogbnVsbCxcbiAgICBwYWNrYWdlczogbnVsbFxuICB9XG59XG5cbmZ1bmN0aW9uIF9nZXREZWZhdWx0VmFycygpIHtcbiAgcmV0dXJuIHtcbiAgICB3YXRjaFN0YXJ0ZWQgOiBmYWxzZSxcbiAgICBidWlsZHN0ZXA6ICcxIG9mIDEnLFxuICAgIGZpcnN0VGltZSA6IHRydWUsXG4gICAgZmlyc3RDb21waWxlOiB0cnVlLFxuICAgIGJyb3dzZXJDb3VudCA6IDAsXG4gICAgbWFuaWZlc3Q6IG51bGwsXG4gICAgZXh0UGF0aDogJ2V4dC1hbmd1bGFyJyxcbiAgICBwbHVnaW5FcnJvcnM6IFtdLFxuICAgIGRlcHM6IFtdLFxuICAgIHVzZWRFeHRDb21wb25lbnRzOiBbXSxcbiAgICByZWJ1aWxkOiB0cnVlXG4gIH1cbn1cblxuIl19