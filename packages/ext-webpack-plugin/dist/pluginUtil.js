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
            if (scriptType === 'dev' || scriptType === 'dev:desktop') {
              triggerevent = `npm start`;
            } else if (scriptType === 'build' || scriptType === 'build:desktop') {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVnZW5lcmF0b3JSdW50aW1lIiwiZSIsInQiLCJyIiwiT2JqZWN0IiwicHJvdG90eXBlIiwibiIsImhhc093blByb3BlcnR5IiwibyIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJpIiwiU3ltYm9sIiwiYSIsIml0ZXJhdG9yIiwiYyIsImFzeW5jSXRlcmF0b3IiLCJ1IiwidG9TdHJpbmdUYWciLCJkZWZpbmUiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJ3cmFwIiwiR2VuZXJhdG9yIiwiY3JlYXRlIiwiQ29udGV4dCIsIm1ha2VJbnZva2VNZXRob2QiLCJ0cnlDYXRjaCIsInR5cGUiLCJhcmciLCJjYWxsIiwiaCIsImwiLCJmIiwicyIsInkiLCJHZW5lcmF0b3JGdW5jdGlvbiIsIkdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlIiwicCIsImQiLCJnZXRQcm90b3R5cGVPZiIsInYiLCJ2YWx1ZXMiLCJnIiwiZGVmaW5lSXRlcmF0b3JNZXRob2RzIiwiZm9yRWFjaCIsIl9pbnZva2UiLCJBc3luY0l0ZXJhdG9yIiwiaW52b2tlIiwicmVzb2x2ZSIsIl9fYXdhaXQiLCJ0aGVuIiwiY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmciLCJFcnJvciIsImRvbmUiLCJtZXRob2QiLCJkZWxlZ2F0ZSIsIm1heWJlSW52b2tlRGVsZWdhdGUiLCJzZW50IiwiX3NlbnQiLCJkaXNwYXRjaEV4Y2VwdGlvbiIsImFicnVwdCIsInJldHVybiIsIlR5cGVFcnJvciIsInJlc3VsdE5hbWUiLCJuZXh0IiwibmV4dExvYyIsInB1c2hUcnlFbnRyeSIsInRyeUxvYyIsImNhdGNoTG9jIiwiZmluYWxseUxvYyIsImFmdGVyTG9jIiwidHJ5RW50cmllcyIsInB1c2giLCJyZXNldFRyeUVudHJ5IiwiY29tcGxldGlvbiIsInJlc2V0IiwiaXNOYU4iLCJsZW5ndGgiLCJkaXNwbGF5TmFtZSIsImlzR2VuZXJhdG9yRnVuY3Rpb24iLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJtYXJrIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJhd3JhcCIsImFzeW5jIiwiUHJvbWlzZSIsImtleXMiLCJyZXZlcnNlIiwicG9wIiwicHJldiIsImNoYXJBdCIsInNsaWNlIiwic3RvcCIsInJ2YWwiLCJoYW5kbGUiLCJjb21wbGV0ZSIsImZpbmlzaCIsImNhdGNoIiwiZGVsZWdhdGVZaWVsZCIsImFzeW5jR2VuZXJhdG9yU3RlcCIsImdlbiIsInJlamVjdCIsIl9uZXh0IiwiX3Rocm93Iiwia2V5IiwiaW5mbyIsImVycm9yIiwiX2FzeW5jVG9HZW5lcmF0b3IiLCJmbiIsInNlbGYiLCJhcmdzIiwiYXJndW1lbnRzIiwiYXBwbHkiLCJlcnIiLCJ1bmRlZmluZWQiLCJvd25LZXlzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwiZmlsdGVyIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiX29iamVjdFNwcmVhZCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwib2JqIiwiX3RvUHJvcGVydHlLZXkiLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJ0b1ByaW1pdGl2ZSIsIk51bWJlciIsIl9jb25zdHJ1Y3RvciIsImluaXRpYWxPcHRpb25zIiwiZnMiLCJyZXF1aXJlIiwidmFycyIsIm9wdGlvbnMiLCJmcmFtZXdvcmsiLCJwbHVnaW5FcnJvcnMiLCJyZXN1bHQiLCJ0cmVlc2hha2UiLCJ2ZXJib3NlIiwidmFsaWRhdGVPcHRpb25zIiwiX2dldFZhbGlkYXRlT3B0aW9ucyIsInJjIiwiZXhpc3RzU3luYyIsIkpTT04iLCJwYXJzZSIsInJlYWRGaWxlU3luYyIsIl9nZXREZWZhdWx0T3B0aW9ucyIsIl9nZXREZWZhdWx0VmFycyIsInBsdWdpbk5hbWUiLCJhcHAiLCJfZ2V0QXBwIiwidGVzdGluZyIsImxvZ3YiLCJlbnZpcm9ubWVudCIsImNtZG9wdHMiLCJpbmNsdWRlcyIsInByb2R1Y3Rpb24iLCJicm93c2VyIiwid2F0Y2giLCJidWlsZEVudmlyb25tZW50IiwibG9nIiwiX2dldFZlcnNpb25zIiwiaW50ZWxsaXNoYWtlIiwiYnVpbGRzdGVwIiwiX3RvUHJvZCIsImNvbmZpZ09iaiIsInRvU3RyaW5nIiwiX3RoaXNDb21waWxhdGlvbiIsImNvbXBpbGVyIiwiY29tcGlsYXRpb24iLCJzY3JpcHQiLCJydW5TY3JpcHQiLCJfY29tcGlsYXRpb24iLCJleHRDb21wb25lbnRzIiwiX2dldEFsbENvbXBvbmVudHMiLCJob29rcyIsInN1Y2NlZWRNb2R1bGUiLCJ0YXAiLCJtb2R1bGUiLCJyZXNvdXJjZSIsIm1hdGNoIiwiX3NvdXJjZSIsIl92YWx1ZSIsInRvTG93ZXJDYXNlIiwiZGVwcyIsIl9leHRyYWN0RnJvbVNvdXJjZSIsImNvbnNvbGUiLCJmaW5pc2hNb2R1bGVzIiwibW9kdWxlcyIsIl93cml0ZUZpbGVzVG9Qcm9kRm9sZGVyIiwiaW5qZWN0IiwiaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbiIsImRhdGEiLCJwYXRoIiwianNQYXRoIiwiam9pbiIsImV4dFBhdGgiLCJjc3NQYXRoIiwiYXNzZXRzIiwianMiLCJ1bnNoaWZ0IiwiY3NzIiwiX2FmdGVyQ29tcGlsZSIsIl9lbWl0IiwiX3giLCJfeDIiLCJfeDMiLCJfeDQiLCJfeDUiLCJfZW1pdDIiLCJfY2FsbGVlIiwiY2FsbGJhY2siLCJlbWl0Iiwib3V0cHV0UGF0aCIsImNvbW1hbmQiLCJwYXJtcyIsIl9jYWxsZWUkIiwiX2NvbnRleHQiLCJkZXZTZXJ2ZXIiLCJjb250ZW50QmFzZSIsIl9wcmVwYXJlRm9yQnVpbGQiLCJyZWJ1aWxkIiwiQXJyYXkiLCJpc0FycmF5Iiwic3BsaXQiLCJwcm9maWxlIiwiZWxlbWVudCIsInNwbGljZSIsImluZGV4T2YiLCJ3YXRjaFN0YXJ0ZWQiLCJfYnVpbGRFeHRCdW5kbGUiLCJ0MCIsIl9kb25lIiwic3RhdHMiLCJlcnJvcnMiLCJjaGFsayIsInJlZCIsIl90b0RldiIsImJyb3dzZXJDb3VudCIsInVybCIsInBvcnQiLCJvcG4iLCJvdXRwdXQiLCJwYWNrYWdlcyIsInRvb2xraXQiLCJ0aGVtZSIsInJpbXJhZiIsIm1rZGlycCIsImZzeCIsImZpcnN0VGltZSIsInN5bmMiLCJidWlsZFhNTCIsImNyZWF0ZUFwcEpzb24iLCJjcmVhdGVXb3Jrc3BhY2VKc29uIiwiY3JlYXRlSlNET01FbnZpcm9ubWVudCIsIndyaXRlRmlsZVN5bmMiLCJwcm9jZXNzIiwiY3dkIiwiZnJvbVBhdGgiLCJ0b1BhdGgiLCJjb3B5U3luYyIsInJlcGxhY2UiLCJmcm9tUmVzb3VyY2VzIiwidG9SZXNvdXJjZXMiLCJpbmRleCIsIm1hbmlmZXN0IiwiYnVuZGxlRGlyIiwidHJpbSIsInNlbmNoYSIsIm9uQnVpbGREb25lIiwib3B0cyIsInNpbGVudCIsInN0ZGlvIiwiZW5jb2RpbmciLCJfZXhlY3V0ZUFzeW5jIiwicmVhc29uIiwiX3g2IiwiX3g3IiwiX3g4IiwiX3g5IiwiX3gxMCIsIl94MTEiLCJfeDEyIiwiX2V4ZWN1dGVBc3luYzIiLCJfY2FsbGVlMiIsIkRFRkFVTFRfU1VCU1RSUyIsInN1YnN0cmluZ3MiLCJjcm9zc1NwYXduIiwiX2NhbGxlZTIkIiwiX2NvbnRleHQyIiwic3RyaW5naWZ5IiwiY2hpbGQiLCJvbiIsImNvZGUiLCJzaWduYWwiLCJzdGRvdXQiLCJzdHIiLCJzb21lIiwic3RkZXJyIiwic3RySmF2YU9wdHMiLCJzY3JpcHRQYXRoIiwiY2hpbGRQcm9jZXNzIiwiaW52b2tlZCIsImZvcmsiLCJleGVjQXJndiIsIl90b1h0eXBlIiwicHJlZml4IiwicGxhdGZvcm0iLCJncmVlbiIsImZyYW1ld29ya05hbWUiLCJmcmFtZXdvcmtJbmZvIiwicGx1Z2luVmVyc2lvbiIsImV4dFZlcnNpb24iLCJlZGl0aW9uIiwiY21kVmVyc2lvbiIsIndlYnBhY2tWZXJzaW9uIiwicGx1Z2luUGF0aCIsInBsdWdpblBrZyIsInZlcnNpb24iLCJfcmVzb2x2ZWQiLCJ3ZWJwYWNrUGF0aCIsIndlYnBhY2tQa2ciLCJleHRQa2ciLCJjbWRQYXRoIiwiY21kUGtnIiwidmVyc2lvbl9mdWxsIiwiZnJhbWV3b3JrUGF0aCIsImZyYW1ld29ya1BrZyIsImZyYW1ld29ya1ZlcnNpb24iLCJtZXNzYWdlIiwiY3Vyc29yVG8iLCJjbGVhckxpbmUiLCJ3cml0ZSIsImxvZ2giLCJzbWFydEZsb3dQaW5nIiwicGFja2FnZUpzb25QYXRoIiwiYXBwSnNvblBhdGgiLCJleGVjIiwicmVhZEZpbGUiLCJlcnJQYWNrYWdlIiwiZGF0YVBhY2thZ2UiLCJwYWNrYWdlSnNvbiIsImVyckFwcCIsImRhdGFBcHAiLCJhcHBKc29uIiwicmVxdWlyZXNBcnJheSIsInJlcXVpcmVzIiwibW9kaWZpZWRTdHJpbmciLCJob21lRGlyZWN0b3J5IiwiZW52IiwiSE9NRSIsIlVTRVJQUk9GSUxFIiwicmVsYXRpdmVGaWxlUGF0aCIsImZpbGVQYXRoIiwicmVnaXN0cnlSZWdleCIsInJlZ2lzdHJ5VXJsIiwibnBtX2NvbmZpZ19yZWdpc3RyeSIsInVzZXJuYW1lIiwiYWRkaXRpb25hbExpY2Vuc2VJbmZvIiwibGljZW5zZWRGZWF0dXJlIiwic2NyaXB0VHlwZSIsIm5wbV9saWZlY3ljbGVfZXZlbnQiLCJ0cmlnZ2VyZXZlbnQiLCJsaWNlbnNlaW5mbyIsImphclBhdGgiLCJfX2Rpcm5hbWUiLCJmZWF0dXJlc1VzZWQiLCJlbmNyeXB0ZWRMaWNlbnNlIiwiYnRvYSJdLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5VdGlsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbnN0cnVjdG9yKGluaXRpYWxPcHRpb25zKSB7XG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICB2YXIgdmFycyA9IHt9XG4gIHZhciBvcHRpb25zID0ge31cbiAgdHJ5IHtcbiAgICBpZiAoaW5pdGlhbE9wdGlvbnMuZnJhbWV3b3JrID09IHVuZGVmaW5lZCkge1xuICAgICAgdmFycy5wbHVnaW5FcnJvcnMgPSBbXVxuICAgICAgdmFycy5wbHVnaW5FcnJvcnMucHVzaCgnd2VicGFjayBjb25maWc6IGZyYW1ld29yayBwYXJhbWV0ZXIgb24gZXh0LXdlYnBhY2stcGx1Z2luIGlzIG5vdCBkZWZpbmVkIC0gdmFsdWVzOiByZWFjdCwgYW5ndWxhciwgZXh0anMsIHdlYi1jb21wb25lbnRzJylcbiAgICAgIHZhciByZXN1bHQgPSB7IHZhcnM6IHZhcnMgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHZhciBmcmFtZXdvcmsgPSBpbml0aWFsT3B0aW9ucy5mcmFtZXdvcmtcbiAgICB2YXIgdHJlZXNoYWtlID0gaW5pdGlhbE9wdGlvbnMudHJlZXNoYWtlXG4gICAgdmFyIHZlcmJvc2UgPSBpbml0aWFsT3B0aW9ucy52ZXJib3NlXG5cbiAgICBjb25zdCB2YWxpZGF0ZU9wdGlvbnMgPSByZXF1aXJlKCdzY2hlbWEtdXRpbHMnKVxuICAgIHZhbGlkYXRlT3B0aW9ucyhfZ2V0VmFsaWRhdGVPcHRpb25zKCksIGluaXRpYWxPcHRpb25zLCAnJylcblxuICAgIGNvbnN0IHJjID0gKGZzLmV4aXN0c1N5bmMoYC5leHQtJHtmcmFtZXdvcmt9cmNgKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhgLmV4dC0ke2ZyYW1ld29ya31yY2AsICd1dGYtOCcpKSB8fCB7fSlcbiAgICBvcHRpb25zID0geyAuLi5fZ2V0RGVmYXVsdE9wdGlvbnMoKSwgLi4uaW5pdGlhbE9wdGlvbnMsIC4uLnJjIH1cblxuICAgIHZhcnMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0RGVmYXVsdFZhcnMoKVxuICAgIHZhcnMucGx1Z2luTmFtZSA9ICdleHQtd2VicGFjay1wbHVnaW4nXG4gICAgdmFycy5hcHAgPSBfZ2V0QXBwKClcbiAgICB2YXIgcGx1Z2luTmFtZSA9IHZhcnMucGx1Z2luTmFtZVxuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhcnMudGVzdGluZyA9IGZhbHNlXG5cbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfY29uc3RydWN0b3InKVxuICAgIGxvZ3YodmVyYm9zZSwgYHBsdWdpbk5hbWUgLSAke3BsdWdpbk5hbWV9YClcbiAgICBsb2d2KHZlcmJvc2UsIGBhcHAgLSAke2FwcH1gKVxuXG4gICAgaWYgKG9wdGlvbnMuZW52aXJvbm1lbnQgPT0gJ3Byb2R1Y3Rpb24nIHx8XG4gICAgICAgIG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLS1wcm9kdWN0aW9uJykgfHxcbiAgICAgICAgb3B0aW9ucy5jbWRvcHRzLmluY2x1ZGVzKCctcHInKSB8fFxuICAgICAgICBvcHRpb25zLmNtZG9wdHMuaW5jbHVkZXMoJy0tZW52aXJvbm1lbnQ9cHJvZHVjdGlvbicpIHx8XG4gICAgICAgIG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLWU9cHJvZHVjdGlvbicpXG4gICAgICApIHtcbiAgICAgIHZhcnMucHJvZHVjdGlvbiA9IHRydWU7XG4gICAgICBvcHRpb25zLmJyb3dzZXIgPSAnbm8nO1xuICAgICAgb3B0aW9ucy53YXRjaCA9ICdubyc7XG4gICAgICBvcHRpb25zLmJ1aWxkRW52aXJvbm1lbnQgPSAncHJvZHVjdGlvbic7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmNtZG9wdHMgJiYgKG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLS10ZXN0aW5nJykgfHxcbiAgICAgICAgICAgICAgIG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLXRlJykgfHxcbiAgICAgICAgICAgICAgIG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLS1lbnZpcm9ubWVudD10ZXN0aW5nJykgfHxcbiAgICAgICAgICAgICAgIG9wdGlvbnMuY21kb3B0cy5pbmNsdWRlcygnLWU9dGVzdGluZycpKVxuICAgICkge1xuICAgICAgdmFycy5wcm9kdWN0aW9uID0gZmFsc2U7XG4gICAgICB2YXJzLnRlc3RpbmcgPSB0cnVlO1xuICAgICAgb3B0aW9ucy5icm93c2VyID0gJ25vJztcbiAgICAgIG9wdGlvbnMud2F0Y2ggPSAnbm8nO1xuICAgICAgb3B0aW9ucy5idWlsZEVudmlyb25tZW50ID0gJ3Rlc3RpbmcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLmJ1aWxkRW52aXJvbm1lbnQgPSAnZGV2ZWxvcG1lbnQnO1xuICAgICAgdmFycy5wcm9kdWN0aW9uID0gZmFsc2U7XG4gICAgfVxuXG4gICAgbG9nKGFwcCwgX2dldFZlcnNpb25zKHBsdWdpbk5hbWUsIGZyYW1ld29yaykpXG5cbiAgICAvL21qZyBhZGRlZCBmb3IgYW5ndWxhciBjbGkgYnVpbGRcbiAgICBpZiAoZnJhbWV3b3JrID09ICdhbmd1bGFyJyAmJlxuICAgICAgICBvcHRpb25zLmludGVsbGlzaGFrZSA9PSAnbm8nICYmXG4gICAgICAgIHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlXG4gICAgICAgICYmIHRyZWVzaGFrZSA9PSAneWVzJykge1xuICAgICAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJztcbiAgICAgICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBwcm9kdWN0aW9uIGJ1aWxkIGZvciAnICsgZnJhbWV3b3JrKTtcbiAgICB9XG5cbiAgICBlbHNlIGlmIChmcmFtZXdvcmsgPT0gJ3JlYWN0JyB8fCBmcmFtZXdvcmsgPT0gJ2V4dGpzJyB8fCBmcmFtZXdvcmsgPT0gJ3dlYi1jb21wb25lbnRzJykge1xuICAgICAgaWYgKHZhcnMucHJvZHVjdGlvbiA9PSB0cnVlKSB7XG4gICAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgICAgbG9nKGFwcCwgJ1N0YXJ0aW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICcgKyBmcmFtZXdvcmspXG4gICAgICB9XG4gICAgICBlbHNlIGlmKHZhcnMudGVzdGluZyA9PSB0cnVlKXtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAxJ1xuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgdGVzdGluZyBidWlsZCBmb3IgJyArIGZyYW1ld29yaylcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcxIG9mIDEnXG4gICAgICAgIGxvZyhhcHAsICdTdGFydGluZyBkZXZlbG9wbWVudCBidWlsZCBmb3IgJyArIGZyYW1ld29yaylcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUpIHtcbiAgICAgIGlmICh0cmVlc2hha2UgPT0gJ3llcycpIHtcbiAgICAgICAgdmFycy5idWlsZHN0ZXAgPSAnMSBvZiAyJ1xuICAgICAgICBsb2coYXBwLCAnU3RhcnRpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJyArIGZyYW1ld29yayArICcgLSAnICsgdmFycy5idWlsZHN0ZXApXG4gICAgICAgIHJlcXVpcmUoYC4vJHtmcmFtZXdvcmt9VXRpbGApLl90b1Byb2QodmFycywgb3B0aW9ucylcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXJzLmJ1aWxkc3RlcCA9ICcyIG9mIDInXG4gICAgICAgIGxvZyhhcHAsICdDb250aW51aW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICcgKyBmcmFtZXdvcmsgKyAnIC0gJyArIHZhcnMuYnVpbGRzdGVwKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhcnMuYnVpbGRzdGVwID0gJzEgb2YgMSdcbiAgICAgIGxvZyhhcHAsICdTdGFydGluZyBkZXZlbG9wbWVudCBidWlsZCBmb3IgJyArIGZyYW1ld29yaylcbiAgICB9XG4gICAgbG9ndih2ZXJib3NlLCAnQnVpbGRpbmcgZm9yICcgKyBvcHRpb25zLmJ1aWxkRW52aXJvbm1lbnQgKyAnLCAnICsgJ3RyZWVzaGFrZSBpcyAnICsgb3B0aW9ucy50cmVlc2hha2UrICcsICcgKyAnaW50ZWxsaXNoYWtlIGlzICcgKyBvcHRpb25zLmludGVsbGlzaGFrZSlcblxuICAgIHZhciBjb25maWdPYmogPSB7IHZhcnM6IHZhcnMsIG9wdGlvbnM6IG9wdGlvbnMgfTtcbiAgICByZXR1cm4gY29uZmlnT2JqO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgdGhyb3cgJ19jb25zdHJ1Y3RvcjogJyArIGUudG9TdHJpbmcoKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF90aGlzQ29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfdGhpc0NvbXBpbGF0aW9uJylcbiAgICBsb2d2KHZlcmJvc2UsIGBvcHRpb25zLnNjcmlwdDogJHtvcHRpb25zLnNjcmlwdCB9YClcbiAgICBsb2d2KHZlcmJvc2UsIGBidWlsZHN0ZXA6ICR7dmFycy5idWlsZHN0ZXB9YClcblxuICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PT0gJzEgb2YgMScgfHwgdmFycy5idWlsZHN0ZXAgPT09ICcxIG9mIDInKSB7XG4gICAgICBpZiAob3B0aW9ucy5zY3JpcHQgIT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuc2NyaXB0ICE9IG51bGwgJiYgb3B0aW9ucy5zY3JpcHQgIT0gJycpIHtcbiAgICAgICAgbG9nKGFwcCwgYFN0YXJ0ZWQgcnVubmluZyAke29wdGlvbnMuc2NyaXB0fWApXG4gICAgICAgIHJ1blNjcmlwdChvcHRpb25zLnNjcmlwdCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG4gICAgICAgICAgbG9nKGFwcCwgYEZpbmlzaGVkIHJ1bm5pbmcgJHtvcHRpb25zLnNjcmlwdH1gKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHRocm93ICdfdGhpc0NvbXBpbGF0aW9uOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB0cnkge1xuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrXG4gICAgbG9ndih2ZXJib3NlLCAnRlVOQ1RJT04gX2NvbXBpbGF0aW9uJylcblxuICAgIGlmIChmcmFtZXdvcmsgIT0gJ2V4dGpzJykge1xuICAgICAgaWYgKG9wdGlvbnMudHJlZXNoYWtlID09PSAneWVzJyAmJiBvcHRpb25zLmJ1aWxkRW52aXJvbm1lbnQgPT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdO1xuXG4gICAgICAgIC8vbWpnIGZvciAxIHN0ZXAgYnVpbGRcbiAgICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnICYmIGZyYW1ld29yayA9PT0gJ2FuZ3VsYXInICYmIG9wdGlvbnMuaW50ZWxsaXNoYWtlID09ICdubycpIHtcbiAgICAgICAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0QWxsQ29tcG9uZW50cyh2YXJzLCBvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YXJzLmJ1aWxkc3RlcCA9PSAnMSBvZiAyJyB8fCAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScgJiYgZnJhbWV3b3JrID09PSAnd2ViLWNvbXBvbmVudHMnKSkge1xuICAgICAgICAgIGV4dENvbXBvbmVudHMgPSByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fZ2V0QWxsQ29tcG9uZW50cyh2YXJzLCBvcHRpb25zKVxuICAgICAgICB9XG4gICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLnN1Y2NlZWRNb2R1bGUudGFwKGBleHQtc3VjY2VlZC1tb2R1bGVgLCBtb2R1bGUgPT4ge1xuICAgICAgICAgIGlmIChtb2R1bGUucmVzb3VyY2UgJiYgIW1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvbm9kZV9tb2R1bGVzLykpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vZHVsZS5yZXNvdXJjZS5tYXRjaCgvXFwuaHRtbCQvKSAhPSBudWxsXG4gICAgICAgICAgICAgICAgJiYgbW9kdWxlLl9zb3VyY2UuX3ZhbHVlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2RvY3R5cGUgaHRtbCcpID09IGZhbHNlXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4ucmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhcnMuZGVwcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLih2YXJzLmRlcHMgfHwgW10pLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4ucmVxdWlyZShgLi8ke2ZyYW1ld29ya31VdGlsYCkuX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgICAgIGNvbXBpbGF0aW9uLmhvb2tzLmZpbmlzaE1vZHVsZXMudGFwKGBleHQtZmluaXNoLW1vZHVsZXNgLCBtb2R1bGVzID0+IHtcbiAgICAgICAgICByZXF1aXJlKGAuLyR7ZnJhbWV3b3JrfVV0aWxgKS5fd3JpdGVGaWxlc1RvUHJvZEZvbGRlcih2YXJzLCBvcHRpb25zKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09ICcyIG9mIDInKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmluamVjdCA9PT0gJ3llcycpIHtcbiAgICAgICAgICBpZihjb21waWxhdGlvbi5ob29rcy5odG1sV2VicGFja1BsdWdpbkJlZm9yZUh0bWxHZW5lcmF0aW9uICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29tcGlsYXRpb24uaG9va3MuaHRtbFdlYnBhY2tQbHVnaW5CZWZvcmVIdG1sR2VuZXJhdGlvbi50YXAoYGV4dC1odG1sLWdlbmVyYXRpb25gLChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAgICAgICAgICAgdmFyIGpzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuanMnKVxuICAgICAgICAgICAgICB2YXIgY3NzUGF0aCA9IHBhdGguam9pbih2YXJzLmV4dFBhdGgsICdleHQuY3NzJylcbiAgICAgICAgICAgICAgLy92YXIganNQYXRoID0gdmFycy5leHRQYXRoICsgJy8nICsgICdleHQuanMnO1xuICAgICAgICAgICAgICAvL3ZhciBjc3NQYXRoID0gdmFycy5leHRQYXRoICsgJy8nICsgJ2V4dC5jc3MnO1xuICAgICAgICAgICAgICBkYXRhLmFzc2V0cy5qcy51bnNoaWZ0KGpzUGF0aClcbiAgICAgICAgICAgICAgZGF0YS5hc3NldHMuY3NzLnVuc2hpZnQoY3NzUGF0aClcbiAgICAgICAgICAgICAgbG9nKGFwcCwgYEFkZGluZyAke2pzUGF0aH0gYW5kICR7Y3NzUGF0aH0gdG8gaW5kZXguaHRtbGApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgdGhyb3cgJ19jb21waWxhdGlvbjogJyArIGUudG9TdHJpbmcoKVxuLy8gICAgbG9ndihvcHRpb25zLnZlcmJvc2UsZSlcbi8vICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfY29tcGlsYXRpb246ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9hZnRlckNvbXBpbGUoY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFwcCA9IHZhcnMuYXBwXG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfYWZ0ZXJDb21waWxlJylcbiAgICBpZiAoZnJhbWV3b3JrID09ICdleHRqcycpIHtcbiAgICAgIHJlcXVpcmUoYC4vZXh0anNVdGlsYCkuX2FmdGVyQ29tcGlsZShjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2d2KHZlcmJvc2UsICdGVU5DVElPTiBfYWZ0ZXJDb21waWxlIG5vdCBydW4nKVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgdGhyb3cgJ19hZnRlckNvbXBpbGU6ICcgKyBlLnRvU3RyaW5nKClcbiAgfVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZW1pdChjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgIHZhciBhcHAgPSB2YXJzLmFwcFxuICAgIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gICAgdmFyIGVtaXQgPSBvcHRpb25zLmVtaXRcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICB2YXJzLmNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9lbWl0JylcbiAgICBpZiAoZW1pdCA9PSAneWVzJykge1xuICAgICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDEnIHx8IHZhcnMuYnVpbGRzdGVwID09ICcxIG9mIDInKSB7XG4gICAgICAgIGxldCBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGNvbXBpbGVyLm91dHB1dFBhdGgsdmFycy5leHRQYXRoKVxuICAgICAgICBpZiAoY29tcGlsZXIub3V0cHV0UGF0aCA9PT0gJy8nICYmIGNvbXBpbGVyLm9wdGlvbnMuZGV2U2VydmVyKSB7XG4gICAgICAgICAgb3V0cHV0UGF0aCA9IHBhdGguam9pbihjb21waWxlci5vcHRpb25zLmRldlNlcnZlci5jb250ZW50QmFzZSwgb3V0cHV0UGF0aClcbiAgICAgICAgfVxuICAgICAgICBsb2d2KHZlcmJvc2UsJ291dHB1dFBhdGg6ICcgKyBvdXRwdXRQYXRoKVxuICAgICAgICBsb2d2KHZlcmJvc2UsJ2ZyYW1ld29yazogJyArIGZyYW1ld29yaylcbiAgICAgICAgaWYgKGZyYW1ld29yayAhPSAnZXh0anMnKSB7XG4gICAgICAgICAgX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dFBhdGgsIGNvbXBpbGF0aW9uKVxuICAgICAgICB9XG4gICAgICAgIHZhciBjb21tYW5kID0gJydcbiAgICAgICAgaWYgKG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKVxuICAgICAgICAgIHtjb21tYW5kID0gJ3dhdGNoJ31cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHtjb21tYW5kID0gJ2J1aWxkJ31cbiAgICAgICAgaWYgKHZhcnMucmVidWlsZCA9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHBhcm1zID0gW11cbiAgICAgICAgICBpZighQXJyYXkuaXNBcnJheShvcHRpb25zLmNtZG9wdHMpKXtcbiAgICAgICAgICAgIG9wdGlvbnMuY21kb3B0cyA9IG9wdGlvbnMuY21kb3B0cy5zcGxpdCgnICcpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvcHRpb25zLnByb2ZpbGUgPT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMucHJvZmlsZSA9PSAnJyB8fCBvcHRpb25zLnByb2ZpbGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT0gJ2J1aWxkJylcbiAgICAgICAgICAgICAgeyBwYXJtcyA9IFsnYXBwJywgY29tbWFuZCwgb3B0aW9ucy5idWlsZEVudmlyb25tZW50XSB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHsgcGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsICctLXdlYi1zZXJ2ZXInLCAnZmFsc2UnLCBvcHRpb25zLmJ1aWxkRW52aXJvbm1lbnRdIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoY29tbWFuZCA9PSAnYnVpbGQnKVxuICAgICAgICAgICAgICB7cGFybXMgPSBbJ2FwcCcsIGNvbW1hbmQsIG9wdGlvbnMucHJvZmlsZSwgb3B0aW9ucy5idWlsZEVudmlyb25tZW50XX1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAge3Bhcm1zID0gWydhcHAnLCBjb21tYW5kLCAnLS13ZWItc2VydmVyJywgJ2ZhbHNlJywgb3B0aW9ucy5wcm9maWxlLCBvcHRpb25zLmJ1aWxkRW52aXJvbm1lbnRdfVxuICAgICAgICAgIH1cbiAgICAgICAgICBvcHRpb25zLmNtZG9wdHMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KXtcbiAgICAgICAgICAgICAgcGFybXMuc3BsaWNlKHBhcm1zLmluZGV4T2YoY29tbWFuZCkrMSwgMCwgZWxlbWVudCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAvLyBpZiAodmFycy53YXRjaFN0YXJ0ZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAvLyAgIGF3YWl0IF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgdmFycywgb3B0aW9ucylcbiAgICAgICAgICAvLyAgIHZhcnMud2F0Y2hTdGFydGVkID0gdHJ1ZVxuICAgICAgICAgIC8vIH1cbiAgICAgICAgICBpZiAodmFycy53YXRjaFN0YXJ0ZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGF3YWl0IF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgdmFycywgb3B0aW9ucylcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09ICd3YXRjaCcpIHtcbiAgICAgICAgICAgICAgdmFycy53YXRjaFN0YXJ0ZWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgdmFycy5jYWxsYmFjaygpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vbWpnXG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXJzLmNhbGxiYWNrKClcbiAgICAgICAgICB9XG4gICAgICAgICAgLy9tamdcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YXJzLmNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGxvZ3YodmVyYm9zZSwnTk9UIHJ1bm5pbmcgZW1pdCcpXG4gICAgICAgIHZhcnMuY2FsbGJhY2soKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxvZ3YodmVyYm9zZSwnZW1pdCBpcyBubycpXG4gICAgICB2YXJzLmNhbGxiYWNrKClcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHZhcnMuY2FsbGJhY2soKVxuICAgIHRocm93ICdfZW1pdDogJyArIGUudG9TdHJpbmcoKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9kb25lKHN0YXRzLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcbiAgICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9kb25lJylcbiAgICBpZiAoc3RhdHMuY29tcGlsYXRpb24uZXJyb3JzICYmIHN0YXRzLmNvbXBpbGF0aW9uLmVycm9ycy5sZW5ndGgpIC8vICYmIHByb2Nlc3MuYXJndi5pbmRleE9mKCctLXdhdGNoJykgPT0gLTEpXG4gICAge1xuICAgICAgdmFyIGNoYWxrID0gcmVxdWlyZSgnY2hhbGsnKTtcbiAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZCgnKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqJykpO1xuICAgICAgY29uc29sZS5sb2coc3RhdHMuY29tcGlsYXRpb24uZXJyb3JzWzBdKTtcbiAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZCgnKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqJykpO1xuICAgICAgLy9wcm9jZXNzLmV4aXQoMCk7XG4gICAgfVxuXG4gICAgLy9tamcgcmVmYWN0b3JcbiAgICBpZiAodmFycy5wcm9kdWN0aW9uID09IHRydWUgJiYgb3B0aW9ucy50cmVlc2hha2UgPT0gJ25vJyAmJiBmcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICByZXF1aXJlKGAuLyR7b3B0aW9ucy5mcmFtZXdvcmt9VXRpbGApLl90b0Rldih2YXJzLCBvcHRpb25zKVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgaWYob3B0aW9ucy5icm93c2VyID09ICd5ZXMnICYmIG9wdGlvbnMud2F0Y2ggPT0gJ3llcycgJiYgdmFycy5wcm9kdWN0aW9uID09IGZhbHNlKSB7XG4gICAgICAgIGlmICh2YXJzLmJyb3dzZXJDb3VudCA9PSAwKSB7XG4gICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OicgKyBvcHRpb25zLnBvcnRcbiAgICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBPcGVuaW5nIGJyb3dzZXIgYXQgJHt1cmx9YClcbiAgICAgICAgICB2YXJzLmJyb3dzZXJDb3VudCsrXG4gICAgICAgICAgY29uc3Qgb3BuID0gcmVxdWlyZSgnb3BuJylcbiAgICAgICAgICBvcG4odXJsKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cbiAgICBpZiAodmFycy5idWlsZHN0ZXAgPT0gJzEgb2YgMScpIHtcbiAgICAgIGlmICh2YXJzLnByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAsIGBFbmRpbmcgcHJvZHVjdGlvbiBidWlsZCBmb3IgJHtmcmFtZXdvcmt9YClcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHZhcnMudGVzdGluZyA9PSB0cnVlKSB7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyB0ZXN0aW5nIGJ1aWxkIGZvciAke2ZyYW1ld29ya31gKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyBkZXZlbG9wbWVudCBidWlsZCBmb3IgJHtmcmFtZXdvcmt9YClcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHZhcnMuYnVpbGRzdGVwID09ICcyIG9mIDInKSB7XG4gICAgICBpZih2YXJzLnRlc3RpbmcgPT0gdHJ1ZSl7XG4gICAgICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZyh2YXJzLmFwcCwgYEVuZGluZyB0ZXN0aW5nIGJ1aWxkIGZvciAke2ZyYW1ld29ya31gKVxuICAgICAgfVxuICAgICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nKHZhcnMuYXBwLCBgRW5kaW5nIHByb2R1Y3Rpb24gYnVpbGQgZm9yICR7ZnJhbWV3b3JrfWApXG4gICAgfVxuICB9XG4gIGNhdGNoKGUpIHtcbi8vICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gICAgdGhyb3cgJ19kb25lOiAnICsgZS50b1N0cmluZygpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX3ByZXBhcmVGb3JCdWlsZChhcHAsIHZhcnMsIG9wdGlvbnMsIG91dHB1dCwgY29tcGlsYXRpb24pIHtcbiAgdHJ5IHtcbiAgICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICAgIHZhciBwYWNrYWdlcyA9IG9wdGlvbnMucGFja2FnZXNcbiAgICB2YXIgdG9vbGtpdCA9IG9wdGlvbnMudG9vbGtpdFxuICAgIHZhciB0aGVtZSA9IG9wdGlvbnMudGhlbWVcbiAgICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9wcmVwYXJlRm9yQnVpbGQnKVxuICAgIGNvbnN0IHJpbXJhZiA9IHJlcXVpcmUoJ3JpbXJhZicpXG4gICAgY29uc3QgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJylcbiAgICBjb25zdCBmc3ggPSByZXF1aXJlKCdmcy1leHRyYScpXG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgIHRoZW1lID0gdGhlbWUgfHwgKHRvb2xraXQgPT09ICdjbGFzc2ljJyA/ICd0aGVtZS10cml0b24nIDogJ3RoZW1lLW1hdGVyaWFsJylcbiAgICBsb2d2KHZlcmJvc2UsJ2ZpcnN0VGltZTogJyArIHZhcnMuZmlyc3RUaW1lKVxuICAgIGlmICh2YXJzLmZpcnN0VGltZSkge1xuICAgICAgcmltcmFmLnN5bmMob3V0cHV0KVxuICAgICAgbWtkaXJwLnN5bmMob3V0cHV0KVxuICAgICAgY29uc3QgYnVpbGRYTUwgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmJ1aWxkWE1MXG4gICAgICBjb25zdCBjcmVhdGVBcHBKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVBcHBKc29uXG4gICAgICBjb25zdCBjcmVhdGVXb3Jrc3BhY2VKc29uID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVXb3Jrc3BhY2VKc29uXG4gICAgICBjb25zdCBjcmVhdGVKU0RPTUVudmlyb25tZW50ID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5jcmVhdGVKU0RPTUVudmlyb25tZW50XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdidWlsZC54bWwnKSwgYnVpbGRYTUwodmFycy5wcm9kdWN0aW9uLCBvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICdhcHAuanNvbicpLCBjcmVhdGVBcHBKc29uKHRoZW1lLCBwYWNrYWdlcywgdG9vbGtpdCwgb3B0aW9ucywgb3V0cHV0KSwgJ3V0ZjgnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0LCAnanNkb20tZW52aXJvbm1lbnQuanMnKSwgY3JlYXRlSlNET01FbnZpcm9ubWVudChvcHRpb25zLCBvdXRwdXQpLCAndXRmOCcpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRwdXQsICd3b3Jrc3BhY2UuanNvbicpLCBjcmVhdGVXb3Jrc3BhY2VKc29uKG9wdGlvbnMsIG91dHB1dCksICd1dGY4JylcbiAgICAgIHZhciBmcmFtZXdvcmsgPSB2YXJzLmZyYW1ld29yaztcbiAgICAgIC8vYmVjYXVzZSBvZiBhIHByb2JsZW0gd2l0aCBjb2xvcnBpY2tlclxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vdXgvYCkpKSB7XG4gICAgICAgIHZhciBmcm9tUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBgZXh0LSR7ZnJhbWV3b3JrfS91eC9gKVxuICAgICAgICB2YXIgdG9QYXRoID0gcGF0aC5qb2luKG91dHB1dCwgJ3V4JylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICh1eCkgJyArIGZyb21QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSlcbiAgICAgIH1cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLGBleHQtJHtmcmFtZXdvcmt9L3BhY2thZ2VzL2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vcGFja2FnZXMvYClcbiAgICAgICAgdmFyIHRvUGF0aCA9IHBhdGguam9pbihvdXRwdXQsICdwYWNrYWdlcycpXG4gICAgICAgIGZzeC5jb3B5U3luYyhmcm9tUGF0aCwgdG9QYXRoKVxuICAgICAgICBsb2coYXBwLCAnQ29weWluZyAnICsgZnJvbVBhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykgKyAnIHRvOiAnICsgdG9QYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksYGV4dC0ke2ZyYW1ld29ya30vb3ZlcnJpZGVzL2ApKSkge1xuICAgICAgICB2YXIgZnJvbVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgYGV4dC0ke2ZyYW1ld29ya30vb3ZlcnJpZGVzL2ApXG4gICAgICAgIHZhciB0b1BhdGggPSBwYXRoLmpvaW4ob3V0cHV0LCAnb3ZlcnJpZGVzJylcbiAgICAgICAgZnN4LmNvcHlTeW5jKGZyb21QYXRoLCB0b1BhdGgpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICcgKyBmcm9tUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKSArICcgdG86ICcgKyB0b1BhdGgucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykpXG4gICAgICB9XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwncmVzb3VyY2VzLycpKSkge1xuICAgICAgICB2YXIgZnJvbVJlc291cmNlcyA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncmVzb3VyY2VzLycpXG4gICAgICAgIHZhciB0b1Jlc291cmNlcyA9IHBhdGguam9pbihvdXRwdXQsICcuLi9yZXNvdXJjZXMnKVxuICAgICAgICBmc3guY29weVN5bmMoZnJvbVJlc291cmNlcywgdG9SZXNvdXJjZXMpXG4gICAgICAgIGxvZyhhcHAsICdDb3B5aW5nICcgKyBmcm9tUmVzb3VyY2VzLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpICsgJyB0bzogJyArIHRvUmVzb3VyY2VzLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpKVxuICAgICAgfVxuICAgIH1cbiAgICB2YXJzLmZpcnN0VGltZSA9IGZhbHNlXG4gICAgdmFyIGpzID0gJydcbiAgICBpZiAodmFycy5wcm9kdWN0aW9uKSB7XG4gICAgICB2YXJzLmRlcHMgPSB2YXJzLmRlcHMuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCl7IHJldHVybiB2YXJzLmRlcHMuaW5kZXhPZih2YWx1ZSkgPT0gaW5kZXggfSk7XG4gICAgICBqcyA9IHZhcnMuZGVwcy5qb2luKCc7XFxuJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAganMgPSBgRXh0LnJlcXVpcmUoW1wiRXh0LipcIixcIkV4dC5kYXRhLlRyZWVTdG9yZVwiXSlgXG4gICAgfVxuICAgIGpzID0gYEV4dC5yZXF1aXJlKFtcIkV4dC4qXCIsXCJFeHQuZGF0YS5UcmVlU3RvcmVcIl0pYDsgLy9mb3Igbm93XG4gICAgaWYgKHZhcnMubWFuaWZlc3QgPT09IG51bGwgfHwganMgIT09IHZhcnMubWFuaWZlc3QpIHtcbiAgICAgIHZhcnMubWFuaWZlc3QgPSBqcyArICc7XFxuRXh0LnJlcXVpcmUoW1wiRXh0LmxheW91dC4qXCJdKTtcXG4nO1xuICAgICAgY29uc3QgbWFuaWZlc3QgPSBwYXRoLmpvaW4ob3V0cHV0LCAnbWFuaWZlc3QuanMnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhtYW5pZmVzdCwgdmFycy5tYW5pZmVzdCwgJ3V0ZjgnKVxuICAgICAgdmFycy5yZWJ1aWxkID0gdHJ1ZVxuICAgICAgdmFyIGJ1bmRsZURpciA9IG91dHB1dC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKVxuICAgICAgaWYgKGJ1bmRsZURpci50cmltKCkgPT0gJycpIHtidW5kbGVEaXIgPSAnLi8nfVxuICAgICAgbG9nKGFwcCwgJ0J1aWxkaW5nIEV4dCBidW5kbGUgYXQ6ICcgKyBidW5kbGVEaXIpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5yZWJ1aWxkID0gZmFsc2VcbiAgICAgIGxvZyhhcHAsICdFeHQgcmVidWlsZCBOT1QgbmVlZGVkJylcbiAgICB9XG4gIH1cbiAgY2F0Y2goZSkge1xuICAgIHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Yob3B0aW9ucy52ZXJib3NlLGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ19wcmVwYXJlRm9yQnVpbGQ6ICcgKyBlKVxuICB9XG59XG5cbi8vKioqKioqKioqKlxuZXhwb3J0IGZ1bmN0aW9uIF9idWlsZEV4dEJ1bmRsZShhcHAsIGNvbXBpbGF0aW9uLCBvdXRwdXRQYXRoLCBwYXJtcywgdmFycywgb3B0aW9ucykge1xuICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBfYnVpbGRFeHRCdW5kbGUnKVxuICBsZXQgc2VuY2hhOyB0cnkgeyBzZW5jaGEgPSByZXF1aXJlKCdAc2VuY2hhL2NtZCcpIH0gY2F0Y2ggKGUpIHsgc2VuY2hhID0gJ3NlbmNoYScgfVxuICBpZiAoZnMuZXhpc3RzU3luYyhzZW5jaGEpKSB7XG4gICAgbG9ndih2ZXJib3NlLCdzZW5jaGEgZm9sZGVyIGV4aXN0cycpXG4gIH1cbiAgZWxzZSB7XG4gICAgbG9ndih2ZXJib3NlLCdzZW5jaGEgZm9sZGVyIERPRVMgTk9UIGV4aXN0JylcbiAgfVxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IG9uQnVpbGREb25lID0gKCkgPT4ge1xuICAgICAgbG9ndih2ZXJib3NlLCdvbkJ1aWxkRG9uZScpXG4gICAgICByZXNvbHZlKClcbiAgICB9XG4gICAgdmFyIG9wdHMgPSB7IGN3ZDogb3V0cHV0UGF0aCwgc2lsZW50OiB0cnVlLCBzdGRpbzogJ3BpcGUnLCBlbmNvZGluZzogJ3V0Zi04J31cbiAgICBfZXhlY3V0ZUFzeW5jKGFwcCwgc2VuY2hhLCBwYXJtcywgb3B0cywgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpLnRoZW4gKFxuICAgICAgZnVuY3Rpb24oKSB7IG9uQnVpbGREb25lKCkgfSxcbiAgICAgIGZ1bmN0aW9uKHJlYXNvbikgeyByZWplY3QocmVhc29uKSB9XG4gICAgKVxuICB9KVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBfZXhlY3V0ZUFzeW5jIChhcHAsIGNvbW1hbmQsIHBhcm1zLCBvcHRzLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xuICB2YXIgdmVyYm9zZSA9IG9wdGlvbnMudmVyYm9zZVxuICB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgLy9jb25zdCBERUZBVUxUX1NVQlNUUlMgPSBbJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gUHJvY2Vzc2luZycsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBTZXJ2ZXJcIiwgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gIGNvbnN0IERFRkFVTFRfU1VCU1RSUyA9IFtcIltJTkZdIHhTZXJ2ZXJcIiwgJ1tJTkZdIExvYWRpbmcnLCAnW0lORl0gQXBwZW5kJywgJ1tJTkZdIFByb2Nlc3NpbmcnLCAnW0lORl0gUHJvY2Vzc2luZyBCdWlsZCcsICdbTE9HXSBGYXNoaW9uIGJ1aWxkIGNvbXBsZXRlJywgJ1tFUlJdJywgJ1tXUk5dJywgXCJbSU5GXSBXcml0aW5nXCIsIFwiW0lORl0gTG9hZGluZyBCdWlsZFwiLCBcIltJTkZdIFdhaXRpbmdcIiwgXCJbTE9HXSBGYXNoaW9uIHdhaXRpbmdcIl07XG4gIHZhciBzdWJzdHJpbmdzID0gREVGQVVMVF9TVUJTVFJTXG4gIHZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbiAgY29uc3QgY3Jvc3NTcGF3biA9IHJlcXVpcmUoJ2Nyb3NzLXNwYXduLXdpdGgta2lsbCcpXG4gIGxvZ3YodmVyYm9zZSwgJ0ZVTkNUSU9OIF9leGVjdXRlQXN5bmMnKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbG9ndih2ZXJib3NlLGBjb21tYW5kIC0gJHtjb21tYW5kfWApXG4gICAgbG9ndih2ZXJib3NlLCBgcGFybXMgLSAke3Bhcm1zfWApXG4gICAgbG9ndih2ZXJib3NlLCBgb3B0cyAtICR7SlNPTi5zdHJpbmdpZnkob3B0cyl9YClcbiAgICB2YXJzLmNoaWxkID0gY3Jvc3NTcGF3bihjb21tYW5kLCBwYXJtcywgb3B0cylcblxuICAgIHZhcnMuY2hpbGQub24oJ2Nsb3NlJywgKGNvZGUsIHNpZ25hbCkgPT4ge1xuICAgICAgbG9ndih2ZXJib3NlLCBgb24gY2xvc2U6IGAgKyBjb2RlKVxuICAgICAgaWYoY29kZSA9PT0gMCkgeyByZXNvbHZlKDApIH1cbiAgICAgIGVsc2UgeyBjb21waWxhdGlvbi5lcnJvcnMucHVzaCggbmV3IEVycm9yKGNvZGUpICk7IHJlc29sdmUoMCkgfVxuICAgIH0pXG4gICAgdmFycy5jaGlsZC5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAgIGxvZ3YodmVyYm9zZSwgYG9uIGVycm9yYClcbiAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGVycm9yKVxuICAgICAgcmVzb2x2ZSgwKVxuICAgIH0pXG4gICAgdmFycy5jaGlsZC5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgdmFyIHN0ciA9IGRhdGEudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCBcIiBcIikudHJpbSgpXG4gICAgICBsb2d2KHZlcmJvc2UsIGAke3N0cn1gKVxuICAgICAgLy9pZiAoZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkubWF0Y2goL0Zhc2hpb24gd2FpdGluZyBmb3IgY2hhbmdlc1xcLlxcLlxcLi8pKSB7XG4gICAgICBpZiAoZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkubWF0Y2goL2FpdGluZyBmb3IgY2hhbmdlc1xcLlxcLlxcLi8pKSB7XG5cbi8vICAgICAgICAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4vLyAgICAgICAgICAgdmFyIGZpbGVuYW1lID0gcHJvY2Vzcy5jd2QoKSArIHZhcnMudG91Y2hGaWxlO1xuLy8gICAgICAgICAgIHRyeSB7XG4vLyAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKVxuLy8gICAgICAgICAgICAgdmFyIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUpO1xuLy8gICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgJy8vJyArIGQsICd1dGY4Jyk7XG4vLyAgICAgICAgICAgICBsb2d2KGFwcCwgYHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICAgIGNhdGNoKGUpIHtcbi8vICAgICAgICAgICAgIGxvZ3YoYXBwLCBgTk9UIHRvdWNoaW5nICR7ZmlsZW5hbWV9YCk7XG4vLyAgICAgICAgICAgfVxuXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0lORl1cIiwgXCJcIilcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbTE9HXVwiLCBcIlwiKVxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJykudHJpbSgpXG4gICAgICAgIGlmIChzdHIuaW5jbHVkZXMoXCJbRVJSXVwiKSkge1xuICAgICAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGFwcCArIHN0ci5yZXBsYWNlKC9eXFxbRVJSXFxdIC9naSwgJycpKTtcbiAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltFUlJdXCIsIGAke2NoYWxrLnJlZChcIltFUlJdXCIpfWApXG4gICAgICAgIH1cbiAgICAgICAgbG9nKGFwcCwgc3RyKVxuXG4gICAgICAgIHZhcnMuY2FsbGJhY2soKVxuICAgICAgICByZXNvbHZlKDApXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKHN1YnN0cmluZ3Muc29tZShmdW5jdGlvbih2KSB7IHJldHVybiBkYXRhLmluZGV4T2YodikgPj0gMDsgfSkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShcIltJTkZdXCIsIFwiXCIpXG4gICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoXCJbTE9HXVwiLCBcIlwiKVxuICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKS50cmltKClcbiAgICAgICAgICBpZiAoc3RyLmluY2x1ZGVzKFwiW0VSUl1cIikpIHtcbiAgICAgICAgICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKGFwcCArIHN0ci5yZXBsYWNlKC9eXFxbRVJSXFxdIC9naSwgJycpKTtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKFwiW0VSUl1cIiwgYCR7Y2hhbGsucmVkKFwiW0VSUl1cIil9YClcbiAgICAgICAgICB9XG4gICAgICAgICAgbG9nKGFwcCwgc3RyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICB2YXJzLmNoaWxkLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICBsb2d2KG9wdGlvbnMsIGBlcnJvciBvbiBjbG9zZTogYCArIGRhdGEpXG4gICAgICB2YXIgc3RyID0gZGF0YS50b1N0cmluZygpLnJlcGxhY2UoL1xccj9cXG58XFxyL2csIFwiIFwiKS50cmltKClcbiAgICAgIHZhciBzdHJKYXZhT3B0cyA9IFwiUGlja2VkIHVwIF9KQVZBX09QVElPTlNcIjtcbiAgICAgIHZhciBpbmNsdWRlcyA9IHN0ci5pbmNsdWRlcyhzdHJKYXZhT3B0cylcbiAgICAgIGlmICghaW5jbHVkZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coYCR7YXBwfSAke2NoYWxrLnJlZChcIltFUlJdXCIpfSAke3N0cn1gKVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG59XG5cbi8vKioqKioqKioqKlxuZnVuY3Rpb24gcnVuU2NyaXB0KHNjcmlwdFBhdGgsIGNhbGxiYWNrKSB7XG4gIHZhciBjaGlsZFByb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG4gIC8vIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBjYWxsYmFjayBoYXMgYmVlbiBpbnZva2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgaW52b2NhdGlvbnNcbiAgdmFyIGludm9rZWQgPSBmYWxzZTtcbiAgdmFyIHByb2Nlc3MgPSBjaGlsZFByb2Nlc3MuZm9yayhzY3JpcHRQYXRoLCBbXSwgeyBleGVjQXJndiA6IFsnLS1pbnNwZWN0PTAnXSB9KTtcbiAgLy8gbGlzdGVuIGZvciBlcnJvcnMgYXMgdGhleSBtYXkgcHJldmVudCB0aGUgZXhpdCBldmVudCBmcm9tIGZpcmluZ1xuICBwcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoaW52b2tlZCkgcmV0dXJuO1xuICAgIGludm9rZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xuICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjayBvbmNlIHRoZSBwcm9jZXNzIGhhcyBmaW5pc2hlZCBydW5uaW5nXG4gIHByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZSkge1xuICAgIGlmIChpbnZva2VkKSByZXR1cm47XG4gICAgaW52b2tlZCA9IHRydWU7XG4gICAgdmFyIGVyciA9IGNvZGUgPT09IDAgPyBudWxsIDogbmV3IEVycm9yKCdleGl0IGNvZGUgJyArIGNvZGUpO1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH0pO1xufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfdG9YdHlwZShzdHIpIHtcbiAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL18vZywgJy0nKVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBfZ2V0QXBwKCkge1xuICB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpXG4gIHZhciBwcmVmaXggPSBgYFxuICBjb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKVxuICBpZiAocGxhdGZvcm0gPT0gJ2RhcndpbicpIHsgcHJlZml4ID0gYOKEuSDvvaJleHTvvaM6YCB9XG4gIGVsc2UgeyBwcmVmaXggPSBgaSBbZXh0XTpgIH1cbiAgcmV0dXJuIGAke2NoYWxrLmdyZWVuKHByZWZpeCl9IGBcbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gX2dldFZlcnNpb25zKHBsdWdpbk5hbWUsIGZyYW1ld29ya05hbWUpIHtcbnRyeSB7XG4gIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gIHZhciB2ID0ge31cbiAgdmFyIGZyYW1ld29ya0luZm8gPSAnbi9hJ1xuXG4gIHYucGx1Z2luVmVyc2lvbiA9ICduL2EnO1xuICB2LmV4dFZlcnNpb24gPSAnbi9hJztcbiAgdi5lZGl0aW9uID0gJ24vYSc7XG4gIHYuY21kVmVyc2lvbiA9ICduL2EnO1xuICB2LndlYnBhY2tWZXJzaW9uID0gJ24vYSc7XG5cbiAgdmFyIHBsdWdpblBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL0BzZW5jaGEnLCBwbHVnaW5OYW1lKVxuICB2YXIgcGx1Z2luUGtnID0gKGZzLmV4aXN0c1N5bmMocGx1Z2luUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBsdWdpblBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LnBsdWdpblZlcnNpb24gPSBwbHVnaW5Qa2cudmVyc2lvblxuICB2Ll9yZXNvbHZlZCA9IHBsdWdpblBrZy5fcmVzb2x2ZWRcbiAgaWYgKHYuX3Jlc29sdmVkID09IHVuZGVmaW5lZCkge1xuICAgIHYuZWRpdGlvbiA9IGBDb21tZXJjaWFsYFxuICB9XG4gIGVsc2Uge1xuICAgIGlmICgtMSA9PSB2Ll9yZXNvbHZlZC5pbmRleE9mKCdjb21tdW5pdHknKSkge1xuICAgICAgdi5lZGl0aW9uID0gYENvbW1lcmNpYWxgXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdi5lZGl0aW9uID0gYENvbW11bml0eWBcbiAgICB9XG4gIH1cbiAgdmFyIHdlYnBhY2tQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy93ZWJwYWNrJylcbiAgdmFyIHdlYnBhY2tQa2cgPSAoZnMuZXhpc3RzU3luYyh3ZWJwYWNrUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHdlYnBhY2tQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi53ZWJwYWNrVmVyc2lvbiA9IHdlYnBhY2tQa2cudmVyc2lvblxuICB2YXIgZXh0UGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdub2RlX21vZHVsZXMvQHNlbmNoYS9leHQnKVxuICB2YXIgZXh0UGtnID0gKGZzLmV4aXN0c1N5bmMoZXh0UGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGV4dFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICB2LmV4dFZlcnNpb24gPSBleHRQa2cuc2VuY2hhLnZlcnNpb25cbiAgdmFyIGNtZFBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSxgbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgdmFyIGNtZFBrZyA9IChmcy5leGlzdHNTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhjbWRQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgdi5jbWRWZXJzaW9uID0gY21kUGtnLnZlcnNpb25fZnVsbFxuICBpZiAodi5jbWRWZXJzaW9uID09IHVuZGVmaW5lZCkge1xuICAgIHZhciBjbWRQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksYG5vZGVfbW9kdWxlcy9Ac2VuY2hhLyR7cGx1Z2luTmFtZX0vbm9kZV9tb2R1bGVzL0BzZW5jaGEvY21kYClcbiAgICB2YXIgY21kUGtnID0gKGZzLmV4aXN0c1N5bmMoY21kUGF0aCsnL3BhY2thZ2UuanNvbicpICYmIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNtZFBhdGgrJy9wYWNrYWdlLmpzb24nLCAndXRmLTgnKSkgfHwge30pO1xuICAgIHYuY21kVmVyc2lvbiA9IGNtZFBrZy52ZXJzaW9uX2Z1bGxcbiAgfVxuXG4gICBpZiAoZnJhbWV3b3JrTmFtZSAhPSB1bmRlZmluZWQgJiYgZnJhbWV3b3JrTmFtZSAhPSAnZXh0anMnKSB7XG4gICAgdmFyIGZyYW1ld29ya1BhdGggPSAnJ1xuICAgIGlmIChmcmFtZXdvcmtOYW1lID09ICdyZWFjdCcpIHtcbiAgICAgIGZyYW1ld29ya1BhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwnbm9kZV9tb2R1bGVzL3JlYWN0JylcbiAgICB9XG4gICAgaWYgKGZyYW1ld29ya05hbWUgPT0gJ2FuZ3VsYXInKSB7XG4gICAgICBmcmFtZXdvcmtQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ25vZGVfbW9kdWxlcy9AYW5ndWxhci9jb3JlJylcbiAgICB9XG4gICAgdmFyIGZyYW1ld29ya1BrZyA9IChmcy5leGlzdHNTeW5jKGZyYW1ld29ya1BhdGgrJy9wYWNrYWdlLmpzb24nKSAmJiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhmcmFtZXdvcmtQYXRoKycvcGFja2FnZS5qc29uJywgJ3V0Zi04JykpIHx8IHt9KTtcbiAgICB2LmZyYW1ld29ya1ZlcnNpb24gPSBmcmFtZXdvcmtQa2cudmVyc2lvblxuICAgIGlmICh2LmZyYW1ld29ya1ZlcnNpb24gPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmcmFtZXdvcmtJbmZvID0gJywgJyArIGZyYW1ld29ya05hbWVcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBmcmFtZXdvcmtJbmZvID0gJywgJyArIGZyYW1ld29ya05hbWUgKyAnIHYnICsgdi5mcmFtZXdvcmtWZXJzaW9uXG4gICAgfVxuICB9XG4gIHJldHVybiAnZXh0LXdlYnBhY2stcGx1Z2luIHYnICsgdi5wbHVnaW5WZXJzaW9uICsgJywgRXh0IEpTIHYnICsgdi5leHRWZXJzaW9uICsgJyAnICsgdi5lZGl0aW9uICsgJyBFZGl0aW9uLCBTZW5jaGEgQ21kIHYnICsgdi5jbWRWZXJzaW9uICsgJywgd2VicGFjayB2JyArIHYud2VicGFja1ZlcnNpb24gKyBmcmFtZXdvcmtJbmZvXG5cbn1cbmNhdGNoIChlKSB7XG4gIHJldHVybiAnZXh0LXdlYnBhY2stcGx1Z2luIHYnICsgdi5wbHVnaW5WZXJzaW9uICsgJywgRXh0IEpTIHYnICsgdi5leHRWZXJzaW9uICsgJyAnICsgdi5lZGl0aW9uICsgJyBFZGl0aW9uLCBTZW5jaGEgQ21kIHYnICsgdi5jbWRWZXJzaW9uICsgJywgd2VicGFjayB2JyArIHYud2VicGFja1ZlcnNpb24gKyBmcmFtZXdvcmtJbmZvXG59XG5cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9nKGFwcCxtZXNzYWdlKSB7XG4gIHZhciBzID0gYXBwICsgbWVzc2FnZVxuICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICB0cnkge3Byb2Nlc3Muc3Rkb3V0LmNsZWFyTGluZSgpfWNhdGNoKGUpIHt9XG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpO3Byb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxufVxuXG4vLyoqKioqKioqKipcbmV4cG9ydCBmdW5jdGlvbiBsb2doKGFwcCxtZXNzYWdlKSB7XG4gIHZhciBoID0gZmFsc2VcbiAgdmFyIHMgPSBhcHAgKyBtZXNzYWdlXG4gIGlmIChoID09IHRydWUpIHtcbiAgICByZXF1aXJlKCdyZWFkbGluZScpLmN1cnNvclRvKHByb2Nlc3Muc3Rkb3V0LCAwKVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzLnN0ZG91dC5jbGVhckxpbmUoKVxuICAgIH1cbiAgICBjYXRjaChlKSB7fVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHMpXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpXG4gIH1cbn1cblxuLy8qKioqKioqKioqXG5leHBvcnQgZnVuY3Rpb24gbG9ndih2ZXJib3NlLCBzKSB7XG4gIGlmICh2ZXJib3NlID09ICd5ZXMnKSB7XG4gICAgcmVxdWlyZSgncmVhZGxpbmUnKS5jdXJzb3JUbyhwcm9jZXNzLnN0ZG91dCwgMClcbiAgICB0cnkge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQuY2xlYXJMaW5lKClcbiAgICB9XG4gICAgY2F0Y2goZSkge31cbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShgLXZlcmJvc2U6ICR7c31gKVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKCdcXG4nKVxuICB9XG59XG5cbmZ1bmN0aW9uIF9nZXRWYWxpZGF0ZU9wdGlvbnMoKSB7XG4gIHJldHVybiB7XG4gICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgIFwiZnJhbWV3b3JrXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwidG9vbGtpdFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInRoZW1lXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiZW1pdFwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwic2NyaXB0XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwicG9ydFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJpbnRlZ2VyXCJdXG4gICAgICB9LFxuICAgICAgXCJwYWNrYWdlc1wiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIiwgXCJhcnJheVwiXVxuICAgICAgfSxcbiAgICAgIFwicHJvZmlsZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImVudmlyb25tZW50XCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ2RldmVsb3BtZW50JyBvciAncHJvZHVjdGlvbicgc3RyaW5nIHZhbHVlXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInRyZWVzaGFrZVwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiYnJvd3NlclwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwid2F0Y2hcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcInZlcmJvc2VcIjoge1xuICAgICAgICBcImVycm9yTWVzc2FnZVwiOiBcInNob3VsZCBiZSAneWVzJyBvciAnbm8nIHN0cmluZyB2YWx1ZSAoTk9UIHRydWUgb3IgZmFsc2UpXCIsXG4gICAgICAgIFwidHlwZVwiOiBbXCJzdHJpbmdcIl1cbiAgICAgIH0sXG4gICAgICBcImluamVjdFwiOiB7XG4gICAgICAgIFwiZXJyb3JNZXNzYWdlXCI6IFwic2hvdWxkIGJlICd5ZXMnIG9yICdubycgc3RyaW5nIHZhbHVlIChOT1QgdHJ1ZSBvciBmYWxzZSlcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiXVxuICAgICAgfSxcbiAgICAgIFwiaW50ZWxsaXNoYWtlXCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgJ3llcycgb3IgJ25vJyBzdHJpbmcgdmFsdWUgKE5PVCB0cnVlIG9yIGZhbHNlKVwiLFxuICAgICAgICBcInR5cGVcIjogW1wic3RyaW5nXCJdXG4gICAgICB9LFxuICAgICAgXCJjbWRvcHRzXCI6IHtcbiAgICAgICAgXCJlcnJvck1lc3NhZ2VcIjogXCJzaG91bGQgYmUgYSBzZW5jaGEgY21kIG9wdGlvbiBvciBhcmd1bWVudCBzdHJpbmdcIixcbiAgICAgICAgXCJ0eXBlXCI6IFtcInN0cmluZ1wiLCBcImFycmF5XCJdXG4gICAgICB9XG4gICAgfSxcbiAgICBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCI6IGZhbHNlXG4gIH07XG59XG5cblxuZnVuY3Rpb24gX2dldERlZmF1bHRPcHRpb25zKCkge1xuICByZXR1cm4ge1xuICAgIGZyYW1ld29yazogJ2V4dGpzJyxcbiAgICB0b29sa2l0OiAnbW9kZXJuJyxcbiAgICB0aGVtZTogJ3RoZW1lLW1hdGVyaWFsJyxcbiAgICBlbWl0OiAneWVzJyxcbiAgICBzY3JpcHQ6IG51bGwsXG4gICAgcG9ydDogMTk2MixcbiAgICBwYWNrYWdlczogW10sXG5cbiAgICBwcm9maWxlOiAnJyxcbiAgICBlbnZpcm9ubWVudDogJ2RldmVsb3BtZW50JyxcbiAgICB0cmVlc2hha2U6ICdubycsXG4gICAgYnJvd3NlcjogJ3llcycsXG4gICAgd2F0Y2g6ICd5ZXMnLFxuICAgIHZlcmJvc2U6ICdubycsXG4gICAgaW5qZWN0OiAneWVzJyxcbiAgICBpbnRlbGxpc2hha2U6ICd5ZXMnLFxuICAgIGNtZG9wdHM6ICcnXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNtYXJ0Rmxvd1BpbmcocGFja2FnZUpzb25QYXRoLCBhcHBKc29uUGF0aCkge1xuICBjb25zdCB7IGV4ZWMgfSA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcbiAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuXG4gIGZzLnJlYWRGaWxlKHBhY2thZ2VKc29uUGF0aCwgJ3V0ZjgnLCAoZXJyUGFja2FnZSwgZGF0YVBhY2thZ2UpID0+IHtcbiAgICBpZiAoZXJyUGFja2FnZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZShkYXRhUGFja2FnZSk7XG5cbiAgICBmcy5yZWFkRmlsZShhcHBKc29uUGF0aCwgJ3V0ZjgnLCAoZXJyQXBwLCBkYXRhQXBwKSA9PiB7XG4gICAgICBpZiAoZXJyQXBwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYXBwSnNvbiA9IEpTT04ucGFyc2UoZGF0YUFwcCk7XG4gICAgICBjb25zdCByZXF1aXJlc0FycmF5ID0gYXBwSnNvbi5yZXF1aXJlczsvLyBBc3N1bWluZyBhcHBKc29uLnJlcXVpcmVzIGlzIGFuIGFycmF5XG5cbiAgICAgIC8vIENvbnZlcnQgdGhlIGFycmF5IHRvIGEgc3RyaW5nXG4gICAgICBjb25zdCBtb2RpZmllZFN0cmluZyA9IHJlcXVpcmVzQXJyYXlbMF0ucmVwbGFjZSgvW1xcW1xcXSddKy9nLCAnJyk7XG5cbiAgICAgIGNvbnN0IGhvbWVEaXJlY3RvcnkgPSBwcm9jZXNzLmVudi5IT01FIHx8IHByb2Nlc3MuZW52LlVTRVJQUk9GSUxFO1xuXG4gICAgICAvLyBTcGVjaWZ5IHRoZSByZWxhdGl2ZSBwYXRoIGZyb20gdGhlIGhvbWUgZGlyZWN0b3J5IHRvIHlvdXIgZmlsZVxuICAgICAgY29uc3QgcmVsYXRpdmVGaWxlUGF0aCA9ICcubnBtcmMnO1xuXG4gICAgICAvLyBDb21iaW5lIHRoZSBob21lIGRpcmVjdG9yeSBhbmQgcmVsYXRpdmUgZmlsZSBwYXRoIHRvIGdldCB0aGUgZ2VuZXJhbGl6ZWQgZmlsZSBwYXRoXG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihob21lRGlyZWN0b3J5LCByZWxhdGl2ZUZpbGVQYXRoKTtcblxuICAgICAgZnMucmVhZEZpbGUoZmlsZVBhdGgsICd1dGY4JywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgcmVhZGluZyBmaWxlOiAke2Vyci5tZXNzYWdlfWApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWdpc3RyeVJlZ2V4ID0gL0BzZW5jaGE6cmVnaXN0cnk9KC4rKS87XG5cbiAgICAgICAgLy8gRXh0cmFjdCB0aGUgcmVnaXN0cnkgVVJMIHVzaW5nIHRoZSByZWd1bGFyIGV4cHJlc3Npb25cbiAgICAgICAgY29uc3QgbWF0Y2ggPSBkYXRhLm1hdGNoKHJlZ2lzdHJ5UmVnZXgpO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIGEgbWF0Y2ggaXMgZm91bmRcbiAgICAgICAgaWYgKG1hdGNoICYmIG1hdGNoWzFdKSB7XG4gICAgICAgICAgY29uc3QgcmVnaXN0cnlVcmwgPSBtYXRjaFsxXTtcbiAgICAgICAgICAvLyBVc2UgbnBtLWNvbmZpZyB0byBzZXQgdGhlIHJlZ2lzdHJ5IHRlbXBvcmFyaWx5IGZvciB0aGUgY3VycmVudCBwcm9jZXNzXG4gICAgICAgICAgcHJvY2Vzcy5lbnYubnBtX2NvbmZpZ19yZWdpc3RyeSA9IHJlZ2lzdHJ5VXJsO1xuXG4gICAgICAgICAgLy8gUnVuIHRoZSBucG0gd2hvYW1pIGNvbW1hbmRcbiAgICAgICAgICBleGVjKGBucG0gLS1yZWdpc3RyeSAke3JlZ2lzdHJ5VXJsfSB3aG9hbWlgLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB1c2VybmFtZSA9IGAke3N0ZG91dC50cmltKCkucmVwbGFjZSgnLi4nLCAnQCcpfWA7XG5cbiAgICAgICAgICAgIGxldCBhZGRpdGlvbmFsTGljZW5zZUluZm8gPSAnJztcbiAgICAgICAgICAgICAgbGV0IGxpY2Vuc2VkRmVhdHVyZSA9ICcnO1xuICAgICAgICAgICAgICBpZih1c2VybmFtZSE9bnVsbCl7XG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbExpY2Vuc2VJbmZvID0gJ1RoaXMgdmVyc2lvbiBvZiBTZW5jaGEgRXh0LWdlbiBpcyBsaWNlbnNlZCBjb21tZXJjaWFsbHknXG4gICAgICAgICAgICAgICAgbGljZW5zZWRGZWF0dXJlID0gJ0xFR0FMJ1xuICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsTGljZW5zZUluZm8gPSAnVGhpcyB2ZXJzaW9uIG9mIFNlbmNoYSBFeHQtZ2VuIGlzIG5vdCBsaWNlbnNlZCBjb21tZXJjaWFsbHknXG4gICAgICAgICAgICAgICAgbGljZW5zZWRGZWF0dXJlICA9ICdVTkxJQ0VOU0VEJ1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNjcmlwdFR5cGUgPSBwcm9jZXNzLmVudi5ucG1fbGlmZWN5Y2xlX2V2ZW50O1xuICAgICAgICAgICAgICAgICAgICAgIGxldCB0cmlnZ2VyZXZlbnQgPSAnYnVpbGQnO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHNjcmlwdFR5cGUgPT09ICdkZXYnIHx8IHNjcmlwdFR5cGUgPT09ICdkZXY6ZGVza3RvcCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJldmVudCA9IGBucG0gc3RhcnRgO1xuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2NyaXB0VHlwZSA9PT0gJ2J1aWxkJyB8fCBzY3JpcHRUeXBlID09PSAnYnVpbGQ6ZGVza3RvcCcgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyZXZlbnQgPSBgbnBtIHJ1biBidWlsZGA7XG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJldmVudCA9IGBudWxsYDtcbiAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGxpY2Vuc2VpbmZvID0gYFwibGljZW5zZT1Db21tZXJjaWFsLCBmcmFtZXdvcms9RVhUSlMsIExpY2Vuc2UgQ29udGVudCBUZXh0PVNlbmNoYSBSYXBpZEV4dEpTLUphdmFTY3JpcHQgTGlicmFyeSBDb3B5cmlnaHQsIFNlbmNoYSBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIGxpY2Vuc2luZ0BzZW5jaGEuY29tIG9wdGlvbnM6aHR0cDovL3d3dy5zZW5jaGEuY29tL2xpY2Vuc2UgbGljZW5zZTogaHR0cDovL3d3dy5zZW5jaGEuY29tL2xlZ2FsL3NlbmNoYS1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudCBDb21tZXJjaWFsIExpY2Vuc2UuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1TZW5jaGEgUmFwaWRFeHRKUyBpcyBsaWNlbnNlZCBjb21tZXJjaWFsbHkuIFNlZSBodHRwOi8vd3d3LnNlbmNoYS5jb20vbGVnYWwvc2VuY2hhLXNvZnR3YXJlLWxpY2Vuc2UtYWdyZWVtZW50IGZvciBsaWNlbnNlIHRlcm1zLkJldGEgTGljZW5zZS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBJZiB0aGlzIGlzIGEgQmV0YSB2ZXJzaW9uICwgdXNlIGlzIHBlcm1pdHRlZCBmb3IgaW50ZXJuYWwgZXZhbHVhdGlvbiBhbmQgcmV2aWV3IHB1cnBvc2VzIGFuZCBub3QgdXNlIGZvciBwcm9kdWN0aW9uIHB1cnBvc2VzLiBTZWUgaHR0cDovL3d3dy5zZW5jaGEuY29tL2xlZ2FsL3NlbmNoYS1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudCAoQmV0YSBMaWNlbnNlKSBmb3IgbGljZW5zZSB0ZXJtcy4gIFRoaXJkIFBhcnR5IENvbnRlbnQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1UaGUgZm9sbG93aW5nIHRoaXJkIHBhcnR5IHNvZnR3YXJlIGlzIGRpc3RyaWJ1dGVkIHdpdGggUmFwaWRFeHRKUyBhbmQgaXMgcHJvdmlkZWQgdW5kZXIgb3RoZXIgbGljZW5zZXMgYW5kL29yIGhhcyBzb3VyY2UgYXZhaWxhYmxlIGZyb20gb3RoZXIgbG9jYXRpb25zLiBMaWJyYXJ5OiBZVUkgMC42IChCU0QgTGljZW5zZWQpIGZvciBkcmFnLWFuZC1kcm9wIGNvZGUuIExvY2F0aW9uOiBodHRwOi8vZGV2ZWxvcGVyLnlhaG9vLmNvbS95dWkgTGljZW5zZTogaHR0cDovL2RldmVsb3Blci55YWhvby5jb20veXVpL2xpY2Vuc2UuaHRtbCAoQlNEIDMtQ2xhdXNlIExpY2Vuc2UpIExpYnJhcnk6IEpTT04gcGFyc2VyIExvY2F0aW9uOiBodHRwOi8vd3d3LkpTT04ub3JnL2pzLmh0bWwgTGljZW5zZTogaHR0cDovL3d3dy5qc29uLm9yZy9saWNlbnNlLmh0bWwgKE1JVCBMaWNlbnNlKSBMaWJyYXJ5OiBmbGV4aWJsZS1qcy1mb3JtYXR0aW5nIExvY2F0aW9uOiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvZmxleGlibGUtanMtZm9ybWF0dGluZy8gTGljZW5zZTogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHAgKE1JVCBMaWNlbnNlKSBMaWJyYXJ5OiBzcGFya2xpbmUuanMgTG9jYXRpb246IGh0dHA6Ly9vbW5pcG90ZW50Lm5ldC9qcXVlcnkuc3BhcmtsaW5lIExpY2Vuc2UgIGh0dHA6Ly9vbW5pcG90ZW50Lm5ldC9qcXVlcnkuc3BhcmtsaW5lIChCU0QgMy1DbGF1c2UgTGljZW5zZSkgTGlicmFyeTogRGVmdEpTIExvY2F0aW9uOiBodHRwOi8vZGVmdGpzLm9yZy8gTGljZW5zZTogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHAgKE1JVCBMaWNlbnNlKSBMaWJyYXJ5OiBPcGVuLVNhbnMgTG9jYXRpb246IGh0dHA6Ly93d3cuZm9udHNxdWlycmVsLmNvbS9mb250cy9vcGVuLXNhbnMgTGljZW5zZTogIGh0dHA6Ly93d3cuZm9udHNxdWlycmVsLmNvbS9mb250cy9vcGVuLXNhbnMgKEFwYWNoZSAyLjAgTGljZW5zZSkgRXhhbXBsZXM6IExpYnJhcnk6IFNpbGsgSWNvbnMgTG9jYXRpb246IGh0dHA6Ly93d3cuZmFtZmFtZmFtLmNvbS9sYWIvaWNvbnMvc2lsay8gTGljZW5zZTogaHR0cDovL3d3dy5mYW1mYW1mYW0uY29tL2xhYi9pY29ucy9zaWxrLyAoQ3JlYXRpdmUgQ29tbW9ucyBBdHRyaWJ1dGlvbiAyLjUgTGljZW5zZSkgTGlicmFyeTogRm9udCBBd2Vzb21lIENTUyBMb2NhdGlvbjogaHR0cDovL2ZvbnRhd2Vzb21lLmlvLyBMaWNlbnNlOiBodHRwOi8vZm9udGF3ZXNvbWUuaW8vMy4yLjEvbGljZW5zZS8gKE1JVCkgTGlicmFyeTogTWF0ZXJpYWwgRGVzaWduIEljb25zIExvY2F0aW9uOiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL21hdGVyaWFsLWRlc2lnbi1pY29ucyBMaWNlbnNlOiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL21hdGVyaWFsLWRlc2lnbi1pY29ucy9ibG9iL21hc3Rlci9MSUNFTlNFIChBcGFjaGUpIFRISVMgU09GVFdBUkUgSVMgRElTVFJJQlVURUQgJ0FTLUlTJyBXSVRIT1VUIEFOWSBXQVJSQU5USUVTLCBDT05ESVRJT05TIEFORCBSRVBSRVNFTlRBVElPTlMgV0hFVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gVEhFIElNUExJRUQgV0FSUkFOVElFUyBBTkQgQ09ORElUSU9OUyBPRiBNRVJDSEFOVEFCSUxJVFksIE1FUkNIQU5UQUJMRSBRVUFMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSwgRFVSQUJJTElUWSwgTk9OLUlORlJJTkdFTUVOVCwgUEVSRk9STUFOQ0UgQU5EIFRIT1NFIEFSSVNJTkcgQlkgU1RBVFVURSBPUiBGUk9NIENVU1RPTSBPUiBVU0FHRSBPRiBUUkFERSBPUiBDT1VSU0UgT0YgREVBTElORy4gLCBtZXNzYWdlPVRoaXMgdmVyc2lvbiBvZiBTZW5jaGEgUmFwaWRFeHRKUyBpcyBsaWNlbnNlZCBjb21tZXJjaWFsbHkgXCJgO1xuICAgICAgICAgICAgY29uc3QgamFyUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdyZXNvdXJjZXMnLCAndXRpbHMuamFyJyk7XG4gICAgICAgICAgICBjb25zdCBmZWF0dXJlc1VzZWQgPSBgZXh0LWdlbiwgJHttb2RpZmllZFN0cmluZ31gO1xuXG4gICAgICAgICAgICBjb25zdCBlbmNyeXB0ZWRMaWNlbnNlID0gYnRvYShsaWNlbnNlaW5mbyk7XG5cbiAgICAgICAgICAgICAgY29uc3QgY29tbWFuZCA9IGBqYXZhIC1qYXIgJHtqYXJQYXRofSBgICtcbiAgICAgICAgICAgICAgICAgYC1wcm9kdWN0IGV4dC1nZW4gLXByb2R1Y3RWZXJzaW9uICR7cGFja2FnZUpzb24udmVyc2lvbn0gYCArXG4gICAgICAgICAgICAgICAgIGAtZXZlbnRUeXBlIExFR0FMIC10cmlnZ2VyICR7dHJpZ2dlcmV2ZW50fSBgICtcbiAgICAgICAgICAgICAgICAgYC1saWNlbnNlZFRvICR7dXNlcm5hbWV9IGAgK1xuICAgICAgICAgICAgICAgICBgLWN1c3RvbTIgaXNWYWxpZD10cnVlIC1jdXN0b20zIGlzVHJpYWw9ZmFsc2UgLWN1c3RvbTQgaXNFeHBpcmVkPWZhbHNlIC1tb2RlIHJhcGlkIGAgK1xuICAgICAgICAgICAgICAgICBgLXZhbGlkTGljZW5zZUluZm8gJHtlbmNyeXB0ZWRMaWNlbnNlfSAtZmVhdHVyZXNVc2VkICR7ZmVhdHVyZXNVc2VkfSAtbGljZW5zZWRGZWF0dXJlICR7bGljZW5zZWRGZWF0dXJlfSAtcGlyYWN5TGljZW5zZUluZm8gJHthZGRpdGlvbmFsTGljZW5zZUluZm99YDtcblxuICAgICAgICAgICAgZXhlYyhjb21tYW5kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoc3RkZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrQ0FDQSxxSkFBQUEsbUJBQUEsWUFBQUEsQ0FBQSxXQUFBQyxDQUFBLFNBQUFDLENBQUEsRUFBQUQsQ0FBQSxPQUFBRSxDQUFBLEdBQUFDLE1BQUEsQ0FBQUMsU0FBQSxFQUFBQyxDQUFBLEdBQUFILENBQUEsQ0FBQUksY0FBQSxFQUFBQyxDQUFBLEdBQUFKLE1BQUEsQ0FBQUssY0FBQSxjQUFBUCxDQUFBLEVBQUFELENBQUEsRUFBQUUsQ0FBQSxJQUFBRCxDQUFBLENBQUFELENBQUEsSUFBQUUsQ0FBQSxDQUFBTyxLQUFBLEtBQUFDLENBQUEsd0JBQUFDLE1BQUEsR0FBQUEsTUFBQSxPQUFBQyxDQUFBLEdBQUFGLENBQUEsQ0FBQUcsUUFBQSxrQkFBQUMsQ0FBQSxHQUFBSixDQUFBLENBQUFLLGFBQUEsdUJBQUFDLENBQUEsR0FBQU4sQ0FBQSxDQUFBTyxXQUFBLDhCQUFBQyxPQUFBakIsQ0FBQSxFQUFBRCxDQUFBLEVBQUFFLENBQUEsV0FBQUMsTUFBQSxDQUFBSyxjQUFBLENBQUFQLENBQUEsRUFBQUQsQ0FBQSxJQUFBUyxLQUFBLEVBQUFQLENBQUEsRUFBQWlCLFVBQUEsTUFBQUMsWUFBQSxNQUFBQyxRQUFBLFNBQUFwQixD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