"use strict"; // export function getValidateOptions() {
//   return {
//     "type": "object",
//     "properties": {
//       "framework":   {"type": [ "string" ]},
//       "port":        {"type": [ "integer" ]},
//       "emit":        {"type": [ "boolean" ]},
//       "browser":     {"type": [ "boolean" ]},
//       "watch":       {"type": [ "string" ]},
//       "profile":     {"type": [ "string" ]},
//       "environment": {"type": [ "string" ]},
//       "verbose":     {"type": [ "string" ]},
// //      "theme":       {"type": [ "string" ]},
// //      "toolkit":     {"type": [ "string" ]},
//       "treeshake":   {"type": [ "boolean" ]}
// //      "packages":    {"type": [ "string", "array" ]},
//     },
//     "additionalProperties": false
//     // "errorMessage": {
//     //   "option": "should be {Boolean} (https:/github.com/org/repo#anchor)"
//     // }
//   }
// }
// export function getDefaultOptions() {
//   return {
//     port: 1962,
//     emit: true,
//     browser: true,
//     watch: 'yes',
//     profile: 'desktop', 
//     environment: 'development', 
//     verbose: 'no'
//   }
// }
// export function getDefaultVars() {
//   return {
//     watchStarted : false,
//     firstTime : true,
//     browserCount : 0,
//     cwd: process.cwd(),
//     extPath: '.',
//     pluginErrors: [],
//     lastNumFiles: 0,
//     lastMilliseconds: 0,
//     lastMillisecondsAppJson: 0,
//     files: ['./app.json'],
//     dirs: ['./app','./packages']
//   }
// }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._afterCompile = _afterCompile;
exports._prepareForBuild = _prepareForBuild;

function _afterCompile(compilation, vars, options) {
  try {
    require('./pluginUtil').logv(options, 'FUNCTION ext-after-compile');

    const path = require('path');

    let {
      files,
      dirs
    } = vars;
    const {
      cwd
    } = vars;
    files = typeof files === 'string' ? [files] : files;
    dirs = typeof dirs === 'string' ? [dirs] : dirs;

    const {
      fileDependencies,
      contextDependencies
    } = _getFileAndContextDeps(compilation, files, dirs, cwd, options);

    if (files.length > 0) {
      fileDependencies.forEach(file => {
        compilation.fileDependencies.add(path.resolve(file));
      });
    }

    if (dirs.length > 0) {
      contextDependencies.forEach(context => {
        compilation.contextDependencies.add(context);
      });
    }
  } catch (e) {
    console.log(e);
    compilation.errors.push('_afterCompile: ' + e);
  }
}

function _getFileAndContextDeps(compilation, files, dirs, cwd, options) {
  require('./pluginUtil').logv(options, 'FUNCTION _getFileAndContextDeps');

  const uniq = require('lodash.uniq');

  const isGlob = require('is-glob');

  const {
    fileDependencies,
    contextDependencies
  } = compilation;
  const isWebpack4 = compilation.hooks;
  let fds = isWebpack4 ? [...fileDependencies] : fileDependencies;
  let cds = isWebpack4 ? [...contextDependencies] : contextDependencies;

  if (files.length > 0) {
    files.forEach(pattern => {
      let f = pattern;

      if (isGlob(pattern)) {
        f = glob.sync(pattern, {
          cwd,
          dot: true,
          absolute: true
        });
      }

      fds = fds.concat(f);
    });
    fds = uniq(fds);
  }

  if (dirs.length > 0) {
    cds = uniq(cds.concat(dirs));
  }

  return {
    fileDependencies: fds,
    contextDependencies: cds
  };
}

function _prepareForBuild(app, vars, options, output, compilation) {
  try {
    const log = require('./pluginUtil').log;

    const logv = require('./pluginUtil').logv;

    logv(options, '_prepareForBuild');

    const fs = require('fs');

    const recursiveReadSync = require('recursive-readdir-sync');

    var watchedFiles = [];

    try {
      watchedFiles = recursiveReadSync('./app').concat(recursiveReadSync('./packages'));
    } catch (err) {
      if (err.errno === 34) {
        console.log('Path does not exist');
      } else {
        throw err;
      }
    }

    var currentNumFiles = watchedFiles.length;
    logv(options, 'watchedFiles: ' + currentNumFiles);
    var doBuild = true; // var doBuild = false
    // for (var file in watchedFiles) {
    //   if (vars.lastMilliseconds < fs.statSync(watchedFiles[file]).mtimeMs) {
    //     if (watchedFiles[file].indexOf("scss") != -1) {doBuild=true;break;}
    //   }
    // }
    // if (vars.lastMilliseconds < fs.statSync('./app.json').mtimeMs) {
    //   doBuild=true
    // }

    logv(options, 'doBuild: ' + doBuild);
    vars.lastMilliseconds = new Date().getTime();
    var filesource = 'this file enables client reload';
    compilation.assets[currentNumFiles + 'FilesUnderAppFolder.md'] = {
      source: function () {
        return filesource;
      },
      size: function () {
        return filesource.length;
      }
    };
    logv(options, 'currentNumFiles: ' + currentNumFiles);
    logv(options, 'vars.lastNumFiles: ' + vars.lastNumFiles);
    logv(options, 'doBuild: ' + doBuild);

    if (currentNumFiles != vars.lastNumFiles || doBuild) {
      vars.rebuild = true;
      var bundleDir = output.replace(process.cwd(), '');

      if (bundleDir.trim() == '') {
        bundleDir = './';
      }

      log(app + 'Building Ext bundle at: ' + bundleDir);
    } else {
      vars.rebuild = false;
    }

    vars.lastNumFiles = currentNumFiles;
  } catch (e) {
    console.log(e);
    compilation.errors.push('_prepareForBuild: ' + e);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9leHRqc1V0aWwuanMiXSwibmFtZXMiOlsiX2FmdGVyQ29tcGlsZSIsImNvbXBpbGF0aW9uIiwidmFycyIsIm9wdGlvbnMiLCJyZXF1aXJlIiwibG9ndiIsInBhdGgiLCJmaWxlcyIsImRpcnMiLCJjd2QiLCJmaWxlRGVwZW5kZW5jaWVzIiwiY29udGV4dERlcGVuZGVuY2llcyIsIl9nZXRGaWxlQW5kQ29udGV4dERlcHMiLCJsZW5ndGgiLCJmb3JFYWNoIiwiZmlsZSIsImFkZCIsInJlc29sdmUiLCJjb250ZXh0IiwiZSIsImNvbnNvbGUiLCJsb2ciLCJlcnJvcnMiLCJwdXNoIiwidW5pcSIsImlzR2xvYiIsImlzV2VicGFjazQiLCJob29rcyIsImZkcyIsImNkcyIsInBhdHRlcm4iLCJmIiwiZ2xvYiIsInN5bmMiLCJkb3QiLCJhYnNvbHV0ZSIsImNvbmNhdCIsIl9wcmVwYXJlRm9yQnVpbGQiLCJhcHAiLCJvdXRwdXQiLCJmcyIsInJlY3Vyc2l2ZVJlYWRTeW5jIiwid2F0Y2hlZEZpbGVzIiwiZXJyIiwiZXJybm8iLCJjdXJyZW50TnVtRmlsZXMiLCJkb0J1aWxkIiwibGFzdE1pbGxpc2Vjb25kcyIsIkRhdGUiLCJnZXRUaW1lIiwiZmlsZXNvdXJjZSIsImFzc2V0cyIsInNvdXJjZSIsInNpemUiLCJsYXN0TnVtRmlsZXMiLCJyZWJ1aWxkIiwiYnVuZGxlRGlyIiwicmVwbGFjZSIsInByb2Nlc3MiLCJ0cmltIl0sIm1hcHBpbmdzIjoiQUFBQSxhLENBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FBRU8sU0FBU0EsYUFBVCxDQUF1QkMsV0FBdkIsRUFBb0NDLElBQXBDLEVBQTBDQyxPQUExQyxFQUFtRDtBQUN4RCxNQUFJO0FBQ0ZDLElBQUFBLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0JDLElBQXhCLENBQTZCRixPQUE3QixFQUFxQyw0QkFBckM7O0FBQ0EsVUFBTUcsSUFBSSxHQUFHRixPQUFPLENBQUMsTUFBRCxDQUFwQjs7QUFDQSxRQUFJO0FBQUVHLE1BQUFBLEtBQUY7QUFBU0MsTUFBQUE7QUFBVCxRQUFrQk4sSUFBdEI7QUFDQSxVQUFNO0FBQUVPLE1BQUFBO0FBQUYsUUFBVVAsSUFBaEI7QUFDQUssSUFBQUEsS0FBSyxHQUFHLE9BQU9BLEtBQVAsS0FBaUIsUUFBakIsR0FBNEIsQ0FBQ0EsS0FBRCxDQUE1QixHQUFzQ0EsS0FBOUM7QUFDQUMsSUFBQUEsSUFBSSxHQUFHLE9BQU9BLElBQVAsS0FBZ0IsUUFBaEIsR0FBMkIsQ0FBQ0EsSUFBRCxDQUEzQixHQUFvQ0EsSUFBM0M7O0FBQ0EsVUFBTTtBQUNKRSxNQUFBQSxnQkFESTtBQUVKQyxNQUFBQTtBQUZJLFFBR0ZDLHNCQUFzQixDQUFDWCxXQUFELEVBQWNNLEtBQWQsRUFBcUJDLElBQXJCLEVBQTJCQyxHQUEzQixFQUFnQ04sT0FBaEMsQ0FIMUI7O0FBSUEsUUFBSUksS0FBSyxDQUFDTSxNQUFOLEdBQWUsQ0FBbkIsRUFBc0I7QUFDcEJILE1BQUFBLGdCQUFnQixDQUFDSSxPQUFqQixDQUEwQkMsSUFBRCxJQUFVO0FBQ2pDZCxRQUFBQSxXQUFXLENBQUNTLGdCQUFaLENBQTZCTSxHQUE3QixDQUFpQ1YsSUFBSSxDQUFDVyxPQUFMLENBQWFGLElBQWIsQ0FBakM7QUFDRCxPQUZEO0FBR0Q7O0FBQ0QsUUFBSVAsSUFBSSxDQUFDSyxNQUFMLEdBQWMsQ0FBbEIsRUFBcUI7QUFDbkJGLE1BQUFBLG1CQUFtQixDQUFDRyxPQUFwQixDQUE2QkksT0FBRCxJQUFhO0FBQ3ZDakIsUUFBQUEsV0FBVyxDQUFDVSxtQkFBWixDQUFnQ0ssR0FBaEMsQ0FBb0NFLE9BQXBDO0FBQ0QsT0FGRDtBQUdEO0FBQ0YsR0FyQkQsQ0FzQkEsT0FBTUMsQ0FBTixFQUFTO0FBQ1BDLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRixDQUFaO0FBQ0FsQixJQUFBQSxXQUFXLENBQUNxQixNQUFaLENBQW1CQyxJQUFuQixDQUF3QixvQkFBb0JKLENBQTVDO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTUCxzQkFBVCxDQUFnQ1gsV0FBaEMsRUFBNkNNLEtBQTdDLEVBQW9EQyxJQUFwRCxFQUEwREMsR0FBMUQsRUFBK0ROLE9BQS9ELEVBQXdFO0FBQ3RFQyxFQUFBQSxPQUFPLENBQUMsY0FBRCxDQUFQLENBQXdCQyxJQUF4QixDQUE2QkYsT0FBN0IsRUFBcUMsaUNBQXJDOztBQUNBLFFBQU1xQixJQUFJLEdBQUdwQixPQUFPLENBQUMsYUFBRCxDQUFwQjs7QUFDQSxRQUFNcUIsTUFBTSxHQUFHckIsT0FBTyxDQUFDLFNBQUQsQ0FBdEI7O0FBRUEsUUFBTTtBQUFFTSxJQUFBQSxnQkFBRjtBQUFvQkMsSUFBQUE7QUFBcEIsTUFBNENWLFdBQWxEO0FBQ0EsUUFBTXlCLFVBQVUsR0FBR3pCLFdBQVcsQ0FBQzBCLEtBQS9CO0FBQ0EsTUFBSUMsR0FBRyxHQUFHRixVQUFVLEdBQUcsQ0FBQyxHQUFHaEIsZ0JBQUosQ0FBSCxHQUEyQkEsZ0JBQS9DO0FBQ0EsTUFBSW1CLEdBQUcsR0FBR0gsVUFBVSxHQUFHLENBQUMsR0FBR2YsbUJBQUosQ0FBSCxHQUE4QkEsbUJBQWxEOztBQUNBLE1BQUlKLEtBQUssQ0FBQ00sTUFBTixHQUFlLENBQW5CLEVBQXNCO0FBQ3BCTixJQUFBQSxLQUFLLENBQUNPLE9BQU4sQ0FBZWdCLE9BQUQsSUFBYTtBQUN6QixVQUFJQyxDQUFDLEdBQUdELE9BQVI7O0FBQ0EsVUFBSUwsTUFBTSxDQUFDSyxPQUFELENBQVYsRUFBcUI7QUFDbkJDLFFBQUFBLENBQUMsR0FBR0MsSUFBSSxDQUFDQyxJQUFMLENBQVVILE9BQVYsRUFBbUI7QUFBRXJCLFVBQUFBLEdBQUY7QUFBT3lCLFVBQUFBLEdBQUcsRUFBRSxJQUFaO0FBQWtCQyxVQUFBQSxRQUFRLEVBQUU7QUFBNUIsU0FBbkIsQ0FBSjtBQUNEOztBQUNEUCxNQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ1EsTUFBSixDQUFXTCxDQUFYLENBQU47QUFDRCxLQU5EO0FBT0FILElBQUFBLEdBQUcsR0FBR0osSUFBSSxDQUFDSSxHQUFELENBQVY7QUFDRDs7QUFDRCxNQUFJcEIsSUFBSSxDQUFDSyxNQUFMLEdBQWMsQ0FBbEIsRUFBcUI7QUFDbkJnQixJQUFBQSxHQUFHLEdBQUdMLElBQUksQ0FBQ0ssR0FBRyxDQUFDTyxNQUFKLENBQVc1QixJQUFYLENBQUQsQ0FBVjtBQUNEOztBQUNELFNBQU87QUFBRUUsSUFBQUEsZ0JBQWdCLEVBQUVrQixHQUFwQjtBQUF5QmpCLElBQUFBLG1CQUFtQixFQUFFa0I7QUFBOUMsR0FBUDtBQUNEOztBQUVNLFNBQVNRLGdCQUFULENBQTBCQyxHQUExQixFQUErQnBDLElBQS9CLEVBQXFDQyxPQUFyQyxFQUE4Q29DLE1BQTlDLEVBQXNEdEMsV0FBdEQsRUFBbUU7QUFDeEUsTUFBSTtBQUNGLFVBQU1vQixHQUFHLEdBQUdqQixPQUFPLENBQUMsY0FBRCxDQUFQLENBQXdCaUIsR0FBcEM7O0FBQ0EsVUFBTWhCLElBQUksR0FBR0QsT0FBTyxDQUFDLGNBQUQsQ0FBUCxDQUF3QkMsSUFBckM7O0FBQ0FBLElBQUFBLElBQUksQ0FBQ0YsT0FBRCxFQUFTLGtCQUFULENBQUo7O0FBQ0EsVUFBTXFDLEVBQUUsR0FBR3BDLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBLFVBQU1xQyxpQkFBaUIsR0FBR3JDLE9BQU8sQ0FBQyx3QkFBRCxDQUFqQzs7QUFDQSxRQUFJc0MsWUFBWSxHQUFDLEVBQWpCOztBQUNBLFFBQUk7QUFBQ0EsTUFBQUEsWUFBWSxHQUFHRCxpQkFBaUIsQ0FBQyxPQUFELENBQWpCLENBQTJCTCxNQUEzQixDQUFrQ0ssaUJBQWlCLENBQUMsWUFBRCxDQUFuRCxDQUFmO0FBQWtGLEtBQXZGLENBQ0EsT0FBTUUsR0FBTixFQUFXO0FBQUMsVUFBR0EsR0FBRyxDQUFDQyxLQUFKLEtBQWMsRUFBakIsRUFBb0I7QUFBQ3hCLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHFCQUFaO0FBQW9DLE9BQXpELE1BQStEO0FBQUMsY0FBTXNCLEdBQU47QUFBVztBQUFDOztBQUN4RixRQUFJRSxlQUFlLEdBQUdILFlBQVksQ0FBQzdCLE1BQW5DO0FBQ0FSLElBQUFBLElBQUksQ0FBQ0YsT0FBRCxFQUFTLG1CQUFtQjBDLGVBQTVCLENBQUo7QUFDQSxRQUFJQyxPQUFPLEdBQUcsSUFBZCxDQVhFLENBYUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBekMsSUFBQUEsSUFBSSxDQUFDRixPQUFELEVBQVMsY0FBYzJDLE9BQXZCLENBQUo7QUFFQTVDLElBQUFBLElBQUksQ0FBQzZDLGdCQUFMLEdBQXlCLElBQUlDLElBQUosRUFBRCxDQUFXQyxPQUFYLEVBQXhCO0FBQ0EsUUFBSUMsVUFBVSxHQUFHLGlDQUFqQjtBQUNBakQsSUFBQUEsV0FBVyxDQUFDa0QsTUFBWixDQUFtQk4sZUFBZSxHQUFHLHdCQUFyQyxJQUFpRTtBQUMvRE8sTUFBQUEsTUFBTSxFQUFFLFlBQVc7QUFBQyxlQUFPRixVQUFQO0FBQWtCLE9BRHlCO0FBRS9ERyxNQUFBQSxJQUFJLEVBQUUsWUFBVztBQUFDLGVBQU9ILFVBQVUsQ0FBQ3JDLE1BQWxCO0FBQXlCO0FBRm9CLEtBQWpFO0FBS0FSLElBQUFBLElBQUksQ0FBQ0YsT0FBRCxFQUFTLHNCQUFzQjBDLGVBQS9CLENBQUo7QUFDQXhDLElBQUFBLElBQUksQ0FBQ0YsT0FBRCxFQUFTLHdCQUF3QkQsSUFBSSxDQUFDb0QsWUFBdEMsQ0FBSjtBQUNBakQsSUFBQUEsSUFBSSxDQUFDRixPQUFELEVBQVMsY0FBYzJDLE9BQXZCLENBQUo7O0FBRUEsUUFBSUQsZUFBZSxJQUFJM0MsSUFBSSxDQUFDb0QsWUFBeEIsSUFBd0NSLE9BQTVDLEVBQXFEO0FBQ25ENUMsTUFBQUEsSUFBSSxDQUFDcUQsT0FBTCxHQUFlLElBQWY7QUFDQSxVQUFJQyxTQUFTLEdBQUdqQixNQUFNLENBQUNrQixPQUFQLENBQWVDLE9BQU8sQ0FBQ2pELEdBQVIsRUFBZixFQUE4QixFQUE5QixDQUFoQjs7QUFDQSxVQUFJK0MsU0FBUyxDQUFDRyxJQUFWLE1BQW9CLEVBQXhCLEVBQTRCO0FBQUNILFFBQUFBLFNBQVMsR0FBRyxJQUFaO0FBQWlCOztBQUM5Q25DLE1BQUFBLEdBQUcsQ0FBQ2lCLEdBQUcsR0FBRywwQkFBTixHQUFtQ2tCLFNBQXBDLENBQUg7QUFDRCxLQUxELE1BTUs7QUFDSHRELE1BQUFBLElBQUksQ0FBQ3FELE9BQUwsR0FBZSxLQUFmO0FBQ0Q7O0FBQ0RyRCxJQUFBQSxJQUFJLENBQUNvRCxZQUFMLEdBQW9CVCxlQUFwQjtBQUNELEdBOUNELENBK0NBLE9BQU0xQixDQUFOLEVBQVM7QUFDUEMsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlGLENBQVo7QUFDQWxCLElBQUFBLFdBQVcsQ0FBQ3FCLE1BQVosQ0FBbUJDLElBQW5CLENBQXdCLHVCQUF1QkosQ0FBL0M7QUFDRDtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcblxuLy8gZXhwb3J0IGZ1bmN0aW9uIGdldFZhbGlkYXRlT3B0aW9ucygpIHtcbi8vICAgcmV0dXJuIHtcbi8vICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbi8vICAgICBcInByb3BlcnRpZXNcIjoge1xuLy8gICAgICAgXCJmcmFtZXdvcmtcIjogICB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbi8vICAgICAgIFwicG9ydFwiOiAgICAgICAge1widHlwZVwiOiBbIFwiaW50ZWdlclwiIF19LFxuLy8gICAgICAgXCJlbWl0XCI6ICAgICAgICB7XCJ0eXBlXCI6IFsgXCJib29sZWFuXCIgXX0sXG4vLyAgICAgICBcImJyb3dzZXJcIjogICAgIHtcInR5cGVcIjogWyBcImJvb2xlYW5cIiBdfSxcbi8vICAgICAgIFwid2F0Y2hcIjogICAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4vLyAgICAgICBcInByb2ZpbGVcIjogICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiIF19LFxuLy8gICAgICAgXCJlbnZpcm9ubWVudFwiOiB7XCJ0eXBlXCI6IFsgXCJzdHJpbmdcIiBdfSxcbi8vICAgICAgIFwidmVyYm9zZVwiOiAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4vLyAvLyAgICAgIFwidGhlbWVcIjogICAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4vLyAvLyAgICAgIFwidG9vbGtpdFwiOiAgICAge1widHlwZVwiOiBbIFwic3RyaW5nXCIgXX0sXG4vLyAgICAgICBcInRyZWVzaGFrZVwiOiAgIHtcInR5cGVcIjogWyBcImJvb2xlYW5cIiBdfVxuLy8gLy8gICAgICBcInBhY2thZ2VzXCI6ICAgIHtcInR5cGVcIjogWyBcInN0cmluZ1wiLCBcImFycmF5XCIgXX0sXG5cbi8vICAgICB9LFxuLy8gICAgIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjogZmFsc2Vcbi8vICAgICAvLyBcImVycm9yTWVzc2FnZVwiOiB7XG4vLyAgICAgLy8gICBcIm9wdGlvblwiOiBcInNob3VsZCBiZSB7Qm9vbGVhbn0gKGh0dHBzOi9naXRodWIuY29tL29yZy9yZXBvI2FuY2hvcilcIlxuLy8gICAgIC8vIH1cbi8vICAgfVxuLy8gfVxuXG4vLyBleHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdE9wdGlvbnMoKSB7XG4vLyAgIHJldHVybiB7XG4vLyAgICAgcG9ydDogMTk2Mixcbi8vICAgICBlbWl0OiB0cnVlLFxuLy8gICAgIGJyb3dzZXI6IHRydWUsXG4vLyAgICAgd2F0Y2g6ICd5ZXMnLFxuLy8gICAgIHByb2ZpbGU6ICdkZXNrdG9wJywgXG4vLyAgICAgZW52aXJvbm1lbnQ6ICdkZXZlbG9wbWVudCcsIFxuLy8gICAgIHZlcmJvc2U6ICdubydcbi8vICAgfVxuLy8gfVxuXG4vLyBleHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdFZhcnMoKSB7XG4vLyAgIHJldHVybiB7XG4vLyAgICAgd2F0Y2hTdGFydGVkIDogZmFsc2UsXG4vLyAgICAgZmlyc3RUaW1lIDogdHJ1ZSxcbi8vICAgICBicm93c2VyQ291bnQgOiAwLFxuLy8gICAgIGN3ZDogcHJvY2Vzcy5jd2QoKSxcbi8vICAgICBleHRQYXRoOiAnLicsXG4vLyAgICAgcGx1Z2luRXJyb3JzOiBbXSxcbi8vICAgICBsYXN0TnVtRmlsZXM6IDAsXG4vLyAgICAgbGFzdE1pbGxpc2Vjb25kczogMCxcbi8vICAgICBsYXN0TWlsbGlzZWNvbmRzQXBwSnNvbjogMCxcbi8vICAgICBmaWxlczogWycuL2FwcC5qc29uJ10sXG4vLyAgICAgZGlyczogWycuL2FwcCcsJy4vcGFja2FnZXMnXVxuLy8gICB9XG4vLyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBfYWZ0ZXJDb21waWxlKGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKSB7XG4gIHRyeSB7XG4gICAgcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndihvcHRpb25zLCdGVU5DVElPTiBleHQtYWZ0ZXItY29tcGlsZScpXG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgIGxldCB7IGZpbGVzLCBkaXJzIH0gPSB2YXJzXG4gICAgY29uc3QgeyBjd2QgfSA9IHZhcnNcbiAgICBmaWxlcyA9IHR5cGVvZiBmaWxlcyA9PT0gJ3N0cmluZycgPyBbZmlsZXNdIDogZmlsZXNcbiAgICBkaXJzID0gdHlwZW9mIGRpcnMgPT09ICdzdHJpbmcnID8gW2RpcnNdIDogZGlyc1xuICAgIGNvbnN0IHtcbiAgICAgIGZpbGVEZXBlbmRlbmNpZXMsXG4gICAgICBjb250ZXh0RGVwZW5kZW5jaWVzLFxuICAgIH0gPSBfZ2V0RmlsZUFuZENvbnRleHREZXBzKGNvbXBpbGF0aW9uLCBmaWxlcywgZGlycywgY3dkLCBvcHRpb25zKTtcbiAgICBpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgZmlsZURlcGVuZGVuY2llcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICAgIGNvbXBpbGF0aW9uLmZpbGVEZXBlbmRlbmNpZXMuYWRkKHBhdGgucmVzb2x2ZShmaWxlKSk7XG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAoZGlycy5sZW5ndGggPiAwKSB7XG4gICAgICBjb250ZXh0RGVwZW5kZW5jaWVzLmZvckVhY2goKGNvbnRleHQpID0+IHtcbiAgICAgICAgY29tcGlsYXRpb24uY29udGV4dERlcGVuZGVuY2llcy5hZGQoY29udGV4dCk7XG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX2FmdGVyQ29tcGlsZTogJyArIGUpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2dldEZpbGVBbmRDb250ZXh0RGVwcyhjb21waWxhdGlvbiwgZmlsZXMsIGRpcnMsIGN3ZCwgb3B0aW9ucykge1xuICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIF9nZXRGaWxlQW5kQ29udGV4dERlcHMnKVxuICBjb25zdCB1bmlxID0gcmVxdWlyZSgnbG9kYXNoLnVuaXEnKVxuICBjb25zdCBpc0dsb2IgPSByZXF1aXJlKCdpcy1nbG9iJylcblxuICBjb25zdCB7IGZpbGVEZXBlbmRlbmNpZXMsIGNvbnRleHREZXBlbmRlbmNpZXMgfSA9IGNvbXBpbGF0aW9uO1xuICBjb25zdCBpc1dlYnBhY2s0ID0gY29tcGlsYXRpb24uaG9va3M7XG4gIGxldCBmZHMgPSBpc1dlYnBhY2s0ID8gWy4uLmZpbGVEZXBlbmRlbmNpZXNdIDogZmlsZURlcGVuZGVuY2llcztcbiAgbGV0IGNkcyA9IGlzV2VicGFjazQgPyBbLi4uY29udGV4dERlcGVuZGVuY2llc10gOiBjb250ZXh0RGVwZW5kZW5jaWVzO1xuICBpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuICAgIGZpbGVzLmZvckVhY2goKHBhdHRlcm4pID0+IHtcbiAgICAgIGxldCBmID0gcGF0dGVyblxuICAgICAgaWYgKGlzR2xvYihwYXR0ZXJuKSkge1xuICAgICAgICBmID0gZ2xvYi5zeW5jKHBhdHRlcm4sIHsgY3dkLCBkb3Q6IHRydWUsIGFic29sdXRlOiB0cnVlIH0pXG4gICAgICB9XG4gICAgICBmZHMgPSBmZHMuY29uY2F0KGYpXG4gICAgfSlcbiAgICBmZHMgPSB1bmlxKGZkcylcbiAgfVxuICBpZiAoZGlycy5sZW5ndGggPiAwKSB7XG4gICAgY2RzID0gdW5pcShjZHMuY29uY2F0KGRpcnMpKVxuICB9XG4gIHJldHVybiB7IGZpbGVEZXBlbmRlbmNpZXM6IGZkcywgY29udGV4dERlcGVuZGVuY2llczogY2RzIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXQsIGNvbXBpbGF0aW9uKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXG4gICAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgICBsb2d2KG9wdGlvbnMsJ19wcmVwYXJlRm9yQnVpbGQnKVxuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuICAgIGNvbnN0IHJlY3Vyc2l2ZVJlYWRTeW5jID0gcmVxdWlyZSgncmVjdXJzaXZlLXJlYWRkaXItc3luYycpXG4gICAgdmFyIHdhdGNoZWRGaWxlcz1bXVxuICAgIHRyeSB7d2F0Y2hlZEZpbGVzID0gcmVjdXJzaXZlUmVhZFN5bmMoJy4vYXBwJykuY29uY2F0KHJlY3Vyc2l2ZVJlYWRTeW5jKCcuL3BhY2thZ2VzJykpfVxuICAgIGNhdGNoKGVycikge2lmKGVyci5lcnJubyA9PT0gMzQpe2NvbnNvbGUubG9nKCdQYXRoIGRvZXMgbm90IGV4aXN0Jyk7fSBlbHNlIHt0aHJvdyBlcnI7fX1cbiAgICB2YXIgY3VycmVudE51bUZpbGVzID0gd2F0Y2hlZEZpbGVzLmxlbmd0aFxuICAgIGxvZ3Yob3B0aW9ucywnd2F0Y2hlZEZpbGVzOiAnICsgY3VycmVudE51bUZpbGVzKVxuICAgIHZhciBkb0J1aWxkID0gdHJ1ZVxuXG4gICAgLy8gdmFyIGRvQnVpbGQgPSBmYWxzZVxuICAgIC8vIGZvciAodmFyIGZpbGUgaW4gd2F0Y2hlZEZpbGVzKSB7XG4gICAgLy8gICBpZiAodmFycy5sYXN0TWlsbGlzZWNvbmRzIDwgZnMuc3RhdFN5bmMod2F0Y2hlZEZpbGVzW2ZpbGVdKS5tdGltZU1zKSB7XG4gICAgLy8gICAgIGlmICh3YXRjaGVkRmlsZXNbZmlsZV0uaW5kZXhPZihcInNjc3NcIikgIT0gLTEpIHtkb0J1aWxkPXRydWU7YnJlYWs7fVxuICAgIC8vICAgfVxuICAgIC8vIH1cbiAgICAvLyBpZiAodmFycy5sYXN0TWlsbGlzZWNvbmRzIDwgZnMuc3RhdFN5bmMoJy4vYXBwLmpzb24nKS5tdGltZU1zKSB7XG4gICAgLy8gICBkb0J1aWxkPXRydWVcbiAgICAvLyB9XG4gICAgXG4gICAgbG9ndihvcHRpb25zLCdkb0J1aWxkOiAnICsgZG9CdWlsZClcblxuICAgIHZhcnMubGFzdE1pbGxpc2Vjb25kcyA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpXG4gICAgdmFyIGZpbGVzb3VyY2UgPSAndGhpcyBmaWxlIGVuYWJsZXMgY2xpZW50IHJlbG9hZCdcbiAgICBjb21waWxhdGlvbi5hc3NldHNbY3VycmVudE51bUZpbGVzICsgJ0ZpbGVzVW5kZXJBcHBGb2xkZXIubWQnXSA9IHtcbiAgICAgIHNvdXJjZTogZnVuY3Rpb24oKSB7cmV0dXJuIGZpbGVzb3VyY2V9LFxuICAgICAgc2l6ZTogZnVuY3Rpb24oKSB7cmV0dXJuIGZpbGVzb3VyY2UubGVuZ3RofVxuICAgIH1cblxuICAgIGxvZ3Yob3B0aW9ucywnY3VycmVudE51bUZpbGVzOiAnICsgY3VycmVudE51bUZpbGVzKVxuICAgIGxvZ3Yob3B0aW9ucywndmFycy5sYXN0TnVtRmlsZXM6ICcgKyB2YXJzLmxhc3ROdW1GaWxlcylcbiAgICBsb2d2KG9wdGlvbnMsJ2RvQnVpbGQ6ICcgKyBkb0J1aWxkKVxuXG4gICAgaWYgKGN1cnJlbnROdW1GaWxlcyAhPSB2YXJzLmxhc3ROdW1GaWxlcyB8fCBkb0J1aWxkKSB7XG4gICAgICB2YXJzLnJlYnVpbGQgPSB0cnVlXG4gICAgICB2YXIgYnVuZGxlRGlyID0gb3V0cHV0LnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJycpXG4gICAgICBpZiAoYnVuZGxlRGlyLnRyaW0oKSA9PSAnJykge2J1bmRsZURpciA9ICcuLyd9XG4gICAgICBsb2coYXBwICsgJ0J1aWxkaW5nIEV4dCBidW5kbGUgYXQ6ICcgKyBidW5kbGVEaXIpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFycy5yZWJ1aWxkID0gZmFsc2VcbiAgICB9XG4gICAgdmFycy5sYXN0TnVtRmlsZXMgPSBjdXJyZW50TnVtRmlsZXNcbiAgfVxuICBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgICBjb21waWxhdGlvbi5lcnJvcnMucHVzaCgnX3ByZXBhcmVGb3JCdWlsZDogJyArIGUpXG4gIH1cbn1cbiJdfQ==