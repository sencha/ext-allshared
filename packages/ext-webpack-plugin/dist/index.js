'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require('@babel/polyfill');

const v = require('./pluginUtil').logv;

class ExtWebpackPlugin {
  constructor(options) {
    this.plugin = require(`./pluginUtil`)._constructor(options);
  }

  apply(compiler) {
    const vars = this.plugin.vars;
    const options = this.plugin.options;

    if (!compiler.hooks) {
      console.log('not webpack 4');
      return;
    }

    compiler.hooks.thisCompilation.tap(`ext-this-compilation`, compilation => {
      require(`./pluginUtil`)._thisCompilation(compiler, compilation, vars, options);

      if (vars.pluginErrors.length > 0) {
        compilation.errors.push(new Error(vars.pluginErrors.join("")));
        return;
      }
    });
    compiler.hooks.compilation.tap(`ext-compilation`, compilation => {
      require(`./pluginUtil`)._compilation(compiler, compilation, vars, options);
    }); // var emit = options.emit
    // var treeshake = options.treeshake
    // var framework = options.framework
    // var environment =  options.environment
    // if (options.emit) {
    //   if ((environment == 'production' && treeshake == true  && framework == 'angular') ||
    //       (environment != 'production' && treeshake == false && framework == 'angular') ||
    //       (framework == 'react') ||
    //       (framework == 'components')
    //   ) {
    //     require(`./pluginUtil`)._emit(compiler, compilation, vars, options, callback)
    //   }
    //   else {
    //     logv(options,'NOT running emit')
    //   }
    // }
    // else {
    //   logv(options,'emit is false')
    // }

    compiler.hooks.emit.tapAsync(`ext-emit`, (compilation, callback) => {
      require(`./pluginUtil`)._emit(compiler, compilation, vars, options, callback);
    });
    compiler.hooks.afterCompile.tap('ext-after-compile', compilation => {
      require(`./pluginUtil`)._afterCompile(compiler, compilation, vars, options);
    });
    compiler.hooks.done.tap(`ext-done`, () => {
      require(`./pluginUtil`)._done(vars, options);

      require('./pluginUtil').log(vars.app + `Completed ext-webpack-plugin processing`);
    });
  }

}

exports.default = ExtWebpackPlugin;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwidiIsImxvZ3YiLCJFeHRXZWJwYWNrUGx1Z2luIiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwicGx1Z2luIiwiX2NvbnN0cnVjdG9yIiwiYXBwbHkiLCJjb21waWxlciIsInZhcnMiLCJob29rcyIsImNvbnNvbGUiLCJsb2ciLCJ0aGlzQ29tcGlsYXRpb24iLCJ0YXAiLCJjb21waWxhdGlvbiIsIl90aGlzQ29tcGlsYXRpb24iLCJwbHVnaW5FcnJvcnMiLCJsZW5ndGgiLCJlcnJvcnMiLCJwdXNoIiwiRXJyb3IiLCJqb2luIiwiX2NvbXBpbGF0aW9uIiwiZW1pdCIsInRhcEFzeW5jIiwiY2FsbGJhY2siLCJfZW1pdCIsImFmdGVyQ29tcGlsZSIsIl9hZnRlckNvbXBpbGUiLCJkb25lIiwiX2RvbmUiLCJhcHAiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FBQ0FBLE9BQU8sQ0FBQyxpQkFBRCxDQUFQOztBQUNBLE1BQU1DLENBQUMsR0FBR0QsT0FBTyxDQUFDLGNBQUQsQ0FBUCxDQUF3QkUsSUFBbEM7O0FBQ2UsTUFBTUMsZ0JBQU4sQ0FBdUI7QUFFcENDLEVBQUFBLFdBQVcsQ0FBQ0MsT0FBRCxFQUFVO0FBQ25CLFNBQUtDLE1BQUwsR0FBY04sT0FBTyxDQUFFLGNBQUYsQ0FBUCxDQUF3Qk8sWUFBeEIsQ0FBcUNGLE9BQXJDLENBQWQ7QUFDRDs7QUFFREcsRUFBQUEsS0FBSyxDQUFDQyxRQUFELEVBQVc7QUFDZCxVQUFNQyxJQUFJLEdBQUcsS0FBS0osTUFBTCxDQUFZSSxJQUF6QjtBQUNBLFVBQU1MLE9BQU8sR0FBRyxLQUFLQyxNQUFMLENBQVlELE9BQTVCOztBQUNBLFFBQUksQ0FBQ0ksUUFBUSxDQUFDRSxLQUFkLEVBQXFCO0FBQUNDLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGVBQVo7QUFBNkI7QUFBTzs7QUFFMURKLElBQUFBLFFBQVEsQ0FBQ0UsS0FBVCxDQUFlRyxlQUFmLENBQStCQyxHQUEvQixDQUFvQyxzQkFBcEMsRUFBNERDLFdBQUQsSUFBaUI7QUFDMUVoQixNQUFBQSxPQUFPLENBQUUsY0FBRixDQUFQLENBQXdCaUIsZ0JBQXhCLENBQXlDUixRQUF6QyxFQUFtRE8sV0FBbkQsRUFBZ0VOLElBQWhFLEVBQXNFTCxPQUF0RTs7QUFDQSxVQUFJSyxJQUFJLENBQUNRLFlBQUwsQ0FBa0JDLE1BQWxCLEdBQTJCLENBQS9CLEVBQWtDO0FBQ2hDSCxRQUFBQSxXQUFXLENBQUNJLE1BQVosQ0FBbUJDLElBQW5CLENBQXlCLElBQUlDLEtBQUosQ0FBVVosSUFBSSxDQUFDUSxZQUFMLENBQWtCSyxJQUFsQixDQUF1QixFQUF2QixDQUFWLENBQXpCO0FBQ0E7QUFDRDtBQUNGLEtBTkQ7QUFRQWQsSUFBQUEsUUFBUSxDQUFDRSxLQUFULENBQWVLLFdBQWYsQ0FBMkJELEdBQTNCLENBQWdDLGlCQUFoQyxFQUFtREMsV0FBRCxJQUFpQjtBQUNqRWhCLE1BQUFBLE9BQU8sQ0FBRSxjQUFGLENBQVAsQ0FBd0J3QixZQUF4QixDQUFxQ2YsUUFBckMsRUFBK0NPLFdBQS9DLEVBQTRETixJQUE1RCxFQUFrRUwsT0FBbEU7QUFDRCxLQUZELEVBYmMsQ0FpQmQ7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBSUFJLElBQUFBLFFBQVEsQ0FBQ0UsS0FBVCxDQUFlYyxJQUFmLENBQW9CQyxRQUFwQixDQUE4QixVQUE5QixFQUF5QyxDQUFDVixXQUFELEVBQWNXLFFBQWQsS0FBMkI7QUFDbEUzQixNQUFBQSxPQUFPLENBQUUsY0FBRixDQUFQLENBQXdCNEIsS0FBeEIsQ0FBOEJuQixRQUE5QixFQUF3Q08sV0FBeEMsRUFBcUROLElBQXJELEVBQTJETCxPQUEzRCxFQUFvRXNCLFFBQXBFO0FBQ0QsS0FGRDtBQUlBbEIsSUFBQUEsUUFBUSxDQUFDRSxLQUFULENBQWVrQixZQUFmLENBQTRCZCxHQUE1QixDQUFnQyxtQkFBaEMsRUFBc0RDLFdBQUQsSUFBaUI7QUFDcEVoQixNQUFBQSxPQUFPLENBQUUsY0FBRixDQUFQLENBQXdCOEIsYUFBeEIsQ0FBc0NyQixRQUF0QyxFQUFnRE8sV0FBaEQsRUFBNkROLElBQTdELEVBQW1FTCxPQUFuRTtBQUNELEtBRkQ7QUFJQUksSUFBQUEsUUFBUSxDQUFDRSxLQUFULENBQWVvQixJQUFmLENBQW9CaEIsR0FBcEIsQ0FBeUIsVUFBekIsRUFBb0MsTUFBTTtBQUN4Q2YsTUFBQUEsT0FBTyxDQUFFLGNBQUYsQ0FBUCxDQUF3QmdDLEtBQXhCLENBQThCdEIsSUFBOUIsRUFBb0NMLE9BQXBDOztBQUNBTCxNQUFBQSxPQUFPLENBQUMsY0FBRCxDQUFQLENBQXdCYSxHQUF4QixDQUE0QkgsSUFBSSxDQUFDdUIsR0FBTCxHQUFZLHlDQUF4QztBQUNELEtBSEQ7QUFJRDs7QUEzRG1DIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5yZXF1aXJlKCdAYmFiZWwvcG9seWZpbGwnKVxuY29uc3QgdiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4dFdlYnBhY2tQbHVnaW4ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLnBsdWdpbiA9IHJlcXVpcmUoYC4vcGx1Z2luVXRpbGApLl9jb25zdHJ1Y3RvcihvcHRpb25zKVxuICB9XG5cbiAgYXBwbHkoY29tcGlsZXIpIHtcbiAgICBjb25zdCB2YXJzID0gdGhpcy5wbHVnaW4udmFyc1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnBsdWdpbi5vcHRpb25zXG4gICAgaWYgKCFjb21waWxlci5ob29rcykge2NvbnNvbGUubG9nKCdub3Qgd2VicGFjayA0Jyk7cmV0dXJufVxuXG4gICAgY29tcGlsZXIuaG9va3MudGhpc0NvbXBpbGF0aW9uLnRhcChgZXh0LXRoaXMtY29tcGlsYXRpb25gLCAoY29tcGlsYXRpb24pID0+IHtcbiAgICAgIHJlcXVpcmUoYC4vcGx1Z2luVXRpbGApLl90aGlzQ29tcGlsYXRpb24oY29tcGlsZXIsIGNvbXBpbGF0aW9uLCB2YXJzLCBvcHRpb25zKVxuICAgICAgaWYgKHZhcnMucGx1Z2luRXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29tcGlsYXRpb24uZXJyb3JzLnB1c2goIG5ldyBFcnJvcih2YXJzLnBsdWdpbkVycm9ycy5qb2luKFwiXCIpKSApXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjb21waWxlci5ob29rcy5jb21waWxhdGlvbi50YXAoYGV4dC1jb21waWxhdGlvbmAsIChjb21waWxhdGlvbikgPT4ge1xuICAgICAgcmVxdWlyZShgLi9wbHVnaW5VdGlsYCkuX2NvbXBpbGF0aW9uKGNvbXBpbGVyLCBjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucylcbiAgICB9KVxuXG4gICAgLy8gdmFyIGVtaXQgPSBvcHRpb25zLmVtaXRcbiAgICAvLyB2YXIgdHJlZXNoYWtlID0gb3B0aW9ucy50cmVlc2hha2VcbiAgICAvLyB2YXIgZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmtcbiAgICAvLyB2YXIgZW52aXJvbm1lbnQgPSAgb3B0aW9ucy5lbnZpcm9ubWVudFxuXG5cbiAgICAvLyBpZiAob3B0aW9ucy5lbWl0KSB7XG4gICAgLy8gICBpZiAoKGVudmlyb25tZW50ID09ICdwcm9kdWN0aW9uJyAmJiB0cmVlc2hha2UgPT0gdHJ1ZSAgJiYgZnJhbWV3b3JrID09ICdhbmd1bGFyJykgfHxcbiAgICAvLyAgICAgICAoZW52aXJvbm1lbnQgIT0gJ3Byb2R1Y3Rpb24nICYmIHRyZWVzaGFrZSA9PSBmYWxzZSAmJiBmcmFtZXdvcmsgPT0gJ2FuZ3VsYXInKSB8fFxuICAgIC8vICAgICAgIChmcmFtZXdvcmsgPT0gJ3JlYWN0JykgfHxcbiAgICAvLyAgICAgICAoZnJhbWV3b3JrID09ICdjb21wb25lbnRzJylcbiAgICAvLyAgICkge1xuICAgIC8vICAgICByZXF1aXJlKGAuL3BsdWdpblV0aWxgKS5fZW1pdChjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMsIGNhbGxiYWNrKVxuICAgIC8vICAgfVxuICAgIC8vICAgZWxzZSB7XG4gICAgLy8gICAgIGxvZ3Yob3B0aW9ucywnTk9UIHJ1bm5pbmcgZW1pdCcpXG4gICAgLy8gICB9XG4gICAgLy8gfVxuICAgIC8vIGVsc2Uge1xuICAgIC8vICAgbG9ndihvcHRpb25zLCdlbWl0IGlzIGZhbHNlJylcbiAgICAvLyB9XG5cblxuXG4gICAgY29tcGlsZXIuaG9va3MuZW1pdC50YXBBc3luYyhgZXh0LWVtaXRgLCAoY29tcGlsYXRpb24sIGNhbGxiYWNrKSA9PiB7XG4gICAgICByZXF1aXJlKGAuL3BsdWdpblV0aWxgKS5fZW1pdChjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMsIGNhbGxiYWNrKVxuICAgIH0pXG5cbiAgICBjb21waWxlci5ob29rcy5hZnRlckNvbXBpbGUudGFwKCdleHQtYWZ0ZXItY29tcGlsZScsIChjb21waWxhdGlvbikgPT4ge1xuICAgICAgcmVxdWlyZShgLi9wbHVnaW5VdGlsYCkuX2FmdGVyQ29tcGlsZShjb21waWxlciwgY29tcGlsYXRpb24sIHZhcnMsIG9wdGlvbnMpXG4gICAgfSlcblxuICAgIGNvbXBpbGVyLmhvb2tzLmRvbmUudGFwKGBleHQtZG9uZWAsICgpID0+IHtcbiAgICAgIHJlcXVpcmUoYC4vcGx1Z2luVXRpbGApLl9kb25lKHZhcnMsIG9wdGlvbnMpXG4gICAgICByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2codmFycy5hcHAgKyBgQ29tcGxldGVkIGV4dC13ZWJwYWNrLXBsdWdpbiBwcm9jZXNzaW5nYClcbiAgICB9KVxuICB9XG59XG4iXX0=