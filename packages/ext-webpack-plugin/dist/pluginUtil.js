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
    }

    if (vars.buildstep == '1 of 1' || vars.buildstep == '2 of 2') {
      compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tap(`ext-html-generation`, data => {
        const path = require('path');

        var jsPath = path.join(vars.extPath, 'ext.js');
        var cssPath = path.join(vars.extPath, 'ext.css');
        data.assets.js.unshift(jsPath);
        data.assets.css.unshift(cssPath);
        logv(verbose, 'ALL DEPS');
        logv(verbose, JSON.stringify(vars.deps));
        log(app, `Adding ${jsPath} and ${cssPath} to index.html`);
      });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sIm5hbWVzIjpbIl9jb25zdHJ1Y3RvciIsImluaXRpYWxPcHRpb25zIiwiZnMiLCJyZXF1aXJlIiwidmFycyIsIm9wdGlvbnMiLCJmcmFtZXdvcmsiLCJ1bmRlZmluZWQiLCJwbHVnaW5FcnJvcnMiLCJwdXNoIiwicmVzdWx0IiwidHJlZXNoYWtlIiwidmVyYm9zZSIsInZhbGlkYXRlT3B0aW9ucyIsIl9nZXRWYWxpZGF0ZU9wdGlvbnMiLCJyYyIsImV4aXN0c1N5bmMiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJfZ2V0RGVmYXVsdE9wdGlvbnMiLCJfZ2V0RGVmYXVsdFZhcnMiLCJwbHVnaW5OYW1lIiwiYXBwIiwiX2dldEFwcCIsImxvZ3YiLCJlbnZpcm9ubWVudCIsInByb2R1Y3Rpb24iLCJicm93c2VyIiwid2F0Y2giLCJsb2ciLCJfZ2V0VmVyc2lvbnMiLCJidWlsZHN0ZXAiLCJfdG9Qcm9kIiwiY29uZmlnT2JqIiwiZSIsInRvU3RyaW5nIiwiX3RoaXNDb21waWxhdGlvbiIsImNvbXBpbGVyIiwiY29tcGlsYXRpb24iLCJzY3JpcHQiLCJydW5TY3JpcHQiLCJlcnIiLCJfY29tcGlsYXRpb24iLCJleHRDb21wb25lbnRzIiwiaG9va3MiLCJzdWNjZWVkTW9kdWxlIiwidGFwIiwibW9kdWxlIiwicmVzb3VyY2UiLCJtYXRjaCIsIl9zb3VyY2UiLCJfdmFsdWUiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiZGVwcyIsIl9leHRyYWN0RnJvbVNvdXJjZSIsIl9nZXRBbGxDb21wb25lbnRzIiwiaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbiIsImRhdGEiLCJwYXRoIiwianNQYXRoIiwiam9pbiIsImV4dFBhdGgiLCJjc3NQYXRoIiwiYXNzZXRzIiwianMiLCJ1bnNoaWZ0IiwiY3NzIiwic3RyaW5naWZ5IiwiX2FmdGVyQ29tcGlsZSIsIl9lbWl0IiwiY2FsbGJhY2siLCJlbWl0Iiwib3V0cHV0UGF0aCIsImRldlNlcnZlciIsImNvbnRlbnRCYXNlIiwiX3ByZXBhcmVGb3JCdWlsZCIsImNvbW1hbmQiLCJyZWJ1aWxkIiwicGFybXMiLCJwcm9maWxlIiwid2F0Y2hTdGFydGVkIiwiX2J1aWxkRXh0QnVuZGxlIiwiX2RvbmUiLCJzdGF0cyIsImVycm9ycyIsImxlbmd0aCIsImNoYWxrIiwiY29uc29sZSIsInJlZCIsInByb2Nlc3MiLCJleGl0IiwiX3RvRGV2IiwiYnJvd3NlckNvdW50IiwidXJsIiwicG9ydCIsIm9wbiIsIm91dHB1dCIsInBhY2thZ2VzIiwidG9vbGtpdCIsInRoZW1lIiwicmltcmFmIiwibWtkaXJwIiwiZnN4IiwiZmlyc3RUaW1lIiwic3luYyIsImJ1aWxkWE1MIiwiY3JlYXRlQXBwSnNvbiIsImNyZWF0ZVdvcmtzcGFjZUpzb24iLCJjcmVhdGVKU0RPTUVudmlyb25tZW50Iiwid3JpdGVGaWxlU3luYyIsImN3ZCIsImZyb21QYXRoIiwidG9QYXRoIiwiY29weVN5bmMiLCJyZXBsYWNlIiwiZnJvbVJlc291cmNlcyIsInRvUmVzb3VyY2VzIiwibWFuaWZlc3QiLCJidW5kbGVEaXIiLCJ0cmltIiwic2VuY2hhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbkJ1aWxkRG9uZSIsIm9wdHMiLCJzaWxlbnQiLCJzdGRpbyIsImVuY29kaW5nIiwiX2V4ZWN1dGVBc3luYyIsInRoZW4iLCJyZWFzb24iLCJERUZBVUxUX1NVQlNUUlMiLCJzdWJzdHJpbmdzIiwiY3Jvc3NTcGF3biIsImNoaWxkIiwib24iLCJjb2RlIiwic2lnbmFsIiwiRXJyb3IiLCJlcnJvciIsInN0ZG91dCIsInN0ciIsImZpbGVuYW1lIiwidG91Y2hGaWxlIiwiZCIsIkRhdGUiLCJ0b0xvY2FsZVN0cmluZyIsInNvbWUiLCJ2IiwiaW5kZXhPZiIsInN0ZGVyciIsInN0ckphdmFPcHRzIiwic2NyaXB0UGF0aCIsImNoaWxkUHJvY2VzcyIsImludm9rZWQiLCJmb3JrIiwiX3RvWHR5cGUiLCJwcmVmaXgiLCJwbGF0Zm9ybSIsImdyZWVuIiwiZnJhbWV3b3JrTmFtZSIsInBsdWdpblBhdGgiLCJwbHVnaW5Qa2ciLCJwbHVnaW5WZXJzaW9uIiwidmVyc2lvbiIsIl9yZXNvbHZlZCIsImVkaXRpb24iLCJ3ZWJwYWNrUGF0aCIsIndlYnBhY2tQa2ciLCJ3ZWJwYWNrVmVyc2lvbiIsImV4dFBrZyIsImV4dFZlcnNpb24iLCJjbWRQYXRoIiwiY21kUGtnIiwiY21kVmVyc2lvbiIsInZlcnNpb25fZnVsbCIsImZyYW1ld29ya0luZm8iLCJmcmFtZXdvcmtQYXRoIiwiZnJhbWV3b3JrUGtnIiwiZnJhbWV3b3JrVmVyc2lvbiIsIm1lc3NhZ2UiLCJzIiwiY3Vyc29yVG8iLCJjbGVhckxpbmUiLCJ3cml0ZSIsImxvZ2giLCJoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ08sU0FBU0EsWUFBVCxDQUFzQkMsY0FBdEIsRUFBc0M7QUFDM0MsUUFBTUMsRUFBRSxHQUFHQyxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxNQUFJQyxJQUFJLEdBQUcsRUFBWDtBQUNBLE1BQUlDLE9BQU8sR0FBRyxFQUFkOztBQUNBLE1BQUk7QUFDRixRQUFJSixjQUFjLENBQUNLLFNBQWYsSUFBNEJDLFNBQWhDLEVBQTJDO0FBQ3pDSCxNQUFBQSxJQUFJLENBQUNJLFlBQUwsR0FBb0IsRUFBcEI7QUFDQUosTUFBQUEsSUFBSSxDQUFDSSxZQUFMLENBQWtCQyxJQUFsQixDQUF1QixzSEFBdkI7QUFDQSxVQUFJQyxNQUFNLEdBQUc7QUFBRU4sUUFBQUEsSUFBSSxFQUFFQTtBQUFSLE9BQWI7QUFDQSxhQUFPTSxNQUFQO0FBQ0Q7O0FBQ0QsUUFBSUosU0FBUyxHQUFHTCxjQUFjLENBQUNLLFNBQS9CO0FBQ0EsUUFBSUssU0FBUyxHQUFHVixjQUFjLENBQUNVLFNBQS9CO0FBQ0EsUUFBSUMsT0FBTyxHQUFHWCxjQUFjLENBQUNXLE9BQTdCOztBQUVBLFVBQU1DLGVBQWUsR0FBR1Ys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QURFLE9BcEJBO0FBdUJaLGlCQUFXO0FBQ1QsZ0JBQVEsQ0FBQyxRQUFEO0FBREMsT0F2QkM7QUEwQloscUJBQWU7QUFDYix3QkFBZ0Isc0RBREg7QUFFYixnQkFBUSxDQUFDLFFBQUQ7QUFGSyxPQTFCSDtBQThCWixtQkFBYTtBQUNYLHdCQUFnQiwwREFETDtBQUVYLGdCQUFRLENBQUMsUUFBRDtBQUZHLE9BOUJEO0FBa0NaLGlCQUFXO0FBQ1Qsd0JBQWdCLDBEQURQO0FBRVQsZ0JBQVEsQ0FBQyxRQUFEO0FBRkMsT0FsQ0M7QUFzQ1osZUFBUztBQUNQLHdCQUFnQiwwREFEVDtBQUVQLGdCQUFRLENBQUMsUUFBRDtBQUZELE9BdENHO0FBMENaLGlCQUFXO0FBQ1Qsd0JBQWdCLDBEQURQO0FBRVQsZ0JBQVEsQ0FBQyxRQUFEO0FBRkM7QUExQ0MsS0FGVDtBQWlETCw0QkFBd0I7QUFqRG5CLEdBQVA7QUFtREQ7O0FBR0QsU0FBU00sa0JBQVQsR0FBOEI7QUFDNUIsU0FBTztBQUNMZCxJQUFBQSxTQUFTLEVBQUUsT0FETjtBQUVMOEYsSUFBQUEsT0FBTyxFQUFFLFFBRko7QUFHTEMsSUFBQUEsS0FBSyxFQUFFLGdCQUhGO0FBSUw1QixJQUFBQSxJQUFJLEVBQUUsS0FKRDtBQUtMakMsSUFBQUEsTUFBTSxFQUFFLElBTEg7QUFNTHdELElBQUFBLElBQUksRUFBRSxJQU5EO0FBT0xHLElBQUFBLFFBQVEsRUFBRSxFQVBMO0FBU0xsQixJQUFBQSxPQUFPLEVBQUUsRUFUSjtBQVVMdkQsSUFBQUEsV0FBVyxFQUFFLGFBVlI7QUFXTGYsSUFBQUEsU0FBUyxFQUFFLElBWE47QUFZTGlCLElBQUFBLE9BQU8sRUFBRSxLQVpKO0FBYUxDLElBQUFBLEtBQUssRUFBRSxLQWJGO0FBY0xqQixJQUFBQSxPQUFPLEVBQUU7QUFkSixHQUFQO0FBZ0JEIiwic291cmNlc0NvbnRlbnQiOlsiXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfY29uc3RydWN0b3IoaW5pdGlhbE9wdGlvbnMpIHtcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gIHZhciB2YXJzID0ge31cbiAgdmFyIG9wdGlvbnMgPSB7fVxuICB0cnkge1xuICAgIGlmIChpbml0aWFsT3B0aW9ucy5mcmFtZXdvcmsgPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXJzLnBsdWdpbkVycm9ycyA9IFtdXG4gICAgICB2YXJzLnBsdWdpbkVycm9ycy5wdXNoKCd3ZWJwYWNrIGNvbmZpZzogZnJhbWV3b3JrIHBhcmFtZXRlciBvbiBleHQtd2VicGFjay1wbHVnaW4gaXMgbm90IGRlZmluZWQgLSB2YWx1ZXM6IHJlYWN0LCBhbmd1bGFyLCBleHRqcywgY29tcG9uZW50cycpXG4gICAgICB2YXIgcmVzdWx0ID0geyB2YXJzOiB2YXJzIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICB2YXIgZnJhbWV3b3JrID0gaW5pdGlhbE9wdGlvbnMuZnJhbWV3b3JrXG4gICAgdmFyIHRyZWVzaGFrZSA9IGluaXRpYWxPcHRpb25zLnRyZWVzaGFrZVxuICAgIHZhciB2ZXJib3NlID0gaW5pdGlhbE9wdGlvbnMudmVyYm9zZVxuXG4gICAgY29uc3QgdmFsaWRhdGVPcHRpb25zID0gcmVxdWlyZSgnc2NoZW1hLXV0aWxzJylcbiAgICB2YWxpZGF0ZU9wdGlvbnMoX2dldFZhbGlkYXRlT3B0aW9ucygpLCBpbml0aWFsT3B0aW9ucywgJycpXG5cbiAgICBjb25zdCByYyA9IChmcy5leGlzdHNTeW5jKGAuZXh0LSR7ZnJhbWV3b3JrfXJjYCkgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoYC5leHQtJHtmcmFtZXdvcmt9cmNgLCAndXRmLTgnKSkgfHwge30pXG4gICAgb3B0aW9ucyA9IHsgLi4uX2dldERlZmF1bHRPcHRpb25zKCksIC4uLmluaXRpYWxPcHRpb25zLCAuLi5yYyB9XG5cbiAgICB2YXJzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2dldERlZmF1bHRWYXJzKClcbiAgICB2YXJzLnBsdWdpbk5hbWUgPSAnZXh0LXdlYnBhY2stcGx1Z2luJ1xuICAgIHZhcnMuYXBwID0gX2dldEFwcCgpXG4gICAgdmFyIHBsdWdpbk5hbWUgPSB2YXJzLnBsdWdpbk5hbWVcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcblxuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9jb25zdHJ1Y3RvcicpXG4gICAgbG9ndih2ZXJib3NlLCBgcGx1Z2luTmFtZSAtICR7cGx1Z2luTmFtZX1gKVxuICAgIGxvZ3YodmVyYm9zZSwgYGFwcCAtICR7YXBwfWApXG5cbiAgICBpZiAob3B0aW9ucy5lbnZpcm9ubWVudCA9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhcnMucHJvZHVjdGlvbiA9IHRydWVcbiAgICAgIG9wdGlvbnMuYnJvd3NlciA9ICdubydcbiAgICAgIG9wdGlvbnMud2F0Y2ggPSAnbm8nXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5wcm9kdWN0aW9uID0gZmFsc2VcbiAgICB9XG5cbiAgICAvL2xvZ3YodmVyYm9zZSwgYG9wdGlvbnM6YCk7aWYgKHZlcmJvc2UgPT0gJ3llcycpIHtjb25zb2xlLmRpcihvcHRpb25zKX1cbiAgICAvL2xvZ3YodmVyYm9zZSwgYHZhcnM6YCk7aWYgKHZlcmJvc2UgPT0gJ3llcycpIHtjb25zb2xlLmRpcih2YXJzKX1cblxuICAgIGxvZyhhcHAsIF9nZXRWZXJzaW9ucyhwbHVnaW5OYW1lLCBmcmFtZXdvcmspKVxuXG4gICAgaWYgKGZyYW1ld29yayA9PSAncmVhY3QnIHx8IGZyYW1ld29yayA9PSAnZXh0anMnIHx8IGZyYW1ld29yayA9PT0gJ2NvbXBvbmVudHMnKSB7XG4gICAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUpIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJ1xuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgUHJvZHVjdGlvbiBCdWlsZCBmb3IgJyArIGZyYW1ld29yaylcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBkZXZlbG9wbWVudCBidWlsZCBmb3IgJyArIGZyYW1ld29yaylcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUpIHtcbiAgICAgIGlmICh0cmVlc2hha2UgPT0gJ3llcycpIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAyJ1xuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJyArIGZyYW1ld29yayArICcgLSAnICsgdmFycy5idWlsZHN0ZXApXG4gICAgICAgIHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl90b1Byb2QodmFycywgb3B0aW9ucylcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcyIG9mIDInXG4gICAgICAgIGxvZyhhcHAsICdDb250aW51aW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICcgKyBmcmFtZXdvcmsgKyAnIC0gJyArIHZhcnMuYnVpbGRzdGVwKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgIGxvZyhhcHAsICdTdGFydGluZyBkZXZlbG9wbWVudCBidWlsZCBmb3IgJyArIGZyYW1ld29yaylcbiAgICB9XG4gICAgbG9ndih2ZXJib3NlLCAnQnVpbGRpbmcgZm9yICcgKyBvcHRpb25zLmVudmlyb25tZW50ICsgJywgJyArICdUcmVlc2hha2UgaXMgJyArIG9wdGlvbnMudHJlZXNoYWtlKVxuXG4gICAgdmFyIGNvbmZpZ09iaiA9IHsgdmFyczogdmFycywgb3B0aW9uczogb3B0aW9ucyB9O1xuICAgIHJldHVybiBjb25maWdPYmo7XG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyAnX2NvbnN0cnVjdG9yOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3RoaXNDb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF90aGlzQ29tcGlsYXRpb24nKVxuICAgIGxvZ3YodmVyYm9zZSwgYG9wdGlvbnMuc2NyaXB0OiAke29wdGlvbnMuc2NyaXB0IH1gKVxuICAgIGxvZ3YodmVyYm9zZSwgYGJ1aWxkc3RlcDogJHt2YXJzLmJ1aWxkc3RlcH1gKVxuXG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PT0gJzEgb2YgMicpIHtcbiAgICAgIGlmIChvcHRpb25zLnNjcmlwdCAhPSB1bmRlZmluZWQgJiYgb3B0aW9ucy5zY3JpcHQgIT0gbnVsbCAmJiBvcHRpb25zLnNjcmlwdCAhPSAnJykge1xuICAgICAgICBsb2coYXBwLCBgU3RhcnRlZCBydW5uaW5nICR7b3B0aW9ucy5zY3JpcHR9YClcbiAgICAgICAgcnVuU2NyaXB0KG9wdGlvbnMuc2NyaXB0LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxvZyhhcHAsIGBGaW5pc2hlZCBydW5uaW5nICR7b3B0aW9ucy5zY3JpcHR9YClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbiAgICB0aHJvdyAnX3RoaXNDb21waWxhdGlvbjogJyArIGUudG9TdHJpbmcoKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9jb21waWxhdGlvbihjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgICB2YXIgYXBwID0gdmFycy5hcHBcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBmcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29ya1xuICAgIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9jb21waWxhdGlvbicpXG5cbiAgICBpZiAoZnJhbWV3b3JrICE9ICdleHRqcycgJiYgdmFycy5wcm9kdWN0aW9uID09IHRydWUpIHtcbiAgICAgIHZhciBleHRDb21wb25lbnRzID0gW11cbiAgICAgIGlmIChmcmFtZXdvcmsgPT09ICdjb21wb25lbnRzJykge1xuICAgICAgICBpZiAob3B0aW9ucy50cmVlc2hha2UgPT09ICd5ZXMnKSB7XG4gICAgICAgICAgY29tcGlsYXRpb24uaG9va3Muc3VjY2VlZE1vZHVsZS50YXAoYGV4dC1zdWNjZWVkLW1vZHVsZWAsIG1vZHVsZSA9PiB7XG4gICAgICAgICAgICBpZiAobW9kdWxlLnJlc291cmNlICYmICFtb2R1bGUucmVzb3VyY2UubWF0Y2goL25vZGVfbW9kdWxlcy8pKSB7XG4gICAgICAgICAgICAgIGlmKG1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvXFwuaHRtbCQvKSAhPSBudWxsXG4gICAgICAgICAgICAgICAgJiYgbW9kdWxlLl9zb3VyY2UuX3ZhbHVlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2RvY3R5cGUgaHRtbCcpID09IGZhbHNlXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgICAgICAgICAgICAgICAgLy8uLi5yZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgdHJ1ZSldXG4gICAgICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFycy5kZXBzID0gW1xuICAgICAgICAgICAgICAgICAgLi4uKHZhcnMuZGVwcyB8fCBbXSksXG4gICAgICAgICAgICAgICAgICAvLy4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBmYWxzZSldXG4gICAgICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBcbiAgICAgIGVsc2Uge1xuICAgICAgICAvL3ZhciBleHRDb21wb25lbnRzID0gW11cbiAgICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgICAgICAgZXh0Q29tcG9uZW50cyA9IHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9nZXRBbGxDb21wb25lbnRzKHZhcnMsIG9wdGlvbnMpXG4gICAgICAgIH1cblxuICAgICAgICBjb21waWxhdGlvbi5ob29rcy5zdWNjZWVkTW9kdWxlLnRhcChgZXh0LXN1Y2NlZWQtbW9kdWxlYCwgbW9kdWxlID0+IHtcbiAgICAgICAgICBpZiAobW9kdWxlLnJlc291cmNlICYmICFtb2R1bGUucmVzb3VyY2UubWF0Y2goL25vZGVfbW9kdWxlcy8pKSB7XG4gICAgICAgICAgICBpZihtb2R1bGUucmVzb3VyY2UubWF0Y2goL1xcLmh0bWwkLykgIT0gbnVsbCkge1xuICAgICAgICAgICAgICBpZihtb2R1bGUuX3NvdXJjZS5fdmFsdWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnZG9jdHlwZSBodG1sJykgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4gICAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbiAgICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbiAgICAgICAgICAgICAgICAuLi5yZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cyldXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAxJyB8fCB2YXJzLmJ1aWxkc3RlcCA9PSAnMiBvZiAyJykge1xuICAgICAgY29tcGlsYXRpb24uaG9va3MuaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbi50YXAoYGV4dC1odG1sLWdlbmVyYXRpb25gLChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAgICAgdmFyIGpzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuanMnKVxuICAgICAgICB2YXIgY3NzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuY3NzJylcbiAgICAgICAgZGF0YS5hc3NldHMuanMudW5zaGlmdChqc1BhdGgpXG4gICAgICAgIGRhdGEuYXNzZXRzLmNzcy51bnNoaWZ0KGNzc1BhdGgpXG4gICAgICAgIGxvZ3YodmVyYm9zZSwgJ0FMTCBERVBTJyk7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwgSlNPTi5zdHJpbmdpZnkodmFycy5kZXBzKSk7XG4gICAgICAgIGxvZyhhcHAsIGBBZGRpbmcgJHtqc1BhdGh9IGFuZCAke2Nzc1BhdGh9IHRvIGluZGV4Lmh0bWxgKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBpZiAoZnJhbWV3b3JrICE9ICdleHRqcycpIHtcblxuICAgIC8vICAgdmFyIGV4dENvbXBvbmVudHMgPSBbXVxuICAgIC8vICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgLy8gICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0QWxsQ29tcG9uZW50cyh2YXJzLCBvcHRpb25zKVxuICAgIC8vICAgfVxuICAgIC8vICAgY29tcGlsYXRpb24uaG9va3Muc3VjY2VlZE1vZHVsZS50YXAoYGV4dC1zdWNjZWVkLW1vZHVsZWAsIG1vZHVsZSA9PiB7XG4gICAgLy8gICAgIGlmICh2YXJzLnByb2R1Y3Rpb24pIHtcbiAgICAvLyAgICAgICBpZiAobW9kdWxlLnJlc291cmNlICYmICFtb2R1bGUucmVzb3VyY2UubWF0Y2goL25vZGVfbW9kdWxlcy8pKSB7XG4gICAgLy8gICAgICAgICBpZihtb2R1bGUucmVzb3VyY2UubWF0Y2goL1xcLmh0bWwkLykgIT0gbnVsbCkge1xuICAgIC8vICAgICAgICAgICBpZihtb2R1bGUuX3NvdXJjZS5fdmFsdWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnZG9jdHlwZSBodG1sJykgPT0gZmFsc2UpIHtcbiAgICAvLyAgICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAvLyAgICAgICAgICAgICAgICAgLi4uKHZhcnMuZGVwcyB8fCBbXSksXG4gICAgLy8gICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKVxuICAgIC8vICAgICAgICAgICAgICAgXVxuICAgIC8vICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICAgICBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4gICAgLy8gICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbiAgICAvLyAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKVxuICAgIC8vICAgICAgICAgICAgIF1cbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH0pXG5cbi8vICAgICAgIGlmIChmcmFtZXdvcmsgPT09ICdjb21wb25lbnRzJykge1xuLy8gICAgICAgICBpZiAob3B0aW9ucy50cmVlc2hha2UgPT09ICd5ZXMnICYmIG9wdGlvbnMuZW52aXJvbm1lbnQgPT09ICdwcm9kdWN0aW9uJykge1xuLy8gICAgICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLnN1Y2NlZWRNb2R1bGUudGFwKGBleHQtc3VjY2VlZC1tb2R1bGVgLCBtb2R1bGUgPT4ge1xuLy8gICAgICAgICAgICAgaWYgKG1vZHVsZS5yZXNvdXJjZSAmJiAhbW9kdWxlLnJlc291cmNlLm1hdGNoKC9ub2RlX21vZHVsZXMvKSkge1xuLy8gICAgICAgICAgICAgICBpZihtb2R1bGUucmVzb3VyY2UubWF0Y2goL1xcLmh0bWwkLykgIT0gbnVsbFxuLy8gICAgICAgICAgICAgICAgICYmIG1vZHVsZS5fc291cmNlLl92YWx1ZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdkb2N0eXBlIGh0bWwnKSA9PSBmYWxzZVxuLy8gICAgICAgICAgICAgICApIHtcbi8vICAgICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4vLyAgICAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbi8vICAgICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCB0cnVlKV1cbi8vICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICBlbHNlIHtcbi8vICAgICAgICAgICAgICAgICB2YXJzLmRlcHMgPSBbXG4vLyAgICAgICAgICAgICAgICAgICAuLi4odmFycy5kZXBzIHx8IFtdKSxcbi8vICAgICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBmYWxzZSldXG4vLyAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICB9KTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgdmFyIGV4dENvbXBvbmVudHMgPSBbXVxuLy8gICAgICAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMicpIHtcbi8vICAgICAgICAgICBleHRDb21wb25lbnRzID0gcmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucylcbi8vICAgICAgICAgfVxuXG4vLyAgICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLnN1Y2NlZWRNb2R1bGUudGFwKGBleHQtc3VjY2VlZC1tb2R1bGVgLCBtb2R1bGUgPT4ge1xuLy8gICAgICAgICAgIGlmIChtb2R1bGUucmVzb3VyY2UgJiYgIW1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvbm9kZV9tb2R1bGVzLykpIHtcbi8vICAgICAgICAgICAgIGlmKG1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvXFwuaHRtbCQvKSAhPSBudWxsKSB7XG4vLyAgICAgICAgICAgICAgIGlmKG1vZHVsZS5fc291cmNlLl92YWx1ZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdkb2N0eXBlIGh0bWwnKSA9PSBmYWxzZSkge1xuLy8gICAgICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbi8vICAgICAgICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuLy8gICAgICAgICAgICAgICAgICAgLi4ucmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuLy8gICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICBlbHNlIHtcbi8vICAgICAgICAgICAgICAgdmFycy5kZXBzID0gW1xuLy8gICAgICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuLy8gICAgICAgICAgICAgICAgIC4uLnJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKV1cbi8vICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICB9XG4vLyAgICAgICAgIH0pXG4vLyAgICAgICB9XG5cblxuICAgIC8vICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgLy8gICAgIGNvbXBpbGF0aW9uLmhvb2tzLmZpbmlzaE1vZHVsZXMudGFwKGBleHQtZmluaXNoLW1vZHVsZXNgLCBtb2R1bGVzID0+IHtcbiAgICAvLyAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fd3JpdGVGaWxlc1RvUHJvZEZvbGRlcih2YXJzLCBvcHRpb25zKVxuICAgIC8vICAgICB9KVxuICAgIC8vICAgfVxuICAgIC8vICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09ICcyIG9mIDInKSB7XG4gICAgLy8gICAgIGNvbXBpbGF0aW9uLmhvb2tzLmh0bWxXZWJwYWNrUGx1Z2luQmVmb3JlSHRtbEdlbmVyYXRpb24udGFwKGBleHQtaHRtbC1nZW5lcmF0aW9uYCwoZGF0YSkgPT4ge1xuICAgIC8vICAgICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAvLyAgICAgICB2YXIganNQYXRoID0gcGF0aC5qb2luKHZhcnMuZXh0UGF0aCwgJ2V4dC5qcycpXG4gICAgLy8gICAgICAgdmFyIGNzc1BhdGggPSBwYXRoLmpvaW4odmFycy5leHRQYXRoLCAnZXh0LmNzcycpXG4gICAgLy8gICAgICAgZGF0YS5hc3NldHMuanMudW5zaGlmdChqc1BhdGgpXG4gICAgLy8gICAgICAgZGF0YS5hc3NldHMuY3NzLnVuc2hpZnQoY3NzUGF0aClcbiAgICAvLyAgICAgICBsb2d2KCd5ZXMnLCAnQUxMIERFUFMnKTtcbiAgICAvLyAgICAgICBsb2d2KCd5ZXMnLCBKU09OLnN0cmluZ2lmeSh2YXJzLmRlcHMpKTtcbiAgICAvLyAgICAgICBsb2coYXBwLCBgQWRkaW5nICR7anNQYXRofSBhbmQgJHtjc3NQYXRofSB0byBpbmRleC5odG1sYClcbiAgICAvLyAgICAgfSlcbiAgICAvLyAgIH1cbiAgICAvLyB9XG5cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgdGhyb3cgJ19jb21waWxhdGlvbjogJyArIGUudG9TdHJpbmcoKVxuLy8gICAgbG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbi8vICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfY29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9hZnRlckNvbXBpbGUoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfYWZ0ZXJDb21waWxlJylcbiAgICBpZiAoZnJhbWV3b3JrID09ICdleHRqcycpIHtcbiAgICAgIHJlcXVpcmUoYC4vZXh0anNVdGlsYCkuX2FmdGVyQ29tcGlsZShjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfYWZ0ZXJDb21waWxlIG5vdCBydW4nKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgdGhyb3cgJ19hZnRlckNvbXBpbGU6ICcgKyBlLnRvU3RyaW5nKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZW1pdChjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGVtaXQgPSBvcHRpb25zLmVtaXRcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9lbWl0JylcbiAgICBpZiAoZW1pdCA9PSAneWVzJykge1xuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgICAgIGxldCBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGNvbXBpbGVyLm91dHB1dFBhdGgsdmFycy5leHRQYXRoKVxuICAgICAgICBpZiAoY29tcGlsZXIub3V0cHV0UGF0aCA9PT0gJy8nICYmIGNvbXBpbGVyLm9wdGlvbnMuZGV2U2VydmVyKSB7XG4gICAgICAgICAgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vcHRpb25zLmRldlNlcnZlci5jb250ZW50QmFzZSwgb3V0cHV0UGF0aClcbiAgICAgICAgfVxuICAgICAgICBsb2d2KHZlcmJvc2UsJ291dHB1dFBhdGg6ICcgKyBvdXRwdXRQYXRoKVxuICAgICAgICBsb2d2KHZlcmJvc2UsJ2ZyYW1ld29yazogJyArIGZyYW1ld29yaylcbiAgICAgICAgaWYgKGZyYW1ld29yayAhPSAnZXh0anMnKSB7XG4gICAgICAgICAgX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dFBhdGgsIGNvbXBpbGF0aW9uKVxuICAgICAgICB9XG4gICAgICAgIHZhciBjb21tYW5kID0gJydcbiAgICAgICAgaWYgKG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKVxuICAgICAgICAgIHtjb21tYW5kID0gJ3dhdGNoJ31cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHtjb21tYW5kID0gJ2J1aWxkJ31cbiAgICAgICAgaWYgKHZhcnMucmVidWlsZCA9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHBhcm1zID0gW11cbiAgICAgICAgICBpZiAob3B0aW9ucy5wcm9maWxlID09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnByb2ZpbGUgPT0gJycgfHwgb3B0aW9ucy5wcm9maWxlID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICdidWlsZCcpXG4gICAgICAgICAgICAgIHsgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMuZW52aXJvbm1lbnRdIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgeyBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMuZW52aXJvbm1lbnRdIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoY29tbWFuZCA9PSAnYnVpbGQnKVxuICAgICAgICAgICAgICB7cGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF19XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHtwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgJy0td2ViLXNlcnZlcicsICdmYWxzZScsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5lbnZpcm9ubWVudF19XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh2YXJzLndhdGNoU3RhcnRlZCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgYXdhaXQgX2J1aWxkRXh0QnVuZGxlKGFwcCwgY29tcGlsYXRpb24sIG91dHB1dFBhdGgsIHBhcm1zLCB2YXJzLCBvcHRpb25zKVxuICAgICAgICAgICAgdmFycy53YXRjaFN0YXJ0ZWQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBsb2d2KHZlcmJvc2UsJ05PVCBydW5uaW5nIGVtaXQnKVxuICAgICAgICBjYWxsYmFjaygpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9ndih2ZXJib3NlLCdlbWl0IGlzIG5vJylcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIGNhbGxiYWNrKClcbiAgICB0aHJvdyAnX2VtaXQ6ICcgKyBlLnRvU3RyaW5nKClcbiAgICAvLyBsb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuICAgIC8vIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfZW1pdDogJyArIGUpXG4gICAgLy8gY2FsbGJhY2soKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9kb25lKHN0YXRzLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9kb25lJylcbiAgICBpZiAoc3RhdHMuY29tcGlsYXRpb24uZXJyb3JzICYmIHN0YXRzLmNvbXBpbGF0aW9uLmVycm9ycy5sZW5ndGgpIC8vICYmIHByb2Nlc3MuYXJndi5pbmRleE9mKCctLXdhdGNoJykgPT0gLTEpXG4gICAge1xuICAgICAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKTtcbiAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZCgnKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqJykpO1xuICAgICAgY29uc29sZS5sb2coc3RhdHMuY29tcGlsYXRpb24uZXJyb3JzWzBdKTtcbiAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZCgnKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqJykpO1xuICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgIH1cblxuICAgIC8vbWpnIHJlZmFjdG9yXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlICYmIG9wdGlvbnMudHJlZXNoYWtlID09ICdubycgJiYgZnJhbWV3b3JrID09ICdhbmd1bGFyJykge1xuICAgICAgcmVxdWlyZShgLi8ke29wdGlvbnMuZnJhbWV3b3JrfVV0aWxgKS5fdG9EZXYodmFycywgb3B0aW9ucylcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmKG9wdGlvbnMuYnJvd3NlciA9PSAneWVzJyAmJiBvcHRpb25zLndhdGNoID09ICd5ZXMnICYmIHZhcnMucHJvZHVjdGlvbiA9PSBmYWxzZSkge1xuICAgICAgICBpZiAodmFycy5icm93c2VyQ291bnQgPT0gMCkge1xuICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDonICsgb3B0aW9ucy5wb3J0XG4gICAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgT3BlbmluZyBicm93c2VyIGF0ICR7dXJsfWApXG4gICAgICAgICAgdmFycy5icm93c2VyQ291bnQrK1xuICAgICAgICAgIGNvbnN0IG9wbiA9IHJlcXVpcmUoJ29wbicpXG4gICAgICAgICAgb3BuKHVybClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICB9XG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnKSB7XG4gICAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUpIHtcbiAgICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIHByb2R1Y3Rpb24gYnVpbGRgKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBkZXZlbG9wbWVudCBidWlsZGApXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMiBvZiAyJykge1xuICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIHByb2R1Y3Rpb24gYnVpbGRgKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4vLyAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuICAgIHRocm93ICdfZG9uZTogJyArIGUudG9TdHJpbmcoKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXQsIGNvbXBpbGF0aW9uKSB7XG4gIHRyeSB7XG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgcGFja2FnZXMgPSBvcHRpb25zLnBhY2thZ2VzXG4gICAgdmFyIHRvb2xraXQgPSBvcHRpb25zLnRvb2xraXRcbiAgICB2YXIgdGhlbWUgPSBvcHRpb25zLnRoZW1lXG4gICAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfcHJlcGFyZUZvckJ1aWxkJylcbiAgICBjb25zdCByaW1yYWYgPSByZXF1aXJlKCdyaW1yYWYnKVxuICAgIGNvbnN0IG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpXG4gICAgY29uc3QgZnN4ID0gcmVxdWlyZSgnZnMtZXh0cmEnKVxuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICB0aGVtZSA9IHRoZW1lIHx8ICh0b29sa2l0ID09PSAnY2xhc3NpYycgPyAndGhlbWUtdHJpdG9uJyA6ICd0aGVtZS1tYXRlcmlhbCcpXG4gICAgbG9ndih2ZXJib3NlLCdmaXJzdFRpbWU6ICcgKyB2YXJzLmZpcnN0VGltZSlcbiAgICBpZiAodmFycy5maXJzdFRpbWUpIHtcbiAgICAgIHJpbXJhZi5zeW5jKG91dHB1dClcbiAgICAgIG1rZGlycC5zeW5jKG91dHB1dClcbiAgICAgIGNvbnN0IGJ1aWxkWE1MID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5idWlsZFhNTFxuICAgICAgY29uc3QgY3JlYXRlQXBwSnNvbiA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuY3JlYXRlQXBwSnNvblxuICAgICAgY29uc3QgY3JlYXRlV29ya3NwYWNlSnNvbiA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuY3JlYXRlV29ya3NwYWNlSnNvblxuICAgICAgY29uc3QgY3JlYXRlSlNET01FbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuY3JlYXRlSlNET01FbnZpcm9ubWVudFxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnYnVpbGQueG1sJyksIGJ1aWxkWE1MKHZhcnMucHJvZHVjdGlvbiwgb3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnYXBwLmpzb24nKSwgY3JlYXRlQXBwSnNvbih0aGVtZSwgcGFja2FnZXMsIHRvb2xraXQsIG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dCwgJ2pzZG9tLWVudmlyb25tZW50LmpzJyksIGNyZWF0ZUpTRE9NRW52aXJvbm1lbnQob3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnd29ya3NwYWNlLmpzb24nKSwgY3JlYXRlV29ya3NwYWNlSnNvbihvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICB2YXIgZnJhbWV3b3JrID0gdmFycy5mcmFtZXdvcms7XG4gICAgICAvL2JlY2F1c2Ugb2YgYSBwcm9ibGVtIHdpdGggY29sb3JwaWNrZXJcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L3V4L2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vdXgvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICd1eCcpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAodXgpICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSxgZXh0LSR7ZnJhbWV3b3JrfS9wYWNrYWdlcy9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAncGFja2FnZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVBhdGgsIHRvUGF0aClcbiAgICAgICAgbG9nKGFwcCwgJ0NvcHlpbmcgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L292ZXJyaWRlcy9gKSkpIHtcbiAgICAgICAgdmFyIGZyb21QYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGBleHQtJHtmcmFtZXdvcmt9L292ZXJyaWRlcy9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ292ZXJyaWRlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksJ3Jlc291cmNlcy8nKSkpIHtcbiAgICAgICAgdmFyIGZyb21SZXNvdXJjZXMgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3Jlc291cmNlcy8nKVxuICAgICAgICB2YXIgdG9SZXNvdXJjZXMgPSBwYXRoLmpvaW4ob3V0cHV0LCAnLi4vcmVzb3VyY2VzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21SZXNvdXJjZXMsIHRvUmVzb3VyY2VzKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAnICsgZnJvbVJlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1Jlc291cmNlcy5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICB9XG4gICAgdmFycy5maXJzdFRpbWUgPSBmYWxzZVxuICAgIHZhciBqcyA9ICcnXG4gICAgaWYgKHZhcnMucHJvZHVjdGlvbikge1xuICAgICAganMgPSB2YXJzLmRlcHMuam9pbignO1xcbicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGpzID0gYEV4dC5yZXF1aXJlKFtcIkV4dC4qXCIsXCJFeHQuZGF0YS5UcmVlU3RvcmVcIl0pYFxuICAgIH1cbiAgICBpZiAodmFycy5tYW5pZmVzdCA9PT0gbnVsbCB8fCBqcyAhPT0gdmFycy5tYW5pZmVzdCkge1xuICAgICAgdmFycy5tYW5pZmVzdCA9IGpzXG4gICAgICBjb25zdCBtYW5pZmVzdCA9IHBhdGguam9pbihvdXRwdXQsICdtYW5pZmVzdC5qcycpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKG1hbmlmZXN0LCBqcywgJ3V0ZjgnKVxuICAgICAgdmFycy5yZWJ1aWxkID0gdHJ1ZVxuICAgICAgdmFyIGJ1bmRsZURpciA9IG91dHB1dC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKVxuICAgICAgaWYgKGJ1bmRsZURpci50cmltKCkgPT0gJycpIHtidW5kbGVEaXIgPSAnLi8nfVxuICAgICAgbG9nKGFwcCwgJ0J1aWxkaW5nIEV4dCBidW5kbGUgYXQ6ICcgKyBidW5kbGVEaXIpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5yZWJ1aWxkID0gZmFsc2VcbiAgICAgIGxvZyhhcHAsICdFeHQgcmVidWlsZCBOT1QgbmVlZGVkJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19wcmVwYXJlRm9yQnVpbGQ6ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgdmFycywgb3B0aW9ucykge1xuLy8gIHRyeSB7XG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9idWlsZEV4dEJ1bmRsZScpXG4gICAgbGV0IHNlbmNoYTsgdHJ5IHsgc2VuY2hhID0gcmVxdWlyZSgnQHNlbmNoYS9jbWQnKSB9IGNhdGNoIChlKSB7IHNlbmNoYSA9ICdzZW5jaGEnIH1cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhzZW5jaGEpKSB7XG4gICAgICBsb2d2KHZlcmJvc2UsJ3NlbmNoYSBmb2xkZXIgZXhpc3RzJylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KHZlcmJvc2UsJ3NlbmNoYSBmb2xkZXIgRE9FUyBOT1QgZXhpc3QnKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgb25CdWlsZERvbmUgPSAoKSA9PiB7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwnb25CdWlsZERvbmUnKVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH1cbiAgICAgIHZhciBvcHRzID0geyBjd2Q6IG91dHB1dFBhdGgsIHNpbGVudDogdHJ1ZSwgc3RkaW86ICdwaXBlJywgZW5jb2Rpbmc6ICd1dGYtOCd9XG4gICAgICBfZXhlY3V0ZUFzeW5jKGFwcCwgc2VuY2hhLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpLnRoZW4gKFxuICAgICAgICBmdW5jdGlvbigpIHsgb25CdWlsZERvbmUoKSB9LFxuICAgICAgICBmdW5jdGlvbihyZWFzb24pIHsgcmVqZWN0KHJlYXNvbikgfVxuICAgICAgKVxuICAgIH0pXG4gIC8vIH1cbiAgLy8gY2F0Y2goZSkge1xuICAvLyAgIGNvbnNvbGUubG9nKCdlJylcbiAgLy8gICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMudmVyYm9zZSxlKVxuICAvLyAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfYnVpbGRFeHRCdW5kbGU6ICcgKyBlKVxuICAvLyAgIGNhbGxiYWNrKClcbiAgLy8gfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZXhlY3V0ZUFzeW5jIChhcHAsIGNvbW1hbmQsIHBhcm1zLCBvcHRzLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuLy8gIHRyeSB7XG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICAvL2NvbnN0IERFRkFVTFRfU1VCU1RSUyA9IFsnW0lORl0gTG9hZGluZycsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tMT0ddIEZhc2hpb24gYnVpbGQgY29tcGxldGUnLCAnW0VSUl0nLCAnW1dSTl0nLCBcIltJTkZdIFNlcnZlclwiLCBcIltJTkZdIFdyaXRpbmdcIiwgXCJbSU5GXSBMb2FkaW5nIEJ1aWxkXCIsIFwiW0lORl0gV2FpdGluZ1wiLCBcIltMT0ddIEZhc2hpb24gd2FpdGluZ1wiXTtcbiAgICBjb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbXCJbSU5GXSB4U2VydmVyXCIsICdbSU5GXSBMb2FkaW5nJywgJ1tJTkZdIEFwcGVuZCcsICdbSU5GXSBQcm9jZXNzaW5nJywgJ1tJTkZdIFByb2Nlc3NpbmcgQnVpbGQnLCAnW0xPR10gRmFzaGlvbiBidWlsZCBjb21wbGV0ZScsICdbRVJSXScsICdbV1JOXScsIFwiW0lORl0gV3JpdGluZ1wiLCBcIltJTkZdIExvYWRpbmcgQnVpbGRcIiwgXCJbSU5GXSBXYWl0aW5nXCIsIFwiW0xPR10gRmFzaGlvbiB3YWl0aW5nXCJdO1xuICAgIHZhciBzdWJzdHJpbmdzID0gREVGQVVMVF9TVUJTVFJTXG4gICAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKVxuICAgIGNvbnN0IGNyb3NzU3Bhd24gPSByZXF1aXJlKCdjcm9zcy1zcGF3bicpXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2V4ZWN1dGVBc3luYycpXG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbG9ndih2ZXJib3NlLGBjb21tYW5kIC0gJHtjb21tYW5kfWApXG4gICAgICBsb2d2KHZlcmJvc2UsIGBwYXJtcyAtICR7cGFybXN9YClcbiAgICAgIGxvZ3YodmVyYm9zZSwgYG9wdHMgLSAke0pTT04uc3RyaW5naWZ5KG9wdHMpfWApXG4gICAgICBsZXQgY2hpbGQgPSBjcm9zc1NwYXduKGNvbW1hbmQsIHBhcm1zLCBvcHRzKVxuICAgICAgY2hpbGQub24oJ2Nsb3NlJywgKGNvZGUsIHNpZ25hbCkgPT4ge1xuICAgICAgICBsb2d2KHZlcmJvc2UsIGBvbiBjbG9zZTogYCArIGNvZGUpXG4gICAgICAgIGlmKGNvZGUgPT09IDApIHsgcmVzb2x2ZSgwKSB9XG4gICAgICAgIGVsc2UgeyBjb21waWxhdGlvbi5lcnJvcnMucHVzaCggbmV3IEVycm9yKGNvZGUpICk7IHJlc29sdmUoMCkgfVxuICAgICAgfSlcbiAgICAgIGNoaWxkLm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xuICAgICAgICBsb2d2KHZlcmJvc2UsIGBvbiBlcnJvcmApXG4gICAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGVycm9yKVxuICAgICAgICByZXNvbHZlKDApXG4gICAgICB9KVxuICAgICAgY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXG4gICAgICAgIGxvZ3YodmVyYm9zZSwgYCR7c3RyfWApXG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEudG9TdHJpbmcoKS5tYXRjaCgvRmFzaGlvbiB3YWl0aW5nIGZvciBjaGFuZ2VzXFwuXFwuXFwuLykpIHtcblxuICAgICAgICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICAgICAgICB2YXIgZmlsZW5hbWUgPSBwcm9jZXNzLmN3ZCgpICsgdmFycy50b3VjaEZpbGU7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpXG4gICAgICAgICAgICB2YXIgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSk7XG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVuYW1lLCAnLy8nICsgZCwgJ3V0ZjgnKTtcbiAgICAgICAgICAgIGxvZ3YoYXBwLCBgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2goZSkge1xuICAgICAgICAgICAgbG9ndihhcHAsIGBOT1QgdG91Y2hpbmcgJHtmaWxlbmFtZX1gKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKDApXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKHN1YnN0cmluZ3Muc29tZShmdW5jdGlvbih2KSB7IHJldHVybiBkYXRhLmluZGV4T2YodikgPj0gMDsgfSkpIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0lORl1cIiwgXCJcIilcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0xPR11cIiwgXCJcIilcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKS50cmltKClcbiAgICAgICAgICAgIGlmIChzdHIuaW5jbHVkZXMoXCJbRVJSXVwiKSkge1xuICAgICAgICAgICAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaChhcHAgKyBzdHIucmVwbGFjZSgvXlxcW0VSUlxcXSAvZ2ksICcnKSk7XG4gICAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0VSUl1cIiwgYCR7Y2hhbGsucmVkKFwiW0VSUl1cIil9YClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvZyhhcHAsIHN0cilcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBjaGlsZC5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICBsb2d2KG9wdGlvbnMsIGBlcnJvciBvbiBjbG9zZTogYCArIGRhdGEpXG4gICAgICAgIHZhciBzdHIgPSBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywgXCIgXCIpLnRyaW0oKVxuICAgICAgICB2YXIgc3RySmF2YU9wdHMgPSBcIlBpY2tlZCB1cCBfSkFWQV9PUFRJT05TXCI7XG4gICAgICAgIHZhciBpbmNsdWRlcyA9IHN0ci5pbmNsdWRlcyhzdHJKYXZhT3B0cylcbiAgICAgICAgaWYgKCFpbmNsdWRlcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2FwcH0gJHtjaGFsay5yZWQoXCJbRVJSXVwiKX0gJHtzdHJ9YClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICAvLyB9XG4gIC8vIGNhdGNoKGUpIHtcbiAgLy8gICBsb2d2KG9wdGlvbnMsZSlcbiAgLy8gICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2V4ZWN1dGVBc3luYzogJyArIGUpXG4gIC8vICAgY2FsbGJhY2soKVxuICAvLyB9XG59XG5cbi8vKioqKioqKioqKlxuZnVuY3Rpb24gcnVuU2NyaXB0KHNjcmlwdFBhdGgsIGNhbGxiYWNrKSB7XG4gIHZhciBjaGlsZFByb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG4gIC8vIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBjYWxsYmFjayBoYXMgYmVlbiBpbnZva2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgaW52b2NhdGlvbnNcbiAgdmFyIGludm9rZWQgPSBmYWxzZTtcbiAgdmFyIHByb2Nlc3MgPSBjaGlsZFByb2Nlc3MuZm9yayhzY3JpcHRQYXRoKTtcbiAgLy8gbGlzdGVuIGZvciBlcnJvcnMgYXMgdGhleSBtYXkgcHJldmVudCB0aGUgZXhpdCBldmVudCBmcm9tIGZpcmluZ1xuICBwcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xuICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjayBvbmNlIHRoZSBwcm9jZXNzIGhhcyBmaW5pc2hlZCBydW5uaW5nXG4gIHByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZSkge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgdmFyIGVyciA9IGNvZGUgPT09IDAgPyBudWxsIDogbmV3IEVycm9yKCdleGl0IGNvZGUgJyArIGNvZGUpO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfdG9YdHlwZShzdHIpIHtcbiAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL18vZywgJy0nKVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0QXBwKCkge1xuICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gIHZhciBwcmVmaXggPSBgYFxuICBjb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKVxuICBpZiAocGxhdGZvcm0gPT0gJ2RhcndpbicpIHsgcHJlZml4ID0gYOKEuSDjgIxleHTjgI06YCB9XG4gIGVsc2UgeyBwcmVmaXggPSBgaSBbZXh0XTpgIH1cbiAgcmV0dXJuIGAke2NoYWxrLmdyZWVuKHByZWZpeCl9IGBcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2dldFZlcnNpb25zKHBsdWdpbk5hbWUsIGZyYW1ld29ya05hbWUpIHtcbiAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgdmFyIHYgPSB7fVxuICB2YXIgcGx1Z2luUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQHNlbmNoYScsIHBsdWdpbk5hbWUpXG4gIHZhciBwbHVnaW5Qa2cgPSAoZnMuZXhpc3RzU3luYyhwbHVnaW5QYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGx1Z2luUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYucGx1Z2luVmVyc2lvbiA9IHBsdWdpblBrZy52ZXJzaW9uXG4gIHYuX3Jlc29sdmVkID0gcGx1Z2luUGtnLl9yZXNvbHZlZFxuICBpZiAodi5fcmVzb2x2ZWQgPT0gdW5kZWZpbmVkKSB7XG4gICAgdi5lZGl0aW9uID0gYENvbW1lcmNpYWxgXG4gIH1cbiAgZWxzZSB7XG4gICAgaWYgKC0xID09IHYuX3Jlc29sdmVkLmluZGV4T2YoJ2NvbW11bml0eScpKSB7XG4gICAgICB2LmVkaXRpb24gPSBgQ29tbWVyY2lhbGBcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2LmVkaXRpb24gPSBgQ29tbXVuaXR5YFxuICAgIH1cbiAgfVxuICB2YXIgd2VicGFja1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL3dlYnBhY2snKVxuICB2YXIgd2VicGFja1BrZyA9IChmcy5leGlzdHNTeW5jKHdlYnBhY2tQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMod2VicGFja1BhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LndlYnBhY2tWZXJzaW9uID0gd2VicGFja1BrZy52ZXJzaW9uXG4gIHZhciBleHRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dCcpXG4gIHZhciBleHRQa2cgPSAoZnMuZXhpc3RzU3luYyhleHRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZXh0UGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gIHYuZXh0VmVyc2lvbiA9IGV4dFBrZy5zZW5jaGEudmVyc2lvblxuICB2YXIgY21kUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLGBub2RlX21vZHVsZXMvQHNlbmNoYS9jbWRgKVxuICB2YXIgY21kUGtnID0gKGZzLmV4aXN0c1N5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LmNtZFZlcnNpb24gPSBjbWRQa2cudmVyc2lvbl9mdWxsXG4gIGlmICh2LmNtZFZlcnNpb24gPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGNtZFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSxgbm9kZV9tb2R1bGVzL0BzZW5jaGEvJHtwbHVnaW5OYW1lfS9ub2RlX21vZHVsZXMvQHNlbmNoYS9jbWRgKVxuICAgIHZhciBjbWRQa2cgPSAoZnMuZXhpc3RzU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJykgJiYgSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKSB8fCB7fSk7XG4gICAgdi5jbWRWZXJzaW9uID0gY21kUGtnLnZlcnNpb25fZnVsbFxuICB9XG4gIHZhciBmcmFtZXdvcmtJbmZvID0gJydcbiAgIGlmIChmcmFtZXdvcmtOYW1lICE9IHVuZGVmaW5lZCAmJiBmcmFtZXdvcmtOYW1lICE9ICdleHRqcycpIHtcbiAgICB2YXIgZnJhbWV3b3JrUGF0aCA9ICcnXG4gICAgaWYgKGZyYW1ld29ya05hbWUgPT0gJ3JlYWN0Jykge1xuICAgICAgZnJhbWV3b3JrUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvcmVhY3QnKVxuICAgIH1cbiAgICBpZiAoZnJhbWV3b3JrTmFtZSA9PSAnYW5ndWxhcicpIHtcbiAgICAgIGZyYW1ld29ya1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL2NvcmUnKVxuICAgIH1cbiAgICB2YXIgZnJhbWV3b3JrUGtnID0gKGZzLmV4aXN0c1N5bmMoZnJhbWV3b3JrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGZyYW1ld29ya1BhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICAgIHYuZnJhbWV3b3JrVmVyc2lvbiA9IGZyYW1ld29ya1BrZy52ZXJzaW9uXG4gICAgZnJhbWV3b3JrSW5mbyA9ICcsICcgKyBmcmFtZXdvcmtOYW1lICsgJyB2JyArIHYuZnJhbWV3b3JrVmVyc2lvblxuICB9XG4gIHJldHVybiAnZXh0LXdlYnBhY2stcGx1Z2luIHYnICsgdi5wbHVnaW5WZXJzaW9uICsgJywgRXh0IEpTIHYnICsgdi5leHRWZXJzaW9uICsgJyAnICsgdi5lZGl0aW9uICsgJyBFZGl0aW9uLCBTZW5jaGEgQ21kIHYnICsgdi5jbWRWZXJzaW9uICsgJywgd2VicGFjayB2JyArIHYud2VicGFja1ZlcnNpb24gKyBmcmFtZXdvcmtJbmZvXG4gfVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBsb2coYXBwLG1lc3NhZ2UpIHtcbiAgdmFyIHMgPSBhcHAgKyBtZXNzYWdlXG4gIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gIHRyeSB7cHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKCl9Y2F0Y2goZSkge31cbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocyk7cHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2goYXBwLG1lc3NhZ2UpIHtcbiAgdmFyIGggPSBmYWxzZVxuICB2YXIgcyA9IGFwcCArIG1lc3NhZ2VcbiAgaWYgKGggPT0gdHJ1ZSkge1xuICAgIHJlcXVpcmUoJ3JlYWRsaW5lJykuY3Vyc29yVG8ocHJvY2Vzcy5zdGRvdXQsIDApXG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgfVxuICAgIGNhdGNoKGUpIHt9XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUocylcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFxuJylcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBsb2d2KHZlcmJvc2UsIHMpIHtcbiAgaWYgKHZlcmJvc2UgPT0gJ3llcycpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGAtdmVyYm9zZTogJHtzfWApXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2dldFZhbGlkYXRlT3B0aW9ucygpIHtcbiAgcmV0dXJuIHtcbiAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICBcInByb3BlcnRpZXNcIjoge1xuICAgICAgXCJmcmFtZXdvcmtcIjoge1xuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJ0b29sa2l0XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwidGhlbWVcIjoge1xuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJlbWl0XCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ3llcycgb3IgJ25vJyBzdHJpbmcgdmFsdWUgKE5PVCB0cnVlIG9yIGZhbHNlKVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJzY3JpcHRcIjoge1xuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJwb3J0XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcImludGVnZXJcIl1cbiAgICAgIH0sXG4gICAgICBcInBhY2thZ2VzXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiLCBcImFycmF5XCJdXG4gICAgICB9LFxuICAgICAgXCJwcm9maWxlXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiZW52aXJvbm1lbnRcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAnZGV2ZWxvcG1lbnQnIG9yICdwcm9kdWN0aW9uJyBzdHJpbmcgdmFsdWVcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwidHJlZXNoYWtlXCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ3llcycgb3IgJ25vJyBzdHJpbmcgdmFsdWUgKE5PVCB0cnVlIG9yIGZhbHNlKVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJicm93c2VyXCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ3llcycgb3IgJ25vJyBzdHJpbmcgdmFsdWUgKE5PVCB0cnVlIG9yIGZhbHNlKVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJ3YXRjaFwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwidmVyYm9zZVwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJhZGRpdGlvbmFsUHJvcGVydGllc1wiOiBmYWxzZVxuICB9O1xufVxuXG5cbmZ1bmN0aW9uIF9nZXREZWZhdWx0T3B0aW9ucygpIHtcbiAgcmV0dXJuIHtcbiAgICBmcmFtZXdvcms6ICdleHRqcycsXG4gICAgdG9vbGtpdDogJ21vZGVybicsXG4gICAgdGhlbWU6ICd0aGVtZS1tYXRlcmlhbCcsXG4gICAgZW1pdDogJ3llcycsXG4gICAgc2NyaXB0OiBudWxsLFxuICAgIHBvcnQ6IDE5NjIsXG4gICAgcGFja2FnZXM6IFtdLFxuXG4gICAgcHJvZmlsZTogJycsXG4gICAgZW52aXJvbm1lbnQ6ICdkZXZlbG9wbWVudCcsXG4gICAgdHJlZXNoYWtlOiAnbm8nLFxuICAgIGJyb3dzZXI6ICd5ZXMnLFxuICAgIHdhdGNoOiAneWVzJyxcbiAgICB2ZXJib3NlOiAnbm8nXG4gIH1cbn1cbiJdfQ==