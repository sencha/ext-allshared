{
  "name": "@sencha/ext-angular-{toolkit}{bundle}",
  "description": "ext-angular-{toolkit}{bundle}",
  "version": "7.2.0",
  "scripts": {
    "packagr": "ng-packagr -p ng-package.json"
  },
  "bin": {
    "ext-angular": "./bin/ext-angular.js"
  },
  "main": "index.js",
  "private": false,
  "peerDependencies": {
    "@sencha/ext-web-components-{toolkit}{bundle}": "~7.2.0",
    "@angular/compiler": "~9.0.0",
    "@angular/core": "~9.0.0",
    "tslib": "^1.10.0"
  },
  "dependencies": {
    "fs-extra": "~8.1.0",
    "@sencha/ext-web-components-{toolkit}{bundle}": "~7.2.0",
    "script-loader": "^0.7.2",
    "tslib": "^1.10.0"
  },
  "devDependencies": {
    "@angular/core": "~9.0.0",
    "@angular/common": "~9.0.0",
    "@angular/platform-browser": "~9.0.0",
    "@angular/platform-browser-dynamic": "~9.0.0",
    "zone.js": "~0.10.2",
    "ng-packagr": "^9.0.0",
    "@angular/compiler": "~9.0.0",
    "@angular/compiler-cli": "~9.0.0",
    "typescript": "~3.7.5"
  },
  "repository": {
  "type": "git",
  "url": "git+https://github.com/sencha/ext-angular.git"
  },
  "keywords": [],
  "author": "Sencha",
  "license": "ISC"
}
