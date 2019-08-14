//node ./allweb-components.js
var framework = 'web-components'

require('./XTemplate')
const path = require('path')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const fs = require('fs-extra')
const newLine = '\n'
const data = require(`./AllClassesFiles/modern-all-classes-flatten.json`)

const generatedFolders = './GeneratedFolders/';
const toolkitFolder = generatedFolders + 'ext-' + framework;
if (!fs.existsSync(generatedFolders)) {mkdirp.sync(generatedFolders)}
rimraf.sync(toolkitFolder);
mkdirp.sync(toolkitFolder);

const srcFolder = toolkitFolder + '/src/';
const libFolder = srcFolder + 'lib/';
const extFolder = libFolder + 'Ext/';
const docFolder = srcFolder + 'doc/';

mkdirp.sync(srcFolder);
mkdirp.sync(libFolder);
mkdirp.sync(extFolder);
mkdirp.sync(docFolder);

var c = {all: 0,processed: 0,webcomponents: 0}
var allXtypes = `<div>${newLine}`;

for (i = 0; i < data.global.items.length; i++) {
    doNewApproach(data.global.items[i], framework, libFolder);
}

allXtypes = allXtypes + `</div>${newLine}`

writeFile(framework, '/index.tpl', `${docFolder}index.html`, {allXtypes: allXtypes})
writeFile(framework, '/ewcbase.tpl', `${libFolder}ewc-base.component.js`, {})
writeFile(framework, '/router.tpl', `${libFolder}ext-router.component.js`, {})
writeFile(framework, '/style.tpl', `${docFolder}style.css`, {})

console.log(c)

let run = require('./util').run
main()
async function main() {
    await run(`rm -rf ../../../ext-web-components/packages/ext-web-components/doc`)
    await run(`rm -rf ../../../ext-web-components/packages/ext-web-components/lib`)
    await run(`cp -R ./GeneratedFolders/ext-web-components/src/ ../../../ext-web-components/packages/ext-web-components/`)
}


function doNewApproach(o, framework, libFolder) {
    c.all++
    var template = ''
    if (o.name == 'Ext.Base') {
        template = '/base.tpl'
    }
    else {
        template = '/class.tpl'
    }

    var processIt = shouldProcessIt(o)

    if (processIt == true) {
        c.processed++
        var tab = "";
        var webcomponent = true

        if (o.extends != undefined) {
            var n = o.extends.indexOf(",");
            if (n != -1) {
                //console.log('mult extends: ' + o.name + ' - ' + o.extends)
                o.extends = o.extends.substr(0,n)
            }
        }

        var names = []
        names.push(o.name)
        if (o.alternateClassNames != undefined) {
            var alt = o.alternateClassNames.split(",");
            names = names.concat(alt)
        }

        var aliases = []
        var xtypes = []
        if (o.alias != undefined) {
            if (o.alias.substring(0, 6) == 'widget') {
              aliases = o.alias.split(",")
              for (alias = 0; alias < aliases.length; alias++) {
                if (aliases[alias].substring(0, 6) == 'widget') {
                  xtypes.push(aliases[alias].substring(7))
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
        var configsArray = o.items.filter(function(obj) {return obj.$type == 'configs';});
        if (configsArray.length == 1) {
            configsArray[0].items.forEach(function (config, index, array) {

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
        }
        properties = properties + `</select></div>${newLine}`

        var methods = `<div class="select-div"><select id="methods" onchange="changeMethod()" name="methods">${newLine}`
        var sMETHODS = "";
        var methodsArray = o.items.filter(function(obj) {return obj.$type == 'methods';});
        if (methodsArray.length == 1) {
            methodsArray[0].items.forEach(function (method, index, array) {

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
        }
        methods = methods + `</select></div>${newLine}`

        var events = `<div class="select-div"><select id="events" onchange="changeEvent()" name="events">${newLine}`
        var sEVENTS = "";
        var sEVENTNAMES = "";
        var sEVENTGETSET = ''
        var eventsArray = o.items.filter(function(obj) {return obj.$type == 'events';});
        if (eventsArray.length == 1) {
            eventsArray[0].items.forEach(function (event, index, array) {

                events = events + `    <option value="${event.text}">${event.name}</option>${newLine}`

                if (event.from == undefined) {
                    var eventName = 'on' + event.name
                    sEVENTGETSET = sEVENTGETSET + `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`

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
                }
            })
        }
        events = events + `</select></div>${newLine}`

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
            folder = `${libFolder}${thePath}`
            if (!fs.existsSync(folder)) {mkdirp.sync(folder)}
            //console.log(folder + ': ' + parts[parts.length-1])
            filename = parts[parts.length-1]

            //var classfile = `${folder}${filename}.js`
            var extendparts = o.extends.split(".")
            var extendpath = ''
            for (var j = 0; j < extendparts.length-1; j++) {
                extendpath = extendpath + extendparts[j] + '/'
            }
            //var classextendsfilename = o.extends + ".Component"
            //var classextendsfilename = extendparts[extendparts.length-1]
            //var extendsclassname = o.extends.replace(/\./g, "_") + "_Component"

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
                extends: o.extends,
                extendsclassname: o.extends.replace(/\./g, "_") + "_Component",
                classextendsfilename: extendparts[extendparts.length-1]
            }
            writeFile(framework, template, `${folder}${filename}.js`, values)

            for (var j = 0; j < xtypes.length; j++) {
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

                var text200 = ''; try {text200 = o.text.substring(1, 200)}catch(e) {}

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
                    alias: o.alias,
                    extend:o.extend,
                    extenders:o.extenders,
                    mixed:o.mixed,
                    mixins:o.mixins,
                    name:o.name,
                    requires:o.requires,
                    text:o.text,
                    text200: text200,
                    items:o.items,
                    src:o.src
                }
                writeFile(framework, '/doc.tpl', `${docFolder}ext-${xtypes[j]}.doc.html`, values3)

                allXtypes = allXtypes + `  <div onclick="selectDoc('${xtypes[j]}')">ext-${xtypes[j]}</div><br>${newLine}`
            }
            webcomponent = false
        }
    }
}

function writeFile(framework, tplFile, outFile, vars) {
    var templateToolkitFolder = path.resolve('./filetemplates/' + framework);
    var tpl = new Ext.XTemplate(fs.readFileSync(path.resolve(templateToolkitFolder + tplFile)).toString())
    var t = tpl.apply(vars)
    fs.writeFileSync(outFile, t);
    delete tpl;
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
