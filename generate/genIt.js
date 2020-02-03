// node ./genIt.js ele blank modern
// node ./genIt.js ele blank classic
// node ./genIt.js ele button

const doGenerate = true;
const npmInstall = true;
const npmCopy = true;
const npmPublish = false;

const doAllinXtype = true;
var didXtype = false;

const toolkit = process.argv[4];
var toolkits = ['modern', 'classic'];
if (toolkits.includes(toolkit) == false) {
  log('toolkit not valid')
  return
}
log('genIt started');
log('toolkit - ' + toolkit);
log('doGenerate - ' + doGenerate);
log('npmInstall - ' + npmInstall);
log('npmCopy - ' + npmCopy);
log('npmPublish - ' + npmPublish);

const genItUtils = require("./genItUtils");
const run = genItUtils.run;
const writeTemplateFile = genItUtils.writeTemplateFile;
const doProperties = genItUtils.doProperties;
const doMethods = genItUtils.doMethods;
const doEvents = genItUtils.doEvents;
const copyFileSync = require('fs-copy-file-sync');
const fs = require("fs-extra");
const path = require("path");
const rimraf = require("rimraf");
const mkdirp = require("mkdirp");
require("./XTemplate");

var info = {};
info.now = new Date().toString();
info.toolkit = toolkit;
info.Toolkit = info.toolkit.charAt(0).toUpperCase() + info.toolkit.slice(1);
info.toolkitshown = `-${info.toolkit}`;
info.version = '7.1.1';
info.reactPrefix = 'Ext';
info.shortname = process.argv[2];
info.Shortname = info.shortname.charAt(0).toUpperCase() + info.shortname.slice(1);
info.framework = 'elements';
info.suffixParm = process.argv[3];
if (info.suffixParm == 'blank') {
  info.bundle = ''
  info.Bundle = ''
  info.name = ''
}
else {
  info.bundle = '-' + info.suffixParm
  info.Bundle = info.suffixParm.charAt(0).toUpperCase() + info.suffixParm.slice(1);
  info.name = info.bundle.substring(1)
}

info.data = require(`./AllClassesFiles/docs/${info.toolkit}/${info.toolkit}-all-classes-flatten.json`);
info.wantedxtypes = require(`./npmpackage/${toolkit}/${info.suffixParm}`).getXtypes();

const moduleVars = { imports: "", declarations: "", exports: "", ewcimports: "", engimports: "" };

info.ewcimports = ''
info.allExtended = '';
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
    //info.importsxng = info.imports + `import {Ext${W}Component} from\n  '@sencha/ext-angular-${info.xztype}/esm5/src/ext-${w}.component';\n`
    //info.importsewc = info.imports + `import '@sencha/ext-web-components-${info.xztype}/lib/ext-${w}.component';\n`
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
export const TreeColumn = ExtTreecolumn_;
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

const generatedFolders = "./GeneratedFolders/";
const typeFolder = generatedFolders + info.suffixParm + '/';
const templateFolder = "./filetemplates/" + info.framework + "/";
const outputFolder = `${typeFolder}ext-${info.framework}${info.toolkitshown}${info.bundle}/`;
const srcFolder = outputFolder + "src/";
const srcStagingFolder = outputFolder + "srcStaging/";
const docFolder = outputFolder + 'doc/';
const docStagingFolder = outputFolder + 'docStaging/';
const binFolder = outputFolder + 'bin/';
const reactFolder = outputFolder + 'react/';
const reactStagingFolder = outputFolder + 'reactStaging/';
const angularFolder = outputFolder + 'angular/';
const angularStagingFolder = outputFolder + 'angularStaging/';
const extFolder = outputFolder + 'ext/';

if (doGenerate == false) {
  log('');log(`doGenerate is false`);
  doInstall();
  return
}
log('');log(`doGenerate is true`);

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
mkdirp.sync(angularFolder);
mkdirp.sync(angularStagingFolder);
//if (installExt == true) {mkdirp.sync(extFolder)}

//mjg
for (i = 0; i < info.data.global.items.length; i++) {
  doLaunch(info.data.global.items[i], info.framework);
}
doPostLaunch();
doInstall();

function doLaunch(item, framework) {
    var processIt = shouldProcessIt(item)
    if (processIt == true) {

      if (info.toolkit == 'classic') {
        var n = item.extends.indexOf(',Object');
        if (n > 0) {
          item.extends = item.extends.substring(0, n)
        }

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
          oneItem(item, names, [])
        }

        xtypes.forEach(xtype => {
          var xtypesArray = []
          xtypesArray.push(xtype)

          oneItem(item, names, xtypesArray)
        })
        //console.log(item.alias + ' ' + item.extends + ' ' + item.alternateClassNames)
        return
      }

      if (info.toolkit == 'modern') {
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

        item.xtype = xtypes[0]
        if (xtypes.length == 0) {
          oneItem(item, names, [])
        }

        xtypes.forEach(xtype => {
          var xtypesArray = []
          xtypesArray.push(xtype)
          oneItem(item, names, xtypesArray)
        })
      }
    }
    else {
      //console.log('not processed')
    }
}

function oneItem(item, names, xtypes) {
  var xtype = xtypes[0];

  info.propertyObj = doProperties(item, doAllinXtype);
  info.methodObj = doMethods(item, doAllinXtype);
  info.eventObj = doEvents(item, doAllinXtype);

  didXtype = false;

  //remove duplicate names that are different only by case
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

        var templateFile = ''
        var v = {}
        if (item.name == 'Ext.Base') {
            templateFile = 'base.tpl';
            v = {
                shortname: info.shortname,
                Shortname: info.Shortname,
                classname: classname,
                sPROPERTIES: info.propertyObj.sPROPERTIES,
                sEVENTS: info.eventObj.sEVENTS
            }
        }
        else {
            templateFile = 'class.tpl';
            v = {
              extendsclassname: item.extends.replace(/\./g, "_"),
              pathprefix: pathprefix,
              extendpath: extendpath,
              classextendsfilename: extendparts[extendparts.length-1],
              classname: classname,
              sPROPERTIES: info.propertyObj.sPROPERTIES,
              sEVENTS: info.eventObj.sEVENTS
          }
        }
        writeTemplateFile(`${templateFolder}${templateFile}`, `${folder}${filename}.js`, v)

        if(xtypes[0] != undefined) {
            var Xtype = xtypes[0].charAt(0).toUpperCase() + xtypes[0].slice(1).replace(/-/g,'_');
        }

        for (var j = 0; j < xtypes.length; j++) {
            var folder = '.'
            var folders = classname.split('_')
            for (var k = 0; k < folders.length; k++) {
                folder = folder + '/' + folders[k]
            }
            var values = {
              propNames: info.propertyObj.propNames,
              eventNames: info.eventObj.eventNames,
              classname: classname,
              doAllinXtype: doAllinXtype,
              sPROPERTIES: info.propertyObj.sPROPERTIES,
              sEVENTS: info.eventObj.sEVENTS,
              sEVENTNAMES: info.eventObj.sEVENTNAMES,
              folder: folder,
              toolkit: toolkit,
              bundle: info.bundle,
              Xtype: xtypes[j].charAt(0).toUpperCase() + xtypes[j].slice(1).replace(/-/g,'_'),
              xtype: xtypes[j]
            }
            if (xtypes[j] == "grid" && info.toolkit == 'modern') {
            //if (xtypes[j] == "grid") {
                values.ReactCell = "import './ReactCell';"
                values.ElementCell = "import './ElementCell';"
            }
            else {
                values.ReactCell = ""
                values.ElementCell = ""
            }

            if (xtypes[j] == "grid") {
              //if (xtypes[j] == "grid") {
                  values.overrides = "import './overrides';"
                  values.Template = "export { default as Template } from './Template';"
              }
              else {
                  values.overrides = ""
                  values.Template = ""
              }

            writeTemplateFile(`${templateFolder}xtype.tpl`, `${srcStagingFolder}ext-${xtypes[j]}.component.js`, values)
            writeTemplateFile(`${templateFolder}react.tpl`, `${reactStagingFolder}${info.reactPrefix}${values.Xtype}.js`, values)
            writeTemplateFile(`${templateFolder}angular.tpl`, `${angularStagingFolder}Ext${values.Xtype}.ts`, values)

            //investigate - because every multi-xtype component
            if (didXtype == false) {
                didXtype = true
                xt = values.xtype

                if (info.wantedxtypes.includes(xt)) {
                    var theNames = ""
                    names.forEach(name => theNames += name + ',')
                    info.allExtended = info.allExtended + theNames + ',' + item.extended + ',';
                    var classname = xt.replace(/-/g, "_");
                    var capclassname = classname.charAt(0).toUpperCase() + classname.slice(1);
                    moduleVars.imports = moduleVars.imports +`import { Ext${capclassname}Component } from './src/ext-${xt}.component.js';\n`;
                    info.ewcimports = info.ewcimports + `import './dist/ext-${xt}.component.js';\n`;
                    moduleVars.engimports = moduleVars.engimports + `import { Ext${capclassname}Component } from './src/Ext${capclassname}.js';\n`;
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
            } else {
              //console.log(values.xtype)
              //console.log(xtypes)
            }

            //docs
            var ewcProperties = ''
            info.propertyObj.propertiesArray.forEach(property => {
                var Text = ''
                if (property.text != undefined) {
                    Text = property.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
                }
                property.ewc = `${property.name}<br/>${Text}<br/><br/>`;
                ewcProperties = ewcProperties + property.ewc + '\n';
            });

            var ewcEvents = ''
            info.eventObj.eventsArray.forEach(event => {
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
                propertiesDocs: info.propertyObj.propertiesDocs,
                methodsDocs: info.methodObj.methodsDocs,
                eventsDocs: info.eventObj.eventsDocs,
                //sPROPERTIESGETSET: sGETSET,
                sMETHODS: info.eventObj.sMETHODS,
                sPROPERTIES: info.propertyObj.sPROPERTIES,
                //sPROPERTIESOBJECT: sPROPERTIESOBJECT,
                sEVENTS: info.eventObj.sEVENTS,
                sEVENTNAMES: info.eventObj.sEVENTNAMES,
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
                properties: info.propertyObj.propertiesArray,
                methods: info.methodObj.methodsArray,
                events: info.eventObj.eventsArray,
            })

            writeTemplateFile(`${templateFolder}docdetail.tpl`, `${docStagingFolder}ext-${xtypes[j]}.doc.html`, values3)
            writeTemplateFile(`${templateFolder}docdata.tpl`, `${docStagingFolder}ext-${xtypes[j]}.doc.js`, {props: info.propertyObj.propNames.toString()})
            //docs
          }
  }
}

//mjg
function doPostLaunch() {

    //elements
    writeTemplateFile(`${templateFolder}bin-ext-${info.framework}.tpl`,`${outputFolder}bin/ext-${info.framework}${info.toolkitshown}${info.bundle}.js`,info);
    copyFileSync(`${templateFolder}.babelrc`, outputFolder+`.babelrc`);
    writeTemplateFile(`${templateFolder}module.tpl`, `${outputFolder}ext-${info.framework}${info.toolkitshown}${info.bundle}.module.js`, moduleVars);
    writeTemplateFile(`${templateFolder}package.json.tpl`,`${outputFolder}package.json`,info);
    writeTemplateFile(`${templateFolder}README.md.tpl`,`${outputFolder}README.md`,info);
    writeTemplateFile(`${templateFolder}index.html.tpl`,`${outputFolder}index.html`,info);
    console.log(outputFolder)
    writeTemplateFile(`${templateFolder}index.js.tpl`, `${outputFolder}index.js`, info);

    //web-components
    writeTemplateFile(`${templateFolder}ElementParser.js.tpl`, `${srcFolder}ElementParser.js`, info);
    copyFileSync(`${templateFolder}ElementCell.js`, srcFolder + `ElementCell.js`);
    copyFileSync(`${templateFolder}util.js`, srcFolder + `util.js`);
    writeTemplateFile(`${templateFolder}router.tpl`, `${srcFolder}ext-router.component.js`, info);

    info.import = ``
//     if (info.xztype != 'blank') {
//         if (installExt == true) {
// //             info.import =
// // `import 'script-loader!../ext/ext.${info.xztype}';
// // import 'script-loader!../ext/css.${info.xztype}';`
//            info.import =
// `import 'script-loader!@sencha/ext-${framework}${info.bundle}/ext/ext.${info.xztype}';
// import 'script-loader!@sencha/ext-${framework}${info.bundle}/ext/css.${info.xztype}';`
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

    //docs
    fs.writeFileSync(`${docFolder}data.js`,'window.xtypemenu = ' + JSON.stringify(docs, null, ' '));
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
    writeTemplateFile(`${templateFolder}doc.tpl`, `${docFolder}doc.html`, info)
    writeTemplateFile(`${templateFolder}doc-z-tabs.tpl`, `${docFolder}z-tabs.js`, info)
    writeTemplateFile(`${templateFolder}doc-style.tpl`, `${docFolder}style.css`, info)
    writeTemplateFile(`${templateFolder}docstyle.tpl`, `${docFolder}docstyle.css`, info)
    //doc

    //writeTemplateFile(`${templateFolder}launch.js.tpl`,`${outputFolder}react/launch.js`,info);
    copyFileSync(`${templateFolder}reactize.js`, `${outputFolder}react/reactize.js`);
    copyFileSync(`${templateFolder}ReactCell.js`, `${outputFolder}react/ReactCell.js`);
    copyFileSync(`${templateFolder}angularbase.ts`, `${outputFolder}angular/angularbase.ts`);

    writeTemplateFile(`${templateFolder}ext-react.component.js.tpl`, `${outputFolder}react/ext-react.component.js`, {})
    writeTemplateFile(`${templateFolder}ext-react-renderer.component.js.tpl`, `${outputFolder}react/ext-react-renderer.component.js`, {})
    writeTemplateFile(`${templateFolder}ExtReact.js.tpl`, `${outputFolder}react/ExtReact.js`, {})
    writeTemplateFile(`${templateFolder}ExtReactRenderer.js.tpl`, `${outputFolder}react/ExtReactRenderer.js`, {})

    // writeTemplateFile(`${templateFolder}ext-react.component.js.tpl`, `${srcFolder}ext-react.component.js`, {})
    // writeTemplateFile(`${templateFolder}ext-react-renderer.component.js.tpl`, `${srcFolder}ext-react-renderer.component.js`, {})
    // writeTemplateFile(`${templateFolder}ExtReact.js.tpl`, `${reactFolder}ExtReact.js`, {})
    // writeTemplateFile(`${templateFolder}ExtReactRenderer.js.tpl`, `${reactFolder}ExtReactRenderer.js`, {})

    //copy staging Ext folder to src Ext
    var allExtendedArray = info.allExtended.split(",");
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
        fromFolder = `${srcStagingFolder}${thePath}${filename}.js`
        toFolder = `${srcFolder}${thePath}${filename}.js`
        copyFileSync(fromFolder, toFolder);
    })

    rimraf.sync(reactStagingFolder);
    rimraf.sync(angularStagingFolder);
    rimraf.sync(srcStagingFolder);
    rimraf.sync(docStagingFolder);

    createWebComponents()
    createAngular()
    createReact()
}

function createWebComponents() {
    info.framework='web-components';
    const webComponentsTemplateFolder = `./filetemplates/${info.framework}/`;
    const outputFolder = `${typeFolder}ext-${info.framework}${info.toolkitshown}${info.bundle}/`;

    rimraf.sync(outputFolder);
    mkdirp.sync(outputFolder);
    mkdirp.sync(`${outputFolder}bin`);

    fs.copySync(srcFolder,`${outputFolder}src`);
    //fs.copySync(docFolder,`${outputFolder}/doc`);

    writeTemplateFile(`${webComponentsTemplateFolder}ext-web-components.js.tpl`,`${outputFolder}bin/ext-web-components.js`,info);
    writeTemplateFile(`${webComponentsTemplateFolder}index.js.tpl`,`${outputFolder}index.js`,info);
    writeTemplateFile(`${webComponentsTemplateFolder}package.json.tpl`,`${outputFolder}package.json`,info);
    writeTemplateFile(`${webComponentsTemplateFolder}${info.toolkit}/${info.suffixParm}/README.md.tpl`,`${outputFolder}README.md`,info);
    copyFileSync(`${webComponentsTemplateFolder}.babelrc`, `${outputFolder}.babelrc`);

    //const elementsOutputFolder = `${typeFolder}ext-elements${info.toolkitshown}${info.bundle}/`;
    //fs.copySync(`${elementsOutputFolder}index.js`,`${outputFolder}index.js`);
    //fs.copySync(`${elementsOutputFolder}index.html`,`${outputFolder}index.html`);

    fs.copySync(`./ext-runtime/ext-runtime-${info.toolkit}`,`${outputFolder}ext-runtime-${info.toolkit}`)

    writeTemplateFile(`${webComponentsTemplateFolder}guides/GETTING_STARTED.tpl`,`${outputFolder}GETTING_STARTED.md`,info);
    writeTemplateFile(`${webComponentsTemplateFolder}guides/MIGRATE.tpl`,`${outputFolder}MIGRATE.md`,info);
    writeTemplateFile(`${webComponentsTemplateFolder}guides/README.tpl`,`${outputFolder}README.md`,info);
    writeTemplateFile(`${webComponentsTemplateFolder}guides/UNDERSTANDING_AN_APP.tpl`,`${outputFolder}UNDERSTANDING_AN_APP.md`,info);
    writeTemplateFile(`${webComponentsTemplateFolder}guides/USING_EXT_WEBPACK_PLUGIN.tpl`,`${outputFolder}USING_EXT_WEBPACK_PLUGIN.md`,info);
    writeTemplateFile(`${webComponentsTemplateFolder}guides/USING_SVELTE.tpl`,`${outputFolder}USING_SVELTE.md`,info);
    writeTemplateFile(`${webComponentsTemplateFolder}guides/USING_VUE.tpl`,`${outputFolder}USING_VUE.md`,info);
    writeTemplateFile(`${webComponentsTemplateFolder}guides/WHATS_NEW.tpl`,`${outputFolder}WHATS_NEW.md`,info);
}

function createAngular() {
    info.framework='angular';
    const angularTemplateFolder = `./filetemplates/${info.framework}/`;
    const outputFolder = `${typeFolder}ext-${info.framework}${info.toolkitshown}${info.bundle}/`;

    rimraf.sync(outputFolder);
    mkdirp.sync(outputFolder);
    mkdirp.sync(`${outputFolder}bin`);

    fs.copySync(angularFolder,`${outputFolder}src`)

    writeTemplateFile(`${angularTemplateFolder}ext-angular.js.tpl`,`${outputFolder}bin/ext-angular.js`,info);
    writeTemplateFile(`${angularTemplateFolder}package.tpl`,`${outputFolder}package.json`,info);
    writeTemplateFile(`${angularTemplateFolder}module.tpl`,`${outputFolder}ext-${info.framework}${info.toolkitshown}${info.bundle}.module.ts`,moduleVars);
    writeTemplateFile(`${angularTemplateFolder}public_api.tpl`,`${outputFolder}public_api.ts`,info);
    copyFileSync(`${angularTemplateFolder}tsconfig.json`, `${outputFolder}tsconfig.json`);
    copyFileSync(`${angularTemplateFolder}tsconfig.lib.json`, `${outputFolder}tsconfig.lib.json`);
    copyFileSync(`${angularTemplateFolder}ng-package.json`, `${outputFolder}ng-package.json`);

    copyFileSync(`${angularTemplateFolder}postinstall.js`, `${outputFolder}postinstall.js`);
    writeTemplateFile(`${angularTemplateFolder}guides/GETTING_STARTED.tpl`,`${outputFolder}GETTING_STARTED.md`,info);
    writeTemplateFile(`${angularTemplateFolder}guides/MIGRATE.tpl`,`${outputFolder}MIGRATE.md`,info);
    writeTemplateFile(`${angularTemplateFolder}guides/README.tpl`,`${outputFolder}README.md`,info);
    writeTemplateFile(`${angularTemplateFolder}guides/UNDERSTANDING_AN_APP.tpl`,`${outputFolder}UNDERSTANDING_AN_APP.md`,info);
    writeTemplateFile(`${angularTemplateFolder}guides/USING_EXT_WEBPACK_PLUGIN.tpl`,`${outputFolder}USING_EXT_WEBPACK_PLUGIN.md`,info);
    writeTemplateFile(`${angularTemplateFolder}guides/WHATS_NEW.tpl`,`${outputFolder}WHATS_NEW.md`,info);
}

function createReact() {
    info.framework='react';
    const reactTemplateFolder = `./filetemplates/${info.framework}/`;
    const outputFolder = `${typeFolder}ext-${info.framework}${info.toolkitshown}${info.bundle}/`;

    rimraf.sync(outputFolder);
    mkdirp.sync(outputFolder);
    mkdirp.sync(`${outputFolder}bin`);

    fs.copySync(reactFolder,`${outputFolder}src`)

    info.wantedxtypes.forEach(xtype => {
      var Xtype = xtype.charAt(0).toUpperCase() + xtype.slice(1).replace(/-/g,'_');
      info.reactImports = info.reactImports + `import Ext${Xtype}_ from "./Ext${Xtype}";\n`;
      info.reactExports = info.reactExports + `export const Ext${Xtype} = Ext${Xtype}_;\n`;
      info.reactExports70 = info.reactExports70 + `export const ${Xtype} = Ext${Xtype}_;\n`;
    })

    writeTemplateFile(`${reactTemplateFolder}ext-react.js.tpl`,`${outputFolder}bin/ext-react.js`,info);
    writeTemplateFile(`${reactTemplateFolder}package.tpl`,`${outputFolder}package.json`,info);

    copyFileSync(`${reactTemplateFolder}.babelrc`, `${outputFolder}.babelrc`);

    writeTemplateFile(`${reactTemplateFolder}index.js.tpl`, `${outputFolder}src/index.js`, info);
    writeTemplateFile(`${reactTemplateFolder}overrides.js.tpl`, `${outputFolder}src/overrides.js`, info);
    writeTemplateFile(`${reactTemplateFolder}Template.js.tpl`, `${outputFolder}src/Template.js`, info);

    const examples = require(reactTemplateFolder + "examples/" + info.suffixParm).examples;
    info.component = examples('component');

    copyFileSync(`${reactTemplateFolder}postinstall.js`, `${outputFolder}postinstall.js`);
    writeTemplateFile(`${reactTemplateFolder}guides/GETTING_STARTED.tpl`,`${outputFolder}GETTING_STARTED.md`,info);
    writeTemplateFile(`${reactTemplateFolder}guides/MIGRATE.tpl`,`${outputFolder}MIGRATE.md`,info);
    writeTemplateFile(`${reactTemplateFolder}guides/README.tpl`,`${outputFolder}README.md`,info);
    writeTemplateFile(`${reactTemplateFolder}guides/UNDERSTANDING_AN_APP.tpl`,`${outputFolder}UNDERSTANDING_AN_APP.md`,info);
    writeTemplateFile(`${reactTemplateFolder}guides/USING_EXT_WEBPACK_PLUGIN.tpl`,`${outputFolder}USING_EXT_WEBPACK_PLUGIN.md`,info);
    writeTemplateFile(`${reactTemplateFolder}guides/WHATS_NEW.tpl`,`${outputFolder}WHATS_NEW.md`,info);
  }


function createWebComponentsExt() {
  var framework='web-components';
  //const templateFolder = "./filetemplates/" + framework + "/";
  //const outputFolder = typeFolder + "ext-" + framework + (info.xztype == 'blank' ? '' : '-' + info.xztype) + '/';
  const outputFolder = `${typeFolder}ext-${info.framework}${info.toolkitshown}${info.bundle}/`;


  //fs.copySync(extFolder,`${outputFolder}/ext`);
  //fs.copySync(`./MaterialTheme`,`${outputFolder}/ext/MaterialTheme`);

  //fs.copySync(`./theme/material`,`${outputFolder}ext-runtime/theme/material`);
  //fs.copySync(`./theme/neptune`,`${outputFolder}ext-runtime/theme/neptune`);
  fs.copySync(`${extFolder}ext.${info.suffixParm}.js`,`${outputFolder}ext-runtime/ext.${info.suffixParm}.js`);
  //fs.copySync(`${extFolder}ext.${info.xztype}.js`,`${outputFolder}ext-runtime/engine.js`);
  // try {
  //   if (fs.existsSync(extFolder + 'ext.blank.js')) {
  //     fs.copySync(extFolder + 'ext.blank.js',`${outputFolder}ext-runtime/engine.js`);
  //   }
  // } catch(err) {
  //     fs.copySync(extFolder,`${outputFolder}ext-runtime`);
  // }

  //const outputFolderReact = typeFolder + "ext-" + 'react' + (info.xztype == 'blank' ? '' : '-' + info.xztype) + '/';
  ////console.log(`${extFolder}ext.${info.xztype}.js`)
  ////console.log(`${outputFolderReact}ext-runtime/${info.xztype}.js`)

  //fs.copySync(`${extFolder}ext.${info.xztype}.js`,`${outputFolderReact}ext-runtime/${info.xztype}.js`);

  //const outputFolderAngular = typeFolder + "ext-" + 'angular' + (info.xztype == 'blank' ? '' : '-' + info.xztype) + '/';
  ////console.log(`${extFolder}ext.${info.xztype}.js`)
  ////console.log(`${outputFolderReact}ext-runtime/${info.xztype}.js`)

  //fs.copySync(extFolder,`${outputFolder}/ext-runtime`);
  //fs.copySync(`./MaterialTheme`,`${outputFolder}/ext-runtime`);

}




async function doInstall() {
  var origCwd = process.cwd();
  var webComponentsFolder = `${typeFolder}ext-web-components${info.toolkitshown}${info.bundle}`;
  var angularFolder = `${typeFolder}ext-angular${info.toolkitshown}${info.bundle}`;
  var reactFolder = `${typeFolder}ext-react${info.toolkitshown}${info.bundle}`;

  if (npmInstall == true) {
    log('');log(`npmInstall is true`);
    process.chdir(webComponentsFolder);
    log('');log(`npm install in: ${process.cwd()}`);
    await run(`npm install`);
    process.chdir(origCwd);

    process.chdir(angularFolder);
    log('');log(`npm install in ${process.cwd()}`);
    await run(`npm install`);
    log(`npm run packagr in ${process.cwd()}`);
    await run(`npm run packagr`);

    log(`add postinstall.js and all .md in ${process.cwd()}`);
    await run(`cp -R ./src dist/lib`);
    await run(`cp -R ./bin dist/bin`);
    await run(`cp ./postinstall.js dist/postinstall.js`);
    await run(`cp ./GETTING_STARTED.md dist/GETTING_STARTED.md`);
    await run(`cp ./MIGRATE.md dist/MIGRATE.md`);
    await run(`cp ./README.md dist/README.md`);
    await run(`cp ./UNDERSTANDING_AN_APP.md dist/UNDERSTANDING_AN_APP.md`);
    await run(`cp ./USING_EXT_WEBPACK_PLUGIN.md dist/USING_EXT_WEBPACK_PLUGIN.md`);
    await run(`cp ./WHATS_NEW.md dist/WHATS_NEW.md`);

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





    process.chdir(origCwd);

    process.chdir(reactFolder);
    log('');log(`npm install in ${process.cwd()}`);
    await run(`npm install`);
    process.chdir(origCwd);
  }
  else {
    log('');log(`npmInstall is false`)
  }

  if (npmCopy == true) {
    log('');log(`npmCopy is true`)
    const prevFolders = '../../../../../';

    const webComponentsTo = `${prevFolders}ext-web-components/packages/ext-web-components${info.toolkitshown}${info.bundle}`
    process.chdir(webComponentsFolder);
    log('');log(`copy ext-web-components`);log(`from: ${process.cwd()}`);log(`to: ${webComponentsTo}`);
    await run(`rm -r ${webComponentsTo}`);
    await run(`cp -R ${process.cwd()} ${webComponentsTo}`);
    process.chdir(origCwd);

    const angularTo = `${prevFolders}ext-angular/packages/ext-angular${info.toolkitshown}${info.bundle}`
    process.chdir(angularFolder);
    //process.chdir('./dist');
    log('');log(`copy ext-angular`);log(`from: ${process.cwd()}`);log(`to: ${angularTo}`);
    await run(`rm -r ${angularTo}`);
    await run(`cp -R ./dist ${angularTo}`);
    process.chdir(origCwd);

    const reactTo = `${prevFolders}ext-react/packages/ext-react${info.toolkitshown}${info.bundle}`
    process.chdir(reactFolder);
    log('');log(`copy ext-react`);log(`from: ${process.cwd()}`);log(`to: ${reactTo}`);
    await run(`rm -r ${reactTo}`);
    await run(`cp -R ${process.cwd()} ${reactTo}`);
    process.chdir(origCwd);
  }
  else {
    log('');log(`npmCopy is false`)
  }

  if (npmPublish == true) {
    log('');log(`npmPublish is true`)

    process.chdir(webComponentsFolder);
    await run(`npm publish --force`);
    process.chdir(origCwd);

    process.chdir(angularFolder);
    process.chdir('./dist');
    await run(`npm publish --force`);
    process.chdir(origCwd);

    process.chdir(reactFolder);
    await run(`npm publish --force`);
    process.chdir(origCwd);

  }
  else {
    log('');log(`npmPublish is false`)
  }

  log('')
  log(`done`)
  console.log('')
  console.log(`https://sencha.myget.org/feed/early-adopter/package/npm/%40sencha/ext-web-components${info.toolkitshown}${info.bundle}/${info.version}`)
  console.log(`https://sencha.myget.org/feed/early-adopter/package/npm/%40sencha/ext-react${info.toolkitshown}${info.bundle}/${info.version}`)
  console.log(`https://sencha.myget.org/feed/early-adopter/package/npm/%40sencha/ext-angular${info.toolkitshown}${info.bundle}/${info.version}`)
  console.log('')

  return

  //   if (installExt == true) {
  //     process.chdir('./bundler');
  //     var currDir = process.cwd()
  //     var bundle = {};
  //     bundle.xtype = info.suffixParm;
  //     bundle.creates = require(`./npmpackage/${toolkit}/${info.suffixParm}`).getCreates();
  //     writeTemplateFile(`./template/app.json.tpl`,`./app.json`, bundle);
  //     writeTemplateFile(`./template/package.json.tpl`,`./package.json`, bundle);
  //     writeTemplateFile(`./template/css.manifest.js.tpl`,`./manifest/${info.suffixParm}.css.manifest.js`, bundle);
  //     writeTemplateFile(`./template/ext.manifest.js.tpl`,`./manifest/${info.suffixParm}.ext.manifest.js`, bundle);
  //     writeTemplateFile(`./template/xtype.js.tpl`,`./dist/ext.${info.suffixParm}.js`, bundle);
  //     //console.log('./dist/css.' + info.suffixParm + '.js created')
  //     console.log('./dist/ext.' + info.suffixParm + '.js created')
  //     process.chdir(origCwd);
  //     //copyFileSync('./bundler/dist/css.' + info.suffixParm + '.js', extFolder + "css." + info.suffixParm + '.js');
  //     copyFileSync('./bundler/dist/ext.' + info.suffixParm + '.js', extFolder + "ext." + info.suffixParm + '.js');
  //     createWebComponentsExt();
  // }

}


function shouldProcessIt(o) {
  var processIt = false;

  if (info.toolkit == 'classic') {
    var item = o
    if (item.alias != undefined) {
      if (item.alias.substring(0, 6) == 'widget') {
        //var aliases = item.alias.split(",");
        //info.classicWidgetCount++
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

  if (info.toolkit == 'modern') {
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
}

function log(val) {
  //https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
  var endMarker = `\x1b[0m`;
  const BgGreen = `\x1b[42m`;
  const FgBlack = `\x1b[30m`;
  const str = BgGreen + FgBlack + '%s' + endMarker;
  console.log(str, val);
}

// function readFile(file) {
//     return fs.readFileSync(path.resolve(templateFolder + file)).toString()
// }
