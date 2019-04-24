"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._getDefaultVars = _getDefaultVars;
exports._extractFromSource = _extractFromSource;
exports._toProd = _toProd;
exports._toDev = _toDev;
exports._getAllComponents = _getAllComponents;
exports._writeFilesToProdFolder = _writeFilesToProdFolder;

function _getDefaultVars() {
  return {
    touchFile: '/src/themer.js',
    watchStarted: false,
    buildstep: '1 of 1',
    firstTime: true,
    firstCompile: true,
    browserCount: 0,
    manifest: null,
    extPath: 'ext',
    pluginErrors: [],
    deps: [],
    usedExtWebComponents: [],
    rebuild: true
  };
}

function _extractFromSource(module, options, compilation, ExtWebComponents) {
  const logv = require('./pluginUtil').logv;

  const verbose = options.verbose;
  logv(verbose, 'FUNCTION _extractFromSource');
  var js = module._source._value;
  logv(verbose, module.resource);
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

      if (node.type === 'CallExpression') {
        const code = generate(node).code;
        statements = statements.concat(getXtypeFromHTMLJS(code, statements, ExtWebComponents));
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
              var end = getEnd(start, [' ', '\n', '>']);
              var xtype = start.substring(1, end);

              if (ExtWebComponents.includes(xtype)) {
                xtype = xtype.substring(4, end);
                var theValue = node.value.toLowerCase();

                if (theValue.indexOf('doctype html') == -1) {
                  var config = `Ext.create(${JSON.stringify({
                    xtype: xtype
                  })})`;

                  if (statements.indexOf(config) < 0) {
                    statements.push(config);
                  }
                }
              }

              i += end;
            }
          }
        }

        statements = statements.concat(getXtypeFromHTMLJS(code, statements, ExtWebComponents));
      }
    }
  });
  return statements;
}

function getXtypeFromHTMLJS(code, statements, ExtWebComponents) {
  const logv = require('./pluginUtil').logv;

  const result = [];
  const xtypeRepetitons = (code.match(/xtype/g) || []).length;

  if (xtypeRepetitons > 0) {
    for (var j = 0; j < xtypeRepetitons; j++) {
      var start = code.substring(code.indexOf('xtype') + 5);
      var ifAsProps = start.indexOf(':');
      var ifAsAttribute = start.indexOf('=');
      start = start.substring(Math.min(ifAsProps, ifAsAttribute) + 1);
      start = start.trim();
      var end = getEnd(start, ['\n', '>', '}', '\r']);
      var xtype = start.substring(1, end).trim().replace(/['",]/g, '');
      var config = `Ext.create(${JSON.stringify({
        xtype: xtype
      })})`;

      if (ExtWebComponents.includes('ext-' + xtype) && statements.indexOf(config) === -1) {
        result.push(config);
      }

      code = start.substr(end).trim();
    }
  }

  return result;
}

function _toProd(vars, options) {
  const logv = require('./pluginUtil').logv;

  logv(options.verbose, 'FUNCTION _toProd (empty');

  try {} catch (e) {
    console.log(e);
    return [];
  }
}

function _toDev(vars, options) {
  try {} catch (e) {
    console.log(e);
    return [];
  }
}

function _getAllComponents(vars, options) {
  const log = require('./pluginUtil').log;

  const logv = require('./pluginUtil').logv;

  logv(options.verbose, 'FUNCTION _getAllComponents');

  const path = require('path');

  const fsx = require('fs-extra');

  var ExtWebComponents = [];
  const packageLibPath = path.resolve(process.cwd(), 'node_modules/@sencha/ext-web-components/lib');
  var files = fsx.readdirSync(packageLibPath);
  files.forEach(fileName => {
    if (fileName && fileName.substr(0, 4) == 'ext-') {
      var end = fileName.substr(4).indexOf('.component');

      if (end >= 0) {
        ExtWebComponents.push(fileName.substring(0, end + 4));
      }
    }
  });
  logv(options.verbose, `Identifying all ext-${options.framework} modules`); //log(vars.app, `Identifying all ext-${options.framework} modules`)

  return ExtWebComponents;
}

function _writeFilesToProdFolder(vars, options) {
  const logv = require('./pluginUtil').logv;

  logv(options.verbose, 'FUNCTION _writeFilesToProdFolder (empty)');

  try {} catch (e) {
    console.log(e);
  }
}

function getEnd(start, setOfSymbolsToCheck) {
  var endingsArr = [];

  for (var i = 0; i < setOfSymbolsToCheck.length; i++) {
    var symbolIndex = start.indexOf(setOfSymbolsToCheck[i]);

    if (symbolIndex !== -1) {
      endingsArr.push(symbolIndex);
    }
  }

  return Math.min(...endingsArr);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJjb21wb25lbnRzVXRpbC5qcyJdLCJuYW1lcyI6WyJfZ2V0RGVmYXVsdFZhcnMiLCJ0b3VjaEZpbGUiLCJ3YXRjaFN0YXJ0ZWQiLCJidWlsZHN0ZXAiLCJmaXJzdFRpbWUiLCJmaXJzdENvbXBpbGUiLCJicm93c2VyQ291bnQiLCJtYW5pZmVzdCIsImV4dFBhdGgiLCJwbHVnaW5FcnJvcnMiLCJkZXBzIiwidXNlZEV4dFdlYkNvbXBvbmVudHMiLCJyZWJ1aWxkIiwiX2V4dHJhY3RGcm9tU291cmNlIiwibW9kdWxlIiwib3B0aW9ucyIsImNvbXBpbGF0aW9uIiwiRXh0V2ViQ29tcG9uZW50cyIsImxvZ3YiLCJyZXF1aXJlIiwidmVyYm9zZSIsImpzIiwiX3NvdXJjZSIsIl92YWx1ZSIsInJlc291cmNlIiwic3RhdGVtZW50cyIsImdlbmVyYXRlIiwiZGVmYXVsdCIsInBhcnNlIiwidHJhdmVyc2UiLCJhc3QiLCJwbHVnaW5zIiwic291cmNlVHlwZSIsInByZSIsIm5vZGUiLCJ0eXBlIiwiY2FsbGVlIiwib2JqZWN0IiwibmFtZSIsInB1c2giLCJjb2RlIiwiY29uY2F0IiwiZ2V0WHR5cGVGcm9tSFRNTEpTIiwidmFsdWUiLCJpIiwibGVuZ3RoIiwiY2hhckF0Iiwic3Vic3RyIiwiaW5kZXhPZiIsInN0YXJ0Iiwic3Vic3RyaW5nIiwiZW5kIiwiZ2V0RW5kIiwieHR5cGUiLCJpbmNsdWRlcyIsInRoZVZhbHVlIiwidG9Mb3dlckNhc2UiLCJjb25maWciLCJKU09OIiwic3RyaW5naWZ5IiwicmVzdWx0IiwieHR5cGVSZXBldGl0b25zIiwibWF0Y2giLCJqIiwiaWZBc1Byb3BzIiwiaWZBc0F0dHJpYnV0ZSIsIk1hdGgiLCJtaW4iLCJ0cmltIiwicmVwbGFjZSIsIl90b1Byb2QiLCJ2YXJzIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJfdG9EZXYiLCJfZ2V0QWxsQ29tcG9uZW50cyIsInBhdGgiLCJmc3giLCJwYWNrYWdlTGliUGF0aCIsInJlc29sdmUiLCJwcm9jZXNzIiwiY3dkIiwiZmlsZXMiLCJyZWFkZGlyU3luYyIsImZvckVhY2giLCJmaWxlTmFtZSIsImZyYW1ld29yayIsIl93cml0ZUZpbGVzVG9Qcm9kRm9sZGVyIiwic2V0T2ZTeW1ib2xzVG9DaGVjayIsImVuZGluZ3NBcnIiLCJzeW1ib2xJbmRleCJdLCJtYXBwaW5ncyI6IkFBQ0E7Ozs7Ozs7Ozs7OztBQUVPLFNBQVNBLGVBQVQsR0FBMkI7QUFDaEMsU0FBTztBQUNMQyxJQUFBQSxTQUFTLEVBQUUsZ0JBRE47QUFFTEMsSUFBQUEsWUFBWSxFQUFHLEtBRlY7QUFHTEMsSUFBQUEsU0FBUyxFQUFFLFFBSE47QUFJTEMsSUFBQUEsU0FBUyxFQUFHLElBSlA7QUFLTEMsSUFBQUEsWUFBWSxFQUFFLElBTFQ7QUFNTEMsSUFBQUEsWUFBWSxFQUFHLENBTlY7QUFPTEMsSUFBQUEsUUFBUSxFQUFFLElBUEw7QUFRTEMsSUFBQUEsT0FBTyxFQUFFLEtBUko7QUFTTEMsSUFBQUEsWUFBWSxFQUFFLEVBVFQ7QUFVTEMsSUFBQUEsSUFBSSxFQUFFLEVBVkQ7QUFXTEMsSUFBQUEsb0JBQW9CLEVBQUUsRUFYakI7QUFZTEMsSUFBQUEsT0FBTyxFQUFFO0FBWkosR0FBUDtBQWNEOztBQUVNLFNBQVNDLGtCQUFULENBQTRCQyxNQUE1QixFQUFvQ0MsT0FBcEMsRUFBNkNDLFdBQTdDLEVBQTBEQyxnQkFBMUQsRUFBNEU7QUFDakYsUUFBTUMsSUFBSSxHQUFHQyxPQUFPLENBQUMsY0FBRCxDQUFQLENBQXdCRCxJQUFyQzs7QUFDQSxRQUFNRSxPQUFPLEdBQUdMLE9BQU8sQ0FBQ0ssT0FBeEI7QUFDQUYsRUFBQUEsSUFBSSxDQUFDRSxPQUFELEVBQVMsNkJBQVQsQ0FBSjtBQUNBLE1BQUlDLEVBQUUsR0FBR1AsTUFBTSxDQUFDUSxPQUFQLENBQWVDLE1BQXhCO0FBQ0FMLEVBQUFBLElBQUksQ0FBQ0UsT0FBRCxFQUFTTixNQUFNLENBQUNVLFFBQWhCLENBQUo7QUFDQSxNQUFJQyxVQUFVLEdBQUcsRUFBakI7O0FBRUEsTUFBSUMsUUFBUSxHQUFHUCxPQUFPLENBQUMsa0JBQUQsQ0FBUCxDQUE0QlEsT0FBM0M7O0FBQ0EsTUFBSUMsS0FBSyxHQUFHVCxPQUFPLENBQUMsU0FBRCxDQUFQLENBQW1CUyxLQUEvQjs7QUFDQSxNQUFJQyxRQUFRLEdBQUdWLE9BQU8sQ0FBQyxjQUFELENBQXRCOztBQUVBLE1BQUlXLEdBQUcsR0FBR0YsS0FBSyxDQUFDUCxFQUFELEVBQUs7QUFDbEJVLElBQUFBLE9BQU8sRUFBRSxDQUNQLFlBRE8sRUFFUCxNQUZPLEVBR1AsZUFITyxFQUlQLGtCQUpPLEVBS1AsaUJBTE8sRUFNUCxtQkFOTyxFQU9QLGtCQVBPLEVBUVAsaUJBUk8sRUFTUCxjQVRPLEVBVVAsY0FWTyxFQVdQLGVBWE8sQ0FEUztBQWNsQkMsSUFBQUEsVUFBVSxFQUFFO0FBZE0sR0FBTCxDQUFmO0FBaUJBSCxFQUFBQSxRQUFRLENBQUNDLEdBQUQsRUFBTTtBQUNaRyxJQUFBQSxHQUFHLEVBQUUsVUFBVUMsSUFBVixFQUFnQjtBQUNuQixVQUFJQSxJQUFJLENBQUNDLElBQUwsS0FBYyxnQkFBZCxJQUFrQ0QsSUFBSSxDQUFDRSxNQUF2QyxJQUFpREYsSUFBSSxDQUFDRSxNQUFMLENBQVlDLE1BQTdELElBQXVFSCxJQUFJLENBQUNFLE1BQUwsQ0FBWUMsTUFBWixDQUFtQkMsSUFBbkIsS0FBNEIsS0FBdkcsRUFBOEc7QUFDNUdiLFFBQUFBLFVBQVUsQ0FBQ2MsSUFBWCxDQUFnQmIsUUFBUSxDQUFDUSxJQUFELENBQVIsQ0FBZU0sSUFBL0I7QUFDRDs7QUFDRCxVQUFJTixJQUFJLENBQUNDLElBQUwsS0FBYyxnQkFBbEIsRUFBb0M7QUFDbEMsY0FBTUssSUFBSSxHQUFHZCxRQUFRLENBQUNRLElBQUQsQ0FBUixDQUFlTSxJQUE1QjtBQUNBZixRQUFBQSxVQUFVLEdBQUdBLFVBQVUsQ0FBQ2dCLE1BQVgsQ0FBa0JDLGtCQUFrQixDQUFDRixJQUFELEVBQU9mLFVBQVAsRUFBbUJSLGdCQUFuQixDQUFwQyxDQUFiO0FBQ0Q7O0FBQ0QsVUFBR2lCLElBQUksQ0FBQ0MsSUFBTCxLQUFjLGVBQWpCLEVBQWtDO0FBQ2hDLFlBQUlLLElBQUksR0FBR04sSUFBSSxDQUFDUyxLQUFoQjs7QUFDQSxhQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdKLElBQUksQ0FBQ0ssTUFBekIsRUFBaUMsRUFBRUQsQ0FBbkMsRUFBc0M7QUFDcEMsY0FBSUosSUFBSSxDQUFDTSxNQUFMLENBQVlGLENBQVosS0FBa0IsR0FBdEIsRUFBMkI7QUFDekIsZ0JBQUlKLElBQUksQ0FBQ08sTUFBTCxDQUFZSCxDQUFaLEVBQWUsQ0FBZixLQUFxQixNQUF6QixFQUFpQztBQUMvQkEsY0FBQUEsQ0FBQyxJQUFJLENBQUw7QUFDQUEsY0FBQUEsQ0FBQyxJQUFJSixJQUFJLENBQUNPLE1BQUwsQ0FBWUgsQ0FBWixFQUFlSSxPQUFmLENBQXVCLEtBQXZCLElBQWdDLENBQXJDO0FBQ0QsYUFIRCxNQUdPLElBQUlSLElBQUksQ0FBQ00sTUFBTCxDQUFZRixDQUFDLEdBQUMsQ0FBZCxNQUFxQixHQUF6QixFQUE4QjtBQUNuQyxrQkFBSUssS0FBSyxHQUFHVCxJQUFJLENBQUNVLFNBQUwsQ0FBZU4sQ0FBZixDQUFaO0FBQ0Esa0JBQUlPLEdBQUcsR0FBR0MsTUFBTSxDQUFDSCxLQUFELEVBQVEsQ0FBQyxHQUFELEVBQU0sSUFBTixFQUFZLEdBQVosQ0FBUixDQUFoQjtBQUVFLGtCQUFJSSxLQUFLLEdBQUdKLEtBQUssQ0FBQ0MsU0FBTixDQUFnQixDQUFoQixFQUFtQkMsR0FBbkIsQ0FBWjs7QUFDQSxrQkFBR2xDLGdCQUFnQixDQUFDcUMsUUFBakIsQ0FBMEJELEtBQTFCLENBQUgsRUFBcUM7QUFDbkNBLGdCQUFBQSxLQUFLLEdBQUdBLEtBQUssQ0FBQ0gsU0FBTixDQUFnQixDQUFoQixFQUFtQkMsR0FBbkIsQ0FBUjtBQUNBLG9CQUFJSSxRQUFRLEdBQUdyQixJQUFJLENBQUNTLEtBQUwsQ0FBV2EsV0FBWCxFQUFmOztBQUNBLG9CQUFJRCxRQUFRLENBQUNQLE9BQVQsQ0FBaUIsY0FBakIsS0FBb0MsQ0FBQyxDQUF6QyxFQUE0QztBQUMxQyxzQkFBSVMsTUFBTSxHQUFJLGNBQWFDLElBQUksQ0FBQ0MsU0FBTCxDQUFlO0FBQUNOLG9CQUFBQSxLQUFLLEVBQUVBO0FBQVIsbUJBQWYsQ0FBK0IsR0FBMUQ7O0FBRUEsc0JBQUk1QixVQUFVLENBQUN1QixPQUFYLENBQW1CUyxNQUFuQixJQUE2QixDQUFqQyxFQUFvQztBQUNsQ2hDLG9CQUFBQSxVQUFVLENBQUNjLElBQVgsQ0FBZ0JrQixNQUFoQjtBQUNEO0FBQ0Y7QUFDRjs7QUFDRGIsY0FBQUEsQ0FBQyxJQUFJTyxHQUFMO0FBQ0Q7QUFDRjtBQUNGOztBQUVEMUIsUUFBQUEsVUFBVSxHQUFHQSxVQUFVLENBQUNnQixNQUFYLENBQWtCQyxrQkFBa0IsQ0FBQ0YsSUFBRCxFQUFPZixVQUFQLEVBQW1CUixnQkFBbkIsQ0FBcEMsQ0FBYjtBQUNEO0FBQ0Y7QUF2Q1MsR0FBTixDQUFSO0FBMENBLFNBQU9RLFVBQVA7QUFDRDs7QUFFRCxTQUFTaUIsa0JBQVQsQ0FBNEJGLElBQTVCLEVBQWtDZixVQUFsQyxFQUE4Q1IsZ0JBQTlDLEVBQWdFO0FBQzlELFFBQU1DLElBQUksR0FBR0MsT0FBTyxDQUFDLGNBQUQsQ0FBUCxDQUF3QkQsSUFBckM7O0FBQ0EsUUFBTTBDLE1BQU0sR0FBRyxFQUFmO0FBQ0EsUUFBTUMsZUFBZSxHQUFHLENBQUNyQixJQUFJLENBQUNzQixLQUFMLENBQVcsUUFBWCxLQUF3QixFQUF6QixFQUE2QmpCLE1BQXJEOztBQUVBLE1BQUlnQixlQUFlLEdBQUcsQ0FBdEIsRUFBeUI7QUFDdkIsU0FBSyxJQUFJRSxDQUFDLEdBQUMsQ0FBWCxFQUFjQSxDQUFDLEdBQUNGLGVBQWhCLEVBQWlDRSxDQUFDLEVBQWxDLEVBQXNDO0FBQ3BDLFVBQUlkLEtBQUssR0FBR1QsSUFBSSxDQUFDVSxTQUFMLENBQWVWLElBQUksQ0FBQ1EsT0FBTCxDQUFhLE9BQWIsSUFBd0IsQ0FBdkMsQ0FBWjtBQUNBLFVBQUlnQixTQUFTLEdBQUdmLEtBQUssQ0FBQ0QsT0FBTixDQUFjLEdBQWQsQ0FBaEI7QUFDQSxVQUFJaUIsYUFBYSxHQUFHaEIsS0FBSyxDQUFDRCxPQUFOLENBQWMsR0FBZCxDQUFwQjtBQUNBQyxNQUFBQSxLQUFLLEdBQUdBLEtBQUssQ0FBQ0MsU0FBTixDQUFnQmdCLElBQUksQ0FBQ0MsR0FBTCxDQUFTSCxTQUFULEVBQW9CQyxhQUFwQixJQUFxQyxDQUFyRCxDQUFSO0FBQ0FoQixNQUFBQSxLQUFLLEdBQUdBLEtBQUssQ0FBQ21CLElBQU4sRUFBUjtBQUNBLFVBQUlqQixHQUFHLEdBQUdDLE1BQU0sQ0FBQ0gsS0FBRCxFQUFRLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBVyxHQUFYLEVBQWdCLElBQWhCLENBQVIsQ0FBaEI7QUFDQSxVQUFJSSxLQUFLLEdBQUdKLEtBQUssQ0FBQ0MsU0FBTixDQUFnQixDQUFoQixFQUFtQkMsR0FBbkIsRUFBd0JpQixJQUF4QixHQUErQkMsT0FBL0IsQ0FBdUMsUUFBdkMsRUFBaUQsRUFBakQsQ0FBWjtBQUVBLFVBQUlaLE1BQU0sR0FBSSxjQUFhQyxJQUFJLENBQUNDLFNBQUwsQ0FBZTtBQUFDTixRQUFBQSxLQUFLLEVBQUVBO0FBQVIsT0FBZixDQUErQixHQUExRDs7QUFDQSxVQUFHcEMsZ0JBQWdCLENBQUNxQyxRQUFqQixDQUEwQixTQUFTRCxLQUFuQyxLQUE2QzVCLFVBQVUsQ0FBQ3VCLE9BQVgsQ0FBbUJTLE1BQW5CLE1BQStCLENBQUMsQ0FBaEYsRUFBbUY7QUFDakZHLFFBQUFBLE1BQU0sQ0FBQ3JCLElBQVAsQ0FBWWtCLE1BQVo7QUFDRDs7QUFDRGpCLE1BQUFBLElBQUksR0FBR1MsS0FBSyxDQUFDRixNQUFOLENBQWFJLEdBQWIsRUFBa0JpQixJQUFsQixFQUFQO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPUixNQUFQO0FBQ0Q7O0FBRU0sU0FBU1UsT0FBVCxDQUFpQkMsSUFBakIsRUFBdUJ4RCxPQUF2QixFQUFnQztBQUNyQyxRQUFNRyxJQUFJLEdBQUdDLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0JELElBQXJDOztBQUNBQSxFQUFBQSxJQUFJLENBQUNILE9BQU8sQ0FBQ0ssT0FBVCxFQUFpQix5QkFBakIsQ0FBSjs7QUFDQSxNQUFJLENBQ0gsQ0FERCxDQUVBLE9BQU9vRCxDQUFQLEVBQVU7QUFDUkMsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlGLENBQVo7QUFDQSxXQUFPLEVBQVA7QUFDRDtBQUNGOztBQUVNLFNBQVNHLE1BQVQsQ0FBZ0JKLElBQWhCLEVBQXNCeEQsT0FBdEIsRUFBK0I7QUFDcEMsTUFBSSxDQUNILENBREQsQ0FFQSxPQUFPeUQsQ0FBUCxFQUFVO0FBQ1JDLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRixDQUFaO0FBQ0EsV0FBTyxFQUFQO0FBQ0Q7QUFDRjs7QUFFTSxTQUFTSSxpQkFBVCxDQUEyQkwsSUFBM0IsRUFBaUN4RCxPQUFqQyxFQUEwQztBQUMvQyxRQUFNMkQsR0FBRyxHQUFHdkQsT0FBTyxDQUFDLGNBQUQsQ0FBUCxDQUF3QnVELEdBQXBDOztBQUNBLFFBQU14RCxJQUFJLEdBQUdDLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0JELElBQXJDOztBQUNBQSxFQUFBQSxJQUFJLENBQUNILE9BQU8sQ0FBQ0ssT0FBVCxFQUFpQiw0QkFBakIsQ0FBSjs7QUFFQSxRQUFNeUQsSUFBSSxHQUFHMUQsT0FBTyxDQUFDLE1BQUQsQ0FBcEI7O0FBQ0EsUUFBTTJELEdBQUcsR0FBRzNELE9BQU8sQ0FBQyxVQUFELENBQW5COztBQUVBLE1BQUlGLGdCQUFnQixHQUFHLEVBQXZCO0FBQ0EsUUFBTThELGNBQWMsR0FBR0YsSUFBSSxDQUFDRyxPQUFMLENBQWFDLE9BQU8sQ0FBQ0MsR0FBUixFQUFiLEVBQTRCLDZDQUE1QixDQUF2QjtBQUNBLE1BQUlDLEtBQUssR0FBR0wsR0FBRyxDQUFDTSxXQUFKLENBQWdCTCxjQUFoQixDQUFaO0FBQ0FJLEVBQUFBLEtBQUssQ0FBQ0UsT0FBTixDQUFlQyxRQUFELElBQWM7QUFDMUIsUUFBSUEsUUFBUSxJQUFJQSxRQUFRLENBQUN2QyxNQUFULENBQWdCLENBQWhCLEVBQW1CLENBQW5CLEtBQXlCLE1BQXpDLEVBQWlEO0FBQy9DLFVBQUlJLEdBQUcsR0FBR21DLFFBQVEsQ0FBQ3ZDLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUJDLE9BQW5CLENBQTJCLFlBQTNCLENBQVY7O0FBQ0EsVUFBSUcsR0FBRyxJQUFJLENBQVgsRUFBYztBQUNabEMsUUFBQUEsZ0JBQWdCLENBQUNzQixJQUFqQixDQUFzQitDLFFBQVEsQ0FBQ3BDLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0JDLEdBQUcsR0FBRyxDQUE1QixDQUF0QjtBQUNEO0FBQ0Y7QUFDRixHQVBEO0FBUUFqQyxFQUFBQSxJQUFJLENBQUNILE9BQU8sQ0FBQ0ssT0FBVCxFQUFtQix1QkFBc0JMLE9BQU8sQ0FBQ3dFLFNBQVUsVUFBM0QsQ0FBSixDQW5CK0MsQ0FvQi9DOztBQUNBLFNBQU90RSxnQkFBUDtBQUNEOztBQUVNLFNBQVN1RSx1QkFBVCxDQUFpQ2pCLElBQWpDLEVBQXVDeEQsT0FBdkMsRUFBZ0Q7QUFDckQsUUFBTUcsSUFBSSxHQUFHQyxPQUFPLENBQUMsY0FBRCxDQUFQLENBQXdCRCxJQUFyQzs7QUFDQUEsRUFBQUEsSUFBSSxDQUFDSCxPQUFPLENBQUNLLE9BQVQsRUFBaUIsMENBQWpCLENBQUo7O0FBQ0EsTUFBSSxDQUNILENBREQsQ0FFQSxPQUFPb0QsQ0FBUCxFQUFVO0FBQ1JDLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRixDQUFaO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTcEIsTUFBVCxDQUFnQkgsS0FBaEIsRUFBdUJ3QyxtQkFBdkIsRUFBNEM7QUFDMUMsTUFBSUMsVUFBVSxHQUFHLEVBQWpCOztBQUVBLE9BQUssSUFBSTlDLENBQUMsR0FBQyxDQUFYLEVBQWFBLENBQUMsR0FBQzZDLG1CQUFtQixDQUFDNUMsTUFBbkMsRUFBMENELENBQUMsRUFBM0MsRUFBK0M7QUFDNUMsUUFBSStDLFdBQVcsR0FBRzFDLEtBQUssQ0FBQ0QsT0FBTixDQUFjeUMsbUJBQW1CLENBQUM3QyxDQUFELENBQWpDLENBQWxCOztBQUVBLFFBQUkrQyxXQUFXLEtBQUssQ0FBQyxDQUFyQixFQUF3QjtBQUN0QkQsTUFBQUEsVUFBVSxDQUFDbkQsSUFBWCxDQUFnQm9ELFdBQWhCO0FBQ0Q7QUFDSDs7QUFDRCxTQUFPekIsSUFBSSxDQUFDQyxHQUFMLENBQVMsR0FBR3VCLFVBQVosQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiXG5cInVzZSBzdHJpY3RcIlxuXG5leHBvcnQgZnVuY3Rpb24gX2dldERlZmF1bHRWYXJzKCkge1xuICByZXR1cm4ge1xuICAgIHRvdWNoRmlsZTogJy9zcmMvdGhlbWVyLmpzJyxcbiAgICB3YXRjaFN0YXJ0ZWQgOiBmYWxzZSxcbiAgICBidWlsZHN0ZXA6ICcxIG9mIDEnLFxuICAgIGZpcnN0VGltZSA6IHRydWUsXG4gICAgZmlyc3RDb21waWxlOiB0cnVlLFxuICAgIGJyb3dzZXJDb3VudCA6IDAsXG4gICAgbWFuaWZlc3Q6IG51bGwsXG4gICAgZXh0UGF0aDogJ2V4dCcsXG4gICAgcGx1Z2luRXJyb3JzOiBbXSxcbiAgICBkZXBzOiBbXSxcbiAgICB1c2VkRXh0V2ViQ29tcG9uZW50czogW10sXG4gICAgcmVidWlsZDogdHJ1ZVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgRXh0V2ViQ29tcG9uZW50cykge1xuICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICBjb25zdCB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXG4gIGxvZ3YodmVyYm9zZSwnRlVOQ1RJT04gX2V4dHJhY3RGcm9tU291cmNlJylcbiAgdmFyIGpzID0gbW9kdWxlLl9zb3VyY2UuX3ZhbHVlXG4gIGxvZ3YodmVyYm9zZSxtb2R1bGUucmVzb3VyY2UpXG4gIHZhciBzdGF0ZW1lbnRzID0gW11cblxuICB2YXIgZ2VuZXJhdGUgPSByZXF1aXJlKFwiQGJhYmVsL2dlbmVyYXRvclwiKS5kZWZhdWx0XG4gIHZhciBwYXJzZSA9IHJlcXVpcmUoXCJiYWJ5bG9uXCIpLnBhcnNlXG4gIHZhciB0cmF2ZXJzZSA9IHJlcXVpcmUoXCJhc3QtdHJhdmVyc2VcIilcblxuICB2YXIgYXN0ID0gcGFyc2UoanMsIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICAndHlwZXNjcmlwdCcsXG4gICAgICAnZmxvdycsXG4gICAgICAnZG9FeHByZXNzaW9ucycsXG4gICAgICAnb2JqZWN0UmVzdFNwcmVhZCcsXG4gICAgICAnY2xhc3NQcm9wZXJ0aWVzJyxcbiAgICAgICdleHBvcnREZWZhdWx0RnJvbScsXG4gICAgICAnZXhwb3J0RXh0ZW5zaW9ucycsXG4gICAgICAnYXN5bmNHZW5lcmF0b3JzJyxcbiAgICAgICdmdW5jdGlvbkJpbmQnLFxuICAgICAgJ2Z1bmN0aW9uU2VudCcsXG4gICAgICAnZHluYW1pY0ltcG9ydCdcbiAgICBdLFxuICAgIHNvdXJjZVR5cGU6ICdtb2R1bGUnXG4gIH0pXG5cbiAgdHJhdmVyc2UoYXN0LCB7XG4gICAgcHJlOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJyAmJiBub2RlLmNhbGxlZSAmJiBub2RlLmNhbGxlZS5vYmplY3QgJiYgbm9kZS5jYWxsZWUub2JqZWN0Lm5hbWUgPT09ICdFeHQnKSB7XG4gICAgICAgIHN0YXRlbWVudHMucHVzaChnZW5lcmF0ZShub2RlKS5jb2RlKVxuICAgICAgfVxuICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJykge1xuICAgICAgICBjb25zdCBjb2RlID0gZ2VuZXJhdGUobm9kZSkuY29kZTtcbiAgICAgICAgc3RhdGVtZW50cyA9IHN0YXRlbWVudHMuY29uY2F0KGdldFh0eXBlRnJvbUhUTUxKUyhjb2RlLCBzdGF0ZW1lbnRzLCBFeHRXZWJDb21wb25lbnRzKSk7XG4gICAgICB9XG4gICAgICBpZihub2RlLnR5cGUgPT09ICdTdHJpbmdMaXRlcmFsJykge1xuICAgICAgICBsZXQgY29kZSA9IG5vZGUudmFsdWVcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2RlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgaWYgKGNvZGUuY2hhckF0KGkpID09ICc8Jykge1xuICAgICAgICAgICAgaWYgKGNvZGUuc3Vic3RyKGksIDQpID09ICc8IS0tJykge1xuICAgICAgICAgICAgICBpICs9IDRcbiAgICAgICAgICAgICAgaSArPSBjb2RlLnN1YnN0cihpKS5pbmRleE9mKCctLT4nKSArIDNcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29kZS5jaGFyQXQoaSsxKSAhPT0gJy8nKSB7XG4gICAgICAgICAgICAgIHZhciBzdGFydCA9IGNvZGUuc3Vic3RyaW5nKGkpXG4gICAgICAgICAgICAgIHZhciBlbmQgPSBnZXRFbmQoc3RhcnQsIFsnICcsICdcXG4nLCAnPiddKTtcblxuICAgICAgICAgICAgICAgIHZhciB4dHlwZSA9IHN0YXJ0LnN1YnN0cmluZygxLCBlbmQpXG4gICAgICAgICAgICAgICAgaWYoRXh0V2ViQ29tcG9uZW50cy5pbmNsdWRlcyh4dHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgIHh0eXBlID0geHR5cGUuc3Vic3RyaW5nKDQsIGVuZCk7XG4gICAgICAgICAgICAgICAgICB2YXIgdGhlVmFsdWUgPSBub2RlLnZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgIGlmICh0aGVWYWx1ZS5pbmRleE9mKCdkb2N0eXBlIGh0bWwnKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29uZmlnID0gYEV4dC5jcmVhdGUoJHtKU09OLnN0cmluZ2lmeSh7eHR5cGU6IHh0eXBlfSl9KWA7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlbWVudHMuaW5kZXhPZihjb25maWcpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudHMucHVzaChjb25maWcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGkgKz0gZW5kXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzdGF0ZW1lbnRzID0gc3RhdGVtZW50cy5jb25jYXQoZ2V0WHR5cGVGcm9tSFRNTEpTKGNvZGUsIHN0YXRlbWVudHMsIEV4dFdlYkNvbXBvbmVudHMpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICB9KTtcblxuICByZXR1cm4gc3RhdGVtZW50c1xufVxuXG5mdW5jdGlvbiBnZXRYdHlwZUZyb21IVE1MSlMoY29kZSwgc3RhdGVtZW50cywgRXh0V2ViQ29tcG9uZW50cykge1xuICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgY29uc3QgeHR5cGVSZXBldGl0b25zID0gKGNvZGUubWF0Y2goL3h0eXBlL2cpIHx8IFtdKS5sZW5ndGg7XG5cbiAgaWYgKHh0eXBlUmVwZXRpdG9ucyA+IDApIHtcbiAgICBmb3IgKHZhciBqPTA7IGo8eHR5cGVSZXBldGl0b25zOyBqKyspIHtcbiAgICAgIHZhciBzdGFydCA9IGNvZGUuc3Vic3RyaW5nKGNvZGUuaW5kZXhPZigneHR5cGUnKSArIDUpO1xuICAgICAgdmFyIGlmQXNQcm9wcyA9IHN0YXJ0LmluZGV4T2YoJzonKTtcbiAgICAgIHZhciBpZkFzQXR0cmlidXRlID0gc3RhcnQuaW5kZXhPZignPScpO1xuICAgICAgc3RhcnQgPSBzdGFydC5zdWJzdHJpbmcoTWF0aC5taW4oaWZBc1Byb3BzLCBpZkFzQXR0cmlidXRlKSArIDEpO1xuICAgICAgc3RhcnQgPSBzdGFydC50cmltKCk7XG4gICAgICB2YXIgZW5kID0gZ2V0RW5kKHN0YXJ0LCBbJ1xcbicsICc+JywnfScsICdcXHInXSlcbiAgICAgIHZhciB4dHlwZSA9IHN0YXJ0LnN1YnN0cmluZygxLCBlbmQpLnRyaW0oKS5yZXBsYWNlKC9bJ1wiLF0vZywgJycpO1xuXG4gICAgICB2YXIgY29uZmlnID0gYEV4dC5jcmVhdGUoJHtKU09OLnN0cmluZ2lmeSh7eHR5cGU6IHh0eXBlfSl9KWA7XG4gICAgICBpZihFeHRXZWJDb21wb25lbnRzLmluY2x1ZGVzKCdleHQtJyArIHh0eXBlKSAmJiBzdGF0ZW1lbnRzLmluZGV4T2YoY29uZmlnKSA9PT0gLTEpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goY29uZmlnKTtcbiAgICAgIH1cbiAgICAgIGNvZGUgPSBzdGFydC5zdWJzdHIoZW5kKS50cmltKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF90b1Byb2QodmFycywgb3B0aW9ucykge1xuICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICBsb2d2KG9wdGlvbnMudmVyYm9zZSwnRlVOQ1RJT04gX3RvUHJvZCAoZW1wdHknKVxuICB0cnkge1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgICByZXR1cm4gW11cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX3RvRGV2KHZhcnMsIG9wdGlvbnMpIHtcbiAgdHJ5IHtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpXG4gICAgcmV0dXJuIFtdXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRBbGxDb21wb25lbnRzKHZhcnMsIG9wdGlvbnMpIHtcbiAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gIGxvZ3Yob3B0aW9ucy52ZXJib3NlLCdGVU5DVElPTiBfZ2V0QWxsQ29tcG9uZW50cycpXG5cbiAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICBjb25zdCBmc3ggPSByZXF1aXJlKCdmcy1leHRyYScpXG5cbiAgdmFyIEV4dFdlYkNvbXBvbmVudHMgPSBbXVxuICBjb25zdCBwYWNrYWdlTGliUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LXdlYi1jb21wb25lbnRzL2xpYicpXG4gIHZhciBmaWxlcyA9IGZzeC5yZWFkZGlyU3luYyhwYWNrYWdlTGliUGF0aClcbiAgZmlsZXMuZm9yRWFjaCgoZmlsZU5hbWUpID0+IHtcbiAgICBpZiAoZmlsZU5hbWUgJiYgZmlsZU5hbWUuc3Vic3RyKDAsIDQpID09ICdleHQtJykge1xuICAgICAgdmFyIGVuZCA9IGZpbGVOYW1lLnN1YnN0cig0KS5pbmRleE9mKCcuY29tcG9uZW50JylcbiAgICAgIGlmIChlbmQgPj0gMCkge1xuICAgICAgICBFeHRXZWJDb21wb25lbnRzLnB1c2goZmlsZU5hbWUuc3Vic3RyaW5nKDAsIGVuZCArIDQpKVxuICAgICAgfVxuICAgIH1cbiAgfSlcbiAgbG9ndihvcHRpb25zLnZlcmJvc2UsIGBJZGVudGlmeWluZyBhbGwgZXh0LSR7b3B0aW9ucy5mcmFtZXdvcmt9IG1vZHVsZXNgKVxuICAvL2xvZyh2YXJzLmFwcCwgYElkZW50aWZ5aW5nIGFsbCBleHQtJHtvcHRpb25zLmZyYW1ld29ya30gbW9kdWxlc2ApXG4gIHJldHVybiBFeHRXZWJDb21wb25lbnRzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfd3JpdGVGaWxlc1RvUHJvZEZvbGRlcih2YXJzLCBvcHRpb25zKSB7XG4gIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gIGxvZ3Yob3B0aW9ucy52ZXJib3NlLCdGVU5DVElPTiBfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciAoZW1wdHkpJylcbiAgdHJ5IHtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RW5kKHN0YXJ0LCBzZXRPZlN5bWJvbHNUb0NoZWNrKSB7XG4gIHZhciBlbmRpbmdzQXJyID0gW107XG5cbiAgZm9yICh2YXIgaT0wO2k8c2V0T2ZTeW1ib2xzVG9DaGVjay5sZW5ndGg7aSsrKSB7XG4gICAgIHZhciBzeW1ib2xJbmRleCA9IHN0YXJ0LmluZGV4T2Yoc2V0T2ZTeW1ib2xzVG9DaGVja1tpXSk7XG5cbiAgICAgaWYgKHN5bWJvbEluZGV4ICE9PSAtMSkge1xuICAgICAgIGVuZGluZ3NBcnIucHVzaChzeW1ib2xJbmRleCk7XG4gICAgIH1cbiAgfVxuICByZXR1cm4gTWF0aC5taW4oLi4uZW5kaW5nc0Fycilcbn1cbiJdfQ==