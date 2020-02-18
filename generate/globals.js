exports.setGlobals =() => {

  //global["docs"]      = [];

  global["doWebComponents"]      = true;
  global["doAngular"]            = false;
  global["doReact"]              = false;
  global["doDoc"]                = false;

  global["createFolders"]        = true;
  global["launch"]               = true;
  global["postLaunch"]           = true;
  global["npmInstall"]           = true;
  global["npmPublishRightAfter"] = true;
  global["copy"]                 = true;


  console.log(`doWebComponents:\t${doWebComponents}`)
  console.log(`doAngular:\t\t${doAngular}`)
  console.log(`doReact:\t\t${doReact}`)
  console.log(`doDoc:\t\t\t${doDoc}`)
  console.log(`\n`)
  console.log(`createFolders:\t\t${createFolders}`)
  console.log(`launch:\t\t\t${launch}`)
  console.log(`postLaunch:\t\t${postLaunch}`)
  console.log(`npmInstall:\t\t${npmInstall}`)
  console.log(`npmPublishRightAfter:\t${npmPublishRightAfter}`)
  console.log(`copy:\t\t\t${copy}`)
  console.log(`\n`)

  global["doAllinXtype"] = true;

  global["toolkit"] = process.argv[4];
  var toolkits = ['modern', 'classic'];
  if (toolkits.includes(toolkit) == false) {
    log('toolkit not valid')
    return
  }

  const genItUtils = require("./genItUtils");
  global["run"] = genItUtils.run;
  global["writeTemplateFile"] = genItUtils.writeTemplateFile;
  global["doProperties"] = genItUtils.doProperties;
  global["doMethods"] = genItUtils.doMethods;
  global["doEvents"] = genItUtils.doEvents;

  global["copyFileSync"] = require('fs-copy-file-sync');
  global["fs"] = require("fs-extra");

  global["rimraf"] = require("rimraf");
  global["mkdirp"] = require("mkdirp");
  require("./XTemplate");

  global["info"] = {};
  info.now = new Date().toString();
  info.toolkit = toolkit;
  info.Toolkit = info.toolkit.charAt(0).toUpperCase() + info.toolkit.slice(1);
  info.toolkitshown = `-${info.toolkit}`;
  info.version = '7.2.0';
  //info.reactPrefix = 'Ext';
  info.shortname = process.argv[2];
  info.Shortname = info.shortname.charAt(0).toUpperCase() + info.shortname.slice(1);
  info.framework = 'elements';
  info.suffixParm = process.argv[3];
  if (info.suffixParm == 'blank' ||
      info.suffixParm == 'test'
  ) {
    info.bundle = ''
    info.Bundle = ''
    info.name = ''
  }
  else {
    info.bundle = '-' + info.suffixParm
    info.Bundle = info.suffixParm.charAt(0).toUpperCase() + info.suffixParm.slice(1);
    info.name = info.bundle.substring(1)
  }


const AllClassesFolder = '/Users/marcgusmano';
//const AllClassesFolder = '.';

info.data = require(`${AllClassesFolder}/AllClassesFiles/docs/${info.toolkit}/${info.toolkit}-all-classes-flatten.json`);
info.wantedxtypes = require(`./npmpackage/${toolkit}/${info.suffixParm}`).getXtypes();

global["moduleVars"] = { imports: "", declarations: "", exports: "" };

info.webComponentsImports = []
info.angularImports = []
info.allExtended = '';
info.imports = ''
info.declarations = ''
info.elements = ''
info.manifest = ''


for (var i = 0; i < info.wantedxtypes.length; i++) {
    var w = info.wantedxtypes[i]
    var W = w.charAt(0).toUpperCase() + w.slice(1);
    info.manifest = info.manifest + `{"xtype":"${w}"},\n`
    info.elements = info.elements + `&lt;ext-${w}&gt;&lt;/\ext-${w}&gt;\n\n`
    info.declarations = info.declarations + `    Ext${W}Component,\n`
    //info.importsxng = info.imports + `import {Ext${W}Component} from\n  '@sencha/ext-angular-${info.xztype}/esm5/src/ext-${w}.component';\n`
    //info.importsewc = info.imports + `import '@sencha/ext-web-components-${info.xztype}/lib/ext-${w}.component';\n`
}

if(doAngular == true) {
  info.angular = {}
  info.angular.module = ''
  info.angular.component = ''
}

if(doReact == true) {
  info.reactImports = ''
  info.reactExports = ''
  info.reactExports70 = ''
  info.reactExportsCase = ''
}

var docs = []
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

global["generatedFolders"] = "./GeneratedFolders/";
global["typeFolder"] = generatedFolders + info.suffixParm + '/';
global["templateFolder"] = "./filetemplates/" + info.framework + "/";

// global["outputFolder"] = `${typeFolder}ext-${info.framework}${info.toolkitshown}${info.bundle}/`;
// global["outputSrcFolder"] = outputFolder + "src/";
// global["srcStagingFolder"] = outputFolder + "srcStaging/";
// global["binFolder"] = outputFolder + 'bin/';

// global["webComponentsFolder"];
// global["webComponentsStagingFolder"];
// webComponentsFolder = outputFolder + 'webComponents/';
// webComponentsStagingFolder = outputFolder + 'webComponentsStaging/';

global["webComponentsPackageFolder"];
webComponentsPackageFolder = `${typeFolder}ext-web-components${info.toolkitshown}${info.bundle}/`;

global["angularPackageFolder"];
angularPackageFolder = `${typeFolder}ext-angular${info.toolkitshown}${info.bundle}/`;

global["reactPackageFolder"];
reactPackageFolder = `${typeFolder}ext-react${info.toolkitshown}${info.bundle}/`;

// global["angularFolder"];
// global["angularStagingFolder"];
// angularFolder = outputFolder + 'angular/';
// angularStagingFolder = outputFolder + 'angularStaging/';

// global["reactFolder"];
// global["reactStagingFolder"];
// reactFolder = outputFolder + 'react/';
// reactStagingFolder = outputFolder + 'reactStaging/';

global["docFolder"];
global["docStagingFolder"];

//docFolder = outputFolder + 'doc/';
//docStagingFolder = outputFolder + 'docStaging/';





}