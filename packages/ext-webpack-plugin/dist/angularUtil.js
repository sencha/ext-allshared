"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._extractFromSource = _extractFromSource;
exports._getAllComponents = _getAllComponents;
exports._getDefaultVars = _getDefaultVars;
exports._toDev = _toDev;
exports._toProd = _toProd;
exports._writeFilesToProdFolder = _writeFilesToProdFolder;
function _getDefaultVars() {
  return {
    touchFile: '/src/themer.ts',
    watchStarted: false,
    buildstep: '1 of 1',
    firstTime: true,
    firstCompile: true,
    browserCount: 0,
    manifest: null,
    extPath: 'ext',
    pluginErrors: [],
    deps: [],
    usedExtComponents: [],
    rebuild: true
  };
}
function _extractFromSource(module, options, compilation, extComponents) {
  const logv = require('./pluginUtil').logv;
  const verbose = options.verbose;
  logv(verbose, 'FUNCTION _extractFromSource');
  var js = module._source._value;
  var statements = [];
  var generate = require("@babel/generator").default;
  var parse = require("babylon").parse;
  var traverse = require("ast-traverse");
  var ast = parse(js, {
    plugins: ['typescript', 'flow', 'doExpressions', 'objectRestSpread', 'classProperties', 'exportDefaultFrom', 'exportExtensions', 'asyncGenerators', 'functionBind', 'functionSent', 'dynamicImport'],
    sourceType: 'module'
  });
  traverse(ast, {
    pre: function (node) {
      if (node.type === 'CallExpression' && node.callee && node.callee.object && node.callee.object.name === 'Ext') {
        statements.push(generate(node).code);
      }
      if (node.type === 'StringLiteral') {
        let code = node.value;
        for (var i = 0; i < code.length; ++i) {
          if (code.charAt(i) == '<') {
            if (code.substr(i, 4) == '<!--') {
              i += 4;
              i += code.substr(i).indexOf('-->') + 3;
            } else if (code.charAt(i + 1) !== '/') {
              var start = code.substring(i);
              var spaceEnd = start.indexOf(' ');
              var newlineEnd = start.indexOf('\n');
              var tagEnd = start.indexOf('>');
              var end = Math.min(spaceEnd, newlineEnd, tagEnd);
              if (end >= 0) {
                //changed this from 1 to five when adding ext- to elements
                var xtype = require('./pluginUtil')._toXtype(start.substring(5, end));
                if (extComponents.includes(xtype)) {
                  var theValue = node.value.toLowerCase();
                  if (theValue.indexOf('doctype html') == -1) {
                    var type = {
                      xtype: xtype
                    };
                    let config = JSON.stringify(type);
                    statements.push(`Ext.create(${config})`);
                  }
                }
                i += end;
              }
            }
          }
        }
      }
    }
  });
  return statements;
}
function changeIt(o) {
  const path = require('path');
  const fsx = require('fs-extra');
  const wherePath = path.resolve(process.cwd(), o.where);
  var js = fsx.readFileSync(wherePath).toString();
  var newJs = js.replace(o.from, o.to);
  fsx.writeFileSync(wherePath, newJs, 'utf-8', () => {
    return;
  });
}
function _toProd(vars, options) {
  const log = require('./pluginUtil').log;
  const logv = require('./pluginUtil').logv;
  logv(options.verbose, 'FUNCTION _toProd');
  const fsx = require('fs-extra');
  const fs = require('fs');
  const mkdirp = require('mkdirp');
  const path = require('path');
  const toolkit = 'modern';
  const Toolkit = toolkit.charAt(0).toUpperCase() + toolkit.slice(1);
  const pathExtAngularProd = path.resolve(process.cwd(), `src/app/ext-angular-${toolkit}-prod`);
  if (!fs.existsSync(pathExtAngularProd)) {
    mkdirp.sync(pathExtAngularProd);
    const t = require('./artifacts').extAngularModule('', '', '');
    fsx.writeFileSync(`${pathExtAngularProd}/ext-angular-${toolkit}.module.ts`, t, 'utf-8', () => {
      return;
    });
  }
  var o = {};
  o.where = 'src/app/app.module.ts';
  o.from = `import { ExtAngular${Toolkit}Module } from '@sencha/ext-angular-${toolkit}'`;
  o.to = `import { ExtAngular${Toolkit}Module } from './ext-angular-${toolkit}-prod/ext-angular-${toolkit}.module'`;
  changeIt(o);

  //   o = {}
  //   o.where = 'src/main.ts'
  //   o.from = `bootstrapModule( AppModule );`
  //   o.to = `enableProdMode();bootstrapModule(AppModule);`
  //   changeIt(o)
}
function _toDev(vars, options) {
  const log = require('./pluginUtil').log;
  const logv = require('./pluginUtil').logv;
  logv(options.verbose, 'FUNCTION _toDev');
  const path = require('path');
  const toolkit = 'modern';
  const Toolkit = toolkit.charAt(0).toUpperCase() + toolkit.slice(1);
  const pathExtAngularProd = path.resolve(process.cwd(), `src/app/ext-angular-${toolkit}-prod`);
  require('rimraf').sync(pathExtAngularProd);
  var o = {};
  o.where = 'src/app/app.module.ts';
  o.from = `import { ExtAngular-${Toolkit}Module } from './ext-angular-${toolkit}-prod/ext-angular-${toolkit}.module'`;
  o.to = `import { ExtAngular-${Toolkit}Module } from '@sencha/ext-angular-${toolkit}'`;
  changeIt(o);

  //   o = {}
  //   o.where = 'src/main.ts'
  //   o.from = `enableProdMode();bootstrapModule(AppModule);`
  //   o.to = `bootstrapModule( AppModule );`
  //   changeIt(o)
}
function _getAllComponents(vars, options) {
  const log = require('./pluginUtil').log;
  const logv = require('./pluginUtil').logv;
  logv(options.verbose, 'FUNCTION _getAllComponents');
  const path = require('path');
  const fsx = require('fs-extra');
  const toolkit = 'modern';
  const Toolkit = toolkit.charAt(0).toUpperCase() + toolkit.slice(1);

  //    log(vars.app, `Getting all referenced ext-${options.framework} modules`)
  var extComponents = [];
  const packageLibPath = path.resolve(process.cwd(), `node_modules/@sencha/ext-angular-${toolkit}/lib`);
  var files = fsx.readdirSync(packageLibPath);
  files.forEach(fileName => {
    // if (fileName && fileName.substr(0, 4) == 'ext-') {
    //   var end = fileName.substr(4).indexOf('.component')
    //   if (end >= 0) {
    //     extComponents.push(fileName.substring(4, end + 4))
    //   }
    // }

    if (fileName && fileName.substr(0, 3) == 'Ext') {
      var end = fileName.substr(3).indexOf('.ts');
      if (end >= 0) {
        extComponents.push(fileName.substring(3, end + 3).toLowerCase());
      }
    }
  });
  log(vars.app, `Writing all referenced ext-${options.framework} modules`);
  return extComponents;
}
function _writeFilesToProdFolder(vars, options) {
  const log = require('./pluginUtil').log;
  const logv = require('./pluginUtil').logv;
  logv(options.verbose, 'FUNCTION _writeFilesToProdFolder');
  const path = require('path');
  const fsx = require('fs-extra');
  const toolkit = 'modern';
  const Toolkit = toolkit.charAt(0).toUpperCase() + toolkit.slice(1);
  const packageLibPath = path.resolve(process.cwd(), `node_modules/@sencha/ext-angular-${toolkit}/lib`);
  const pathToExtAngularProd = path.resolve(process.cwd(), `src/app/ext-angular-${toolkit}-prod`);
  const string = 'Ext.create({\"xtype\":\"';
  vars.deps.forEach(code => {
    var index = code.indexOf(string);
    if (index >= 0) {
      code = code.substring(index + string.length);
      var end = code.indexOf('\"');
      vars.usedExtComponents.push(code.substr(0, end));
    }
  });
  vars.usedExtComponents = [...new Set(vars.usedExtComponents)];
  var writeToPathWritten = false;
  var moduleVars = {
    imports: '',
    exports: '',
    declarations: ''
  };
  vars.usedExtComponents.forEach(xtype => {
    var capclassname = xtype.charAt(0).toUpperCase() + xtype.replace(/-/g, "_").slice(1);
    moduleVars.imports = moduleVars.imports + `import { Ext${capclassname}Component } from './ext-${xtype}.component';\n`;
    moduleVars.exports = moduleVars.exports + `    Ext${capclassname}Component,\n`;
    moduleVars.declarations = moduleVars.declarations + `    Ext${capclassname}Component,\n`;
    var classFile = `ext-${xtype}.component.ts`;
    const contents = fsx.readFileSync(`${packageLibPath}/${classFile}`).toString();
    fsx.writeFileSync(`${pathToExtAngularProd}/${classFile}`, contents, 'utf-8', () => {
      return;
    });
    writeToPathWritten = true;
  });
  if (writeToPathWritten) {
    var t = require('./artifacts').extAngularModule(moduleVars.imports, moduleVars.exports, moduleVars.declarations);
    fsx.writeFileSync(`${pathToExtAngularProd}/ext-angular-${toolkit}.module.ts`, t, 'utf-8', () => {
      return;
    });
  }
  const baseContent = fsx.readFileSync(`${packageLibPath}/eng-base.ts`).toString();
  fsx.writeFileSync(`${pathToExtAngularProd}/eng-base.ts`, baseContent, 'utf-8', () => {
    return;
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsIl9leHRyYWN0RnJvbVNvdXJjZSIsIl9nZXRBbGxDb21wb25lbnRzIiwiX2dldERlZmF1bHRWYXJzIiwiX3RvRGV2IiwiX3RvUHJvZCIsIl93cml0ZUZpbGVzVG9Qcm9kRm9sZGVyIiwidG91Y2hGaWxlIiwid2F0Y2hTdGFydGVkIiwiYnVpbGRzdGVwIiwiZmlyc3RUaW1lIiwiZmlyc3RDb21waWxlIiwiYnJvd3NlckNvdW50IiwibWFuaWZlc3QiLCJleHRQYXRoIiwicGx1Z2luRXJyb3JzIiwiZGVwcyIsInVzZWRFeHRDb21wb25lbnRzIiwicmVidWlsZCIsIm1vZHVsZSIsIm9wdGlvbnMiLCJjb21waWxhdGlvbiIsImV4dENvbXBvbmVudHMiLCJsb2d2IiwicmVxdWlyZSIsInZlcmJvc2UiLCJqcyIsIl9zb3VyY2UiLCJfdmFsdWUiLCJzdGF0ZW1lbnRzIiwiZ2VuZXJhdGUiLCJkZWZhdWx0IiwicGFyc2UiLCJ0cmF2ZXJzZSIsImFzdCIsInBsdWdpbnMiLCJzb3VyY2VUeXBlIiwicHJlIiwibm9kZSIsInR5cGUiLCJjYWxsZWUiLCJvYmplY3QiLCJuYW1lIiwicHVzaCIsImNvZGUiLCJpIiwibGVuZ3RoIiwiY2hhckF0Iiwic3Vic3RyIiwiaW5kZXhPZiIsInN0YXJ0Iiwic3Vic3RyaW5nIiwic3BhY2VFbmQiLCJuZXdsaW5lRW5kIiwidGFnRW5kIiwiZW5kIiwiTWF0aCIsIm1pbiIsInh0eXBlIiwiX3RvWHR5cGUiLCJpbmNsdWRlcyIsInRoZVZhbHVlIiwidG9Mb3dlckNhc2UiLCJjb25maWciLCJKU09OIiwic3RyaW5naWZ5IiwiY2hhbmdlSXQiLCJvIiwicGF0aCIsImZzeCIsIndoZXJlUGF0aCIsInJlc29sdmUiLCJwcm9jZXNzIiwiY3dkIiwid2hlcmUiLCJyZWFkRmlsZVN5bmMiLCJ0b1N0cmluZyIsIm5ld0pzIiwicmVwbGFjZSIsImZyb20iLCJ0byIsIndyaXRlRmlsZVN5bmMiLCJ2YXJzIiwibG9nIiwiZnMiLCJta2RpcnAiLCJ0b29sa2l0IiwiVG9vbGtpdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJwYXRoRXh0QW5ndWxhclByb2QiLCJleGlzdHNTeW5jIiwic3luYyIsInQiLCJleHRBbmd1bGFyTW9kdWxlIiwicGFja2FnZUxpYlBhdGgiLCJmaWxlcyIsInJlYWRkaXJTeW5jIiwiZm9yRWFjaCIsImZpbGVOYW1lIiwiYXBwIiwiZnJhbWV3b3JrIiwicGF0aFRvRXh0QW5ndWxhclByb2QiLCJzdHJpbmciLCJpbmRleCIsIlNldCIsIndyaXRlVG9QYXRoV3JpdHRlbiIsIm1vZHVsZVZhcnMiLCJpbXBvcnRzIiwiZGVjbGFyYXRpb25zIiwiY2FwY2xhc3NuYW1lIiwiY2xhc3NGaWxlIiwiY29udGVudHMiLCJiYXNlQ29udGVudCJdLCJzb3VyY2VzIjpbIi4uL3NyYy9hbmd1bGFyVXRpbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuXG5leHBvcnQgZnVuY3Rpb24gX2dldERlZmF1bHRWYXJzKCkge1xuICByZXR1cm4ge1xuICAgIHRvdWNoRmlsZTogJy9zcmMvdGhlbWVyLnRzJyxcbiAgICB3YXRjaFN0YXJ0ZWQgOiBmYWxzZSxcbiAgICBidWlsZHN0ZXA6ICcxIG9mIDEnLFxuICAgIGZpcnN0VGltZSA6IHRydWUsXG4gICAgZmlyc3RDb21waWxlOiB0cnVlLFxuICAgIGJyb3dzZXJDb3VudCA6IDAsXG4gICAgbWFuaWZlc3Q6IG51bGwsXG4gICAgZXh0UGF0aDogJ2V4dCcsXG4gICAgcGx1Z2luRXJyb3JzOiBbXSxcbiAgICBkZXBzOiBbXSxcbiAgICB1c2VkRXh0Q29tcG9uZW50czogW10sXG4gICAgcmVidWlsZDogdHJ1ZVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cykge1xuICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICBjb25zdCB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gIGxvZ3YodmVyYm9zZSwnRlVOQ1RJT04gX2V4dHJhY3RGcm9tU291cmNlJylcbiAgdmFyIGpzID0gbW9kdWxlLl9zb3VyY2UuX3ZhbHVlXG5cbiAgdmFyIHN0YXRlbWVudHMgPSBbXVxuXG4gIHZhciBnZW5lcmF0ZSA9IHJlcXVpcmUoXCJAYmFiZWwvZ2VuZXJhdG9yXCIpLmRlZmF1bHRcbiAgdmFyIHBhcnNlID0gcmVxdWlyZShcImJhYnlsb25cIikucGFyc2VcbiAgdmFyIHRyYXZlcnNlID0gcmVxdWlyZShcImFzdC10cmF2ZXJzZVwiKVxuXG4gIHZhciBhc3QgPSBwYXJzZShqcywge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgICd0eXBlc2NyaXB0JyxcbiAgICAgICdmbG93JyxcbiAgICAgICdkb0V4cHJlc3Npb25zJyxcbiAgICAgICdvYmplY3RSZXN0U3ByZWFkJyxcbiAgICAgICdjbGFzc1Byb3BlcnRpZXMnLFxuICAgICAgJ2V4cG9ydERlZmF1bHRGcm9tJyxcbiAgICAgICdleHBvcnRFeHRlbnNpb25zJyxcbiAgICAgICdhc3luY0dlbmVyYXRvcnMnLFxuICAgICAgJ2Z1bmN0aW9uQmluZCcsXG4gICAgICAnZnVuY3Rpb25TZW50JyxcbiAgICAgICdkeW5hbWljSW1wb3J0J1xuICAgIF0sXG4gICAgc291cmNlVHlwZTogJ21vZHVsZSdcbiAgfSlcblxuICB0cmF2ZXJzZShhc3QsIHtcbiAgICBwcmU6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICBpZiAobm9kZS50eXBlID09PSAnQ2FsbEV4cHJlc3Npb24nICYmIG5vZGUuY2FsbGVlICYmIG5vZGUuY2FsbGVlLm9iamVjdCAmJiBub2RlLmNhbGxlZS5vYmplY3QubmFtZSA9PT0gJ0V4dCcpIHtcbiAgICAgICAgc3RhdGVtZW50cy5wdXNoKGdlbmVyYXRlKG5vZGUpLmNvZGUpXG4gICAgICB9XG4gICAgICBpZihub2RlLnR5cGUgPT09ICdTdHJpbmdMaXRlcmFsJykge1xuICAgICAgICBsZXQgY29kZSA9IG5vZGUudmFsdWVcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2RlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgaWYgKGNvZGUuY2hhckF0KGkpID09ICc8Jykge1xuICAgICAgICAgICAgaWYgKGNvZGUuc3Vic3RyKGksIDQpID09ICc8IS0tJykge1xuICAgICAgICAgICAgICBpICs9IDRcbiAgICAgICAgICAgICAgaSArPSBjb2RlLnN1YnN0cihpKS5pbmRleE9mKCctLT4nKSArIDNcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29kZS5jaGFyQXQoaSsxKSAhPT0gJy8nKSB7XG4gICAgICAgICAgICAgIHZhciBzdGFydCA9IGNvZGUuc3Vic3RyaW5nKGkpXG4gICAgICAgICAgICAgIHZhciBzcGFjZUVuZCA9IHN0YXJ0LmluZGV4T2YoJyAnKVxuICAgICAgICAgICAgICB2YXIgbmV3bGluZUVuZCA9IHN0YXJ0LmluZGV4T2YoJ1xcbicpXG4gICAgICAgICAgICAgIHZhciB0YWdFbmQgPSBzdGFydC5pbmRleE9mKCc+JylcbiAgICAgICAgICAgICAgdmFyIGVuZCA9IE1hdGgubWluKHNwYWNlRW5kLCBuZXdsaW5lRW5kLCB0YWdFbmQpXG4gICAgICAgICAgICAgIGlmIChlbmQgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgLy9jaGFuZ2VkIHRoaXMgZnJvbSAxIHRvIGZpdmUgd2hlbiBhZGRpbmcgZXh0LSB0byBlbGVtZW50c1xuICAgICAgICAgICAgICAgIHZhciB4dHlwZSA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLl90b1h0eXBlKHN0YXJ0LnN1YnN0cmluZyg1LCBlbmQpKVxuICAgICAgICAgICAgICAgIGlmKGV4dENvbXBvbmVudHMuaW5jbHVkZXMoeHR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgdGhlVmFsdWUgPSBub2RlLnZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgIGlmICh0aGVWYWx1ZS5pbmRleE9mKCdkb2N0eXBlIGh0bWwnKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IHt4dHlwZTogeHR5cGV9XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb25maWcgPSBKU09OLnN0cmluZ2lmeSh0eXBlKVxuICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2goYEV4dC5jcmVhdGUoJHtjb25maWd9KWApXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGkgKz0gZW5kXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIHN0YXRlbWVudHNcbn1cblxuZnVuY3Rpb24gY2hhbmdlSXQobykge1xuICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gIGNvbnN0IGZzeCA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcbiAgY29uc3Qgd2hlcmVQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIG8ud2hlcmUpXG4gIHZhciBqcyA9IGZzeC5yZWFkRmlsZVN5bmMod2hlcmVQYXRoKS50b1N0cmluZygpXG4gIHZhciBuZXdKcyA9IGpzLnJlcGxhY2Uoby5mcm9tLG8udG8pO1xuICBmc3gud3JpdGVGaWxlU3luYyh3aGVyZVBhdGgsIG5ld0pzLCAndXRmLTgnLCAoKT0+e3JldHVybn0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfdG9Qcm9kKHZhcnMsIG9wdGlvbnMpIHtcbiAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gIGxvZ3Yob3B0aW9ucy52ZXJib3NlLCdGVU5DVElPTiBfdG9Qcm9kJylcbiAgY29uc3QgZnN4ID0gcmVxdWlyZSgnZnMtZXh0cmEnKVxuICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgY29uc3QgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJylcbiAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG4gIGNvbnN0IHRvb2xraXQgPSAnbW9kZXJuJztcbiAgY29uc3QgVG9vbGtpdCA9IHRvb2xraXQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0b29sa2l0LnNsaWNlKDEpO1xuXG4gIGNvbnN0IHBhdGhFeHRBbmd1bGFyUHJvZCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBgc3JjL2FwcC9leHQtYW5ndWxhci0ke3Rvb2xraXR9LXByb2RgKTtcbiAgaWYgKCFmcy5leGlzdHNTeW5jKHBhdGhFeHRBbmd1bGFyUHJvZCkpIHtcbiAgICBta2RpcnAuc3luYyhwYXRoRXh0QW5ndWxhclByb2QpXG4gICAgY29uc3QgdCA9IHJlcXVpcmUoJy4vYXJ0aWZhY3RzJykuZXh0QW5ndWxhck1vZHVsZSgnJywgJycsICcnKVxuICAgIGZzeC53cml0ZUZpbGVTeW5jKGAke3BhdGhFeHRBbmd1bGFyUHJvZH0vZXh0LWFuZ3VsYXItJHt0b29sa2l0fS5tb2R1bGUudHNgLCB0LCAndXRmLTgnLCAoKSA9PiB7XG4gICAgICByZXR1cm5cbiAgICB9KVxuICB9XG5cbiAgdmFyIG8gPSB7fVxuICBvLndoZXJlID0gJ3NyYy9hcHAvYXBwLm1vZHVsZS50cydcbiAgby5mcm9tID0gYGltcG9ydCB7IEV4dEFuZ3VsYXIke1Rvb2xraXR9TW9kdWxlIH0gZnJvbSAnQHNlbmNoYS9leHQtYW5ndWxhci0ke3Rvb2xraXR9J2BcbiAgby50byA9IGBpbXBvcnQgeyBFeHRBbmd1bGFyJHtUb29sa2l0fU1vZHVsZSB9IGZyb20gJy4vZXh0LWFuZ3VsYXItJHt0b29sa2l0fS1wcm9kL2V4dC1hbmd1bGFyLSR7dG9vbGtpdH0ubW9kdWxlJ2BcbiAgY2hhbmdlSXQobylcblxuLy8gICBvID0ge31cbi8vICAgby53aGVyZSA9ICdzcmMvbWFpbi50cydcbi8vICAgby5mcm9tID0gYGJvb3RzdHJhcE1vZHVsZSggQXBwTW9kdWxlICk7YFxuLy8gICBvLnRvID0gYGVuYWJsZVByb2RNb2RlKCk7Ym9vdHN0cmFwTW9kdWxlKEFwcE1vZHVsZSk7YFxuLy8gICBjaGFuZ2VJdChvKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX3RvRGV2KHZhcnMsIG9wdGlvbnMpIHtcbiAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gIGxvZ3Yob3B0aW9ucy52ZXJib3NlLCdGVU5DVElPTiBfdG9EZXYnKVxuICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbiAgY29uc3QgdG9vbGtpdCA9ICdtb2Rlcm4nO1xuICBjb25zdCBUb29sa2l0ID0gdG9vbGtpdC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRvb2xraXQuc2xpY2UoMSk7XG5cbiAgY29uc3QgcGF0aEV4dEFuZ3VsYXJQcm9kID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIGBzcmMvYXBwL2V4dC1hbmd1bGFyLSR7dG9vbGtpdH0tcHJvZGApO1xuICByZXF1aXJlKCdyaW1yYWYnKS5zeW5jKHBhdGhFeHRBbmd1bGFyUHJvZCk7XG5cbiAgdmFyIG8gPSB7fVxuICBvLndoZXJlID0gJ3NyYy9hcHAvYXBwLm1vZHVsZS50cydcbiAgby5mcm9tID0gYGltcG9ydCB7IEV4dEFuZ3VsYXItJHtUb29sa2l0fU1vZHVsZSB9IGZyb20gJy4vZXh0LWFuZ3VsYXItJHt0b29sa2l0fS1wcm9kL2V4dC1hbmd1bGFyLSR7dG9vbGtpdH0ubW9kdWxlJ2BcbiAgby50byA9IGBpbXBvcnQgeyBFeHRBbmd1bGFyLSR7VG9vbGtpdH1Nb2R1bGUgfSBmcm9tICdAc2VuY2hhL2V4dC1hbmd1bGFyLSR7dG9vbGtpdH0nYFxuICBjaGFuZ2VJdChvKVxuXG4vLyAgIG8gPSB7fVxuLy8gICBvLndoZXJlID0gJ3NyYy9tYWluLnRzJ1xuLy8gICBvLmZyb20gPSBgZW5hYmxlUHJvZE1vZGUoKTtib290c3RyYXBNb2R1bGUoQXBwTW9kdWxlKTtgXG4vLyAgIG8udG8gPSBgYm9vdHN0cmFwTW9kdWxlKCBBcHBNb2R1bGUgKTtgXG4vLyAgIGNoYW5nZUl0KG8pXG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRBbGxDb21wb25lbnRzKHZhcnMsIG9wdGlvbnMpIHtcbiAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gIGxvZ3Yob3B0aW9ucy52ZXJib3NlLCdGVU5DVElPTiBfZ2V0QWxsQ29tcG9uZW50cycpXG5cbiAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICBjb25zdCBmc3ggPSByZXF1aXJlKCdmcy1leHRyYScpXG5cbiAgY29uc3QgdG9vbGtpdCA9ICdtb2Rlcm4nO1xuICBjb25zdCBUb29sa2l0ID0gdG9vbGtpdC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRvb2xraXQuc2xpY2UoMSk7XG5cbi8vICAgIGxvZyh2YXJzLmFwcCwgYEdldHRpbmcgYWxsIHJlZmVyZW5jZWQgZXh0LSR7b3B0aW9ucy5mcmFtZXdvcmt9IG1vZHVsZXNgKVxuICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdXG4gIGNvbnN0IHBhY2thZ2VMaWJQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIGBub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtYW5ndWxhci0ke3Rvb2xraXR9L2xpYmApXG4gIHZhciBmaWxlcyA9IGZzeC5yZWFkZGlyU3luYyhwYWNrYWdlTGliUGF0aClcbiAgZmlsZXMuZm9yRWFjaCgoZmlsZU5hbWUpID0+IHtcbiAgICAvLyBpZiAoZmlsZU5hbWUgJiYgZmlsZU5hbWUuc3Vic3RyKDAsIDQpID09ICdleHQtJykge1xuICAgIC8vICAgdmFyIGVuZCA9IGZpbGVOYW1lLnN1YnN0cig0KS5pbmRleE9mKCcuY29tcG9uZW50JylcbiAgICAvLyAgIGlmIChlbmQgPj0gMCkge1xuICAgIC8vICAgICBleHRDb21wb25lbnRzLnB1c2goZmlsZU5hbWUuc3Vic3RyaW5nKDQsIGVuZCArIDQpKVxuICAgIC8vICAgfVxuICAgIC8vIH1cblxuICAgIGlmIChmaWxlTmFtZSAmJiBmaWxlTmFtZS5zdWJzdHIoMCwgMykgPT0gJ0V4dCcpIHtcbiAgICAgIHZhciBlbmQgPSBmaWxlTmFtZS5zdWJzdHIoMykuaW5kZXhPZignLnRzJyk7XG4gICAgICBpZiAoZW5kID49IDApIHtcbiAgICAgICAgZXh0Q29tcG9uZW50cy5wdXNoKGZpbGVOYW1lLnN1YnN0cmluZygzLCBlbmQgKyAzKS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIH1cbiAgICB9XG5cblxuXG4gIH0pXG4gIGxvZyh2YXJzLmFwcCwgYFdyaXRpbmcgYWxsIHJlZmVyZW5jZWQgZXh0LSR7b3B0aW9ucy5mcmFtZXdvcmt9IG1vZHVsZXNgKVxuICByZXR1cm4gZXh0Q29tcG9uZW50c1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIodmFycywgb3B0aW9ucykge1xuICBjb25zdCBsb2cgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2dcbiAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgbG9ndihvcHRpb25zLnZlcmJvc2UsJ0ZVTkNUSU9OIF93cml0ZUZpbGVzVG9Qcm9kRm9sZGVyJylcblxuICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gIGNvbnN0IGZzeCA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcblxuICBjb25zdCB0b29sa2l0ID0gJ21vZGVybic7XG4gIGNvbnN0IFRvb2xraXQgPSB0b29sa2l0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdG9vbGtpdC5zbGljZSgxKTtcblxuICBjb25zdCBwYWNrYWdlTGliUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBgbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LWFuZ3VsYXItJHt0b29sa2l0fS9saWJgKVxuICBjb25zdCBwYXRoVG9FeHRBbmd1bGFyUHJvZCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBgc3JjL2FwcC9leHQtYW5ndWxhci0ke3Rvb2xraXR9LXByb2RgKVxuICBjb25zdCBzdHJpbmcgPSAnRXh0LmNyZWF0ZSh7XFxcInh0eXBlXFxcIjpcXFwiJ1xuXG4gIHZhcnMuZGVwcy5mb3JFYWNoKGNvZGUgPT4ge1xuICAgIHZhciBpbmRleCA9IGNvZGUuaW5kZXhPZihzdHJpbmcpXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIGNvZGUgPSBjb2RlLnN1YnN0cmluZyhpbmRleCArIHN0cmluZy5sZW5ndGgpXG4gICAgICB2YXIgZW5kID0gY29kZS5pbmRleE9mKCdcXFwiJylcbiAgICAgIHZhcnMudXNlZEV4dENvbXBvbmVudHMucHVzaChjb2RlLnN1YnN0cigwLCBlbmQpKVxuICAgIH1cbiAgfSlcbiAgdmFycy51c2VkRXh0Q29tcG9uZW50cyA9IFsuLi5uZXcgU2V0KHZhcnMudXNlZEV4dENvbXBvbmVudHMpXVxuXG4gIHZhciB3cml0ZVRvUGF0aFdyaXR0ZW4gPSBmYWxzZVxuICB2YXIgbW9kdWxlVmFycyA9IHtcbiAgICBpbXBvcnRzOiAnJyxcbiAgICBleHBvcnRzOiAnJyxcbiAgICBkZWNsYXJhdGlvbnM6ICcnXG4gIH1cbiAgdmFycy51c2VkRXh0Q29tcG9uZW50cy5mb3JFYWNoKHh0eXBlID0+IHtcbiAgICB2YXIgY2FwY2xhc3NuYW1lID0geHR5cGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB4dHlwZS5yZXBsYWNlKC8tL2csIFwiX1wiKS5zbGljZSgxKVxuICAgIG1vZHVsZVZhcnMuaW1wb3J0cyA9IG1vZHVsZVZhcnMuaW1wb3J0cyArIGBpbXBvcnQgeyBFeHQke2NhcGNsYXNzbmFtZX1Db21wb25lbnQgfSBmcm9tICcuL2V4dC0ke3h0eXBlfS5jb21wb25lbnQnO1xcbmBcbiAgICBtb2R1bGVWYXJzLmV4cG9ydHMgPSBtb2R1bGVWYXJzLmV4cG9ydHMgKyBgICAgIEV4dCR7Y2FwY2xhc3NuYW1lfUNvbXBvbmVudCxcXG5gXG4gICAgbW9kdWxlVmFycy5kZWNsYXJhdGlvbnMgPSBtb2R1bGVWYXJzLmRlY2xhcmF0aW9ucyArIGAgICAgRXh0JHtjYXBjbGFzc25hbWV9Q29tcG9uZW50LFxcbmBcbiAgICB2YXIgY2xhc3NGaWxlID0gYGV4dC0ke3h0eXBlfS5jb21wb25lbnQudHNgXG4gICAgY29uc3QgY29udGVudHMgPSBmc3gucmVhZEZpbGVTeW5jKGAke3BhY2thZ2VMaWJQYXRofS8ke2NsYXNzRmlsZX1gKS50b1N0cmluZygpXG4gICAgZnN4LndyaXRlRmlsZVN5bmMoYCR7cGF0aFRvRXh0QW5ndWxhclByb2R9LyR7Y2xhc3NGaWxlfWAsIGNvbnRlbnRzLCAndXRmLTgnLCAoKT0+e3JldHVybn0pXG4gICAgd3JpdGVUb1BhdGhXcml0dGVuID0gdHJ1ZVxuICB9KVxuICBpZiAod3JpdGVUb1BhdGhXcml0dGVuKSB7XG4gICAgdmFyIHQgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmV4dEFuZ3VsYXJNb2R1bGUoXG4gICAgICBtb2R1bGVWYXJzLmltcG9ydHMsIG1vZHVsZVZhcnMuZXhwb3J0cywgbW9kdWxlVmFycy5kZWNsYXJhdGlvbnNcbiAgICApXG4gICAgZnN4LndyaXRlRmlsZVN5bmMoYCR7cGF0aFRvRXh0QW5ndWxhclByb2R9L2V4dC1hbmd1bGFyLSR7dG9vbGtpdH0ubW9kdWxlLnRzYCwgdCwgJ3V0Zi04JywgKCk9PntyZXR1cm59KVxuICB9XG5cbiAgY29uc3QgYmFzZUNvbnRlbnQgPSBmc3gucmVhZEZpbGVTeW5jKGAke3BhY2thZ2VMaWJQYXRofS9lbmctYmFzZS50c2ApLnRvU3RyaW5nKClcbiAgZnN4LndyaXRlRmlsZVN5bmMoYCR7cGF0aFRvRXh0QW5ndWxhclByb2R9L2VuZy1iYXNlLnRzYCwgYmFzZUNvbnRlbnQsICd1dGYtOCcsICgpPT57cmV0dXJufSlcbn0iXSwi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