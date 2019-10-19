import {extendsclassname} from '{pathprefix}{extendpath}{classextendsfilename}';
declare var Ext: any;
import {
  Injectable,
  Host,
  Optional,
  SkipSelf,
  Output,
  OnInit,
  AfterViewInit,
  OnChanges,
  Component,
  ElementRef,
  forwardRef,
  SimpleChanges
} from '@angular/core';
import { EngBase } from '{pathprefix}eng-base';
export class {classname}MetaData {
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
//@Component({
//  selector: 'ext-{xtype}',
//  inputs: {classname}MetaData.PROPERTIES,
//  outputs: {classname}MetaData.EVENTNAMES,
//  providers: [{provide: EngBase, useExisting: forwardRef(() => {classname})}],
//  template: '<ng-template></ng-template>'
//})
export default class {classname} extends {extendsclassname} {
    constructor(
        eRef: any,
        hostComponent: any,
        propertiesobject: any,
        methods: any,
        events: any,
        eventnames: any
    ){
        super(
            eRef,
            hostComponent,
            Object.assign(propertiesobject, {classname}MetaData.PROPERTIESOBJECT),
            methods.concat({classname}MetaData.METHODS),
            events.concat({classname}MetaData.EVENTS),
            eventnames.concat({classname}MetaData.EVENTNAMES)
        )
        //super(
        //    eRef,
        //    hostComponent,
        //    Object.assign(propertiesobject, {classname}MetaData.PROPERTIESOBJECT),
        //    methods.concat({classname}MetaData.METHODS),
        //    events.concat({classname}MetaData.EVENTS),
        //    eventnames.concat({classname}MetaData.EVENTNAMES)
        //)
    }

}

