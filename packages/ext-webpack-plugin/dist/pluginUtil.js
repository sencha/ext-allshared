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
            var cssPath = path.join(vars.extPath, 'ext.css');
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
      js = vars.deps.join(';\nExt.require(["Ext.*","Ext.data.TreeStore"]);\n');
    } else {
      js = `Ext.require(["Ext.*","Ext.data.TreeStore"])`;
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
                const fs = require('fs');

                var filename = process.cwd() + vars.touchFile;

                try {
                  var d = new Date().toLocaleString();
                  var data = fs.readFileSync(filename);
                  fs.writeFileSync(filename, '//' + d, 'utf8');
                  logv(app, `touching ${filename}`);
                } catch (e) {
                  logv(app, `NOT touching ${filename}`);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsImluaXRpYWxPcHRpb25zIiwiZnMiLCJyZXF1aXJlIiwidmFycyIsIm9wdGlvbnMiLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwicmVzdWx0IiwidHJlZXNoYWtlIiwidmVyYm9zZSIsInZhbGlkYXRlT3B0aW9ucyIsIl9nZXRWYWxpZGF0ZU9wdGlvbnMiLCJyYyIsImV4aXN0c1N5bmMiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJfZ2V0RGVmYXVsdE9wdGlvbnMiLCJfZ2V0RGVmYXVsdFZhcnMiLCJwbHVnaW5OYW1lIiwiYXBwIiwiX2dldEFwcCIsImxvZ3YiLCJlbnZpcm9ubWVudCIsInByb2R1Y3Rpb24iLCJicm93c2VyIiwid2F0Y2giLCJsb2ciLCJfZ2V0VmVyc2lvbnMiLCJpbnRlbGxpc2hha2UiLCJidWlsZHN0ZXAiLCJfdG9Qcm9kIiwiY29uZmlnT2JqIiwiZSIsInRvU3RyaW5nIiwiX3RoaXNDb21waWxhdGlvbiIsImNvbXBpbGVyIiwiY29tcGlsYXRpb24iLCJzY3JpcHQiLCJydW5TY3JpcHQiLCJlcnIiLCJfY29tcGlsYXRpb24iLCJleHRDb21wb25lbnRzIiwiX2dldEFsbENvbXBvbmVudHMiLCJob29rcyIsInN1Y2NlZWRNb2R1bGUiLCJ0YXAiLCJtb2R1bGUiLCJyZXNvdXJjZSIsIm1hdGNoIiwiX3NvdXJjZSIsIl92YWx1ZSIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJkZXBzIiwiX2V4dHJhY3RGcm9tU291cmNlIiwiY29uc29sZSIsImZpbmlzaE1vZHVsZXMiLCJtb2R1bGVzIiwiX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIiLCJpbmplY3QiLCJodG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uIiwiZGF0YSIsInBhdGgiLCJqc1BhdGgiLCJqb2luIiwiZXh0UGF0aCIsImNzc1BhdGgiLCJhc3NldHMiLCJqcyIsInVuc2hpZnQiLCJjc3MiLCJfYWZ0ZXJDb21waWxlIiwiX2VtaXQiLCJjYWxsYmFjayIsImVtaXQiLCJvdXRwdXRQYXRoIiwiZGV2U2VydmVyIiwiY29udGVudEJhc2UiLCJfcHJlcGFyZUZvckJ1aWxkIiwiY29tbWFuZCIsInJlYnVpbGQiLCJwYXJtcyIsInByb2ZpbGUiLCJ3YXRjaFN0YXJ0ZWQiLCJfYnVpbGRFeHRCdW5kbGUiLCJfZG9uZSIsInN0YXRzIiwiZXJyb3JzIiwibGVuZ3RoIiwiY2hhbGsiLCJyZWQiLCJwcm9jZXNzIiwiZXhpdCIsIl90b0RldiIsImJyb3dzZXJDb3VudCIsInVybCIsInBvcnQiLCJvcG4iLCJvdXRwdXQiLCJwYWNrYWdlcyIsInRvb2xraXQiLCJ0aGVtZSIsInJpbXJhZiIsIm1rZGlycCIsImZzeCIsImZpcnN0VGltZSIsInN5bmMiLCJidWlsZFhNTCIsImNyZWF0ZUFwcEpzb24iLCJjcmVhdGVXb3Jrc3BhY2VKc29uIiwiY3JlYXRlSlNET01FbnZpcm9ubWVudCIsIndyaXRlRmlsZVN5bmMiLCJjd2QiLCJmcm9tUGF0aCIsInRvUGF0aCIsImNvcHlTeW5jIiwicmVwbGFjZSIsImZyb21SZXNvdXJjZXMiLCJ0b1Jlc291cmNlcyIsImZpbHRlciIsInZhbHVlIiwiaW5kZXgiLCJpbmRleE9mIiwibWFuaWZlc3QiLCJidW5kbGVEaXIiLCJ0cmltIiwic2VuY2hhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbkJ1aWxkRG9uZSIsIm9wdHMiLCJzaWxlbnQiLCJzdGRpbyIsImVuY29kaW5nIiwiX2V4ZWN1dGVBc3luYyIsInRoZW4iLCJyZWFzb24iLCJERUZBVUxUX1NVQlNUUlMiLCJzdWJzdHJpbmdzIiwiY3Jvc3NTcGF3biIsInN0cmluZ2lmeSIsImNoaWxkIiwib24iLCJjb2RlIiwic2lnbmFsIiwiRXJyb3IiLCJlcnJvciIsInN0ZG91dCIsInN0ciIsImZpbGVuYW1lIiwidG91Y2hGaWxlIiwiZCIsIkRhdGUiLCJ0b0xvY2FsZVN0cmluZyIsInNvbWUiLCJ2Iiwic3RkZXJyIiwic3RySmF2YU9wdHMiLCJzY3JpcHRQYXRoIiwiY2hpbGRQcm9jZXNzIiwiaW52b2tlZCIsImZvcmsiLCJfdG9YdHlwZSIsInByZWZpeCIsInBsYXRmb3JtIiwiZ3JlZW4iLCJmcmFtZXdvcmtOYW1lIiwiZnJhbWV3b3JrSW5mbyIsInBsdWdpblZlcnNpb24iLCJleHRWZXJzaW9uIiwiZWRpdGlvbiIsImNtZFZlcnNpb24iLCJ3ZWJwYWNrVmVyc2lvbiIsInBsdWdpblBhdGgiLCJwbHVnaW5Qa2ciLCJ2ZXJzaW9uIiwiX3Jlc29sdmVkIiwid2VicGFja1BhdGgiLCJ3ZWJwYWNrUGtnIiwiZXh0UGtnIiwiY21kUGF0aCIsImNtZFBrZyIsInZlcnNpb25fZnVsbCIsImZyYW1ld29ya1BhdGgiLCJmcmFtZXdvcmtQa2ciLCJmcmFtZXdvcmtWZXJzaW9uIiwibWVzc2FnZSIsInMiLCJjdXJzb3JUbyIsImNsZWFyTGluZSIsIndyaXRlIiwibG9naCIsImgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDTyxTQUFTQSxZQUFULENBQXNCQyxjQUF0QixFQUFzQztBQUMzQyxRQUFNQyxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBLE1BQUlDLElBQUksR0FBRyxFQUFYO0FBQ0EsTUFBSUMsT0FBTyxHQUFHLEVBQWQ7O0FBQ0EsTUFBSTtBQUNGLFFBQUlKLGNBQWMsQ0FBQ0ssU0FBZixJQUE0QkMsU0FBaEMsRUFBMkM7QUFDekNILE1BQUFBLElBQUksQ0FBQ0ksWUFBTCxHQUFvQixFQUFwQjtBQUNBSixNQUFBQSxJQUFJLENBQUNJLFlBQUwsQ0FBa0JDLElBQWxCLENBQXVCLDBIQUF2QjtBQUNBLFVBQUlDLE1BQU0sR0FBRztBQUFFTixRQUFBQSxJQUFJLEVBQUVBO0FBQVIsT0FBYjtBQUNBLGFBQU9NLE1BQVA7QUFDRDs7QUFDRCxRQUFJSixTQUFTLEdBQUdMLGNBQWMsQ0FBQ0ssU0FBL0I7QUFDQSxRQUFJSyxTQUFTLEdBQUdWLGNBQWMsQ0FBQ1UsU0FBL0I7QUFDQSxRQUFJQyxPQUFPLEdBQUdYLGNBQWMsQ0FBQ1csT0FBN0I7O0FBRUEsVUFBTUMsZUFBZSxHQUFHVixPQUFPLENBQUMsY0FBRCxDQUEvQjs7QUFDQVUsSUFBQUEsZUFBZSxDQUFDQyxtQkFBbUIsRUFBcEIsRUFBd0JiLGNBQXhCLEVBQXdDLEVBQXhDLENBQWY7QUFFQSxVQUFNYyxFQUFFLEdBQUliLEVBQUUsQ0FBQ2MsVUFBSCxDQUFlLFFBQU9WLFNBQVUsSUFBaEMsS0FBd0NXLElBQUksQ0FBQ0MsS0FBTCxDQUFXaEIsRUFBRSxDQUFDaUIsWUFBSCxDQUFpQixRQUFPYixTQUFVLElBQWxDLEVBQXVDLE9BQXZDLENBQVgsQ0FBeEMsSUFBdUcsRUFBbkg7QUFDQUQsSUFBQUEsT0FBTyxxQkFBUWUsa0JBQWtCLEVBQTFCLEVBQWlDbkIsY0FBakMsRUFBb0RjLEVBQXBELENBQVA7QUFFQVgsSUFBQUEsSUFBSSxHQUFHRCxPQUFPLENBQUUsS0FBSUcsU0FBVSxNQUFoQixDQUFQLENBQThCZSxlQUE5QixFQUFQO0FBQ0FqQixJQUFBQSxJQUFJLENBQUNrQixVQUFMLEdBQWtCLG9CQUFsQjtBQUNBbEIsSUFBQUEsSUFBSSxDQUFDbUIsR0FBTCxHQUFXQyxPQUFPLEVBQWxCO0FBQ0EsUUFBSUYsVUFBVSxHQUFHbEIsSUFBSSxDQUFDa0IsVUFBdEI7QUFDQSxRQUFJQyxHQUFHLEdBQUduQixJQUFJLENBQUNtQixHQUFmO0FBRUFFLElBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFVLHVCQUFWLENBQUo7QUFDQWEsSUFBQUEsSUFBSSxDQUFDYixPQUFELEVBQVcsZ0JBQWVVLFVBQVcsRUFBckMsQ0FBSjtBQUNBRyxJQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBVyxTQUFRVyxHQUFJLEVBQXZCLENBQUo7O0FBRUEsUUFBSWxCLE9BQU8sQ0FBQ3FCLFdBQVIsSUFBdUIsWUFBM0IsRUFBeUM7QUFDdkN0QixNQUFBQSxJQUFJLENBQUN1QixVQUFMLEdBQWtCLElBQWxCO0FBQ0F0QixNQUFBQSxPQUFPLENBQUN1QixPQUFSLEdBQWtCLElBQWxCO0FBQ0F2QixNQUFBQSxPQUFPLENBQUN3QixLQUFSLEdBQWdCLElBQWhCO0FBQ0QsS0FKRCxNQUtLO0FBQ0h6QixNQUFBQSxJQUFJLENBQUN1QixVQUFMLEdBQWtCLEtBQWxCO0FBQ0Q7O0FBRURHLElBQUFBLEdBQUcsQ0FBQ1AsR0FBRCxFQUFNUSxZQUFZLENBQUNULFVBQUQsRUFBYWhCLFNBQWIsQ0FBbEIsQ0FBSCxDQXBDRSxDQXNDRjs7QUFDQSxRQUFJQSxTQUFTLElBQUksU0FBYixJQUNBRCxPQUFPLENBQUMyQixZQUFSLElBQXdCLElBRHhCLElBRUE1QixJQUFJLENBQUN1QixVQUFMLElBQW1CLElBRm5CLElBR0doQixTQUFTLElBQUksS0FIcEIsRUFHMkI7QUFDbkJQLE1BQUFBLElBQUksQ0FBQzZCLFNBQUwsR0FBaUIsUUFBakI7QUFDQUgsTUFBQUEsR0FBRyxDQUFDUCxHQUFELEVBQU0sbUNBQW1DakIsU0FBekMsQ0FBSDtBQUNQLEtBTkQsTUFRSyxJQUFJQSxTQUFTLElBQUksT0FBYixJQUF3QkEsU0FBUyxJQUFJLE9BQXJDLElBQWdEQSxTQUFTLElBQUksZ0JBQWpFLEVBQW1GO0FBQ3RGLFVBQUlGLElBQUksQ0FBQ3VCLFVBQUwsSUFBbUIsSUFBdkIsRUFBNkI7QUFDM0J2QixRQUFBQSxJQUFJLENBQUM2QixTQUFMLEdBQWlCLFFBQWpCO0FBQ0FILFFBQUFBLEdBQUcsQ0FBQ1AsR0FBRCxFQUFNLG1DQUFtQ2pCLFNBQXpDLENBQUg7QUFDRCxPQUhELE1BSUs7QUFDSEYsUUFBQUEsSUFBSSxDQUFDNkIsU0FBTCxHQUFpQixRQUFqQjtBQUNBSCxRQUFBQSxHQUFHLENBQUNQLEdBQUQsRUFBTSxvQ0FBb0NqQixTQUExQyxDQUFIO0FBQ0Q7QUFDRixLQVRJLE1BVUEsSUFBSUYsSUFBSSxDQUFDdUIsVUFBTCxJQUFtQixJQUF2QixFQUE2QjtBQUNoQyxVQUFJaEIsU0FBUyxJQUFJLEtBQWpCLEVBQXdCO0FBQ3RCUCxRQUFBQSxJQUFJLENBQUM2QixTQUFMLEdBQWlCLFFBQWpCO0FBQ0FILFFBQUFBLEdBQUcsQ0FBQ1AsR0FBRCxFQUFNLG1DQUFtQ2pCLFNBQW5DLEdBQStDLEtBQS9DLEdBQXVERixJQUFJLENBQUM2QixTQUFsRSxDQUFIOztBQUNBOUIsUUFBQUEsT0FBTyxDQUFFLEtBQUlHLFNBQVUsTUFBaEIsQ0FBUCxDQUE4QjRCLE9BQTlCLENBQXNDOUIsSUFBdEMsRUFBNENDLE9BQTVDO0FBQ0QsT0FKRCxNQUtLO0FBQ0hELFFBQUFBLElBQUksQ0FBQzZCLFNBQUwsR0FBaUIsUUFBakI7QUFDQUgsUUFBQUEsR0FBRyxDQUFDUCxHQUFELEVBQU0scUNBQXFDakIsU0FBckMsR0FBaUQsS0FBakQsR0FBeURGLElBQUksQ0FBQzZCLFNBQXBFLENBQUg7QUFDRDtBQUNGLEtBVkksTUFXQTtBQUNIN0IsTUFBQUEsSUFBSSxDQUFDNkIsU0FBTCxHQUFpQixRQUFqQjtBQUNBSCxNQUFBQSxHQUFHLENBQUNQLEdBQUQsRUFBTSxvQ0FBb0NqQixTQUExQyxDQUFIO0FBQ0Q7O0FBQ0RtQixJQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBVSxrQkFBa0JQLE9BQU8sQ0FBQ3FCLFdBQTFCLEdBQXdDLElBQXhDLEdBQStDLGVBQS9DLEdBQWlFckIsT0FBTyxDQUFDTSxTQUF6RSxHQUFvRixJQUFwRixHQUEyRixrQkFBM0YsR0FBZ0hOLE9BQU8sQ0FBQzJCLFlBQWxJLENBQUo7QUFFQSxRQUFJRyxTQUFTLEdBQUc7QUFBRS9CLE1BQUFBLElBQUksRUFBRUEsSUFBUjtBQUFjQyxNQUFBQSxPQUFPLEVBQUVBO0FBQXZCLEtBQWhCO0FBQ0EsV0FBTzhCLFNBQVA7QUFDRCxHQTVFRCxDQTZFQSxPQUFPQyxDQUFQLEVBQVU7QUFDUixVQUFNLG1CQUFtQkEsQ0FBQyxDQUFDQyxRQUFGLEVBQXpCO0FBQ0Q7QUFDRixDLENBRUQ7OztBQUNPLFNBQVNDLGdCQUFULENBQTBCQyxRQUExQixFQUFvQ0MsV0FBcEMsRUFBaURwQyxJQUFqRCxFQUF1REMsT0FBdkQsRUFBZ0U7QUFDckUsTUFBSTtBQUNGLFFBQUlrQixHQUFHLEdBQUduQixJQUFJLENBQUNtQixHQUFmO0FBQ0EsUUFBSVgsT0FBTyxHQUFHUCxPQUFPLENBQUNPLE9BQXRCO0FBQ0FhLElBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFVLDJCQUFWLENBQUo7QUFDQWEsSUFBQUEsSUFBSSxDQUFDYixPQUFELEVBQVcsbUJBQWtCUCxPQUFPLENBQUNvQyxNQUFRLEVBQTdDLENBQUo7QUFDQWhCLElBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFXLGNBQWFSLElBQUksQ0FBQzZCLFNBQVUsRUFBdkMsQ0FBSjs7QUFFQSxRQUFJN0IsSUFBSSxDQUFDNkIsU0FBTCxLQUFtQixRQUFuQixJQUErQjdCLElBQUksQ0FBQzZCLFNBQUwsS0FBbUIsUUFBdEQsRUFBZ0U7QUFDOUQsVUFBSTVCLE9BQU8sQ0FBQ29DLE1BQVIsSUFBa0JsQyxTQUFsQixJQUErQkYsT0FBTyxDQUFDb0MsTUFBUixJQUFrQixJQUFqRCxJQUF5RHBDLE9BQU8sQ0FBQ29DLE1BQVIsSUFBa0IsRUFBL0UsRUFBbUY7QUFDakZYLFFBQUFBLEdBQUcsQ0FBQ1AsR0FBRCxFQUFPLG1CQUFrQmxCLE9BQU8sQ0FBQ29DLE1BQU8sRUFBeEMsQ0FBSDtBQUNBQyxRQUFBQSxTQUFTLENBQUNyQyxPQUFPLENBQUNvQyxNQUFULEVBQWlCLFVBQVVFLEdBQVYsRUFBZTtBQUN2QyxjQUFJQSxHQUFKLEVBQVM7QUFDUCxrQkFBTUEsR0FBTjtBQUNEOztBQUNEYixVQUFBQSxHQUFHLENBQUNQLEdBQUQsRUFBTyxvQkFBbUJsQixPQUFPLENBQUNvQyxNQUFPLEVBQXpDLENBQUg7QUFDRCxTQUxRLENBQVQ7QUFNRDtBQUNGO0FBQ0YsR0FsQkQsQ0FtQkEsT0FBTUwsQ0FBTixFQUFTO0FBQ1AsVUFBTSx1QkFBdUJBLENBQUMsQ0FBQ0MsUUFBRixFQUE3QjtBQUNEO0FBQ0YsQyxDQUVEOzs7QUFDTyxTQUFTTyxZQUFULENBQXNCTCxRQUF0QixFQUFnQ0MsV0FBaEMsRUFBNkNwQyxJQUE3QyxFQUFtREMsT0FBbkQsRUFBNEQ7QUFDakUsTUFBSTtBQUNGLFFBQUlrQixHQUFHLEdBQUduQixJQUFJLENBQUNtQixHQUFmO0FBQ0EsUUFBSVgsT0FBTyxHQUFHUCxPQUFPLENBQUNPLE9BQXRCO0FBQ0EsUUFBSU4sU0FBUyxHQUFHRCxPQUFPLENBQUNDLFNBQXhCO0FBQ0FtQixJQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBVSx1QkFBVixDQUFKOztBQUVBLFFBQUlOLFNBQVMsSUFBSSxPQUFqQixFQUEwQjtBQUN4QixVQUFJRCxPQUFPLENBQUNNLFNBQVIsS0FBc0IsS0FBdEIsSUFBK0JOLE9BQU8sQ0FBQ3FCLFdBQVIsS0FBd0IsWUFBM0QsRUFBeUU7QUFDdkUsWUFBSW1CLGFBQWEsR0FBRyxFQUFwQixDQUR1RSxDQUd2RTs7QUFDQSxZQUFJekMsSUFBSSxDQUFDNkIsU0FBTCxJQUFrQixRQUFsQixJQUE4QjNCLFNBQVMsS0FBSyxTQUE1QyxJQUF5REQsT0FBTyxDQUFDMkIsWUFBUixJQUF3QixJQUFyRixFQUEyRjtBQUN2RmEsVUFBQUEsYUFBYSxHQUFHMUMsT0FBTyxDQUFFLEtBQUlHLFNBQVUsTUFBaEIsQ0FBUCxDQUE4QndDLGlCQUE5QixDQUFnRDFDLElBQWhELEVBQXNEQyxPQUF0RCxDQUFoQjtBQUNIOztBQUVELFlBQUlELElBQUksQ0FBQzZCLFNBQUwsSUFBa0IsUUFBbEIsSUFBK0I3QixJQUFJLENBQUM2QixTQUFMLElBQWtCLFFBQWxCLElBQThCM0IsU0FBUyxLQUFLLGdCQUEvRSxFQUFrRztBQUNoR3VDLFVBQUFBLGFBQWEsR0FBRzFDLE9BQU8sQ0FBRSxLQUFJRyxTQUFVLE1BQWhCLENBQVAsQ0FBOEJ3QyxpQkFBOUIsQ0FBZ0QxQyxJQUFoRCxFQUFzREMsT0FBdEQsQ0FBaEI7QUFDRDs7QUFDRG1DLFFBQUFBLFdBQVcsQ0FBQ08sS0FBWixDQUFrQkMsYUFBbEIsQ0FBZ0NDLEdBQWhDLENBQXFDLG9CQUFyQyxFQUEwREMsTUFBTSxJQUFJO0FBQ2xFLGNBQUlBLE1BQU0sQ0FBQ0MsUUFBUCxJQUFtQixDQUFDRCxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLEtBQWhCLENBQXNCLGNBQXRCLENBQXhCLEVBQStEO0FBQzdELGdCQUFJO0FBQ0Esa0JBQUlGLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsS0FBaEIsQ0FBc0IsU0FBdEIsS0FBb0MsSUFBcEMsSUFDREYsTUFBTSxDQUFDRyxPQUFQLENBQWVDLE1BQWYsQ0FBc0JDLFdBQXRCLEdBQW9DQyxRQUFwQyxDQUE2QyxjQUE3QyxLQUFnRSxLQURuRSxFQUVFO0FBQ0VwRCxnQkFBQUEsSUFBSSxDQUFDcUQsSUFBTCxHQUFZLENBQ1IsSUFBSXJELElBQUksQ0FBQ3FELElBQUwsSUFBYSxFQUFqQixDQURRLEVBRVIsR0FBR3RELE9BQU8sQ0FBRSxLQUFJRyxTQUFVLE1BQWhCLENBQVAsQ0FBOEJvRCxrQkFBOUIsQ0FBaURSLE1BQWpELEVBQXlEN0MsT0FBekQsRUFBa0VtQyxXQUFsRSxFQUErRUssYUFBL0UsQ0FGSyxDQUFaO0FBR0MsZUFOTCxNQU9LO0FBQ0R6QyxnQkFBQUEsSUFBSSxDQUFDcUQsSUFBTCxHQUFZLENBQ1IsSUFBSXJELElBQUksQ0FBQ3FELElBQUwsSUFBYSxFQUFqQixDQURRLEVBRVIsR0FBR3RELE9BQU8sQ0FBRSxLQUFJRyxTQUFVLE1BQWhCLENBQVAsQ0FBOEJvRCxrQkFBOUIsQ0FBaURSLE1BQWpELEVBQXlEN0MsT0FBekQsRUFBa0VtQyxXQUFsRSxFQUErRUssYUFBL0UsQ0FGSyxDQUFaO0FBR0M7QUFDUixhQWJELENBY0EsT0FBTVQsQ0FBTixFQUFTO0FBQ0x1QixjQUFBQSxPQUFPLENBQUM3QixHQUFSLENBQVlNLENBQVo7QUFDSDtBQUNGO0FBQ0YsU0FwQkQ7QUFxQkQ7O0FBQ0QsVUFBSWhDLElBQUksQ0FBQzZCLFNBQUwsSUFBa0IsUUFBdEIsRUFBZ0M7QUFDOUJPLFFBQUFBLFdBQVcsQ0FBQ08sS0FBWixDQUFrQmEsYUFBbEIsQ0FBZ0NYLEdBQWhDLENBQXFDLG9CQUFyQyxFQUEwRFksT0FBTyxJQUFJO0FBQ25FMUQsVUFBQUEsT0FBTyxDQUFFLEtBQUlHLFNBQVUsTUFBaEIsQ0FBUCxDQUE4QndELHVCQUE5QixDQUFzRDFELElBQXRELEVBQTREQyxPQUE1RDtBQUNELFNBRkQ7QUFHRDs7QUFDRCxVQUFJRCxJQUFJLENBQUM2QixTQUFMLElBQWtCLFFBQWxCLElBQThCN0IsSUFBSSxDQUFDNkIsU0FBTCxJQUFrQixRQUFwRCxFQUE4RDtBQUM1RCxZQUFJNUIsT0FBTyxDQUFDMEQsTUFBUixLQUFtQixLQUF2QixFQUE4QjtBQUM1QnZCLFVBQUFBLFdBQVcsQ0FBQ08sS0FBWixDQUFrQmlCLHFDQUFsQixDQUF3RGYsR0FBeEQsQ0FBNkQscUJBQTdELEVBQW1GZ0IsSUFBRCxJQUFVO0FBQzFGLGtCQUFNQyxJQUFJLEdBQUcvRCxPQUFPLENBQUMsTUFBRCxDQUFwQjs7QUFDQSxnQkFBSWdFLE1BQU0sR0FBR0QsSUFBSSxDQUFDRSxJQUFMLENBQVVoRSxJQUFJLENBQUNpRSxPQUFmLEVBQXdCLFFBQXhCLENBQWI7QUFDQSxnQkFBSUMsT0FBTyxHQUFHSixJQUFJLENBQUNFLElBQUwsQ0FBVWhFLElBQUksQ0FBQ2lFLE9BQWYsRUFBd0IsU0FBeEIsQ0FBZDtBQUNBSixZQUFBQSxJQUFJLENBQUNNLE1BQUwsQ0FBWUMsRUFBWixDQUFlQyxPQUFmLENBQXVCTixNQUF2QjtBQUNBRixZQUFBQSxJQUFJLENBQUNNLE1BQUwsQ0FBWUcsR0FBWixDQUFnQkQsT0FBaEIsQ0FBd0JILE9BQXhCO0FBQ0F4QyxZQUFBQSxHQUFHLENBQUNQLEdBQUQsRUFBTyxVQUFTNEMsTUFBTyxRQUFPRyxPQUFRLGdCQUF0QyxDQUFIO0FBQ0QsV0FQRDtBQVFEO0FBQ0Y7QUFDRjtBQUNGLEdBMURELENBMkRBLE9BQU1sQyxDQUFOLEVBQVM7QUFDUCxVQUFNLG1CQUFtQkEsQ0FBQyxDQUFDQyxRQUFGLEVBQXpCLENBRE8sQ0FFWDtBQUNBO0FBQ0c7QUFDRixDLENBRUQ7OztBQUNPLFNBQVNzQyxhQUFULENBQXVCcEMsUUFBdkIsRUFBaUNDLFdBQWpDLEVBQThDcEMsSUFBOUMsRUFBb0RDLE9BQXBELEVBQTZEO0FBQ2xFLE1BQUk7QUFDRixRQUFJa0IsR0FBRyxHQUFHbkIsSUFBSSxDQUFDbUIsR0FBZjtBQUNBLFFBQUlYLE9BQU8sR0FBR1AsT0FBTyxDQUFDTyxPQUF0QjtBQUNBLFFBQUlOLFNBQVMsR0FBR0QsT0FBTyxDQUFDQyxTQUF4QjtBQUNBbUIsSUFBQUEsSUFBSSxDQUFDYixPQUFELEVBQVUsd0JBQVYsQ0FBSjs7QUFDQSxRQUFJTixTQUFTLElBQUksT0FBakIsRUFBMEI7QUFDeEJILE1BQUFBLE9BQU8sQ0FBRSxhQUFGLENBQVAsQ0FBdUJ3RSxhQUF2QixDQUFxQ25DLFdBQXJDLEVBQWtEcEMsSUFBbEQsRUFBd0RDLE9BQXhEO0FBQ0QsS0FGRCxNQUdLO0FBQ0hvQixNQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBVSxnQ0FBVixDQUFKO0FBQ0Q7QUFDRixHQVhELENBWUEsT0FBTXdCLENBQU4sRUFBUztBQUNQLFVBQU0sb0JBQW9CQSxDQUFDLENBQUNDLFFBQUYsRUFBMUI7QUFDRDtBQUNGLEMsQ0FFRDs7O1NBQ3NCdUMsSzs7RUFtRXRCOzs7Ozs7MEJBbkVPLGlCQUFxQnJDLFFBQXJCLEVBQStCQyxXQUEvQixFQUE0Q3BDLElBQTVDLEVBQWtEQyxPQUFsRCxFQUEyRHdFLFFBQTNEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVHWCxVQUFBQSxJQUZILEdBRVUvRCxPQUFPLENBQUMsTUFBRCxDQUZqQjtBQUdDb0IsVUFBQUEsR0FIRCxHQUdPbkIsSUFBSSxDQUFDbUIsR0FIWjtBQUlDWCxVQUFBQSxPQUpELEdBSVdQLE9BQU8sQ0FBQ08sT0FKbkI7QUFLQ2tFLFVBQUFBLElBTEQsR0FLUXpFLE9BQU8sQ0FBQ3lFLElBTGhCO0FBTUN4RSxVQUFBQSxTQU5ELEdBTWFELE9BQU8sQ0FBQ0MsU0FOckI7QUFPSG1CLFVBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFTLGdCQUFULENBQUo7O0FBUEcsZ0JBUUNrRSxJQUFJLElBQUksS0FSVDtBQUFBO0FBQUE7QUFBQTs7QUFBQSxnQkFTRzFFLElBQUksQ0FBQzZCLFNBQUwsSUFBa0IsUUFBbEIsSUFBOEI3QixJQUFJLENBQUM2QixTQUFMLElBQWtCLFFBVG5EO0FBQUE7QUFBQTtBQUFBOztBQVVLOEMsVUFBQUEsVUFWTCxHQVVrQmIsSUFBSSxDQUFDRSxJQUFMLENBQVU3QixRQUFRLENBQUN3QyxVQUFuQixFQUE4QjNFLElBQUksQ0FBQ2lFLE9BQW5DLENBVmxCOztBQVdDLGNBQUk5QixRQUFRLENBQUN3QyxVQUFULEtBQXdCLEdBQXhCLElBQStCeEMsUUFBUSxDQUFDbEMsT0FBVCxDQUFpQjJFLFNBQXBELEVBQStEO0FBQzdERCxZQUFBQSxVQUFVLEdBQUdiLElBQUksQ0FBQ0UsSUFBTCxDQUFVN0IsUUFBUSxDQUFDbEMsT0FBVCxDQUFpQjJFLFNBQWpCLENBQTJCQyxXQUFyQyxFQUFrREYsVUFBbEQsQ0FBYjtBQUNEOztBQUNEdEQsVUFBQUEsSUFBSSxDQUFDYixPQUFELEVBQVMsaUJBQWlCbUUsVUFBMUIsQ0FBSjtBQUNBdEQsVUFBQUEsSUFBSSxDQUFDYixPQUFELEVBQVMsZ0JBQWdCTixTQUF6QixDQUFKOztBQUNBLGNBQUlBLFNBQVMsSUFBSSxPQUFqQixFQUEwQjtBQUN4QjRFLFlBQUFBLGdCQUFnQixDQUFDM0QsR0FBRCxFQUFNbkIsSUFBTixFQUFZQyxPQUFaLEVBQXFCMEUsVUFBckIsRUFBaUN2QyxXQUFqQyxDQUFoQjtBQUNEOztBQUNHMkMsVUFBQUEsT0FuQkwsR0FtQmUsRUFuQmY7O0FBb0JDLGNBQUk5RSxPQUFPLENBQUN3QixLQUFSLElBQWlCLEtBQWpCLElBQTBCekIsSUFBSSxDQUFDdUIsVUFBTCxJQUFtQixLQUFqRCxFQUNFO0FBQUN3RCxZQUFBQSxPQUFPLEdBQUcsT0FBVjtBQUFrQixXQURyQixNQUdFO0FBQUNBLFlBQUFBLE9BQU8sR0FBRyxPQUFWO0FBQWtCOztBQXZCdEIsZ0JBd0JLL0UsSUFBSSxDQUFDZ0YsT0FBTCxJQUFnQixJQXhCckI7QUFBQTtBQUFBO0FBQUE7O0FBeUJPQyxVQUFBQSxLQXpCUCxHQXlCZSxFQXpCZjs7QUEwQkcsY0FBSWhGLE9BQU8sQ0FBQ2lGLE9BQVIsSUFBbUIvRSxTQUFuQixJQUFnQ0YsT0FBTyxDQUFDaUYsT0FBUixJQUFtQixFQUFuRCxJQUF5RGpGLE9BQU8sQ0FBQ2lGLE9BQVIsSUFBbUIsSUFBaEYsRUFBc0Y7QUFDcEYsZ0JBQUlILE9BQU8sSUFBSSxPQUFmLEVBQ0U7QUFBRUUsY0FBQUEsS0FBSyxHQUFHLENBQUMsS0FBRCxFQUFRRixPQUFSLEVBQWlCOUUsT0FBTyxDQUFDcUIsV0FBekIsQ0FBUjtBQUErQyxhQURuRCxNQUdFO0FBQUUyRCxjQUFBQSxLQUFLLEdBQUcsQ0FBQyxLQUFELEVBQVFGLE9BQVIsRUFBaUIsY0FBakIsRUFBaUMsT0FBakMsRUFBMEM5RSxPQUFPLENBQUNxQixXQUFsRCxDQUFSO0FBQXdFO0FBQzdFLFdBTEQsTUFNSztBQUNILGdCQUFJeUQsT0FBTyxJQUFJLE9BQWYsRUFDRTtBQUFDRSxjQUFBQSxLQUFLLEdBQUcsQ0FBQyxLQUFELEVBQVFGLE9BQVIsRUFBaUI5RSxPQUFPLENBQUNpRixPQUF6QixFQUFrQ2pGLE9BQU8sQ0FBQ3FCLFdBQTFDLENBQVI7QUFBK0QsYUFEbEUsTUFHRTtBQUFDMkQsY0FBQUEsS0FBSyxHQUFHLENBQUMsS0FBRCxFQUFRRixPQUFSLEVBQWlCLGNBQWpCLEVBQWlDLE9BQWpDLEVBQTBDOUUsT0FBTyxDQUFDaUYsT0FBbEQsRUFBMkRqRixPQUFPLENBQUNxQixXQUFuRSxDQUFSO0FBQXdGO0FBQzVGOztBQXJDSixnQkFzQ090QixJQUFJLENBQUNtRixZQUFMLElBQXFCLEtBdEM1QjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLGlCQXVDV0MsZUFBZSxDQUFDakUsR0FBRCxFQUFNaUIsV0FBTixFQUFtQnVDLFVBQW5CLEVBQStCTSxLQUEvQixFQUFzQ2pGLElBQXRDLEVBQTRDQyxPQUE1QyxDQXZDMUI7O0FBQUE7QUF3Q0tELFVBQUFBLElBQUksQ0FBQ21GLFlBQUwsR0FBb0IsSUFBcEI7O0FBeENMO0FBMENHVixVQUFBQSxRQUFRO0FBMUNYO0FBQUE7O0FBQUE7QUE2Q0dBLFVBQUFBLFFBQVE7O0FBN0NYO0FBQUE7QUFBQTs7QUFBQTtBQWlEQ3BELFVBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFTLGtCQUFULENBQUo7QUFDQWlFLFVBQUFBLFFBQVE7O0FBbERUO0FBQUE7QUFBQTs7QUFBQTtBQXNERHBELFVBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFTLFlBQVQsQ0FBSjtBQUNBaUUsVUFBQUEsUUFBUTs7QUF2RFA7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQTJESEEsVUFBQUEsUUFBUTtBQTNETCxnQkE0REcsWUFBWSxZQUFFeEMsUUFBRixFQTVEZjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7OztBQW9FQSxTQUFTb0QsS0FBVCxDQUFlQyxLQUFmLEVBQXNCdEYsSUFBdEIsRUFBNEJDLE9BQTVCLEVBQXFDO0FBQzFDLE1BQUk7QUFDRixRQUFJTyxPQUFPLEdBQUdQLE9BQU8sQ0FBQ08sT0FBdEI7QUFDQSxRQUFJTixTQUFTLEdBQUdELE9BQU8sQ0FBQ0MsU0FBeEI7QUFDQW1CLElBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFTLGdCQUFULENBQUo7O0FBQ0EsUUFBSThFLEtBQUssQ0FBQ2xELFdBQU4sQ0FBa0JtRCxNQUFsQixJQUE0QkQsS0FBSyxDQUFDbEQsV0FBTixDQUFrQm1ELE1BQWxCLENBQXlCQyxNQUF6RCxFQUFpRTtBQUNqRTtBQUNFLFlBQUlDLEtBQUssR0FBRzFGLE9BQU8sQ0FBQyxPQUFELENBQW5COztBQUNBd0QsUUFBQUEsT0FBTyxDQUFDN0IsR0FBUixDQUFZK0QsS0FBSyxDQUFDQyxHQUFOLENBQVUsNENBQVYsQ0FBWjtBQUNBbkMsUUFBQUEsT0FBTyxDQUFDN0IsR0FBUixDQUFZNEQsS0FBSyxDQUFDbEQsV0FBTixDQUFrQm1ELE1BQWxCLENBQXlCLENBQXpCLENBQVo7QUFDQWhDLFFBQUFBLE9BQU8sQ0FBQzdCLEdBQVIsQ0FBWStELEtBQUssQ0FBQ0MsR0FBTixDQUFVLDRDQUFWLENBQVo7QUFDQUMsUUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsQ0FBYjtBQUNELE9BWEMsQ0FhRjs7O0FBQ0EsUUFBSTVGLElBQUksQ0FBQ3VCLFVBQUwsSUFBbUIsSUFBbkIsSUFBMkJ0QixPQUFPLENBQUNNLFNBQVIsSUFBcUIsSUFBaEQsSUFBd0RMLFNBQVMsSUFBSSxTQUF6RSxFQUFvRjtBQUNsRkgsTUFBQUEsT0FBTyxDQUFFLEtBQUlFLE9BQU8sQ0FBQ0MsU0FBVSxNQUF4QixDQUFQLENBQXNDMkYsTUFBdEMsQ0FBNkM3RixJQUE3QyxFQUFtREMsT0FBbkQ7QUFDRDs7QUFDRCxRQUFJO0FBQ0YsVUFBR0EsT0FBTyxDQUFDdUIsT0FBUixJQUFtQixLQUFuQixJQUE0QnZCLE9BQU8sQ0FBQ3dCLEtBQVIsSUFBaUIsS0FBN0MsSUFBc0R6QixJQUFJLENBQUN1QixVQUFMLElBQW1CLEtBQTVFLEVBQW1GO0FBQ2pGLFlBQUl2QixJQUFJLENBQUM4RixZQUFMLElBQXFCLENBQXpCLEVBQTRCO0FBQzFCLGNBQUlDLEdBQUcsR0FBRyxzQkFBc0I5RixPQUFPLENBQUMrRixJQUF4Qzs7QUFDQWpHLFVBQUFBLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0IyQixHQUF4QixDQUE0QjFCLElBQUksQ0FBQ21CLEdBQWpDLEVBQXVDLHNCQUFxQjRFLEdBQUksRUFBaEU7O0FBQ0EvRixVQUFBQSxJQUFJLENBQUM4RixZQUFMOztBQUNBLGdCQUFNRyxHQUFHLEdBQUdsRyxPQUFPLENBQUMsS0FBRCxDQUFuQjs7QUFDQWtHLFVBQUFBLEdBQUcsQ0FBQ0YsR0FBRCxDQUFIO0FBQ0Q7QUFDRjtBQUNGLEtBVkQsQ0FXQSxPQUFPL0QsQ0FBUCxFQUFVO0FBQ1J1QixNQUFBQSxPQUFPLENBQUM3QixHQUFSLENBQVlNLENBQVo7QUFDRDs7QUFDRCxRQUFJaEMsSUFBSSxDQUFDNkIsU0FBTCxJQUFrQixRQUF0QixFQUFnQztBQUM5QixVQUFJN0IsSUFBSSxDQUFDdUIsVUFBTCxJQUFtQixJQUF2QixFQUE2QjtBQUMzQnhCLFFBQUFBLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0IyQixHQUF4QixDQUE0QjFCLElBQUksQ0FBQ21CLEdBQWpDLEVBQXVDLCtCQUE4QmpCLFNBQVUsRUFBL0U7QUFDRCxPQUZELE1BR0s7QUFDSEgsUUFBQUEsT0FBTyxDQUFDLGNBQUQsQ0FBUCxDQUF3QjJCLEdBQXhCLENBQTRCMUIsSUFBSSxDQUFDbUIsR0FBakMsRUFBdUMsZ0NBQStCakIsU0FBVSxFQUFoRjtBQUNEO0FBQ0Y7O0FBQ0QsUUFBSUYsSUFBSSxDQUFDNkIsU0FBTCxJQUFrQixRQUF0QixFQUFnQztBQUM5QjlCLE1BQUFBLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0IyQixHQUF4QixDQUE0QjFCLElBQUksQ0FBQ21CLEdBQWpDLEVBQXVDLCtCQUE4QmpCLFNBQVUsRUFBL0U7QUFDRDtBQUNGLEdBMUNELENBMkNBLE9BQU04QixDQUFOLEVBQVM7QUFDWDtBQUNJLFVBQU0sWUFBWUEsQ0FBQyxDQUFDQyxRQUFGLEVBQWxCO0FBQ0Q7QUFDRixDLENBRUQ7OztBQUNPLFNBQVM2QyxnQkFBVCxDQUEwQjNELEdBQTFCLEVBQStCbkIsSUFBL0IsRUFBcUNDLE9BQXJDLEVBQThDaUcsTUFBOUMsRUFBc0Q5RCxXQUF0RCxFQUFtRTtBQUN4RSxNQUFJO0FBQ0YsUUFBSTVCLE9BQU8sR0FBR1AsT0FBTyxDQUFDTyxPQUF0QjtBQUNBLFFBQUkyRixRQUFRLEdBQUdsRyxPQUFPLENBQUNrRyxRQUF2QjtBQUNBLFFBQUlDLE9BQU8sR0FBR25HLE9BQU8sQ0FBQ21HLE9BQXRCO0FBQ0EsUUFBSUMsS0FBSyxHQUFHcEcsT0FBTyxDQUFDb0csS0FBcEI7QUFDQWhGLElBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFTLDJCQUFULENBQUo7O0FBQ0EsVUFBTThGLE1BQU0sR0FBR3ZHLE9BQU8sQ0FBQyxRQUFELENBQXRCOztBQUNBLFVBQU13RyxNQUFNLEdBQUd4RyxPQUFPLENBQUMsUUFBRCxDQUF0Qjs7QUFDQSxVQUFNeUcsR0FBRyxHQUFHekcsT0FBTyxDQUFDLFVBQUQsQ0FBbkI7O0FBQ0EsVUFBTUQsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxVQUFNK0QsSUFBSSxHQUFHL0QsT0FBTyxDQUFDLE1BQUQsQ0FBcEI7O0FBQ0FzRyxJQUFBQSxLQUFLLEdBQUdBLEtBQUssS0FBS0QsT0FBTyxLQUFLLFNBQVosR0FBd0IsY0FBeEIsR0FBeUMsZ0JBQTlDLENBQWI7QUFDQS9FLElBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFTLGdCQUFnQlIsSUFBSSxDQUFDeUcsU0FBOUIsQ0FBSjs7QUFDQSxRQUFJekcsSUFBSSxDQUFDeUcsU0FBVCxFQUFvQjtBQUNsQkgsTUFBQUEsTUFBTSxDQUFDSSxJQUFQLENBQVlSLE1BQVo7QUFDQUssTUFBQUEsTUFBTSxDQUFDRyxJQUFQLENBQVlSLE1BQVo7O0FBQ0EsWUFBTVMsUUFBUSxHQUFHNUcsT0FBTyxDQUFDLGFBQUQsQ0FBUCxDQUF1QjRHLFFBQXhDOztBQUNBLFlBQU1DLGFBQWEsR0FBRzdHLE9BQU8sQ0FBQyxhQUFELENBQVAsQ0FBdUI2RyxhQUE3Qzs7QUFDQSxZQUFNQyxtQkFBbUIsR0FBRzlHLE9BQU8sQ0FBQyxhQUFELENBQVAsQ0FBdUI4RyxtQkFBbkQ7O0FBQ0EsWUFBTUMsc0JBQXNCLEdBQUcvRyxPQUFPLENBQUMsYUFBRCxDQUFQLENBQXVCK0csc0JBQXREOztBQUNBaEgsTUFBQUEsRUFBRSxDQUFDaUgsYUFBSCxDQUFpQmpELElBQUksQ0FBQ0UsSUFBTCxDQUFVa0MsTUFBVixFQUFrQixXQUFsQixDQUFqQixFQUFpRFMsUUFBUSxDQUFDM0csSUFBSSxDQUFDdUIsVUFBTixFQUFrQnRCLE9BQWxCLEVBQTJCaUcsTUFBM0IsQ0FBekQsRUFBNkYsTUFBN0Y7QUFDQXBHLE1BQUFBLEVBQUUsQ0FBQ2lILGFBQUgsQ0FBaUJqRCxJQUFJLENBQUNFLElBQUwsQ0FBVWtDLE1BQVYsRUFBa0IsVUFBbEIsQ0FBakIsRUFBZ0RVLGFBQWEsQ0FBQ1AsS0FBRCxFQUFRRixRQUFSLEVBQWtCQyxPQUFsQixFQUEyQm5HLE9BQTNCLEVBQW9DaUcsTUFBcEMsQ0FBN0QsRUFBMEcsTUFBMUc7QUFDQXBHLE1BQUFBLEVBQUUsQ0FBQ2lILGFBQUgsQ0FBaUJqRCxJQUFJLENBQUNFLElBQUwsQ0FBVWtDLE1BQVYsRUFBa0Isc0JBQWxCLENBQWpCLEVBQTREWSxzQkFBc0IsQ0FBQzdHLE9BQUQsRUFBVWlHLE1BQVYsQ0FBbEYsRUFBcUcsTUFBckc7QUFDQXBHLE1BQUFBLEVBQUUsQ0FBQ2lILGFBQUgsQ0FBaUJqRCxJQUFJLENBQUNFLElBQUwsQ0FBVWtDLE1BQVYsRUFBa0IsZ0JBQWxCLENBQWpCLEVBQXNEVyxtQkFBbUIsQ0FBQzVHLE9BQUQsRUFBVWlHLE1BQVYsQ0FBekUsRUFBNEYsTUFBNUY7QUFDQSxVQUFJaEcsU0FBUyxHQUFHRixJQUFJLENBQUNFLFNBQXJCLENBWGtCLENBWWxCOztBQUNBLFVBQUlKLEVBQUUsQ0FBQ2MsVUFBSCxDQUFja0QsSUFBSSxDQUFDRSxJQUFMLENBQVUyQixPQUFPLENBQUNxQixHQUFSLEVBQVYsRUFBeUIsT0FBTTlHLFNBQVUsTUFBekMsQ0FBZCxDQUFKLEVBQW9FO0FBQ2xFLFlBQUkrRyxRQUFRLEdBQUduRCxJQUFJLENBQUNFLElBQUwsQ0FBVTJCLE9BQU8sQ0FBQ3FCLEdBQVIsRUFBVixFQUEwQixPQUFNOUcsU0FBVSxNQUExQyxDQUFmO0FBQ0EsWUFBSWdILE1BQU0sR0FBR3BELElBQUksQ0FBQ0UsSUFBTCxDQUFVa0MsTUFBVixFQUFrQixJQUFsQixDQUFiO0FBQ0FNLFFBQUFBLEdBQUcsQ0FBQ1csUUFBSixDQUFhRixRQUFiLEVBQXVCQyxNQUF2QjtBQUNBeEYsUUFBQUEsR0FBRyxDQUFDUCxHQUFELEVBQU0sa0JBQWtCOEYsUUFBUSxDQUFDRyxPQUFULENBQWlCekIsT0FBTyxDQUFDcUIsR0FBUixFQUFqQixFQUFnQyxFQUFoQyxDQUFsQixHQUF3RCxPQUF4RCxHQUFrRUUsTUFBTSxDQUFDRSxPQUFQLENBQWV6QixPQUFPLENBQUNxQixHQUFSLEVBQWYsRUFBOEIsRUFBOUIsQ0FBeEUsQ0FBSDtBQUNEOztBQUNELFVBQUlsSCxFQUFFLENBQUNjLFVBQUgsQ0FBY2tELElBQUksQ0FBQ0UsSUFBTCxDQUFVMkIsT0FBTyxDQUFDcUIsR0FBUixFQUFWLEVBQXlCLE9BQU05RyxTQUFVLFlBQXpDLENBQWQsQ0FBSixFQUEwRTtBQUN4RSxZQUFJK0csUUFBUSxHQUFHbkQsSUFBSSxDQUFDRSxJQUFMLENBQVUyQixPQUFPLENBQUNxQixHQUFSLEVBQVYsRUFBMEIsT0FBTTlHLFNBQVUsWUFBMUMsQ0FBZjtBQUNBLFlBQUlnSCxNQUFNLEdBQUdwRCxJQUFJLENBQUNFLElBQUwsQ0FBVWtDLE1BQVYsRUFBa0IsVUFBbEIsQ0FBYjtBQUNBTSxRQUFBQSxHQUFHLENBQUNXLFFBQUosQ0FBYUYsUUFBYixFQUF1QkMsTUFBdkI7QUFDQXhGLFFBQUFBLEdBQUcsQ0FBQ1AsR0FBRCxFQUFNLGFBQWE4RixRQUFRLENBQUNHLE9BQVQsQ0FBaUJ6QixPQUFPLENBQUNxQixHQUFSLEVBQWpCLEVBQWdDLEVBQWhDLENBQWIsR0FBbUQsT0FBbkQsR0FBNkRFLE1BQU0sQ0FBQ0UsT0FBUCxDQUFlekIsT0FBTyxDQUFDcUIsR0FBUixFQUFmLEVBQThCLEVBQTlCLENBQW5FLENBQUg7QUFDRDs7QUFDRCxVQUFJbEgsRUFBRSxDQUFDYyxVQUFILENBQWNrRCxJQUFJLENBQUNFLElBQUwsQ0FBVTJCLE9BQU8sQ0FBQ3FCLEdBQVIsRUFBVixFQUF5QixPQUFNOUcsU0FBVSxhQUF6QyxDQUFkLENBQUosRUFBMkU7QUFDekUsWUFBSStHLFFBQVEsR0FBR25ELElBQUksQ0FBQ0UsSUFBTCxDQUFVMkIsT0FBTyxDQUFDcUIsR0FBUixFQUFWLEVBQTBCLE9BQU05RyxTQUFVLGFBQTFDLENBQWY7QUFDQSxZQUFJZ0gsTUFBTSxHQUFHcEQsSUFBSSxDQUFDRSxJQUFMLENBQVVrQyxNQUFWLEVBQWtCLFdBQWxCLENBQWI7QUFDQU0sUUFBQUEsR0FBRyxDQUFDVyxRQUFKLENBQWFGLFFBQWIsRUFBdUJDLE1BQXZCO0FBQ0F4RixRQUFBQSxHQUFHLENBQUNQLEdBQUQsRUFBTSxhQUFhOEYsUUFBUSxDQUFDRyxPQUFULENBQWlCekIsT0FBTyxDQUFDcUIsR0FBUixFQUFqQixFQUFnQyxFQUFoQyxDQUFiLEdBQW1ELE9BQW5ELEdBQTZERSxNQUFNLENBQUNFLE9BQVAsQ0FBZXpCLE9BQU8sQ0FBQ3FCLEdBQVIsRUFBZixFQUE4QixFQUE5QixDQUFuRSxDQUFIO0FBQ0Q7O0FBQ0QsVUFBSWxILEVBQUUsQ0FBQ2MsVUFBSCxDQUFja0QsSUFBSSxDQUFDRSxJQUFMLENBQVUyQixPQUFPLENBQUNxQixHQUFSLEVBQVYsRUFBd0IsWUFBeEIsQ0FBZCxDQUFKLEVBQTBEO0FBQ3hELFlBQUlLLGFBQWEsR0FBR3ZELElBQUksQ0FBQ0UsSUFBTCxDQUFVMkIsT0FBTyxDQUFDcUIsR0FBUixFQUFWLEVBQXlCLFlBQXpCLENBQXBCO0FBQ0EsWUFBSU0sV0FBVyxHQUFHeEQsSUFBSSxDQUFDRSxJQUFMLENBQVVrQyxNQUFWLEVBQWtCLGNBQWxCLENBQWxCO0FBQ0FNLFFBQUFBLEdBQUcsQ0FBQ1csUUFBSixDQUFhRSxhQUFiLEVBQTRCQyxXQUE1QjtBQUNBNUYsUUFBQUEsR0FBRyxDQUFDUCxHQUFELEVBQU0sYUFBYWtHLGFBQWEsQ0FBQ0QsT0FBZCxDQUFzQnpCLE9BQU8sQ0FBQ3FCLEdBQVIsRUFBdEIsRUFBcUMsRUFBckMsQ0FBYixHQUF3RCxPQUF4RCxHQUFrRU0sV0FBVyxDQUFDRixPQUFaLENBQW9CekIsT0FBTyxDQUFDcUIsR0FBUixFQUFwQixFQUFtQyxFQUFuQyxDQUF4RSxDQUFIO0FBQ0Q7QUFDRjs7QUFDRGhILElBQUFBLElBQUksQ0FBQ3lHLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxRQUFJckMsRUFBRSxHQUFHLEVBQVQ7O0FBQ0EsUUFBSXBFLElBQUksQ0FBQ3VCLFVBQVQsRUFBcUI7QUFDbkJ2QixNQUFBQSxJQUFJLENBQUNxRCxJQUFMLEdBQVlyRCxJQUFJLENBQUNxRCxJQUFMLENBQVVrRSxNQUFWLENBQWlCLFVBQVNDLEtBQVQsRUFBZ0JDLEtBQWhCLEVBQXNCO0FBQUUsZUFBT3pILElBQUksQ0FBQ3FELElBQUwsQ0FBVXFFLE9BQVYsQ0FBa0JGLEtBQWxCLEtBQTRCQyxLQUFuQztBQUEwQyxPQUFuRixDQUFaO0FBQ0FyRCxNQUFBQSxFQUFFLEdBQUdwRSxJQUFJLENBQUNxRCxJQUFMLENBQVVXLElBQVYsQ0FBZSxtREFBZixDQUFMO0FBQ0QsS0FIRCxNQUlLO0FBQ0hJLE1BQUFBLEVBQUUsR0FBSSw2Q0FBTjtBQUNEOztBQUNELFFBQUlwRSxJQUFJLENBQUMySCxRQUFMLEtBQWtCLElBQWxCLElBQTBCdkQsRUFBRSxLQUFLcEUsSUFBSSxDQUFDMkgsUUFBMUMsRUFBb0Q7QUFDbEQzSCxNQUFBQSxJQUFJLENBQUMySCxRQUFMLEdBQWdCdkQsRUFBaEI7QUFDQSxZQUFNdUQsUUFBUSxHQUFHN0QsSUFBSSxDQUFDRSxJQUFMLENBQVVrQyxNQUFWLEVBQWtCLGFBQWxCLENBQWpCO0FBQ0FwRyxNQUFBQSxFQUFFLENBQUNpSCxhQUFILENBQWlCWSxRQUFqQixFQUEyQnZELEVBQTNCLEVBQStCLE1BQS9CO0FBQ0FwRSxNQUFBQSxJQUFJLENBQUNnRixPQUFMLEdBQWUsSUFBZjtBQUNBLFVBQUk0QyxTQUFTLEdBQUcxQixNQUFNLENBQUNrQixPQUFQLENBQWV6QixPQUFPLENBQUNxQixHQUFSLEVBQWYsRUFBOEIsRUFBOUIsQ0FBaEI7O0FBQ0EsVUFBSVksU0FBUyxDQUFDQyxJQUFWLE1BQW9CLEVBQXhCLEVBQTRCO0FBQUNELFFBQUFBLFNBQVMsR0FBRyxJQUFaO0FBQWlCOztBQUM5Q2xHLE1BQUFBLEdBQUcsQ0FBQ1AsR0FBRCxFQUFNLDZCQUE2QnlHLFNBQW5DLENBQUg7QUFDRCxLQVJELE1BU0s7QUFDSDVILE1BQUFBLElBQUksQ0FBQ2dGLE9BQUwsR0FBZSxLQUFmO0FBQ0F0RCxNQUFBQSxHQUFHLENBQUNQLEdBQUQsRUFBTSx3QkFBTixDQUFIO0FBQ0Q7QUFDRixHQXpFRCxDQTBFQSxPQUFNYSxDQUFOLEVBQVM7QUFDUGpDLElBQUFBLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0JzQixJQUF4QixDQUE2QnBCLE9BQU8sQ0FBQ08sT0FBckMsRUFBNkN3QixDQUE3Qzs7QUFDQUksSUFBQUEsV0FBVyxDQUFDbUQsTUFBWixDQUFtQmxGLElBQW5CLENBQXdCLHVCQUF1QjJCLENBQS9DO0FBQ0Q7QUFDRixDLENBRUQ7OztBQUNPLFNBQVNvRCxlQUFULENBQXlCakUsR0FBekIsRUFBOEJpQixXQUE5QixFQUEyQ3VDLFVBQTNDLEVBQXVETSxLQUF2RCxFQUE4RGpGLElBQTlELEVBQW9FQyxPQUFwRSxFQUE2RTtBQUNwRjtBQUNJLE1BQUlPLE9BQU8sR0FBR1AsT0FBTyxDQUFDTyxPQUF0Qjs7QUFDQSxRQUFNVixFQUFFLEdBQUdDLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBc0IsRUFBQUEsSUFBSSxDQUFDYixPQUFELEVBQVMsMEJBQVQsQ0FBSjtBQUNBLE1BQUlzSCxNQUFKOztBQUFZLE1BQUk7QUFBRUEsSUFBQUEsTUFBTSxHQUFHL0gsT0FBTyxDQUFDLGFBQUQsQ0FBaEI7QUFBaUMsR0FBdkMsQ0FBd0MsT0FBT2lDLENBQVAsRUFBVTtBQUFFOEYsSUFBQUEsTUFBTSxHQUFHLFFBQVQ7QUFBbUI7O0FBQ25GLE1BQUloSSxFQUFFLENBQUNjLFVBQUgsQ0FBY2tILE1BQWQsQ0FBSixFQUEyQjtBQUN6QnpHLElBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFTLHNCQUFULENBQUo7QUFDRCxHQUZELE1BR0s7QUFDSGEsSUFBQUEsSUFBSSxDQUFDYixPQUFELEVBQVMsOEJBQVQsQ0FBSjtBQUNEOztBQUNELFNBQU8sSUFBSXVILE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDdEMsVUFBTUMsV0FBVyxHQUFHLE1BQU07QUFDeEI3RyxNQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBUyxhQUFULENBQUo7QUFDQXdILE1BQUFBLE9BQU87QUFDUixLQUhEOztBQUlBLFFBQUlHLElBQUksR0FBRztBQUFFbkIsTUFBQUEsR0FBRyxFQUFFckMsVUFBUDtBQUFtQnlELE1BQUFBLE1BQU0sRUFBRSxJQUEzQjtBQUFpQ0MsTUFBQUEsS0FBSyxFQUFFLE1BQXhDO0FBQWdEQyxNQUFBQSxRQUFRLEVBQUU7QUFBMUQsS0FBWDs7QUFDQUMsSUFBQUEsYUFBYSxDQUFDcEgsR0FBRCxFQUFNMkcsTUFBTixFQUFjN0MsS0FBZCxFQUFxQmtELElBQXJCLEVBQTJCL0YsV0FBM0IsRUFBd0NwQyxJQUF4QyxFQUE4Q0MsT0FBOUMsQ0FBYixDQUFvRXVJLElBQXBFLENBQ0UsWUFBVztBQUFFTixNQUFBQSxXQUFXO0FBQUksS0FEOUIsRUFFRSxVQUFTTyxNQUFULEVBQWlCO0FBQUVSLE1BQUFBLE1BQU0sQ0FBQ1EsTUFBRCxDQUFOO0FBQWdCLEtBRnJDO0FBSUQsR0FWTSxDQUFQLENBWmdGLENBdUJsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNELEMsQ0FFRDs7O1NBQ3NCRixhOztFQTJFdEI7Ozs7OzswQkEzRU8sa0JBQThCcEgsR0FBOUIsRUFBbUM0RCxPQUFuQyxFQUE0Q0UsS0FBNUMsRUFBbURrRCxJQUFuRCxFQUF5RC9GLFdBQXpELEVBQXNFcEMsSUFBdEUsRUFBNEVDLE9BQTVFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDUDtBQUNRTyxVQUFBQSxPQUZELEdBRVdQLE9BQU8sQ0FBQ08sT0FGbkI7QUFHQ04sVUFBQUEsU0FIRCxHQUdhRCxPQUFPLENBQUNDLFNBSHJCLEVBSUg7O0FBQ013SSxVQUFBQSxlQUxILEdBS3FCLENBQUMsZUFBRCxFQUFrQixlQUFsQixFQUFtQyxjQUFuQyxFQUFtRCxrQkFBbkQsRUFBdUUsd0JBQXZFLEVBQWlHLDhCQUFqRyxFQUFpSSxPQUFqSSxFQUEwSSxPQUExSSxFQUFtSixlQUFuSixFQUFvSyxxQkFBcEssRUFBMkwsZUFBM0wsRUFBNE0sdUJBQTVNLENBTHJCO0FBTUNDLFVBQUFBLFVBTkQsR0FNY0QsZUFOZDtBQU9DakQsVUFBQUEsS0FQRCxHQU9TMUYsT0FBTyxDQUFDLE9BQUQsQ0FQaEI7QUFRRzZJLFVBQUFBLFVBUkgsR0FRZ0I3SSxPQUFPLENBQUMsYUFBRCxDQVJ2QjtBQVNIc0IsVUFBQUEsSUFBSSxDQUFDYixPQUFELEVBQVUsd0JBQVYsQ0FBSjtBQVRHO0FBQUEsaUJBVUcsSUFBSXVILE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDckM1RyxZQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBVSxhQUFZdUUsT0FBUSxFQUE5QixDQUFKO0FBQ0ExRCxZQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBVyxXQUFVeUUsS0FBTSxFQUEzQixDQUFKO0FBQ0E1RCxZQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBVyxVQUFTSyxJQUFJLENBQUNnSSxTQUFMLENBQWVWLElBQWYsQ0FBcUIsRUFBekMsQ0FBSjtBQUNBLGdCQUFJVyxLQUFLLEdBQUdGLFVBQVUsQ0FBQzdELE9BQUQsRUFBVUUsS0FBVixFQUFpQmtELElBQWpCLENBQXRCO0FBQ0FXLFlBQUFBLEtBQUssQ0FBQ0MsRUFBTixDQUFTLE9BQVQsRUFBa0IsQ0FBQ0MsSUFBRCxFQUFPQyxNQUFQLEtBQWtCO0FBQ2xDNUgsY0FBQUEsSUFBSSxDQUFDYixPQUFELEVBQVcsWUFBRCxHQUFld0ksSUFBekIsQ0FBSjs7QUFDQSxrQkFBR0EsSUFBSSxLQUFLLENBQVosRUFBZTtBQUFFaEIsZ0JBQUFBLE9BQU8sQ0FBQyxDQUFELENBQVA7QUFBWSxlQUE3QixNQUNLO0FBQUU1RixnQkFBQUEsV0FBVyxDQUFDbUQsTUFBWixDQUFtQmxGLElBQW5CLENBQXlCLElBQUk2SSxLQUFKLENBQVVGLElBQVYsQ0FBekI7QUFBNENoQixnQkFBQUEsT0FBTyxDQUFDLENBQUQsQ0FBUDtBQUFZO0FBQ2hFLGFBSkQ7QUFLQWMsWUFBQUEsS0FBSyxDQUFDQyxFQUFOLENBQVMsT0FBVCxFQUFtQkksS0FBRCxJQUFXO0FBQzNCOUgsY0FBQUEsSUFBSSxDQUFDYixPQUFELEVBQVcsVUFBWCxDQUFKO0FBQ0E0QixjQUFBQSxXQUFXLENBQUNtRCxNQUFaLENBQW1CbEYsSUFBbkIsQ0FBd0I4SSxLQUF4QjtBQUNBbkIsY0FBQUEsT0FBTyxDQUFDLENBQUQsQ0FBUDtBQUNELGFBSkQ7QUFLQWMsWUFBQUEsS0FBSyxDQUFDTSxNQUFOLENBQWFMLEVBQWIsQ0FBZ0IsTUFBaEIsRUFBeUJsRixJQUFELElBQVU7QUFDaEMsa0JBQUl3RixHQUFHLEdBQUd4RixJQUFJLENBQUM1QixRQUFMLEdBQWdCbUYsT0FBaEIsQ0FBd0IsV0FBeEIsRUFBcUMsR0FBckMsRUFBMENTLElBQTFDLEVBQVY7QUFDQXhHLGNBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFXLEdBQUU2SSxHQUFJLEVBQWpCLENBQUo7O0FBQ0Esa0JBQUl4RixJQUFJLElBQUlBLElBQUksQ0FBQzVCLFFBQUwsR0FBZ0JlLEtBQWhCLENBQXNCLG1DQUF0QixDQUFaLEVBQXdFO0FBRXRFLHNCQUFNbEQsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxvQkFBSXVKLFFBQVEsR0FBRzNELE9BQU8sQ0FBQ3FCLEdBQVIsS0FBZ0JoSCxJQUFJLENBQUN1SixTQUFwQzs7QUFDQSxvQkFBSTtBQUNGLHNCQUFJQyxDQUFDLEdBQUcsSUFBSUMsSUFBSixHQUFXQyxjQUFYLEVBQVI7QUFDQSxzQkFBSTdGLElBQUksR0FBRy9ELEVBQUUsQ0FBQ2lCLFlBQUgsQ0FBZ0J1SSxRQUFoQixDQUFYO0FBQ0F4SixrQkFBQUEsRUFBRSxDQUFDaUgsYUFBSCxDQUFpQnVDLFFBQWpCLEVBQTJCLE9BQU9FLENBQWxDLEVBQXFDLE1BQXJDO0FBQ0FuSSxrQkFBQUEsSUFBSSxDQUFDRixHQUFELEVBQU8sWUFBV21JLFFBQVMsRUFBM0IsQ0FBSjtBQUNELGlCQUxELENBTUEsT0FBTXRILENBQU4sRUFBUztBQUNQWCxrQkFBQUEsSUFBSSxDQUFDRixHQUFELEVBQU8sZ0JBQWVtSSxRQUFTLEVBQS9CLENBQUo7QUFDRDs7QUFFRHRCLGdCQUFBQSxPQUFPLENBQUMsQ0FBRCxDQUFQO0FBQ0QsZUFmRCxNQWdCSztBQUNILG9CQUFJVyxVQUFVLENBQUNnQixJQUFYLENBQWdCLFVBQVNDLENBQVQsRUFBWTtBQUFFLHlCQUFPL0YsSUFBSSxDQUFDNkQsT0FBTCxDQUFha0MsQ0FBYixLQUFtQixDQUExQjtBQUE4QixpQkFBNUQsQ0FBSixFQUFtRTtBQUNqRVAsa0JBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDakMsT0FBSixDQUFZLE9BQVosRUFBcUIsRUFBckIsQ0FBTjtBQUNBaUMsa0JBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDakMsT0FBSixDQUFZLE9BQVosRUFBcUIsRUFBckIsQ0FBTjtBQUNBaUMsa0JBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDakMsT0FBSixDQUFZekIsT0FBTyxDQUFDcUIsR0FBUixFQUFaLEVBQTJCLEVBQTNCLEVBQStCYSxJQUEvQixFQUFOOztBQUNBLHNCQUFJd0IsR0FBRyxDQUFDakcsUUFBSixDQUFhLE9BQWIsQ0FBSixFQUEyQjtBQUN6QmhCLG9CQUFBQSxXQUFXLENBQUNtRCxNQUFaLENBQW1CbEYsSUFBbkIsQ0FBd0JjLEdBQUcsR0FBR2tJLEdBQUcsQ0FBQ2pDLE9BQUosQ0FBWSxhQUFaLEVBQTJCLEVBQTNCLENBQTlCO0FBQ0FpQyxvQkFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNqQyxPQUFKLENBQVksT0FBWixFQUFzQixHQUFFM0IsS0FBSyxDQUFDQyxHQUFOLENBQVUsT0FBVixDQUFtQixFQUEzQyxDQUFOO0FBQ0Q7O0FBQ0RoRSxrQkFBQUEsR0FBRyxDQUFDUCxHQUFELEVBQU1rSSxHQUFOLENBQUg7QUFDRDtBQUNGO0FBQ0YsYUEvQkQ7QUFnQ0FQLFlBQUFBLEtBQUssQ0FBQ2UsTUFBTixDQUFhZCxFQUFiLENBQWdCLE1BQWhCLEVBQXlCbEYsSUFBRCxJQUFVO0FBQ2hDeEMsY0FBQUEsSUFBSSxDQUFDcEIsT0FBRCxFQUFXLGtCQUFELEdBQXFCNEQsSUFBL0IsQ0FBSjtBQUNBLGtCQUFJd0YsR0FBRyxHQUFHeEYsSUFBSSxDQUFDNUIsUUFBTCxHQUFnQm1GLE9BQWhCLENBQXdCLFdBQXhCLEVBQXFDLEdBQXJDLEVBQTBDUyxJQUExQyxFQUFWO0FBQ0Esa0JBQUlpQyxXQUFXLEdBQUcseUJBQWxCO0FBQ0Esa0JBQUkxRyxRQUFRLEdBQUdpRyxHQUFHLENBQUNqRyxRQUFKLENBQWEwRyxXQUFiLENBQWY7O0FBQ0Esa0JBQUksQ0FBQzFHLFFBQUwsRUFBZTtBQUNiRyxnQkFBQUEsT0FBTyxDQUFDN0IsR0FBUixDQUFhLEdBQUVQLEdBQUksSUFBR3NFLEtBQUssQ0FBQ0MsR0FBTixDQUFVLE9BQVYsQ0FBbUIsSUFBRzJELEdBQUksRUFBaEQ7QUFDRDtBQUNGLGFBUkQ7QUFTRCxXQXhESyxDQVZIOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOzs7O0FBNEVQLFNBQVMvRyxTQUFULENBQW1CeUgsVUFBbkIsRUFBK0J0RixRQUEvQixFQUF5QztBQUN2QyxNQUFJdUYsWUFBWSxHQUFHakssT0FBTyxDQUFDLGVBQUQsQ0FBMUIsQ0FEdUMsQ0FFdkM7OztBQUNBLE1BQUlrSyxPQUFPLEdBQUcsS0FBZDtBQUNBLE1BQUl0RSxPQUFPLEdBQUdxRSxZQUFZLENBQUNFLElBQWIsQ0FBa0JILFVBQWxCLENBQWQsQ0FKdUMsQ0FLdkM7O0FBQ0FwRSxFQUFBQSxPQUFPLENBQUNvRCxFQUFSLENBQVcsT0FBWCxFQUFvQixVQUFVeEcsR0FBVixFQUFlO0FBQ2pDLFFBQUkwSCxPQUFKLEVBQWE7QUFDYkEsSUFBQUEsT0FBTyxHQUFHLElBQVY7QUFDQXhGLElBQUFBLFFBQVEsQ0FBQ2xDLEdBQUQsQ0FBUjtBQUNELEdBSkQsRUFOdUMsQ0FXdkM7O0FBQ0FvRCxFQUFBQSxPQUFPLENBQUNvRCxFQUFSLENBQVcsTUFBWCxFQUFtQixVQUFVQyxJQUFWLEVBQWdCO0FBQ2pDLFFBQUlpQixPQUFKLEVBQWE7QUFDYkEsSUFBQUEsT0FBTyxHQUFHLElBQVY7QUFDQSxRQUFJMUgsR0FBRyxHQUFHeUcsSUFBSSxLQUFLLENBQVQsR0FBYSxJQUFiLEdBQW9CLElBQUlFLEtBQUosQ0FBVSxlQUFlRixJQUF6QixDQUE5QjtBQUNBdkUsSUFBQUEsUUFBUSxDQUFDbEMsR0FBRCxDQUFSO0FBQ0QsR0FMRDtBQU1ELEMsQ0FFRDs7O0FBQ08sU0FBUzRILFFBQVQsQ0FBa0JkLEdBQWxCLEVBQXVCO0FBQzVCLFNBQU9BLEdBQUcsQ0FBQ2xHLFdBQUosR0FBa0JpRSxPQUFsQixDQUEwQixJQUExQixFQUFnQyxHQUFoQyxDQUFQO0FBQ0QsQyxDQUVEOzs7QUFDTyxTQUFTaEcsT0FBVCxHQUFtQjtBQUN4QixNQUFJcUUsS0FBSyxHQUFHMUYsT0FBTyxDQUFDLE9BQUQsQ0FBbkI7O0FBQ0EsTUFBSXFLLE1BQU0sR0FBSSxFQUFkOztBQUNBLFFBQU1DLFFBQVEsR0FBR3RLLE9BQU8sQ0FBQyxJQUFELENBQVAsQ0FBY3NLLFFBQWQsRUFBakI7O0FBQ0EsTUFBSUEsUUFBUSxJQUFJLFFBQWhCLEVBQTBCO0FBQUVELElBQUFBLE1BQU0sR0FBSSxVQUFWO0FBQXFCLEdBQWpELE1BQ0s7QUFBRUEsSUFBQUEsTUFBTSxHQUFJLFVBQVY7QUFBcUI7O0FBQzVCLFNBQVEsR0FBRTNFLEtBQUssQ0FBQzZFLEtBQU4sQ0FBWUYsTUFBWixDQUFvQixHQUE5QjtBQUNELEMsQ0FFRDs7O0FBQ08sU0FBU3pJLFlBQVQsQ0FBc0JULFVBQXRCLEVBQWtDcUosYUFBbEMsRUFBaUQ7QUFDeEQsTUFBSTtBQUNGLFVBQU16RyxJQUFJLEdBQUcvRCxPQUFPLENBQUMsTUFBRCxDQUFwQjs7QUFDQSxVQUFNRCxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBLFFBQUk2SixDQUFDLEdBQUcsRUFBUjtBQUNBLFFBQUlZLGFBQWEsR0FBRyxLQUFwQjtBQUVBWixJQUFBQSxDQUFDLENBQUNhLGFBQUYsR0FBa0IsS0FBbEI7QUFDQWIsSUFBQUEsQ0FBQyxDQUFDYyxVQUFGLEdBQWUsS0FBZjtBQUNBZCxJQUFBQSxDQUFDLENBQUNlLE9BQUYsR0FBWSxLQUFaO0FBQ0FmLElBQUFBLENBQUMsQ0FBQ2dCLFVBQUYsR0FBZSxLQUFmO0FBQ0FoQixJQUFBQSxDQUFDLENBQUNpQixjQUFGLEdBQW1CLEtBQW5CO0FBRUEsUUFBSUMsVUFBVSxHQUFHaEgsSUFBSSxDQUFDa0UsT0FBTCxDQUFhckMsT0FBTyxDQUFDcUIsR0FBUixFQUFiLEVBQTJCLHNCQUEzQixFQUFtRDlGLFVBQW5ELENBQWpCO0FBQ0EsUUFBSTZKLFNBQVMsR0FBSWpMLEVBQUUsQ0FBQ2MsVUFBSCxDQUFja0ssVUFBVSxHQUFDLGVBQXpCLEtBQTZDakssSUFBSSxDQUFDQyxLQUFMLENBQVdoQixFQUFFLENBQUNpQixZQUFILENBQWdCK0osVUFBVSxHQUFDLGVBQTNCLEVBQTRDLE9BQTVDLENBQVgsQ0FBN0MsSUFBaUgsRUFBbEk7QUFDQWxCLElBQUFBLENBQUMsQ0FBQ2EsYUFBRixHQUFrQk0sU0FBUyxDQUFDQyxPQUE1QjtBQUNBcEIsSUFBQUEsQ0FBQyxDQUFDcUIsU0FBRixHQUFjRixTQUFTLENBQUNFLFNBQXhCOztBQUNBLFFBQUlyQixDQUFDLENBQUNxQixTQUFGLElBQWU5SyxTQUFuQixFQUE4QjtBQUM1QnlKLE1BQUFBLENBQUMsQ0FBQ2UsT0FBRixHQUFhLFlBQWI7QUFDRCxLQUZELE1BR0s7QUFDSCxVQUFJLENBQUMsQ0FBRCxJQUFNZixDQUFDLENBQUNxQixTQUFGLENBQVl2RCxPQUFaLENBQW9CLFdBQXBCLENBQVYsRUFBNEM7QUFDMUNrQyxRQUFBQSxDQUFDLENBQUNlLE9BQUYsR0FBYSxZQUFiO0FBQ0QsT0FGRCxNQUdLO0FBQ0hmLFFBQUFBLENBQUMsQ0FBQ2UsT0FBRixHQUFhLFdBQWI7QUFDRDtBQUNGOztBQUNELFFBQUlPLFdBQVcsR0FBR3BILElBQUksQ0FBQ2tFLE9BQUwsQ0FBYXJDLE9BQU8sQ0FBQ3FCLEdBQVIsRUFBYixFQUEyQixzQkFBM0IsQ0FBbEI7QUFDQSxRQUFJbUUsVUFBVSxHQUFJckwsRUFBRSxDQUFDYyxVQUFILENBQWNzSyxXQUFXLEdBQUMsZUFBMUIsS0FBOENySyxJQUFJLENBQUNDLEtBQUwsQ0FBV2hCLEVBQUUsQ0FBQ2lCLFlBQUgsQ0FBZ0JtSyxXQUFXLEdBQUMsZUFBNUIsRUFBNkMsT0FBN0MsQ0FBWCxDQUE5QyxJQUFtSCxFQUFySTtBQUNBdEIsSUFBQUEsQ0FBQyxDQUFDaUIsY0FBRixHQUFtQk0sVUFBVSxDQUFDSCxPQUE5QjtBQUNBLFFBQUkvRyxPQUFPLEdBQUdILElBQUksQ0FBQ2tFLE9BQUwsQ0FBYXJDLE9BQU8sQ0FBQ3FCLEdBQVIsRUFBYixFQUEyQiwwQkFBM0IsQ0FBZDtBQUNBLFFBQUlvRSxNQUFNLEdBQUl0TCxFQUFFLENBQUNjLFVBQUgsQ0FBY3FELE9BQU8sR0FBQyxlQUF0QixLQUEwQ3BELElBQUksQ0FBQ0MsS0FBTCxDQUFXaEIsRUFBRSxDQUFDaUIsWUFBSCxDQUFnQmtELE9BQU8sR0FBQyxlQUF4QixFQUF5QyxPQUF6QyxDQUFYLENBQTFDLElBQTJHLEVBQXpIO0FBQ0EyRixJQUFBQSxDQUFDLENBQUNjLFVBQUYsR0FBZVUsTUFBTSxDQUFDdEQsTUFBUCxDQUFja0QsT0FBN0I7QUFDQSxRQUFJSyxPQUFPLEdBQUd2SCxJQUFJLENBQUNrRSxPQUFMLENBQWFyQyxPQUFPLENBQUNxQixHQUFSLEVBQWIsRUFBNEIsMEJBQTVCLENBQWQ7QUFDQSxRQUFJc0UsTUFBTSxHQUFJeEwsRUFBRSxDQUFDYyxVQUFILENBQWN5SyxPQUFPLEdBQUMsZUFBdEIsS0FBMEN4SyxJQUFJLENBQUNDLEtBQUwsQ0FBV2hCLEVBQUUsQ0FBQ2lCLFlBQUgsQ0FBZ0JzSyxPQUFPLEdBQUMsZUFBeEIsRUFBeUMsT0FBekMsQ0FBWCxDQUExQyxJQUEyRyxFQUF6SDtBQUNBekIsSUFBQUEsQ0FBQyxDQUFDZ0IsVUFBRixHQUFlVSxNQUFNLENBQUNDLFlBQXRCOztBQUNBLFFBQUkzQixDQUFDLENBQUNnQixVQUFGLElBQWdCekssU0FBcEIsRUFBK0I7QUFDN0IsVUFBSWtMLE9BQU8sR0FBR3ZILElBQUksQ0FBQ2tFLE9BQUwsQ0FBYXJDLE9BQU8sQ0FBQ3FCLEdBQVIsRUFBYixFQUE0Qix3QkFBdUI5RixVQUFXLDJCQUE5RCxDQUFkO0FBQ0EsVUFBSW9LLE1BQU0sR0FBSXhMLEVBQUUsQ0FBQ2MsVUFBSCxDQUFjeUssT0FBTyxHQUFDLGVBQXRCLEtBQTBDeEssSUFBSSxDQUFDQyxLQUFMLENBQVdoQixFQUFFLENBQUNpQixZQUFILENBQWdCc0ssT0FBTyxHQUFDLGVBQXhCLEVBQXlDLE9BQXpDLENBQVgsQ0FBMUMsSUFBMkcsRUFBekg7QUFDQXpCLE1BQUFBLENBQUMsQ0FBQ2dCLFVBQUYsR0FBZVUsTUFBTSxDQUFDQyxZQUF0QjtBQUNEOztBQUVBLFFBQUloQixhQUFhLElBQUlwSyxTQUFqQixJQUE4Qm9LLGFBQWEsSUFBSSxPQUFuRCxFQUE0RDtBQUMzRCxVQUFJaUIsYUFBYSxHQUFHLEVBQXBCOztBQUNBLFVBQUlqQixhQUFhLElBQUksT0FBckIsRUFBOEI7QUFDNUJpQixRQUFBQSxhQUFhLEdBQUcxSCxJQUFJLENBQUNrRSxPQUFMLENBQWFyQyxPQUFPLENBQUNxQixHQUFSLEVBQWIsRUFBMkIsb0JBQTNCLENBQWhCO0FBQ0Q7O0FBQ0QsVUFBSXVELGFBQWEsSUFBSSxTQUFyQixFQUFnQztBQUM5QmlCLFFBQUFBLGFBQWEsR0FBRzFILElBQUksQ0FBQ2tFLE9BQUwsQ0FBYXJDLE9BQU8sQ0FBQ3FCLEdBQVIsRUFBYixFQUEyQiw0QkFBM0IsQ0FBaEI7QUFDRDs7QUFDRCxVQUFJeUUsWUFBWSxHQUFJM0wsRUFBRSxDQUFDYyxVQUFILENBQWM0SyxhQUFhLEdBQUMsZUFBNUIsS0FBZ0QzSyxJQUFJLENBQUNDLEtBQUwsQ0FBV2hCLEVBQUUsQ0FBQ2lCLFlBQUgsQ0FBZ0J5SyxhQUFhLEdBQUMsZUFBOUIsRUFBK0MsT0FBL0MsQ0FBWCxDQUFoRCxJQUF1SCxFQUEzSTtBQUNBNUIsTUFBQUEsQ0FBQyxDQUFDOEIsZ0JBQUYsR0FBcUJELFlBQVksQ0FBQ1QsT0FBbEM7O0FBQ0EsVUFBSXBCLENBQUMsQ0FBQzhCLGdCQUFGLElBQXNCdkwsU0FBMUIsRUFBcUM7QUFDbkNxSyxRQUFBQSxhQUFhLEdBQUcsT0FBT0QsYUFBdkI7QUFDRCxPQUZELE1BR0s7QUFDSEMsUUFBQUEsYUFBYSxHQUFHLE9BQU9ELGFBQVAsR0FBdUIsSUFBdkIsR0FBOEJYLENBQUMsQ0FBQzhCLGdCQUFoRDtBQUNEO0FBQ0Y7O0FBQ0QsV0FBTyx5QkFBeUI5QixDQUFDLENBQUNhLGFBQTNCLEdBQTJDLFlBQTNDLEdBQTBEYixDQUFDLENBQUNjLFVBQTVELEdBQXlFLEdBQXpFLEdBQStFZCxDQUFDLENBQUNlLE9BQWpGLEdBQTJGLHdCQUEzRixHQUFzSGYsQ0FBQyxDQUFDZ0IsVUFBeEgsR0FBcUksYUFBckksR0FBcUpoQixDQUFDLENBQUNpQixjQUF2SixHQUF3S0wsYUFBL0s7QUFFRCxHQTdERCxDQThEQSxPQUFPeEksQ0FBUCxFQUFVO0FBQ1IsV0FBTyx5QkFBeUI0SCxDQUFDLENBQUNhLGFBQTNCLEdBQTJDLFlBQTNDLEdBQTBEYixDQUFDLENBQUNjLFVBQTVELEdBQXlFLEdBQXpFLEdBQStFZCxDQUFDLENBQUNlLE9BQWpGLEdBQTJGLHdCQUEzRixHQUFzSGYsQ0FBQyxDQUFDZ0IsVUFBeEgsR0FBcUksYUFBckksR0FBcUpoQixDQUFDLENBQUNpQixjQUF2SixHQUF3S0wsYUFBL0s7QUFDRDtBQUVBLEMsQ0FFRDs7O0FBQ08sU0FBUzlJLEdBQVQsQ0FBYVAsR0FBYixFQUFpQndLLE9BQWpCLEVBQTBCO0FBQy9CLE1BQUlDLENBQUMsR0FBR3pLLEdBQUcsR0FBR3dLLE9BQWQ7O0FBQ0E1TCxFQUFBQSxPQUFPLENBQUMsVUFBRCxDQUFQLENBQW9COEwsUUFBcEIsQ0FBNkJsRyxPQUFPLENBQUN5RCxNQUFyQyxFQUE2QyxDQUE3Qzs7QUFDQSxNQUFJO0FBQUN6RCxJQUFBQSxPQUFPLENBQUN5RCxNQUFSLENBQWUwQyxTQUFmO0FBQTJCLEdBQWhDLENBQWdDLE9BQU05SixDQUFOLEVBQVMsQ0FBRTs7QUFDM0MyRCxFQUFBQSxPQUFPLENBQUN5RCxNQUFSLENBQWUyQyxLQUFmLENBQXFCSCxDQUFyQjtBQUF3QmpHLEVBQUFBLE9BQU8sQ0FBQ3lELE1BQVIsQ0FBZTJDLEtBQWYsQ0FBcUIsSUFBckI7QUFDekIsQyxDQUVEOzs7QUFDTyxTQUFTQyxJQUFULENBQWM3SyxHQUFkLEVBQWtCd0ssT0FBbEIsRUFBMkI7QUFDaEMsTUFBSU0sQ0FBQyxHQUFHLEtBQVI7QUFDQSxNQUFJTCxDQUFDLEdBQUd6SyxHQUFHLEdBQUd3SyxPQUFkOztBQUNBLE1BQUlNLENBQUMsSUFBSSxJQUFULEVBQWU7QUFDYmxNLElBQUFBLE9BQU8sQ0FBQyxVQUFELENBQVAsQ0FBb0I4TCxRQUFwQixDQUE2QmxHLE9BQU8sQ0FBQ3lELE1BQXJDLEVBQTZDLENBQTdDOztBQUNBLFFBQUk7QUFDRnpELE1BQUFBLE9BQU8sQ0FBQ3lELE1BQVIsQ0FBZTBDLFNBQWY7QUFDRCxLQUZELENBR0EsT0FBTTlKLENBQU4sRUFBUyxDQUFFOztBQUNYMkQsSUFBQUEsT0FBTyxDQUFDeUQsTUFBUixDQUFlMkMsS0FBZixDQUFxQkgsQ0FBckI7QUFDQWpHLElBQUFBLE9BQU8sQ0FBQ3lELE1BQVIsQ0FBZTJDLEtBQWYsQ0FBcUIsSUFBckI7QUFDRDtBQUNGLEMsQ0FFRDs7O0FBQ08sU0FBUzFLLElBQVQsQ0FBY2IsT0FBZCxFQUF1Qm9MLENBQXZCLEVBQTBCO0FBQy9CLE1BQUlwTCxPQUFPLElBQUksS0FBZixFQUFzQjtBQUNwQlQsSUFBQUEsT0FBTyxDQUFDLFVBQUQsQ0FBUCxDQUFvQjhMLFFBQXBCLENBQTZCbEcsT0FBTyxDQUFDeUQsTUFBckMsRUFBNkMsQ0FBN0M7O0FBQ0EsUUFBSTtBQUNGekQsTUFBQUEsT0FBTyxDQUFDeUQsTUFBUixDQUFlMEMsU0FBZjtBQUNELEtBRkQsQ0FHQSxPQUFNOUosQ0FBTixFQUFTLENBQUU7O0FBQ1gyRCxJQUFBQSxPQUFPLENBQUN5RCxNQUFSLENBQWUyQyxLQUFmLENBQXNCLGFBQVlILENBQUUsRUFBcEM7QUFDQWpHLElBQUFBLE9BQU8sQ0FBQ3lELE1BQVIsQ0FBZTJDLEtBQWYsQ0FBcUIsSUFBckI7QUFDRDtBQUNGOztBQUVELFNBQVNyTCxtQkFBVCxHQUErQjtBQUM3QixTQUFPO0FBQ0wsWUFBUSxRQURIO0FBRUwsa0JBQWM7QUFDWixtQkFBYTtBQUNYLGdCQUFRLENBQUMsUUFBRDtBQURHLE9BREQ7QUFJWixpQkFBVztBQUNULGdCQUFRLENBQUMsUUFBRDtBQURDLE9BSkM7QUFPWixlQUFTO0FBQ1AsZ0JBQVEsQ0FBQyxRQUFEO0FBREQsT0FQRztBQVVaLGNBQVE7QUFDTix3QkFBZ0IsMERBRFY7QUFFTixnQkFBUSxDQUFDLFFBQUQ7QUFGRixPQVZJO0FBY1osZ0JBQVU7QUFDUixnQkFBUSxDQUFDLFFBQUQ7QUFEQSxPQWRFO0FBaUJaLGNBQVE7QUFDTixnQkFBUSxDQUFDLFNBQUQ7QUFERixPQWpCSTtBQW9CWixrQkFBWTtBQUNWLGdCQUFRLENBQUMsUUFBRCxFQUFXLE9BQVg7QUFERSxPQXBCQTtBQXVCWixpQkFBVztBQUNULGdCQUFRLENBQUMsUUFBRDtBQURDLE9BdkJDO0FBMEJaLHFCQUFlO0FBQ2Isd0JBQWdCLHNEQURIO0FBRWIsZ0JBQVEsQ0FBQyxRQUFEO0FBRkssT0ExQkg7QUE4QlosbUJBQWE7QUFDWCx3QkFBZ0IsMERBREw7QUFFWCxnQkFBUSxDQUFDLFFBQUQ7QUFGRyxPQTlCRDtBQWtDWixpQkFBVztBQUNULHdCQUFnQiwwREFEUDtBQUVULGdCQUFRLENBQUMsUUFBRDtBQUZDLE9BbENDO0FBc0NaLGVBQVM7QUFDUCx3QkFBZ0IsMERBRFQ7QUFFUCxnQkFBUSxDQUFDLFFBQUQ7QUFGRCxPQXRDRztBQTBDWixpQkFBVztBQUNULHdCQUFnQiwwREFEUDtBQUVULGdCQUFRLENBQUMsUUFBRDtBQUZDLE9BMUNDO0FBOENaLGdCQUFVO0FBQ1Isd0JBQWdCLDBEQURSO0FBRVIsZ0JBQVEsQ0FBQyxRQUFEO0FBRkEsT0E5Q0U7QUFrRFosc0JBQWdCO0FBQ2Qsd0JBQWdCLDBEQURGO0FBRWQsZ0JBQVEsQ0FBQyxRQUFEO0FBRk07QUFsREosS0FGVDtBQXlETCw0QkFBd0I7QUF6RG5CLEdBQVA7QUEyREQ7O0FBR0QsU0FBU00sa0JBQVQsR0FBOEI7QUFDNUIsU0FBTztBQUNMZCxJQUFBQSxTQUFTLEVBQUUsT0FETjtBQUVMa0csSUFBQUEsT0FBTyxFQUFFLFFBRko7QUFHTEMsSUFBQUEsS0FBSyxFQUFFLGdCQUhGO0FBSUwzQixJQUFBQSxJQUFJLEVBQUUsS0FKRDtBQUtMckMsSUFBQUEsTUFBTSxFQUFFLElBTEg7QUFNTDJELElBQUFBLElBQUksRUFBRSxJQU5EO0FBT0xHLElBQUFBLFFBQVEsRUFBRSxFQVBMO0FBU0xqQixJQUFBQSxPQUFPLEVBQUUsRUFUSjtBQVVMNUQsSUFBQUEsV0FBVyxFQUFFLGFBVlI7QUFXTGYsSUFBQUEsU0FBUyxFQUFFLElBWE47QUFZTGlCLElBQUFBLE9BQU8sRUFBRSxLQVpKO0FBYUxDLElBQUFBLEtBQUssRUFBRSxLQWJGO0FBY0xqQixJQUFBQSxPQUFPLEVBQUUsSUFkSjtBQWVMbUQsSUFBQUEsTUFBTSxFQUFFLEtBZkg7QUFnQkwvQixJQUFBQSxZQUFZLEVBQUU7QUFoQlQsR0FBUDtBQWtCRCIsInNvdXJjZXNDb250ZW50IjpbIlxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbnN0cnVjdG9yKGluaXRpYWxPcHRpb25zKSB7XG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICB2YXIgdmFycyA9IHt9XG4gIHZhciBvcHRpb25zID0ge31cbiAgdHJ5IHtcbiAgICBpZiAoaW5pdGlhbE9wdGlvbnMuZnJhbWV3b3JrID09IHVuZGVmaW5lZCkge1xuICAgICAgdmFycy5wbHVnaW5FcnJvcnMgPSBbXVxuICAgICAgdmFycy5wbHVnaW5FcnJvcnMucHVzaCgnd2VicGFjayBjb25maWc6IGZyYW1ld29yayBwYXJhbWV0ZXIgb24gZXh0LXdlYnBhY2stcGx1Z2luIGlzIG5vdCBkZWZpbmVkIC0gdmFsdWVzOiByZWFjdCwgYW5ndWxhciwgZXh0anMsIHdlYi1jb21wb25lbnRzJylcbiAgICAgIHZhciByZXN1bHQgPSB7IHZhcnM6IHZhcnMgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHZhciBmcmFtZXdvcmsgPSBpbml0aWFsT3B0aW9ucy5mcmFtZXdvcmtcbiAgICB2YXIgdHJlZXNoYWtlID0gaW5pdGlhbE9wdGlvbnMudHJlZXNoYWtlXG4gICAgdmFyIHZlcmJvc2UgPSBpbml0aWFsT3B0aW9ucy52ZXJib3NlXG5cbiAgICBjb25zdCB2YWxpZGF0ZU9wdGlvbnMgPSByZXF1aXJlKCdzY2hlbWEtdXRpbHMnKVxuICAgIHZhbGlkYXRlT3B0aW9ucyhfZ2V0VmFsaWRhdGVPcHRpb25zKCksIGluaXRpYWxPcHRpb25zLCAnJylcblxuICAgIGNvbnN0IHJjID0gKGZzLmV4aXN0c1N5bmMoYC5leHQtJHtmcmFtZXdvcmt9cmNgKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhgLmV4dC0ke2ZyYW1ld29ya31yY2AsICd1dGYtOCcpKSB8fCB7fSlcbiAgICBvcHRpb25zID0geyAuLi5fZ2V0RGVmYXVsdE9wdGlvbnMoKSwgLi4uaW5pdGlhbE9wdGlvbnMsIC4uLnJjIH1cblxuICAgIHZhcnMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0RGVmYXVsdFZhcnMoKVxuICAgIHZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gICAgdmFycy5hcHAgPSBfZ2V0QXBwKClcbiAgICB2YXIgcGx1Z2luTmFtZSA9IHZhcnMucGx1Z2luTmFtZVxuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2NvbnN0cnVjdG9yJylcbiAgICBsb2d2KHZlcmJvc2UsIGBwbHVnaW5OYW1lIC0gJHtwbHVnaW5OYW1lfWApXG4gICAgbG9ndih2ZXJib3NlLCBgYXBwIC0gJHthcHB9YClcblxuICAgIGlmIChvcHRpb25zLmVudmlyb25tZW50ID09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFycy5wcm9kdWN0aW9uID0gdHJ1ZVxuICAgICAgb3B0aW9ucy5icm93c2VyID0gJ25vJ1xuICAgICAgb3B0aW9ucy53YXRjaCA9ICdubydcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXJzLnByb2R1Y3Rpb24gPSBmYWxzZVxuICAgIH1cblxuICAgIGxvZyhhcHAsIF9nZXRWZXJzaW9ucyhwbHVnaW5OYW1lLCBmcmFtZXdvcmspKVxuXG4gICAgLy9tamcgYWRkZWQgZm9yIGFuZ3VsYXIgY2xpIGJ1aWxkXG4gICAgaWYgKGZyYW1ld29yayA9PSAnYW5ndWxhcicgJiZcbiAgICAgICAgb3B0aW9ucy5pbnRlbGxpc2hha2UgPT0gJ25vJyAmJlxuICAgICAgICB2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZVxuICAgICAgICAmJiB0cmVlc2hha2UgPT0gJ3llcycpIHtcbiAgICAgICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSc7XG4gICAgICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJyArIGZyYW1ld29yayk7XG4gICAgfVxuXG4gICAgZWxzZSBpZiAoZnJhbWV3b3JrID09ICdyZWFjdCcgfHwgZnJhbWV3b3JrID09ICdleHRqcycgfHwgZnJhbWV3b3JrID09ICd3ZWItY29tcG9uZW50cycpIHtcbiAgICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIGRldmVsb3BtZW50IGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgaWYgKHRyZWVzaGFrZSA9PSAneWVzJykge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDInXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrICsgJyAtICcgKyB2YXJzLmJ1aWxkc3RlcClcbiAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3RvUHJvZCh2YXJzLCBvcHRpb25zKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzIgb2YgMidcbiAgICAgICAgbG9nKGFwcCwgJ0NvbnRpbnVpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJyArIGZyYW1ld29yayArICcgLSAnICsgdmFycy5idWlsZHN0ZXApXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJ1xuICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIGRldmVsb3BtZW50IGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKVxuICAgIH1cbiAgICBsb2d2KHZlcmJvc2UsICdCdWlsZGluZyBmb3IgJyArIG9wdGlvbnMuZW52aXJvbm1lbnQgKyAnLCAnICsgJ3RyZWVzaGFrZSBpcyAnICsgb3B0aW9ucy50cmVlc2hha2UrICcsICcgKyAnaW50ZWxsaXNoYWtlIGlzICcgKyBvcHRpb25zLmludGVsbGlzaGFrZSlcblxuICAgIHZhciBjb25maWdPYmogPSB7IHZhcnM6IHZhcnMsIG9wdGlvbnM6IG9wdGlvbnMgfTtcbiAgICByZXR1cm4gY29uZmlnT2JqO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgdGhyb3cgJ19jb25zdHJ1Y3RvcjogJyArIGUudG9TdHJpbmcoKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF90aGlzQ29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfdGhpc0NvbXBpbGF0aW9uJylcbiAgICBsb2d2KHZlcmJvc2UsIGBvcHRpb25zLnNjcmlwdDogJHtvcHRpb25zLnNjcmlwdCB9YClcbiAgICBsb2d2KHZlcmJvc2UsIGBidWlsZHN0ZXA6ICR7dmFycy5idWlsZHN0ZXB9YClcblxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PT0gJzEgb2YgMScgfHwgdmFycy5idWlsZHN0ZXAgPT09ICcxIG9mIDInKSB7XG4gICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuc2NyaXB0ICE9IG51bGwgJiYgb3B0aW9ucy5zY3JpcHQgIT0gJycpIHtcbiAgICAgICAgbG9nKGFwcCwgYFN0YXJ0ZWQgcnVubmluZyAke29wdGlvbnMuc2NyaXB0fWApXG4gICAgICAgIHJ1blNjcmlwdChvcHRpb25zLnNjcmlwdCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG4gICAgICAgICAgbG9nKGFwcCwgYEZpbmlzaGVkIHJ1bm5pbmcgJHtvcHRpb25zLnNjcmlwdH1gKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHRocm93ICdfdGhpc0NvbXBpbGF0aW9uOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2NvbXBpbGF0aW9uJylcblxuICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgaWYgKG9wdGlvbnMudHJlZXNoYWtlID09PSAneWVzJyAmJiBvcHRpb25zLmVudmlyb25tZW50ID09PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgdmFyIGV4dENvbXBvbmVudHMgPSBbXTtcblxuICAgICAgICAvL21qZyBmb3IgMSBzdGVwIGJ1aWxkXG4gICAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyAmJiBmcmFtZXdvcmsgPT09ICdhbmd1bGFyJyAmJiBvcHRpb25zLmludGVsbGlzaGFrZSA9PSAnbm8nKSB7XG4gICAgICAgICAgICBleHRDb21wb25lbnRzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMicgfHwgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnICYmIGZyYW1ld29yayA9PT0gJ3dlYi1jb21wb25lbnRzJykpIHtcbiAgICAgICAgICBleHRDb21wb25lbnRzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucylcbiAgICAgICAgfVxuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5zdWNjZWVkTW9kdWxlLnRhcChgZXh0LXN1Y2NlZWQtbW9kdWxlYCwgbW9kdWxlID0+IHtcbiAgICAgICAgICBpZiAobW9kdWxlLnJlc291cmNlICYmICFtb2R1bGUucmVzb3VyY2UubWF0Y2goL25vZGVfbW9kdWxlcy8pKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChtb2R1bGUucmVzb3VyY2UubWF0Y2goL1xcLmh0bWwkLykgIT0gbnVsbFxuICAgICAgICAgICAgICAgICYmIG1vZHVsZS5fc291cmNlLl92YWx1ZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdkb2N0eXBlIGh0bWwnKSA9PSBmYWxzZVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5maW5pc2hNb2R1bGVzLnRhcChgZXh0LWZpbmlzaC1tb2R1bGVzYCwgbW9kdWxlcyA9PiB7XG4gICAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIodmFycywgb3B0aW9ucylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMiBvZiAyJykge1xuICAgICAgICBpZiAob3B0aW9ucy5pbmplY3QgPT09ICd5ZXMnKSB7XG4gICAgICAgICAgY29tcGlsYXRpb24uaG9va3MuaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbi50YXAoYGV4dC1odG1sLWdlbmVyYXRpb25gLChkYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgICAgICAgICB2YXIganNQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5qcycpXG4gICAgICAgICAgICB2YXIgY3NzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuY3NzJylcbiAgICAgICAgICAgIGRhdGEuYXNzZXRzLmpzLnVuc2hpZnQoanNQYXRoKVxuICAgICAgICAgICAgZGF0YS5hc3NldHMuY3NzLnVuc2hpZnQoY3NzUGF0aClcbiAgICAgICAgICAgIGxvZyhhcHAsIGBBZGRpbmcgJHtqc1BhdGh9IGFuZCAke2Nzc1BhdGh9IHRvIGluZGV4Lmh0bWxgKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHRocm93ICdfY29tcGlsYXRpb246ICcgKyBlLnRvU3RyaW5nKClcbi8vICAgIGxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4vLyAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2NvbXBpbGF0aW9uOiAnICsgZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfYWZ0ZXJDb21waWxlKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZScpXG4gICAgaWYgKGZyYW1ld29yayA9PSAnZXh0anMnKSB7XG4gICAgICByZXF1aXJlKGAuL2V4dGpzVXRpbGApLl9hZnRlckNvbXBpbGUoY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZSBub3QgcnVuJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHRocm93ICdfYWZ0ZXJDb21waWxlOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2VtaXQoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB0cnkge1xuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBlbWl0ID0gb3B0aW9ucy5lbWl0XG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfZW1pdCcpXG4gICAgaWYgKGVtaXQgPT0gJ3llcycpIHtcbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgICAgICBsZXQgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vdXRwdXRQYXRoLHZhcnMuZXh0UGF0aClcbiAgICAgICAgaWYgKGNvbXBpbGVyLm91dHB1dFBhdGggPT09ICcvJyAmJiBjb21waWxlci5vcHRpb25zLmRldlNlcnZlcikge1xuICAgICAgICAgIG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIuY29udGVudEJhc2UsIG91dHB1dFBhdGgpXG4gICAgICAgIH1cbiAgICAgICAgbG9ndih2ZXJib3NlLCdvdXRwdXRQYXRoOiAnICsgb3V0cHV0UGF0aClcbiAgICAgICAgbG9ndih2ZXJib3NlLCdmcmFtZXdvcms6ICcgKyBmcmFtZXdvcmspXG4gICAgICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgICAgIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29tbWFuZCA9ICcnXG4gICAgICAgIGlmIChvcHRpb25zLndhdGNoID09ICd5ZXMnICYmIHZhcnMucHJvZHVjdGlvbiA9PSBmYWxzZSlcbiAgICAgICAgICB7Y29tbWFuZCA9ICd3YXRjaCd9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB7Y29tbWFuZCA9ICdidWlsZCd9XG4gICAgICAgIGlmICh2YXJzLnJlYnVpbGQgPT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciBwYXJtcyA9IFtdXG4gICAgICAgICAgaWYgKG9wdGlvbnMucHJvZmlsZSA9PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5wcm9maWxlID09ICcnIHx8IG9wdGlvbnMucHJvZmlsZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoY29tbWFuZCA9PSAnYnVpbGQnKVxuICAgICAgICAgICAgICB7IHBhcm1zID0gWydhcHAnLCBjb21tYW5kLCBvcHRpb25zLmVudmlyb25tZW50XSB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHsgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLmVudmlyb25tZW50XSB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT0gJ2J1aWxkJylcbiAgICAgICAgICAgICAge3Bhcm1zID0gWydhcHAnLCBjb21tYW5kLCBvcHRpb25zLnByb2ZpbGUsIG9wdGlvbnMuZW52aXJvbm1lbnRdfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB7cGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLnByb2ZpbGUsIG9wdGlvbnMuZW52aXJvbm1lbnRdfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodmFycy53YXRjaFN0YXJ0ZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGF3YWl0IF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgdmFycywgb3B0aW9ucylcbiAgICAgICAgICAgIHZhcnMud2F0Y2hTdGFydGVkID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbG9ndih2ZXJib3NlLCdOT1QgcnVubmluZyBlbWl0JylcbiAgICAgICAgY2FsbGJhY2soKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxvZ3YodmVyYm9zZSwnZW1pdCBpcyBubycpXG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICBjYWxsYmFjaygpXG4gICAgdGhyb3cgJ19lbWl0OiAnICsgZS50b1N0cmluZygpXG4gICAgLy8gbG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgICAvLyBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2VtaXQ6ICcgKyBlKVxuICAgIC8vIGNhbGxiYWNrKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZG9uZShzdGF0cywgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfZG9uZScpXG4gICAgaWYgKHN0YXRzLmNvbXBpbGF0aW9uLmVycm9ycyAmJiBzdGF0cy5jb21waWxhdGlvbi5lcnJvcnMubGVuZ3RoKSAvLyAmJiBwcm9jZXNzLmFyZ3YuaW5kZXhPZignLS13YXRjaCcpID09IC0xKVxuICAgIHtcbiAgICAgIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJyk7XG4gICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQoJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKicpKTtcbiAgICAgIGNvbnNvbGUubG9nKHN0YXRzLmNvbXBpbGF0aW9uLmVycm9yc1swXSk7XG4gICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQoJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKicpKTtcbiAgICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgICB9XG5cbiAgICAvL21qZyByZWZhY3RvclxuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSAnbm8nICYmIGZyYW1ld29yayA9PSAnYW5ndWxhcicpIHtcbiAgICAgIHJlcXVpcmUoYC4vJHtvcHRpb25zLmZyYW1ld29ya31VdGlsYCkuX3RvRGV2KHZhcnMsIG9wdGlvbnMpXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBpZihvcHRpb25zLmJyb3dzZXIgPT0gJ3llcycgJiYgb3B0aW9ucy53YXRjaCA9PSAneWVzJyAmJiB2YXJzLnByb2R1Y3Rpb24gPT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHZhcnMuYnJvd3NlckNvdW50ID09IDApIHtcbiAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6JyArIG9wdGlvbnMucG9ydFxuICAgICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYE9wZW5pbmcgYnJvd3NlciBhdCAke3VybH1gKVxuICAgICAgICAgIHZhcnMuYnJvd3NlckNvdW50KytcbiAgICAgICAgICBjb25zdCBvcG4gPSByZXF1aXJlKCdvcG4nKVxuICAgICAgICAgIG9wbih1cmwpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJykge1xuICAgICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlKSB7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAke2ZyYW1ld29ya31gKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBkZXZlbG9wbWVudCBidWlsZCBmb3IgJHtmcmFtZXdvcmt9YClcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcyIG9mIDInKSB7XG4gICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJHtmcmFtZXdvcmt9YClcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuLy8gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgICB0aHJvdyAnX2RvbmU6ICcgKyBlLnRvU3RyaW5nKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0LCBjb21waWxhdGlvbikge1xuICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIHBhY2thZ2VzID0gb3B0aW9ucy5wYWNrYWdlc1xuICAgIHZhciB0b29sa2l0ID0gb3B0aW9ucy50b29sa2l0XG4gICAgdmFyIHRoZW1lID0gb3B0aW9ucy50aGVtZVxuICAgIGxvZ3YodmVyYm9zZSwnRlVOQ1RJT04gX3ByZXBhcmVGb3JCdWlsZCcpXG4gICAgY29uc3QgcmltcmFmID0gcmVxdWlyZSgncmltcmFmJylcbiAgICBjb25zdCBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKVxuICAgIGNvbnN0IGZzeCA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgdGhlbWUgPSB0aGVtZSB8fCAodG9vbGtpdCA9PT0gJ2NsYXNzaWMnID8gJ3RoZW1lLXRyaXRvbicgOiAndGhlbWUtbWF0ZXJpYWwnKVxuICAgIGxvZ3YodmVyYm9zZSwnZmlyc3RUaW1lOiAnICsgdmFycy5maXJzdFRpbWUpXG4gICAgaWYgKHZhcnMuZmlyc3RUaW1lKSB7XG4gICAgICByaW1yYWYuc3luYyhvdXRwdXQpXG4gICAgICBta2RpcnAuc3luYyhvdXRwdXQpXG4gICAgICBjb25zdCBidWlsZFhNTCA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuYnVpbGRYTUxcbiAgICAgIGNvbnN0IGNyZWF0ZUFwcEpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUFwcEpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZVdvcmtzcGFjZUpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZVdvcmtzcGFjZUpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZUpTRE9NRW52aXJvbm1lbnQgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUpTRE9NRW52aXJvbm1lbnRcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2J1aWxkLnhtbCcpLCBidWlsZFhNTCh2YXJzLnByb2R1Y3Rpb24sIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2FwcC5qc29uJyksIGNyZWF0ZUFwcEpzb24odGhlbWUsIHBhY2thZ2VzLCB0b29sa2l0LCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdqc2RvbS1lbnZpcm9ubWVudC5qcycpLCBjcmVhdGVKU0RPTUVudmlyb25tZW50KG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ3dvcmtzcGFjZS5qc29uJyksIGNyZWF0ZVdvcmtzcGFjZUpzb24ob3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgdmFyIGZyYW1ld29yayA9IHZhcnMuZnJhbWV3b3JrO1xuICAgICAgLy9iZWNhdXNlIG9mIGEgcHJvYmxlbSB3aXRoIGNvbG9ycGlja2VyXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3V4L2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAndXgnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgKHV4KSAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vcGFja2FnZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3BhY2thZ2VzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdvdmVycmlkZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCdyZXNvdXJjZXMvJykpKSB7XG4gICAgICAgIHZhciBmcm9tUmVzb3VyY2VzID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdyZXNvdXJjZXMvJylcbiAgICAgICAgdmFyIHRvUmVzb3VyY2VzID0gcGF0aC5qb2luKG91dHB1dCwgJy4uL3Jlc291cmNlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUmVzb3VyY2VzLCB0b1Jlc291cmNlcylcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21SZXNvdXJjZXMucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9SZXNvdXJjZXMucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgfVxuICAgIHZhcnMuZmlyc3RUaW1lID0gZmFsc2VcbiAgICB2YXIganMgPSAnJ1xuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24pIHtcbiAgICAgIHZhcnMuZGVwcyA9IHZhcnMuZGVwcy5maWx0ZXIoZnVuY3Rpb24odmFsdWUsIGluZGV4KXsgcmV0dXJuIHZhcnMuZGVwcy5pbmRleE9mKHZhbHVlKSA9PSBpbmRleCB9KTtcbiAgICAgIGpzID0gdmFycy5kZXBzLmpvaW4oJztcXG5FeHQucmVxdWlyZShbXCJFeHQuKlwiLFwiRXh0LmRhdGEuVHJlZVN0b3JlXCJdKTtcXG4nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBqcyA9IGBFeHQucmVxdWlyZShbXCJFeHQuKlwiLFwiRXh0LmRhdGEuVHJlZVN0b3JlXCJdKWBcbiAgICB9XG4gICAgaWYgKHZhcnMubWFuaWZlc3QgPT09IG51bGwgfHwganMgIT09IHZhcnMubWFuaWZlc3QpIHtcbiAgICAgIHZhcnMubWFuaWZlc3QgPSBqc1xuICAgICAgY29uc3QgbWFuaWZlc3QgPSBwYXRoLmpvaW4ob3V0cHV0LCAnbWFuaWZlc3QuanMnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhtYW5pZmVzdCwganMsICd1dGY4JylcbiAgICAgIHZhcnMucmVidWlsZCA9IHRydWVcbiAgICAgIHZhciBidW5kbGVEaXIgPSBvdXRwdXQucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJylcbiAgICAgIGlmIChidW5kbGVEaXIudHJpbSgpID09ICcnKSB7YnVuZGxlRGlyID0gJy4vJ31cbiAgICAgIGxvZyhhcHAsICdCdWlsZGluZyBFeHQgYnVuZGxlIGF0OiAnICsgYnVuZGxlRGlyKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhcnMucmVidWlsZCA9IGZhbHNlXG4gICAgICBsb2coYXBwLCAnRXh0IHJlYnVpbGQgTk9UIG5lZWRlZCcpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfcHJlcGFyZUZvckJ1aWxkOiAnICsgZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIHZhcnMsIG9wdGlvbnMpIHtcbi8vICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfYnVpbGRFeHRCdW5kbGUnKVxuICAgIGxldCBzZW5jaGE7IHRyeSB7IHNlbmNoYSA9IHJlcXVpcmUoJ0BzZW5jaGEvY21kJykgfSBjYXRjaCAoZSkgeyBzZW5jaGEgPSAnc2VuY2hhJyB9XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoc2VuY2hhKSkge1xuICAgICAgbG9ndih2ZXJib3NlLCdzZW5jaGEgZm9sZGVyIGV4aXN0cycpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndih2ZXJib3NlLCdzZW5jaGEgZm9sZGVyIERPRVMgTk9UIGV4aXN0JylcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IG9uQnVpbGREb25lID0gKCkgPT4ge1xuICAgICAgICBsb2d2KHZlcmJvc2UsJ29uQnVpbGREb25lJylcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9XG4gICAgICB2YXIgb3B0cyA9IHsgY3dkOiBvdXRwdXRQYXRoLCBzaWxlbnQ6IHRydWUsIHN0ZGlvOiAncGlwZScsIGVuY29kaW5nOiAndXRmLTgnfVxuICAgICAgX2V4ZWN1dGVBc3luYyhhcHAsIHNlbmNoYSwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKS50aGVuIChcbiAgICAgICAgZnVuY3Rpb24oKSB7IG9uQnVpbGREb25lKCkgfSxcbiAgICAgICAgZnVuY3Rpb24ocmVhc29uKSB7IHJlamVjdChyZWFzb24pIH1cbiAgICAgIClcbiAgICB9KVxuICAvLyB9XG4gIC8vIGNhdGNoKGUpIHtcbiAgLy8gICBjb25zb2xlLmxvZygnZScpXG4gIC8vICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgLy8gICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2J1aWxkRXh0QnVuZGxlOiAnICsgZSlcbiAgLy8gICBjYWxsYmFjaygpXG4gIC8vIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2V4ZWN1dGVBc3luYyAoYXBwLCBjb21tYW5kLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbi8vICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgLy9jb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBTZXJ2ZXJcIiwgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gICAgY29uc3QgREVGQVVMVF9TVUJTVFJTID0gW1wiW0lORl0geFNlcnZlclwiLCAnW0lORl0gTG9hZGluZycsICdbSU5GXSBBcHBlbmQnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbSU5GXSBQcm9jZXNzaW5nIEJ1aWxkJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgICB2YXIgc3Vic3RyaW5ncyA9IERFRkFVTFRfU1VCU1RSU1xuICAgIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbiAgICBjb25zdCBjcm9zc1NwYXduID0gcmVxdWlyZSgnY3Jvc3Mtc3Bhd24nKVxuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9leGVjdXRlQXN5bmMnKVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxvZ3YodmVyYm9zZSxgY29tbWFuZCAtICR7Y29tbWFuZH1gKVxuICAgICAgbG9ndih2ZXJib3NlLCBgcGFybXMgLSAke3Bhcm1zfWApXG4gICAgICBsb2d2KHZlcmJvc2UsIGBvcHRzIC0gJHtKU09OLnN0cmluZ2lmeShvcHRzKX1gKVxuICAgICAgbGV0IGNoaWxkID0gY3Jvc3NTcGF3bihjb21tYW5kLCBwYXJtcywgb3B0cylcbiAgICAgIGNoaWxkLm9uKCdjbG9zZScsIChjb2RlLCBzaWduYWwpID0+IHtcbiAgICAgICAgbG9ndih2ZXJib3NlLCBgb24gY2xvc2U6IGAgKyBjb2RlKVxuICAgICAgICBpZihjb2RlID09PSAwKSB7IHJlc29sdmUoMCkgfVxuICAgICAgICBlbHNlIHsgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goIG5ldyBFcnJvcihjb2RlKSApOyByZXNvbHZlKDApIH1cbiAgICAgIH0pXG4gICAgICBjaGlsZC5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAgICAgbG9ndih2ZXJib3NlLCBgb24gZXJyb3JgKVxuICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChlcnJvcilcbiAgICAgICAgcmVzb2x2ZSgwKVxuICAgICAgfSlcbiAgICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICBsb2d2KHZlcmJvc2UsIGAke3N0cn1gKVxuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkubWF0Y2goL0Zhc2hpb24gd2FpdGluZyBmb3IgY2hhbmdlc1xcLlxcLlxcLi8pKSB7XG5cbiAgICAgICAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICAgICAgdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSArIHZhcnMudG91Y2hGaWxlO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKVxuICAgICAgICAgICAgdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgJy8vJyArIGQsICd1dGY4Jyk7XG4gICAgICAgICAgICBsb2d2KGFwcCwgYHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGxvZ3YoYXBwLCBgTk9UIHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZSgwKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmIChzdWJzdHJpbmdzLnNvbWUoZnVuY3Rpb24odikgeyByZXR1cm4gZGF0YS5pbmRleE9mKHYpID49IDA7IH0pKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltJTkZdXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltMT0ddXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykudHJpbSgpXG4gICAgICAgICAgICBpZiAoc3RyLmluY2x1ZGVzKFwiW0VSUl1cIikpIHtcbiAgICAgICAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goYXBwICsgc3RyLnJlcGxhY2UoL15cXFtFUlJcXF0gL2dpLCAnJykpO1xuICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltFUlJdXCIsIGAke2NoYWxrLnJlZChcIltFUlJdXCIpfWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2coYXBwLCBzdHIpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgbG9ndihvcHRpb25zLCBgZXJyb3Igb24gY2xvc2U6IGAgKyBkYXRhKVxuICAgICAgICB2YXIgc3RyID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UoL1xccj9cXG58XFxyL2csIFwiIFwiKS50cmltKClcbiAgICAgICAgdmFyIHN0ckphdmFPcHRzID0gXCJQaWNrZWQgdXAgX0pBVkFfT1BUSU9OU1wiO1xuICAgICAgICB2YXIgaW5jbHVkZXMgPSBzdHIuaW5jbHVkZXMoc3RySmF2YU9wdHMpXG4gICAgICAgIGlmICghaW5jbHVkZXMpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJHthcHB9ICR7Y2hhbGsucmVkKFwiW0VSUl1cIil9ICR7c3RyfWApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgLy8gfVxuICAvLyBjYXRjaChlKSB7XG4gIC8vICAgbG9ndihvcHRpb25zLGUpXG4gIC8vICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19leGVjdXRlQXN5bmM6ICcgKyBlKVxuICAvLyAgIGNhbGxiYWNrKClcbiAgLy8gfVxufVxuXG4vLyoqKioqKioqKipcbmZ1bmN0aW9uIHJ1blNjcmlwdChzY3JpcHRQYXRoLCBjYWxsYmFjaykge1xuICB2YXIgY2hpbGRQcm9jZXNzID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xuICAvLyBrZWVwIHRyYWNrIG9mIHdoZXRoZXIgY2FsbGJhY2sgaGFzIGJlZW4gaW52b2tlZCB0byBwcmV2ZW50IG11bHRpcGxlIGludm9jYXRpb25zXG4gIHZhciBpbnZva2VkID0gZmFsc2U7XG4gIHZhciBwcm9jZXNzID0gY2hpbGRQcm9jZXNzLmZvcmsoc2NyaXB0UGF0aCk7XG4gIC8vIGxpc3RlbiBmb3IgZXJyb3JzIGFzIHRoZXkgbWF5IHByZXZlbnQgdGhlIGV4aXQgZXZlbnQgZnJvbSBmaXJpbmdcbiAgcHJvY2Vzcy5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKGludm9rZWQpIHJldHVybjtcbiAgICBpbnZva2VkID0gdHJ1ZTtcbiAgICBjYWxsYmFjayhlcnIpO1xuICB9KTtcbiAgLy8gZXhlY3V0ZSB0aGUgY2FsbGJhY2sgb25jZSB0aGUgcHJvY2VzcyBoYXMgZmluaXNoZWQgcnVubmluZ1xuICBwcm9jZXNzLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGUpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIHZhciBlcnIgPSBjb2RlID09PSAwID8gbnVsbCA6IG5ldyBFcnJvcignZXhpdCBjb2RlICcgKyBjb2RlKTtcbiAgICBjYWxsYmFjayhlcnIpO1xuICB9KTtcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3RvWHR5cGUoc3RyKSB7XG4gIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9fL2csICctJylcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2dldEFwcCgpIHtcbiAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKVxuICB2YXIgcHJlZml4ID0gYGBcbiAgY29uc3QgcGxhdGZvcm0gPSByZXF1aXJlKCdvcycpLnBsYXRmb3JtKClcbiAgaWYgKHBsYXRmb3JtID09ICdkYXJ3aW4nKSB7IHByZWZpeCA9IGDihLkg772iZXh0772jOmAgfVxuICBlbHNlIHsgcHJlZml4ID0gYGkgW2V4dF06YCB9XG4gIHJldHVybiBgJHtjaGFsay5ncmVlbihwcmVmaXgpfSBgXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRWZXJzaW9ucyhwbHVnaW5OYW1lLCBmcmFtZXdvcmtOYW1lKSB7XG50cnkge1xuICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICB2YXIgdiA9IHt9XG4gIHZhciBmcmFtZXdvcmtJbmZvID0gJ24vYSdcblxuICB2LnBsdWdpblZlcnNpb24gPSAnbi9hJztcbiAgdi5leHRWZXJzaW9uID0gJ24vYSc7XG4gIHYuZWRpdGlvbiA9ICduL2EnO1xuICB2LmNtZFZlcnNpb24gPSAnbi9hJztcbiAgdi53ZWJwYWNrVmVyc2lvbiA9ICduL2EnO1xuXG4gIHZhciBwbHVnaW5QYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhJywgcGx1Z2luTmFtZSlcbiAgdmFyIHBsdWdpblBrZyA9IChmcy5leGlzdHNTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwbHVnaW5QYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5wbHVnaW5WZXJzaW9uID0gcGx1Z2luUGtnLnZlcnNpb25cbiAgdi5fcmVzb2x2ZWQgPSBwbHVnaW5Qa2cuX3Jlc29sdmVkXG4gIGlmICh2Ll9yZXNvbHZlZCA9PSB1bmRlZmluZWQpIHtcbiAgICB2LmVkaXRpb24gPSBgQ29tbWVyY2lhbGBcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAoLTEgPT0gdi5fcmVzb2x2ZWQuaW5kZXhPZignY29tbXVuaXR5JykpIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tdW5pdHlgXG4gICAgfVxuICB9XG4gIHZhciB3ZWJwYWNrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvd2VicGFjaycpXG4gIHZhciB3ZWJwYWNrUGtnID0gKGZzLmV4aXN0c1N5bmMod2VicGFja1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYud2VicGFja1ZlcnNpb24gPSB3ZWJwYWNrUGtnLnZlcnNpb25cbiAgdmFyIGV4dFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0JylcbiAgdmFyIGV4dFBrZyA9IChmcy5leGlzdHNTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhleHRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5leHRWZXJzaW9uID0gZXh0UGtnLnNlbmNoYS52ZXJzaW9uXG4gIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gIHZhciBjbWRQa2cgPSAoZnMuZXhpc3RzU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgaWYgKHYuY21kVmVyc2lvbiA9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgY21kUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLGBub2RlX21vZHVsZXMvQHNlbmNoYS8ke3BsdWdpbk5hbWV9L25vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gICAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXG4gIH1cblxuICAgaWYgKGZyYW1ld29ya05hbWUgIT0gdW5kZWZpbmVkICYmIGZyYW1ld29ya05hbWUgIT0gJ2V4dGpzJykge1xuICAgIHZhciBmcmFtZXdvcmtQYXRoID0gJydcbiAgICBpZiAoZnJhbWV3b3JrTmFtZSA9PSAncmVhY3QnKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9yZWFjdCcpXG4gICAgfVxuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdhbmd1bGFyJykge1xuICAgICAgZnJhbWV3b3JrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQGFuZ3VsYXIvY29yZScpXG4gICAgfVxuICAgIHZhciBmcmFtZXdvcmtQa2cgPSAoZnMuZXhpc3RzU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZnJhbWV3b3JrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gICAgdi5mcmFtZXdvcmtWZXJzaW9uID0gZnJhbWV3b3JrUGtnLnZlcnNpb25cbiAgICBpZiAodi5mcmFtZXdvcmtWZXJzaW9uID09IHVuZGVmaW5lZCkge1xuICAgICAgZnJhbWV3b3JrSW5mbyA9ICcsICcgKyBmcmFtZXdvcmtOYW1lXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZnJhbWV3b3JrSW5mbyA9ICcsICcgKyBmcmFtZXdvcmtOYW1lICsgJyB2JyArIHYuZnJhbWV3b3JrVmVyc2lvblxuICAgIH1cbiAgfVxuICByZXR1cm4gJ2V4dC13ZWJwYWNrLXBsdWdpbiB2JyArIHYucGx1Z2luVmVyc2lvbiArICcsIEV4dCBKUyB2JyArIHYuZXh0VmVyc2lvbiArICcgJyArIHYuZWRpdGlvbiArICcgRWRpdGlvbiwgU2VuY2hhIENtZCB2JyArIHYuY21kVmVyc2lvbiArICcsIHdlYnBhY2sgdicgKyB2LndlYnBhY2tWZXJzaW9uICsgZnJhbWV3b3JrSW5mb1xuXG59XG5jYXRjaCAoZSkge1xuICByZXR1cm4gJ2V4dC13ZWJwYWNrLXBsdWdpbiB2JyArIHYucGx1Z2luVmVyc2lvbiArICcsIEV4dCBKUyB2JyArIHYuZXh0VmVyc2lvbiArICcgJyArIHYuZWRpdGlvbiArICcgRWRpdGlvbiwgU2VuY2hhIENtZCB2JyArIHYuY21kVmVyc2lvbiArICcsIHdlYnBhY2sgdicgKyB2LndlYnBhY2tWZXJzaW9uICsgZnJhbWV3b3JrSW5mb1xufVxuXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhhcHAsbWVzc2FnZSkge1xuICB2YXIgcyA9IGFwcCArIG1lc3NhZ2VcbiAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgdHJ5IHtwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKX1jYXRjaChlKSB7fVxuICBwcm9jZXNzLnN0ZG91dC53cml0ZShzKTtwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9naChhcHAsbWVzc2FnZSkge1xuICB2YXIgaCA9IGZhbHNlXG4gIHZhciBzID0gYXBwICsgbWVzc2FnZVxuICBpZiAoaCA9PSB0cnVlKSB7XG4gICAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgICB0cnkge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKClcbiAgICB9XG4gICAgY2F0Y2goZSkge31cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShzKVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZ3YodmVyYm9zZSwgcykge1xuICBpZiAodmVyYm9zZSA9PSAneWVzJykge1xuICAgIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgfVxuICAgIGNhdGNoKGUpIHt9XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoYC12ZXJib3NlOiAke3N9YClcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbiAgfVxufVxuXG5mdW5jdGlvbiBfZ2V0VmFsaWRhdGVPcHRpb25zKCkge1xuICByZXR1cm4ge1xuICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICBcImZyYW1ld29ya1wiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInRvb2xraXRcIjoge1xuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJ0aGVtZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImVtaXRcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInNjcmlwdFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInBvcnRcIjoge1xuICAgICAgICBcInR5cGVcIjogW1wiaW50ZWdlclwiXVxuICAgICAgfSxcbiAgICAgIFwicGFja2FnZXNcIjoge1xuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCIsIFwiYXJyYXlcIl1cbiAgICAgIH0sXG4gICAgICBcInByb2ZpbGVcIjoge1xuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJlbnZpcm9ubWVudFwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICdkZXZlbG9wbWVudCcgb3IgJ3Byb2R1Y3Rpb24nIHN0cmluZyB2YWx1ZVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJ0cmVlc2hha2VcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImJyb3dzZXJcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcIndhdGNoXCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ3llcycgb3IgJ25vJyBzdHJpbmcgdmFsdWUgKE5PVCB0cnVlIG9yIGZhbHNlKVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJ2ZXJib3NlXCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ3llcycgb3IgJ25vJyBzdHJpbmcgdmFsdWUgKE5PVCB0cnVlIG9yIGZhbHNlKVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJpbmplY3RcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImludGVsbGlzaGFrZVwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICB9LFxuICAgIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjogZmFsc2VcbiAgfTtcbn1cblxuXG5mdW5jdGlvbiBfZ2V0RGVmYXVsdE9wdGlvbnMoKSB7XG4gIHJldHVybiB7XG4gICAgZnJhbWV3b3JrOiAnZXh0anMnLFxuICAgIHRvb2xraXQ6ICdtb2Rlcm4nLFxuICAgIHRoZW1lOiAndGhlbWUtbWF0ZXJpYWwnLFxuICAgIGVtaXQ6ICd5ZXMnLFxuICAgIHNjcmlwdDogbnVsbCxcbiAgICBwb3J0OiAxOTYyLFxuICAgIHBhY2thZ2VzOiBbXSxcblxuICAgIHByb2ZpbGU6ICcnLFxuICAgIGVudmlyb25tZW50OiAnZGV2ZWxvcG1lbnQnLFxuICAgIHRyZWVzaGFrZTogJ25vJyxcbiAgICBicm93c2VyOiAneWVzJyxcbiAgICB3YXRjaDogJ3llcycsXG4gICAgdmVyYm9zZTogJ25vJyxcbiAgICBpbmplY3Q6ICd5ZXMnLFxuICAgIGludGVsbGlzaGFrZTogJ3llcydcbiAgfVxufVxuIl19