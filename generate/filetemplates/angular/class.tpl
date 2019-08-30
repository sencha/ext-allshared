//Ext.onReady(function() {
//import { NgZone } from '@angular/core';
//import { Router } from '@angular/router';

declare var Ext: any
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
import { base } from './base';
export class {classname}MetaData {
  public static XTYPE: string = '{xtype}';
  public static PROPERTIES: string[] = [
    'xng',
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
@Component({
  selector: 'ext-{xtype}',
  inputs: {classname}MetaData.PROPERTIES,
  outputs: {classname}MetaData.EVENTNAMES,
  providers: [{provide: base, useExisting: forwardRef(() => Ext{capclassname}Component)}],
  template: '<ng-template></ng-template>'
})
export class Ext{capclassname}Component extends base implements OnInit, AfterViewInit, OnChanges  {
    constructor(eRef:ElementRef, @Host() @Optional() @SkipSelf() public hostComponent : base) {
        super(eRef.nativeElement,{classname}MetaData,hostComponent)
    }

    public ngOnInit() {
        this.baseOnInit({classname}MetaData)
    }

    public ngAfterViewInit() {
        this.baseAfterViewInit({classname}MetaData)
    }



  //public ngAfterContentInit() {
  //  this.baseAfterContentInit()
  //}

  public ngOnChanges(changes: SimpleChanges) {this.baseOnChanges(changes)}



   // public ngAfterViewChecked() {
   //   console.log('ngAfterViewChecked')
  //}
}

