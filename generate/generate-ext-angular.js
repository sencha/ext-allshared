//node ./generate-ext-angular.js
var path = require('path')
require('./XTemplate')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
//const ncp = require('ncp').ncp
var fs = require('fs-extra')
var newLine = '\n'
//var tb = '	'

var moduleVars = {imports: '',declarations: '',exports: ''}

log(``,`\n ext-component-generator \n`)

var framework = 'angular'
var toolkit  = 'modern'


var generatedFolders      = './GeneratedFolders/';
//log(`generatedFolders`,`${generatedFolders}`)
var templateBaseFolder    = './filetemplates/';
//log(`templateBaseFolder`,`${templateBaseFolder}`)
var templateToolkitFolder = path.resolve(templateBaseFolder + framework);
 //og(`templateToolkitFolder`,`${templateToolkitFolder}`)
var allClassesFilesFolder = './AllClassesFiles/';
//log(`allClassesFilesFolder`,`${allClassesFilesFolder}`)

if (!fs.existsSync(generatedFolders)) {
  mkdirp.sync(generatedFolders)
  log(`created`,`${generatedFolders}`)
}
else {
  log(`exists`,`${generatedFolders}`)
}

//var baseFolder = 'ext-' + framework + '-' + toolkit; log(`baseFolder`,`${baseFolder}`)
var baseFolder = 'ext-' + framework;
//log(`baseFolder`,`${baseFolder}`)

var toolkitFolder = generatedFolders + baseFolder;
//log(`toolkitFolder`,`${toolkitFolder}`)
var srcFolder = toolkitFolder + '/src/';
log(`srcFolder`,`${srcFolder}`)
//var libFolder = srcFolder + 'lib/';                  log(`libFolder`,`${libFolder}`)

rimraf.sync(toolkitFolder);
//log(`deleted`,`${toolkitFolder}`)
mkdirp.sync(toolkitFolder);
//log(`created`,`${toolkitFolder}`)
mkdirp.sync(srcFolder);
//log(`created`,`${srcFolder}`)
//mkdirp.sync(libFolder);    log(`created`,`${libFolder}`)

var dataFile = `${allClassesFilesFolder}modern-all-classes-flatten.json`
//log(`dataFile`,`${dataFile}`)
var data = require(dataFile)

copyFile('package.json');
copyFile('tsconfig.json');
copyFile('tsconfig.lib.json');
copyFile('ng-package.json');
copyFile('public_api.ts');

//*************
launch(framework, data, srcFolder, templateToolkitFolder, moduleVars, baseFolder)

//npm install
//npm run packagr
//cd dist
//npm publish --force


// var val = 'copy';var str = new Array((19 - val.length) + 1).join( ' ' );
// //toFolder = path.resolve(`./../../generators/ext-${framework}-${toolkit}/src`)
// toFolder = path.resolve(`./../../generators/${baseFolder}/src`)

// log(`toFolder`,`${toFolder}`)
// rimraf.sync(toFolder);log(`deleted`,`${toFolder}`)
// log(`ncp${str}`,`from ${srcFolder} to ${toFolder}`)
// ncp(srcFolder, toFolder, function (err) {
//   if (err) {
//     return console.error(err)
//   }
//   log(``,`done`)
//  })

//*************
function launch(framework, data, srcFolder, templateToolkitFolder, moduleVars, baseFolder) {

  var extension = 'ts'

      moduleVars.imports = moduleVars.imports + `import { ExtAngularBootstrapComponent } from './ext-angular-bootstrap.component';${newLine}`
      moduleVars.exports = moduleVars.exports + `    ExtAngularBootstrapComponent,${newLine}`
      moduleVars.declarations = moduleVars.declarations + `    ExtAngularBootstrapComponent,${newLine}`

      var bootstrapComponentFile = `${srcFolder}ext-angular-bootstrap.component.${extension}`
      fs.writeFile(bootstrapComponentFile, doBootstrapComponent(templateToolkitFolder), function(err) {if(err){return console.log(err);} })
      //log(`bootstrapComponentFile`,`${bootstrapComponentFile}`);

      moduleVars.imports = moduleVars.imports + `import { ExtAngularBootstrapService } from './ext-angular-bootstrap.service';${newLine}`

      var bootstrapServiceFile = `${srcFolder}ext-angular-bootstrap.service.${extension}`
      fs.writeFile(bootstrapServiceFile, doBootstrapService(templateToolkitFolder), function(err) {if(err){return console.log(err);} })
      //log(`bootstrapServiceFile`,`${bootstrapServiceFile}`);


    var num = 0
    var items = data.global.items
    log(`item count`,`${items.length}`)

  //log(``,`************** following items can be copy/pasted into excel (paste special... text)`)

  for (i = 0; i < items.length; i++) {
    var o = items[i];
    if (o.alias != undefined) {
      if (o.alias.substring(0, 6) == 'widget') {
        var aliases = o.alias.split(",")
        for (alias = 0; alias < aliases.length; alias++) {
          if (aliases[alias].substring(0, 6) == 'widget') {
            if (o.items != undefined) {
              num++;
              o.xtype = aliases[alias].substring(7)
              oneItem(o, framework, extension, num, o.xtype, alias, moduleVars)
            }
            else {
              //console.log(``,'not: ' + o.name + ' - ' + o.alias)
            }
          }
        }
      }
    }
  }

  //log(``,`**************`)

  moduleVars.imports = moduleVars.imports.substring(0, moduleVars.imports.length - 2); moduleVars.imports = moduleVars.imports + ';' + newLine
  moduleVars.exports = moduleVars.exports.substring(0, moduleVars.exports.length - 2); moduleVars.exports = moduleVars.exports + '' + newLine
  moduleVars.declarations = moduleVars.declarations.substring(0, moduleVars.declarations.length - 2); moduleVars.declarations = moduleVars.declarations + '' + newLine

  var exportall = ''
  exportall = exportall + `export * from './lib/${baseFolder}.module';${newLine}`

    // var publicApiFile = `${srcFolder}public_api.${extension}`
    // fs.writeFile(publicApiFile, doPublic_Api(exportall, templateToolkitFolder), function(err) {if(err) { return console.log(err); } });
    // log(`publicApiFile`,`${publicApiFile}`)

    var baseFile = `${srcFolder}base.${extension}`
    fs.writeFile(baseFile, doExtBase(templateToolkitFolder), function(err) {if(err){return console.log(err);} })
    //log(`baseFile`,`${baseFile}`)

    var moduleFile = `${srcFolder}${baseFolder}.module.ts`
    //var moduleFile = `${libFolder}ext-${framework}-${toolkit}.module.ts`
    fs.writeFile(moduleFile, doModule(moduleVars), function(err) {if(err) { return console.log(err); } });
    //log(`moduleFile`,`${moduleFile}`)

}

function copyFile(filename) {
    var from = path.resolve(__dirname, 'filetemplates' + '/' + framework + '/' + filename)
    var to = path.resolve(__dirname, toolkitFolder + '/' + filename)

    //var from = path.resolve(templateToolkitFolder + filename)
    //var to = `${toolkitFolder}\${filename}`
    // console.log('from:')
    // console.log(from)
    // console.log('to:')
    // console.log(to)


    fs.copyFile(from,to, (err) => {
        if (err) throw err;
        //console.log('source.txt was copied to destination.txt');
      });


}

function writeFile(framework, tplFile, outFile, vars) {
    var templateToolkitFolder = path.resolve('./filetemplates/' + framework);
    var tpl = new Ext.XTemplate(fs.readFileSync(path.resolve(templateToolkitFolder + tplFile)).toString())
    var t = tpl.apply(vars)
    fs.writeFileSync(outFile, t);
    delete tpl;
}

function doIndex(moduleVars) {
  var p = path.resolve(__dirname, 'filetemplates/' + framework + '/index.tpl')
  var content = fs.readFileSync(p).toString()
  var values = {
    imports: moduleVars.imports,
    exports: moduleVars.exports
  }
  var tpl = new Ext.XTemplate(content)
  var t = tpl.apply(values)
  delete tpl
  return t
 }


function oneItem(o, framework, extension, num, xtype, alias, moduleVars) {

  var classname =  o.xtype.replace(/-/g, "_")
  var capclassname = classname.charAt(0).toUpperCase() + classname.slice(1)
  var classFile = `${srcFolder}ext-${o.xtype}.component.${extension}`
  //console.log(`${xtype}${tb}${tb}${('  ' + num).substr(-3)}_${alias}${tb}${classFile}`)
  var commaOrBlank = "";
  //var tab = "\t";
  var tab = "";

  var sMETHODS = "";
  var methodsArray = o.items.filter(function(obj) {return obj.$type == 'methods';});
  if (methodsArray.length == 1) {
    methodsArray[0].items.forEach(function (method, index, array) {
      sMETHODS = sMETHODS + tab + tab + "{ name:'" + method.name + "',function: function"
      var sItems =''
      if (method.items !== undefined) {
        var arrayLength = method.items.length;
        for (var i = 0; i < arrayLength; i++) {
          if (method.items[i].$type == 'param') {
            if (i == arrayLength-1){commaOrBlank= ''} else {commaOrBlank= ','};
            sItems = sItems + method.items[i].name + ','
          }
        }
      }
      sItems = sItems.substring(0, sItems.length-1);
      sMETHODS = sMETHODS + "(" + sItems + ") { return this.ext." + method.name + "(" + sItems + ") } },\n";
    });
  }

  var sPROPERTIES = "";
  var sPROPERTIESOBJECT = "";
  var sGETSET = "";

  var configsArray = o.items.filter(function(obj) {return obj.$type == 'configs';});
  if (configsArray.length == 1) {
    var haveResponsiveConfig = false
    configsArray[0].items.forEach(function (config, index, array) {
      if (config.deprecatedMessage == undefined) {
        sPROPERTIES = `${sPROPERTIES}    '${config.name}',${newLine}`
        var type = ''
        if (config.type == undefined) {
          //log('', `${xtype}${tb}${config.name}`)
          type = 'any'
        }
        else {
          type = config.type.replace(/"/g, "\'");
        }
        if (config.name == 'responsiveConfig') {
          haveResponsiveConfig = true
        }

        var typeArray = type.split("/");
        var s = '[';
        var i = 0;
        typeArray.forEach(function (currentValue,index,arr) {
            var comma = ''
            if (i > 0) {
                comma = ','
            }
            i++;
            var newVal;
            if (currentValue.startsWith("Ext.")) {
                newVal = currentValue
            }
            else {
                newVal = currentValue.toLowerCase()
            }
            s = s + `${comma}"${newVal}"`
        })
        s = s + `]`

        sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"${config.name}":${s},${newLine}`;
        sGETSET = sGETSET + tab + `get ${config.name}(){return this.getAttribute('${config.name}')};set ${config.name}(${config.name}){this.setAttribute('${config.name}',${config.name})}\n`
      }
    }
  );

    sPROPERTIES = `${sPROPERTIES}    'platformConfig',${newLine}`
    if (haveResponsiveConfig == false) {
      sPROPERTIES = `${sPROPERTIES}    'responsiveConfig',${newLine}`
    }
    sPROPERTIES = `${sPROPERTIES}    'align',${newLine}`
    sPROPERTIES = `${sPROPERTIES}    'fitToParent',${newLine}`
    sPROPERTIES = `${sPROPERTIES}    'config'${newLine}`

    sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "platformConfig": "Object",${newLine}`;
    if (haveResponsiveConfig == false) {
      sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "responsiveConfig": "Object",${newLine}`;
    }
    sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "align": "Obyect",${newLine}`;
    sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "fitToParent": "Boolean",${newLine}`;
    sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "config": "Object",${newLine}`;

    var eventName = ''
    eventName = 'platformConfig';sGETSET = sGETSET + tab + `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`
    if (haveResponsiveConfig == false) {
      eventName = 'responsiveConfig';sGETSET = sGETSET + tab + `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`
    }
    eventName = 'align';sGETSET = sGETSET + tab + `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`
    eventName = 'fitToParent';sGETSET = sGETSET + tab + `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`
    eventName = 'config';sGETSET = sGETSET + tab + `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`

  }

  var sEVENTS = "";
  var sEVENTNAMES = "";
  var eventsArray = o.items.filter(function(obj) {return obj.$type == 'events';});
  if (eventsArray.length == 1) {
    eventsArray[0].items.forEach(function (event, index, array) {
      if (event.name == undefined) {
        var s = event.inheritdoc;
        event.name = s.substr(s.indexOf('#') + 1);
      }
      //if (event.name == 'tap') { event.name = 'tapit' };

      var eventName = 'on' + event.name
      sGETSET = sGETSET + tab + `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`

      sEVENTS = sEVENTS + tab + tab + "{name:'" + event.name + "',parameters:'";
      sEVENTNAMES = sEVENTNAMES + tab + tab + "'" + event.name + "'" + "," + newLine;
      if (event.items != undefined) {
        event.items.forEach(function (parameter, index, array) {
          if (index == array.length-1){commaOrBlank= ''} else {commaOrBlank= ','};
          if (parameter.name == 'this'){ parameter.name = o.xtype };
          sEVENTS = sEVENTS + "" + parameter.name + commaOrBlank;
        });
      }
      sEVENTS = sEVENTS + "'}" + "," + newLine;
    })
  }

  sEVENTS = sEVENTS + tab + tab + "{name:'" + "ready" + "',parameters:''}" + "" + newLine;
  sEVENTNAMES = sEVENTNAMES + tab + tab + "'" + "ready" + "'" + "" + newLine;
  var allClasses = "";
  allClasses = allClasses + tab + "'" + o.name + "'," + tab + "// xtype='" + classname + "'" + newLine;

  var values = {
    alias: o.alias,
    xtype: o.xtype,
    sGETSET: sGETSET,
    sMETHODS: sMETHODS,
    sPROPERTIES: sPROPERTIES,
    sPROPERTIESOBJECT: sPROPERTIESOBJECT,
    sEVENTS: sEVENTS,
    sEVENTNAMES: sEVENTNAMES,
    name: o.name,
    classname: classname,
    capclassname: capclassname,
    templateToolkitFolder: templateToolkitFolder
  }

      fs.writeFile(`${classFile}`, doClass(o.xtype, sGETSET, sMETHODS, sPROPERTIES, sPROPERTIESOBJECT, sEVENTS, sEVENTNAMES, o.name, classname, capclassname, templateToolkitFolder), function(err) {if(err) { return console.log(err); }});

  moduleVars.imports = moduleVars.imports + `import { Ext${capclassname}Component } from './ext-${o.xtype}.component';${newLine}`
  moduleVars.exports = moduleVars.exports + `    Ext${capclassname}Component,${newLine}`
  moduleVars.declarations = moduleVars.declarations + `    Ext${capclassname}Component,${newLine}`

  //exportall = exportall + `export * from './lib/ext-${classname}.component';${newLine}`
}


function doClassStudio(values) {
    var p = path.resolve(values.templateToolkitFolder + '/class.tpl')
    var content = fs.readFileSync(p).toString()
    // var values = {
    //   xtype: xtype,
    //   sGETSET: sGETSET,
    //   sMETHODS: sMETHODS,
    //   sPROPERTIES: sPROPERTIES,
    //   sPROPERTIESOBJECT: sPROPERTIESOBJECT,
    //   sEVENTS: sEVENTS,
    //   sEVENTNAMES: sEVENTNAMES,
    //   name: name,
    //   capclassname: capclassname,
    //   classname: classname
    // }
    console.log(values.alias)
    var tpl = new Ext.XTemplate(content)
    var t = tpl.apply(values)
    delete tpl
    return t
   }

function doClass(xtype, sGETSET, sMETHODS, sPROPERTIES, sPROPERTIESOBJECT, sEVENTS, sEVENTNAMES, name, classname, capclassname, templateToolkitFolder) {
  var p = path.resolve(templateToolkitFolder + '/class.tpl')
  var content = fs.readFileSync(p).toString()
  var values = {
    xtype: xtype,
    sGETSET: sGETSET,
    sMETHODS: sMETHODS,
    sPROPERTIES: sPROPERTIES,
    sPROPERTIESOBJECT: sPROPERTIESOBJECT,
    sEVENTS: sEVENTS,
    sEVENTNAMES: sEVENTNAMES,
    name: name,
    capclassname: capclassname,
    classname: classname
  }
  var tpl = new Ext.XTemplate(content)
  var t = tpl.apply(values)
  delete tpl
  return t
 }

/// <reference path="../../node_modules/@types/extjs/index.d.ts" />
function doExtBase(templateToolkitFolder) {
  //var p = path.resolve(__dirname, 'filetemplates/' + framework + '/base.tpl')
  var p = path.resolve(templateToolkitFolder + '/base.tpl')
  var content = fs.readFileSync(p).toString()
  return content
}

function doBootstrapComponent(templateToolkitFolder) {
  var p = path.resolve(templateToolkitFolder + '/ext-angular-bootstrap.component.tpl')
  var content = fs.readFileSync(p).toString()
  return content
}

function doBootstrapService(templateToolkitFolder) {
  var p = path.resolve(templateToolkitFolder + '/ext-angular-bootstrap.service.tpl')
  var content = fs.readFileSync(p).toString()
  return content
}

function doRouter(templateToolkitFolder) {
  var p = path.resolve(templateToolkitFolder + '/aa-router.component.tpl')
  var content = fs.readFileSync(p).toString()
  return content
}

function doPublic_Api(exportall, templateToolkitFolder) {
  //var p = path.resolve(__dirname, 'filetemplates/' + framework + '/public_api.tpl')
  var p = path.resolve(templateToolkitFolder + '/public_api.tpl')
  var content = fs.readFileSync(p).toString()
  var values = {
    exportall: exportall
  }
  var tpl = new Ext.XTemplate(content)
  var t = tpl.apply(values)
  delete tpl
  return t
}

function doModule(moduleVars) {
  var p = path.resolve(__dirname, 'filetemplates/' + framework + '/module.tpl')
  var content = fs.readFileSync(p).toString()
  var values = {
    toolkit: toolkit.charAt(0).toUpperCase() + toolkit.slice(1),
    imports: moduleVars.imports,
    exports: moduleVars.exports,
    declarations: moduleVars.declarations
  }
  var tpl = new Ext.XTemplate(content)
  var t = tpl.apply(values)
  delete tpl
  return t
 }

function doExtClass() {
  return `declare var Ext: any
import { Component } from '@angular/core';
@Component({
  selector: 'ext-class',
  template: '<ng-template #dynamic></ng-template>'
})
export class ExtClassComponent {
  public classname: any
  public extend: any
  public defineConfig: any
  public createConfig: any
  public ext: any
  constructor (classname: any, extend: string, defineConfig: any, createConfig: any) {
    if (!Ext.ClassManager.isCreated(classname)) {
      Ext.apply(defineConfig, { extend: extend })
      Ext.define(classname, defineConfig)
    }
    this.classname = classname
    this.extend = extend
    this.defineConfig = defineConfig
    this.createConfig = createConfig
    this.ext = Ext.create(classname, createConfig)
  }
}
`
}

function processArgs(framework, toolkit) {
  if(framework == undefined) {
    log(``,`framework: ${framework} is incorrect.  should be web-components or angular`)
    return -1
  }
  if ((framework != 'web-components') && (framework != 'angular') && (framework != 'studio')) {
    log(``,`framework: ${framework} is incorrect.  should be web-components or angular or studio`)
    return -1
  }
  if(toolkit == undefined) {
    log(``,`toolkit: ${toolkit} is incorrect.  should be modern or classic`)
    log(``,'node all.js modern angular')
    return -1
  }
  if ((toolkit != 'modern') && (toolkit != 'classic')) {
    log(``,`toolkit: ${toolkit} is incorrect.  should be modern or classic`)
    return -1
  }
  log(`framework`,`${framework}`)
  log(`toolkit`,`${toolkit}`)
}

function log(v,s) {
  var blanks
  if (v == '') {
    blanks = ''
  }
  else {
    blanks = new Array((25 - v.length) + 1).join( ' ' )
    blanks = blanks + ': '
  }
  console.log(`${v}${blanks}${s}`)
}