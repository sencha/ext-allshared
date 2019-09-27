//node ./generate-ext-angular.js grid
const install = true;
const framework = "angular";
var extension = 'js';
if (framework == "angular") {
    extension = 'ts'
}
const newLine = "\n";
var didXtype = false

const moduleVars = { imports: "", declarations: "", exports: "" };

const run = require("./util").run;
const writeTemplateFile = require("./util").writeTemplateFile;

const fs = require("fs-extra");
const path = require("path");
const rimraf = require("rimraf");
const mkdirp = require("mkdirp");
require("./XTemplate");

const packagename = process.argv[2];
const data = require(`./AllClassesFiles/modern-all-classes-flatten.json`)
const xtypelist = require("./npmpackage/" + packagename).getXtypes();



var theType;
if (packagename == 'blank') {
    theType = ''
}
else {
    theType = '-' + packagename
}

const generatedFolders = "./GeneratedFolders/";
const templateToolkitFolder = path.resolve("./filetemplates/" + framework);
const toolkitFolder = generatedFolders + "ext-" + framework + theType + '/';
const srcFolder = toolkitFolder + "src/";
const extBinFolder = toolkitFolder + "ext/";
const docFolder = toolkitFolder + 'doc/';
const tempFolder = toolkitFolder + 'temp/';

if (!fs.existsSync(generatedFolders)) {mkdirp.sync(generatedFolders)}
rimraf.sync(toolkitFolder);
mkdirp.sync(toolkitFolder);
mkdirp.sync(srcFolder);
mkdirp.sync(extBinFolder);
mkdirp.sync(docFolder);
mkdirp.sync(tempFolder);

var Items = []
for (i = 0; i < data.global.items.length; i++) {
    launch(data.global.items[i], framework, moduleVars);
}

let getBundleInfo = require("./getBundleInfo").getBundleInfo;
var info = getBundleInfo(framework, packagename, Items)

if (info.type == 'all') {
//if (info.wantedxtypes.includes("all")) {



    // moduleVars.imports = moduleVars.imports + `import { ExtAngularBootstrapComponent } from './ext-angular-bootstrap.component';${newLine}`;
    // moduleVars.exports = moduleVars.exports + `    ExtAngularBootstrapComponent,${newLine}`;
    // moduleVars.declarations = moduleVars.declarations + `    ExtAngularBootstrapComponent,${newLine}`;
    // copyFile("src/ext-angular-bootstrap.component.ts");

    // moduleVars.imports = moduleVars.imports + `import { ExtAngularBootstrapService } from './ext-angular-bootstrap.service';${newLine}`;
    // copyFile("src/ext-angular-bootstrap.service.ts");




    fs.copySync(`${tempFolder}/Ext/`,`${srcFolder}` + "/Ext/")
    rimraf.sync(tempFolder);


}
else {
    fs.copySync(`${tempFolder}/Ext/`,`${srcFolder}` + "/Ext/")
    rimraf.sync(tempFolder);
    //writeOnlyWantedExtended(info.wantedextended)
}

info.imports = ''
fs.readdirSync(`${srcFolder}`).forEach(function(file) {
    var stat = fs.statSync(`${srcFolder}` + "/" + file);
    if (stat.isDirectory()) {return;}

    var f = file.split('.')
    var xtype = f[0].substring(4)
    if (info.wantedxtypes.indexOf(xtype) == -1) {
        fs.unlinkSync(`${srcFolder}` + "/" + file);
    }
    else {



        //moduleVars.imports = moduleVars.imports + `import './src/ext-${xtype}.component';${newLine}`;
        //info.imports = info.imports + `import './src/ext-${xtype}.component';<br/>`;


    }
});

info.includedxtypes = `<div>${newLine}`
fs.readdirSync(`${docFolder}`).forEach(function(file) {
    var f = file.split('.')
    var xtype = f[0].substring(4)
    if (info.wantedxtypes.indexOf(xtype) == -1) {
        fs.unlinkSync(`${docFolder}` + "/" + file);
    }
    else {
        info.includedxtypes = info.includedxtypes + `  <div onclick="selectDoc('${xtype}')">ext-${xtype}</div><br>${newLine}`
    }
});
info.includedxtypes = info.includedxtypes + `</div>${newLine}`







copyFile("src/Common.js");

copyFile("tsconfig.json");
copyFile("tsconfig.lib.json");
copyFile("ng-package.json");

writeTemplateFile(templateToolkitFolder+`/package.tpl`,`${toolkitFolder}/package.json`,info);
writeTemplateFile(templateToolkitFolder+`/README.tpl`,`${toolkitFolder}/README.md`,info);

info.basecode = readFile("/../common/common-base.js")
info.propscode = readFile("/../common/eng-props.js")

info.import = ``
if (info.type != 'blank') {
    info.import = `import 'script-loader!node_modules/@sencha/ext-${framework}${info.bundle}/ext/ext.${info.type}';
import 'script-loader!node_modules/@sencha/ext-${framework}${info.bundle}/ext/css.${info.type}';`
}
writeTemplateFile(templateToolkitFolder+`/eng-base.tpl`,`${srcFolder}eng-base.ts`,info);

moduleVars.Bundle = info.Bundle
console.log(moduleVars)
writeTemplateFile(templateToolkitFolder+`/module.tpl`,`${toolkitFolder}ext-${framework}${info.bundle}.module.ts`,moduleVars);
writeTemplateFile(templateToolkitFolder+`/public_api.tpl`,`${toolkitFolder}/public_api.ts`,info);

moduleVars.imports = moduleVars.imports.substring(0,moduleVars.imports.length - 2);
moduleVars.imports = moduleVars.imports + ";" + newLine;
moduleVars.exports = moduleVars.exports.substring(0,moduleVars.exports.length - 2);
moduleVars.exports = moduleVars.exports + "" + newLine;
moduleVars.declarations = moduleVars.declarations.substring(0,moduleVars.declarations.length - 2);
moduleVars.declarations = moduleVars.declarations + "" + newLine;

var exportall = "";
exportall = exportall + `export * from './lib/ext-${framework}${info.bundle}.module';${newLine}`;

//        {bundle: info.bundle, name: info.bundle.substring(1)}

// var values = {
//     Bundle: info.Bundle,
//     imports: moduleVars.imports,
//     exports: moduleVars.exports,
//     declarations: moduleVars.declarations
// };
//moduleVars.Bundle = info.Bundle;
//console.log(`${srcFolder}ext-${framework}${info.bundle}.module.ts`)


if (install == true) {doInstall()}
async function doInstall() {

    var origCwd = process.cwd();
    //oconsole.log(origCwd)
    process.chdir('./bundler');
    //console.log(process.cwd());
    var currDir = process.cwd()

    var bundle = {};
    bundle.packagename = packagename;
    bundle.creates = require("./npmpackage/" + packagename).getCreates();
    //console.log(currDir + "./npmpackage/" + packagename)

    writeTemplateFile(`./template/app.json.tpl`,`./app.json`,bundle); console.log(`app.json` + ' created');
    writeTemplateFile(`./template/package.json.tpl`,`./package.json`,bundle); console.log(`package.json` + ' created');
    writeTemplateFile(`./template/css.manifest.js.tpl`,`./manifest/${packagename}.css.manifest.js`,bundle); console.log(`manifest/${packagename}.css.manifest.js` + ' created');
    writeTemplateFile(`./template/ext.manifest.js.tpl`,`./manifest/${packagename}.ext.manifest.js`,bundle); console.log(`manifest/${packagename}.ext.manifest.js` + ' created');

    await run(`npm start`);
    console.log('./dist/css.' + packagename + '.js created')
    console.log('./dist/ext.' + packagename + '.js created')

    process.chdir(origCwd);
    const copyFileSync = require('fs-copy-file-sync');
    copyFileSync('./bundler/dist/css.' + packagename + '.js', toolkitFolder + "/ext/css." + packagename + '.js');
    copyFileSync('./bundler/dist/ext.' + packagename + '.js', toolkitFolder + "/ext/ext." + packagename + '.js');



    //console.log('done')
    //return

    // process.chdir(`./cmder`);
    // await run(`sencha app build`);
    // //copyFile("ext/css.prod.js");
    // console.log('done with cmd')
    // process.chdir(`../`);

    process.chdir(toolkitFolder);
    await run(`npm install`);

    await run(`npm run packagr`);

    mkdirp.sync(`ext`);
    await run(`cp -R ./ext dist/ext`);

    //mkdirp.sync(`lib`);
    await run(`cp -R ./src dist/lib`);

    await run(`rm -r ../../../../ext-${framework}/packages/ext-${framework}${info.bundle}`);
    await run(`cp -R ./dist ../../../../ext-${framework}/packages/ext-${framework}${info.bundle}`);

    //console.log('done')

    //return

    process.chdir('dist');

    await run(`npm publish --force`);
    console.log(`https://sencha.myget.org/feed/early-adopter/package/npm/%40sencha/ext-${framework}${info.bundle}/7.1.0`)
}

function shouldProcessIt(o) {
    var processIt = false

    // if (o.extended != undefined) {
    //     if(o.extended.indexOf("Ext.plugin.Abstract") != -1) {
    //         if (o.alias != undefined) {
    //             console.log(o.name + ' - ' + o.alias + ': ' + o.extended)
    //         }
    //     }
    // }


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


function launch(item, framework, moduleVars) {

    var processIt = shouldProcessIt(item)

    if (processIt == true) {

        var tab = "";
        var webcomponent = true

        if (item.extends != undefined) {
            var n = item.extends.indexOf(",");
            if (n != -1) {
                //console.log('mult extends: ' + item.name + ' - ' + item.extends)
                item.extends = item.extends.substr(0,n)
            }
        }

        var names = []
        names.push(item.name)
        //mjg alternate
        if (item.alternateClassNames != undefined) {
//            console.log(item.alternateClassNames)
            var alt = item.alternateClassNames.split(",");
            names = names.concat(alt)
        }


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

        var template = ''
        if (item.name == 'Ext.Base') {
            template = '/base.tpl'
        }
        else {
            template = '/class.tpl'
        }


        oneItemNew(item, framework, names, xtypes, template)

    //                         oneItem(o, framework, moduleVars);



    }



    // if (o.alias != undefined) {
    //     if (o.alias.substring(0, 6) == "widget") {
    //         var aliases = o.alias.split(",");
    //         for (alias = 0; alias < aliases.length; alias++) {
    //             if (aliases[alias].substring(0, 6) == "widget") {
    //                 if (o.items != undefined) {
    // //                           num++;
    //                     o.xtype = aliases[alias].substring(7);
    //                     o.Xtype = o.xtype.charAt(0).toUpperCase() + o.xtype.slice(1).replace(/-/g,'_');
    //                     //console.log(o.xtype)
    //                     if (
    //                         xtypelist.includes(o.xtype)
    //                         // || xtypelist.includes("all")
    //                         // info.wantedxtypes.includes(o.xtype) ||
    //                         // info.wantedxtypes.includes("all")
    //                     ) {
    //                         //console.log(o.xtypes)
    //                         oneItem(o, framework, moduleVars);
    //                     }
    //                 } else {
    //                     //console.log(``,'not: ' + o.name + ' - ' + o.alias)
    //                 }
    //             }
    //         }
    //     }
    // }
}


function oneItemNew(item, framework, names, xtypes, template) {
    var tab = '\t'
    var sGETSET = "";

    var methodObj = doMethods(item)
    var methodsDocs = methodObj.methodsDocs;
    var sMETHODS = methodObj.sMETHODS;

    var propertyObj = doProperties(item)
    var propertiesDocs = propertyObj.eventsDocs;
    var sPROPERTIES = propertyObj.sPROPERTIES;
    var sPROPERTIESOBJECT = propertyObj.sPROPERTIESOBJECT;
    var sPROPERTIESEVENTS = propertyObj.sPROPERTIESEVENTS;
    sGETSET = sGETSET + sPROPERTIESEVENTS;

    var eventObj = doEvents(item)
    var eventsDocs = eventObj.eventsDocs;
    var sEVENTS = eventObj.sEVENTS;
    var sEVENTNAMES = eventObj.sEVENTNAMES;
    var sEVENTSGETSET = eventObj.sEVENTSGETSET;
    sGETSET = sGETSET + sEVENTSGETSET;






    didXtype = false;

    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        var xtype = xtypes[0];
        //console.log(names[i] + '_' + xtype + ' xtype: ' + xtype + ' - ' + xtypes)
        //var classfilename = `${name}.Component`
        var classname = name.replace(/\./g, "_") + "_Component"
        //var classfile = `${lxibFolder}${classfilename}.${extension}`

        var folder = ''
        var filename = ''
        var parts = name.split(".")
        var thePath = ''
        var pathprefix = ''
        for (var j = 0; j < parts.length-1; j++) {
            thePath = thePath + parts[j] + '/'
            pathprefix = pathprefix + '../'
        }
        folder = `${tempFolder}${thePath}`
        if (!fs.existsSync(folder)) {mkdirp.sync(folder)}
        //console.log(folder + ': ' + parts[parts.length-1])
        filename = parts[parts.length-1]

        //var classfile = `${folder}${filename}.js`
        var extendparts = item.extends.split(".")
        var extendpath = ''
        for (var j = 0; j < extendparts.length-1; j++) {
            extendpath = extendpath + extendparts[j] + '/'
        }

        var values = {
            sPROPERTIESGETSET: sGETSET,
            sMETHODS: sMETHODS,
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
            extendsclassname: item.extends.replace(/\./g, "_") + "_Component",
            classextendsfilename: extendparts[extendparts.length-1]
        }
        //console.log(folder)
        writeFile(framework, template, `${folder}${filename}.${extension}`, values)









        for (var j = 0; j < xtypes.length; j++) {
            //for each name and each xtype
            //Items.push(new Item(xtypes[j], names[i]))
            Items.push({xtype: xtypes[j], name: names[i], extended: item.extended})
            //c.xtypenamecombo++

            var folder = '.'
            var folders = classname.split('_')
            for (var k = 0; k < folders.length-1; k++) {
                folder = folder + '/' + folders[k]
            }
            var values = {
                classname: classname,
                folder: folder,
                Xtype: xtypes[j].charAt(0).toUpperCase() + xtypes[j].slice(1).replace(/-/g,'_'),
                xtype: xtypes[j]
            }
            writeFile(framework, '/xtype.tpl', `${srcFolder}ext-${xtypes[j]}.component.${extension}`, values)














            if (didXtype == false) {
                didXtype = true
                xt = values.xtype
                if (xtypelist.includes(xt)) {

                    var classname = xt.replace(/-/g, "_");
                    var capclassname = classname.charAt(0).toUpperCase() + classname.slice(1);
                    moduleVars.imports = moduleVars.imports +`import { Ext${capclassname}Component } from './src/ext-${xt}.component';${newLine}`;
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
            writeFile(framework, '/doc.tpl', `${docFolder}ext-${xtypes[j]}.doc.html`, values3)
        }
        webcomponent = false
    }

}


function writeFile(framework, tplFile, outFile, vars) {
    //var templateToolkitFolder = path.resolve(templateToolkitFolder);
    var tpl = new Ext.XTemplate(fs.readFileSync(path.resolve(templateToolkitFolder + tplFile)).toString())
    var t = tpl.apply(vars)
    fs.writeFileSync(outFile, t);
    delete tpl;
}


function doProperties(o) {
    var tab = "";

    var sPROPERTIES = "";
    var sPROPERTIESOBJECT = "";
    var sGETSET = "";

    //   var configsArray = o.items.filter(function(obj) {return obj.$type == 'configs';});
    //   if (configsArray.length == 1) {

    var haveResponsiveConfig = false;
    var propertiesDocs = `<div class="select-div"><select id="propertiesDocs" onchange="changeProperty()" name="propertiesDocs">${newLine}`
    getItems(o, "configs").forEach(function(config, index, array) {
        propertiesDocs = propertiesDocs + `    <option value="${config.text}">${config.name}</option>${newLine}`

        if (config.from == undefined) {
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

                sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"${    config.name
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
        }
    });

    sPROPERTIES = `${sPROPERTIES}    'platformConfig',${newLine}`;
    if (haveResponsiveConfig == false) {
        sPROPERTIES = `${sPROPERTIES}    'responsiveConfig',${newLine}`;
    }
    //sPROPERTIES = `${sPROPERTIES}    'align',${newLine}`;
    sPROPERTIES = `${sPROPERTIES}    'fitToParent',${newLine}`;
    sPROPERTIES = `${sPROPERTIES}    'config'${newLine}`;

    sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "platformConfig": "Object",${newLine}`;
    if (haveResponsiveConfig == false) {
        sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "responsiveConfig": "Object",${newLine}`;
    }
    //sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "align": "Object",${newLine}`;
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
    var sEVENTS = "";
    var sEVENTNAMES = "";
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
    eventsDocs = eventsDocs + `</select></div>${newLine}`
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

    var o = {};
    o.eventsDocs = eventsDocs;
    o.sEVENTS = sEVENTS;
    o.sEVENTNAMES = sEVENTNAMES;
    o.sEVENTSGETSET = sEVENTSGETSET;
    return o;
}


function oneItem(o, framework, moduleVars) {


    var classname = o.xtype.replace(/-/g, "_");
    var capclassname = classname.charAt(0).toUpperCase() + classname.slice(1);
    var classFile = `${srcFolder}ext-${o.xtype}.component.ts`;
    //console.log(`${xtype}${tb}${tb}${('  ' + num).substr(-3)}_${alias}${tb}${classFile}`)
    var commaOrBlank = "";
    //var tab = "\t";
    var tab = "";


    var sGETSET = "";

    var methodObj = doMethods(o)
    var methodsDocs = methodObj.methodsDocs;
    var sMETHODS = methodObj.sMETHODS;

    var propertyObj = doProperties(o)
    var propertiesDocs = propertyObj.eventsDocs;
    var sPROPERTIES = propertyObj.sPROPERTIES;
    var sPROPERTIESOBJECT = propertyObj.sPROPERTIESOBJECT;
    var sPROPERTIESEVENTS = propertyObj.sPROPERTIESEVENTS;
    sGETSET = sGETSET + sPROPERTIESEVENTS;

    var eventObj = doEvents(o)
    var eventsDocs = eventObj.eventsDocs;
    var sEVENTS = eventObj.sEVENTS;
    var sEVENTNAMES = eventObj.sEVENTNAMES;
    var sEVENTSGETSET = eventObj.sEVENTSGETSET;
    sGETSET = sGETSET + sEVENTSGETSET;


    // var methodsDocs = `<div class="select-div"><select id="methodsDocs" onchange="changeMethod()" name="methodsDocs">${newLine}`
    // var sMETHODS = "";
    // getItems(o, "methods").forEach(function(method, index, array) {
    //     methodsDocs = methodsDocs + `    <option value="${method.text}">${method.name}</option>${newLine}`


    //     if (method.from == undefined) {

    //         sMETHODS = sMETHODS + tab + tab + "{ name:'" + method.name + "',function: function"
    //         // sMETHODS =
    //         //     sMETHODS +
    //         //     tab +
    //         //     tab +
    //         //     "{ name:'" +
    //         //     method.name +
    //         //     "',function: function";
    //         var sItems = "";
    //         if (method.items !== undefined) {
    //             var arrayLength = method.items.length;
    //             for (var i = 0; i < arrayLength; i++) {
    //                 if (method.items[i].$type == "param") {
    //                     if (i == arrayLength-1){commaOrBlank= ''} else {commaOrBlank= ','};
    //                     // if (i == arrayLength - 1) {
    //                     //     commaOrBlank = "";
    //                     // } else {
    //                     //     commaOrBlank = ",";
    //                     // }
    //                     sItems = sItems + method.items[i].name + ",";
    //                 }
    //             }
    //         }
    //         sItems = sItems.substring(0, sItems.length - 1);
    //         sMETHODS = sMETHODS + "(" + sItems + ") { return this.ext." + method.name + "(" + sItems + ") } },\n";

    //     }

    //     // sMETHODS =
    //     //     sMETHODS +
    //     //     "(" +
    //     //     sItems +
    //     //     ") { return this.ext." +
    //     //     method.name +
    //     //     "(" +
    //     //     sItems +
    //     //     ") } },\n";
    // });
    // methodsDocs = methodsDocs + `</select></div>${newLine}`



    // var sPROPERTIES = "";
    // var sPROPERTIESOBJECT = "";
    // var sGETSET = "";

    // //   var configsArray = o.items.filter(function(obj) {return obj.$type == 'configs';});
    // //   if (configsArray.length == 1) {

    // var haveResponsiveConfig = false;
    // getItems(o, "configs").forEach(function(config, index, array) {
    //     //configsArray[0].items.forEach(function (config, index, array) {
    //     if (config.deprecatedMessage == undefined) {
    //         sPROPERTIES = `${sPROPERTIES}    '${config.name}',${newLine}`;
    //         var type = "";
    //         if (config.type == undefined) {
    //             //log('', `${xtype}${tb}${config.name}`)
    //             type = "any";
    //         } else {
    //             type = config.type.replace(/"/g, "'");
    //         }
    //         if (config.name == "responsiveConfig") {
    //             haveResponsiveConfig = true;
    //         }

    //         var typeArray = type.split("/");
    //         var s = "[";
    //         var i = 0;
    //         typeArray.forEach(function(currentValue, index, arr) {
    //             var comma = "";
    //             if (i > 0) {
    //                 comma = ",";
    //             }
    //             i++;
    //             var newVal;
    //             if (currentValue.startsWith("Ext.")) {
    //                 newVal = currentValue;
    //             } else {
    //                 newVal = currentValue.toLowerCase();
    //             }
    //             s = s + `${comma}"${newVal}"`;
    //         });
    //         s = s + `]`;

    //         sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"${    config.name
    //         }":${s},${newLine}`;
    //         sGETSET =
    //             sGETSET +
    //             tab +
    //             `get ${config.name}(){return this.getAttribute('${
    //                 config.name
    //             }')};set ${config.name}(${config.name}){this.setAttribute('${
    //                 config.name
    //             }',${config.name})}\n`;
    //     }
    // });

    // sPROPERTIES = `${sPROPERTIES}    'platformConfig',${newLine}`;
    // if (haveResponsiveConfig == false) {
    //     sPROPERTIES = `${sPROPERTIES}    'responsiveConfig',${newLine}`;
    // }
    // sPROPERTIES = `${sPROPERTIES}    'align',${newLine}`;
    // sPROPERTIES = `${sPROPERTIES}    'fitToParent',${newLine}`;
    // sPROPERTIES = `${sPROPERTIES}    'config'${newLine}`;

    // sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "platformConfig": "Object",${newLine}`;
    // if (haveResponsiveConfig == false) {
    //     sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "responsiveConfig": "Object",${newLine}`;
    // }
    // sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "align": "Object",${newLine}`;
    // sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "fitToParent": "Boolean",${newLine}`;
    // sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}    "config": "Object",${newLine}`;

    // var eventName = "";
    // eventName = "platformConfig";
    // sGETSET =
    //     sGETSET +
    //     tab +
    //     `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`;
    // if (haveResponsiveConfig == false) {
    //     eventName = "responsiveConfig";
    //     sGETSET =
    //         sGETSET +
    //         tab +
    //         `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`;
    // }
    // eventName = "align";
    // sGETSET =
    //     sGETSET +
    //     tab +
    //     `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`;
    // eventName = "fitToParent";
    // sGETSET =
    //     sGETSET +
    //     tab +
    //     `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`;
    // eventName = "config";
    // sGETSET =
    //     sGETSET +
    //     tab +
    //     `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`;

    // //}



    // var eventsDocs = `<div class="select-div"><select id="eventsDocs" onchange="changeEvent()" name="eventsDocs">${newLine}`
    // var sEVENTS = "";
    // var sEVENTNAMES = "";
    // getItems(o, "events").forEach(function(event, index, array) {
    //     eventsDocs = eventsDocs + `    <option value="${event.text}">${event.name}</option>${newLine}`


    //     if (event.name == undefined) {
    //         var s = event.inheritdoc;
    //         event.name = s.substr(s.indexOf("#") + 1);
    //     }
    //     //if (event.name == 'tap') { event.name = 'tapit' };

    //     var eventName = "on" + event.name;
    //     sGETSET =
    //         sGETSET +
    //         tab +
    //         `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`;

    //     sEVENTS =
    //         sEVENTS + tab + tab + "{name:'" + event.name + "',parameters:'";
    //     sEVENTNAMES =
    //         sEVENTNAMES + tab + tab + "'" + event.name + "'" + "," + newLine;
    //     if (event.items != undefined) {
    //         event.items.forEach(function(parameter, index, array) {
    //             if (index == array.length - 1) {
    //                 commaOrBlank = "";
    //             } else {
    //                 commaOrBlank = ",";
    //             }
    //             if (parameter.name == "this") {
    //                 parameter.name = o.xtype;
    //             }
    //             sEVENTS = sEVENTS + "" + parameter.name + commaOrBlank;
    //         });
    //     }
    //     sEVENTS = sEVENTS + "'}" + "," + newLine;
    // });
    // eventsDocs = eventsDocs + `</select></div>${newLine}`
    // sEVENTS =
    //     sEVENTS +
    //     tab +
    //     tab +
    //     "{name:'" +
    //     "ready" +
    //     "',parameters:''}" +
    //     "" +
    //     newLine;
    // sEVENTNAMES = sEVENTNAMES + tab + tab + "'" + "ready" + "'" + "" + newLine;






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

    Items.push({xtype: o.xtype, name: o.name, extended: o.extended})

    writeTemplateFile(
        templateToolkitFolder+"/class.tpl",
        `${srcFolder}ext-${o.xtype}.component.ts`,
        values
    );

    //     fs.writeTemplateFile(`${classFile}`, doClass(o.xtype, sGETSET, sMETHODS, sPROPERTIES, sPROPERTIESOBJECT, sEVENTS, sEVENTNAMES, o.name, classname, capclassname, templateToolkitFolder), function(err) {if(err) { return console.log(err); }});


    //moduleVars.imports = moduleVars.imports +`import { Ext${capclassname}${o.Xtype}Component } from './ext-${o.xtype}.component';${newLine}`;
    moduleVars.imports = moduleVars.imports +`import { Ext${capclassname}Component } from './src/ext-${o.xtype}.component';${newLine}`;

    moduleVars.exports =
        moduleVars.exports + `    Ext${capclassname}Component,${newLine}`;
    moduleVars.declarations =
        moduleVars.declarations + `    Ext${capclassname}Component,${newLine}`;

    //exportall = exportall + `export * from './lib/ext-${classname}.component';${newLine}`
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

function readFile(file) {
    return fs.readFileSync(path.resolve(templateToolkitFolder + file)).toString()
}


function zzwriteTemplateFile(framework, tplFile, outFile, vars) {
    var templateToolkitFolder = path.resolve("./filetemplates/" + framework);
    var tpl = new Ext.XTemplate(
        fs
            .readFileSync(path.resolve(templateToolkitFolder + tplFile))
            .toString()
    );
    var t = tpl.apply(vars);
    fs.writeTemplateFileSync(outFile, t);
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

