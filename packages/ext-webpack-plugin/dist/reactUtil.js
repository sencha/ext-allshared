"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._getDefaultVars = _getDefaultVars;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZWFjdFV0aWwuanMiXSwibmFtZXMiOlsiX2dldERlZmF1bHRWYXJzIiwidG91Y2hGaWxlIiwid2F0Y2hTdGFydGVkIiwiYnVpbGRzdGVwIiwiZmlyc3RUaW1lIiwiZmlyc3RDb21waWxlIiwiYnJvd3NlckNvdW50IiwibWFuaWZlc3QiLCJleHRQYXRoIiwicGx1Z2luRXJyb3JzIiwiZGVwcyIsInVzZWRFeHRDb21wb25lbnRzIiwicmVidWlsZCIsIl9leHRyYWN0RnJvbVNvdXJjZSIsIm1vZHVsZSIsIm9wdGlvbnMiLCJjb21waWxhdGlvbiIsImV4dENvbXBvbmVudHMiLCJsb2d2IiwicmVxdWlyZSIsInZlcmJvc2UiLCJqcyIsIl9zb3VyY2UiLCJfdmFsdWUiLCJnZW5lcmF0ZSIsImRlZmF1bHQiLCJwYXJzZSIsInRyYXZlcnNlIiwic3RhdGVtZW50cyIsImFzdCIsInBsdWdpbnMiLCJzb3VyY2VUeXBlIiwiYWRkVHlwZSIsImFyZ05vZGUiLCJ0eXBlIiwieHR5cGUiLCJfdG9YdHlwZSIsInZhbHVlIiwieGNsYXNzIiwic2xpY2UiLCJzdGFydCIsImVuZCIsInVuZGVmaW5lZCIsImNvbmZpZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJwdXNoIiwicHJlIiwibm9kZSIsImNhbGxlZSIsIm9iamVjdCIsIm5hbWUiLCJjb2RlIiwiaW5pdCIsImkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ2YWx1ZU5vZGUiLCJlIiwiY29uc29sZSIsImxvZyIsInJlc291cmNlIiwiZXJyb3JzIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUFFTyxTQUFTQSxlQUFULEdBQTJCO0FBQ2hDLFNBQU87QUFDTEMsSUFBQUEsU0FBUyxFQUFFLGdCQUROO0FBRUxDLElBQUFBLFlBQVksRUFBRyxLQUZWO0FBR0xDLElBQUFBLFNBQVMsRUFBRSxRQUhOO0FBSUxDLElBQUFBLFNBQVMsRUFBRyxJQUpQO0FBS0xDLElBQUFBLFlBQVksRUFBRSxJQUxUO0FBTUxDLElBQUFBLFlB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QmhCLElBQW5CLENBQXdCLHdCQUF3QlksQ0FBaEQ7QUFDQSxXQUFPLEVBQVA7QUFDRDtBQUNGLEMsQ0FFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcblxuZXhwb3J0IGZ1bmN0aW9uIF9nZXREZWZhdWx0VmFycygpIHtcbiAgcmV0dXJuIHtcbiAgICB0b3VjaEZpbGU6ICcvc3JjL3RoZW1lci5qcycsXG4gICAgd2F0Y2hTdGFydGVkIDogZmFsc2UsXG4gICAgYnVpbGRzdGVwOiAnMSBvZiAxJyxcbiAgICBmaXJzdFRpbWUgOiB0cnVlLFxuICAgIGZpcnN0Q29tcGlsZTogdHJ1ZSxcbiAgICBicm93c2VyQ291bnQgOiAwLFxuICAgIG1hbmlmZXN0OiBudWxsLFxuICAgIGV4dFBhdGg6ICdleHQnLFxuICAgIHBsdWdpbkVycm9yczogW10sXG4gICAgZGVwczogW10sXG4gICAgdXNlZEV4dENvbXBvbmVudHM6IFtdLFxuICAgIHJlYnVpbGQ6IHRydWVcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpIHtcbiAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgbG9ndihvcHRpb25zLnZlcmJvc2UsJ0ZVTkNUSU9OIF9leHRyYWN0RnJvbVNvdXJjZScpXG4gIHRyeSB7XG4gICAgdmFyIGpzID0gbW9kdWxlLl9zb3VyY2UuX3ZhbHVlXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KG9wdGlvbnMudmVyYm9zZSwnRlVOQ1RJT04gZXh0cmFjdEZyb21Tb3VyY2UnKVxuICAgIHZhciBnZW5lcmF0ZSA9IHJlcXVpcmUoXCJAYmFiZWwvZ2VuZXJhdG9yXCIpLmRlZmF1bHRcbiAgICB2YXIgcGFyc2UgPSByZXF1aXJlKFwiYmFieWxvblwiKS5wYXJzZVxuICAgIHZhciB0cmF2ZXJzZSA9IHJlcXVpcmUoXCJhc3QtdHJhdmVyc2VcIilcbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gW11cbiAgICBcbiAgICBjb25zdCBhc3QgPSBwYXJzZShqcywge1xuICAgICAgcGx1Z2luczogW1xuICAgICAgICAnanN4JyxcbiAgICAgICAgJ2Zsb3cnLFxuICAgICAgICAnZG9FeHByZXNzaW9ucycsXG4gICAgICAgICdvYmplY3RSZXN0U3ByZWFkJyxcbiAgICAgICAgJ2NsYXNzUHJvcGVydGllcycsXG4gICAgICAgICdleHBvcnRFeHRlbnNpb25zJyxcbiAgICAgICAgJ2FzeW5jR2VuZXJhdG9ycycsXG4gICAgICAgICdmdW5jdGlvbkJpbmQnLFxuICAgICAgICAnZnVuY3Rpb25TZW50JyxcbiAgICAgICAgJ2R5bmFtaWNJbXBvcnQnXG4gICAgICBdLFxuICAgICAgc291cmNlVHlwZTogJ21vZHVsZSdcbiAgICB9KVxuXG4gICAgZnVuY3Rpb24gYWRkVHlwZShhcmdOb2RlKSB7XG4gICAgICB2YXIgdHlwZVxuICAgICAgaWYgKGFyZ05vZGUudHlwZSA9PT0gJ1N0cmluZ0xpdGVyYWwnKSB7XG4gICAgICAgIHZhciB4dHlwZSA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLl90b1h0eXBlKGFyZ05vZGUudmFsdWUpXG4gICAgICAgIGlmICh4dHlwZSAhPSAnZXh0cmVhY3QnKSB7XG4gICAgICAgICAgdHlwZSA9IHsgeHR5cGU6IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLl90b1h0eXBlKGFyZ05vZGUudmFsdWUpIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHlwZSA9IHsgeGNsYXNzOiBqcy5zbGljZShhcmdOb2RlLnN0YXJ0LCBhcmdOb2RlLmVuZCkgfVxuICAgICAgfVxuICAgICAgaWYgKHR5cGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCBjb25maWcgPSBKU09OLnN0cmluZ2lmeSh0eXBlKVxuICAgICAgICBzdGF0ZW1lbnRzLnB1c2goYEV4dC5jcmVhdGUoJHtjb25maWd9KWApXG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJhdmVyc2UoYXN0LCB7XG4gICAgICBwcmU6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJ1xuICAgICAgICAgICAgJiYgbm9kZS5jYWxsZWVcbiAgICAgICAgICAgICYmIG5vZGUuY2FsbGVlLm9iamVjdFxuICAgICAgICAgICAgJiYgbm9kZS5jYWxsZWUub2JqZWN0Lm5hbWUgPT09ICdFeHQnXG4gICAgICAgICkge1xuICAgICAgICAgIHN0YXRlbWVudHMucHVzaChnZW5lcmF0ZShub2RlKS5jb2RlKVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT0gJ1ZhcmlhYmxlRGVjbGFyYXRvcicgXG4gICAgICAgICAgICAmJiBub2RlLmluaXQgXG4gICAgICAgICAgICAmJiBub2RlLmluaXQudHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJyBcbiAgICAgICAgICAgICYmIG5vZGUuaW5pdC5jYWxsZWUgXG4gICAgICAgICkge1xuICAgICAgICAgIGlmIChub2RlLmluaXQuY2FsbGVlLm5hbWUgPT0gJ3JlYWN0aWZ5Jykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmluaXQuYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlTm9kZSA9IG5vZGUuaW5pdC5hcmd1bWVudHNbaV07XG4gICAgICAgICAgICAgIGlmICghdmFsdWVOb2RlKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgYWRkVHlwZSh2YWx1ZU5vZGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gLy8gQ29udmVydCBSZWFjdC5jcmVhdGVFbGVtZW50KC4uLikgY2FsbHMgdG8gdGhlIGVxdWl2YWxlbnQgRXh0LmNyZWF0ZSguLi4pIGNhbGxzIHRvIHB1dCBpbiB0aGUgbWFuaWZlc3QuXG4gICAgICAgIC8vIGlmIChub2RlLnR5cGUgPT09ICdDYWxsRXhwcmVzc2lvbngnIFxuICAgICAgICAvLyAgICAgJiYgbm9kZS5jYWxsZWUub2JqZWN0IFxuICAgICAgICAvLyAgICAgJiYgbm9kZS5jYWxsZWUub2JqZWN0Lm5hbWUgPT09ICdSZWFjdCcgXG4gICAgICAgIC8vICAgICAmJiBub2RlLmNhbGxlZS5wcm9wZXJ0eS5uYW1lID09PSAnY3JlYXRlRWxlbWVudCcpIHtcbiAgICAgICAgLy8gICBjb25zdCBbcHJvcHNdID0gbm9kZS5hcmd1bWVudHNcbiAgICAgICAgLy8gICBsZXQgY29uZmlnXG4gICAgICAgIC8vICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcHMucHJvcGVydGllcykpIHtcbiAgICAgICAgLy8gICAgIGNvbmZpZyA9IGdlbmVyYXRlKHByb3BzKS5jb2RlXG4gICAgICAgIC8vICAgICBmb3IgKGxldCBrZXkgaW4gdHlwZSkge1xuICAgICAgICAvLyAgICAgICBjb25maWcgPSBge1xcbiAgJHtrZXl9OiAnJHt0eXBlW2tleV19Jywke2NvbmZpZy5zbGljZSgxKX1gXG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgIGNvbmZpZyA9IEpTT04uc3RyaW5naWZ5KHR5cGUpXG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyB9XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gc3RhdGVtZW50c1xuICB9XG4gIGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZyhtb2R1bGUucmVzb3VyY2UpXG4gICAgY29uc29sZS5sb2coanMpXG4gICAgY29uc29sZS5sb2coZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnZXh0cmFjdEZyb21Tb3VyY2U6ICcgKyBlKVxuICAgIHJldHVybiBbXVxuICB9XG59XG5cbi8vIGV4cG9ydCBmdW5jdGlvbiBfdG9Qcm9kKHZhcnMsIG9wdGlvbnMpIHtcbi8vICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Zcbi8vICAgbG9ndihvcHRpb25zLnZlcmJvc2UsJ0ZVTkNUSU9OIF90b1Byb2QgKGVtcHR5KScpXG4vLyAgIHRyeSB7XG4vLyAgIH1cbi8vICAgY2F0Y2ggKGUpIHtcbi8vICAgICBjb25zb2xlLmxvZyhlKVxuLy8gICAgIHJldHVybiBbXVxuLy8gICB9XG4vLyB9XG5cbi8vIGV4cG9ydCBmdW5jdGlvbiBfdG9EZXYodmFycywgb3B0aW9ucykge1xuLy8gICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuLy8gICBsb2d2KG9wdGlvbnMudmVyYm9zZSwnRlVOQ1RJT04gX3RvRGV2IChlbXB0eSknKVxuLy8gICB0cnkge1xuLy8gICB9XG4vLyAgIGNhdGNoIChlKSB7XG4vLyAgICAgY29uc29sZS5sb2coZSlcbi8vICAgICByZXR1cm4gW11cbi8vICAgfVxuLy8gfVxuXG4vLyBleHBvcnQgZnVuY3Rpb24gX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucykge1xuLy8gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Zcbi8vICAgbG9ndihvcHRpb25zLnZlcmJvc2UsJ0ZVTkNUSU9OIF9nZXRBbGxDb21wb25lbnRzIChlbXB0eSknKVxuLy8gICB0cnkge1xuLy8gICAgIHZhciBleHRDb21wb25lbnRzID0gW11cbi8vICAgICAgcmV0dXJuIGV4dENvbXBvbmVudHNcbi8vICAgfVxuLy8gICBjYXRjaCAoZSkge1xuLy8gICAgIGNvbnNvbGUubG9nKGUpXG4vLyAgICAgcmV0dXJuIFtdXG4vLyAgIH1cbi8vIH1cblxuLy8gZXhwb3J0IGZ1bmN0aW9uIF93cml0ZUZpbGVzVG9Qcm9kRm9sZGVyKHZhcnMsIG9wdGlvbnMpIHtcbi8vICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Zcbi8vICAgbG9ndihvcHRpb25zLnZlcmJvc2UsJ0ZVTkNUSU9OIF93cml0ZUZpbGVzVG9Qcm9kRm9sZGVyIChlbXB0eSknKVxuLy8gICB0cnkge1xuLy8gICB9XG4vLyAgIGNhdGNoIChlKSB7XG4vLyAgICAgY29uc29sZS5sb2coZSlcbi8vICAgfVxuLy8gfVxuIl19