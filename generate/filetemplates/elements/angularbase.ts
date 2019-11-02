import {
    EventEmitter,
    ContentChildren,
    QueryList,
    SimpleChanges
  } from '@angular/core';
//import { ConditionalExpr } from '@angular/compiler';
const Ext = window['Ext'];

export default class EngBase {
    //static rootNode: any = null;
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
    public vc: any;
    eventnames: any;

    @ContentChildren(EngBase) _childComponents: QueryList<EngBase>;
    get childComponents(): EngBase[] {
        return this._childComponents.filter(item => item !== this);
    }

    constructor (
        eRef: any,
        hostComponent: any,
        properties,
        events,
        eventnames,
        vc?
    ) {
        this.node = eRef.nativeElement;
        this.parentNode = hostComponent;
        this.properties = properties;
        this.events = events;
        this.eventnames = eventnames;
        this.vc = vc;

        var me = this;
        this.eventnames.forEach(function (eventname) {
            //console.log(eventname)
            //(<any>this)[eventname] = new EventEmitter()
            me[eventname] = new EventEmitter()
        })

        this.A = {};
        this.A.props = {}
        this.base = EngBase;
    }

    baseOnInit() {
        console.log('baseOnInit')
        this.newDiv = document.createElement('ext-' + this.xtype);

        for (var i = 0; i < this.properties.length; i++) {
            var property = this.properties[i]
            if (this[property] !== undefined) {
                //o[property] = this[property];
                this.newDiv.setAttribute(property, this[property]);
            }
        }

        var me = this;
        this.eventnames.forEach(function (eventname) {
            me.newDiv.addEventListener(eventname, function(event) {
                me[eventname].emit(event.detail);
            });
        })
        if (this.node.parentNode.nodeName.substring(0, 3) !== 'EXT') {
            console.log('parent not ext')
            //this.node.parentNode.appendChild(this.newDiv);
            this.node.after(this.newDiv)
            //EngBase.rootNode = this.newDiv
        }
        else {
            console.log('parent is ext')
            //console.dir(this)
            //console.dir(EngBase.rootNode)
            this.parentNode.newDiv.appendChild(this.newDiv);
            //EngBase.rootNode.appendChild(this.newDiv);
        }

        // console.log(this.vc)
        // console.log(this.vc._data.renderElement)
        // console.log(this.vc._data.renderElement.parentNode)

        // if (this.vc._data.renderElement.parentNode != null) {
        //     console.log('removing')
        //     this.vc._data.renderElement.parentNode.removeChild(this.vc._data.renderElement)
        // }

        //this.node.insertAdjacentElement('beforebegin', this.newDiv);

    }


    baseAfterViewInit() {
    }

    // newCreateProps(properties) {
    //     //console.log('store prop')
    //     //console.log(this.store)
    //     let listenersProvided = false;
    //     var o = {};
    //     o['xtype'] = this.xtype;

    //     if (this['config'] !== {}) {
    //         Ext.apply(o, this['config']);
    //     }

    //     if (true === this['fitToParent']) {
    //         o['height']='100%'
    //     }
    //     for (var i = 0; i < properties.length; i++) {
    //         var property = properties[i]
    //         //if (this.getAttribute(property) !== null) {
    //         if (this[property] !== null) {

    //             if (property == 'handler') {
    //                 o[property] = this[property];
    //             }

    //             // else if ((o['xtype'] === 'cartesian' || o['xtype'] === 'polar') && property === 'layout') {
    //             // }
    //             else if (property == 'listeners' && this[property] != undefined) {
    //                 o[property] = this[property];
    //                 listenersProvided = true;
    //             }
    //             else if (this[property] != undefined &&
    //                 property != 'listeners' &&
    //                 property != 'config' &&
    //                 property != 'handler' &&
    //                 property != 'fitToParent') {
    //                 //props[property] = property[prop];
    //                 //console.log('here??')
    //                 //console.log(property)
    //                 //o[property] = filterProp(this.getAttribute(property), property, this);
    //                 o[property] = this[property]
    //             }

    //             // else {
    //             //     o[property] = filterProp(this.getAttribute(property));
    //             // }
    //         }

    //         // if (!listenersProvided) {
    //         //     o.listeners = {};
    //         //     var me = this;
    //         //     this.events.forEach(function (event, index, array) {
    //         //         me.setEvent(event,o,me)
    //         //     })
    //         // }
    //     }
    //     this.A.o = o;
    //     //console.log(o)
    // }

    baseOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let val = changes[propName].currentValue;
            if (this.newDiv != undefined) {
                this.newDiv.setAttribute(propName, val);
            }
        }
    }

    baseOnDestroy() {
        this.newDiv.parentNode.removeChild(this.newDiv);
    }
}


