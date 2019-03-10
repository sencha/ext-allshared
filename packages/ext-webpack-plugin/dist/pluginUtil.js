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

  logv(options, `thisVars - ${JSON.stringify(thisVars)}`); //mjg log(require('./pluginUtil')._getVersions(thisVars.app, thisVars.pluginName, thisVars.framework))

  log(thisVars.app + 'Building for ' + thisOptions.environment + ', ' + 'Treeshake is ' + thisOptions.treeshake); //  log(thisVars.app + 'Treeshake is ' + thisOptions.treeshake)

  if (thisVars.production == true && thisOptions.treeshake == true && options.framework == 'angular') {
    require(`./angularUtil`)._toProd(thisVars, thisOptions);
  }

  plugin.vars = thisVars;
  plugin.options = thisOptions;

  require('./pluginUtil').logv(options, 'FUNCTION _constructor');

  return plugin;
} //**********


function _thisCompilation(compiler, compilation, vars, options) {
  try {
    require('./pluginUtil').logv(options, 'FUNCTION _thisCompilation');

    if (options.script != undefined) {
      if (options.script != null) {
        runScript(options.script, function (err) {
          if (err) throw err;

          require('./pluginUtil').log(vars.app + `finished running ${options.script}`);
        });
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
          logv(options, 'framework: ' + framework); //    if (options.emit == true) {

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbInJ1blNjcmlwdCIsInNjcmlwdFBhdGgiLCJjYWxsYmFjayIsImNoaWxkUHJvY2VzcyIsInJlcXVpcmUiLCJpbnZva2VkIiwicHJvY2VzcyIsImZvcmsiLCJvbiIsImVyciIsImNvZGUiLCJFcnJvciIsIl9jb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJmcyIsInRoaXNWYXJzIiwidGhpc09wdGlvbnMiLCJwbHVnaW4iLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwidmFycyIsInZhbGlkYXRlT3B0aW9ucyIsImdldFZhbGlkYXRlT3B0aW9ucyIsImdldERlZmF1bHRWYXJzIiwicGx1Z2luTmFtZSIsImFwcCIsIl9nZXRBcHAiLCJsb2d2IiwicmMiLCJleGlzdHNTeW5jIiwiSlNPTiIsInBhcnNlIiwicmVhZEZpbGVTeW5jIiwiZ2V0RGVmYXVsdE9wdGlvbnMiLCJzdHJpbmdpZnkiLCJlbnZpcm9ubWVudCIsInByb2R1Y3Rpb24iLCJsb2ciLCJ0cmVlc2hha2UiLCJfdG9Qcm9kIiwiX3RoaXNDb21waWxhdGlvbiIsImNvbXBpbGVyIiwiY29tcGlsYXRpb24iLCJzY3JpcHQiLCJlIiwiZXJyb3JzIiwiX2NvbXBpbGF0aW9uIiwiZXh0Q29tcG9uZW50cyIsIl9nZXRBbGxDb21wb25lbnRzIiwiaG9va3MiLCJzdWNjZWVkTW9kdWxlIiwidGFwIiwibW9kdWxlIiwicmVzb3VyY2UiLCJtYXRjaCIsIl9zb3VyY2UiLCJfdmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiZGVwcyIsImV4dHJhY3RGcm9tU291cmNlIiwiZmluaXNoTW9kdWxlcyIsIm1vZHVsZXMiLCJfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciIsImh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24iLCJkYXRhIiwicGF0aCIsImpzUGF0aCIsImpvaW4iLCJleHRQYXRoIiwiY3NzUGF0aCIsImFzc2V0cyIsImpzIiwidW5zaGlmdCIsImNzcyIsIl9hZnRlckNvbXBpbGUiLCJfZW1pdCIsImVtaXQiLCJfYnVpbGRFeHRCdW5kbGUiLCJvdXRwdXRQYXRoIiwiZGV2U2VydmVyIiwiY29udGVudEJhc2UiLCJfcHJlcGFyZUZvckJ1aWxkIiwiY29tbWFuZCIsIndhdGNoIiwicmVidWlsZCIsInBhcm1zIiwicHJvZmlsZSIsIndhdGNoU3RhcnRlZCIsIm91dHB1dCIsInJpbXJhZiIsIm1rZGlycCIsImZzeCIsInBhY2thZ2VzIiwidG9vbGtpdCIsInRoZW1lIiwiZmlyc3RUaW1lIiwic3luYyIsImJ1aWxkWE1MIiwiY3JlYXRlQXBwSnNvbiIsImNyZWF0ZVdvcmtzcGFjZUpzb24iLCJjcmVhdGVKU0RPTUVudmlyb25tZW50Iiwid3JpdGVGaWxlU3luYyIsImN3ZCIsImZyb21QYXRoIiwidG9QYXRoIiwiY29weVN5bmMiLCJyZXBsYWNlIiwiZnJvbVJlc291cmNlcyIsInRvUmVzb3VyY2VzIiwibWFuaWZlc3QiLCJidW5kbGVEaXIiLCJ0cmltIiwic2VuY2hhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbkJ1aWxkRG9uZSIsIm9wdHMiLCJzaWxlbnQiLCJzdGRpbyIsImVuY29kaW5nIiwiZXhlY3V0ZUFzeW5jIiwidGhlbiIsInJlYXNvbiIsImNvbnNvbGUiLCJfZG9uZSIsIl90b0RldiIsImJyb3dzZXIiLCJicm93c2VyQ291bnQiLCJ1cmwiLCJwb3J0Iiwib3BuIiwiREVGQVVMVF9TVUJTVFJTIiwic3Vic3RyaW5ncyIsImNoYWxrIiwiY3Jvc3NTcGF3biIsImNoaWxkIiwic2lnbmFsIiwiZXJyb3IiLCJzdGRvdXQiLCJzdHIiLCJ0b1N0cmluZyIsImZpbGVuYW1lIiwic29tZSIsInYiLCJpbmRleE9mIiwicmVkIiwic3RkZXJyIiwic3RySmF2YU9wdHMiLCJzIiwiY3Vyc29yVG8iLCJjbGVhckxpbmUiLCJ3cml0ZSIsInZlcmJvc2UiLCJwcmVmaXgiLCJwbGF0Zm9ybSIsImdyZWVuIiwiX2dldFZlcnNpb25zIiwiZnJhbWV3b3JrTmFtZSIsInBsdWdpblBhdGgiLCJwbHVnaW5Qa2ciLCJwbHVnaW5WZXJzaW9uIiwidmVyc2lvbiIsIl9yZXNvbHZlZCIsImVkaXRpb24iLCJ3ZWJwYWNrUGF0aCIsIndlYnBhY2tQa2ciLCJ3ZWJwYWNrVmVyc2lvbiIsImV4dFBrZyIsImV4dFZlcnNpb24iLCJjbWRQYXRoIiwiY21kUGtnIiwiY21kVmVyc2lvbiIsInZlcnNpb25fZnVsbCIsImZyYW1ld29ya0luZm8iLCJmcmFtZXdvcmtQYXRoIiwiZnJhbWV3b3JrUGtnIiwiZnJhbWV3b3JrVmVyc2lvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQSxTQUFTQSxTQUFULENBQW1CQyxVQUFuQixFQUErQkMsUUFBL0IsRUFBeUM7QUFDdkMsTUFBSUMsWUFBWSxHQUFHQyxPQUFPLENBQUMsZUFBRCxDQUExQixDQUR1QyxDQUV2Qzs7O0FBQ0EsTUFBSUMsT0FBTyxHQUFHLEtBQWQ7QUFDQSxNQUFJQyxPQUFPLEdBQUdILFlBQVksQ0FBQ0ksSUFBYixDQUFrQk4sVUFBbEIsQ0FBZCxDQUp1QyxDQUt2Qzs7QUFDQUssRUFBQUEsT0FBTyxDQUFDRSxFQUFSLENBQVcsT0FBWCxFQUFvQixVQUFVQyxHQUFWLEVBQWU7QUFDakMsUUFBSUosT0FBSixFQUFhO0FBQ2JBLElBQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0FILElBQUFBLFFBQVEsQ0FBQ08sR0FBRCxDQUFSO0FBQ0QsR0FKRCxFQU51QyxDQVd2Qzs7QUFDQUgsRUFBQUEsT0FBTyxDQUFDRSxFQUFSLENBQVcsTUFBWCxFQUFtQixVQUFVRSxJQUFWLEVBQWdCO0FBQ2pDLFFBQUlMLE9BQUosRUFBYTtBQUNiQSxJQUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNBLFFBQUlJLEdBQUcsR0FBR0MsSUFBSSxLQUFLLENBQVQsR0FBYSxJQUFiLEdBQW9CLElBQUlDLEtBQUosQ0FBVSxlQUFlRCxJQUF6QixDQUE5QjtBQUNB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QUFwQjs7QUFDQSxRQUFJakIsYUFBYSxJQUFJLE9BQXJCLEVBQThCO0FBQzVCaUIsTUFBQUEsYUFBYSxHQUFHOUcsSUFBSSxDQUFDaUQsT0FBTCxDQUFhL0csT0FBTyxDQUFDbUcsR0FBUixFQUFiLEVBQTJCLG9CQUEzQixDQUFoQjtBQUNEOztBQUNELFFBQUl3RCxhQUFhLElBQUksU0FBckIsRUFBZ0M7QUFDOUJpQixNQUFBQSxhQUFhLEdBQUc5RyxJQUFJLENBQUNpRCxPQUFMLENBQWEvRyxPQUFPLENBQUNtRyxHQUFSLEVBQWIsRUFBMkIsNEJBQTNCLENBQWhCO0FBQ0Q7O0FBQ0QsUUFBSTBFLFlBQVksR0FBSXJLLEVBQUUsQ0FBQ2lCLFVBQUgsQ0FBY21KLGFBQWEsR0FBQyxlQUE1QixLQUFnRGxKLElBQUksQ0FBQ0MsS0FBTCxDQUFXbkIsRUFBRSxDQUFDb0IsWUFBSCxDQUFnQmdKLGFBQWEsR0FBQyxlQUE5QixFQUErQyxPQUEvQyxDQUFYLENBQWhELElBQXVILEVBQTNJO0FBQ0EvQixJQUFBQSxDQUFDLENBQUNpQyxnQkFBRixHQUFxQkQsWUFBWSxDQUFDZCxPQUFsQztBQUNBWSxJQUFBQSxhQUFhLEdBQUcsT0FBT2hCLGFBQVAsR0FBdUIsSUFBdkIsR0FBOEJkLENBQUMsQ0FBQ2lDLGdCQUFoRDtBQUNEOztBQUNELFNBQU96SixHQUFHLEdBQUcsc0JBQU4sR0FBK0J3SCxDQUFDLENBQUNpQixhQUFqQyxHQUFpRCxZQUFqRCxHQUFnRWpCLENBQUMsQ0FBQ3lCLFVBQWxFLEdBQStFLEdBQS9FLEdBQXFGekIsQ0FBQyxDQUFDb0IsT0FBdkYsR0FBaUcsd0JBQWpHLEdBQTRIcEIsQ0FBQyxDQUFDNEIsVUFBOUgsR0FBMkksYUFBM0ksR0FBMko1QixDQUFDLENBQUN1QixjQUE3SixHQUE4S08sYUFBckw7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIlxuLy8qKioqKioqKioqXG5mdW5jdGlvbiBydW5TY3JpcHQoc2NyaXB0UGF0aCwgY2FsbGJhY2spIHtcbiAgdmFyIGNoaWxkUHJvY2VzcyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcbiAgLy8ga2VlcCB0cmFjayBvZiB3aGV0aGVyIGNhbGxiYWNrIGhhcyBiZWVuIGludm9rZWQgdG8gcHJldmVudCBtdWx0aXBsZSBpbnZvY2F0aW9uc1xuICB2YXIgaW52b2tlZCA9IGZhbHNlO1xuICB2YXIgcHJvY2VzcyA9IGNoaWxkUHJvY2Vzcy5mb3JrKHNjcmlwdFBhdGgpO1xuICAvLyBsaXN0ZW4gZm9yIGVycm9ycyBhcyB0aGV5IG1heSBwcmV2ZW50IHRoZSBleGl0IGV2ZW50IGZyb20gZmlyaW5nXG4gIHByb2Nlc3Mub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfSk7XG4gIC8vIGV4ZWN1dGUgdGhlIGNhbGxiYWNrIG9uY2UgdGhlIHByb2Nlc3MgaGFzIGZpbmlzaGVkIHJ1bm5pbmdcbiAgcHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uIChjb2RlKSB7XG4gICAgaWYgKGludm9rZWQpIHJldHVybjtcbiAgICBpbnZva2VkID0gdHJ1ZTtcbiAgICB2YXIgZXJyID0gY29kZSA9PT0gMCA/IG51bGwgOiBuZXcgRXJyb3IoJ2V4aXQgY29kZSAnICsgY29kZSk7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfSk7XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuIFxuICB2YXIgdGhpc1ZhcnMgPSB7fVxuICB2YXIgdGhpc09wdGlvbnMgPSB7fVxuICB2YXIgcGx1Z2luID0ge31cblxuICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1ZhcnMucGx1Z2luRXJyb3JzID0gW11cbiAgICB0aGlzVmFycy5wbHVnaW5FcnJvcnMucHVzaCgnd2VicGFjayBjb25maWc6IGZyYW1ld29yayBwYXJhbWV0ZXIgb24gZXh0LXdlYnBhY2stcGx1Z2luIGlzIG5vdCBkZWZpbmVkIC0gdmFsdWVzOiByZWFjdCwgYW5ndWxhciwgZXh0anMnKVxuICAgIHBsdWdpbi52YXJzID0gdGhpc1ZhcnNcbiAgICByZXR1cm4gcGx1Z2luXG4gIH1cblxuICBjb25zdCB2YWxpZGF0ZU9wdGlvbnMgPSByZXF1aXJlKCdzY2hlbWEtdXRpbHMnKVxuICB2YWxpZGF0ZU9wdGlvbnMocmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5nZXRWYWxpZGF0ZU9wdGlvbnMoKSwgb3B0aW9ucywgJycpXG4gIHRoaXNWYXJzID0gcmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5nZXREZWZhdWx0VmFycygpXG4gIHRoaXNWYXJzLmZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gIHN3aXRjaCh0aGlzVmFycy5mcmFtZXdvcmspIHtcbiAgICBjYXNlICdleHRqcyc6XG4gICAgICB0aGlzVmFycy5wbHVnaW5OYW1lID0gJ2V4dC13ZWJwYWNrLXBsdWdpbidcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3JlYWN0JzpcbiAgICAgIHRoaXNWYXJzLnBsdWdpbk5hbWUgPSAnZXh0LXJlYWN0LXdlYnBhY2stcGx1Z2luJ1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnYW5ndWxhcic6XG4gICAgICB0aGlzVmFycy5wbHVnaW5OYW1lID0gJ2V4dC1hbmd1bGFyLXdlYnBhY2stcGx1Z2luJ1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXNWYXJzLnBsdWdpbk5hbWUgPSAnZXh0LXdlYnBhY2stcGx1Z2luJ1xuICB9XG5cbiAgdGhpc1ZhcnMuYXBwID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykuX2dldEFwcCgpXG4gIGxvZ3Yob3B0aW9ucywgYHBsdWdpbk5hbWUgLSAke3RoaXNWYXJzLnBsdWdpbk5hbWV9YClcbiAgbG9ndihvcHRpb25zLCBgdGhpc1ZhcnMuYXBwIC0gJHt0aGlzVmFycy5hcHB9YClcblxuICBjb25zdCByYyA9IChmcy5leGlzdHNTeW5jKGAuZXh0LSR7dGhpc1ZhcnMuZnJhbWV3b3JrfXJjYCkgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoYC5leHQtJHt0aGlzVmFycy5mcmFtZXdvcmt9cmNgLCAndXRmLTgnKSkgfHwge30pXG4gIHRoaXNPcHRpb25zID0geyAuLi5yZXF1aXJlKGAuLyR7dGhpc1ZhcnMuZnJhbWV3b3JrfVV0aWxgKS5nZXREZWZhdWx0T3B0aW9ucygpLCAuLi5vcHRpb25zLCAuLi5yYyB9XG4gIGxvZ3Yob3B0aW9ucywgYHRoaXNPcHRpb25zIC0gJHtKU09OLnN0cmluZ2lmeSh0aGlzT3B0aW9ucyl9YClcblxuICBpZiAodGhpc09wdGlvbnMuZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nKSBcbiAgICB7dGhpc1ZhcnMucHJvZHVjdGlvbiA9IHRydWV9XG4gIGVsc2UgXG4gICAge3RoaXNWYXJzLnByb2R1Y3Rpb24gPSBmYWxzZX1cbiAgbG9ndihvcHRpb25zLCBgdGhpc1ZhcnMgLSAke0pTT04uc3RyaW5naWZ5KHRoaXNWYXJzKX1gKVxuXG4gIC8vbWpnIGxvZyhyZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5fZ2V0VmVyc2lvbnModGhpc1ZhcnMuYXBwLCB0aGlzVmFycy5wbHVnaW5OYW1lLCB0aGlzVmFycy5mcmFtZXdvcmspKVxuICBsb2codGhpc1ZhcnMuYXBwICsgJ0J1aWxkaW5nIGZvciAnICsgdGhpc09wdGlvbnMuZW52aXJvbm1lbnQgKyAnLCAnICsgJ1RyZWVzaGFrZSBpcyAnICsgdGhpc09wdGlvbnMudHJlZXNoYWtlKVxuLy8gIGxvZyh0aGlzVmFycy5hcHAgKyAnVHJlZXNoYWtlIGlzICcgKyB0aGlzT3B0aW9ucy50cmVlc2hha2UpXG5cbiAgaWYgKHRoaXNWYXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSAmJiB0aGlzT3B0aW9ucy50cmVlc2hha2UgPT0gdHJ1ZSAmJiBvcHRpb25zLmZyYW1ld29yayA9PSAnYW5ndWxhcicpIHtcbiAgICByZXF1aXJlKGAuL2FuZ3VsYXJVdGlsYCkuX3RvUHJvZCh0aGlzVmFycywgdGhpc09wdGlvbnMpXG4gIH1cblxuICBwbHVnaW4udmFycyA9IHRoaXNWYXJzXG4gIHBsdWdpbi5vcHRpb25zID0gdGhpc09wdGlvbnNcbiAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnRlVOQ1RJT04gX2NvbnN0cnVjdG9yJylcblxuICByZXR1cm4gcGx1Z2luXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF90aGlzQ29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnRlVOQ1RJT04gX3RoaXNDb21waWxhdGlvbicpXG5cbiAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gbnVsbCkge1xuICAgICAgICBydW5TY3JpcHQob3B0aW9ucy5zY3JpcHQsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwICsgYGZpbmlzaGVkIHJ1bm5pbmcgJHtvcHRpb25zLnNjcmlwdH1gKVxuICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfdGhpc0NvbXBpbGF0aW9uOiAnICsgZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfY29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnRlVOQ1RJT04gX2NvbXBpbGF0aW9uJylcblxuICAgIGlmIChvcHRpb25zLmZyYW1ld29yayAhPSAnZXh0anMnKSB7XG4gICAgICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdXG4gICAgICBpZiAodmFycy5wcm9kdWN0aW9uKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmZyYW1ld29yayA9PSAnYW5ndWxhcicgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gdHJ1ZSkge1xuICAgICAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKCcuL2FuZ3VsYXJVdGlsJykuX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucylcbiAgICAgICAgfVxuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5zdWNjZWVkTW9kdWxlLnRhcChgZXh0LXN1Y2NlZWQtbW9kdWxlYCwgbW9kdWxlID0+IHtcbiAgICAgICAgICBpZiAobW9kdWxlLnJlc291cmNlICYmICFtb2R1bGUucmVzb3VyY2UubWF0Y2goL25vZGVfbW9kdWxlcy8pKSB7XG4gICAgICAgICAgICBpZihtb2R1bGUucmVzb3VyY2UubWF0Y2goL1xcLmh0bWwkLykgIT0gbnVsbCkge1xuICAgICAgICAgICAgICBpZihtb2R1bGUuX3NvdXJjZS5fdmFsdWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnZG9jdHlwZSBodG1sJykgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbLi4uKHZhcnMuZGVwcyB8fCBbXSksIC4uLnJlcXVpcmUoYC4vJHt2YXJzLmZyYW1ld29ya31VdGlsYCkuZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbLi4uKHZhcnMuZGVwcyB8fCBbXSksIC4uLnJlcXVpcmUoYC4vJHt2YXJzLmZyYW1ld29ya31VdGlsYCkuZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInICYmIG9wdGlvbnMudHJlZXNoYWtlID09IHRydWUpIHtcbiAgICAgICAgICBjb21waWxhdGlvbi5ob29rcy5maW5pc2hNb2R1bGVzLnRhcChgZXh0LWZpbmlzaC1tb2R1bGVzYCwgbW9kdWxlcyA9PiB7XG4gICAgICAgICAgICByZXF1aXJlKCcuL2FuZ3VsYXJVdGlsJykuX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIodmFycywgb3B0aW9ucylcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb21waWxhdGlvbi5ob29rcy5odG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uLnRhcChgZXh0LWh0bWwtZ2VuZXJhdGlvbmAsKGRhdGEpID0+IHtcbiAgICAgICAgbG9ndihvcHRpb25zLCdodG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uJylcbiAgICAgICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgICB2YXIganNQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5qcycpXG4gICAgICAgIHZhciBjc3NQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5jc3MnKVxuICAgICAgICBkYXRhLmFzc2V0cy5qcy51bnNoaWZ0KGpzUGF0aClcbiAgICAgICAgZGF0YS5hc3NldHMuY3NzLnVuc2hpZnQoY3NzUGF0aClcbiAgICAgICAgbG9nKHZhcnMuYXBwICsgYEFkZGluZyAke2pzUGF0aH0gYW5kICR7Y3NzUGF0aH0gdG8gaW5kZXguaHRtbGApXG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19jb21waWxhdGlvbjogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2FmdGVyQ29tcGlsZShjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZScpXG4gIGlmIChvcHRpb25zLmZyYW1ld29yayA9PSAnZXh0anMnKSB7XG4gICAgICAgIHJlcXVpcmUoYC4vZXh0anNVdGlsYCkuX2FmdGVyQ29tcGlsZShjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucylcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZW1pdChjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9lbWl0JylcblxuXG4gICAgdmFyIGVtaXQgPSBvcHRpb25zLmVtaXRcbiAgICB2YXIgdHJlZXNoYWtlID0gb3B0aW9ucy50cmVlc2hha2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICB2YXIgZW52aXJvbm1lbnQgPSAgb3B0aW9ucy5lbnZpcm9ubWVudFxuXG4gICAgaWYgKGVtaXQpIHtcbiAgICAgIGlmICgoZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nICYmIHRyZWVzaGFrZSA9PSB0cnVlICAmJiBmcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB8fFxuICAgICAgICAgIChlbnZpcm9ubWVudCAhPSAncHJvZHVjdGlvbicgJiYgdHJlZXNoYWtlID09IGZhbHNlICYmIGZyYW1ld29yayA9PSAnYW5ndWxhcicpIHx8XG4gICAgICAgICAgKGZyYW1ld29yayA9PSAncmVhY3QnKSB8fFxuICAgICAgICAgIChmcmFtZXdvcmsgPT0gJ2NvbXBvbmVudHMnKVxuICAgICAgKSB7XG4gICAgICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgICAgICB2YXIgZnJhbWV3b3JrID0gdmFycy5mcmFtZXdvcmtcbiAgICAgICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgICBjb25zdCBfYnVpbGRFeHRCdW5kbGUgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5fYnVpbGRFeHRCdW5kbGVcbiAgICAgICAgbGV0IG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3V0cHV0UGF0aCx2YXJzLmV4dFBhdGgpXG4gICAgICAgIGlmIChjb21waWxlci5vdXRwdXRQYXRoID09PSAnLycgJiYgY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIpIHtcbiAgICAgICAgICBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGNvbXBpbGVyLm9wdGlvbnMuZGV2U2VydmVyLmNvbnRlbnRCYXNlLCBvdXRwdXRQYXRoKVxuICAgICAgICB9XG4gICAgICAgIGxvZ3Yob3B0aW9ucywnb3V0cHV0UGF0aDogJyArIG91dHB1dFBhdGgpXG4gICAgICAgIGxvZ3Yob3B0aW9ucywnZnJhbWV3b3JrOiAnICsgZnJhbWV3b3JrKVxuICAgICAgICAvLyAgICBpZiAob3B0aW9ucy5lbWl0ID09IHRydWUpIHtcbiAgICAgICAgICBpZiAoZnJhbWV3b3JrICE9ICdleHRqcycpIHtcbiAgICAgICAgICAgIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInICYmIG9wdGlvbnMudHJlZXNoYWtlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0UGF0aCwgY29tcGlsYXRpb24pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGNvbW1hbmQgPSAnJ1xuICAgICAgICAgIGlmIChvcHRpb25zLndhdGNoID09ICd5ZXMnICYmIHZhcnMucHJvZHVjdGlvbiA9PSBmYWxzZSkge1xuICAgICAgICAgICAgY29tbWFuZCA9ICd3YXRjaCdcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb21tYW5kID0gJ2J1aWxkJ1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh2YXJzLnJlYnVpbGQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIHBhcm1zID0gW11cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnByb2ZpbGUgPT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMucHJvZmlsZSA9PSAnJyB8fCBvcHRpb25zLnByb2ZpbGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICBpZiAoY29tbWFuZCA9PSAnYnVpbGQnKSB7XG4gICAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMuZW52aXJvbm1lbnRdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoY29tbWFuZCA9PSAnYnVpbGQnKSB7XG4gICAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodmFycy53YXRjaFN0YXJ0ZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgYXdhaXQgX2J1aWxkRXh0QnVuZGxlKGFwcCwgY29tcGlsYXRpb24sIG91dHB1dFBhdGgsIHBhcm1zLCBvcHRpb25zKVxuICAgICAgICAgICAgICB2YXJzLndhdGNoU3RhcnRlZCA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbG9ndihvcHRpb25zLCdOT1QgcnVubmluZyBlbWl0JylcbiAgICAgICAgY2FsbGJhY2soKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxvZ3Yob3B0aW9ucywnZW1pdCBpcyBmYWxzZScpXG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnZW1pdDogJyArIGUpXG4gICAgY2FsbGJhY2soKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXQsIGNvbXBpbGF0aW9uKSB7XG4gIHRyeSB7XG4gICAgbG9ndihvcHRpb25zLCdGVU5DVElPTiBfcHJlcGFyZUZvckJ1aWxkJylcbiAgICBjb25zdCByaW1yYWYgPSByZXF1aXJlKCdyaW1yYWYnKVxuICAgIGNvbnN0IG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpXG4gICAgY29uc3QgZnN4ID0gcmVxdWlyZSgnZnMtZXh0cmEnKVxuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuICAgIHZhciBwYWNrYWdlcyA9IG9wdGlvbnMucGFja2FnZXNcbiAgICB2YXIgdG9vbGtpdCA9IG9wdGlvbnMudG9vbGtpdFxuICAgIHZhciB0aGVtZSA9IG9wdGlvbnMudGhlbWVcblxuICAgIHRoZW1lID0gdGhlbWUgfHwgKHRvb2xraXQgPT09ICdjbGFzc2ljJyA/ICd0aGVtZS10cml0b24nIDogJ3RoZW1lLW1hdGVyaWFsJylcbiAgICBsb2d2KG9wdGlvbnMsJ2ZpcnN0VGltZTogJyArIHZhcnMuZmlyc3RUaW1lKVxuICAgIGlmICh2YXJzLmZpcnN0VGltZSkge1xuICAgICAgcmltcmFmLnN5bmMob3V0cHV0KVxuICAgICAgbWtkaXJwLnN5bmMob3V0cHV0KVxuICAgICAgY29uc3QgYnVpbGRYTUwgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmJ1aWxkWE1MXG4gICAgICBjb25zdCBjcmVhdGVBcHBKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVBcHBKc29uXG4gICAgICBjb25zdCBjcmVhdGVXb3Jrc3BhY2VKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVXb3Jrc3BhY2VKc29uXG4gICAgICBjb25zdCBjcmVhdGVKU0RPTUVudmlyb25tZW50ID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVKU0RPTUVudmlyb25tZW50XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2J1aWxkLnhtbCcpLCBidWlsZFhNTCh2YXJzLnByb2R1Y3Rpb24sIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2FwcC5qc29uJyksIGNyZWF0ZUFwcEpzb24odGhlbWUsIHBhY2thZ2VzLCB0b29sa2l0LCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdqc2RvbS1lbnZpcm9ubWVudC5qcycpLCBjcmVhdGVKU0RPTUVudmlyb25tZW50KG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ3dvcmtzcGFjZS5qc29uJyksIGNyZWF0ZVdvcmtzcGFjZUpzb24ob3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuXG4gICAgICB2YXIgZnJhbWV3b3JrID0gdmFycy5mcmFtZXdvcms7XG4gICAgICAvL2JlY2F1c2Ugb2YgYSBwcm9ibGVtIHdpdGggY29sb3JwaWNrZXJcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L3V4L2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vdXgvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICd1eCcpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwICsgJ0NvcHlpbmcgKHV4KSAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vcGFja2FnZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3BhY2thZ2VzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAgKyAnQ29weWluZyAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vb3ZlcnJpZGVzL2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vb3ZlcnJpZGVzL2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAnb3ZlcnJpZGVzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAgKyAnQ29weWluZyAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksJ3Jlc291cmNlcy8nKSkpIHtcbiAgICAgICAgdmFyIGZyb21SZXNvdXJjZXMgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3Jlc291cmNlcy8nKVxuICAgICAgICB2YXIgdG9SZXNvdXJjZXMgPSBwYXRoLmpvaW4ob3V0cHV0LCAnLi4vcmVzb3VyY2VzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21SZXNvdXJjZXMsIHRvUmVzb3VyY2VzKVxuICAgICAgICBsb2coYXBwICsgJ0NvcHlpbmcgJyArIGZyb21SZXNvdXJjZXMucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9SZXNvdXJjZXMucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgfVxuICAgIHZhcnMuZmlyc3RUaW1lID0gZmFsc2VcbiAgICB2YXIganMgPSAnJ1xuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24pIHtcbiAgICAgIGpzID0gdmFycy5kZXBzLmpvaW4oJztcXG4nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBqcyA9ICdFeHQucmVxdWlyZShcIkV4dC4qXCIpJ1xuICAgIH1cbiAgICBpZiAodmFycy5tYW5pZmVzdCA9PT0gbnVsbCB8fCBqcyAhPT0gdmFycy5tYW5pZmVzdCkge1xuICAgICAgdmFycy5tYW5pZmVzdCA9IGpzXG4gICAgICBjb25zdCBtYW5pZmVzdCA9IHBhdGguam9pbihvdXRwdXQsICdtYW5pZmVzdC5qcycpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKG1hbmlmZXN0LCBqcywgJ3V0ZjgnKVxuICAgICAgdmFycy5yZWJ1aWxkID0gdHJ1ZVxuICAgICAgdmFyIGJ1bmRsZURpciA9IG91dHB1dC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKVxuICAgICAgaWYgKGJ1bmRsZURpci50cmltKCkgPT0gJycpIHtidW5kbGVEaXIgPSAnLi8nfVxuICAgICAgbG9nKGFwcCArICdCdWlsZGluZyBFeHQgYnVuZGxlIGF0OiAnICsgYnVuZGxlRGlyKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhcnMucmVidWlsZCA9IGZhbHNlXG4gICAgICBsb2coYXBwICsgJ0V4dCByZWJ1aWxkIE5PVCBuZWVkZWQnKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19wcmVwYXJlRm9yQnVpbGQ6ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICAgIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gICAgbG9ndihvcHRpb25zLCdGVU5DVElPTiBfYnVpbGRFeHRCdW5kbGUnKVxuXG4gICAgbGV0IHNlbmNoYTsgdHJ5IHsgc2VuY2hhID0gcmVxdWlyZSgnQHNlbmNoYS9jbWQnKSB9IGNhdGNoIChlKSB7IHNlbmNoYSA9ICdzZW5jaGEnIH1cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhzZW5jaGEpKSB7XG4gICAgICBsb2d2KG9wdGlvbnMsJ3NlbmNoYSBmb2xkZXIgZXhpc3RzJylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KG9wdGlvbnMsJ3NlbmNoYSBmb2xkZXIgRE9FUyBOT1QgZXhpc3QnKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBvbkJ1aWxkRG9uZSA9ICgpID0+IHtcbiAgICAgICAgbG9ndihvcHRpb25zLCdvbkJ1aWxkRG9uZScpXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfVxuXG4gICAgICB2YXIgb3B0cyA9IHsgY3dkOiBvdXRwdXRQYXRoLCBzaWxlbnQ6IHRydWUsIHN0ZGlvOiAncGlwZScsIGVuY29kaW5nOiAndXRmLTgnfVxuICAgICAgZXhlY3V0ZUFzeW5jKGFwcCwgc2VuY2hhLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIG9wdGlvbnMpLnRoZW4gKFxuICAgICAgICBmdW5jdGlvbigpIHsgb25CdWlsZERvbmUoKSB9LCBcbiAgICAgICAgZnVuY3Rpb24ocmVhc29uKSB7IHJlamVjdChyZWFzb24pIH1cbiAgICAgIClcbiAgICB9KVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZygnZScpXG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19idWlsZEV4dEJ1bmRsZTogJyArIGUpXG4gICAgY2FsbGJhY2soKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9kb25lKHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBsb2cgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2dcbiAgICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICAgIGxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gX2RvbmUnKVxuXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlICYmIG9wdGlvbnMudHJlZXNoYWtlID09IGZhbHNlICYmIG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJykge1xuICAgICAgcmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5fdG9EZXYodmFycywgb3B0aW9ucylcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmKG9wdGlvbnMuYnJvd3NlciA9PSB0cnVlICYmIG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKSB7XG4gICAgICAgIGlmICh2YXJzLmJyb3dzZXJDb3VudCA9PSAwKSB7XG4gICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OicgKyBvcHRpb25zLnBvcnRcbiAgICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAgKyBgT3BlbmluZyBicm93c2VyIGF0ICR7dXJsfWApXG4gICAgICAgICAgdmFycy5icm93c2VyQ291bnQrK1xuICAgICAgICAgIGNvbnN0IG9wbiA9IHJlcXVpcmUoJ29wbicpXG4gICAgICAgICAgb3BuKHVybClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgIC8vY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ3Nob3cgYnJvd3NlciB3aW5kb3cgLSBleHQtZG9uZTogJyArIGUpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlQXN5bmMgKGFwcCwgY29tbWFuZCwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgLy9jb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBTZXJ2ZXJcIiwgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gICAgY29uc3QgREVGQVVMVF9TVUJTVFJTID0gW1wiW0lORl0geFNlcnZlclwiLCAnW0lORl0gTG9hZGluZycsICdbSU5GXSBBcHBlbmQnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbSU5GXSBQcm9jZXNzaW5nIEJ1aWxkJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgICB2YXIgc3Vic3RyaW5ncyA9IERFRkFVTFRfU1VCU1RSUyBcbiAgICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gICAgY29uc3QgY3Jvc3NTcGF3biA9IHJlcXVpcmUoJ2Nyb3NzLXNwYXduJylcbiAgICBjb25zdCBsb2cgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2dcbiAgICBsb2d2KG9wdGlvbnMsICdGVU5DVElPTiBleGVjdXRlQXN5bmMnKVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxvZ3Yob3B0aW9ucyxgY29tbWFuZCAtICR7Y29tbWFuZH1gKVxuICAgICAgbG9ndihvcHRpb25zLCBgcGFybXMgLSAke3Bhcm1zfWApXG4gICAgICBsb2d2KG9wdGlvbnMsIGBvcHRzIC0gJHtKU09OLnN0cmluZ2lmeShvcHRzKX1gKVxuICAgICAgbGV0IGNoaWxkID0gY3Jvc3NTcGF3bihjb21tYW5kLCBwYXJtcywgb3B0cylcbiAgICAgIGNoaWxkLm9uKCdjbG9zZScsIChjb2RlLCBzaWduYWwpID0+IHtcbiAgICAgICAgbG9ndihvcHRpb25zLCBgb24gY2xvc2U6IGAgKyBjb2RlKSBcbiAgICAgICAgaWYoY29kZSA9PT0gMCkgeyByZXNvbHZlKDApIH1cbiAgICAgICAgZWxzZSB7IGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCBuZXcgRXJyb3IoY29kZSkgKTsgcmVzb2x2ZSgwKSB9XG4gICAgICB9KVxuICAgICAgY2hpbGQub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7IFxuICAgICAgICBsb2d2KG9wdGlvbnMsIGBvbiBlcnJvcmApIFxuICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChlcnJvcilcbiAgICAgICAgcmVzb2x2ZSgwKVxuICAgICAgfSlcbiAgICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICBsb2d2KG9wdGlvbnMsIGAke3N0cn1gKVxuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkubWF0Y2goL0Zhc2hpb24gd2FpdGluZyBmb3IgY2hhbmdlc1xcLlxcLlxcLi8pKSB7XG5cbiAgICAgICAgICAvLyBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICAgICAgLy8gdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSsnL3NyYy9pbmRleC5qcyc7XG4gICAgICAgICAgLy8gdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuICAgICAgICAgIC8vIGZzLndyaXRlRmlsZVN5bmMoZmlsZW5hbWUsIGRhdGEgKyAnICcsICd1dGY4JylcbiAgICAgICAgICAvLyBsb2d2KG9wdGlvbnMsIGB0b3VjaGluZyAke2ZpbGVuYW1lfWApXG5cbiAgICAgICAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICAgICAgdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSArICcvc3JjL2luZGV4LmpzJztcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgZGF0YSArICcgJywgJ3V0ZjgnKTtcbiAgICAgICAgICAgIGxvZyhvcHRpb25zLCBgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2goZSkge1xuICAgICAgICAgICAgbG9nKG9wdGlvbnMsIGBOT1QgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKDApXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKHN1YnN0cmluZ3Muc29tZShmdW5jdGlvbih2KSB7IHJldHVybiBkYXRhLmluZGV4T2YodikgPj0gMDsgfSkpIHsgXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltJTkZdXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltMT0ddXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykudHJpbSgpXG4gICAgICAgICAgICBpZiAoc3RyLmluY2x1ZGVzKFwiW0VSUl1cIikpIHtcbiAgICAgICAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goYXBwICsgc3RyLnJlcGxhY2UoL15cXFtFUlJcXF0gL2dpLCAnJykpO1xuICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltFUlJdXCIsIGAke2NoYWxrLnJlZChcIltFUlJdXCIpfWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2coYCR7YXBwfSR7c3RyfWApIFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNoaWxkLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywgYGVycm9yIG9uIGNsb3NlOiBgICsgZGF0YSkgXG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICB2YXIgc3RySmF2YU9wdHMgPSBcIlBpY2tlZCB1cCBfSkFWQV9PUFRJT05TXCI7XG4gICAgICAgIHZhciBpbmNsdWRlcyA9IHN0ci5pbmNsdWRlcyhzdHJKYXZhT3B0cylcbiAgICAgICAgaWYgKCFpbmNsdWRlcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2FwcH0gJHtjaGFsay5yZWQoXCJbRVJSXVwiKX0gJHtzdHJ9YClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnZXhlY3V0ZUFzeW5jOiAnICsgZSlcbiAgICBjYWxsYmFjaygpXG4gIH0gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2cocykge1xuICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICB0cnkge1xuICAgIHByb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpXG4gIH1cbiAgY2F0Y2goZSkge31cbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocylcbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2d2KG9wdGlvbnMsIHMpIHtcbiAgaWYgKG9wdGlvbnMudmVyYm9zZSA9PSAneWVzJykge1xuICAgIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgfVxuICAgIGNhdGNoKGUpIHt9XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoYC12ZXJib3NlOiAke3N9YClcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX2dldEFwcCgpIHtcbiAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKVxuICB2YXIgcHJlZml4ID0gYGBcbiAgY29uc3QgcGxhdGZvcm0gPSByZXF1aXJlKCdvcycpLnBsYXRmb3JtKClcbiAgaWYgKHBsYXRmb3JtID09ICdkYXJ3aW4nKSB7IHByZWZpeCA9IGDihLkg772iZXh0772jOmAgfVxuICBlbHNlIHsgcHJlZml4ID0gYGkgW2V4dF06YCB9XG4gIHJldHVybiBgJHtjaGFsay5ncmVlbihwcmVmaXgpfSBgXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZ2V0VmVyc2lvbnMoYXBwLCBwbHVnaW5OYW1lLCBmcmFtZXdvcmtOYW1lKSB7XG4gIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5cbiAgdmFyIHYgPSB7fVxuICB2YXIgcGx1Z2luUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQHNlbmNoYScsIHBsdWdpbk5hbWUpXG4gIHZhciBwbHVnaW5Qa2cgPSAoZnMuZXhpc3RzU3luYyhwbHVnaW5QYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGx1Z2luUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYucGx1Z2luVmVyc2lvbiA9IHBsdWdpblBrZy52ZXJzaW9uXG4gIHYuX3Jlc29sdmVkID0gcGx1Z2luUGtnLl9yZXNvbHZlZFxuICBpZiAodi5fcmVzb2x2ZWQgPT0gdW5kZWZpbmVkKSB7XG4gICAgdi5lZGl0aW9uID0gYENvbW1lcmNpYWxgXG4gIH1cbiAgZWxzZSB7XG4gICAgaWYgKC0xID09IHYuX3Jlc29sdmVkLmluZGV4T2YoJ2NvbW11bml0eScpKSB7XG4gICAgICB2LmVkaXRpb24gPSBgQ29tbWVyY2lhbGBcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2LmVkaXRpb24gPSBgQ29tbXVuaXR5YFxuICAgIH1cbiAgfVxuXG4gIHZhciB3ZWJwYWNrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvd2VicGFjaycpXG4gIHZhciB3ZWJwYWNrUGtnID0gKGZzLmV4aXN0c1N5bmMod2VicGFja1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYud2VicGFja1ZlcnNpb24gPSB3ZWJwYWNrUGtnLnZlcnNpb25cblxuICB2YXIgZXh0UGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQHNlbmNoYS9leHQnKVxuICB2YXIgZXh0UGtnID0gKGZzLmV4aXN0c1N5bmMoZXh0UGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LmV4dFZlcnNpb24gPSBleHRQa2cuc2VuY2hhLnZlcnNpb25cblxuICB2YXIgY21kUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLGBub2RlX21vZHVsZXMvQHNlbmNoYS9jbWRgKVxuICB2YXIgY21kUGtnID0gKGZzLmV4aXN0c1N5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXG5cbiAgaWYgKHYuY21kVmVyc2lvbiA9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgY21kUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLGBub2RlX21vZHVsZXMvQHNlbmNoYS8ke3BsdWdpbk5hbWV9L25vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gICAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXG4gIH1cblxuICB2YXIgZnJhbWV3b3JrSW5mbyA9ICcnXG4gICBpZiAoZnJhbWV3b3JrTmFtZSAhPSB1bmRlZmluZWQgJiYgZnJhbWV3b3JrTmFtZSAhPSAnZXh0anMnKSB7XG4gICAgdmFyIGZyYW1ld29ya1BhdGggPSAnJ1xuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdyZWFjdCcpIHtcbiAgICAgIGZyYW1ld29ya1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL3JlYWN0JylcbiAgICB9XG4gICAgaWYgKGZyYW1ld29ya05hbWUgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9AYW5ndWxhci9jb3JlJylcbiAgICB9XG4gICAgdmFyIGZyYW1ld29ya1BrZyA9IChmcy5leGlzdHNTeW5jKGZyYW1ld29ya1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmZyYW1ld29ya1ZlcnNpb24gPSBmcmFtZXdvcmtQa2cudmVyc2lvblxuICAgIGZyYW1ld29ya0luZm8gPSAnLCAnICsgZnJhbWV3b3JrTmFtZSArICcgdicgKyB2LmZyYW1ld29ya1ZlcnNpb25cbiAgfVxuICByZXR1cm4gYXBwICsgJ2V4dC13ZWJwYWNrLXBsdWdpbiB2JyArIHYucGx1Z2luVmVyc2lvbiArICcsIEV4dCBKUyB2JyArIHYuZXh0VmVyc2lvbiArICcgJyArIHYuZWRpdGlvbiArICcgRWRpdGlvbiwgU2VuY2hhIENtZCB2JyArIHYuY21kVmVyc2lvbiArICcsIHdlYnBhY2sgdicgKyB2LndlYnBhY2tWZXJzaW9uICsgZnJhbWV3b3JrSW5mb1xuIH0iXX0=