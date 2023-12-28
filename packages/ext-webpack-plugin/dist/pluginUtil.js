"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._afterCompile = _afterCompile;
exports._buildExtBundle = _buildExtBundle;
exports._compilation = _compilation;
exports._constructor = _constructor;
exports._done = _done;
exports._emit = _emit;
exports._executeAsync = _executeAsync;
exports._getApp = _getApp;
exports._getVersions = _getVersions;
exports._prepareForBuild = _prepareForBuild;
exports._thisCompilation = _thisCompilation;
exports._toXtype = _toXtype;
exports.log = log;
exports.logh = logh;
exports.logv = logv;
exports.smartFlowPing = smartFlowPing;
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function () { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function (t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function (t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(typeof e + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function (e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function () { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function (e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function (t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function (t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function (t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function (t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function (e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
    options = _objectSpread(_objectSpread(_objectSpread({}, _getDefaultOptions()), initialOptions), rc);
    vars = require(`./${framework}Util`)._getDefaultVars();
    vars.pluginName = 'ext-webpack-plugin';
    vars.app = _getApp();
    var pluginName = vars.pluginName;
    var app = vars.app;
    vars.testing = false;
    logv(verbose, 'FUNCTION _constructor');
    logv(verbose, `pluginName - ${pluginName}`);
    logv(verbose, `app - ${app}`);
    if (options.environment == 'production' || options.cmdopts.includes('--production') || options.cmdopts.includes('-pr') || options.cmdopts.includes('--environment=production') || options.cmdopts.includes('-e=production')) {
      vars.production = true;
      options.browser = 'no';
      options.watch = 'no';
      options.buildEnvironment = 'production';
    } else if (options.cmdopts && (options.cmdopts.includes('--testing') || options.cmdopts.includes('-te') || options.cmdopts.includes('--environment=testing') || options.cmdopts.includes('-e=testing'))) {
      vars.production = false;
      vars.testing = true;
      options.browser = 'no';
      options.watch = 'no';
      options.buildEnvironment = 'testing';
    } else {
      options.buildEnvironment = 'development';
      vars.production = false;
    }
    log(app, _getVersions(pluginName, framework));

    //mjg added for angular cli build
    if (framework == 'angular' && options.intellishake == 'no' && vars.production == true && treeshake == 'yes') {
      vars.buildstep = '1 of 1';
      log(app, 'Starting production build for ' + framework);
    } else if (framework == 'react' || framework == 'extjs' || framework == 'web-components') {
      if (vars.production == true) {
        vars.buildstep = '1 of 1';
        log(app, 'Starting production build for ' + framework);
      } else if (vars.testing == true) {
        vars.buildstep = '1 of 1';
        log(app, 'Starting testing build for ' + framework);
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
    logv(verbose, 'Building for ' + options.buildEnvironment + ', ' + 'treeshake is ' + options.treeshake + ', ' + 'intellishake is ' + options.intellishake);
    var configObj = {
      vars: vars,
      options: options
    };
    return configObj;
  } catch (e) {
    throw '_constructor: ' + e.toString();
  }
}

//**********
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
}

//**********
function _compilation(compiler, compilation, vars, options) {
  try {
    var app = vars.app;
    var verbose = options.verbose;
    var framework = options.framework;
    logv(verbose, 'FUNCTION _compilation');
    if (framework != 'extjs') {
      if (options.treeshake === 'yes' && options.buildEnvironment === 'production') {
        var extComponents = [];

        //mjg for 1 step build
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
          if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration != undefined) {
            compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tap(`ext-html-generation`, data => {
              const path = require('path');
              var jsPath = path.join(vars.extPath, 'ext.js');
              var cssPath = path.join(vars.extPath, 'ext.css');
              //var jsPath = vars.extPath + '/' +  'ext.js';
              //var cssPath = vars.extPath + '/' + 'ext.css';
              data.assets.js.unshift(jsPath);
              data.assets.css.unshift(cssPath);
              log(app, `Adding ${jsPath} and ${cssPath} to index.html`);
            });
          }
        }
      }
    }
  } catch (e) {
    throw '_compilation: ' + e.toString();
    //    logv(options.verbose,e)
    //    compilation.errors.push('_compilation: ' + e)
  }
}

//**********
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
}

//**********
function _emit(_x, _x2, _x3, _x4, _x5) {
  return _emit2.apply(this, arguments);
} //**********
function _emit2() {
  _emit2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(compiler, compilation, vars, options, callback) {
    var path, app, verbose, emit, framework, outputPath, command, parms;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          path = require('path');
          app = vars.app;
          verbose = options.verbose;
          emit = options.emit;
          framework = options.framework;
          vars.callback = callback;
          logv(verbose, 'FUNCTION _emit');
          if (!(emit == 'yes')) {
            _context.next = 38;
            break;
          }
          if (!(vars.buildstep == '1 of 1' || vars.buildstep == '1 of 2')) {
            _context.next = 34;
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
            _context.next = 31;
            break;
          }
          parms = [];
          if (!Array.isArray(options.cmdopts)) {
            options.cmdopts = options.cmdopts.split(' ');
          }
          if (options.profile == undefined || options.profile == '' || options.profile == null) {
            if (command == 'build') {
              parms = ['app', command, options.buildEnvironment];
            } else {
              parms = ['app', command, '--web-server', 'false', options.buildEnvironment];
            }
          } else {
            if (command == 'build') {
              parms = ['app', command, options.profile, options.buildEnvironment];
            } else {
              parms = ['app', command, '--web-server', 'false', options.profile, options.buildEnvironment];
            }
          }
          options.cmdopts.forEach(function (element) {
            parms.splice(parms.indexOf(command) + 1, 0, element);
          });
          // if (vars.watchStarted == false) {
          //   await _buildExtBundle(app, compilation, outputPath, parms, vars, options)
          //   vars.watchStarted = true
          // }
          if (!(vars.watchStarted == false)) {
            _context.next = 28;
            break;
          }
          _context.next = 25;
          return _buildExtBundle(app, compilation, outputPath, parms, vars, options);
        case 25:
          if (command == 'watch') {
            vars.watchStarted = true;
          } else {
            vars.callback();
          }
          _context.next = 29;
          break;
        case 28:
          vars.callback();
        case 29:
          _context.next = 32;
          break;
        case 31:
          vars.callback();
        case 32:
          _context.next = 36;
          break;
        case 34:
          logv(verbose, 'NOT running emit');
          vars.callback();
        case 36:
          _context.next = 40;
          break;
        case 38:
          logv(verbose, 'emit is no');
          vars.callback();
        case 40:
          _context.next = 46;
          break;
        case 42:
          _context.prev = 42;
          _context.t0 = _context["catch"](0);
          vars.callback();
          throw '_emit: ' + _context.t0.toString();
        case 46:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 42]]);
  }));
  return _emit2.apply(this, arguments);
}
function _done(stats, vars, options) {
  try {
    var verbose = options.verbose;
    var framework = options.framework;
    logv(verbose, 'FUNCTION _done');
    if (stats.compilation.errors && stats.compilation.errors.length)
      // && process.argv.indexOf('--watch') == -1)
      {
        var chalk = require('chalk');
        console.log(chalk.red('******************************************'));
        console.log(stats.compilation.errors[0]);
        console.log(chalk.red('******************************************'));
        //process.exit(0);
      }

    //mjg refactor
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
      } else if (vars.testing == true) {
        require('./pluginUtil').log(vars.app, `Ending testing build for ${framework}`);
      } else {
        require('./pluginUtil').log(vars.app, `Ending development build for ${framework}`);
      }
    }
    if (vars.buildstep == '2 of 2') {
      if (vars.testing == true) {
        require('./pluginUtil').log(vars.app, `Ending testing build for ${framework}`);
      }
      require('./pluginUtil').log(vars.app, `Ending production build for ${framework}`);
    }
  } catch (e) {
    //    require('./pluginUtil').logv(options.verbose,e)
    throw '_done: ' + e.toString();
  }
}

//**********
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
      var framework = vars.framework;
      //because of a problem with colorpicker
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
    js = `Ext.require(["Ext.*","Ext.data.TreeStore"])`; //for now
    if (vars.manifest === null || js !== vars.manifest) {
      vars.manifest = js + ';\nExt.require(["Ext.layout.*"]);\n';
      const manifest = path.join(output, 'manifest.js');
      fs.writeFileSync(manifest, vars.manifest, 'utf8');
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
}

//**********
function _buildExtBundle(app, compilation, outputPath, parms, vars, options) {
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
  });
}

//**********
function _executeAsync(_x6, _x7, _x8, _x9, _x10, _x11, _x12) {
  return _executeAsync2.apply(this, arguments);
} //**********
function _executeAsync2() {
  _executeAsync2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(app, command, parms, opts, compilation, vars, options) {
    var verbose, framework, DEFAULT_SUBSTRS, substrings, chalk, crossSpawn;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          verbose = options.verbose;
          framework = options.framework; //const DEFAULT_SUBSTRS = ['[INF] Loading', '[INF] Processing', '[LOG] Fashion build complete', '[ERR]', '[WRN]', "[INF] Server", "[INF] Writing", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"];
          DEFAULT_SUBSTRS = ["[INF] xServer", '[INF] Loading', '[INF] Append', '[INF] Processing', '[INF] Processing Build', '[LOG] Fashion build complete', '[ERR]', '[WRN]', "[INF] Writing", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"];
          substrings = DEFAULT_SUBSTRS;
          chalk = require('chalk');
          crossSpawn = require('cross-spawn-with-kill');
          logv(verbose, 'FUNCTION _executeAsync');
          _context2.next = 9;
          return new Promise((resolve, reject) => {
            logv(verbose, `command - ${command}`);
            logv(verbose, `parms - ${parms}`);
            logv(verbose, `opts - ${JSON.stringify(opts)}`);
            vars.child = crossSpawn(command, parms, opts);
            vars.child.on('close', (code, signal) => {
              logv(verbose, `on close: ` + code);
              if (code === 0) {
                resolve(0);
              } else {
                compilation.errors.push(new Error(code));
                resolve(0);
              }
            });
            vars.child.on('error', error => {
              logv(verbose, `on error`);
              compilation.errors.push(error);
              resolve(0);
            });
            vars.child.stdout.on('data', data => {
              var str = data.toString().replace(/\r?\n|\r/g, " ").trim();
              logv(verbose, `${str}`);
              //if (data && data.toString().match(/Fashion waiting for changes\.\.\./)) {
              if (data && data.toString().match(/aiting for changes\.\.\./)) {
                //           const fs = require('fs');
                //           var filename = process.cwd() + vars.touchFile;
                //           try {
                //             var d = new Date().toLocaleString()
                //             var data = fs.readFileSync(filename);
                //             fs.writeFileSync(filename, '//' + d, 'utf8');
                //             logv(app, `touching ${filename}`);
                //           }
                //           catch(e) {
                //             logv(app, `NOT touching ${filename}`);
                //           }

                str = str.replace("[INF]", "");
                str = str.replace("[LOG]", "");
                str = str.replace(process.cwd(), '').trim();
                if (str.includes("[ERR]")) {
                  compilation.errors.push(app + str.replace(/^\[ERR\] /gi, ''));
                  str = str.replace("[ERR]", `${chalk.red("[ERR]")}`);
                }
                log(app, str);
                vars.callback();
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
            vars.child.stderr.on('data', data => {
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
  var childProcess = require('child_process');
  // keep track of whether callback has been invoked to prevent multiple invocations
  var invoked = false;
  var process = childProcess.fork(scriptPath, [], {
    execArgv: ['--inspect=0']
  });
  // listen for errors as they may prevent the exit event from firing
  process.on('error', function (err) {
    if (invoked) return;
    invoked = true;
    callback(err);
  });
  // execute the callback once the process has finished running
  process.on('exit', function (code) {
    if (invoked) return;
    invoked = true;
    var err = code === 0 ? null : new Error('exit code ' + code);
    callback(err);
  });
}

//**********
function _toXtype(str) {
  return str.toLowerCase().replace(/_/g, '-');
}

//**********
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

//**********
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
}

//**********
function log(app, message) {
  var s = app + message;
  require('readline').cursorTo(process.stdout, 0);
  try {
    process.stdout.clearLine();
  } catch (e) {}
  process.stdout.write(s);
  process.stdout.write('\n');
}

//**********
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
}

//**********
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
      },
      "cmdopts": {
        "errorMessage": "should be a sencha cmd option or argument string",
        "type": ["string", "array"]
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
    intellishake: 'yes',
    cmdopts: ''
  };
}
function smartFlowPing(packageJsonPath, appJsonPath) {
  const {
    exec
  } = require('child_process');
  const path = require('path');
  const fs = require('fs');
  fs.readFile(packageJsonPath, 'utf8', (errPackage, dataPackage) => {
    if (errPackage) {
      return;
    }
    const packageJson = JSON.parse(dataPackage);
    fs.readFile(appJsonPath, 'utf8', (errApp, dataApp) => {
      if (errApp) {
        return;
      }
      const appJson = JSON.parse(dataApp);
      const requiresArray = appJson.requires; // Assuming appJson.requires is an array

      // Convert the array to a string
      const modifiedString = requiresArray[0].replace(/[\[\]']+/g, '');
      const homeDirectory = process.env.HOME || process.env.USERPROFILE;

      // Specify the relative path from the home directory to your file
      const relativeFilePath = '.npmrc';

      // Combine the home directory and relative file path to get the generalized file path
      const filePath = path.join(homeDirectory, relativeFilePath);
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading file: ${err.message}`);
          return;
        }
        const registryRegex = /@sencha:registry=(.+)/;

        // Extract the registry URL using the regular expression
        const match = data.match(registryRegex);

        // Check if a match is found
        if (match && match[1]) {
          const registryUrl = match[1];
          // Use npm-config to set the registry temporarily for the current process
          process.env.npm_config_registry = registryUrl;

          // Run the npm whoami command
          exec(`npm --registry ${registryUrl} whoami`, (error, stdout, stderr) => {
            if (error) {
              return;
            }
            const username = `${stdout.trim().replace('..', '@')}`;
            let additionalLicenseInfo = '';
            let licensedFeature = '';
            if (username != null) {
              additionalLicenseInfo = 'This version of Sencha Ext-gen is licensed commercially';
              licensedFeature = 'LEGAL';
            } else {
              additionalLicenseInfo = 'This version of Sencha Ext-gen is not licensed commercially';
              licensedFeature = 'UNLICENSED';
            }
            const scriptType = process.env.npm_lifecycle_event;
            let triggerevent = 'build';
            if (scriptType === 'dev') {
              triggerevent = `npm start`;
            } else if (scriptType === 'build') {
              triggerevent = `npm run build`;
            } else {
              triggerevent = `null`;
            }
            const licenseinfo = `"license=Commercial, framework=EXTJS, License Content Text=Sencha RapidExtJS-JavaScript Library Copyright, Sencha Inc. All rights reserved. licensing@sencha.com options:http://www.sencha.com/license license: http://www.sencha.com/legal/sencha-software-license-agreement Commercial License.-----------------------------------------------------------------------------------------Sencha RapidExtJS is licensed commercially. See http://www.sencha.com/legal/sencha-software-license-agreement for license terms.Beta License------------------------------------------------------------------------------------------ If this is a Beta version , use is permitted for internal evaluation and review purposes and not use for production purposes. See http://www.sencha.com/legal/sencha-software-license-agreement (Beta License) for license terms.  Third Party Content------------------------------------------------------------------------------------------The following third party software is distributed with RapidExtJS and is provided under other licenses and/or has source available from other locations. Library: YUI 0.6 (BSD Licensed) for drag-and-drop code. Location: http://developer.yahoo.com/yui License: http://developer.yahoo.com/yui/license.html (BSD 3-Clause License) Library: JSON parser Location: http://www.JSON.org/js.html License: http://www.json.org/license.html (MIT License) Library: flexible-js-formatting Location: http://code.google.com/p/flexible-js-formatting/ License: http://www.opensource.org/licenses/mit-license.php (MIT License) Library: sparkline.js Location: http://omnipotent.net/jquery.sparkline License  http://omnipotent.net/jquery.sparkline (BSD 3-Clause License) Library: DeftJS Location: http://deftjs.org/ License: http://www.opensource.org/licenses/mit-license.php (MIT License) Library: Open-Sans Location: http://www.fontsquirrel.com/fonts/open-sans License:  http://www.fontsquirrel.com/fonts/open-sans (Apache 2.0 License) Examples: Library: Silk Icons Location: http://www.famfamfam.com/lab/icons/silk/ License: http://www.famfamfam.com/lab/icons/silk/ (Creative Commons Attribution 2.5 License) Library: Font Awesome CSS Location: http://fontawesome.io/ License: http://fontawesome.io/3.2.1/license/ (MIT) Library: Material Design Icons Location: https://github.com/google/material-design-icons License: https://github.com/google/material-design-icons/blob/master/LICENSE (Apache) THIS SOFTWARE IS DISTRIBUTED 'AS-IS' WITHOUT ANY WARRANTIES, CONDITIONS AND REPRESENTATIONS WHETHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION THE IMPLIED WARRANTIES AND CONDITIONS OF MERCHANTABILITY, MERCHANTABLE QUALITY, FITNESS FOR A PARTICULAR PURPOSE, DURABILITY, NON-INFRINGEMENT, PERFORMANCE AND THOSE ARISING BY STATUTE OR FROM CUSTOM OR USAGE OF TRADE OR COURSE OF DEALING. , message=This version of Sencha RapidExtJS is licensed commercially "`;
            const jarPath = path.join(__dirname, '..', 'resources', 'utils.jar');
            const featuresUsed = `ext-gen, ${modifiedString}`;
            const encryptedLicense = btoa(licenseinfo);
            const command = `java -jar ${jarPath} ` + `-product ext-gen -productVersion ${packageJson.version} ` + `-eventType LEGAL -trigger ${triggerevent} ` + `-licensedTo ${username} ` + `-custom2 isValid=true -custom3 isTrial=false -custom4 isExpired=false -mode rapid ` + `-validLicenseInfo ${encryptedLicense} -featuresUsed ${featuresUsed} -licensedFeature ${licensedFeature} -piracyLicenseInfo ${additionalLicenseInfo}`;
            exec(command, (error, stdout, stderr) => {
              if (error) {
                return;
              }
              if (stderr) {
                return;
              }
            });
          });
        }
      });
    });
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVnZW5lcmF0b3JSdW50aW1lIiwiZSIsInQiLCJyIiwiT2JqZWN0IiwicHJvdG90eXBlIiwibiIsImhhc093blByb3BlcnR5IiwibyIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJpIiwiU3ltYm9sIiwiYSIsIml0ZXJhdG9yIiwiYyIsImFzeW5jSXRlcmF0b3IiLCJ1IiwidG9TdHJpbmdUYWciLCJkZWZpbmUiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJ3cmFwIiwiR2VuZXJhdG9yIiwiY3JlYXRlIiwiQ29udGV4dCIsIm1ha2VJbnZva2VNZXRob2QiLCJ0cnlDYXRjaCIsInR5cGUiLCJhcmciLCJjYWxsIiwiaCIsImwiLCJmIiwicyIsInkiLCJHZW5lcmF0b3JGdW5jdGlvbiIsIkdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlIiwicCIsImQiLCJnZXRQcm90b3R5cGVPZiIsInYiLCJ2YWx1ZXMiLCJnIiwiZGVmaW5lSXRlcmF0b3JNZXRob2RzIiwiZm9yRWFjaCIsIl9pbnZva2UiLCJBc3luY0l0ZXJhdG9yIiwiaW52b2tlIiwicmVzb2x2ZSIsIl9fYXdhaXQiLCJ0aGVuIiwiY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmciLCJFcnJvciIsImRvbmUiLCJtZXRob2QiLCJkZWxlZ2F0ZSIsIm1heWJlSW52b2tlRGVsZWdhdGUiLCJzZW50IiwiX3NlbnQiLCJkaXNwYXRjaEV4Y2VwdGlvbiIsImFicnVwdCIsInJldHVybiIsIlR5cGVFcnJvciIsInJlc3VsdE5hbWUiLCJuZXh0IiwibmV4dExvYyIsInB1c2hUcnlFbnRyeSIsInRyeUxvYyIsImNhdGNoTG9jIiwiZmluYWxseUxvYyIsImFmdGVyTG9jIiwidHJ5RW50cmllcyIsInB1c2giLCJyZXNldFRyeUVudHJ5IiwiY29tcGxldGlvbiIsInJlc2V0IiwiaXNOYU4iLCJsZW5ndGgiLCJkaXNwbGF5TmFtZSIsImlzR2VuZXJhdG9yRnVuY3Rpb24iLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJtYXJrIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJhd3JhcCIsImFzeW5jIiwiUHJvbWlzZSIsImtleXMiLCJyZXZlcnNlIiwicG9wIiwicHJldiIsImNoYXJBdCIsInNsaWNlIiwic3RvcCIsInJ2YWwiLCJoYW5kbGUiLCJjb21wbGV0ZSIsImZpbmlzaCIsImNhdGNoIiwiZGVsZWdhdGVZaWVsZCIsImFzeW5jR2VuZXJhdG9yU3RlcCIsImdlbiIsInJlamVjdCIsIl9uZXh0IiwiX3Rocm93Iiwia2V5IiwiaW5mbyIsImVycm9yIiwiX2FzeW5jVG9HZW5lcmF0b3IiLCJmbiIsInNlbGYiLCJhcmdzIiwiYXJndW1lbnRzIiwiYXBwbHkiLCJlcnIiLCJ1bmRlZmluZWQiLCJvd25LZXlzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwiZmlsdGVyIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiX29iamVjdFNwcmVhZCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwib2JqIiwiX3RvUHJvcGVydHlLZXkiLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJ0b1ByaW1pdGl2ZSIsIk51bWJlciIsIl9jb25zdHJ1Y3RvciIsImluaXRpYWxPcHRpb25zIiwiZnMiLCJyZXF1aXJlIiwidmFycyIsIm9wdGlvbnMiLCJmcmFtZXdvcmsiLCJwbHVnaW5FcnJvcnMiLCJyZXN1bHQiLCJ0cmVlc2hha2UiLCJ2ZXJib3NlIiwidmFsaWRhdGVPcHRpb25zIiwiX2dldFZhbGlkYXRlT3B0aW9ucyIsInJjIiwiZXhpc3RzU3luYyIsIkpTT04iLCJwYXJzZSIsInJlYWRGaWxlU3luYyIsIl9nZXREZWZhdWx0T3B0aW9ucyIsIl9nZXREZWZhdWx0VmFycyIsInBsdWdpbk5hbWUiLCJhcHAiLCJfZ2V0QXBwIiwidGVzdGluZyIsImxvZ3YiLCJlbnZpcm9ubWVudCIsImNtZG9wdHMiLCJpbmNsdWRlcyIsInByb2R1Y3Rpb24iLCJicm93c2VyIiwid2F0Y2giLCJidWlsZEVudmlyb25tZW50IiwibG9nIiwiX2dldFZlcnNpb25zIiwiaW50ZWxsaXNoYWtlIiwiYnVpbGRzdGVwIiwiX3RvUHJvZCIsImNvbmZpZ09iaiIsInRvU3RyaW5nIiwiX3RoaXNDb21waWxhdGlvbiIsImNvbXBpbGVyIiwiY29tcGlsYXRpb24iLCJzY3JpcHQiLCJydW5TY3JpcHQiLCJfY29tcGlsYXRpb24iLCJleHRDb21wb25lbnRzIiwiX2dldEFsbENvbXBvbmVudHMiLCJob29rcyIsInN1Y2NlZWRNb2R1bGUiLCJ0YXAiLCJtb2R1bGUiLCJyZXNvdXJjZSIsIm1hdGNoIiwiX3NvdXJjZSIsIl92YWx1ZSIsInRvTG93ZXJDYXNlIiwiZGVwcyIsIl9leHRyYWN0RnJvbVNvdXJjZSIsImNvbnNvbGUiLCJmaW5pc2hNb2R1bGVzIiwibW9kdWxlcyIsIl93cml0ZUZpbGVzVG9Qcm9kRm9sZGVyIiwiaW5qZWN0IiwiaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbiIsImRhdGEiLCJwYXRoIiwianNQYXRoIiwiam9pbiIsImV4dFBhdGgiLCJjc3NQYXRoIiwiYXNzZXRzIiwianMiLCJ1bnNoaWZ0IiwiY3NzIiwiX2FmdGVyQ29tcGlsZSIsIl9lbWl0IiwiX3giLCJfeDIiLCJfeDMiLCJfeDQiLCJfeDUiLCJfZW1pdDIiLCJfY2FsbGVlIiwiY2FsbGJhY2siLCJlbWl0Iiwib3V0cHV0UGF0aCIsImNvbW1hbmQiLCJwYXJtcyIsIl9jYWxsZWUkIiwiX2NvbnRleHQiLCJkZXZTZXJ2ZXIiLCJjb250ZW50QmFzZSIsIl9wcmVwYXJlRm9yQnVpbGQiLCJyZWJ1aWxkIiwiQXJyYXkiLCJpc0FycmF5Iiwic3BsaXQiLCJwcm9maWxlIiwiZWxlbWVudCIsInNwbGljZSIsImluZGV4T2YiLCJ3YXRjaFN0YXJ0ZWQiLCJfYnVpbGRFeHRCdW5kbGUiLCJ0MCIsIl9kb25lIiwic3RhdHMiLCJlcnJvcnMiLCJjaGFsayIsInJlZCIsIl90b0RldiIsImJyb3dzZXJDb3VudCIsInVybCIsInBvcnQiLCJvcG4iLCJvdXRwdXQiLCJwYWNrYWdlcyIsInRvb2xraXQiLCJ0aGVtZSIsInJpbXJhZiIsIm1rZGlycCIsImZzeCIsImZpcnN0VGltZSIsInN5bmMiLCJidWlsZFhNTCIsImNyZWF0ZUFwcEpzb24iLCJjcmVhdGVXb3Jrc3BhY2VKc29uIiwiY3JlYXRlSlNET01FbnZpcm9ubWVudCIsIndyaXRlRmlsZVN5bmMiLCJwcm9jZXNzIiwiY3dkIiwiZnJvbVBhdGgiLCJ0b1BhdGgiLCJjb3B5U3luYyIsInJlcGxhY2UiLCJmcm9tUmVzb3VyY2VzIiwidG9SZXNvdXJjZXMiLCJpbmRleCIsIm1hbmlmZXN0IiwiYnVuZGxlRGlyIiwidHJpbSIsInNlbmNoYSIsIm9uQnVpbGREb25lIiwib3B0cyIsInNpbGVudCIsInN0ZGlvIiwiZW5jb2RpbmciLCJfZXhlY3V0ZUFzeW5jIiwicmVhc29uIiwiX3g2IiwiX3g3IiwiX3g4IiwiX3g5IiwiX3gxMCIsIl94MTEiLCJfeDEyIiwiX2V4ZWN1dGVBc3luYzIiLCJfY2FsbGVlMiIsIkRFRkFVTFRfU1VCU1RSUyIsInN1YnN0cmluZ3MiLCJjcm9zc1NwYXduIiwiX2NhbGxlZTIkIiwiX2NvbnRleHQyIiwic3RyaW5naWZ5IiwiY2hpbGQiLCJvbiIsImNvZGUiLCJzaWduYWwiLCJzdGRvdXQiLCJzdHIiLCJzb21lIiwic3RkZXJyIiwic3RySmF2YU9wdHMiLCJzY3JpcHRQYXRoIiwiY2hpbGRQcm9jZXNzIiwiaW52b2tlZCIsImZvcmsiLCJleGVjQXJndiIsIl90b1h0eXBlIiwicHJlZml4IiwicGxhdGZvcm0iLCJncmVlbiIsImZyYW1ld29ya05hbWUiLCJmcmFtZXdvcmtJbmZvIiwicGx1Z2luVmVyc2lvbiIsImV4dFZlcnNpb24iLCJlZGl0aW9uIiwiY21kVmVyc2lvbiIsIndlYnBhY2tWZXJzaW9uIiwicGx1Z2luUGF0aCIsInBsdWdpblBrZyIsInZlcnNpb24iLCJfcmVzb2x2ZWQiLCJ3ZWJwYWNrUGF0aCIsIndlYnBhY2tQa2ciLCJleHRQa2ciLCJjbWRQYXRoIiwiY21kUGtnIiwidmVyc2lvbl9mdWxsIiwiZnJhbWV3b3JrUGF0aCIsImZyYW1ld29ya1BrZyIsImZyYW1ld29ya1ZlcnNpb24iLCJtZXNzYWdlIiwiY3Vyc29yVG8iLCJjbGVhckxpbmUiLCJ3cml0ZSIsImxvZ2giLCJzbWFydEZsb3dQaW5nIiwicGFja2FnZUpzb25QYXRoIiwiYXBwSnNvblBhdGgiLCJleGVjIiwicmVhZEZpbGUiLCJlcnJQYWNrYWdlIiwiZGF0YVBhY2thZ2UiLCJwYWNrYWdlSnNvbiIsImVyckFwcCIsImRhdGFBcHAiLCJhcHBKc29uIiwicmVxdWlyZXNBcnJheSIsInJlcXVpcmVzIiwibW9kaWZpZWRTdHJpbmciLCJob21lRGlyZWN0b3J5IiwiZW52IiwiSE9NRSIsIlVTRVJQUk9GSUxFIiwicmVsYXRpdmVGaWxlUGF0aCIsImZpbGVQYXRoIiwicmVnaXN0cnlSZWdleCIsInJlZ2lzdHJ5VXJsIiwibnBtX2NvbmZpZ19yZWdpc3RyeSIsInVzZXJuYW1lIiwiYWRkaXRpb25hbExpY2Vuc2VJbmZvIiwibGljZW5zZWRGZWF0dXJlIiwic2NyaXB0VHlwZSIsIm5wbV9saWZlY3ljbGVfZXZlbnQiLCJ0cmlnZ2VyZXZlbnQiLCJsaWNlbnNlaW5mbyIsImphclBhdGgiLCJfX2Rpcm5hbWUiLCJmZWF0dXJlc1VzZWQiLCJlbmNyeXB0ZWRMaWNlbnNlIiwiYnRvYSJdLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbnN0cnVjdG9yKGluaXRpYWxPcHRpb25zKSB7XG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICB2YXIgdmFycyA9IHt9XG4gIHZhciBvcHRpb25zID0ge31cbiAgdHJ5IHtcbiAgICBpZiAoaW5pdGlhbE9wdGlvbnMuZnJhbWV3b3JrID09IHVuZGVmaW5lZCkge1xuICAgICAgdmFycy5wbHVnaW5FcnJvcnMgPSBbXVxuICAgICAgdmFycy5wbHVnaW5FcnJvcnMucHVzaCgnd2VicGFjayBjb25maWc6IGZyYW1ld29yayBwYXJhbWV0ZXIgb24gZXh0LXdlYnBhY2stcGx1Z2luIGlzIG5vdCBkZWZpbmVkIC0gdmFsdWVzOiByZWFjdCwgYW5ndWxhciwgZXh0anMsIHdlYi1jb21wb25lbnRzJylcbiAgICAgIHZhciByZXN1bHQgPSB7IHZhcnM6IHZhcnMgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHZhciBmcmFtZXdvcmsgPSBpbml0aWFsT3B0aW9ucy5mcmFtZXdvcmtcbiAgICB2YXIgdHJlZXNoYWtlID0gaW5pdGlhbE9wdGlvbnMudHJlZXNoYWtlXG4gICAgdmFyIHZlcmJvc2UgPSBpbml0aWFsT3B0aW9ucy52ZXJib3NlXG5cbiAgICBjb25zdCB2YWxpZGF0ZU9wdGlvbnMgPSByZXF1aXJlKCdzY2hlbWEtdXRpbHMnKVxuICAgIHZhbGlkYXRlT3B0aW9ucyhfZ2V0VmFsaWRhdGVPcHRpb25zKCksIGluaXRpYWxPcHRpb25zLCAnJylcblxuICAgIGNvbnN0IHJjID0gKGZzLmV4aXN0c1N5bmMoYC5leHQtJHtmcmFtZXdvcmt9cmNgKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhgLmV4dC0ke2ZyYW1ld29ya31yY2AsICd1dGYtOCcpKSB8fCB7fSlcbiAgICBvcHRpb25zID0geyAuLi5fZ2V0RGVmYXVsdE9wdGlvbnMoKSwgLi4uaW5pdGlhbE9wdGlvbnMsIC4uLnJjIH1cblxuICAgIHZhcnMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0RGVmYXVsdFZhcnMoKVxuICAgIHZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gICAgdmFycy5hcHAgPSBfZ2V0QXBwKClcbiAgICB2YXIgcGx1Z2luTmFtZSA9IHZhcnMucGx1Z2luTmFtZVxuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhcnMudGVzdGluZyA9IGZhbHNlXG5cbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfY29uc3RydWN0b3InKVxuICAgIGxvZ3YodmVyYm9zZSwgYHBsdWdpbk5hbWUgLSAke3BsdWdpbk5hbWV9YClcbiAgICBsb2d2KHZlcmJvc2UsIGBhcHAgLSAke2FwcH1gKVxuXG4gICAgaWYgKG9wdGlvbnMuZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nIHx8XG4gICAgICAgIG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLS1wcm9kdWN0aW9uJykgfHxcbiAgICAgICAgb3B0aW9ucy5jbWRvcHRzLmluY2x1ZGVzKCctcHInKSB8fFxuICAgICAgICBvcHRpb25zLmNtZG9wdHMuaW5jbHVkZXMoJy0tZW52aXJvbm1lbnQ9cHJvZHVjdGlvbicpIHx8XG4gICAgICAgIG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLWU9cHJvZHVjdGlvbicpXG4gICAgICApIHtcbiAgICAgIHZhcnMucHJvZHVjdGlvbiA9IHRydWU7XG4gICAgICBvcHRpb25zLmJyb3dzZXIgPSAnbm8nO1xuICAgICAgb3B0aW9ucy53YXRjaCA9ICdubyc7XG4gICAgICBvcHRpb25zLmJ1aWxkRW52aXJvbm1lbnQgPSAncHJvZHVjdGlvbic7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmNtZG9wdHMgJiYgKG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLS10ZXN0aW5nJykgfHxcbiAgICAgICAgICAgICAgIG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLXRlJykgfHxcbiAgICAgICAgICAgICAgIG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLS1lbnZpcm9ubWVudD10ZXN0aW5nJykgfHxcbiAgICAgICAgICAgICAgIG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLWU9dGVzdGluZycpKVxuICAgICkge1xuICAgICAgdmFycy5wcm9kdWN0aW9uID0gZmFsc2U7XG4gICAgICB2YXJzLnRlc3RpbmcgPSB0cnVlO1xuICAgICAgb3B0aW9ucy5icm93c2VyID0gJ25vJztcbiAgICAgIG9wdGlvbnMud2F0Y2ggPSAnbm8nO1xuICAgICAgb3B0aW9ucy5idWlsZEVudmlyb25tZW50ID0gJ3Rlc3RpbmcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLmJ1aWxkRW52aXJvbm1lbnQgPSAnZGV2ZWxvcG1lbnQnO1xuICAgICAgdmFycy5wcm9kdWN0aW9uID0gZmFsc2U7XG4gICAgfVxuXG4gICAgbG9nKGFwcCwgX2dldFZlcnNpb25zKHBsdWdpbk5hbWUsIGZyYW1ld29yaykpXG5cbiAgICAvL21qZyBhZGRlZCBmb3IgYW5ndWxhciBjbGkgYnVpbGRcbiAgICBpZiAoZnJhbWV3b3JrID09ICdhbmd1bGFyJyAmJlxuICAgICAgICBvcHRpb25zLmludGVsbGlzaGFrZSA9PSAnbm8nICYmXG4gICAgICAgIHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlXG4gICAgICAgICYmIHRyZWVzaGFrZSA9PSAneWVzJykge1xuICAgICAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJztcbiAgICAgICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKTtcbiAgICB9XG5cbiAgICBlbHNlIGlmIChmcmFtZXdvcmsgPT0gJ3JlYWN0JyB8fCBmcmFtZXdvcmsgPT0gJ2V4dGpzJyB8fCBmcmFtZXdvcmsgPT0gJ3dlYi1jb21wb25lbnRzJykge1xuICAgICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlKSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICcgKyBmcmFtZXdvcmspXG4gICAgICB9XG4gICAgICBlbHNlIGlmKHZhcnMudGVzdGluZyA9PSB0cnVlKXtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJ1xuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgdGVzdGluZyBidWlsZCBmb3IgJyArIGZyYW1ld29yaylcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBkZXZlbG9wbWVudCBidWlsZCBmb3IgJyArIGZyYW1ld29yaylcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUpIHtcbiAgICAgIGlmICh0cmVlc2hha2UgPT0gJ3llcycpIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAyJ1xuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJyArIGZyYW1ld29yayArICcgLSAnICsgdmFycy5idWlsZHN0ZXApXG4gICAgICAgIHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl90b1Byb2QodmFycywgb3B0aW9ucylcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcyIG9mIDInXG4gICAgICAgIGxvZyhhcHAsICdDb250aW51aW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICcgKyBmcmFtZXdvcmsgKyAnIC0gJyArIHZhcnMuYnVpbGRzdGVwKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgIGxvZyhhcHAsICdTdGFydGluZyBkZXZlbG9wbWVudCBidWlsZCBmb3IgJyArIGZyYW1ld29yaylcbiAgICB9XG4gICAgbG9ndih2ZXJib3NlLCAnQnVpbGRpbmcgZm9yICcgKyBvcHRpb25zLmJ1aWxkRW52aXJvbm1lbnQgKyAnLCAnICsgJ3RyZWVzaGFrZSBpcyAnICsgb3B0aW9ucy50cmVlc2hha2UrICcsICcgKyAnaW50ZWxsaXNoYWtlIGlzICcgKyBvcHRpb25zLmludGVsbGlzaGFrZSlcblxuICAgIHZhciBjb25maWdPYmogPSB7IHZhcnM6IHZhcnMsIG9wdGlvbnM6IG9wdGlvbnMgfTtcbiAgICByZXR1cm4gY29uZmlnT2JqO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgdGhyb3cgJ19jb25zdHJ1Y3RvcjogJyArIGUudG9TdHJpbmcoKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF90aGlzQ29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfdGhpc0NvbXBpbGF0aW9uJylcbiAgICBsb2d2KHZlcmJvc2UsIGBvcHRpb25zLnNjcmlwdDogJHtvcHRpb25zLnNjcmlwdCB9YClcbiAgICBsb2d2KHZlcmJvc2UsIGBidWlsZHN0ZXA6ICR7dmFycy5idWlsZHN0ZXB9YClcblxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PT0gJzEgb2YgMScgfHwgdmFycy5idWlsZHN0ZXAgPT09ICcxIG9mIDInKSB7XG4gICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuc2NyaXB0ICE9IG51bGwgJiYgb3B0aW9ucy5zY3JpcHQgIT0gJycpIHtcbiAgICAgICAgbG9nKGFwcCwgYFN0YXJ0ZWQgcnVubmluZyAke29wdGlvbnMuc2NyaXB0fWApXG4gICAgICAgIHJ1blNjcmlwdChvcHRpb25zLnNjcmlwdCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG4gICAgICAgICAgbG9nKGFwcCwgYEZpbmlzaGVkIHJ1bm5pbmcgJHtvcHRpb25zLnNjcmlwdH1gKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHRocm93ICdfdGhpc0NvbXBpbGF0aW9uOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2NvbXBpbGF0aW9uJylcblxuICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgaWYgKG9wdGlvbnMudHJlZXNoYWtlID09PSAneWVzJyAmJiBvcHRpb25zLmJ1aWxkRW52aXJvbm1lbnQgPT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdO1xuXG4gICAgICAgIC8vbWpnIGZvciAxIHN0ZXAgYnVpbGRcbiAgICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnICYmIGZyYW1ld29yayA9PT0gJ2FuZ3VsYXInICYmIG9wdGlvbnMuaW50ZWxsaXNoYWtlID09ICdubycpIHtcbiAgICAgICAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0QWxsQ29tcG9uZW50cyh2YXJzLCBvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJyB8fCAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScgJiYgZnJhbWV3b3JrID09PSAnd2ViLWNvbXBvbmVudHMnKSkge1xuICAgICAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0QWxsQ29tcG9uZW50cyh2YXJzLCBvcHRpb25zKVxuICAgICAgICB9XG4gICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLnN1Y2NlZWRNb2R1bGUudGFwKGBleHQtc3VjY2VlZC1tb2R1bGVgLCBtb2R1bGUgPT4ge1xuICAgICAgICAgIGlmIChtb2R1bGUucmVzb3VyY2UgJiYgIW1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvbm9kZV9tb2R1bGVzLykpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvXFwuaHRtbCQvKSAhPSBudWxsXG4gICAgICAgICAgICAgICAgJiYgbW9kdWxlLl9zb3VyY2UuX3ZhbHVlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2RvY3R5cGUgaHRtbCcpID09IGZhbHNlXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4ucmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4ucmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLmZpbmlzaE1vZHVsZXMudGFwKGBleHQtZmluaXNoLW1vZHVsZXNgLCBtb2R1bGVzID0+IHtcbiAgICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fd3JpdGVGaWxlc1RvUHJvZEZvbGRlcih2YXJzLCBvcHRpb25zKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09ICcyIG9mIDInKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmluamVjdCA9PT0gJ3llcycpIHtcbiAgICAgICAgICBpZihjb21waWxhdGlvbi5ob29rcy5odG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29tcGlsYXRpb24uaG9va3MuaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbi50YXAoYGV4dC1odG1sLWdlbmVyYXRpb25gLChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAgICAgICAgICAgdmFyIGpzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuanMnKVxuICAgICAgICAgICAgICB2YXIgY3NzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuY3NzJylcbiAgICAgICAgICAgICAgLy92YXIganNQYXRoID0gdmFycy5leHRQYXRoICsgJy8nICsgICdleHQuanMnO1xuICAgICAgICAgICAgICAvL3ZhciBjc3NQYXRoID0gdmFycy5leHRQYXRoICsgJy8nICsgJ2V4dC5jc3MnO1xuICAgICAgICAgICAgICBkYXRhLmFzc2V0cy5qcy51bnNoaWZ0KGpzUGF0aClcbiAgICAgICAgICAgICAgZGF0YS5hc3NldHMuY3NzLnVuc2hpZnQoY3NzUGF0aClcbiAgICAgICAgICAgICAgbG9nKGFwcCwgYEFkZGluZyAke2pzUGF0aH0gYW5kICR7Y3NzUGF0aH0gdG8gaW5kZXguaHRtbGApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgdGhyb3cgJ19jb21waWxhdGlvbjogJyArIGUudG9TdHJpbmcoKVxuLy8gICAgbG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbi8vICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfY29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9hZnRlckNvbXBpbGUoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfYWZ0ZXJDb21waWxlJylcbiAgICBpZiAoZnJhbWV3b3JrID09ICdleHRqcycpIHtcbiAgICAgIHJlcXVpcmUoYC4vZXh0anNVdGlsYCkuX2FmdGVyQ29tcGlsZShjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfYWZ0ZXJDb21waWxlIG5vdCBydW4nKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgdGhyb3cgJ19hZnRlckNvbXBpbGU6ICcgKyBlLnRvU3RyaW5nKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZW1pdChjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGVtaXQgPSBvcHRpb25zLmVtaXRcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICB2YXJzLmNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9lbWl0JylcbiAgICBpZiAoZW1pdCA9PSAneWVzJykge1xuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgICAgIGxldCBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGNvbXBpbGVyLm91dHB1dFBhdGgsdmFycy5leHRQYXRoKVxuICAgICAgICBpZiAoY29tcGlsZXIub3V0cHV0UGF0aCA9PT0gJy8nICYmIGNvbXBpbGVyLm9wdGlvbnMuZGV2U2VydmVyKSB7XG4gICAgICAgICAgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vcHRpb25zLmRldlNlcnZlci5jb250ZW50QmFzZSwgb3V0cHV0UGF0aClcbiAgICAgICAgfVxuICAgICAgICBsb2d2KHZlcmJvc2UsJ291dHB1dFBhdGg6ICcgKyBvdXRwdXRQYXRoKVxuICAgICAgICBsb2d2KHZlcmJvc2UsJ2ZyYW1ld29yazogJyArIGZyYW1ld29yaylcbiAgICAgICAgaWYgKGZyYW1ld29yayAhPSAnZXh0anMnKSB7XG4gICAgICAgICAgX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dFBhdGgsIGNvbXBpbGF0aW9uKVxuICAgICAgICB9XG4gICAgICAgIHZhciBjb21tYW5kID0gJydcbiAgICAgICAgaWYgKG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKVxuICAgICAgICAgIHtjb21tYW5kID0gJ3dhdGNoJ31cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHtjb21tYW5kID0gJ2J1aWxkJ31cbiAgICAgICAgaWYgKHZhcnMucmVidWlsZCA9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHBhcm1zID0gW11cbiAgICAgICAgICBpZighQXJyYXkuaXNBcnJheShvcHRpb25zLmNtZG9wdHMpKXtcbiAgICAgICAgICAgIG9wdGlvbnMuY21kb3B0cyA9IG9wdGlvbnMuY21kb3B0cy5zcGxpdCgnICcpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvcHRpb25zLnByb2ZpbGUgPT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMucHJvZmlsZSA9PSAnJyB8fCBvcHRpb25zLnByb2ZpbGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT0gJ2J1aWxkJylcbiAgICAgICAgICAgICAgeyBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgb3B0aW9ucy5idWlsZEVudmlyb25tZW50XSB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHsgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLmJ1aWxkRW52aXJvbm1lbnRdIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoY29tbWFuZCA9PSAnYnVpbGQnKVxuICAgICAgICAgICAgICB7cGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5idWlsZEVudmlyb25tZW50XX1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAge3Bhcm1zID0gWydhcHAnLCBjb21tYW5kLCAnLS13ZWItc2VydmVyJywgJ2ZhbHNlJywgb3B0aW9ucy5wcm9maWxlLCBvcHRpb25zLmJ1aWxkRW52aXJvbm1lbnRdfVxuICAgICAgICAgIH1cbiAgICAgICAgICBvcHRpb25zLmNtZG9wdHMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KXtcbiAgICAgICAgICAgICAgcGFybXMuc3BsaWNlKHBhcm1zLmluZGV4T2YoY29tbWFuZCkrMSwgMCwgZWxlbWVudCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAvLyBpZiAodmFycy53YXRjaFN0YXJ0ZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAvLyAgIGF3YWl0IF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgdmFycywgb3B0aW9ucylcbiAgICAgICAgICAvLyAgIHZhcnMud2F0Y2hTdGFydGVkID0gdHJ1ZVxuICAgICAgICAgIC8vIH1cbiAgICAgICAgICBpZiAodmFycy53YXRjaFN0YXJ0ZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGF3YWl0IF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgdmFycywgb3B0aW9ucylcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICd3YXRjaCcpIHtcbiAgICAgICAgICAgICAgdmFycy53YXRjaFN0YXJ0ZWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgdmFycy5jYWxsYmFjaygpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vbWpnXG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXJzLmNhbGxiYWNrKClcbiAgICAgICAgICB9XG4gICAgICAgICAgLy9tamdcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YXJzLmNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwnTk9UIHJ1bm5pbmcgZW1pdCcpXG4gICAgICAgIHZhcnMuY2FsbGJhY2soKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxvZ3YodmVyYm9zZSwnZW1pdCBpcyBubycpXG4gICAgICB2YXJzLmNhbGxiYWNrKClcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHZhcnMuY2FsbGJhY2soKVxuICAgIHRocm93ICdfZW1pdDogJyArIGUudG9TdHJpbmcoKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9kb25lKHN0YXRzLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9kb25lJylcbiAgICBpZiAoc3RhdHMuY29tcGlsYXRpb24uZXJyb3JzICYmIHN0YXRzLmNvbXBpbGF0aW9uLmVycm9ycy5sZW5ndGgpIC8vICYmIHByb2Nlc3MuYXJndi5pbmRleE9mKCctLXdhdGNoJykgPT0gLTEpXG4gICAge1xuICAgICAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKTtcbiAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZCgnKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqJykpO1xuICAgICAgY29uc29sZS5sb2coc3RhdHMuY29tcGlsYXRpb24uZXJyb3JzWzBdKTtcbiAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZCgnKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqJykpO1xuICAgICAgLy9wcm9jZXNzLmV4aXQoMCk7XG4gICAgfVxuXG4gICAgLy9tamcgcmVmYWN0b3JcbiAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gJ25vJyAmJiBmcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICByZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLl90b0Rldih2YXJzLCBvcHRpb25zKVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgaWYob3B0aW9ucy5icm93c2VyID09ICd5ZXMnICYmIG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKSB7XG4gICAgICAgIGlmICh2YXJzLmJyb3dzZXJDb3VudCA9PSAwKSB7XG4gICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OicgKyBvcHRpb25zLnBvcnRcbiAgICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBPcGVuaW5nIGJyb3dzZXIgYXQgJHt1cmx9YClcbiAgICAgICAgICB2YXJzLmJyb3dzZXJDb3VudCsrXG4gICAgICAgICAgY29uc3Qgb3BuID0gcmVxdWlyZSgnb3BuJylcbiAgICAgICAgICBvcG4odXJsKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScpIHtcbiAgICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJHtmcmFtZXdvcmt9YClcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHZhcnMudGVzdGluZyA9PSB0cnVlKSB7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyB0ZXN0aW5nIGJ1aWxkIGZvciAke2ZyYW1ld29ya31gKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBkZXZlbG9wbWVudCBidWlsZCBmb3IgJHtmcmFtZXdvcmt9YClcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcyIG9mIDInKSB7XG4gICAgICBpZih2YXJzLnRlc3RpbmcgPT0gdHJ1ZSl7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyB0ZXN0aW5nIGJ1aWxkIGZvciAke2ZyYW1ld29ya31gKVxuICAgICAgfVxuICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICR7ZnJhbWV3b3JrfWApXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbi8vICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gICAgdGhyb3cgJ19kb25lOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dCwgY29tcGlsYXRpb24pIHtcbiAgdHJ5IHtcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBwYWNrYWdlcyA9IG9wdGlvbnMucGFja2FnZXNcbiAgICB2YXIgdG9vbGtpdCA9IG9wdGlvbnMudG9vbGtpdFxuICAgIHZhciB0aGVtZSA9IG9wdGlvbnMudGhlbWVcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9wcmVwYXJlRm9yQnVpbGQnKVxuICAgIGNvbnN0IHJpbXJhZiA9IHJlcXVpcmUoJ3JpbXJhZicpXG4gICAgY29uc3QgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJylcbiAgICBjb25zdCBmc3ggPSByZXF1aXJlKCdmcy1leHRyYScpXG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgIHRoZW1lID0gdGhlbWUgfHwgKHRvb2xraXQgPT09ICdjbGFzc2ljJyA/ICd0aGVtZS10cml0b24nIDogJ3RoZW1lLW1hdGVyaWFsJylcbiAgICBsb2d2KHZlcmJvc2UsJ2ZpcnN0VGltZTogJyArIHZhcnMuZmlyc3RUaW1lKVxuICAgIGlmICh2YXJzLmZpcnN0VGltZSkge1xuICAgICAgcmltcmFmLnN5bmMob3V0cHV0KVxuICAgICAgbWtkaXJwLnN5bmMob3V0cHV0KVxuICAgICAgY29uc3QgYnVpbGRYTUwgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmJ1aWxkWE1MXG4gICAgICBjb25zdCBjcmVhdGVBcHBKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVBcHBKc29uXG4gICAgICBjb25zdCBjcmVhdGVXb3Jrc3BhY2VKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVXb3Jrc3BhY2VKc29uXG4gICAgICBjb25zdCBjcmVhdGVKU0RPTUVudmlyb25tZW50ID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVKU0RPTUVudmlyb25tZW50XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdidWlsZC54bWwnKSwgYnVpbGRYTUwodmFycy5wcm9kdWN0aW9uLCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdhcHAuanNvbicpLCBjcmVhdGVBcHBKc29uKHRoZW1lLCBwYWNrYWdlcywgdG9vbGtpdCwgb3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnanNkb20tZW52aXJvbm1lbnQuanMnKSwgY3JlYXRlSlNET01FbnZpcm9ubWVudChvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICd3b3Jrc3BhY2UuanNvbicpLCBjcmVhdGVXb3Jrc3BhY2VKc29uKG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIHZhciBmcmFtZXdvcmsgPSB2YXJzLmZyYW1ld29yaztcbiAgICAgIC8vYmVjYXVzZSBvZiBhIHByb2JsZW0gd2l0aCBjb2xvcnBpY2tlclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vdXgvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3V4JylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICh1eCkgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vcGFja2FnZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdwYWNrYWdlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vb3ZlcnJpZGVzL2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vb3ZlcnJpZGVzL2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAnb3ZlcnJpZGVzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwncmVzb3VyY2VzLycpKSkge1xuICAgICAgICB2YXIgZnJvbVJlc291cmNlcyA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncmVzb3VyY2VzLycpXG4gICAgICAgIHZhciB0b1Jlc291cmNlcyA9IHBhdGguam9pbihvdXRwdXQsICcuLi9yZXNvdXJjZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVJlc291cmNlcywgdG9SZXNvdXJjZXMpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICcgKyBmcm9tUmVzb3VyY2VzLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUmVzb3VyY2VzLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgIH1cbiAgICB2YXJzLmZpcnN0VGltZSA9IGZhbHNlXG4gICAgdmFyIGpzID0gJydcbiAgICBpZiAodmFycy5wcm9kdWN0aW9uKSB7XG4gICAgICB2YXJzLmRlcHMgPSB2YXJzLmRlcHMuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCl7IHJldHVybiB2YXJzLmRlcHMuaW5kZXhPZih2YWx1ZSkgPT0gaW5kZXggfSk7XG4gICAgICBqcyA9IHZhcnMuZGVwcy5qb2luKCc7XFxuJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAganMgPSBgRXh0LnJlcXVpcmUoW1wiRXh0LipcIixcIkV4dC5kYXRhLlRyZWVTdG9yZVwiXSlgXG4gICAgfVxuICAgIGpzID0gYEV4dC5yZXF1aXJlKFtcIkV4dC4qXCIsXCJFeHQuZGF0YS5UcmVlU3RvcmVcIl0pYDsgLy9mb3Igbm93XG4gICAgaWYgKHZhcnMubWFuaWZlc3QgPT09IG51bGwgfHwganMgIT09IHZhcnMubWFuaWZlc3QpIHtcbiAgICAgIHZhcnMubWFuaWZlc3QgPSBqcyArICc7XFxuRXh0LnJlcXVpcmUoW1wiRXh0LmxheW91dC4qXCJdKTtcXG4nO1xuICAgICAgY29uc3QgbWFuaWZlc3QgPSBwYXRoLmpvaW4ob3V0cHV0LCAnbWFuaWZlc3QuanMnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhtYW5pZmVzdCwgdmFycy5tYW5pZmVzdCwgJ3V0ZjgnKVxuICAgICAgdmFycy5yZWJ1aWxkID0gdHJ1ZVxuICAgICAgdmFyIGJ1bmRsZURpciA9IG91dHB1dC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKVxuICAgICAgaWYgKGJ1bmRsZURpci50cmltKCkgPT0gJycpIHtidW5kbGVEaXIgPSAnLi8nfVxuICAgICAgbG9nKGFwcCwgJ0J1aWxkaW5nIEV4dCBidW5kbGUgYXQ6ICcgKyBidW5kbGVEaXIpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5yZWJ1aWxkID0gZmFsc2VcbiAgICAgIGxvZyhhcHAsICdFeHQgcmVidWlsZCBOT1QgbmVlZGVkJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19wcmVwYXJlRm9yQnVpbGQ6ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgdmFycywgb3B0aW9ucykge1xuICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfYnVpbGRFeHRCdW5kbGUnKVxuICBsZXQgc2VuY2hhOyB0cnkgeyBzZW5jaGEgPSByZXF1aXJlKCdAc2VuY2hhL2NtZCcpIH0gY2F0Y2ggKGUpIHsgc2VuY2hhID0gJ3NlbmNoYScgfVxuICBpZiAoZnMuZXhpc3RzU3luYyhzZW5jaGEpKSB7XG4gICAgbG9ndih2ZXJib3NlLCdzZW5jaGEgZm9sZGVyIGV4aXN0cycpXG4gIH1cbiAgZWxzZSB7XG4gICAgbG9ndih2ZXJib3NlLCdzZW5jaGEgZm9sZGVyIERPRVMgTk9UIGV4aXN0JylcbiAgfVxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IG9uQnVpbGREb25lID0gKCkgPT4ge1xuICAgICAgbG9ndih2ZXJib3NlLCdvbkJ1aWxkRG9uZScpXG4gICAgICByZXNvbHZlKClcbiAgICB9XG4gICAgdmFyIG9wdHMgPSB7IGN3ZDogb3V0cHV0UGF0aCwgc2lsZW50OiB0cnVlLCBzdGRpbzogJ3BpcGUnLCBlbmNvZGluZzogJ3V0Zi04J31cbiAgICBfZXhlY3V0ZUFzeW5jKGFwcCwgc2VuY2hhLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpLnRoZW4gKFxuICAgICAgZnVuY3Rpb24oKSB7IG9uQnVpbGREb25lKCkgfSxcbiAgICAgIGZ1bmN0aW9uKHJlYXNvbikgeyByZWplY3QocmVhc29uKSB9XG4gICAgKVxuICB9KVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZXhlY3V0ZUFzeW5jIChhcHAsIGNvbW1hbmQsIHBhcm1zLCBvcHRzLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgLy9jb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBTZXJ2ZXJcIiwgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gIGNvbnN0IERFRkFVTFRfU1VCU1RSUyA9IFtcIltJTkZdIHhTZXJ2ZXJcIiwgJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gQXBwZW5kJywgJ1tJTkZdIFByb2Nlc3NpbmcnLCAnW0lORl0gUHJvY2Vzc2luZyBCdWlsZCcsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gIHZhciBzdWJzdHJpbmdzID0gREVGQVVMVF9TVUJTVFJTXG4gIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbiAgY29uc3QgY3Jvc3NTcGF3biA9IHJlcXVpcmUoJ2Nyb3NzLXNwYXduLXdpdGgta2lsbCcpXG4gIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9leGVjdXRlQXN5bmMnKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbG9ndih2ZXJib3NlLGBjb21tYW5kIC0gJHtjb21tYW5kfWApXG4gICAgbG9ndih2ZXJib3NlLCBgcGFybXMgLSAke3Bhcm1zfWApXG4gICAgbG9ndih2ZXJib3NlLCBgb3B0cyAtICR7SlNPTi5zdHJpbmdpZnkob3B0cyl9YClcbiAgICB2YXJzLmNoaWxkID0gY3Jvc3NTcGF3bihjb21tYW5kLCBwYXJtcywgb3B0cylcblxuICAgIHZhcnMuY2hpbGQub24oJ2Nsb3NlJywgKGNvZGUsIHNpZ25hbCkgPT4ge1xuICAgICAgbG9ndih2ZXJib3NlLCBgb24gY2xvc2U6IGAgKyBjb2RlKVxuICAgICAgaWYoY29kZSA9PT0gMCkgeyByZXNvbHZlKDApIH1cbiAgICAgIGVsc2UgeyBjb21waWxhdGlvbi5lcnJvcnMucHVzaCggbmV3IEVycm9yKGNvZGUpICk7IHJlc29sdmUoMCkgfVxuICAgIH0pXG4gICAgdmFycy5jaGlsZC5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAgIGxvZ3YodmVyYm9zZSwgYG9uIGVycm9yYClcbiAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGVycm9yKVxuICAgICAgcmVzb2x2ZSgwKVxuICAgIH0pXG4gICAgdmFycy5jaGlsZC5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXG4gICAgICBsb2d2KHZlcmJvc2UsIGAke3N0cn1gKVxuICAgICAgLy9pZiAoZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkubWF0Y2goL0Zhc2hpb24gd2FpdGluZyBmb3IgY2hhbmdlc1xcLlxcLlxcLi8pKSB7XG4gICAgICBpZiAoZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkubWF0Y2goL2FpdGluZyBmb3IgY2hhbmdlc1xcLlxcLlxcLi8pKSB7XG5cbi8vICAgICAgICAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4vLyAgICAgICAgICAgdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSArIHZhcnMudG91Y2hGaWxlO1xuLy8gICAgICAgICAgIHRyeSB7XG4vLyAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKVxuLy8gICAgICAgICAgICAgdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuLy8gICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgJy8vJyArIGQsICd1dGY4Jyk7XG4vLyAgICAgICAgICAgICBsb2d2KGFwcCwgYHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICAgIGNhdGNoKGUpIHtcbi8vICAgICAgICAgICAgIGxvZ3YoYXBwLCBgTk9UIHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4vLyAgICAgICAgICAgfVxuXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0lORl1cIiwgXCJcIilcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbTE9HXVwiLCBcIlwiKVxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykudHJpbSgpXG4gICAgICAgIGlmIChzdHIuaW5jbHVkZXMoXCJbRVJSXVwiKSkge1xuICAgICAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGFwcCArIHN0ci5yZXBsYWNlKC9eXFxbRVJSXFxdIC9naSwgJycpKTtcbiAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltFUlJdXCIsIGAke2NoYWxrLnJlZChcIltFUlJdXCIpfWApXG4gICAgICAgIH1cbiAgICAgICAgbG9nKGFwcCwgc3RyKVxuXG4gICAgICAgIHZhcnMuY2FsbGJhY2soKVxuICAgICAgICByZXNvbHZlKDApXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKHN1YnN0cmluZ3Muc29tZShmdW5jdGlvbih2KSB7IHJldHVybiBkYXRhLmluZGV4T2YodikgPj0gMDsgfSkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltJTkZdXCIsIFwiXCIpXG4gICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbTE9HXVwiLCBcIlwiKVxuICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKS50cmltKClcbiAgICAgICAgICBpZiAoc3RyLmluY2x1ZGVzKFwiW0VSUl1cIikpIHtcbiAgICAgICAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGFwcCArIHN0ci5yZXBsYWNlKC9eXFxbRVJSXFxdIC9naSwgJycpKTtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0VSUl1cIiwgYCR7Y2hhbGsucmVkKFwiW0VSUl1cIil9YClcbiAgICAgICAgICB9XG4gICAgICAgICAgbG9nKGFwcCwgc3RyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICB2YXJzLmNoaWxkLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICBsb2d2KG9wdGlvbnMsIGBlcnJvciBvbiBjbG9zZTogYCArIGRhdGEpXG4gICAgICB2YXIgc3RyID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UoL1xccj9cXG58XFxyL2csIFwiIFwiKS50cmltKClcbiAgICAgIHZhciBzdHJKYXZhT3B0cyA9IFwiUGlja2VkIHVwIF9KQVZBX09QVElPTlNcIjtcbiAgICAgIHZhciBpbmNsdWRlcyA9IHN0ci5pbmNsdWRlcyhzdHJKYXZhT3B0cylcbiAgICAgIGlmICghaW5jbHVkZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coYCR7YXBwfSAke2NoYWxrLnJlZChcIltFUlJdXCIpfSAke3N0cn1gKVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG59XG5cbi8vKioqKioqKioqKlxuZnVuY3Rpb24gcnVuU2NyaXB0KHNjcmlwdFBhdGgsIGNhbGxiYWNrKSB7XG4gIHZhciBjaGlsZFByb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG4gIC8vIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBjYWxsYmFjayBoYXMgYmVlbiBpbnZva2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgaW52b2NhdGlvbnNcbiAgdmFyIGludm9rZWQgPSBmYWxzZTtcbiAgdmFyIHByb2Nlc3MgPSBjaGlsZFByb2Nlc3MuZm9yayhzY3JpcHRQYXRoLCBbXSwgeyBleGVjQXJndiA6IFsnLS1pbnNwZWN0PTAnXSB9KTtcbiAgLy8gbGlzdGVuIGZvciBlcnJvcnMgYXMgdGhleSBtYXkgcHJldmVudCB0aGUgZXhpdCBldmVudCBmcm9tIGZpcmluZ1xuICBwcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xuICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjayBvbmNlIHRoZSBwcm9jZXNzIGhhcyBmaW5pc2hlZCBydW5uaW5nXG4gIHByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZSkge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgdmFyIGVyciA9IGNvZGUgPT09IDAgPyBudWxsIDogbmV3IEVycm9yKCdleGl0IGNvZGUgJyArIGNvZGUpO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfdG9YdHlwZShzdHIpIHtcbiAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL18vZywgJy0nKVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0QXBwKCkge1xuICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gIHZhciBwcmVmaXggPSBgYFxuICBjb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKVxuICBpZiAocGxhdGZvcm0gPT0gJ2RhcndpbicpIHsgcHJlZml4ID0gYOKEuSDvvaJleHTvvaM6YCB9XG4gIGVsc2UgeyBwcmVmaXggPSBgaSBbZXh0XTpgIH1cbiAgcmV0dXJuIGAke2NoYWxrLmdyZWVuKHByZWZpeCl9IGBcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2dldFZlcnNpb25zKHBsdWdpbk5hbWUsIGZyYW1ld29ya05hbWUpIHtcbnRyeSB7XG4gIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gIHZhciB2ID0ge31cbiAgdmFyIGZyYW1ld29ya0luZm8gPSAnbi9hJ1xuXG4gIHYucGx1Z2luVmVyc2lvbiA9ICduL2EnO1xuICB2LmV4dFZlcnNpb24gPSAnbi9hJztcbiAgdi5lZGl0aW9uID0gJ24vYSc7XG4gIHYuY21kVmVyc2lvbiA9ICduL2EnO1xuICB2LndlYnBhY2tWZXJzaW9uID0gJ24vYSc7XG5cbiAgdmFyIHBsdWdpblBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEnLCBwbHVnaW5OYW1lKVxuICB2YXIgcGx1Z2luUGtnID0gKGZzLmV4aXN0c1N5bmMocGx1Z2luUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LnBsdWdpblZlcnNpb24gPSBwbHVnaW5Qa2cudmVyc2lvblxuICB2Ll9yZXNvbHZlZCA9IHBsdWdpblBrZy5fcmVzb2x2ZWRcbiAgaWYgKHYuX3Jlc29sdmVkID09IHVuZGVmaW5lZCkge1xuICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICB9XG4gIGVsc2Uge1xuICAgIGlmICgtMSA9PSB2Ll9yZXNvbHZlZC5pbmRleE9mKCdjb21tdW5pdHknKSkge1xuICAgICAgdi5lZGl0aW9uID0gYENvbW1lcmNpYWxgXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdi5lZGl0aW9uID0gYENvbW11bml0eWBcbiAgICB9XG4gIH1cbiAgdmFyIHdlYnBhY2tQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy93ZWJwYWNrJylcbiAgdmFyIHdlYnBhY2tQa2cgPSAoZnMuZXhpc3RzU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHdlYnBhY2tQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi53ZWJwYWNrVmVyc2lvbiA9IHdlYnBhY2tQa2cudmVyc2lvblxuICB2YXIgZXh0UGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQHNlbmNoYS9leHQnKVxuICB2YXIgZXh0UGtnID0gKGZzLmV4aXN0c1N5bmMoZXh0UGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LmV4dFZlcnNpb24gPSBleHRQa2cuc2VuY2hhLnZlcnNpb25cbiAgdmFyIGNtZFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSxgbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5jbWRWZXJzaW9uID0gY21kUGtnLnZlcnNpb25fZnVsbFxuICBpZiAodi5jbWRWZXJzaW9uID09IHVuZGVmaW5lZCkge1xuICAgIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhLyR7cGx1Z2luTmFtZX0vbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgICB2YXIgY21kUGtnID0gKGZzLmV4aXN0c1N5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICAgIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgfVxuXG4gICBpZiAoZnJhbWV3b3JrTmFtZSAhPSB1bmRlZmluZWQgJiYgZnJhbWV3b3JrTmFtZSAhPSAnZXh0anMnKSB7XG4gICAgdmFyIGZyYW1ld29ya1BhdGggPSAnJ1xuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdyZWFjdCcpIHtcbiAgICAgIGZyYW1ld29ya1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL3JlYWN0JylcbiAgICB9XG4gICAgaWYgKGZyYW1ld29ya05hbWUgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9AYW5ndWxhci9jb3JlJylcbiAgICB9XG4gICAgdmFyIGZyYW1ld29ya1BrZyA9IChmcy5leGlzdHNTeW5jKGZyYW1ld29ya1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmZyYW1ld29ya1ZlcnNpb24gPSBmcmFtZXdvcmtQa2cudmVyc2lvblxuICAgIGlmICh2LmZyYW1ld29ya1ZlcnNpb24gPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmcmFtZXdvcmtJbmZvID0gJywgJyArIGZyYW1ld29ya05hbWVcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBmcmFtZXdvcmtJbmZvID0gJywgJyArIGZyYW1ld29ya05hbWUgKyAnIHYnICsgdi5mcmFtZXdvcmtWZXJzaW9uXG4gICAgfVxuICB9XG4gIHJldHVybiAnZXh0LXdlYnBhY2stcGx1Z2luIHYnICsgdi5wbHVnaW5WZXJzaW9uICsgJywgRXh0IEpTIHYnICsgdi5leHRWZXJzaW9uICsgJyAnICsgdi5lZGl0aW9uICsgJyBFZGl0aW9uLCBTZW5jaGEgQ21kIHYnICsgdi5jbWRWZXJzaW9uICsgJywgd2VicGFjayB2JyArIHYud2VicGFja1ZlcnNpb24gKyBmcmFtZXdvcmtJbmZvXG5cbn1cbmNhdGNoIChlKSB7XG4gIHJldHVybiAnZXh0LXdlYnBhY2stcGx1Z2luIHYnICsgdi5wbHVnaW5WZXJzaW9uICsgJywgRXh0IEpTIHYnICsgdi5leHRWZXJzaW9uICsgJyAnICsgdi5lZGl0aW9uICsgJyBFZGl0aW9uLCBTZW5jaGEgQ21kIHYnICsgdi5jbWRWZXJzaW9uICsgJywgd2VicGFjayB2JyArIHYud2VicGFja1ZlcnNpb24gKyBmcmFtZXdvcmtJbmZvXG59XG5cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9nKGFwcCxtZXNzYWdlKSB7XG4gIHZhciBzID0gYXBwICsgbWVzc2FnZVxuICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICB0cnkge3Byb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpfWNhdGNoKGUpIHt9XG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpO3Byb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBsb2doKGFwcCxtZXNzYWdlKSB7XG4gIHZhciBoID0gZmFsc2VcbiAgdmFyIHMgPSBhcHAgKyBtZXNzYWdlXG4gIGlmIChoID09IHRydWUpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9ndih2ZXJib3NlLCBzKSB7XG4gIGlmICh2ZXJib3NlID09ICd5ZXMnKSB7XG4gICAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgICB0cnkge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKClcbiAgICB9XG4gICAgY2F0Y2goZSkge31cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShgLXZlcmJvc2U6ICR7c31gKVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxuICB9XG59XG5cbmZ1bmN0aW9uIF9nZXRWYWxpZGF0ZU9wdGlvbnMoKSB7XG4gIHJldHVybiB7XG4gICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgIFwiZnJhbWV3b3JrXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwidG9vbGtpdFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInRoZW1lXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiZW1pdFwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwic2NyaXB0XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwicG9ydFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJpbnRlZ2VyXCJdXG4gICAgICB9LFxuICAgICAgXCJwYWNrYWdlc1wiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIiwgXCJhcnJheVwiXVxuICAgICAgfSxcbiAgICAgIFwicHJvZmlsZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImVudmlyb25tZW50XCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ2RldmVsb3BtZW50JyBvciAncHJvZHVjdGlvbicgc3RyaW5nIHZhbHVlXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInRyZWVzaGFrZVwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiYnJvd3NlclwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwid2F0Y2hcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInZlcmJvc2VcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImluamVjdFwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiaW50ZWxsaXNoYWtlXCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ3llcycgb3IgJ25vJyBzdHJpbmcgdmFsdWUgKE5PVCB0cnVlIG9yIGZhbHNlKVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJjbWRvcHRzXCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgYSBzZW5jaGEgY21kIG9wdGlvbiBvciBhcmd1bWVudCBzdHJpbmdcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiLCBcImFycmF5XCJdXG4gICAgICB9XG4gICAgfSxcbiAgICBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCI6IGZhbHNlXG4gIH07XG59XG5cblxuZnVuY3Rpb24gX2dldERlZmF1bHRPcHRpb25zKCkge1xuICByZXR1cm4ge1xuICAgIGZyYW1ld29yazogJ2V4dGpzJyxcbiAgICB0b29sa2l0OiAnbW9kZXJuJyxcbiAgICB0aGVtZTogJ3RoZW1lLW1hdGVyaWFsJyxcbiAgICBlbWl0OiAneWVzJyxcbiAgICBzY3JpcHQ6IG51bGwsXG4gICAgcG9ydDogMTk2MixcbiAgICBwYWNrYWdlczogW10sXG5cbiAgICBwcm9maWxlOiAnJyxcbiAgICBlbnZpcm9ubWVudDogJ2RldmVsb3BtZW50JyxcbiAgICB0cmVlc2hha2U6ICdubycsXG4gICAgYnJvd3NlcjogJ3llcycsXG4gICAgd2F0Y2g6ICd5ZXMnLFxuICAgIHZlcmJvc2U6ICdubycsXG4gICAgaW5qZWN0OiAneWVzJyxcbiAgICBpbnRlbGxpc2hha2U6ICd5ZXMnLFxuICAgIGNtZG9wdHM6ICcnXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNtYXJ0Rmxvd1BpbmcocGFja2FnZUpzb25QYXRoLCBhcHBKc29uUGF0aCkge1xuICBjb25zdCB7IGV4ZWMgfSA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcbiAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuXG4gIGZzLnJlYWRGaWxlKHBhY2thZ2VKc29uUGF0aCwgJ3V0ZjgnLCAoZXJyUGFja2FnZSwgZGF0YVBhY2thZ2UpID0+IHtcbiAgICBpZiAoZXJyUGFja2FnZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZShkYXRhUGFja2FnZSk7XG5cbiAgICBmcy5yZWFkRmlsZShhcHBKc29uUGF0aCwgJ3V0ZjgnLCAoZXJyQXBwLCBkYXRhQXBwKSA9PiB7XG4gICAgICBpZiAoZXJyQXBwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYXBwSnNvbiA9IEpTT04ucGFyc2UoZGF0YUFwcCk7XG4gICAgICBjb25zdCByZXF1aXJlc0FycmF5ID0gYXBwSnNvbi5yZXF1aXJlczsvLyBBc3N1bWluZyBhcHBKc29uLnJlcXVpcmVzIGlzIGFuIGFycmF5XG5cbiAgICAgIC8vIENvbnZlcnQgdGhlIGFycmF5IHRvIGEgc3RyaW5nXG4gICAgICBjb25zdCBtb2RpZmllZFN0cmluZyA9IHJlcXVpcmVzQXJyYXlbMF0ucmVwbGFjZSgvW1xcW1xcXSddKy9nLCAnJyk7XG5cbiAgICAgIGNvbnN0IGhvbWVEaXJlY3RvcnkgPSBwcm9jZXNzLmVudi5IT01FIHx8IHByb2Nlc3MuZW52LlVTRVJQUk9GSUxFO1xuXG4gICAgICAvLyBTcGVjaWZ5IHRoZSByZWxhdGl2ZSBwYXRoIGZyb20gdGhlIGhvbWUgZGlyZWN0b3J5IHRvIHlvdXIgZmlsZVxuICAgICAgY29uc3QgcmVsYXRpdmVGaWxlUGF0aCA9ICcubnBtcmMnO1xuXG4gICAgICAvLyBDb21iaW5lIHRoZSBob21lIGRpcmVjdG9yeSBhbmQgcmVsYXRpdmUgZmlsZSBwYXRoIHRvIGdldCB0aGUgZ2VuZXJhbGl6ZWQgZmlsZSBwYXRoXG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihob21lRGlyZWN0b3J5LCByZWxhdGl2ZUZpbGVQYXRoKTtcblxuICAgICAgZnMucmVhZEZpbGUoZmlsZVBhdGgsICd1dGY4JywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgcmVhZGluZyBmaWxlOiAke2Vyci5tZXNzYWdlfWApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWdpc3RyeVJlZ2V4ID0gL0BzZW5jaGE6cmVnaXN0cnk9KC4rKS87XG5cbiAgICAgICAgLy8gRXh0cmFjdCB0aGUgcmVnaXN0cnkgVVJMIHVzaW5nIHRoZSByZWd1bGFyIGV4cHJlc3Npb25cbiAgICAgICAgY29uc3QgbWF0Y2ggPSBkYXRhLm1hdGNoKHJlZ2lzdHJ5UmVnZXgpO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIGEgbWF0Y2ggaXMgZm91bmRcbiAgICAgICAgaWYgKG1hdGNoICYmIG1hdGNoWzFdKSB7XG4gICAgICAgICAgY29uc3QgcmVnaXN0cnlVcmwgPSBtYXRjaFsxXTtcbiAgICAgICAgICAvLyBVc2UgbnBtLWNvbmZpZyB0byBzZXQgdGhlIHJlZ2lzdHJ5IHRlbXBvcmFyaWx5IGZvciB0aGUgY3VycmVudCBwcm9jZXNzXG4gICAgICAgICAgcHJvY2Vzcy5lbnYubnBtX2NvbmZpZ19yZWdpc3RyeSA9IHJlZ2lzdHJ5VXJsO1xuXG4gICAgICAgICAgLy8gUnVuIHRoZSBucG0gd2hvYW1pIGNvbW1hbmRcbiAgICAgICAgICBleGVjKGBucG0gLS1yZWdpc3RyeSAke3JlZ2lzdHJ5VXJsfSB3aG9hbWlgLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB1c2VybmFtZSA9IGAke3N0ZG91dC50cmltKCkucmVwbGFjZSgnLi4nLCAnQCcpfWA7XG5cbiAgICAgICAgICAgIGxldCBhZGRpdGlvbmFsTGljZW5zZUluZm8gPSAnJztcbiAgICAgICAgICAgICAgbGV0IGxpY2Vuc2VkRmVhdHVyZSA9ICcnO1xuICAgICAgICAgICAgICBpZih1c2VybmFtZSE9bnVsbCl7XG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbExpY2Vuc2VJbmZvID0gJ1RoaXMgdmVyc2lvbiBvZiBTZW5jaGEgRXh0LWdlbiBpcyBsaWNlbnNlZCBjb21tZXJjaWFsbHknXG4gICAgICAgICAgICAgICAgbGljZW5zZWRGZWF0dXJlID0gJ0xFR0FMJ1xuICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsTGljZW5zZUluZm8gPSAnVGhpcyB2ZXJzaW9uIG9mIFNlbmNoYSBFeHQtZ2VuIGlzIG5vdCBsaWNlbnNlZCBjb21tZXJjaWFsbHknXG4gICAgICAgICAgICAgICAgbGljZW5zZWRGZWF0dXJlICA9ICdVTkxJQ0VOU0VEJ1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNjcmlwdFR5cGUgPSBwcm9jZXNzLmVudi5ucG1fbGlmZWN5Y2xlX2V2ZW50O1xuICAgICAgICAgICAgICAgICAgICAgIGxldCB0cmlnZ2VyZXZlbnQgPSAnYnVpbGQnO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHNjcmlwdFR5cGUgPT09ICdkZXYnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyZXZlbnQgPSBgbnBtIHN0YXJ0YDtcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjcmlwdFR5cGUgPT09ICdidWlsZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJldmVudCA9IGBucG0gcnVuIGJ1aWxkYDtcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcmV2ZW50ID0gYG51bGxgO1xuICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbGljZW5zZWluZm8gPSBgXCJsaWNlbnNlPUNvbW1lcmNpYWwsIGZyYW1ld29yaz1FWFRKUywgTGljZW5zZSBDb250ZW50IFRleHQ9U2VuY2hhIFJhcGlkRXh0SlMtSmF2YVNjcmlwdCBMaWJyYXJ5IENvcHlyaWdodCwgU2VuY2hhIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gbGljZW5zaW5nQHNlbmNoYS5jb20gb3B0aW9uczpodHRwOi8vd3d3LnNlbmNoYS5jb20vbGljZW5zZSBsaWNlbnNlOiBodHRwOi8vd3d3LnNlbmNoYS5jb20vbGVnYWwvc2VuY2hhLXNvZnR3YXJlLWxpY2Vuc2UtYWdyZWVtZW50IENvbW1lcmNpYWwgTGljZW5zZS4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNlbmNoYSBSYXBpZEV4dEpTIGlzIGxpY2Vuc2VkIGNvbW1lcmNpYWxseS4gU2VlIGh0dHA6Ly93d3cuc2VuY2hhLmNvbS9sZWdhbC9zZW5jaGEtc29mdHdhcmUtbGljZW5zZS1hZ3JlZW1lbnQgZm9yIGxpY2Vuc2UgdGVybXMuQmV0YSBMaWNlbnNlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIElmIHRoaXMgaXMgYSBCZXRhIHZlcnNpb24gLCB1c2UgaXMgcGVybWl0dGVkIGZvciBpbnRlcm5hbCBldmFsdWF0aW9uIGFuZCByZXZpZXcgcHVycG9zZXMgYW5kIG5vdCB1c2UgZm9yIHByb2R1Y3Rpb24gcHVycG9zZXMuIFNlZSBodHRwOi8vd3d3LnNlbmNoYS5jb20vbGVnYWwvc2VuY2hhLXNvZnR3YXJlLWxpY2Vuc2UtYWdyZWVtZW50IChCZXRhIExpY2Vuc2UpIGZvciBsaWNlbnNlIHRlcm1zLiAgVGhpcmQgUGFydHkgQ29udGVudC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVRoZSBmb2xsb3dpbmcgdGhpcmQgcGFydHkgc29mdHdhcmUgaXMgZGlzdHJpYnV0ZWQgd2l0aCBSYXBpZEV4dEpTIGFuZCBpcyBwcm92aWRlZCB1bmRlciBvdGhlciBsaWNlbnNlcyBhbmQvb3IgaGFzIHNvdXJjZSBhdmFpbGFibGUgZnJvbSBvdGhlciBsb2NhdGlvbnMuIExpYnJhcnk6IFlVSSAwLjYgKEJTRCBMaWNlbnNlZCkgZm9yIGRyYWctYW5kLWRyb3AgY29kZS4gTG9jYXRpb246IGh0dHA6Ly9kZXZlbG9wZXIueWFob28uY29tL3l1aSBMaWNlbnNlOiBodHRwOi8vZGV2ZWxvcGVyLnlhaG9vLmNvbS95dWkvbGljZW5zZS5odG1sIChCU0QgMy1DbGF1c2UgTGljZW5zZSkgTGlicmFyeTogSlNPTiBwYXJzZXIgTG9jYXRpb246IGh0dHA6Ly93d3cuSlNPTi5vcmcvanMuaHRtbCBMaWNlbnNlOiBodHRwOi8vd3d3Lmpzb24ub3JnL2xpY2Vuc2UuaHRtbCAoTUlUIExpY2Vuc2UpIExpYnJhcnk6IGZsZXhpYmxlLWpzLWZvcm1hdHRpbmcgTG9jYXRpb246IGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9mbGV4aWJsZS1qcy1mb3JtYXR0aW5nLyBMaWNlbnNlOiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocCAoTUlUIExpY2Vuc2UpIExpYnJhcnk6IHNwYXJrbGluZS5qcyBMb2NhdGlvbjogaHR0cDovL29tbmlwb3RlbnQubmV0L2pxdWVyeS5zcGFya2xpbmUgTGljZW5zZSAgaHR0cDovL29tbmlwb3RlbnQubmV0L2pxdWVyeS5zcGFya2xpbmUgKEJTRCAzLUNsYXVzZSBMaWNlbnNlKSBMaWJyYXJ5OiBEZWZ0SlMgTG9jYXRpb246IGh0dHA6Ly9kZWZ0anMub3JnLyBMaWNlbnNlOiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocCAoTUlUIExpY2Vuc2UpIExpYnJhcnk6IE9wZW4tU2FucyBMb2NhdGlvbjogaHR0cDovL3d3dy5mb250c3F1aXJyZWwuY29tL2ZvbnRzL29wZW4tc2FucyBMaWNlbnNlOiAgaHR0cDovL3d3dy5mb250c3F1aXJyZWwuY29tL2ZvbnRzL29wZW4tc2FucyAoQXBhY2hlIDIuMCBMaWNlbnNlKSBFeGFtcGxlczogTGlicmFyeTogU2lsayBJY29ucyBMb2NhdGlvbjogaHR0cDovL3d3dy5mYW1mYW1mYW0uY29tL2xhYi9pY29ucy9zaWxrLyBMaWNlbnNlOiBodHRwOi8vd3d3LmZhbWZhbWZhbS5jb20vbGFiL2ljb25zL3NpbGsvIChDcmVhdGl2ZSBDb21tb25zIEF0dHJpYnV0aW9uIDIuNSBMaWNlbnNlKSBMaWJyYXJ5OiBGb250IEF3ZXNvbWUgQ1NTIExvY2F0aW9uOiBodHRwOi8vZm9udGF3ZXNvbWUuaW8vIExpY2Vuc2U6IGh0dHA6Ly9mb250YXdlc29tZS5pby8zLjIuMS9saWNlbnNlLyAoTUlUKSBMaWJyYXJ5OiBNYXRlcmlhbCBEZXNpZ24gSWNvbnMgTG9jYXRpb246IGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvbWF0ZXJpYWwtZGVzaWduLWljb25zIExpY2Vuc2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvbWF0ZXJpYWwtZGVzaWduLWljb25zL2Jsb2IvbWFzdGVyL0xJQ0VOU0UgKEFwYWNoZSkgVEhJUyBTT0ZUV0FSRSBJUyBESVNUUklCVVRFRCAnQVMtSVMnIFdJVEhPVVQgQU5ZIFdBUlJBTlRJRVMsIENPTkRJVElPTlMgQU5EIFJFUFJFU0VOVEFUSU9OUyBXSEVUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBUSEUgSU1QTElFRCBXQVJSQU5USUVTIEFORCBDT05ESVRJT05TIE9GIE1FUkNIQU5UQUJJTElUWSwgTUVSQ0hBTlRBQkxFIFFVQUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLCBEVVJBQklMSVRZLCBOT04tSU5GUklOR0VNRU5ULCBQRVJGT1JNQU5DRSBBTkQgVEhPU0UgQVJJU0lORyBCWSBTVEFUVVRFIE9SIEZST00gQ1VTVE9NIE9SIFVTQUdFIE9GIFRSQURFIE9SIENPVVJTRSBPRiBERUFMSU5HLiAsIG1lc3NhZ2U9VGhpcyB2ZXJzaW9uIG9mIFNlbmNoYSBSYXBpZEV4dEpTIGlzIGxpY2Vuc2VkIGNvbW1lcmNpYWxseSBcImA7XG4gICAgICAgICAgICBjb25zdCBqYXJQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ3Jlc291cmNlcycsICd1dGlscy5qYXInKTtcbiAgICAgICAgICAgIGNvbnN0IGZlYXR1cmVzVXNlZCA9IGBleHQtZ2VuLCAke21vZGlmaWVkU3RyaW5nfWA7XG5cbiAgICAgICAgICAgIGNvbnN0IGVuY3J5cHRlZExpY2Vuc2UgPSBidG9hKGxpY2Vuc2VpbmZvKTtcblxuICAgICAgICAgICAgICBjb25zdCBjb21tYW5kID0gYGphdmEgLWphciAke2phclBhdGh9IGAgK1xuICAgICAgICAgICAgICAgICBgLXByb2R1Y3QgZXh0LWdlbiAtcHJvZHVjdFZlcnNpb24gJHtwYWNrYWdlSnNvbi52ZXJzaW9ufSBgICtcbiAgICAgICAgICAgICAgICAgYC1ldmVudFR5cGUgTEVHQUwgLXRyaWdnZXIgJHt0cmlnZ2VyZXZlbnR9IGAgK1xuICAgICAgICAgICAgICAgICBgLWxpY2Vuc2VkVG8gJHt1c2VybmFtZX0gYCArXG4gICAgICAgICAgICAgICAgIGAtY3VzdG9tMiBpc1ZhbGlkPXRydWUgLWN1c3RvbTMgaXNUcmlhbD1mYWxzZSAtY3VzdG9tNCBpc0V4cGlyZWQ9ZmFsc2UgLW1vZGUgcmFwaWQgYCArXG4gICAgICAgICAgICAgICAgIGAtdmFsaWRMaWNlbnNlSW5mbyAke2VuY3J5cHRlZExpY2Vuc2V9IC1mZWF0dXJlc1VzZWQgJHtmZWF0dXJlc1VzZWR9IC1saWNlbnNlZEZlYXR1cmUgJHtsaWNlbnNlZEZlYXR1cmV9IC1waXJhY3lMaWNlbnNlSW5mbyAke2FkZGl0aW9uYWxMaWNlbnNlSW5mb31gO1xuXG4gICAgICAgICAgICBleGVjKGNvbW1hbmQsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChzdGRlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OytDQUNBLHFKQUFBQSxtQkFBQSxZQUFBQSxDQUFBLFdBQUFDLENBQUEsU0FBQUMsQ0FBQSxFQUFBRCxDQUFBLE9BQUFFLENBQUEsR0FBQUMsTUFBQSxDQUFBQyxTQUFBLEVBQUFDLENBQUEsR0FBQUgsQ0FBQSxDQUFBSSxjQUFBLEVBQUFDLENBQUEsR0FBQUosTUFBQSxDQUFBSyxjQUFBLGNBQUFQLENBQUEsRUFBQUQsQ0FBQSxFQUFBRSxDQUFBLElBQUFELENBQUEsQ0FBQUQsQ0FBQSxJQUFBRSxDQUFBLENBQUFPLEtBQUEsS0FBQUMsQ0FBQSx3QkFBQUMsTUFBQSxHQUFBQSxNQUFBLE9BQUFDLENBQUEsR0FBQUYsQ0FBQSxDQUFBRyxRQUFBLGtCQUFBQyxDQUFBLEdBQUFKLENBQUEsQ0FBQUssYUFBQSx1QkFBQUMsQ0FBQSxHQUFBTixDQUFBLENBQUFPLFdBQUEsOEJBQUFDLE9BQUFqQixDQUFBLEVBQUFELENBQUEsRUFBQUUsQ0FBQSxXQUFBQyxNQUFBLENBQUFLLGNBQUEsQ0FBQVAsQ0FBQSxFQUFBRCxDQUFBLElBQUFTLEtBQUEsRUFBQVAsQ0FBQSxFQUFBaUIsVUFBQSxNQUFBQyxZQUFBLE1BQUFDLFFBQUEsU0FBQXBCLENBQUEsQ0FBQUQsQ0FBQSxXQUFBa0IsTUFBQSxtQkFBQWpCLENBQUEsSUFBQWlCLE1BQUEsWUFBQUEsQ0FBQWpCLENB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