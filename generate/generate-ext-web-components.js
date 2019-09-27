//node ./generate-ext-web-components.js grid
var framework = 'web-components';
var install = true;
let run = require("./util").run;
let writeTemplateFile = require("./util").writeTemplateFile;
let templateFolder = "./filetemplates/";

require("./XTemplate");
const fs = require("fs-extra");
const path = require("path");
const rimraf = require("rimraf");
const mkdirp = require("mkdirp");

const newLine = '\n';
const data = require(`./AllClassesFiles/modern-all-classes-flatten.json`)

var type = process.argv[2];
var packagename = process.argv[2];

var xtypelist = require("./npmpackage/" + packagename).getXtypes();

var moduleVars = { imports: "", declarations: "", exports: "" };

const generatedFolders = './GeneratedFolders/';
if (!fs.existsSync(generatedFolders)) {mkdirp.sync(generatedFolders)}

var theType;
if (type == 'blank') {
    theType = ''
}
else {
    theType = '-' + type
}

const toolkitFolder = generatedFolders + "ext-" + framework + theType + '/';
const srcFolder = toolkitFolder + 'src/';
var extBinFolder = toolkitFolder + "ext/";
const docFolder = toolkitFolder + 'doc/';
const tempFolder = toolkitFolder + 'temp/';

const extFolder = tempFolder + 'Ext/';
const binFolder = toolkitFolder + 'bin/';


rimraf.sync(toolkitFolder);
mkdirp.sync(toolkitFolder);
mkdirp.sync(srcFolder);
mkdirp.sync(extBinFolder);
mkdirp.sync(docFolder);
mkdirp.sync(tempFolder);

mkdirp.sync(extFolder);
mkdirp.sync(binFolder);

var templateToolkitFolder = path.resolve('./filetemplates/' + framework);

var didXtype = false

var Items = []
for (i = 0; i < data.global.items.length; i++) {
    doNewApproach(data.global.items[i], framework, srcFolder);
}

let getBundleInfo = require("./getBundleInfo").getBundleInfo;
var info = getBundleInfo(framework, type, Items)

if (info.type == 'all') {
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
        moduleVars.imports = moduleVars.imports + `import './src/ext-${xtype}.component';${newLine}`;
        info.imports = info.imports + `import './src/ext-${xtype}.component';<br/>`;
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

//copyFile("ext/css.prod.js");
//mjg ???
copyFile("src/HTMLParsedElement.js");
//copyFile("src/Common.js");
copyFile('.babelrc');

writeFile(framework,`/ext-web-components.tpl`,`${toolkitFolder}bin/ext-web-components${info.bundle}.js`,info);
//writeFile(framework,`/manifest.tpl`,`./cmder/manifest.js`,info);
//writeFile(framework,`/app.tpl`,`./cmder/app.json`,info);
writeFile(framework,`/package.tpl`,`${toolkitFolder}package.json`,info);
writeFile(framework,`/README.tpl`,`${toolkitFolder}/README.md`,info);

info.basecode = readFile("/../common/common-base.js")
info.propscode = readFile("/../common/ewc-props.js")


info.import = ``
if (info.type != 'blank') {
    info.import = `import 'script-loader!node_modules/@sencha/ext-${framework}${info.bundle}/ext/ext.${info.type}';
import 'script-loader!node_modules/@sencha/ext-${framework}${info.bundle}/ext/css.${info.type}';`
}
writeTemplateFile(templateFolder+framework+`/ewc-base.tpl`,`${srcFolder}ewc-base.component.js`,info);
//writeFile(framework, '/ewc-base.tpl', `${lxibFolder}ewc-base.component.js`, info);

writeFile(framework, '/module.tpl', `${toolkitFolder}ext-${framework}${info.bundle}.module.js`, moduleVars);

writeFile(framework, '/router.tpl', `${srcFolder}ext-router.component.js`, {});
writeFile(framework, '/index.tpl', `${docFolder}docs.html`, info);
writeFile(framework, '/style.tpl', `${docFolder}style.css`, {});

//allXtypes = allXtypes + `</div>${newLine}`

if (install == true) {doInstall()}
async function doInstall() {

    var origCwd = process.cwd();
    console.log(origCwd)
    process.chdir('./bundler');
    console.log(process.cwd());
    var currDir = process.cwd()

    var bundle = {};
    bundle.packagename = packagename;
    bundle.creates = require("./npmpackage/" + packagename).getCreates();
    console.log(currDir + "./npmpackage/" + packagename)

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


    // console.log(info.bundle)
    // if (info.bundle != '') {
    //     process.chdir(`./cmder`);
    //     await run(`sencha app build`);
    //     //copyFile("ext/css.prod.js");
    //     console.log('done with cmd')
    //     process.chdir(`../`);

    //    // process.chdir(toolkitFolder);
    //    // await run(`npm install`);
    // }
    // else {
    //     //process.chdir(toolkitFolder);
    // }

    process.chdir(toolkitFolder);
    await run(`npm install`);

    mkdirp.sync(`ext`);
    await run(`cp -R ./ext dist/ext`);

    await run(`rm -r ../../../../ext-${framework}/packages/ext-${framework}${info.bundle}`);
    await run(`cp -R ./ ../../../../ext-${framework}/packages/ext-${framework}${info.bundle}`);

    await run(`npm publish --force`);
    console.log(`https://sencha.myget.org/feed/early-adopter/package/npm/%40sencha/ext-${framework}${info.bundle}/7.1.0`)
}


function writeOnlyWantedExtended(wantedextended) {
    //console.log(wantedextended)
    var _ = require('lodash');
    var a = []
    for (item = 0; item < wantedextended.length; item++) {
        //console.log(wantedextended[item])
        var w = wantedextended[item].split(',')
        a = a.concat(w)
    }

    //console.log(a)
    var u = _.uniq(a);
    for (item = 0; item < u.length; item++) {
        var folder = u[item].replace(/\./g, "/");
        //console.log(folder)
        try {
        fs.copySync(`${tempFolder}` + "" + folder + '.js',`${srcFolder}` + "" + folder + '.js')
        }
        catch (e) {
            console.log(e.toString())
        }
    }
    rimraf.sync(tempFolder);
}


function oneItem(item, framework, names, xtypes, template) {

    var tab = '\t'




        var sPROPERTIES = ''
        var sPROPERTIESOBJECT = ''
        var sPROPERTIESGETSET = ''
        var propertiesDocs = `<div class="select-div"><select id="propertiesDocs" onchange="changeProperty()" name="propertiesDocs">${newLine}`
        getItems(item,'configs').forEach(function (config, index, array) {
            propertiesDocs = propertiesDocs + `    <option value="${config.text}">${config.name}</option>${newLine}`

            if (config.from == undefined) {
            //console.log(config.name + ' - ' + config.type)
            if (config.deprecatedMessage == undefined) {
                var type = ''
                if (config.type == undefined) {
                    type = 'any'
                }
                else {
                    type = config.type.replace(/"/g, "\'");
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

                sPROPERTIES = `${sPROPERTIES}    '${config.name}',${newLine}`
                sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"${config.name}":${s},${newLine}`;
                sPROPERTIESGETSET = sPROPERTIESGETSET + `get ${config.name}(){return this.getAttribute('${config.name}')};set ${config.name}(${config.name}){this.setAttribute('${config.name}',${config.name})}\n`
                }
            }
        })
        propertiesDocs = propertiesDocs + `</select></div>${newLine}`




        var methodsDocs = `<div class="select-div"><select id="methodsDocs" onchange="changeMethod()" name="methodsDocs">${newLine}`
        var sMETHODS = "";
        getItems(item,'methods').forEach(function (method, index, array) {
            methodsDocs = methodsDocs + `    <option value="${method.text}">${method.name}</option>${newLine}`

            if (method.from == undefined) {
                //console.log(method.name + ' - ' + method.from)
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
            }
        });
        methodsDocs = methodsDocs + `</select></div>${newLine}`




        var eventsDocs = `<div class="select-div"><select id="eventsDocs" onchange="changeEvent()" name="eventsDocs">${newLine}`
        var sEVENTS = "";
        var sEVENTNAMES = "";
        var sEVENTGETSET = ''
        getItems(item,'events').forEach(function (event, index, array) {
            eventsDocs = eventsDocs + `    <option value="${event.text}">${event.name}</option>${newLine}`

            if (event.from == undefined) {
                var eventName = 'on' + event.name
                sEVENTGETSET = sEVENTGETSET + `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`

                sEVENTS = sEVENTS + tab + tab + "{name:'" + event.name + "',parameters:'";
                sEVENTNAMES = sEVENTNAMES + tab + tab + "'" + event.name + "'" + "," + newLine;
                if (event.items != undefined) {
                    event.items.forEach(function (parameter, index, array) {
                        if (index == array.length-1){commaOrBlank= ''} else {commaOrBlank= ','};
                        if (parameter.name == 'this'){ parameter.name = item.xtype };
                        sEVENTS = sEVENTS + "" + parameter.name + commaOrBlank;
                    });
                }
                sEVENTS = sEVENTS + "'}" + "," + newLine;
            }
        })
        eventsDocs = eventsDocs + `</select></div>${newLine}`




        didXtype = false
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
            //var classextendsfilename = item.extends + ".Component"
            //var classextendsfilename = extendparts[extendparts.length-1]
            //var extendsclassname = item.extends.replace(/\./g, "_") + "_Component"



            // if (
            //     //xtype == 'lockedgrid' ||
            //     //xtype == 'lockedgridregion' ||
            //     xtype == 'column' ||
            //     xtype == 'gridcolumn' ||
            //     xtype == 'templatecolumn'
            //     //xtype == 'tree'
            // ) {
            //     console.log(xtype)
            //     console.log(xtypes)
            //     console.dir(extendpath)
            //     console.log(item.extends.replace(/\./g, "_") + "_Component")
            // }
            // //{pathprefix}{extendpath}{classextendsfilename}


            var values = {
                sPROPERTIESGETSET: sPROPERTIESGETSET,
                sMETHODS: sMETHODS,
                sPROPERTIES: sPROPERTIES,
                sPROPERTIESOBJECT: sPROPERTIESOBJECT,
                sEVENTS: sEVENTS,
                sEVENTNAMES: sEVENTNAMES,
                sEVENTGETSET: sEVENTGETSET,
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

            //classextendsfilename: extendparts[extendparts.length-1]


            //console.log(`${folder}${filename}.js`)


            writeFile(framework, template, `${folder}${filename}.js`, values)


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
                writeFile(framework, '/xtype.tpl', `${srcFolder}ext-${xtypes[j]}.component.js`, values)




                if (didXtype == false) {
                    //console.log(`${values.xtype} ${didXtype}`)
                    //                    `import { Ext${values.Xtype}Component } from './lib/ext-${values.xtype}.component';${newLine}`;

                   // moduleVars.imports = moduleVars.imports + `import './lib/ext-${values.xtype}.component';${newLine}`;
                    //c.unique = c.unique + 1
                    didXtype = true



                    xt = values.xtype
                    //console.log(name + "; \t\t"  + xt)

                    // if (name.toLowerCase().includes('calendar')) {c.calendar++}
                    // else if (xt.includes('field')) {c.field++}
                    // else if (xt.includes('trigger')) {c.trigger++}
                    // //else if (xt.includes('column')) {c.column++;}//console.log(name + "; \t\t"  + xt)}
                    // else if (xt.includes('sparkline')) {c.sparkline++}
                    // else if (xt.includes('d3')) {c.d3++}
                    // else if (xt.includes('picker')) {c.picker++}
                    // else if (xt.includes('pivot')) {c.pivot++}
                    // else if (xt.includes('menu')) {c.menu++}
                    // else if (name.toLowerCase().includes('ext.grid')) {c.grid++}//;console.log("'" + xt + "',")}
                    // else if (xt.includes('list')) {c.list++}
                    // else if (xt.includes('row')) {c.row++}
                    // else if (name.includes('field')) {c.field++}
                    // else if (name.toLowerCase().includes('panel')) {c.panel++}
                    // else if (name.includes('chart')) {c.chart++}
                    // else if (name.includes('dataview')) {c.dataview++}
                    // else if (name.toLowerCase().includes('button')) {c.button++}
                    // else if (name.includes('slider')) {c.slider++}
                    // else if (name.includes('tab')) {c.tab++}
                    // else if (name.includes('draw')) {c.draw++}
                    // else {
                    //     c.other++;
                    //     //console.log(name + "; \t\t"  + xt)
                    // }




                }

                var text200 = ''; try {text200 = item.text.substring(1, 200)}catch(e) {}

                var values3 = {
                    propertiesDocs: propertiesDocs,
                    methodsDocs: methodsDocs,
                    eventsDocs: eventsDocs,
                    sPROPERTIESGETSET: sPROPERTIESGETSET,
                    sMETHODS: sMETHODS,
                    sPROPERTIES: sPROPERTIES,
                    sPROPERTIESOBJECT: sPROPERTIESOBJECT,
                    sEVENTS: sEVENTS,
                    sEVENTNAMES: sEVENTNAMES,
                    sEVENTGETSET: sEVENTGETSET,
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
                //imports.push(`import '@sencha/ext-web-components/lib/ext-${xtypes[j]}.component';`)
                //allXtypes = allXtypes + `  <div onclick="selectDoc('${xtypes[j]}')">ext-${xtypes[j]}</div><br>${newLine}`
            }
            webcomponent = false
        }
}


function doNewApproach(item, framework, srcFolder) {
    //c.all++
    var template = ''
    if (item.name == 'Ext.Base') {
        template = '/base.tpl'
    }
    else {
        template = '/class.tpl'
    }




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


        oneItem(item, framework, names, xtypes, template)
    }
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

function getItems(o, type) {
    var array = o.items.filter(function(obj) {return obj.$type == type;});
    if (array.length == 1) {
        return array[0].items
    }
    else {
        return []
    }
}

function copyFile(filename) {
    var from = path.resolve(__dirname, templateToolkitFolder + '/' + filename)
    var to = path.resolve(__dirname, toolkitFolder + '/' + filename)
    fs.copyFile(from,to, (err) => {
        if (err) throw err;
        //console.log('source.txt was copied to destination.txt');
      });
}

function readFile(file) {
    //var templateToolkitFolder = path.resolve(templateToolkitFolder);
    return fs.readFileSync(path.resolve(templateToolkitFolder + file)).toString()
}

function writeFile(framework, tplFile, outFile, vars) {
    //var templateToolkitFolder = path.resolve(templateToolkitFolder);
    var tpl = new Ext.XTemplate(fs.readFileSync(path.resolve(templateToolkitFolder + tplFile)).toString())
    var t = tpl.apply(vars)
    fs.writeFileSync(outFile, t);
    delete tpl;
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


// var c = {
//     all: 0,
//     xtypenamecombo: 0,
//     processed: 0,
//     webcomponents: 0,
//     unique: 0,
//     calendar: 0,
//     field: 0,
//     trigger: 0,
//     sparkline: 0,
//     d3: 0,
//     picker: 0,
//     pivot: 0,
//     menu: 0,
//     grid: 0,
//     cell: 0,
//     list: 0,
//     field: 0,
//     panel: 0,
//     chart: 0,
//     dataview: 0,
//     button: 0,
//     slider: 0,
//     tab: 0,
//     draw: 0,
//     other: 0
// }