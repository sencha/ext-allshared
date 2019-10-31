import {
    // Host,
    // Optional,
    // SkipSelf,
    EventEmitter,
    //ContentChild,
    ContentChildren,
    //ViewChildren,
    //TemplateRef,
    QueryList,
    // Component,
    // Output,
    // ElementRef,
    // forwardRef,
    SimpleChanges
  } from '@angular/core';
import { ConditionalExpr } from '@angular/compiler';
const Ext = window['Ext'];

export default class EngBase {
    static rootNode: any = null;



    @ContentChildren(EngBase) _childComponents: QueryList<EngBase>;

    public ext: any
    newDiv: any

    xtype: any
    properties: any
    events: any

    A: any;
    node: any
    parentNode: any
    base: any
    nodeName: any

    ewcChildren: any
    rawChildren: any
    hasParent: any
    parentType: any
    children: any
    last: any



    get childComponents(): EngBase[] {
        return this._childComponents.filter(item => item !== this);
    }

    constructor (
        eRef: any,
        hostComponent: any,
        properties,
        events
    ) {
        this.node = eRef.nativeElement;
        this.parentNode = hostComponent;
        this.properties = properties;
        this.events = events;

        this.events.forEach( (event: any, n: any) => {
            if (event.name != 'fullscreen') {
                (<any>this)[event.name] = new EventEmitter()
            }
            else {
                (<any>this)[event.name + 'event'] = new EventEmitter()
            }
        })

        this.A = {};
        this.A.props = {}


        this.base = EngBase;
    }

    baseOnInit() {
        console.log('baseOnInit')
        console.dir(this)
        console.dir(this.node)
        console.dir(this.node.parentNode)

        this.newCreateProps(this.properties)
        this.newDiv = document.createElement('ext-' + this.xtype);
        //console.log(this.A.o)
        for (var prop in this.A.o) {
            //console.log(this.A.o[prop]);
            this.newDiv.setAttribute(prop, this.A.o[prop]);
        }
        //var t = document.createTextNode("newDiv");
        //this.newDiv.appendChild(t);


        if (this.node.parentNode.nodeName.substring(0, 3) !== 'EXT') {
            console.log('parent not ext')
            //this.node.parentNode.appendChild(this.newDiv);
            this.node.after(this.newDiv)
            EngBase.rootNode = this.newDiv
        }
        else {
            console.log('parent is ext')
            EngBase.rootNode.appendChild(this.newDiv);
        }

        //this.node.insertAdjacentElement('beforebegin', this.newDiv);

    }
    baseAfterViewInit() {
        console.log('baseAfterViewInit: ' + this.xtype)
        //console.log(this.node)
        console.dir(this.childComponents)
        //console.dir(this._childViewComponents)
        //console.dir(this.childComponents)
    }

    newCreateProps(properties) {
        //console.log('store prop')
        //console.log(this.store)
        let listenersProvided = false;
        var o = {};
        o['xtype'] = this.xtype;

        if (this['config'] !== {}) {
            Ext.apply(o, this['config']);
        }

        if (true === this['fitToParent']) {
            o['height']='100%'
        }
        // if (o['xtype'] == 'column' ||
        //     o['xtype'] == 'gridcolumn') {
        //     //replace above with call from util
        //     var renderer = this.getAttribute('renderer')
        //     if (renderer != undefined) {
        //         o['cell'] = this['cell'] || {}
        //         o['cell'].xtype = 'renderercell'
        //         //console.log(renderer)
        //         o['cell'].renderer = renderer
        //     }
        // }
        for (var i = 0; i < properties.length; i++) {
            var property = properties[i]
            //if (this.getAttribute(property) !== null) {
            if (this[property] !== null) {

                if (property == 'handler') {
                    // if (this[property] != undefined) {
                    //     o[property] = this[property];
                    // }

                    // var functionString = this.getAttribute(property);
                    // //error check for only 1 dot
                    // var r = functionString.split('.');
                    // var obj = r[0];
                    // var func = r[1];
                    // o[property] = window[obj][func];
                }

                // else if ((o['xtype'] === 'cartesian' || o['xtype'] === 'polar') && property === 'layout') {
                // }
                else if (property == 'listeners' && this[property] != undefined) {
                    o[property] = this[property];
                    listenersProvided = true;
                }
                // else if (property == 'config') {
                //     var configs = JSON.parse(this.getAttribute(property))
                //     for (var configProp in configs) {
                //         if (configs.hasOwnProperty(configProp)) {
                //            //o[configProp] = filterProp(configs[configProp], property, this);
                //            o[configProp] = filterProp(this.getAttribute(configs[configProp]), configProp, this);
                //         }
                //     }
                // }
                else if (this[property] != undefined &&
                    property != 'listeners' &&
                    property != 'config' &&
                    property != 'handler' &&
                    property != 'fitToParent') {
                    //props[property] = property[prop];
                    //console.log('here??')
                    //console.log(property)
                    //o[property] = filterProp(this.getAttribute(property), property, this);
                    o[property] = this[property]
                }

                // else {
                //     o[property] = filterProp(this.getAttribute(property));
                // }
            }

            // if (!listenersProvided) {
            //     o.listeners = {};
            //     var me = this;
            //     this.events.forEach(function (event, index, array) {
            //         me.setEvent(event,o,me)
            //     })
            // }
        }
        this.A.o = o;
        //console.log(o)
    }






    baseOnChanges(changes: SimpleChanges) {
        //console.log('baseOnChanges')
    }

    baseOnDestroy() {
        //console.log('baseOnDestroy')
    }
}


