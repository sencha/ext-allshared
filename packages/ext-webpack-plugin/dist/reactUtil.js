"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._extractFromSource = _extractFromSource;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZWFjdFV0aWwuanMiXSwibmFtZXMiOlsiX2V4dHJhY3RGcm9tU291cmNlIiwibW9kdWxlIiwib3B0aW9ucyIsImNvbXBpbGF0aW9uIiwiZXh0Q29tcG9uZW50cyIsImxvZ3YiLCJyZXF1aXJlIiwidmVyYm9zZSIsImpzIiwiX3NvdXJjZSIsIl92YWx1ZSIsImdlbmVyYXRlIiwiZGVmYXVsdCIsInBhcnNlIiwidHJhdmVyc2UiLCJzdGF0ZW1lbnRzIiwiYXN0IiwicGx1Z2lucyIsInNvdXJjZVR5cGUiLCJhZGRUeXBlIiwiYXJnTm9kZSIsInR5cGUiLCJ4dHlwZSIsIl90b1h0eXBlIiwidmFsdWUiLCJ4Y2xhc3MiLCJzbGljZSIsInN0YXJ0IiwiZW5kIiwidW5kZWZpbmVkIiwiY29uZmlnIiwiSlNPTiIsInN0cmluZ2lmeSIsInB1c2giLCJwcmUiLCJub2RlIiwiY2FsbGVlIiwib2JqZWN0IiwibmFtZSIsImNvZGUiLCJpbml0IiwiaSIsImFyZ3VtZW50cyIsImxlbmd0aCIsInZhbHVlTm9kZSIsImUiLCJjb25zb2xlIiwibG9nIiwicmVzb3VyY2UiLCJlcnJvcnMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FBRU8sU0FBU0Esa0JBQVQsQ0FBNEJDLE1BQTVCLEVBQW9DQyxPQUFwQyxFQUE2Q0MsV0FBN0MsRUFBMERDLGFBQTFELEVBQXlFO0FBQzlFLFFBQU1DLElBQUksR0FBR0MsT0FBTyxDQUFDLGNBQUQsQ0FBUCxDQUF3QkQsSUFBckM7O0FBQ0FBLEVBQUFBLElBQUksQ0FBQ0gsT0FBTyxDQUFDSyxPQUFULEVBQWlCLDZCQUFqQixDQUFKOztBQUNBLE1BQUk7QUFDRixRQUFJQyxFQUFFLEdBQUdQLE1BQU0sQ0FBQ1EsT0FBUCxDQUFlQyxNQUF4Qjs7QUFDQSxVQUFNTCxJQUFJLEdBQUdDLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0JELElBQXJDOztBQUNBQSxJQUFBQSxJQUFJLENBQUNILE9BQU8sQ0FBQ0ssT0FBVCxFQUFpQiw0QkFB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LFNBQUQsQ0FBUDtBQUNEO0FBQ0Y7QUFDRixTQXBCaUIsQ0FzQmxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNEO0FBdkNXLEtBQU4sQ0FBUjtBQXlDQSxXQUFPN0IsVUFBUDtBQUNELEdBbkZELENBb0ZBLE9BQU04QixDQUFOLEVBQVM7QUFDUEMsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVk5QyxNQUFNLENBQUMrQyxRQUFuQjtBQUNBRixJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWXZDLEVBQVo7QUFDQXNDLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRixDQUFaO0FBQ0ExQyxJQUFBQSxXQUFXLENBQUM4QyxNQUFaLENBQW1CaEIsSUFBbkIsQ0FBd0Isd0JBQXdCWSxDQUFoRDtBQUNBLFdBQU8sRUFBUDtBQUNEO0FBQ0YsQyxDQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuXG5leHBvcnQgZnVuY3Rpb24gX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpIHtcbiAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgbG9ndihvcHRpb25zLnZlcmJvc2UsJ0ZVTkNUSU9OIF9leHRyYWN0RnJvbVNvdXJjZScpXG4gIHRyeSB7XG4gICAgdmFyIGpzID0gbW9kdWxlLl9zb3VyY2UuX3ZhbHVlXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KG9wdGlvbnMudmVyYm9zZSwnRlVOQ1RJT04gZXh0cmFjdEZyb21Tb3VyY2UnKVxuICAgIHZhciBnZW5lcmF0ZSA9IHJlcXVpcmUoXCJAYmFiZWwvZ2VuZXJhdG9yXCIpLmRlZmF1bHRcbiAgICB2YXIgcGFyc2UgPSByZXF1aXJlKFwiYmFieWxvblwiKS5wYXJzZVxuICAgIHZhciB0cmF2ZXJzZSA9IHJlcXVpcmUoXCJhc3QtdHJhdmVyc2VcIilcbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gW11cbiAgICBcbiAgICBjb25zdCBhc3QgPSBwYXJzZShqcywge1xuICAgICAgcGx1Z2luczogW1xuICAgICAgICAnanN4JyxcbiAgICAgICAgJ2Zsb3cnLFxuICAgICAgICAnZG9FeHByZXNzaW9ucycsXG4gICAgICAgICdvYmplY3RSZXN0U3ByZWFkJyxcbiAgICAgICAgJ2NsYXNzUHJvcGVydGllcycsXG4gICAgICAgICdleHBvcnRFeHRlbnNpb25zJyxcbiAgICAgICAgJ2FzeW5jR2VuZXJhdG9ycycsXG4gICAgICAgICdmdW5jdGlvbkJpbmQnLFxuICAgICAgICAnZnVuY3Rpb25TZW50JyxcbiAgICAgICAgJ2R5bmFtaWNJbXBvcnQnXG4gICAgICBdLFxuICAgICAgc291cmNlVHlwZTogJ21vZHVsZSdcbiAgICB9KVxuXG4gICAgZnVuY3Rpb24gYWRkVHlwZShhcmdOb2RlKSB7XG4gICAgICB2YXIgdHlwZVxuICAgICAgaWYgKGFyZ05vZGUudHlwZSA9PT0gJ1N0cmluZ0xpdGVyYWwnKSB7XG4gICAgICAgIHZhciB4dHlwZSA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLl90b1h0eXBlKGFyZ05vZGUudmFsdWUpXG4gICAgICAgIGlmICh4dHlwZSAhPSAnZXh0cmVhY3QnKSB7XG4gICAgICAgICAgdHlwZSA9IHsgeHR5cGU6IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLl90b1h0eXBlKGFyZ05vZGUudmFsdWUpIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHlwZSA9IHsgeGNsYXNzOiBqcy5zbGljZShhcmdOb2RlLnN0YXJ0LCBhcmdOb2RlLmVuZCkgfVxuICAgICAgfVxuICAgICAgaWYgKHR5cGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCBjb25maWcgPSBKU09OLnN0cmluZ2lmeSh0eXBlKVxuICAgICAgICBzdGF0ZW1lbnRzLnB1c2goYEV4dC5jcmVhdGUoJHtjb25maWd9KWApXG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJhdmVyc2UoYXN0LCB7XG4gICAgICBwcmU6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJ1xuICAgICAgICAgICAgJiYgbm9kZS5jYWxsZWVcbiAgICAgICAgICAgICYmIG5vZGUuY2FsbGVlLm9iamVjdFxuICAgICAgICAgICAgJiYgbm9kZS5jYWxsZWUub2JqZWN0Lm5hbWUgPT09ICdFeHQnXG4gICAgICAgICkge1xuICAgICAgICAgIHN0YXRlbWVudHMucHVzaChnZW5lcmF0ZShub2RlKS5jb2RlKVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT0gJ1ZhcmlhYmxlRGVjbGFyYXRvcicgXG4gICAgICAgICAgICAmJiBub2RlLmluaXQgXG4gICAgICAgICAgICAmJiBub2RlLmluaXQudHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJyBcbiAgICAgICAgICAgICYmIG5vZGUuaW5pdC5jYWxsZWUgXG4gICAgICAgICkge1xuICAgICAgICAgIGlmIChub2RlLmluaXQuY2FsbGVlLm5hbWUgPT0gJ3JlYWN0aWZ5Jykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmluaXQuYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlTm9kZSA9IG5vZGUuaW5pdC5hcmd1bWVudHNbaV07XG4gICAgICAgICAgICAgIGlmICghdmFsdWVOb2RlKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgYWRkVHlwZSh2YWx1ZU5vZGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gLy8gQ29udmVydCBSZWFjdC5jcmVhdGVFbGVtZW50KC4uLikgY2FsbHMgdG8gdGhlIGVxdWl2YWxlbnQgRXh0LmNyZWF0ZSguLi4pIGNhbGxzIHRvIHB1dCBpbiB0aGUgbWFuaWZlc3QuXG4gICAgICAgIC8vIGlmIChub2RlLnR5cGUgPT09ICdDYWxsRXhwcmVzc2lvbngnIFxuICAgICAgICAvLyAgICAgJiYgbm9kZS5jYWxsZWUub2JqZWN0IFxuICAgICAgICAvLyAgICAgJiYgbm9kZS5jYWxsZWUub2JqZWN0Lm5hbWUgPT09ICdSZWFjdCcgXG4gICAgICAgIC8vICAgICAmJiBub2RlLmNhbGxlZS5wcm9wZXJ0eS5uYW1lID09PSAnY3JlYXRlRWxlbWVudCcpIHtcbiAgICAgICAgLy8gICBjb25zdCBbcHJvcHNdID0gbm9kZS5hcmd1bWVudHNcbiAgICAgICAgLy8gICBsZXQgY29uZmlnXG4gICAgICAgIC8vICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcHMucHJvcGVydGllcykpIHtcbiAgICAgICAgLy8gICAgIGNvbmZpZyA9IGdlbmVyYXRlKHByb3BzKS5jb2RlXG4gICAgICAgIC8vICAgICBmb3IgKGxldCBrZXkgaW4gdHlwZSkge1xuICAgICAgICAvLyAgICAgICBjb25maWcgPSBge1xcbiAgJHtrZXl9OiAnJHt0eXBlW2tleV19Jywke2NvbmZpZy5zbGljZSgxKX1gXG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgIGNvbmZpZyA9IEpTT04uc3RyaW5naWZ5KHR5cGUpXG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyB9XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gc3RhdGVtZW50c1xuICB9XG4gIGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZyhtb2R1bGUucmVzb3VyY2UpXG4gICAgY29uc29sZS5sb2coanMpXG4gICAgY29uc29sZS5sb2coZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnZXh0cmFjdEZyb21Tb3VyY2U6ICcgKyBlKVxuICAgIHJldHVybiBbXVxuICB9XG59XG5cbi8vIGV4cG9ydCBmdW5jdGlvbiBfdG9Qcm9kKHZhcnMsIG9wdGlvbnMpIHtcbi8vICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Zcbi8vICAgbG9ndihvcHRpb25zLnZlcmJvc2UsJ0ZVTkNUSU9OIF90b1Byb2QgKGVtcHR5KScpXG4vLyAgIHRyeSB7XG4vLyAgIH1cbi8vICAgY2F0Y2ggKGUpIHtcbi8vICAgICBjb25zb2xlLmxvZyhlKVxuLy8gICAgIHJldHVybiBbXVxuLy8gICB9XG4vLyB9XG5cbi8vIGV4cG9ydCBmdW5jdGlvbiBfdG9EZXYodmFycywgb3B0aW9ucykge1xuLy8gICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuLy8gICBsb2d2KG9wdGlvbnMudmVyYm9zZSwnRlVOQ1RJT04gX3RvRGV2IChlbXB0eSknKVxuLy8gICB0cnkge1xuLy8gICB9XG4vLyAgIGNhdGNoIChlKSB7XG4vLyAgICAgY29uc29sZS5sb2coZSlcbi8vICAgICByZXR1cm4gW11cbi8vICAgfVxuLy8gfVxuXG4vLyBleHBvcnQgZnVuY3Rpb24gX2dldEFsbENvbXBvbmVudHModmFycywgb3B0aW9ucykge1xuLy8gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Zcbi8vICAgbG9ndihvcHRpb25zLnZlcmJvc2UsJ0ZVTkNUSU9OIF9nZXRBbGxDb21wb25lbnRzIChlbXB0eSknKVxuLy8gICB0cnkge1xuLy8gICAgIHZhciBleHRDb21wb25lbnRzID0gW11cbi8vICAgICAgcmV0dXJuIGV4dENvbXBvbmVudHNcbi8vICAgfVxuLy8gICBjYXRjaCAoZSkge1xuLy8gICAgIGNvbnNvbGUubG9nKGUpXG4vLyAgICAgcmV0dXJuIFtdXG4vLyAgIH1cbi8vIH1cblxuLy8gZXhwb3J0IGZ1bmN0aW9uIF93cml0ZUZpbGVzVG9Qcm9kRm9sZGVyKHZhcnMsIG9wdGlvbnMpIHtcbi8vICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3Zcbi8vICAgbG9ndihvcHRpb25zLnZlcmJvc2UsJ0ZVTkNUSU9OIF93cml0ZUZpbGVzVG9Qcm9kRm9sZGVyIChlbXB0eSknKVxuLy8gICB0cnkge1xuLy8gICB9XG4vLyAgIGNhdGNoIChlKSB7XG4vLyAgICAgY29uc29sZS5sb2coZSlcbi8vICAgfVxuLy8gfVxuIl19