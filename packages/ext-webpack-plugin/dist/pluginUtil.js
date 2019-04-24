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
      vars.pluginErrors.push('webpack config: framework parameter on ext-webpack-plugin is not defined - values: react, angular, extjs, webcomponents');
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

    log(app, _getVersions(pluginName, framework));

    if (framework == 'react' || framework == 'extjs' || framework === 'webcomponents') {
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

    logv(verbose, 'Building for ' + options.environment + ', ' + 'Treeshake is ' + options.treeshake);
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
        var extComponents = [];

        if (vars.buildstep == '1 of 2' || vars.buildstep == '1 of 1' && framework === 'webcomponents') {
          extComponents = require(`./${framework}Util`)._getAllComponents(vars, options);
        }

        compilation.hooks.succeedModule.tap(`ext-succeed-module`, module => {
          if (module.resource && !module.resource.match(/node_modules/)) {
            if (module.resource.match(/\.html$/) != null && module._source._value.toLowerCase().includes('doctype html') == false) {
              vars.deps = [...(vars.deps || []), ...require(`./${framework}Util`)._extractFromSource(module, options, compilation, extComponents)];
            } else {
              vars.deps = [...(vars.deps || []), ...require(`./${framework}Util`)._extractFromSource(module, options, compilation, extComponents)];
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
      js = vars.deps.join(';\n');
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

    if (v.frameworkVersion == undefined) {
      frameworkInfo = ', ' + frameworkName;
    } else {
      frameworkInfo = ', ' + frameworkName + ' v' + v.frameworkVersion;
    }
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
    verbose: 'no'
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsImluaXRpYWxPcHRpb25zIiwiZnMiLCJyZXF1aXJlIiwidmFycyIsIm9wdGlvbnMiLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwicmVzdWx0IiwidHJlZXNoYWtlIiwidmVyYm9zZSIsInZhbGlkYXRlT3B0aW9ucyIsIl9nZXRWYWxpZGF0ZU9wdGlvbnMiLCJyYyIsImV4aXN0c1N5bmMiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJfZ2V0RGVmYXVsdE9wdGlvbnMiLCJfZ2V0RGVmYXVsdFZhcnMiLCJwbHVnaW5OYW1lIiwiYXBwIiwiX2dldEFwcCIsImxvZ3YiLCJlbnZpcm9ubWVudCIsInByb2R1Y3Rpb24iLCJicm93c2VyIiwid2F0Y2giLCJsb2ciLCJfZ2V0VmVyc2lvbnMiLCJidWlsZHN0ZXAiLCJfdG9Qcm9kIiwiY29uZmlnT2JqIiwiZSIsInRvU3RyaW5nIiwiX3RoaXNDb21waWxhdGlvbiIsImNvbXBpbGVyIiwiY29tcGlsYXRpb24iLCJzY3JpcHQiLCJydW5TY3JpcHQiLCJlcnIiLCJfY29tcGlsYXRpb24iLCJleHRDb21wb25lbnRzIiwiX2dldEFsbENvbXBvbmVudHMiLCJob29rcyIsInN1Y2NlZWRNb2R1bGUiLCJ0YXAiLCJtb2R1bGUiLCJyZXNvdXJjZSIsIm1hdGNoIiwiX3NvdXJjZSIsIl92YWx1ZSIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJkZXBzIiwiX2V4dHJhY3RGcm9tU291cmNlIiwiZmluaXNoTW9kdWxlcyIsIm1vZHVsZXMiLCJfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciIsImh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24iLCJkYXRhIiwicGF0aCIsImpzUGF0aCIsImpvaW4iLCJleHRQYXRoIiwiY3NzUGF0aCIsImFzc2V0cyIsImpzIiwidW5zaGlmdCIsImNzcyIsIl9hZnRlckNvbXBpbGUiLCJfZW1pdCIsImNhbGxiYWNrIiwiZW1pdCIsIm91dHB1dFBhdGgiLCJkZXZTZXJ2ZXIiLCJjb250ZW50QmFzZSIsIl9wcmVwYXJlRm9yQnVpbGQiLCJjb21tYW5kIiwicmVidWlsZCIsInBhcm1zIiwicHJvZmlsZSIsIndhdGNoU3RhcnRlZCIsIl9idWlsZEV4dEJ1bmRsZSIsIl9kb25lIiwic3RhdHMiLCJlcnJvcnMiLCJsZW5ndGgiLCJjaGFsayIsImNvbnNvbGUiLCJyZWQiLCJwcm9jZXNzIiwiZXhpdCIsIl90b0RldiIsImJyb3dzZXJDb3VudCIsInVybCIsInBvcnQiLCJvcG4iLCJvdXRwdXQiLCJwYWNrYWdlcyIsInRvb2xraXQiLCJ0aGVtZSIsInJpbXJhZiIsIm1rZGlycCIsImZzeCIsImZpcnN0VGltZSIsInN5bmMiLCJidWlsZFhNTCIsImNyZWF0ZUFwcEpzb24iLCJjcmVhdGVXb3Jrc3BhY2VKc29uIiwiY3JlYXRlSlNET01FbnZpcm9ubWVudCIsIndyaXRlRmlsZVN5bmMiLCJjd2QiLCJmcm9tUGF0aCIsInRvUGF0aCIsImNvcHlTeW5jIiwicmVwbGFjZSIsImZyb21SZXNvdXJjZXMiLCJ0b1Jlc291cmNlcyIsImZpbHRlciIsInZhbHVlIiwiaW5kZXgiLCJpbmRleE9mIiwibWFuaWZlc3QiLCJidW5kbGVEaXIiLCJ0cmltIiwic2VuY2hhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbkJ1aWxkRG9uZSIsIm9wdHMiLCJzaWxlbnQiLCJzdGRpbyIsImVuY29kaW5nIiwiX2V4ZWN1dGVBc3luYyIsInRoZW4iLCJyZWFzb24iLCJERUZBVUxUX1NVQlNUUlMiLCJzdWJzdHJpbmdzIiwiY3Jvc3NTcGF3biIsInN0cmluZ2lmeSIsImNoaWxkIiwib24iLCJjb2RlIiwic2lnbmFsIiwiRXJyb3IiLCJlcnJvciIsInN0ZG91dCIsInN0ciIsImZpbGVuYW1lIiwidG91Y2hGaWxlIiwiZCIsIkRhdGUiLCJ0b0xvY2FsZVN0cmluZyIsInNvbWUiLCJ2Iiwic3RkZXJyIiwic3RySmF2YU9wdHMiLCJzY3JpcHRQYXRoIiwiY2hpbGRQcm9jZXNzIiwiaW52b2tlZCIsImZvcmsiLCJfdG9YdHlwZSIsInByZWZpeCIsInBsYXRmb3JtIiwiZ3JlZW4iLCJmcmFtZXdvcmtOYW1lIiwicGx1Z2luUGF0aCIsInBsdWdpblBrZyIsInBsdWdpblZlcnNpb24iLCJ2ZXJzaW9uIiwiX3Jlc29sdmVkIiwiZWRpdGlvbiIsIndlYnBhY2tQYXRoIiwid2VicGFja1BrZyIsIndlYnBhY2tWZXJzaW9uIiwiZXh0UGtnIiwiZXh0VmVyc2lvbiIsImNtZFBhdGgiLCJjbWRQa2ciLCJjbWRWZXJzaW9uIiwidmVyc2lvbl9mdWxsIiwiZnJhbWV3b3JrSW5mbyIsImZyYW1ld29ya1BhdGgiLCJmcmFtZXdvcmtQa2ciLCJmcmFtZXdvcmtWZXJzaW9uIiwibWVzc2FnZSIsInMiLCJjdXJzb3JUbyIsImNsZWFyTGluZSIsIndyaXRlIiwibG9naCIsImgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDTyxTQUFTQSxZQUFULENBQXNCQyxjQUF0QixFQUFzQztBQUMzQyxRQUFNQyxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBLE1BQUlDLElBQUksR0FBRyxFQUFYO0FBQ0EsTUFBSUMsT0FBTyxHQUFHLEVBQWQ7O0FBQ0EsTUFBSTtBQUNGLFFBQUlKLGNBQWMsQ0FBQ0ssU0FBZixJQUE0QkMsU0FBaEMsRUFBMkM7QUFDekNILE1BQUFBLElBQUksQ0FBQ0ksWUFBTCxHQUFvQixFQUFwQjtBQUNBSixNQUFBQSxJQUFJLENBQUNJLFlBQUwsQ0FBa0JDLElBQWxCLENBQXVCLHlIQUF2QjtBQUNBLFVBQUlDLE1BQU0sR0FBRztBQUFFTixRQUFBQSxJQUFJLEVBQUVBO0FBQVIsT0FBYjtBQUNBLGFBQU9NLE1BQVA7QUFDRDs7QUFDRCxRQUFJSixTQUFTLEdBQUdMLGNBQWMsQ0FBQ0ssU0FBL0I7QUFDQSxRQUFJSyxTQUFTLEdBQUdWLGNBQWMsQ0FBQ1UsU0FBL0I7QUFDQSxRQUFJQyxPQUFPLEdBQUdYLGNBQWMsQ0FBQ1csT0FBN0I7O0FBRUEsVUFBTUMsZUFBZSxHQUFHVixPQUFPLENBQUMsY0FBRCxDQUEvQjs7QUFDQVUsSUFBQUEsZUFBZSxDQUFDQyxtQkFBbUIsRUFBcEIsRUFBd0JiLGNBQXhCLEVBQXdDLEVBQXhDLENBQWY7QUFFQSxVQUFNYyxFQUFFLEdBQUliLEVBQUUsQ0FBQ2MsVUFBSCxDQUFlLFFBQU9WLFNBQVUsSUFBaEMsS0FBd0NXLElBQUksQ0FBQ0MsS0FBTCxDQUFXaEIsRUFBRSxDQUFDaUIsWUFBSCxDQUFpQixRQUFPYixTQUFVLElBQWxDLEVBQXVDLE9BQXZDLENBQVgsQ0FBeEMsSUFBdUcsRUFBbkg7QUFDQUQsSUFBQUEsT0FBTyxxQkFBUWUsa0JBQWtCLEVBQTFCLEVBQWlDbkIsY0FBakMsRUFBb0RjLEVBQXBELENBQVA7QUFFQVgsSUFBQUEsSUFBSSxHQUFHRCxPQUFPLENBQUUsS0FBSUcsU0FBVSxNQUFoQixDQUFQLENBQThCZSxlQUE5QixFQUFQO0FBQ0FqQixJQUFBQSxJQUFJLENBQUNrQixVQUFMLEdBQWtCLG9CQUFsQjtBQUNBbEIsSUFBQUEsSUFBSSxDQUFDbUIsR0FBTCxHQUFXQyxPQUFPLEVBQWxCO0FBQ0EsUUFBSUYsVUFBVSxHQUFHbEIsSUFBSSxDQUFDa0IsVUFBdEI7QUFDQSxRQUFJQyxHQUFHLEdBQUduQixJQUFJLENBQUNtQixHQUFmO0FBRUFFLElBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFVLHVCQUFWLENBQUo7QUFDQWEsSUFBQUEsSUFBSSxDQUFDYixPQUFELEVBQVcsZ0JBQWVVLFVBQVcsRUFBckMsQ0FBSjtBQUNBRyxJQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBVyxTQUFRVyxHQUFJLEVBQXZCLENBQUo7O0FBRUEsUUFBSWxCLE9BQU8sQ0FBQ3FCLFdBQVIsSUFBdUIsWUFBM0IsRUFBeUM7QUFDdkN0QixNQUFBQSxJQUFJLENBQUN1QixVQUFMLEdBQWtCLElBQWxCO0FBQ0F0QixNQUFBQSxPQUFPLENBQUN1QixPQUFSLEdBQWtCLElBQWxCO0FBQ0F2QixNQUFBQSxPQUFPLENBQUN3QixLQUFSLEdBQWdCLElBQWhCO0FBQ0QsS0FKRCxNQUtLO0FBQ0h6QixNQUFBQSxJQUFJLENBQUN1QixVQUFMLEdBQWtCLEtBQWxCO0FBQ0Q7O0FBRURHLElBQUFBLEdBQUcsQ0FBQ1AsR0FBRCxFQUFNUSxZQUFZLENBQUNULFVBQUQsRUFBYWhCLFNBQWIsQ0FBbEIsQ0FBSDs7QUFFQSxRQUFJQSxTQUFTLElBQUksT0FBYixJQUF3QkEsU0FBUyxJQUFJLE9BQXJDLElBQWdEQSxTQUFTLEtBQUssZUFBbEUsRUFBbUY7QUFDakYsVUFBSUYsSUFBSSxDQUFDdUIsVUFBTCxJQUFtQixJQUF2QixFQUE2QjtBQUMzQnZCLFFBQUFBLElBQUksQ0FBQzRCLFNBQUwsR0FBaUIsUUFBakI7QUFDQUYsUUFBQUEsR0FBRyxDQUFDUCxHQUFELEVBQU0sbUNBQW1DakIsU0FBekMsQ0FBSDtBQUNELE9BSEQsTUFJSztBQUNIRixRQUFBQSxJQUFJLENBQUM0QixTQUFMLEdBQWlCLFFBQWpCO0FBQ0FGLFFBQUFBLEdBQUcsQ0FBQ1AsR0FBRCxFQUFNLG9DQUFvQ2pCLFNBQTFDLENBQUg7QUFDRDtBQUNGLEtBVEQsTUFVSyxJQUFJRixJQUFJLENBQUN1QixVQUFMLElBQW1CLElBQXZCLEVBQTZCO0FBQ2hDLFVBQUloQixTQUFTLElBQUksS0FBakIsRUFBd0I7QUFDdEJQLFFBQUFBLElBQUksQ0FBQzRCLFNBQUwsR0FBaUIsUUFBakI7QUFDQUYsUUFBQUEsR0FBRyxDQUFDUCxHQUFELEVBQU0sbUNBQW1DakIsU0FBbkMsR0FBK0MsS0FBL0MsR0FBdURGLElBQUksQ0FBQzRCLFNBQWxFLENBQUg7O0FBQ0E3QixRQUFBQSxPQUFPLENBQUUsS0FBSUcsU0FBVSxNQUFoQixDQUFQLENBQThCMkIsT0FBOUIsQ0FBc0M3QixJQUF0QyxFQUE0Q0MsT0FBNUM7QUFDRCxPQUpELE1BS0s7QUFDSEQsUUFBQUEsSUFBSSxDQUFDNEIsU0FBTCxHQUFpQixRQUFqQjtBQUNBRixRQUFBQSxHQUFHLENBQUNQLEdBQUQsRUFBTSxxQ0FBcUNqQixTQUFyQyxHQUFpRCxLQUFqRCxHQUF5REYsSUFBSSxDQUFDNEIsU0FBcEUsQ0FBSDtBQUNEO0FBQ0YsS0FWSSxNQVdBO0FBQ0g1QixNQUFBQSxJQUFJLENBQUM0QixTQUFMLEdBQWlCLFFBQWpCO0FBQ0FGLE1BQUFBLEdBQUcsQ0FBQ1AsR0FBRCxFQUFNLG9DQUFvQ2pCLFNBQTFDLENBQUg7QUFDRDs7QUFDRG1CLElBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFVLGtCQUFrQlAsT0FBTyxDQUFDcUIsV0FBMUIsR0FBd0MsSUFBeEMsR0FBK0MsZUFBL0MsR0FBaUVyQixPQUFPLENBQUNNLFNBQW5GLENBQUo7QUFFQSxRQUFJdUIsU0FBUyxHQUFHO0FBQUU5QixNQUFBQSxJQUFJLEVBQUVBLElBQVI7QUFBY0MsTUFBQUEsT0FBTyxFQUFFQTtBQUF2QixLQUFoQjtBQUNBLFdBQU82QixTQUFQO0FBQ0QsR0FuRUQsQ0FvRUEsT0FBT0MsQ0FBUCxFQUFVO0FBQ1IsVUFBTSxtQkFBbUJBLENBQUMsQ0FBQ0MsUUFBRixFQUF6QjtBQUNEO0FBQ0YsQyxDQUVEOzs7QUFDTyxTQUFTQyxnQkFBVCxDQUEwQkMsUUFBMUIsRUFBb0NDLFdBQXBDLEVBQWlEbkMsSUFBakQsRUFBdURDLE9BQXZELEVBQWdFO0FBQ3JFLE1BQUk7QUFDRixRQUFJa0IsR0FBRyxHQUFHbkIsSUFBSSxDQUFDbUIsR0FBZjtBQUNBLFFBQUlYLE9BQU8sR0FBR1AsT0FBTyxDQUFDTyxPQUF0QjtBQUNBYSxJQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBVSwyQkFBVixDQUFKO0FBQ0FhLElBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFXLG1CQUFrQlAsT0FBTyxDQUFDbUMsTUFBUSxFQUE3QyxDQUFKO0FBQ0FmLElBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFXLGNBQWFSLElBQUksQ0FBQzRCLFNBQVUsRUFBdkMsQ0FBSjs7QUFFQSxRQUFJNUIsSUFBSSxDQUFDNEIsU0FBTCxLQUFtQixRQUFuQixJQUErQjVCLElBQUksQ0FBQzRCLFNBQUwsS0FBbUIsUUFBdEQsRUFBZ0U7QUFDOUQsVUFBSTNCLE9BQU8sQ0FBQ21DLE1BQVIsSUFBa0JqQyxTQUFsQixJQUErQkYsT0FBTyxDQUFDbUMsTUFBUixJQUFrQixJQUFqRCxJQUF5RG5DLE9BQU8sQ0FBQ21DLE1BQVIsSUFBa0IsRUFBL0UsRUFBbUY7QUFDakZWLFFBQUFBLEdBQUcsQ0FBQ1AsR0FBRCxFQUFPLG1CQUFrQmxCLE9BQU8sQ0FBQ21DLE1BQU8sRUFBeEMsQ0FBSDtBQUNBQyxRQUFBQSxTQUFTLENBQUNwQyxPQUFPLENBQUNtQyxNQUFULEVBQWlCLFVBQVVFLEdBQVYsRUFBZTtBQUN2QyxjQUFJQSxHQUFKLEVBQVM7QUFDUCxrQkFBTUEsR0FBTjtBQUNEOztBQUVEWixVQUFBQSxHQUFHLENBQUNQLEdBQUQsRUFBTyxvQkFBbUJsQixPQUFPLENBQUNtQyxNQUFPLEVBQXpDLENBQUg7QUFDRCxTQU5RLENBQVQ7QUFPRDtBQUNGO0FBQ0YsR0FuQkQsQ0FvQkEsT0FBTUwsQ0FBTixFQUFTO0FBQ1AsVUFBTSx1QkFBdUJBLENBQUMsQ0FBQ0MsUUFBRixFQUE3QjtBQUNEO0FBQ0YsQyxDQUVEOzs7QUFDTyxTQUFTTyxZQUFULENBQXNCTCxRQUF0QixFQUFnQ0MsV0FBaEMsRUFBNkNuQyxJQUE3QyxFQUFtREMsT0FBbkQsRUFBNEQ7QUFDakUsTUFBSTtBQUNGLFFBQUlrQixHQUFHLEdBQUduQixJQUFJLENBQUNtQixHQUFmO0FBQ0EsUUFBSVgsT0FBTyxHQUFHUCxPQUFPLENBQUNPLE9BQXRCO0FBQ0EsUUFBSU4sU0FBUyxHQUFHRCxPQUFPLENBQUNDLFNBQXhCO0FBQ0FtQixJQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBVSx1QkFBVixDQUFKOztBQUVBLFFBQUlOLFNBQVMsSUFBSSxPQUFqQixFQUEwQjtBQUN4QixVQUFJRCxPQUFPLENBQUNNLFNBQVIsS0FBc0IsS0FBdEIsSUFBK0JOLE9BQU8sQ0FBQ3FCLFdBQVIsS0FBd0IsWUFBM0QsRUFBeUU7QUFDdkUsWUFBSWtCLGFBQWEsR0FBRyxFQUFwQjs7QUFDQSxZQUFJeEMsSUFBSSxDQUFDNEIsU0FBTCxJQUFrQixRQUFsQixJQUErQjVCLElBQUksQ0FBQzRCLFNBQUwsSUFBa0IsUUFBbEIsSUFBOEIxQixTQUFTLEtBQUssZUFBL0UsRUFBaUc7QUFDL0ZzQyxVQUFBQSxhQUFhLEdBQUd6QyxPQUFPLENBQUUsS0FBSUcsU0FBVSxNQUFoQixDQUFQLENBQThCdUMsaUJBQTlCLENBQWdEekMsSUFBaEQsRUFBc0RDLE9BQXRELENBQWhCO0FBQ0Q7O0FBQ0RrQyxRQUFBQSxXQUFXLENBQUNPLEtBQVosQ0FBa0JDLGFBQWxCLENBQWdDQyxHQUFoQyxDQUFxQyxvQkFBckMsRUFBMERDLE1BQU0sSUFBSTtBQUNsRSxjQUFJQSxNQUFNLENBQUNDLFFBQVAsSUFBbUIsQ0FBQ0QsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxLQUFoQixDQUFzQixjQUF0QixDQUF4QixFQUErRDtBQUM3RCxnQkFBR0YsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxLQUFoQixDQUFzQixTQUF0QixLQUFvQyxJQUFwQyxJQUNFRixNQUFNLENBQUNHLE9BQVAsQ0FBZUMsTUFBZixDQUFzQkMsV0FBdEIsR0FBb0NDLFFBQXBDLENBQTZDLGNBQTdDLEtBQWdFLEtBRHJFLEVBRUU7QUFDQW5ELGNBQUFBLElBQUksQ0FBQ29ELElBQUwsR0FBWSxDQUNWLElBQUlwRCxJQUFJLENBQUNvRCxJQUFMLElBQWEsRUFBakIsQ0FEVSxFQUVWLEdBQUdyRCxPQUFPLENBQUUsS0FBSUcsU0FBVSxNQUFoQixDQUFQLENBQThCbUQsa0JBQTlCLENBQWlEUixNQUFqRCxFQUF5RDVDLE9BQXpELEVBQWtFa0MsV0FBbEUsRUFBK0VLLGFBQS9FLENBRk8sQ0FBWjtBQUdELGFBTkQsTUFPSztBQUNIeEMsY0FBQUEsSUFBSSxDQUFDb0QsSUFBTCxHQUFZLENBQ1YsSUFBSXBELElBQUksQ0FBQ29ELElBQUwsSUFBYSxFQUFqQixDQURVLEVBRVYsR0FBR3JELE9BQU8sQ0FBRSxLQUFJRyxTQUFVLE1BQWhCLENBQVAsQ0FBOEJtRCxrQkFBOUIsQ0FBaURSLE1BQWpELEVBQXlENUMsT0FBekQsRUFBa0VrQyxXQUFsRSxFQUErRUssYUFBL0UsQ0FGTyxDQUFaO0FBR0Q7QUFDRjtBQUNGLFNBZkQ7QUFnQkQ7O0FBQ0QsVUFBSXhDLElBQUksQ0FBQzRCLFNBQUwsSUFBa0IsUUFBdEIsRUFBZ0M7QUFDOUJPLFFBQUFBLFdBQVcsQ0FBQ08sS0FBWixDQUFrQlksYUFBbEIsQ0FBZ0NWLEdBQWhDLENBQXFDLG9CQUFyQyxFQUEwRFcsT0FBTyxJQUFJO0FBQ25FeEQsVUFBQUEsT0FBTyxDQUFFLEtBQUlHLFNBQVUsTUFBaEIsQ0FBUCxDQUE4QnNELHVCQUE5QixDQUFzRHhELElBQXRELEVBQTREQyxPQUE1RDtBQUNELFNBRkQ7QUFHRDs7QUFDRCxVQUFJRCxJQUFJLENBQUM0QixTQUFMLElBQWtCLFFBQWxCLElBQThCNUIsSUFBSSxDQUFDNEIsU0FBTCxJQUFrQixRQUFwRCxFQUE4RDtBQUM1RE8sUUFBQUEsV0FBVyxDQUFDTyxLQUFaLENBQWtCZSxxQ0FBbEIsQ0FBd0RiLEdBQXhELENBQTZELHFCQUE3RCxFQUFtRmMsSUFBRCxJQUFVO0FBQzFGLGdCQUFNQyxJQUFJLEdBQUc1RCxPQUFPLENBQUMsTUFBRCxDQUFwQjs7QUFDQSxjQUFJNkQsTUFBTSxHQUFHRCxJQUFJLENBQUNFLElBQUwsQ0FBVTdELElBQUksQ0FBQzhELE9BQWYsRUFBd0IsUUFBeEIsQ0FBYjtBQUNBLGNBQUlDLE9BQU8sR0FBR0osSUFBSSxDQUFDRSxJQUFMLENBQVU3RCxJQUFJLENBQUM4RCxPQUFmLEVBQXdCLFNBQXhCLENBQWQ7QUFDQUosVUFBQUEsSUFBSSxDQUFDTSxNQUFMLENBQVlDLEVBQVosQ0FBZUMsT0FBZixDQUF1Qk4sTUFBdkI7QUFDQUYsVUFBQUEsSUFBSSxDQUFDTSxNQUFMLENBQVlHLEdBQVosQ0FBZ0JELE9BQWhCLENBQXdCSCxPQUF4QjtBQUNBckMsVUFBQUEsR0FBRyxDQUFDUCxHQUFELEVBQU8sVUFBU3lDLE1BQU8sUUFBT0csT0FBUSxnQkFBdEMsQ0FBSDtBQUNELFNBUEQ7QUFRRDtBQUNGO0FBQ0YsR0E3Q0QsQ0E4Q0EsT0FBTWhDLENBQU4sRUFBUztBQUNQLFVBQU0sbUJBQW1CQSxDQUFDLENBQUNDLFFBQUYsRUFBekIsQ0FETyxDQUVYO0FBQ0E7QUFDRztBQUNGLEMsQ0FFRDs7O0FBQ08sU0FBU29DLGFBQVQsQ0FBdUJsQyxRQUF2QixFQUFpQ0MsV0FBakMsRUFBOENuQyxJQUE5QyxFQUFvREMsT0FBcEQsRUFBNkQ7QUFDbEUsTUFBSTtBQUNGLFFBQUlrQixHQUFHLEdBQUduQixJQUFJLENBQUNtQixHQUFmO0FBQ0EsUUFBSVgsT0FBTyxHQUFHUCxPQUFPLENBQUNPLE9BQXRCO0FBQ0EsUUFBSU4sU0FBUyxHQUFHRCxPQUFPLENBQUNDLFNBQXhCO0FBQ0FtQixJQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBVSx3QkFBVixDQUFKOztBQUNBLFFBQUlOLFNBQVMsSUFBSSxPQUFqQixFQUEwQjtBQUN4QkgsTUFBQUEsT0FBTyxDQUFFLGFBQUYsQ0FBUCxDQUF1QnFFLGFBQXZCLENBQXFDakMsV0FBckMsRUFBa0RuQyxJQUFsRCxFQUF3REMsT0FBeEQ7QUFDRCxLQUZELE1BR0s7QUFDSG9CLE1BQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFVLGdDQUFWLENBQUo7QUFDRDtBQUNGLEdBWEQsQ0FZQSxPQUFNdUIsQ0FBTixFQUFTO0FBQ1AsVUFBTSxvQkFBb0JBLENBQUMsQ0FBQ0MsUUFBRixFQUExQjtBQUNEO0FBQ0YsQyxDQUVEOzs7U0FDc0JxQyxLOztFQW1FdEI7Ozs7OzswQkFuRU8saUJBQXFCbkMsUUFBckIsRUFBK0JDLFdBQS9CLEVBQTRDbkMsSUFBNUMsRUFBa0RDLE9BQWxELEVBQTJEcUUsUUFBM0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUdYLFVBQUFBLElBRkgsR0FFVTVELE9BQU8sQ0FBQyxNQUFELENBRmpCO0FBR0NvQixVQUFBQSxHQUhELEdBR09uQixJQUFJLENBQUNtQixHQUhaO0FBSUNYLFVBQUFBLE9BSkQsR0FJV1AsT0FBTyxDQUFDTyxPQUpuQjtBQUtDK0QsVUFBQUEsSUFMRCxHQUtRdEUsT0FBTyxDQUFDc0UsSUFMaEI7QUFNQ3JFLFVBQUFBLFNBTkQsR0FNYUQsT0FBTyxDQUFDQyxTQU5yQjtBQU9IbUIsVUFBQUEsSUFBSSxDQUFDYixPQUFELEVBQVMsZ0JBQVQsQ0FBSjs7QUFQRyxnQkFRQytELElBQUksSUFBSSxLQVJUO0FBQUE7QUFBQTtBQUFBOztBQUFBLGdCQVNHdkUsSUFBSSxDQUFDNEIsU0FBTCxJQUFrQixRQUFsQixJQUE4QjVCLElBQUksQ0FBQzRCLFNBQUwsSUFBa0IsUUFUbkQ7QUFBQTtBQUFBO0FBQUE7O0FBVUs0QyxVQUFBQSxVQVZMLEdBVWtCYixJQUFJLENBQUNFLElBQUwsQ0FBVTNCLFFBQVEsQ0FBQ3NDLFVBQW5CLEVBQThCeEUsSUFBSSxDQUFDOEQsT0FBbkMsQ0FWbEI7O0FBV0MsY0FBSTVCLFFBQVEsQ0FBQ3NDLFVBQVQsS0FBd0IsR0FBeEIsSUFBK0J0QyxRQUFRLENBQUNqQyxPQUFULENBQWlCd0UsU0FBcEQsRUFBK0Q7QUFDN0RELFlBQUFBLFVBQVUsR0FBR2IsSUFBSSxDQUFDRSxJQUFMLENBQVUzQixRQUFRLENBQUNqQyxPQUFULENBQWlCd0UsU0FBakIsQ0FBMkJDLFdBQXJDLEVBQWtERixVQUFsRCxDQUFiO0FBQ0Q7O0FBQ0RuRCxVQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBUyxpQkFBaUJnRSxVQUExQixDQUFKO0FBQ0FuRCxVQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBUyxnQkFBZ0JOLFNBQXpCLENBQUo7O0FBQ0EsY0FBSUEsU0FBUyxJQUFJLE9BQWpCLEVBQTBCO0FBQ3hCeUUsWUFBQUEsZ0JBQWdCLENBQUN4RCxHQUFELEVBQU1uQixJQUFOLEVBQVlDLE9BQVosRUFBcUJ1RSxVQUFyQixFQUFpQ3JDLFdBQWpDLENBQWhCO0FBQ0Q7O0FBQ0d5QyxVQUFBQSxPQW5CTCxHQW1CZSxFQW5CZjs7QUFvQkMsY0FBSTNFLE9BQU8sQ0FBQ3dCLEtBQVIsSUFBaUIsS0FBakIsSUFBMEJ6QixJQUFJLENBQUN1QixVQUFMLElBQW1CLEtBQWpELEVBQ0U7QUFBQ3FELFlBQUFBLE9BQU8sR0FBRyxPQUFWO0FBQWtCLFdBRHJCLE1BR0U7QUFBQ0EsWUFBQUEsT0FBTyxHQUFHLE9BQVY7QUFBa0I7O0FBdkJ0QixnQkF3Qks1RSxJQUFJLENBQUM2RSxPQUFMLElBQWdCLElBeEJyQjtBQUFBO0FBQUE7QUFBQTs7QUF5Qk9DLFVBQUFBLEtBekJQLEdBeUJlLEVBekJmOztBQTBCRyxjQUFJN0UsT0FBTyxDQUFDOEUsT0FBUixJQUFtQjVFLFNBQW5CLElBQWdDRixPQUFPLENBQUM4RSxPQUFSLElBQW1CLEVBQW5ELElBQXlEOUUsT0FBTyxDQUFDOEUsT0FBUixJQUFtQixJQUFoRixFQUFzRjtBQUNwRixnQkFBSUgsT0FBTyxJQUFJLE9BQWYsRUFDRTtBQUFFRSxjQUFBQSxLQUFLLEdBQUcsQ0FBQyxLQUFELEVBQVFGLE9BQVIsRUFBaUIzRSxPQUFPLENBQUNxQixXQUF6QixDQUFSO0FBQStDLGFBRG5ELE1BR0U7QUFBRXdELGNBQUFBLEtBQUssR0FBRyxDQUFDLEtBQUQsRUFBUUYsT0FBUixFQUFpQixjQUFqQixFQUFpQyxPQUFqQyxFQUEwQzNFLE9BQU8sQ0FBQ3FCLFdBQWxELENBQVI7QUFBd0U7QUFDN0UsV0FMRCxNQU1LO0FBQ0gsZ0JBQUlzRCxPQUFPLElBQUksT0FBZixFQUNFO0FBQUNFLGNBQUFBLEtBQUssR0FBRyxDQUFDLEtBQUQsRUFBUUYsT0FBUixFQUFpQjNFLE9BQU8sQ0FBQzhFLE9BQXpCLEVBQWtDOUUsT0FBTyxDQUFDcUIsV0FBMUMsQ0FBUjtBQUErRCxhQURsRSxNQUdFO0FBQUN3RCxjQUFBQSxLQUFLLEdBQUcsQ0FBQyxLQUFELEVBQVFGLE9BQVIsRUFBaUIsY0FBakIsRUFBaUMsT0FBakMsRUFBMEMzRSxPQUFPLENBQUM4RSxPQUFsRCxFQUEyRDlFLE9BQU8sQ0FBQ3FCLFdBQW5FLENBQVI7QUFBd0Y7QUFDNUY7O0FBckNKLGdCQXNDT3RCLElBQUksQ0FBQ2dGLFlBQUwsSUFBcUIsS0F0QzVCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsaUJBdUNXQyxlQUFlLENBQUM5RCxHQUFELEVBQU1nQixXQUFOLEVBQW1CcUMsVUFBbkIsRUFBK0JNLEtBQS9CLEVBQXNDOUUsSUFBdEMsRUFBNENDLE9BQTVDLENBdkMxQjs7QUFBQTtBQXdDS0QsVUFBQUEsSUFBSSxDQUFDZ0YsWUFBTCxHQUFvQixJQUFwQjs7QUF4Q0w7QUEwQ0dWLFVBQUFBLFFBQVE7QUExQ1g7QUFBQTs7QUFBQTtBQTZDR0EsVUFBQUEsUUFBUTs7QUE3Q1g7QUFBQTtBQUFBOztBQUFBO0FBaURDakQsVUFBQUEsSUFBSSxDQUFDYixPQUFELEVBQVMsa0JBQVQsQ0FBSjtBQUNBOEQsVUFBQUEsUUFBUTs7QUFsRFQ7QUFBQTtBQUFBOztBQUFBO0FBc0REakQsVUFBQUEsSUFBSSxDQUFDYixPQUFELEVBQVMsWUFBVCxDQUFKO0FBQ0E4RCxVQUFBQSxRQUFROztBQXZEUDtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBMkRIQSxVQUFBQSxRQUFRO0FBM0RMLGdCQTRERyxZQUFZLFlBQUV0QyxRQUFGLEVBNURmOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOzs7O0FBb0VBLFNBQVNrRCxLQUFULENBQWVDLEtBQWYsRUFBc0JuRixJQUF0QixFQUE0QkMsT0FBNUIsRUFBcUM7QUFDMUMsTUFBSTtBQUNGLFFBQUlPLE9BQU8sR0FBR1AsT0FBTyxDQUFDTyxPQUF0QjtBQUNBLFFBQUlOLFNBQVMsR0FBR0QsT0FBTyxDQUFDQyxTQUF4QjtBQUNBbUIsSUFBQUEsSUFBSSxDQUFDYixPQUFELEVBQVMsZ0JBQVQsQ0FBSjs7QUFDQSxRQUFJMkUsS0FBSyxDQUFDaEQsV0FBTixDQUFrQmlELE1BQWxCLElBQTRCRCxLQUFLLENBQUNoRCxXQUFOLENBQWtCaUQsTUFBbEIsQ0FBeUJDLE1BQXpELEVBQWlFO0FBQ2pFO0FBQ0UsWUFBSUMsS0FBSyxHQUFHdkYsT0FBTyxDQUFDLE9BQUQsQ0FBbkI7O0FBQ0F3RixRQUFBQSxPQUFPLENBQUM3RCxHQUFSLENBQVk0RCxLQUFLLENBQUNFLEdBQU4sQ0FBVSw0Q0FBVixDQUFaO0FBQ0FELFFBQUFBLE9BQU8sQ0FBQzdELEdBQVIsQ0FBWXlELEtBQUssQ0FBQ2hELFdBQU4sQ0FBa0JpRCxNQUFsQixDQUF5QixDQUF6QixDQUFaO0FBQ0FHLFFBQUFBLE9BQU8sQ0FBQzdELEdBQVIsQ0FBWTRELEtBQUssQ0FBQ0UsR0FBTixDQUFVLDRDQUFWLENBQVo7QUFDQUMsUUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsQ0FBYjtBQUNELE9BWEMsQ0FhRjs7O0FBQ0EsUUFBSTFGLElBQUksQ0FBQ3VCLFVBQUwsSUFBbUIsSUFBbkIsSUFBMkJ0QixPQUFPLENBQUNNLFNBQVIsSUFBcUIsSUFBaEQsSUFBd0RMLFNBQVMsSUFBSSxTQUF6RSxFQUFvRjtBQUNsRkgsTUFBQUEsT0FBTyxDQUFFLEtBQUlFLE9BQU8sQ0FBQ0MsU0FBVSxNQUF4QixDQUFQLENBQXNDeUYsTUFBdEMsQ0FBNkMzRixJQUE3QyxFQUFtREMsT0FBbkQ7QUFDRDs7QUFDRCxRQUFJO0FBQ0YsVUFBR0EsT0FBTyxDQUFDdUIsT0FBUixJQUFtQixLQUFuQixJQUE0QnZCLE9BQU8sQ0FBQ3dCLEtBQVIsSUFBaUIsS0FBN0MsSUFBc0R6QixJQUFJLENBQUN1QixVQUFMLElBQW1CLEtBQTVFLEVBQW1GO0FBQ2pGLFlBQUl2QixJQUFJLENBQUM0RixZQUFMLElBQXFCLENBQXpCLEVBQTRCO0FBQzFCLGNBQUlDLEdBQUcsR0FBRyxzQkFBc0I1RixPQUFPLENBQUM2RixJQUF4Qzs7QUFDQS9GLFVBQUFBLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0IyQixHQUF4QixDQUE0QjFCLElBQUksQ0FBQ21CLEdBQWpDLEVBQXVDLHNCQUFxQjBFLEdBQUksRUFBaEU7O0FBQ0E3RixVQUFBQSxJQUFJLENBQUM0RixZQUFMOztBQUNBLGdCQUFNRyxHQUFHLEdBQUdoRyxPQUFPLENBQUMsS0FBRCxDQUFuQjs7QUFDQWdHLFVBQUFBLEdBQUcsQ0FBQ0YsR0FBRCxDQUFIO0FBQ0Q7QUFDRjtBQUNGLEtBVkQsQ0FXQSxPQUFPOUQsQ0FBUCxFQUFVO0FBQ1J3RCxNQUFBQSxPQUFPLENBQUM3RCxHQUFSLENBQVlLLENBQVo7QUFDRDs7QUFDRCxRQUFJL0IsSUFBSSxDQUFDNEIsU0FBTCxJQUFrQixRQUF0QixFQUFnQztBQUM5QixVQUFJNUIsSUFBSSxDQUFDdUIsVUFBTCxJQUFtQixJQUF2QixFQUE2QjtBQUMzQnhCLFFBQUFBLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0IyQixHQUF4QixDQUE0QjFCLElBQUksQ0FBQ21CLEdBQWpDLEVBQXVDLCtCQUE4QmpCLFNBQVUsRUFBL0U7QUFDRCxPQUZELE1BR0s7QUFDSEgsUUFBQUEsT0FBTyxDQUFDLGNBQUQsQ0FBUCxDQUF3QjJCLEdBQXhCLENBQTRCMUIsSUFBSSxDQUFDbUIsR0FBakMsRUFBdUMsZ0NBQStCakIsU0FBVSxFQUFoRjtBQUNEO0FBQ0Y7O0FBQ0QsUUFBSUYsSUFBSSxDQUFDNEIsU0FBTCxJQUFrQixRQUF0QixFQUFnQztBQUM5QjdCLE1BQUFBLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0IyQixHQUF4QixDQUE0QjFCLElBQUksQ0FBQ21CLEdBQWpDLEVBQXVDLCtCQUE4QmpCLFNBQVUsRUFBL0U7QUFDRDtBQUNGLEdBMUNELENBMkNBLE9BQU02QixDQUFOLEVBQVM7QUFDWDtBQUNJLFVBQU0sWUFBWUEsQ0FBQyxDQUFDQyxRQUFGLEVBQWxCO0FBQ0Q7QUFDRixDLENBRUQ7OztBQUNPLFNBQVMyQyxnQkFBVCxDQUEwQnhELEdBQTFCLEVBQStCbkIsSUFBL0IsRUFBcUNDLE9BQXJDLEVBQThDK0YsTUFBOUMsRUFBc0Q3RCxXQUF0RCxFQUFtRTtBQUN4RSxNQUFJO0FBQ0YsUUFBSTNCLE9BQU8sR0FBR1AsT0FBTyxDQUFDTyxPQUF0QjtBQUNBLFFBQUl5RixRQUFRLEdBQUdoRyxPQUFPLENBQUNnRyxRQUF2QjtBQUNBLFFBQUlDLE9BQU8sR0FBR2pHLE9BQU8sQ0FBQ2lHLE9BQXRCO0FBQ0EsUUFBSUMsS0FBSyxHQUFHbEcsT0FBTyxDQUFDa0csS0FBcEI7QUFDQTlFLElBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFTLDJCQUFULENBQUo7O0FBQ0EsVUFBTTRGLE1BQU0sR0FBR3JHLE9BQU8sQ0FBQyxRQUFELENBQXRCOztBQUNBLFVBQU1zRyxNQUFNLEdBQUd0RyxPQUFPLENBQUMsUUFBRCxDQUF0Qjs7QUFDQSxVQUFNdUcsR0FBRyxHQUFHdkcsT0FBTyxDQUFDLFVBQUQsQ0FBbkI7O0FBQ0EsVUFBTUQsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxVQUFNNEQsSUFBSSxHQUFHNUQsT0FBTyxDQUFDLE1BQUQsQ0FBcEI7O0FBQ0FvRyxJQUFBQSxLQUFLLEdBQUdBLEtBQUssS0FBS0QsT0FBTyxLQUFLLFNBQVosR0FBd0IsY0FBeEIsR0FBeUMsZ0JBQTlDLENBQWI7QUFDQTdFLElBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFTLGdCQUFnQlIsSUFBSSxDQUFDdUcsU0FBOUIsQ0FBSjs7QUFDQSxRQUFJdkcsSUFBSSxDQUFDdUcsU0FBVCxFQUFvQjtBQUNsQkgsTUFBQUEsTUFBTSxDQUFDSSxJQUFQLENBQVlSLE1BQVo7QUFDQUssTUFBQUEsTUFBTSxDQUFDRyxJQUFQLENBQVlSLE1BQVo7O0FBQ0EsWUFBTVMsUUFBUSxHQUFHMUcsT0FBTyxDQUFDLGFBQUQsQ0FBUCxDQUF1QjBHLFFBQXhDOztBQUNBLFlBQU1DLGFBQWEsR0FBRzNHLE9BQU8sQ0FBQyxhQUFELENBQVAsQ0FBdUIyRyxhQUE3Qzs7QUFDQSxZQUFNQyxtQkFBbUIsR0FBRzVHLE9BQU8sQ0FBQyxhQUFELENBQVAsQ0FBdUI0RyxtQkFBbkQ7O0FBQ0EsWUFBTUMsc0JBQXNCLEdBQUc3RyxPQUFPLENBQUMsYUFBRCxDQUFQLENBQXVCNkcsc0JBQXREOztBQUNBOUcsTUFBQUEsRUFBRSxDQUFDK0csYUFBSCxDQUFpQmxELElBQUksQ0FBQ0UsSUFBTCxDQUFVbUMsTUFBVixFQUFrQixXQUFsQixDQUFqQixFQUFpRFMsUUFBUSxDQUFDekcsSUFBSSxDQUFDdUIsVUFBTixFQUFrQnRCLE9BQWxCLEVBQTJCK0YsTUFBM0IsQ0FBekQsRUFBNkYsTUFBN0Y7QUFDQWxHLE1BQUFBLEVBQUUsQ0FBQytHLGFBQUgsQ0FBaUJsRCxJQUFJLENBQUNFLElBQUwsQ0FBVW1DLE1BQVYsRUFBa0IsVUFBbEIsQ0FBakIsRUFBZ0RVLGFBQWEsQ0FBQ1AsS0FBRCxFQUFRRixRQUFSLEVBQWtCQyxPQUFsQixFQUEyQmpHLE9BQTNCLEVBQW9DK0YsTUFBcEMsQ0FBN0QsRUFBMEcsTUFBMUc7QUFDQWxHLE1BQUFBLEVBQUUsQ0FBQytHLGFBQUgsQ0FBaUJsRCxJQUFJLENBQUNFLElBQUwsQ0FBVW1DLE1BQVYsRUFBa0Isc0JBQWxCLENBQWpCLEVBQTREWSxzQkFBc0IsQ0FBQzNHLE9BQUQsRUFBVStGLE1BQVYsQ0FBbEYsRUFBcUcsTUFBckc7QUFDQWxHLE1BQUFBLEVBQUUsQ0FBQytHLGFBQUgsQ0FBaUJsRCxJQUFJLENBQUNFLElBQUwsQ0FBVW1DLE1BQVYsRUFBa0IsZ0JBQWxCLENBQWpCLEVBQXNEVyxtQkFBbUIsQ0FBQzFHLE9BQUQsRUFBVStGLE1BQVYsQ0FBekUsRUFBNEYsTUFBNUY7QUFDQSxVQUFJOUYsU0FBUyxHQUFHRixJQUFJLENBQUNFLFNBQXJCLENBWGtCLENBWWxCOztBQUNBLFVBQUlKLEVBQUUsQ0FBQ2MsVUFBSCxDQUFjK0MsSUFBSSxDQUFDRSxJQUFMLENBQVU0QixPQUFPLENBQUNxQixHQUFSLEVBQVYsRUFBeUIsT0FBTTVHLFNBQVUsTUFBekMsQ0FBZCxDQUFKLEVBQW9FO0FBQ2xFLFlBQUk2RyxRQUFRLEdBQUdwRCxJQUFJLENBQUNFLElBQUwsQ0FBVTRCLE9BQU8sQ0FBQ3FCLEdBQVIsRUFBVixFQUEwQixPQUFNNUcsU0FBVSxNQUExQyxDQUFmO0FBQ0EsWUFBSThHLE1BQU0sR0FBR3JELElBQUksQ0FBQ0UsSUFBTCxDQUFVbUMsTUFBVixFQUFrQixJQUFsQixDQUFiO0FBQ0FNLFFBQUFBLEdBQUcsQ0FBQ1csUUFBSixDQUFhRixRQUFiLEVBQXVCQyxNQUF2QjtBQUNBdEYsUUFBQUEsR0FBRyxDQUFDUCxHQUFELEVBQU0sa0JBQWtCNEYsUUFBUSxDQUFDRyxPQUFULENBQWlCekIsT0FBTyxDQUFDcUIsR0FBUixFQUFqQixFQUFnQyxFQUFoQyxDQUFsQixHQUF3RCxPQUF4RCxHQUFrRUUsTUFBTSxDQUFDRSxPQUFQLENBQWV6QixPQUFPLENBQUNxQixHQUFSLEVBQWYsRUFBOEIsRUFBOUIsQ0FBeEUsQ0FBSDtBQUNEOztBQUNELFVBQUloSCxFQUFFLENBQUNjLFVBQUgsQ0FBYytDLElBQUksQ0FBQ0UsSUFBTCxDQUFVNEIsT0FBTyxDQUFDcUIsR0FBUixFQUFWLEVBQXlCLE9BQU01RyxTQUFVLFlBQXpDLENBQWQsQ0FBSixFQUEwRTtBQUN4RSxZQUFJNkcsUUFBUSxHQUFHcEQsSUFBSSxDQUFDRSxJQUFMLENBQVU0QixPQUFPLENBQUNxQixHQUFSLEVBQVYsRUFBMEIsT0FBTTVHLFNBQVUsWUFBMUMsQ0FBZjtBQUNBLFlBQUk4RyxNQUFNLEdBQUdyRCxJQUFJLENBQUNFLElBQUwsQ0FBVW1DLE1BQVYsRUFBa0IsVUFBbEIsQ0FBYjtBQUNBTSxRQUFBQSxHQUFHLENBQUNXLFFBQUosQ0FBYUYsUUFBYixFQUF1QkMsTUFBdkI7QUFDQXRGLFFBQUFBLEdBQUcsQ0FBQ1AsR0FBRCxFQUFNLGFBQWE0RixRQUFRLENBQUNHLE9BQVQsQ0FBaUJ6QixPQUFPLENBQUNxQixHQUFSLEVBQWpCLEVBQWdDLEVBQWhDLENBQWIsR0FBbUQsT0FBbkQsR0FBNkRFLE1BQU0sQ0FBQ0UsT0FBUCxDQUFlekIsT0FBTyxDQUFDcUIsR0FBUixFQUFmLEVBQThCLEVBQTlCLENBQW5FLENBQUg7QUFDRDs7QUFDRCxVQUFJaEgsRUFBRSxDQUFDYyxVQUFILENBQWMrQyxJQUFJLENBQUNFLElBQUwsQ0FBVTRCLE9BQU8sQ0FBQ3FCLEdBQVIsRUFBVixFQUF5QixPQUFNNUcsU0FBVSxhQUF6QyxDQUFkLENBQUosRUFBMkU7QUFDekUsWUFBSTZHLFFBQVEsR0FBR3BELElBQUksQ0FBQ0UsSUFBTCxDQUFVNEIsT0FBTyxDQUFDcUIsR0FBUixFQUFWLEVBQTBCLE9BQU01RyxTQUFVLGFBQTFDLENBQWY7QUFDQSxZQUFJOEcsTUFBTSxHQUFHckQsSUFBSSxDQUFDRSxJQUFMLENBQVVtQyxNQUFWLEVBQWtCLFdBQWxCLENBQWI7QUFDQU0sUUFBQUEsR0FBRyxDQUFDVyxRQUFKLENBQWFGLFFBQWIsRUFBdUJDLE1BQXZCO0FBQ0F0RixRQUFBQSxHQUFHLENBQUNQLEdBQUQsRUFBTSxhQUFhNEYsUUFBUSxDQUFDRyxPQUFULENBQWlCekIsT0FBTyxDQUFDcUIsR0FBUixFQUFqQixFQUFnQyxFQUFoQyxDQUFiLEdBQW1ELE9BQW5ELEdBQTZERSxNQUFNLENBQUNFLE9BQVAsQ0FBZXpCLE9BQU8sQ0FBQ3FCLEdBQVIsRUFBZixFQUE4QixFQUE5QixDQUFuRSxDQUFIO0FBQ0Q7O0FBQ0QsVUFBSWhILEVBQUUsQ0FBQ2MsVUFBSCxDQUFjK0MsSUFBSSxDQUFDRSxJQUFMLENBQVU0QixPQUFPLENBQUNxQixHQUFSLEVBQVYsRUFBd0IsWUFBeEIsQ0FBZCxDQUFKLEVBQTBEO0FBQ3hELFlBQUlLLGFBQWEsR0FBR3hELElBQUksQ0FBQ0UsSUFBTCxDQUFVNEIsT0FBTyxDQUFDcUIsR0FBUixFQUFWLEVBQXlCLFlBQXpCLENBQXBCO0FBQ0EsWUFBSU0sV0FBVyxHQUFHekQsSUFBSSxDQUFDRSxJQUFMLENBQVVtQyxNQUFWLEVBQWtCLGNBQWxCLENBQWxCO0FBQ0FNLFFBQUFBLEdBQUcsQ0FBQ1csUUFBSixDQUFhRSxhQUFiLEVBQTRCQyxXQUE1QjtBQUNBMUYsUUFBQUEsR0FBRyxDQUFDUCxHQUFELEVBQU0sYUFBYWdHLGFBQWEsQ0FBQ0QsT0FBZCxDQUFzQnpCLE9BQU8sQ0FBQ3FCLEdBQVIsRUFBdEIsRUFBcUMsRUFBckMsQ0FBYixHQUF3RCxPQUF4RCxHQUFrRU0sV0FBVyxDQUFDRixPQUFaLENBQW9CekIsT0FBTyxDQUFDcUIsR0FBUixFQUFwQixFQUFtQyxFQUFuQyxDQUF4RSxDQUFIO0FBQ0Q7QUFDRjs7QUFDRDlHLElBQUFBLElBQUksQ0FBQ3VHLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxRQUFJdEMsRUFBRSxHQUFHLEVBQVQ7O0FBQ0EsUUFBSWpFLElBQUksQ0FBQ3VCLFVBQVQsRUFBcUI7QUFDbkJ2QixNQUFBQSxJQUFJLENBQUNvRCxJQUFMLEdBQVlwRCxJQUFJLENBQUNvRCxJQUFMLENBQVVpRSxNQUFWLENBQWlCLFVBQVNDLEtBQVQsRUFBZ0JDLEtBQWhCLEVBQXNCO0FBQUUsZUFBT3ZILElBQUksQ0FBQ29ELElBQUwsQ0FBVW9FLE9BQVYsQ0FBa0JGLEtBQWxCLEtBQTRCQyxLQUFuQztBQUEwQyxPQUFuRixDQUFaO0FBQ0F0RCxNQUFBQSxFQUFFLEdBQUdqRSxJQUFJLENBQUNvRCxJQUFMLENBQVVTLElBQVYsQ0FBZSxLQUFmLENBQUw7QUFDRCxLQUhELE1BSUs7QUFDSEksTUFBQUEsRUFBRSxHQUFJLDZDQUFOO0FBQ0Q7O0FBQ0QsUUFBSWpFLElBQUksQ0FBQ3lILFFBQUwsS0FBa0IsSUFBbEIsSUFBMEJ4RCxFQUFFLEtBQUtqRSxJQUFJLENBQUN5SCxRQUExQyxFQUFvRDtBQUNsRHpILE1BQUFBLElBQUksQ0FBQ3lILFFBQUwsR0FBZ0J4RCxFQUFoQjtBQUNBLFlBQU13RCxRQUFRLEdBQUc5RCxJQUFJLENBQUNFLElBQUwsQ0FBVW1DLE1BQVYsRUFBa0IsYUFBbEIsQ0FBakI7QUFDQWxHLE1BQUFBLEVBQUUsQ0FBQytHLGFBQUgsQ0FBaUJZLFFBQWpCLEVBQTJCeEQsRUFBM0IsRUFBK0IsTUFBL0I7QUFDQWpFLE1BQUFBLElBQUksQ0FBQzZFLE9BQUwsR0FBZSxJQUFmO0FBQ0EsVUFBSTZDLFNBQVMsR0FBRzFCLE1BQU0sQ0FBQ2tCLE9BQVAsQ0FBZXpCLE9BQU8sQ0FBQ3FCLEdBQVIsRUFBZixFQUE4QixFQUE5QixDQUFoQjs7QUFDQSxVQUFJWSxTQUFTLENBQUNDLElBQVYsTUFBb0IsRUFBeEIsRUFBNEI7QUFBQ0QsUUFBQUEsU0FBUyxHQUFHLElBQVo7QUFBaUI7O0FBQzlDaEcsTUFBQUEsR0FBRyxDQUFDUCxHQUFELEVBQU0sNkJBQTZCdUcsU0FBbkMsQ0FBSDtBQUNELEtBUkQsTUFTSztBQUNIMUgsTUFBQUEsSUFBSSxDQUFDNkUsT0FBTCxHQUFlLEtBQWY7QUFDQW5ELE1BQUFBLEdBQUcsQ0FBQ1AsR0FBRCxFQUFNLHdCQUFOLENBQUg7QUFDRDtBQUNGLEdBekVELENBMEVBLE9BQU1ZLENBQU4sRUFBUztBQUNQaEMsSUFBQUEsT0FBTyxDQUFDLGNBQUQsQ0FBUCxDQUF3QnNCLElBQXhCLENBQTZCcEIsT0FBTyxDQUFDTyxPQUFyQyxFQUE2Q3VCLENBQTdDOztBQUNBSSxJQUFBQSxXQUFXLENBQUNpRCxNQUFaLENBQW1CL0UsSUFBbkIsQ0FBd0IsdUJBQXVCMEIsQ0FBL0M7QUFDRDtBQUNGLEMsQ0FFRDs7O0FBQ08sU0FBU2tELGVBQVQsQ0FBeUI5RCxHQUF6QixFQUE4QmdCLFdBQTlCLEVBQTJDcUMsVUFBM0MsRUFBdURNLEtBQXZELEVBQThEOUUsSUFBOUQsRUFBb0VDLE9BQXBFLEVBQTZFO0FBQ3BGO0FBQ0ksTUFBSU8sT0FBTyxHQUFHUCxPQUFPLENBQUNPLE9BQXRCOztBQUNBLFFBQU1WLEVBQUUsR0FBR0MsT0FBTyxDQUFDLElBQUQsQ0FBbEI7O0FBQ0FzQixFQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBUywwQkFBVCxDQUFKO0FBQ0EsTUFBSW9ILE1BQUo7O0FBQVksTUFBSTtBQUFFQSxJQUFBQSxNQUFNLEdBQUc3SCxPQUFPLENBQUMsYUFBRCxDQUFoQjtBQUFpQyxHQUF2QyxDQUF3QyxPQUFPZ0MsQ0FBUCxFQUFVO0FBQUU2RixJQUFBQSxNQUFNLEdBQUcsUUFBVDtBQUFtQjs7QUFDbkYsTUFBSTlILEVBQUUsQ0FBQ2MsVUFBSCxDQUFjZ0gsTUFBZCxDQUFKLEVBQTJCO0FBQ3pCdkcsSUFBQUEsSUFBSSxDQUFDYixPQUFELEVBQVMsc0JBQVQsQ0FBSjtBQUNELEdBRkQsTUFHSztBQUNIYSxJQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBUyw4QkFBVCxDQUFKO0FBQ0Q7O0FBQ0QsU0FBTyxJQUFJcUgsT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUN0QyxVQUFNQyxXQUFXLEdBQUcsTUFBTTtBQUN4QjNHLE1BQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFTLGFBQVQsQ0FBSjtBQUNBc0gsTUFBQUEsT0FBTztBQUNSLEtBSEQ7O0FBSUEsUUFBSUcsSUFBSSxHQUFHO0FBQUVuQixNQUFBQSxHQUFHLEVBQUV0QyxVQUFQO0FBQW1CMEQsTUFBQUEsTUFBTSxFQUFFLElBQTNCO0FBQWlDQyxNQUFBQSxLQUFLLEVBQUUsTUFBeEM7QUFBZ0RDLE1BQUFBLFFBQVEsRUFBRTtBQUExRCxLQUFYOztBQUNBQyxJQUFBQSxhQUFhLENBQUNsSCxHQUFELEVBQU15RyxNQUFOLEVBQWM5QyxLQUFkLEVBQXFCbUQsSUFBckIsRUFBMkI5RixXQUEzQixFQUF3Q25DLElBQXhDLEVBQThDQyxPQUE5QyxDQUFiLENBQW9FcUksSUFBcEUsQ0FDRSxZQUFXO0FBQUVOLE1BQUFBLFdBQVc7QUFBSSxLQUQ5QixFQUVFLFVBQVNPLE1BQVQsRUFBaUI7QUFBRVIsTUFBQUEsTUFBTSxDQUFDUSxNQUFELENBQU47QUFBZ0IsS0FGckM7QUFJRCxHQVZNLENBQVAsQ0FaZ0YsQ0F1QmxGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0QsQyxDQUVEOzs7U0FDc0JGLGE7O0VBMkV0Qjs7Ozs7OzBCQTNFTyxrQkFBOEJsSCxHQUE5QixFQUFtQ3lELE9BQW5DLEVBQTRDRSxLQUE1QyxFQUFtRG1ELElBQW5ELEVBQXlEOUYsV0FBekQsRUFBc0VuQyxJQUF0RSxFQUE0RUMsT0FBNUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNQO0FBQ1FPLFVBQUFBLE9BRkQsR0FFV1AsT0FBTyxDQUFDTyxPQUZuQjtBQUdDTixVQUFBQSxTQUhELEdBR2FELE9BQU8sQ0FBQ0MsU0FIckIsRUFJSDs7QUFDTXNJLFVBQUFBLGVBTEgsR0FLcUIsQ0FBQyxlQUFELEVBQWtCLGVBQWxCLEVBQW1DLGNBQW5DLEVBQW1ELGtCQUFuRCxFQUF1RSx3QkFBdkUsRUFBaUcsOEJBQWpHLEVBQWlJLE9BQWpJLEVBQTBJLE9BQTFJLEVBQW1KLGVBQW5KLEVBQW9LLHFCQUFwSyxFQUEyTCxlQUEzTCxFQUE0TSx1QkFBNU0sQ0FMckI7QUFNQ0MsVUFBQUEsVUFORCxHQU1jRCxlQU5kO0FBT0NsRCxVQUFBQSxLQVBELEdBT1N2RixPQUFPLENBQUMsT0FBRCxDQVBoQjtBQVFHMkksVUFBQUEsVUFSSCxHQVFnQjNJLE9BQU8sQ0FBQyxhQUFELENBUnZCO0FBU0hzQixVQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBVSx3QkFBVixDQUFKO0FBVEc7QUFBQSxpQkFVRyxJQUFJcUgsT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUNyQzFHLFlBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFVLGFBQVlvRSxPQUFRLEVBQTlCLENBQUo7QUFDQXZELFlBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFXLFdBQVVzRSxLQUFNLEVBQTNCLENBQUo7QUFDQXpELFlBQUFBLElBQUksQ0FBQ2IsT0FBRCxFQUFXLFVBQVNLLElBQUksQ0FBQzhILFNBQUwsQ0FBZVYsSUFBZixDQUFxQixFQUF6QyxDQUFKO0FBQ0EsZ0JBQUlXLEtBQUssR0FBR0YsVUFBVSxDQUFDOUQsT0FBRCxFQUFVRSxLQUFWLEVBQWlCbUQsSUFBakIsQ0FBdEI7QUFDQVcsWUFBQUEsS0FBSyxDQUFDQyxFQUFOLENBQVMsT0FBVCxFQUFrQixDQUFDQyxJQUFELEVBQU9DLE1BQVAsS0FBa0I7QUFDbEMxSCxjQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBVyxZQUFELEdBQWVzSSxJQUF6QixDQUFKOztBQUNBLGtCQUFHQSxJQUFJLEtBQUssQ0FBWixFQUFlO0FBQUVoQixnQkFBQUEsT0FBTyxDQUFDLENBQUQsQ0FBUDtBQUFZLGVBQTdCLE1BQ0s7QUFBRTNGLGdCQUFBQSxXQUFXLENBQUNpRCxNQUFaLENBQW1CL0UsSUFBbkIsQ0FBeUIsSUFBSTJJLEtBQUosQ0FBVUYsSUFBVixDQUF6QjtBQUE0Q2hCLGdCQUFBQSxPQUFPLENBQUMsQ0FBRCxDQUFQO0FBQVk7QUFDaEUsYUFKRDtBQUtBYyxZQUFBQSxLQUFLLENBQUNDLEVBQU4sQ0FBUyxPQUFULEVBQW1CSSxLQUFELElBQVc7QUFDM0I1SCxjQUFBQSxJQUFJLENBQUNiLE9BQUQsRUFBVyxVQUFYLENBQUo7QUFDQTJCLGNBQUFBLFdBQVcsQ0FBQ2lELE1BQVosQ0FBbUIvRSxJQUFuQixDQUF3QjRJLEtBQXhCO0FBQ0FuQixjQUFBQSxPQUFPLENBQUMsQ0FBRCxDQUFQO0FBQ0QsYUFKRDtBQUtBYyxZQUFBQSxLQUFLLENBQUNNLE1BQU4sQ0FBYUwsRUFBYixDQUFnQixNQUFoQixFQUF5Qm5GLElBQUQsSUFBVTtBQUNoQyxrQkFBSXlGLEdBQUcsR0FBR3pGLElBQUksQ0FBQzFCLFFBQUwsR0FBZ0JrRixPQUFoQixDQUF3QixXQUF4QixFQUFxQyxHQUFyQyxFQUEwQ1MsSUFBMUMsRUFBVjtBQUNBdEcsY0FBQUEsSUFBSSxDQUFDYixPQUFELEVBQVcsR0FBRTJJLEdBQUksRUFBakIsQ0FBSjs7QUFDQSxrQkFBSXpGLElBQUksSUFBSUEsSUFBSSxDQUFDMUIsUUFBTCxHQUFnQmUsS0FBaEIsQ0FBc0IsbUNBQXRCLENBQVosRUFBd0U7QUFFdEUsc0JBQU1qRCxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBLG9CQUFJcUosUUFBUSxHQUFHM0QsT0FBTyxDQUFDcUIsR0FBUixLQUFnQjlHLElBQUksQ0FBQ3FKLFNBQXBDOztBQUNBLG9CQUFJO0FBQ0Ysc0JBQUlDLENBQUMsR0FBRyxJQUFJQyxJQUFKLEdBQVdDLGNBQVgsRUFBUjtBQUNBLHNCQUFJOUYsSUFBSSxHQUFHNUQsRUFBRSxDQUFDaUIsWUFBSCxDQUFnQnFJLFFBQWhCLENBQVg7QUFDQXRKLGtCQUFBQSxFQUFFLENBQUMrRyxhQUFILENBQWlCdUMsUUFBakIsRUFBMkIsT0FBT0UsQ0FBbEMsRUFBcUMsTUFBckM7QUFDQWpJLGtCQUFBQSxJQUFJLENBQUNGLEdBQUQsRUFBTyxZQUFXaUksUUFBUyxFQUEzQixDQUFKO0FBQ0QsaUJBTEQsQ0FNQSxPQUFNckgsQ0FBTixFQUFTO0FBQ1BWLGtCQUFBQSxJQUFJLENBQUNGLEdBQUQsRUFBTyxnQkFBZWlJLFFBQVMsRUFBL0IsQ0FBSjtBQUNEOztBQUVEdEIsZ0JBQUFBLE9BQU8sQ0FBQyxDQUFELENBQVA7QUFDRCxlQWZELE1BZ0JLO0FBQ0gsb0JBQUlXLFVBQVUsQ0FBQ2dCLElBQVgsQ0FBZ0IsVUFBU0MsQ0FBVCxFQUFZO0FBQUUseUJBQU9oRyxJQUFJLENBQUM4RCxPQUFMLENBQWFrQyxDQUFiLEtBQW1CLENBQTFCO0FBQThCLGlCQUE1RCxDQUFKLEVBQW1FO0FBQ2pFUCxrQkFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNqQyxPQUFKLENBQVksT0FBWixFQUFxQixFQUFyQixDQUFOO0FBQ0FpQyxrQkFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNqQyxPQUFKLENBQVksT0FBWixFQUFxQixFQUFyQixDQUFOO0FBQ0FpQyxrQkFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNqQyxPQUFKLENBQVl6QixPQUFPLENBQUNxQixHQUFSLEVBQVosRUFBMkIsRUFBM0IsRUFBK0JhLElBQS9CLEVBQU47O0FBQ0Esc0JBQUl3QixHQUFHLENBQUNoRyxRQUFKLENBQWEsT0FBYixDQUFKLEVBQTJCO0FBQ3pCaEIsb0JBQUFBLFdBQVcsQ0FBQ2lELE1BQVosQ0FBbUIvRSxJQUFuQixDQUF3QmMsR0FBRyxHQUFHZ0ksR0FBRyxDQUFDakMsT0FBSixDQUFZLGFBQVosRUFBMkIsRUFBM0IsQ0FBOUI7QUFDQWlDLG9CQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ2pDLE9BQUosQ0FBWSxPQUFaLEVBQXNCLEdBQUU1QixLQUFLLENBQUNFLEdBQU4sQ0FBVSxPQUFWLENBQW1CLEVBQTNDLENBQU47QUFDRDs7QUFDRDlELGtCQUFBQSxHQUFHLENBQUNQLEdBQUQsRUFBTWdJLEdBQU4sQ0FBSDtBQUNEO0FBQ0Y7QUFDRixhQS9CRDtBQWdDQVAsWUFBQUEsS0FBSyxDQUFDZSxNQUFOLENBQWFkLEVBQWIsQ0FBZ0IsTUFBaEIsRUFBeUJuRixJQUFELElBQVU7QUFDaENyQyxjQUFBQSxJQUFJLENBQUNwQixPQUFELEVBQVcsa0JBQUQsR0FBcUJ5RCxJQUEvQixDQUFKO0FBQ0Esa0JBQUl5RixHQUFHLEdBQUd6RixJQUFJLENBQUMxQixRQUFMLEdBQWdCa0YsT0FBaEIsQ0FBd0IsV0FBeEIsRUFBcUMsR0FBckMsRUFBMENTLElBQTFDLEVBQVY7QUFDQSxrQkFBSWlDLFdBQVcsR0FBRyx5QkFBbEI7QUFDQSxrQkFBSXpHLFFBQVEsR0FBR2dHLEdBQUcsQ0FBQ2hHLFFBQUosQ0FBYXlHLFdBQWIsQ0FBZjs7QUFDQSxrQkFBSSxDQUFDekcsUUFBTCxFQUFlO0FBQ2JvQyxnQkFBQUEsT0FBTyxDQUFDN0QsR0FBUixDQUFhLEdBQUVQLEdBQUksSUFBR21FLEtBQUssQ0FBQ0UsR0FBTixDQUFVLE9BQVYsQ0FBbUIsSUFBRzJELEdBQUksRUFBaEQ7QUFDRDtBQUNGLGFBUkQ7QUFTRCxXQXhESyxDQVZIOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOzs7O0FBNEVQLFNBQVM5RyxTQUFULENBQW1Cd0gsVUFBbkIsRUFBK0J2RixRQUEvQixFQUF5QztBQUN2QyxNQUFJd0YsWUFBWSxHQUFHL0osT0FBTyxDQUFDLGVBQUQsQ0FBMUIsQ0FEdUMsQ0FFdkM7OztBQUNBLE1BQUlnSyxPQUFPLEdBQUcsS0FBZDtBQUNBLE1BQUl0RSxPQUFPLEdBQUdxRSxZQUFZLENBQUNFLElBQWIsQ0FBa0JILFVBQWxCLENBQWQsQ0FKdUMsQ0FLdkM7O0FBQ0FwRSxFQUFBQSxPQUFPLENBQUNvRCxFQUFSLENBQVcsT0FBWCxFQUFvQixVQUFVdkcsR0FBVixFQUFlO0FBQ2pDLFFBQUl5SCxPQUFKLEVBQWE7QUFDYkEsSUFBQUEsT0FBTyxHQUFHLElBQVY7QUFDQXpGLElBQUFBLFFBQVEsQ0FBQ2hDLEdBQUQsQ0FBUjtBQUNELEdBSkQsRUFOdUMsQ0FXdkM7O0FBQ0FtRCxFQUFBQSxPQUFPLENBQUNvRCxFQUFSLENBQVcsTUFBWCxFQUFtQixVQUFVQyxJQUFWLEVBQWdCO0FBQ2pDLFFBQUlpQixPQUFKLEVBQWE7QUFDYkEsSUFBQUEsT0FBTyxHQUFHLElBQVY7QUFDQSxRQUFJekgsR0FBRyxHQUFHd0csSUFBSSxLQUFLLENBQVQsR0FBYSxJQUFiLEdBQW9CLElBQUlFLEtBQUosQ0FBVSxlQUFlRixJQUF6QixDQUE5QjtBQUNBeEUsSUFBQUEsUUFBUSxDQUFDaEMsR0FBRCxDQUFSO0FBQ0QsR0FMRDtBQU1ELEMsQ0FFRDs7O0FBQ08sU0FBUzJILFFBQVQsQ0FBa0JkLEdBQWxCLEVBQXVCO0FBQzVCLFNBQU9BLEdBQUcsQ0FBQ2pHLFdBQUosR0FBa0JnRSxPQUFsQixDQUEwQixJQUExQixFQUFnQyxHQUFoQyxDQUFQO0FBQ0QsQyxDQUVEOzs7QUFDTyxTQUFTOUYsT0FBVCxHQUFtQjtBQUN4QixNQUFJa0UsS0FBSyxHQUFHdkYsT0FBTyxDQUFDLE9BQUQsQ0FBbkI7O0FBQ0EsTUFBSW1LLE1BQU0sR0FBSSxFQUFkOztBQUNBLFFBQU1DLFFBQVEsR0FBR3BLLE9BQU8sQ0FBQyxJQUFELENBQVAsQ0FBY29LLFFBQWQsRUFBakI7O0FBQ0EsTUFBSUEsUUFBUSxJQUFJLFFBQWhCLEVBQTBCO0FBQUVELElBQUFBLE1BQU0sR0FBSSxVQUFWO0FBQXFCLEdBQWpELE1BQ0s7QUFBRUEsSUFBQUEsTUFBTSxHQUFJLFVBQVY7QUFBcUI7O0FBQzVCLFNBQVEsR0FBRTVFLEtBQUssQ0FBQzhFLEtBQU4sQ0FBWUYsTUFBWixDQUFvQixHQUE5QjtBQUNELEMsQ0FFRDs7O0FBQ08sU0FBU3ZJLFlBQVQsQ0FBc0JULFVBQXRCLEVBQWtDbUosYUFBbEMsRUFBaUQ7QUFDdEQsUUFBTTFHLElBQUksR0FBRzVELE9BQU8sQ0FBQyxNQUFELENBQXBCOztBQUNBLFFBQU1ELEVBQUUsR0FBR0MsT0FBTyxDQUFDLElBQUQsQ0FBbEI7O0FBQ0EsTUFBSTJKLENBQUMsR0FBRyxFQUFSO0FBQ0EsTUFBSVksVUFBVSxHQUFHM0csSUFBSSxDQUFDbUUsT0FBTCxDQUFhckMsT0FBTyxDQUFDcUIsR0FBUixFQUFiLEVBQTJCLHNCQUEzQixFQUFtRDVGLFVBQW5ELENBQWpCO0FBQ0EsTUFBSXFKLFNBQVMsR0FBSXpLLEVBQUUsQ0FBQ2MsVUFBSCxDQUFjMEosVUFBVSxHQUFDLGVBQXpCLEtBQTZDekosSUFBSSxDQUFDQyxLQUFMLENBQVdoQixFQUFFLENBQUNpQixZQUFILENBQWdCdUosVUFBVSxHQUFDLGVBQTNCLEVBQTRDLE9BQTVDLENBQVgsQ0FBN0MsSUFBaUgsRUFBbEk7QUFDQVosRUFBQUEsQ0FBQyxDQUFDYyxhQUFGLEdBQWtCRCxTQUFTLENBQUNFLE9BQTVCO0FBQ0FmLEVBQUFBLENBQUMsQ0FBQ2dCLFNBQUYsR0FBY0gsU0FBUyxDQUFDRyxTQUF4Qjs7QUFDQSxNQUFJaEIsQ0FBQyxDQUFDZ0IsU0FBRixJQUFldkssU0FBbkIsRUFBOEI7QUFDNUJ1SixJQUFBQSxDQUFDLENBQUNpQixPQUFGLEdBQWEsWUFBYjtBQUNELEdBRkQsTUFHSztBQUNILFFBQUksQ0FBQyxDQUFELElBQU1qQixDQUFDLENBQUNnQixTQUFGLENBQVlsRCxPQUFaLENBQW9CLFdBQXBCLENBQVYsRUFBNEM7QUFDMUNrQyxNQUFBQSxDQUFDLENBQUNpQixPQUFGLEdBQWEsWUFBYjtBQUNELEtBRkQsTUFHSztBQUNIakIsTUFBQUEsQ0FBQyxDQUFDaUIsT0FBRixHQUFhLFdBQWI7QUFDRDtBQUNGOztBQUNELE1BQUlDLFdBQVcsR0FBR2pILElBQUksQ0FBQ21FLE9BQUwsQ0FBYXJDLE9BQU8sQ0FBQ3FCLEdBQVIsRUFBYixFQUEyQixzQkFBM0IsQ0FBbEI7QUFDQSxNQUFJK0QsVUFBVSxHQUFJL0ssRUFBRSxDQUFDYyxVQUFILENBQWNnSyxXQUFXLEdBQUMsZUFBMUIsS0FBOEMvSixJQUFJLENBQUNDLEtBQUwsQ0FBV2hCLEVBQUUsQ0FBQ2lCLFlBQUgsQ0FBZ0I2SixXQUFXLEdBQUMsZUFBNUIsRUFBNkMsT0FBN0MsQ0FBWCxDQUE5QyxJQUFtSCxFQUFySTtBQUNBbEIsRUFBQUEsQ0FBQyxDQUFDb0IsY0FBRixHQUFtQkQsVUFBVSxDQUFDSixPQUE5QjtBQUNBLE1BQUkzRyxPQUFPLEdBQUdILElBQUksQ0FBQ21FLE9BQUwsQ0FBYXJDLE9BQU8sQ0FBQ3FCLEdBQVIsRUFBYixFQUEyQiwwQkFBM0IsQ0FBZDtBQUNBLE1BQUlpRSxNQUFNLEdBQUlqTCxFQUFFLENBQUNjLFVBQUgsQ0FBY2tELE9BQU8sR0FBQyxlQUF0QixLQUEwQ2pELElBQUksQ0FBQ0MsS0FBTCxDQUFXaEIsRUFBRSxDQUFDaUIsWUFBSCxDQUFnQitDLE9BQU8sR0FBQyxlQUF4QixFQUF5QyxPQUF6QyxDQUFYLENBQTFDLElBQTJHLEVBQXpIO0FBQ0E0RixFQUFBQSxDQUFDLENBQUNzQixVQUFGLEdBQWVELE1BQU0sQ0FBQ25ELE1BQVAsQ0FBYzZDLE9BQTdCO0FBQ0EsTUFBSVEsT0FBTyxHQUFHdEgsSUFBSSxDQUFDbUUsT0FBTCxDQUFhckMsT0FBTyxDQUFDcUIsR0FBUixFQUFiLEVBQTRCLDBCQUE1QixDQUFkO0FBQ0EsTUFBSW9FLE1BQU0sR0FBSXBMLEVBQUUsQ0FBQ2MsVUFBSCxDQUFjcUssT0FBTyxHQUFDLGVBQXRCLEtBQTBDcEssSUFBSSxDQUFDQyxLQUFMLENBQVdoQixFQUFFLENBQUNpQixZQUFILENBQWdCa0ssT0FBTyxHQUFDLGVBQXhCLEVBQXlDLE9BQXpDLENBQVgsQ0FBMUMsSUFBMkcsRUFBekg7QUFDQXZCLEVBQUFBLENBQUMsQ0FBQ3lCLFVBQUYsR0FBZUQsTUFBTSxDQUFDRSxZQUF0Qjs7QUFDQSxNQUFJMUIsQ0FBQyxDQUFDeUIsVUFBRixJQUFnQmhMLFNBQXBCLEVBQStCO0FBQzdCLFFBQUk4SyxPQUFPLEdBQUd0SCxJQUFJLENBQUNtRSxPQUFMLENBQWFyQyxPQUFPLENBQUNxQixHQUFSLEVBQWIsRUFBNEIsd0JBQXVCNUYsVUFBVywyQkFBOUQsQ0FBZDtBQUNBLFFBQUlnSyxNQUFNLEdBQUlwTCxFQUFFLENBQUNjLFVBQUgsQ0FBY3FLLE9BQU8sR0FBQyxlQUF0QixLQUEwQ3BLLElBQUksQ0FBQ0MsS0FBTCxDQUFXaEIsRUFBRSxDQUFDaUIsWUFBSCxDQUFnQmtLLE9BQU8sR0FBQyxlQUF4QixFQUF5QyxPQUF6QyxDQUFYLENBQTFDLElBQTJHLEVBQXpIO0FBQ0F2QixJQUFBQSxDQUFDLENBQUN5QixVQUFGLEdBQWVELE1BQU0sQ0FBQ0UsWUFBdEI7QUFDRDs7QUFDRCxNQUFJQyxhQUFhLEdBQUcsRUFBcEI7O0FBQ0MsTUFBSWhCLGFBQWEsSUFBSWxLLFNBQWpCLElBQThCa0ssYUFBYSxJQUFJLE9BQW5ELEVBQTREO0FBQzNELFFBQUlpQixhQUFhLEdBQUcsRUFBcEI7O0FBQ0EsUUFBSWpCLGFBQWEsSUFBSSxPQUFyQixFQUE4QjtBQUM1QmlCLE1BQUFBLGFBQWEsR0FBRzNILElBQUksQ0FBQ21FLE9BQUwsQ0FBYXJDLE9BQU8sQ0FBQ3FCLEdBQVIsRUFBYixFQUEyQixvQkFBM0IsQ0FBaEI7QUFDRDs7QUFDRCxRQUFJdUQsYUFBYSxJQUFJLFNBQXJCLEVBQWdDO0FBQzlCaUIsTUFBQUEsYUFBYSxHQUFHM0gsSUFBSSxDQUFDbUUsT0FBTCxDQUFhckMsT0FBTyxDQUFDcUIsR0FBUixFQUFiLEVBQTJCLDRCQUEzQixDQUFoQjtBQUNEOztBQUNELFFBQUl5RSxZQUFZLEdBQUl6TCxFQUFFLENBQUNjLFVBQUgsQ0FBYzBLLGFBQWEsR0FBQyxlQUE1QixLQUFnRHpLLElBQUksQ0FBQ0MsS0FBTCxDQUFXaEIsRUFBRSxDQUFDaUIsWUFBSCxDQUFnQnVLLGFBQWEsR0FBQyxlQUE5QixFQUErQyxPQUEvQyxDQUFYLENBQWhELElBQXVILEVBQTNJO0FBQ0E1QixJQUFBQSxDQUFDLENBQUM4QixnQkFBRixHQUFxQkQsWUFBWSxDQUFDZCxPQUFsQzs7QUFDQSxRQUFJZixDQUFDLENBQUM4QixnQkFBRixJQUFzQnJMLFNBQTFCLEVBQXFDO0FBQ25Da0wsTUFBQUEsYUFBYSxHQUFHLE9BQU9oQixhQUF2QjtBQUNELEtBRkQsTUFHSztBQUNIZ0IsTUFBQUEsYUFBYSxHQUFHLE9BQU9oQixhQUFQLEdBQXVCLElBQXZCLEdBQThCWCxDQUFDLENBQUM4QixnQkFBaEQ7QUFDRDtBQUNGOztBQUNELFNBQU8seUJBQXlCOUIsQ0FBQyxDQUFDYyxhQUEzQixHQUEyQyxZQUEzQyxHQUEwRGQsQ0FBQyxDQUFDc0IsVUFBNUQsR0FBeUUsR0FBekUsR0FBK0V0QixDQUFDLENBQUNpQixPQUFqRixHQUEyRix3QkFBM0YsR0FBc0hqQixDQUFDLENBQUN5QixVQUF4SCxHQUFxSSxhQUFySSxHQUFxSnpCLENBQUMsQ0FBQ29CLGNBQXZKLEdBQXdLTyxhQUEvSztBQUNBLEMsQ0FFRjs7O0FBQ08sU0FBUzNKLEdBQVQsQ0FBYVAsR0FBYixFQUFpQnNLLE9BQWpCLEVBQTBCO0FBQy9CLE1BQUlDLENBQUMsR0FBR3ZLLEdBQUcsR0FBR3NLLE9BQWQ7O0FBQ0ExTCxFQUFBQSxPQUFPLENBQUMsVUFBRCxDQUFQLENBQW9CNEwsUUFBcEIsQ0FBNkJsRyxPQUFPLENBQUN5RCxNQUFyQyxFQUE2QyxDQUE3Qzs7QUFDQSxNQUFJO0FBQUN6RCxJQUFBQSxPQUFPLENBQUN5RCxNQUFSLENBQWUwQyxTQUFmO0FBQTJCLEdBQWhDLENBQWdDLE9BQU03SixDQUFOLEVBQVMsQ0FBRTs7QUFDM0MwRCxFQUFBQSxPQUFPLENBQUN5RCxNQUFSLENBQWUyQyxLQUFmLENBQXFCSCxDQUFyQjtBQUF3QmpHLEVBQUFBLE9BQU8sQ0FBQ3lELE1BQVIsQ0FBZTJDLEtBQWYsQ0FBcUIsSUFBckI7QUFDekIsQyxDQUVEOzs7QUFDTyxTQUFTQyxJQUFULENBQWMzSyxHQUFkLEVBQWtCc0ssT0FBbEIsRUFBMkI7QUFDaEMsTUFBSU0sQ0FBQyxHQUFHLEtBQVI7QUFDQSxNQUFJTCxDQUFDLEdBQUd2SyxHQUFHLEdBQUdzSyxPQUFkOztBQUNBLE1BQUlNLENBQUMsSUFBSSxJQUFULEVBQWU7QUFDYmhNLElBQUFBLE9BQU8sQ0FBQyxVQUFELENBQVAsQ0FBb0I0TCxRQUFwQixDQUE2QmxHLE9BQU8sQ0FBQ3lELE1BQXJDLEVBQTZDLENBQTdDOztBQUNBLFFBQUk7QUFDRnpELE1BQUFBLE9BQU8sQ0FBQ3lELE1BQVIsQ0FBZTBDLFNBQWY7QUFDRCxLQUZELENBR0EsT0FBTTdKLENBQU4sRUFBUyxDQUFFOztBQUNYMEQsSUFBQUEsT0FBTyxDQUFDeUQsTUFBUixDQUFlMkMsS0FBZixDQUFxQkgsQ0FBckI7QUFDQWpHLElBQUFBLE9BQU8sQ0FBQ3lELE1BQVIsQ0FBZTJDLEtBQWYsQ0FBcUIsSUFBckI7QUFDRDtBQUNGLEMsQ0FFRDs7O0FBQ08sU0FBU3hLLElBQVQsQ0FBY2IsT0FBZCxFQUF1QmtMLENBQXZCLEVBQTBCO0FBQy9CLE1BQUlsTCxPQUFPLElBQUksS0FBZixFQUFzQjtBQUNwQlQsSUFBQUEsT0FBTyxDQUFDLFVBQUQsQ0FBUCxDQUFvQjRMLFFBQXBCLENBQTZCbEcsT0FBTyxDQUFDeUQsTUFBckMsRUFBNkMsQ0FBN0M7O0FBQ0EsUUFBSTtBQUNGekQsTUFBQUEsT0FBTyxDQUFDeUQsTUFBUixDQUFlMEMsU0FBZjtBQUNELEtBRkQsQ0FHQSxPQUFNN0osQ0FBTixFQUFTLENBQUU7O0FBQ1gwRCxJQUFBQSxPQUFPLENBQUN5RCxNQUFSLENBQWUyQyxLQUFmLENBQXNCLGFBQVlILENBQUUsRUFBcEM7QUFDQWpHLElBQUFBLE9BQU8sQ0FBQ3lELE1BQVIsQ0FBZTJDLEtBQWYsQ0FBcUIsSUFBckI7QUFDRDtBQUNGOztBQUVELFNBQVNuTCxtQkFBVCxHQUErQjtBQUM3QixTQUFPO0FBQ0wsWUFBUSxRQURIO0FBRUwsa0JBQWM7QUFDWixtQkFBYTtBQUNYLGdCQUFRLENBQUMsUUFBRDtBQURHLE9BREQ7QUFJWixpQkFBVztBQUNULGdCQUFRLENBQUMsUUFBRDtBQURDLE9BSkM7QUFPWixlQUFTO0FBQ1AsZ0JBQVEsQ0FBQyxRQUFEO0FBREQsT0FQRztBQVVaLGNBQVE7QUFDTix3QkFBZ0IsMERBRFY7QUFFTixnQkFBUSxDQUFDLFFBQUQ7QUFGRixPQVZJO0FBY1osZ0JBQVU7QUFDUixnQkFBUSxDQUFDLFFBQUQ7QUFEQSxPQWRFO0FBaUJaLGNBQVE7QUFDTixnQkFBUSxDQUFDLFNBQUQ7QUFERixPQWpCSTtBQW9CWixrQkFBWTtBQUNWLGdCQUFRLENBQUMsUUFBRCxFQUFXLE9BQVg7QUFERSxPQXBCQTtBQXVCWixpQkFBVztBQUNULGdCQUFRLENBQUMsUUFBRDtBQURDLE9BdkJDO0FBMEJaLHFCQUFlO0FBQ2Isd0JBQWdCLHNEQURIO0FBRWIsZ0JBQVEsQ0FBQyxRQUFEO0FBRkssT0ExQkg7QUE4QlosbUJBQWE7QUFDWCx3QkFBZ0IsMERBREw7QUFFWCxnQkFBUSxDQUFDLFFBQUQ7QUFGRyxPQTlCRDtBQWtDWixpQkFBVztBQUNULHdCQUFnQiwwREFEUDtBQUVULGdCQUFRLENBQUMsUUFBRDtBQUZDLE9BbENDO0FBc0NaLGVBQVM7QUFDUCx3QkFBZ0IsMERBRFQ7QUFFUCxnQkFBUSxDQUFDLFFBQUQ7QUFGRCxPQXRDRztBQTBDWixpQkFBVztBQUNULHdCQUFnQiwwREFEUDtBQUVULGdCQUFRLENBQUMsUUFBRDtBQUZDO0FBMUNDLEtBRlQ7QUFpREwsNEJBQXdCO0FBakRuQixHQUFQO0FBbUREOztBQUdELFNBQVNNLGtCQUFULEdBQThCO0FBQzVCLFNBQU87QUFDTGQsSUFBQUEsU0FBUyxFQUFFLE9BRE47QUFFTGdHLElBQUFBLE9BQU8sRUFBRSxRQUZKO0FBR0xDLElBQUFBLEtBQUssRUFBRSxnQkFIRjtBQUlMNUIsSUFBQUEsSUFBSSxFQUFFLEtBSkQ7QUFLTG5DLElBQUFBLE1BQU0sRUFBRSxJQUxIO0FBTUwwRCxJQUFBQSxJQUFJLEVBQUUsSUFORDtBQU9MRyxJQUFBQSxRQUFRLEVBQUUsRUFQTDtBQVNMbEIsSUFBQUEsT0FBTyxFQUFFLEVBVEo7QUFVTHpELElBQUFBLFdBQVcsRUFBRSxhQVZSO0FBV0xmLElBQUFBLFNBQVMsRUFBRSxJQVhOO0FBWUxpQixJQUFBQSxPQUFPLEVBQUUsS0FaSjtBQWFMQyxJQUFBQSxLQUFLLEVBQUUsS0FiRjtBQWNMakIsSUFBQUEsT0FBTyxFQUFFO0FBZEosR0FBUDtBQWdCRCIsInNvdXJjZXNDb250ZW50IjpbIlxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbnN0cnVjdG9yKGluaXRpYWxPcHRpb25zKSB7XG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICB2YXIgdmFycyA9IHt9XG4gIHZhciBvcHRpb25zID0ge31cbiAgdHJ5IHtcbiAgICBpZiAoaW5pdGlhbE9wdGlvbnMuZnJhbWV3b3JrID09IHVuZGVmaW5lZCkge1xuICAgICAgdmFycy5wbHVnaW5FcnJvcnMgPSBbXVxuICAgICAgdmFycy5wbHVnaW5FcnJvcnMucHVzaCgnd2VicGFjayBjb25maWc6IGZyYW1ld29yayBwYXJhbWV0ZXIgb24gZXh0LXdlYnBhY2stcGx1Z2luIGlzIG5vdCBkZWZpbmVkIC0gdmFsdWVzOiByZWFjdCwgYW5ndWxhciwgZXh0anMsIHdlYmNvbXBvbmVudHMnKVxuICAgICAgdmFyIHJlc3VsdCA9IHsgdmFyczogdmFycyB9O1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgdmFyIGZyYW1ld29yayA9IGluaXRpYWxPcHRpb25zLmZyYW1ld29ya1xuICAgIHZhciB0cmVlc2hha2UgPSBpbml0aWFsT3B0aW9ucy50cmVlc2hha2VcbiAgICB2YXIgdmVyYm9zZSA9IGluaXRpYWxPcHRpb25zLnZlcmJvc2VcblxuICAgIGNvbnN0IHZhbGlkYXRlT3B0aW9ucyA9IHJlcXVpcmUoJ3NjaGVtYS11dGlscycpXG4gICAgdmFsaWRhdGVPcHRpb25zKF9nZXRWYWxpZGF0ZU9wdGlvbnMoKSwgaW5pdGlhbE9wdGlvbnMsICcnKVxuXG4gICAgY29uc3QgcmMgPSAoZnMuZXhpc3RzU3luYyhgLmV4dC0ke2ZyYW1ld29ya31yY2ApICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGAuZXh0LSR7ZnJhbWV3b3JrfXJjYCwgJ3V0Zi04JykpIHx8IHt9KVxuICAgIG9wdGlvbnMgPSB7IC4uLl9nZXREZWZhdWx0T3B0aW9ucygpLCAuLi5pbml0aWFsT3B0aW9ucywgLi4ucmMgfVxuXG4gICAgdmFycyA9IHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9nZXREZWZhdWx0VmFycygpXG4gICAgdmFycy5wbHVnaW5OYW1lID0gJ2V4dC13ZWJwYWNrLXBsdWdpbidcbiAgICB2YXJzLmFwcCA9IF9nZXRBcHAoKVxuICAgIHZhciBwbHVnaW5OYW1lID0gdmFycy5wbHVnaW5OYW1lXG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG5cbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfY29uc3RydWN0b3InKVxuICAgIGxvZ3YodmVyYm9zZSwgYHBsdWdpbk5hbWUgLSAke3BsdWdpbk5hbWV9YClcbiAgICBsb2d2KHZlcmJvc2UsIGBhcHAgLSAke2FwcH1gKVxuXG4gICAgaWYgKG9wdGlvbnMuZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXJzLnByb2R1Y3Rpb24gPSB0cnVlXG4gICAgICBvcHRpb25zLmJyb3dzZXIgPSAnbm8nXG4gICAgICBvcHRpb25zLndhdGNoID0gJ25vJ1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhcnMucHJvZHVjdGlvbiA9IGZhbHNlXG4gICAgfVxuXG4gICAgbG9nKGFwcCwgX2dldFZlcnNpb25zKHBsdWdpbk5hbWUsIGZyYW1ld29yaykpXG5cbiAgICBpZiAoZnJhbWV3b3JrID09ICdyZWFjdCcgfHwgZnJhbWV3b3JrID09ICdleHRqcycgfHwgZnJhbWV3b3JrID09PSAnd2ViY29tcG9uZW50cycpIHtcbiAgICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIGRldmVsb3BtZW50IGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgaWYgKHRyZWVzaGFrZSA9PSAneWVzJykge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDInXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrICsgJyAtICcgKyB2YXJzLmJ1aWxkc3RlcClcbiAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3RvUHJvZCh2YXJzLCBvcHRpb25zKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzIgb2YgMidcbiAgICAgICAgbG9nKGFwcCwgJ0NvbnRpbnVpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJyArIGZyYW1ld29yayArICcgLSAnICsgdmFycy5idWlsZHN0ZXApXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJ1xuICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIGRldmVsb3BtZW50IGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKVxuICAgIH1cbiAgICBsb2d2KHZlcmJvc2UsICdCdWlsZGluZyBmb3IgJyArIG9wdGlvbnMuZW52aXJvbm1lbnQgKyAnLCAnICsgJ1RyZWVzaGFrZSBpcyAnICsgb3B0aW9ucy50cmVlc2hha2UpXG5cbiAgICB2YXIgY29uZmlnT2JqID0geyB2YXJzOiB2YXJzLCBvcHRpb25zOiBvcHRpb25zIH07XG4gICAgcmV0dXJuIGNvbmZpZ09iajtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIHRocm93ICdfY29uc3RydWN0b3I6ICcgKyBlLnRvU3RyaW5nKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfdGhpc0NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX3RoaXNDb21waWxhdGlvbicpXG4gICAgbG9ndih2ZXJib3NlLCBgb3B0aW9ucy5zY3JpcHQ6ICR7b3B0aW9ucy5zY3JpcHQgfWApXG4gICAgbG9ndih2ZXJib3NlLCBgYnVpbGRzdGVwOiAke3ZhcnMuYnVpbGRzdGVwfWApXG5cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09PSAnMSBvZiAyJykge1xuICAgICAgaWYgKG9wdGlvbnMuc2NyaXB0ICE9IHVuZGVmaW5lZCAmJiBvcHRpb25zLnNjcmlwdCAhPSBudWxsICYmIG9wdGlvbnMuc2NyaXB0ICE9ICcnKSB7XG4gICAgICAgIGxvZyhhcHAsIGBTdGFydGVkIHJ1bm5pbmcgJHtvcHRpb25zLnNjcmlwdH1gKVxuICAgICAgICBydW5TY3JpcHQob3B0aW9ucy5zY3JpcHQsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbG9nKGFwcCwgYEZpbmlzaGVkIHJ1bm5pbmcgJHtvcHRpb25zLnNjcmlwdH1gKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHRocm93ICdfdGhpc0NvbXBpbGF0aW9uOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2NvbXBpbGF0aW9uJylcblxuICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgaWYgKG9wdGlvbnMudHJlZXNoYWtlID09PSAneWVzJyAmJiBvcHRpb25zLmVudmlyb25tZW50ID09PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgdmFyIGV4dENvbXBvbmVudHMgPSBbXTtcbiAgICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInIHx8ICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyAmJiBmcmFtZXdvcmsgPT09ICd3ZWJjb21wb25lbnRzJykpIHtcbiAgICAgICAgICBleHRDb21wb25lbnRzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucylcbiAgICAgICAgfVxuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5zdWNjZWVkTW9kdWxlLnRhcChgZXh0LXN1Y2NlZWQtbW9kdWxlYCwgbW9kdWxlID0+IHtcbiAgICAgICAgICBpZiAobW9kdWxlLnJlc291cmNlICYmICFtb2R1bGUucmVzb3VyY2UubWF0Y2goL25vZGVfbW9kdWxlcy8pKSB7XG4gICAgICAgICAgICBpZihtb2R1bGUucmVzb3VyY2UubWF0Y2goL1xcLmh0bWwkLykgIT0gbnVsbFxuICAgICAgICAgICAgICAmJiBtb2R1bGUuX3NvdXJjZS5fdmFsdWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnZG9jdHlwZSBodG1sJykgPT0gZmFsc2VcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4gICAgICAgICAgICAgICAgLi4uKHZhcnMuZGVwcyB8fCBbXSksXG4gICAgICAgICAgICAgICAgLi4ucmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbiAgICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5maW5pc2hNb2R1bGVzLnRhcChgZXh0LWZpbmlzaC1tb2R1bGVzYCwgbW9kdWxlcyA9PiB7XG4gICAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIodmFycywgb3B0aW9ucylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMiBvZiAyJykge1xuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5odG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uLnRhcChgZXh0LWh0bWwtZ2VuZXJhdGlvbmAsKGRhdGEpID0+IHtcbiAgICAgICAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgICAgICAgdmFyIGpzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuanMnKVxuICAgICAgICAgIHZhciBjc3NQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5jc3MnKVxuICAgICAgICAgIGRhdGEuYXNzZXRzLmpzLnVuc2hpZnQoanNQYXRoKVxuICAgICAgICAgIGRhdGEuYXNzZXRzLmNzcy51bnNoaWZ0KGNzc1BhdGgpXG4gICAgICAgICAgbG9nKGFwcCwgYEFkZGluZyAke2pzUGF0aH0gYW5kICR7Y3NzUGF0aH0gdG8gaW5kZXguaHRtbGApXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICB0aHJvdyAnX2NvbXBpbGF0aW9uOiAnICsgZS50b1N0cmluZygpXG4vLyAgICBsb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuLy8gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19jb21waWxhdGlvbjogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2FmdGVyQ29tcGlsZShjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9hZnRlckNvbXBpbGUnKVxuICAgIGlmIChmcmFtZXdvcmsgPT0gJ2V4dGpzJykge1xuICAgICAgcmVxdWlyZShgLi9leHRqc1V0aWxgKS5fYWZ0ZXJDb21waWxlKGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9hZnRlckNvbXBpbGUgbm90IHJ1bicpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICB0aHJvdyAnX2FmdGVyQ29tcGlsZTogJyArIGUudG9TdHJpbmcoKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIF9lbWl0KGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZW1pdCA9IG9wdGlvbnMuZW1pdFxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAgIGxvZ3YodmVyYm9zZSwnRlVOQ1RJT04gX2VtaXQnKVxuICAgIGlmIChlbWl0ID09ICd5ZXMnKSB7XG4gICAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScgfHwgdmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMicpIHtcbiAgICAgICAgbGV0IG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3V0cHV0UGF0aCx2YXJzLmV4dFBhdGgpXG4gICAgICAgIGlmIChjb21waWxlci5vdXRwdXRQYXRoID09PSAnLycgJiYgY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIpIHtcbiAgICAgICAgICBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGNvbXBpbGVyLm9wdGlvbnMuZGV2U2VydmVyLmNvbnRlbnRCYXNlLCBvdXRwdXRQYXRoKVxuICAgICAgICB9XG4gICAgICAgIGxvZ3YodmVyYm9zZSwnb3V0cHV0UGF0aDogJyArIG91dHB1dFBhdGgpXG4gICAgICAgIGxvZ3YodmVyYm9zZSwnZnJhbWV3b3JrOiAnICsgZnJhbWV3b3JrKVxuICAgICAgICBpZiAoZnJhbWV3b3JrICE9ICdleHRqcycpIHtcbiAgICAgICAgICBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0UGF0aCwgY29tcGlsYXRpb24pXG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbW1hbmQgPSAnJ1xuICAgICAgICBpZiAob3B0aW9ucy53YXRjaCA9PSAneWVzJyAmJiB2YXJzLnByb2R1Y3Rpb24gPT0gZmFsc2UpXG4gICAgICAgICAge2NvbW1hbmQgPSAnd2F0Y2gnfVxuICAgICAgICBlbHNlXG4gICAgICAgICAge2NvbW1hbmQgPSAnYnVpbGQnfVxuICAgICAgICBpZiAodmFycy5yZWJ1aWxkID09IHRydWUpIHtcbiAgICAgICAgICB2YXIgcGFybXMgPSBbXVxuICAgICAgICAgIGlmIChvcHRpb25zLnByb2ZpbGUgPT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMucHJvZmlsZSA9PSAnJyB8fCBvcHRpb25zLnByb2ZpbGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT0gJ2J1aWxkJylcbiAgICAgICAgICAgICAgeyBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgb3B0aW9ucy5lbnZpcm9ubWVudF0gfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB7IHBhcm1zID0gWydhcHAnLCBjb21tYW5kLCAnLS13ZWItc2VydmVyJywgJ2ZhbHNlJywgb3B0aW9ucy5lbnZpcm9ubWVudF0gfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpXG4gICAgICAgICAgICAgIHtwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgb3B0aW9ucy5wcm9maWxlLCBvcHRpb25zLmVudmlyb25tZW50XX1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAge3Bhcm1zID0gWydhcHAnLCBjb21tYW5kLCAnLS13ZWItc2VydmVyJywgJ2ZhbHNlJywgb3B0aW9ucy5wcm9maWxlLCBvcHRpb25zLmVudmlyb25tZW50XX1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhcnMud2F0Y2hTdGFydGVkID09IGZhbHNlKSB7XG4gICAgICAgICAgICBhd2FpdCBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIHZhcnMsIG9wdGlvbnMpXG4gICAgICAgICAgICB2YXJzLndhdGNoU3RhcnRlZCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwnTk9UIHJ1bm5pbmcgZW1pdCcpXG4gICAgICAgIGNhbGxiYWNrKClcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KHZlcmJvc2UsJ2VtaXQgaXMgbm8nKVxuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgY2FsbGJhY2soKVxuICAgIHRocm93ICdfZW1pdDogJyArIGUudG9TdHJpbmcoKVxuICAgIC8vIGxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gICAgLy8gY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19lbWl0OiAnICsgZSlcbiAgICAvLyBjYWxsYmFjaygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2RvbmUoc3RhdHMsIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAgIGxvZ3YodmVyYm9zZSwnRlVOQ1RJT04gX2RvbmUnKVxuICAgIGlmIChzdGF0cy5jb21waWxhdGlvbi5lcnJvcnMgJiYgc3RhdHMuY29tcGlsYXRpb24uZXJyb3JzLmxlbmd0aCkgLy8gJiYgcHJvY2Vzcy5hcmd2LmluZGV4T2YoJy0td2F0Y2gnKSA9PSAtMSlcbiAgICB7XG4gICAgICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpO1xuICAgICAgY29uc29sZS5sb2coY2hhbGsucmVkKCcqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKionKSk7XG4gICAgICBjb25zb2xlLmxvZyhzdGF0cy5jb21waWxhdGlvbi5lcnJvcnNbMF0pO1xuICAgICAgY29uc29sZS5sb2coY2hhbGsucmVkKCcqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKionKSk7XG4gICAgICBwcm9jZXNzLmV4aXQoMCk7XG4gICAgfVxuXG4gICAgLy9tamcgcmVmYWN0b3JcbiAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gJ25vJyAmJiBmcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICByZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLl90b0Rldih2YXJzLCBvcHRpb25zKVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgaWYob3B0aW9ucy5icm93c2VyID09ICd5ZXMnICYmIG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKSB7XG4gICAgICAgIGlmICh2YXJzLmJyb3dzZXJDb3VudCA9PSAwKSB7XG4gICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OicgKyBvcHRpb25zLnBvcnRcbiAgICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBPcGVuaW5nIGJyb3dzZXIgYXQgJHt1cmx9YClcbiAgICAgICAgICB2YXJzLmJyb3dzZXJDb3VudCsrXG4gICAgICAgICAgY29uc3Qgb3BuID0gcmVxdWlyZSgnb3BuJylcbiAgICAgICAgICBvcG4odXJsKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScpIHtcbiAgICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJHtmcmFtZXdvcmt9YClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgZGV2ZWxvcG1lbnQgYnVpbGQgZm9yICR7ZnJhbWV3b3JrfWApXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMiBvZiAyJykge1xuICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICR7ZnJhbWV3b3JrfWApXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbi8vICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gICAgdGhyb3cgJ19kb25lOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dCwgY29tcGlsYXRpb24pIHtcbiAgdHJ5IHtcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBwYWNrYWdlcyA9IG9wdGlvbnMucGFja2FnZXNcbiAgICB2YXIgdG9vbGtpdCA9IG9wdGlvbnMudG9vbGtpdFxuICAgIHZhciB0aGVtZSA9IG9wdGlvbnMudGhlbWVcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9wcmVwYXJlRm9yQnVpbGQnKVxuICAgIGNvbnN0IHJpbXJhZiA9IHJlcXVpcmUoJ3JpbXJhZicpXG4gICAgY29uc3QgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJylcbiAgICBjb25zdCBmc3ggPSByZXF1aXJlKCdmcy1leHRyYScpXG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgIHRoZW1lID0gdGhlbWUgfHwgKHRvb2xraXQgPT09ICdjbGFzc2ljJyA/ICd0aGVtZS10cml0b24nIDogJ3RoZW1lLW1hdGVyaWFsJylcbiAgICBsb2d2KHZlcmJvc2UsJ2ZpcnN0VGltZTogJyArIHZhcnMuZmlyc3RUaW1lKVxuICAgIGlmICh2YXJzLmZpcnN0VGltZSkge1xuICAgICAgcmltcmFmLnN5bmMob3V0cHV0KVxuICAgICAgbWtkaXJwLnN5bmMob3V0cHV0KVxuICAgICAgY29uc3QgYnVpbGRYTUwgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmJ1aWxkWE1MXG4gICAgICBjb25zdCBjcmVhdGVBcHBKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVBcHBKc29uXG4gICAgICBjb25zdCBjcmVhdGVXb3Jrc3BhY2VKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVXb3Jrc3BhY2VKc29uXG4gICAgICBjb25zdCBjcmVhdGVKU0RPTUVudmlyb25tZW50ID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVKU0RPTUVudmlyb25tZW50XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdidWlsZC54bWwnKSwgYnVpbGRYTUwodmFycy5wcm9kdWN0aW9uLCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdhcHAuanNvbicpLCBjcmVhdGVBcHBKc29uKHRoZW1lLCBwYWNrYWdlcywgdG9vbGtpdCwgb3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnanNkb20tZW52aXJvbm1lbnQuanMnKSwgY3JlYXRlSlNET01FbnZpcm9ubWVudChvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICd3b3Jrc3BhY2UuanNvbicpLCBjcmVhdGVXb3Jrc3BhY2VKc29uKG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIHZhciBmcmFtZXdvcmsgPSB2YXJzLmZyYW1ld29yaztcbiAgICAgIC8vYmVjYXVzZSBvZiBhIHByb2JsZW0gd2l0aCBjb2xvcnBpY2tlclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vdXgvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3V4JylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICh1eCkgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vcGFja2FnZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdwYWNrYWdlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vb3ZlcnJpZGVzL2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vb3ZlcnJpZGVzL2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAnb3ZlcnJpZGVzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwncmVzb3VyY2VzLycpKSkge1xuICAgICAgICB2YXIgZnJvbVJlc291cmNlcyA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncmVzb3VyY2VzLycpXG4gICAgICAgIHZhciB0b1Jlc291cmNlcyA9IHBhdGguam9pbihvdXRwdXQsICcuLi9yZXNvdXJjZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVJlc291cmNlcywgdG9SZXNvdXJjZXMpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICcgKyBmcm9tUmVzb3VyY2VzLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUmVzb3VyY2VzLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgIH1cbiAgICB2YXJzLmZpcnN0VGltZSA9IGZhbHNlXG4gICAgdmFyIGpzID0gJydcbiAgICBpZiAodmFycy5wcm9kdWN0aW9uKSB7XG4gICAgICB2YXJzLmRlcHMgPSB2YXJzLmRlcHMuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCl7IHJldHVybiB2YXJzLmRlcHMuaW5kZXhPZih2YWx1ZSkgPT0gaW5kZXggfSk7XG4gICAgICBqcyA9IHZhcnMuZGVwcy5qb2luKCc7XFxuJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAganMgPSBgRXh0LnJlcXVpcmUoW1wiRXh0LipcIixcIkV4dC5kYXRhLlRyZWVTdG9yZVwiXSlgXG4gICAgfVxuICAgIGlmICh2YXJzLm1hbmlmZXN0ID09PSBudWxsIHx8IGpzICE9PSB2YXJzLm1hbmlmZXN0KSB7XG4gICAgICB2YXJzLm1hbmlmZXN0ID0ganNcbiAgICAgIGNvbnN0IG1hbmlmZXN0ID0gcGF0aC5qb2luKG91dHB1dCwgJ21hbmlmZXN0LmpzJylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMobWFuaWZlc3QsIGpzLCAndXRmOCcpXG4gICAgICB2YXJzLnJlYnVpbGQgPSB0cnVlXG4gICAgICB2YXIgYnVuZGxlRGlyID0gb3V0cHV0LnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpXG4gICAgICBpZiAoYnVuZGxlRGlyLnRyaW0oKSA9PSAnJykge2J1bmRsZURpciA9ICcuLyd9XG4gICAgICBsb2coYXBwLCAnQnVpbGRpbmcgRXh0IGJ1bmRsZSBhdDogJyArIGJ1bmRsZURpcilcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXJzLnJlYnVpbGQgPSBmYWxzZVxuICAgICAgbG9nKGFwcCwgJ0V4dCByZWJ1aWxkIE5PVCBuZWVkZWQnKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX3ByZXBhcmVGb3JCdWlsZDogJyArIGUpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2J1aWxkRXh0QnVuZGxlKGFwcCwgY29tcGlsYXRpb24sIG91dHB1dFBhdGgsIHBhcm1zLCB2YXJzLCBvcHRpb25zKSB7XG4vLyAgdHJ5IHtcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICAgIGxvZ3YodmVyYm9zZSwnRlVOQ1RJT04gX2J1aWxkRXh0QnVuZGxlJylcbiAgICBsZXQgc2VuY2hhOyB0cnkgeyBzZW5jaGEgPSByZXF1aXJlKCdAc2VuY2hhL2NtZCcpIH0gY2F0Y2ggKGUpIHsgc2VuY2hhID0gJ3NlbmNoYScgfVxuICAgIGlmIChmcy5leGlzdHNTeW5jKHNlbmNoYSkpIHtcbiAgICAgIGxvZ3YodmVyYm9zZSwnc2VuY2hhIGZvbGRlciBleGlzdHMnKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxvZ3YodmVyYm9zZSwnc2VuY2hhIGZvbGRlciBET0VTIE5PVCBleGlzdCcpXG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBvbkJ1aWxkRG9uZSA9ICgpID0+IHtcbiAgICAgICAgbG9ndih2ZXJib3NlLCdvbkJ1aWxkRG9uZScpXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfVxuICAgICAgdmFyIG9wdHMgPSB7IGN3ZDogb3V0cHV0UGF0aCwgc2lsZW50OiB0cnVlLCBzdGRpbzogJ3BpcGUnLCBlbmNvZGluZzogJ3V0Zi04J31cbiAgICAgIF9leGVjdXRlQXN5bmMoYXBwLCBzZW5jaGEsIHBhcm1zLCBvcHRzLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykudGhlbiAoXG4gICAgICAgIGZ1bmN0aW9uKCkgeyBvbkJ1aWxkRG9uZSgpIH0sXG4gICAgICAgIGZ1bmN0aW9uKHJlYXNvbikgeyByZWplY3QocmVhc29uKSB9XG4gICAgICApXG4gICAgfSlcbiAgLy8gfVxuICAvLyBjYXRjaChlKSB7XG4gIC8vICAgY29uc29sZS5sb2coJ2UnKVxuICAvLyAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gIC8vICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19idWlsZEV4dEJ1bmRsZTogJyArIGUpXG4gIC8vICAgY2FsbGJhY2soKVxuICAvLyB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIF9leGVjdXRlQXN5bmMgKGFwcCwgY29tbWFuZCwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4vLyAgdHJ5IHtcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAgIC8vY29uc3QgREVGQVVMVF9TVUJTVFJTID0gWydbSU5GXSBMb2FkaW5nJywgJ1tJTkZdIFByb2Nlc3NpbmcnLCAnW0xPR10gRmFzaGlvbiBidWlsZCBjb21wbGV0ZScsICdbRVJSXScsICdbV1JOXScsIFwiW0lORl0gU2VydmVyXCIsIFwiW0lORl0gV3JpdGluZ1wiLCBcIltJTkZdIExvYWRpbmcgQnVpbGRcIiwgXCJbSU5GXSBXYWl0aW5nXCIsIFwiW0xPR10gRmFzaGlvbiB3YWl0aW5nXCJdO1xuICAgIGNvbnN0IERFRkFVTFRfU1VCU1RSUyA9IFtcIltJTkZdIHhTZXJ2ZXJcIiwgJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gQXBwZW5kJywgJ1tJTkZdIFByb2Nlc3NpbmcnLCAnW0lORl0gUHJvY2Vzc2luZyBCdWlsZCcsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gICAgdmFyIHN1YnN0cmluZ3MgPSBERUZBVUxUX1NVQlNUUlNcbiAgICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gICAgY29uc3QgY3Jvc3NTcGF3biA9IHJlcXVpcmUoJ2Nyb3NzLXNwYXduJylcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfZXhlY3V0ZUFzeW5jJylcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsb2d2KHZlcmJvc2UsYGNvbW1hbmQgLSAke2NvbW1hbmR9YClcbiAgICAgIGxvZ3YodmVyYm9zZSwgYHBhcm1zIC0gJHtwYXJtc31gKVxuICAgICAgbG9ndih2ZXJib3NlLCBgb3B0cyAtICR7SlNPTi5zdHJpbmdpZnkob3B0cyl9YClcbiAgICAgIGxldCBjaGlsZCA9IGNyb3NzU3Bhd24oY29tbWFuZCwgcGFybXMsIG9wdHMpXG4gICAgICBjaGlsZC5vbignY2xvc2UnLCAoY29kZSwgc2lnbmFsKSA9PiB7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwgYG9uIGNsb3NlOiBgICsgY29kZSlcbiAgICAgICAgaWYoY29kZSA9PT0gMCkgeyByZXNvbHZlKDApIH1cbiAgICAgICAgZWxzZSB7IGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCBuZXcgRXJyb3IoY29kZSkgKTsgcmVzb2x2ZSgwKSB9XG4gICAgICB9KVxuICAgICAgY2hpbGQub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwgYG9uIGVycm9yYClcbiAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goZXJyb3IpXG4gICAgICAgIHJlc29sdmUoMClcbiAgICAgIH0pXG4gICAgICBjaGlsZC5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICB2YXIgc3RyID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UoL1xccj9cXG58XFxyL2csIFwiIFwiKS50cmltKClcbiAgICAgICAgbG9ndih2ZXJib3NlLCBgJHtzdHJ9YClcbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS50b1N0cmluZygpLm1hdGNoKC9GYXNoaW9uIHdhaXRpbmcgZm9yIGNoYW5nZXNcXC5cXC5cXC4vKSkge1xuXG4gICAgICAgICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuICAgICAgICAgIHZhciBmaWxlbmFtZSA9IHByb2Nlc3MuY3dkKCkgKyB2YXJzLnRvdWNoRmlsZTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKClcbiAgICAgICAgICAgIHZhciBkYXRhID0gZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lKTtcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZW5hbWUsICcvLycgKyBkLCAndXRmOCcpO1xuICAgICAgICAgICAgbG9ndihhcHAsIGB0b3VjaGluZyAke2ZpbGVuYW1lfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgICBsb2d2KGFwcCwgYE5PVCB0b3VjaGluZyAke2ZpbGVuYW1lfWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoMClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAoc3Vic3RyaW5ncy5zb21lKGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGRhdGEuaW5kZXhPZih2KSA+PSAwOyB9KSkge1xuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbSU5GXVwiLCBcIlwiKVxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbTE9HXVwiLCBcIlwiKVxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpLnRyaW0oKVxuICAgICAgICAgICAgaWYgKHN0ci5pbmNsdWRlcyhcIltFUlJdXCIpKSB7XG4gICAgICAgICAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGFwcCArIHN0ci5yZXBsYWNlKC9eXFxbRVJSXFxdIC9naSwgJycpKTtcbiAgICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbRVJSXVwiLCBgJHtjaGFsay5yZWQoXCJbRVJSXVwiKX1gKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9nKGFwcCwgc3RyKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNoaWxkLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIGxvZ3Yob3B0aW9ucywgYGVycm9yIG9uIGNsb3NlOiBgICsgZGF0YSlcbiAgICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXG4gICAgICAgIHZhciBzdHJKYXZhT3B0cyA9IFwiUGlja2VkIHVwIF9KQVZBX09QVElPTlNcIjtcbiAgICAgICAgdmFyIGluY2x1ZGVzID0gc3RyLmluY2x1ZGVzKHN0ckphdmFPcHRzKVxuICAgICAgICBpZiAoIWluY2x1ZGVzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7YXBwfSAke2NoYWxrLnJlZChcIltFUlJdXCIpfSAke3N0cn1gKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIC8vIH1cbiAgLy8gY2F0Y2goZSkge1xuICAvLyAgIGxvZ3Yob3B0aW9ucyxlKVxuICAvLyAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfZXhlY3V0ZUFzeW5jOiAnICsgZSlcbiAgLy8gICBjYWxsYmFjaygpXG4gIC8vIH1cbn1cblxuLy8qKioqKioqKioqXG5mdW5jdGlvbiBydW5TY3JpcHQoc2NyaXB0UGF0aCwgY2FsbGJhY2spIHtcbiAgdmFyIGNoaWxkUHJvY2VzcyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcbiAgLy8ga2VlcCB0cmFjayBvZiB3aGV0aGVyIGNhbGxiYWNrIGhhcyBiZWVuIGludm9rZWQgdG8gcHJldmVudCBtdWx0aXBsZSBpbnZvY2F0aW9uc1xuICB2YXIgaW52b2tlZCA9IGZhbHNlO1xuICB2YXIgcHJvY2VzcyA9IGNoaWxkUHJvY2Vzcy5mb3JrKHNjcmlwdFBhdGgpO1xuICAvLyBsaXN0ZW4gZm9yIGVycm9ycyBhcyB0aGV5IG1heSBwcmV2ZW50IHRoZSBleGl0IGV2ZW50IGZyb20gZmlyaW5nXG4gIHByb2Nlc3Mub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfSk7XG4gIC8vIGV4ZWN1dGUgdGhlIGNhbGxiYWNrIG9uY2UgdGhlIHByb2Nlc3MgaGFzIGZpbmlzaGVkIHJ1bm5pbmdcbiAgcHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uIChjb2RlKSB7XG4gICAgaWYgKGludm9rZWQpIHJldHVybjtcbiAgICBpbnZva2VkID0gdHJ1ZTtcbiAgICB2YXIgZXJyID0gY29kZSA9PT0gMCA/IG51bGwgOiBuZXcgRXJyb3IoJ2V4aXQgY29kZSAnICsgY29kZSk7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgfSk7XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF90b1h0eXBlKHN0cikge1xuICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnLScpXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRBcHAoKSB7XG4gIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbiAgdmFyIHByZWZpeCA9IGBgXG4gIGNvbnN0IHBsYXRmb3JtID0gcmVxdWlyZSgnb3MnKS5wbGF0Zm9ybSgpXG4gIGlmIChwbGF0Zm9ybSA9PSAnZGFyd2luJykgeyBwcmVmaXggPSBg4oS5IO+9omV4dO+9ozpgIH1cbiAgZWxzZSB7IHByZWZpeCA9IGBpIFtleHRdOmAgfVxuICByZXR1cm4gYCR7Y2hhbGsuZ3JlZW4ocHJlZml4KX0gYFxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0VmVyc2lvbnMocGx1Z2luTmFtZSwgZnJhbWV3b3JrTmFtZSkge1xuICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICB2YXIgdiA9IHt9XG4gIHZhciBwbHVnaW5QYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhJywgcGx1Z2luTmFtZSlcbiAgdmFyIHBsdWdpblBrZyA9IChmcy5leGlzdHNTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwbHVnaW5QYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5wbHVnaW5WZXJzaW9uID0gcGx1Z2luUGtnLnZlcnNpb25cbiAgdi5fcmVzb2x2ZWQgPSBwbHVnaW5Qa2cuX3Jlc29sdmVkXG4gIGlmICh2Ll9yZXNvbHZlZCA9PSB1bmRlZmluZWQpIHtcbiAgICB2LmVkaXRpb24gPSBgQ29tbWVyY2lhbGBcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAoLTEgPT0gdi5fcmVzb2x2ZWQuaW5kZXhPZignY29tbXVuaXR5JykpIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHYuZWRpdGlvbiA9IGBDb21tdW5pdHlgXG4gICAgfVxuICB9XG4gIHZhciB3ZWJwYWNrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvd2VicGFjaycpXG4gIHZhciB3ZWJwYWNrUGtnID0gKGZzLmV4aXN0c1N5bmMod2VicGFja1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYud2VicGFja1ZlcnNpb24gPSB3ZWJwYWNrUGtnLnZlcnNpb25cbiAgdmFyIGV4dFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0JylcbiAgdmFyIGV4dFBrZyA9IChmcy5leGlzdHNTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhleHRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5leHRWZXJzaW9uID0gZXh0UGtnLnNlbmNoYS52ZXJzaW9uXG4gIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gIHZhciBjbWRQa2cgPSAoZnMuZXhpc3RzU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgaWYgKHYuY21kVmVyc2lvbiA9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgY21kUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLGBub2RlX21vZHVsZXMvQHNlbmNoYS8ke3BsdWdpbk5hbWV9L25vZGVfbW9kdWxlcy9Ac2VuY2hhL2NtZGApXG4gICAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXG4gIH1cbiAgdmFyIGZyYW1ld29ya0luZm8gPSAnJ1xuICAgaWYgKGZyYW1ld29ya05hbWUgIT0gdW5kZWZpbmVkICYmIGZyYW1ld29ya05hbWUgIT0gJ2V4dGpzJykge1xuICAgIHZhciBmcmFtZXdvcmtQYXRoID0gJydcbiAgICBpZiAoZnJhbWV3b3JrTmFtZSA9PSAncmVhY3QnKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9yZWFjdCcpXG4gICAgfVxuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdhbmd1bGFyJykge1xuICAgICAgZnJhbWV3b3JrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQGFuZ3VsYXIvY29yZScpXG4gICAgfVxuICAgIHZhciBmcmFtZXdvcmtQa2cgPSAoZnMuZXhpc3RzU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZnJhbWV3b3JrUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gICAgdi5mcmFtZXdvcmtWZXJzaW9uID0gZnJhbWV3b3JrUGtnLnZlcnNpb25cbiAgICBpZiAodi5mcmFtZXdvcmtWZXJzaW9uID09IHVuZGVmaW5lZCkge1xuICAgICAgZnJhbWV3b3JrSW5mbyA9ICcsICcgKyBmcmFtZXdvcmtOYW1lXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZnJhbWV3b3JrSW5mbyA9ICcsICcgKyBmcmFtZXdvcmtOYW1lICsgJyB2JyArIHYuZnJhbWV3b3JrVmVyc2lvblxuICAgIH1cbiAgfVxuICByZXR1cm4gJ2V4dC13ZWJwYWNrLXBsdWdpbiB2JyArIHYucGx1Z2luVmVyc2lvbiArICcsIEV4dCBKUyB2JyArIHYuZXh0VmVyc2lvbiArICcgJyArIHYuZWRpdGlvbiArICcgRWRpdGlvbiwgU2VuY2hhIENtZCB2JyArIHYuY21kVmVyc2lvbiArICcsIHdlYnBhY2sgdicgKyB2LndlYnBhY2tWZXJzaW9uICsgZnJhbWV3b3JrSW5mb1xuIH1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9nKGFwcCxtZXNzYWdlKSB7XG4gIHZhciBzID0gYXBwICsgbWVzc2FnZVxuICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICB0cnkge3Byb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpfWNhdGNoKGUpIHt9XG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpO3Byb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBsb2doKGFwcCxtZXNzYWdlKSB7XG4gIHZhciBoID0gZmFsc2VcbiAgdmFyIHMgPSBhcHAgKyBtZXNzYWdlXG4gIGlmIChoID09IHRydWUpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9ndih2ZXJib3NlLCBzKSB7XG4gIGlmICh2ZXJib3NlID09ICd5ZXMnKSB7XG4gICAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgICB0cnkge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKClcbiAgICB9XG4gICAgY2F0Y2goZSkge31cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShgLXZlcmJvc2U6ICR7c31gKVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxuICB9XG59XG5cbmZ1bmN0aW9uIF9nZXRWYWxpZGF0ZU9wdGlvbnMoKSB7XG4gIHJldHVybiB7XG4gICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgIFwiZnJhbWV3b3JrXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwidG9vbGtpdFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInRoZW1lXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiZW1pdFwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwic2NyaXB0XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwicG9ydFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJpbnRlZ2VyXCJdXG4gICAgICB9LFxuICAgICAgXCJwYWNrYWdlc1wiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIiwgXCJhcnJheVwiXVxuICAgICAgfSxcbiAgICAgIFwicHJvZmlsZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImVudmlyb25tZW50XCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ2RldmVsb3BtZW50JyBvciAncHJvZHVjdGlvbicgc3RyaW5nIHZhbHVlXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInRyZWVzaGFrZVwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiYnJvd3NlclwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwid2F0Y2hcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInZlcmJvc2VcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjogZmFsc2VcbiAgfTtcbn1cblxuXG5mdW5jdGlvbiBfZ2V0RGVmYXVsdE9wdGlvbnMoKSB7XG4gIHJldHVybiB7XG4gICAgZnJhbWV3b3JrOiAnZXh0anMnLFxuICAgIHRvb2xraXQ6ICdtb2Rlcm4nLFxuICAgIHRoZW1lOiAndGhlbWUtbWF0ZXJpYWwnLFxuICAgIGVtaXQ6ICd5ZXMnLFxuICAgIHNjcmlwdDogbnVsbCxcbiAgICBwb3J0OiAxOTYyLFxuICAgIHBhY2thZ2VzOiBbXSxcblxuICAgIHByb2ZpbGU6ICcnLFxuICAgIGVudmlyb25tZW50OiAnZGV2ZWxvcG1lbnQnLFxuICAgIHRyZWVzaGFrZTogJ25vJyxcbiAgICBicm93c2VyOiAneWVzJyxcbiAgICB3YXRjaDogJ3llcycsXG4gICAgdmVyYm9zZTogJ25vJ1xuICB9XG59XG4iXX0=