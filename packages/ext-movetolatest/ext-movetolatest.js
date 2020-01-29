#! /usr/bin/env node
const path = require('path')
const fs = require('fs-extra')
require('./XTemplate/js')

// Packages used for determining framework environment from package.json
const extAngularPackage = "@sencha/ext-angular"
const extReactPackage = "@sencha/ext-react"
const extReactClassicPackage = "@sencha/ext-react-classic"
const extReactModernPackage = "@sencha/ext-react-modern"
const extModernPackage = "@sencha/ext-modern"
const extClassicPackage = "@sencha/ext-classic"
const extWCPackage = "@sencha/ext-web-components"
const vuePackage = "vue"
const extGenPackage = "@sencha/ext-gen"
const extReactorPackage = "@extjs/reactor"
const reactPackage = "react"
const angularCLIPackage = "@angular/cli"

// Frameworks and Themes
const reactFW = "react"
const reactModernFW = "reactModern"
const reactClassicFW = "reactClassic"
const reactorFW = "reactor"
const extJSFW = "extjs"
const angularFW = "angular"
const componentsFW = "components"
const classicThemes = [
  "graphite",
  "neptune-touch",
  "classic",
  "aria",
  "crisp-touch",
  "neptune",
  "gray",
  "neutral",
  "crisp",
  "base",
  "triton",
  "material"
]
const modernThemes = [
  "material",
  "neptune",
  "base",
  "triton",
  "ios"
]

// Console Out Messaging
const migrationMessage = "migration.txt"
const completionMessage = "completion.txt"

// Frameworks Array
const supportedFrameworks = [
  extJSFW,
  reactFW,
  angularFW,
  componentsFW,
  reactorFW
]

var rootDir
var backupDir
var upgradeDir
var indexJS = 'index.js';

// "Main" method invocation
movetolatest()

/**
 *
 * 1. Parse existing application's package.json dependencies
 * 2. Determine what framework environment the project is using
 * 3. Backup all files that will be upgraded
 * 4. If applicable, upgrade necessary files, else inform the user that this tool is not supported
 *
 */
function movetolatest() {
  
  rootDir = path.resolve(process.cwd())
  backupDir = path.resolve(rootDir, 'extBackup')
  upgradeDir = path.resolve(__dirname, 'upgradeTemplates')

  if (fs.existsSync(backupDir)){
    console.log(`${boldRed('Error: backup folder ' + backupDir.replace(process.cwd(), '') + ' exists')}`)
    return
  }
  if (!fs.existsSync(upgradeDir)){
    console.log(`${boldRed('Error: ' + upgradeDir.replace(process.cwd(), '') + ' does not exist')}`)
    return
  }

  var packageJson = {}
  var webpackConfigJs = {}
  var babelrc = {}
  var indexjs = {}
  var themerjs = {}
  var themerts = {}
  var polyfillsts = {}
  var buildXML = {}

  set(packageJson, 'package.json', './', '')
  set(webpackConfigJs, 'webpack.config.js', './', 'webpack.config.js.tpl.default')
  set(babelrc, '.babelrc', './', '')
  set(indexjs, 'index.js', './src', '')
  set(themerjs, 'themer.js', './src', '')
  set(themerts, 'themer.ts', './src', '')
  set(polyfillsts, 'polyfills.ts', './src', '')
  set(buildXML, 'build.xml', './', 'build.xml.tpl.default')

  packageJson.old = JSON.parse(fs.readFileSync(packageJson.root, {encoding: 'utf8'}))
  var o = {
    foundFramework: '',
    foundVersion: '',
    foundKey: ''
  }

  // If the product is no longer supported, politely inform the user
  if (packageJson.old.dependencies != undefined 
    && isSupportDeprecatedForApplication(packageJson.old.dependencies)) {
    logOutputForFile(migrationMessage)
    return
  } else if (packageJson.old.devDependencies != undefined 
    && isSupportDeprecatedForApplication(packageJson.old.devDependencies)) {
    logOutputForFile(migrationMessage)
    return
  }

  // Traverse the framework types we may find
  supportedFrameworks.forEach(framework => {
    findIt(framework, packageJson, o)
  });

  // Default to ExtJS + ExtGen (Open To)
  if (o.foundFramework == '') {
    o.foundFramework = extJSFW
  }

  // Previous versions didn't have an index.js at the project root
  if (!doesFileExist(indexJS) && o.foundFramework == 'extjs') {
    createIndexJS();
  }

  // Create backups of files that will be touched
  archive(packageJson)
  archive(webpackConfigJs)
  archive(buildXML)
  archive(babelrc)
  archive(indexjs)
  archive(themerjs)
  archive(themerts)
  archive(polyfillsts)
 
  /**
   * Template folder setup
   */
  var frameworkTemplateFolder = path.join(upgradeDir, o.foundFramework)
  webpackConfigJs.upgrade = path.join(frameworkTemplateFolder, webpackConfigJs.template)
  babelrc.upgrade = path.join(frameworkTemplateFolder, babelrc.name)
  indexjs.upgrade = path.join(frameworkTemplateFolder, indexjs.name)
  themerjs.upgrade = path.join(frameworkTemplateFolder, themerjs.name)
  themerts.upgrade = path.join(frameworkTemplateFolder, themerts.name)
  polyfillsts.upgrade = path.join(frameworkTemplateFolder, polyfillsts.name)

  /**
   * ExtJS + ExtGen (OpenTools) package.json template processing
   */
  if ((o.foundFramework == 'extjs') ) {

    var content = fs.readFileSync(path.join(frameworkTemplateFolder,'package.json.tpl.default')).toString()
    var tpl = new Ext.XTemplate(content)
    var t = tpl.apply(getToolkit(packageJson))
    tpl = null
    fs.writeFileSync(packageJson.root, t);
    console.log(boldGreen('Processed ') + packageJson.root.replace(process.cwd(), ''))
    
  } else {

    packageJson.new = JSON.parse(fs.readFileSync(path.join(frameworkTemplateFolder, 'package.json'), {encoding: 'utf8'}))
    packageJson.upgrade = path.join(frameworkTemplateFolder, packageJson.name)

    packageJson.old.scripts = packageJson.new.scripts
    packageJson.old.devDependencies = packageJson.new.devDependencies
    packageJson.old.dependencies = packageJson.new.dependencies
    delete packageJson.old.extDefults
    fs.writeFileSync(packageJson.root, JSON.stringify(packageJson.old, null, 2));

    console.log(boldGreen('Updated ') + packageJson.root.replace(process.cwd(), ''))
  }

  // Choose the correct template values based on the detected framework
  var values = {}
  switch (o.foundFramework) {
    case extJSFW:
      values = extjsValues()
      break;
    case reactFW:
    case reactorFW:
      values = reactValues()
      break;
    case reactModernFW:
      values = reactModernValues()
      break;
    case reactClassicFW:
      values = reactClassicValues()
      break;
    case angularFW:
      values = angularValues()
      break;
    case componentsFW:
      values = componentsValues()
      break;
  }

  var content = fs.readFileSync(webpackConfigJs.upgrade).toString()
  var tpl = new Ext.XTemplate(content)
  var t = tpl.apply(values)
  tpl = null
  fs.writeFileSync(webpackConfigJs.root, t);
  console.log(boldGreen('Updated ') + webpackConfigJs.root.replace(process.cwd(), ''))

  if ((o.foundFramework == 'extjs') ) {
    fs.copySync(indexjs.upgrade, indexjs.root)
    console.log(boldGreen('Copied ') + indexjs.upgrade.replace(__dirname, '') + ' to ' +  indexjs.root.replace(process.cwd(), ''))

    fs.copySync(path.join(frameworkTemplateFolder,'build.xml'), buildXML.root)
    console.log(boldGreen('Updated ') + buildXML.root.replace(process.cwd(), ''))
  }

  if ((o.foundFramework == 'angular') ) {
    fs.copySync(themerts.upgrade, themerts.root)
    console.log(boldGreen('Copied ') + themerts.upgrade.replace(__dirname, '') + ' to ' +  themerts.root.replace(process.cwd(), ''))

    fs.copySync(polyfillsts.upgrade, polyfillsts.root)
    console.log(boldGreen('Copied ') + polyfillsts.upgrade.replace(__dirname, '') + ' to ' +  polyfillsts.root.replace(process.cwd(), ''))
  }

  if (o.foundFramework == 'react' || o.foundFramework == 'reactor') {

    fs.copySync(babelrc.upgrade, babelrc.root)
    console.log(boldGreen('Copied ') + babelrc.upgrade.replace(__dirname, '') + ' to ' +  babelrc.root.replace(process.cwd(), ''))

    fs.copySync(indexjs.upgrade, indexjs.root)
    console.log(boldGreen('Copied ') + indexjs.upgrade.replace(__dirname, '') + ' to ' +  indexjs.root.replace(process.cwd(), ''))

    fs.copySync(themerjs.upgrade, themerjs.root)
    console.log(boldGreen('Copied ') + themerjs.upgrade.replace(__dirname, '') + ' to ' +  themerjs.root.replace(process.cwd(), ''))

    if (replaceIt(/\@extjs\/reactor\/modern/g, '@sencha/ext-react') == -1) {return}
    if (replaceIt(/\@sencha\/reactor\/modern/g, '@sencha/ext-react') == -1) {return}
    if (replaceIt(/\@extjs\/ext-react\/modern/g, '@sencha/ext-react') == -1) {return}
    if (replaceIt(/\@sencha\/ext-react\/modern/g, '@sencha/ext-react') == -1) {return}
    if (replaceIt(/\@extjs\/reactor/g, '@sencha/ext-react') == -1) {return}
    if (replaceIt(/\@sencha\/reactor/g, '@sencha/ext-react') == -1) {return}
    if (replaceIt(/\@extjs\/ext-react/g, '@sencha/ext-react') == -1) {return}

    if (replaceIt(/\<Transition.*\>/g, '') == -1) {return}
    if (replaceIt(/\<\/Transition\>/g, '') == -1) {return}
  }

  logOutputForFile(completionMessage)

  return
}

/**
 * 
 * HELPER FUNCTIONS
 * 
 */

function logOutputForFile(messageFile) {
  var deprecatedOutput = fs.readFileSync(path.join(upgradeDir, messageFile)).toString().split('\n')
    deprecatedOutput.forEach(line => {
      console.log(boldGreen('\n'+line))
    })
}

function doesFileExist(fileName) {
	return fs.existsSync(fileName);
}

function createIndexJS() {
	var data = "//this file exists so the webpack build process will succeed\nExt._find = require('lodash.find');";
	fs.writeFile("index.js", data, (err) => {
		if (err) console.log("ext-movetolatest failed to create index.js " + err);
	});
}

function set(o, name, root, template) {
  o.name = name
  o.root = path.join(rootDir, root, o.name)
  o.backup = path.join(backupDir, o.name)
  o.template = template
}

function archive(o) {
  if (!fs.existsSync(o.root)){
    return
  }
  else {
    fs.copySync(o.root, o.backup)
    console.log(boldGreen('Backed up ') + o.root.replace(process.cwd(), '') + ' to ' +  o.backup.replace(process.cwd(), ''))
  }
}

function findIt(framework, packageJson, o) {

  if (o.foundFramework != '' && o.foundVersion != '' && o.foundKey != '') { return }

  var v = ''
  var key = ''

  if (framework == 'reactor') {
    key = '@extjs/reactor-webpack-plugin'
  } else {
    key = '@sencha/ext-webpack-plugin'
  }

  if (packageJson.old.dependencies != undefined) {
    determineFrameworkFromPackageWithKey(packageJson.old.dependencies, key, framework, o)
  }

  if (packageJson.old.devDependencies != undefined) {
    determineFrameworkFromPackageWithKey(packageJson.old.devDependencies, key, framework, o)
  }
}

function determineFrameworkFromPackageWithKey(packageJsonNode, key, tryingFramework, o) {

  // Did we already find a framework? Don't bother with the rest if we did
  if (o.foundFramework != '') { return }

  // Verify the webpack plugin (key) exists within the package.json node
  var inDep = packageJsonNode.hasOwnProperty(key)
  var determinedFramework = ''

  // If it does exist, set the version and key (2 or 3 values stored in o variable)
  if (inDep) {
    v = packageJsonNode[key].slice(-5)
    o.foundVersion = v
    o.foundKey = key;
  }

  switch (tryingFramework) {
    case angularFW:
      if (packageJsonNode.hasOwnProperty(extAngularPackage)
      && (packageJsonNode.hasOwnProperty(extGenPackage) == false)) 
      {
        o.foundFramework = angularFW
      }
    break;
    case reactFW:
    case reactorFW:
      if (packageJsonNode.hasOwnProperty(extReactPackage)
      || packageJsonNode.hasOwnProperty(extReactClassicPackage)
      || packageJsonNode.hasOwnProperty(extReactModernPackage)) 
      {
        if (packageJsonNode.hasOwnProperty(extClassicPackage)) 
        {
          o.foundFramework = reactClassicFW
        } else if (packageJsonNode.hasOwnProperty(extModernPackage))
        {
          o.foundFramework = reactModernFW
        }
      } else if (packageJsonNode.hasOwnProperty(extReactorPackage)) 
      {
        o.foundFramework = reactorFW
      }
    break;
    case componentsFW:
      if (packageJsonNode.hasOwnProperty(extWCPackage)) 
      {
        o.foundFramework = componentsFW
      }
    break;
    case extJSFW:
    break;
  }
}

function getToolkit(packageJson) {

  var values = {
    classic: false,
    modern: false,
    universal: false,
    modernTheme: 'material',
    classicTheme: 'material'
  }
  values = checkPackageToolkit(packageJson.old.dependencies, values)
  values = checkPackageToolkit(packageJson.old.devDependencies, values)
  return values;
}

function checkPackageToolkit(dependencies, values) {
  if (dependencies != undefined) {
    if (isModern(dependencies)) {
      values.modern = true
    } else if (isClassic(dependencies)) {
      values.classic = true
    } else if (isUniversal(dependencies)) {
      values.universal = true
    }
    const modernTheme = getModernTheme(dependencies)
    const classicTheme = getClassicTheme(dependencies)
    if (modernTheme) {
      values.modernTheme = modernTheme
    } else if (classicTheme) {
      values.classicTheme = classicTheme
    } 
  }
  return values
}

function getModernTheme(package) {
  var exists = false
  var theme = undefined // default
  var testTheme = "@sencha/ext-modern-theme-"
  modernThemes.forEach(theme => {
    testTheme+=theme
    exists = package.hasOwnProperty(testTheme)
  })  
  if (exists) {
    theme = testTheme
  }
  return theme
}

function getClassicTheme(package) {
  var exists = false
  var theme = undefined // default
  var testTheme = "@sencha/ext-classic-theme-"+theme
  classicThemes.forEach(theme => {
    exists = package.hasOwnProperty(testTheme)
  })  
  if (exists) {
    theme = testTheme
  }
  return theme
}

function isModern(configuration) {
  return (configuration.hasOwnProperty(extModernPackage) && !(configuration.hasOwnProperty(extClassicPackage)))
}

function isClassic(configuration) {
  return (configuration.hasOwnProperty(extClassicPackage) && !(configuration.hasOwnProperty(extModernPackage)))
}

function isUniversal(configuration) {
  return (configuration.hasOwnProperty(extModernPackage) && configuration.hasOwnProperty(extClassicPackage))
}

function isSupportDeprecatedForApplication(appPackageJSON) {
  if (isComponentsInAngular(appPackageJSON)
  || isComponentsInReact(appPackageJSON)
  || isComponentsInVue(appPackageJSON)) {
    return true
  }
  return false
}

function isComponentsInReact(configuration) {
  if (configuration.hasOwnProperty(extWCPackage)) {
    if (configuration.hasOwnProperty(extReactPackage)
    || configuration.hasOwnProperty(extReactClassicPackage)
    || configuration.hasOwnProperty(extReactModernPackage)
    || configuration.hasOwnProperty(reactPackage)
    || configuration.hasOwnProperty(extReactorPackage)) 
    {
      return true
    }
  }
  return false
}

function isComponentsInVue(configuration) {
  if (configuration.hasOwnProperty(extWCPackage)
  && configuration.hasOwnProperty(vuePackage)) {
    return true
  }
  return false
}

function isComponentsInAngular(configuration) {
  if (configuration.hasOwnProperty(extWCPackage)
  && configuration.hasOwnProperty(angularCLIPackage)) {
    return true
  }
  return false
}

function replaceIt(regex, to) {
  const replace = require('replace-in-file');
  var options = {
    files: path.join(rootDir, 'src/**/*.js'),
    from: regex,
    to: to,
  };
  try {
    var changes = replace.sync(options);
    if (changes.length > 0) {
       console.log('Modified these files containing: ' + regex.toString() + ' to ' + to);
       console.dir(changes)
    }
    return 0
  }
  catch (error) {
    console.error('Error occurred:', error);
    return -1
  }
}

function boldGreen (s) {
  var boldgreencolor = `\x1b[32m\x1b[1m`
  var endMarker = `\x1b[0m`
  return (`${boldgreencolor}${s}${endMarker}`)
}
function boldRed (s) {
  var boldredcolor = `\x1b[31m\x1b[1m`
  var endMarker = `\x1b[0m`
  return (`${boldredcolor}${s}${endMarker}`)
}

function angularValues() {
  return {
    framework: 'angular',
    contextFolder: './src',
    entryFile: './main.ts',
    outputFolder: 'build',
    rules: `[
      {test: /\.css$/, loader: ['to-string-loader', "style-loader", "css-loader"]},
      {test: /\.(png|svg|jpg|jpeg|gif)$/, use: ['file-loader']},
      {test: /\.html$/,loader: "html-loader"},
      {test: /\.ts$/,  loader: '@ngtools/webpack'}
    ]`,
    resolve:`{
      extensions: ['.ts', '.js', '.html']
    }`
  }
}

function reactValues() {
  return {
    framework: 'react',
    contextFolder: './src',
    entry: `{
      main: './index.js'
    }`,
    outputFolder: 'build',
    rules: `[
      { test: /\.ext-reactrc$/, use: 'raw-loader' },
      { test: /\.(js|jsx)$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.(html)$/,use: { loader: 'html-loader' } },
      {
        test: /\.(css|scss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]`,
    resolve:`{
      alias: {
        'react-dom': '@hot-loader/react-dom'
      }
    }`
  }
}

function reactModernValues() {
  return {
    framework: 'react',
    contextFolder: './src',
    entryFile: './index.js',
    outputFolder: 'build',
    rules: `[[
      { test: /\.ext-reactrc$/, use: 'raw-loader' },
      { test: /\.(js|jsx)$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.(html)$/,use: { loader: 'html-loader' } },
      {
        test: /\.(css|scss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]`
  }
}

function reactClassicValues() {
  return {
    framework: 'react',
    contextFolder: './src',
    entryFile: './index.js',
    outputFolder: 'build',
    rules: `[
      { test: /\.ext-reactrc$/, use: 'raw-loader' },
      { test: /\.(js|jsx)$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.(html)$/,use: { loader: 'html-loader' } },
      {
        test: /\.(css|scss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]`
  }
}
 
function extjsValues() {
  return {
    framework: 'extjs',
    contextFolder: './',
    entryFile: `./index.js`,
    outputFolder: './',
    rules: `[
      { test: /\.(js)$/, use: ['babel-loader'] }
    ]`,
    resolve:`{
    }`,
    devServer: `{
      contentBase: outputFolder,
      hot: isProd,
      historyApiFallback: true,
      host: '0.0.0.0',
      port: port,
      disableHostCheck: false,
      compress: isProd,
      inline:!isProd,
      stats: 'none'
    }`
  }
}

function componentsValues() {
  return {
    framework: 'web-components',
    contextFolder: './src',
    entryFile: './index.js',
    outputFolder: 'build',
    rules: `[
      { test: /\.(js)$/, exclude: /node_modules/,
          use: [
              'babel-loader',
              // 'eslint-loader'
          ]
      },
      { test: /\.(html)$/, use: { loader: 'html-loader' } },
      {
          test: /\.(css|scss)$/,
          use: [
              { loader: 'style-loader' },
              { loader: 'css-loader' },
              { loader: 'sass-loader' }
          ]
      }
    ]`,
    resolve:`{}`
  }
}