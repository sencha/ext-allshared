"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValidateOptions = getValidateOptions;
exports.getDefaultOptions = getDefaultOptions;
exports.getDefaultVars = getDefaultVars;
exports._extractFromSource = _extractFromSource;
exports._toProd = _toProd;
exports._toDev = _toDev;
exports._getAllComponents = _getAllComponents;
exports._writeFilesToProdFolder = _writeFilesToProdFolder;

function getValidateOptions() {
  return {
    "type": "object",
    "properties": {
      "framework": {
        "type": ["string"]
      },
      "toolkit": {
        "type": ["string"]
      },
      "port": {
        "type": ["integer"]
      },
      "emit": {
        "type": ["boolean"]
      },
      "browser": {
        "type": ["boolean"]
      },
      "watch": {
        "type": ["string"]
      },
      "profile": {
        "type": ["string"]
      },
      "environment": {
        "type": ["string"]
      },
      "verbose": {
        "type": ["string"]
      },
      "theme": {
        "type": ["string"]
      },
      "treeshake": {
        "type": ["boolean"]
      },
      "script": {
        "type": ["string"]
      },
      "packages": {
        "type": ["string", "array"]
      }
    },
    "additionalProperties": false
  };
}

function getDefaultOptions() {
  return {
    port: 1962,
    emit: true,
    browser: true,
    watch: 'yes',
    profile: '',
    treeshake: false,
    script: null,
    environment: 'development',
    verbose: 'no',
    toolkit: 'modern',
    packages: null
  };
}

function getDefaultVars() {
  return {
    watchStarted: false,
    buildstep: 0,
    firstTime: true,
    firstCompile: true,
    browserCount: 0,
    manifest: null,
    extPath: 'ext-angular',
    pluginErrors: [],
    deps: [],
    usedExtComponents: [],
    rebuild: true
  };
}

function toXtype(str) {
  return str.toLowerCase().replace(/_/g, '-');
}

function _extractFromSource(module, options, compilation, extComponents) {
  try {
    var js = module._source._value;

    const logv = require('./pluginUtil').logv; //logv(options,'HOOK succeedModule, FUNCTION _extractFromSource: ' + module.resource)


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
                  var xtype = toXtype(start.substring(1, end));

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
  } catch (e) {
    console.log(e);
    compilation.errors.push('_extractFromSource: ' + e);
    return [];
  }
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

  logv(options, 'FUNCTION _toProd');

  try {
    const fsx = require('fs-extra');

    const fs = require('fs');

    const mkdirp = require('mkdirp');

    const path = require('path');

    const pathExtAngularProd = path.resolve(process.cwd(), `src/app/ext-angular-prod`);

    if (!fs.existsSync(pathExtAngularProd)) {
      mkdirp.sync(pathExtAngularProd);

      const t = require('./artifacts').extAngularModule('', '', '');

      fsx.writeFileSync(`${pathExtAngularProd}/ext-angular.module.ts`, t, 'utf-8', () => {
        return;
      });
    }

    var o = {};
    o.where = 'src/app/app.module.ts';
    o.from = `import { ExtAngularModule } from '@sencha/ext-angular'`;
    o.to = `import { ExtAngularModule } from './ext-angular-prod/ext-angular.module'`;
    changeIt(o);
    o = {};
    o.where = 'src/main.ts';
    o.from = `bootstrapModule( AppModule );`;
    o.to = `enableProdMode();bootstrapModule(AppModule);`;
    changeIt(o);
  } catch (e) {
    console.log(e);
    return [];
  }
}

function _toDev(vars, options) {
  const log = require('./pluginUtil').log;

  const logv = require('./pluginUtil').logv;

  logv(options, 'FUNCTION _toProd');

  try {
    const path = require('path');

    const pathExtAngularProd = path.resolve(process.cwd(), `src/app/ext-angular-prod`);

    require('rimraf').sync(pathExtAngularProd);

    var o = {};
    o.where = 'src/app/app.module.ts';
    o.from = `import { ExtAngularModule } from './ext-angular-prod/ext-angular.module'`;
    o.to = `import { ExtAngularModule } from '@sencha/ext-angular'`;
    changeIt(o);
    o = {};
    o.where = 'src/main.ts';
    o.from = `enableProdMode();bootstrapModule(AppModule);`;
    o.to = `bootstrapModule( AppModule );`;
    changeIt(o);
  } catch (e) {
    console.log(e);
    return [];
  }
}

function _getAllComponents(vars, options) {
  const log = require('./pluginUtil').log;

  const logv = require('./pluginUtil').logv;

  logv(options, 'FUNCTION _getAllComponents');

  try {
    const path = require('path');

    const fsx = require('fs-extra');

    log(vars.app + `Getting all referenced ext-${options.framework} modules`);
    var extComponents = [];
    const packageLibPath = path.resolve(process.cwd(), 'node_modules/@sencha/ext-angular/src/lib');
    var files = fsx.readdirSync(packageLibPath);
    files.forEach(fileName => {
      if (fileName && fileName.substr(0, 4) == 'ext-') {
        var end = fileName.substr(4).indexOf('.component');

        if (end >= 0) {
          extComponents.push(fileName.substring(4, end + 4));
        }
      }
    });
    log(vars.app + `Writing all referenced ext-${options.framework} modules`);
    return extComponents;
  } catch (e) {
    console.log(e);
    return [];
  }
}

function _writeFilesToProdFolder(vars, options) {
  const log = require('./pluginUtil').log;

  const logv = require('./pluginUtil').logv;

  logv(options, 'FUNCTION _writeFilesToProdFolder');

  try {
    const path = require('path');

    const fsx = require('fs-extra');

    const packageLibPath = path.resolve(process.cwd(), 'node_modules/@sencha/ext-angular/src/lib');
    const pathToExtAngularProd = path.resolve(process.cwd(), `src/app/ext-angular-prod`);
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

      fsx.writeFileSync(`${pathToExtAngularProd}/ext-angular.module.ts`, t, 'utf-8', () => {
        return;
      });
    }

    const baseContent = fsx.readFileSync(`${packageLibPath}/base.ts`).toString();
    fsx.writeFileSync(`${pathToExtAngularProd}/base.ts`, baseContent, 'utf-8', () => {
      return;
    });
  } catch (e) {
    console.log(e);
    return [];
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hbmd1bGFyVXRpbC5qcyJdLCJuYW1lcyI6WyJnZXRWYWxpZGF0ZU9wdGlvbnMiLCJnZXREZWZhdWx0T3B0aW9ucyIsInBvcnQiLCJlbWl0IiwiYnJvd3NlciIsIndhdGNoIiwicHJvZmlsZSIsInRyZWVzaGFrZSIsInNjcmlwdCIsImVudmlyb25tZW50IiwidmVyYm9zZSIsInRvb2xraXQiLCJwYWNrYWdlcyIsImdldERlZmF1bHRWYXJzIiwid2F0Y2hTdGFydGVkIiwiYnVpbGRzdGVwIiwiZmlyc3RUaW1lIiwiZmlyc3RDb21waWxlIiwiYnJvd3NlckNvdW50IiwibWFuaWZlc3QiLCJleHRQYXRoIiwicGx1Z2luRXJyb3JzIiwiZGVwcyIsInVzZWRFeHRDb21wb25lbnRzIiwicmVidWlsZCIsInRvWHR5cGUiLCJzdHIiLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2UiLCJfZXh0cmFjdEZyb21Tb3VyY2UiLCJtb2R1bGUiLCJvcHRpb25zIiwiY29tcGlsYXRpb24iLCJleHRDb21wb25lbnRzIiwianMiLCJfc291cmNlIiwiX3ZhbHVlIiwibG9ndiIsInJlcXVpcmUiLCJzdGF0ZW1lbnRzIiwiZ2VuZXJhdGUiLCJkZWZhdWx0IiwicGFyc2UiLCJ0cmF2ZXJzZSIsImFzdCIsInBsdWdpbnMiLCJzb3VyY2VUeXBlIiwicHJlIiwibm9kZSIsInR5cGUiLCJjYWxsZWUiLCJvYmplY3QiLCJuYW1lIiwicHVzaCIsImNvZGUiLCJ2YWx1ZSIsImkiLCJsZW5ndGgiLCJjaGFyQXQiLCJzdWJzdHIiLCJpbmRleE9mIiwic3RhcnQiLCJzdWJzdHJpbmciLCJzcGFjZUVuZCIsIm5ld2xpbmVFbmQiLCJ0YWdFbmQiLCJlbmQiLCJNYXRoIiwibWluIiwieHR5cGUiLCJpbmNsdWRlcyIsInRoZVZhbHVlIiwiY29uZmlnIiwiSlNPTiIsInN0cmluZ2lmeSIsImUiLCJjb25zb2xlIiwibG9nIiwiZXJyb3JzIiwiY2hhbmdlSXQiLCJvIiwicGF0aCIsImZzeCIsIndoZXJlUGF0aCIsInJlc29sdmUiLCJwcm9jZXNzIiwiY3dkIiwid2hlcmUiLCJyZWFkRmlsZVN5bmMiLCJ0b1N0cmluZyIsIm5ld0pzIiwiZnJvbSIsInRvIiwid3JpdGVGaWxlU3luYyIsIl90b1Byb2QiLCJ2YXJzIiwiZnMiLCJta2RpcnAiLCJwYXRoRXh0QW5ndWxhclByb2QiLCJleGlzdHNTeW5jIiwic3luYyIsInQiLCJleHRBbmd1bGFyTW9kdWxlIiwiX3RvRGV2IiwiX2dldEFsbENvbXBvbmVudHMiLCJhcHAiLCJmcmFtZXdvcmsiLCJwYWNrYWdlTGliUGF0aCIsImZpbGVzIiwicmVhZGRpclN5bmMiLCJmb3JFYWNoIiwiZmlsZU5hbWUiLCJfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciIsInBhdGhUb0V4dEFuZ3VsYXJQcm9kIiwic3RyaW5nIiwiaW5kZXgiLCJTZXQiLCJ3cml0ZVRvUGF0aFdyaXR0ZW4iLCJtb2R1bGVWYXJzIiwiaW1wb3J0cyIsImV4cG9ydHMiLCJkZWNsYXJhdGlvbnMiLCJjYXBjbGFzc25hbWUiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiY2xhc3NGaWxlIiwiY29udGVudHMiLCJiYXNlQ29udGVudCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0FBRU8sU0FBU0Esa0JBQVQsR0FBOEI7QUFDbkMsU0FBTztBQUNMLFlBQVEsUUFESDtBQUVMLGtCQUFjO0FBQ1osbUJBQWU7QUFBQyxnQkFBUSxDQUFFLFFBQUY7QUFBVCxPQURIO0FBRVosaUJBQWU7QUFBQyxnQkFBUSxDQUFFLFFBQUY7QUFBVCxPQUZIO0FBR1osY0FBZTtBQUFDLGdCQUFRLENBQUUsU0FBRjtBQUFULE9BSEg7QUFJWixjQUFlO0FBQUMsZ0JBQVEsQ0FBRSxTQUFGO0FBQVQsT0FKSDtBQUtaLGlCQUFlO0FBQUMsZ0JBQVEsQ0FBRSxTQUFGO0FBQVQsT0FMSDtBQU1aLGVBQWU7QUFBQyxnQkFBUSxDQUFFLFFBQUY7QUFBVCxPQU5IO0FBT1osaUJBQWU7QUFBQyxnQkFBUSxDQUFFLFFBQUY7QUFBVCxPQVBI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RCxFQUFqQjtBQUNBUCxNQUFBQSxHQUFHLENBQUNXLGFBQUosQ0FBbUIsR0FBRW9CLG9CQUFxQixJQUFHWSxTQUFVLEVBQXZELEVBQTBEQyxRQUExRCxFQUFvRSxPQUFwRSxFQUE2RSxNQUFJO0FBQUM7QUFBTyxPQUF6RjtBQUNBVCxNQUFBQSxrQkFBa0IsR0FBRyxJQUFyQjtBQUNELEtBVEQ7O0FBVUEsUUFBSUEsa0JBQUosRUFBd0I7QUFDdEIsVUFBSWhCLENBQUMsR0FBRy9ELE9BQU8sQ0FBQyxhQUFELENBQVAsQ0FBdUJnRSxnQkFBdkIsQ0FDTmdCLFVBQVUsQ0FBQ0MsT0FETCxFQUNjRCxVQUFVLENBQUNFLE9BRHpCLEVBQ2tDRixVQUFVLENBQUNHLFlBRDdDLENBQVI7O0FBR0F2QyxNQUFBQSxHQUFHLENBQUNXLGFBQUosQ0FBbUIsR0FBRW9CLG9CQUFxQix3QkFBMUMsRUFBbUVaLENBQW5FLEVBQXNFLE9BQXRFLEVBQStFLE1BQUk7QUFBQztBQUFPLE9BQTNGO0FBQ0Q7O0FBRUQsVUFBTTBCLFdBQVcsR0FBRzdDLEdBQUcsQ0FBQ00sWUFBSixDQUFrQixHQUFFbUIsY0FBZSxVQUFuQyxFQUE4Q2xCLFFBQTlDLEVBQXBCO0FBQ0FQLElBQUFBLEdBQUcsQ0FBQ1csYUFBSixDQUFtQixHQUFFb0Isb0JBQXFCLFVBQTFDLEVBQXFEYyxXQUFyRCxFQUFrRSxPQUFsRSxFQUEyRSxNQUFJO0FBQUM7QUFBTyxLQUF2RjtBQUVELEdBNUNELENBNkNBLE9BQU9wRCxDQUFQLEVBQVU7QUFDUkMsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlGLENBQVo7QUFDQSxXQUFPLEVBQVA7QUFDRDtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFZhbGlkYXRlT3B0aW9ucygpIHtcbiAgcmV0dXJuIHtcbiAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICBcInByb3BlcnRpZXNcIjoge1xuICAgICAgXCJmcmFtZXdvcmtcIjogICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwidG9vbGtpdFwiOiAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcInBvcnRcIjogICAgICAgIHtcInR5cGVcIjogWyBcImludGVnZXJcIiBdfSxcbiAgICAgIFwiZW1pdFwiOiAgICAgICAge1widHlwZVwiOiBbIFwiYm9vbGVhblwiIF19LFxuICAgICAgXCJicm93c2VyXCI6ICAgICB7XCJ0eXBlXCI6IFsgXCJib29sZWFuXCIgXX0sXG4gICAgICBcIndhdGNoXCI6ICAgICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJwcm9maWxlXCI6ICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwiZW52aXJvbm1lbnRcIjoge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcInZlcmJvc2VcIjogICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJ0aGVtZVwiOiAgICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwidHJlZXNoYWtlXCI6IHtcInR5cGVcIjogWyBcImJvb2xlYW5cIiBdfSxcbiAgICAgIFwic2NyaXB0XCI6ICAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcInBhY2thZ2VzXCI6ICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiLCBcImFycmF5XCIgXX1cbiAgICB9LFxuICAgIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjogZmFsc2VcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdE9wdGlvbnMoKSB7XG4gIHJldHVybiB7XG4gICAgcG9ydDogMTk2MixcbiAgICBlbWl0OiB0cnVlLFxuICAgIGJyb3dzZXI6IHRydWUsXG4gICAgd2F0Y2g6ICd5ZXMnLFxuICAgIHByb2ZpbGU6ICcnLCBcbiAgICB0cmVlc2hha2U6IGZhbHNlLFxuICAgIHNjcmlwdDogbnVsbCxcbiAgICBlbnZpcm9ubWVudDogJ2RldmVsb3BtZW50JywgXG4gICAgdmVyYm9zZTogJ25vJyxcbiAgICB0b29sa2l0OiAnbW9kZXJuJyxcbiAgICBwYWNrYWdlczogbnVsbFxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0VmFycygpIHtcbiAgcmV0dXJuIHtcbiAgICB3YXRjaFN0YXJ0ZWQgOiBmYWxzZSxcbiAgICBidWlsZHN0ZXA6IDAsXG4gICAgZmlyc3RUaW1lIDogdHJ1ZSxcbiAgICBmaXJzdENvbXBpbGU6IHRydWUsXG4gICAgYnJvd3NlckNvdW50IDogMCxcbiAgICBtYW5pZmVzdDogbnVsbCxcbiAgICBleHRQYXRoOiAnZXh0LWFuZ3VsYXInLFxuICAgIHBsdWdpbkVycm9yczogW10sXG4gICAgZGVwczogW10sXG4gICAgdXNlZEV4dENvbXBvbmVudHM6IFtdLFxuICAgIHJlYnVpbGQ6IHRydWVcbiAgfVxufVxuXG5mdW5jdGlvbiB0b1h0eXBlKHN0cikge1xuICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnLScpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cykge1xuICB0cnkge1xuICAgIHZhciBqcyA9IG1vZHVsZS5fc291cmNlLl92YWx1ZVxuICAgIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gICAgLy9sb2d2KG9wdGlvbnMsJ0hPT0sgc3VjY2VlZE1vZHVsZSwgRlVOQ1RJT04gX2V4dHJhY3RGcm9tU291cmNlOiAnICsgbW9kdWxlLnJlc291cmNlKVxuXG4gICAgdmFyIHN0YXRlbWVudHMgPSBbXVxuXG4gICAgdmFyIGdlbmVyYXRlID0gcmVxdWlyZShcIkBiYWJlbC9nZW5lcmF0b3JcIikuZGVmYXVsdFxuICAgIHZhciBwYXJzZSA9IHJlcXVpcmUoXCJiYWJ5bG9uXCIpLnBhcnNlXG4gICAgdmFyIHRyYXZlcnNlID0gcmVxdWlyZShcImFzdC10cmF2ZXJzZVwiKVxuXG4gICAgdmFyIGFzdCA9IHBhcnNlKGpzLCB7XG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgICd0eXBlc2NyaXB0JyxcbiAgICAgICAgJ2Zsb3cnLFxuICAgICAgICAnZG9FeHByZXNzaW9ucycsXG4gICAgICAgICdvYmplY3RSZXN0U3ByZWFkJyxcbiAgICAgICAgJ2NsYXNzUHJvcGVydGllcycsXG4gICAgICAgICdleHBvcnREZWZhdWx0RnJvbScsXG4gICAgICAgICdleHBvcnRFeHRlbnNpb25zJyxcbiAgICAgICAgJ2FzeW5jR2VuZXJhdG9ycycsXG4gICAgICAgICdmdW5jdGlvbkJpbmQnLFxuICAgICAgICAnZnVuY3Rpb25TZW50JyxcbiAgICAgICAgJ2R5bmFtaWNJbXBvcnQnXG4gICAgICBdLFxuICAgICAgc291cmNlVHlwZTogJ21vZHVsZSdcbiAgICB9KVxuXG4gICAgdHJhdmVyc2UoYXN0LCB7XG4gICAgICBwcmU6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdDYWxsRXhwcmVzc2lvbicgJiYgbm9kZS5jYWxsZWUgJiYgbm9kZS5jYWxsZWUub2JqZWN0ICYmIG5vZGUuY2FsbGVlLm9iamVjdC5uYW1lID09PSAnRXh0Jykge1xuICAgICAgICAgIHN0YXRlbWVudHMucHVzaChnZW5lcmF0ZShub2RlKS5jb2RlKVxuICAgICAgICB9XG4gICAgICAgIGlmKG5vZGUudHlwZSA9PT0gJ1N0cmluZ0xpdGVyYWwnKSB7XG4gICAgICAgICAgbGV0IGNvZGUgPSBub2RlLnZhbHVlXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2RlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAoY29kZS5jaGFyQXQoaSkgPT0gJzwnKSB7XG4gICAgICAgICAgICAgIGlmIChjb2RlLnN1YnN0cihpLCA0KSA9PSAnPCEtLScpIHtcbiAgICAgICAgICAgICAgICBpICs9IDRcbiAgICAgICAgICAgICAgICBpICs9IGNvZGUuc3Vic3RyKGkpLmluZGV4T2YoJy0tPicpICsgM1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUuY2hhckF0KGkrMSkgIT09ICcvJykge1xuICAgICAgICAgICAgICAgIHZhciBzdGFydCA9IGNvZGUuc3Vic3RyaW5nKGkpXG4gICAgICAgICAgICAgICAgdmFyIHNwYWNlRW5kID0gc3RhcnQuaW5kZXhPZignICcpXG4gICAgICAgICAgICAgICAgdmFyIG5ld2xpbmVFbmQgPSBzdGFydC5pbmRleE9mKCdcXG4nKVxuICAgICAgICAgICAgICAgIHZhciB0YWdFbmQgPSBzdGFydC5pbmRleE9mKCc+JylcbiAgICAgICAgICAgICAgICB2YXIgZW5kID0gTWF0aC5taW4oc3BhY2VFbmQsIG5ld2xpbmVFbmQsIHRhZ0VuZClcbiAgICAgICAgICAgICAgICBpZiAoZW5kID49IDApIHtcbiAgICAgICAgICAgICAgICAgIHZhciB4dHlwZSA9IHRvWHR5cGUoc3RhcnQuc3Vic3RyaW5nKDEsIGVuZCkpXG4gICAgICAgICAgICAgICAgICBpZihleHRDb21wb25lbnRzLmluY2x1ZGVzKHh0eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGhlVmFsdWUgPSBub2RlLnZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZVZhbHVlLmluZGV4T2YoJ2RvY3R5cGUgaHRtbCcpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSB7eHR5cGU6IHh0eXBlfVxuICAgICAgICAgICAgICAgICAgICAgIGxldCBjb25maWcgPSBKU09OLnN0cmluZ2lmeSh0eXBlKVxuICAgICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudHMucHVzaChgRXh0LmNyZWF0ZSgke2NvbmZpZ30pYClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaSArPSBlbmRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHN0YXRlbWVudHNcbiAgfVxuICBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2V4dHJhY3RGcm9tU291cmNlOiAnICsgZSlcbiAgICByZXR1cm4gW11cbiAgfVxufVxuXG5mdW5jdGlvbiBjaGFuZ2VJdChvKSB7XG4gIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgY29uc3QgZnN4ID0gcmVxdWlyZSgnZnMtZXh0cmEnKVxuICBjb25zdCB3aGVyZVBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgby53aGVyZSlcbiAgdmFyIGpzID0gZnN4LnJlYWRGaWxlU3luYyh3aGVyZVBhdGgpLnRvU3RyaW5nKClcbiAgdmFyIG5ld0pzID0ganMucmVwbGFjZShvLmZyb20sby50byk7XG4gIGZzeC53cml0ZUZpbGVTeW5jKHdoZXJlUGF0aCwgbmV3SnMsICd1dGYtOCcsICgpPT57cmV0dXJufSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF90b1Byb2QodmFycywgb3B0aW9ucykge1xuICBjb25zdCBsb2cgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2dcbiAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgbG9ndihvcHRpb25zLCdGVU5DVElPTiBfdG9Qcm9kJylcbiAgdHJ5IHtcbiAgICBjb25zdCBmc3ggPSByZXF1aXJlKCdmcy1leHRyYScpXG4gICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG4gICAgY29uc3QgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJylcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbiAgICBjb25zdCBwYXRoRXh0QW5ndWxhclByb2QgPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgYHNyYy9hcHAvZXh0LWFuZ3VsYXItcHJvZGApO1xuICAgIGlmICghZnMuZXhpc3RzU3luYyhwYXRoRXh0QW5ndWxhclByb2QpKSB7XG4gICAgICBta2RpcnAuc3luYyhwYXRoRXh0QW5ndWxhclByb2QpXG4gICAgICBjb25zdCB0ID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5leHRBbmd1bGFyTW9kdWxlKCcnLCAnJywgJycpXG4gICAgICBmc3gud3JpdGVGaWxlU3luYyhgJHtwYXRoRXh0QW5ndWxhclByb2R9L2V4dC1hbmd1bGFyLm1vZHVsZS50c2AsIHQsICd1dGYtOCcsICgpID0+IHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9KVxuICAgIH1cblxuICAgIHZhciBvID0ge31cbiAgICBvLndoZXJlID0gJ3NyYy9hcHAvYXBwLm1vZHVsZS50cydcbiAgICBvLmZyb20gPSBgaW1wb3J0IHsgRXh0QW5ndWxhck1vZHVsZSB9IGZyb20gJ0BzZW5jaGEvZXh0LWFuZ3VsYXInYFxuICAgIG8udG8gPSBgaW1wb3J0IHsgRXh0QW5ndWxhck1vZHVsZSB9IGZyb20gJy4vZXh0LWFuZ3VsYXItcHJvZC9leHQtYW5ndWxhci5tb2R1bGUnYFxuICAgIGNoYW5nZUl0KG8pXG5cbiAgICBvID0ge31cbiAgICBvLndoZXJlID0gJ3NyYy9tYWluLnRzJ1xuICAgIG8uZnJvbSA9IGBib290c3RyYXBNb2R1bGUoIEFwcE1vZHVsZSApO2BcbiAgICBvLnRvID0gYGVuYWJsZVByb2RNb2RlKCk7Ym9vdHN0cmFwTW9kdWxlKEFwcE1vZHVsZSk7YFxuICAgIGNoYW5nZUl0KG8pXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICAgIHJldHVybiBbXVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfdG9EZXYodmFycywgb3B0aW9ucykge1xuICBjb25zdCBsb2cgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2dcbiAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgbG9ndihvcHRpb25zLCdGVU5DVElPTiBfdG9Qcm9kJylcbiAgdHJ5IHtcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgY29uc3QgcGF0aEV4dEFuZ3VsYXJQcm9kID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIGBzcmMvYXBwL2V4dC1hbmd1bGFyLXByb2RgKTtcbiAgICByZXF1aXJlKCdyaW1yYWYnKS5zeW5jKHBhdGhFeHRBbmd1bGFyUHJvZCk7XG5cbiAgICB2YXIgbyA9IHt9XG4gICAgby53aGVyZSA9ICdzcmMvYXBwL2FwcC5tb2R1bGUudHMnXG4gICAgby5mcm9tID0gYGltcG9ydCB7IEV4dEFuZ3VsYXJNb2R1bGUgfSBmcm9tICcuL2V4dC1hbmd1bGFyLXByb2QvZXh0LWFuZ3VsYXIubW9kdWxlJ2BcbiAgICBvLnRvID0gYGltcG9ydCB7IEV4dEFuZ3VsYXJNb2R1bGUgfSBmcm9tICdAc2VuY2hhL2V4dC1hbmd1bGFyJ2BcbiAgICBjaGFuZ2VJdChvKVxuXG4gICAgbyA9IHt9XG4gICAgby53aGVyZSA9ICdzcmMvbWFpbi50cydcbiAgICBvLmZyb20gPSBgZW5hYmxlUHJvZE1vZGUoKTtib290c3RyYXBNb2R1bGUoQXBwTW9kdWxlKTtgXG4gICAgby50byA9IGBib290c3RyYXBNb2R1bGUoIEFwcE1vZHVsZSApO2BcbiAgICBjaGFuZ2VJdChvKVxuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgICByZXR1cm4gW11cbiAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBfZ2V0QWxsQ29tcG9uZW50cyh2YXJzLCBvcHRpb25zKSB7XG4gIGNvbnN0IGxvZyA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ1xuICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9nZXRBbGxDb21wb25lbnRzJylcblxuICB0cnkge1xuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICBjb25zdCBmc3ggPSByZXF1aXJlKCdmcy1leHRyYScpXG5cbiAgICBsb2codmFycy5hcHAgKyBgR2V0dGluZyBhbGwgcmVmZXJlbmNlZCBleHQtJHtvcHRpb25zLmZyYW1ld29ya30gbW9kdWxlc2ApXG4gICAgdmFyIGV4dENvbXBvbmVudHMgPSBbXVxuICAgIGNvbnN0IHBhY2thZ2VMaWJQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtYW5ndWxhci9zcmMvbGliJylcbiAgICB2YXIgZmlsZXMgPSBmc3gucmVhZGRpclN5bmMocGFja2FnZUxpYlBhdGgpXG4gICAgZmlsZXMuZm9yRWFjaCgoZmlsZU5hbWUpID0+IHtcbiAgICAgIGlmIChmaWxlTmFtZSAmJiBmaWxlTmFtZS5zdWJzdHIoMCwgNCkgPT0gJ2V4dC0nKSB7XG4gICAgICAgIHZhciBlbmQgPSBmaWxlTmFtZS5zdWJzdHIoNCkuaW5kZXhPZignLmNvbXBvbmVudCcpXG4gICAgICAgIGlmIChlbmQgPj0gMCkge1xuICAgICAgICAgIGV4dENvbXBvbmVudHMucHVzaChmaWxlTmFtZS5zdWJzdHJpbmcoNCwgZW5kICsgNCkpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIGxvZyh2YXJzLmFwcCArIGBXcml0aW5nIGFsbCByZWZlcmVuY2VkIGV4dC0ke29wdGlvbnMuZnJhbWV3b3JrfSBtb2R1bGVzYClcbiAgICByZXR1cm4gZXh0Q29tcG9uZW50c1xuXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICAgIHJldHVybiBbXVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfd3JpdGVGaWxlc1RvUHJvZEZvbGRlcih2YXJzLCBvcHRpb25zKSB7XG4gIGNvbnN0IGxvZyA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ1xuICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF93cml0ZUZpbGVzVG9Qcm9kRm9sZGVyJylcblxuICB0cnkge1xuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICBjb25zdCBmc3ggPSByZXF1aXJlKCdmcy1leHRyYScpXG5cbiAgICBjb25zdCBwYWNrYWdlTGliUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LWFuZ3VsYXIvc3JjL2xpYicpXG4gICAgY29uc3QgcGF0aFRvRXh0QW5ndWxhclByb2QgPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgYHNyYy9hcHAvZXh0LWFuZ3VsYXItcHJvZGApXG4gICAgY29uc3Qgc3RyaW5nID0gJ0V4dC5jcmVhdGUoe1xcXCJ4dHlwZVxcXCI6XFxcIidcblxuICAgIHZhcnMuZGVwcy5mb3JFYWNoKGNvZGUgPT4ge1xuICAgICAgdmFyIGluZGV4ID0gY29kZS5pbmRleE9mKHN0cmluZylcbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIGNvZGUgPSBjb2RlLnN1YnN0cmluZyhpbmRleCArIHN0cmluZy5sZW5ndGgpXG4gICAgICAgIHZhciBlbmQgPSBjb2RlLmluZGV4T2YoJ1xcXCInKVxuICAgICAgICB2YXJzLnVzZWRFeHRDb21wb25lbnRzLnB1c2goY29kZS5zdWJzdHIoMCwgZW5kKSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHZhcnMudXNlZEV4dENvbXBvbmVudHMgPSBbLi4ubmV3IFNldCh2YXJzLnVzZWRFeHRDb21wb25lbnRzKV1cblxuICAgIHZhciB3cml0ZVRvUGF0aFdyaXR0ZW4gPSBmYWxzZVxuICAgIHZhciBtb2R1bGVWYXJzID0ge1xuICAgICAgaW1wb3J0czogJycsXG4gICAgICBleHBvcnRzOiAnJyxcbiAgICAgIGRlY2xhcmF0aW9uczogJydcbiAgICB9XG4gICAgdmFycy51c2VkRXh0Q29tcG9uZW50cy5mb3JFYWNoKHh0eXBlID0+IHtcbiAgICAgIHZhciBjYXBjbGFzc25hbWUgPSB4dHlwZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHh0eXBlLnJlcGxhY2UoLy0vZywgXCJfXCIpLnNsaWNlKDEpXG4gICAgICBtb2R1bGVWYXJzLmltcG9ydHMgPSBtb2R1bGVWYXJzLmltcG9ydHMgKyBgaW1wb3J0IHsgRXh0JHtjYXBjbGFzc25hbWV9Q29tcG9uZW50IH0gZnJvbSAnLi9leHQtJHt4dHlwZX0uY29tcG9uZW50JztcXG5gXG4gICAgICBtb2R1bGVWYXJzLmV4cG9ydHMgPSBtb2R1bGVWYXJzLmV4cG9ydHMgKyBgICAgIEV4dCR7Y2FwY2xhc3NuYW1lfUNvbXBvbmVudCxcXG5gXG4gICAgICBtb2R1bGVWYXJzLmRlY2xhcmF0aW9ucyA9IG1vZHVsZVZhcnMuZGVjbGFyYXRpb25zICsgYCAgICBFeHQke2NhcGNsYXNzbmFtZX1Db21wb25lbnQsXFxuYFxuICAgICAgdmFyIGNsYXNzRmlsZSA9IGBleHQtJHt4dHlwZX0uY29tcG9uZW50LnRzYFxuICAgICAgY29uc3QgY29udGVudHMgPSBmc3gucmVhZEZpbGVTeW5jKGAke3BhY2thZ2VMaWJQYXRofS8ke2NsYXNzRmlsZX1gKS50b1N0cmluZygpXG4gICAgICBmc3gud3JpdGVGaWxlU3luYyhgJHtwYXRoVG9FeHRBbmd1bGFyUHJvZH0vJHtjbGFzc0ZpbGV9YCwgY29udGVudHMsICd1dGYtOCcsICgpPT57cmV0dXJufSlcbiAgICAgIHdyaXRlVG9QYXRoV3JpdHRlbiA9IHRydWVcbiAgICB9KVxuICAgIGlmICh3cml0ZVRvUGF0aFdyaXR0ZW4pIHtcbiAgICAgIHZhciB0ID0gcmVxdWlyZSgnLi9hcnRpZmFjdHMnKS5leHRBbmd1bGFyTW9kdWxlKFxuICAgICAgICBtb2R1bGVWYXJzLmltcG9ydHMsIG1vZHVsZVZhcnMuZXhwb3J0cywgbW9kdWxlVmFycy5kZWNsYXJhdGlvbnNcbiAgICAgIClcbiAgICAgIGZzeC53cml0ZUZpbGVTeW5jKGAke3BhdGhUb0V4dEFuZ3VsYXJQcm9kfS9leHQtYW5ndWxhci5tb2R1bGUudHNgLCB0LCAndXRmLTgnLCAoKT0+e3JldHVybn0pXG4gICAgfVxuXG4gICAgY29uc3QgYmFzZUNvbnRlbnQgPSBmc3gucmVhZEZpbGVTeW5jKGAke3BhY2thZ2VMaWJQYXRofS9iYXNlLnRzYCkudG9TdHJpbmcoKVxuICAgIGZzeC53cml0ZUZpbGVTeW5jKGAke3BhdGhUb0V4dEFuZ3VsYXJQcm9kfS9iYXNlLnRzYCwgYmFzZUNvbnRlbnQsICd1dGYtOCcsICgpPT57cmV0dXJufSlcblxuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgICByZXR1cm4gW11cbiAgfVxufSJdfQ==