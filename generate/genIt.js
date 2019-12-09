// node ./genIt.js ele blank modern
// node ./genIt.js ele blank classic
// node ./genIt.js ele button
const install = true;
const installExt = true;
const doAllinXtype = true;

const toolkit = process.argv[4];
var toolkits = ['modern', 'classic'];
if (toolkits.includes(toolkit) == false) {
  console.log('toolkit not valid')
  return
}
console.log('genIt started - ' + toolkit)
var info = {};

const run = require("./util").run;
const writeTemplateFile = require("./util").writeTemplateFile;
const copyFileSync = require('fs-copy-file-sync');
const fs = require("fs-extra");
const path = require("path");
const rimraf = require("rimraf");
const mkdirp = require("mkdirp");
require("./XTemplate");

info.toolkit = toolkit;
info.Toolkit = info.toolkit.charAt(0).toUpperCase() + info.toolkit.slice(1);
info.toolkitshown = `-${info.toolkit}`;
info.ewcimports = ''

info.classicWidgetCount = 0;
info.data = require(`./AllClassesFiles/docs/${info.toolkit}/${info.toolkit}-all-classes-flatten.json`);
const moduleVars = { imports: "", declarations: "", exports: "", ewcimports: "", engimports: "" };

info.version = '7.1.0';
info.reactPrefix = 'Ext';
info.shortname = process.argv[2];
info.Shortname = info.shortname.charAt(0).toUpperCase() + info.shortname.slice(1);
info.framework = 'elements';
//info.extension = 'js';
info.xtype = process.argv[3];
info.wantedxtypes = require(`./npmpackage/${toolkit}/${info.xtype}`).getXtypes();
//console.log(info.wantedxtypes)
//info.xtypelist = require("./npmpackage/" + info.xtype).getXtypes();
//info.wantedxtypes = info.xtypelist;
//info.xtype = info.type;
info.now = new Date().toString();
if (info.xtype == 'blank') {
  info.bundle = ''
  info.Bundle = ''
  info.name = ''
}
else {
  info.bundle = '-' + info.xtype
  info.Bundle = info.xtype.charAt(0).toUpperCase() + info.xtype.slice(1);
  info.name = info.bundle.substring(1)
}

info.folderName = `ext-${info.framework}${info.toolkitshown}${info.bundle}/`;
//console.log(info.folderName)

info.folder = '../../GeneratedFolders/ext-' + info.framework + info.bundle + '/ext';
info.imports = ''
info.declarations = ''
info.elements = ''
info.manifest = ''
for (var i = 0; i < info.wantedxtypes.length; i++) {
    var w = info.wantedxtypes[i]
    //console.log(info.wantedxtypes[i]);
    var W = w.charAt(0).toUpperCase() + w.slice(1);
    info.manifest = info.manifest + `{"xtype":"${w}"},\n`
    info.elements = info.elements + `&lt;ext-${w}&gt;&lt;/\ext-${w}&gt;\n\n`
    info.declarations = info.declarations + `    Ext${W}Component,\n`
    info.importsxng = info.imports + `import {Ext${W}Component} from\n  '@sencha/ext-angular-${info.xtype}/esm5/src/ext-${w}.component';\n`
    info.importsewc = info.imports + `import '@sencha/ext-web-components-${info.xtype}/lib/ext-${w}.component';\n`
}
// const examples = require(examplesSource).examples;
info.angular = {}
info.angular.module = ''
info.angular.component = ''

var docs = []
info.reactImports = ''
info.reactExports = ''
info.reactExports70 = ''
info.reactExportsCase = ''

if (info.toolkit == 'modern') {
  info.reactExportsCase = `
export const ActionSheet = ExtActionsheet_;
export const BreadcrumbBar = ExtBreadcrumbbar_;

export const Calendar_Event = ExtCalendar_event_;
export const Calendar_Form_Add = ExtCalendar_form_add_;
export const Calendar_Calendar_Picker = ExtCalendar_calendar_picker_;
export const Calendar_Form_Edit = ExtCalendar_form_edit_;
export const Calendar_Timefield = ExtCalendar_timefield_;
export const Calendar_Daysheader = ExtCalendar_daysheader_;
export const Calendar_Weeksheader = ExtCalendar_weeksheader_;
export const Calendar_List = ExtCalendar_list_;
export const Calendar_Day = ExtCalendar_day_;
export const Calendar_Days = ExtCalendar_days_;
export const Calendar_Month = ExtCalendar_month_;

export const Calendar_Week = ExtCalendar_week_;
export const Calendar_Weeks = ExtCalendar_weeks_;
export const Calendar_Dayview = ExtCalendar_dayview_;
export const Calendar_Daysview = ExtCalendar_daysview_;
export const Calendar_Monthview = ExtCalendar_monthview_;
export const Calendar_Multiview = ExtCalendar_multiview_;
export const Calendar_Weekview = ExtCalendar_weekview_;
export const Calendar_Weeksview = ExtCalendar_weeksview_;


export const CheckBoxField = ExtCheckboxfield_;
export const CheckboxGroup = ExtCheckboxgroup_;
export const CheckColumn = ExtCheckcolumn_;
export const ComboBoxField = ExtComboboxfield_;
export const ContainerField = ExtContainerfield_;
export const DataView = ExtDataview_;
export const DateColumn = ExtDatecolumn_;
export const DatePanel = ExtDatepanel_;
export const DatePickerField = ExtDatepickerfield_;
export const EmailField = ExtEmailfield_;
export const FieldSet = ExtFieldset_;
export const FileField = ExtFilefield_;
export const FormPanel = ExtFormpanel_;
export const FroalaEditorField = ExtFroalaeditorfield_;
export const LockedGrid = ExtLockedgrid_;
export const MenuCheckItem = ExtMenucheckitem_;
export const MenuItem = ExtMenuitem_;
export const NestedList = ExtNestedlist_;
export const NumberColumn = ExtNumbercolumn_;
export const NumberField = ExtNumberfield_;
export const PasswordField = ExtPasswordfield_;
export const PivotGrid = ExtPivotgrid_;
export const RadioField = ExtRadiofield_;
export const SearchField = ExtSearchfield_;
export const SegmentedButton = ExtSegmentedbutton_;
export const SelectField = ExtSelectfield_;
export const SliderField = ExtSliderfield_;
export const SparkLineLine = ExtSparklineline_;
export const SpinnerField = ExtSpinnerfield_;
export const SplitButton = ExtSplitbutton_;
export const TabBar = ExtTabbar_;
export const TabPanel = ExtTabpanel_;
export const TextAreaField = ExtTextareafield_;
export const TextColumn = ExtTextcolumn_;
export const TextField = ExtTextfield_;
export const TimeField = ExtTimefield_;
export const TimePanel = ExtTimepanel_;
export const TitleBar = ExtTitlebar_;
export const ToggleField = ExtTogglefield_;
export const ToolBar = ExtToolbar_;
export const ToolTip = ExtTooltip_;
export const TreeList = ExtTreelist_;
export const UrlField = ExtUrlfield_;
export const WidgetCell = ExtWidgetcell_;
export const URLField = ExtUrlfield_;
//export { launch } from "./dist/launch";
  `
}
//info.reactImports = info.reactImports + `import launch_ from "./dist/launch";\n`;



//var aItems = [];
//var aItemsInBundle = [];

//const xtypelist = require("./npmpackage/" + info.xtype).getXtypes()

//let getBundleInfo = require("./getBundleInfo").getBundleInfo;
//var info = getBundleInfo(framework, shortname, info.xtype, info.xtypelist)

const generatedFolders = "./GeneratedFolders/";
//const filetemplatesFolder = "./filetemplates/"
const typeFolder = generatedFolders + info.xtype + '/';
const templateFolder = "./filetemplates/" + info.framework + "/";
//const outputFolder = typeFolder + "ext-" + info.framework + (info.xtype == 'blank' ? '' : '-' + info.xtype) + '/';
const outputFolder = typeFolder + info.folderName;

const srcFolder = outputFolder + "src/";
const srcStagingFolder = outputFolder + "srcStaging/";
const docFolder = outputFolder + 'doc/';
const docStagingFolder = outputFolder + 'docStaging/';
const binFolder = outputFolder + 'bin/';

const reactFolder = outputFolder + 'react/';
const reactStagingFolder = outputFolder + 'reactStaging/';
//const reactOrigFolder = outputFolder + 'reactOrig/';
//const reactOrigStagingFolder = outputFolder + 'reactOrigStaging/';

const angularFolder = outputFolder + 'angular/';
const angularStagingFolder = outputFolder + 'angularStaging/';

const extFolder = outputFolder + 'ext/';

if (!fs.existsSync(generatedFolders)) {mkdirp.sync(generatedFolders)}
if (!fs.existsSync(typeFolder)) {mkdirp.sync(typeFolder)}
rimraf.sync(outputFolder);
mkdirp.sync(outputFolder);
mkdirp.sync(srcFolder);
mkdirp.sync(srcStagingFolder);
mkdirp.sync(docFolder);
mkdirp.sync(docStagingFolder);
mkdirp.sync(binFolder);

mkdirp.sync(reactFolder);
mkdirp.sync(reactStagingFolder);
//mkdirp.sync(reactOrigFolder);
//mkdirp.sync(reactOrigStagingFolder);
mkdirp.sync(angularFolder);
mkdirp.sync(angularStagingFolder);

if (installExt == true) {mkdirp.sync(extFolder)}

//const newLine = "\n";
//const tab = "    ";
var didXtype = false;
var allExtended = '';

var Items = [];

//mjg
for (i = 0; i < info.data.global.items.length; i++) {
  doLaunch(info.data.global.items[i], info.framework);
}

doPostLaunch();

if (install == true) {doInstall()}

function doLaunch(item, framework) {

    var processIt = shouldProcessIt(item)
    if (processIt == true) {

      if (info.toolkit == 'classic') {

        var n = item.extends.indexOf(',Object');
        if (n > 0) {
          item.extends = item.extends.substring(0, n)
        }

        //console.log(item.alias + ' ' + item.extended)

        // var extended = []
        // if (item.extended != undefined) {
        //   var n = item.extended.indexOf(",");
        //   if (n != -1) {
        //       //console.log('mult extends: ' + item.name + ' - ' + item.extends)
        //       extended.push(item.extended.substr(0,n))
        //   }
        //   //mjxgItem.extends = item.extends;
        // }

        var names = []
        names.push(item.name)
        if (item.alternateClassNames != undefined) {
            var alt = item.alternateClassNames.split(",");
            names = names.concat(alt)
        }

        var aliases = []
        var xtypes = []
        if (item.alias != undefined) {
            if (item.alias.substring(0, 6) == 'widget') {
              aliases = item.alias.split(",")
              //console.log(aliases.length)
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

        //console.log(xtypes)
        if (xtypes.length == 0) {
          //console.log(item.name)
          oneItem(item, framework, names, [])
        }

        xtypes.forEach(xtype => {
          var xtypesArray = []
          xtypesArray.push(xtype)

          oneItem(item, framework, names, xtypesArray)
        })
        //console.log(item.alias + ' ' + item.extends + ' ' + item.alternateClassNames)
        return
      }

    //modern
        if (item.extends != undefined) {
            var n = item.extends.indexOf(",");
            item.extendsArray = []
            if (n != -1) {
                //console.log('mult extends: ' + item.name + ' - ' + item.extends)
                item.extends = item.extends.substr(0,n)
            }
            //mjxgItem.extends = item.extends;
        }

        var names = []
        names.push(item.name)
        if (item.alternateClassNames != undefined) {
            var alt = item.alternateClassNames.split(",");
            names = names.concat(alt)
        }
        //mjxgItem.names = names;

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

        //mjxgItem.aliases = aliases;
        //mjxgItem.xtypes = xtypes;

        //there may be more than one


        item.xtype = xtypes[0]
        //mjxgItem.xtype = item.xtype;
        //mjxgItems.push(mjxgItem)

        //console.log(xtypes)

        if (xtypes.length == 0) {
          //console.log(item.name)
          oneItem(item, framework, names, [])
        }

        xtypes.forEach(xtype => {
          //console.log("'" + xtype + "',")
          var xtypesArray = []
          xtypesArray.push(xtype)
          oneItem(item, framework, names, xtypesArray)
        })
    }
    else {
      //console.log('not processed')
    }
}

function shouldProcessIt(o) {
  var processIt = false

  if (info.toolkit == 'classic') {

    var item = o
    if (item.alias != undefined) {
      if (item.alias.substring(0, 6) == 'widget') {
        //var aliases = item.alias.split(",");
        info.classicWidgetCount++
        //if (aliases.length > 1) {

        processIt = true;
        //}
      }
    }

    if (o.extended != undefined) {
      if ( o.extended.includes("Ext.Base")) {

        processIt = true
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

    return processIt
  }


  if (o.extended == undefined) {

    //console.log(o.name + ' not a widget, extended is undefined')
    processIt = false;
  }
  else {
    //console.log(o.name + ' ' + o.extended + ' ' + o.alias)
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

function oneItem(item, framework, names, xtypes) {
  var xtype = xtypes[0];

    var propertyObj = doProperties(item)
    var propertiesDocs = propertyObj.eventsDocs;
    var sPROPERTIES = propertyObj.sPROPERTIES;
    //var sPROPERTIESOBJECT = propertyObj.sPROPERTIESOBJECT;
    var sPROPERTIESEVENTS = propertyObj.sPROPERTIESEVENTS;
    //sGETSET = sGETSET + sPROPERTIESEVENTS;
    var sPROPERTIESOBJECT = {};
    info.propNames = `['aMe', 'header', 'renderer', 'label','fitToParent','tab','config','platformConfig','extname','viewport','align','plugins','responsiveConfig','responsiveFormulas',`
    propertyObj.propertiesArray.forEach(property => {
      //info.propNames.push(property.name)
      info.propNames = info.propNames + `'${property.name}',`
    })
    info.propNames = info.propNames + `]`

    var methodObj = doMethods(item)
    var methodsDocs = methodObj.methodsDocs;
    //var sMETHODS = methodObj.sMETHODS;
    var sMETHODS = [];

    var eventObj = doEvents(item)
    var eventsDocs = eventObj.eventsDocs;
    var sEVENTS = eventObj.sEVENTS;
    var sEVENTNAMES = eventObj.sEVENTNAMES;
    //var sEVENTSGETSET = eventObj.sEVENTSGETSET;
    //eventObj.eventsArray
    //sGETSET = sGETSET + sEVENTSGETSET;
    //console.dir(sPROPERTIES)
    info.eventNames = `['ready',`
    eventObj.eventsArray.forEach(event => {
      //info.propNames.push(property.name)
      info.eventNames = info.eventNames + `'${event.name}',`
    })
    info.eventNames = info.eventNames + `]`

    didXtype = false;

    if (names.length > 1) {
      var namesSmall = [];
      names.forEach(name => {
        namesSmall.push(name.toLowerCase())
      })
      var uniqSmall = [...new Set(namesSmall)];
      if (names.length != uniqSmall.length) {
        var newNames = [names[0]]
        names = [...new Set(newNames)]
      }
    }

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
        for (var j2 = 0; j2 < extendparts.length-1; j2++) {
            extendpath = extendpath + extendparts[j2] + '/'
        }


        var values = {
            shortname: info.shortname,
            Shortname: info.Shortname,
            //sPROPERTIESGETSET: sGETSET,
            //sMETHODS: sMETHODS,
            sPROPERTIES: sPROPERTIES,
            sPROPERTIESOBJECT: sPROPERTIESOBJECT,
            sEVENTS: sEVENTS,
            sEVENTNAMES: sEVENTNAMES,
            //sEVENTSGETSET: sEVENTSGETSET,
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

        var templateFile = ''
        if (item.name == 'Ext.Base') {
            templateFile = 'base.tpl'
        }
        else {
            templateFile = 'class.tpl'
        }

        //console.log(`${folder}${filename}.js`)
        writeTemplateFile(templateFolder + templateFile, `${folder}${filename}.js`, values)

        if(xtypes[0] != undefined) {
            var Xtype = xtypes[0].charAt(0).toUpperCase() + xtypes[0].slice(1).replace(/-/g,'_');
            //aItems.push(Xtype)
        }




        for (var j = 0; j < xtypes.length; j++) {
            //for each name and each xtype
            Items.push({xtype: xtypes[j], name: names[i], extended: item.extended})

            var folder = '.'
            var folders = classname.split('_')
            for (var k = 0; k < folders.length; k++) {
                folder = folder + '/' + folders[k]
            }
            var values = {
              propNames: info.propNames,
              eventNames: info.eventNames,
                classname: classname,
                doAllinXtype: doAllinXtype,
                sPROPERTIES: sPROPERTIES,
                sEVENTS: sEVENTS,
                sEVENTNAMES: sEVENTNAMES,
                folder: folder,
                toolkit: toolkit,
                bundle: info.bundle,
                Xtype: xtypes[j].charAt(0).toUpperCase() + xtypes[j].slice(1).replace(/-/g,'_'),
                xtype: xtypes[j]
            }
            if (xtypes[j] == "grid" && info.toolkit == 'modern') {
                //values.ReactCell = "import '@sencha/ext-web-components/dist/ReactCell';"
                values.ReactCell = "import './ReactCell';"
                values.ElementCell = "import './ElementCell';"
            }
            else {
                values.ReactCell = ""
                values.ElementCell = ""
            }





            writeTemplateFile(templateFolder+'xtype.tpl', `${srcStagingFolder}ext-${xtypes[j]}.component.js`, values)
            writeTemplateFile(templateFolder+'react.tpl', `${reactStagingFolder}${info.reactPrefix}${values.Xtype}.js`, values)
            //writeTemplateFile(templateFolder+'react.tpl', `${reactOrigStagingFolder}${values.Xtype}.js`, values)
            writeTemplateFile(templateFolder+'angular.tpl', `${angularStagingFolder}Ext${values.Xtype}.ts`, values)

            if (didXtype == false) {
                didXtype = true
                xt = values.xtype

//console.log(`  '${xt}',`)

                if (info.wantedxtypes.includes(xt)) {
                    var theNames = ""
                    names.forEach(name => theNames += name + ',')
                    allExtended = allExtended + theNames + ',' + item.extended + ',';
                    var classname = xt.replace(/-/g, "_");
                    var capclassname = classname.charAt(0).toUpperCase() + classname.slice(1);
                    moduleVars.imports = moduleVars.imports +`import { Ext${capclassname}Component } from './src/ext-${xt}.component.js';\n`;

                    //moduleVars.ewcimports = moduleVars.ewcimports + `import './dist/ext-${classname}.component.${extension}';\n`;


                    info.ewcimports = info.ewcimports + `import './dist/ext-${xt}.component.js';\n`;
                    //moduleVars.ewcimports = moduleVars.ewcimports + `import './dist/ext-${xt}.component.js';\n`;


                    moduleVars.engimports = moduleVars.engimports + `import { Ext${capclassname}Component } from './src/Ext${capclassname}.js';\n`;


                    //rts = moduleVars.exports + `    Ext${capclassname}Component,\n`;
                    moduleVars.declarations = moduleVars.declarations + `    Ext${capclassname}Component,\n`;
                    moduleVars.exports = moduleVars.exports + `    Ext${capclassname}Component,\n`;
                    moduleVars.Bundle = info.Bundle;
                    moduleVars.toolkit = info.toolkit;
                    moduleVars.Toolkit = info.Toolkit;
                    moduleVars.framework = info.framework;

                  }
                  else {
                    console.log('not found ' + xt)
                  }
            }

            var ewcProperties = ''
            propertyObj.propertiesArray.forEach(property => {
                //console.log(event);
                var Text = ''
                if (property.text != undefined) {
                    Text = property.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
                }
                property.ewc = `${property.name}<br/>${Text}<br/><br/>`;
                ewcProperties = ewcProperties + property.ewc + '\n';
            });

            var ewcEvents = ''
            eventObj.eventsArray.forEach(event => {
                //console.log(event);
                var parameters = ''
                event.parameters.forEach(parameter => {
                    if (parameter != undefined) {
                        parameters = parameters + parameter + ', '
                    }
                })
                const EventName = event.name.charAt(0).toUpperCase() + event.name.slice(1);
                const Parameters = parameters.replace(/,\s*$/, "");
                event.ewc = `on${EventName} = ( {detail: { ${Parameters} }} ) => {}<br/>`;
                ewcEvents = ewcEvents + event.ewc + '\n'
            });


            //console.log('****')
            //console.log(ewcEvents)

            var n = 0
            if (item.text != undefined) {
                n = item.text.indexOf(". ");
            }
            var text200 = ''; try {text200 = item.text.substring(0, n+1)}catch(e) {}
            var Xtype = xtypes[j].charAt(0).toUpperCase() + xtypes[j].slice(1).replace(/-/g,'_');
            var xtype = xtypes[j];

            var values3 = {
                ewcEvents : ewcEvents,
                ewcProperties : ewcProperties,
                propertiesDocs: propertiesDocs,
                methodsDocs: methodsDocs,
                eventsDocs: eventsDocs,
                //sPROPERTIESGETSET: sGETSET,
                sMETHODS: sMETHODS,
                sPROPERTIES: sPROPERTIES,
                sPROPERTIESOBJECT: sPROPERTIESOBJECT,
                sEVENTS: sEVENTS,
                sEVENTNAMES: sEVENTNAMES,
                //sEVENTSGETSET: sEVENTSGETSET,
                classname: classname,
                folder: folder,
                Xtype: Xtype,
                xtype: xtype,
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

            docs.push({
                xtype: xtypes[j],
                hash: xtypes[j],
                leaf: 'true',
                iconCls: 'x-fa fa-map',
                desc: item.text,
                text: xtypes[j],
                properties: propertyObj.propertiesArray,
                methods: methodObj.methodsArray,
                events: eventObj.eventsArray,
            })




            writeTemplateFile(templateFolder+'docdetail.tpl', `${docStagingFolder}ext-${xtypes[j]}.doc.html`, values3)

            //if (xtypes[j] == 'panel') {

              //console.log(info.propNames.length)
              //console.log(propertyObj.propertiesArray)
              writeTemplateFile(templateFolder+'docdata.tpl', `${docStagingFolder}ext-${xtypes[j]}.doc.js`, {props: info.propNames.toString()})
            //}

        }
    }
}

function doProperties(o) {

    var sPROPERTIES = `\n`;
    var sPROPERTIESOBJECT = `\n`;
    var sGETSET = "";
    var propertiesArray = []

    //   var configsArray = o.items.filter(function(obj) {return obj.$type == 'configs';});
    //   if (configsArray.length == 1) {

    var haveResponsiveConfig = false;
    var propertiesDocs = `<div class="select-div"><select id="propertiesDocs" onchange="changeProperty()" name="propertiesDocs">\n`



    getItems(o, "configs").forEach(function(config, index, array) {
        var propertyObj = {}


        propertiesDocs = propertiesDocs + `    <option value="${config.text}">${config.name}</option>\n`

        if (config.from == undefined || doAllinXtype == true) {
        //configsArray[0].items.forEach(function (config, index, array) {
            if (config.deprecatedMessage == undefined) {
                sPROPERTIES = `${sPROPERTIES}    '${config.name}',\n`;
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

                propertyObj.text = config.text
                propertyObj.name = config.name

                sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"${config.name}":${s},\n`;
                // sGETSET =
                //     sGETSET +
                //     tab +
                //     `get ${config.name}(){return this.getAttribute('${config.name}')};
                //     set ${config.name}(${config.name}){this.setAttribute('${config.name}',${config.name})}\n`;
            }
        }
        propertiesArray.push(propertyObj)
    });

//    sPROPERTIES = `${sPROPERTIES}${tab}${tab}'platformConfig',\n`;
//    if (haveResponsiveConfig == false) {
//        sPROPERTIES = `${sPROPERTIES}${tab}${tab}'responsiveConfig',\n`;
//    }
    //sPROPERTIES = `${sPROPERTIES}'align',\n`;
//    sPROPERTIES = `${sPROPERTIES}${tab}${tab}'fitToParent',\n`;
//    sPROPERTIES = `${sPROPERTIES}${tab}${tab}'tab',\n`;
//    sPROPERTIES = `${sPROPERTIES}${tab}${tab}'config'\n`;

//    sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"platformConfig": "Object",\n`;
//    if (haveResponsiveConfig == false) {
//        sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"responsiveConfig": "Object",\n`;
//    }
//    //sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"align": "Object",\n`;
//    sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"tab": "Object",\n`;
//    sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"fitToParent": "Boolean",\n`;
//    sPROPERTIESOBJECT = `${sPROPERTIESOBJECT}"config": "Object",\n`;

    var eventName = "";
    eventName = "platformConfig";
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

    //}

    propertiesDocs = propertiesDocs + `</select></div>\n`


    var o = {};
    o.propertiesDocs = propertiesDocs;
    o.sPROPERTIES = sPROPERTIES;
    o.sPROPERTIESOBJECT = sPROPERTIESOBJECT;
    //o.sGETSETPROPERTIES = sGETSET;
    o.propertiesArray = propertiesArray;
    return o;


}

function doMethods(o) {
    var methodsDocs = `<div class="select-div"><select id="methodsDocs" onchange="changeMethod()" name="methodsDocs">\n`
    var sMETHODS = "";
    var methodsArray = []

    getItems(o, "methods").forEach(function(method, index, array) {
        var methodObj = {}
        methodsDocs = methodsDocs + `    <option value="${method.text}">${method.name}</option>\n`


        if (method.from == undefined) {

            sMETHODS = sMETHODS + '  ' + '  ' + "{ name:'" + method.name + "', function: function"
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

            methodObj.text = method.text
            methodObj.name = method.name
            methodObj.items = sItems
            methodsArray.push(methodObj)
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
    methodsDocs = methodsDocs + `</select></div>\n`
    var o = {};
    o.methodsDocs = methodsDocs;
    o.sMETHODS = sMETHODS;
    o.methodsArray = methodsArray;
    return o;

}

function doEvents(o) {

    var eventsDocs = `<div class="select-div"><select id="eventsDocs" onchange="changeEvent()" name="eventsDocs">\n`
    var sEVENTS = `\n`;
    var sEVENTNAMES = `\n`;
    //var sEVENTSGETSET = "";
    var eventsArray = []
    getItems(o, "events").forEach(function(event, index, array) {
        //console.log(event)
        var eventObj = {}
        eventObj.name = event.name
        eventObj.text = event.text
        eventObj.parameters = []

        eventsDocs = eventsDocs + `    <option value="${event.text}">${event.name}</option>\n`


        if (event.name == undefined) {
            var s = event.inheritdoc;
            event.name = s.substr(s.indexOf("#") + 1);
        }
        //if (event.name == 'tap') { event.name = 'tapit' };

        var eventName = "on" + event.name;
        // sEVENTSGETSET =
        // sEVENTSGETSET +
        //     tab +
        //     `get ${eventName}(){return this.getAttribute('${eventName}')};set ${eventName}(${eventName}){this.setAttribute('${eventName}',${eventName})}\n`;

        sEVENTS =
            sEVENTS + '  ' + '  ' + "{name:'" + event.name + "', parameters:'";
        sEVENTNAMES =
            sEVENTNAMES + '  ' + '  ' + "'" + event.name + "'" + "," + '\n';

        //if (event.name == 'tap') {console.log(event.items) };



        if (event.items != undefined) {
            event.items.forEach(function(parameter, index, array) {
                if (parameter == undefined) {
                    return
                }
                if (index == array.length - 1) {
                    commaOrBlank = "";
                } else {
                    commaOrBlank = ",";
                }
                if (parameter.name == "this") {
                    //if (event.name == 'tap') {console.log(o) };
                    parameter.name = 'sender'; //o.xtype;
                }
                sEVENTS = sEVENTS + parameter.name + commaOrBlank;

                eventObj.parameters.push(parameter.name)

            });
        }
        sEVENTS = sEVENTS + "'}" + "," + '\n';
        eventsArray.push(eventObj)
    });
    eventsDocs = eventsDocs + `</select></div>\n`



    sEVENTS = sEVENTS + '  ' + '  ' + "{name:'" +"ready" +"', parameters:'cmd,cmdAll'}" +"" + '\n';
    sEVENTNAMES = sEVENTNAMES + "'" + "ready" + "'" + "" + '\n';


    var o = {};
    o.eventsDocs = eventsDocs;
    o.sEVENTS = sEVENTS;
    o.sEVENTNAMES = sEVENTNAMES;
    //o.sEVENTSGETSET = sEVENTSGETSET;
    o.eventsArray = eventsArray;
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

//mjg
function doPostLaunch() {

    fs.writeFileSync(`${docFolder}data.js`,'window.xtypemenu = ' + JSON.stringify(docs, null, ' '));

    writeTemplateFile(templateFolder+`bin-ext-${info.framework}.tpl`,`${outputFolder}bin/ext-${info.framework}${info.toolkitshown}${info.bundle}.js`,info);
    copyFileSync(templateFolder+`.babelrc`, outputFolder+`.babelrc`);
    writeTemplateFile(templateFolder+'module.tpl', `${outputFolder}ext-${info.framework}${info.toolkitshown}${info.bundle}.module.js`, moduleVars);
    writeTemplateFile(templateFolder+`package.json.tpl`,`${outputFolder}package.json`,info);
    writeTemplateFile(templateFolder+`README.md.tpl`,`${outputFolder}README.md`,info);
    writeTemplateFile(templateFolder+`index.html.tpl`,`${outputFolder}index.html`,info);
    writeTemplateFile(templateFolder+'index.js.tpl', `${outputFolder}index.js`, info);

    writeTemplateFile(templateFolder+'ElementParser.js.tpl', `${srcFolder}ElementParser.js`, info);
    //copyFileSync(templateFolder+`ElementParser.js`, srcFolder + `ElementParser.js`);
    copyFileSync(templateFolder+`ElementCell.js`, srcFolder + `ElementCell.js`);
    copyFileSync(templateFolder+`util.js`, srcFolder + `util.js`);
    writeTemplateFile(templateFolder+'router.tpl', `${srcFolder}ext-router.component.js`, info);

    info.import = ``
//     if (info.xtype != 'blank') {
//         if (installExt == true) {
// //             info.import =
// // `import 'script-loader!../ext/ext.${info.xtype}';
// // import 'script-loader!../ext/css.${info.xtype}';`
//            info.import =
// `import 'script-loader!@sencha/ext-${framework}${info.bundle}/ext/ext.${info.xtype}';
// import 'script-loader!@sencha/ext-${framework}${info.bundle}/ext/css.${info.xtype}';`
//         }
//    }
    writeTemplateFile(`${templateFolder}${info.shortname}-base.tpl`,`${srcFolder}${info.shortname}-base.js`, info);

    //copy xtypes from staging to src
    fs.readdirSync(`${srcStagingFolder}`).forEach(function(file) {
        var stat = fs.statSync(`${srcStagingFolder}` + "/" + file);
        if (stat.isDirectory()) {return;}

        var f = file.split('.')
        var xtype = f[0].substring(4)
        if (info.wantedxtypes.indexOf(xtype) != -1) {
            var Xtype = xtype.charAt(0).toUpperCase() + xtype.slice(1).replace(/-/g,'_');
            //aItemsInBundle.push(Xtype);
            var reactFrameworkFile = `${info.reactPrefix}${Xtype}`
            //var reactOrigFrameworkFile = `${Xtype}`
            var angularFrameworkFile = `Ext${Xtype}`
            fs.copySync(`${reactStagingFolder}/${reactFrameworkFile}.js`,`${reactFolder}/${reactFrameworkFile}.js`)

            //fs.copySync(`${reactOrigStagingFolder}/${reactOrigFrameworkFile}.js`,`${reactOrigFolder}/${reactOrigFrameworkFile}.js`)

            fs.copySync(`${angularStagingFolder}/${angularFrameworkFile}.ts`,`${angularFolder}/${angularFrameworkFile}.ts`)
            fs.copySync(`${srcStagingFolder}/${file}`,`${srcFolder}/${file}`)
            //moduleVars.ewcimports = moduleVars.ewcimports + `import './src/ext-${xtype}.component.${extension}';\n`;
            //moduleVars.engimports = moduleVars.engimports + `import Ext${Xtype}Component from './src/Ext${Xtype}.${extension}';\n`;
        }
    });

    //doc
    info.includedxtypes = `<div>\n`
    fs.readdirSync(`${docStagingFolder}`).forEach(function(file) {
        var f = file.split('.')
        var xtype = f[0].substring(4)
        if (file == 'docdetail.html' || file == 'doc.html' || file == 'docstyle.css') { return }
        if (info.wantedxtypes.indexOf(xtype) != -1) {
            fs.copySync(`${docStagingFolder}/${file}`,`${docFolder}/${file}`)
            info.includedxtypes = info.includedxtypes + `  <div onclick="selectDoc('${xtype}')">ext-${xtype}</div><br>\n`
        }
    });
    info.includedxtypes = info.includedxtypes + `</div>\n`
    writeTemplateFile(templateFolder+'doc.tpl', `${docFolder}doc.html`, info)
    writeTemplateFile(templateFolder+'doc-z-tabs.tpl', `${docFolder}z-tabs.js`, info)
    writeTemplateFile(templateFolder+'doc-style.tpl', `${docFolder}style.css`, info)
    writeTemplateFile(templateFolder+'docstyle.tpl', `${docFolder}docstyle.css`, info)
    //doc


    //writeTemplateFile(templateFolder+`launch.js.tpl`,`${outputFolder}react/launch.js`,info);
    copyFileSync(templateFolder+`reactize.js`, outputFolder+`react/reactize.js`);
    copyFileSync(templateFolder+`ReactCell.js`, outputFolder+`react/ReactCell.js`);
    copyFileSync(templateFolder+`angularbase.ts`, outputFolder+`angular/angularbase.ts`);


    //copy staging Ext folder to src Ext
    var allExtendedArray = allExtended.split(",");
    let uniqueAllExtendedArray = [...new Set(allExtendedArray)];
    //console.dir(uniqueAllExtendedArray)
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
        fromFolder = `${srcStagingFolder}${thePath}${filename}.js`
        toFolder = `${srcFolder}${thePath}${filename}.js`
        copyFileSync(fromFolder, toFolder);
    })

    writeTemplateFile(templateFolder+'ext-react.component.js.tpl', `${srcFolder}ext-react.component.js`, {})
    writeTemplateFile(templateFolder+'ext-react-renderer.component.js.tpl', `${srcFolder}ext-react-renderer.component.js`, {})

    writeTemplateFile(templateFolder+'ExtReact.js.tpl', `${reactFolder}ExtReact.js`, {})
    writeTemplateFile(templateFolder+'ExtReactRenderer.js.tpl', `${reactFolder}ExtReactRenderer.js`, {})

    //writeTemplateFile(templateFolder+'reactExtReact.tpl', `${reactOrigFolder}ExtReact.js`, {})
    //writeTemplateFile(templateFolder+'reactExtReactRenderer.tpl', `${reactOrigFolder}ExtReactRenderer.js`, {})

    //rimraf.sync(reactStagingFolder);
    //rimraf.sync(reactOrigStagingFolder);
    //rimraf.sync(angularStagingFolder);
    //rimraf.sync(srcStagingFolder);



    //rimraf.sync(docStagingFolder);



    createWebComponents()

    createAngular()

    createReact()


}

function createWebComponents() {
    var framework='web-components';
    info.framework=framework;
    const templateFolder = "./filetemplates/" + framework + "/";
    const outputFolder = `${typeFolder}ext-${info.framework}${info.toolkitshown}${info.bundle}/`;


    rimraf.sync(outputFolder);
    mkdirp.sync(outputFolder);

    fs.copySync(srcFolder,`${outputFolder}/src`);

    //fs.copySync(docFolder,`${outputFolder}/doc`);

    //fs.copySync(binFolder,`${outputFolder}/bin`);
    writeTemplateFile(templateFolder+`package.tpl`,`${outputFolder}package.json`,info);
    writeTemplateFile(templateFolder+`README.tpl`,`${outputFolder}README.md`,info);
    copyFileSync(templateFolder+`.babelrc`, `${outputFolder}.babelrc`);

    const elementsOutputFolder = typeFolder + "ext-" + 'elements' + '-' + info.toolkit + (info.xtype == 'blank' ? '' : '-' + info.xtype) + '/';
    fs.copySync(`${elementsOutputFolder}index.js`,`${outputFolder}/index.js`);
    fs.copySync(`${elementsOutputFolder}index.html`,`${outputFolder}/index.html`);

    fs.copySync(`./ext-runtime/ext-runtime-${info.toolkit}`,`${outputFolder}/ext-runtime-${info.toolkit}`)

}

function createWebComponentsExt() {
    var framework='web-components';
    //const templateFolder = "./filetemplates/" + framework + "/";
    //const outputFolder = typeFolder + "ext-" + framework + (info.xtype == 'blank' ? '' : '-' + info.xtype) + '/';
    const outputFolder = `${typeFolder}ext-${info.framework}${info.toolkitshown}${info.bundle}/`;


    //fs.copySync(extFolder,`${outputFolder}/ext`);
    //fs.copySync(`./MaterialTheme`,`${outputFolder}/ext/MaterialTheme`);

    //fs.copySync(`./theme/material`,`${outputFolder}ext-runtime/theme/material`);
    //fs.copySync(`./theme/neptune`,`${outputFolder}ext-runtime/theme/neptune`);
    fs.copySync(`${extFolder}ext.${info.xtype}.js`,`${outputFolder}ext-runtime/ext.${info.xtype}.js`);
    //fs.copySync(`${extFolder}ext.${info.xtype}.js`,`${outputFolder}ext-runtime/engine.js`);
    // try {
    //   if (fs.existsSync(extFolder + 'ext.blank.js')) {
    //     fs.copySync(extFolder + 'ext.blank.js',`${outputFolder}ext-runtime/engine.js`);
    //   }
    // } catch(err) {
    //     fs.copySync(extFolder,`${outputFolder}ext-runtime`);
    // }

    //const outputFolderReact = typeFolder + "ext-" + 'react' + (info.xtype == 'blank' ? '' : '-' + info.xtype) + '/';
    ////console.log(`${extFolder}ext.${info.xtype}.js`)
    ////console.log(`${outputFolderReact}ext-runtime/${info.xtype}.js`)

    //fs.copySync(`${extFolder}ext.${info.xtype}.js`,`${outputFolderReact}ext-runtime/${info.xtype}.js`);

    //const outputFolderAngular = typeFolder + "ext-" + 'angular' + (info.xtype == 'blank' ? '' : '-' + info.xtype) + '/';
    ////console.log(`${extFolder}ext.${info.xtype}.js`)
    ////console.log(`${outputFolderReact}ext-runtime/${info.xtype}.js`)
    //fs.copySync(`${extFolder}ext.${info.xtype}.js`,`${outputFolderAngular}ext-runtime/${info.xtype}.js`);

    //fs.copySync(extFolder,`${outputFolder}/ext-runtime`);
    //fs.copySync(`./MaterialTheme`,`${outputFolder}/ext-runtime`);

}

function createAngular() {
    var framework='angular';
    info.framework=framework;
    const templateFolder = "./filetemplates/" + framework + "/";
    //const outputFolder = typeFolder + "ext-" + framework + (info.xtype == 'blank' ? '' : '-' + info.xtype) + '/';
    const outputFolder = `${typeFolder}ext-${info.framework}${info.toolkitshown}${info.bundle}/`;

    rimraf.sync(outputFolder);
    mkdirp.sync(outputFolder);

    writeTemplateFile(templateFolder+`package.tpl`,`${outputFolder}package.json`,info);
    writeTemplateFile(templateFolder+`README.tpl`,`${outputFolder}README.md`,info);
    writeTemplateFile(templateFolder+`module.tpl`,`${outputFolder}ext-${framework}${info.toolkitshown}${info.bundle}.module.ts`,moduleVars);
    writeTemplateFile(templateFolder+`public_api.tpl`,`${outputFolder}/public_api.ts`,info);
    copyFileSync(templateFolder+`postinstall.js`, outputFolder+`postinstall.js`);
    copyFileSync(templateFolder+`tsconfig.json`, outputFolder+`tsconfig.json`);
    copyFileSync(templateFolder+`tsconfig.lib.json`, outputFolder+`tsconfig.lib.json`);
    copyFileSync(templateFolder+`ng-package.json`, outputFolder+`ng-package.json`);



    // const distinct = (value, index, self) => {
    //     return self.indexOf(value) === index;
    // }
    // var aItemsDistinct = aItems.filter(distinct);
    // angularIndex = ''
    // aItemsDistinct.forEach(Xtype => {
    //     angularIndex = angularIndex + `import { Ext${Xtype}Component_ } from '@sencha/ext-angular/src/Ext${Xtype}.ts';export const Ext${Xtype}Component = Ext${Xtype}Component_;\n`;
    // })

    // info.angularIndex = angularIndex;
    // writeTemplateFile(templateFolder+'index.tpl', `${outputFolder}index.ts`, info)



    fs.copySync(angularFolder,`${outputFolder}/src`)
}

function createReact() {
    var framework='react';
    info.framework=framework;
    const templateFolder = "./filetemplates/" + framework + "/";
    //console.log('createReact')
    //console.log(info.xtype)
    //const outputFolder = typeFolder + "ext-" + framework + (info.xtype == 'blank' ? '' : '-' + info.xtype) + '/';
    const outputFolder = `${typeFolder}ext-${info.framework}${info.toolkitshown}${info.bundle}/`;
    //console.log(outputFolder)

    rimraf.sync(outputFolder);
    mkdirp.sync(outputFolder);


    writeTemplateFile(templateFolder+`package.tpl`,`${outputFolder}package.json`,info);
    copyFileSync(templateFolder+`postinstall.js`, `${outputFolder}postinstall.js`);
    copyFileSync(templateFolder+`.babelrc`, `${outputFolder}.babelrc`);

    const examples = require(templateFolder + "examples/" + info.xtype).examples;
    info.component = examples('component');
    writeTemplateFile(templateFolder+`README.tpl`,`${outputFolder}README.md`,info);

    // //console.log(aItems.length);
    // const distinct = (value, index, self) => {
    //     return self.indexOf(value) === index;
    // }
    // var aItemsDistinct = aItems.filter(distinct);
    // //console.log(aItemsDistinct.length);

    //reactIndex = ''

    info.wantedxtypes.forEach(xtype => {
      var Xtype = xtype.charAt(0).toUpperCase() + xtype.slice(1).replace(/-/g,'_');
      info.reactImports = info.reactImports + `import Ext${Xtype}_ from "./dist/Ext${Xtype}";\n`;
      info.reactExports = info.reactExports + `export const Ext${Xtype} = Ext${Xtype}_;\n`;
      info.reactExports70 = info.reactExports70 + `export const ${Xtype} = Ext${Xtype}_;\n`;
    })


    // aItemsInBundle.forEach(Xtype => {
    //     //reactIndex = reactIndex + `import Ext${Xtype}_ from "@sencha/ext-react${info.bundle}/dist/Ext${Xtype}";export const Ext${Xtype} = Ext${Xtype}_;export const ${Xtype} = Ext${Xtype}_;\n`;
    //     info.reactImports = info.reactImports + `import Ext${Xtype}_ from "./dist/Ext${Xtype}";\n`;
    //     info.reactExports = info.reactExports + `export const Ext${Xtype} = Ext${Xtype}_;\n`;
    //     info.reactExports70 = info.reactExports70 + `export const ${Xtype} = Ext${Xtype}_;\n`;
    //     //info.reactExportsCase = info.reactExportsCase + `export const ${Xtype}2 = Ext${Xtype}_;\n`;
    // })

    //info.reactIndex = reactIndex;
    writeTemplateFile(templateFolder+'index.js.tpl', `${outputFolder}index.js`, info)

    fs.copySync(reactFolder,`${outputFolder}/src`)
    //fs.copySync(reactStagingFolder,`${outputFolder}/src`)
}



async function doInstall() {
    console.log('doInstall')
    var origCwd = process.cwd();
    console.log('cwd is: ' + origCwd);


    //if (info.xtype != 'blank') {
        if (installExt == true) {
            process.chdir('./bundler');
            var currDir = process.cwd()

            var bundle = {};
            bundle.xtype = info.xtype;
            bundle.creates = require(`./npmpackage/${toolkit}/${info.xtype}`).getCreates();

            writeTemplateFile(`./template/app.json.tpl`,`./app.json`, bundle);
            //console.log(`app.json` + ' created');
            writeTemplateFile(`./template/package.json.tpl`,`./package.json`, bundle);
            //console.log(`package.json` + ' created');
            writeTemplateFile(`./template/css.manifest.js.tpl`,`./manifest/${info.xtype}.css.manifest.js`, bundle);
            //console.log(`manifest/${info.xtype}.css.manifest.js` + ' created');
            writeTemplateFile(`./template/ext.manifest.js.tpl`,`./manifest/${info.xtype}.ext.manifest.js`, bundle);
            //console.log(`manifest/${info.xtype}.ext.manifest.js` + ' created');

            //temporary next line await run(`npm start`);
            writeTemplateFile(`./template/xtype.js.tpl`,`./dist/ext.${info.xtype}.js`, bundle);

            //console.log('./dist/css.' + info.xtype + '.js created')
            console.log('./dist/ext.' + info.xtype + '.js created')

            process.chdir(origCwd);
            //console.log(process.cwd())

            //copyFileSync('./bundler/dist/css.' + info.xtype + '.js', extFolder + "css." + info.xtype + '.js');
            copyFileSync('./bundler/dist/ext.' + info.xtype + '.js', extFolder + "ext." + info.xtype + '.js');

            createWebComponentsExt();
        }
    //}

    // var info.xtype
    // var package
    // var packageJson
    // var packageString


    //console.log(info)

    //ext-web-components
    process.chdir(typeFolder + 'ext-web-components-' + info.toolkit + info.bundle);
    await run(`npm install`);
    await run(`npm publish --force`);

    await run(`rm -r ../../../../../ext-web-components/packages/ext-web-components${info.toolkitshown}${info.bundle}`);
    //await run(`cp -R ./${packagefolder} ../../../../../ext-$angular/packages/ext-angular${info.bundle}`);
    await run(`cp -R ./ ../../../../../ext-web-components/packages/ext-web-components${info.toolkitshown}${info.bundle}`);




    process.chdir(origCwd);
    //ext-web-components

    //ext-react
    process.chdir(typeFolder + 'ext-react-' + info.toolkit + info.bundle);
    await run(`npm install`);
    var packagenameReact = './package.json';
    var packageReact = fs.readFileSync(packagenameReact, 'utf8');
    var packageJsonReact = JSON.parse(packageReact);
    if (packageJsonReact.scripts == undefined) {
        packageJsonReact.scripts = {};
    }
    packageJsonReact.scripts.postinstall = "node ./postinstall.js";
    packageStringReact = JSON.stringify(packageJsonReact, null, 2);
    fs.writeFileSync(packagenameReact, packageStringReact);
    await run(`npm publish --force`);

    await run(`rm -r ../../../../../ext-react/packages/ext-react${info.toolkitshown}${info.bundle}`);
    //await run(`cp -R ./${packagefolder} ../../../../../ext-$angular/packages/ext-angular${info.bundle}`);
    await run(`cp -R ./ ../../../../../ext-react/packages/ext-react${info.toolkitshown}${info.bundle}`);





    process.chdir(origCwd);
    //ext-react


    //ext-angular
    process.chdir(typeFolder + 'ext-angular-' + info.toolkit + info.bundle);
    await run(`npm install`);
    await run(`npm run packagr`);
    await run(`cp -R ./src dist/lib`);
    await run(`cp ./postinstall.js dist/postinstall.js`);
    process.chdir('dist');
    var packagenameAngular = './package.json';
    var packageAngular = fs.readFileSync(packagenameAngular, 'utf8');
    var packageJsonAngular = JSON.parse(packageAngular);
    if (packageJsonAngular.scripts == undefined) {
        packageJsonAngular.scripts = {};
    }
    packageJsonAngular.scripts.postinstall = "node ./postinstall.js";
    packageStringAngular = JSON.stringify(packageJsonAngular, null, 2);
    fs.writeFileSync(packagenameAngular, packageStringAngular);
    await run(`npm publish --force`);

  process.chdir('../');
  //var suffix = info.xtype == 'blank' ? '' : '-' + info.xtype
  //console.log(process.cwd())
  await run(`rm -r ../../../../../ext-angular/packages/ext-angular${info.toolkitshown}${info.bundle}`);
  //await run(`cp -R ./${packagefolder} ../../../../../ext-$angular/packages/ext-angular${info.bundle}`);
  await run(`cp -R ./dist ../../../../../ext-angular/packages/ext-angular${info.toolkitshown}${info.bundle}`);





    process.chdir(origCwd);
    //ext-angular


    console.log('')
    console.log(`https://sencha.myget.org/feed/early-adopter/package/npm/%40sencha/ext-web-components${info.toolkitshown}${info.bundle}/${info.version}`)
    console.log(`https://sencha.myget.org/feed/early-adopter/package/npm/%40sencha/ext-react${info.toolkitshown}${info.bundle}/${info.version}`)
    console.log(`https://sencha.myget.org/feed/early-adopter/package/npm/%40sencha/ext-angular${info.toolkitshown}${info.bundle}/${info.version}`)
    console.log('')

    return

    process.chdir(outputFolder);
    await run(`npm install`);
    var packagefolder = ''
    if (framework == 'angular') {
        await run(`npm run packagr`);
        await run(`cp -R ./src dist/lib`);
        if (info.xtype != 'blank') {
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
    var suffix = info.xtype == 'blank' ? '' : '-' + info.xtype
    //console.log(process.cwd())
    await run(`rm -r ../../../../ext-${framework}/packages/ext-${framework}${suffix}`);
    await run(`cp -R ./${packagefolder} ../../../../ext-${framework}/packages/ext-${framework}${suffix}`);

    console.log(`https://sencha.myget.org/feed/early-adopter/package/npm/%40sencha/ext-${framework}${suffix}/${info.version}`)
}

