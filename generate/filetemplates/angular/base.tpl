import { EngBase } from '{pathprefix}eng-base';

export class {classname} {
    public static PROPERTIES: string[] = [
'eng',
'viewport',
'align',
'plugins',
'responsiveConfig',
'responsiveFormulas',
{sPROPERTIES}];
    public static EVENTS: any[] = [{sEVENTS}];
    static getProperties(properties) {
        return properties.concat({classname}.PROPERTIES)
    }
    static getEvents(events) {
        return events.concat({classname}.EVENTS)
    }
}





  //public static XTYPE: string = '{xtype}';
//public static PROPERTIESOBJECT: any = {
//{sPROPERTIESOBJECT}
//"ext": ["string"],
//"ewc": ["string"],
//"viewport":["boolean"],
//"plugins":["Array","Ext.enums.Plugin","Object","Ext.plugin.Abstract"],
//"responsiveFormulas":["Object"]
//};
//static METHODS: any[] = [];

//public static EVENTNAMES: string[] = [{sEVENTNAMES}];

