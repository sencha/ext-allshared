import { {extendsclassname} } from '{pathprefix}{extendpath}{classextendsfilename}';
declare var Ext: any;

import { EngBase } from '{pathprefix}eng-base';
export class {classname} extends {extendsclassname} {

    static getProperties(properties) {
        properties = properties.concat({classname}.PROPERTIES)
        return {extendsclassname}.getProperties(properties)
     }

    static getEventNames(eventnames) {
        eventnames = eventnames.concat({classname}.EVENTNAMES)
        return {extendsclassname}.getEventNames(eventnames)
     }

    static getEvents(events) {
        events = events.concat({classname}.EVENTS)
        return {extendsclassname}.getEvents(events)
     }

  //public static XTYPE: string = '{xtype}';
  public static PROPERTIES: string[] = [
{sPROPERTIES}];
  public static PROPERTIESOBJECT: any = {
{sPROPERTIESOBJECT}};
static METHODS: any[] = [];
  public static EVENTS: any[] = [
{sEVENTS}];
  public static EVENTNAMES: string[] = [
{sEVENTNAMES}];
}
