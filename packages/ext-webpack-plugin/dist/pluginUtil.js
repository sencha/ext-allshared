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
    } //logv(verbose, `options:`);if (verbose == 'yes') {console.dir(options)}
    //logv(verbose, `vars:`);if (verbose == 'yes') {console.dir(vars)}


    log(app, _getVersions(pluginName, framework));

    if (framework == 'react' || framework == 'extjs' || framework === 'components') {
      if (vars.production == true) {
        vars.buildstep = '1 of 1';
        log(app, 'Starting Production Build for ' + framework);
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

    if (framework != 'extjs' && vars.production == true) {
      var extComponents = [];

      if (framework === 'components') {
        if (options.treeshake === 'yes') {
          compilation.hooks.succeedModule.tap(`ext-succeed-module`, module => {
            if (module.resource && !module.resource.match(/node_modules/)) {
              if (module.resource.match(/\.html$/) != null && module._source._value.toLowerCase().includes('doctype html') == false) {
                vars.deps = [...(vars.deps || []), //...require(`./${framework}Util`)._extractFromSource(module, options, compilation, true)]
                ...require(`./${framework}Util`)._extractFromSource(module, options, compilation, extComponents)];
              } else {
                vars.deps = [...(vars.deps || []), //...require(`./${framework}Util`)._extractFromSource(module, options, compilation, false)]
                ...require(`./${framework}Util`)._extractFromSource(module, options, compilation, extComponents)];
              }
            }
          });
        }
      } else {
        //var extComponents = []
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
      }
    } // if (framework != 'extjs') {
    //   var extComponents = []
    //   if (vars.buildstep == '1 of 2') {
    //     extComponents = require(`./${framework}Util`)._getAllComponents(vars, options)
    //   }
    //   compilation.hooks.succeedModule.tap(`ext-succeed-module`, module => {
    //     if (vars.production) {
    //       if (module.resource && !module.resource.match(/node_modules/)) {
    //         if(module.resource.match(/\.html$/) != null) {
    //           if(module._source._value.toLowerCase().includes('doctype html') == false) {
    //               vars.deps = [
    //                 ...(vars.deps || []),
    //                 ...require(`./${framework}Util`)._extractFromSource(module, options, compilation, extComponents)
    //               ]
    //           }
    //         }
    //         else {
    //             vars.deps = [
    //               ...(vars.deps || []),
    //               ...require(`./${framework}Util`)._extractFromSource(module, options, compilation, extComponents)
    //             ]
    //         }
    //       }
    //     }
    //   })
    //       if (framework === 'components') {
    //         if (options.treeshake === 'yes' && options.environment === 'production') {
    //           compilation.hooks.succeedModule.tap(`ext-succeed-module`, module => {
    //             if (module.resource && !module.resource.match(/node_modules/)) {
    //               if(module.resource.match(/\.html$/) != null
    //                 && module._source._value.toLowerCase().includes('doctype html') == false
    //               ) {
    //                 vars.deps = [
    //                   ...(vars.deps || []),
    //                   ...require(`./${framework}Util`)._extractFromSource(module, options, compilation, true)]
    //               }
    //               else {
    //                 vars.deps = [
    //                   ...(vars.deps || []),
    //                   ...require(`./${framework}Util`)._extractFromSource(module, options, compilation, false)]
    //               }
    //             }
    //           });
    //         }
    //       } else {
    //         var extComponents = []
    //         if (vars.buildstep == '1 of 2') {
    //           extComponents = require(`./${framework}Util`)._getAllComponents(vars, options)
    //         }
    //         compilation.hooks.succeedModule.tap(`ext-succeed-module`, module => {
    //           if (module.resource && !module.resource.match(/node_modules/)) {
    //             if(module.resource.match(/\.html$/) != null) {
    //               if(module._source._value.toLowerCase().includes('doctype html') == false) {
    //                 vars.deps = [
    //                   ...(vars.deps || []),
    //                   ...require(`./${framework}Util`)._extractFromSource(module, options, compilation, extComponents)]
    //               }
    //             }
    //             else {
    //               vars.deps = [
    //                 ...(vars.deps || []),
    //                 ...require(`./${framework}Util`)._extractFromSource(module, options, compilation, extComponents)]
    //             }
    //           }
    //         })
    //       }
    //   if (vars.buildstep == '1 of 2') {
    //     compilation.hooks.finishModules.tap(`ext-finish-modules`, modules => {
    //       require(`./${framework}Util`)._writeFilesToProdFolder(vars, options)
    //     })
    //   }
    //   if (vars.buildstep == '1 of 1' || vars.buildstep == '2 of 2') {
    //     compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tap(`ext-html-generation`,(data) => {
    //       const path = require('path')
    //       var jsPath = path.join(vars.extPath, 'ext.js')
    //       var cssPath = path.join(vars.extPath, 'ext.css')
    //       data.assets.js.unshift(jsPath)
    //       data.assets.css.unshift(cssPath)
    //       logv('yes', 'ALL DEPS');
    //       logv('yes', JSON.stringify(vars.deps));
    //       log(app, `Adding ${jsPath} and ${cssPath} to index.html`)
    //     })
    //   }
    // }

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
        require('./pluginUtil').log(vars.app, `Ending production build`);
      } else {
        require('./pluginUtil').log(vars.app, `Ending development build`);
      }
    }

    if (vars.buildstep == '2 of 2') {
      require('./pluginUtil').log(vars.app, `Ending production build`);
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
    prefix = `ℹ 「ext」:`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsImluaXRpYWxPcHRpb25zIiwiZnMiLCJyZXF1aXJlIiwidmFycyIsIm9wdGlvbnMiLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwicmVzdWx0IiwidHJlZXNoYWtlIiwidmVyYm9zZSIsInZhbGlkYXRlT3B0aW9ucyIsIl9nZXRWYWxpZGF0ZU9wdGlvbnMiLCJyYyIsImV4aXN0c1N5bmMiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJfZ2V0RGVmYXVsdE9wdGlvbnMiLCJfZ2V0RGVmYXVsdFZhcnMiLCJwbHVnaW5OYW1lIiwiYXBwIiwiX2dldEFwcCIsImxvZ3YiLCJlbnZpcm9ubWVudCIsInByb2R1Y3Rpb24iLCJicm93c2VyIiwid2F0Y2giLCJsb2ciLCJfZ2V0VmVyc2lvbnMiLCJidWlsZHN0ZXAiLCJfdG9Qcm9kIiwiY29uZmlnT2JqIiwiZSIsInRvU3RyaW5nIiwiX3RoaXNDb21waWxhdGlvbiIsImNvbXBpbGVyIiwiY29tcGlsYXRpb24iLCJzY3JpcHQiLCJydW5TY3JpcHQiLCJlcnIiLCJfY29tcGlsYXRpb24iLCJleHRDb21wb25lbnRzIiwiaG9va3MiLCJzdWNjZWVkTW9kdWxlIiwidGFwIiwibW9kdWxlIiwicmVzb3VyY2UiLCJtYXRjaCIsIl9zb3VyY2UiLCJfdmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiZGVwcyIsIl9leHRyYWN0RnJvbVNvdXJjZSIsIl9nZXRBbGxDb21wb25lbnRzIiwiX2FmdGVyQ29tcGlsZSIsIl9lbWl0IiwiY2FsbGJhY2siLCJwYXRoIiwiZW1pdCIsIm91dHB1dFBhdGgiLCJqb2luIiwiZXh0UGF0aCIsImRldlNlcnZlciIsImNvbnRlbnRCYXNlIiwiX3ByZXBhcmVGb3JCdWlsZCIsImNvbW1hbmQiLCJyZWJ1aWxkIiwicGFybXMiLCJwcm9maWxlIiwid2F0Y2hTdGFydGVkIiwiX2J1aWxkRXh0QnVuZGxlIiwiX2RvbmUiLCJzdGF0cyIsImVycm9ycyIsImxlbmd0aCIsImNoYWxrIiwiY29uc29sZSIsInJlZCIsInByb2Nlc3MiLCJleGl0IiwiX3RvRGV2IiwiYnJvd3NlckNvdW50IiwidXJsIiwicG9ydCIsIm9wbiIsIm91dHB1dCIsInBhY2thZ2VzIiwidG9vbGtpdCIsInRoZW1lIiwicmltcmFmIiwibWtkaXJwIiwiZnN4IiwiZmlyc3RUaW1lIiwic3luYyIsImJ1aWxkWE1MIiwiY3JlYXRlQXBwSnNvbiIsImNyZWF0ZVdvcmtzcGFjZUpzb24iLCJjcmVhdGVKU0RPTUVudmlyb25tZW50Iiwid3JpdGVGaWxlU3luYyIsImN3ZCIsImZyb21QYXRoIiwidG9QYXRoIiwiY29weVN5bmMiLCJyZXBsYWNlIiwiZnJvbVJlc291cmNlcyIsInRvUmVzb3VyY2VzIiwianMiLCJtYW5pZmVzdCIsImJ1bmRsZURpciIsInRyaW0iLCJzZW5jaGEiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm9uQnVpbGREb25lIiwib3B0cyIsInNpbGVudCIsInN0ZGlvIiwiZW5jb2RpbmciLCJfZXhlY3V0ZUFzeW5jIiwidGhlbiIsInJlYXNvbiIsIkRFRkFVTFRfU1VCU1RSUyIsInN1YnN0cmluZ3MiLCJjcm9zc1NwYXduIiwic3RyaW5naWZ5IiwiY2hpbGQiLCJvbiIsImNvZGUiLCJzaWduYWwiLCJFcnJvciIsImVycm9yIiwic3Rkb3V0IiwiZGF0YSIsInN0ciIsImZpbGVuYW1lIiwidG91Y2hGaWxlIiwiZCIsIkRhdGUiLCJ0b0xvY2FsZVN0cmluZyIsInNvbWUiLCJ2IiwiaW5kZXhPZiIsInN0ZGVyciIsInN0ckphdmFPcHRzIiwic2NyaXB0UGF0aCIsImNoaWxkUHJvY2VzcyIsImludm9rZWQiLCJmb3JrIiwiX3RvWHR5cGUiLCJwcmVmaXgiLCJwbGF0Zm9ybSIsImdyZWVuIiwiZnJhbWV3b3JrTmFtZSIsInBsdWdpblBhdGgiLCJwbHVnaW5Qa2ciLCJwbHVnaW5WZXJzaW9uIiwidmVyc2lvbiIsIl9yZXNvbHZlZCIsImVkaXRpb24iLCJ3ZWJwYWNrUGF0aCIsIndlYnBhY2tQa2ciLCJ3ZWJwYWNrVmVyc2lvbiIsImV4dFBrZyIsImV4dFZlcnNpb24iLCJjbWRQYXRoIiwiY21kUGtnIiwiY21kVmVyc2lvbiIsInZlcnNpb25fZnVsbCIsImZyYW1ld29ya0luZm8iLCJmcmFtZXdvcmtQYXRoIiwiZnJhbWV3b3JrUGtnIiwiZnJhbWV3b3JrVmVyc2lvbiIsIm1lc3NhZ2UiLCJzIiwiY3Vyc29yVG8iLCJjbGVhckxpbmUiLCJ3cml0ZSIsImxvZ2giLCJoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ08sU0FBU0EsWUFBVCxDQUFzQkMsY0FBdEIsRUFBc0M7QUFDM0MsUUFBTUMsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxNQUFJQyxJQUFJLEdBQUcsRUFBWDtBQUNBLE1BQUlDLE9BQU8sR0FBRyxFQUFkOztBQUNBLE1BQUk7QUFDRixRQUFJSixjQUFjLENBQUNLLFNBQWYsSUFBNEJDLFNBQWhDLEVBQTJDO0FBQ3pDSCxNQUFBQSxJQUFJLENBQUNJLFlBQUwsR0FBb0IsRUFBcEI7QUFDQUosTUFBQUEsSUFBSSxDQUFDSSxZQUFMLENBQWtCQyxJQUFsQixDQUF1QixzSEFBdkI7QUFDQSxVQUFJQyxNQUFNLEdBQUc7QUFBRU4sUUFBQUEsSUFBSSxFQUFFQTtBQUFSLE9BQWI7QUFDQSxhQUFPTSxNQUFQO0FBQ0Q7O0FBQ0QsUUFBSUosU0FBUyxHQUFHTCxjQUFjLENBQUNLLFNBQS9CO0FBQ0EsUUFBSUssU0FBUyxHQUFHVixjQUFjLENBQUNVLFNBQS9CO0FBQ0EsUUFBSUMsT0FBTyxHQUFHWCxjQUFjLENBQUNXLE9BQTdCOztBQUVBLFVBQU1DLGVBQWUsR0FBR1YsT0FBTyxDQUFDLGNBQUQsQ0FBL0I7O0FBQ0FVLElBQUFBLGVBQWUsQ0FBQ0MsbUJBQW1CLEVBQXBCLEVBQXdCYixjQUF4QixFQUF3QyxFQUF4QyxD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c0NvbnRlbnQiOlsiXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfY29uc3RydWN0b3IoaW5pdGlhbE9wdGlvbnMpIHtcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gIHZhciB2YXJzID0ge31cbiAgdmFyIG9wdGlvbnMgPSB7fVxuICB0cnkge1xuICAgIGlmIChpbml0aWFsT3B0aW9ucy5mcmFtZXdvcmsgPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXJzLnBsdWdpbkVycm9ycyA9IFtdXG4gICAgICB2YXJzLnBsdWdpbkVycm9ycy5wdXNoKCd3ZWJwYWNrIGNvbmZpZzogZnJhbWV3b3JrIHBhcmFtZXRlciBvbiBleHQtd2VicGFjay1wbHVnaW4gaXMgbm90IGRlZmluZWQgLSB2YWx1ZXM6IHJlYWN0LCBhbmd1bGFyLCBleHRqcywgY29tcG9uZW50cycpXG4gICAgICB2YXIgcmVzdWx0ID0geyB2YXJzOiB2YXJzIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICB2YXIgZnJhbWV3b3JrID0gaW5pdGlhbE9wdGlvbnMuZnJhbWV3b3JrXG4gICAgdmFyIHRyZWVzaGFrZSA9IGluaXRpYWxPcHRpb25zLnRyZWVzaGFrZVxuICAgIHZhciB2ZXJib3NlID0gaW5pdGlhbE9wdGlvbnMudmVyYm9zZVxuXG4gICAgY29uc3QgdmFsaWRhdGVPcHRpb25zID0gcmVxdWlyZSgnc2NoZW1hLXV0aWxzJylcbiAgICB2YWxpZGF0ZU9wdGlvbnMoX2dldFZhbGlkYXRlT3B0aW9ucygpLCBpbml0aWFsT3B0aW9ucywgJycpXG5cbiAgICBjb25zdCByYyA9IChmcy5leGlzdHNTeW5jKGAuZXh0LSR7ZnJhbWV3b3JrfXJjYCkgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoYC5leHQtJHtmcmFtZXdvcmt9cmNgLCAndXRmLTgnKSkgfHwge30pXG4gICAgb3B0aW9ucyA9IHsgLi4uX2dldERlZmF1bHRPcHRpb25zKCksIC4uLmluaXRpYWxPcHRpb25zLCAuLi5yYyB9XG5cbiAgICB2YXJzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2dldERlZmF1bHRWYXJzKClcbiAgICB2YXJzLnBsdWdpbk5hbWUgPSAnZXh0LXdlYnBhY2stcGx1Z2luJ1xuICAgIHZhcnMuYXBwID0gX2dldEFwcCgpXG4gICAgdmFyIHBsdWdpbk5hbWUgPSB2YXJzLnBsdWdpbk5hbWVcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcblxuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9jb25zdHJ1Y3RvcicpXG4gICAgbG9ndih2ZXJib3NlLCBgcGx1Z2luTmFtZSAtICR7cGx1Z2luTmFtZX1gKVxuICAgIGxvZ3YodmVyYm9zZSwgYGFwcCAtICR7YXBwfWApXG5cbiAgICBpZiAob3B0aW9ucy5lbnZpcm9ubWVudCA9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhcnMucHJvZHVjdGlvbiA9IHRydWVcbiAgICAgIG9wdGlvbnMuYnJvd3NlciA9ICdubydcbiAgICAgIG9wdGlvbnMud2F0Y2ggPSAnbm8nXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5wcm9kdWN0aW9uID0gZmFsc2VcbiAgICB9XG5cbiAgICAvL2xvZ3YodmVyYm9zZSwgYG9wdGlvbnM6YCk7aWYgKHZlcmJvc2UgPT0gJ3llcycpIHtjb25zb2xlLmRpcihvcHRpb25zKX1cbiAgICAvL2xvZ3YodmVyYm9zZSwgYHZhcnM6YCk7aWYgKHZlcmJvc2UgPT0gJ3llcycpIHtjb25zb2xlLmRpcih2YXJzKX1cblxuICAgIGxvZyhhcHAsIF9nZXRWZXJzaW9ucyhwbHVnaW5OYW1lLCBmcmFtZXdvcmspKVxuXG4gICAgaWYgKGZyYW1ld29yayA9PSAncmVhY3QnIHx8IGZyYW1ld29yayA9PSAnZXh0anMnIHx8IGZyYW1ld29yayA9PT0gJ2NvbXBvbmVudHMnKSB7XG4gICAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUpIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJ1xuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgUHJvZHVjdGlvbiBCdWlsZCBmb3IgJyArIGZyYW1ld29yaylcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBkZXZlbG9wbWVudCBidWlsZCBmb3IgJyArIGZyYW1ld29yaylcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUpIHtcbiAgICAgIGlmICh0cmVlc2hha2UgPT0gJ3llcycpIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAyJ1xuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJyArIGZyYW1ld29yayArICcgLSAnICsgdmFycy5idWlsZHN0ZXApXG4gICAgICAgIHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl90b1Byb2QodmFycywgb3B0aW9ucylcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcyIG9mIDInXG4gICAgICAgIGxvZyhhcHAsICdDb250aW51aW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICcgKyBmcmFtZXdvcmsgKyAnIC0gJyArIHZhcnMuYnVpbGRzdGVwKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgIGxvZyhhcHAsICdTdGFydGluZyBkZXZlbG9wbWVudCBidWlsZCBmb3IgJyArIGZyYW1ld29yaylcbiAgICB9XG4gICAgbG9ndih2ZXJib3NlLCAnQnVpbGRpbmcgZm9yICcgKyBvcHRpb25zLmVudmlyb25tZW50ICsgJywgJyArICdUcmVlc2hha2UgaXMgJyArIG9wdGlvbnMudHJlZXNoYWtlKVxuXG4gICAgdmFyIGNvbmZpZ09iaiA9IHsgdmFyczogdmFycywgb3B0aW9uczogb3B0aW9ucyB9O1xuICAgIHJldHVybiBjb25maWdPYmo7XG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyAnX2NvbnN0cnVjdG9yOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3RoaXNDb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF90aGlzQ29tcGlsYXRpb24nKVxuICAgIGxvZ3YodmVyYm9zZSwgYG9wdGlvbnMuc2NyaXB0OiAke29wdGlvbnMuc2NyaXB0IH1gKVxuICAgIGxvZ3YodmVyYm9zZSwgYGJ1aWxkc3RlcDogJHt2YXJzLmJ1aWxkc3RlcH1gKVxuXG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PT0gJzEgb2YgMicpIHtcbiAgICAgIGlmIChvcHRpb25zLnNjcmlwdCAhPSB1bmRlZmluZWQgJiYgb3B0aW9ucy5zY3JpcHQgIT0gbnVsbCAmJiBvcHRpb25zLnNjcmlwdCAhPSAnJykge1xuICAgICAgICBsb2coYXBwLCBgU3RhcnRlZCBydW5uaW5nICR7b3B0aW9ucy5zY3JpcHR9YClcbiAgICAgICAgcnVuU2NyaXB0KG9wdGlvbnMuc2NyaXB0LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxvZyhhcHAsIGBGaW5pc2hlZCBydW5uaW5nICR7b3B0aW9ucy5zY3JpcHR9YClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICB0aHJvdyAnX3RoaXNDb21waWxhdGlvbjogJyArIGUudG9TdHJpbmcoKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9jb21waWxhdGlvbicpXG5cbiAgICBpZiAoZnJhbWV3b3JrICE9ICdleHRqcycgJiYgdmFycy5wcm9kdWN0aW9uID09IHRydWUpIHtcblxuICAgICAgdmFyIGV4dENvbXBvbmVudHMgPSBbXVxuICAgICAgaWYgKGZyYW1ld29yayA9PT0gJ2NvbXBvbmVudHMnKSB7XG4gICAgICAgIGlmIChvcHRpb25zLnRyZWVzaGFrZSA9PT0gJ3llcycpIHtcbiAgICAgICAgICBjb21waWxhdGlvbi5ob29rcy5zdWNjZWVkTW9kdWxlLnRhcChgZXh0LXN1Y2NlZWQtbW9kdWxlYCwgbW9kdWxlID0+IHtcbiAgICAgICAgICAgIGlmIChtb2R1bGUucmVzb3VyY2UgJiYgIW1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvbm9kZV9tb2R1bGVzLykpIHtcbiAgICAgICAgICAgICAgaWYobW9kdWxlLnJlc291cmNlLm1hdGNoKC9cXC5odG1sJC8pICE9IG51bGxcbiAgICAgICAgICAgICAgICAmJiBtb2R1bGUuX3NvdXJjZS5fdmFsdWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnZG9jdHlwZSBodG1sJykgPT0gZmFsc2VcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdmFycy5kZXBzID0gW1xuICAgICAgICAgICAgICAgICAgLi4uKHZhcnMuZGVwcyB8fCBbXSksXG4gICAgICAgICAgICAgICAgICAvLy4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCB0cnVlKV1cbiAgICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4gICAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbiAgICAgICAgICAgICAgICAgIC8vLi4ucmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGZhbHNlKV1cbiAgICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IFxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vdmFyIGV4dENvbXBvbmVudHMgPSBbXVxuICAgICAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMicpIHtcbiAgICAgICAgICBleHRDb21wb25lbnRzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucylcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLnN1Y2NlZWRNb2R1bGUudGFwKGBleHQtc3VjY2VlZC1tb2R1bGVgLCBtb2R1bGUgPT4ge1xuICAgICAgICAgIGlmIChtb2R1bGUucmVzb3VyY2UgJiYgIW1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvbm9kZV9tb2R1bGVzLykpIHtcbiAgICAgICAgICAgIGlmKG1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvXFwuaHRtbCQvKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIGlmKG1vZHVsZS5fc291cmNlLl92YWx1ZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdkb2N0eXBlIGh0bWwnKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgICAgICAgICAgICAgICAgLi4ucmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgdmFycy5kZXBzID0gW1xuICAgICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuXG5cblxuXG4gICAgfVxuXG4gICAgLy8gaWYgKGZyYW1ld29yayAhPSAnZXh0anMnKSB7XG5cbiAgICAvLyAgIHZhciBleHRDb21wb25lbnRzID0gW11cbiAgICAvLyAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgIC8vICAgICBleHRDb21wb25lbnRzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucylcbiAgICAvLyAgIH1cbiAgICAvLyAgIGNvbXBpbGF0aW9uLmhvb2tzLnN1Y2NlZWRNb2R1bGUudGFwKGBleHQtc3VjY2VlZC1tb2R1bGVgLCBtb2R1bGUgPT4ge1xuICAgIC8vICAgICBpZiAodmFycy5wcm9kdWN0aW9uKSB7XG4gICAgLy8gICAgICAgaWYgKG1vZHVsZS5yZXNvdXJjZSAmJiAhbW9kdWxlLnJlc291cmNlLm1hdGNoKC9ub2RlX21vZHVsZXMvKSkge1xuICAgIC8vICAgICAgICAgaWYobW9kdWxlLnJlc291cmNlLm1hdGNoKC9cXC5odG1sJC8pICE9IG51bGwpIHtcbiAgICAvLyAgICAgICAgICAgaWYobW9kdWxlLl9zb3VyY2UuX3ZhbHVlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2RvY3R5cGUgaHRtbCcpID09IGZhbHNlKSB7XG4gICAgLy8gICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4gICAgLy8gICAgICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgIC8vICAgICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cylcbiAgICAvLyAgICAgICAgICAgICAgIF1cbiAgICAvLyAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgICAgZWxzZSB7XG4gICAgLy8gICAgICAgICAgICAgdmFycy5kZXBzID0gW1xuICAgIC8vICAgICAgICAgICAgICAgLi4uKHZhcnMuZGVwcyB8fCBbXSksXG4gICAgLy8gICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cylcbiAgICAvLyAgICAgICAgICAgICBdXG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gICB9KVxuXG4vLyAgICAgICBpZiAoZnJhbWV3b3JrID09PSAnY29tcG9uZW50cycpIHtcbi8vICAgICAgICAgaWYgKG9wdGlvbnMudHJlZXNoYWtlID09PSAneWVzJyAmJiBvcHRpb25zLmVudmlyb25tZW50ID09PSAncHJvZHVjdGlvbicpIHtcbi8vICAgICAgICAgICBjb21waWxhdGlvbi5ob29rcy5zdWNjZWVkTW9kdWxlLnRhcChgZXh0LXN1Y2NlZWQtbW9kdWxlYCwgbW9kdWxlID0+IHtcbi8vICAgICAgICAgICAgIGlmIChtb2R1bGUucmVzb3VyY2UgJiYgIW1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvbm9kZV9tb2R1bGVzLykpIHtcbi8vICAgICAgICAgICAgICAgaWYobW9kdWxlLnJlc291cmNlLm1hdGNoKC9cXC5odG1sJC8pICE9IG51bGxcbi8vICAgICAgICAgICAgICAgICAmJiBtb2R1bGUuX3NvdXJjZS5fdmFsdWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnZG9jdHlwZSBodG1sJykgPT0gZmFsc2Vcbi8vICAgICAgICAgICAgICAgKSB7XG4vLyAgICAgICAgICAgICAgICAgdmFycy5kZXBzID0gW1xuLy8gICAgICAgICAgICAgICAgICAgLi4uKHZhcnMuZGVwcyB8fCBbXSksXG4vLyAgICAgICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgdHJ1ZSldXG4vLyAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgZWxzZSB7XG4vLyAgICAgICAgICAgICAgICAgdmFycy5kZXBzID0gW1xuLy8gICAgICAgICAgICAgICAgICAgLi4uKHZhcnMuZGVwcyB8fCBbXSksXG4vLyAgICAgICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZmFsc2UpXVxuLy8gICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgfSk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHZhciBleHRDb21wb25lbnRzID0gW11cbi8vICAgICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4vLyAgICAgICAgICAgZXh0Q29tcG9uZW50cyA9IHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9nZXRBbGxDb21wb25lbnRzKHZhcnMsIG9wdGlvbnMpXG4vLyAgICAgICAgIH1cblxuLy8gICAgICAgICBjb21waWxhdGlvbi5ob29rcy5zdWNjZWVkTW9kdWxlLnRhcChgZXh0LXN1Y2NlZWQtbW9kdWxlYCwgbW9kdWxlID0+IHtcbi8vICAgICAgICAgICBpZiAobW9kdWxlLnJlc291cmNlICYmICFtb2R1bGUucmVzb3VyY2UubWF0Y2goL25vZGVfbW9kdWxlcy8pKSB7XG4vLyAgICAgICAgICAgICBpZihtb2R1bGUucmVzb3VyY2UubWF0Y2goL1xcLmh0bWwkLykgIT0gbnVsbCkge1xuLy8gICAgICAgICAgICAgICBpZihtb2R1bGUuX3NvdXJjZS5fdmFsdWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnZG9jdHlwZSBodG1sJykgPT0gZmFsc2UpIHtcbi8vICAgICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4vLyAgICAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbi8vICAgICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbi8vICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgZWxzZSB7XG4vLyAgICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbi8vICAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbi8vICAgICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICB9KVxuLy8gICAgICAgfVxuXG5cbiAgICAvLyAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgIC8vICAgICBjb21waWxhdGlvbi5ob29rcy5maW5pc2hNb2R1bGVzLnRhcChgZXh0LWZpbmlzaC1tb2R1bGVzYCwgbW9kdWxlcyA9PiB7XG4gICAgLy8gICAgICAgcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIodmFycywgb3B0aW9ucylcbiAgICAvLyAgICAgfSlcbiAgICAvLyAgIH1cbiAgICAvLyAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMiBvZiAyJykge1xuICAgIC8vICAgICBjb21waWxhdGlvbi5ob29rcy5odG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uLnRhcChgZXh0LWh0bWwtZ2VuZXJhdGlvbmAsKGRhdGEpID0+IHtcbiAgICAvLyAgICAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgLy8gICAgICAgdmFyIGpzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuanMnKVxuICAgIC8vICAgICAgIHZhciBjc3NQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5jc3MnKVxuICAgIC8vICAgICAgIGRhdGEuYXNzZXRzLmpzLnVuc2hpZnQoanNQYXRoKVxuICAgIC8vICAgICAgIGRhdGEuYXNzZXRzLmNzcy51bnNoaWZ0KGNzc1BhdGgpXG4gICAgLy8gICAgICAgbG9ndigneWVzJywgJ0FMTCBERVBTJyk7XG4gICAgLy8gICAgICAgbG9ndigneWVzJywgSlNPTi5zdHJpbmdpZnkodmFycy5kZXBzKSk7XG4gICAgLy8gICAgICAgbG9nKGFwcCwgYEFkZGluZyAke2pzUGF0aH0gYW5kICR7Y3NzUGF0aH0gdG8gaW5kZXguaHRtbGApXG4gICAgLy8gICAgIH0pXG4gICAgLy8gICB9XG4gICAgLy8gfVxuXG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHRocm93ICdfY29tcGlsYXRpb246ICcgKyBlLnRvU3RyaW5nKClcbi8vICAgIGxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4vLyAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2NvbXBpbGF0aW9uOiAnICsgZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfYWZ0ZXJDb21waWxlKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZScpXG4gICAgaWYgKGZyYW1ld29yayA9PSAnZXh0anMnKSB7XG4gICAgICByZXF1aXJlKGAuL2V4dGpzVXRpbGApLl9hZnRlckNvbXBpbGUoY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2FmdGVyQ29tcGlsZSBub3QgcnVuJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHRocm93ICdfYWZ0ZXJDb21waWxlOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2VtaXQoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB0cnkge1xuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBlbWl0ID0gb3B0aW9ucy5lbWl0XG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfZW1pdCcpXG4gICAgaWYgKGVtaXQgPT0gJ3llcycpIHtcbiAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJykge1xuICAgICAgICBsZXQgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vdXRwdXRQYXRoLHZhcnMuZXh0UGF0aClcbiAgICAgICAgaWYgKGNvbXBpbGVyLm91dHB1dFBhdGggPT09ICcvJyAmJiBjb21waWxlci5vcHRpb25zLmRldlNlcnZlcikge1xuICAgICAgICAgIG91dHB1dFBhdGggPSBwYXRoLmpvaW4oY29tcGlsZXIub3B0aW9ucy5kZXZTZXJ2ZXIuY29udGVudEJhc2UsIG91dHB1dFBhdGgpXG4gICAgICAgIH1cbiAgICAgICAgbG9ndih2ZXJib3NlLCdvdXRwdXRQYXRoOiAnICsgb3V0cHV0UGF0aClcbiAgICAgICAgbG9ndih2ZXJib3NlLCdmcmFtZXdvcms6ICcgKyBmcmFtZXdvcmspXG4gICAgICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgICAgIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXRQYXRoLCBjb21waWxhdGlvbilcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29tbWFuZCA9ICcnXG4gICAgICAgIGlmIChvcHRpb25zLndhdGNoID09ICd5ZXMnICYmIHZhcnMucHJvZHVjdGlvbiA9PSBmYWxzZSlcbiAgICAgICAgICB7Y29tbWFuZCA9ICd3YXRjaCd9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB7Y29tbWFuZCA9ICdidWlsZCd9XG4gICAgICAgIGlmICh2YXJzLnJlYnVpbGQgPT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciBwYXJtcyA9IFtdXG4gICAgICAgICAgaWYgKG9wdGlvbnMucHJvZmlsZSA9PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5wcm9maWxlID09ICcnIHx8IG9wdGlvbnMucHJvZmlsZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoY29tbWFuZCA9PSAnYnVpbGQnKVxuICAgICAgICAgICAgICB7IHBhcm1zID0gWydhcHAnLCBjb21tYW5kLCBvcHRpb25zLmVudmlyb25tZW50XSB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHsgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLmVudmlyb25tZW50XSB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT0gJ2J1aWxkJylcbiAgICAgICAgICAgICAge3Bhcm1zID0gWydhcHAnLCBjb21tYW5kLCBvcHRpb25zLnByb2ZpbGUsIG9wdGlvbnMuZW52aXJvbm1lbnRdfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB7cGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLnByb2ZpbGUsIG9wdGlvbnMuZW52aXJvbm1lbnRdfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodmFycy53YXRjaFN0YXJ0ZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGF3YWl0IF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgdmFycywgb3B0aW9ucylcbiAgICAgICAgICAgIHZhcnMud2F0Y2hTdGFydGVkID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbG9ndih2ZXJib3NlLCdOT1QgcnVubmluZyBlbWl0JylcbiAgICAgICAgY2FsbGJhY2soKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxvZ3YodmVyYm9zZSwnZW1pdCBpcyBubycpXG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICBjYWxsYmFjaygpXG4gICAgdGhyb3cgJ19lbWl0OiAnICsgZS50b1N0cmluZygpXG4gICAgLy8gbG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgICAvLyBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2VtaXQ6ICcgKyBlKVxuICAgIC8vIGNhbGxiYWNrKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZG9uZShzdGF0cywgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfZG9uZScpXG4gICAgaWYgKHN0YXRzLmNvbXBpbGF0aW9uLmVycm9ycyAmJiBzdGF0cy5jb21waWxhdGlvbi5lcnJvcnMubGVuZ3RoKSAvLyAmJiBwcm9jZXNzLmFyZ3YuaW5kZXhPZignLS13YXRjaCcpID09IC0xKVxuICAgIHtcbiAgICAgIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJyk7XG4gICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQoJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKicpKTtcbiAgICAgIGNvbnNvbGUubG9nKHN0YXRzLmNvbXBpbGF0aW9uLmVycm9yc1swXSk7XG4gICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQoJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKicpKTtcbiAgICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgICB9XG5cbiAgICAvL21qZyByZWZhY3RvclxuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSAmJiBvcHRpb25zLnRyZWVzaGFrZSA9PSAnbm8nICYmIGZyYW1ld29yayA9PSAnYW5ndWxhcicpIHtcbiAgICAgIHJlcXVpcmUoYC4vJHtvcHRpb25zLmZyYW1ld29ya31VdGlsYCkuX3RvRGV2KHZhcnMsIG9wdGlvbnMpXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBpZihvcHRpb25zLmJyb3dzZXIgPT0gJ3llcycgJiYgb3B0aW9ucy53YXRjaCA9PSAneWVzJyAmJiB2YXJzLnByb2R1Y3Rpb24gPT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHZhcnMuYnJvd3NlckNvdW50ID09IDApIHtcbiAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6JyArIG9wdGlvbnMucG9ydFxuICAgICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYE9wZW5pbmcgYnJvd3NlciBhdCAke3VybH1gKVxuICAgICAgICAgIHZhcnMuYnJvd3NlckNvdW50KytcbiAgICAgICAgICBjb25zdCBvcG4gPSByZXF1aXJlKCdvcG4nKVxuICAgICAgICAgIG9wbih1cmwpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJykge1xuICAgICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlKSB7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBwcm9kdWN0aW9uIGJ1aWxkYClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgZGV2ZWxvcG1lbnQgYnVpbGRgKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzIgb2YgMicpIHtcbiAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBwcm9kdWN0aW9uIGJ1aWxkYClcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuLy8gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgICB0aHJvdyAnX2RvbmU6ICcgKyBlLnRvU3RyaW5nKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfcHJlcGFyZUZvckJ1aWxkKGFwcCwgdmFycywgb3B0aW9ucywgb3V0cHV0LCBjb21waWxhdGlvbikge1xuICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIHBhY2thZ2VzID0gb3B0aW9ucy5wYWNrYWdlc1xuICAgIHZhciB0b29sa2l0ID0gb3B0aW9ucy50b29sa2l0XG4gICAgdmFyIHRoZW1lID0gb3B0aW9ucy50aGVtZVxuICAgIGxvZ3YodmVyYm9zZSwnRlVOQ1RJT04gX3ByZXBhcmVGb3JCdWlsZCcpXG4gICAgY29uc3QgcmltcmFmID0gcmVxdWlyZSgncmltcmFmJylcbiAgICBjb25zdCBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKVxuICAgIGNvbnN0IGZzeCA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgdGhlbWUgPSB0aGVtZSB8fCAodG9vbGtpdCA9PT0gJ2NsYXNzaWMnID8gJ3RoZW1lLXRyaXRvbicgOiAndGhlbWUtbWF0ZXJpYWwnKVxuICAgIGxvZ3YodmVyYm9zZSwnZmlyc3RUaW1lOiAnICsgdmFycy5maXJzdFRpbWUpXG4gICAgaWYgKHZhcnMuZmlyc3RUaW1lKSB7XG4gICAgICByaW1yYWYuc3luYyhvdXRwdXQpXG4gICAgICBta2RpcnAuc3luYyhvdXRwdXQpXG4gICAgICBjb25zdCBidWlsZFhNTCA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuYnVpbGRYTUxcbiAgICAgIGNvbnN0IGNyZWF0ZUFwcEpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUFwcEpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZVdvcmtzcGFjZUpzb24gPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZVdvcmtzcGFjZUpzb25cbiAgICAgIGNvbnN0IGNyZWF0ZUpTRE9NRW52aXJvbm1lbnQgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmNyZWF0ZUpTRE9NRW52aXJvbm1lbnRcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2J1aWxkLnhtbCcpLCBidWlsZFhNTCh2YXJzLnByb2R1Y3Rpb24sIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2FwcC5qc29uJyksIGNyZWF0ZUFwcEpzb24odGhlbWUsIHBhY2thZ2VzLCB0b29sa2l0LCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdqc2RvbS1lbnZpcm9ubWVudC5qcycpLCBjcmVhdGVKU0RPTUVudmlyb25tZW50KG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ3dvcmtzcGFjZS5qc29uJyksIGNyZWF0ZVdvcmtzcGFjZUpzb24ob3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgdmFyIGZyYW1ld29yayA9IHZhcnMuZnJhbWV3b3JrO1xuICAgICAgLy9iZWNhdXNlIG9mIGEgcHJvYmxlbSB3aXRoIGNvbG9ycGlja2VyXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3V4L2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAndXgnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgKHV4KSAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vcGFja2FnZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3BhY2thZ2VzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS9vdmVycmlkZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdvdmVycmlkZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCdyZXNvdXJjZXMvJykpKSB7XG4gICAgICAgIHZhciBmcm9tUmVzb3VyY2VzID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdyZXNvdXJjZXMvJylcbiAgICAgICAgdmFyIHRvUmVzb3VyY2VzID0gcGF0aC5qb2luKG91dHB1dCwgJy4uL3Jlc291cmNlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUmVzb3VyY2VzLCB0b1Jlc291cmNlcylcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21SZXNvdXJjZXMucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9SZXNvdXJjZXMucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgfVxuICAgIHZhcnMuZmlyc3RUaW1lID0gZmFsc2VcbiAgICB2YXIganMgPSAnJ1xuICAgIGlmICh2YXJzLnByb2R1Y3Rpb24pIHtcbiAgICAgIGpzID0gdmFycy5kZXBzLmpvaW4oJztcXG4nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBqcyA9IGBFeHQucmVxdWlyZShbXCJFeHQuKlwiLFwiRXh0LmRhdGEuVHJlZVN0b3JlXCJdKWBcbiAgICB9XG4gICAgaWYgKHZhcnMubWFuaWZlc3QgPT09IG51bGwgfHwganMgIT09IHZhcnMubWFuaWZlc3QpIHtcbiAgICAgIHZhcnMubWFuaWZlc3QgPSBqc1xuICAgICAgY29uc3QgbWFuaWZlc3QgPSBwYXRoLmpvaW4ob3V0cHV0LCAnbWFuaWZlc3QuanMnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhtYW5pZmVzdCwganMsICd1dGY4JylcbiAgICAgIHZhcnMucmVidWlsZCA9IHRydWVcbiAgICAgIHZhciBidW5kbGVEaXIgPSBvdXRwdXQucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJylcbiAgICAgIGlmIChidW5kbGVEaXIudHJpbSgpID09ICcnKSB7YnVuZGxlRGlyID0gJy4vJ31cbiAgICAgIGxvZyhhcHAsICdCdWlsZGluZyBFeHQgYnVuZGxlIGF0OiAnICsgYnVuZGxlRGlyKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhcnMucmVidWlsZCA9IGZhbHNlXG4gICAgICBsb2coYXBwLCAnRXh0IHJlYnVpbGQgTk9UIG5lZWRlZCcpXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfcHJlcGFyZUZvckJ1aWxkOiAnICsgZSlcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfYnVpbGRFeHRCdW5kbGUoYXBwLCBjb21waWxhdGlvbiwgb3V0cHV0UGF0aCwgcGFybXMsIHZhcnMsIG9wdGlvbnMpIHtcbi8vICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfYnVpbGRFeHRCdW5kbGUnKVxuICAgIGxldCBzZW5jaGE7IHRyeSB7IHNlbmNoYSA9IHJlcXVpcmUoJ0BzZW5jaGEvY21kJykgfSBjYXRjaCAoZSkgeyBzZW5jaGEgPSAnc2VuY2hhJyB9XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoc2VuY2hhKSkge1xuICAgICAgbG9ndih2ZXJib3NlLCdzZW5jaGEgZm9sZGVyIGV4aXN0cycpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndih2ZXJib3NlLCdzZW5jaGEgZm9sZGVyIERPRVMgTk9UIGV4aXN0JylcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IG9uQnVpbGREb25lID0gKCkgPT4ge1xuICAgICAgICBsb2d2KHZlcmJvc2UsJ29uQnVpbGREb25lJylcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9XG4gICAgICB2YXIgb3B0cyA9IHsgY3dkOiBvdXRwdXRQYXRoLCBzaWxlbnQ6IHRydWUsIHN0ZGlvOiAncGlwZScsIGVuY29kaW5nOiAndXRmLTgnfVxuICAgICAgX2V4ZWN1dGVBc3luYyhhcHAsIHNlbmNoYSwgcGFybXMsIG9wdHMsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKS50aGVuIChcbiAgICAgICAgZnVuY3Rpb24oKSB7IG9uQnVpbGREb25lKCkgfSxcbiAgICAgICAgZnVuY3Rpb24ocmVhc29uKSB7IHJlamVjdChyZWFzb24pIH1cbiAgICAgIClcbiAgICB9KVxuICAvLyB9XG4gIC8vIGNhdGNoKGUpIHtcbiAgLy8gICBjb25zb2xlLmxvZygnZScpXG4gIC8vICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbiAgLy8gICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2J1aWxkRXh0QnVuZGxlOiAnICsgZSlcbiAgLy8gICBjYWxsYmFjaygpXG4gIC8vIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gX2V4ZWN1dGVBc3luYyAoYXBwLCBjb21tYW5kLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbi8vICB0cnkge1xuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgLy9jb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBTZXJ2ZXJcIiwgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gICAgY29uc3QgREVGQVVMVF9TVUJTVFJTID0gW1wiW0lORl0geFNlcnZlclwiLCAnW0lORl0gTG9hZGluZycsICdbSU5GXSBBcHBlbmQnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbSU5GXSBQcm9jZXNzaW5nIEJ1aWxkJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgICB2YXIgc3Vic3RyaW5ncyA9IERFRkFVTFRfU1VCU1RSU1xuICAgIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbiAgICBjb25zdCBjcm9zc1NwYXduID0gcmVxdWlyZSgnY3Jvc3Mtc3Bhd24nKVxuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9leGVjdXRlQXN5bmMnKVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxvZ3YodmVyYm9zZSxgY29tbWFuZCAtICR7Y29tbWFuZH1gKVxuICAgICAgbG9ndih2ZXJib3NlLCBgcGFybXMgLSAke3Bhcm1zfWApXG4gICAgICBsb2d2KHZlcmJvc2UsIGBvcHRzIC0gJHtKU09OLnN0cmluZ2lmeShvcHRzKX1gKVxuICAgICAgbGV0IGNoaWxkID0gY3Jvc3NTcGF3bihjb21tYW5kLCBwYXJtcywgb3B0cylcbiAgICAgIGNoaWxkLm9uKCdjbG9zZScsIChjb2RlLCBzaWduYWwpID0+IHtcbiAgICAgICAgbG9ndih2ZXJib3NlLCBgb24gY2xvc2U6IGAgKyBjb2RlKVxuICAgICAgICBpZihjb2RlID09PSAwKSB7IHJlc29sdmUoMCkgfVxuICAgICAgICBlbHNlIHsgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goIG5ldyBFcnJvcihjb2RlKSApOyByZXNvbHZlKDApIH1cbiAgICAgIH0pXG4gICAgICBjaGlsZC5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAgICAgbG9ndih2ZXJib3NlLCBgb24gZXJyb3JgKVxuICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChlcnJvcilcbiAgICAgICAgcmVzb2x2ZSgwKVxuICAgICAgfSlcbiAgICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICBsb2d2KHZlcmJvc2UsIGAke3N0cn1gKVxuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkubWF0Y2goL0Zhc2hpb24gd2FpdGluZyBmb3IgY2hhbmdlc1xcLlxcLlxcLi8pKSB7XG5cbiAgICAgICAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICAgICAgdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSArIHZhcnMudG91Y2hGaWxlO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKVxuICAgICAgICAgICAgdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgJy8vJyArIGQsICd1dGY4Jyk7XG4gICAgICAgICAgICBsb2d2KGFwcCwgYHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGxvZ3YoYXBwLCBgTk9UIHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZSgwKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmIChzdWJzdHJpbmdzLnNvbWUoZnVuY3Rpb24odikgeyByZXR1cm4gZGF0YS5pbmRleE9mKHYpID49IDA7IH0pKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltJTkZdXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltMT0ddXCIsIFwiXCIpXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykudHJpbSgpXG4gICAgICAgICAgICBpZiAoc3RyLmluY2x1ZGVzKFwiW0VSUl1cIikpIHtcbiAgICAgICAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goYXBwICsgc3RyLnJlcGxhY2UoL15cXFtFUlJcXF0gL2dpLCAnJykpO1xuICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltFUlJdXCIsIGAke2NoYWxrLnJlZChcIltFUlJdXCIpfWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2coYXBwLCBzdHIpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgbG9ndihvcHRpb25zLCBgZXJyb3Igb24gY2xvc2U6IGAgKyBkYXRhKVxuICAgICAgICB2YXIgc3RyID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UoL1xccj9cXG58XFxyL2csIFwiIFwiKS50cmltKClcbiAgICAgICAgdmFyIHN0ckphdmFPcHRzID0gXCJQaWNrZWQgdXAgX0pBVkFfT1BUSU9OU1wiO1xuICAgICAgICB2YXIgaW5jbHVkZXMgPSBzdHIuaW5jbHVkZXMoc3RySmF2YU9wdHMpXG4gICAgICAgIGlmICghaW5jbHVkZXMpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJHthcHB9ICR7Y2hhbGsucmVkKFwiW0VSUl1cIil9ICR7c3RyfWApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgLy8gfVxuICAvLyBjYXRjaChlKSB7XG4gIC8vICAgbG9ndihvcHRpb25zLGUpXG4gIC8vICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19leGVjdXRlQXN5bmM6ICcgKyBlKVxuICAvLyAgIGNhbGxiYWNrKClcbiAgLy8gfVxufVxuXG4vLyoqKioqKioqKipcbmZ1bmN0aW9uIHJ1blNjcmlwdChzY3JpcHRQYXRoLCBjYWxsYmFjaykge1xuICB2YXIgY2hpbGRQcm9jZXNzID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xuICAvLyBrZWVwIHRyYWNrIG9mIHdoZXRoZXIgY2FsbGJhY2sgaGFzIGJlZW4gaW52b2tlZCB0byBwcmV2ZW50IG11bHRpcGxlIGludm9jYXRpb25zXG4gIHZhciBpbnZva2VkID0gZmFsc2U7XG4gIHZhciBwcm9jZXNzID0gY2hpbGRQcm9jZXNzLmZvcmsoc2NyaXB0UGF0aCk7XG4gIC8vIGxpc3RlbiBmb3IgZXJyb3JzIGFzIHRoZXkgbWF5IHByZXZlbnQgdGhlIGV4aXQgZXZlbnQgZnJvbSBmaXJpbmdcbiAgcHJvY2Vzcy5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKGludm9rZWQpIHJldHVybjtcbiAgICBpbnZva2VkID0gdHJ1ZTtcbiAgICBjYWxsYmFjayhlcnIpO1xuICB9KTtcbiAgLy8gZXhlY3V0ZSB0aGUgY2FsbGJhY2sgb25jZSB0aGUgcHJvY2VzcyBoYXMgZmluaXNoZWQgcnVubmluZ1xuICBwcm9jZXNzLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGUpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIHZhciBlcnIgPSBjb2RlID09PSAwID8gbnVsbCA6IG5ldyBFcnJvcignZXhpdCBjb2RlICcgKyBjb2RlKTtcbiAgICBjYWxsYmFjayhlcnIpO1xuICB9KTtcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3RvWHR5cGUoc3RyKSB7XG4gIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9fL2csICctJylcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2dldEFwcCgpIHtcbiAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKVxuICB2YXIgcHJlZml4ID0gYGBcbiAgY29uc3QgcGxhdGZvcm0gPSByZXF1aXJlKCdvcycpLnBsYXRmb3JtKClcbiAgaWYgKHBsYXRmb3JtID09ICdkYXJ3aW4nKSB7IHByZWZpeCA9IGDihLkg44CMZXh044CNOmAgfVxuICBlbHNlIHsgcHJlZml4ID0gYGkgW2V4dF06YCB9XG4gIHJldHVybiBgJHtjaGFsay5ncmVlbihwcmVmaXgpfSBgXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRWZXJzaW9ucyhwbHVnaW5OYW1lLCBmcmFtZXdvcmtOYW1lKSB7XG4gIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gIHZhciB2ID0ge31cbiAgdmFyIHBsdWdpblBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEnLCBwbHVnaW5OYW1lKVxuICB2YXIgcGx1Z2luUGtnID0gKGZzLmV4aXN0c1N5bmMocGx1Z2luUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LnBsdWdpblZlcnNpb24gPSBwbHVnaW5Qa2cudmVyc2lvblxuICB2Ll9yZXNvbHZlZCA9IHBsdWdpblBrZy5fcmVzb2x2ZWRcbiAgaWYgKHYuX3Jlc29sdmVkID09IHVuZGVmaW5lZCkge1xuICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICB9XG4gIGVsc2Uge1xuICAgIGlmICgtMSA9PSB2Ll9yZXNvbHZlZC5pbmRleE9mKCdjb21tdW5pdHknKSkge1xuICAgICAgdi5lZGl0aW9uID0gYENvbW1lcmNpYWxgXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdi5lZGl0aW9uID0gYENvbW11bml0eWBcbiAgICB9XG4gIH1cbiAgdmFyIHdlYnBhY2tQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy93ZWJwYWNrJylcbiAgdmFyIHdlYnBhY2tQa2cgPSAoZnMuZXhpc3RzU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHdlYnBhY2tQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi53ZWJwYWNrVmVyc2lvbiA9IHdlYnBhY2tQa2cudmVyc2lvblxuICB2YXIgZXh0UGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQHNlbmNoYS9leHQnKVxuICB2YXIgZXh0UGtnID0gKGZzLmV4aXN0c1N5bmMoZXh0UGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LmV4dFZlcnNpb24gPSBleHRQa2cuc2VuY2hhLnZlcnNpb25cbiAgdmFyIGNtZFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSxgbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5jbWRWZXJzaW9uID0gY21kUGtnLnZlcnNpb25fZnVsbFxuICBpZiAodi5jbWRWZXJzaW9uID09IHVuZGVmaW5lZCkge1xuICAgIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhLyR7cGx1Z2luTmFtZX0vbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgICB2YXIgY21kUGtnID0gKGZzLmV4aXN0c1N5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICAgIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgfVxuICB2YXIgZnJhbWV3b3JrSW5mbyA9ICcnXG4gICBpZiAoZnJhbWV3b3JrTmFtZSAhPSB1bmRlZmluZWQgJiYgZnJhbWV3b3JrTmFtZSAhPSAnZXh0anMnKSB7XG4gICAgdmFyIGZyYW1ld29ya1BhdGggPSAnJ1xuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdyZWFjdCcpIHtcbiAgICAgIGZyYW1ld29ya1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL3JlYWN0JylcbiAgICB9XG4gICAgaWYgKGZyYW1ld29ya05hbWUgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9AYW5ndWxhci9jb3JlJylcbiAgICB9XG4gICAgdmFyIGZyYW1ld29ya1BrZyA9IChmcy5leGlzdHNTeW5jKGZyYW1ld29ya1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmZyYW1ld29ya1ZlcnNpb24gPSBmcmFtZXdvcmtQa2cudmVyc2lvblxuICAgIGZyYW1ld29ya0luZm8gPSAnLCAnICsgZnJhbWV3b3JrTmFtZSArICcgdicgKyB2LmZyYW1ld29ya1ZlcnNpb25cbiAgfVxuICByZXR1cm4gJ2V4dC13ZWJwYWNrLXBsdWdpbiB2JyArIHYucGx1Z2luVmVyc2lvbiArICcsIEV4dCBKUyB2JyArIHYuZXh0VmVyc2lvbiArICcgJyArIHYuZWRpdGlvbiArICcgRWRpdGlvbiwgU2VuY2hhIENtZCB2JyArIHYuY21kVmVyc2lvbiArICcsIHdlYnBhY2sgdicgKyB2LndlYnBhY2tWZXJzaW9uICsgZnJhbWV3b3JrSW5mb1xuIH1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9nKGFwcCxtZXNzYWdlKSB7XG4gIHZhciBzID0gYXBwICsgbWVzc2FnZVxuICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICB0cnkge3Byb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpfWNhdGNoKGUpIHt9XG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpO3Byb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBsb2doKGFwcCxtZXNzYWdlKSB7XG4gIHZhciBoID0gZmFsc2VcbiAgdmFyIHMgPSBhcHAgKyBtZXNzYWdlXG4gIGlmIChoID09IHRydWUpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9ndih2ZXJib3NlLCBzKSB7XG4gIGlmICh2ZXJib3NlID09ICd5ZXMnKSB7XG4gICAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgICB0cnkge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKClcbiAgICB9XG4gICAgY2F0Y2goZSkge31cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShgLXZlcmJvc2U6ICR7c31gKVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxuICB9XG59XG5cbmZ1bmN0aW9uIF9nZXRWYWxpZGF0ZU9wdGlvbnMoKSB7XG4gIHJldHVybiB7XG4gICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgIFwiZnJhbWV3b3JrXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwidG9vbGtpdFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInRoZW1lXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiZW1pdFwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwic2NyaXB0XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwicG9ydFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJpbnRlZ2VyXCJdXG4gICAgICB9LFxuICAgICAgXCJwYWNrYWdlc1wiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIiwgXCJhcnJheVwiXVxuICAgICAgfSxcbiAgICAgIFwicHJvZmlsZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImVudmlyb25tZW50XCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ2RldmVsb3BtZW50JyBvciAncHJvZHVjdGlvbicgc3RyaW5nIHZhbHVlXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInRyZWVzaGFrZVwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiYnJvd3NlclwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwid2F0Y2hcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInZlcmJvc2VcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjogZmFsc2VcbiAgfTtcbn1cblxuXG5mdW5jdGlvbiBfZ2V0RGVmYXVsdE9wdGlvbnMoKSB7XG4gIHJldHVybiB7XG4gICAgZnJhbWV3b3JrOiAnZXh0anMnLFxuICAgIHRvb2xraXQ6ICdtb2Rlcm4nLFxuICAgIHRoZW1lOiAndGhlbWUtbWF0ZXJpYWwnLFxuICAgIGVtaXQ6ICd5ZXMnLFxuICAgIHNjcmlwdDogbnVsbCxcbiAgICBwb3J0OiAxOTYyLFxuICAgIHBhY2thZ2VzOiBbXSxcblxuICAgIHByb2ZpbGU6ICcnLFxuICAgIGVudmlyb25tZW50OiAnZGV2ZWxvcG1lbnQnLFxuICAgIHRyZWVzaGFrZTogJ25vJyxcbiAgICBicm93c2VyOiAneWVzJyxcbiAgICB3YXRjaDogJ3llcycsXG4gICAgdmVyYm9zZTogJ25vJ1xuICB9XG59XG4iXX0=