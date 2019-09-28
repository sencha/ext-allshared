import { {classname} } from '{folder}';
import { EngBase } from './eng-base';

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

export class {classname}MetaData extends {classname} {

    static getAll() {
        {classname}MetaData.PROPERTIES = {classname}.getProperties({classname}MetaData.PROPERTIES)
        {classname}MetaData.EVENTNAMES = {classname}.getEventNames({classname}MetaData.EVENTNAMES)
        {classname}MetaData.EVENTS = {classname}.getEvents({classname}MetaData.EVENTS)
     }

  public static PROPERTIES: string[] = [
    'eng',
    'viewport',
    'align',
    'plugins',
    'responsiveConfig',
    'responsiveFormulas',
{sPROPERTIES}];
  public static EVENTS: any[] = [
{sEVENTS}];
  public static EVENTNAMES: string[] = [
{sEVENTNAMES}];
}

(function () {
    {classname}MetaData.getAll()
})();


@Component({
  selector: 'ext-{xtype}',
  inputs: {classname}MetaData.PROPERTIES,
  outputs: {classname}MetaData.EVENTNAMES,
  providers: [{provide: EngBase, useExisting: forwardRef(() => Ext{Xtype}Component)}],
  template: '<ng-template></ng-template>'
})
export class Ext{Xtype}Component extends EngBase {
    //@Input() myname: String;
    xtype: string;
    constructor(
        eRef: ElementRef,
        @Host() @Optional() @SkipSelf() hostComponent: EngBase

    ){
        //super(
        //    eRef,
        //    hostComponent,
        //    '',
        //    '',
        //    '',
        //    ''
        //)
        super(
            eRef,
            hostComponent,
            {classname}MetaData
        )

        this.xtype = '{xtype}'
    }

    public ngOnInit() {
        this.baseOnInit()
    }

    public ngAfterViewInit() {
        this.baseAfterViewInit()
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.baseOnChanges(changes)
    }

    public ngOnDestroy() {
        this.baseOnDestroy()
    }
}

