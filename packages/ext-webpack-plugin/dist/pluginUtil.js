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
    log(thisVars.app + 'BUILD STEP 1');
    thisVars.buildstep = 1;

    require(`./angularUtil`)._toProd(thisVars, thisOptions);
  }

  if (thisVars.production == true && thisOptions.treeshake == false && options.framework == 'angular') {
    log(thisVars.app + '(check for prod folder and module change)');
    log(thisVars.app + 'BUILD STEP 2');
    thisVars.buildstep = 2;
  } //mjg log(require('./pluginUtil')._getVersions(thisVars.app, thisVars.pluginName, thisVars.framework))


  log(thisVars.app + 'Building for ' + thisOptions.environment + ', ' + 'Treeshake is ' + thisOptions.treeshake);
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

            require('./pluginUtil').log(vars.app + `finished running ${options.script}`);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbInJ1blNjcmlwdCIsInNjcmlwdFBhdGgiLCJjYWxsYmFjayIsImNoaWxkUHJvY2VzcyIsInJlcXVpcmUiLCJpbnZva2VkIiwicHJvY2VzcyIsImZvcmsiLCJvbiIsImVyciIsImNvZGUiLCJFcnJvciIsIl9jb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJmcyIsInRoaXNWYXJzIiwidGhpc09wdGlvbnMiLCJwbHVnaW4iLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwidmFycyIsInZhbGlkYXRlT3B0aW9ucyIsImdldFZhbGlkYXRlT3B0aW9ucyIsImdldERlZmF1bHRWYXJzIiwicGx1Z2luTmFtZSIsImFwcCIsIl9nZXRBcHAiLCJsb2ciLCJsb2d2IiwicmMiLCJleGlzdHNTeW5jIiwiSlNPTiIsInBhcnNlIiwicmVhZEZpbGVTeW5jIiwiZ2V0RGVmYXVsdE9wdGlvbnMiLCJzdHJpbmdpZnkiLCJlbnZpcm9ubWVudCIsInByb2R1Y3Rpb24iLCJ0cmVlc2hha2UiLCJidWlsZHN0ZXAiLCJfdG9Qcm9kIiwiX3RoaXNDb21waWxhdGlvbiIsImNvbXBpbGVyIiwiY29tcGlsYXRpb24iLCJzY3JpcHQiLCJlIiwiZXJyb3JzIiwiX2NvbXBpbGF0aW9uIiwiZXh0Q29tcG9uZW50cyIsIl9nZXRBbGxDb21wb25lbnRzIiwiaG9va3MiLCJzdWNjZWVkTW9kdWxlIiwidGFwIiwibW9kdWxlIiwicmVzb3VyY2UiLCJtYXRjaCIsIl9zb3VyY2UiLCJfdmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiZGVwcyIsImV4dHJhY3RGcm9tU291cmNlIiwiZmluaXNoTW9kdWxlcyIsIm1vZHVsZXMiLCJfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciIsImh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24iLCJkYXRhIiwicGF0aCIsImpzUGF0aCIsImpvaW4iLCJleHRQYXRoIiwiY3NzUGF0aCIsImFzc2V0cyIsImpzIiwidW5zaGlmdCIsImNzcyIsIl9hZnRlckNvbXBpbGUiLCJfZW1pdCIsImVtaXQiLCJfYnVpbGRFeHRCdW5kbGUiLCJvdXRwdXRQYXRoIiwiZGV2U2VydmVyIiwiY29udGVudEJhc2UiLCJfcHJlcGFyZUZvckJ1aWxkIiwiY29tbWFuZCIsIndhdGNoIiwicmVidWlsZCIsInBhcm1zIiwicHJvZmlsZSIsIndhdGNoU3RhcnRlZCIsIm91dHB1dCIsInJpbXJhZiIsIm1rZGlycCIsImZzeCIsInBhY2thZ2VzIiwidG9vbGtpdCIsInRoZW1lIiwiZmlyc3RUaW1lIiwic3luYyIsImJ1aWxkWE1MIiwiY3JlYXRlQXBwSnNvbiIsImNyZWF0ZVdvcmtzcGFjZUpzb24iLCJjcmVhdGVKU0RPTUVudmlyb25tZW50Iiwid3JpdGVGaWxlU3luYyIsImN3ZCIsImZyb21QYXRoIiwidG9QYXRoIiwiY29weVN5bmMiLCJyZXBsYWNlIiwiZnJvbVJlc291cmNlcyIsInRvUmVzb3VyY2VzIiwibWFuaWZlc3QiLCJidW5kbGVEaXIiLCJ0cmltIiwic2VuY2hhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbkJ1aWxkRG9uZSIsIm9wdHMiLCJzaWxlbnQiLCJzdGRpbyIsImVuY29kaW5nIiwiZXhlY3V0ZUFzeW5jIiwidGhlbiIsInJlYXNvbiIsImNvbnNvbGUiLCJfZG9uZSIsIl90b0RldiIsImJyb3dzZXIiLCJicm93c2VyQ291bnQiLCJ1cmwiLCJwb3J0Iiwib3BuIiwiREVGQVVMVF9TVUJTVFJTIiwic3Vic3RyaW5ncyIsImNoYWxrIiwiY3Jvc3NTcGF3biIsImNoaWxkIiwic2lnbmFsIiwiZXJyb3IiLCJzdGRvdXQiLCJzdHIiLCJ0b1N0cmluZyIsImZpbGVuYW1lIiwic29tZSIsInYiLCJpbmRleE9mIiwicmVkIiwic3RkZXJyIiwic3RySmF2YU9wdHMiLCJzIiwiY3Vyc29yVG8iLCJjbGVhckxpbmUiLCJ3cml0ZSIsInZlcmJvc2UiLCJwcmVmaXgiLCJwbGF0Zm9ybSIsImdyZWVuIiwiX2dldFZlcnNpb25zIiwiZnJhbWV3b3JrTmFtZSIsInBsdWdpblBhdGgiLCJwbHVnaW5Qa2ciLCJwbHVnaW5WZXJzaW9uIiwidmVyc2lvbiIsIl9yZXNvbHZlZCIsImVkaXRpb24iLCJ3ZWJwYWNrUGF0aCIsIndlYnBhY2tQa2ciLCJ3ZWJwYWNrVmVyc2lvbiIsImV4dFBrZyIsImV4dFZlcnNpb24iLCJjbWRQYXRoIiwiY21kUGtnIiwiY21kVmVyc2lvbiIsInZlcnNpb25fZnVsbCIsImZyYW1ld29ya0luZm8iLCJmcmFtZXdvcmtQYXRoIiwiZnJhbWV3b3JrUGtnIiwiZnJhbWV3b3JrVmVyc2lvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQSxTQUFTQSxTQUFULENBQW1CQyxVQUFuQixFQUErQkMsUUFBL0IsRUFBeUM7QUFDdkMsTUFBSUMsWUFBWSxHQUFHQyxPQUFPLENBQUMsZUFBRCxDQUExQixDQUR1QyxDQUV2Qzs7O0FBQ0EsTUFBSUMsT0FBTyxHQUFHLEtBQWQ7QUFDQSxNQUFJQyxPQUFPLEdBQUdILFlBQVksQ0FBQ0ksSUFBYixDQUFrQk4sVUFBbEIsQ0FBZCxDQUp1QyxDQUt2Qzs7QUFDQUssRUFBQUEsT0FBTyxDQUFDRSxFQUFSLENBQVcsT0FBWCxFQUFvQixVQUFVQyxHQUFWLEVBQWU7QUFDakMsUUFBSUosT0FBSixFQUFhO0FBQ2JBLElBQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0FILElBQUFBLFFBQVEsQ0FBQ08sR0FBRCxDQUFSO0FBQ0QsR0FKRCxFQU51QyxDQVd2Qzs7QUFDQUgsRUFBQUEsT0FBTyxDQUFDRSxFQUFSLENBQVcsTUFBWCxFQUFtQixVQUFVRSxJQUFWLEVBQWdCO0FBQ2pDLFFBQUlMLE9BQUosRUFBYTtBQUNiQSxJQUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNBLFFBQUlJLEdBQUcsR0FBR0MsSUFBSSxLQUFLLENBQVQsR0FBYSxJQUFiLEdBQW9CLElBQUlDLEtBQUosQ0FBVSxlQUFlRCxJQUF6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YUFBYSxHQUFDLGVBQTVCLEtBQWdEbEosSUFBSSxDQUFDQyxLQUFMLENBQVdwQixFQUFFLENBQUNxQixZQUFILENBQWdCZ0osYUFBYSxHQUFDLGVBQTlCLEVBQStDLE9BQS9DLENBQVgsQ0FBaEQsSUFBdUgsRUFBM0k7QUFDQS9CLElBQUFBLENBQUMsQ0FBQ2lDLGdCQUFGLEdBQXFCRCxZQUFZLENBQUNkLE9BQWxDO0FBQ0FZLElBQUFBLGFBQWEsR0FBRyxPQUFPaEIsYUFBUCxHQUF1QixJQUF2QixHQUE4QmQsQ0FBQyxDQUFDaUMsZ0JBQWhEO0FBQ0Q7O0FBQ0QsU0FBTzFKLEdBQUcsR0FBRyxzQkFBTixHQUErQnlILENBQUMsQ0FBQ2lCLGFBQWpDLEdBQWlELFlBQWpELEdBQWdFakIsQ0FBQyxDQUFDeUIsVUFBbEUsR0FBK0UsR0FBL0UsR0FBcUZ6QixDQUFDLENBQUNvQixPQUF2RixHQUFpRyx3QkFBakcsR0FBNEhwQixDQUFDLENBQUM0QixVQUE5SCxHQUEySSxhQUEzSSxHQUEySjVCLENBQUMsQ0FBQ3VCLGNBQTdKLEdBQThLTyxhQUFyTDtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiXG4vLyoqKioqKioqKipcbmZ1bmN0aW9uIHJ1blNjcmlwdChzY3JpcHRQYXRoLCBjYWxsYmFjaykge1xuICB2YXIgY2hpbGRQcm9jZXNzID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xuICAvLyBrZWVwIHRyYWNrIG9mIHdoZXRoZXIgY2FsbGJhY2sgaGFzIGJlZW4gaW52b2tlZCB0byBwcmV2ZW50IG11bHRpcGxlIGludm9jYXRpb25zXG4gIHZhciBpbnZva2VkID0gZmFsc2U7XG4gIHZhciBwcm9jZXNzID0gY2hpbGRQcm9jZXNzLmZvcmsoc2NyaXB0UGF0aCk7XG4gIC8vIGxpc3RlbiBmb3IgZXJyb3JzIGFzIHRoZXkgbWF5IHByZXZlbnQgdGhlIGV4aXQgZXZlbnQgZnJvbSBmaXJpbmdcbiAgcHJvY2Vzcy5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKGludm9rZWQpIHJldHVybjtcbiAgICBpbnZva2VkID0gdHJ1ZTtcbiAgICBjYWxsYmFjayhlcnIpO1xuICB9KTtcbiAgLy8gZXhlY3V0ZSB0aGUgY2FsbGJhY2sgb25jZSB0aGUgcHJvY2VzcyBoYXMgZmluaXNoZWQgcnVubmluZ1xuICBwcm9jZXNzLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGUpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIHZhciBlcnIgPSBjb2RlID09PSAwID8gbnVsbCA6IG5ldyBFcnJvcignZXhpdCBjb2RlICcgKyBjb2RlKTtcbiAgICBjYWxsYmFjayhlcnIpO1xuICB9KTtcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gXG4gIHZhciB0aGlzVmFycyA9IHt9XG4gIHZhciB0aGlzT3B0aW9ucyA9IHt9XG4gIHZhciBwbHVnaW4gPSB7fVxuXG4gIGlmIChvcHRpb25zLmZyYW1ld29yayA9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzVmFycy5wbHVnaW5FcnJvcnMgPSBbXVxuICAgIHRoaXNWYXJzLnBsdWdpbkVycm9ycy5wdXNoKCd3ZWJwYWNrIGNvbmZpZzogZnJhbWV3b3JrIHBhcmFtZXRlciBvbiBleHQtd2VicGFjay1wbHVnaW4gaXMgbm90IGRlZmluZWQgLSB2YWx1ZXM6IHJlYWN0LCBhbmd1bGFyLCBleHRqcycpXG4gICAgcGx1Z2luLnZhcnMgPSB0aGlzVmFyc1xuICAgIHJldHVybiBwbHVnaW5cbiAgfVxuXG4gIGNvbnN0IHZhbGlkYXRlT3B0aW9ucyA9IHJlcXVpcmUoJ3NjaGVtYS11dGlscycpXG4gIHZhbGlkYXRlT3B0aW9ucyhyZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLmdldFZhbGlkYXRlT3B0aW9ucygpLCBvcHRpb25zLCAnJylcbiAgdGhpc1ZhcnMgPSByZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLmdldERlZmF1bHRWYXJzKClcbiAgdGhpc1ZhcnMuZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgc3dpdGNoKHRoaXNWYXJzLmZyYW1ld29yaykge1xuICAgIGNhc2UgJ2V4dGpzJzpcbiAgICAgIHRoaXNWYXJzLnBsdWdpbk5hbWUgPSAnZXh0LXdlYnBhY2stcGx1Z2luJ1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncmVhY3QnOlxuICAgICAgdGhpc1ZhcnMucGx1Z2luTmFtZSA9ICdleHQtcmVhY3Qtd2VicGFjay1wbHVnaW4nXG4gICAgICBicmVhaztcbiAgICBjYXNlICdhbmd1bGFyJzpcbiAgICAgIHRoaXNWYXJzLnBsdWdpbk5hbWUgPSAnZXh0LWFuZ3VsYXItd2VicGFjay1wbHVnaW4nXG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpc1ZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gIH1cblxuICB0aGlzVmFycy5hcHAgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5fZ2V0QXBwKClcbiAgcmVxdWlyZShgLi9wbHVnaW5VdGlsYCkubG9nKHRoaXNWYXJzLmFwcCArIGBIT09LIGNvbnN0cnVjdG9yYClcblxuICBsb2d2KG9wdGlvbnMsIGBwbHVnaW5OYW1lIC0gJHt0aGlzVmFycy5wbHVnaW5OYW1lfWApXG4gIGxvZ3Yob3B0aW9ucywgYHRoaXNWYXJzLmFwcCAtICR7dGhpc1ZhcnMuYXBwfWApXG5cbiAgY29uc3QgcmMgPSAoZnMuZXhpc3RzU3luYyhgLmV4dC0ke3RoaXNWYXJzLmZyYW1ld29ya31yY2ApICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGAuZXh0LSR7dGhpc1ZhcnMuZnJhbWV3b3JrfXJjYCwgJ3V0Zi04JykpIHx8IHt9KVxuICB0aGlzT3B0aW9ucyA9IHsgLi4ucmVxdWlyZShgLi8ke3RoaXNWYXJzLmZyYW1ld29ya31VdGlsYCkuZ2V0RGVmYXVsdE9wdGlvbnMoKSwgLi4ub3B0aW9ucywgLi4ucmMgfVxuICBsb2d2KG9wdGlvbnMsIGB0aGlzT3B0aW9ucyAtICR7SlNPTi5zdHJpbmdpZnkodGhpc09wdGlvbnMpfWApXG5cbiAgaWYgKHRoaXNPcHRpb25zLmVudmlyb25tZW50ID09ICdwcm9kdWN0aW9uJykgXG4gICAge3RoaXNWYXJzLnByb2R1Y3Rpb24gPSB0cnVlfVxuICBlbHNlIFxuICAgIHt0aGlzVmFycy5wcm9kdWN0aW9uID0gZmFsc2V9XG4gIGxvZ3Yob3B0aW9ucywgYHRoaXNWYXJzIC0gJHtKU09OLnN0cmluZ2lmeSh0aGlzVmFycyl9YClcblxuICBpZiAodGhpc1ZhcnMucHJvZHVjdGlvbiA9PSB0cnVlICYmIHRoaXNPcHRpb25zLnRyZWVzaGFrZSA9PSB0cnVlICYmIG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJykge1xuICAgIGxvZyh0aGlzVmFycy5hcHAgKyAnQlVJTEQgU1RFUCAxJylcbiAgICB0aGlzVmFycy5idWlsZHN0ZXAgPSAxXG4gICAgcmVxdWlyZShgLi9hbmd1bGFyVXRpbGApLl90b1Byb2QodGhpc1ZhcnMsIHRoaXNPcHRpb25zKVxuICB9XG4gIGlmICh0aGlzVmFycy5wcm9kdWN0aW9uID09IHRydWUgJiYgdGhpc09wdGlvbnMudHJlZXNoYWtlID09IGZhbHNlICYmIG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJykge1xuICAgIGxvZyh0aGlzVmFycy5hcHAgKyAnKGNoZWNrIGZvciBwcm9kIGZvbGRlciBhbmQgbW9kdWxlIGNoYW5nZSknKVxuICAgIGxvZyh0aGlzVmFycy5hcHAgKyAnQlVJTEQgU1RFUCAyJylcbiAgICB0aGlzVmFycy5idWlsZHN0ZXAgPSAyXG4gIH1cblxuICAvL21qZyBsb2cocmVxdWlyZSgnLi9wbHVnaW5VdGlsJykuX2dldFZlcnNpb25zKHRoaXNWYXJzLmFwcCwgdGhpc1ZhcnMucGx1Z2luTmFtZSwgdGhpc1ZhcnMuZnJhbWV3b3JrKSlcbiAgbG9nKHRoaXNWYXJzLmFwcCArICdCdWlsZGluZyBmb3IgJyArIHRoaXNPcHRpb25zLmVudmlyb25tZW50ICsgJywgJyArICdUcmVlc2hha2UgaXMgJyArIHRoaXNPcHRpb25zLnRyZWVzaGFrZSlcblxuICBwbHVnaW4udmFycyA9IHRoaXNWYXJzXG4gIHBsdWdpbi5vcHRpb25zID0gdGhpc09wdGlvbnNcbiAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnRlVOQ1RJT04gX2NvbnN0cnVjdG9yJylcblxuICByZXR1cm4gcGx1Z2luXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF90aGlzQ29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnRlVOQ1RJT04gX3RoaXNDb21waWxhdGlvbicpXG4gXG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09IDAgfHwgdmFycy5idWlsZHN0ZXAgPT0gMSkge1xuICAgICAgaWYgKG9wdGlvbnMuc2NyaXB0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gbnVsbCkge1xuICAgICAgICAgIHJ1blNjcmlwdChvcHRpb25zLnNjcmlwdCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwICsgYGZpbmlzaGVkIHJ1bm5pbmcgJHtvcHRpb25zLnNjcmlwdH1gKVxuICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX3RoaXNDb21waWxhdGlvbjogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucywgJ0ZVTkNUSU9OIF9jb21waWxhdGlvbicpXG5cbiAgICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgdmFyIGV4dENvbXBvbmVudHMgPSBbXVxuICAgICAgaWYgKHZhcnMucHJvZHVjdGlvbikge1xuICAgICAgICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInICYmIG9wdGlvbnMudHJlZXNoYWtlID09IHRydWUpIHtcbiAgICAgICAgICBleHRDb21wb25lbnRzID0gcmVxdWlyZSgnLi9hbmd1bGFyVXRpbCcpLl9nZXRBbGxDb21wb25lbnRzKHZhcnMsIG9wdGlvbnMpXG4gICAgICAgIH1cbiAgICAgICAgY29tcGlsYXRpb24uaG9va3Muc3VjY2VlZE1vZHVsZS50YXAoYGV4dC1zdWNjZWVkLW1vZHVsZWAsIG1vZHVsZSA9PiB7XG4gICAgICAgICAgaWYgKG1vZHVsZS5yZXNvdXJjZSAmJiAhbW9kdWxlLnJlc291cmNlLm1hdGNoKC9ub2RlX21vZHVsZXMvKSkge1xuICAgICAgICAgICAgaWYobW9kdWxlLnJlc291cmNlLm1hdGNoKC9cXC5odG1sJC8pICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgaWYobW9kdWxlLl9zb3VyY2UuX3ZhbHVlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2RvY3R5cGUgaHRtbCcpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdmFycy5kZXBzID0gWy4uLih2YXJzLmRlcHMgfHwgW10pLCAuLi5yZXF1aXJlKGAuLyR7dmFycy5mcmFtZXdvcmt9VXRpbGApLmV4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgdmFycy5kZXBzID0gWy4uLih2YXJzLmRlcHMgfHwgW10pLCAuLi5yZXF1aXJlKGAuLyR7dmFycy5mcmFtZXdvcmt9VXRpbGApLmV4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgaWYgKG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJyAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSB0cnVlKSB7XG4gICAgICAgICAgY29tcGlsYXRpb24uaG9va3MuZmluaXNoTW9kdWxlcy50YXAoYGV4dC1maW5pc2gtbW9kdWxlc2AsIG1vZHVsZXMgPT4ge1xuICAgICAgICAgICAgcmVxdWlyZSgnLi9hbmd1bGFyVXRpbCcpLl93cml0ZUZpbGVzVG9Qcm9kRm9sZGVyKHZhcnMsIG9wdGlvbnMpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwICE9IDEpIHtcbiAgICAgICAgY29tcGlsYXRpb24uaG9va3MuaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbi50YXAoYGV4dC1odG1sLWdlbmVyYXRpb25gLChkYXRhKSA9PiB7XG4gICAgICAgICAgbG9ndihvcHRpb25zLCdodG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uJylcbiAgICAgICAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgICAgICAgdmFyIGpzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuanMnKVxuICAgICAgICAgIHZhciBjc3NQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5jc3MnKVxuICAgICAgICAgIGRhdGEuYXNzZXRzLmpzLnVuc2hpZnQoanNQYXRoKVxuICAgICAgICAgIGRhdGEuYXNzZXRzLmNzcy51bnNoaWZ0KGNzc1BhdGgpXG4gICAgICAgICAgbG9nKHZhcnMuYXBwICsgYEFkZGluZyAke2pzUGF0aH0gYW5kICR7Y3NzUGF0aH0gdG8gaW5kZXguaHRtbGApXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2NvbXBpbGF0aW9uOiAnICsgZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfYWZ0ZXJDb21waWxlKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsICdGVU5DVElPTiBfYWZ0ZXJDb21waWxlJylcbiAgaWYgKG9wdGlvbnMuZnJhbWV3b3JrID09ICdleHRqcycpIHtcbiAgICAgICAgcmVxdWlyZShgLi9leHRqc1V0aWxgKS5fYWZ0ZXJDb21waWxlKGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIF9lbWl0KGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBsb2cgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2dcbiAgICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICAgIGxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gX2VtaXQnKVxuXG5cbiAgICB2YXIgZW1pdCA9IG9wdGlvbnMuZW1pdFxuICAgIHZhciB0cmVlc2hha2UgPSBvcHRpb25zLnRyZWVzaGFrZVxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAgIHZhciBlbnZpcm9ubWVudCA9ICBvcHRpb25zLmVudmlyb25tZW50XG5cbiAgICBpZiAoZW1pdCkge1xuICAgICAgaWYgKChlbnZpcm9ubWVudCA9PSAncHJvZHVjdGlvbicgJiYgdHJlZXNoYWtlID09IHRydWUgICYmIGZyYW1ld29yayA9PSAnYW5ndWxhcicpIHx8XG4gICAgICAgICAgKGVudmlyb25tZW50ICE9ICdwcm9kdWN0aW9uJyAmJiB0cmVlc2hha2UgPT0gZmFsc2UgJiYgZnJhbWV3b3JrID09ICdhbmd1bGFyJykgfHxcbiAgICAgICAgICAoZnJhbWV3b3JrID09ICdyZWFjdCcpIHx8XG4gICAgICAgICAgKGZyYW1ld29yayA9PSAnY29tcG9uZW50cycpXG4gICAgICApIHtcbiAgICAgICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgICAgIHZhciBmcmFtZXdvcmsgPSB2YXJzLmZyYW1ld29ya1xuICAgICAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgICAgIGNvbnN0IF9idWlsZEV4dEJ1bmRsZSA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLl9idWlsZEV4dEJ1bmRsZVxuICAgICAgICBsZXQgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vdXRwdXRQYXRoLHZhcnMuZXh0UGF0aClcbiAgICAgICAgaWYgKGNvbXBpbGVyLm91dHB1dFBhdGggPT09ICcvJyAmJiBjb21waWxlci5vcHRpb25zLmRldlNlcnZlcikge1xuICAgICAgICAgIG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIuY29udGVudEJhc2UsIG91dHB1dFBhdGgpXG4gICAgICAgIH1cbiAgICAgICAgbG9ndihvcHRpb25zLCdvdXRwdXRQYXRoOiAnICsgb3V0cHV0UGF0aClcbiAgICAgICAgbG9ndihvcHRpb25zLCdmcmFtZXdvcms6ICcgKyBmcmFtZXdvcmspXG4gICAgICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgICAgIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInICYmIG9wdGlvbnMudHJlZXNoYWtlID09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0UGF0aCwgY29tcGlsYXRpb24pXG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dFBhdGgsIGNvbXBpbGF0aW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgY29tbWFuZCA9ICcnXG4gICAgICAgIGlmIChvcHRpb25zLndhdGNoID09ICd5ZXMnICYmIHZhcnMucHJvZHVjdGlvbiA9PSBmYWxzZSkge1xuICAgICAgICAgIGNvbW1hbmQgPSAnd2F0Y2gnXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgY29tbWFuZCA9ICdidWlsZCdcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFycy5yZWJ1aWxkID09IHRydWUpIHtcbiAgICAgICAgICB2YXIgcGFybXMgPSBbXVxuICAgICAgICAgIGlmIChvcHRpb25zLnByb2ZpbGUgPT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMucHJvZmlsZSA9PSAnJyB8fCBvcHRpb25zLnByb2ZpbGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT0gJ2J1aWxkJykge1xuICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMuZW52aXJvbm1lbnRdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoY29tbWFuZCA9PSAnYnVpbGQnKSB7XG4gICAgICAgICAgICAgIHBhcm1zID0gWydhcHAnLCBjb21tYW5kLCBvcHRpb25zLnByb2ZpbGUsIG9wdGlvbnMuZW52aXJvbm1lbnRdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLnByb2ZpbGUsIG9wdGlvbnMuZW52aXJvbm1lbnRdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHZhcnMud2F0Y2hTdGFydGVkID09IGZhbHNlKSB7XG4gICAgICAgICAgICBhd2FpdCBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIG9wdGlvbnMpXG4gICAgICAgICAgICB2YXJzLndhdGNoU3RhcnRlZCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywnTk9UIHJ1bm5pbmcgZW1pdCcpXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KG9wdGlvbnMsJ2VtaXQgaXMgZmFsc2UnKVxuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ2VtaXQ6ICcgKyBlKVxuICAgIGNhbGxiYWNrKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0LCBjb21waWxhdGlvbikge1xuICB0cnkge1xuICAgIGxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gX3ByZXBhcmVGb3JCdWlsZCcpXG4gICAgY29uc3QgcmltcmFmID0gcmVxdWlyZSgncmltcmFmJylcbiAgICBjb25zdCBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKVxuICAgIGNvbnN0IGZzeCA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbiAgICB2YXIgcGFja2FnZXMgPSBvcHRpb25zLnBhY2thZ2VzXG4gICAgdmFyIHRvb2xraXQgPSBvcHRpb25zLnRvb2xraXRcbiAgICB2YXIgdGhlbWUgPSBvcHRpb25zLnRoZW1lXG5cbiAgICB0aGVtZSA9IHRoZW1lIHx8ICh0b29sa2l0ID09PSAnY2xhc3NpYycgPyAndGhlbWUtdHJpdG9uJyA6ICd0aGVtZS1tYXRlcmlhbCcpXG4gICAgbG9ndihvcHRpb25zLCdmaXJzdFRpbWU6ICcgKyB2YXJzLmZpcnN0VGltZSlcbiAgICBpZiAodmFycy5maXJzdFRpbWUpIHtcbiAgICAgIHJpbXJhZi5zeW5jKG91dHB1dClcbiAgICAgIG1rZGlycC5zeW5jKG91dHB1dClcbiAgICAgIGNvbnN0IGJ1aWxkWE1MID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5idWlsZFhNTFxuICAgICAgY29uc3QgY3JlYXRlQXBwSnNvbiA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuY3JlYXRlQXBwSnNvblxuICAgICAgY29uc3QgY3JlYXRlV29ya3NwYWNlSnNvbiA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuY3JlYXRlV29ya3NwYWNlSnNvblxuICAgICAgY29uc3QgY3JlYXRlSlNET01FbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuY3JlYXRlSlNET01FbnZpcm9ubWVudFxuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdidWlsZC54bWwnKSwgYnVpbGRYTUwodmFycy5wcm9kdWN0aW9uLCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdhcHAuanNvbicpLCBjcmVhdGVBcHBKc29uKHRoZW1lLCBwYWNrYWdlcywgdG9vbGtpdCwgb3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnanNkb20tZW52aXJvbm1lbnQuanMnKSwgY3JlYXRlSlNET01FbnZpcm9ubWVudChvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICd3b3Jrc3BhY2UuanNvbicpLCBjcmVhdGVXb3Jrc3BhY2VKc29uKG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcblxuICAgICAgdmFyIGZyYW1ld29yayA9IHZhcnMuZnJhbWV3b3JrO1xuICAgICAgLy9iZWNhdXNlIG9mIGEgcHJvYmxlbSB3aXRoIGNvbG9ycGlja2VyXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3V4L2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAndXgnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCArICdDb3B5aW5nICh1eCkgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vcGFja2FnZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdwYWNrYWdlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwICsgJ0NvcHlpbmcgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L292ZXJyaWRlcy9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L292ZXJyaWRlcy9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ292ZXJyaWRlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwICsgJ0NvcHlpbmcgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCdyZXNvdXJjZXMvJykpKSB7XG4gICAgICAgIHZhciBmcm9tUmVzb3VyY2VzID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdyZXNvdXJjZXMvJylcbiAgICAgICAgdmFyIHRvUmVzb3VyY2VzID0gcGF0aC5qb2luKG91dHB1dCwgJy4uL3Jlc291cmNlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUmVzb3VyY2VzLCB0b1Jlc291cmNlcylcbiAgICAgICAgbG9nKGFwcCArICdDb3B5aW5nICcgKyBmcm9tUmVzb3VyY2VzLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUmVzb3VyY2VzLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgIH1cbiAgICB2YXJzLmZpcnN0VGltZSA9IGZhbHNlXG4gICAgdmFyIGpzID0gJydcbiAgICBpZiAodmFycy5wcm9kdWN0aW9uKSB7XG4gICAgICBqcyA9IHZhcnMuZGVwcy5qb2luKCc7XFxuJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAganMgPSAnRXh0LnJlcXVpcmUoXCJFeHQuKlwiKSdcbiAgICB9XG4gICAgaWYgKHZhcnMubWFuaWZlc3QgPT09IG51bGwgfHwganMgIT09IHZhcnMubWFuaWZlc3QpIHtcbiAgICAgIHZhcnMubWFuaWZlc3QgPSBqc1xuICAgICAgY29uc3QgbWFuaWZlc3QgPSBwYXRoLmpvaW4ob3V0cHV0LCAnbWFuaWZlc3QuanMnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhtYW5pZmVzdCwganMsICd1dGY4JylcbiAgICAgIHZhcnMucmVidWlsZCA9IHRydWVcbiAgICAgIHZhciBidW5kbGVEaXIgPSBvdXRwdXQucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJylcbiAgICAgIGlmIChidW5kbGVEaXIudHJpbSgpID09ICcnKSB7YnVuZGxlRGlyID0gJy4vJ31cbiAgICAgIGxvZyhhcHAgKyAnQnVpbGRpbmcgRXh0IGJ1bmRsZSBhdDogJyArIGJ1bmRsZURpcilcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXJzLnJlYnVpbGQgPSBmYWxzZVxuICAgICAgbG9nKGFwcCArICdFeHQgcmVidWlsZCBOT1QgbmVlZGVkJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfcHJlcGFyZUZvckJ1aWxkOiAnICsgZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICAgIGxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gX2J1aWxkRXh0QnVuZGxlJylcblxuICAgIGxldCBzZW5jaGE7IHRyeSB7IHNlbmNoYSA9IHJlcXVpcmUoJ0BzZW5jaGEvY21kJykgfSBjYXRjaCAoZSkgeyBzZW5jaGEgPSAnc2VuY2hhJyB9XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoc2VuY2hhKSkge1xuICAgICAgbG9ndihvcHRpb25zLCdzZW5jaGEgZm9sZGVyIGV4aXN0cycpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndihvcHRpb25zLCdzZW5jaGEgZm9sZGVyIERPRVMgTk9UIGV4aXN0JylcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgb25CdWlsZERvbmUgPSAoKSA9PiB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywnb25CdWlsZERvbmUnKVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH1cblxuICAgICAgdmFyIG9wdHMgPSB7IGN3ZDogb3V0cHV0UGF0aCwgc2lsZW50OiB0cnVlLCBzdGRpbzogJ3BpcGUnLCBlbmNvZGluZzogJ3V0Zi04J31cbiAgICAgIGV4ZWN1dGVBc3luYyhhcHAsIHNlbmNoYSwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCBvcHRpb25zKS50aGVuIChcbiAgICAgICAgZnVuY3Rpb24oKSB7IG9uQnVpbGREb25lKCkgfSwgXG4gICAgICAgIGZ1bmN0aW9uKHJlYXNvbikgeyByZWplY3QocmVhc29uKSB9XG4gICAgICApXG4gICAgfSlcbiAgfVxuICBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coJ2UnKVxuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfYnVpbGRFeHRCdW5kbGU6ICcgKyBlKVxuICAgIGNhbGxiYWNrKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZG9uZSh2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9kb25lJylcblxuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSBmYWxzZSAmJiBvcHRpb25zLmZyYW1ld29yayA9PSAnYW5ndWxhcicpIHtcbiAgICAgIHJlcXVpcmUoYC4vJHtvcHRpb25zLmZyYW1ld29ya31VdGlsYCkuX3RvRGV2KHZhcnMsIG9wdGlvbnMpXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBpZihvcHRpb25zLmJyb3dzZXIgPT0gdHJ1ZSAmJiBvcHRpb25zLndhdGNoID09ICd5ZXMnICYmIHZhcnMucHJvZHVjdGlvbiA9PSBmYWxzZSkge1xuICAgICAgICBpZiAodmFycy5icm93c2VyQ291bnQgPT0gMCkge1xuICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDonICsgb3B0aW9ucy5wb3J0XG4gICAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwICsgYE9wZW5pbmcgYnJvd3NlciBhdCAke3VybH1gKVxuICAgICAgICAgIHZhcnMuYnJvd3NlckNvdW50KytcbiAgICAgICAgICBjb25zdCBvcG4gPSByZXF1aXJlKCdvcG4nKVxuICAgICAgICAgIG9wbih1cmwpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAvL2NvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdzaG93IGJyb3dzZXIgd2luZG93IC0gZXh0LWRvbmU6ICcgKyBlKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZUFzeW5jIChhcHAsIGNvbW1hbmQsIHBhcm1zLCBvcHRzLCBjb21waWxhdGlvbiwgb3B0aW9ucykge1xuICB0cnkge1xuICAgIC8vY29uc3QgREVGQVVMVF9TVUJTVFJTID0gWydbSU5GXSBMb2FkaW5nJywgJ1tJTkZdIFByb2Nlc3NpbmcnLCAnW0xPR10gRmFzaGlvbiBidWlsZCBjb21wbGV0ZScsICdbRVJSXScsICdbV1JOXScsIFwiW0lORl0gU2VydmVyXCIsIFwiW0lORl0gV3JpdGluZ1wiLCBcIltJTkZdIExvYWRpbmcgQnVpbGRcIiwgXCJbSU5GXSBXYWl0aW5nXCIsIFwiW0xPR10gRmFzaGlvbiB3YWl0aW5nXCJdO1xuICAgIGNvbnN0IERFRkFVTFRfU1VCU1RSUyA9IFtcIltJTkZdIHhTZXJ2ZXJcIiwgJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gQXBwZW5kJywgJ1tJTkZdIFByb2Nlc3NpbmcnLCAnW0lORl0gUHJvY2Vzc2luZyBCdWlsZCcsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gICAgdmFyIHN1YnN0cmluZ3MgPSBERUZBVUxUX1NVQlNUUlMgXG4gICAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKVxuICAgIGNvbnN0IGNyb3NzU3Bhd24gPSByZXF1aXJlKCdjcm9zcy1zcGF3bicpXG4gICAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gICAgbG9ndihvcHRpb25zLCAnRlVOQ1RJT04gZXhlY3V0ZUFzeW5jJylcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsb2d2KG9wdGlvbnMsYGNvbW1hbmQgLSAke2NvbW1hbmR9YClcbiAgICAgIGxvZ3Yob3B0aW9ucywgYHBhcm1zIC0gJHtwYXJtc31gKVxuICAgICAgbG9ndihvcHRpb25zLCBgb3B0cyAtICR7SlNPTi5zdHJpbmdpZnkob3B0cyl9YClcbiAgICAgIGxldCBjaGlsZCA9IGNyb3NzU3Bhd24oY29tbWFuZCwgcGFybXMsIG9wdHMpXG4gICAgICBjaGlsZC5vbignY2xvc2UnLCAoY29kZSwgc2lnbmFsKSA9PiB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywgYG9uIGNsb3NlOiBgICsgY29kZSkgXG4gICAgICAgIGlmKGNvZGUgPT09IDApIHsgcmVzb2x2ZSgwKSB9XG4gICAgICAgIGVsc2UgeyBjb21waWxhdGlvbi5lcnJvcnMucHVzaCggbmV3IEVycm9yKGNvZGUpICk7IHJlc29sdmUoMCkgfVxuICAgICAgfSlcbiAgICAgIGNoaWxkLm9uKCdlcnJvcicsIChlcnJvcikgPT4geyBcbiAgICAgICAgbG9ndihvcHRpb25zLCBgb24gZXJyb3JgKSBcbiAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goZXJyb3IpXG4gICAgICAgIHJlc29sdmUoMClcbiAgICAgIH0pXG4gICAgICBjaGlsZC5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICB2YXIgc3RyID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UoL1xccj9cXG58XFxyL2csIFwiIFwiKS50cmltKClcbiAgICAgICAgbG9ndihvcHRpb25zLCBgJHtzdHJ9YClcbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS50b1N0cmluZygpLm1hdGNoKC9GYXNoaW9uIHdhaXRpbmcgZm9yIGNoYW5nZXNcXC5cXC5cXC4vKSkge1xuXG4gICAgICAgICAgLy8gY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuICAgICAgICAgIC8vIHZhciBmaWxlbmFtZSA9IHByb2Nlc3MuY3dkKCkrJy9zcmMvaW5kZXguanMnO1xuICAgICAgICAgIC8vIHZhciBkYXRhID0gZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lKTtcbiAgICAgICAgICAvLyBmcy53cml0ZUZpbGVTeW5jKGZpbGVuYW1lLCBkYXRhICsgJyAnLCAndXRmOCcpXG4gICAgICAgICAgLy8gbG9ndihvcHRpb25zLCBgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKVxuXG4gICAgICAgICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuICAgICAgICAgIHZhciBmaWxlbmFtZSA9IHByb2Nlc3MuY3dkKCkgKyAnL3NyYy9pbmRleC5qcyc7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lKTtcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZW5hbWUsIGRhdGEgKyAnICcsICd1dGY4Jyk7XG4gICAgICAgICAgICBsb2cob3B0aW9ucywgYHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGxvZyhvcHRpb25zLCBgTk9UIHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZSgwKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmIChzdWJzdHJpbmdzLnNvbWUoZnVuY3Rpb24odikgeyByZXR1cm4gZGF0YS5pbmRleE9mKHYpID49IDA7IH0pKSB7IFxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbSU5GXVwiLCBcIlwiKVxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbTE9HXVwiLCBcIlwiKVxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpLnRyaW0oKVxuICAgICAgICAgICAgaWYgKHN0ci5pbmNsdWRlcyhcIltFUlJdXCIpKSB7XG4gICAgICAgICAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGFwcCArIHN0ci5yZXBsYWNlKC9eXFxbRVJSXFxdIC9naSwgJycpKTtcbiAgICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbRVJSXVwiLCBgJHtjaGFsay5yZWQoXCJbRVJSXVwiKX1gKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9nKGAke2FwcH0ke3N0cn1gKSBcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBjaGlsZC5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICBsb2d2KG9wdGlvbnMsIGBlcnJvciBvbiBjbG9zZTogYCArIGRhdGEpIFxuICAgICAgICB2YXIgc3RyID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UoL1xccj9cXG58XFxyL2csIFwiIFwiKS50cmltKClcbiAgICAgICAgdmFyIHN0ckphdmFPcHRzID0gXCJQaWNrZWQgdXAgX0pBVkFfT1BUSU9OU1wiO1xuICAgICAgICB2YXIgaW5jbHVkZXMgPSBzdHIuaW5jbHVkZXMoc3RySmF2YU9wdHMpXG4gICAgICAgIGlmICghaW5jbHVkZXMpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJHthcHB9ICR7Y2hhbGsucmVkKFwiW0VSUl1cIil9ICR7c3RyfWApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ2V4ZWN1dGVBc3luYzogJyArIGUpXG4gICAgY2FsbGJhY2soKVxuICB9IFxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nKHMpIHtcbiAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgdHJ5IHtcbiAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICB9XG4gIGNhdGNoKGUpIHt9XG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpXG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9ndihvcHRpb25zLCBzKSB7XG4gIGlmIChvcHRpb25zLnZlcmJvc2UgPT0gJ3llcycpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGAtdmVyYm9zZTogJHtzfWApXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRBcHAoKSB7XG4gIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbiAgdmFyIHByZWZpeCA9IGBgXG4gIGNvbnN0IHBsYXRmb3JtID0gcmVxdWlyZSgnb3MnKS5wbGF0Zm9ybSgpXG4gIGlmIChwbGF0Zm9ybSA9PSAnZGFyd2luJykgeyBwcmVmaXggPSBg4oS5IO+9omV4dO+9ozpgIH1cbiAgZWxzZSB7IHByZWZpeCA9IGBpIFtleHRdOmAgfVxuICByZXR1cm4gYCR7Y2hhbGsuZ3JlZW4ocHJlZml4KX0gYFxufVxuXG5leHBvcnQgZnVuY3Rpb24gX2dldFZlcnNpb25zKGFwcCwgcGx1Z2luTmFtZSwgZnJhbWV3b3JrTmFtZSkge1xuICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuXG4gIHZhciB2ID0ge31cbiAgdmFyIHBsdWdpblBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEnLCBwbHVnaW5OYW1lKVxuICB2YXIgcGx1Z2luUGtnID0gKGZzLmV4aXN0c1N5bmMocGx1Z2luUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LnBsdWdpblZlcnNpb24gPSBwbHVnaW5Qa2cudmVyc2lvblxuICB2Ll9yZXNvbHZlZCA9IHBsdWdpblBrZy5fcmVzb2x2ZWRcbiAgaWYgKHYuX3Jlc29sdmVkID09IHVuZGVmaW5lZCkge1xuICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICB9XG4gIGVsc2Uge1xuICAgIGlmICgtMSA9PSB2Ll9yZXNvbHZlZC5pbmRleE9mKCdjb21tdW5pdHknKSkge1xuICAgICAgdi5lZGl0aW9uID0gYENvbW1lcmNpYWxgXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdi5lZGl0aW9uID0gYENvbW11bml0eWBcbiAgICB9XG4gIH1cblxuICB2YXIgd2VicGFja1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL3dlYnBhY2snKVxuICB2YXIgd2VicGFja1BrZyA9IChmcy5leGlzdHNTeW5jKHdlYnBhY2tQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMod2VicGFja1BhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LndlYnBhY2tWZXJzaW9uID0gd2VicGFja1BrZy52ZXJzaW9uXG5cbiAgdmFyIGV4dFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0JylcbiAgdmFyIGV4dFBrZyA9IChmcy5leGlzdHNTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhleHRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5leHRWZXJzaW9uID0gZXh0UGtnLnNlbmNoYS52ZXJzaW9uXG5cbiAgdmFyIGNtZFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSxgbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5jbWRWZXJzaW9uID0gY21kUGtnLnZlcnNpb25fZnVsbFxuXG4gIGlmICh2LmNtZFZlcnNpb24gPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGNtZFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSxgbm9kZV9tb2R1bGVzL0BzZW5jaGEvJHtwbHVnaW5OYW1lfS9ub2RlX21vZHVsZXMvQHNlbmNoYS9jbWRgKVxuICAgIHZhciBjbWRQa2cgPSAoZnMuZXhpc3RzU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gICAgdi5jbWRWZXJzaW9uID0gY21kUGtnLnZlcnNpb25fZnVsbFxuICB9XG5cbiAgdmFyIGZyYW1ld29ya0luZm8gPSAnJ1xuICAgaWYgKGZyYW1ld29ya05hbWUgIT0gdW5kZWZpbmVkICYmIGZyYW1ld29ya05hbWUgIT0gJ2V4dGpzJykge1xuICAgIHZhciBmcmFtZXdvcmtQYXRoID0gJydcbiAgICBpZiAoZnJhbWV3b3JrTmFtZSA9PSAncmVhY3QnKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9yZWFjdCcpXG4gICAgfVxuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdhbmd1bGFyJykge1xuICAgICAgZnJhbWV3b3JrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQGFuZ3VsYXIvY29yZScpXG4gICAgfVxuICAgIHZhciBmcmFtZXdvcmtQa2cgPSAoZnMuZXhpc3RzU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZnJhbWV3b3JrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gICAgdi5mcmFtZXdvcmtWZXJzaW9uID0gZnJhbWV3b3JrUGtnLnZlcnNpb25cbiAgICBmcmFtZXdvcmtJbmZvID0gJywgJyArIGZyYW1ld29ya05hbWUgKyAnIHYnICsgdi5mcmFtZXdvcmtWZXJzaW9uXG4gIH1cbiAgcmV0dXJuIGFwcCArICdleHQtd2VicGFjay1wbHVnaW4gdicgKyB2LnBsdWdpblZlcnNpb24gKyAnLCBFeHQgSlMgdicgKyB2LmV4dFZlcnNpb24gKyAnICcgKyB2LmVkaXRpb24gKyAnIEVkaXRpb24sIFNlbmNoYSBDbWQgdicgKyB2LmNtZFZlcnNpb24gKyAnLCB3ZWJwYWNrIHYnICsgdi53ZWJwYWNrVmVyc2lvbiArIGZyYW1ld29ya0luZm9cbiB9Il19