import { EngBase } from '{pathprefix}eng-base';
//declare var Ext: any;
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

export class {classname} {

    static getProperties(properties) {
        return properties.concat({classname}.PROPERTIES)
        //return properties
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
//@Component({
//  selector: 'ext-{xtype}',
//  inputs: {classname}MetaData.PROPERTIES,
//  outputs: {classname}MetaData.EVENTNAMES,
//  providers: [{provide: EngBase, useExisting: forwardRef(() => {classname})}],
//  template: '<ng-template></ng-template>'
//})





export default class {classname} extends EngBase {

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

            //Object.assign(propertiesobject, {classname}MetaData.PROPERTIESOBJECT),
            //methods.concat({classname}MetaData.METHODS),
            //events.concat({classname}MetaData.EVENTS),
            //eventnames.concat({classname}MetaData.EVENTNAMES)
    }

    //public ngOnInit() {
    //    this.baseOnInit({classname}MetaData)
    //}

    //public ngAfterViewInit() {
    //    this.baseAfterViewInit({classname}MetaData)
    //}

  //public ngAfterContentInit() {
  //  this.baseAfterContentInit()
  //}

  //public ngOnChanges(changes: SimpleChanges) {this.baseOnChanges(changes)}



   // public ngAfterViewChecked() {
   //   console.log('ngAfterViewChecked')
  //}
}

