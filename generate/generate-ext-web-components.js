//node ./generate-ext-web-components.js button
var install = true;
let run = require("./util").run;
const fs = require('fs-extra')
var framework = 'web-components'

require('./XTemplate')
const path = require('path')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')

const newLine = '\n'

var type = process.argv[2];
var xtypelist = [];
switch(type) {
    case 'all':
        break;
    case 'button':
        xtypelist = [
            'button'
        ]
        break;
    case 'panel':
        break;
    case 'grid':
        xtypelist = [
            'gridcellbase',
            'booleancell',
            'gridcell',
            'checkcell',
            'datecell',
            'numbercell',
            'rownumberercell',
            'textcell',
            'treecell',
            'widgetcell',
            'celleditor',
            'booleancolumn',
            'checkcolumn',
            'gridcolumn',
            'column',
            'templatecolumn',
            'datecolumn',
            'dragcolumn',
            'numbercolumn',
            'rownumberer',
            'selectioncolumn',
            'textcolumn',
            'treecolumn',
            'grid',
            'headercontainer',
            'lockedgrid',
            'lockedgridregion',
            'gridcolumnsmenu',
            'gridgroupbythismenuitem',
            'gridshowingroupsmenuitem',
            'gridsortascmenuitem',
            'gridsortdescmenuitem',
            'pagingtoolbar',
            'gridrow',
            'rowbody',
            'roweditorbar',
            'roweditorcell',
            'roweditor',
            'roweditorgap',
            'rowheader',
            'gridsummaryrow',
            'tree'
          ]
          break;
    case 'gridall':
        break;
    default:
        console.log('not a valid bundle: ' + type)
        return -1;
}

const data = require(`./AllClassesFiles/modern-all-classes-flatten.json`)

var moduleVars = {imports: ''}

const generatedFolders = './GeneratedFolders/';
if (!fs.existsSync(generatedFolders)) {mkdirp.sync(generatedFolders)}

const toolkitFolder = generatedFolders + "ext-" + framework + '-' + type + '/';
const binFolder = toolkitFolder + 'bin/';
const docFolder = toolkitFolder + 'doc/';
const libFolder = toolkitFolder + 'lib/';
const tempFolder = toolkitFolder + 'temp/';
const extFolder = tempFolder + 'Ext/';
const extFinalFolder = libFolder + 'Ext/';
var extbinFolder = toolkitFolder + "ext/";

//const extFinalFolder = libFolder + 'Ext/';


rimraf.sync(toolkitFolder);
mkdirp.sync(toolkitFolder);
mkdirp.sync(binFolder);
mkdirp.sync(docFolder);
mkdirp.sync(libFolder);
mkdirp.sync(tempFolder);
mkdirp.sync(extFolder);
mkdirp.sync(extFinalFolder);
mkdirp.sync(extbinFolder);

//mkdirp.sync(extFinalFolder);

var didXtype = false

var c = {
    all: 0,
    xtypenamecombo: 0,
    processed: 0,
    webcomponents: 0,
    unique: 0,
    calendar: 0,
    field: 0,
    trigger: 0,
    sparkline: 0,
    d3: 0,
    picker: 0,
    pivot: 0,
    menu: 0,
    grid: 0,
    cell: 0,
    list: 0,
    field: 0,
    panel: 0,
    chart: 0,
    dataview: 0,
    button: 0,
    slider: 0,
    tab: 0,
    draw: 0,
    other: 0
}

var Items = []
for (i = 0; i < data.global.items.length; i++) {
    doNewApproach(data.global.items[i], framework, libFolder);
}

let getBundleInfo = require("./getBundleInfo").getBundleInfo;
var info = getBundleInfo(framework, type, Items)

writeOnlyWantedExtended(info.wantedextended)

info.imports = ''
fs.readdirSync(`${libFolder}`).forEach(function(file) {
    var stat = fs.statSync(`${libFolder}` + "/" + file);
    if (stat.isDirectory()) {return;}

    var f = file.split('.')
    var xtype = f[0].substring(4)
    if (info.wantedxtypes.indexOf(xtype) == -1) {
        fs.unlinkSync(`${libFolder}` + "/" + file);
    }
    else {
        moduleVars.imports = moduleVars.imports + `import './lib/ext-${xtype}.component';${newLine}`;
        info.imports = info.imports + `import './lib/ext-${xtype}.component';<br/>`;
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

copyFile("ext/css.prod.js");
copyFile("lib/HTMLParsedElement.js");
copyFile('.babelrc');

writeFile(framework,`/ext-web-components.tpl`,`${toolkitFolder}bin/ext-web-components${info.bundle}.js`,info);
writeFile(framework,`/manifest.tpl`,`./cmder/manifest.js`,info);
writeFile(framework,`/app.tpl`,`./cmder/app.json`,info);
writeFile(framework,`/package.tpl`,`${toolkitFolder}package.json`,info);
writeFile(framework,`/README.tpl`,`${toolkitFolder}/README.md`,info);

writeFile(framework, '/ewcbase.tpl', `${libFolder}ewc-base.component.js`, info);
writeFile(framework, '/module.tpl', `${toolkitFolder}ext-${framework}${info.bundle}.module.js`, moduleVars);

writeFile(framework, '/router.tpl', `${libFolder}ext-router.component.js`, {});
writeFile(framework, '/index.tpl', `${docFolder}docs.html`, info);
writeFile(framework, '/style.tpl', `${docFolder}style.css`, {});

//allXtypes = allXtypes + `</div>${newLine}`

if (install == true) {doInstall()}
async function doInstall() {
    process.chdir(`./cmder`);
    await run(`sencha app build`);
    //copyFile("ext/css.prod.js");
    console.log('done with cmd')
    process.chdir(`../`);

    process.chdir(toolkitFolder);
    await run(`npm install`);
    await run(`npm publish --force`);
    console.log(`https://sencha.myget.org/feed/early-adopter/package/npm/@sencha/ext-${framework}${info.bundle}/7.0.0`)
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
        fs.copySync(`${tempFolder}` + "" + folder + '.js',`${libFolder}` + "" + folder + '.js')
    }
    rimraf.sync(tempFolder);
}


function doNewApproach(item, framework, libFolder) {
    c.all++
    var template = ''
    if (item.name == 'Ext.Base') {
        template = '/base.tpl'
    }
    else {
        template = '/class.tpl'
    }

    var processIt = shouldProcessIt(item)

    if (processIt == true) {
        c.processed++
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
        if (item.alternateClassNames != undefined) {
            //console.log(item.alternateClassNames)
            //var alt = item.alternateClassNames.split(",");
            //names = names.concat(alt)
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

                  if (xtypelocal == 'lockedgrid') {
                      console.log(item)
                  }






                }
              }
            }
            else {
                webcomponent = false
            }
        }
        else {
            webcomponent = false
        }

        if (webcomponent == true) {
            c.webcomponents++
        }

        var sPROPERTIES = ''
        var sPROPERTIESOBJECT = ''
        var sPROPERTIESGETSET = ''
        var properties = `<div class="select-div"><select id="properties" onchange="changeProperty()" name="properties">${newLine}`
        getItems(item,'configs').forEach(function (config, index, array) {
            properties = properties + `    <option value="${config.text}">${config.name}</option>${newLine}`

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
        properties = properties + `</select></div>${newLine}`

        var methods = `<div class="select-div"><select id="methods" onchange="changeMethod()" name="methods">${newLine}`
        var sMETHODS = "";
        getItems(item,'methods').forEach(function (method, index, array) {
            methods = methods + `    <option value="${method.text}">${method.name}</option>${newLine}`

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
        methods = methods + `</select></div>${newLine}`

        var events = `<div class="select-div"><select id="events" onchange="changeEvent()" name="events">${newLine}`
        var sEVENTS = "";
        var sEVENTNAMES = "";
        var sEVENTGETSET = ''
        getItems(item,'events').forEach(function (event, index, array) {
            events = events + `    <option value="${event.text}">${event.name}</option>${newLine}`

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
        events = events + `</select></div>${newLine}`

        didXtype = false
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            var xtype = xtypes[0];
            //console.log(names[i] + '_' + xtype + ' xtype: ' + xtype + ' - ' + xtypes)
            //var classfilename = `${name}.Component`
            var classname = name.replace(/\./g, "_") + "_Component"
            //var classfile = `${libFolder}${classfilename}.${extension}`

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

            var values = {
                sPROPERTIESGETSET: sPROPERTIESGETSET,
                sMETHODS: sMETHODS,
                sPROPERTIES: sPROPERTIES,
                sPROPERTIESOBJECT: sPROPERTIESOBJECT,
                sEVENTS: sEVENTS,
                sEVENTNAMES: sEVENTNAMES,
                sEVENTGETSET: sEVENTGETSET,
                webcomponent: webcomponent,
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
            writeFile(framework, template, `${folder}${filename}.js`, values)


            for (var j = 0; j < xtypes.length; j++) {
                //for each name and each xtype
                //Items.push(new Item(xtypes[j], names[i]))
                Items.push({xtype: xtypes[j], name: names[i], extended: item.extended})
                c.xtypenamecombo++

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
                writeFile(framework, '/xtype.tpl', `${libFolder}ext-${xtypes[j]}.component.js`, values)

                if (didXtype == false) {
                    //console.log(`${values.xtype} ${didXtype}`)
                    //                    `import { Ext${values.Xtype}Component } from './lib/ext-${values.xtype}.component';${newLine}`;

                   // moduleVars.imports = moduleVars.imports + `import './lib/ext-${values.xtype}.component';${newLine}`;
                    c.unique = c.unique + 1
                    didXtype = true



                    xt = values.xtype
                    //console.log(name + "; \t\t"  + xt)

                    if (name.toLowerCase().includes('calendar')) {c.calendar++}
                    else if (xt.includes('field')) {c.field++}
                    else if (xt.includes('trigger')) {c.trigger++}
                    //else if (xt.includes('column')) {c.column++;}//console.log(name + "; \t\t"  + xt)}
                    else if (xt.includes('sparkline')) {c.sparkline++}
                    else if (xt.includes('d3')) {c.d3++}
                    else if (xt.includes('picker')) {c.picker++}
                    else if (xt.includes('pivot')) {c.pivot++}
                    else if (xt.includes('menu')) {c.menu++}
                    //else if (xt.includes('grid')) {c.grid++;console.log(name + "; \t\t"  + xt)}
                    //else if (name.toLowerCase().includes('ext.grid')) {c.grid++;console.log("'" + name + "; \t\t"  + xt)}
                    else if (name.toLowerCase().includes('ext.grid')) {c.grid++}//;console.log("'" + xt + "',")}
                    //else if (xt.includes('cell')) {c.cell++;console.log(name + "; \t\t"  + xt)}
                    else if (xt.includes('list')) {c.list++}
                    else if (xt.includes('row')) {c.row++}
                    else if (name.includes('field')) {c.field++}
                    else if (name.toLowerCase().includes('panel')) {c.panel++}
                    else if (name.includes('chart')) {c.chart++}
                    else if (name.includes('dataview')) {c.dataview++}
                    else if (name.toLowerCase().includes('button')) {c.button++}
                    else if (name.includes('slider')) {c.slider++}
                    else if (name.includes('tab')) {c.tab++}
                    else if (name.includes('draw')) {c.draw++}
                    else {
                        c.other++;
                        //console.log(name + "; \t\t"  + xt)
                    }




                }

                var text200 = ''; try {text200 = item.text.substring(1, 200)}catch(e) {}

                var values3 = {
                    properties: properties,
                    methods: methods,
                    events: events,
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
    var from = path.resolve(__dirname, 'filetemplates' + '/' + framework + '/' + filename)
    var to = path.resolve(__dirname, toolkitFolder + '/' + filename)
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
