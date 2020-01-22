#! /usr/bin/env node
const path = require('path')
const fs = require('fs-extra')
require('./XTemplate/js')

// Packages used for determining framework environment from package.json
const extAngularPackage = "@sencha/ext-angular"
const extReactPackage = "@sencha/ext-react"
const extModernPackage = "@sencha/ext-modern"
const extClassicPackage = "@sencha/ext-classic"
const extWCPackage = "@sencha/ext-web-components"
const extGenPackage = "@sencha/ext-gen"
const extReactorPackage = "@extjs/reactor"

const reactFW = "react"
const reactModernFW = "reactModern"
const reactClassicFW = "reactClassic"
const reactorFW = "reactor"
const extJSFW = "extjs"
const angularFW = "angular"
const componentsFW = "components"
const fwSet = [
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

movetolatest()

/********** */
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

  set(packageJson, 'package.json', './', '')
  set(webpackConfigJs, 'webpack.config.js', './', 'webpack.config.js.tpl.default')
  set(babelrc, '.babelrc', './', '')
  set(indexjs, 'index.js', './src', '')
  set(themerjs, 'themer.js', './src', '')
  set(themerts, 'themer.ts', './src', '')
  set(polyfillsts, 'polyfills.ts', './src', '')


  packageJson.old = JSON.parse(fs.readFileSync(packageJson.root, {encoding: 'utf8'}))
  var o = {
    foundFramework: '',
    foundVersion: '',
    foundKey: ''
  }

  // Traverse the framework types we may find
  fwSet.forEach(framework => {
    findIt(framework, packageJson, o)
  });

  if (!doesFileExist(indexJS) && o.foundFramework == 'extjs') {
    createIndexJS();
  }

  if (o.foundFramework == '') {
    console.log(boldRed('Error: ') + 'no framework found')
    return
  }

  archive(packageJson)
  archive(webpackConfigJs)
  archive(babelrc)
  archive(indexjs)
  archive(themerjs)
  archive(themerts)
  archive(polyfillsts)
 
  var frameworkTemplateFolder = path.join(upgradeDir, o.foundFramework)
  packageJson.new = JSON.parse(fs.readFileSync(path.join(frameworkTemplateFolder, 'package.json'), {encoding: 'utf8'}))

  packageJson.upgrade = path.join(frameworkTemplateFolder, packageJson.name)
  webpackConfigJs.upgrade = path.join(frameworkTemplateFolder, webpackConfigJs.template)
  babelrc.upgrade = path.join(frameworkTemplateFolder, babelrc.name)
  indexjs.upgrade = path.join(frameworkTemplateFolder, indexjs.name)
  themerjs.upgrade = path.join(frameworkTemplateFolder, themerjs.name)
  themerts.upgrade = path.join(frameworkTemplateFolder, themerts.name)
  polyfillsts.upgrade = path.join(frameworkTemplateFolder, polyfillsts.name)


  packageJson.old.scripts = packageJson.new.scripts
  packageJson.old.devDependencies = packageJson.new.devDependencies
  packageJson.old.dependencies = packageJson.new.dependencies
  delete packageJson.old.extDefults
  fs.writeFileSync(packageJson.root, JSON.stringify(packageJson.old, null, 2));

  console.log(boldGreen('Updated ') + packageJson.root.replace(process.cwd(), ''))

  var values = {}
  switch (o.foundFramework) {
    case 'extjs':
      values = extjsValues()
      break;
    case 'react':
    case 'reactor':
      values = reactValues()
      break;
    case 'angular':
      values = angularValues()
      break;
    case 'components':
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
  }

  if ((o.foundFramework == 'components') ) {
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

  console.log("Upgrade Completed, run 'npm install' then 'npm start'")
  return
}
/***** */

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
  var v = ''
  var key = ''

  if (framework == 'reactor') {
    key = '@extjs/reactor-webpack-plugin'
  } else {
    key = '@sencha/ext-webpack-plugin'
  }

  console.log("---->>>> SEARCHING FOR FRAMEWORK: " + framework);

  if (packageJson.old.dependencies != undefined) {
    console.log("---->>>> TRAVERSING DEPENDENCIES");
    checkFrameworkOnNodeForPackage(packageJson.old.dependencies, key, framework, o)
  }

  if (packageJson.old.devDependencies != undefined) {
    console.log("---->>>> TRAVERSING DEV DEPENDENCIES");
    checkFrameworkOnNodeForPackage(packageJson.old.devDependencies, key, framework, o)
  }

  console.log("---->>>> FRAMEWORK RESULT: " + JSON.stringify(o));  
}







function checkFrameworkOnNodeForPackage(packageJsonNode, key, tryingFramework, o) {

  // Did we already find a framework? Don't bother with the rest if we did
  if (o.foundFramework) { return }

  // Verify the webpack plugin (key) exists within the package.json node
  var inDep = packageJsonNode.hasOwnProperty(key)
  var determinedFramework = ''

  // If it does exist, set the version and key (2 or 3 values stored in o variable)
  if (inDep) {
    v = packageJsonNode[key].slice(-5)
    o.foundVersion = v
    o.foundKey = key;
  }

  /**
   * Compare template dependency arrays with the customer's current array
   * in order to keep customer's custom dependencies 
   */
  switch (tryingFramework) {
    case angularFW:
      if (packageJsonNode.hasOwnProperty(extAngularPackage)
      && (packageJsonNode.hasOwnProperty(extGenPackage) == false)) 
      {
        o.foundFramework = tryingFramework
      }
    break;
    case reactFW:
    case reactorFW:
      if (packageJsonNode.hasOwnProperty(extReactPackage)) 
      {
        if (packageJsonNode.hasOwnProperty(extClassicPackage)) 
        {
          // We are inside an ExtReactClassic project
          o.foundFramework = reactClassicFW
        } else 
        {
          // We are inside an ExtReactModern project
          o.foundFramework = reactModernFW
        }
      }
    break;
    case componentsFW:
      if (packageJsonNode.hasOwnProperty(extWCPackage)) 
      {
        o.foundFramework = tryingFramework
      }
    break;
    case extJSFW:
      if (packageJsonNode.hasOwnProperty(extGenPackage)) 
      {
        o.foundFramework = tryingFramework
      }
    break;
  }
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

function extjsValues() {
  return {
    framework: 'extjs',
    contextFolder: './',
    entry: `{
      main: './app.js'
    }`,
    outputFolder: './',
    rules: `[
      { test: /.(js|jsx)$/, exclude: /node_modules/ }
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
    framework: 'components',
    contextFolder: './src',
    entryFile: './app.js',
    outputFolder: 'build',
    rules: `[
      { test: /\.ext-angularrc$/, use: 'raw-loader' },
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
    }`
  }
}