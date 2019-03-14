"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._extractFromSource = _extractFromSource;

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
    usedExtComponents: [],
    rebuild: true
  };
}

function _extractFromSource(module, options, compilation, extComponents) {
  const logv = require('./pluginUtil').logv;

  logv(options.verbose, 'FUNCTION _extractFromSource');

  try {
    var js = module._source._value;

    const logv = require('./pluginUtil').logv;

    logv(options.verbose, 'FUNCTION extractFromSource');

    var generate = require("@babel/generator").default;

    var parse = require("babylon").parse;

    var traverse = require("ast-traverse");

    const statements = [];
    const ast = parse(js, {
      plugins: ['jsx', 'flow', 'doExpressions', 'objectRestSpread', 'classProperties', 'exportExtensions', 'asyncGenerators', 'functionBind', 'functionSent', 'dynamicImport'],
      sourceType: 'module'
    });

    function addType(argNode) {
      var type;

      if (argNode.type === 'StringLiteral') {
        var xtype = require('./pluginUtil')._toXtype(argNode.value);

        if (xtype != 'extreact') {
          type = {
            xtype: require('./pluginUtil')._toXtype(argNode.value)
          };
        }
      } else {
        type = {
          xclass: js.slice(argNode.start, argNode.end)
        };
      }

      if (type != undefined) {
        let config = JSON.stringify(type);
        statements.push(`Ext.create(${config})`);
      }
    }

    traverse(ast, {
      pre: function (node) {
        if (node.type === 'CallExpression' && node.callee && node.callee.object && node.callee.object.name === 'Ext') {
          statements.push(generate(node).code);
        }

        if (node.type == 'VariableDeclarator' && node.init && node.init.type === 'CallExpression' && node.init.callee) {
          if (node.init.callee.name == 'reactify') {
            for (let i = 0; i < node.init.arguments.length; i++) {
              const valueNode = node.init.arguments[i];
              if (!valueNode) continue;
              addType(valueNode);
            }
          }
        } // // Convert React.createElement(...) calls to the equivalent Ext.create(...) calls to put in the manifest.
        // if (node.type === 'CallExpressionx' 
        //     && node.callee.object 
        //     && node.callee.object.name === 'React' 
        //     && node.callee.property.name === 'createElement') {
        //   const [props] = node.arguments
        //   let config
        //   if (Array.isArray(props.properties)) {
        //     config = generate(props).code
        //     for (let key in type) {
        //       config = `{\n  ${key}: '${type[key]}',${config.slice(1)}`
        //     }
        //   } else {
        //     config = JSON.stringify(type)
        //   }
        // }

      }
    });
    return statements;
  } catch (e) {
    console.log(module.resource);
    console.log(js);
    console.log(e);
    compilation.errors.push('extractFromSource: ' + e);
    return [];
  }
} // export function _toProd(vars, options) {
//   const logv = require('./pluginUtil').logv
//   logv(options.verbose,'FUNCTION _toProd (empty)')
//   try {
//   }
//   catch (e) {
//     console.log(e)
//     return []
//   }
// }
// export function _toDev(vars, options) {
//   const logv = require('./pluginUtil').logv
//   logv(options.verbose,'FUNCTION _toDev (empty)')
//   try {
//   }
//   catch (e) {
//     console.log(e)
//     return []
//   }
// }
// export function _getAllComponents(vars, options) {
//    const logv = require('./pluginUtil').logv
//   logv(options.verbose,'FUNCTION _getAllComponents (empty)')
//   try {
//     var extComponents = []
//      return extComponents
//   }
//   catch (e) {
//     console.log(e)
//     return []
//   }
// }
// export function _writeFilesToProdFolder(vars, options) {
//   const logv = require('./pluginUtil').logv
//   logv(options.verbose,'FUNCTION _writeFilesToProdFolder (empty)')
//   try {
//   }
//   catch (e) {
//     console.log(e)
//   }
// }
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZWFjdFV0aWwuanMiXSwibmFtZXMiOlsiX2dldERlZmF1bHRWYXJzIiwidG91Y2hGaWxlIiwid2F0Y2hTdGFydGVkIiwiYnVpbGRzdGVwIiwiZmlyc3RUaW1lIiwiZmlyc3RDb21waWxlIiwiYnJvd3NlckNvdW50IiwibWFuaWZlc3QiLCJleHRQYXRoIiwicGx1Z2luRXJyb3JzIiwiZGVwcyIsInVzZWRFeHRDb21wb25lbnRzIiwicmVidWlsZCIsIl9leHRyYWN0RnJvbVNvdXJjZSIsIm1vZHVsZSIsIm9wdGlvbnMiLCJjb21waWxhdGlvbiIsImV4dENvbXBvbmVudHMiLCJsb2d2IiwicmVxdWlyZSIsInZlcmJvc2UiLCJqcyIsIl9zb3VyY2UiLCJfdmFsdWUiLCJnZW5lcmF0ZSIsImRlZmF1bHQiLCJwYXJzZSIsInRyYXZlcnNlIiwic3RhdGVtZW50cyIsImFzdCIsInBsdWdpbnMiLCJzb3VyY2VUeXBlIiwiYWRkVHlwZSIsImFyZ05vZGUiLCJ0eXBlIiwieHR5cGUiLCJfdG9YdHlwZSIsInZhbHVlIiwieGNsYXNzIiwic2xpY2UiLCJzdGFydCIsImVuZCIsInVuZGVmaW5lZCIsImNvbmZpZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJwdXNoIiwicHJlIiwibm9kZSIsImNhbGxlZSIsIm9iamVjdCIsIm5hbWUiLCJjb2RlIiwiaW5pdCIsImkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ2YWx1ZU5vZGUiLCJlIiwiY29uc29sZSIsImxvZyIsInJlc291cmNlIiwiZXJyb3JzIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQUVBLFNBQVNBLGVBQVQsR0FBMkI7QUFDekIsU0FBTztBQUNMQyxJQUFBQSxTQUFTLEVBQUUsZ0JBRE47QUFFTEMsSUFBQUEsWUFBWSxFQUFHLEtBRlY7QUFHTEMsSUFBQUEsU0FBUyxFQUFFLFFBSE47QUFJTEMsSUFBQUEsU0FBUyxFQUFHLElBSlA7QUFLTEMsSUFBQUEsWUFBWSxFQUFFLElBTFQ7QUFNTEMsSUFBQUEsWUFB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aEIsSUFBbkIsQ0FBd0Isd0JBQXdCWSxDQUFoRDtBQUNBLFdBQU8sRUFBUDtBQUNEO0FBQ0YsQyxDQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuXG5mdW5jdGlvbiBfZ2V0RGVmYXVsdFZhcnMoKSB7XG4gIHJldHVybiB7XG4gICAgdG91Y2hGaWxlOiAnL3NyYy90aGVtZXIuanMnLFxuICAgIHdhdGNoU3RhcnRlZCA6IGZhbHNlLFxuICAgIGJ1aWxkc3RlcDogJzEgb2YgMScsXG4gICAgZmlyc3RUaW1lIDogdHJ1ZSxcbiAgICBmaXJzdENvbXBpbGU6IHRydWUsXG4gICAgYnJvd3NlckNvdW50IDogMCxcbiAgICBtYW5pZmVzdDogbnVsbCxcbiAgICBleHRQYXRoOiAnZXh0JyxcbiAgICBwbHVnaW5FcnJvcnM6IFtdLFxuICAgIGRlcHM6IFtdLFxuICAgIHVzZWRFeHRDb21wb25lbnRzOiBbXSxcbiAgICByZWJ1aWxkOiB0cnVlXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9leHRyYWN0RnJvbVNvdXJjZShtb2R1bGUsIG9wdGlvbnMsIGNvbXBpbGF0aW9uLCBleHRDb21wb25lbnRzKSB7XG4gIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gIGxvZ3Yob3B0aW9ucy52ZXJib3NlLCdGVU5DVElPTiBfZXh0cmFjdEZyb21Tb3VyY2UnKVxuICB0cnkge1xuICAgIHZhciBqcyA9IG1vZHVsZS5fc291cmNlLl92YWx1ZVxuICAgIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gICAgbG9ndihvcHRpb25zLnZlcmJvc2UsJ0ZVTkNUSU9OIGV4dHJhY3RGcm9tU291cmNlJylcbiAgICB2YXIgZ2VuZXJhdGUgPSByZXF1aXJlKFwiQGJhYmVsL2dlbmVyYXRvclwiKS5kZWZhdWx0XG4gICAgdmFyIHBhcnNlID0gcmVxdWlyZShcImJhYnlsb25cIikucGFyc2VcbiAgICB2YXIgdHJhdmVyc2UgPSByZXF1aXJlKFwiYXN0LXRyYXZlcnNlXCIpXG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdXG4gICAgXG4gICAgY29uc3QgYXN0ID0gcGFyc2UoanMsIHtcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgJ2pzeCcsXG4gICAgICAgICdmbG93JyxcbiAgICAgICAgJ2RvRXhwcmVzc2lvbnMnLFxuICAgICAgICAnb2JqZWN0UmVzdFNwcmVhZCcsXG4gICAgICAgICdjbGFzc1Byb3BlcnRpZXMnLFxuICAgICAgICAnZXhwb3J0RXh0ZW5zaW9ucycsXG4gICAgICAgICdhc3luY0dlbmVyYXRvcnMnLFxuICAgICAgICAnZnVuY3Rpb25CaW5kJyxcbiAgICAgICAgJ2Z1bmN0aW9uU2VudCcsXG4gICAgICAgICdkeW5hbWljSW1wb3J0J1xuICAgICAgXSxcbiAgICAgIHNvdXJjZVR5cGU6ICdtb2R1bGUnXG4gICAgfSlcblxuICAgIGZ1bmN0aW9uIGFkZFR5cGUoYXJnTm9kZSkge1xuICAgICAgdmFyIHR5cGVcbiAgICAgIGlmIChhcmdOb2RlLnR5cGUgPT09ICdTdHJpbmdMaXRlcmFsJykge1xuICAgICAgICB2YXIgeHR5cGUgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5fdG9YdHlwZShhcmdOb2RlLnZhbHVlKVxuICAgICAgICBpZiAoeHR5cGUgIT0gJ2V4dHJlYWN0Jykge1xuICAgICAgICAgIHR5cGUgPSB7IHh0eXBlOiByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5fdG9YdHlwZShhcmdOb2RlLnZhbHVlKSB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHR5cGUgPSB7IHhjbGFzczoganMuc2xpY2UoYXJnTm9kZS5zdGFydCwgYXJnTm9kZS5lbmQpIH1cbiAgICAgIH1cbiAgICAgIGlmICh0eXBlICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgY29uZmlnID0gSlNPTi5zdHJpbmdpZnkodHlwZSlcbiAgICAgICAgc3RhdGVtZW50cy5wdXNoKGBFeHQuY3JlYXRlKCR7Y29uZmlnfSlgKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRyYXZlcnNlKGFzdCwge1xuICAgICAgcHJlOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdDYWxsRXhwcmVzc2lvbidcbiAgICAgICAgICAgICYmIG5vZGUuY2FsbGVlXG4gICAgICAgICAgICAmJiBub2RlLmNhbGxlZS5vYmplY3RcbiAgICAgICAgICAgICYmIG5vZGUuY2FsbGVlLm9iamVjdC5uYW1lID09PSAnRXh0J1xuICAgICAgICApIHtcbiAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2goZ2VuZXJhdGUobm9kZSkuY29kZSlcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09ICdWYXJpYWJsZURlY2xhcmF0b3InIFxuICAgICAgICAgICAgJiYgbm9kZS5pbml0IFxuICAgICAgICAgICAgJiYgbm9kZS5pbml0LnR5cGUgPT09ICdDYWxsRXhwcmVzc2lvbicgXG4gICAgICAgICAgICAmJiBub2RlLmluaXQuY2FsbGVlIFxuICAgICAgICApIHtcbiAgICAgICAgICBpZiAobm9kZS5pbml0LmNhbGxlZS5uYW1lID09ICdyZWFjdGlmeScpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5pbml0LmFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBjb25zdCB2YWx1ZU5vZGUgPSBub2RlLmluaXQuYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICBpZiAoIXZhbHVlTm9kZSkgY29udGludWU7XG4gICAgICAgICAgICAgIGFkZFR5cGUodmFsdWVOb2RlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC8vIENvbnZlcnQgUmVhY3QuY3JlYXRlRWxlbWVudCguLi4pIGNhbGxzIHRvIHRoZSBlcXVpdmFsZW50IEV4dC5jcmVhdGUoLi4uKSBjYWxscyB0byBwdXQgaW4gdGhlIG1hbmlmZXN0LlxuICAgICAgICAvLyBpZiAobm9kZS50eXBlID09PSAnQ2FsbEV4cHJlc3Npb254JyBcbiAgICAgICAgLy8gICAgICYmIG5vZGUuY2FsbGVlLm9iamVjdCBcbiAgICAgICAgLy8gICAgICYmIG5vZGUuY2FsbGVlLm9iamVjdC5uYW1lID09PSAnUmVhY3QnIFxuICAgICAgICAvLyAgICAgJiYgbm9kZS5jYWxsZWUucHJvcGVydHkubmFtZSA9PT0gJ2NyZWF0ZUVsZW1lbnQnKSB7XG4gICAgICAgIC8vICAgY29uc3QgW3Byb3BzXSA9IG5vZGUuYXJndW1lbnRzXG4gICAgICAgIC8vICAgbGV0IGNvbmZpZ1xuICAgICAgICAvLyAgIGlmIChBcnJheS5pc0FycmF5KHByb3BzLnByb3BlcnRpZXMpKSB7XG4gICAgICAgIC8vICAgICBjb25maWcgPSBnZW5lcmF0ZShwcm9wcykuY29kZVxuICAgICAgICAvLyAgICAgZm9yIChsZXQga2V5IGluIHR5cGUpIHtcbiAgICAgICAgLy8gICAgICAgY29uZmlnID0gYHtcXG4gICR7a2V5fTogJyR7dHlwZVtrZXldfScsJHtjb25maWcuc2xpY2UoMSl9YFxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICBjb25maWcgPSBKU09OLnN0cmluZ2lmeSh0eXBlKVxuICAgICAgICAvLyAgIH1cbiAgICAgICAgLy8gfVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHN0YXRlbWVudHNcbiAgfVxuICBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2cobW9kdWxlLnJlc291cmNlKVxuICAgIGNvbnNvbGUubG9nKGpzKVxuICAgIGNvbnNvbGUubG9nKGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ2V4dHJhY3RGcm9tU291cmNlOiAnICsgZSlcbiAgICByZXR1cm4gW11cbiAgfVxufVxuXG4vLyBleHBvcnQgZnVuY3Rpb24gX3RvUHJvZCh2YXJzLCBvcHRpb25zKSB7XG4vLyAgIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4vLyAgIGxvZ3Yob3B0aW9ucy52ZXJib3NlLCdGVU5DVElPTiBfdG9Qcm9kIChlbXB0eSknKVxuLy8gICB0cnkge1xuLy8gICB9XG4vLyAgIGNhdGNoIChlKSB7XG4vLyAgICAgY29uc29sZS5sb2coZSlcbi8vICAgICByZXR1cm4gW11cbi8vICAgfVxuLy8gfVxuXG4vLyBleHBvcnQgZnVuY3Rpb24gX3RvRGV2KHZhcnMsIG9wdGlvbnMpIHtcbi8vICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Zcbi8vICAgbG9ndihvcHRpb25zLnZlcmJvc2UsJ0ZVTkNUSU9OIF90b0RldiAoZW1wdHkpJylcbi8vICAgdHJ5IHtcbi8vICAgfVxuLy8gICBjYXRjaCAoZSkge1xuLy8gICAgIGNvbnNvbGUubG9nKGUpXG4vLyAgICAgcmV0dXJuIFtdXG4vLyAgIH1cbi8vIH1cblxuLy8gZXhwb3J0IGZ1bmN0aW9uIF9nZXRBbGxDb21wb25lbnRzKHZhcnMsIG9wdGlvbnMpIHtcbi8vICAgIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4vLyAgIGxvZ3Yob3B0aW9ucy52ZXJib3NlLCdGVU5DVElPTiBfZ2V0QWxsQ29tcG9uZW50cyAoZW1wdHkpJylcbi8vICAgdHJ5IHtcbi8vICAgICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdXG4vLyAgICAgIHJldHVybiBleHRDb21wb25lbnRzXG4vLyAgIH1cbi8vICAgY2F0Y2ggKGUpIHtcbi8vICAgICBjb25zb2xlLmxvZyhlKVxuLy8gICAgIHJldHVybiBbXVxuLy8gICB9XG4vLyB9XG5cbi8vIGV4cG9ydCBmdW5jdGlvbiBfd3JpdGVGaWxlc1RvUHJvZEZvbGRlcih2YXJzLCBvcHRpb25zKSB7XG4vLyAgIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4vLyAgIGxvZ3Yob3B0aW9ucy52ZXJib3NlLCdGVU5DVElPTiBfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciAoZW1wdHkpJylcbi8vICAgdHJ5IHtcbi8vICAgfVxuLy8gICBjYXRjaCAoZSkge1xuLy8gICAgIGNvbnNvbGUubG9nKGUpXG4vLyAgIH1cbi8vIH1cbiJdfQ==