import { {extendsclassname} } from '{pathprefix}{extendpath}{classextendsfilename}';

export class {classname} extends {extendsclassname} {
    public static PROPERTIES: string[] = [{sPROPERTIES}];
    public static EVENTS: any[] = [{sEVENTS}];
    static getProperties(properties) {
        properties = properties.concat({classname}.PROPERTIES);
        return {extendsclassname}.getProperties(properties);
    }
    static getEvents(events) {
        events = events.concat({classname}.EVENTS);
        return {extendsclassname}.getEvents(events);
    }
}


    //public static PROPERTIESOBJECT: any = {{sPROPERTIESOBJECT}};
    //static METHODS: any[] = [];
    //public static MJGEVENTNAMES: string[] = [{sEVENTNAMES}];
        //static getEventNames(eventnames) {
    //    eventnames = eventnames.concat({classname}.EVENTNAMES);
    //    return {extendsclassname}.getEventNames(eventnames);
    //}
