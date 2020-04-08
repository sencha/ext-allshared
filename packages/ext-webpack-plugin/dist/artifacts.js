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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcnRpZmFjdHMuanMiXSwibmFtZXMiOlsiYnVpbGRYTUwiLCJjb21wcmVzcyIsIm9wdGlvbnMiLCJvdXRwdXQiLCJsb2d2IiwicmVxdWlyZSIsImNvbXByZXNzaW9uIiwidHJpbSIsImNyZWF0ZUFwcEpzb24iLCJ0aGVtZSIsInBhY2thZ2VzIiwidG9vbGtpdCIsImZzIiwiaXNXaW5kb3dzIiwicHJvY2VzcyIsInBsYXRmb3JtIiwibWF0Y2giLCJwYXRoRGlmZmVyZW5jZSIsInN1YnN0cmluZyIsImN3ZCIsImxlbmd0aCIsIm51bWJlck9mUGF0aHMiLCJzcGxpdCIsIm5vZGVNb2R1bGVQYXRoIiwiaSIsImNvbmZpZyIsImZyYW1ld29yayIsInJlcXVpcmVzIiwiYmFzZSIsInJlc291cmNlcyIsInBhdGgiLCJzaGFyZWQiLCJleGlzdHNTeW5jIiwiY2pzb24iLCJwYWNrYWdlSW5mbyIsImxvYWQiLCJqb2luIiwibmFtZSIsImRpciIsInB1c2giLCJyZXNvbHZlIiwiSlNPTiIsInN0cmluZ2lmeSIsImNyZWF0ZUpTRE9NRW52aXJvbm1lbnQiLCJjcmVhdGVXb3Jrc3BhY2VKc29uIiwiZXh0QW5ndWxhck1vZHVsZSIsImltcG9ydHMiLCJleHBvcnRzIiwiZGVjbGFyYXRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQU8sTUFBTUEsUUFBUSxHQUFHLFVBQVNDLFFBQVQsRUFBbUJDLE9BQW5CLEVBQTRCQyxNQUE1QixFQUFvQztBQUMxRCxRQUFNQyxJQUFJLEdBQUdDLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0JELElBQXJDOztBQUNBQSxFQUFBQSxJQUFJLENBQUNGLE9BQUQsRUFBUyxtQkFBVCxDQUFKO0FBRUEsTUFBSUksV0FBVyxHQUFHLEVBQWxCOztBQUVBLE1BQUlMLFFBQUosRUFBYztBQUNaSyxJQUFBQSxXQUFXLEdBQUk7Ozs7Ozs7S0FBZjtBQVFEOztBQUVDLFNBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QSxjQUF0QixHQUF1Qyx1REFqQmxDLEVBa0JMLHNCQUFzQkEsY0FBdEIsR0FBdUMseURBbEJsQyxFQW1CTCxzQkFBc0JBLGNBQXRCLEdBQXVDLDZDQW5CbEMsRUFvQkwsc0JBQXNCQSxjQUF0QixHQUF1QyxzREFwQmxDLEVBcUJMLHNCQUFzQkEsY0FBdEIsR0FBdUMsbUNBckJsQyxFQXNCTCxzQkFBc0JBLGNBQXRCLEdBQXVDLGlDQXRCbEMsRUF1Qkwsc0JBQXNCQSxjQUF0QixHQUF1Qyw2QkF2QmxDLEVBd0JMLHNCQUFzQkEsY0FBdEIsR0FBdUMsbUNBeEJsQyxFQXlCTCxzQkFBc0JBLGNBQXRCLEdBQXVDLGdDQXpCbEMsRUEwQkwsc0JBQXNCQSxjQUF0QixHQUF1QyxtQ0ExQmxDLEVBMkJMLHNCQUFzQkEsY0FBdEIsR0FBdUMsNkJBM0JsQyxDQURHO0FBOEJWLGlCQUFXLHNCQUFzQkEsY0FBdEIsR0FBdUM7QUE5QnhDO0FBUEMsR0FBZjtBQXdDQSxTQUFPa0IsSUFBSSxDQUFDQyxTQUFMLENBQWVqQixNQUFmLEVBQXVCLElBQXZCLEVBQTZCLENBQTdCLENBQVA7QUFDRDs7QUFFTSxNQUFNb0IsZ0JBQWdCLEdBQUcsVUFBU0MsT0FBVCxFQUFrQkMsT0FBbEIsRUFBMkJDLFlBQTNCLEVBQXlDO0FBQ3ZFLFNBQVE7O0lBRU5GLE9BQVE7Ozs7O0lBS1JFLFlBQWE7O0lBRWJELE9BQVE7OztHQVRWO0FBYUQsQ0FkTSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBidWlsZFhNTCA9IGZ1bmN0aW9uKGNvbXByZXNzLCBvcHRpb25zLCBvdXRwdXQpIHtcbiAgY29uc3QgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcbiAgbG9ndihvcHRpb25zLCdGVU5DVElPTiBidWlsZFhNTCcpXG4gIFxuICBsZXQgY29tcHJlc3Npb24gPSAnJ1xuXG4gIGlmIChjb21wcmVzcykge1xuICAgIGNvbXByZXNzaW9uID0gYFxuICAgICAgdGhlbiBcbiAgICAgIGZzIFxuICAgICAgbWluaWZ5IFxuICAgICAgICAteXVpIFxuICAgICAgICAtZnJvbT1leHQuanMgXG4gICAgICAgIC10bz1leHQuanNcbiAgICBgO1xuICB9XG5cbiAgICByZXR1cm4gYDxwcm9qZWN0IG5hbWU9XCJzaW1wbGUtYnVpbGRcIiBiYXNlZGlyPVwiLlwiPlxuICA8IS0tICBpbnRlcm5hbGx5LCB3YXRjaCBjYWxscyB0aGUgaW5pdCB0YXJnZXQsIHNvIG5lZWQgdG8gaGF2ZSBvbmUgaGVyZSAtLT5cbiAgPHRhcmdldCBuYW1lPVwiaW5pdFwiLz5cbiAgPHRhcmdldCBuYW1lPVwiaW5pdC1jbWRcIj5cbiAgICA8dGFza2RlZiAgcmVzb3VyY2U9XCJjb20vc2VuY2hhL2FudC9hbnRsaWIueG1sXCJcbiAgICAgICAgICAgICAgY2xhc3NwYXRoPVwiXFwke2NtZC5kaXJ9L3NlbmNoYS5qYXJcIlxuICAgICAgICAgICAgICBsb2FkZXJyZWY9XCJzZW5jaGFsb2FkZXJcIi8+XG4gICAgPHgtZXh0ZW5kLWNsYXNzcGF0aD5cbiAgICAgICAgPGphciBwYXRoPVwiXFwke2NtZC5kaXJ9L3NlbmNoYS5qYXJcIi8+XG4gICAgPC94LWV4dGVuZC1jbGFzc3BhdGg+XG4gICAgPHgtc2VuY2hhLWluaXQgcHJlZml4PVwiXCIvPlxuICAgIDx4LWNvbXBpbGUgcmVmaWQ9XCJ0aGVDb21waWxlclwiXG4gICAgICAgICAgICAgICAgICAgICAgZGlyPVwiXFwke2Jhc2VkaXJ9XCJcbiAgICAgICAgICAgICAgICAgICAgICBpbml0T25seT1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgICAgIGluaGVyaXRBbGw9XCJ0cnVlXCI+XG4gICAgICAgICAgICAgIDwhW0NEQVRBW1xuICAgICAgICAgICAgICAtY2xhc3NwYXRoPVxcJHtiYXNlZGlyfS9tYW5pZmVzdC5qc1xuICAgICAgICAgICAgICBsb2FkLWFwcFxuICAgICAgICAgICAgICAgICAgLXRlbXA9XFwke2Jhc2VkaXJ9L3RlbXBcbiAgICAgICAgICAgICAgICAgIC10YWc9QXBwXG4gICAgICAgIF1dPlxuICAgICAgPC94LWNvbXBpbGU+XG4gIDwvdGFyZ2V0PlxuICA8dGFyZ2V0IG5hbWU9XCJyZWJ1aWxkXCI+XG4gICAgPHgtY29tcGlsZSByZWZpZD1cInRoZUNvbXBpbGVyXCJcbiAgICAgICAgICAgICAgZGlyPVwiXFwke2Jhc2VkaXJ9XCJcbiAgICAgICAgICAgICAgaW5oZXJpdEFsbD1cInRydWVcIj5cbiAgICAgIDwhW0NEQVRBW1xuICAgICAgLS1kZWJ1Z1xuICAgICAgZXhjbHVkZVxuICAgICAgLWFsbFxuICAgICAgYW5kXG4gICAgICBpbmNsdWRlXG4gICAgICAtZj1Cb290LmpzXG4gICAgICBhbmRcbiAgICAgIGNvbmNhdGVuYXRlXG4gICAgICAgICAgZXh0LmpzXG4gICAgICBhbmRcbiAgICAgIGV4Y2x1ZGVcbiAgICAgIC1hbGxcbiAgICAgIGFuZFxuICAgICAgIyBpbmNsdWRlIHRoZW1lIG92ZXJyaWRlc1xuICAgICAgaW5jbHVkZVxuICAgICAgICAtclxuICAgICAgICAtdGFnPW92ZXJyaWRlc1xuICAgICAgYW5kXG4gICAgICAjIGluY2x1ZGUgYWxsIGpzIGZpbGVzIG5lZWRlZCBmb3IgbWFuaWZlc3QuanNcbiAgICAgIGluY2x1ZGVcbiAgICAgICAgICAtclxuICAgICAgICAgIC1mPW1hbmlmZXN0LmpzXG4gICAgICBhbmRcbiAgICAgICMgZXhjbHVkZSB0aGUgZ2VuZXJhdGVkIG1hbmlmZXN0IGZpbGUgaXRzZWxmLFxuICAgICAgIyBzaW5jZSB3ZSBkb24ndCB3YW50IHRoZSBnZW5lcmF0ZWQgYnVuZGxlIGZpbGUgdG8gY3JlYXRlIGFueSBjb21wb25lbnRzXG4gICAgICBleGNsdWRlXG4gICAgICAtZj1tYW5pZmVzdC5qc1xuICAgICAgYW5kXG4gICAgICBjb25jYXRlbmF0ZVxuICAgICAgK2FwcGVuZFxuICAgICAgICAgIGV4dC5qc1xuICAgICAgYW5kXG4gICAgICBzY3NzXG4gICAgICAgICAgLWFwcE5hbWU9QXBwXG4gICAgICAgICAgLWltYWdlU2VhcmNoUGF0aD1yZXNvdXJjZXNcbiAgICAgICAgICAtdGhlbWVOYW1lPXRyaXRvblxuICAgICAgICAgIC1yZXNvdXJjZU1hcEJhc2U9LlxuICAgICAgICAgIC1vdXRwdXQ9ZXh0LnNjc3NcbiAgICAgIGFuZFxuICAgICAgcmVzb3VyY2VzXG4gICAgICAgICAgLWV4Y2x1ZGVzPS1hbGwqLmNzc1xuICAgICAgICAgIC1vdXQ9cmVzb3VyY2VzXG4gICAgICBhbmRcbiAgICAgIHJlc291cmNlc1xuICAgICAgICAgIC1tb2RlbD10cnVlXG4gICAgICAgICAgLW91dD1yZXNvdXJjZXNcbiAgICAgIF1dPlxuICAgIDwveC1jb21waWxlPlxuICA8L3RhcmdldD5cbiAgPHRhcmdldCBuYW1lPVwiYnVpbGRcIiBkZXBlbmRzPVwiaW5pdC1jbWQscmVidWlsZFwiPlxuICAgIDx4LXNlbmNoYS1jb21tYW5kIGRpcj1cIlxcJHtiYXNlZGlyfVwiPlxuICAgICAgPCFbQ0RBVEFbXG4gICAgICBmYXNoaW9uXG4gICAgICAgICAgLXB3ZD0uXG4gICAgICAgICAgLXNwbGl0PTQwOTVcbiAgICAgICAgICAke2NvbXByZXNzID8gJy1jb21wcmVzcycgOiAnJ31cbiAgICAgICAgICAgICAgZXh0LnNjc3NcbiAgICAgICAgICBleHQuY3NzXG4gICAgICAke2NvbXByZXNzaW9ufVxuICAgICAgXV0+XG4gICAgPC94LXNlbmNoYS1jb21tYW5kPlxuICA8L3RhcmdldD5cbiAgPHRhcmdldCBuYW1lPVwid2F0Y2hcIiBkZXBlbmRzPVwiaW5pdC1jbWQsYnVpbGRcIj5cbiAgICA8eC1mYXNoaW9uLXdhdGNoXG4gICAgICByZWZOYW1lPVwiZmFzaGlvbi13YXRjaFwiXG4gICAgICBpbnB1dEZpbGU9XCJleHQuc2Nzc1wiXG4gICAgICBvdXRwdXRGaWxlPVwiZXh0LmNzc1wiXG4gICAgICBzcGxpdD1cIjQwOTVcIlxuICAgICAgY29tcHJlc3M9XCIke2NvbXByZXNzID8gJ3RydWUnIDogJ2ZhbHNlJ31cIlxuICAgICAgY29uZmlnRmlsZT1cImFwcC5qc29uXCJcbiAgICAgIGZvcms9XCJ0cnVlXCIvPlxuICAgIDx4LXdhdGNoIGNvbXBpbGVyUmVmPVwidGhlQ29tcGlsZXJcIiB0YXJnZXRzPVwicmVidWlsZFwiLz5cbiAgPC90YXJnZXQ+XG48L3Byb2plY3Q+XG5gLnRyaW0oKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQXBwSnNvbiggdGhlbWUsIHBhY2thZ2VzLCB0b29sa2l0LCBvcHRpb25zLCBvdXRwdXQgKSB7XG4gIGNvbnN0IGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XG4gIGxvZ3Yob3B0aW9ucywnRlVOQ1RJT04gY3JlYXRlQXBwSnNvbicpXG5cbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5cbiAgdmFyIGlzV2luZG93cyA9IHR5cGVvZiBwcm9jZXNzICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwcm9jZXNzLnBsYXRmb3JtICE9ICd1bmRlZmluZWQnICYmICEhcHJvY2Vzcy5wbGF0Zm9ybS5tYXRjaCgvXndpbi8pO1xuICB2YXIgcGF0aERpZmZlcmVuY2UgPSBvdXRwdXQuc3Vic3RyaW5nKHByb2Nlc3MuY3dkKCkubGVuZ3RoKVxuICB2YXIgbnVtYmVyT2ZQYXRocyA9IHBhdGhEaWZmZXJlbmNlLnNwbGl0KGlzV2luZG93cyA/IFwiXFxcXFwiIDogXCIvXCIpLmxlbmd0aCAtIDE7XG4gIHZhciBub2RlTW9kdWxlUGF0aCA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtYmVyT2ZQYXRoczsgaSsrKSB7IFxuICAgIG5vZGVNb2R1bGVQYXRoICs9IFwiLi4vXCJcbiAgfVxuXG4gIGNvbnN0IGNvbmZpZyA9IHtcbiAgICBmcmFtZXdvcms6IFwiZXh0XCIsXG4gICAgdG9vbGtpdCxcbiAgICByZXF1aXJlczogcGFja2FnZXMsXG4gICAgXCJvdmVycmlkZXNcIjogW1xuICAgICAgXCJvdmVycmlkZXNcIixcbiAgICAgIFwianNkb20tZW52aXJvbm1lbnQuanNcIlxuICAgIF0sXG4gICAgLy8gXCJsYW5ndWFnZVwiOiB7XG4gICAgLy8gICBcImpzXCI6IHtcbiAgICAvLyAgICAgXCJvdXRwdXRcIjogXCJFUzVcIlxuICAgIC8vICAgfVxuICAgIC8vIH0sXG4gICAgXCJwYWNrYWdlc1wiOiB7XG4gICAgICBcImRpclwiOiBbXG4gICAgICAgIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYVwiLFxuICAgICAgICBub2RlTW9kdWxlUGF0aCArIHRvb2xraXQgKyBcIi9wYWNrYWdlc1wiXG4gICAgICBdXG4gICAgfSxcbiAgICBvdXRwdXQ6IHtcbiAgICAgIGJhc2U6ICcuJyxcbiAgICAgIHJlc291cmNlczoge1xuICAgICAgICBwYXRoOiAnLi9yZXNvdXJjZXMnLFxuICAgICAgICBzaGFyZWQ6IFwiLi9yZXNvdXJjZXNcIlxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZW1lIGlzIGxvY2FsIGFkZCBpdCBhcyBhbiBhZGRpdGlvbmFsIHBhY2thZ2UgZGlyXG4gIGlmIChmcy5leGlzdHNTeW5jKHRoZW1lKSkge1xuICAgICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgY29uc3QgY2pzb24gPSByZXF1aXJlKCdjanNvbicpXG4gICAgICBjb25zdCBwYWNrYWdlSW5mbyA9IGNqc29uLmxvYWQocGF0aC5qb2luKHRoZW1lLCAncGFja2FnZS5qc29uJykpO1xuICAgICAgY29uZmlnLnRoZW1lID0gcGFja2FnZUluZm8ubmFtZTtcbiAgICAgIGNvbmZpZy5wYWNrYWdlcy5kaXIucHVzaChwYXRoLnJlc29sdmUodGhlbWUpKTtcbiAgfSBlbHNlIHtcbiAgICAgIGNvbmZpZy50aGVtZSA9IHRoZW1lO1xuICB9XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShjb25maWcsIG51bGwsIDIpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVKU0RPTUVudmlyb25tZW50KG9wdGlvbnMsIG91dHB1dCkge1xuICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIGNyZWF0ZUpTRE9NRW52aXJvbm1lbnQnKVxuXG4gIHJldHVybiAnd2luZG93LkV4dCA9IEV4dDsnXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVXb3Jrc3BhY2VKc29uKG9wdGlvbnMsIG91dHB1dCkge1xuICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxuICBsb2d2KG9wdGlvbnMsJ0ZVTkNUSU9OIGNyZWF0ZVdvcmtzcGFjZUpzb24nKVxuXG4gIHZhciBpc1dpbmRvd3MgPSB0eXBlb2YgcHJvY2VzcyAhPSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcHJvY2Vzcy5wbGF0Zm9ybSAhPSAndW5kZWZpbmVkJyAmJiAhIXByb2Nlc3MucGxhdGZvcm0ubWF0Y2goL153aW4vKTtcbiAgdmFyIHBhdGhEaWZmZXJlbmNlID0gb3V0cHV0LnN1YnN0cmluZyhwcm9jZXNzLmN3ZCgpLmxlbmd0aClcbiAgdmFyIG51bWJlck9mUGF0aHMgPSBwYXRoRGlmZmVyZW5jZS5zcGxpdChpc1dpbmRvd3MgPyBcIlxcXFxcIiA6IFwiL1wiKS5sZW5ndGggLSAxO1xuICB2YXIgbm9kZU1vZHVsZVBhdGggPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bWJlck9mUGF0aHM7IGkrKykgeyBcbiAgICBub2RlTW9kdWxlUGF0aCArPSBcIi4uL1wiXG4gIH1cblxuICBsb2d2KG9wdGlvbnMsJ2lzV2luZG93czogJyArIGlzV2luZG93cylcbiAgbG9ndihvcHRpb25zLCdvdXRwdXQ6ICcgKyBvdXRwdXQpXG4gIGxvZ3Yob3B0aW9ucywncGF0aERpZmZlcmVuY2U6ICcgKyBwYXRoRGlmZmVyZW5jZSlcbiAgbG9ndihvcHRpb25zLCdudW1iZXJPZlBhdGhzOiAnICsgbnVtYmVyT2ZQYXRocylcbiAgbG9ndihvcHRpb25zLCdub2RlTW9kdWxlUGF0aDogJyArIG5vZGVNb2R1bGVQYXRoKVxuXG5cblxuICBjb25zdCBjb25maWcgPSB7XG4gICAgXCJmcmFtZXdvcmtzXCI6IHtcbiAgICAgIFwiZXh0XCI6IG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYS9leHRcIlxuICAgIH0sXG4gICAgXCJidWlsZFwiOiB7XG4gICAgICBcImRpclwiOiBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwiYnVpbGRcIlxuICAgIH0sXG4gICAgXCJwYWNrYWdlc1wiOiB7XG4gICAgICBcImRpclwiOiBbXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJleHQtXCIgKyBvcHRpb25zLmZyYW1ld29yayArIFwiL3BhY2thZ2VzL2xvY2FsXCIsXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJleHQtXCIgKyBvcHRpb25zLmZyYW1ld29yayArIFwiL3BhY2thZ2VzXCIsXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYVwiLFxuICAgICAgICBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwibm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LWZvbnQtaW9zXCIsXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtJHt0b29sa2l0Lm5hbWV9LXRoZW1lLWJhc2VcIixcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC0ke3Rvb2xraXQubmFtZX0tdGhlbWUtYmFzZVwiLFxuICAgICAgICBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwibm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LSR7dG9vbGtpdC5uYW1lfS10aGVtZS1pb3NcIixcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC0ke3Rvb2xraXQubmFtZX0tdGhlbWUtbWF0ZXJpYWxcIixcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC0ke3Rvb2xraXQubmFtZX0tdGhlbWUtYXJpYVwiLFxuICAgICAgICBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwibm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LSR7dG9vbGtpdC5uYW1lfS10aGVtZS1uZXV0cmFsXCIsXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtJHt0b29sa2l0Lm5hbWV9LXRoZW1lLWNsYXNzaWNcIixcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC0ke3Rvb2xraXQubmFtZX0tdGhlbWUtZ3JheVwiLFxuICAgICAgICBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwibm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LSR7dG9vbGtpdC5uYW1lfS10aGVtZS1jcmlzcFwiLFxuICAgICAgICBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwibm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LSR7dG9vbGtpdC5uYW1lfS10aGVtZS1jcmlzcC10b3VjaFwiLFxuICAgICAgICBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwibm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LSR7dG9vbGtpdC5uYW1lfS10aGVtZS1uZXB0dW5lXCIsXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtJHt0b29sa2l0Lm5hbWV9LXRoZW1lLW5lcHR1bmUtdG91Y2hcIixcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC0ke3Rvb2xraXQubmFtZX0tdGhlbWUtdHJpdG9uXCIsXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtJHt0b29sa2l0Lm5hbWV9LXRoZW1lLWdyYXBoaXRlXCIsXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtcmVhY3QtcmVuZGVyZXJjZWxsXCIsXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtd2ViLWNvbXBvbmVudHMtcmVuZGVyZXJjZWxsXCIsXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtY2FsZW5kYXJcIixcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1jaGFydHNcIixcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1kM1wiLFxuICAgICAgICBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwibm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LWV4cG9ydGVyXCIsXG4gICAgICAgIFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtcGl2b3RcIixcbiAgICAgICAgXCIke3dvcmtzcGFjZS5kaXJ9L1wiICsgbm9kZU1vZHVsZVBhdGggKyBcIm5vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1waXZvdC1kM1wiLFxuICAgICAgICBcIiR7d29ya3NwYWNlLmRpcn0vXCIgKyBub2RlTW9kdWxlUGF0aCArIFwibm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LXV4XCIsXG4gICAgICBdLFxuICAgICAgXCJleHRyYWN0XCI6IFwiJHt3b3Jrc3BhY2UuZGlyfS9cIiArIG5vZGVNb2R1bGVQYXRoICsgXCJwYWNrYWdlcy9yZW1vdGVcIlxuICAgIH1cbiAgfVxuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoY29uZmlnLCBudWxsLCAyKVxufVxuXG5leHBvcnQgY29uc3QgZXh0QW5ndWxhck1vZHVsZSA9IGZ1bmN0aW9uKGltcG9ydHMsIGV4cG9ydHMsIGRlY2xhcmF0aW9ucykge1xuICByZXR1cm4gYFxuICBpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAke2ltcG9ydHN9XG4gIEBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW1xuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICR7ZGVjbGFyYXRpb25zfSAgXSxcbiAgICBleHBvcnRzOiBbXG4gICR7ZXhwb3J0c30gIF1cbiAgfSlcbiAgZXhwb3J0IGNsYXNzIEV4dEFuZ3VsYXJNb2R1bGUgeyB9XG4gIGBcbn1cbiJdfQ==