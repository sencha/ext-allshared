declare var Ext: any
import 'script-loader!@sencha/ext-angular{bundle}/ext/ext.{name}.prod';
import 'script-loader!@sencha/ext-angular{bundle}/ext/css.prod';

import Common from './Common'

import {
    EventEmitter,
    ContentChild,
    ContentChildren,
    ViewChildren,
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
    @ViewChildren('base') _baseitems: QueryList<any>;

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

    baseOnInit(metaData: any) {

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

    assessChildren(meNode, parentNode, me) {
        console.log('assessChildren')
        console.dir(meNode)
        console.dir(me)
        console.log(meNode.children.length)
        //var s = meNode.s;
        //var children = meNode.children;
        //var parentNode = parentNode;


        if(meNode.children.length > 0 && meNode.s.EWSCHILDREN != undefined) {
            console.log('should create this one now')
        }







        var parentEWS = false
        //var parentCONNECTED = false
        //meNode.s.CONNECTED = true
        meNode.s.EWSCHILDRENCOUNT = 0

        for (var i = 0; i < meNode.children.length; i++) {
            if (meNode.children[i].nodeName.substring(0, 4) == 'EXT-') {
                meNode.s.EWSCHILDRENCOUNT++
            }
        }
        meNode.s.EWSCHILDRENLEFT = meNode.s.EWSCHILDRENCOUNT
        if (meNode.s.EWSCHILDREN != undefined) {
            meNode.s.EWSCHILDRENLEFT = meNode.s.EWSCHILDRENCOUNT - meNode.s.EWSCHILDREN.length
        }
        //console.log(parentNode.nodeName)

        if (parentNode == null) {
            parentEWS = false
        }
        else if (parentNode.nodeName.substring(0, 4) == 'EXT-') {
            parentEWS = true
            // if (parentNode.s.CONNECTED == true) {
            //     //parentCONNECTED = true
            // }
        }
        else {
            parentEWS = false
            //parentCONNECTED = true
        }
        console.log('***')
        console.log('parentEWS: ' + parentEWS)
        console.log('children: ' + meNode.children.length)
        //console.log('parentCONNECTED: ' + parentCONNECTED)
        console.log('EWSCHILDRENCOUNT: ' + meNode.s.EWSCHILDRENCOUNT)
        // if (parentEWS == true) {
        //     console.log('parent EWSCHILDRENCOUNT: ' + parentNode.s.EWSCHILDRENCOUNT)
        //     console.log('parent EWSCHILDRENLEFT: ' + parentNode.s.EWSCHILDRENLEFT)
        // }
        console.log('EWSCHILDRENLEFT: ' + meNode.s.EWSCHILDRENLEFT)
        console.log('***')

        if (meNode.s.EWSCHILDRENCOUNT == 0) {
            //var me = this;
            //setTimeout(function(){

            var which = 'angular'
            if (which == 'angular') {
                me['ready'].emit(me);
            }
            else {
                meNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: meNode.ext}}))
            }




            //}, 0);
            //this.dispatchEvent(new CustomEvent('ready',{detail:{cmp: this.ext}}))
        }

        //if (s.EWSCHILDREN == undefined) {
        //    if (s.EWSCHILDRENCOUNT != 0) {
        //        // console.log('no children defined yet')
        //    }
        //}
        //else {
        //    // console.log('EWSCHILDREN.length: ' + s.EWSCHILDREN.length)
        //}

        if (parentEWS == true) {
            if (parentNode.s.EWSCHILDREN == undefined) {
                parentNode.s.DIRECTION = "BottomUp"
                parentNode.s.EWSCHILDREN = []
            }
            else {
                parentNode.s.DIRECTION = "TopDown"
            }
            parentNode.s.EWSCHILDREN.push(this)
            parentNode.s.EWSCHILDRENLEFT--

            console.log('parent DIRECTION: ' + parentNode.s.DIRECTION)
            console.log('parent EWSCHILDRENCOUNT: ' + parentNode.s.EWSCHILDRENCOUNT)
            console.log('parent EWSCHILDRENLEFT: ' + parentNode.s.EWSCHILDRENLEFT)


            if (parentNode.s.EWSCHILDRENLEFT == 0) {
                console.log('TOP to BOTTOM')
                // console.log('this is the last child')
                // console.log('ready to go')
                console.dir(parentNode)
                console.dir(parentNode.children)
                // console.dir(this.parentNode.EWSCHILDREN)

                //var children = parentNode.children
                //var child = parentNode
                Common.addChildren(parentNode, parentNode.children, me)

                var which = 'angular'
                if (which == 'angular') {
                    me['ready'].emit(me);
                }
                else {
                    //meNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: meNode.ext}}))
                    //parentNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: parentNode.ext}}))
                }



                // if (meNode.s.EWSCHILDRENCOUNT == 0) {
                //     console.log('remove')
                //     console.log(me)
                //     parentNode.remove(me)
                // }

            }
            else {
                // console.log('after EWSCHILDRENLEFT: ' + this.EWSCHILDRENLEFT)
            }
        }

        if(meNode.s.EWSCHILDREN == undefined) {meNode.s.EWSCHILDREN = []}

        if ((meNode.s.EWSCHILDRENCOUNT > 0 && meNode.s.EWSCHILDRENCOUNT == meNode.s.EWSCHILDREN.length) ||
            (meNode.children.length > 0 && meNode.s.EWSCHILDRENCOUNT == 0)) {
            //var children = meNode.children
            //var child = me
             console.log('BOTTOM to TOP')
            // console.log('children were done first')
            // console.log('ready to go')
            // console.log(this.children)
            // console.log(this.EWSCHILDREN)

            // console.dir(this.children)
            // console.dir(child)

            console.log(me.ext)
            console.log(meNode.s.EWSCHILDREN[0].ext)
            console.log(meNode.children.length)

            me.ext.addColumn(meNode.s.EWSCHILDREN[0].ext)
            me.ext.addColumn(meNode.s.EWSCHILDREN[1].ext)
            me['ready'].emit(me);



            //mjg me.addChildren(meNode, meNode.children, me)
            //mjg meNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: meNode.ext}}))

            //console.log(this.parentNode.EWSCHILDRENLEFT)
        }
        else {
            //console.log('after EWSCHILDREN.length: ' + this.EWSCHILDREN.length)
        }
    }

    addChildren(child, children, me) {
        console.log('addChildren')
        console.log(child)
        console.log(children)
        var childItems = []
        var childItem = {parentCmp: {}, childCmp: {}}
        for (var i = children.length-1; i > -1; i--) {
            var item = children[i]
            if (item.nodeName.substring(0, 4) == 'EXT-') {
                childItem = {parentCmp: {}, childCmp: {}}
                childItem.parentCmp = child.ext
                childItem.childCmp = item.ext
                childItems.push(childItem)
            }
            else {
                childItem = {parentCmp: {}, childCmp: {}}
                childItem.parentCmp = child.ext
                childItem.childCmp = Ext.create({xtype:'widget', ext:item.getAttribute('ext'), element:Ext.get(item.parentNode.removeChild(item))})
                childItems.push(childItem)
            }
        }
        for (var i = childItems.length-1; i > -1; i--) {
            var childItem = childItems[i]
            me.addTheChild(childItem.parentCmp, childItem.childCmp, me)
        }
    }

    addTheChild(parentCmp, childCmp, me, location) {
        var parentxtype = parentCmp.xtype
        var childxtype = childCmp.xtype
        //console.log('addTheChild: ' + parentxtype + '(' + parentCmp.ext + ')' + ' - ' + childxtype + '(' + childCmp.ext + ')')
        //if (childxtype == 'widget')
        if (me.ext.initialConfig.align != undefined) {
            if (parentxtype != 'titlebar' && parentxtype != 'grid' && parentxtype != 'lockedgrid' && parentxtype != 'button') {
            console.error('Can only use align property if parent is a Titlebar or Grid or Button')
            return
            }
        }
        var defaultparent = false
        var defaultchild = false

        switch(parentxtype) {
            case 'button':
                switch(childxtype) {
                    case 'menu':
                        parentCmp.setMenu(childCmp)
                        break;
                    default:
                        defaultparent = true
                        break;
                }
                break;
            case 'booleancolumn':
            case 'checkcolumn':
            case 'gridcolumn':
            case 'column':
            case 'templatecolumn':
            case 'gridcolumn':
            case 'column':
            case 'templatecolumn':
            case 'datecolumn':
            case 'dragcolumn':
            case 'numbercolumn':
            case 'selectioncolumn':
            case 'textcolumn':
            case 'treecolumn':
            case 'rownumberer':
                switch(childxtype) {
                    case 'renderercell':
                        parentCmp.setCell(childCmp)
                        break;
                    case 'column':
                    case 'gridcolumn':
                        parentCmp.add(childCmp)
                        break;
                    default:
                        defaultparent = true
                        break;
                }
                break;
            case 'grid':
            case 'lockedgrid':
                switch(childxtype) {
                    case 'gridcolumn':
                    case 'column':
                    case 'treecolumn':
                    case 'textcolumn':
                    case 'checkcolumn':
                    case 'datecolumn':
                    case 'rownumberer':
                    case 'numbercolumn':
                    case 'booleancolumn':
                        if (location == null) {
                            if (parentxtype == 'grid') {
                                parentCmp.addColumn(childCmp)
                            }
                            else {
                                parentCmp.add(childCmp)
                            }
                        }
                        else {
                            var regCols = 0;
                            if(parentCmp.registeredColumns != undefined) {
                                regCols = parentCmp.registeredColumns.length;
                            }
                            if (parentxtype == 'grid') {
                                console.log(parentCmp)
                                parentCmp.insertColumn(location + regCols, childCmp)
                            }
                            else {
                                parentCmp.insert(location + regCols, childCmp)
                            }
                        }
                        break;
                    default:
                        defaultparent = true
                        break;
                }
                break;
            default:
                defaultparent = true
                break;
        };

        switch(childxtype) {
            case 'toolbar':
            case 'titlebar':
                if (parentCmp.getHideHeaders != undefined) {
                    if (parentCmp.getHideHeaders() === false) {
                        parentCmp.insert(1, childCmp);
                    }
                    else {
                        parentCmp.add(childCmp);
                    }
                }
                else {
                    if (parentCmp.add != undefined) {
                        if(location == null) {
                            parentCmp.add(childCmp)
                        }
                        else {
                            parentCmp.insert(location, childCmp)
                        }
                    }
                    else {
                        parentCmp.add(childCmp);
                    }
                }
                break;
            case 'tooltip':
                parentCmp.setTooltip(childCmp)
                break;
            case 'plugin':
                parentCmp.setPlugin(childCmp)
                break;
            default:
                defaultchild = true
                break;
        }

        if (defaultparent == true && defaultchild == true) {
            //console.log(parentxtype + '.add(' + childxtype + ')')
            parentCmp.add(childCmp)
        }

        if (me.parentNode.childrenYetToBeDefined > 0) {
            me.parentNode.childrenYetToBeDefined--
        }
        //console.log('childrenYetToBeDefined(after) '  + me.parentNode.childrenYetToBeDefined)
        if (me.parentNode.childrenYetToBeDefined == 0) {
            me.parentNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: me.parentNode.ext}}))
        }
    }




    assessChildren2(me) {
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

    addTheChild2(parentCmp, childCmp) {
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