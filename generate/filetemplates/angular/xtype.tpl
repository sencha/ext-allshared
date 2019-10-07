<tpl if="doAllinXtype != true">
import { {classname} } from '{folder}';
export class Ext{Xtype}MetaData extends {classname} {
<tpl else>
import { EngBase } from './eng-base';
export class Ext{Xtype}MetaData {
</tpl>
    public static PROPERTIES: string[] = [<tpl if="doAllinXtype == true">{sPROPERTIES}</tpl>];
    public static EVENTS: any[] = [<tpl if="doAllinXtype == true">{sEVENTS}</tpl>];
    public static EVENTNAMES: string[] = [<tpl if="doAllinXtype == true">{sEVENTNAMES}</tpl>];
<tpl if="doAllinXtype != true">
    static getAll() {
        Ext{Xtype}MetaData.PROPERTIES = {classname}.getProperties(Ext{Xtype}MetaData.PROPERTIES);
        Ext{Xtype}MetaData.EVENTS = {classname}.getEvents(Ext{Xtype}MetaData.EVENTS);
        Ext{Xtype}MetaData.EVENTS.forEach( (event: any) => {
            Ext{Xtype}MetaData.EVENTNAMES.push(event.name);
        })
    }
</tpl>}
<tpl if="doAllinXtype != true">
(function () {Ext{Xtype}MetaData.getAll();})();
</tpl>
import {
  Host,
  Optional,
  SkipSelf,
  //Output,
  //OnInit,
  //AfterViewInit,
  //OnChanges,
  Component,
  ElementRef,
  forwardRef
  //SimpleChanges
} from '@angular/core';

@Component({
  selector: 'ext-{xtype}',
  inputs: Ext{Xtype}MetaData.PROPERTIES,
  outputs: Ext{Xtype}MetaData.EVENTNAMES,
  providers: [{provide: EngBase, useExisting: forwardRef(() => Ext{Xtype}Component)}],
  template: '<ng-template></ng-template>'
})
export class Ext{Xtype}Component extends EngBase {
    xtype: string;
    constructor(
        eRef: ElementRef,
        @Host() @Optional() @SkipSelf() hostComponent: EngBase
    ){
        super(
            eRef,
            hostComponent,
            Ext{Xtype}MetaData.PROPERTIES,
            Ext{Xtype}MetaData.EVENTS
        )
        this.xtype = '{xtype}'
    }

    public ngOnInit() {
        this.baseOnInit()
    }

    public ngAfterViewInit() {
        this.baseAfterViewInit()
    }

    public ngOnChanges(changes) {
        this.baseOnChanges(changes)
    }

    public ngOnDestroy() {
        this.baseOnDestroy()
    }
}
