declare var Ext: any
import 'script-loader!@sencha/ext-angular{bundle}/ext/ext.{name}.prod';
import 'script-loader!@sencha/ext-angular{bundle}/ext/css.prod';

import Common from './Common'

import {
    EventEmitter,
    ContentChild,
    ContentChildren,
    QueryList,
    SimpleChanges
} from '@angular/core'

export class base {
    public ext: any
    private _nativeElement: any
    private _hostComponent: any
    private _extChildren: any = false
    private q: QueryList<any>

    @ContentChild('extroute',{ static : false }) _extroute: any;
    @ContentChildren('extroute') _extroutes: QueryList<any>;
    @ContentChild('extitem',{ static : false }) _extitem: any;
    @ContentChildren('extitem') _extitems: QueryList<any>;

    constructor(
        nativeElement: any,
        private metaData: any,
        public hostComponent : base,
    ) {
        this.q = null
        this._nativeElement = nativeElement
        this._hostComponent = hostComponent

        metaData.EVENTNAMES.forEach( (event: any, n: any) => {
        if (event != 'fullscreen') {
            (<any>this)[event] = new EventEmitter()
        }
        else {
            (<any>this)[event + 'event'] = new EventEmitter()
        }
        })
    }

    baseAfterViewInit(metaData: any) {
        let me: any = this
        //console.log(`baseAfterViewInit:` + metaData.XTYPE)
        //let o: any = {}
        me.o = me.createProps(me, metaData.XTYPE, metaData.PROPERTIES, metaData.EVENTS)
        me.createExtComponent(me)
        me.assessChildren(me)
    };


    createProps(me, xtype, properties, events) {
        let o: any = {}
        //o.xtype = metaData.XTYPE
        o.xtype = xtype
        let listenersProvided = false
        //for (var i = 0; i < me.metaData.PROPERTIES.length; i++) {
        //  var prop = me.metaData.PROPERTIES[i];
        for (var i = 0; i < properties.length; i++) {
        var prop = properties[i];
        if (prop == 'handler') {
            if (me[prop] != undefined) {
            o[prop] = me[prop]
            }
        }
        //need to handle listeners coming in here
        if ((o.xtype === 'cartesian' || o.xtype === 'polar') && prop === 'layout') {
        }
        else if(prop == 'listeners' && me[prop] != undefined) {
            o[prop] = me[prop];
            listenersProvided = true;
        }
        else {
            if (me[prop] != undefined &&
                prop != 'listeners' &&
                prop != 'config' &&
                prop != 'handler' &&
                prop != 'fitToParent') {
            o[prop] = me[prop];
            }
        }
        }

        if (true === me.fitToParent) {
        o.top=0,
        o.left=0,
        o.width='100%',
        o.height='100%'
        }
        if (me.config !== {} ) {
        Ext.apply(o, me.config);
        }

        if(!listenersProvided) {
        o.listeners = {}
        //var EVENTS = metaData.EVENTS
        var EVENTS = events
        EVENTS.forEach(function (event: any, index: any, array: any) {
            let eventname: any = event.name
            let eventparameters: any = event.parameters
            o.listeners[eventname] = function() {
            let parameters: any = eventparameters
            let parms = parameters.split(',')
            let args = Array.prototype.slice.call(arguments)
            let emitparms: any = {}
            for (let i = 0, j = parms.length; i < j; i++ ) {
                emitparms[parms[i]] = args[i];
            }
            me[eventname].emit(emitparms)
            }
        })
        }
        return o;
    }

    createExtComponent(me) {
        if (me.o['viewport'] == "true") {
            me.ext = Ext.create(me.o)
            //console.log('Ext.application for ' + me.o.xtype + '(' + me.o.xng + ')')
            Ext.application({
                name: 'MyExtAngularApp',
                launch: function () {
                    Ext.Viewport.add([me.ext])
                }
            });
        }
        else {
            if (me._nativeElement.parentElement != null) {
                me.o.renderTo = me._nativeElement
            }

            if (me.o.xtype == 'dialog') {
                me.o.renderTo = undefined;
            }
            me.ext = Ext.create(me.o)
            //console.log('Ext.create for ' + me.o.xtype + '(' + me.o.xng + ') renderTo: ' + me.o.renderTo)
        }
    }

    assessChildren(me) {
        if (this._extitems.length == 1) {
            if (this._hostComponent != null) {
                this.ext.setHtml(this._extitem.nativeElement);
            }
        }
        if (this._extroutes.length == 1) {
            this.ext.setHtml(this._extroute.nativeElement);
        }
        if (this._hostComponent != null) {
            var parentCmp = this._hostComponent.ext;
            var childCmp = this.ext;
            this.addTheChild(parentCmp, childCmp);
        }
        this['ready'].emit(this);
    }

    addTheChild(parentCmp, childCmp) {
        var parentxtype = parentCmp.xtype
        var childxtype = childCmp.xtype

        if (this.ext.initialConfig.align != undefined) {
            if (parentxtype != 'titlebar' && parentxtype != 'grid' && parentxtype != 'button') {
            console.error('Can only use align property if parent is a Titlebar or Grid or Button')
            return
            }
        }
        if (parentxtype === 'grid' || parentxtype === 'lockedgrid') {
            if (childxtype === 'column' || childxtype === 'treecolumn' || childxtype === 'textcolumn' || childxtype === 'checkcolumn' || childxtype === 'datecolumn' || childxtype === 'rownumberer' || childxtype === 'numbercolumn' || childxtype === 'booleancolumn' ) {
            parentCmp.addColumn(childCmp)
            return
            }
            else if ((childxtype === 'toolbar' || childxtype === 'titlebar') && parentCmp.getHideHeaders != undefined) {
            if (parentCmp.getHideHeaders() === false) {
                //var j = parentCmp.items.items.length;
                parentCmp.insert(1, childCmp);
                return
            }
            else {
                parentCmp.add(childCmp);
                return
            }
            }
            else {
            console.log('unhandled else in addTheChild')
            console.log(parentxtype)
            console.log(childxtype)
            }
        }
        if (childxtype === 'tooltip') {
            parentCmp.setTooltip(childCmp)
            return
        }
        if (childxtype === 'plugin') {
            parentCmp.setPlugin(childCmp)
            return
        }
        else if (
            parentxtype === 'button' ||
            parentxtype === 'menuitem' ||
            parentxtype === 'menucheckitem'
            ) {
            if (childxtype === 'menu') {
            parentCmp.setMenu(childCmp)
            return
            } else {
            console.log('child not added')
            }
        }
        if (childxtype === 'toolbar' && Ext.isClassic === true) {
            parentCmp.addDockedItems(childCmp)
            return
        }
        else if ((childxtype === 'toolbar' || childxtype === 'titlebar') && parentCmp.getHideHeaders != undefined) {
            if (parentCmp.getHideHeaders() === false) {
            //var j: any = parentCmp.items.items.length
            //parentCmp.insert(j - 1, childCmp)
            parentCmp.insert(1, childCmp)
            return
            } else {
            parentCmp.add(childCmp)
            return
            }
        }
            if (parentCmp.add != undefined) {
            parentCmp.add(childCmp)
            return
        }
        console.log('child not added')
    }

    ngOnChanges(changes: SimpleChanges) {
        //console.log(`ngOnChanges`)
        //console.log(changes)
        let changesMsgs: string[] = []
        for (let propName in changes) {
            let verb = ''
            if (changes[propName].firstChange === true) {
            verb = 'initialized'
            }
            else {
            verb = 'changed'
            }
            let val = changes[propName].currentValue
            if (this.ext != undefined) {
            var capPropName = propName.charAt(0).toUpperCase() + propName.slice(1)
            var setFunction = 'set' + capPropName
            if (this.ext[setFunction] != undefined) {
                this.ext[setFunction](val)
            }
            else {
                console.error(setFunction + ' not found for ' + this.ext.xtype)
            }
            }
            else {
            if (verb == 'changed') {
                console.log('change needed and ext not defined')
            }
            }
            changesMsgs.push(`${propName} ${verb} to "${val}"`)
        }
        //console.log(`OnChanges: ${changesMsgs.join('; ')}`)
    }

    ngOnDestroy() {
        var childCmp
        var parentCmp
        try {
            childCmp = this.ext
            if (this._hostComponent != null) {
            parentCmp = this._hostComponent.ext
            if(parentCmp.xtype == 'button' && childCmp.xtype == 'menu') {
                //console.log('button/menu not deleted')
            }
            else if (parentCmp.xtype == 'carousel') {
                //console.log('carousel parent not deleted')
            }
            else if (parentCmp.xtype == 'grid' && childCmp.xtype == 'column') {
                //console.log('grid/column not deleted')
                //console.log(childCmp)
            }
            else if (parentCmp.xtype == 'segmentedbutton' && childCmp.xtype == 'button') {
                //console.log('segmentedbutton/button not deleted')
            }
            else if (parentCmp.xtype == 'button' && childCmp.xtype == 'tooltip') {
                //console.log('button/tooltip not deleted')
            }
            else if (parentCmp.xtype == 'titlebar' && childCmp.xtype == 'button') {
                //console.log('titlebar/button not deleted')
            }
            else if (parentCmp.xtype == 'titlebar' && childCmp.xtype == 'searchfield') {
                //console.log('titlebar/searchfield not deleted')
            }
            else {
                parentCmp.remove([childCmp])
                childCmp.destroy()
            }
            }
            else {
            if (childCmp != undefined) {
                childCmp.destroy()
            }
            else {
                console.log('no destroy')
            }
            }
        }
        catch(e) {
            console.error(e)
            console.log('*****')
            console.log(parentCmp)
            console.log(childCmp)
            console.log('*****')
        }
    }
}