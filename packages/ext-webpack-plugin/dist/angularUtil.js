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
      "theme": {
        "type": ["string"]
      },
      "profile": {
        "type": ["string"]
      },
      "environment": {
        "type": ["string"]
      },
      "treeshake": {
        "type": ["boolean"]
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
      "verbose": {
        "type": ["string"]
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
    framework: null,
    toolkit: 'modern',
    theme: 'theme-material',
    profile: 'desktop',
    environment: 'development',
    treeshake: false,
    port: 1962,
    emit: true,
    browser: true,
    watch: 'yes',
    verbose: 'no',
    script: null,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hbmd1bGFyVXRpbC5qcyJdLCJuYW1lcyI6WyJnZXRWYWxpZGF0ZU9wdGlvbnMiLCJnZXREZWZhdWx0T3B0aW9ucyIsImZyYW1ld29yayIsInRvb2xraXQiLCJ0aGVtZSIsInByb2ZpbGUiLCJlbnZpcm9ubWVudCIsInRyZWVzaGFrZSIsInBvcnQiLCJlbWl0IiwiYnJvd3NlciIsIndhdGNoIiwidmVyYm9zZSIsInNjcmlwdCIsInBhY2thZ2VzIiwiZ2V0RGVmYXVsdFZhcnMiLCJ3YXRjaFN0YXJ0ZWQiLCJidWlsZHN0ZXAiLCJmaXJzdFRpbWUiLCJmaXJzdENvbXBpbGUiLCJicm93c2VyQ291bnQiLCJtYW5pZmVzdCIsImV4dFBhdGgiLCJwbHVnaW5FcnJvcnMiLCJkZXBzIiwidXNlZEV4dENvbXBvbmVudHMiLCJyZWJ1aWxkIiwidG9YdHlwZSIsInN0ciIsInRvTG93ZXJDYXNlIiwicmVwbGFjZSIsIl9leHRyYWN0RnJvbVNvdXJjZSIsIm1vZHVsZSIsIm9wdGlvbnMiLCJjb21waWxhdGlvbiIsImV4dENvbXBvbmVudHMiLCJqcyIsIl9zb3VyY2UiLCJfdmFsdWUiLCJsb2d2IiwicmVxdWlyZSIsInN0YXRlbWVudHMiLCJnZW5lcmF0ZSIsImRlZmF1bHQiLCJwYXJzZSIsInRyYXZlcnNlIiwiYXN0IiwicGx1Z2lucyIsInNvdXJjZVR5cGUiLCJwcmUiLCJub2RlIiwidHlwZSIsImNhbGxlZSIsIm9iamVjdCIsIm5hbWUiLCJwdXNoIiwiY29kZSIsInZhbHVlIiwiaSIsImxlbmd0aCIsImNoYXJBdCIsInN1YnN0ciIsImluZGV4T2YiLCJzdGFydCIsInN1YnN0cmluZyIsInNwYWNlRW5kIiwibmV3bGluZUVuZCIsInRhZ0VuZCIsImVuZCIsIk1hdGgiLCJtaW4iLCJ4dHlwZSIsImluY2x1ZGVzIiwidGhlVmFsdWUiLCJjb25maWciLCJKU09OIiwic3RyaW5naWZ5IiwiZSIsImNvbnNvbGUiLCJsb2ciLCJlcnJvcnMiLCJjaGFuZ2VJdCIsIm8iLCJwYXRoIiwiZnN4Iiwid2hlcmVQYXRoIiwicmVzb2x2ZSIsInByb2Nlc3MiLCJjd2QiLCJ3aGVyZSIsInJlYWRGaWxlU3luYyIsInRvU3RyaW5nIiwibmV3SnMiLCJmcm9tIiwidG8iLCJ3cml0ZUZpbGVTeW5jIiwiX3RvUHJvZCIsInZhcnMiLCJmcyIsIm1rZGlycCIsInBhdGhFeHRBbmd1bGFyUHJvZCIsImV4aXN0c1N5bmMiLCJzeW5jIiwidCIsImV4dEFuZ3VsYXJNb2R1bGUiLCJfdG9EZXYiLCJfZ2V0QWxsQ29tcG9uZW50cyIsImFwcCIsInBhY2thZ2VMaWJQYXRoIiwiZmlsZXMiLCJyZWFkZGlyU3luYyIsImZvckVhY2giLCJmaWxlTmFtZSIsIl93cml0ZUZpbGVzVG9Qcm9kRm9sZGVyIiwicGF0aFRvRXh0QW5ndWxhclByb2QiLCJzdHJpbmciLCJpbmRleCIsIlNldCIsIndyaXRlVG9QYXRoV3JpdHRlbiIsIm1vZHVsZVZhcnMiLCJpbXBvcnRzIiwiZXhwb3J0cyIsImRlY2xhcmF0aW9ucyIsImNhcGNsYXNzbmFtZSIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJjbGFzc0ZpbGUiLCJjb250ZW50cyIsImJhc2VDb250ZW50Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7QUFFTyxTQUFTQSxrQkFBVCxHQUE4QjtBQUNuQyxTQUFPO0FBQ0wsWUFBUSxRQURIO0FBRUwsa0JBQWM7QUFDWixtQkFBZTtBQUFDLGdCQUFRLENBQUUsUUFBRjtBQUFULE9BREg7QUFFWixpQkFBZTtBQUFDLGdCQUFRLENBQUUsUUFBRjtBQUFULE9BRkg7QUFHWixlQUFlO0FBQUMsZ0JBQVEsQ0FBRSxRQUFGO0FBQVQsT0FISDtBQUlaLGlCQUFlO0FBQUMsZ0JBQVEsQ0FBRSxRQUFGO0FBQVQsT0FKSDtBQUtaLHFCQUFlO0FBQUMsZ0JBQVEsQ0FBRSxRQUFGO0FBQVQsT0FMSDtBQU1aLG1CQUFlO0FBQUMsZ0JBQVEsQ0FBRSxTQUFGO0FBQVQsT0FOSDtBQU9aLGNBQWU7QUFBQyxnQkFBUSxDQUFFLFNBQUY7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QUFHLENBQUNNLFlBQUosQ0FBa0IsR0FBRWtCLGNBQWUsSUFBR2tCLFNBQVUsRUFBaEQsRUFBbURuQyxRQUFuRCxFQUFqQjtBQUNBUCxNQUFBQSxHQUFHLENBQUNXLGFBQUosQ0FBbUIsR0FBRW1CLG9CQUFxQixJQUFHWSxTQUFVLEVBQXZELEVBQTBEQyxRQUExRCxFQUFvRSxPQUFwRSxFQUE2RSxNQUFJO0FBQUM7QUFBTyxPQUF6RjtBQUNBVCxNQUFBQSxrQkFBa0IsR0FBRyxJQUFyQjtBQUNELEtBVEQ7O0FBVUEsUUFBSUEsa0JBQUosRUFBd0I7QUFDdEIsVUFBSWYsQ0FBQyxHQUFHL0QsT0FBTyxDQUFDLGFBQUQsQ0FBUCxDQUF1QmdFLGdCQUF2QixDQUNOZSxVQUFVLENBQUNDLE9BREwsRUFDY0QsVUFBVSxDQUFDRSxPQUR6QixFQUNrQ0YsVUFBVSxDQUFDRyxZQUQ3QyxDQUFSOztBQUdBdEMsTUFBQUEsR0FBRyxDQUFDVyxhQUFKLENBQW1CLEdBQUVtQixvQkFBcUIsd0JBQTFDLEVBQW1FWCxDQUFuRSxFQUFzRSxPQUF0RSxFQUErRSxNQUFJO0FBQUM7QUFBTyxPQUEzRjtBQUNEOztBQUVELFVBQU15QixXQUFXLEdBQUc1QyxHQUFHLENBQUNNLFlBQUosQ0FBa0IsR0FBRWtCLGNBQWUsVUFBbkMsRUFBOENqQixRQUE5QyxFQUFwQjtBQUNBUCxJQUFBQSxHQUFHLENBQUNXLGFBQUosQ0FBbUIsR0FBRW1CLG9CQUFxQixVQUExQyxFQUFxRGMsV0FBckQsRUFBa0UsT0FBbEUsRUFBMkUsTUFBSTtBQUFDO0FBQU8sS0FBdkY7QUFFRCxHQTVDRCxDQTZDQSxPQUFPbkQsQ0FBUCxFQUFVO0FBQ1JDLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRixDQUFaO0FBQ0EsV0FBTyxFQUFQO0FBQ0Q7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRWYWxpZGF0ZU9wdGlvbnMoKSB7XG4gIHJldHVybiB7XG4gICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgIFwiZnJhbWV3b3JrXCI6ICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcInRvb2xraXRcIjogICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJ0aGVtZVwiOiAgICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwicHJvZmlsZVwiOiAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcImVudmlyb25tZW50XCI6IHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJ0cmVlc2hha2VcIjogICB7XCJ0eXBlXCI6IFsgXCJib29sZWFuXCIgXX0sXG4gICAgICBcInBvcnRcIjogICAgICAgIHtcInR5cGVcIjogWyBcImludGVnZXJcIiBdfSxcbiAgICAgIFwiZW1pdFwiOiAgICAgICAge1widHlwZVwiOiBbIFwiYm9vbGVhblwiIF19LFxuICAgICAgXCJicm93c2VyXCI6ICAgICB7XCJ0eXBlXCI6IFsgXCJib29sZWFuXCIgXX0sXG4gICAgICBcIndhdGNoXCI6ICAgICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuICAgICAgXCJ2ZXJib3NlXCI6ICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbiAgICAgIFwic2NyaXB0XCI6ICAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4gICAgICBcInBhY2thZ2VzXCI6ICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiLCBcImFycmF5XCIgXX1cbiAgICB9LFxuICAgIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjogZmFsc2VcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdE9wdGlvbnMoKSB7XG4gIHJldHVybiB7XG4gICAgZnJhbWV3b3JrOiBudWxsLFxuICAgIHRvb2xraXQ6ICdtb2Rlcm4nLFxuICAgIHRoZW1lOiAndGhlbWUtbWF0ZXJpYWwnLFxuICAgIHByb2ZpbGU6ICdkZXNrdG9wJywgXG4gICAgZW52aXJvbm1lbnQ6ICdkZXZlbG9wbWVudCcsIFxuICAgIHRyZWVzaGFrZTogZmFsc2UsXG4gICAgcG9ydDogMTk2MixcbiAgICBlbWl0OiB0cnVlLFxuICAgIGJyb3dzZXI6IHRydWUsXG4gICAgd2F0Y2g6ICd5ZXMnLFxuICAgIHZlcmJvc2U6ICdubycsXG4gICAgc2NyaXB0OiBudWxsLFxuICAgIHBhY2thZ2VzOiBudWxsXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRWYXJzKCkge1xuICByZXR1cm4ge1xuICAgIHdhdGNoU3RhcnRlZCA6IGZhbHNlLFxuICAgIGJ1aWxkc3RlcDogMCxcbiAgICBmaXJzdFRpbWUgOiB0cnVlLFxuICAgIGZpcnN0Q29tcGlsZTogdHJ1ZSxcbiAgICBicm93c2VyQ291bnQgOiAwLFxuICAgIG1hbmlmZXN0OiBudWxsLFxuICAgIGV4dFBhdGg6ICdleHQtYW5ndWxhcicsXG4gICAgcGx1Z2luRXJyb3JzOiBbXSxcbiAgICBkZXBzOiBbXSxcbiAgICB1c2VkRXh0Q29tcG9uZW50czogW10sXG4gICAgcmVidWlsZDogdHJ1ZVxuICB9XG59XG5cbmZ1bmN0aW9uIHRvWHR5cGUoc3RyKSB7XG4gIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9fL2csICctJylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKSB7XG4gIHRyeSB7XG4gICAgdmFyIGpzID0gbW9kdWxlLl9zb3VyY2UuX3ZhbHVlXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICAvL2xvZ3Yob3B0aW9ucywnSE9PSyBzdWNjZWVkTW9kdWxlLCBGVU5DVElPTiBfZXh0cmFjdEZyb21Tb3VyY2U6ICcgKyBtb2R1bGUucmVzb3VyY2UpXG5cbiAgICB2YXIgc3RhdGVtZW50cyA9IFtdXG5cbiAgICB2YXIgZ2VuZXJhdGUgPSByZXF1aXJlKFwiQGJhYmVsL2dlbmVyYXRvclwiKS5kZWZhdWx0XG4gICAgdmFyIHBhcnNlID0gcmVxdWlyZShcImJhYnlsb25cIikucGFyc2VcbiAgICB2YXIgdHJhdmVyc2UgPSByZXF1aXJlKFwiYXN0LXRyYXZlcnNlXCIpXG5cbiAgICB2YXIgYXN0ID0gcGFyc2UoanMsIHtcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgJ3R5cGVzY3JpcHQnLFxuICAgICAgICAnZmxvdycsXG4gICAgICAgICdkb0V4cHJlc3Npb25zJyxcbiAgICAgICAgJ29iamVjdFJlc3RTcHJlYWQnLFxuICAgICAgICAnY2xhc3NQcm9wZXJ0aWVzJyxcbiAgICAgICAgJ2V4cG9ydERlZmF1bHRGcm9tJyxcbiAgICAgICAgJ2V4cG9ydEV4dGVuc2lvbnMnLFxuICAgICAgICAnYXN5bmNHZW5lcmF0b3JzJyxcbiAgICAgICAgJ2Z1bmN0aW9uQmluZCcsXG4gICAgICAgICdmdW5jdGlvblNlbnQnLFxuICAgICAgICAnZHluYW1pY0ltcG9ydCdcbiAgICAgIF0sXG4gICAgICBzb3VyY2VUeXBlOiAnbW9kdWxlJ1xuICAgIH0pXG5cbiAgICB0cmF2ZXJzZShhc3QsIHtcbiAgICAgIHByZTogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJyAmJiBub2RlLmNhbGxlZSAmJiBub2RlLmNhbGxlZS5vYmplY3QgJiYgbm9kZS5jYWxsZWUub2JqZWN0Lm5hbWUgPT09ICdFeHQnKSB7XG4gICAgICAgICAgc3RhdGVtZW50cy5wdXNoKGdlbmVyYXRlKG5vZGUpLmNvZGUpXG4gICAgICAgIH1cbiAgICAgICAgaWYobm9kZS50eXBlID09PSAnU3RyaW5nTGl0ZXJhbCcpIHtcbiAgICAgICAgICBsZXQgY29kZSA9IG5vZGUudmFsdWVcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvZGUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChjb2RlLmNoYXJBdChpKSA9PSAnPCcpIHtcbiAgICAgICAgICAgICAgaWYgKGNvZGUuc3Vic3RyKGksIDQpID09ICc8IS0tJykge1xuICAgICAgICAgICAgICAgIGkgKz0gNFxuICAgICAgICAgICAgICAgIGkgKz0gY29kZS5zdWJzdHIoaSkuaW5kZXhPZignLS0+JykgKyAzXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29kZS5jaGFyQXQoaSsxKSAhPT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXJ0ID0gY29kZS5zdWJzdHJpbmcoaSlcbiAgICAgICAgICAgICAgICB2YXIgc3BhY2VFbmQgPSBzdGFydC5pbmRleE9mKCcgJylcbiAgICAgICAgICAgICAgICB2YXIgbmV3bGluZUVuZCA9IHN0YXJ0LmluZGV4T2YoJ1xcbicpXG4gICAgICAgICAgICAgICAgdmFyIHRhZ0VuZCA9IHN0YXJ0LmluZGV4T2YoJz4nKVxuICAgICAgICAgICAgICAgIHZhciBlbmQgPSBNYXRoLm1pbihzcGFjZUVuZCwgbmV3bGluZUVuZCwgdGFnRW5kKVxuICAgICAgICAgICAgICAgIGlmIChlbmQgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgdmFyIHh0eXBlID0gdG9YdHlwZShzdGFydC5zdWJzdHJpbmcoMSwgZW5kKSlcbiAgICAgICAgICAgICAgICAgIGlmKGV4dENvbXBvbmVudHMuaW5jbHVkZXMoeHR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0aGVWYWx1ZSA9IG5vZGUudmFsdWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhlVmFsdWUuaW5kZXhPZignZG9jdHlwZSBodG1sJykgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IHt4dHlwZTogeHR5cGV9XG4gICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbmZpZyA9IEpTT04uc3RyaW5naWZ5KHR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50cy5wdXNoKGBFeHQuY3JlYXRlKCR7Y29uZmlnfSlgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpICs9IGVuZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gc3RhdGVtZW50c1xuICB9XG4gIGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfZXh0cmFjdEZyb21Tb3VyY2U6ICcgKyBlKVxuICAgIHJldHVybiBbXVxuICB9XG59XG5cbmZ1bmN0aW9uIGNoYW5nZUl0KG8pIHtcbiAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICBjb25zdCBmc3ggPSByZXF1aXJlKCdmcy1leHRyYScpXG4gIGNvbnN0IHdoZXJlUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBvLndoZXJlKVxuICB2YXIganMgPSBmc3gucmVhZEZpbGVTeW5jKHdoZXJlUGF0aCkudG9TdHJpbmcoKVxuICB2YXIgbmV3SnMgPSBqcy5yZXBsYWNlKG8uZnJvbSxvLnRvKTtcbiAgZnN4LndyaXRlRmlsZVN5bmMod2hlcmVQYXRoLCBuZXdKcywgJ3V0Zi04JywgKCk9PntyZXR1cm59KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX3RvUHJvZCh2YXJzLCBvcHRpb25zKSB7XG4gIGNvbnN0IGxvZyA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ1xuICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF90b1Byb2QnKVxuICB0cnkge1xuICAgIGNvbnN0IGZzeCA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcbiAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgICBjb25zdCBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKVxuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuICAgIGNvbnN0IHBhdGhFeHRBbmd1bGFyUHJvZCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBgc3JjL2FwcC9leHQtYW5ndWxhci1wcm9kYCk7XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKHBhdGhFeHRBbmd1bGFyUHJvZCkpIHtcbiAgICAgIG1rZGlycC5zeW5jKHBhdGhFeHRBbmd1bGFyUHJvZClcbiAgICAgIGNvbnN0IHQgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmV4dEFuZ3VsYXJNb2R1bGUoJycsICcnLCAnJylcbiAgICAgIGZzeC53cml0ZUZpbGVTeW5jKGAke3BhdGhFeHRBbmd1bGFyUHJvZH0vZXh0LWFuZ3VsYXIubW9kdWxlLnRzYCwgdCwgJ3V0Zi04JywgKCkgPT4ge1xuICAgICAgICByZXR1cm5cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdmFyIG8gPSB7fVxuICAgIG8ud2hlcmUgPSAnc3JjL2FwcC9hcHAubW9kdWxlLnRzJ1xuICAgIG8uZnJvbSA9IGBpbXBvcnQgeyBFeHRBbmd1bGFyTW9kdWxlIH0gZnJvbSAnQHNlbmNoYS9leHQtYW5ndWxhcidgXG4gICAgby50byA9IGBpbXBvcnQgeyBFeHRBbmd1bGFyTW9kdWxlIH0gZnJvbSAnLi9leHQtYW5ndWxhci1wcm9kL2V4dC1hbmd1bGFyLm1vZHVsZSdgXG4gICAgY2hhbmdlSXQobylcblxuICAgIG8gPSB7fVxuICAgIG8ud2hlcmUgPSAnc3JjL21haW4udHMnXG4gICAgby5mcm9tID0gYGJvb3RzdHJhcE1vZHVsZSggQXBwTW9kdWxlICk7YFxuICAgIG8udG8gPSBgZW5hYmxlUHJvZE1vZGUoKTtib290c3RyYXBNb2R1bGUoQXBwTW9kdWxlKTtgXG4gICAgY2hhbmdlSXQobylcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpXG4gICAgcmV0dXJuIFtdXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF90b0Rldih2YXJzLCBvcHRpb25zKSB7XG4gIGNvbnN0IGxvZyA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ1xuICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF90b1Byb2QnKVxuICB0cnkge1xuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICBjb25zdCBwYXRoRXh0QW5ndWxhclByb2QgPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgYHNyYy9hcHAvZXh0LWFuZ3VsYXItcHJvZGApO1xuICAgIHJlcXVpcmUoJ3JpbXJhZicpLnN5bmMocGF0aEV4dEFuZ3VsYXJQcm9kKTtcblxuICAgIHZhciBvID0ge31cbiAgICBvLndoZXJlID0gJ3NyYy9hcHAvYXBwLm1vZHVsZS50cydcbiAgICBvLmZyb20gPSBgaW1wb3J0IHsgRXh0QW5ndWxhck1vZHVsZSB9IGZyb20gJy4vZXh0LWFuZ3VsYXItcHJvZC9leHQtYW5ndWxhci5tb2R1bGUnYFxuICAgIG8udG8gPSBgaW1wb3J0IHsgRXh0QW5ndWxhck1vZHVsZSB9IGZyb20gJ0BzZW5jaGEvZXh0LWFuZ3VsYXInYFxuICAgIGNoYW5nZUl0KG8pXG5cbiAgICBvID0ge31cbiAgICBvLndoZXJlID0gJ3NyYy9tYWluLnRzJ1xuICAgIG8uZnJvbSA9IGBlbmFibGVQcm9kTW9kZSgpO2Jvb3RzdHJhcE1vZHVsZShBcHBNb2R1bGUpO2BcbiAgICBvLnRvID0gYGJvb3RzdHJhcE1vZHVsZSggQXBwTW9kdWxlICk7YFxuICAgIGNoYW5nZUl0KG8pXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICAgIHJldHVybiBbXVxuICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRBbGxDb21wb25lbnRzKHZhcnMsIG9wdGlvbnMpIHtcbiAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gIGxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gX2dldEFsbENvbXBvbmVudHMnKVxuXG4gIHRyeSB7XG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgIGNvbnN0IGZzeCA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcblxuICAgIGxvZyh2YXJzLmFwcCArIGBHZXR0aW5nIGFsbCByZWZlcmVuY2VkIGV4dC0ke29wdGlvbnMuZnJhbWV3b3JrfSBtb2R1bGVzYClcbiAgICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdXG4gICAgY29uc3QgcGFja2FnZUxpYlBhdGggPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1hbmd1bGFyL3NyYy9saWInKVxuICAgIHZhciBmaWxlcyA9IGZzeC5yZWFkZGlyU3luYyhwYWNrYWdlTGliUGF0aClcbiAgICBmaWxlcy5mb3JFYWNoKChmaWxlTmFtZSkgPT4ge1xuICAgICAgaWYgKGZpbGVOYW1lICYmIGZpbGVOYW1lLnN1YnN0cigwLCA0KSA9PSAnZXh0LScpIHtcbiAgICAgICAgdmFyIGVuZCA9IGZpbGVOYW1lLnN1YnN0cig0KS5pbmRleE9mKCcuY29tcG9uZW50JylcbiAgICAgICAgaWYgKGVuZCA+PSAwKSB7XG4gICAgICAgICAgZXh0Q29tcG9uZW50cy5wdXNoKGZpbGVOYW1lLnN1YnN0cmluZyg0LCBlbmQgKyA0KSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgbG9nKHZhcnMuYXBwICsgYFdyaXRpbmcgYWxsIHJlZmVyZW5jZWQgZXh0LSR7b3B0aW9ucy5mcmFtZXdvcmt9IG1vZHVsZXNgKVxuICAgIHJldHVybiBleHRDb21wb25lbnRzXG5cbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpXG4gICAgcmV0dXJuIFtdXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF93cml0ZUZpbGVzVG9Qcm9kRm9sZGVyKHZhcnMsIG9wdGlvbnMpIHtcbiAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gIGxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXInKVxuXG4gIHRyeSB7XG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgIGNvbnN0IGZzeCA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcblxuICAgIGNvbnN0IHBhY2thZ2VMaWJQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtYW5ndWxhci9zcmMvbGliJylcbiAgICBjb25zdCBwYXRoVG9FeHRBbmd1bGFyUHJvZCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBgc3JjL2FwcC9leHQtYW5ndWxhci1wcm9kYClcbiAgICBjb25zdCBzdHJpbmcgPSAnRXh0LmNyZWF0ZSh7XFxcInh0eXBlXFxcIjpcXFwiJ1xuXG4gICAgdmFycy5kZXBzLmZvckVhY2goY29kZSA9PiB7XG4gICAgICB2YXIgaW5kZXggPSBjb2RlLmluZGV4T2Yoc3RyaW5nKVxuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgY29kZSA9IGNvZGUuc3Vic3RyaW5nKGluZGV4ICsgc3RyaW5nLmxlbmd0aClcbiAgICAgICAgdmFyIGVuZCA9IGNvZGUuaW5kZXhPZignXFxcIicpXG4gICAgICAgIHZhcnMudXNlZEV4dENvbXBvbmVudHMucHVzaChjb2RlLnN1YnN0cigwLCBlbmQpKVxuICAgICAgfVxuICAgIH0pXG4gICAgdmFycy51c2VkRXh0Q29tcG9uZW50cyA9IFsuLi5uZXcgU2V0KHZhcnMudXNlZEV4dENvbXBvbmVudHMpXVxuXG4gICAgdmFyIHdyaXRlVG9QYXRoV3JpdHRlbiA9IGZhbHNlXG4gICAgdmFyIG1vZHVsZVZhcnMgPSB7XG4gICAgICBpbXBvcnRzOiAnJyxcbiAgICAgIGV4cG9ydHM6ICcnLFxuICAgICAgZGVjbGFyYXRpb25zOiAnJ1xuICAgIH1cbiAgICB2YXJzLnVzZWRFeHRDb21wb25lbnRzLmZvckVhY2goeHR5cGUgPT4ge1xuICAgICAgdmFyIGNhcGNsYXNzbmFtZSA9IHh0eXBlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgeHR5cGUucmVwbGFjZSgvLS9nLCBcIl9cIikuc2xpY2UoMSlcbiAgICAgIG1vZHVsZVZhcnMuaW1wb3J0cyA9IG1vZHVsZVZhcnMuaW1wb3J0cyArIGBpbXBvcnQgeyBFeHQke2NhcGNsYXNzbmFtZX1Db21wb25lbnQgfSBmcm9tICcuL2V4dC0ke3h0eXBlfS5jb21wb25lbnQnO1xcbmBcbiAgICAgIG1vZHVsZVZhcnMuZXhwb3J0cyA9IG1vZHVsZVZhcnMuZXhwb3J0cyArIGAgICAgRXh0JHtjYXBjbGFzc25hbWV9Q29tcG9uZW50LFxcbmBcbiAgICAgIG1vZHVsZVZhcnMuZGVjbGFyYXRpb25zID0gbW9kdWxlVmFycy5kZWNsYXJhdGlvbnMgKyBgICAgIEV4dCR7Y2FwY2xhc3NuYW1lfUNvbXBvbmVudCxcXG5gXG4gICAgICB2YXIgY2xhc3NGaWxlID0gYGV4dC0ke3h0eXBlfS5jb21wb25lbnQudHNgXG4gICAgICBjb25zdCBjb250ZW50cyA9IGZzeC5yZWFkRmlsZVN5bmMoYCR7cGFja2FnZUxpYlBhdGh9LyR7Y2xhc3NGaWxlfWApLnRvU3RyaW5nKClcbiAgICAgIGZzeC53cml0ZUZpbGVTeW5jKGAke3BhdGhUb0V4dEFuZ3VsYXJQcm9kfS8ke2NsYXNzRmlsZX1gLCBjb250ZW50cywgJ3V0Zi04JywgKCk9PntyZXR1cm59KVxuICAgICAgd3JpdGVUb1BhdGhXcml0dGVuID0gdHJ1ZVxuICAgIH0pXG4gICAgaWYgKHdyaXRlVG9QYXRoV3JpdHRlbikge1xuICAgICAgdmFyIHQgPSByZXF1aXJlKCcuL2FydGlmYWN0cycpLmV4dEFuZ3VsYXJNb2R1bGUoXG4gICAgICAgIG1vZHVsZVZhcnMuaW1wb3J0cywgbW9kdWxlVmFycy5leHBvcnRzLCBtb2R1bGVWYXJzLmRlY2xhcmF0aW9uc1xuICAgICAgKVxuICAgICAgZnN4LndyaXRlRmlsZVN5bmMoYCR7cGF0aFRvRXh0QW5ndWxhclByb2R9L2V4dC1hbmd1bGFyLm1vZHVsZS50c2AsIHQsICd1dGYtOCcsICgpPT57cmV0dXJufSlcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlQ29udGVudCA9IGZzeC5yZWFkRmlsZVN5bmMoYCR7cGFja2FnZUxpYlBhdGh9L2Jhc2UudHNgKS50b1N0cmluZygpXG4gICAgZnN4LndyaXRlRmlsZVN5bmMoYCR7cGF0aFRvRXh0QW5ndWxhclByb2R9L2Jhc2UudHNgLCBiYXNlQ29udGVudCwgJ3V0Zi04JywgKCk9PntyZXR1cm59KVxuXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICAgIHJldHVybiBbXVxuICB9XG59Il19