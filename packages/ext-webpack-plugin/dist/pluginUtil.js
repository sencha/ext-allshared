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
exports.log = log;
exports.logh = logh;
exports.logv = logv;
exports._getApp = _getApp;
exports._getVersions = _getVersions;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//**********
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


function _constructor(options) {
  const fs = require('fs');

  var thisVars = {};
  var thisOptions = {};
  var plugin = {};

  if (options.framework == undefined) {
    thisVars.pluginErrors = [];
    thisVars.pluginErrors.push('webpack config: framework parameter on ext-webpack-plugin is not defined - values: react, angular, extjs');
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

    default:
      thisVars.pluginName = 'ext-webpack-plugin';
  }

  thisVars.app = require('./pluginUtil')._getApp();

  require(`./pluginUtil`).log(thisVars.app + `HOOK constructor`);

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

  if (thisVars.production == true && thisOptions.treeshake == true && options.framework == 'angular') {
    log(thisVars.app + 'Production Build Step 1');
    thisVars.buildstep = 1;

    require(`./angularUtil`)._toProd(thisVars, thisOptions);
  }

  if (thisVars.production == true && thisOptions.treeshake == false && options.framework == 'angular') {
    log(thisVars.app + '(check for prod folder and module change)');
    log(thisVars.app + 'Production Build Step 2');
    thisVars.buildstep = 2;
  }

  if (thisVars.buildstep == 0) {
    log(thisVars.app + 'Development Build');
  } //mjg log(require('./pluginUtil')._getVersions(thisVars.app, thisVars.pluginName, thisVars.framework))


  logv(thisVars.app + 'Building for ' + thisOptions.environment + ', ' + 'Treeshake is ' + thisOptions.treeshake);
  plugin.vars = thisVars;
  plugin.options = thisOptions;

  require('./pluginUtil').logv(options, 'FUNCTION _constructor');

  return plugin;
} //**********


function _thisCompilation(compiler, compilation, vars, options) {
  try {
    require('./pluginUtil').logv(options, 'FUNCTION _thisCompilation');

    if (vars.buildstep == 0 || vars.buildstep == 1) {
      if (options.script != undefined) {
        if (options.script != null) {
          runScript(options.script, function (err) {
            if (err) throw err;

            require('./pluginUtil').logv(vars.app + `Finished running ${options.script}`);
          });
        }
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
        if (options.framework == 'angular' && options.treeshake == true) {
          extComponents = require('./angularUtil')._getAllComponents(vars, options);
        }

        compilation.hooks.succeedModule.tap(`ext-succeed-module`, module => {
          if (module.resource && !module.resource.match(/node_modules/)) {
            if (module.resource.match(/\.html$/) != null) {
              if (module._source._value.toLowerCase().includes('doctype html') == false) {
                vars.deps = [...(vars.deps || []), ...require(`./${vars.framework}Util`).extractFromSource(module, options, compilation, extComponents)];
              }
            } else {
              vars.deps = [...(vars.deps || []), ...require(`./${vars.framework}Util`).extractFromSource(module, options, compilation, extComponents)];
            }
          }
        });

        if (options.framework == 'angular' && options.treeshake == true) {
          compilation.hooks.finishModules.tap(`ext-finish-modules`, modules => {
            require('./angularUtil')._writeFilesToProdFolder(vars, options);
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
      require('./pluginUtil').log(vars.app + ` Development Build Completed`);
    }

    if (vars.buildstep == 2) {
      require('./pluginUtil').log(vars.app + `Production Build Completed`);
    }
  } catch (e) {
    require('./pluginUtil').logv(options, e);
  }
} //**********


function executeAsync(_x6, _x7, _x8, _x9, _x10, _x11) {
  return _executeAsync.apply(this, arguments);
}

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

function log(s) {
  require('readline').cursorTo(process.stdout, 0);

  try {
    process.stdout.clearLine();
  } catch (e) {}

  process.stdout.write(s);
  process.stdout.write('\n');
}

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
}

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
}

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
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbInJ1blNjcmlwdCIsInNjcmlwdFBhdGgiLCJjYWxsYmFjayIsImNoaWxkUHJvY2VzcyIsInJlcXVpcmUiLCJpbnZva2VkIiwicHJvY2VzcyIsImZvcmsiLCJvbiIsImVyciIsImNvZGUiLCJFcnJvciIsIl9jb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJmcyIsInRoaXNWYXJzIiwidGhpc09wdGlvbnMiLCJwbHVnaW4iLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwidmFycyIsInZhbGlkYXRlT3B0aW9ucyIsImdldFZhbGlkYXRlT3B0aW9ucyIsImdldERlZmF1bHRWYXJzIiwicGx1Z2luTmFtZSIsImFwcCIsIl9nZXRBcHAiLCJsb2ciLCJsb2d2IiwicmMiLCJleGlzdHNTeW5jIiwiSlNPTiIsInBhcnNlIiwicmVhZEZpbGVTeW5jIiwiZ2V0RGVmYXVsdE9wdGlvbnMiLCJzdHJpbmdpZnkiLCJlbnZpcm9ubWVudCIsInByb2R1Y3Rpb24iLCJ0cmVlc2hha2UiLCJidWlsZHN0ZXAiLCJfdG9Qcm9kIiwiX3RoaXNDb21waWxhdGlvbiIsImNvbXBpbGVyIiwiY29tcGlsYXRpb24iLCJzY3JpcHQiLCJlIiwiZXJyb3JzIiwiX2NvbXBpbGF0aW9uIiwiZXh0Q29tcG9uZW50cyIsIl9nZXRBbGxDb21wb25lbnRzIiwiaG9va3MiLCJzdWNjZWVkTW9kdWxlIiwidGFwIiwibW9kdWxlIiwicmVzb3VyY2UiLCJtYXRjaCIsIl9zb3VyY2UiLCJfdmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiZGVwcyIsImV4dHJhY3RGcm9tU291cmNlIiwiZmluaXNoTW9kdWxlcyIsIm1vZHVsZXMiLCJfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciIsImh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24iLCJkYXRhIiwicGF0aCIsImpzUGF0aCIsImpvaW4iLCJleHRQYXRoIiwiY3NzUGF0aCIsImFzc2V0cyIsImpzIiwidW5zaGlmdCIsImNzcyIsIl9hZnRlckNvbXBpbGUiLCJfZW1pdCIsImVtaXQiLCJfYnVpbGRFeHRCdW5kbGUiLCJvdXRwdXRQYXRoIiwiZGV2U2VydmVyIiwiY29udGVudEJhc2UiLCJfcHJlcGFyZUZvckJ1aWxkIiwiY29tbWFuZCIsIndhdGNoIiwicmVidWlsZCIsInBhcm1zIiwicHJvZmlsZSIsIndhdGNoU3RhcnRlZCIsIm91dHB1dCIsInJpbXJhZiIsIm1rZGlycCIsImZzeCIsInBhY2thZ2VzIiwidG9vbGtpdCIsInRoZW1lIiwiZmlyc3RUaW1lIiwic3luYyIsImJ1aWxkWE1MIiwiY3JlYXRlQXBwSnNvbiIsImNyZWF0ZVdvcmtzcGFjZUpzb24iLCJjcmVhdGVKU0RPTUVudmlyb25tZW50Iiwid3JpdGVGaWxlU3luYyIsImN3ZCIsImZyb21QYXRoIiwidG9QYXRoIiwiY29weVN5bmMiLCJyZXBsYWNlIiwiZnJvbVJlc291cmNlcyIsInRvUmVzb3VyY2VzIiwibWFuaWZlc3QiLCJidW5kbGVEaXIiLCJ0cmltIiwic2VuY2hhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbkJ1aWxkRG9uZSIsIm9wdHMiLCJzaWxlbnQiLCJzdGRpbyIsImVuY29kaW5nIiwiZXhlY3V0ZUFzeW5jIiwidGhlbiIsInJlYXNvbiIsImNvbnNvbGUiLCJfZG9uZSIsIl90b0RldiIsImJyb3dzZXIiLCJicm93c2VyQ291bnQiLCJ1cmwiLCJwb3J0Iiwib3BuIiwiREVGQVVMVF9TVUJTVFJTIiwic3Vic3RyaW5ncyIsImNoYWxrIiwiY3Jvc3NTcGF3biIsImNoaWxkIiwic2lnbmFsIiwiZXJyb3IiLCJzdGRvdXQiLCJzdHIiLCJ0b1N0cmluZyIsImZpbGVuYW1lIiwic29tZSIsInYiLCJpbmRleE9mIiwicmVkIiwic3RkZXJyIiwic3RySmF2YU9wdHMiLCJzIiwiY3Vyc29yVG8iLCJjbGVhckxpbmUiLCJ3cml0ZSIsImxvZ2giLCJoIiwidmVyYm9zZSIsInByZWZpeCIsInBsYXRmb3JtIiwiZ3JlZW4iLCJfZ2V0VmVyc2lvbnMiLCJmcmFtZXdvcmtOYW1lIiwicGx1Z2luUGF0aCIsInBsdWdpblBrZyIsInBsdWdpblZlcnNpb24iLCJ2ZXJzaW9uIiwiX3Jlc29sdmVkIiwiZWRpdGlvbiIsIndlYnBhY2tQYXRoIiwid2VicGFja1BrZyIsIndlYnBhY2tWZXJzaW9uIiwiZXh0UGtnIiwiZXh0VmVyc2lvbiIsImNtZFBhdGgiLCJjbWRQa2ciLCJjbWRWZXJzaW9uIiwidmVyc2lvbl9mdWxsIiwiZnJhbWV3b3JrSW5mbyIsImZyYW1ld29ya1BhdGgiLCJmcmFtZXdvcmtQa2ciLCJmcmFtZXdvcmtWZXJzaW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQSxTQUFTQSxTQUFULENBQW1CQyxVQUFuQixFQUErQkMsUUFBL0IsRUFBeUM7QUFDdkMsTUFBSUMsWUFBWSxHQUFHQyxPQUFPLENBQUMsZUFBRCxDQUExQixDQUR1QyxDQUV2Qzs7O0FBQ0EsTUFBSUMsT0FBTyxHQUFHLEtBQWQ7QUFDQSxNQUFJQyxPQUFPLEdBQUdILFlBQVksQ0FBQ0ksSUFBYixDQUFrQk4sVUFBbEIsQ0FBZCxDQUp1QyxDQUt2Qzs7QUFDQUssRUFBQUEsT0FBTyxDQUFDRSxFQUFSLENBQVcsT0FBWCxFQUFvQixVQUFVQyxHQUFWLEVBQWU7QUFDakMsUUFBSUosT0FBSixFQUFhO0FBQ2JBLElBQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0FILElBQUFBLFFBQVEsQ0FBQ08sR0FBRCxDQUFSO0FBQ0QsR0FKRCxFQU51QyxDQVd2Qzs7QUFDQUgsRUFBQUEsT0FBTyxDQUFDRSxFQUFSLENBQVcsTUFBWCxFQUFtQixVQUFVRSxJQUFWLEVBQWdCO0FBQ2pDLFFBQUlMLE9BQUosRUFBYTtBQUNiQSxJQUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNBLFFBQUlJLEdBQUcsR0FBR0MsSUFBSSxLQUFLLENBQVQsR0FBYSxJQUFiLEdBQW9CLElBQUlDLEtBQUosQ0FB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RUFBM0k7QUFDQWpDLElBQUFBLENBQUMsQ0FBQ21DLGdCQUFGLEdBQXFCRCxZQUFZLENBQUNkLE9BQWxDO0FBQ0FZLElBQUFBLGFBQWEsR0FBRyxPQUFPaEIsYUFBUCxHQUF1QixJQUF2QixHQUE4QmhCLENBQUMsQ0FBQ21DLGdCQUFoRDtBQUNEOztBQUNELFNBQU81SixHQUFHLEdBQUcsc0JBQU4sR0FBK0J5SCxDQUFDLENBQUNtQixhQUFqQyxHQUFpRCxZQUFqRCxHQUFnRW5CLENBQUMsQ0FBQzJCLFVBQWxFLEdBQStFLEdBQS9FLEdBQXFGM0IsQ0FBQyxDQUFDc0IsT0FBdkYsR0FBaUcsd0JBQWpHLEdBQTRIdEIsQ0FBQyxDQUFDOEIsVUFBOUgsR0FBMkksYUFBM0ksR0FBMko5QixDQUFDLENBQUN5QixjQUE3SixHQUE4S08sYUFBckw7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIlxuLy8qKioqKioqKioqXG5mdW5jdGlvbiBydW5TY3JpcHQoc2NyaXB0UGF0aCwgY2FsbGJhY2spIHtcbiAgdmFyIGNoaWxkUHJvY2VzcyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcbiAgLy8ga2VlcCB0cmFjayBvZiB3aGV0aGVyIGNhbGxiYWNrIGhhcyBiZWVuIGludm9rZWQgdG8gcHJldmVudCBtdWx0aXBsZSBpbnZvY2F0aW9uc1xuICB2YXIgaW52b2tlZCA9IGZhbHNlO1xuICB2YXIgcHJvY2VzcyA9IGNoaWxkUHJvY2Vzcy5mb3JrKHNjcmlwdFBhdGgpO1xuICAvLyBsaXN0ZW4gZm9yIGVycm9ycyBhcyB0aGV5IG1heSBwcmV2ZW50IHRoZSBleGl0IGV2ZW50IGZyb20gZmlyaW5nXG4gIHByb2Nlc3Mub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfSk7XG4gIC8vIGV4ZWN1dGUgdGhlIGNhbGxiYWNrIG9uY2UgdGhlIHByb2Nlc3MgaGFzIGZpbmlzaGVkIHJ1bm5pbmdcbiAgcHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uIChjb2RlKSB7XG4gICAgaWYgKGludm9rZWQpIHJldHVybjtcbiAgICBpbnZva2VkID0gdHJ1ZTtcbiAgICB2YXIgZXJyID0gY29kZSA9PT0gMCA/IG51bGwgOiBuZXcgRXJyb3IoJ2V4aXQgY29kZSAnICsgY29kZSk7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfSk7XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuIFxuICB2YXIgdGhpc1ZhcnMgPSB7fVxuICB2YXIgdGhpc09wdGlvbnMgPSB7fVxuICB2YXIgcGx1Z2luID0ge31cblxuICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1ZhcnMucGx1Z2luRXJyb3JzID0gW11cbiAgICB0aGlzVmFycy5wbHVnaW5FcnJvcnMucHVzaCgnd2VicGFjayBjb25maWc6IGZyYW1ld29yayBwYXJhbWV0ZXIgb24gZXh0LXdlYnBhY2stcGx1Z2luIGlzIG5vdCBkZWZpbmVkIC0gdmFsdWVzOiByZWFjdCwgYW5ndWxhciwgZXh0anMnKVxuICAgIHBsdWdpbi52YXJzID0gdGhpc1ZhcnNcbiAgICByZXR1cm4gcGx1Z2luXG4gIH1cblxuICBjb25zdCB2YWxpZGF0ZU9wdGlvbnMgPSByZXF1aXJlKCdzY2hlbWEtdXRpbHMnKVxuICB2YWxpZGF0ZU9wdGlvbnMocmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5nZXRWYWxpZGF0ZU9wdGlvbnMoKSwgb3B0aW9ucywgJycpXG4gIHRoaXNWYXJzID0gcmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5nZXREZWZhdWx0VmFycygpXG4gIHRoaXNWYXJzLmZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gIHN3aXRjaCh0aGlzVmFycy5mcmFtZXdvcmspIHtcbiAgICBjYXNlICdleHRqcyc6XG4gICAgICB0aGlzVmFycy5wbHVnaW5OYW1lID0gJ2V4dC13ZWJwYWNrLXBsdWdpbidcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3JlYWN0JzpcbiAgICAgIHRoaXNWYXJzLnBsdWdpbk5hbWUgPSAnZXh0LXJlYWN0LXdlYnBhY2stcGx1Z2luJ1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnYW5ndWxhcic6XG4gICAgICB0aGlzVmFycy5wbHVnaW5OYW1lID0gJ2V4dC1hbmd1bGFyLXdlYnBhY2stcGx1Z2luJ1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXNWYXJzLnBsdWdpbk5hbWUgPSAnZXh0LXdlYnBhY2stcGx1Z2luJ1xuICB9XG5cbiAgdGhpc1ZhcnMuYXBwID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykuX2dldEFwcCgpXG4gIHJlcXVpcmUoYC4vcGx1Z2luVXRpbGApLmxvZyh0aGlzVmFycy5hcHAgKyBgSE9PSyBjb25zdHJ1Y3RvcmApXG5cbiAgbG9ndihvcHRpb25zLCBgcGx1Z2luTmFtZSAtICR7dGhpc1ZhcnMucGx1Z2luTmFtZX1gKVxuICBsb2d2KG9wdGlvbnMsIGB0aGlzVmFycy5hcHAgLSAke3RoaXNWYXJzLmFwcH1gKVxuXG4gIGNvbnN0IHJjID0gKGZzLmV4aXN0c1N5bmMoYC5leHQtJHt0aGlzVmFycy5mcmFtZXdvcmt9cmNgKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhgLmV4dC0ke3RoaXNWYXJzLmZyYW1ld29ya31yY2AsICd1dGYtOCcpKSB8fCB7fSlcbiAgdGhpc09wdGlvbnMgPSB7IC4uLnJlcXVpcmUoYC4vJHt0aGlzVmFycy5mcmFtZXdvcmt9VXRpbGApLmdldERlZmF1bHRPcHRpb25zKCksIC4uLm9wdGlvbnMsIC4uLnJjIH1cbiAgbG9ndihvcHRpb25zLCBgdGhpc09wdGlvbnMgLSAke0pTT04uc3RyaW5naWZ5KHRoaXNPcHRpb25zKX1gKVxuXG4gIGlmICh0aGlzT3B0aW9ucy5lbnZpcm9ubWVudCA9PSAncHJvZHVjdGlvbicpIFxuICAgIHt0aGlzVmFycy5wcm9kdWN0aW9uID0gdHJ1ZX1cbiAgZWxzZSBcbiAgICB7dGhpc1ZhcnMucHJvZHVjdGlvbiA9IGZhbHNlfVxuICBsb2d2KG9wdGlvbnMsIGB0aGlzVmFycyAtICR7SlNPTi5zdHJpbmdpZnkodGhpc1ZhcnMpfWApXG5cbiAgaWYgKHRoaXNWYXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSAmJiB0aGlzT3B0aW9ucy50cmVlc2hha2UgPT0gdHJ1ZSAmJiBvcHRpb25zLmZyYW1ld29yayA9PSAnYW5ndWxhcicpIHtcbiAgICBsb2codGhpc1ZhcnMuYXBwICsgJ1Byb2R1Y3Rpb24gQnVpbGQgU3RlcCAxJylcbiAgICB0aGlzVmFycy5idWlsZHN0ZXAgPSAxXG4gICAgcmVxdWlyZShgLi9hbmd1bGFyVXRpbGApLl90b1Byb2QodGhpc1ZhcnMsIHRoaXNPcHRpb25zKVxuICB9XG4gIGlmICh0aGlzVmFycy5wcm9kdWN0aW9uID09IHRydWUgJiYgdGhpc09wdGlvbnMudHJlZXNoYWtlID09IGZhbHNlICYmIG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJykge1xuICAgIGxvZyh0aGlzVmFycy5hcHAgKyAnKGNoZWNrIGZvciBwcm9kIGZvbGRlciBhbmQgbW9kdWxlIGNoYW5nZSknKVxuICAgIGxvZyh0aGlzVmFycy5hcHAgKyAnUHJvZHVjdGlvbiBCdWlsZCBTdGVwIDInKVxuICAgIHRoaXNWYXJzLmJ1aWxkc3RlcCA9IDJcbiAgfVxuICBpZiAodGhpc1ZhcnMuYnVpbGRzdGVwID09IDApIHtcbiAgICBsb2codGhpc1ZhcnMuYXBwICsgJ0RldmVsb3BtZW50IEJ1aWxkJylcbiAgfVxuXG4gIC8vbWpnIGxvZyhyZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5fZ2V0VmVyc2lvbnModGhpc1ZhcnMuYXBwLCB0aGlzVmFycy5wbHVnaW5OYW1lLCB0aGlzVmFycy5mcmFtZXdvcmspKVxuICBsb2d2KHRoaXNWYXJzLmFwcCArICdCdWlsZGluZyBmb3IgJyArIHRoaXNPcHRpb25zLmVudmlyb25tZW50ICsgJywgJyArICdUcmVlc2hha2UgaXMgJyArIHRoaXNPcHRpb25zLnRyZWVzaGFrZSlcblxuICBwbHVnaW4udmFycyA9IHRoaXNWYXJzXG4gIHBsdWdpbi5vcHRpb25zID0gdGhpc09wdGlvbnNcbiAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnRlVOQ1RJT04gX2NvbnN0cnVjdG9yJylcblxuICByZXR1cm4gcGx1Z2luXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF90aGlzQ29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnRlVOQ1RJT04gX3RoaXNDb21waWxhdGlvbicpXG4gXG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09IDAgfHwgdmFycy5idWlsZHN0ZXAgPT0gMSkge1xuICAgICAgaWYgKG9wdGlvbnMuc2NyaXB0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gbnVsbCkge1xuICAgICAgICAgIHJ1blNjcmlwdChvcHRpb25zLnNjcmlwdCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndih2YXJzLmFwcCArIGBGaW5pc2hlZCBydW5uaW5nICR7b3B0aW9ucy5zY3JpcHR9YClcbiAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ190aGlzQ29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsICdGVU5DVElPTiBfY29tcGlsYXRpb24nKVxuXG4gICAgaWYgKG9wdGlvbnMuZnJhbWV3b3JrICE9ICdleHRqcycpIHtcbiAgICAgIHZhciBleHRDb21wb25lbnRzID0gW11cbiAgICAgIGlmICh2YXJzLnByb2R1Y3Rpb24pIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJyAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSB0cnVlKSB7XG4gICAgICAgICAgZXh0Q29tcG9uZW50cyA9IHJlcXVpcmUoJy4vYW5ndWxhclV0aWwnKS5fZ2V0QWxsQ29tcG9uZW50cyh2YXJzLCBvcHRpb25zKVxuICAgICAgICB9XG4gICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLnN1Y2NlZWRNb2R1bGUudGFwKGBleHQtc3VjY2VlZC1tb2R1bGVgLCBtb2R1bGUgPT4ge1xuICAgICAgICAgIGlmIChtb2R1bGUucmVzb3VyY2UgJiYgIW1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvbm9kZV9tb2R1bGVzLykpIHtcbiAgICAgICAgICAgIGlmKG1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvXFwuaHRtbCQvKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIGlmKG1vZHVsZS5fc291cmNlLl92YWx1ZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdkb2N0eXBlIGh0bWwnKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFsuLi4odmFycy5kZXBzIHx8IFtdKSwgLi4ucmVxdWlyZShgLi8ke3ZhcnMuZnJhbWV3b3JrfVV0aWxgKS5leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFsuLi4odmFycy5kZXBzIHx8IFtdKSwgLi4ucmVxdWlyZShgLi8ke3ZhcnMuZnJhbWV3b3JrfVV0aWxgKS5leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGlmIChvcHRpb25zLmZyYW1ld29yayA9PSAnYW5ndWxhcicgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gdHJ1ZSkge1xuICAgICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLmZpbmlzaE1vZHVsZXMudGFwKGBleHQtZmluaXNoLW1vZHVsZXNgLCBtb2R1bGVzID0+IHtcbiAgICAgICAgICAgIHJlcXVpcmUoJy4vYW5ndWxhclV0aWwnKS5fd3JpdGVGaWxlc1RvUHJvZEZvbGRlcih2YXJzLCBvcHRpb25zKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCAhPSAxKSB7XG4gICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLmh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24udGFwKGBleHQtaHRtbC1nZW5lcmF0aW9uYCwoZGF0YSkgPT4ge1xuICAgICAgICAgIGxvZ3Yob3B0aW9ucywnaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbicpXG4gICAgICAgICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgICAgIHZhciBqc1BhdGggPSBwYXRoLmpvaW4odmFycy5leHRQYXRoLCAnZXh0LmpzJylcbiAgICAgICAgICB2YXIgY3NzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuY3NzJylcbiAgICAgICAgICBkYXRhLmFzc2V0cy5qcy51bnNoaWZ0KGpzUGF0aClcbiAgICAgICAgICBkYXRhLmFzc2V0cy5jc3MudW5zaGlmdChjc3NQYXRoKVxuICAgICAgICAgIGxvZyh2YXJzLmFwcCArIGBBZGRpbmcgJHtqc1BhdGh9IGFuZCAke2Nzc1BhdGh9IHRvIGluZGV4Lmh0bWxgKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19jb21waWxhdGlvbjogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2FmdGVyQ29tcGlsZShjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZScpXG4gIGlmIChvcHRpb25zLmZyYW1ld29yayA9PSAnZXh0anMnKSB7XG4gICAgICAgIHJlcXVpcmUoYC4vZXh0anNVdGlsYCkuX2FmdGVyQ29tcGlsZShjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucylcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZW1pdChjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9lbWl0JylcblxuXG4gICAgdmFyIGVtaXQgPSBvcHRpb25zLmVtaXRcbiAgICB2YXIgdHJlZXNoYWtlID0gb3B0aW9ucy50cmVlc2hha2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICB2YXIgZW52aXJvbm1lbnQgPSAgb3B0aW9ucy5lbnZpcm9ubWVudFxuXG4gICAgaWYgKGVtaXQpIHtcbiAgICAgIGlmICgoZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nICYmIHRyZWVzaGFrZSA9PSB0cnVlICAmJiBmcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB8fFxuICAgICAgICAgIChlbnZpcm9ubWVudCAhPSAncHJvZHVjdGlvbicgJiYgdHJlZXNoYWtlID09IGZhbHNlICYmIGZyYW1ld29yayA9PSAnYW5ndWxhcicpIHx8XG4gICAgICAgICAgKGZyYW1ld29yayA9PSAncmVhY3QnKSB8fFxuICAgICAgICAgIChmcmFtZXdvcmsgPT0gJ2NvbXBvbmVudHMnKVxuICAgICAgKSB7XG4gICAgICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgICAgICB2YXIgZnJhbWV3b3JrID0gdmFycy5mcmFtZXdvcmtcbiAgICAgICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgICBjb25zdCBfYnVpbGRFeHRCdW5kbGUgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5fYnVpbGRFeHRCdW5kbGVcbiAgICAgICAgbGV0IG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3V0cHV0UGF0aCx2YXJzLmV4dFBhdGgpXG4gICAgICAgIGlmIChjb21waWxlci5vdXRwdXRQYXRoID09PSAnLycgJiYgY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIpIHtcbiAgICAgICAgICBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGNvbXBpbGVyLm9wdGlvbnMuZGV2U2VydmVyLmNvbnRlbnRCYXNlLCBvdXRwdXRQYXRoKVxuICAgICAgICB9XG4gICAgICAgIGxvZ3Yob3B0aW9ucywnb3V0cHV0UGF0aDogJyArIG91dHB1dFBhdGgpXG4gICAgICAgIGxvZ3Yob3B0aW9ucywnZnJhbWV3b3JrOiAnICsgZnJhbWV3b3JrKVxuICAgICAgICBpZiAoZnJhbWV3b3JrICE9ICdleHRqcycpIHtcbiAgICAgICAgICBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0UGF0aCwgY29tcGlsYXRpb24pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJyAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dFBhdGgsIGNvbXBpbGF0aW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbW1hbmQgPSAnJ1xuICAgICAgICBpZiAob3B0aW9ucy53YXRjaCA9PSAneWVzJyAmJiB2YXJzLnByb2R1Y3Rpb24gPT0gZmFsc2UpIHtcbiAgICAgICAgICBjb21tYW5kID0gJ3dhdGNoJ1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNvbW1hbmQgPSAnYnVpbGQnXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhcnMucmVidWlsZCA9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHBhcm1zID0gW11cbiAgICAgICAgICBpZiAob3B0aW9ucy5wcm9maWxlID09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnByb2ZpbGUgPT0gJycgfHwgb3B0aW9ucy5wcm9maWxlID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMuZW52aXJvbm1lbnRdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT0gJ2J1aWxkJykge1xuICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgb3B0aW9ucy5wcm9maWxlLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHBhcm1zID0gWydhcHAnLCBjb21tYW5kLCAnLS13ZWItc2VydmVyJywgJ2ZhbHNlJywgb3B0aW9ucy5wcm9maWxlLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh2YXJzLndhdGNoU3RhcnRlZCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgYXdhaXQgX2J1aWxkRXh0QnVuZGxlKGFwcCwgY29tcGlsYXRpb24sIG91dHB1dFBhdGgsIHBhcm1zLCBvcHRpb25zKVxuICAgICAgICAgICAgdmFycy53YXRjaFN0YXJ0ZWQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBsb2d2KG9wdGlvbnMsJ05PVCBydW5uaW5nIGVtaXQnKVxuICAgICAgICBjYWxsYmFjaygpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndihvcHRpb25zLCdlbWl0IGlzIGZhbHNlJylcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdlbWl0OiAnICsgZSlcbiAgICBjYWxsYmFjaygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dCwgY29tcGlsYXRpb24pIHtcbiAgdHJ5IHtcbiAgICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9wcmVwYXJlRm9yQnVpbGQnKVxuICAgIGNvbnN0IHJpbXJhZiA9IHJlcXVpcmUoJ3JpbXJhZicpXG4gICAgY29uc3QgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJylcbiAgICBjb25zdCBmc3ggPSByZXF1aXJlKCdmcy1leHRyYScpXG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG4gICAgdmFyIHBhY2thZ2VzID0gb3B0aW9ucy5wYWNrYWdlc1xuICAgIHZhciB0b29sa2l0ID0gb3B0aW9ucy50b29sa2l0XG4gICAgdmFyIHRoZW1lID0gb3B0aW9ucy50aGVtZVxuXG4gICAgdGhlbWUgPSB0aGVtZSB8fCAodG9vbGtpdCA9PT0gJ2NsYXNzaWMnID8gJ3RoZW1lLXRyaXRvbicgOiAndGhlbWUtbWF0ZXJpYWwnKVxuICAgIGxvZ3Yob3B0aW9ucywnZmlyc3RUaW1lOiAnICsgdmFycy5maXJzdFRpbWUpXG4gICAgaWYgKHZhcnMuZmlyc3RUaW1lKSB7XG4gICAgICByaW1yYWYuc3luYyhvdXRwdXQpXG4gICAgICBta2RpcnAuc3luYyhvdXRwdXQpXG4gICAgICBjb25zdCBidWlsZFhNTCA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuYnVpbGRYTUxcbiAgICAgIGNvbnN0IGNyZWF0ZUFwcEpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUFwcEpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZVdvcmtzcGFjZUpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZVdvcmtzcGFjZUpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZUpTRE9NRW52aXJvbm1lbnQgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUpTRE9NRW52aXJvbm1lbnRcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnYnVpbGQueG1sJyksIGJ1aWxkWE1MKHZhcnMucHJvZHVjdGlvbiwgb3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnYXBwLmpzb24nKSwgY3JlYXRlQXBwSnNvbih0aGVtZSwgcGFja2FnZXMsIHRvb2xraXQsIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2pzZG9tLWVudmlyb25tZW50LmpzJyksIGNyZWF0ZUpTRE9NRW52aXJvbm1lbnQob3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnd29ya3NwYWNlLmpzb24nKSwgY3JlYXRlV29ya3NwYWNlSnNvbihvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG5cbiAgICAgIHZhciBmcmFtZXdvcmsgPSB2YXJzLmZyYW1ld29yaztcbiAgICAgIC8vYmVjYXVzZSBvZiBhIHByb2JsZW0gd2l0aCBjb2xvcnBpY2tlclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vdXgvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3V4JylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAgKyAnQ29weWluZyAodXgpICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAncGFja2FnZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCArICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdvdmVycmlkZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCArICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwncmVzb3VyY2VzLycpKSkge1xuICAgICAgICB2YXIgZnJvbVJlc291cmNlcyA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncmVzb3VyY2VzLycpXG4gICAgICAgIHZhciB0b1Jlc291cmNlcyA9IHBhdGguam9pbihvdXRwdXQsICcuLi9yZXNvdXJjZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVJlc291cmNlcywgdG9SZXNvdXJjZXMpXG4gICAgICAgIGxvZyhhcHAgKyAnQ29weWluZyAnICsgZnJvbVJlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1Jlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICB9XG4gICAgdmFycy5maXJzdFRpbWUgPSBmYWxzZVxuICAgIHZhciBqcyA9ICcnXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbikge1xuICAgICAganMgPSB2YXJzLmRlcHMuam9pbignO1xcbicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGpzID0gJ0V4dC5yZXF1aXJlKFwiRXh0LipcIiknXG4gICAgfVxuICAgIGlmICh2YXJzLm1hbmlmZXN0ID09PSBudWxsIHx8IGpzICE9PSB2YXJzLm1hbmlmZXN0KSB7XG4gICAgICB2YXJzLm1hbmlmZXN0ID0ganNcbiAgICAgIGNvbnN0IG1hbmlmZXN0ID0gcGF0aC5qb2luKG91dHB1dCwgJ21hbmlmZXN0LmpzJylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMobWFuaWZlc3QsIGpzLCAndXRmOCcpXG4gICAgICB2YXJzLnJlYnVpbGQgPSB0cnVlXG4gICAgICB2YXIgYnVuZGxlRGlyID0gb3V0cHV0LnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpXG4gICAgICBpZiAoYnVuZGxlRGlyLnRyaW0oKSA9PSAnJykge2J1bmRsZURpciA9ICcuLyd9XG4gICAgICBsb2coYXBwICsgJ0J1aWxkaW5nIEV4dCBidW5kbGUgYXQ6ICcgKyBidW5kbGVEaXIpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5yZWJ1aWxkID0gZmFsc2VcbiAgICAgIGxvZyhhcHAgKyAnRXh0IHJlYnVpbGQgTk9UIG5lZWRlZCcpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX3ByZXBhcmVGb3JCdWlsZDogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2J1aWxkRXh0QnVuZGxlKGFwcCwgY29tcGlsYXRpb24sIG91dHB1dFBhdGgsIHBhcm1zLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9idWlsZEV4dEJ1bmRsZScpXG5cbiAgICBsZXQgc2VuY2hhOyB0cnkgeyBzZW5jaGEgPSByZXF1aXJlKCdAc2VuY2hhL2NtZCcpIH0gY2F0Y2ggKGUpIHsgc2VuY2hhID0gJ3NlbmNoYScgfVxuICAgIGlmIChmcy5leGlzdHNTeW5jKHNlbmNoYSkpIHtcbiAgICAgIGxvZ3Yob3B0aW9ucywnc2VuY2hhIGZvbGRlciBleGlzdHMnKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxvZ3Yob3B0aW9ucywnc2VuY2hhIGZvbGRlciBET0VTIE5PVCBleGlzdCcpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IG9uQnVpbGREb25lID0gKCkgPT4ge1xuICAgICAgICBsb2d2KG9wdGlvbnMsJ29uQnVpbGREb25lJylcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9XG5cbiAgICAgIHZhciBvcHRzID0geyBjd2Q6IG91dHB1dFBhdGgsIHNpbGVudDogdHJ1ZSwgc3RkaW86ICdwaXBlJywgZW5jb2Rpbmc6ICd1dGYtOCd9XG4gICAgICBleGVjdXRlQXN5bmMoYXBwLCBzZW5jaGEsIHBhcm1zLCBvcHRzLCBjb21waWxhdGlvbiwgb3B0aW9ucykudGhlbiAoXG4gICAgICAgIGZ1bmN0aW9uKCkgeyBvbkJ1aWxkRG9uZSgpIH0sIFxuICAgICAgICBmdW5jdGlvbihyZWFzb24pIHsgcmVqZWN0KHJlYXNvbikgfVxuICAgICAgKVxuICAgIH0pXG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIGNvbnNvbGUubG9nKCdlJylcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2J1aWxkRXh0QnVuZGxlOiAnICsgZSlcbiAgICBjYWxsYmFjaygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2RvbmUodmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIGNvbnN0IGxvZyA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ1xuICAgIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gICAgbG9ndihvcHRpb25zLCdGVU5DVElPTiBfZG9uZScpXG5cbiAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gZmFsc2UgJiYgb3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICByZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLl90b0Rldih2YXJzLCBvcHRpb25zKVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgaWYob3B0aW9ucy5icm93c2VyID09IHRydWUgJiYgb3B0aW9ucy53YXRjaCA9PSAneWVzJyAmJiB2YXJzLnByb2R1Y3Rpb24gPT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHZhcnMuYnJvd3NlckNvdW50ID09IDApIHtcbiAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6JyArIG9wdGlvbnMucG9ydFxuICAgICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCArIGBPcGVuaW5nIGJyb3dzZXIgYXQgJHt1cmx9YClcbiAgICAgICAgICB2YXJzLmJyb3dzZXJDb3VudCsrXG4gICAgICAgICAgY29uc3Qgb3BuID0gcmVxdWlyZSgnb3BuJylcbiAgICAgICAgICBvcG4odXJsKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgLy9jb21waWxhdGlvbi5lcnJvcnMucHVzaCgnc2hvdyBicm93c2VyIHdpbmRvdyAtIGV4dC1kb25lOiAnICsgZSlcbiAgICB9XG5cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gMCkge1xuICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwICsgYCBEZXZlbG9wbWVudCBCdWlsZCBDb21wbGV0ZWRgKVxuICAgIH1cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gMikge1xuICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwICsgYFByb2R1Y3Rpb24gQnVpbGQgQ29tcGxldGVkYClcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGVBc3luYyAoYXBwLCBjb21tYW5kLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICAvL2NvbnN0IERFRkFVTFRfU1VCU1RSUyA9IFsnW0lORl0gTG9hZGluZycsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFNlcnZlclwiLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgICBjb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbXCJbSU5GXSB4U2VydmVyXCIsICdbSU5GXSBMb2FkaW5nJywgJ1tJTkZdIEFwcGVuZCcsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tJTkZdIFByb2Nlc3NpbmcgQnVpbGQnLCAnW0xPR10gRmFzaGlvbiBidWlsZCBjb21wbGV0ZScsICdbRVJSXScsICdbV1JOXScsIFwiW0lORl0gV3JpdGluZ1wiLCBcIltJTkZdIExvYWRpbmcgQnVpbGRcIiwgXCJbSU5GXSBXYWl0aW5nXCIsIFwiW0xPR10gRmFzaGlvbiB3YWl0aW5nXCJdO1xuICAgIHZhciBzdWJzdHJpbmdzID0gREVGQVVMVF9TVUJTVFJTIFxuICAgIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbiAgICBjb25zdCBjcm9zc1NwYXduID0gcmVxdWlyZSgnY3Jvc3Mtc3Bhd24nKVxuICAgIGNvbnN0IGxvZyA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ1xuICAgIGxvZ3Yob3B0aW9ucywgJ0ZVTkNUSU9OIGV4ZWN1dGVBc3luYycpXG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbG9ndihvcHRpb25zLGBjb21tYW5kIC0gJHtjb21tYW5kfWApXG4gICAgICBsb2d2KG9wdGlvbnMsIGBwYXJtcyAtICR7cGFybXN9YClcbiAgICAgIGxvZ3Yob3B0aW9ucywgYG9wdHMgLSAke0pTT04uc3RyaW5naWZ5KG9wdHMpfWApXG4gICAgICBsZXQgY2hpbGQgPSBjcm9zc1NwYXduKGNvbW1hbmQsIHBhcm1zLCBvcHRzKVxuICAgICAgY2hpbGQub24oJ2Nsb3NlJywgKGNvZGUsIHNpZ25hbCkgPT4ge1xuICAgICAgICBsb2d2KG9wdGlvbnMsIGBvbiBjbG9zZTogYCArIGNvZGUpIFxuICAgICAgICBpZihjb2RlID09PSAwKSB7IHJlc29sdmUoMCkgfVxuICAgICAgICBlbHNlIHsgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goIG5ldyBFcnJvcihjb2RlKSApOyByZXNvbHZlKDApIH1cbiAgICAgIH0pXG4gICAgICBjaGlsZC5vbignZXJyb3InLCAoZXJyb3IpID0+IHsgXG4gICAgICAgIGxvZ3Yob3B0aW9ucywgYG9uIGVycm9yYCkgXG4gICAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGVycm9yKVxuICAgICAgICByZXNvbHZlKDApXG4gICAgICB9KVxuICAgICAgY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXG4gICAgICAgIGxvZ3Yob3B0aW9ucywgYCR7c3RyfWApXG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEudG9TdHJpbmcoKS5tYXRjaCgvRmFzaGlvbiB3YWl0aW5nIGZvciBjaGFuZ2VzXFwuXFwuXFwuLykpIHtcblxuICAgICAgICAgIC8vIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICAgICAgICAvLyB2YXIgZmlsZW5hbWUgPSBwcm9jZXNzLmN3ZCgpKycvc3JjL2luZGV4LmpzJztcbiAgICAgICAgICAvLyB2YXIgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSk7XG4gICAgICAgICAgLy8gZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgZGF0YSArICcgJywgJ3V0ZjgnKVxuICAgICAgICAgIC8vIGxvZ3Yob3B0aW9ucywgYHRvdWNoaW5nICR7ZmlsZW5hbWV9YClcblxuICAgICAgICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICAgICAgICB2YXIgZmlsZW5hbWUgPSBwcm9jZXNzLmN3ZCgpICsgJy9zcmMvaW5kZXguanMnO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSk7XG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVuYW1lLCBkYXRhICsgJyAnLCAndXRmOCcpO1xuICAgICAgICAgICAgbG9nKG9wdGlvbnMsIGB0b3VjaGluZyAke2ZpbGVuYW1lfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgICBsb2cob3B0aW9ucywgYE5PVCB0b3VjaGluZyAke2ZpbGVuYW1lfWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoMClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAoc3Vic3RyaW5ncy5zb21lKGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGRhdGEuaW5kZXhPZih2KSA+PSAwOyB9KSkgeyBcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0lORl1cIiwgXCJcIilcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0xPR11cIiwgXCJcIilcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKS50cmltKClcbiAgICAgICAgICAgIGlmIChzdHIuaW5jbHVkZXMoXCJbRVJSXVwiKSkge1xuICAgICAgICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChhcHAgKyBzdHIucmVwbGFjZSgvXlxcW0VSUlxcXSAvZ2ksICcnKSk7XG4gICAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0VSUl1cIiwgYCR7Y2hhbGsucmVkKFwiW0VSUl1cIil9YClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvZyhgJHthcHB9JHtzdHJ9YCkgXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgbG9ndihvcHRpb25zLCBgZXJyb3Igb24gY2xvc2U6IGAgKyBkYXRhKSBcbiAgICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXG4gICAgICAgIHZhciBzdHJKYXZhT3B0cyA9IFwiUGlja2VkIHVwIF9KQVZBX09QVElPTlNcIjtcbiAgICAgICAgdmFyIGluY2x1ZGVzID0gc3RyLmluY2x1ZGVzKHN0ckphdmFPcHRzKVxuICAgICAgICBpZiAoIWluY2x1ZGVzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7YXBwfSAke2NoYWxrLnJlZChcIltFUlJdXCIpfSAke3N0cn1gKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdleGVjdXRlQXN5bmM6ICcgKyBlKVxuICAgIGNhbGxiYWNrKClcbiAgfSBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhzKSB7XG4gIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gIHRyeSB7XG4gICAgcHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKClcbiAgfVxuICBjYXRjaChlKSB7fVxuICBwcm9jZXNzLnN0ZG91dC53cml0ZShzKVxuICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2gocykge1xuICB2YXIgaCA9IGZhbHNlXG4gIGlmIChoID09IHRydWUpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ3Yob3B0aW9ucywgcykge1xuICBpZiAob3B0aW9ucy52ZXJib3NlID09ICd5ZXMnKSB7XG4gICAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgICB0cnkge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKClcbiAgICB9XG4gICAgY2F0Y2goZSkge31cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShgLXZlcmJvc2U6ICR7c31gKVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZ2V0QXBwKCkge1xuICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gIHZhciBwcmVmaXggPSBgYFxuICBjb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKVxuICBpZiAocGxhdGZvcm0gPT0gJ2RhcndpbicpIHsgcHJlZml4ID0gYOKEuSDvvaJleHTvvaM6YCB9XG4gIGVsc2UgeyBwcmVmaXggPSBgaSBbZXh0XTpgIH1cbiAgcmV0dXJuIGAke2NoYWxrLmdyZWVuKHByZWZpeCl9IGBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRWZXJzaW9ucyhhcHAsIHBsdWdpbk5hbWUsIGZyYW1ld29ya05hbWUpIHtcbiAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcblxuICB2YXIgdiA9IHt9XG4gIHZhciBwbHVnaW5QYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhJywgcGx1Z2luTmFtZSlcbiAgdmFyIHBsdWdpblBrZyA9IChmcy5leGlzdHNTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwbHVnaW5QYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5wbHVnaW5WZXJzaW9uID0gcGx1Z2luUGtnLnZlcnNpb25cbiAgdi5fcmVzb2x2ZWQgPSBwbHVnaW5Qa2cuX3Jlc29sdmVkXG4gIGlmICh2Ll9yZXNvbHZlZCA9PSB1bmRlZmluZWQpIHtcbiAgICB2LmVkaXRpb24gPSBgQ29tbWVyY2lhbGBcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAoLTEgPT0gdi5fcmVzb2x2ZWQuaW5kZXhPZignY29tbXVuaXR5JykpIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tdW5pdHlgXG4gICAgfVxuICB9XG5cbiAgdmFyIHdlYnBhY2tQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy93ZWJwYWNrJylcbiAgdmFyIHdlYnBhY2tQa2cgPSAoZnMuZXhpc3RzU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHdlYnBhY2tQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi53ZWJwYWNrVmVyc2lvbiA9IHdlYnBhY2tQa2cudmVyc2lvblxuXG4gIHZhciBleHRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dCcpXG4gIHZhciBleHRQa2cgPSAoZnMuZXhpc3RzU3luYyhleHRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZXh0UGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYuZXh0VmVyc2lvbiA9IGV4dFBrZy5zZW5jaGEudmVyc2lvblxuXG4gIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gIHZhciBjbWRQa2cgPSAoZnMuZXhpc3RzU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcblxuICBpZiAodi5jbWRWZXJzaW9uID09IHVuZGVmaW5lZCkge1xuICAgIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhLyR7cGx1Z2luTmFtZX0vbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgICB2YXIgY21kUGtnID0gKGZzLmV4aXN0c1N5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICAgIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgfVxuXG4gIHZhciBmcmFtZXdvcmtJbmZvID0gJydcbiAgIGlmIChmcmFtZXdvcmtOYW1lICE9IHVuZGVmaW5lZCAmJiBmcmFtZXdvcmtOYW1lICE9ICdleHRqcycpIHtcbiAgICB2YXIgZnJhbWV3b3JrUGF0aCA9ICcnXG4gICAgaWYgKGZyYW1ld29ya05hbWUgPT0gJ3JlYWN0Jykge1xuICAgICAgZnJhbWV3b3JrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvcmVhY3QnKVxuICAgIH1cbiAgICBpZiAoZnJhbWV3b3JrTmFtZSA9PSAnYW5ndWxhcicpIHtcbiAgICAgIGZyYW1ld29ya1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL2NvcmUnKVxuICAgIH1cbiAgICB2YXIgZnJhbWV3b3JrUGtnID0gKGZzLmV4aXN0c1N5bmMoZnJhbWV3b3JrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGZyYW1ld29ya1BhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICAgIHYuZnJhbWV3b3JrVmVyc2lvbiA9IGZyYW1ld29ya1BrZy52ZXJzaW9uXG4gICAgZnJhbWV3b3JrSW5mbyA9ICcsICcgKyBmcmFtZXdvcmtOYW1lICsgJyB2JyArIHYuZnJhbWV3b3JrVmVyc2lvblxuICB9XG4gIHJldHVybiBhcHAgKyAnZXh0LXdlYnBhY2stcGx1Z2luIHYnICsgdi5wbHVnaW5WZXJzaW9uICsgJywgRXh0IEpTIHYnICsgdi5leHRWZXJzaW9uICsgJyAnICsgdi5lZGl0aW9uICsgJyBFZGl0aW9uLCBTZW5jaGEgQ21kIHYnICsgdi5jbWRWZXJzaW9uICsgJywgd2VicGFjayB2JyArIHYud2VicGFja1ZlcnNpb24gKyBmcmFtZXdvcmtJbmZvXG4gfSJdfQ==