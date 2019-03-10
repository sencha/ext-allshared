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
    var log, logv, app, framework, path, _buildExtBundle, outputPath, command, parms;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          log = require('./pluginUtil').log;
          logv = require('./pluginUtil').logv;
          logv(options, 'FUNCTION _emit');
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

          if (!(options.emit == true)) {
            _context.next = 29;
            break;
          }

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
          log(`${vars.app}FUNCTION emit not run`);
          callback();

        case 31:
          _context.next = 38;
          break;

        case 33:
          _context.prev = 33;
          _context.t0 = _context["catch"](0);

          require('./pluginUtil').logv(options, _context.t0);

          compilation.errors.push('emit: ' + _context.t0);
          callback();

        case 38:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 33]]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbInJ1blNjcmlwdCIsInNjcmlwdFBhdGgiLCJjYWxsYmFjayIsImNoaWxkUHJvY2VzcyIsInJlcXVpcmUiLCJpbnZva2VkIiwicHJvY2VzcyIsImZvcmsiLCJvbiIsImVyciIsImNvZGUiLCJFcnJvciIsIl9jb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJmcyIsInRoaXNWYXJzIiwidGhpc09wdGlvbnMiLCJwbHVnaW4iLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwidmFycyIsInZhbGlkYXRlT3B0aW9ucyIsImdldFZhbGlkYXRlT3B0aW9ucyIsImdldERlZmF1bHRWYXJzIiwicGx1Z2luTmFtZSIsImFwcCIsIl9nZXRBcHAiLCJsb2d2IiwicmMiLCJleGlzdHNTeW5jIiwiSlNPTiIsInBhcnNlIiwicmVhZEZpbGVTeW5jIiwiZ2V0RGVmYXVsdE9wdGlvbnMiLCJzdHJpbmdpZnkiLCJlbnZpcm9ubWVudCIsInByb2R1Y3Rpb24iLCJsb2ciLCJ0cmVlc2hha2UiLCJfdG9Qcm9kIiwiX3RoaXNDb21waWxhdGlvbiIsImNvbXBpbGVyIiwiY29tcGlsYXRpb24iLCJzY3JpcHQiLCJlIiwiZXJyb3JzIiwiX2NvbXBpbGF0aW9uIiwiZXh0Q29tcG9uZW50cyIsIl9nZXRBbGxDb21wb25lbnRzIiwiaG9va3MiLCJzdWNjZWVkTW9kdWxlIiwidGFwIiwibW9kdWxlIiwicmVzb3VyY2UiLCJtYXRjaCIsIl9zb3VyY2UiLCJfdmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiZGVwcyIsImV4dHJhY3RGcm9tU291cmNlIiwiZmluaXNoTW9kdWxlcyIsIm1vZHVsZXMiLCJfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciIsImh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24iLCJkYXRhIiwicGF0aCIsImpzUGF0aCIsImpvaW4iLCJleHRQYXRoIiwiY3NzUGF0aCIsImNvbnNvbGUiLCJhc3NldHMiLCJqcyIsInVuc2hpZnQiLCJjc3MiLCJfYWZ0ZXJDb21waWxlIiwiX2VtaXQiLCJfYnVpbGRFeHRCdW5kbGUiLCJvdXRwdXRQYXRoIiwiZGV2U2VydmVyIiwiY29udGVudEJhc2UiLCJlbWl0IiwiX3ByZXBhcmVGb3JCdWlsZCIsImNvbW1hbmQiLCJ3YXRjaCIsInJlYnVpbGQiLCJwYXJtcyIsInByb2ZpbGUiLCJ3YXRjaFN0YXJ0ZWQiLCJvdXRwdXQiLCJyaW1yYWYiLCJta2RpcnAiLCJmc3giLCJwYWNrYWdlcyIsInRvb2xraXQiLCJ0aGVtZSIsImZpcnN0VGltZSIsInN5bmMiLCJidWlsZFhNTCIsImNyZWF0ZUFwcEpzb24iLCJjcmVhdGVXb3Jrc3BhY2VKc29uIiwiY3JlYXRlSlNET01FbnZpcm9ubWVudCIsIndyaXRlRmlsZVN5bmMiLCJjd2QiLCJmcm9tUGF0aCIsInRvUGF0aCIsImNvcHlTeW5jIiwicmVwbGFjZSIsImZyb21SZXNvdXJjZXMiLCJ0b1Jlc291cmNlcyIsIm1hbmlmZXN0IiwiYnVuZGxlRGlyIiwidHJpbSIsInNlbmNoYSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25CdWlsZERvbmUiLCJvcHRzIiwic2lsZW50Iiwic3RkaW8iLCJlbmNvZGluZyIsImV4ZWN1dGVBc3luYyIsInRoZW4iLCJyZWFzb24iLCJfZG9uZSIsIl90b0RldiIsImJyb3dzZXIiLCJicm93c2VyQ291bnQiLCJ1cmwiLCJwb3J0Iiwib3BuIiwiREVGQVVMVF9TVUJTVFJTIiwic3Vic3RyaW5ncyIsImNoYWxrIiwiY3Jvc3NTcGF3biIsImNoaWxkIiwic2lnbmFsIiwiZXJyb3IiLCJzdGRvdXQiLCJzdHIiLCJ0b1N0cmluZyIsImZpbGVuYW1lIiwic29tZSIsInYiLCJpbmRleE9mIiwicmVkIiwic3RkZXJyIiwic3RySmF2YU9wdHMiLCJzIiwiY3Vyc29yVG8iLCJjbGVhckxpbmUiLCJ3cml0ZSIsInZlcmJvc2UiLCJwcmVmaXgiLCJwbGF0Zm9ybSIsImdyZWVuIiwiX2dldFZlcnNpb25zIiwiZnJhbWV3b3JrTmFtZSIsInBsdWdpblBhdGgiLCJwbHVnaW5Qa2ciLCJwbHVnaW5WZXJzaW9uIiwidmVyc2lvbiIsIl9yZXNvbHZlZCIsImVkaXRpb24iLCJ3ZWJwYWNrUGF0aCIsIndlYnBhY2tQa2ciLCJ3ZWJwYWNrVmVyc2lvbiIsImV4dFBrZyIsImV4dFZlcnNpb24iLCJjbWRQYXRoIiwiY21kUGtnIiwiY21kVmVyc2lvbiIsInZlcnNpb25fZnVsbCIsImZyYW1ld29ya0luZm8iLCJmcmFtZXdvcmtQYXRoIiwiZnJhbWV3b3JrUGtnIiwiZnJhbWV3b3JrVmVyc2lvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQSxTQUFTQSxTQUFULENBQW1CQyxVQUFuQixFQUErQkMsUUFBL0IsRUFBeUM7QUFDdkMsTUFBSUMsWUFBWSxHQUFHQyxPQUFPLENBQUMsZUFBRCxDQUExQixDQUR1QyxDQUV2Qzs7O0FBQ0EsTUFBSUMsT0FBTyxHQUFHLEtBQWQ7QUFDQSxNQUFJQyxPQUFPLEdBQUdILFlBQVksQ0FBQ0ksSUFBYixDQUFrQk4sVUFBbEIsQ0FBZCxDQUp1QyxDQUt2Qzs7QUFDQUssRUFBQUEsT0FBTyxDQUFDRSxFQUFSLENBQVcsT0FBWCxFQUFvQixVQUFVQyxHQUFWLEVBQWU7QUFDakMsUUFBSUosT0FBSixFQUFhO0FBQ2JBLElBQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0FILElBQUFBLFFBQVEsQ0FBQ08sR0FBRCxDQUFSO0FBQ0QsR0FKRCxFQU51QyxDQVd2Qzs7QUFDQUgsRUFBQUEsT0FBTyxDQUFDRSxFQUFSLENBQVcsTUFBWCxFQUFtQixVQUFVRSxJQUFWLEVBQWdCO0FBQ2pDLFFBQUlMLE9BQUosRUFBYTtBQUNiQSxJQUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNBLFFBQUlJLEdBQUcsR0FBR0MsSUFBSSxLQUFLLENBQVQsR0FBYSxJQUFiLEdBQW9CLElBQUlDLEtBQUosQ0FBVSxlQUFlRCxJQUF6QixDQUE5QjtBQUNB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aCwgY2FsbGJhY2spIHtcbiAgdmFyIGNoaWxkUHJvY2VzcyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcbiAgLy8ga2VlcCB0cmFjayBvZiB3aGV0aGVyIGNhbGxiYWNrIGhhcyBiZWVuIGludm9rZWQgdG8gcHJldmVudCBtdWx0aXBsZSBpbnZvY2F0aW9uc1xuICB2YXIgaW52b2tlZCA9IGZhbHNlO1xuICB2YXIgcHJvY2VzcyA9IGNoaWxkUHJvY2Vzcy5mb3JrKHNjcmlwdFBhdGgpO1xuICAvLyBsaXN0ZW4gZm9yIGVycm9ycyBhcyB0aGV5IG1heSBwcmV2ZW50IHRoZSBleGl0IGV2ZW50IGZyb20gZmlyaW5nXG4gIHByb2Nlc3Mub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfSk7XG4gIC8vIGV4ZWN1dGUgdGhlIGNhbGxiYWNrIG9uY2UgdGhlIHByb2Nlc3MgaGFzIGZpbmlzaGVkIHJ1bm5pbmdcbiAgcHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uIChjb2RlKSB7XG4gICAgaWYgKGludm9rZWQpIHJldHVybjtcbiAgICBpbnZva2VkID0gdHJ1ZTtcbiAgICB2YXIgZXJyID0gY29kZSA9PT0gMCA/IG51bGwgOiBuZXcgRXJyb3IoJ2V4aXQgY29kZSAnICsgY29kZSk7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfSk7XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuIFxuICB2YXIgdGhpc1ZhcnMgPSB7fVxuICB2YXIgdGhpc09wdGlvbnMgPSB7fVxuICB2YXIgcGx1Z2luID0ge31cblxuICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1ZhcnMucGx1Z2luRXJyb3JzID0gW11cbiAgICB0aGlzVmFycy5wbHVnaW5FcnJvcnMucHVzaCgnd2VicGFjayBjb25maWc6IGZyYW1ld29yayBwYXJhbWV0ZXIgb24gZXh0LXdlYnBhY2stcGx1Z2luIGlzIG5vdCBkZWZpbmVkIC0gdmFsdWVzOiByZWFjdCwgYW5ndWxhciwgZXh0anMnKVxuICAgIHBsdWdpbi52YXJzID0gdGhpc1ZhcnNcbiAgICByZXR1cm4gcGx1Z2luXG4gIH1cblxuICBjb25zdCB2YWxpZGF0ZU9wdGlvbnMgPSByZXF1aXJlKCdzY2hlbWEtdXRpbHMnKVxuICB2YWxpZGF0ZU9wdGlvbnMocmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5nZXRWYWxpZGF0ZU9wdGlvbnMoKSwgb3B0aW9ucywgJycpXG4gIHRoaXNWYXJzID0gcmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5nZXREZWZhdWx0VmFycygpXG4gIHRoaXNWYXJzLmZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gIHN3aXRjaCh0aGlzVmFycy5mcmFtZXdvcmspIHtcbiAgICBjYXNlICdleHRqcyc6XG4gICAgICB0aGlzVmFycy5wbHVnaW5OYW1lID0gJ2V4dC13ZWJwYWNrLXBsdWdpbidcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3JlYWN0JzpcbiAgICAgIHRoaXNWYXJzLnBsdWdpbk5hbWUgPSAnZXh0LXJlYWN0LXdlYnBhY2stcGx1Z2luJ1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnYW5ndWxhcic6XG4gICAgICB0aGlzVmFycy5wbHVnaW5OYW1lID0gJ2V4dC1hbmd1bGFyLXdlYnBhY2stcGx1Z2luJ1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXNWYXJzLnBsdWdpbk5hbWUgPSAnZXh0LXdlYnBhY2stcGx1Z2luJ1xuICB9XG5cbiAgdGhpc1ZhcnMuYXBwID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykuX2dldEFwcCgpXG4gIGxvZ3Yob3B0aW9ucywgYHBsdWdpbk5hbWUgLSAke3RoaXNWYXJzLnBsdWdpbk5hbWV9YClcbiAgbG9ndihvcHRpb25zLCBgdGhpc1ZhcnMuYXBwIC0gJHt0aGlzVmFycy5hcHB9YClcblxuICBjb25zdCByYyA9IChmcy5leGlzdHNTeW5jKGAuZXh0LSR7dGhpc1ZhcnMuZnJhbWV3b3JrfXJjYCkgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoYC5leHQtJHt0aGlzVmFycy5mcmFtZXdvcmt9cmNgLCAndXRmLTgnKSkgfHwge30pXG4gIHRoaXNPcHRpb25zID0geyAuLi5yZXF1aXJlKGAuLyR7dGhpc1ZhcnMuZnJhbWV3b3JrfVV0aWxgKS5nZXREZWZhdWx0T3B0aW9ucygpLCAuLi5vcHRpb25zLCAuLi5yYyB9XG4gIGxvZ3Yob3B0aW9ucywgYHRoaXNPcHRpb25zIC0gJHtKU09OLnN0cmluZ2lmeSh0aGlzT3B0aW9ucyl9YClcblxuICBpZiAodGhpc09wdGlvbnMuZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nKSBcbiAgICB7dGhpc1ZhcnMucHJvZHVjdGlvbiA9IHRydWV9XG4gIGVsc2UgXG4gICAge3RoaXNWYXJzLnByb2R1Y3Rpb24gPSBmYWxzZX1cbiAgbG9ndihvcHRpb25zLCBgdGhpc1ZhcnMgLSAke0pTT04uc3RyaW5naWZ5KHRoaXNWYXJzKX1gKVxuXG4gIC8vbWpnIGxvZyhyZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5fZ2V0VmVyc2lvbnModGhpc1ZhcnMuYXBwLCB0aGlzVmFycy5wbHVnaW5OYW1lLCB0aGlzVmFycy5mcmFtZXdvcmspKVxuICBsb2codGhpc1ZhcnMuYXBwICsgJ0J1aWxkaW5nIGZvciAnICsgdGhpc09wdGlvbnMuZW52aXJvbm1lbnQgKyAnLCAnICsgJ1RyZWVzaGFrZSBpcyAnICsgdGhpc09wdGlvbnMudHJlZXNoYWtlKVxuLy8gIGxvZyh0aGlzVmFycy5hcHAgKyAnVHJlZXNoYWtlIGlzICcgKyB0aGlzT3B0aW9ucy50cmVlc2hha2UpXG5cbiAgaWYgKHRoaXNWYXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSAmJiB0aGlzT3B0aW9ucy50cmVlc2hha2UgPT0gdHJ1ZSAmJiBvcHRpb25zLmZyYW1ld29yayA9PSAnYW5ndWxhcicpIHtcbiAgICByZXF1aXJlKGAuL2FuZ3VsYXJVdGlsYCkuX3RvUHJvZCh0aGlzVmFycywgdGhpc09wdGlvbnMpXG4gIH1cblxuICBwbHVnaW4udmFycyA9IHRoaXNWYXJzXG4gIHBsdWdpbi5vcHRpb25zID0gdGhpc09wdGlvbnNcbiAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnRlVOQ1RJT04gX2NvbnN0cnVjdG9yJylcblxuICByZXR1cm4gcGx1Z2luXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF90aGlzQ29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnRlVOQ1RJT04gX3RoaXNDb21waWxhdGlvbicpXG5cbiAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gbnVsbCkge1xuICAgICAgICBydW5TY3JpcHQob3B0aW9ucy5zY3JpcHQsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwICsgYGZpbmlzaGVkIHJ1bm5pbmcgJHtvcHRpb25zLnNjcmlwdH1gKVxuICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfdGhpc0NvbXBpbGF0aW9uOiAnICsgZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfY29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCAnRlVOQ1RJT04gX2NvbXBpbGF0aW9uJylcblxuICAgIGlmIChvcHRpb25zLmZyYW1ld29yayA9PSAnZXh0anMnKSB7XG4gICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9jb21waWxhdGlvbiAoZW1wdHkpJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHZhciBleHRDb21wb25lbnRzID0gW11cblxuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24pIHtcbiAgICAgIGlmIChvcHRpb25zLmZyYW1ld29yayA9PSAnYW5ndWxhcicgJiYgb3B0aW9ucy50cmVlc2hha2UpIHtcbiAgICAgICAgZXh0Q29tcG9uZW50cyA9IHJlcXVpcmUoJy4vYW5ndWxhclV0aWwnKS5fZ2V0QWxsQ29tcG9uZW50cyh2YXJzLCBvcHRpb25zKVxuICAgICAgfVxuXG4gICAgICBjb21waWxhdGlvbi5ob29rcy5zdWNjZWVkTW9kdWxlLnRhcChgZXh0LXN1Y2NlZWQtbW9kdWxlYCwgbW9kdWxlID0+IHtcbiAgICAgICAgLy9yZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsICdIT09LIHN1Y2NlZWRNb2R1bGUnKVxuICAgICAgICBpZiAobW9kdWxlLnJlc291cmNlICYmICFtb2R1bGUucmVzb3VyY2UubWF0Y2goL25vZGVfbW9kdWxlcy8pKSB7XG4gICAgICAgICAgaWYobW9kdWxlLnJlc291cmNlLm1hdGNoKC9cXC5odG1sJC8pICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmKG1vZHVsZS5fc291cmNlLl92YWx1ZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdkb2N0eXBlIGh0bWwnKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbLi4uKHZhcnMuZGVwcyB8fCBbXSksIC4uLnJlcXVpcmUoYC4vJHt2YXJzLmZyYW1ld29ya31VdGlsYCkuZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFycy5kZXBzID0gWy4uLih2YXJzLmRlcHMgfHwgW10pLCAuLi5yZXF1aXJlKGAuLyR7dmFycy5mcmFtZXdvcmt9VXRpbGApLmV4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGlmIChleHRDb21wb25lbnRzLmxlbmd0aCAmJiBtb2R1bGUucmVzb3VyY2UgJiYgKG1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvXFwuKGp8dClzeD8kLykgfHxcbiAgICAgICAgLy8gb3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInICYmIG1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvXFwuaHRtbCQvKSkgJiZcbiAgICAgICAgLy8gIW1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvbm9kZV9tb2R1bGVzLykgJiYgIW1vZHVsZS5yZXNvdXJjZS5tYXRjaChgL2V4dC17JG9wdGlvbnMuZnJhbWV3b3JrfS9idWlsZC9gKSkge1xuICAgICAgICAvLyAgIHZhcnMuZGVwcyA9IFsuLi4odmFycy5kZXBzIHx8IFtdKSwgLi4ucmVxdWlyZShgLi8ke3ZhcnMuZnJhbWV3b3JrfVV0aWxgKS5leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgLy8gfVxuICAgICAgfSlcblxuICAgICAgaWYgKG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJyAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSB0cnVlKSB7XG4gICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLmZpbmlzaE1vZHVsZXMudGFwKGBleHQtZmluaXNoLW1vZHVsZXNgLCBtb2R1bGVzID0+IHtcbiAgICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsICdIT09LIGZpbmlzaE1vZHVsZXMnKVxuICAgICAgICAgIHJlcXVpcmUoJy4vYW5ndWxhclV0aWwnKS5fd3JpdGVGaWxlc1RvUHJvZEZvbGRlcih2YXJzLCBvcHRpb25zKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8vIGlmIChcbiAgICAvLyAgICggb3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2FuZ3VsYXInICYmIG9wdGlvbnMudHJlZXNoYWtlID09IGZhbHNlKSB8fFxuICAgIC8vICAgICBvcHRpb25zLmZyYW1ld29yayA9PSAncmVhY3QnIHx8XG4gICAgLy8gICAgIG9wdGlvbnMuZnJhbWV3b3JrID09ICdjb21wb25lbnRzJ1xuICAgIC8vICAgKSB7XG5cbiAgICAgIC8vIGNvbXBpbGVyLmhvb2tzLmVtaXQudGFwQXN5bmMoYGV4dC1lbWl0YCwgKGNvbXBpbGF0aW9uLCBjYWxsYmFjaykgPT4ge1xuICAgICAgLy8gICByZXF1aXJlKGAuL3BsdWdpblV0aWxgKS5fZW1pdChjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMsIGNhbGxiYWNrKVxuICAgICAgLy8gfSlcblxuICAgICAgLy8gdHJ5IHtcbiAgICAgIC8vICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGdsb2JhbC1yZXF1aXJlXG4gICAgICAvLyAgIEh0bWxXZWJwYWNrUGx1Z2luID0gcmVxdWlyZSgnaHRtbC13ZWJwYWNrLXBsdWdpbicpO1xuICAgICAgLy8gfSBjYXRjaCAoZSkge1xuICAgICAgLy8gICBpZiAoIShlIGluc3RhbmNlb2YgRXJyb3IpIHx8IGUuY29kZSAhPT0gJ01PRFVMRV9OT1RfRk9VTkQnKSB7XG4gICAgICAvLyAgICAgdGhyb3cgZTtcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfVxuXG5cbiAgICAgIC8vIHZhciBIdG1sV2VicGFja1BsdWdpbiA9IHJlcXVpcmUoJ2h0bWwtd2VicGFjay1wbHVnaW4nKTtcblxuICAgICAgLy8gaWYgKEh0bWxXZWJwYWNrUGx1Z2luICYmIEh0bWxXZWJwYWNrUGx1Z2luLmdldEhvb2tzKSB7XG4gICAgICAvLyAgIEh0bWxXZWJwYWNrUGx1Z2luLmdldEhvb2tzKGNvbXBpbGF0aW9uKS5hbHRlckFzc2V0VGFncy50YXBBc3luYyhgZXh0LWJlZm9yZUFzc2V0VGFnR2VuZXJhdGlvbmAsIChkYXRhLCBjYWxsYmFjaykgPT4ge1xuICAgICAgLy8gICAgIGNvbnNvbGUubG9nKGRhdGEuYXNzZXRUYWdzLnNjcmlwdHMpXG4gICAgICAvLyAgICAgY29uc29sZS5sb2coZGF0YS5hc3NldFRhZ3Muc3R5bGVzKVxuICAgICAgLy8gICAgIGNhbGxiYWNrKG51bGwsIGRhdGEpO1xuICAgICAgLy8gICB9KVxuICAgICAgLy8gfVxuICAgICAgLy8gZWxzZSB7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKCdubycpXG4gICAgICAvLyB9XG5cbiAgICAgICAgLy8gSHRtbFdlYnBhY2tQbHVnaW4uZ2V0SG9va3MoY29tcGlsYXRpb24pLmJlZm9yZUFzc2V0VGFnR2VuZXJhdGlvbi50YXBBc3luYyhcbiAgICAgICAgLy8gICAnc3JpJyxcbiAgICAgICAgLy8gICB0aGlzLmJlZm9yZUh0bWxHZW5lcmF0aW9uLmJpbmQodGhpcywgaHdwQ29tcGlsYXRpb24pXG4gICAgICAgIC8vICk7XG5cbiAgICAgICAgLy8gSHRtbFdlYnBhY2tQbHVnaW4uZ2V0SG9va3MoY29tcGlsYXRpb24pLmFsdGVyQXNzZXRUYWdzLnRhcEFzeW5jKFxuICAgICAgICAvLyAgICdzcmknLFxuICAgICAgICAvLyAgIGZ1bmN0aW9uIGNiKGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vICAgICB2YXIgcHJvY2Vzc1RhZyA9IHNlbGYucHJvY2Vzc1RhZy5iaW5kKHNlbGYsIGh3cENvbXBpbGF0aW9uKTtcbiAgICAgICAgLy8gICAgIGRhdGEuYXNzZXRUYWdzLnNjcmlwdHMuZmlsdGVyKHV0aWwuZmlsdGVyVGFnKS5mb3JFYWNoKHByb2Nlc3NUYWcpO1xuICAgICAgICAvLyAgICAgZGF0YS5hc3NldFRhZ3Muc3R5bGVzLmZpbHRlcih1dGlsLmZpbHRlclRhZykuZm9yRWFjaChwcm9jZXNzVGFnKTtcbiAgICAgICAgLy8gICAgIGNhbGxiYWNrKG51bGwsIGRhdGEpO1xuICAgICAgICAvLyAgIH1cbiAgICAgICAgLy8gKTtcblxuXG5cbi8vICAgICAgfVxuXG5cblxuICAgICAgY29tcGlsYXRpb24uaG9va3MuaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbi50YXAoYGV4dC1odG1sLWdlbmVyYXRpb25gLChkYXRhKSA9PiB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywnaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbicpXG4gICAgICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAgICAgdmFyIGpzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuanMnKVxuICAgICAgICB2YXIgY3NzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuY3NzJylcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgICAgZGF0YS5hc3NldHMuanMudW5zaGlmdChqc1BhdGgpXG4gICAgICAgIGRhdGEuYXNzZXRzLmNzcy51bnNoaWZ0KGNzc1BhdGgpXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgIGxvZyh2YXJzLmFwcCArIGBBZGRpbmcgJHtqc1BhdGh9IGFuZCAke2Nzc1BhdGh9IHRvIGluZGV4Lmh0bWxgKVxuICAgICAgfSlcbiAgICAvL31cbiAgICAvLyBlbHNlIHtcbiAgICAvLyAgIGxvZ3Yob3B0aW9ucywnc2tpcHBlZCBodG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uJylcbiAgICAvLyB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucyxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfY29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9hZnRlckNvbXBpbGUoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucywgJ0ZVTkNUSU9OIF9hZnRlckNvbXBpbGUnKVxuICBpZiAob3B0aW9ucy5mcmFtZXdvcmsgPT0gJ2V4dGpzJykge1xuICAgICAgICByZXF1aXJlKGAuL2V4dGpzVXRpbGApLl9hZnRlckNvbXBpbGUoY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2VtaXQoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB0cnkge1xuICAgIGNvbnN0IGxvZyA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ1xuICAgIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gICAgbG9ndihvcHRpb25zLCdGVU5DVElPTiBfZW1pdCcpXG5cbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgZnJhbWV3b3JrID0gdmFycy5mcmFtZXdvcmtcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgY29uc3QgX2J1aWxkRXh0QnVuZGxlID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykuX2J1aWxkRXh0QnVuZGxlXG4gICAgbGV0IG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3V0cHV0UGF0aCx2YXJzLmV4dFBhdGgpXG4gICAgaWYgKGNvbXBpbGVyLm91dHB1dFBhdGggPT09ICcvJyAmJiBjb21waWxlci5vcHRpb25zLmRldlNlcnZlcikge1xuICAgICAgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vcHRpb25zLmRldlNlcnZlci5jb250ZW50QmFzZSwgb3V0cHV0UGF0aClcbiAgICB9XG4gICAgbG9ndihvcHRpb25zLCdvdXRwdXRQYXRoOiAnICsgb3V0cHV0UGF0aClcbiAgICBsb2d2KG9wdGlvbnMsJ2ZyYW1ld29yazogJyArIGZyYW1ld29yaylcbiAgICBpZiAob3B0aW9ucy5lbWl0ID09IHRydWUpIHtcbiAgICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgICBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0UGF0aCwgY29tcGlsYXRpb24pXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJyAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSBmYWxzZSkge1xuICAgICAgICAgIHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0UGF0aCwgY29tcGlsYXRpb24pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGNvbW1hbmQgPSAnJ1xuICAgICAgaWYgKG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKSB7XG4gICAgICAgIGNvbW1hbmQgPSAnd2F0Y2gnXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY29tbWFuZCA9ICdidWlsZCdcbiAgICAgIH1cblxuICAgICAgaWYgKHZhcnMucmVidWlsZCA9PSB0cnVlKSB7XG4gICAgICAgIHZhciBwYXJtcyA9IFtdXG4gICAgICAgIGlmIChvcHRpb25zLnByb2ZpbGUgPT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMucHJvZmlsZSA9PSAnJyB8fCBvcHRpb25zLnByb2ZpbGUgPT0gbnVsbCkge1xuICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIHtcbiAgICAgICAgICAgIHBhcm1zID0gWydhcHAnLCBjb21tYW5kLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBhcm1zID0gWydhcHAnLCBjb21tYW5kLCAnLS13ZWItc2VydmVyJywgJ2ZhbHNlJywgb3B0aW9ucy5lbnZpcm9ubWVudF1cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAoY29tbWFuZCA9PSAnYnVpbGQnKSB7XG4gICAgICAgICAgICBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgb3B0aW9ucy5wcm9maWxlLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBhcm1zID0gWydhcHAnLCBjb21tYW5kLCAnLS13ZWItc2VydmVyJywgJ2ZhbHNlJywgb3B0aW9ucy5wcm9maWxlLCBvcHRpb25zLmVudmlyb25tZW50XVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YXJzLndhdGNoU3RhcnRlZCA9PSBmYWxzZSkge1xuICAgICAgICAgIGF3YWl0IF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgb3B0aW9ucylcbiAgICAgICAgICB2YXJzLndhdGNoU3RhcnRlZCA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFjaygpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9nKGAke3ZhcnMuYXBwfUZVTkNUSU9OIGVtaXQgbm90IHJ1bmApXG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnZW1pdDogJyArIGUpXG4gICAgY2FsbGJhY2soKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXQsIGNvbXBpbGF0aW9uKSB7XG4gIHRyeSB7XG4gICAgbG9ndihvcHRpb25zLCdGVU5DVElPTiBfcHJlcGFyZUZvckJ1aWxkJylcbiAgICBjb25zdCByaW1yYWYgPSByZXF1aXJlKCdyaW1yYWYnKVxuICAgIGNvbnN0IG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpXG4gICAgY29uc3QgZnN4ID0gcmVxdWlyZSgnZnMtZXh0cmEnKVxuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuICAgIHZhciBwYWNrYWdlcyA9IG9wdGlvbnMucGFja2FnZXNcbiAgICB2YXIgdG9vbGtpdCA9IG9wdGlvbnMudG9vbGtpdFxuICAgIHZhciB0aGVtZSA9IG9wdGlvbnMudGhlbWVcblxuICAgIHRoZW1lID0gdGhlbWUgfHwgKHRvb2xraXQgPT09ICdjbGFzc2ljJyA/ICd0aGVtZS10cml0b24nIDogJ3RoZW1lLW1hdGVyaWFsJylcbiAgICBsb2d2KG9wdGlvbnMsJ2ZpcnN0VGltZTogJyArIHZhcnMuZmlyc3RUaW1lKVxuICAgIGlmICh2YXJzLmZpcnN0VGltZSkge1xuICAgICAgcmltcmFmLnN5bmMob3V0cHV0KVxuICAgICAgbWtkaXJwLnN5bmMob3V0cHV0KVxuICAgICAgY29uc3QgYnVpbGRYTUwgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmJ1aWxkWE1MXG4gICAgICBjb25zdCBjcmVhdGVBcHBKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVBcHBKc29uXG4gICAgICBjb25zdCBjcmVhdGVXb3Jrc3BhY2VKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVXb3Jrc3BhY2VKc29uXG4gICAgICBjb25zdCBjcmVhdGVKU0RPTUVudmlyb25tZW50ID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVKU0RPTUVudmlyb25tZW50XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2J1aWxkLnhtbCcpLCBidWlsZFhNTCh2YXJzLnByb2R1Y3Rpb24sIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2FwcC5qc29uJyksIGNyZWF0ZUFwcEpzb24odGhlbWUsIHBhY2thZ2VzLCB0b29sa2l0LCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdqc2RvbS1lbnZpcm9ubWVudC5qcycpLCBjcmVhdGVKU0RPTUVudmlyb25tZW50KG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ3dvcmtzcGFjZS5qc29uJyksIGNyZWF0ZVdvcmtzcGFjZUpzb24ob3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuXG4gICAgICB2YXIgZnJhbWV3b3JrID0gdmFycy5mcmFtZXdvcms7XG4gICAgICAvL2JlY2F1c2Ugb2YgYSBwcm9ibGVtIHdpdGggY29sb3JwaWNrZXJcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L3V4L2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vdXgvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICd1eCcpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwICsgJ0NvcHlpbmcgKHV4KSAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vcGFja2FnZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3BhY2thZ2VzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAgKyAnQ29weWluZyAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vb3ZlcnJpZGVzL2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vb3ZlcnJpZGVzL2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAnb3ZlcnJpZGVzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAgKyAnQ29weWluZyAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksJ3Jlc291cmNlcy8nKSkpIHtcbiAgICAgICAgdmFyIGZyb21SZXNvdXJjZXMgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3Jlc291cmNlcy8nKVxuICAgICAgICB2YXIgdG9SZXNvdXJjZXMgPSBwYXRoLmpvaW4ob3V0cHV0LCAnLi4vcmVzb3VyY2VzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21SZXNvdXJjZXMsIHRvUmVzb3VyY2VzKVxuICAgICAgICBsb2coYXBwICsgJ0NvcHlpbmcgJyArIGZyb21SZXNvdXJjZXMucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9SZXNvdXJjZXMucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgfVxuICAgIHZhcnMuZmlyc3RUaW1lID0gZmFsc2VcbiAgICB2YXIganMgPSAnJ1xuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24pIHtcbiAgICAgIGpzID0gdmFycy5kZXBzLmpvaW4oJztcXG4nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBqcyA9ICdFeHQucmVxdWlyZShcIkV4dC4qXCIpJ1xuICAgIH1cbiAgICBpZiAodmFycy5tYW5pZmVzdCA9PT0gbnVsbCB8fCBqcyAhPT0gdmFycy5tYW5pZmVzdCkge1xuICAgICAgdmFycy5tYW5pZmVzdCA9IGpzXG4gICAgICBjb25zdCBtYW5pZmVzdCA9IHBhdGguam9pbihvdXRwdXQsICdtYW5pZmVzdC5qcycpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKG1hbmlmZXN0LCBqcywgJ3V0ZjgnKVxuICAgICAgdmFycy5yZWJ1aWxkID0gdHJ1ZVxuICAgICAgdmFyIGJ1bmRsZURpciA9IG91dHB1dC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKVxuICAgICAgaWYgKGJ1bmRsZURpci50cmltKCkgPT0gJycpIHtidW5kbGVEaXIgPSAnLi8nfVxuICAgICAgbG9nKGFwcCArICdCdWlsZGluZyBFeHQgYnVuZGxlIGF0OiAnICsgYnVuZGxlRGlyKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhcnMucmVidWlsZCA9IGZhbHNlXG4gICAgICBsb2coYXBwICsgJ0V4dCByZWJ1aWxkIE5PVCBuZWVkZWQnKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19wcmVwYXJlRm9yQnVpbGQ6ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICAgIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gICAgbG9ndihvcHRpb25zLCdGVU5DVElPTiBfYnVpbGRFeHRCdW5kbGUnKVxuXG4gICAgbGV0IHNlbmNoYTsgdHJ5IHsgc2VuY2hhID0gcmVxdWlyZSgnQHNlbmNoYS9jbWQnKSB9IGNhdGNoIChlKSB7IHNlbmNoYSA9ICdzZW5jaGEnIH1cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhzZW5jaGEpKSB7XG4gICAgICBsb2d2KG9wdGlvbnMsJ3NlbmNoYSBmb2xkZXIgZXhpc3RzJylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KG9wdGlvbnMsJ3NlbmNoYSBmb2xkZXIgRE9FUyBOT1QgZXhpc3QnKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBvbkJ1aWxkRG9uZSA9ICgpID0+IHtcbiAgICAgICAgbG9ndihvcHRpb25zLCdvbkJ1aWxkRG9uZScpXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfVxuXG4gICAgICB2YXIgb3B0cyA9IHsgY3dkOiBvdXRwdXRQYXRoLCBzaWxlbnQ6IHRydWUsIHN0ZGlvOiAncGlwZScsIGVuY29kaW5nOiAndXRmLTgnfVxuICAgICAgZXhlY3V0ZUFzeW5jKGFwcCwgc2VuY2hhLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIG9wdGlvbnMpLnRoZW4gKFxuICAgICAgICBmdW5jdGlvbigpIHsgb25CdWlsZERvbmUoKSB9LCBcbiAgICAgICAgZnVuY3Rpb24ocmVhc29uKSB7IHJlamVjdChyZWFzb24pIH1cbiAgICAgIClcbiAgICB9KVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZygnZScpXG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19idWlsZEV4dEJ1bmRsZTogJyArIGUpXG4gICAgY2FsbGJhY2soKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9kb25lKHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBsb2cgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2dcbiAgICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICAgIGxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gX2RvbmUnKVxuXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlICYmIG9wdGlvbnMudHJlZXNoYWtlID09IGZhbHNlICYmIG9wdGlvbnMuZnJhbWV3b3JrID09ICdhbmd1bGFyJykge1xuICAgICAgcmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5fdG9EZXYodmFycywgb3B0aW9ucylcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmKG9wdGlvbnMuYnJvd3NlciA9PSB0cnVlICYmIG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKSB7XG4gICAgICAgIGlmICh2YXJzLmJyb3dzZXJDb3VudCA9PSAwKSB7XG4gICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OicgKyBvcHRpb25zLnBvcnRcbiAgICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAgKyBgT3BlbmluZyBicm93c2VyIGF0ICR7dXJsfWApXG4gICAgICAgICAgdmFycy5icm93c2VyQ291bnQrK1xuICAgICAgICAgIGNvbnN0IG9wbiA9IHJlcXVpcmUoJ29wbicpXG4gICAgICAgICAgb3BuKHVybClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgIC8vY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ3Nob3cgYnJvd3NlciB3aW5kb3cgLSBleHQtZG9uZTogJyArIGUpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlQXN5bmMgKGFwcCwgY29tbWFuZCwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgLy9jb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBTZXJ2ZXJcIiwgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gICAgY29uc3QgREVGQVVMVF9TVUJTVFJTID0gW1wiW0lORl0geFNlcnZlclwiLCAnW0lORl0gTG9hZGluZycsICdbSU5GXSBBcHBlbmQnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbSU5GXSBQcm9jZXNzaW5nIEJ1aWxkJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgICB2YXIgc3Vic3RyaW5ncyA9IERFRkFVTFRfU1VCU1RSUyBcbiAgICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gICAgY29uc3QgY3Jvc3NTcGF3biA9IHJlcXVpcmUoJ2Nyb3NzLXNwYXduJylcbiAgICBjb25zdCBsb2cgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2dcbiAgICBsb2d2KG9wdGlvbnMsICdGVU5DVElPTiBleGVjdXRlQXN5bmMnKVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxvZ3Yob3B0aW9ucyxgY29tbWFuZCAtICR7Y29tbWFuZH1gKVxuICAgICAgbG9ndihvcHRpb25zLCBgcGFybXMgLSAke3Bhcm1zfWApXG4gICAgICBsb2d2KG9wdGlvbnMsIGBvcHRzIC0gJHtKU09OLnN0cmluZ2lmeShvcHRzKX1gKVxuICAgICAgbGV0IGNoaWxkID0gY3Jvc3NTcGF3bihjb21tYW5kLCBwYXJtcywgb3B0cylcbiAgICAgIGNoaWxkLm9uKCdjbG9zZScsIChjb2RlLCBzaWduYWwpID0+IHtcbiAgICAgICAgbG9ndihvcHRpb25zLCBgb24gY2xvc2U6IGAgKyBjb2RlKSBcbiAgICAgICAgaWYoY29kZSA9PT0gMCkgeyByZXNvbHZlKDApIH1cbiAgICAgICAgZWxzZSB7IGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCBuZXcgRXJyb3IoY29kZSkgKTsgcmVzb2x2ZSgwKSB9XG4gICAgICB9KVxuICAgICAgY2hpbGQub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7IFxuICAgICAgICBsb2d2KG9wdGlvbnMsIGBvbiBlcnJvcmApIFxuICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChlcnJvcilcbiAgICAgICAgcmVzb2x2ZSgwKVxuICAgICAgfSlcbiAgICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICBsb2d2KG9wdGlvbnMsIGAke3N0cn1gKVxuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkubWF0Y2goL0Zhc2hpb24gd2FpdGluZyBmb3IgY2hhbmdlc1xcLlxcLlxcLi8pKSB7XG5cbiAgICAgICAgICAvLyBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICAgICAgLy8gdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSsnL3NyYy9pbmRleC5qcyc7XG4gICAgICAgICAgLy8gdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuICAgICAgICAgIC8vIGZzLndyaXRlRmlsZVN5bmMoZmlsZW5hbWUsIGRhdGEgKyAnICcsICd1dGY4JylcbiAgICAgICAgICAvLyBsb2d2KG9wdGlvbnMsIGB0b3VjaGluZyAke2ZpbGVuYW1lfWApXG5cbiAgICAgICAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICAgICAgdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSArICcvc3JjL2luZGV4LmpzJztcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgZGF0YSArICcgJywgJ3V0ZjgnKTtcbiAgICAgICAgICAgIGxvZyhvcHRpb25zLCBgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2goZSkge1xuICAgICAgICAgICAgbG9nKG9wdGlvbnMsIGBOT1QgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKDApXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKHN1YnN0cmluZ3Muc29tZShmdW5jdGlvbih2KSB7IHJldHVybiBkYXRhLmluZGV4T2YodikgPj0gMDsgfSkpIHsgXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltJTkZdXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltMT0ddXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykudHJpbSgpXG4gICAgICAgICAgICBpZiAoc3RyLmluY2x1ZGVzKFwiW0VSUl1cIikpIHtcbiAgICAgICAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goYXBwICsgc3RyLnJlcGxhY2UoL15cXFtFUlJcXF0gL2dpLCAnJykpO1xuICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltFUlJdXCIsIGAke2NoYWxrLnJlZChcIltFUlJdXCIpfWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2coYCR7YXBwfSR7c3RyfWApIFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNoaWxkLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywgYGVycm9yIG9uIGNsb3NlOiBgICsgZGF0YSkgXG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICB2YXIgc3RySmF2YU9wdHMgPSBcIlBpY2tlZCB1cCBfSkFWQV9PUFRJT05TXCI7XG4gICAgICAgIHZhciBpbmNsdWRlcyA9IHN0ci5pbmNsdWRlcyhzdHJKYXZhT3B0cylcbiAgICAgICAgaWYgKCFpbmNsdWRlcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2FwcH0gJHtjaGFsay5yZWQoXCJbRVJSXVwiKX0gJHtzdHJ9YClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnZXhlY3V0ZUFzeW5jOiAnICsgZSlcbiAgICBjYWxsYmFjaygpXG4gIH0gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2cocykge1xuICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICB0cnkge1xuICAgIHByb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpXG4gIH1cbiAgY2F0Y2goZSkge31cbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocylcbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2d2KG9wdGlvbnMsIHMpIHtcbiAgaWYgKG9wdGlvbnMudmVyYm9zZSA9PSAneWVzJykge1xuICAgIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgfVxuICAgIGNhdGNoKGUpIHt9XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoYC12ZXJib3NlOiAke3N9YClcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX2dldEFwcCgpIHtcbiAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKVxuICB2YXIgcHJlZml4ID0gYGBcbiAgY29uc3QgcGxhdGZvcm0gPSByZXF1aXJlKCdvcycpLnBsYXRmb3JtKClcbiAgaWYgKHBsYXRmb3JtID09ICdkYXJ3aW4nKSB7IHByZWZpeCA9IGDihLkg772iZXh0772jOmAgfVxuICBlbHNlIHsgcHJlZml4ID0gYGkgW2V4dF06YCB9XG4gIHJldHVybiBgJHtjaGFsay5ncmVlbihwcmVmaXgpfSBgXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZ2V0VmVyc2lvbnMoYXBwLCBwbHVnaW5OYW1lLCBmcmFtZXdvcmtOYW1lKSB7XG4gIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5cbiAgdmFyIHYgPSB7fVxuICB2YXIgcGx1Z2luUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQHNlbmNoYScsIHBsdWdpbk5hbWUpXG4gIHZhciBwbHVnaW5Qa2cgPSAoZnMuZXhpc3RzU3luYyhwbHVnaW5QYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGx1Z2luUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYucGx1Z2luVmVyc2lvbiA9IHBsdWdpblBrZy52ZXJzaW9uXG4gIHYuX3Jlc29sdmVkID0gcGx1Z2luUGtnLl9yZXNvbHZlZFxuICBpZiAodi5fcmVzb2x2ZWQgPT0gdW5kZWZpbmVkKSB7XG4gICAgdi5lZGl0aW9uID0gYENvbW1lcmNpYWxgXG4gIH1cbiAgZWxzZSB7XG4gICAgaWYgKC0xID09IHYuX3Jlc29sdmVkLmluZGV4T2YoJ2NvbW11bml0eScpKSB7XG4gICAgICB2LmVkaXRpb24gPSBgQ29tbWVyY2lhbGBcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2LmVkaXRpb24gPSBgQ29tbXVuaXR5YFxuICAgIH1cbiAgfVxuXG4gIHZhciB3ZWJwYWNrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvd2VicGFjaycpXG4gIHZhciB3ZWJwYWNrUGtnID0gKGZzLmV4aXN0c1N5bmMod2VicGFja1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYud2VicGFja1ZlcnNpb24gPSB3ZWJwYWNrUGtnLnZlcnNpb25cblxuICB2YXIgZXh0UGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQHNlbmNoYS9leHQnKVxuICB2YXIgZXh0UGtnID0gKGZzLmV4aXN0c1N5bmMoZXh0UGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LmV4dFZlcnNpb24gPSBleHRQa2cuc2VuY2hhLnZlcnNpb25cblxuICB2YXIgY21kUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLGBub2RlX21vZHVsZXMvQHNlbmNoYS9jbWRgKVxuICB2YXIgY21kUGtnID0gKGZzLmV4aXN0c1N5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXG5cbiAgaWYgKHYuY21kVmVyc2lvbiA9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgY21kUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLGBub2RlX21vZHVsZXMvQHNlbmNoYS8ke3BsdWdpbk5hbWV9L25vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gICAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXG4gIH1cblxuICB2YXIgZnJhbWV3b3JrSW5mbyA9ICcnXG4gICBpZiAoZnJhbWV3b3JrTmFtZSAhPSB1bmRlZmluZWQgJiYgZnJhbWV3b3JrTmFtZSAhPSAnZXh0anMnKSB7XG4gICAgdmFyIGZyYW1ld29ya1BhdGggPSAnJ1xuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdyZWFjdCcpIHtcbiAgICAgIGZyYW1ld29ya1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL3JlYWN0JylcbiAgICB9XG4gICAgaWYgKGZyYW1ld29ya05hbWUgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9AYW5ndWxhci9jb3JlJylcbiAgICB9XG4gICAgdmFyIGZyYW1ld29ya1BrZyA9IChmcy5leGlzdHNTeW5jKGZyYW1ld29ya1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmZyYW1ld29ya1ZlcnNpb24gPSBmcmFtZXdvcmtQa2cudmVyc2lvblxuICAgIGZyYW1ld29ya0luZm8gPSAnLCAnICsgZnJhbWV3b3JrTmFtZSArICcgdicgKyB2LmZyYW1ld29ya1ZlcnNpb25cbiAgfVxuICByZXR1cm4gYXBwICsgJ2V4dC13ZWJwYWNrLXBsdWdpbiB2JyArIHYucGx1Z2luVmVyc2lvbiArICcsIEV4dCBKUyB2JyArIHYuZXh0VmVyc2lvbiArICcgJyArIHYuZWRpdGlvbiArICcgRWRpdGlvbiwgU2VuY2hhIENtZCB2JyArIHYuY21kVmVyc2lvbiArICcsIHdlYnBhY2sgdicgKyB2LndlYnBhY2tWZXJzaW9uICsgZnJhbWV3b3JrSW5mb1xuIH0iXX0=