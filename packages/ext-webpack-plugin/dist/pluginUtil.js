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

    if (options.framework == 'extjs') {
      require('./pluginUtil').logv(options, 'FUNCTION _compilation (empty)');

      return;
    }

    var extComponents = [];

    if (vars.production) {
      if (options.framework == 'angular' && options.treeshake) {
        extComponents = require('./angularUtil')._getAllComponents(vars, options);
      }

      compilation.hooks.succeedModule.tap(`ext-succeed-module`, module => {
        //require('./pluginUtil').logv(options, 'HOOK succeedModule')
        if (module.resource && !module.resource.match(/node_modules/)) {
          if (module.resource.match(/\.html$/) != null) {
            if (module._source._value.toLowerCase().includes('doctype html') == false) {
              vars.deps = [...(vars.deps || []), ...require(`./${vars.framework}Util`).extractFromSource(module, options, compilation, extComponents)];
            }
          } else {
            vars.deps = [...(vars.deps || []), ...require(`./${vars.framework}Util`).extractFromSource(module, options, compilation, extComponents)];
          }
        } // if (extComponents.length && module.resource && (module.resource.match(/\.(j|t)sx?$/) ||
        // options.framework == 'angular' && module.resource.match(/\.html$/)) &&
        // !module.resource.match(/node_modules/) && !module.resource.match(`/ext-{$options.framework}/build/`)) {
        //   vars.deps = [...(vars.deps || []), ...require(`./${vars.framework}Util`).extractFromSource(module, options, compilation, extComponents)]
        // }

      });

      if (options.framework == 'angular' && options.treeshake == true) {
        compilation.hooks.finishModules.tap(`ext-finish-modules`, modules => {
          require('./pluginUtil').logv(options, 'HOOK finishModules');

          require('./angularUtil')._writeFilesToProdFolder(vars, options);
        });
      }
    } // if (
    //   ( options.framework == 'angular' && options.treeshake == false) ||
    //     options.framework == 'react' ||
    //     options.framework == 'components'
    //   ) {
    // compiler.hooks.emit.tapAsync(`ext-emit`, (compilation, callback) => {
    //   require(`./pluginUtil`)._emit(compiler, compilation, vars, options, callback)
    // })
    // try {
    //   // eslint-disable-next-line global-require
    //   HtmlWebpackPlugin = require('html-webpack-plugin');
    // } catch (e) {
    //   if (!(e instanceof Error) || e.code !== 'MODULE_NOT_FOUND') {
    //     throw e;
    //   }
    // }
    // var HtmlWebpackPlugin = require('html-webpack-plugin');
    // if (HtmlWebpackPlugin && HtmlWebpackPlugin.getHooks) {
    //   HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(`ext-beforeAssetTagGeneration`, (data, callback) => {
    //     console.log(data.assetTags.scripts)
    //     console.log(data.assetTags.styles)
    //     callback(null, data);
    //   })
    // }
    // else {
    //   console.log('no')
    // }
    // HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
    //   'sri',
    //   this.beforeHtmlGeneration.bind(this, hwpCompilation)
    // );
    // HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
    //   'sri',
    //   function cb(data, callback) {
    //     var processTag = self.processTag.bind(self, hwpCompilation);
    //     data.assetTags.scripts.filter(util.filterTag).forEach(processTag);
    //     data.assetTags.styles.filter(util.filterTag).forEach(processTag);
    //     callback(null, data);
    //   }
    // );
    //      }


    compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tap(`ext-html-generation`, data => {
      logv(options, 'htmlWebpackPluginBeforeHtmlGeneration');

      const path = require('path');

      var jsPath = path.join(vars.extPath, 'ext.js');
      var cssPath = path.join(vars.extPath, 'ext.css');
      console.log(data);
      data.assets.js.unshift(jsPath);
      data.assets.css.unshift(cssPath);
      console.log(data);
      log(vars.app + `Adding ${jsPath} and ${cssPath} to index.html`);
    }); //}
    // else {
    //   logv(options,'skipped htmlWebpackPluginBeforeHtmlGeneration')
    // }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbInJ1blNjcmlwdCIsInNjcmlwdFBhdGgiLCJjYWxsYmFjayIsImNoaWxkUHJvY2VzcyIsInJlcXVpcmUiLCJpbnZva2VkIiwicHJvY2VzcyIsImZvcmsiLCJvbiIsImVyciIsImNvZGUiLCJFcnJvciIsIl9jb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJmcyIsInRoaXNWYXJzIiwidGhpc09wdGlvbnMiLCJwbHVnaW4iLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwidmFycyIsInZhbGlkYXRlT3B0aW9ucyIsImdldFZhbGlkYXRlT3B0aW9ucyIsImdldERlZmF1bHRWYXJzIiwicGx1Z2luTmFtZSIsImFwcCIsIl9nZXRBcHAiLCJsb2d2IiwicmMiLCJleGlzdHNTeW5jIiwiSlNPTiIsInBhcnNlIiwicmVhZEZpbGVTeW5jIiwiZ2V0RGVmYXVsdE9wdGlvbnMiLCJzdHJpbmdpZnkiLCJlbnZpcm9ubWVudCIsInByb2R1Y3Rpb24iLCJsb2ciLCJ0cmVlc2hha2UiLCJfdG9Qcm9kIiwiX3RoaXNDb21waWxhdGlvbiIsImNvbXBpbGVyIiwiY29tcGlsYXRpb24iLCJzY3JpcHQiLCJlIiwiZXJyb3JzIiwiX2NvbXBpbGF0aW9uIiwiZXh0Q29tcG9uZW50cyIsIl9nZXRBbGxDb21wb25lbnRzIiwiaG9va3MiLCJzdWNjZWVkTW9kdWxlIiwidGFwIiwibW9kdWxlIiwicmVzb3VyY2UiLCJtYXRjaCIsIl9zb3VyY2UiLCJfdmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiZGVwcyIsImV4dHJhY3RGcm9tU291cmNlIiwiZmluaXNoTW9kdWxlcyIsIm1vZHVsZXMiLCJfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciIsImh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24iLCJkYXRhIiwicGF0aCIsImpzUGF0aCIsImpvaW4iLCJleHRQYXRoIiwiY3NzUGF0aCIsImNvbnNvbGUiLCJhc3NldHMiLCJqcyIsInVuc2hpZnQiLCJjc3MiLCJfYWZ0ZXJDb21waWxlIiwiX2VtaXQiLCJlbWl0IiwiX2J1aWxkRXh0QnVuZGxlIiwib3V0cHV0UGF0aCIsImRldlNlcnZlciIsImNvbnRlbnRCYXNlIiwiX3ByZXBhcmVGb3JCdWlsZCIsImNvbW1hbmQiLCJ3YXRjaCIsInJlYnVpbGQiLCJwYXJtcyIsInByb2ZpbGUiLCJ3YXRjaFN0YXJ0ZWQiLCJvdXRwdXQiLCJyaW1yYWYiLCJta2RpcnAiLCJmc3giLCJwYWNrYWdlcyIsInRvb2xraXQiLCJ0aGVtZSIsImZpcnN0VGltZSIsInN5bmMiLCJidWlsZFhNTCIsImNyZWF0ZUFwcEpzb24iLCJjcmVhdGVXb3Jrc3BhY2VKc29uIiwiY3JlYXRlSlNET01FbnZpcm9ubWVudCIsIndyaXRlRmlsZVN5bmMiLCJjd2QiLCJmcm9tUGF0aCIsInRvUGF0aCIsImNvcHlTeW5jIiwicmVwbGFjZSIsImZyb21SZXNvdXJjZXMiLCJ0b1Jlc291cmNlcyIsIm1hbmlmZXN0IiwiYnVuZGxlRGlyIiwidHJpbSIsInNlbmNoYSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25CdWlsZERvbmUiLCJvcHRzIiwic2lsZW50Iiwic3RkaW8iLCJlbmNvZGluZyIsImV4ZWN1dGVBc3luYyIsInRoZW4iLCJyZWFzb24iLCJfZG9uZSIsIl90b0RldiIsImJyb3dzZXIiLCJicm93c2VyQ291bnQiLCJ1cmwiLCJwb3J0Iiwib3BuIiwiREVGQVVMVF9TVUJTVFJTIiwic3Vic3RyaW5ncyIsImNoYWxrIiwiY3Jvc3NTcGF3biIsImNoaWxkIiwic2lnbmFsIiwiZXJyb3IiLCJzdGRvdXQiLCJzdHIiLCJ0b1N0cmluZyIsImZpbGVuYW1lIiwic29tZSIsInYiLCJpbmRleE9mIiwicmVkIiwic3RkZXJyIiwic3RySmF2YU9wdHMiLCJzIiwiY3Vyc29yVG8iLCJjbGVhckxpbmUiLCJ3cml0ZSIsInZlcmJvc2UiLCJwcmVmaXgiLCJwbGF0Zm9ybSIsImdyZWVuIiwiX2dldFZlcnNpb25zIiwiZnJhbWV3b3JrTmFtZSIsInBsdWdpblBhdGgiLCJwbHVnaW5Qa2ciLCJwbHVnaW5WZXJzaW9uIiwidmVyc2lvbiIsIl9yZXNvbHZlZCIsImVkaXRpb24iLCJ3ZWJwYWNrUGF0aCIsIndlYnBhY2tQa2ciLCJ3ZWJwYWNrVmVyc2lvbiIsImV4dFBrZyIsImV4dFZlcnNpb24iLCJjbWRQYXRoIiwiY21kUGtnIiwiY21kVmVyc2lvbiIsInZlcnNpb25fZnVsbCIsImZyYW1ld29ya0luZm8iLCJmcmFtZXdvcmtQYXRoIiwiZnJhbWV3b3JrUGtnIiwiZnJhbWV3b3JrVmVyc2lvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQSxTQUFTQSxTQUFULENBQW1CQyxVQUFuQixFQUErQkMsUUFBL0IsRUFBeUM7QUFDdkMsTUFBSUMsWUFBWSxHQUFHQyxPQUFPLENBQUMsZUFBRCxDQUExQixDQUR1QyxDQUV2Qzs7O0FBQ0EsTUFBSUMsT0FBTyxHQUFHLEtBQWQ7QUFDQSxNQUFJQyxPQUFPLEdBQUdILFlBQVksQ0FBQ0ksSUFBYixDQUFrQk4sVUFBbEIsQ0FBZCxDQUp1QyxDQUt2Qzs7QUFDQUssRUFBQUEsT0FBTyxDQUFDRSxFQUFSLENBQVcsT0FBWCxFQUFvQixVQUFVQyxHQUFWLEVBQWU7QUFDakMsUUFBSUosT0FBSixFQUFhO0FBQ2JBLElBQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0FILElBQUFBLFFBQVEsQ0FBQ08sR0FBRCxDQUFSO0FBQ0QsR0FKRCxFQU51QyxDQVd2Qzs7QUFDQUgsRUFBQUEsT0FBTyxDQUFDRSxFQUFSLENBQVcsTUFBWCxFQUFtQixVQUFVRSxJQUFWLEVBQWdCO0FBQ2pDLFFBQUlMLE9BQUosRUFBYTtBQUNiQSxJQUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNBLFFBQUlJLEdBQUcsR0FBR0MsSUFBSSxLQUFLLENBQVQsR0FBYSxJQUFiLEdBQW9CLElBQUlDLEtBQUosQ0FBVSxlQUFlRCxJQUF6QixDQUE5QjtBQUNB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ZUFBOUIsRUFBK0MsT0FBL0MsQ0FBWCxDQUFoRCxJQUF1SCxFQUEzSTtBQUNBL0IsSUFBQUEsQ0FBQyxDQUFDaUMsZ0JBQUYsR0FBcUJELFlBQVksQ0FBQ2QsT0FBbEM7QUFDQVksSUFBQUEsYUFBYSxHQUFHLE9BQU9oQixhQUFQLEdBQXVCLElBQXZCLEdBQThCZCxDQUFDLENBQUNpQyxnQkFBaEQ7QUFDRDs7QUFDRCxTQUFPekosR0FBRyxHQUFHLHNCQUFOLEdBQStCd0gsQ0FBQyxDQUFDaUIsYUFBakMsR0FBaUQsWUFBakQsR0FBZ0VqQixDQUFDLENBQUN5QixVQUFsRSxHQUErRSxHQUEvRSxHQUFxRnpCLENBQUMsQ0FBQ29CLE9BQXZGLEdBQWlHLHdCQUFqRyxHQUE0SHBCLENBQUMsQ0FBQzRCLFVBQTlILEdBQTJJLGFBQTNJLEdBQTJKNUIsQ0FBQyxDQUFDdUIsY0FBN0osR0FBOEtPLGFBQXJMO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8vKioqKioqKioqKlxuZnVuY3Rpb24gcnVuU2NyaXB0KHNjcmlwdFBhdGgsIGNhbGxiYWNrKSB7XG4gIHZhciBjaGlsZFByb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG4gIC8vIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBjYWxsYmFjayBoYXMgYmVlbiBpbnZva2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgaW52b2NhdGlvbnNcbiAgdmFyIGludm9rZWQgPSBmYWxzZTtcbiAgdmFyIHByb2Nlc3MgPSBjaGlsZFByb2Nlc3MuZm9yayhzY3JpcHRQYXRoKTtcbiAgLy8gbGlzdGVuIGZvciBlcnJvcnMgYXMgdGhleSBtYXkgcHJldmVudCB0aGUgZXhpdCBldmVudCBmcm9tIGZpcmluZ1xuICBwcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xuICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjayBvbmNlIHRoZSBwcm9jZXNzIGhhcyBmaW5pc2hlZCBydW5uaW5nXG4gIHByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZSkge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgdmFyIGVyciA9IGNvZGUgPT09IDAgPyBudWxsIDogbmV3IEVycm9yKCdleGl0IGNvZGUgJyArIGNvZGUpO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfY29uc3RydWN0b3Iob3B0aW9ucykge1xuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiBcbiAgdmFyIHRoaXNWYXJzID0ge31cbiAgdmFyIHRoaXNPcHRpb25zID0ge31cbiAgdmFyIHBsdWdpbiA9IHt9XG5cbiAgaWYgKG9wdGlvbnMuZnJhbWV3b3JrID09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNWYXJzLnBsdWdpbkVycm9ycyA9IFtdXG4gICAgdGhpc1ZhcnMucGx1Z2luRXJyb3JzLnB1c2goJ3dlYnBhY2sgY29uZmlnOiBmcmFtZXdvcmsgcGFyYW1ldGVyIG9uIGV4dC13ZWJwYWNrLXBsdWdpbiBpcyBub3QgZGVmaW5lZCAtIHZhbHVlczogcmVhY3QsIGFuZ3VsYXIsIGV4dGpzJylcbiAgICBwbHVnaW4udmFycyA9IHRoaXNWYXJzXG4gICAgcmV0dXJuIHBsdWdpblxuICB9XG5cbiAgY29uc3QgdmFsaWRhdGVPcHRpb25zID0gcmVxdWlyZSgnc2NoZW1hLXV0aWxzJylcbiAgdmFsaWRhdGVPcHRpb25zKHJlcXVpcmUoYC4vJHtvcHRpb25zLmZyYW1ld29ya31VdGlsYCkuZ2V0VmFsaWRhdGVPcHRpb25zKCksIG9wdGlvbnMsICcnKVxuICB0aGlzVmFycyA9IHJlcXVpcmUoYC4vJHtvcHRpb25zLmZyYW1ld29ya31VdGlsYCkuZ2V0RGVmYXVsdFZhcnMoKVxuICB0aGlzVmFycy5mcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICBzd2l0Y2godGhpc1ZhcnMuZnJhbWV3b3JrKSB7XG4gICAgY2FzZSAnZXh0anMnOlxuICAgICAgdGhpc1ZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gICAgICBicmVhaztcbiAgICBjYXNlICdyZWFjdCc6XG4gICAgICB0aGlzVmFycy5wbHVnaW5OYW1lID0gJ2V4dC1yZWFjdC13ZWJwYWNrLXBsdWdpbidcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2FuZ3VsYXInOlxuICAgICAgdGhpc1ZhcnMucGx1Z2luTmFtZSA9ICdleHQtYW5ndWxhci13ZWJwYWNrLXBsdWdpbidcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzVmFycy5wbHVnaW5OYW1lID0gJ2V4dC13ZWJwYWNrLXBsdWdpbidcbiAgfVxuXG4gIHRoaXNWYXJzLmFwcCA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLl9nZXRBcHAoKVxuICBsb2d2KG9wdGlvbnMsIGBwbHVnaW5OYW1lIC0gJHt0aGlzVmFycy5wbHVnaW5OYW1lfWApXG4gIGxvZ3Yob3B0aW9ucywgYHRoaXNWYXJzLmFwcCAtICR7dGhpc1ZhcnMuYXBwfWApXG5cbiAgY29uc3QgcmMgPSAoZnMuZXhpc3RzU3luYyhgLmV4dC0ke3RoaXNWYXJzLmZyYW1ld29ya31yY2ApICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGAuZXh0LSR7dGhpc1ZhcnMuZnJhbWV3b3JrfXJjYCwgJ3V0Zi04JykpIHx8IHt9KVxuICB0aGlzT3B0aW9ucyA9IHsgLi4ucmVxdWlyZShgLi8ke3RoaXNWYXJzLmZyYW1ld29ya31VdGlsYCkuZ2V0RGVmYXVsdE9wdGlvbnMoKSwgLi4ub3B0aW9ucywgLi4ucmMgfVxuICBsb2d2KG9wdGlvbnMsIGB0aGlzT3B0aW9ucyAtICR7SlNPTi5zdHJpbmdpZnkodGhpc09wdGlvbnMpfWApXG5cbiAgaWYgKHRoaXNPcHRpb25zLmVudmlyb25tZW50ID09ICdwcm9kdWN0aW9uJykgXG4gICAge3RoaXNWYXJzLnByb2R1Y3Rpb24gPSB0cnVlfVxuICBlbHNlIFxuICAgIHt0aGlzVmFycy5wcm9kdWN0aW9uID0gZmFsc2V9XG4gIGxvZ3Yob3B0aW9ucywgYHRoaXNWYXJzIC0gJHtKU09OLnN0cmluZ2lmeSh0aGlzVmFycyl9YClcblxuICAvL21qZyBsb2cocmVxdWlyZSgnLi9wbHVnaW5VdGlsJykuX2dldFZlcnNpb25zKHRoaXNWYXJzLmFwcCwgdGhpc1ZhcnMucGx1Z2luTmFtZSwgdGhpc1ZhcnMuZnJhbWV3b3JrKSlcbiAgbG9nKHRoaXNWYXJzLmFwcCArICdCdWlsZGluZyBmb3IgJyArIHRoaXNPcHRpb25zLmVudmlyb25tZW50ICsgJywgJyArICdUcmVlc2hha2UgaXMgJyArIHRoaXNPcHRpb25zLnRyZWVzaGFrZSlcbi8vICBsb2codGhpc1ZhcnMuYXBwICsgJ1RyZWVzaGFrZSBpcyAnICsgdGhpc09wdGlvbnMudHJlZXNoYWtlKVxuXG4gIGlmICh0aGlzVmFycy5wcm9kdWN0aW9uID09IHRydWUgJiYgdGhpc09wdGlvbnMudHJlZXNoYWtlID09IHRydWUgJiYgb3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB7XG4gICAgcmVxdWlyZShgLi9hbmd1bGFyVXRpbGApLl90b1Byb2QodGhpc1ZhcnMsIHRoaXNPcHRpb25zKVxuICB9XG5cbiAgcGx1Z2luLnZhcnMgPSB0aGlzVmFyc1xuICBwbHVnaW4ub3B0aW9ucyA9IHRoaXNPcHRpb25zXG4gIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucywgJ0ZVTkNUSU9OIF9jb25zdHJ1Y3RvcicpXG5cbiAgcmV0dXJuIHBsdWdpblxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfdGhpc0NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucywgJ0ZVTkNUSU9OIF90aGlzQ29tcGlsYXRpb24nKVxuXG4gICAgaWYgKG9wdGlvbnMuc2NyaXB0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKG9wdGlvbnMuc2NyaXB0ICE9IG51bGwpIHtcbiAgICAgICAgcnVuU2NyaXB0KG9wdGlvbnMuc2NyaXB0LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCArIGBmaW5pc2hlZCBydW5uaW5nICR7b3B0aW9ucy5zY3JpcHR9YClcbiAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX3RoaXNDb21waWxhdGlvbjogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucywgJ0ZVTkNUSU9OIF9jb21waWxhdGlvbicpXG5cbiAgICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2V4dGpzJykge1xuICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCdGVU5DVElPTiBfY29tcGlsYXRpb24gKGVtcHR5KScpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdXG5cbiAgICBpZiAodmFycy5wcm9kdWN0aW9uKSB7XG4gICAgICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInICYmIG9wdGlvbnMudHJlZXNoYWtlKSB7XG4gICAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKCcuL2FuZ3VsYXJVdGlsJykuX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucylcbiAgICAgIH1cblxuICAgICAgY29tcGlsYXRpb24uaG9va3Muc3VjY2VlZE1vZHVsZS50YXAoYGV4dC1zdWNjZWVkLW1vZHVsZWAsIG1vZHVsZSA9PiB7XG4gICAgICAgIC8vcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnSE9PSyBzdWNjZWVkTW9kdWxlJylcbiAgICAgICAgaWYgKG1vZHVsZS5yZXNvdXJjZSAmJiAhbW9kdWxlLnJlc291cmNlLm1hdGNoKC9ub2RlX21vZHVsZXMvKSkge1xuICAgICAgICAgIGlmKG1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvXFwuaHRtbCQvKSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZihtb2R1bGUuX3NvdXJjZS5fdmFsdWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnZG9jdHlwZSBodG1sJykgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgdmFycy5kZXBzID0gWy4uLih2YXJzLmRlcHMgfHwgW10pLCAuLi5yZXF1aXJlKGAuLyR7dmFycy5mcmFtZXdvcmt9VXRpbGApLmV4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhcnMuZGVwcyA9IFsuLi4odmFycy5kZXBzIHx8IFtdKSwgLi4ucmVxdWlyZShgLi8ke3ZhcnMuZnJhbWV3b3JrfVV0aWxgKS5leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBpZiAoZXh0Q29tcG9uZW50cy5sZW5ndGggJiYgbW9kdWxlLnJlc291cmNlICYmIChtb2R1bGUucmVzb3VyY2UubWF0Y2goL1xcLihqfHQpc3g/JC8pIHx8XG4gICAgICAgIC8vIG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJyAmJiBtb2R1bGUucmVzb3VyY2UubWF0Y2goL1xcLmh0bWwkLykpICYmXG4gICAgICAgIC8vICFtb2R1bGUucmVzb3VyY2UubWF0Y2goL25vZGVfbW9kdWxlcy8pICYmICFtb2R1bGUucmVzb3VyY2UubWF0Y2goYC9leHQteyRvcHRpb25zLmZyYW1ld29ya30vYnVpbGQvYCkpIHtcbiAgICAgICAgLy8gICB2YXJzLmRlcHMgPSBbLi4uKHZhcnMuZGVwcyB8fCBbXSksIC4uLnJlcXVpcmUoYC4vJHt2YXJzLmZyYW1ld29ya31VdGlsYCkuZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXG4gICAgICAgIC8vIH1cbiAgICAgIH0pXG5cbiAgICAgIGlmIChvcHRpb25zLmZyYW1ld29yayA9PSAnYW5ndWxhcicgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gdHJ1ZSkge1xuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5maW5pc2hNb2R1bGVzLnRhcChgZXh0LWZpbmlzaC1tb2R1bGVzYCwgbW9kdWxlcyA9PiB7XG4gICAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnSE9PSyBmaW5pc2hNb2R1bGVzJylcbiAgICAgICAgICByZXF1aXJlKCcuL2FuZ3VsYXJVdGlsJykuX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIodmFycywgb3B0aW9ucylcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgIH1cblxuXG5cblxuXG5cbiAgICAvLyBpZiAoXG4gICAgLy8gICAoIG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJyAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSBmYWxzZSkgfHxcbiAgICAvLyAgICAgb3B0aW9ucy5mcmFtZXdvcmsgPT0gJ3JlYWN0JyB8fFxuICAgIC8vICAgICBvcHRpb25zLmZyYW1ld29yayA9PSAnY29tcG9uZW50cydcbiAgICAvLyAgICkge1xuXG4gICAgICAvLyBjb21waWxlci5ob29rcy5lbWl0LnRhcEFzeW5jKGBleHQtZW1pdGAsIChjb21waWxhdGlvbiwgY2FsbGJhY2spID0+IHtcbiAgICAgIC8vICAgcmVxdWlyZShgLi9wbHVnaW5VdGlsYCkuX2VtaXQoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zLCBjYWxsYmFjaylcbiAgICAgIC8vIH0pXG5cbiAgICAgIC8vIHRyeSB7XG4gICAgICAvLyAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBnbG9iYWwtcmVxdWlyZVxuICAgICAgLy8gICBIdG1sV2VicGFja1BsdWdpbiA9IHJlcXVpcmUoJ2h0bWwtd2VicGFjay1wbHVnaW4nKTtcbiAgICAgIC8vIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vICAgaWYgKCEoZSBpbnN0YW5jZW9mIEVycm9yKSB8fCBlLmNvZGUgIT09ICdNT0RVTEVfTk9UX0ZPVU5EJykge1xuICAgICAgLy8gICAgIHRocm93IGU7XG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH1cblxuXG4gICAgICAvLyB2YXIgSHRtbFdlYnBhY2tQbHVnaW4gPSByZXF1aXJlKCdodG1sLXdlYnBhY2stcGx1Z2luJyk7XG5cbiAgICAgIC8vIGlmIChIdG1sV2VicGFja1BsdWdpbiAmJiBIdG1sV2VicGFja1BsdWdpbi5nZXRIb29rcykge1xuICAgICAgLy8gICBIdG1sV2VicGFja1BsdWdpbi5nZXRIb29rcyhjb21waWxhdGlvbikuYWx0ZXJBc3NldFRhZ3MudGFwQXN5bmMoYGV4dC1iZWZvcmVBc3NldFRhZ0dlbmVyYXRpb25gLCAoZGF0YSwgY2FsbGJhY2spID0+IHtcbiAgICAgIC8vICAgICBjb25zb2xlLmxvZyhkYXRhLmFzc2V0VGFncy5zY3JpcHRzKVxuICAgICAgLy8gICAgIGNvbnNvbGUubG9nKGRhdGEuYXNzZXRUYWdzLnN0eWxlcylcbiAgICAgIC8vICAgICBjYWxsYmFjayhudWxsLCBkYXRhKTtcbiAgICAgIC8vICAgfSlcbiAgICAgIC8vIH1cbiAgICAgIC8vIGVsc2Uge1xuICAgICAgLy8gICBjb25zb2xlLmxvZygnbm8nKVxuICAgICAgLy8gfVxuXG4gICAgICAgIC8vIEh0bWxXZWJwYWNrUGx1Z2luLmdldEhvb2tzKGNvbXBpbGF0aW9uKS5iZWZvcmVBc3NldFRhZ0dlbmVyYXRpb24udGFwQXN5bmMoXG4gICAgICAgIC8vICAgJ3NyaScsXG4gICAgICAgIC8vICAgdGhpcy5iZWZvcmVIdG1sR2VuZXJhdGlvbi5iaW5kKHRoaXMsIGh3cENvbXBpbGF0aW9uKVxuICAgICAgICAvLyApO1xuXG4gICAgICAgIC8vIEh0bWxXZWJwYWNrUGx1Z2luLmdldEhvb2tzKGNvbXBpbGF0aW9uKS5hbHRlckFzc2V0VGFncy50YXBBc3luYyhcbiAgICAgICAgLy8gICAnc3JpJyxcbiAgICAgICAgLy8gICBmdW5jdGlvbiBjYihkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICAvLyAgICAgdmFyIHByb2Nlc3NUYWcgPSBzZWxmLnByb2Nlc3NUYWcuYmluZChzZWxmLCBod3BDb21waWxhdGlvbik7XG4gICAgICAgIC8vICAgICBkYXRhLmFzc2V0VGFncy5zY3JpcHRzLmZpbHRlcih1dGlsLmZpbHRlclRhZykuZm9yRWFjaChwcm9jZXNzVGFnKTtcbiAgICAgICAgLy8gICAgIGRhdGEuYXNzZXRUYWdzLnN0eWxlcy5maWx0ZXIodXRpbC5maWx0ZXJUYWcpLmZvckVhY2gocHJvY2Vzc1RhZyk7XG4gICAgICAgIC8vICAgICBjYWxsYmFjayhudWxsLCBkYXRhKTtcbiAgICAgICAgLy8gICB9XG4gICAgICAgIC8vICk7XG5cblxuXG4vLyAgICAgIH1cblxuXG5cbiAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLmh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24udGFwKGBleHQtaHRtbC1nZW5lcmF0aW9uYCwoZGF0YSkgPT4ge1xuICAgICAgICBsb2d2KG9wdGlvbnMsJ2h0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24nKVxuICAgICAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgICAgIHZhciBqc1BhdGggPSBwYXRoLmpvaW4odmFycy5leHRQYXRoLCAnZXh0LmpzJylcbiAgICAgICAgdmFyIGNzc1BhdGggPSBwYXRoLmpvaW4odmFycy5leHRQYXRoLCAnZXh0LmNzcycpXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgIGRhdGEuYXNzZXRzLmpzLnVuc2hpZnQoanNQYXRoKVxuICAgICAgICBkYXRhLmFzc2V0cy5jc3MudW5zaGlmdChjc3NQYXRoKVxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICBsb2codmFycy5hcHAgKyBgQWRkaW5nICR7anNQYXRofSBhbmQgJHtjc3NQYXRofSB0byBpbmRleC5odG1sYClcbiAgICAgIH0pXG4gICAgLy99XG4gICAgLy8gZWxzZSB7XG4gICAgLy8gICBsb2d2KG9wdGlvbnMsJ3NraXBwZWQgaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbicpXG4gICAgLy8gfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2NvbXBpbGF0aW9uOiAnICsgZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfYWZ0ZXJDb21waWxlKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsICdGVU5DVElPTiBfYWZ0ZXJDb21waWxlJylcbiAgaWYgKG9wdGlvbnMuZnJhbWV3b3JrID09ICdleHRqcycpIHtcbiAgICAgICAgcmVxdWlyZShgLi9leHRqc1V0aWxgKS5fYWZ0ZXJDb21waWxlKGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIF9lbWl0KGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBsb2cgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2dcbiAgICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICAgIGxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gX2VtaXQnKVxuXG5cbiAgICB2YXIgZW1pdCA9IG9wdGlvbnMuZW1pdFxuICAgIHZhciB0cmVlc2hha2UgPSBvcHRpb25zLnRyZWVzaGFrZVxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAgIHZhciBlbnZpcm9ubWVudCA9ICBvcHRpb25zLmVudmlyb25tZW50XG5cbiAgICBpZiAoZW1pdCkge1xuICAgICAgaWYgKChlbnZpcm9ubWVudCA9PSAncHJvZHVjdGlvbicgJiYgdHJlZXNoYWtlID09IHRydWUgICYmIGZyYW1ld29yayA9PSAnYW5ndWxhcicpIHx8XG4gICAgICAgICAgKGVudmlyb25tZW50ICE9ICdwcm9kdWN0aW9uJyAmJiB0cmVlc2hha2UgPT0gZmFsc2UgJiYgZnJhbWV3b3JrID09ICdhbmd1bGFyJykgfHxcbiAgICAgICAgICAoZnJhbWV3b3JrID09ICdyZWFjdCcpIHx8XG4gICAgICAgICAgKGZyYW1ld29yayA9PSAnY29tcG9uZW50cycpXG4gICAgICApIHtcbiAgICAgICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgICAgIHZhciBmcmFtZXdvcmsgPSB2YXJzLmZyYW1ld29ya1xuICAgICAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgICAgIGNvbnN0IF9idWlsZEV4dEJ1bmRsZSA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLl9idWlsZEV4dEJ1bmRsZVxuICAgICAgICBsZXQgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vdXRwdXRQYXRoLHZhcnMuZXh0UGF0aClcbiAgICAgICAgaWYgKGNvbXBpbGVyLm91dHB1dFBhdGggPT09ICcvJyAmJiBjb21waWxlci5vcHRpb25zLmRldlNlcnZlcikge1xuICAgICAgICAgIG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIuY29udGVudEJhc2UsIG91dHB1dFBhdGgpXG4gICAgICAgIH1cbiAgICAgICAgbG9ndihvcHRpb25zLCdvdXRwdXRQYXRoOiAnICsgb3V0cHV0UGF0aClcbiAgICAgICAgbG9ndihvcHRpb25zLCdmcmFtZXdvcms6ICcgKyBmcmFtZXdvcmspXG4gICAgICAgIC8vICAgIGlmIChvcHRpb25zLmVtaXQgPT0gdHJ1ZSkge1xuICAgICAgICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgICAgICAgX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dFBhdGgsIGNvbXBpbGF0aW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmZyYW1ld29yayA9PSAnYW5ndWxhcicgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dFBhdGgsIGNvbXBpbGF0aW9uKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgY29tbWFuZCA9ICcnXG4gICAgICAgICAgaWYgKG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKSB7XG4gICAgICAgICAgICBjb21tYW5kID0gJ3dhdGNoJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbW1hbmQgPSAnYnVpbGQnXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHZhcnMucmVidWlsZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICB2YXIgcGFybXMgPSBbXVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucHJvZmlsZSA9PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5wcm9maWxlID09ICcnIHx8IG9wdGlvbnMucHJvZmlsZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMuZW52aXJvbm1lbnRdXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgb3B0aW9ucy5wcm9maWxlLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcm1zID0gWydhcHAnLCBjb21tYW5kLCAnLS13ZWItc2VydmVyJywgJ2ZhbHNlJywgb3B0aW9ucy5wcm9maWxlLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2YXJzLndhdGNoU3RhcnRlZCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICBhd2FpdCBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIG9wdGlvbnMpXG4gICAgICAgICAgICAgIHZhcnMud2F0Y2hTdGFydGVkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBsb2d2KG9wdGlvbnMsJ05PVCBydW5uaW5nIGVtaXQnKVxuICAgICAgICBjYWxsYmFjaygpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndihvcHRpb25zLCdlbWl0IGlzIGZhbHNlJylcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdlbWl0OiAnICsgZSlcbiAgICBjYWxsYmFjaygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dCwgY29tcGlsYXRpb24pIHtcbiAgdHJ5IHtcbiAgICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9wcmVwYXJlRm9yQnVpbGQnKVxuICAgIGNvbnN0IHJpbXJhZiA9IHJlcXVpcmUoJ3JpbXJhZicpXG4gICAgY29uc3QgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJylcbiAgICBjb25zdCBmc3ggPSByZXF1aXJlKCdmcy1leHRyYScpXG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG4gICAgdmFyIHBhY2thZ2VzID0gb3B0aW9ucy5wYWNrYWdlc1xuICAgIHZhciB0b29sa2l0ID0gb3B0aW9ucy50b29sa2l0XG4gICAgdmFyIHRoZW1lID0gb3B0aW9ucy50aGVtZVxuXG4gICAgdGhlbWUgPSB0aGVtZSB8fCAodG9vbGtpdCA9PT0gJ2NsYXNzaWMnID8gJ3RoZW1lLXRyaXRvbicgOiAndGhlbWUtbWF0ZXJpYWwnKVxuICAgIGxvZ3Yob3B0aW9ucywnZmlyc3RUaW1lOiAnICsgdmFycy5maXJzdFRpbWUpXG4gICAgaWYgKHZhcnMuZmlyc3RUaW1lKSB7XG4gICAgICByaW1yYWYuc3luYyhvdXRwdXQpXG4gICAgICBta2RpcnAuc3luYyhvdXRwdXQpXG4gICAgICBjb25zdCBidWlsZFhNTCA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuYnVpbGRYTUxcbiAgICAgIGNvbnN0IGNyZWF0ZUFwcEpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUFwcEpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZVdvcmtzcGFjZUpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZVdvcmtzcGFjZUpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZUpTRE9NRW52aXJvbm1lbnQgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUpTRE9NRW52aXJvbm1lbnRcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnYnVpbGQueG1sJyksIGJ1aWxkWE1MKHZhcnMucHJvZHVjdGlvbiwgb3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnYXBwLmpzb24nKSwgY3JlYXRlQXBwSnNvbih0aGVtZSwgcGFja2FnZXMsIHRvb2xraXQsIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2pzZG9tLWVudmlyb25tZW50LmpzJyksIGNyZWF0ZUpTRE9NRW52aXJvbm1lbnQob3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnd29ya3NwYWNlLmpzb24nKSwgY3JlYXRlV29ya3NwYWNlSnNvbihvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG5cbiAgICAgIHZhciBmcmFtZXdvcmsgPSB2YXJzLmZyYW1ld29yaztcbiAgICAgIC8vYmVjYXVzZSBvZiBhIHByb2JsZW0gd2l0aCBjb2xvcnBpY2tlclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vdXgvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3V4JylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAgKyAnQ29weWluZyAodXgpICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAncGFja2FnZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCArICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdvdmVycmlkZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCArICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwncmVzb3VyY2VzLycpKSkge1xuICAgICAgICB2YXIgZnJvbVJlc291cmNlcyA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncmVzb3VyY2VzLycpXG4gICAgICAgIHZhciB0b1Jlc291cmNlcyA9IHBhdGguam9pbihvdXRwdXQsICcuLi9yZXNvdXJjZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVJlc291cmNlcywgdG9SZXNvdXJjZXMpXG4gICAgICAgIGxvZyhhcHAgKyAnQ29weWluZyAnICsgZnJvbVJlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1Jlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICB9XG4gICAgdmFycy5maXJzdFRpbWUgPSBmYWxzZVxuICAgIHZhciBqcyA9ICcnXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbikge1xuICAgICAganMgPSB2YXJzLmRlcHMuam9pbignO1xcbicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGpzID0gJ0V4dC5yZXF1aXJlKFwiRXh0LipcIiknXG4gICAgfVxuICAgIGlmICh2YXJzLm1hbmlmZXN0ID09PSBudWxsIHx8IGpzICE9PSB2YXJzLm1hbmlmZXN0KSB7XG4gICAgICB2YXJzLm1hbmlmZXN0ID0ganNcbiAgICAgIGNvbnN0IG1hbmlmZXN0ID0gcGF0aC5qb2luKG91dHB1dCwgJ21hbmlmZXN0LmpzJylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMobWFuaWZlc3QsIGpzLCAndXRmOCcpXG4gICAgICB2YXJzLnJlYnVpbGQgPSB0cnVlXG4gICAgICB2YXIgYnVuZGxlRGlyID0gb3V0cHV0LnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpXG4gICAgICBpZiAoYnVuZGxlRGlyLnRyaW0oKSA9PSAnJykge2J1bmRsZURpciA9ICcuLyd9XG4gICAgICBsb2coYXBwICsgJ0J1aWxkaW5nIEV4dCBidW5kbGUgYXQ6ICcgKyBidW5kbGVEaXIpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5yZWJ1aWxkID0gZmFsc2VcbiAgICAgIGxvZyhhcHAgKyAnRXh0IHJlYnVpbGQgTk9UIG5lZWRlZCcpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX3ByZXBhcmVGb3JCdWlsZDogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2J1aWxkRXh0QnVuZGxlKGFwcCwgY29tcGlsYXRpb24sIG91dHB1dFBhdGgsIHBhcm1zLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9idWlsZEV4dEJ1bmRsZScpXG5cbiAgICBsZXQgc2VuY2hhOyB0cnkgeyBzZW5jaGEgPSByZXF1aXJlKCdAc2VuY2hhL2NtZCcpIH0gY2F0Y2ggKGUpIHsgc2VuY2hhID0gJ3NlbmNoYScgfVxuICAgIGlmIChmcy5leGlzdHNTeW5jKHNlbmNoYSkpIHtcbiAgICAgIGxvZ3Yob3B0aW9ucywnc2VuY2hhIGZvbGRlciBleGlzdHMnKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxvZ3Yob3B0aW9ucywnc2VuY2hhIGZvbGRlciBET0VTIE5PVCBleGlzdCcpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IG9uQnVpbGREb25lID0gKCkgPT4ge1xuICAgICAgICBsb2d2KG9wdGlvbnMsJ29uQnVpbGREb25lJylcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9XG5cbiAgICAgIHZhciBvcHRzID0geyBjd2Q6IG91dHB1dFBhdGgsIHNpbGVudDogdHJ1ZSwgc3RkaW86ICdwaXBlJywgZW5jb2Rpbmc6ICd1dGYtOCd9XG4gICAgICBleGVjdXRlQXN5bmMoYXBwLCBzZW5jaGEsIHBhcm1zLCBvcHRzLCBjb21waWxhdGlvbiwgb3B0aW9ucykudGhlbiAoXG4gICAgICAgIGZ1bmN0aW9uKCkgeyBvbkJ1aWxkRG9uZSgpIH0sIFxuICAgICAgICBmdW5jdGlvbihyZWFzb24pIHsgcmVqZWN0KHJlYXNvbikgfVxuICAgICAgKVxuICAgIH0pXG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIGNvbnNvbGUubG9nKCdlJylcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2J1aWxkRXh0QnVuZGxlOiAnICsgZSlcbiAgICBjYWxsYmFjaygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2RvbmUodmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIGNvbnN0IGxvZyA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ1xuICAgIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gICAgbG9ndihvcHRpb25zLCdGVU5DVElPTiBfZG9uZScpXG5cbiAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gZmFsc2UgJiYgb3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICByZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLl90b0Rldih2YXJzLCBvcHRpb25zKVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgaWYob3B0aW9ucy5icm93c2VyID09IHRydWUgJiYgb3B0aW9ucy53YXRjaCA9PSAneWVzJyAmJiB2YXJzLnByb2R1Y3Rpb24gPT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHZhcnMuYnJvd3NlckNvdW50ID09IDApIHtcbiAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6JyArIG9wdGlvbnMucG9ydFxuICAgICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCArIGBPcGVuaW5nIGJyb3dzZXIgYXQgJHt1cmx9YClcbiAgICAgICAgICB2YXJzLmJyb3dzZXJDb3VudCsrXG4gICAgICAgICAgY29uc3Qgb3BuID0gcmVxdWlyZSgnb3BuJylcbiAgICAgICAgICBvcG4odXJsKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgLy9jb21waWxhdGlvbi5lcnJvcnMucHVzaCgnc2hvdyBicm93c2VyIHdpbmRvdyAtIGV4dC1kb25lOiAnICsgZSlcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGVBc3luYyAoYXBwLCBjb21tYW5kLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICAvL2NvbnN0IERFRkFVTFRfU1VCU1RSUyA9IFsnW0lORl0gTG9hZGluZycsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFNlcnZlclwiLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgICBjb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbXCJbSU5GXSB4U2VydmVyXCIsICdbSU5GXSBMb2FkaW5nJywgJ1tJTkZdIEFwcGVuZCcsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tJTkZdIFByb2Nlc3NpbmcgQnVpbGQnLCAnW0xPR10gRmFzaGlvbiBidWlsZCBjb21wbGV0ZScsICdbRVJSXScsICdbV1JOXScsIFwiW0lORl0gV3JpdGluZ1wiLCBcIltJTkZdIExvYWRpbmcgQnVpbGRcIiwgXCJbSU5GXSBXYWl0aW5nXCIsIFwiW0xPR10gRmFzaGlvbiB3YWl0aW5nXCJdO1xuICAgIHZhciBzdWJzdHJpbmdzID0gREVGQVVMVF9TVUJTVFJTIFxuICAgIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbiAgICBjb25zdCBjcm9zc1NwYXduID0gcmVxdWlyZSgnY3Jvc3Mtc3Bhd24nKVxuICAgIGNvbnN0IGxvZyA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ1xuICAgIGxvZ3Yob3B0aW9ucywgJ0ZVTkNUSU9OIGV4ZWN1dGVBc3luYycpXG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbG9ndihvcHRpb25zLGBjb21tYW5kIC0gJHtjb21tYW5kfWApXG4gICAgICBsb2d2KG9wdGlvbnMsIGBwYXJtcyAtICR7cGFybXN9YClcbiAgICAgIGxvZ3Yob3B0aW9ucywgYG9wdHMgLSAke0pTT04uc3RyaW5naWZ5KG9wdHMpfWApXG4gICAgICBsZXQgY2hpbGQgPSBjcm9zc1NwYXduKGNvbW1hbmQsIHBhcm1zLCBvcHRzKVxuICAgICAgY2hpbGQub24oJ2Nsb3NlJywgKGNvZGUsIHNpZ25hbCkgPT4ge1xuICAgICAgICBsb2d2KG9wdGlvbnMsIGBvbiBjbG9zZTogYCArIGNvZGUpIFxuICAgICAgICBpZihjb2RlID09PSAwKSB7IHJlc29sdmUoMCkgfVxuICAgICAgICBlbHNlIHsgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goIG5ldyBFcnJvcihjb2RlKSApOyByZXNvbHZlKDApIH1cbiAgICAgIH0pXG4gICAgICBjaGlsZC5vbignZXJyb3InLCAoZXJyb3IpID0+IHsgXG4gICAgICAgIGxvZ3Yob3B0aW9ucywgYG9uIGVycm9yYCkgXG4gICAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGVycm9yKVxuICAgICAgICByZXNvbHZlKDApXG4gICAgICB9KVxuICAgICAgY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXG4gICAgICAgIGxvZ3Yob3B0aW9ucywgYCR7c3RyfWApXG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEudG9TdHJpbmcoKS5tYXRjaCgvRmFzaGlvbiB3YWl0aW5nIGZvciBjaGFuZ2VzXFwuXFwuXFwuLykpIHtcblxuICAgICAgICAgIC8vIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICAgICAgICAvLyB2YXIgZmlsZW5hbWUgPSBwcm9jZXNzLmN3ZCgpKycvc3JjL2luZGV4LmpzJztcbiAgICAgICAgICAvLyB2YXIgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSk7XG4gICAgICAgICAgLy8gZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgZGF0YSArICcgJywgJ3V0ZjgnKVxuICAgICAgICAgIC8vIGxvZ3Yob3B0aW9ucywgYHRvdWNoaW5nICR7ZmlsZW5hbWV9YClcblxuICAgICAgICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICAgICAgICB2YXIgZmlsZW5hbWUgPSBwcm9jZXNzLmN3ZCgpICsgJy9zcmMvaW5kZXguanMnO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSk7XG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVuYW1lLCBkYXRhICsgJyAnLCAndXRmOCcpO1xuICAgICAgICAgICAgbG9nKG9wdGlvbnMsIGB0b3VjaGluZyAke2ZpbGVuYW1lfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgICBsb2cob3B0aW9ucywgYE5PVCB0b3VjaGluZyAke2ZpbGVuYW1lfWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoMClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAoc3Vic3RyaW5ncy5zb21lKGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGRhdGEuaW5kZXhPZih2KSA+PSAwOyB9KSkgeyBcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0lORl1cIiwgXCJcIilcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0xPR11cIiwgXCJcIilcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKS50cmltKClcbiAgICAgICAgICAgIGlmIChzdHIuaW5jbHVkZXMoXCJbRVJSXVwiKSkge1xuICAgICAgICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChhcHAgKyBzdHIucmVwbGFjZSgvXlxcW0VSUlxcXSAvZ2ksICcnKSk7XG4gICAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0VSUl1cIiwgYCR7Y2hhbGsucmVkKFwiW0VSUl1cIil9YClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvZyhgJHthcHB9JHtzdHJ9YCkgXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgbG9ndihvcHRpb25zLCBgZXJyb3Igb24gY2xvc2U6IGAgKyBkYXRhKSBcbiAgICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXG4gICAgICAgIHZhciBzdHJKYXZhT3B0cyA9IFwiUGlja2VkIHVwIF9KQVZBX09QVElPTlNcIjtcbiAgICAgICAgdmFyIGluY2x1ZGVzID0gc3RyLmluY2x1ZGVzKHN0ckphdmFPcHRzKVxuICAgICAgICBpZiAoIWluY2x1ZGVzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7YXBwfSAke2NoYWxrLnJlZChcIltFUlJdXCIpfSAke3N0cn1gKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdleGVjdXRlQXN5bmM6ICcgKyBlKVxuICAgIGNhbGxiYWNrKClcbiAgfSBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhzKSB7XG4gIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gIHRyeSB7XG4gICAgcHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKClcbiAgfVxuICBjYXRjaChlKSB7fVxuICBwcm9jZXNzLnN0ZG91dC53cml0ZShzKVxuICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ3Yob3B0aW9ucywgcykge1xuICBpZiAob3B0aW9ucy52ZXJib3NlID09ICd5ZXMnKSB7XG4gICAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgICB0cnkge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKClcbiAgICB9XG4gICAgY2F0Y2goZSkge31cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShgLXZlcmJvc2U6ICR7c31gKVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZ2V0QXBwKCkge1xuICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gIHZhciBwcmVmaXggPSBgYFxuICBjb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKVxuICBpZiAocGxhdGZvcm0gPT0gJ2RhcndpbicpIHsgcHJlZml4ID0gYOKEuSDvvaJleHTvvaM6YCB9XG4gIGVsc2UgeyBwcmVmaXggPSBgaSBbZXh0XTpgIH1cbiAgcmV0dXJuIGAke2NoYWxrLmdyZWVuKHByZWZpeCl9IGBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRWZXJzaW9ucyhhcHAsIHBsdWdpbk5hbWUsIGZyYW1ld29ya05hbWUpIHtcbiAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcblxuICB2YXIgdiA9IHt9XG4gIHZhciBwbHVnaW5QYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhJywgcGx1Z2luTmFtZSlcbiAgdmFyIHBsdWdpblBrZyA9IChmcy5leGlzdHNTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwbHVnaW5QYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5wbHVnaW5WZXJzaW9uID0gcGx1Z2luUGtnLnZlcnNpb25cbiAgdi5fcmVzb2x2ZWQgPSBwbHVnaW5Qa2cuX3Jlc29sdmVkXG4gIGlmICh2Ll9yZXNvbHZlZCA9PSB1bmRlZmluZWQpIHtcbiAgICB2LmVkaXRpb24gPSBgQ29tbWVyY2lhbGBcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAoLTEgPT0gdi5fcmVzb2x2ZWQuaW5kZXhPZignY29tbXVuaXR5JykpIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tdW5pdHlgXG4gICAgfVxuICB9XG5cbiAgdmFyIHdlYnBhY2tQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy93ZWJwYWNrJylcbiAgdmFyIHdlYnBhY2tQa2cgPSAoZnMuZXhpc3RzU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHdlYnBhY2tQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi53ZWJwYWNrVmVyc2lvbiA9IHdlYnBhY2tQa2cudmVyc2lvblxuXG4gIHZhciBleHRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dCcpXG4gIHZhciBleHRQa2cgPSAoZnMuZXhpc3RzU3luYyhleHRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZXh0UGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYuZXh0VmVyc2lvbiA9IGV4dFBrZy5zZW5jaGEudmVyc2lvblxuXG4gIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gIHZhciBjbWRQa2cgPSAoZnMuZXhpc3RzU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcblxuICBpZiAodi5jbWRWZXJzaW9uID09IHVuZGVmaW5lZCkge1xuICAgIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhLyR7cGx1Z2luTmFtZX0vbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgICB2YXIgY21kUGtnID0gKGZzLmV4aXN0c1N5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICAgIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgfVxuXG4gIHZhciBmcmFtZXdvcmtJbmZvID0gJydcbiAgIGlmIChmcmFtZXdvcmtOYW1lICE9IHVuZGVmaW5lZCAmJiBmcmFtZXdvcmtOYW1lICE9ICdleHRqcycpIHtcbiAgICB2YXIgZnJhbWV3b3JrUGF0aCA9ICcnXG4gICAgaWYgKGZyYW1ld29ya05hbWUgPT0gJ3JlYWN0Jykge1xuICAgICAgZnJhbWV3b3JrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvcmVhY3QnKVxuICAgIH1cbiAgICBpZiAoZnJhbWV3b3JrTmFtZSA9PSAnYW5ndWxhcicpIHtcbiAgICAgIGZyYW1ld29ya1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL2NvcmUnKVxuICAgIH1cbiAgICB2YXIgZnJhbWV3b3JrUGtnID0gKGZzLmV4aXN0c1N5bmMoZnJhbWV3b3JrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGZyYW1ld29ya1BhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICAgIHYuZnJhbWV3b3JrVmVyc2lvbiA9IGZyYW1ld29ya1BrZy52ZXJzaW9uXG4gICAgZnJhbWV3b3JrSW5mbyA9ICcsICcgKyBmcmFtZXdvcmtOYW1lICsgJyB2JyArIHYuZnJhbWV3b3JrVmVyc2lvblxuICB9XG4gIHJldHVybiBhcHAgKyAnZXh0LXdlYnBhY2stcGx1Z2luIHYnICsgdi5wbHVnaW5WZXJzaW9uICsgJywgRXh0IEpTIHYnICsgdi5leHRWZXJzaW9uICsgJyAnICsgdi5lZGl0aW9uICsgJyBFZGl0aW9uLCBTZW5jaGEgQ21kIHYnICsgdi5jbWRWZXJzaW9uICsgJywgd2VicGFjayB2JyArIHYud2VicGFja1ZlcnNpb24gKyBmcmFtZXdvcmtJbmZvXG4gfSJdfQ==