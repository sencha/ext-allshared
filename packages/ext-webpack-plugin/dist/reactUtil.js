"use strict"; // export function getValidateOptions() {
//   return {
//     "type": "object",
//     "properties": {
//       "framework":   {"type": [ "string" ]},
//       "toolkit":     {"type": [ "string" ]},
//       "theme":       {"type": [ "string" ]},
//       "profile":     {"type": [ "string" ]},
//       "environment": {"type": [ "string" ]},
//       "treeshake":   {"type": [ "boolean" ]},
//       "port":        {"type": [ "integer" ]},
//       "emit":        {"type": [ "boolean" ]},
//       "browser":     {"type": [ "boolean" ]},
//       "watch":       {"type": [ "string" ]},
//       "verbose":     {"type": [ "string" ]},
//       "script":      {"type": [ "string" ]},
//       "packages":    {"type": [ "string", "array" ]}
//     },
//     "additionalProperties": false
//     // "errorMessage": {
//     //   "option": "should be {Boolean} (https:/github.com/org/repo#anchor)"
//     // }
//   }
// }
// export function getDefaultOptions() {
//   return {
//     framework: null,
//     toolkit: 'modern',
//     theme: 'theme-material',
//     profile: 'desktop', 
//     environment: 'development', 
//     treeshake: false,
//     port: 1962,
//     emit: true,
//     browser: true,
//     watch: 'yes',
//     verbose: 'no',
//     script: null,
//     packages: null
//   }
// }
// export function getDefaultVars() {
//   return {
//     watchStarted : false,
//     buildstep: '1 of 1',
//     firstTime : true,
//     firstCompile: true,
//     browserCount : 0,
//     manifest: null,
//     extPath: 'ext-react',
//     pluginErrors: [],
//     deps: [],
//     usedExtComponents: [],
//     rebuild: true
//   }
// }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._extractFromSource = _extractFromSource;
exports._toProd = _toProd;
exports._toDev = _toDev;
exports._getAllComponents = _getAllComponents;
exports._writeFilesToProdFolder = _writeFilesToProdFolder;

function toXtype(str) {
  return str.toLowerCase().replace(/_/g, '-');
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
        var xtype = toXtype(argNode.value);

        if (xtype != 'extreact') {
          type = {
            xtype: toXtype(argNode.value)
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
}

function _toProd(vars, options) {
  const logv = require('./pluginUtil').logv;

  logv(options.verbose, 'FUNCTION _toProd (empty)');

  try {} catch (e) {
    console.log(e);
    return [];
  }
}

function _toDev(vars, options) {
  const logv = require('./pluginUtil').logv;

  logv(options.verbose, 'FUNCTION _toDev (empty)');

  try {} catch (e) {
    console.log(e);
    return [];
  }
}

function _getAllComponents(vars, options) {
  const logv = require('./pluginUtil').logv;

  logv(options.verbose, 'FUNCTION _getAllComponents (empty)');

  try {
    var extComponents = [];
    return extComponents;
  } catch (e) {
    console.log(e);
    return [];
  }
}

function _writeFilesToProdFolder(vars, options) {
  const logv = require('./pluginUtil').logv;

  logv(options.verbose, 'FUNCTION _writeFilesToProdFolder (empty)');

  try {} catch (e) {
    console.log(e);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZWFjdFV0aWwuanMiXSwibmFtZXMiOlsidG9YdHlwZSIsInN0ciIsInRvTG93ZXJDYXNlIiwicmVwbGFjZSIsIl9leHRyYWN0RnJvbVNvdXJjZSIsIm1vZHVsZSIsIm9wdGlvbnMiLCJjb21waWxhdGlvbiIsImV4dENvbXBvbmVudHMiLCJsb2d2IiwicmVxdWlyZSIsInZlcmJvc2UiLCJqcyIsIl9zb3VyY2UiLCJfdmFsdWUiLCJnZW5lcmF0ZSIsImRlZmF1bHQiLCJwYXJzZSIsInRyYXZlcnNlIiwic3RhdGVtZW50cyIsImFzdCIsInBsdWdpbnMiLCJzb3VyY2VUeXBlIiwiYWRkVHlwZSIsImFyZ05vZGUiLCJ0eXBlIiwieHR5cGUiLCJ2YWx1ZSIsInhjbGFzcyIsInNsaWNlIiwic3RhcnQiLCJlbmQiLCJ1bmRlZmluZWQiLCJjb25maWciLCJKU09OIiwic3RyaW5naWZ5IiwicHVzaCIsInByZSIsIm5vZGUiLCJjYWxsZWUiLCJvYmplY3QiLCJuYW1lIiwiY29kZSIsImluaXQiLCJpIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidmFsdWVOb2RlIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJyZXNvdXJjZSIsImVycm9ycyIsIl90b1Byb2QiLCJ2YXJzIiwiX3RvRGV2IiwiX2dldEFsbENvbXBvbmVudHMiLCJfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciJdLCJtYXBwaW5ncyI6IkFBQUEsYSxDQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LENBQXdCRCxJQUFyQzs7QUFDQUEsRUFBQUEsSUFBSSxDQUFDSCxPQUFPLENBQUNLLE9BQVQsRUFBaUIsMENBQWpCLENBQUo7O0FBQ0EsTUFBSSxDQUNILENBREQsQ0FFQSxPQUFPcUMsQ0FBUCxFQUFVO0FBQ1JDLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRixDQUFaO0FBQ0Q7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5cbi8vIGV4cG9ydCBmdW5jdGlvbiBnZXRWYWxpZGF0ZU9wdGlvbnMoKSB7XG4vLyAgIHJldHVybiB7XG4vLyAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4vLyAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcbi8vICAgICAgIFwiZnJhbWV3b3JrXCI6ICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4vLyAgICAgICBcInRvb2xraXRcIjogICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuLy8gICAgICAgXCJ0aGVtZVwiOiAgICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbi8vICAgICAgIFwicHJvZmlsZVwiOiAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4vLyAgICAgICBcImVudmlyb25tZW50XCI6IHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuLy8gICAgICAgXCJ0cmVlc2hha2VcIjogICB7XCJ0eXBlXCI6IFsgXCJib29sZWFuXCIgXX0sXG4vLyAgICAgICBcInBvcnRcIjogICAgICAgIHtcInR5cGVcIjogWyBcImludGVnZXJcIiBdfSxcbi8vICAgICAgIFwiZW1pdFwiOiAgICAgICAge1widHlwZVwiOiBbIFwiYm9vbGVhblwiIF19LFxuLy8gICAgICAgXCJicm93c2VyXCI6ICAgICB7XCJ0eXBlXCI6IFsgXCJib29sZWFuXCIgXX0sXG4vLyAgICAgICBcIndhdGNoXCI6ICAgICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuLy8gICAgICAgXCJ2ZXJib3NlXCI6ICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbi8vICAgICAgIFwic2NyaXB0XCI6ICAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4vLyAgICAgICBcInBhY2thZ2VzXCI6ICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiLCBcImFycmF5XCIgXX1cbi8vICAgICB9LFxuLy8gICAgIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjogZmFsc2Vcbi8vICAgICAvLyBcImVycm9yTWVzc2FnZVwiOiB7XG4vLyAgICAgLy8gICBcIm9wdGlvblwiOiBcInNob3VsZCBiZSB7Qm9vbGVhbn0gKGh0dHBzOi9naXRodWIuY29tL29yZy9yZXBvI2FuY2hvcilcIlxuLy8gICAgIC8vIH1cbi8vICAgfVxuLy8gfVxuXG4vLyBleHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdE9wdGlvbnMoKSB7XG4vLyAgIHJldHVybiB7XG4vLyAgICAgZnJhbWV3b3JrOiBudWxsLFxuLy8gICAgIHRvb2xraXQ6ICdtb2Rlcm4nLFxuLy8gICAgIHRoZW1lOiAndGhlbWUtbWF0ZXJpYWwnLFxuLy8gICAgIHByb2ZpbGU6ICdkZXNrdG9wJywgXG4vLyAgICAgZW52aXJvbm1lbnQ6ICdkZXZlbG9wbWVudCcsIFxuLy8gICAgIHRyZWVzaGFrZTogZmFsc2UsXG4vLyAgICAgcG9ydDogMTk2Mixcbi8vICAgICBlbWl0OiB0cnVlLFxuLy8gICAgIGJyb3dzZXI6IHRydWUsXG4vLyAgICAgd2F0Y2g6ICd5ZXMnLFxuLy8gICAgIHZlcmJvc2U6ICdubycsXG4vLyAgICAgc2NyaXB0OiBudWxsLFxuLy8gICAgIHBhY2thZ2VzOiBudWxsXG4vLyAgIH1cbi8vIH1cblxuLy8gZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRWYXJzKCkge1xuLy8gICByZXR1cm4ge1xuLy8gICAgIHdhdGNoU3RhcnRlZCA6IGZhbHNlLFxuLy8gICAgIGJ1aWxkc3RlcDogJzEgb2YgMScsXG4vLyAgICAgZmlyc3RUaW1lIDogdHJ1ZSxcbi8vICAgICBmaXJzdENvbXBpbGU6IHRydWUsXG4vLyAgICAgYnJvd3NlckNvdW50IDogMCxcbi8vICAgICBtYW5pZmVzdDogbnVsbCxcbi8vICAgICBleHRQYXRoOiAnZXh0LXJlYWN0Jyxcbi8vICAgICBwbHVnaW5FcnJvcnM6IFtdLFxuLy8gICAgIGRlcHM6IFtdLFxuLy8gICAgIHVzZWRFeHRDb21wb25lbnRzOiBbXSxcbi8vICAgICByZWJ1aWxkOiB0cnVlXG4vLyAgIH1cbi8vIH1cblxuZnVuY3Rpb24gdG9YdHlwZShzdHIpIHtcbiAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL18vZywgJy0nKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX2V4dHJhY3RGcm9tU291cmNlKG1vZHVsZSwgb3B0aW9ucywgY29tcGlsYXRpb24sIGV4dENvbXBvbmVudHMpIHtcbiAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgbG9ndihvcHRpb25zLnZlcmJvc2UsJ0ZVTkNUSU9OIF9leHRyYWN0RnJvbVNvdXJjZScpXG4gIHRyeSB7XG4gICAgdmFyIGpzID0gbW9kdWxlLl9zb3VyY2UuX3ZhbHVlXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KG9wdGlvbnMudmVyYm9zZSwnRlVOQ1RJT04gZXh0cmFjdEZyb21Tb3VyY2UnKVxuICAgIHZhciBnZW5lcmF0ZSA9IHJlcXVpcmUoXCJAYmFiZWwvZ2VuZXJhdG9yXCIpLmRlZmF1bHRcbiAgICB2YXIgcGFyc2UgPSByZXF1aXJlKFwiYmFieWxvblwiKS5wYXJzZVxuICAgIHZhciB0cmF2ZXJzZSA9IHJlcXVpcmUoXCJhc3QtdHJhdmVyc2VcIilcbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gW11cbiAgICBcbiAgICBjb25zdCBhc3QgPSBwYXJzZShqcywge1xuICAgICAgcGx1Z2luczogW1xuICAgICAgICAnanN4JyxcbiAgICAgICAgJ2Zsb3cnLFxuICAgICAgICAnZG9FeHByZXNzaW9ucycsXG4gICAgICAgICdvYmplY3RSZXN0U3ByZWFkJyxcbiAgICAgICAgJ2NsYXNzUHJvcGVydGllcycsXG4gICAgICAgICdleHBvcnRFeHRlbnNpb25zJyxcbiAgICAgICAgJ2FzeW5jR2VuZXJhdG9ycycsXG4gICAgICAgICdmdW5jdGlvbkJpbmQnLFxuICAgICAgICAnZnVuY3Rpb25TZW50JyxcbiAgICAgICAgJ2R5bmFtaWNJbXBvcnQnXG4gICAgICBdLFxuICAgICAgc291cmNlVHlwZTogJ21vZHVsZSdcbiAgICB9KVxuXG4gICAgZnVuY3Rpb24gYWRkVHlwZShhcmdOb2RlKSB7XG4gICAgICB2YXIgdHlwZVxuICAgICAgaWYgKGFyZ05vZGUudHlwZSA9PT0gJ1N0cmluZ0xpdGVyYWwnKSB7XG4gICAgICAgIHZhciB4dHlwZSA9IHRvWHR5cGUoYXJnTm9kZS52YWx1ZSlcbiAgICAgICAgaWYgKHh0eXBlICE9ICdleHRyZWFjdCcpIHtcbiAgICAgICAgICB0eXBlID0geyB4dHlwZTogdG9YdHlwZShhcmdOb2RlLnZhbHVlKSB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHR5cGUgPSB7IHhjbGFzczoganMuc2xpY2UoYXJnTm9kZS5zdGFydCwgYXJnTm9kZS5lbmQpIH1cbiAgICAgIH1cbiAgICAgIGlmICh0eXBlICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgY29uZmlnID0gSlNPTi5zdHJpbmdpZnkodHlwZSlcbiAgICAgICAgc3RhdGVtZW50cy5wdXNoKGBFeHQuY3JlYXRlKCR7Y29uZmlnfSlgKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRyYXZlcnNlKGFzdCwge1xuICAgICAgcHJlOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdDYWxsRXhwcmVzc2lvbidcbiAgICAgICAgICAgICYmIG5vZGUuY2FsbGVlXG4gICAgICAgICAgICAmJiBub2RlLmNhbGxlZS5vYmplY3RcbiAgICAgICAgICAgICYmIG5vZGUuY2FsbGVlLm9iamVjdC5uYW1lID09PSAnRXh0J1xuICAgICAgICApIHtcbiAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2goZ2VuZXJhdGUobm9kZSkuY29kZSlcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlID09ICdWYXJpYWJsZURlY2xhcmF0b3InIFxuICAgICAgICAgICAgJiYgbm9kZS5pbml0IFxuICAgICAgICAgICAgJiYgbm9kZS5pbml0LnR5cGUgPT09ICdDYWxsRXhwcmVzc2lvbicgXG4gICAgICAgICAgICAmJiBub2RlLmluaXQuY2FsbGVlIFxuICAgICAgICApIHtcbiAgICAgICAgICBpZiAobm9kZS5pbml0LmNhbGxlZS5uYW1lID09ICdyZWFjdGlmeScpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5pbml0LmFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBjb25zdCB2YWx1ZU5vZGUgPSBub2RlLmluaXQuYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICBpZiAoIXZhbHVlTm9kZSkgY29udGludWU7XG4gICAgICAgICAgICAgIGFkZFR5cGUodmFsdWVOb2RlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC8vIENvbnZlcnQgUmVhY3QuY3JlYXRlRWxlbWVudCguLi4pIGNhbGxzIHRvIHRoZSBlcXVpdmFsZW50IEV4dC5jcmVhdGUoLi4uKSBjYWxscyB0byBwdXQgaW4gdGhlIG1hbmlmZXN0LlxuICAgICAgICAvLyBpZiAobm9kZS50eXBlID09PSAnQ2FsbEV4cHJlc3Npb254JyBcbiAgICAgICAgLy8gICAgICYmIG5vZGUuY2FsbGVlLm9iamVjdCBcbiAgICAgICAgLy8gICAgICYmIG5vZGUuY2FsbGVlLm9iamVjdC5uYW1lID09PSAnUmVhY3QnIFxuICAgICAgICAvLyAgICAgJiYgbm9kZS5jYWxsZWUucHJvcGVydHkubmFtZSA9PT0gJ2NyZWF0ZUVsZW1lbnQnKSB7XG4gICAgICAgIC8vICAgY29uc3QgW3Byb3BzXSA9IG5vZGUuYXJndW1lbnRzXG4gICAgICAgIC8vICAgbGV0IGNvbmZpZ1xuICAgICAgICAvLyAgIGlmIChBcnJheS5pc0FycmF5KHByb3BzLnByb3BlcnRpZXMpKSB7XG4gICAgICAgIC8vICAgICBjb25maWcgPSBnZW5lcmF0ZShwcm9wcykuY29kZVxuICAgICAgICAvLyAgICAgZm9yIChsZXQga2V5IGluIHR5cGUpIHtcbiAgICAgICAgLy8gICAgICAgY29uZmlnID0gYHtcXG4gICR7a2V5fTogJyR7dHlwZVtrZXldfScsJHtjb25maWcuc2xpY2UoMSl9YFxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICBjb25maWcgPSBKU09OLnN0cmluZ2lmeSh0eXBlKVxuICAgICAgICAvLyAgIH1cbiAgICAgICAgLy8gfVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHN0YXRlbWVudHNcbiAgfVxuICBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2cobW9kdWxlLnJlc291cmNlKVxuICAgIGNvbnNvbGUubG9nKGpzKVxuICAgIGNvbnNvbGUubG9nKGUpXG4gICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goJ2V4dHJhY3RGcm9tU291cmNlOiAnICsgZSlcbiAgICByZXR1cm4gW11cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX3RvUHJvZCh2YXJzLCBvcHRpb25zKSB7XG4gIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gIGxvZ3Yob3B0aW9ucy52ZXJib3NlLCdGVU5DVElPTiBfdG9Qcm9kIChlbXB0eSknKVxuICB0cnkge1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgICByZXR1cm4gW11cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX3RvRGV2KHZhcnMsIG9wdGlvbnMpIHtcbiAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgbG9ndihvcHRpb25zLnZlcmJvc2UsJ0ZVTkNUSU9OIF90b0RldiAoZW1wdHkpJylcbiAgdHJ5IHtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpXG4gICAgcmV0dXJuIFtdXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRBbGxDb21wb25lbnRzKHZhcnMsIG9wdGlvbnMpIHtcbiAgIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gIGxvZ3Yob3B0aW9ucy52ZXJib3NlLCdGVU5DVElPTiBfZ2V0QWxsQ29tcG9uZW50cyAoZW1wdHkpJylcbiAgdHJ5IHtcbiAgICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdXG4gICAgIHJldHVybiBleHRDb21wb25lbnRzXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICAgIHJldHVybiBbXVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfd3JpdGVGaWxlc1RvUHJvZEZvbGRlcih2YXJzLCBvcHRpb25zKSB7XG4gIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gIGxvZ3Yob3B0aW9ucy52ZXJib3NlLCdGVU5DVElPTiBfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciAoZW1wdHkpJylcbiAgdHJ5IHtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpXG4gIH1cbn1cbiJdfQ==