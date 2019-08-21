//node ./generate-ext-angular.js grid
let run = require("./util").run;
var fs = require("fs-extra");
var install = true;
var framework = "angular";
var type = process.argv[2];
let getBundleInfo = require("./getBundleInfo").getBundleInfo;
var info = getBundleInfo(framework, type)
if (info == -1) {
    return
}

var runBundle = true;

// let sencha; try { sencha = require('@sencha/cmd') } catch (e) { sencha = 'sencha' }
// if (fs.existsSync(sencha)) {
//     console.log('sencha folder exists')
// }
// else {
//     console.log('sencha folder DOES NOT exist')
// }




// function _buildExtBundle() {
//     return new Promise((resolve, reject) => {
//         setTimeout(function(){
//             onBuildDone()
//         }, 3000);

//         const onBuildDone = () => {
//         console.log('onBuildDone')
//         resolve()
//         }
//         // var opts = { cwd: outputPath, silent: true, stdio: 'pipe', encoding: 'utf-8'}
//         // _executeAsync(app, sencha, parms, opts, compilation, vars, options).then (
//         //   function() { onBuildDone() },
//         //   function(reason) { reject(reason) }
//         // )
//     });
// }

// _buildExtBundle()

//console.log('after')
//return

// if (runBundle == true) {doBundle()}

// async function doBundle() {
//     await run(`sencha`);
//     doEnd()
// }

// function doEnd() {
//     console.log('end')
// }


// return



//o.type = type;
//o.now = new Date().toString();

// var wantedxtypes = o.wantedxtypes;
// var example = o.example;
// var bundle = o.bundle;
// var Bundle = o.Bundle

//console.log(info)


var path = require("path");
require("./XTemplate");
const rimraf = require("rimraf");
const mkdirp = require("mkdirp");

var newLine = "\n";

var moduleVars = { imports: "", declarations: "", exports: "" };

var generatedFolders = "./GeneratedFolders/";
var templateBaseFolder = "./filetemplates/";
var templateToolkitFolder = path.resolve(templateBaseFolder + framework);
var allClassesFilesFolder = "./AllClassesFiles/";

if (!fs.existsSync(generatedFolders)) {
    mkdirp.sync(generatedFolders);
}

//var baseFolder = 'ext-' + framework;

var toolkitFolder = generatedFolders + "ext-" + framework + info.bundle;
var srcFolder = toolkitFolder + "/src/";
log(`srcFolder`, `${srcFolder}`);
var extFolder = toolkitFolder + "/ext/";
//var extTypeFolder = toolkitFolder + "/ext/" + info.type;

rimraf.sync(toolkitFolder);
mkdirp.sync(toolkitFolder);
mkdirp.sync(srcFolder);
mkdirp.sync(extFolder);
//mkdirp.sync(extTypeFolder);

var dataFile = `${allClassesFilesFolder}modern-all-classes-flatten.json`;
//log(`dataFile`,`${dataFile}`)
var data = require(dataFile);

writeFile(
    framework,
    "/package.tpl",
    `${toolkitFolder}/package.json`,
    {bundle: info.bundle}
);
writeFile(
    framework,
    "/README.tpl",
    `${toolkitFolder}/README.md`,
    info
);

writeFile(framework,`/manifest.tpl`,`./cmder/manifest.js`,info);
writeFile(framework,`/app.tpl`,`./cmder/app.json`,info);
// writeFile(
//     framework,
//     "/manifest.tpl",
//     `${toolkitFolder}/manifest.js`,
//     info
// );


//new way
//copyFile("ext/css.prod.js");
//copyFile("ext/ext." + info.type + ".prod.js");



//copyFile("ext/" + type + "/ext." + type + ".production.js");
copyFile("tsconfig.json");
copyFile("tsconfig.lib.json");
copyFile("ng-package.json");

//copyFile("public_api.ts");
writeFile(
    framework,
    "/public_api.tpl",
    `${toolkitFolder}/public_api.ts`,
    info
);

//*************
launch(framework, data, srcFolder, templateToolkitFolder, moduleVars);






if (install == true) {doInstall()}
async function doInstall() {

    process.chdir(`./cmder`);
    await run(`sencha app build`);
    copyFile("ext/css.prod.js");
    console.log('done with cmd')
    process.chdir(`../`);


    process.chdir(toolkitFolder);
    await run(`npm install`);
    await run(`npm run packagr`);

    // if (wantedxtypes.includes("all")) {
    //     var dest = `../../../../ext-${framework}/packages/ext-${framework}`;
    //     await run(`rm -rf ${dest}`);
    //     mkdirp.sync(`${dest}`);
    //     await run(`cp -R ./dist/. ${dest}`);
    // }
    // else {
        mkdirp.sync(`ext`);
        await run(`cp -R ./ext dist/ext`);
        process.chdir('dist');
        await run(`npm publish --force`);
        console.log(`https://sencha.myget.org/feed/early-adopter/package/npm/@sencha/ext-angular${info.bundle}/7.0.0`)
    // }
}

//*************
function launch(framework, data, srcFolder, templateToolkitFolder, moduleVars) {
    if (info.wantedxtypes.includes("all")) {
        console.log('wanted')
        moduleVars.imports =
            moduleVars.imports +
            `import { ExtAngularBootstrapComponent } from './ext-angular-bootstrap.component';${newLine}`;
        moduleVars.exports =
            moduleVars.exports + `    ExtAngularBootstrapComponent,${newLine}`;
        moduleVars.declarations =
            moduleVars.declarations +
            `    ExtAngularBootstrapComponent,${newLine}`;
        copyFile("src/ext-angular-bootstrap.component.ts");

        moduleVars.imports =
            moduleVars.imports +
            `import { ExtAngularBootstrapService } from './ext-angular-bootstrap.service';${newLine}`;
        copyFile("src/ext-angular-bootstrap.service.ts");
    }

    var num = 0;
    var items = data.global.items;
    log(`item count`, `${items.length}`);

    //log(``,`************** following items can be copy/pasted into excel (paste special... text)`)

    for (i = 0; i < items.length; i++) {
        var o = items[i];
        if (o.alias != undefined) {
            if (o.alias.substring(0, 6) == "widget") {
                var aliases = o.alias.split(",");
                for (alias = 0; alias < aliases.length; alias++) {
                    if (aliases[alias].substring(0, 6) == "widget") {
                        if (o.items != undefined) {
                            num++;
                            o.xtype = aliases[alias].substring(7);

                            if (
                                info.wantedxtypes.includes(o.xtype) ||
                                info.wantedxtypes.includes("all")
                            ) {
                                oneItem(o, framework, moduleVars);
                            }
                        } else {
                            //console.log(``,'not: ' + o.name + ' - ' + o.alias)
                        }
                    }
                }
            }
        }
    }

    //log(``,`**************`)

    moduleVars.imports = moduleVars.imports.substring(
        0,
        moduleVars.imports.length - 2
    );
    moduleVars.imports = moduleVars.imports + ";" + newLine;
    moduleVars.exports = moduleVars.exports.substring(
        0,
        moduleVars.exports.length - 2
    );
    moduleVars.exports = moduleVars.exports + "" + newLine;
    moduleVars.declarations = moduleVars.declarations.substring(
        0,
        moduleVars.declarations.length - 2
    );
    moduleVars.declarations = moduleVars.declarations + "" + newLine;

    var exportall = "";
    exportall =
        exportall + `export * from './lib/ext-${framework}.module';${newLine}`;

    // var publicApiFile = `${srcFolder}public_api.${extension}`
    // fs.writeFile(publicApiFile, doPublic_Api(exportall, templateToolkitFolder), function(err) {if(err) { return console.log(err); } });
    // log(`publicApiFile`,`${publicApiFile}`)

    //copyFile("src/base.ts");

    writeFile(
        framework,
        "/base.tpl",
        `${srcFolder}base.ts`,
        {bundle: info.bundle, name: info.bundle.substring(1)}
    );



    //var baseFile = `${srcFolder}base.${extension}`
    //fs.writeFile(baseFile, doExtBase(templateToolkitFolder), function(err) {if(err){return console.log(err);} })
    //log(`baseFile`,`${baseFile}`)

    var values = {
        Bundle: info.Bundle,
        //toolkit: toolkit.charAt(0).toUpperCase() + toolkit.slice(1),
        imports: moduleVars.imports,
        exports: moduleVars.exports,
        declarations: moduleVars.declarations
    };
    console.log(`${srcFolder}ext-${framework}${info.bundle}.module.ts`)
    writeFile(
        framework,
        "/module.tpl",
        `${srcFolder}ext-${framework}${info.bundle}.module.ts`,
        values
    );

    // var moduleFile = `${srcFolder}${baseFolder}.module.ts`
    // //var moduleFile = `${libFolder}ext-${framework}-${toolkit}.module.ts`
    // fs.writeFile(moduleFile, doModule(moduleVars), function(err) {if(err) { return console.log(err); } });
    // //log(`moduleFile`,`${moduleFile}`)
}

function copyFile(filename) {
    var from = path.resolve(
        __dirname,
        "filetemplates" + "/" + framework + "/" + filename
    );
    var to = path.resolve(__dirname, toolkitFolder + "/" + filename);

    //var from = path.resolve(templateToolkitFolder + filename)
    //var to = `${toolkitFolder}\${filename}`
    // console.log('from:')
    // console.log(from)
    // console.log('to:')
    // console.log(to)

    fs.copyFile(from, to, err => {
        if (err) throw err;
        //console.log('source.txt was copied to destination.txt');
    });
}

function writeFile(framework, tplFile, outFile, vars) {
    var templateToolkitFolder = path.resolve("./filetemplates/" + framework);
    var tpl = new Ext.XTemplate(
        fs
            .readFileSync(path.resolve(templateToolkitFolder + tplFile))
            .toString()
    );
    var t = tpl.apply(vars);
    fs.writeFileSync(outFile, t);
    delete tpl;
}

function doIndex(moduleVars) {
    var p = path.resolve(
        __dirname,
        "filetemplates/" + framework + "/index.tpl"
    );
    var content = fs.readFileSync(p).toString();
    var values = {
        imports: moduleVars.imports,
        exports: moduleVars.exports
    };
    var tpl = new Ext.XTemplate(content);
    var t = tpl.apply(values);
    delete tpl;
    return t;
}

function oneItem(o, framework, moduleVars) {
    var classname = o.xtype.replace(/-/g, "_");
    var capclassname = classname.charAt(0).toUpperCase() + classname.slice(1);
    var classFile = `${srcFolder}ext-${o.xtype}.component.ts`;
    //console.log(`${xtype}${tb}${tb}${('  ' + num).substr(-3)}_${alias}${tb}${classFile}`)
    var commaOrBlank = "";
    //var tab = "\t";
    var tab = "";

    var sMETHODS = "";
    //   var methodsArray = o.items.filter(function(obj) {return obj.$type == 'methods';});
    //   if (methodsArray.length == 1) {
    //     methodsArray[0].items.forEach(function (method, index, array) {
    getItems(o, "methods").forEach(function(method, index, array) {
        sMETHODS =
            sMETHODS +
            tab +
            tab +
            "{ name:'" +
            method.name +
            "',function: function";
        var sItems = "";
        if (method.items !== undefined) {
            var arrayLength = method.items.length;
            for (var i = 0; i < arrayLength; i++) {
                if (method.items[i].$type == "param") {
                    if (i == arrayLength - 1) {
                        commaOrBlank = "";
                    } else {
                        commaOrBlank = ",";
                    }
                    sItems = sItems + method.items[i].name + ",";
                }
            }
        }
        sItems = sItems.substring(0, sItems.length - 1);
        sMETHODS =
            sMETHODS +
            "(" +
            sItems +
            ") { return this.ext." +
            method.name +
            "(" +
            sItems +
            ") } },\n";
    });
    //}

    var sPROPERTIES = "";
    var sPROPERTIESOBJECT = "";
    var sGETSET = "";

    //   var configsArray = o.items.filter(function(obj) {return obj.$type == 'configs';});
    //   if (configsArray.length == 1) {

    var haveResponsiveConfig = false;
    getItems(o, "configs").forEach(function(config, index, array) {
        //configsArray[0].items.forEach(function (config, index, array) {
        if (config.deprecatedMessage == undefined) {
            sPROPERTIES = `${sPROPERTIES}    '${config.name}',${newLine}`;
            var type = "";
            if (config.type == undefined) {
                //log('', `${xtype}${tb}${config.name}`)
                type = "any";
            } else {
                type = config.type.replace(/"/g, "'");
            }
            if (config.name == "responsiveConfig") {
                haveResponsiveConfig = true;
            }

            var typeArray = type.split("/");
            var s = "[";
            var i = 0;
            typeArray.forEach(function(currentValue, index, arr) {
                var comma = "";
                if (i > 0) {
                    comma = ",";
                }
                i++;
                var newVal;
                if (currentValue.startsWith("Ext.")) {
                    newVal = currentValue;
                } else {
                    newVal = currentValue.toLowerCase();
                }
                s = s + `${comma}"${newVal}"`;
            });
            s = s + `]`;

            sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"${
                config.name
            }":${s},${newLine}`;
            sGETSET =
                sGETSET +
                tab +
                `get ${config.name}(){return this.getAttribute('${
                    config.name
                }')};set ${config.name}(${config.name}){this.setAttribute('${
                    config.name
                }',${config.name})}\n`;
        }
    });

    sPROPERTIES = `${sPROPERTIES}    'platformConfig',${newLine}`;
    if (haveResponsiveConfig == false) {
        sPROPERTIES = `${sPROPERTIES}    'responsiveConfig',${newLine}`;
    }
    sPROPERTIES = `${sPROPERTIES}    'align',${newLine}`;
    sPROPERTIES = `${sPROPERTIES}    'fitToParent',${newLine}`;
    sPROPERTIES = `${sPROPERTIES}    'config'${newLine}`;

    sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "platformConfig": "Object",${newLine}`;
    if (haveResponsiveConfig == false) {
        sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "responsiveConfig": "Object",${newLine}`;
    }
    sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "align": "Object",${newLine}`;
    sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "fitToParent": "Boolean",${newLine}`;
    sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "config": "Object",${newLine}`;

    var eventName = "";
    eventName = "platformConfig";
    sGETSET =
        sGETSET +
        tab +
        `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`;
    if (haveResponsiveConfig == false) {
        eventName = "responsiveConfig";
        sGETSET =
            sGETSET +
            tab +
            `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`;
    }
    eventName = "align";
    sGETSET =
        sGETSET +
        tab +
        `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`;
    eventName = "fitToParent";
    sGETSET =
        sGETSET +
        tab +
        `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`;
    eventName = "config";
    sGETSET =
        sGETSET +
        tab +
        `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`;

    //}

    var sEVENTS = "";
    var sEVENTNAMES = "";
    //   var eventsArray = o.items.filter(function(obj) {return obj.$type == 'events';});
    //   if (eventsArray.length == 1) {
    //     eventsArray[0].items.forEach(function (event, index, array) {
    getItems(o, "events").forEach(function(event, index, array) {
        if (event.name == undefined) {
            var s = event.inheritdoc;
            event.name = s.substr(s.indexOf("#") + 1);
        }
        //if (event.name == 'tap') { event.name = 'tapit' };

        var eventName = "on" + event.name;
        sGETSET =
            sGETSET +
            tab +
            `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`;

        sEVENTS =
            sEVENTS + tab + tab + "{name:'" + event.name + "',parameters:'";
        sEVENTNAMES =
            sEVENTNAMES + tab + tab + "'" + event.name + "'" + "," + newLine;
        if (event.items != undefined) {
            event.items.forEach(function(parameter, index, array) {
                if (index == array.length - 1) {
                    commaOrBlank = "";
                } else {
                    commaOrBlank = ",";
                }
                if (parameter.name == "this") {
                    parameter.name = o.xtype;
                }
                sEVENTS = sEVENTS + "" + parameter.name + commaOrBlank;
            });
        }
        sEVENTS = sEVENTS + "'}" + "," + newLine;
    });
    //}

    sEVENTS =
        sEVENTS +
        tab +
        tab +
        "{name:'" +
        "ready" +
        "',parameters:''}" +
        "" +
        newLine;
    sEVENTNAMES = sEVENTNAMES + tab + tab + "'" + "ready" + "'" + "" + newLine;
    var allClasses = "";
    allClasses =
        allClasses +
        tab +
        "'" +
        o.name +
        "'," +
        tab +
        "// xtype='" +
        classname +
        "'" +
        newLine;

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
    };

    writeFile(
        framework,
        "/class.tpl",
        `${srcFolder}ext-${o.xtype}.component.ts`,
        values
    );

    //     fs.writeFile(`${classFile}`, doClass(o.xtype, sGETSET, sMETHODS, sPROPERTIES, sPROPERTIESOBJECT, sEVENTS, sEVENTNAMES, o.name, classname, capclassname, templateToolkitFolder), function(err) {if(err) { return console.log(err); }});

    moduleVars.imports =
        moduleVars.imports +
        `import { Ext${capclassname}Component } from './ext-${
            o.xtype
        }.component';${newLine}`;
    moduleVars.exports =
        moduleVars.exports + `    Ext${capclassname}Component,${newLine}`;
    moduleVars.declarations =
        moduleVars.declarations + `    Ext${capclassname}Component,${newLine}`;

    //exportall = exportall + `export * from './lib/ext-${classname}.component';${newLine}`
}

function getItems(o, type) {
    var array = o.items.filter(function(obj) {
        return obj.$type == type;
    });
    if (array.length == 1) {
        return array[0].items;
    } else {
        return [];
    }
}

// function doClassStudio(values) {
//     var p = path.resolve(values.templateToolkitFolder + '/class.tpl')
//     var content = fs.readFileSync(p).toString()
//     // var values = {
//     //   xtype: xtype,
//     //   sGETSET: sGETSET,
//     //   sMETHODS: sMETHODS,
//     //   sPROPERTIES: sPROPERTIES,
//     //   sPROPERTIESOBJECT: sPROPERTIESOBJECT,
//     //   sEVENTS: sEVENTS,
//     //   sEVENTNAMES: sEVENTNAMES,
//     //   name: name,
//     //   capclassname: capclassname,
//     //   classname: classname
//     // }
//     console.log(values.alias)
//     var tpl = new Ext.XTemplate(content)
//     var t = tpl.apply(values)
//     delete tpl
//     return t
//    }

// function doClass(xtype, sGETSET, sMETHODS, sPROPERTIES, sPROPERTIESOBJECT, sEVENTS, sEVENTNAMES, name, classname, capclassname, templateToolkitFolder) {
//   var p = path.resolve(templateToolkitFolder + '/class.tpl')
//   var content = fs.readFileSync(p).toString()
//   var values = {
//     xtype: xtype,
//     sGETSET: sGETSET,
//     sMETHODS: sMETHODS,
//     sPROPERTIES: sPROPERTIES,
//     sPROPERTIESOBJECT: sPROPERTIESOBJECT,
//     sEVENTS: sEVENTS,
//     sEVENTNAMES: sEVENTNAMES,
//     name: name,
//     capclassname: capclassname,
//     classname: classname
//   }
//   var tpl = new Ext.XTemplate(content)
//   var t = tpl.apply(values)
//   delete tpl
//   return t
//  }

// /// <reference path="../../node_modules/@types/extjs/index.d.ts" />
// function doExtBase(templateToolkitFolder) {
//   //var p = path.resolve(__dirname, 'filetemplates/' + framework + '/base.tpl')
//   var p = path.resolve(templateToolkitFolder + '/base.tpl')
//   var content = fs.readFileSync(p).toString()
//   return content
// }

// function doBootstrapComponent(templateToolkitFolder) {
//   var p = path.resolve(templateToolkitFolder + '/ext-angular-bootstrap.component.tpl')
//   var content = fs.readFileSync(p).toString()
//   return content
// }

// function doBootstrapService(templateToolkitFolder) {
//   var p = path.resolve(templateToolkitFolder + '/ext-angular-bootstrap.service.tpl')
//   var content = fs.readFileSync(p).toString()
//   return content
// }

// function doRouter(templateToolkitFolder) {
//   var p = path.resolve(templateToolkitFolder + '/aa-router.component.tpl')
//   var content = fs.readFileSync(p).toString()
//   return content
// }

// function doPublic_Api(exportall, templateToolkitFolder) {
//   //var p = path.resolve(__dirname, 'filetemplates/' + framework + '/public_api.tpl')
//   var p = path.resolve(templateToolkitFolder + '/public_api.tpl')
//   var content = fs.readFileSync(p).toString()
//   var values = {
//     exportall: exportall
//   }
//   var tpl = new Ext.XTemplate(content)
//   var t = tpl.apply(values)
//   delete tpl
//   return t
// }

// function doModule(moduleVars) {
//   var p = path.resolve(__dirname, 'filetemplates/' + framework + '/module.tpl')
//   var content = fs.readFileSync(p).toString()
//   var values = {
//     toolkit: toolkit.charAt(0).toUpperCase() + toolkit.slice(1),
//     imports: moduleVars.imports,
//     exports: moduleVars.exports,
//     declarations: moduleVars.declarations
//   }
//   var tpl = new Ext.XTemplate(content)
//   var t = tpl.apply(values)
//   delete tpl
//   return t
//  }

// function doExtClass() {
//   return `declare var Ext: any
// import { Component } from '@angular/core';
// @Component({
//   selector: 'ext-class',
//   template: '<ng-template #dynamic></ng-template>'
// })
// export class ExtClassComponent {
//   public classname: any
//   public extend: any
//   public defineConfig: any
//   public createConfig: any
//   public ext: any
//   constructor (classname: any, extend: string, defineConfig: any, createConfig: any) {
//     if (!Ext.ClassManager.isCreated(classname)) {
//       Ext.apply(defineConfig, { extend: extend })
//       Ext.define(classname, defineConfig)
//     }
//     this.classname = classname
//     this.extend = extend
//     this.defineConfig = defineConfig
//     this.createConfig = createConfig
//     this.ext = Ext.create(classname, createConfig)
//   }
// }
// `
// }

function processArgs(framework, toolkit) {
    if (framework == undefined) {
        log(
            ``,
            `framework: ${framework} is incorrect.  should be web-components or angular`
        );
        return -1;
    }
    if (
        framework != "web-components" &&
        framework != "angular" &&
        framework != "studio"
    ) {
        log(
            ``,
            `framework: ${framework} is incorrect.  should be web-components or angular or studio`
        );
        return -1;
    }
    if (toolkit == undefined) {
        log(
            ``,
            `toolkit: ${toolkit} is incorrect.  should be modern or classic`
        );
        log(``, "node all.js modern angular");
        return -1;
    }
    if (toolkit != "modern" && toolkit != "classic") {
        log(
            ``,
            `toolkit: ${toolkit} is incorrect.  should be modern or classic`
        );
        return -1;
    }
    log(`framework`, `${framework}`);
    log(`toolkit`, `${toolkit}`);
}

function log(v, s) {
    var blanks;
    if (v == "") {
        blanks = "";
    } else {
        blanks = new Array(25 - v.length + 1).join(" ");
        blanks = blanks + ": ";
    }
    console.log(`${v}${blanks}${s}`);
}








// function getBundleInfo2(type) {
//     var o = {};
//     switch(type) {
//         case undefined:
//             o.bundle = ''
//             o.wantedxtypes = [
//                 'all'
//             ];
//             o.example =
// `all`
//             break;
//         case 'button':
//             o.bundle = '-' + type
//             o.wantedxtypes = [
//                 'button'
//             ];
//             o.example =
// `<ext-button text="hi">
// </ext-button>`
//             break;
//         case 'panel':
//             o.bundle = '-' + type
//             o.wantedxtypes = [
//                 'panel'
//             ];
//             o.example =
// `<ext-panel text="hi">
//     <div>hi</div>
// </ext-panel>`
//             break;
//         case 'grid':
//             o.bundle = '-' + type
//             o.wantedxtypes = [
//                 'grid',
//                 'column'
//             ];
//             o.example =
// `<ext-grid>
//     <ext-column>hi</ext-column>
// </ext-grid>`
//             break;
//         default:
//             console.log('not a valid bundle: ' + type)
//             return -1;
//     }
//     return o;
// }

