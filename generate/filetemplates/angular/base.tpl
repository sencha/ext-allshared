import { EngBase } from '{pathprefix}eng-base';
//declare var Ext: any;

export class {classname} {

    static getProperties(properties) {
        return properties.concat({classname}.PROPERTIES)
     }

    static getEventNames(eventnames) {
        return eventnames.concat({classname}.EVENTNAMES)
     }

    static getEvents(events) {
        return events.concat({classname}.EVENTS)
     }

  //public static XTYPE: string = '{xtype}';
  public static PROPERTIES: string[] = [
    'eng',
    'viewport',
    'plugins',
    'responsiveFormulas',
{sPROPERTIES}];
public static PROPERTIESOBJECT: any = {
{sPROPERTIESOBJECT}
"ext": ["string"],
"ewc": ["string"],
"viewport":["boolean"],
"plugins":["Array","Ext.enums.Plugin","Object","Ext.plugin.Abstract"],
"responsiveFormulas":["Object"]
};
static METHODS: any[] = [];
  public static EVENTS: any[] = [
{sEVENTS}];
  public static EVENTNAMES: string[] = [
{sEVENTNAMES}];
}

