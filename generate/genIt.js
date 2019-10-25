// node ./genIt.js ele all
// node ./genIt.js eng grid
const install = true;
const installExt = true;
const doAllinXtype = true;

//var count = 0;
//var allXtypes = '';

const shortname = process.argv[2];
var framework = '';
var extension = '';
switch (shortname) {
    case "eng":
        framework = 'angular';
        extension = 'ts';
        break;
    case "ele":
        framework = 'elements';
        extension = 'js';
        break;
    case "ewc":
        framework = 'web-components';
        extension = 'js';
        break;
    default:
        console.log('error - eng or ewc');
        return
}
const packagename = process.argv[3];
const reactPrefix = 'Ext';

var version = '7.1.0';
const run = require("./util").run;
const writeTemplateFile = require("./util").writeTemplateFile;
const copyFileSync = require('fs-copy-file-sync');
const fs = require("fs-extra");
const path = require("path");
const rimraf = require("rimraf");
const mkdirp = require("mkdirp");
require("./XTemplate");

const data = require(`./AllClassesFiles/modern-all-classes-flatten.json`);
const xtypelist = require("./npmpackage/" + packagename).getXtypes();

let getBundleInfo = require("./getBundleInfo").getBundleInfo;
var info = getBundleInfo(framework, shortname, packagename, xtypelist)

const generatedFolders = "./GeneratedFolders/";
const templateFolder = "./filetemplates/" + framework + "/";
const outputFolder = generatedFolders + "ext-" + framework + (packagename == 'blank' ? '' : '-' + packagename) + '/';
const srcFolder = outputFolder + "src/";
const srcStagingFolder = outputFolder + "srcStaging/";
const docFolder = outputFolder + 'doc/';
const docStagingFolder = outputFolder + 'docStaging/';
const binFolder = outputFolder + 'bin/';
const reactFolder = outputFolder + 'react/';
const reactStagingFolder = outputFolder + 'reactStaging/';
const reactOrigFolder = outputFolder + 'reactOrig/';
const reactOrigStagingFolder = outputFolder + 'reactOrigStaging/';
const angularFolder = outputFolder + 'angular/';
const angularStagingFolder = outputFolder + 'angularStaging/';
const extFolder = outputFolder + 'ext/';

if (!fs.existsSync(generatedFolders)) {mkdirp.sync(generatedFolders)}
rimraf.sync(outputFolder);
mkdirp.sync(outputFolder);
mkdirp.sync(srcFolder);
mkdirp.sync(srcStagingFolder);
mkdirp.sync(docFolder);
mkdirp.sync(docStagingFolder);
mkdirp.sync(binFolder);
mkdirp.sync(reactFolder);
mkdirp.sync(reactStagingFolder);
mkdirp.sync(reactOrigFolder);
mkdirp.sync(reactOrigStagingFolder);
mkdirp.sync(angularFolder);
mkdirp.sync(angularStagingFolder);
if (installExt == true) {mkdirp.sync(extFolder)}

const newLine = "\n";
var didXtype = false;
var allExtended = '';
const moduleVars = { imports: "", declarations: "", exports: "", ewcimports: "" };

var Items = [];
for (i = 0; i < data.global.items.length; i++) {
    doLaunch(data.global.items[i], framework);
}

// var allXtypesArray = allXtypes.split(",");
// let uniqueAllXtypesArray = [...new Set(allXtypesArray)];
// uniqueAllXtypesArray.splice(-1,1)
// uniqueAllXtypesArray.forEach(item => { console.log(item)})
// console.log(uniqueAllXtypesArray.length)

doPostLaunch();
if (install == true) {doInstall()}

function doLaunch(item, framework) {
    var template = ''
    if (item.name == 'Ext.Base') {
        template = '/base.tpl'
    }
    else {
        template = '/class.tpl'
    }

    var processIt = shouldProcessIt(item)
    if (processIt == true) {
        //extends??
        if (item.extends != undefined) {
            var n = item.extends.indexOf(",");
            if (n != -1) {
                //console.log('mult extends: ' + item.name + ' - ' + item.extends)
                item.extends = item.extends.substr(0,n)
            }
        }

        //names array
        var names = []
        names.push(item.name)
        //mjg alternate
        if (item.alternateClassNames != undefined) {
            var alt = item.alternateClassNames.split(",");
            names = names.concat(alt)
        }

        //xtypes array
        var aliases = []
        var xtypes = []
        if (item.alias != undefined) {
            if (item.alias.substring(0, 6) == 'widget') {
              aliases = item.alias.split(",")
              for (alias = 0; alias < aliases.length; alias++) {
                if (aliases[alias].substring(0, 6) == 'widget') {
                    var xtypelocal = aliases[alias].substring(7)
                    xtypes.push(xtypelocal)
                }
              }
            }
            else {
                //webcomponent = false
            }
        }
        else {
            //webcomponent = false
        }
        //there may be more than one
        item.xtype = xtypes[0]

        oneItem(item, framework, names, xtypes, template)
    }
}

function oneItem(item, framework, names, xtypes, template) {
    var sGETSET = "";

    var propertyObj = doProperties(item)
    var propertiesDocs = propertyObj.eventsDocs;
    var sPROPERTIES = propertyObj.sPROPERTIES;
    //var sPROPERTIESOBJECT = propertyObj.sPROPERTIESOBJECT;
    var sPROPERTIESEVENTS = propertyObj.sPROPERTIESEVENTS;
    sGETSET = sGETSET + sPROPERTIESEVENTS;
    var sPROPERTIESOBJECT = {};

    var methodObj = doMethods(item)
    var methodsDocs = methodObj.methodsDocs;
    //var sMETHODS = methodObj.sMETHODS;
    var sMETHODS = [];

    var eventObj = doEvents(item)
    var eventsDocs = eventObj.eventsDocs;
    var sEVENTS = eventObj.sEVENTS;
    var sEVENTNAMES = eventObj.sEVENTNAMES;
    var sEVENTSGETSET = eventObj.sEVENTSGETSET;
    sGETSET = sGETSET + sEVENTSGETSET;

    didXtype = false;
    for (var i = 0; i < names.length; i++) {
        var folder = ''
        var filename = ''
        var thePath = ''
        var pathprefix = ''

        var name = names[i];
        var classname = name.replace(/\./g, "_")
        var parts = name.split(".")
        for (var j = 0; j < parts.length-1; j++) {
            thePath = thePath + parts[j] + '/'
            pathprefix = pathprefix + '../'
        }
        folder = `${srcStagingFolder}${thePath}`
        if (!fs.existsSync(folder)) { mkdirp.sync(folder) }
        filename = parts[parts.length-1]
        var extendparts = item.extends.split(".")
        var extendpath = ''
        for (var j = 0; j < extendparts.length-1; j++) {
            extendpath = extendpath + extendparts[j] + '/'
        }

        var xtype = xtypes[0];
        var values = {
            shortname: info.shortname,
            Shortname: info.Shortname,
            sPROPERTIESGETSET: sGETSET,
            //sMETHODS: sMETHODS,
            sPROPERTIES: sPROPERTIES,
            sPROPERTIESOBJECT: sPROPERTIESOBJECT,
            sEVENTS: sEVENTS,
            sEVENTNAMES: sEVENTNAMES,
            sEVENTSGETSET: sEVENTSGETSET,
            //webcomponent: webcomponent,
            xtype: xtype,
            classfilename : `${name}.Component`,
            name: name,
            classname: classname,
            pathprefix: pathprefix,
            extendpath: extendpath,
            extends: item.extends,
            extendsclassname: item.extends.replace(/\./g, "_"),
            classextendsfilename: extendparts[extendparts.length-1]
        }
        writeTemplateFile(templateFolder+template, `${folder}${filename}.${extension}`, values)

        for (var j = 0; j < xtypes.length; j++) {
            //for each name and each xtype
            Items.push({xtype: xtypes[j], name: names[i], extended: item.extended})

            var folder = '.'
            var folders = classname.split('_')
            for (var k = 0; k < folders.length; k++) {
                folder = folder + '/' + folders[k]
            }
            var values = {
                classname: classname,
                doAllinXtype: doAllinXtype,
                sPROPERTIES: sPROPERTIES,
                sEVENTS: sEVENTS,
                sEVENTNAMES: sEVENTNAMES,
                folder: folder,
                Xtype: xtypes[j].charAt(0).toUpperCase() + xtypes[j].slice(1).replace(/-/g,'_'),
                xtype: xtypes[j]
            }
            writeTemplateFile(templateFolder+'xtype.tpl', `${srcStagingFolder}ext-${xtypes[j]}.component.${extension}`, values)
            writeTemplateFile(templateFolder+'react.tpl', `${reactStagingFolder}${reactPrefix}${values.Xtype}.${extension}`, values)
            writeTemplateFile(templateFolder+'react.tpl', `${reactOrigStagingFolder}${values.Xtype}.${extension}`, values)
            writeTemplateFile(templateFolder+'angular.tpl', `${angularStagingFolder}Ext${values.Xtype}.ts`, values)

            if (didXtype == false) {
                didXtype = true
                xt = values.xtype
                if (xtypelist.includes(xt)) {
                    var theNames = ""
                    names.forEach(name => theNames += name + ',')
                    allExtended = allExtended + theNames + ',' + item.extended + ',';
                    var classname = xt.replace(/-/g, "_");
                    var capclassname = classname.charAt(0).toUpperCase() + classname.slice(1);
                    moduleVars.imports = moduleVars.imports +`import { Ext${capclassname}Component } from './src/ext-${xt}.component.${extension}';${newLine}`;
                    moduleVars.exports = moduleVars.exports + `    Ext${capclassname}Component,${newLine}`;
                    moduleVars.declarations = moduleVars.declarations + `    Ext${capclassname}Component,${newLine}`;
                }
            }

            var text200 = ''; try {text200 = item.text.substring(1, 200)}catch(e) {}
            var values3 = {
                propertiesDocs: propertiesDocs,
                methodsDocs: methodsDocs,
                eventsDocs: eventsDocs,
                sPROPERTIESGETSET: sGETSET,
                sMETHODS: sMETHODS,
                sPROPERTIES: sPROPERTIES,
                sPROPERTIESOBJECT: sPROPERTIESOBJECT,
                sEVENTS: sEVENTS,
                sEVENTNAMES: sEVENTNAMES,
                sEVENTSGETSET: sEVENTSGETSET,
                classname: classname,
                folder: folder,
                Xtype: xtypes[j].charAt(0).toUpperCase() + xtypes[j].slice(1).replace(/-/g,'_'),
                xtype: xtypes[j],
                alias: item.alias,
                extend:item.extend,
                extenders:item.extenders,
                mixed:item.mixed,
                mixins:item.mixins,
                name:item.name,
                requires:item.requires,
                text:item.text,
                text200: text200,
                items:item.items,
                src:item.src
            }
            writeTemplateFile(templateFolder+'docdetail.tpl', `${docStagingFolder}ext-${xtypes[j]}.doc.html`, values3)
        }
    }
}

function shouldProcessIt(o) {
    var processIt = false

    if (o.extended == undefined) {
        //console.log(o.name + ' not a widget')
        processIt = false;
    }
    else {
        var n = o.extended.indexOf("Ext.Widget");
        if (n != -1) {
            processIt = true;
        }
        else {
            //console.log(o.name + ' not a decendant of Ext.Widget')
            processIt = false;
        }
    }
    if (o.name == 'Ext.Widget') {
        processIt = true
    }
    if (o.name == 'Ext.Evented') {
        processIt = true
    }
    if (o.name == 'Ext.Base') {
        processIt = true
    }
    if (o.items == undefined) {
        //console.log(o.name + ' has no items')
        processIt = false
    }
    return processIt
}

function doProperties(o) {
    var tab = "";

    var sPROPERTIES = `${newLine}`;
    var sPROPERTIESOBJECT = `${newLine}`;
    var sGETSET = "";

    //   var configsArray = o.items.filter(function(obj) {return obj.$type == 'configs';});
    //   if (configsArray.length == 1) {

    var haveResponsiveConfig = false;
    var propertiesDocs = `<div class="select-div"><select id="propertiesDocs" onchange="changeProperty()" name="propertiesDocs">${newLine}`
    getItems(o, "configs").forEach(function(config, index, array) {
        propertiesDocs = propertiesDocs + `    <option value="${config.text}">${config.name}</option>${newLine}`

        if (config.from == undefined || doAllinXtype == true) {
        //configsArray[0].items.forEach(function (config, index, array) {
            if (config.deprecatedMessage == undefined) {
                sPROPERTIES = `${sPROPERTIES}'${config.name}',${newLine}`;
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

                sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"${config.name}":${s},${newLine}`;
                sGETSET =
                    sGETSET +
                    tab +
                    `get ${config.name}(){return this.getAttribute('${config.name}')};
                    set ${config.name}(${config.name}){this.setAttribute('${config.name}',${config.name})}\n`;
            }
        }
    });

    sPROPERTIES = `${sPROPERTIES}'platformConfig',${newLine}`;
    if (haveResponsiveConfig == false) {
        sPROPERTIES = `${sPROPERTIES}'responsiveConfig',${newLine}`;
    }
    //sPROPERTIES = `${sPROPERTIES}'align',${newLine}`;
    sPROPERTIES = `${sPROPERTIES}'fitToParent',${newLine}`;
    sPROPERTIES = `${sPROPERTIES}'config'${newLine}`;

    sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"platformConfig": "Object",${newLine}`;
    if (haveResponsiveConfig == false) {
        sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"responsiveConfig": "Object",${newLine}`;
    }
    //sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"align": "Object",${newLine}`;
    sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"fitToParent": "Boolean",${newLine}`;
    sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"config": "Object",${newLine}`;

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

    propertiesDocs = propertiesDocs + `</select></div>${newLine}`


    var o = {};
    o.propertiesDocs = propertiesDocs;
    o.sPROPERTIES = sPROPERTIES;
    o.sPROPERTIESOBJECT = sPROPERTIESOBJECT;
    o.sGETSETPROPERTIES = sGETSET;
    return o;


}

function doMethods(o) {
    var tab = "";

    var methodsDocs = `<div class="select-div"><select id="methodsDocs" onchange="changeMethod()" name="methodsDocs">${newLine}`
    var sMETHODS = "";
    getItems(o, "methods").forEach(function(method, index, array) {
        methodsDocs = methodsDocs + `    <option value="${method.text}">${method.name}</option>${newLine}`


        if (method.from == undefined) {

            sMETHODS = sMETHODS + tab + tab + "{ name:'" + method.name + "',function: function"
            // sMETHODS =
            //     sMETHODS +
            //     tab +
            //     tab +
            //     "{ name:'" +
            //     method.name +
            //     "',function: function";
            var sItems = "";
            if (method.items !== undefined) {
                var arrayLength = method.items.length;
                for (var i = 0; i < arrayLength; i++) {
                    if (method.items[i].$type == "param") {
                        if (i == arrayLength-1){commaOrBlank= ''} else {commaOrBlank= ','};
                        // if (i == arrayLength - 1) {
                        //     commaOrBlank = "";
                        // } else {
                        //     commaOrBlank = ",";
                        // }
                        sItems = sItems + method.items[i].name + ",";
                    }
                }
            }
            sItems = sItems.substring(0, sItems.length - 1);
            sMETHODS = sMETHODS + "(" + sItems + ") { return this.ext." + method.name + "(" + sItems + ") } },\n";

        }

        // sMETHODS =
        //     sMETHODS +
        //     "(" +
        //     sItems +
        //     ") { return this.ext." +
        //     method.name +
        //     "(" +
        //     sItems +
        //     ") } },\n";
    });
    methodsDocs = methodsDocs + `</select></div>${newLine}`
    var o = {};
    o.methodsDocs = methodsDocs;
    o.sMETHODS = sMETHODS;
    return o;

}

function doEvents(o) {
    var tab = "";

    var eventsDocs = `<div class="select-div"><select id="eventsDocs" onchange="changeEvent()" name="eventsDocs">${newLine}`
    var sEVENTS = `${newLine}`;
    var sEVENTNAMES = `${newLine}`;
    var sEVENTSGETSET = "";
    getItems(o, "events").forEach(function(event, index, array) {
        eventsDocs = eventsDocs + `    <option value="${event.text}">${event.name}</option>${newLine}`


        if (event.name == undefined) {
            var s = event.inheritdoc;
            event.name = s.substr(s.indexOf("#") + 1);
        }
        //if (event.name == 'tap') { event.name = 'tapit' };

        var eventName = "on" + event.name;
        sEVENTSGETSET =
        sEVENTSGETSET +
            tab +
            `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`;

        sEVENTS =
            sEVENTS + tab + tab + "{name:'" + event.name + "',parameters:'";
        sEVENTNAMES =
            sEVENTNAMES + tab + tab + "'" + event.name + "'" + "," + newLine;

        //if (event.name == 'tap') { console.log(event.items) };



        if (event.items != undefined) {
            event.items.forEach(function(parameter, index, array) {
                if (index == array.length - 1) {
                    commaOrBlank = "";
                } else {
                    commaOrBlank = ",";
                }
                if (parameter.name == "this") {
                    //if (event.name == 'tap') { console.log(o) };
                    parameter.name = o.xtype;
                }
                sEVENTS = sEVENTS + "" + parameter.name + commaOrBlank;
            });
        }
        sEVENTS = sEVENTS + "'}" + "," + newLine;
    });
    eventsDocs = eventsDocs + `</select></div>${newLine}`
    sEVENTS = sEVENTS + "{name:'" +"ready" +"',parameters:''}" +"" +newLine;
    sEVENTNAMES = sEVENTNAMES + "'" + "ready" + "'" + "" + newLine;

    var o = {};
    o.eventsDocs = eventsDocs;
    o.sEVENTS = sEVENTS;
    o.sEVENTNAMES = sEVENTNAMES;
    o.sEVENTSGETSET = sEVENTSGETSET;
    return o;
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

function readFile(file) {
    return fs.readFileSync(path.resolve(templateFolder + file)).toString()
}

function doPostLaunch() {


    // let getBundleInfo = require("./getBundleInfo").getBundleInfo;
    // var info = getBundleInfo(framework, shortname, packagename, xtypelist)

    //copy xtypes from staging to src
    fs.readdirSync(`${srcStagingFolder}`).forEach(function(file) {
        var stat = fs.statSync(`${srcStagingFolder}` + "/" + file);
        if (stat.isDirectory()) {return;}

        var f = file.split('.')
        var xtype = f[0].substring(4)
        if (info.wantedxtypes.indexOf(xtype) != -1) {
            var Xtype = xtype.charAt(0).toUpperCase() + xtype.slice(1).replace(/-/g,'_');
            var reactFrameworkFile = `${reactPrefix}${Xtype}`
            var reactOrigFrameworkFile = `${Xtype}`
            var angularFrameworkFile = `Ext${Xtype}`
            fs.copySync(`${reactStagingFolder}/${reactFrameworkFile}.${extension}`,`${reactFolder}/${reactFrameworkFile}.${extension}`)

            fs.copySync(`${reactOrigStagingFolder}/${reactOrigFrameworkFile}.${extension}`,`${reactOrigFolder}/${reactOrigFrameworkFile}.${extension}`)

            fs.copySync(`${angularStagingFolder}/${angularFrameworkFile}.ts`,`${angularFolder}/${angularFrameworkFile}.ts`)
            fs.copySync(`${srcStagingFolder}/${file}`,`${srcFolder}/${file}`)
            moduleVars.ewcimports = moduleVars.ewcimports + `import './src/ext-${xtype}.component.${extension}';${newLine}`;
        }
    });

    info.includedxtypes = `<div>${newLine}`
    fs.readdirSync(`${docStagingFolder}`).forEach(function(file) {
        var f = file.split('.')
        var xtype = f[0].substring(4)
        if (file == 'docdetail.html' || file == 'doc.html' || file == 'docstyle.css') { return }
        if (info.wantedxtypes.indexOf(xtype) != -1) {
            fs.copySync(`${docStagingFolder}/${file}`,`${docFolder}/${file}`)
            info.includedxtypes = info.includedxtypes + `  <div onclick="selectDoc('${xtype}')">ext-${xtype}</div><br>${newLine}`
        }
    });
    info.includedxtypes = info.includedxtypes + `</div>${newLine}`
    writeTemplateFile(templateFolder+'doc.tpl', `${docFolder}doc.html`, info)
    writeTemplateFile(templateFolder+'docstyle.tpl', `${docFolder}docstyle.css`, info)

    writeTemplateFile(templateFolder+`package.tpl`,`${outputFolder}package.json`,info);
    writeTemplateFile(templateFolder+`README.tpl`,`${outputFolder}README.md`,info);
    writeTemplateFile(templateFolder+`index.tpl`,`${outputFolder}index.html`,info);
    //info.basecode = readFile("/../common/common-base.js")
    //info.propscode = readFile(`/../common/${shortname}-props.js`)
    //writeTemplateFile(templateFolder+`ext-${framework}.tpl`,`${outputFolder}bin/ext-${framework}${info.bundle}.js`,info);

    if (framework == 'web-components') {
        info.basecode = readFile("/../common/common-base.js")
        info.propscode = readFile(`/../common/${shortname}-props.js`)
        writeTemplateFile(templateFolder+`ext-${framework}.tpl`,`${outputFolder}bin/ext-${framework}${info.bundle}.js`,info);
        copyFileSync(templateFolder+`HTMLParsedElement.js`, outputFolder+`src/HTMLParsedElement.js`);

        copyFileSync(templateFolder+`ElementCell.js`, outputFolder+`src/ElementCell.js`);
        copyFileSync(templateFolder+`reactify.js`, outputFolder+`react/reactify.js`);
        copyFileSync(templateFolder+`ReactCell.js`, outputFolder+`react/ReactCell.js`);
        copyFileSync(templateFolder+`reactify.js`, outputFolder+`reactOrig/reactify.js`);
        copyFileSync(templateFolder+`ReactCell.js`, outputFolder+`reactOrig/ReactCell.js`);
        copyFileSync(templateFolder+`angularify.ts`, outputFolder+`angular/angularify.ts`);
        copyFileSync(templateFolder+`util.js`, outputFolder+`src/util.js`);
        copyFileSync(templateFolder+`.babelrc`, outputFolder+`.babelrc`);
        writeTemplateFile(templateFolder+'module.tpl', `${outputFolder}ext-${framework}${info.bundle}.module.js`, moduleVars);
        writeTemplateFile(templateFolder+'router.tpl', `${srcFolder}ext-router.component.js`, {});
    }
    else if (framework == 'elements') {
        writeTemplateFile(templateFolder+`ext-${framework}.tpl`,`${outputFolder}bin/ext-${framework}${info.bundle}.js`,info);
        copyFileSync(templateFolder+`HTMLParsedElement.js`, outputFolder+`src/HTMLParsedElement.js`);
        copyFileSync(templateFolder+`ElementCell.js`, outputFolder+`src/ElementCell.js`);
        copyFileSync(templateFolder+`reactify.js`, outputFolder+`react/reactify.js`);
        copyFileSync(templateFolder+`ReactCell.js`, outputFolder+`react/ReactCell.js`);
        copyFileSync(templateFolder+`reactify.js`, outputFolder+`reactOrig/reactify.js`);
        copyFileSync(templateFolder+`ReactCell.js`, outputFolder+`reactOrig/ReactCell.js`);
        copyFileSync(templateFolder+`angularify.ts`, outputFolder+`angular/angularify.ts`);
        copyFileSync(templateFolder+`util.js`, outputFolder+`src/util.js`);
        copyFileSync(templateFolder+`.babelrc`, outputFolder+`.babelrc`);
        writeTemplateFile(templateFolder+'module.tpl', `${outputFolder}ext-${framework}${info.bundle}.module.js`, moduleVars);
        writeTemplateFile(templateFolder+'router.tpl', `${srcFolder}ext-router.component.js`, {});
    }
    else if (framework == 'angular') {
        info.basecode = readFile("/../common/common-base.js")
        info.propscode = readFile(`/../common/${shortname}-props.js`)
        writeTemplateFile(templateFolder+`ext-${framework}.tpl`,`${outputFolder}bin/ext-${framework}${info.bundle}.js`,info);

        moduleVars.Bundle = info.Bundle
        writeTemplateFile(templateFolder+`module.tpl`,`${outputFolder}ext-${framework}${info.bundle}.module.ts`,moduleVars);
        writeTemplateFile(templateFolder+`public_api.tpl`,`${outputFolder}/public_api.ts`,info);
        copyFileSync(templateFolder+`tsconfig.json`, outputFolder+`tsconfig.json`);
        copyFileSync(templateFolder+`tsconfig.lib.json`, outputFolder+`tsconfig.lib.json`);
        copyFileSync(templateFolder+`ng-package.json`, outputFolder+`ng-package.json`);
        moduleVars.imports = moduleVars.imports.substring(0,moduleVars.imports.length - 2);
        moduleVars.imports = moduleVars.imports + ";" + newLine;
        moduleVars.exports = moduleVars.exports.substring(0,moduleVars.exports.length - 2);
        moduleVars.exports = moduleVars.exports + "" + newLine;
        moduleVars.declarations = moduleVars.declarations.substring(0,moduleVars.declarations.length - 2);
        moduleVars.declarations = moduleVars.declarations + "" + newLine;
        var exportall = "";
        exportall = exportall + `export * from './lib/ext-${framework}${info.bundle}.module';${newLine}`;
    }

//     info.import = ``
//     if (info.type != 'blank') {
//         if (installExt == true) {
//             info.import =
// `import 'script-loader!../ext/ext.${info.type}';
// import 'script-loader!../ext/css.${info.type}';`
// //            info.import =
// //`import 'script-loader!node_modules/@sencha/ext-${framework}${info.bundle}/ext/ext.${info.type}';
// //import 'script-loader!node_modules/@sencha/ext-${framework}${info.bundle}/ext/css.${info.type}';`
//         }
//    }
    writeTemplateFile(templateFolder+`${info.shortname}-base.tpl`,`${srcFolder}${info.shortname}-base.${extension}`,info);

    //copy staging Ext folder to src Ext
    var allExtendedArray = allExtended.split(",");
    let uniqueAllExtendedArray = [...new Set(allExtendedArray)];
    uniqueAllExtendedArray.forEach((extended) => {
        if (extended == '') { return }
        var folder = ''
        var fromFolder = ''
        var toFolder = ''
        var parts = extended.split(".")
        var thePath = ''
        var pathprefix = ''
        for (var j = 0; j < parts.length-1; j++) {
            thePath = thePath + parts[j] + '/'
            pathprefix = pathprefix + '../'
        }
        folder = `${srcFolder}${thePath}`
        if (!fs.existsSync(folder)) {mkdirp.sync(folder)}
        filename = parts[parts.length-1]
        fromFolder = `${srcStagingFolder}${thePath}${filename}.${extension}`
        toFolder = `${srcFolder}${thePath}${filename}.${extension}`
        copyFileSync(fromFolder, toFolder);
    })

    writeTemplateFile(templateFolder+'ExtReact.tpl', `${srcFolder}ext-react.component.${extension}`, {})
    writeTemplateFile(templateFolder+'ExtReactRenderer.tpl', `${srcFolder}ext-react-renderer.component.${extension}`, {})

    writeTemplateFile(templateFolder+'reactExtReact.tpl', `${reactFolder}ExtReact.${extension}`, {})
    writeTemplateFile(templateFolder+'reactExtReactRenderer.tpl', `${reactFolder}ExtReactRenderer.${extension}`, {})

    writeTemplateFile(templateFolder+'reactExtReact.tpl', `${reactOrigFolder}ExtReact.${extension}`, {})
    writeTemplateFile(templateFolder+'reactExtReactRenderer.tpl', `${reactOrigFolder}ExtReactRenderer.${extension}`, {})



    rimraf.sync(reactStagingFolder);
    rimraf.sync(reactOrigStagingFolder);
    rimraf.sync(angularStagingFolder);
    rimraf.sync(srcStagingFolder);
    rimraf.sync(docStagingFolder);
}

async function doInstall() {

    var origCwd = process.cwd();

    if (packagename != 'blank') {
        if (installExt == true) {
            process.chdir('./bundler');
            var currDir = process.cwd()

            var bundle = {};
            bundle.packagename = packagename;
            bundle.creates = require("./npmpackage/" + packagename).getCreates();

            writeTemplateFile(`./template/app.json.tpl`,`./app.json`, bundle);
            //console.log(`app.json` + ' created');
            writeTemplateFile(`./template/package.json.tpl`,`./package.json`, bundle);
            //console.log(`package.json` + ' created');
            writeTemplateFile(`./template/css.manifest.js.tpl`,`./manifest/${packagename}.css.manifest.js`, bundle);
            //console.log(`manifest/${packagename}.css.manifest.js` + ' created');
            writeTemplateFile(`./template/ext.manifest.js.tpl`,`./manifest/${packagename}.ext.manifest.js`, bundle);
            //console.log(`manifest/${packagename}.ext.manifest.js` + ' created');

            await run(`npm start`);
            console.log('./dist/css.' + packagename + '.js created')
            console.log('./dist/ext.' + packagename + '.js created')

            process.chdir(origCwd);
            //console.log(process.cwd())

            copyFileSync('./bundler/dist/css.' + packagename + '.js', extFolder + "css." + packagename + '.js');
            copyFileSync('./bundler/dist/ext.' + packagename + '.js', extFolder + "ext." + packagename + '.js');
        }
    }

    process.chdir(outputFolder);
    await run(`npm install`);

    var packagefolder = ''
    if (framework == 'angular') {
        await run(`npm run packagr`);
        await run(`cp -R ./src dist/lib`);
        if (packagename != 'blank') {
            if (installExt == true) {
                await run(`cp -R ./ext dist/ext`);
            }
        }
        process.chdir('dist');
        packagefolder = 'dist';
    }
    await run(`npm publish --force`);

    if (framework == 'angular') {
        process.chdir('../');
    }
    var suffix = packagename == 'blank' ? '' : '-' + packagename
    //console.log(process.cwd())
    await run(`rm -r ../../../../ext-${framework}/packages/ext-${framework}${suffix}`);
    await run(`cp -R ./${packagefolder} ../../../../ext-${framework}/packages/ext-${framework}${suffix}`);

    console.log(`https://sencha.myget.org/feed/early-adopter/package/npm/%40sencha/ext-${framework}${suffix}/${version}`)
}

