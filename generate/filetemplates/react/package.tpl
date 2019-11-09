{
  "name": "@sencha/ext-react",
  "version": "7.1.0",
  "description": "Use Ext JS components in React 16 and above",
  "main": "index.js",
  "typings": "index.d.ts",
  "scripts": {
    "xinstall": "node ./readme.js",
    "watch": "npx babel ./src --out-dir ./dist --source-maps --watch",
    "build": "npx babel ./src --out-dir ./dist --source-maps",
    "prepublish": "npm run build",
    "create-typings": "node script/create-typings.js",
    "test": "pushd ../ext-react-tests; npm test"
  },
  "keywords": [
    "Sencha",
    "Ext JS",
    "React",
    "ExtReact"
  ],
  "author": "Sencha, Inc.",
  "license": "MIT",
  "homepage": "https://github.com/sencha/ext-react#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sencha/ext-react.git"
  },

  "peerDependencies": {
    "@sencha/ext-web-components": "~7.1.0"
  },
  "dependencies": {
    "@sencha/ext-web-components": "~7.1.0",
    "@babel/runtime": "^7.7.2",
    "comment-json": "^2.2.0",
    "fbjs": "1.0.0",
    "lodash.capitalize": "^4.2.1",
    "lodash.clonedeepwith": "^4.5.0",
    "lodash.defaults": "^4.2.0",
    "lodash.isequal": "^4.5.0",
    "lodash.union": "^4.6.0",
    "minimist": "^1.2.0",
    "mkdirp": "^0.5.1",
    "react": "~16.11.0",
    "react-dom": "~16.11.0",
    "@hot-loader/react-dom":"~16.11.0",
    "react-reconciler": "~0.23.0",
    "react-test-renderer": "~16.11.0"
  },
  "devDependencies": {
    "@babel/cli": "^7.7.0",
    "@babel/core": "^7.7.2",
    "@babel/preset-env": "^7.7.1",
    "@babel/plugin-transform-runtime": "^7.6.2",
    "@babel/plugin-proposal-class-properties": "^7.7.0",
    "@babel/plugin-proposal-decorators": "^7.7.0",
    "@babel/plugin-proposal-export-namespace-from": "^7.5.2",
    "@babel/plugin-proposal-function-sent": "^7.7.0",
    "@babel/plugin-proposal-json-strings": "^7.2.0",
    "@babel/plugin-proposal-numeric-separator": "^7.2.0",
    "@babel/plugin-proposal-throw-expressions": "^7.2.0",
    "@babel/plugin-syntax-dynamic-import": "^7.2.0",
    "@babel/plugin-syntax-import-meta": "^7.2.0",
    "@babel/preset-react": "^7.7.0",
    "@types/react": "^16.9.11",
    "@types/react-dom": "~16.9.4",
    "typescript": "^3.4.5"
  }
}