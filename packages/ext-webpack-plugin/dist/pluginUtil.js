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

    if (framework == 'react' || framework == 'extjs') {
      if (vars.production == true) {
        vars.buildstep = '1 of 1';
        log(app, 'Starting Production Build for ' + framework);
      } else {
        vars.buildstep = '1 of 1';
        log(app, 'Starting Development Build for ' + framework);
      }
    } else if (vars.production == true) {
      if (treeshake == 'yes') {
        vars.buildstep = '1 of 2';
        log(app, 'Starting Production Build for ' + framework + ' - ' + vars.buildstep);

        require(`./${framework}Util`)._toProd(vars, options);
      } else {
        vars.buildstep = '2 of 2';
        log(app, 'Continuing Production Build for ' + framework + ' - ' + vars.buildstep);
      }
    } else {
      vars.buildstep = '1 of 1';
      log(app, 'Starting Production Build for ' + framework);
    }

    logv(verbose, 'Building for ' + options.environment + ', ' + 'Treeshake is ' + options.treeshake);
    var o = {};
    o.vars = vars;
    o.options = options;
    return o;
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
    throw '_thisCompilation: ' + e.toString();
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
        require('./pluginUtil').log(vars.app, `Ending Production Build`);
      } else {
        require('./pluginUtil').log(vars.app, `Ending Development Build`);
      }
    }

    if (vars.buildstep == '2 of 2') {
      require('./pluginUtil').log(vars.app, `Ending Production Build`);
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

    _executeAsync(app, sencha, parms, opts, compilation, options).then(function () {
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
          //  try {
          verbose = options.verbose; //const DEFAULT_SUBSTRS = ['[INF] Loading', '[INF] Processing', '[LOG] Fashion build complete', '[ERR]', '[WRN]', "[INF] Server", "[INF] Writing", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"];

          DEFAULT_SUBSTRS = ["[INF] xServer", '[INF] Loading', '[INF] Append', '[INF] Processing', '[INF] Processing Build', '[LOG] Fashion build complete', '[ERR]', '[WRN]', "[INF] Writing", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"];
          substrings = DEFAULT_SUBSTRS;
          chalk = require('chalk');
          crossSpawn = require('cross-spawn');
          logv(verbose, 'FUNCTION _executeAsync');
          _context2.next = 8;
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

        case 8:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsImluaXRpYWxPcHRpb25zIiwiZnMiLCJyZXF1aXJlIiwidmFycyIsIm9wdGlvbnMiLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwibyIsInRyZWVzaGFrZSIsInZlcmJvc2UiLCJ2YWxpZGF0ZU9wdGlvbnMiLCJfZ2V0VmFsaWRhdGVPcHRpb25zIiwicmMiLCJleGlzdHNTeW5jIiwiSlNPTiIsInBhcnNlIiwicmVhZEZpbGVTeW5jIiwiX2dldERlZmF1bHRPcHRpb25zIiwiX2dldERlZmF1bHRWYXJzIiwicGx1Z2luTmFtZSIsImFwcCIsIl9nZXRBcHAiLCJsb2d2IiwiZW52aXJvbm1lbnQiLCJwcm9kdWN0aW9uIiwibG9nIiwiX2dldFZlcnNpb25zIiwiYnVpbGRzdGVwIiwiX3RvUHJvZCIsImUiLCJ0b1N0cmluZyIsIl90aGlzQ29tcGlsYXRpb24iLCJjb21waWxlciIsImNvbXBpbGF0aW9uIiwic2NyaXB0IiwicnVuU2NyaXB0IiwiZXJyIiwiX2NvbXBpbGF0aW9uIiwiZXh0Q29tcG9uZW50cyIsIl9nZXRBbGxDb21wb25lbnRzIiwiaG9va3MiLCJzdWNjZWVkTW9kdWxlIiwidGFwIiwibW9kdWxlIiwicmVzb3VyY2UiLCJtYXRjaCIsIl9zb3VyY2UiLCJfdmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiZGVwcyIsIl9leHRyYWN0RnJvbVNvdXJjZSIsImZpbmlzaE1vZHVsZXMiLCJtb2R1bGVzIiwiX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIiLCJodG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uIiwiZGF0YSIsInBhdGgiLCJqc1BhdGgiLCJqb2luIiwiZXh0UGF0aCIsImNzc1BhdGgiLCJhc3NldHMiLCJqcyIsInVuc2hpZnQiLCJjc3MiLCJfYWZ0ZXJDb21waWxlIiwiX2VtaXQiLCJjYWxsYmFjayIsImVtaXQiLCJvdXRwdXRQYXRoIiwiZGV2U2VydmVyIiwiY29udGVudEJhc2UiLCJfcHJlcGFyZUZvckJ1aWxkIiwiY29tbWFuZCIsIndhdGNoIiwicmVidWlsZCIsInBhcm1zIiwicHJvZmlsZSIsIndhdGNoU3RhcnRlZCIsIl9idWlsZEV4dEJ1bmRsZSIsIl9kb25lIiwic3RhdHMiLCJlcnJvcnMiLCJsZW5ndGgiLCJjaGFsayIsImNvbnNvbGUiLCJyZWQiLCJwcm9jZXNzIiwiZXhpdCIsIl90b0RldiIsImJyb3dzZXIiLCJicm93c2VyQ291bnQiLCJ1cmwiLCJwb3J0Iiwib3BuIiwib3V0cHV0IiwicGFja2FnZXMiLCJ0b29sa2l0IiwidGhlbWUiLCJyaW1yYWYiLCJta2RpcnAiLCJmc3giLCJmaXJzdFRpbWUiLCJzeW5jIiwiYnVpbGRYTUwiLCJjcmVhdGVBcHBKc29uIiwiY3JlYXRlV29ya3NwYWNlSnNvbiIsImNyZWF0ZUpTRE9NRW52aXJvbm1lbnQiLCJ3cml0ZUZpbGVTeW5jIiwiY3dkIiwiZnJvbVBhdGgiLCJ0b1BhdGgiLCJjb3B5U3luYyIsInJlcGxhY2UiLCJmcm9tUmVzb3VyY2VzIiwidG9SZXNvdXJjZXMiLCJtYW5pZmVzdCIsImJ1bmRsZURpciIsInRyaW0iLCJzZW5jaGEiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm9uQnVpbGREb25lIiwib3B0cyIsInNpbGVudCIsInN0ZGlvIiwiZW5jb2RpbmciLCJfZXhlY3V0ZUFzeW5jIiwidGhlbiIsInJlYXNvbiIsIkRFRkFVTFRfU1VCU1RSUyIsInN1YnN0cmluZ3MiLCJjcm9zc1NwYXduIiwic3RyaW5naWZ5IiwiY2hpbGQiLCJvbiIsImNvZGUiLCJzaWduYWwiLCJFcnJvciIsImVycm9yIiwic3Rkb3V0Iiwic3RyIiwiZmlsZW5hbWUiLCJzb21lIiwidiIsImluZGV4T2YiLCJzdGRlcnIiLCJzdHJKYXZhT3B0cyIsInNjcmlwdFBhdGgiLCJjaGlsZFByb2Nlc3MiLCJpbnZva2VkIiwiZm9yayIsIl90b1h0eXBlIiwicHJlZml4IiwicGxhdGZvcm0iLCJncmVlbiIsImZyYW1ld29ya05hbWUiLCJwbHVnaW5QYXRoIiwicGx1Z2luUGtnIiwicGx1Z2luVmVyc2lvbiIsInZlcnNpb24iLCJfcmVzb2x2ZWQiLCJlZGl0aW9uIiwid2VicGFja1BhdGgiLCJ3ZWJwYWNrUGtnIiwid2VicGFja1ZlcnNpb24iLCJleHRQa2ciLCJleHRWZXJzaW9uIiwiY21kUGF0aCIsImNtZFBrZyIsImNtZFZlcnNpb24iLCJ2ZXJzaW9uX2Z1bGwiLCJmcmFtZXdvcmtJbmZvIiwiZnJhbWV3b3JrUGF0aCIsImZyYW1ld29ya1BrZyIsImZyYW1ld29ya1ZlcnNpb24iLCJtZXNzYWdlIiwicyIsImN1cnNvclRvIiwiY2xlYXJMaW5lIiwid3JpdGUiLCJsb2doIiwiaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNPLFNBQVNBLFlBQVQsQ0FBc0JDLGNBQXRCLEVBQXNDO0FBQzNDLFFBQU1DLEVBQUUsR0FBR0MsT0FBTyxDQUFDLElBQUQsQ0FBbEI7O0FBQ0EsTUFBSUMsSUFBSSxHQUFHLEVBQVg7QUFDQSxNQUFJQyxPQUFPLEdBQUcsRUFBZDs7QUFDQSxNQUFJO0FBQ0YsUUFBSUosY0FBYyxDQUFDSyxTQUFmLElBQTRCQyxTQUFoQyxFQUEyQztBQUN6Q0gsTUFBQUEsSUFBSSxDQUFDSSxZQUFMLEdBQW9CLEVBQXBCO0FBQ0FKLE1BQUFBLElBQUksQ0FBQ0ksWUFBTCxDQUFrQkMsSUFBbEIsQ0FBdUIsc0hBQXZCO0FBQ0EsVUFBSUMsQ0FBQyxHQUFHLEVBQVI7QUFDQUEsTUFBQUEsQ0FBQyxDQUFDTixJQUFGLEdBQVNBLElBQVQ7QUFDQSxhQUFPTSxDQUFQO0FBQ0Q7O0FBQ0QsUUFBSUosU0FBUyxHQUFHTCxjQUFjLENBQUNLLFNBQS9CO0FBQ0EsUUFBSUssU0FBUyxHQUFHVixjQUFjLENBQUNVLFNBQS9CO0FBQ0EsUUFBSUMsT0FBTyxHQUFHWCxjQUFjLENBQUNXLE9BQTdCOztBQUVBLFVBQU1DLGVBQWUs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RSxFQVBMO0FBU0xuQixJQUFBQSxPQUFPLEVBQUUsU0FUSjtBQVVMdkQsSUFBQUEsV0FBVyxFQUFFLGFBVlI7QUFXTGYsSUFBQUEsU0FBUyxFQUFFLElBWE47QUFZTG1GLElBQUFBLE9BQU8sRUFBRSxLQVpKO0FBYUxoQixJQUFBQSxLQUFLLEVBQUUsS0FiRjtBQWNMbEUsSUFBQUEsT0FBTyxFQUFFO0FBZEosR0FBUDtBQWdCRCIsInNvdXJjZXNDb250ZW50IjpbIi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb25zdHJ1Y3Rvcihpbml0aWFsT3B0aW9ucykge1xuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgdmFyIHZhcnMgPSB7fVxuICB2YXIgb3B0aW9ucyA9IHt9XG4gIHRyeSB7XG4gICAgaWYgKGluaXRpYWxPcHRpb25zLmZyYW1ld29yayA9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhcnMucGx1Z2luRXJyb3JzID0gW11cbiAgICAgIHZhcnMucGx1Z2luRXJyb3JzLnB1c2goJ3dlYnBhY2sgY29uZmlnOiBmcmFtZXdvcmsgcGFyYW1ldGVyIG9uIGV4dC13ZWJwYWNrLXBsdWdpbiBpcyBub3QgZGVmaW5lZCAtIHZhbHVlczogcmVhY3QsIGFuZ3VsYXIsIGV4dGpzLCBjb21wb25lbnRzJylcbiAgICAgIHZhciBvID0ge31cbiAgICAgIG8udmFycyA9IHZhcnNcbiAgICAgIHJldHVybiBvXG4gICAgfVxuICAgIHZhciBmcmFtZXdvcmsgPSBpbml0aWFsT3B0aW9ucy5mcmFtZXdvcmtcbiAgICB2YXIgdHJlZXNoYWtlID0gaW5pdGlhbE9wdGlvbnMudHJlZXNoYWtlXG4gICAgdmFyIHZlcmJvc2UgPSBpbml0aWFsT3B0aW9ucy52ZXJib3NlXG5cbiAgICBjb25zdCB2YWxpZGF0ZU9wdGlvbnMgPSByZXF1aXJlKCdzY2hlbWEtdXRpbHMnKVxuICAgIHZhbGlkYXRlT3B0aW9ucyhfZ2V0VmFsaWRhdGVPcHRpb25zKCksIGluaXRpYWxPcHRpb25zLCAnJylcblxuICAgIGNvbnN0IHJjID0gKGZzLmV4aXN0c1N5bmMoYC5leHQtJHtmcmFtZXdvcmt9cmNgKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhgLmV4dC0ke2ZyYW1ld29ya31yY2AsICd1dGYtOCcpKSB8fCB7fSlcbiAgICBvcHRpb25zID0geyAuLi5fZ2V0RGVmYXVsdE9wdGlvbnMoKSwgLi4uaW5pdGlhbE9wdGlvbnMsIC4uLnJjIH1cblxuICAgIHZhcnMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0RGVmYXVsdFZhcnMoKVxuICAgIHZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gICAgdmFycy5hcHAgPSBfZ2V0QXBwKClcbiAgICB2YXIgcGx1Z2luTmFtZSA9IHZhcnMucGx1Z2luTmFtZVxuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2NvbnN0cnVjdG9yJylcbiAgICBsb2d2KHZlcmJvc2UsIGBwbHVnaW5OYW1lIC0gJHtwbHVnaW5OYW1lfWApXG4gICAgbG9ndih2ZXJib3NlLCBgYXBwIC0gJHthcHB9YClcblxuICAgIGlmIChvcHRpb25zLmVudmlyb25tZW50ID09ICdwcm9kdWN0aW9uJykge3ZhcnMucHJvZHVjdGlvbiA9IHRydWV9XG4gICAgZWxzZSB7dmFycy5wcm9kdWN0aW9uID0gZmFsc2V9XG4gICAgXG4gICAgLy9sb2d2KHZlcmJvc2UsIGBvcHRpb25zOmApO2lmICh2ZXJib3NlID09ICd5ZXMnKSB7Y29uc29sZS5kaXIob3B0aW9ucyl9XG4gICAgLy9sb2d2KHZlcmJvc2UsIGB2YXJzOmApO2lmICh2ZXJib3NlID09ICd5ZXMnKSB7Y29uc29sZS5kaXIodmFycyl9XG4gICAgXG4gICAgbG9nKGFwcCwgX2dldFZlcnNpb25zKHBsdWdpbk5hbWUsIGZyYW1ld29yaykpXG5cbiAgICBpZiAoZnJhbWV3b3JrID09ICdyZWFjdCcgfHwgZnJhbWV3b3JrID09ICdleHRqcycpIHtcbiAgICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBQcm9kdWN0aW9uIEJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIERldmVsb3BtZW50IEJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgaWYgKHRyZWVzaGFrZSA9PSAneWVzJykge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDInXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBQcm9kdWN0aW9uIEJ1aWxkIGZvciAnICsgZnJhbWV3b3JrICsgJyAtICcgKyB2YXJzLmJ1aWxkc3RlcClcbiAgICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3RvUHJvZCh2YXJzLCBvcHRpb25zKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzIgb2YgMidcbiAgICAgICAgbG9nKGFwcCwgJ0NvbnRpbnVpbmcgUHJvZHVjdGlvbiBCdWlsZCBmb3IgJyArIGZyYW1ld29yayArICcgLSAnICsgdmFycy5idWlsZHN0ZXApXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJ1xuICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIFByb2R1Y3Rpb24gQnVpbGQgZm9yICcgKyBmcmFtZXdvcmspXG4gICAgfVxuICAgIGxvZ3YodmVyYm9zZSwgJ0J1aWxkaW5nIGZvciAnICsgb3B0aW9ucy5lbnZpcm9ubWVudCArICcsICcgKyAnVHJlZXNoYWtlIGlzICcgKyBvcHRpb25zLnRyZWVzaGFrZSlcblxuICAgIHZhciBvID0ge31cbiAgICBvLnZhcnMgPSB2YXJzXG4gICAgby5vcHRpb25zID0gb3B0aW9uc1xuICAgIHJldHVybiBvXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyAnX2NvbnN0cnVjdG9yOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3RoaXNDb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF90aGlzQ29tcGlsYXRpb24nKVxuICAgIGxvZ3YodmVyYm9zZSwgYG9wdGlvbnMuc2NyaXB0OiAke29wdGlvbnMuc2NyaXB0IH1gKVxuICAgIGxvZ3YodmVyYm9zZSwgYGJ1aWxkc3RlcDogJHt2YXJzLmJ1aWxkc3RlcH1gKVxuXG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc2NyaXB0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNjcmlwdCAhPSAnJykge1xuICAgICAgICAgICAgbG9nKGFwcCwgYFN0YXJ0ZWQgcnVubmluZyAke29wdGlvbnMuc2NyaXB0fWApXG4gICAgICAgICAgICBydW5TY3JpcHQob3B0aW9ucy5zY3JpcHQsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICBsb2coYXBwLCBgRmluaXNoZWQgcnVubmluZyAke29wdGlvbnMuc2NyaXB0fWApXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICB0aHJvdyAnX3RoaXNDb21waWxhdGlvbjogJyArIGUudG9TdHJpbmcoKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9jb21waWxhdGlvbicpXG4gICAgXG4gICAgaWYgKGZyYW1ld29yayA9PSAnZXh0anMnKSB7XG4gICAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfY29tcGlsYXRpb24gZW5kIChleHRqcyknKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHZhciBleHRDb21wb25lbnRzID0gW11cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMicpIHtcbiAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0QWxsQ29tcG9uZW50cyh2YXJzLCBvcHRpb25zKVxuICAgIH1cbiAgICBjb21waWxhdGlvbi5ob29rcy5zdWNjZWVkTW9kdWxlLnRhcChgZXh0LXN1Y2NlZWQtbW9kdWxlYCwgbW9kdWxlID0+IHtcbiAgICAgIGlmIChtb2R1bGUucmVzb3VyY2UgJiYgIW1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvbm9kZV9tb2R1bGVzLykpIHtcbiAgICAgICAgaWYobW9kdWxlLnJlc291cmNlLm1hdGNoKC9cXC5odG1sJC8pICE9IG51bGwpIHtcbiAgICAgICAgICBpZihtb2R1bGUuX3NvdXJjZS5fdmFsdWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnZG9jdHlwZSBodG1sJykgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgLi4uKHZhcnMuZGVwcyB8fCBbXSksXG4gICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFycy5kZXBzID0gW1xuICAgICAgICAgICAgLi4uKHZhcnMuZGVwcyB8fCBbXSksXG4gICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgICAgY29tcGlsYXRpb24uaG9va3MuZmluaXNoTW9kdWxlcy50YXAoYGV4dC1maW5pc2gtbW9kdWxlc2AsIG1vZHVsZXMgPT4ge1xuICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fd3JpdGVGaWxlc1RvUHJvZEZvbGRlcih2YXJzLCBvcHRpb25zKVxuICAgICAgfSlcbiAgICB9XG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09ICcyIG9mIDInKSB7XG4gICAgICBjb21waWxhdGlvbi5ob29rcy5odG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uLnRhcChgZXh0LWh0bWwtZ2VuZXJhdGlvbmAsKGRhdGEpID0+IHtcbiAgICAgICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgICB2YXIganNQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5qcycpXG4gICAgICAgIHZhciBjc3NQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5jc3MnKVxuICAgICAgICBkYXRhLmFzc2V0cy5qcy51bnNoaWZ0KGpzUGF0aClcbiAgICAgICAgZGF0YS5hc3NldHMuY3NzLnVuc2hpZnQoY3NzUGF0aClcbiAgICAgICAgbG9nKGFwcCwgYEFkZGluZyAke2pzUGF0aH0gYW5kICR7Y3NzUGF0aH0gdG8gaW5kZXguaHRtbGApXG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgdGhyb3cgJ19jb21waWxhdGlvbjogJyArIGUudG9TdHJpbmcoKVxuLy8gICAgbG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbi8vICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfY29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9hZnRlckNvbXBpbGUoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfYWZ0ZXJDb21waWxlJylcbiAgICBpZiAoZnJhbWV3b3JrID09ICdleHRqcycpIHtcbiAgICAgIHJlcXVpcmUoYC4vZXh0anNVdGlsYCkuX2FmdGVyQ29tcGlsZShjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfYWZ0ZXJDb21waWxlIG5vdCBydW4nKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgdGhyb3cgJ19hZnRlckNvbXBpbGU6ICcgKyBlLnRvU3RyaW5nKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZW1pdChjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGVtaXQgPSBvcHRpb25zLmVtaXRcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9lbWl0JylcbiAgICBpZiAoZW1pdCA9PSAneWVzJykge1xuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgICAgIGxldCBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGNvbXBpbGVyLm91dHB1dFBhdGgsdmFycy5leHRQYXRoKVxuICAgICAgICBpZiAoY29tcGlsZXIub3V0cHV0UGF0aCA9PT0gJy8nICYmIGNvbXBpbGVyLm9wdGlvbnMuZGV2U2VydmVyKSB7XG4gICAgICAgICAgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vcHRpb25zLmRldlNlcnZlci5jb250ZW50QmFzZSwgb3V0cHV0UGF0aClcbiAgICAgICAgfVxuICAgICAgICBsb2d2KHZlcmJvc2UsJ291dHB1dFBhdGg6ICcgKyBvdXRwdXRQYXRoKVxuICAgICAgICBsb2d2KHZlcmJvc2UsJ2ZyYW1ld29yazogJyArIGZyYW1ld29yaylcbiAgICAgICAgaWYgKGZyYW1ld29yayAhPSAnZXh0anMnKSB7XG4gICAgICAgICAgX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dFBhdGgsIGNvbXBpbGF0aW9uKVxuICAgICAgICB9XG4gICAgICAgIHZhciBjb21tYW5kID0gJydcbiAgICAgICAgaWYgKG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKVxuICAgICAgICAgIHtjb21tYW5kID0gJ3dhdGNoJ31cbiAgICAgICAgZWxzZSBcbiAgICAgICAgICB7Y29tbWFuZCA9ICdidWlsZCd9XG4gICAgICAgIGlmICh2YXJzLnJlYnVpbGQgPT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciBwYXJtcyA9IFtdXG4gICAgICAgICAgaWYgKG9wdGlvbnMucHJvZmlsZSA9PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5wcm9maWxlID09ICcnIHx8IG9wdGlvbnMucHJvZmlsZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoY29tbWFuZCA9PSAnYnVpbGQnKVxuICAgICAgICAgICAgICB7IHBhcm1zID0gWydhcHAnLCBjb21tYW5kLCBvcHRpb25zLmVudmlyb25tZW50XSB9XG4gICAgICAgICAgICBlbHNlIFxuICAgICAgICAgICAgICB7IHBhcm1zID0gWydhcHAnLCBjb21tYW5kLCAnLS13ZWItc2VydmVyJywgJ2ZhbHNlJywgb3B0aW9ucy5lbnZpcm9ubWVudF0gfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpIFxuICAgICAgICAgICAgICB7cGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF19XG4gICAgICAgICAgICBlbHNlIFxuICAgICAgICAgICAgICB7cGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLnByb2ZpbGUsIG9wdGlvbnMuZW52aXJvbm1lbnRdfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodmFycy53YXRjaFN0YXJ0ZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGF3YWl0IF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgb3B0aW9ucylcbiAgICAgICAgICAgIHZhcnMud2F0Y2hTdGFydGVkID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbG9ndih2ZXJib3NlLCdOT1QgcnVubmluZyBlbWl0JylcbiAgICAgICAgY2FsbGJhY2soKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxvZ3YodmVyYm9zZSwnZW1pdCBpcyBubycpXG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICBjYWxsYmFjaygpXG4gICAgdGhyb3cgJ19lbWl0OiAnICsgZS50b1N0cmluZygpXG4gICAgLy8gbG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgICAvLyBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2VtaXQ6ICcgKyBlKVxuICAgIC8vIGNhbGxiYWNrKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZG9uZShzdGF0cywgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfZG9uZScpXG4gICAgaWYgKHN0YXRzLmNvbXBpbGF0aW9uLmVycm9ycyAmJiBzdGF0cy5jb21waWxhdGlvbi5lcnJvcnMubGVuZ3RoKSAvLyAmJiBwcm9jZXNzLmFyZ3YuaW5kZXhPZignLS13YXRjaCcpID09IC0xKVxuICAgIHtcbiAgICAgIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJyk7XG4gICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQoJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKicpKTtcbiAgICAgIGNvbnNvbGUubG9nKHN0YXRzLmNvbXBpbGF0aW9uLmVycm9yc1swXSk7XG4gICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQoJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKicpKTtcbiAgICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgICB9XG5cbiAgICAvL21qZyByZWZhY3RvclxuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSAnbm8nICYmIGZyYW1ld29yayA9PSAnYW5ndWxhcicpIHtcbiAgICAgIHJlcXVpcmUoYC4vJHtvcHRpb25zLmZyYW1ld29ya31VdGlsYCkuX3RvRGV2KHZhcnMsIG9wdGlvbnMpXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBpZihvcHRpb25zLmJyb3dzZXIgPT0gJ3llcycgJiYgb3B0aW9ucy53YXRjaCA9PSAneWVzJyAmJiB2YXJzLnByb2R1Y3Rpb24gPT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHZhcnMuYnJvd3NlckNvdW50ID09IDApIHtcbiAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6JyArIG9wdGlvbnMucG9ydFxuICAgICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYE9wZW5pbmcgYnJvd3NlciBhdCAke3VybH1gKVxuICAgICAgICAgIHZhcnMuYnJvd3NlckNvdW50KytcbiAgICAgICAgICBjb25zdCBvcG4gPSByZXF1aXJlKCdvcG4nKVxuICAgICAgICAgIG9wbih1cmwpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJykge1xuICAgICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlKSB7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBQcm9kdWN0aW9uIEJ1aWxkYClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgRGV2ZWxvcG1lbnQgQnVpbGRgKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzIgb2YgMicpIHtcbiAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBQcm9kdWN0aW9uIEJ1aWxkYClcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuLy8gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgICB0aHJvdyAnX2RvbmU6ICcgKyBlLnRvU3RyaW5nKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0LCBjb21waWxhdGlvbikge1xuICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIHBhY2thZ2VzID0gb3B0aW9ucy5wYWNrYWdlc1xuICAgIHZhciB0b29sa2l0ID0gb3B0aW9ucy50b29sa2l0XG4gICAgdmFyIHRoZW1lID0gb3B0aW9ucy50aGVtZVxuICAgIGxvZ3YodmVyYm9zZSwnRlVOQ1RJT04gX3ByZXBhcmVGb3JCdWlsZCcpXG4gICAgY29uc3QgcmltcmFmID0gcmVxdWlyZSgncmltcmFmJylcbiAgICBjb25zdCBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKVxuICAgIGNvbnN0IGZzeCA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgdGhlbWUgPSB0aGVtZSB8fCAodG9vbGtpdCA9PT0gJ2NsYXNzaWMnID8gJ3RoZW1lLXRyaXRvbicgOiAndGhlbWUtbWF0ZXJpYWwnKVxuICAgIGxvZ3YodmVyYm9zZSwnZmlyc3RUaW1lOiAnICsgdmFycy5maXJzdFRpbWUpXG4gICAgaWYgKHZhcnMuZmlyc3RUaW1lKSB7XG4gICAgICByaW1yYWYuc3luYyhvdXRwdXQpXG4gICAgICBta2RpcnAuc3luYyhvdXRwdXQpXG4gICAgICBjb25zdCBidWlsZFhNTCA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuYnVpbGRYTUxcbiAgICAgIGNvbnN0IGNyZWF0ZUFwcEpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUFwcEpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZVdvcmtzcGFjZUpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZVdvcmtzcGFjZUpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZUpTRE9NRW52aXJvbm1lbnQgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUpTRE9NRW52aXJvbm1lbnRcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2J1aWxkLnhtbCcpLCBidWlsZFhNTCh2YXJzLnByb2R1Y3Rpb24sIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2FwcC5qc29uJyksIGNyZWF0ZUFwcEpzb24odGhlbWUsIHBhY2thZ2VzLCB0b29sa2l0LCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdqc2RvbS1lbnZpcm9ubWVudC5qcycpLCBjcmVhdGVKU0RPTUVudmlyb25tZW50KG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ3dvcmtzcGFjZS5qc29uJyksIGNyZWF0ZVdvcmtzcGFjZUpzb24ob3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgdmFyIGZyYW1ld29yayA9IHZhcnMuZnJhbWV3b3JrO1xuICAgICAgLy9iZWNhdXNlIG9mIGEgcHJvYmxlbSB3aXRoIGNvbG9ycGlja2VyXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3V4L2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAndXgnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgKHV4KSAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vcGFja2FnZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3BhY2thZ2VzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdvdmVycmlkZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCdyZXNvdXJjZXMvJykpKSB7XG4gICAgICAgIHZhciBmcm9tUmVzb3VyY2VzID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdyZXNvdXJjZXMvJylcbiAgICAgICAgdmFyIHRvUmVzb3VyY2VzID0gcGF0aC5qb2luKG91dHB1dCwgJy4uL3Jlc291cmNlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUmVzb3VyY2VzLCB0b1Jlc291cmNlcylcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21SZXNvdXJjZXMucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9SZXNvdXJjZXMucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgfVxuICAgIHZhcnMuZmlyc3RUaW1lID0gZmFsc2VcbiAgICB2YXIganMgPSAnJ1xuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24pIHtcbiAgICAgIGpzID0gdmFycy5kZXBzLmpvaW4oJztcXG4nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBqcyA9ICdFeHQucmVxdWlyZShcIkV4dC4qXCIpJ1xuICAgIH1cbiAgICBpZiAodmFycy5tYW5pZmVzdCA9PT0gbnVsbCB8fCBqcyAhPT0gdmFycy5tYW5pZmVzdCkge1xuICAgICAgdmFycy5tYW5pZmVzdCA9IGpzXG4gICAgICBjb25zdCBtYW5pZmVzdCA9IHBhdGguam9pbihvdXRwdXQsICdtYW5pZmVzdC5qcycpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKG1hbmlmZXN0LCBqcywgJ3V0ZjgnKVxuICAgICAgdmFycy5yZWJ1aWxkID0gdHJ1ZVxuICAgICAgdmFyIGJ1bmRsZURpciA9IG91dHB1dC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKVxuICAgICAgaWYgKGJ1bmRsZURpci50cmltKCkgPT0gJycpIHtidW5kbGVEaXIgPSAnLi8nfVxuICAgICAgbG9nKGFwcCwgJ0J1aWxkaW5nIEV4dCBidW5kbGUgYXQ6ICcgKyBidW5kbGVEaXIpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5yZWJ1aWxkID0gZmFsc2VcbiAgICAgIGxvZyhhcHAsICdFeHQgcmVidWlsZCBOT1QgbmVlZGVkJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19wcmVwYXJlRm9yQnVpbGQ6ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgb3B0aW9ucykge1xuLy8gIHRyeSB7XG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9idWlsZEV4dEJ1bmRsZScpXG4gICAgbGV0IHNlbmNoYTsgdHJ5IHsgc2VuY2hhID0gcmVxdWlyZSgnQHNlbmNoYS9jbWQnKSB9IGNhdGNoIChlKSB7IHNlbmNoYSA9ICdzZW5jaGEnIH1cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhzZW5jaGEpKSB7XG4gICAgICBsb2d2KHZlcmJvc2UsJ3NlbmNoYSBmb2xkZXIgZXhpc3RzJylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KHZlcmJvc2UsJ3NlbmNoYSBmb2xkZXIgRE9FUyBOT1QgZXhpc3QnKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgb25CdWlsZERvbmUgPSAoKSA9PiB7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwnb25CdWlsZERvbmUnKVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH1cbiAgICAgIHZhciBvcHRzID0geyBjd2Q6IG91dHB1dFBhdGgsIHNpbGVudDogdHJ1ZSwgc3RkaW86ICdwaXBlJywgZW5jb2Rpbmc6ICd1dGYtOCd9XG4gICAgICBfZXhlY3V0ZUFzeW5jKGFwcCwgc2VuY2hhLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIG9wdGlvbnMpLnRoZW4gKFxuICAgICAgICBmdW5jdGlvbigpIHsgb25CdWlsZERvbmUoKSB9LCBcbiAgICAgICAgZnVuY3Rpb24ocmVhc29uKSB7IHJlamVjdChyZWFzb24pIH1cbiAgICAgIClcbiAgICB9KVxuICAvLyB9XG4gIC8vIGNhdGNoKGUpIHtcbiAgLy8gICBjb25zb2xlLmxvZygnZScpXG4gIC8vICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgLy8gICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2J1aWxkRXh0QnVuZGxlOiAnICsgZSlcbiAgLy8gICBjYWxsYmFjaygpXG4gIC8vIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2V4ZWN1dGVBc3luYyAoYXBwLCBjb21tYW5kLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIG9wdGlvbnMpIHtcbi8vICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgLy9jb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBTZXJ2ZXJcIiwgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gICAgY29uc3QgREVGQVVMVF9TVUJTVFJTID0gW1wiW0lORl0geFNlcnZlclwiLCAnW0lORl0gTG9hZGluZycsICdbSU5GXSBBcHBlbmQnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbSU5GXSBQcm9jZXNzaW5nIEJ1aWxkJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgICB2YXIgc3Vic3RyaW5ncyA9IERFRkFVTFRfU1VCU1RSUyBcbiAgICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gICAgY29uc3QgY3Jvc3NTcGF3biA9IHJlcXVpcmUoJ2Nyb3NzLXNwYXduJylcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfZXhlY3V0ZUFzeW5jJylcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsb2d2KHZlcmJvc2UsYGNvbW1hbmQgLSAke2NvbW1hbmR9YClcbiAgICAgIGxvZ3YodmVyYm9zZSwgYHBhcm1zIC0gJHtwYXJtc31gKVxuICAgICAgbG9ndih2ZXJib3NlLCBgb3B0cyAtICR7SlNPTi5zdHJpbmdpZnkob3B0cyl9YClcbiAgICAgIGxldCBjaGlsZCA9IGNyb3NzU3Bhd24oY29tbWFuZCwgcGFybXMsIG9wdHMpXG4gICAgICBjaGlsZC5vbignY2xvc2UnLCAoY29kZSwgc2lnbmFsKSA9PiB7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwgYG9uIGNsb3NlOiBgICsgY29kZSkgXG4gICAgICAgIGlmKGNvZGUgPT09IDApIHsgcmVzb2x2ZSgwKSB9XG4gICAgICAgIGVsc2UgeyBjb21waWxhdGlvbi5lcnJvcnMucHVzaCggbmV3IEVycm9yKGNvZGUpICk7IHJlc29sdmUoMCkgfVxuICAgICAgfSlcbiAgICAgIGNoaWxkLm9uKCdlcnJvcicsIChlcnJvcikgPT4geyBcbiAgICAgICAgbG9ndih2ZXJib3NlLCBgb24gZXJyb3JgKSBcbiAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goZXJyb3IpXG4gICAgICAgIHJlc29sdmUoMClcbiAgICAgIH0pXG4gICAgICBjaGlsZC5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICB2YXIgc3RyID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UoL1xccj9cXG58XFxyL2csIFwiIFwiKS50cmltKClcbiAgICAgICAgbG9ndih2ZXJib3NlLCBgJHtzdHJ9YClcbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS50b1N0cmluZygpLm1hdGNoKC9GYXNoaW9uIHdhaXRpbmcgZm9yIGNoYW5nZXNcXC5cXC5cXC4vKSkge1xuXG4gICAgICAgICAgLy8gY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuICAgICAgICAgIC8vIHZhciBmaWxlbmFtZSA9IHByb2Nlc3MuY3dkKCkrJy9zcmMvaW5kZXguanMnO1xuICAgICAgICAgIC8vIHZhciBkYXRhID0gZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lKTtcbiAgICAgICAgICAvLyBmcy53cml0ZUZpbGVTeW5jKGZpbGVuYW1lLCBkYXRhICsgJyAnLCAndXRmOCcpXG4gICAgICAgICAgLy8gbG9ndih2ZXJib3NlLCBgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKVxuXG4gICAgICAgICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuICAgICAgICAgIHZhciBmaWxlbmFtZSA9IHByb2Nlc3MuY3dkKCkgKyAnL3NyYy9pbmRleC5qcyc7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lKTtcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZW5hbWUsIGRhdGEgKyAnICcsICd1dGY4Jyk7XG4gICAgICAgICAgICBsb2coYXBwLCBgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2goZSkge1xuICAgICAgICAgICAgbG9nKGFwcCwgYE5PVCB0b3VjaGluZyAke2ZpbGVuYW1lfWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUoMClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAoc3Vic3RyaW5ncy5zb21lKGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGRhdGEuaW5kZXhPZih2KSA+PSAwOyB9KSkgeyBcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0lORl1cIiwgXCJcIilcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0xPR11cIiwgXCJcIilcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKS50cmltKClcbiAgICAgICAgICAgIGlmIChzdHIuaW5jbHVkZXMoXCJbRVJSXVwiKSkge1xuICAgICAgICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChhcHAgKyBzdHIucmVwbGFjZSgvXlxcW0VSUlxcXSAvZ2ksICcnKSk7XG4gICAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0VSUl1cIiwgYCR7Y2hhbGsucmVkKFwiW0VSUl1cIil9YClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvZyhhcHAsIHN0cikgXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgbG9ndihvcHRpb25zLCBgZXJyb3Igb24gY2xvc2U6IGAgKyBkYXRhKSBcbiAgICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXG4gICAgICAgIHZhciBzdHJKYXZhT3B0cyA9IFwiUGlja2VkIHVwIF9KQVZBX09QVElPTlNcIjtcbiAgICAgICAgdmFyIGluY2x1ZGVzID0gc3RyLmluY2x1ZGVzKHN0ckphdmFPcHRzKVxuICAgICAgICBpZiAoIWluY2x1ZGVzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7YXBwfSAke2NoYWxrLnJlZChcIltFUlJdXCIpfSAke3N0cn1gKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIC8vIH1cbiAgLy8gY2F0Y2goZSkge1xuICAvLyAgIGxvZ3Yob3B0aW9ucyxlKVxuICAvLyAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfZXhlY3V0ZUFzeW5jOiAnICsgZSlcbiAgLy8gICBjYWxsYmFjaygpXG4gIC8vIH0gXG59XG5cbi8vKioqKioqKioqKlxuZnVuY3Rpb24gcnVuU2NyaXB0KHNjcmlwdFBhdGgsIGNhbGxiYWNrKSB7XG4gIHZhciBjaGlsZFByb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG4gIC8vIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBjYWxsYmFjayBoYXMgYmVlbiBpbnZva2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgaW52b2NhdGlvbnNcbiAgdmFyIGludm9rZWQgPSBmYWxzZTtcbiAgdmFyIHByb2Nlc3MgPSBjaGlsZFByb2Nlc3MuZm9yayhzY3JpcHRQYXRoKTtcbiAgLy8gbGlzdGVuIGZvciBlcnJvcnMgYXMgdGhleSBtYXkgcHJldmVudCB0aGUgZXhpdCBldmVudCBmcm9tIGZpcmluZ1xuICBwcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xuICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjayBvbmNlIHRoZSBwcm9jZXNzIGhhcyBmaW5pc2hlZCBydW5uaW5nXG4gIHByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZSkge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgdmFyIGVyciA9IGNvZGUgPT09IDAgPyBudWxsIDogbmV3IEVycm9yKCdleGl0IGNvZGUgJyArIGNvZGUpO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfdG9YdHlwZShzdHIpIHtcbiAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL18vZywgJy0nKVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0QXBwKCkge1xuICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gIHZhciBwcmVmaXggPSBgYFxuICBjb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKVxuICBpZiAocGxhdGZvcm0gPT0gJ2RhcndpbicpIHsgcHJlZml4ID0gYOKEuSDvvaJleHTvvaM6YCB9XG4gIGVsc2UgeyBwcmVmaXggPSBgaSBbZXh0XTpgIH1cbiAgcmV0dXJuIGAke2NoYWxrLmdyZWVuKHByZWZpeCl9IGBcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2dldFZlcnNpb25zKHBsdWdpbk5hbWUsIGZyYW1ld29ya05hbWUpIHtcbiAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgdmFyIHYgPSB7fVxuICB2YXIgcGx1Z2luUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQHNlbmNoYScsIHBsdWdpbk5hbWUpXG4gIHZhciBwbHVnaW5Qa2cgPSAoZnMuZXhpc3RzU3luYyhwbHVnaW5QYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGx1Z2luUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYucGx1Z2luVmVyc2lvbiA9IHBsdWdpblBrZy52ZXJzaW9uXG4gIHYuX3Jlc29sdmVkID0gcGx1Z2luUGtnLl9yZXNvbHZlZFxuICBpZiAodi5fcmVzb2x2ZWQgPT0gdW5kZWZpbmVkKSB7XG4gICAgdi5lZGl0aW9uID0gYENvbW1lcmNpYWxgXG4gIH1cbiAgZWxzZSB7XG4gICAgaWYgKC0xID09IHYuX3Jlc29sdmVkLmluZGV4T2YoJ2NvbW11bml0eScpKSB7XG4gICAgICB2LmVkaXRpb24gPSBgQ29tbWVyY2lhbGBcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2LmVkaXRpb24gPSBgQ29tbXVuaXR5YFxuICAgIH1cbiAgfVxuICB2YXIgd2VicGFja1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL3dlYnBhY2snKVxuICB2YXIgd2VicGFja1BrZyA9IChmcy5leGlzdHNTeW5jKHdlYnBhY2tQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMod2VicGFja1BhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LndlYnBhY2tWZXJzaW9uID0gd2VicGFja1BrZy52ZXJzaW9uXG4gIHZhciBleHRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dCcpXG4gIHZhciBleHRQa2cgPSAoZnMuZXhpc3RzU3luYyhleHRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZXh0UGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYuZXh0VmVyc2lvbiA9IGV4dFBrZy5zZW5jaGEudmVyc2lvblxuICB2YXIgY21kUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLGBub2RlX21vZHVsZXMvQHNlbmNoYS9jbWRgKVxuICB2YXIgY21kUGtnID0gKGZzLmV4aXN0c1N5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXG4gIGlmICh2LmNtZFZlcnNpb24gPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGNtZFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSxgbm9kZV9tb2R1bGVzL0BzZW5jaGEvJHtwbHVnaW5OYW1lfS9ub2RlX21vZHVsZXMvQHNlbmNoYS9jbWRgKVxuICAgIHZhciBjbWRQa2cgPSAoZnMuZXhpc3RzU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gICAgdi5jbWRWZXJzaW9uID0gY21kUGtnLnZlcnNpb25fZnVsbFxuICB9XG4gIHZhciBmcmFtZXdvcmtJbmZvID0gJydcbiAgIGlmIChmcmFtZXdvcmtOYW1lICE9IHVuZGVmaW5lZCAmJiBmcmFtZXdvcmtOYW1lICE9ICdleHRqcycpIHtcbiAgICB2YXIgZnJhbWV3b3JrUGF0aCA9ICcnXG4gICAgaWYgKGZyYW1ld29ya05hbWUgPT0gJ3JlYWN0Jykge1xuICAgICAgZnJhbWV3b3JrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvcmVhY3QnKVxuICAgIH1cbiAgICBpZiAoZnJhbWV3b3JrTmFtZSA9PSAnYW5ndWxhcicpIHtcbiAgICAgIGZyYW1ld29ya1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL2NvcmUnKVxuICAgIH1cbiAgICB2YXIgZnJhbWV3b3JrUGtnID0gKGZzLmV4aXN0c1N5bmMoZnJhbWV3b3JrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGZyYW1ld29ya1BhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICAgIHYuZnJhbWV3b3JrVmVyc2lvbiA9IGZyYW1ld29ya1BrZy52ZXJzaW9uXG4gICAgZnJhbWV3b3JrSW5mbyA9ICcsICcgKyBmcmFtZXdvcmtOYW1lICsgJyB2JyArIHYuZnJhbWV3b3JrVmVyc2lvblxuICB9XG4gIHJldHVybiAnZXh0LXdlYnBhY2stcGx1Z2luIHYnICsgdi5wbHVnaW5WZXJzaW9uICsgJywgRXh0IEpTIHYnICsgdi5leHRWZXJzaW9uICsgJyAnICsgdi5lZGl0aW9uICsgJyBFZGl0aW9uLCBTZW5jaGEgQ21kIHYnICsgdi5jbWRWZXJzaW9uICsgJywgd2VicGFjayB2JyArIHYud2VicGFja1ZlcnNpb24gKyBmcmFtZXdvcmtJbmZvXG4gfVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBsb2coYXBwLG1lc3NhZ2UpIHtcbiAgdmFyIHMgPSBhcHAgKyBtZXNzYWdlIFxuICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICB0cnkge3Byb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpfWNhdGNoKGUpIHt9XG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpO3Byb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBsb2doKGFwcCxtZXNzYWdlKSB7XG4gIHZhciBoID0gZmFsc2VcbiAgdmFyIHMgPSBhcHAgKyBtZXNzYWdlIFxuICBpZiAoaCA9PSB0cnVlKSB7XG4gICAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgICB0cnkge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKClcbiAgICB9XG4gICAgY2F0Y2goZSkge31cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShzKVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZ3YodmVyYm9zZSwgcykge1xuICBpZiAodmVyYm9zZSA9PSAneWVzJykge1xuICAgIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgfVxuICAgIGNhdGNoKGUpIHt9XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoYC12ZXJib3NlOiAke3N9YClcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbiAgfVxufVxuXG5mdW5jdGlvbiBfZ2V0VmFsaWRhdGVPcHRpb25zKCkge1xuICByZXR1cm4ge1xuICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICBcImZyYW1ld29ya1wiOiAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJ0b29sa2l0XCI6ICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwidGhlbWVcIjogICAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcImVtaXRcIjogICAgICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJzY3JpcHRcIjogICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwicG9ydFwiOiAgICAgICAge1widHlwZVwiOiBbIFwiaW50ZWdlclwiIF19LFxuICAgICAgXCJwYWNrYWdlc1wiOiAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiwgXCJhcnJheVwiIF19LFxuXG4gICAgICBcInByb2ZpbGVcIjogICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJlbnZpcm9ubWVudFwiOiB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwidHJlZXNoYWtlXCI6ICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcImJyb3dzZXJcIjogICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJ3YXRjaFwiOiAgICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwidmVyYm9zZVwiOiAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX1cbiAgICB9LFxuICAgIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjogZmFsc2VcbiAgfVxufVxuXG5mdW5jdGlvbiBfZ2V0RGVmYXVsdE9wdGlvbnMoKSB7XG4gIHJldHVybiB7XG4gICAgZnJhbWV3b3JrOiAnZXh0anMnLFxuICAgIHRvb2xraXQ6ICdtb2Rlcm4nLFxuICAgIHRoZW1lOiAndGhlbWUtbWF0ZXJpYWwnLFxuICAgIGVtaXQ6ICd5ZXMnLFxuICAgIHNjcmlwdDogbnVsbCxcbiAgICBwb3J0OiAxOTYyLFxuICAgIHBhY2thZ2VzOiBbXSxcblxuICAgIHByb2ZpbGU6ICdkZXNrdG9wJywgXG4gICAgZW52aXJvbm1lbnQ6ICdkZXZlbG9wbWVudCcsIFxuICAgIHRyZWVzaGFrZTogJ25vJyxcbiAgICBicm93c2VyOiAneWVzJyxcbiAgICB3YXRjaDogJ3llcycsXG4gICAgdmVyYm9zZTogJ25vJ1xuICB9XG59XG5cblxuIl19