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
//     extPath: 'ext-components',
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

  logv(options.verbose, 'FUNCTION _extractFromSource (empty)');

  try {
    var statements = ['Ext.require("Ext.*")'];
    return statements;
  } catch (e) {
    console.log(e);
    compilation.errors.push('extractFromSource: ' + e);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzVXRpbC5qcyJdLCJuYW1lcyI6WyJ0b1h0eXBlIiwic3RyIiwidG9Mb3dlckNhc2UiLCJyZXBsYWNlIiwiX2V4dHJhY3RGcm9tU291cmNlIiwibW9kdWxlIiwib3B0aW9ucyIsImNvbXBpbGF0aW9uIiwiZXh0Q29tcG9uZW50cyIsImxvZ3YiLCJyZXF1aXJlIiwidmVyYm9zZSIsInN0YXRlbWVudHMiLCJlIiwiY29uc29sZSIsImxvZyIsImVycm9ycyIsInB1c2giLCJjaGFuZ2VJdCIsIm8iLCJwYXRoIiwiZnN4Iiwid2hlcmVQYXRoIiwicmVzb2x2ZSIsInByb2Nlc3MiLCJjd2QiLCJ3aGVyZSIsImpzIiwicmVhZEZpbGVTeW5jIiwidG9TdHJpbmciLCJuZXdKcyIsImZyb20iLCJ0byIsIndyaXRlRmlsZVN5bmMiLCJfdG9Qcm9kIiwidmFycyIsIl90b0RldiIsIl9nZXRBbGxDb21wb25lbnRzIiwiX3dyaXRlRmlsZXNUb1Byb2RGb2xkZXIiXSwibWFwcGluZ3MiOiJBQUFBLGEsQ0FFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQUVBLFNBQVNBLE9BQVQsQ0FBaUJDLEdBQWpCLEVBQXNCO0FBQ3BCLFNBQU9BLEdBQUcsQ0FBQ0MsV0FBSixHQUFrQkMsT0FBbEIsQ0FBMEIsSUFBMUIsRUFBZ0MsR0FBaEMsQ0FBUDtBQUNEOztBQUVNLFNBQVNDLGtCQUFULENBQTRCQyxNQUE1QixFQUFv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QUFVO0FBQ1JDLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRixDQUFaO0FBQ0Q7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5cbi8vIGV4cG9ydCBmdW5jdGlvbiBnZXRWYWxpZGF0ZU9wdGlvbnMoKSB7XG4vLyAgIHJldHVybiB7XG4vLyAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4vLyAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcbi8vICAgICAgIFwiZnJhbWV3b3JrXCI6ICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4vLyAgICAgICBcInRvb2xraXRcIjogICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuLy8gICAgICAgXCJ0aGVtZVwiOiAgICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbi8vICAgICAgIFwicHJvZmlsZVwiOiAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4vLyAgICAgICBcImVudmlyb25tZW50XCI6IHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuLy8gICAgICAgXCJ0cmVlc2hha2VcIjogICB7XCJ0eXBlXCI6IFsgXCJib29sZWFuXCIgXX0sXG4vLyAgICAgICBcInBvcnRcIjogICAgICAgIHtcInR5cGVcIjogWyBcImludGVnZXJcIiBdfSxcbi8vICAgICAgIFwiZW1pdFwiOiAgICAgICAge1widHlwZVwiOiBbIFwiYm9vbGVhblwiIF19LFxuLy8gICAgICAgXCJicm93c2VyXCI6ICAgICB7XCJ0eXBlXCI6IFsgXCJib29sZWFuXCIgXX0sXG4vLyAgICAgICBcIndhdGNoXCI6ICAgICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuLy8gICAgICAgXCJ2ZXJib3NlXCI6ICAgICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbi8vICAgICAgIFwic2NyaXB0XCI6ICAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4vLyAgICAgICBcInBhY2thZ2VzXCI6ICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiLCBcImFycmF5XCIgXX1cbi8vICAgICB9LFxuLy8gICAgIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjogZmFsc2Vcbi8vICAgfVxuLy8gfVxuXG4vLyBleHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdE9wdGlvbnMoKSB7XG4vLyAgIHJldHVybiB7XG4vLyAgICAgZnJhbWV3b3JrOiBudWxsLFxuLy8gICAgIHRvb2xraXQ6ICdtb2Rlcm4nLFxuLy8gICAgIHRoZW1lOiAndGhlbWUtbWF0ZXJpYWwnLFxuLy8gICAgIHByb2ZpbGU6ICdkZXNrdG9wJywgXG4vLyAgICAgZW52aXJvbm1lbnQ6ICdkZXZlbG9wbWVudCcsIFxuLy8gICAgIHRyZWVzaGFrZTogZmFsc2UsXG4vLyAgICAgcG9ydDogMTk2Mixcbi8vICAgICBlbWl0OiB0cnVlLFxuLy8gICAgIGJyb3dzZXI6IHRydWUsXG4vLyAgICAgd2F0Y2g6ICd5ZXMnLFxuLy8gICAgIHZlcmJvc2U6ICdubycsXG4vLyAgICAgc2NyaXB0OiBudWxsLFxuLy8gICAgIHBhY2thZ2VzOiBudWxsXG4vLyAgIH1cbi8vIH1cblxuLy8gZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRWYXJzKCkge1xuLy8gICByZXR1cm4ge1xuLy8gICAgIHdhdGNoU3RhcnRlZCA6IGZhbHNlLFxuLy8gICAgIGJ1aWxkc3RlcDogJzEgb2YgMScsXG4vLyAgICAgZmlyc3RUaW1lIDogdHJ1ZSxcbi8vICAgICBmaXJzdENvbXBpbGU6IHRydWUsXG4vLyAgICAgYnJvd3NlckNvdW50IDogMCxcbi8vICAgICBtYW5pZmVzdDogbnVsbCxcbi8vICAgICBleHRQYXRoOiAnZXh0LWNvbXBvbmVudHMnLFxuLy8gICAgIHBsdWdpbkVycm9yczogW10sXG4vLyAgICAgZGVwczogW10sXG4vLyAgICAgdXNlZEV4dENvbXBvbmVudHM6IFtdLFxuLy8gICAgIHJlYnVpbGQ6IHRydWVcbi8vICAgfVxuLy8gfVxuXG5mdW5jdGlvbiB0b1h0eXBlKHN0cikge1xuICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnLScpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZXh0cmFjdEZyb21Tb3VyY2UobW9kdWxlLCBvcHRpb25zLCBjb21waWxhdGlvbiwgZXh0Q29tcG9uZW50cykge1xuICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICBsb2d2KG9wdGlvbnMudmVyYm9zZSwnRlVOQ1RJT04gX2V4dHJhY3RGcm9tU291cmNlIChlbXB0eSknKVxuICB0cnkge1xuICAgIHZhciBzdGF0ZW1lbnRzID0gW1xuICAgICAgJ0V4dC5yZXF1aXJlKFwiRXh0LipcIiknLFxuICAgIF1cbiAgICByZXR1cm4gc3RhdGVtZW50c1xuICB9XG4gIGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdleHRyYWN0RnJvbVNvdXJjZTogJyArIGUpXG4gICAgcmV0dXJuIFtdXG4gIH1cbn1cblxuZnVuY3Rpb24gY2hhbmdlSXQobykge1xuICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gIGNvbnN0IGZzeCA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcbiAgY29uc3Qgd2hlcmVQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIG8ud2hlcmUpXG4gIHZhciBqcyA9IGZzeC5yZWFkRmlsZVN5bmMod2hlcmVQYXRoKS50b1N0cmluZygpXG4gIHZhciBuZXdKcyA9IGpzLnJlcGxhY2Uoby5mcm9tLG8udG8pO1xuICBmc3gud3JpdGVGaWxlU3luYyh3aGVyZVBhdGgsIG5ld0pzLCAndXRmLTgnLCAoKT0+e3JldHVybn0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfdG9Qcm9kKHZhcnMsIG9wdGlvbnMpIHtcbiAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgbG9ndihvcHRpb25zLnZlcmJvc2UsJ0ZVTkNUSU9OIF90b1Byb2QgKGVtcHR5JylcbiAgdHJ5IHtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpXG4gICAgcmV0dXJuIFtdXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF90b0Rldih2YXJzLCBvcHRpb25zKSB7XG5cbiAgdHJ5IHtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpXG4gICAgcmV0dXJuIFtdXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRBbGxDb21wb25lbnRzKHZhcnMsIG9wdGlvbnMpIHtcbiAgIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gIGxvZ3Yob3B0aW9ucy52ZXJib3NlLCdGVU5DVElPTiBfZ2V0QWxsQ29tcG9uZW50cyAoZW1wdHkpJylcbiAgdHJ5IHtcbiAgICB2YXIgZXh0Q29tcG9uZW50cyA9IFtdXG4gICAgIHJldHVybiBleHRDb21wb25lbnRzXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICAgIHJldHVybiBbXVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfd3JpdGVGaWxlc1RvUHJvZEZvbGRlcih2YXJzLCBvcHRpb25zKSB7XG4gIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gIGxvZ3Yob3B0aW9ucy52ZXJib3NlLCdGVU5DVElPTiBfd3JpdGVGaWxlc1RvUHJvZEZvbGRlciAoZW1wdHkpJylcbiAgdHJ5IHtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpXG4gIH1cbn0iXX0=