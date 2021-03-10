"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAppJson = createAppJson;
exports.createJSDOMEnvironment = createJSDOMEnvironment;
exports.createWorkspaceJson = createWorkspaceJson;
exports.extAngularModule = exports.buildXML = void 0;

const buildXML = function (compress, options, output) {
  const logv = require('./pluginUtil').logv;

  logv(options, 'FUNCTION buildXML');
  let compression = '';

  if (compress) {
    compression = `
      then 
      fs 
      minify 
        -yui 
        -from=ext.js 
        -to=ext.js
    `;
  }

  return `<project name="simple-build" basedir=".">
  <!--  internally, watch calls the init target, so need to have one here -->
  <target name="init"/>
  <target name="init-cmd">
    <taskdef  resource="com/sencha/ant/antlib.xml"
              classpath="\${cmd.dir}/sencha.jar"
              loaderref="senchaloader"/>
    <x-extend-classpath>
        <jar path="\${cmd.dir}/sencha.jar"/>
    </x-extend-classpath>
    <x-sencha-init prefix=""/>
    <x-compile refid="theCompiler"
                      dir="\${basedir}"
                      initOnly="true"
                      inheritAll="true">
              <![CDATA[
              -classpath=\${basedir}/manifest.js
              load-app
                  -temp=\${basedir}/temp
                  -tag=App
        ]]>
      </x-compile>
  </target>
  <target name="rebuild">
    <x-compile refid="theCompiler"
              dir="\${basedir}"
              inheritAll="true">
      <![CDATA[
      --debug
      exclude
      -all
      and
      include
      -f=Boot.js
      and
      concatenate
          ext.js
      and
      exclude
      -all
      and
      # include theme overrides
      include
        -r
        -tag=overrides
      and
      # include all js files needed for manifest.js
      include
          -r
          -f=manifest.js
      and
      # exclude the generated manifest file itself,
      # since we don't want the generated bundle file to create any components
      exclude
      -f=manifest.js
      and
      concatenate
      +append
          ext.js
      and
      scss
          -appName=App
          -imageSearchPath=resources
          -themeName=triton
          -resourceMapBase=.
          -output=ext.scss
      and
      resources
          -excludes=-all*.css
          -out=resources
      and
      resources
          -model=true
          -out=resources
      ]]>
    </x-compile>
  </target>
  <target name="build" depends="init-cmd,rebuild">
    <x-sencha-command dir="\${basedir}">
      <![CDATA[
      fashion
          -pwd=.
          -split=4095
          ${compress ? '-compress' : ''}
              ext.scss
          ext.css
      ${compression}
      ]]>
    </x-sencha-command>
  </target>
  <target name="watch" depends="init-cmd,build">
    <x-fashion-watch
      refName="fashion-watch"
      inputFile="ext.scss"
      outputFile="ext.css"
      split="4095"
      compress="${compress ? 'true' : 'false'}"
      configFile="app.json"
      fork="true"/>
    <x-watch compilerRef="theCompiler" targets="rebuild"/>
  </target>
</project>
`.trim();
};

exports.buildXML = buildXML;

function createAppJson(theme, packages, toolkit, options, output) {
  const logv = require('./pluginUtil').logv;

  logv(options, 'FUNCTION createAppJson');

  const fs = require('fs');

  var isWindows = typeof process != 'undefined' && typeof process.platform != 'undefined' && !!process.platform.match(/^win/);
  var pathDifference = output.substring(process.cwd().length);
  var numberOfPaths = pathDifference.split(isWindows ? "\\" : "/").length - 1;
  var nodeModulePath = '';

  for (var i = 0; i < numberOfPaths; i++) {
    nodeModulePath += "../";
  }

  const config = {
    framework: "ext",
    toolkit,
    requires: packages,
    "overrides": ["overrides", "jsdom-environment.js"],
    // "language": {
    //   "js": {
    //     "output": "ES5"
    //   }
    // },
    "packages": {
      "dir": [nodeModulePath + "node_modules/@sencha", nodeModulePath + toolkit + "/packages"]
    },
    output: {
      base: '.',
      resources: {
        path: './resources',
        shared: "./resources"
      }
    }
  }; // if theme is local add it as an additional package dir

  if (fs.existsSync(theme)) {
    const path = require('path');

    const cjson = require('cjson');

    const packageInfo = cjson.load(path.join(theme, 'package.json'));
    config.theme = packageInfo.name;
    config.packages.dir.push(path.resolve(theme));
  } else {
    config.theme = theme;
  }

  return JSON.stringify(config, null, 2);
}

function createJSDOMEnvironment(options, output) {
  const logv = require('./pluginUtil').logv;

  logv(options, 'FUNCTION createJSDOMEnvironment');
  return 'window.Ext = Ext;';
}

function createWorkspaceJson(options, output) {
  const logv = require('./pluginUtil').logv;

  logv(options, 'FUNCTION createWorkspaceJson');
  var isWindows = typeof process != 'undefined' && typeof process.platform != 'undefined' && !!process.platform.match(/^win/);
  var pathDifference = output.substring(process.cwd().length);
  var numberOfPaths = pathDifference.split(isWindows ? "\\" : "/").length - 1;
  var nodeModulePath = '';

  for (var i = 0; i < numberOfPaths; i++) {
    nodeModulePath += "../";
  }

  logv(options, 'isWindows: ' + isWindows);
  logv(options, 'output: ' + output);
  logv(options, 'pathDifference: ' + pathDifference);
  logv(options, 'numberOfPaths: ' + numberOfPaths);
  logv(options, 'nodeModulePath: ' + nodeModulePath);
  const config = {
    "frameworks": {
      "ext": nodeModulePath + "node_modules/@sencha/ext"
    },
    "build": {
      "dir": "${workspace.dir}/" + nodeModulePath + "build"
    },
    "packages": {
      "dir": ["${workspace.dir}/" + nodeModulePath + "ext-" + options.framework + "/packages/local", "${workspace.dir}/" + nodeModulePath + "ext-" + options.framework + "/packages", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-font-ios", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-${toolkit.name}-theme-base", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-${toolkit.name}-theme-base", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-${toolkit.name}-theme-ios", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-${toolkit.name}-theme-material", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-${toolkit.name}-theme-aria", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-${toolkit.name}-theme-neutral", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-${toolkit.name}-theme-classic", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-${toolkit.name}-theme-gray", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-${toolkit.name}-theme-crisp", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-${toolkit.name}-theme-crisp-touch", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-${toolkit.name}-theme-neptune", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-${toolkit.name}-theme-neptune-touch", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-${toolkit.name}-theme-triton", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-${toolkit.name}-theme-graphite", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-react-renderercell", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-web-components-renderercell", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-calendar", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-charts", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-d3", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-exporter", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-pivot", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-pivot-d3", "${workspace.dir}/" + nodeModulePath + "node_modules/@sencha/ext-ux"],
      "extract": "${workspace.dir}/" + nodeModulePath + "packages/remote"
    }
  };
  return JSON.stringify(config, null, 2);
}

const extAngularModule = function (imports, exports, declarations) {
  return `
  import { NgModule } from '@angular/core';
  ${imports}
  @NgModule({
    imports: [
    ],
    declarations: [
  ${declarations}  ],
    exports: [
  ${exports}  ]
  })
  export class ExtAngularModule { }
  `;
};

exports.extAngularModule = extAngularModule;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcnRpZmFjdHMuanMiXSwibmFtZXMiOlsiYnVpbGRYTUwiLCJjb21wcmVzcyIsIm9wdGlvbnMiLCJvdXRwdXQiLCJsb2d2IiwicmVxdWlyZSIsImNvbXByZXNzaW9uIiwidHJpbSIsImNyZWF0ZUFwcEpzb24iLCJ0aGVtZSIsInBhY2thZ2VzIiwidG9vbGtpdCIsImZzIiwiaXNXaW5kb3dzIiwicHJvY2VzcyIsInBsYXRmb3JtIiwibWF0Y2giLCJwYXRoRGlmZmVyZW5jZSIsInN1YnN0cmluZyIsImN3ZCIsImxlbmd0aCIsIm51bWJlck9mUGF0aHMiLCJzcGxpdCIsIm5vZGVNb2R1bGVQYXRoIiwiaSIsImNvbmZpZyIsImZyYW1ld29yayIsInJlcXVpcmVzIiwiYmFzZSIsInJlc291cmNlcyIsInBhdGgiLCJzaGFyZWQiLCJleGlzdHNTeW5jIiwiY2pzb24iLCJwYWNrYWdlSW5mbyIsImxvYWQiLCJqb2luIiwibmFtZSIsImRpciIsInB1c2giLCJyZXNvbHZlIiwiSlNPTiIsInN0cmluZ2lmeSIsImNyZWF0ZUpTRE9NRW52aXJvbm1lbnQiLCJjcmVhdGVXb3Jrc3BhY2VKc29uIiwiZXh0QW5ndWxhck1vZHVsZSIsImltcG9ydHMiLCJleHBvcnRzIiwiZGVjbGFyYXRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQU8sTUFBTUEsUUFBUSxHQUFHLFVBQVNDLFFBQVQsRUFBbUJDLE9BQW5CLEVBQTRCQyxNQUE1QixFQUFvQztBQUMxRCxRQUFNQyxJQUFJLEdBQUdDLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0JELElBQXJDOztBQUNBQSxFQUFBQSxJQUFJLENBQUNGLE9BQUQsRUFBUyxtQkFBVCxDQUFKO0FBRUEsTUFBSUksV0FBVyxHQUFHLEVBQWxCOztBQUVBLE1BQUlMLFFBQUosRUFBYztBQUNaSyxJQUFBQSxXQUFXLEdBQUk7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FQSTtBQVFEOztBQUVDLFNBQVE7QUFD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RUFBdUIsSUFBdkIsRUFBNkIsQ0FBN0IsQ0FBUDtBQUNEOztBQUVNLE1BQU1vQixnQkFBZ0IsR0FBRyxVQUFTQyxPQUFULEVBQWtCQyxPQUFsQixFQUEyQkMsWUFBM0IsRUFBeUM7QUFDdkUsU0FBUTtBQUNWO0FBQ0EsSUFBSUYsT0FBUTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSUUsWUFBYTtBQUNqQjtBQUNBLElBQUlELE9BQVE7QUFDWjtBQUNBO0FBQ0EsR0FaRTtBQWFELENBZE0iLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgYnVpbGRYTUwgPSBmdW5jdGlvbihjb21wcmVzcywgb3B0aW9ucywgb3V0cHV0KSB7XHJcbiAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcclxuICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIGJ1aWxkWE1MJylcclxuICBcclxuICBsZXQgY29tcHJlc3Npb24gPSAnJ1xyXG5cclxuICBpZiAoY29tcHJlc3MpIHtcclxuICAgIGNvbXByZXNzaW9uID0gYFxyXG4gICAgICB0aGVuIFxyXG4gICAgICBmcyBcclxuICAgICAgbWluaWZ5IFxyXG4gICAgICAgIC15dWkgXHJcbiAgICAgICAgLWZyb209ZXh0LmpzIFxyXG4gICAgICAgIC10bz1leHQuanNcclxuICAgIGA7XHJcbiAgfVxyXG5cclxuICAgIHJldHVybiBgPHByb2plY3QgbmFtZT1cInNpbXBsZS1idWlsZFwiIGJhc2VkaXI9XCIuXCI+XHJcbiAgPCEtLSAgaW50ZXJuYWxseSwgd2F0Y2ggY2FsbHMgdGhlIGluaXQgdGFyZ2V0LCBzbyBuZWVkIHRvIGhhdmUgb25lIGhlcmUgLS0+XHJcbiAgPHRhcmdldCBuYW1lPVwiaW5pdFwiLz5cclxuICA8dGFyZ2V0IG5hbWU9XCJpbml0LWNtZFwiPlxyXG4gICAgPHRhc2tkZWYgIHJlc291cmNlPVwiY29tL3NlbmNoYS9hbnQvYW50bGliLnhtbFwiXHJcbiAgICAgICAgICAgICAgY2xhc3NwYXRoPVwiXFwke2NtZC5kaXJ9L3NlbmNoYS5qYXJcIlxyXG4gICAgICAgICAgICAgIGxvYWRlcnJlZj1cInNlbmNoYWxvYWRlclwiLz5cclxuICAgIDx4LWV4dGVuZC1jbGFzc3BhdGg+XHJcbiAgICAgICAgPGphciBwYXRoPVwiXFwke2NtZC5kaXJ9L3NlbmNoYS5qYXJcIi8+XHJcbiAgICA8L3gtZXh0ZW5kLWNsYXNzcGF0aD5cclxuICAgIDx4LXNlbmNoYS1pbml0IHByZWZpeD1cIlwiLz5cclxuICAgIDx4LWNvbXBpbGUgcmVmaWQ9XCJ0aGVDb21waWxlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBkaXI9XCJcXCR7YmFzZWRpcn1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgaW5pdE9ubHk9XCJ0cnVlXCJcclxuICAgICAgICAgICAgICAgICAgICAgIGluaGVyaXRBbGw9XCJ0cnVlXCI+XHJcbiAgICAgICAgICAgICAgPCFbQ0RBVEFbXHJcbiAgICAgICAgICAgICAgLWNsYXNzcGF0aD1cXCR7YmFzZWRpcn0vbWFuaWZlc3QuanNcclxuICAgICAgICAgICAgICBsb2FkLWFwcFxyXG4gICAgICAgICAgICAgICAgICAtdGVtcD1cXCR7YmFzZWRpcn0vdGVtcFxyXG4gICAgICAgICAgICAgICAgICAtdGFnPUFwcFxyXG4gICAgICAgIF1dPlxyXG4gICAgICA8L3gtY29tcGlsZT5cclxuICA8L3RhcmdldD5cclxuICA8dGFyZ2V0IG5hbWU9XCJyZWJ1aWxkXCI+XHJcbiAgICA8eC1jb21waWxlIHJlZmlkPVwidGhlQ29tcGlsZXJcIlxyXG4gICAgICAgICAgICAgIGRpcj1cIlxcJHtiYXNlZGlyfVwiXHJcbiAgICAgICAgICAgICAgaW5oZXJpdEFsbD1cInRydWVcIj5cclxuICAgICAgPCFbQ0RBVEFbXHJcbiAgICAgIC0tZGVidWdcclxuICAgICAgZXhjbHVkZVxyXG4gICAgICAtYWxsXHJcbiAgICAgIGFuZFxyXG4gICAgICBpbmNsdWRlXHJcbiAgICAgIC1mPUJvb3QuanNcclxuICAgICAgYW5kXHJcbiAgICAgIGNvbmNhdGVuYXRlXHJcbiAgICAgICAgICBleHQuanNcclxuICAgICAgYW5kXHJcbiAgICAgIGV4Y2x1ZGVcclxuICAgICAgLWFsbFxyXG4gICAgICBhbmRcclxuICAgICAgIyBpbmNsdWRlIHRoZW1lIG92ZXJyaWRlc1xyXG4gICAgICBpbmNsdWRlXHJcbiAgICAgICAgLXJcclxuICAgICAgICAtdGFnPW92ZXJyaWRlc1xyXG4gICAgICBhbmRcclxuICAgICAgIyBpbmNsdWRlIGFsbCBqcyBmaWxlcyBuZWVkZWQgZm9yIG1hbmlmZXN0LmpzXHJcbiAgICAgIGluY2x1ZGVcclxuICAgICAgICAgIC1yXHJcbiAgICAgICAgICAtZj1tYW5pZmVzdC5qc1xyXG4gICAgICBhbmRcclxuICAgICAgIyBleGNsdWRlIHRoZSBnZW5lcmF0ZWQgbWFuaWZlc3QgZmlsZSBpdHNlbGYsXHJcbiAgICAgICMgc2luY2Ugd2UgZG9uJ3Qgd2FudCB0aGUgZ2VuZXJhdGVkIGJ1bmRsZSBmaWxlIHRvIGNyZWF0ZSBhbnkgY29tcG9uZW50c1xyXG4gICAgICBleGNsdWRlXHJcbiAgICAgIC1mPW1hbmlmZXN0LmpzXHJcbiAgICAgIGFuZFxyXG4gICAgICBjb25jYXRlbmF0ZVxyXG4gICAgICArYXBwZW5kXHJcbiAgICAgICAgICBleHQuanNcclxuICAgICAgYW5kXHJcbiAgICAgIHNjc3NcclxuICAgICAgICAgIC1hcHBOYW1lPUFwcFxyXG4gICAgICAgICAgLWltYWdlU2VhcmNoUGF0aD1yZXNvdXJjZXNcclxuICAgICAgICAgIC10aGVtZU5hbWU9dHJpdG9uXHJcbiAgICAgICAgICAtcmVzb3VyY2VNYXBCYXNlPS5cclxuICAgICAgICAgIC1vdXRwdXQ9ZXh0LnNjc3NcclxuICAgICAgYW5kXHJcbiAgICAgIHJlc291cmNlc1xyXG4gICAgICAgICAgLWV4Y2x1ZGVzPS1hbGwqLmNzc1xyXG4gICAgICAgICAgLW91dD1yZXNvdXJjZXNcclxuICAgICAgYW5kXHJcbiAgICAgIHJlc291cmNlc1xyXG4gICAgICAgICAgLW1vZGVsPXRydWVcclxuICAgICAgICAgIC1vdXQ9cmVzb3VyY2VzXHJcbiAgICAgIF1dPlxyXG4gICAgPC94LWNvbXBpbGU+XHJcbiAgPC90YXJnZXQ+XHJcbiAgPHRhcmdldCBuYW1lPVwiYnVpbGRcIiBkZXBlbmRzPVwiaW5pdC1jbWQscmVidWlsZFwiPlxyXG4gICAgPHgtc2VuY2hhLWNvbW1hbmQgZGlyPVwiXFwke2Jhc2VkaXJ9XCI+XHJcbiAgICAgIDwhW0NEQVRBW1xyXG4gICAgICBmYXNoaW9uXHJcbiAgICAgICAgICAtcHdkPS5cclxuICAgICAgICAgIC1zcGxpdD00MDk1XHJcbiAgICAgICAgICAke2NvbXByZXNzID8gJy1jb21wcmVzcycgOiAnJ31cclxuICAgICAgICAgICAgICBleHQuc2Nzc1xyXG4gICAgICAgICAgZXh0LmNzc1xyXG4gICAgICAke2NvbXByZXNzaW9ufVxyXG4gICAgICBdXT5cclxuICAgIDwveC1zZW5jaGEtY29tbWFuZD5cclxuICA8L3RhcmdldD5cclxuICA8dGFyZ2V0IG5hbWU9XCJ3YXRjaFwiIGRlcGVuZHM9XCJpbml0LWNtZCxidWlsZFwiPlxyXG4gICAgPHgtZmFzaGlvbi13YXRjaFxyXG4gICAgICByZWZOYW1lPVwiZmFzaGlvbi13YXRjaFwiXHJcbiAgICAgIGlucHV0RmlsZT1cImV4dC5zY3NzXCJcclxuICAgICAgb3V0cHV0RmlsZT1cImV4dC5jc3NcIlxyXG4gICAgICBzcGxpdD1cIjQwOTVcIlxyXG4gICAgICBjb21wcmVzcz1cIiR7Y29tcHJlc3MgPyAndHJ1ZScgOiAnZmFsc2UnfVwiXHJcbiAgICAgIGNvbmZpZ0ZpbGU9XCJhcHAuanNvblwiXHJcbiAgICAgIGZvcms9XCJ0cnVlXCIvPlxyXG4gICAgPHgtd2F0Y2ggY29tcGlsZXJSZWY9XCJ0aGVDb21waWxlclwiIHRhcmdldHM9XCJyZWJ1aWxkXCIvPlxyXG4gIDwvdGFyZ2V0PlxyXG48L3Byb2plY3Q+XHJcbmAudHJpbSgpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBcHBKc29uKCB0aGVtZSwgcGFja2FnZXMsIHRvb2xraXQsIG9wdGlvbnMsIG91dHB1dCApIHtcclxuICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxyXG4gIGxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gY3JlYXRlQXBwSnNvbicpXHJcblxyXG4gIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxyXG5cclxuICB2YXIgaXNXaW5kb3dzID0gdHlwZW9mIHByb2Nlc3MgIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHByb2Nlc3MucGxhdGZvcm0gIT0gJ3VuZGVmaW5lZCcgJiYgISFwcm9jZXNzLnBsYXRmb3JtLm1hdGNoKC9ed2luLyk7XHJcbiAgdmFyIHBhdGhEaWZmZXJlbmNlID0gb3V0cHV0LnN1YnN0cmluZyhwcm9jZXNzLmN3ZCgpLmxlbmd0aClcclxuICB2YXIgbnVtYmVyT2ZQYXRocyA9IHBhdGhEaWZmZXJlbmNlLnNwbGl0KGlzV2luZG93cyA/IFwiXFxcXFwiIDogXCIvXCIpLmxlbmd0aCAtIDE7XHJcbiAgdmFyIG5vZGVNb2R1bGVQYXRoID0gJydcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bWJlck9mUGF0aHM7IGkrKykgeyBcclxuICAgIG5vZGVNb2R1bGVQYXRoICs9IFwiLi4vXCJcclxuICB9XHJcblxyXG4gIGNvbnN0IGNvbmZpZyA9IHtcclxuICAgIGZyYW1ld29yazogXCJleHRcIixcclxuICAgIHRvb2xraXQsXHJcbiAgICByZXF1aXJlczogcGFja2FnZXMsXHJcbiAgICBcIm92ZXJyaWRlc1wiOiBbXHJcbiAgICAgIFwib3ZlcnJpZGVzXCIsXHJcbiAgICAgIFwianNkb20tZW52aXJvbm1lbnQuanNcIlxyXG4gICAgXSxcclxuICAgIC8vIFwibGFuZ3VhZ2VcIjoge1xyXG4gICAgLy8gICBcImpzXCI6IHtcclxuICAgIC8vICAgICBcIm91dHB1dFwiOiBcIkVTNVwiXHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH0sXHJcbiAgICBcInBhY2thZ2VzXCI6IHtcclxuICAgICAgXCJkaXJcIjogW1xyXG4gICAgICAgIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYVwiLFxyXG4gICAgICAgIG5vZGVNb2R1bGVQYXRoICsgdG9vbGtpdCArIFwiL3BhY2thZ2VzXCJcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIG91dHB1dDoge1xyXG4gICAgICBiYXNlOiAnLicsXHJcbiAgICAgIHJlc291cmNlczoge1xyXG4gICAgICAgIHBhdGg6ICcuL3Jlc291cmNlcycsXHJcbiAgICAgICAgc2hhcmVkOiBcIi4vcmVzb3VyY2VzXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gaWYgdGhlbWUgaXMgbG9jYWwgYWRkIGl0IGFzIGFuIGFkZGl0aW9uYWwgcGFja2FnZSBkaXJcclxuICBpZiAoZnMuZXhpc3RzU3luYyh0aGVtZSkpIHtcclxuICAgICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxyXG4gICAgICBjb25zdCBjanNvbiA9IHJlcXVpcmUoJ2Nqc29uJylcclxuICAgICAgY29uc3QgcGFja2FnZUluZm8gPSBjanNvbi5sb2FkKHBhdGguam9pbih0aGVtZSwgJ3BhY2thZ2UuanNvbicpKTtcclxuICAgICAgY29uZmlnLnRoZW1lID0gcGFja2FnZUluZm8ubmFtZTtcclxuICAgICAgY29uZmlnLnBhY2thZ2VzLmRpci5wdXNoKHBhdGgucmVzb2x2ZSh0aGVtZSkpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAgIGNvbmZpZy50aGVtZSA9IHRoZW1lO1xyXG4gIH1cclxuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoY29uZmlnLCBudWxsLCAyKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSlNET01FbnZpcm9ubWVudChvcHRpb25zLCBvdXRwdXQpIHtcclxuICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxyXG4gIGxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gY3JlYXRlSlNET01FbnZpcm9ubWVudCcpXHJcblxyXG4gIHJldHVybiAnd2luZG93LkV4dCA9IEV4dDsnXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVXb3Jrc3BhY2VKc29uKG9wdGlvbnMsIG91dHB1dCkge1xyXG4gIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XHJcbiAgbG9ndihvcHRpb25zLCdGVU5DVElPTiBjcmVhdGVXb3Jrc3BhY2VKc29uJylcclxuXHJcbiAgdmFyIGlzV2luZG93cyA9IHR5cGVvZiBwcm9jZXNzICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwcm9jZXNzLnBsYXRmb3JtICE9ICd1bmRlZmluZWQnICYmICEhcHJvY2Vzcy5wbGF0Zm9ybS5tYXRjaCgvXndpbi8pO1xyXG4gIHZhciBwYXRoRGlmZmVyZW5jZSA9IG91dHB1dC5zdWJzdHJpbmcocHJvY2Vzcy5jd2QoKS5sZW5ndGgpXHJcbiAgdmFyIG51bWJlck9mUGF0aHMgPSBwYXRoRGlmZmVyZW5jZS5zcGxpdChpc1dpbmRvd3MgPyBcIlxcXFxcIiA6IFwiL1wiKS5sZW5ndGggLSAxO1xyXG4gIHZhciBub2RlTW9kdWxlUGF0aCA9ICcnXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1iZXJPZlBhdGhzOyBpKyspIHsgXHJcbiAgICBub2RlTW9kdWxlUGF0aCArPSBcIi4uL1wiXHJcbiAgfVxyXG5cclxuICBsb2d2KG9wdGlvbnMsJ2lzV2luZG93czogJyArIGlzV2luZG93cylcclxuICBsb2d2KG9wdGlvbnMsJ291dHB1dDogJyArIG91dHB1dClcclxuICBsb2d2KG9wdGlvbnMsJ3BhdGhEaWZmZXJlbmNlOiAnICsgcGF0aERpZmZlcmVuY2UpXHJcbiAgbG9ndihvcHRpb25zLCdudW1iZXJPZlBhdGhzOiAnICsgbnVtYmVyT2ZQYXRocylcclxuICBsb2d2KG9wdGlvbnMsJ25vZGVNb2R1bGVQYXRoOiAnICsgbm9kZU1vZHVsZVBhdGgpXHJcblxyXG5cclxuXHJcbiAgY29uc3QgY29uZmlnID0ge1xyXG4gICAgXCJmcmFtZXdvcmtzXCI6IHtcclxuICAgICAgXCJleHRcIjogbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dFwiXHJcbiAgICB9LFxyXG4gICAgXCJidWlsZFwiOiB7XHJcbiAgICAgIFwiZGlyXCI6IFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJidWlsZFwiXHJcbiAgICB9LFxyXG4gICAgXCJwYWNrYWdlc1wiOiB7XHJcbiAgICAgIFwiZGlyXCI6IFtcclxuICAgICAgICBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwiZXh0LVwiICsgb3B0aW9ucy5mcmFtZXdvcmsgKyBcIi9wYWNrYWdlcy9sb2NhbFwiLFxyXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJleHQtXCIgKyBvcHRpb25zLmZyYW1ld29yayArIFwiL3BhY2thZ2VzXCIsXHJcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhXCIsXHJcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1mb250LWlvc1wiLFxyXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtJHt0b29sa2l0Lm5hbWV9LXRoZW1lLWJhc2VcIixcclxuICAgICAgICBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwibm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LSR7dG9vbGtpdC5uYW1lfS10aGVtZS1iYXNlXCIsXHJcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC0ke3Rvb2xraXQubmFtZX0tdGhlbWUtaW9zXCIsXHJcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC0ke3Rvb2xraXQubmFtZX0tdGhlbWUtbWF0ZXJpYWxcIixcclxuICAgICAgICBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwibm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LSR7dG9vbGtpdC5uYW1lfS10aGVtZS1hcmlhXCIsXHJcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC0ke3Rvb2xraXQubmFtZX0tdGhlbWUtbmV1dHJhbFwiLFxyXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtJHt0b29sa2l0Lm5hbWV9LXRoZW1lLWNsYXNzaWNcIixcclxuICAgICAgICBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwibm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LSR7dG9vbGtpdC5uYW1lfS10aGVtZS1ncmF5XCIsXHJcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC0ke3Rvb2xraXQubmFtZX0tdGhlbWUtY3Jpc3BcIixcclxuICAgICAgICBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwibm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LSR7dG9vbGtpdC5uYW1lfS10aGVtZS1jcmlzcC10b3VjaFwiLFxyXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtJHt0b29sa2l0Lm5hbWV9LXRoZW1lLW5lcHR1bmVcIixcclxuICAgICAgICBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwibm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LSR7dG9vbGtpdC5uYW1lfS10aGVtZS1uZXB0dW5lLXRvdWNoXCIsXHJcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC0ke3Rvb2xraXQubmFtZX0tdGhlbWUtdHJpdG9uXCIsXHJcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC0ke3Rvb2xraXQubmFtZX0tdGhlbWUtZ3JhcGhpdGVcIixcclxuICAgICAgICBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwibm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LXJlYWN0LXJlbmRlcmVyY2VsbFwiLFxyXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtd2ViLWNvbXBvbmVudHMtcmVuZGVyZXJjZWxsXCIsXHJcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1jYWxlbmRhclwiLFxyXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtY2hhcnRzXCIsXHJcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1kM1wiLFxyXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtZXhwb3J0ZXJcIixcclxuICAgICAgICBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwibm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LXBpdm90XCIsXHJcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1waXZvdC1kM1wiLFxyXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtdXhcIixcclxuICAgICAgXSxcclxuICAgICAgXCJleHRyYWN0XCI6IFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJwYWNrYWdlcy9yZW1vdGVcIlxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoY29uZmlnLCBudWxsLCAyKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZXh0QW5ndWxhck1vZHVsZSA9IGZ1bmN0aW9uKGltcG9ydHMsIGV4cG9ydHMsIGRlY2xhcmF0aW9ucykge1xyXG4gIHJldHVybiBgXHJcbiAgaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuICAke2ltcG9ydHN9XHJcbiAgQE5nTW9kdWxlKHtcclxuICAgIGltcG9ydHM6IFtcclxuICAgIF0sXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtcclxuICAke2RlY2xhcmF0aW9uc30gIF0sXHJcbiAgICBleHBvcnRzOiBbXHJcbiAgJHtleHBvcnRzfSAgXVxyXG4gIH0pXHJcbiAgZXhwb3J0IGNsYXNzIEV4dEFuZ3VsYXJNb2R1bGUgeyB9XHJcbiAgYFxyXG59XHJcbiJdfQ==