declare var Ext: any
import 'script-loader!@sencha/ext-angular{bundle}/ext/ext.{name}.prod';
import 'script-loader!@sencha/ext-angular{bundle}/ext/css.prod';
//import Common from './Common'

import {
    EventEmitter,
    ContentChild,
    ContentChildren,
    //ViewChildren,
    QueryList,
    SimpleChanges
} from '@angular/core'

export class base {
    static count: any = 0;
    static DIRECTION: any = '';
    public ext: any
    newDiv: any

    private currentComponent: any
    private node: any
    private parentComponent: any

    @ContentChild('extroute',{ static : false }) _extroute: any;
    @ContentChildren('extroute') _extroutes: QueryList<any>;
    @ContentChild('extitem',{ static : false }) _extitem: any;
    @ContentChildren('extitem') _extitems: QueryList<any>;
    @ContentChildren(base) _childComponents: QueryList<base>;
    get childComponents(): base[] {
        return this._childComponents.filter(item => item !== this);
    }

    constructor(
        nativeElement: any,
        private metaData: any,
        public hostComponent : base,
    ) {
        this.currentComponent = this
        this.node  = nativeElement
        this.node.s = {}
        this.parentComponent = hostComponent

        metaData.EVENTNAMES.forEach( (event: any, n: any) => {
        if (event != 'fullscreen') {
            (<any>this)[event] = new EventEmitter()
        }
        else {
            (<any>this)[event + 'event'] = new EventEmitter()
        }
        })

        // if (this.parentComponent == null) {
        //     this.currentComponent.node.s.newDiv = document.createElement("div");
        //     this.currentComponent.node.parentNode.insertBefore(this.currentComponent.node.s.newDiv,this.currentComponent.node);
        //     //var newContent = document.createTextNode("newDiv");
        //     //this.currentComponent.node.s.newDiv.appendChild(newContent);
        //    //mjg console.log('create newDiv')
        // }
    }

    baseOnInit(metaData: any) {
    //baseAfterViewInit(metaData: any) {
    }

    //baseOnInit(metaData: any) {
    baseAfterViewInit(metaData: any) {
        let me: any = this

        //Ext.onReady(function() {
           //mjg console.log('')
           //mjg console.log(`baseOnInit:` + metaData.XTYPE)
            me.currentComponent.node.s.props = me.createProps(me, metaData.XTYPE, metaData.PROPERTIES, metaData.EVENTS)
            me.createExtComponent(me)
            if (me.parentComponent == null) {
               //mjg console.log('me.parentComponent is null')
                me.assessChildren(me.currentComponent.node, null, me)
            }
            else {
               //mjg console.log('me.parentComponent is NOT null')
                me.assessChildren(me.currentComponent.node, me.parentComponent.node, me)
            }
        //});
    };

    createProps(me, xtype, properties, events) {
        let o: any = {}
        o.xtype = xtype
        let listenersProvided = false
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
        if (me.currentComponent.node.s.props['viewport'] == true) {
           //mjg console.log('creating viewport')
            //me.currentComponent.node.s.newDiv.remove()
            //console.log('remove newDiv')
            me.currentComponent.node.ext = Ext.create(me.currentComponent.node.s.props)
            Ext.application({
                name: 'MyExtAngularApp',
                launch: function () {
                   //mjg console.log('in launch')
                    Ext.Viewport.add([me.currentComponent.node.ext])
                }
            });
        }
        else if (me.parentComponent == null) {
           //mjg console.log('1-parent of: ' + me.currentComponent.node.nodeName + ' is ' + me.node.parentNode.nodeName)
            me.currentComponent.node.s.props.renderTo = me.currentComponent.node; //me.currentComponent.node.s.newDiv; //me.shadowRoot;
            me.currentComponent.node.ext = Ext.create(me.currentComponent.node.s.props)
            //me.currentComponent.node.parentNode.replaceChild(me.currentComponent.node.ext.el.dom, me.currentComponent.node.s.newDiv)
            //console.log('replace newDiv')
        }
        else if (me.parentComponent.node.nodeName.substring(0, 4) != 'EXT-') {
           //mjg console.log('2-parent of: ' + me.currentComponent.node.nodeName + ' is ' + me.parentComponent.node.nodeName)
            me.currentComponent.node.s.props.renderTo = me.currentComponent.node; //me.currentComponent.node.s.newDiv; //me.shadowRoot;
            me.currentComponent.node.ext = Ext.create(me.currentComponent.node.s.props)
            //me.currentComponent.node.parentNode.replaceChild(me.currentComponent.node.ext.el.dom, me.currentComponent.node.s.newDiv)
        }
        else {
           //mjg console.log('3-parent of: ' + me.currentComponent.node.nodeName + ' is ' + me.parentComponent.node.nodeName)
            me.currentComponent.node.ext = Ext.create(me.currentComponent.node.s.props)
        }
    }

    assessChildren(currentNode, parentNode, me) {
       //mjg console.log('assessChildren')
        if (currentNode.s.CHILDRENNODES == undefined) {
            //console.log('first time')
            //console.log(base.count)
            if (base.count == 0) {
                if (parentNode == null) {
                    //currentNode.s.DIRECTION = 'TopToBottom'
                    base.DIRECTION = 'TopToBottom'
                }
                else {
                    //currentNode.s.DIRECTION = 'BottomToTop'
                    base.DIRECTION = 'BottomToTop'
                }
               //mjg console.log('base.DIRECTION: ' + base.DIRECTION)
            }
            base.count++
            currentNode.s.CHILDRENNODES = []
            currentNode.s.CHILDRENCOMPONENTSCOUNT = 0
           //mjg console.log(me._childComponents)
            currentNode.s.CHILDRENCOMPONENTS = me.childComponents
            for (var i = 0; i < currentNode.s.CHILDRENCOMPONENTS.length; i++) {
                if (currentNode.s.CHILDRENCOMPONENTS[i].node.nodeName.substring(0, 4) == 'EXT-') {
                    currentNode.s.CHILDRENCOMPONENTSCOUNT++
                }
            }
            currentNode.s.CHILDRENCOMPONENTSLEFT = currentNode.s.CHILDRENCOMPONENTSCOUNT
            currentNode.s.CHILDRENCOMPONENTSADDED = 0
        }
       //mjg console.log('***')
       //mjg console.log('parentNode: ')
       //mjg console.dir(parentNode)
       //mjg console.log('CHILDRENCOMPONENTSCOUNT: ' + currentNode.s.CHILDRENCOMPONENTSCOUNT)
       //mjg console.log('CHILDRENCOMPONENTS: ')
       //mjg console.dir(currentNode.s.CHILDRENCOMPONENTS)
       //mjg console.log('CHILDRENCOMPONENTSLEFT: ' + currentNode.s.CHILDRENCOMPONENTSLEFT)
       //mjg console.log('***')

        if (me.currentComponent._extitems.length == 1) {
            //if (this._hostComponent != null) {
               //mjg console.log('item')
                me.currentComponent.node.ext.setHtml(me.currentComponent._extitem.nativeElement)
            //}
        }
        if (me.currentComponent._extroutes.length == 1) {
           //mjg console.log('router')
            me.currentComponent.node.ext.setHtml(me.currentComponent._extroute.nativeElement)

            //childItem.childCmp = Ext.create({xtype:'widget', ewc:item.getAttribute('ewc'), element:Ext.get(item.parentNode.removeChild(item))})



        }





        if (   currentNode.s.CHILDRENCOMPONENTSCOUNT == 0
            && currentNode.s.CHILDRENCOMPONENTSLEFT == 0
            && currentNode.s.CHILDRENCOMPONENTSADDED == 0
            && parentNode == null
        ) {
            //currentNode.s.DIRECTION = "Solo"
            //console.log(currentNode.s.DIRECTION)
           //mjg console.log('Solo')
            //var r = {detail: {cmp: currentNode.ext}}
            me.currentComponent['ready'].emit({detail: {cmp: currentNode.ext}});
            //me.currentComponent.node.remove()
            return
        }
        else if (currentNode.s.CHILDRENCOMPONENTSADDED > 0) {
            me.addChildren(currentNode, currentNode.s.CHILDRENNODES, me)
            //var r = {detail: {cmp: currentNode.ext}}
            //console.log(r)
            me.currentComponent['ready'].emit({detail: {cmp: currentNode.ext}});
            //me.currentComponent.node.remove()
        }
        else {
           //mjg console.log('NOT Solo')
            if ( me.parentComponent != null &&
                 currentNode.s.CHILDRENCOMPONENTSCOUNT == 0) {
                //var r = {detail: {cmp: currentNode.ext}}
                //console.log(r)
                me.currentComponent['ready'].emit({detail: {cmp: currentNode.ext}});
            }
        }

        if (parentNode != null) {

            if (parentNode.s.CHILDRENNODES == undefined) {
               //mjg console.log('creating parentNode variables at a later time')
                parentNode.s.CHILDRENNODES = []
                parentNode.s.CHILDRENCOMPONENTSCOUNT = 0
                parentNode.s.CHILDRENCOMPONENTS = me.childComponents
                for (var i = 0; i < parentNode.s.CHILDRENCOMPONENTS.length; i++) {
                    if (parentNode.s.CHILDRENCOMPONENTS[i].node.nodeName.substring(0, 4) == 'EXT-') {
                        parentNode.s.CHILDRENCOMPONENTSCOUNT++
                    }
                }
                parentNode.s.CHILDRENCOMPONENTSLEFT = parentNode.s.CHILDRENCOMPONENTSCOUNT
                parentNode.s.CHILDRENCOMPONENTSADDED = 0
            }
            else {
               //mjg console.log('parentNode variables are already created')
            }
            if (base.DIRECTION == 'TopToBottom') {
               //mjg console.log('TopToBottom')
                parentNode.s.CHILDRENNODES.push(me.currentComponent.node)
                parentNode.s.CHILDRENCOMPONENTSLEFT--
            }
            else {
               //mjg console.log('BottomToTop')
                parentNode.s.CHILDRENNODES.push(me.currentComponent.node)
                parentNode.s.CHILDRENCOMPONENTSADDED++
            }
           //mjg console.log('parent CHILDRENCOMPONENTSLEFT: ' + parentNode.s.CHILDRENCOMPONENTSLEFT)
            if (  base.DIRECTION == "TopToBottom"
                && parentNode.s.CHILDRENCOMPONENTSLEFT == 0) {
               //mjg console.log('TopToBottom')
               //mjg console.log('no more children left')
               //mjg console.dir(parentNode)
               //mjg console.dir(parentNode.s.CHILDRENNODES)
                me.addChildren(parentNode, parentNode.s.CHILDRENNODES, me)
                //var r = {detail: {cmp: me.parentComponent.node.ext}}
                me.parentComponent['ready'].emit({detail: {cmp: parentNode.ext}});
                //me.parentComponent.node.remove()
            }
            else {
               //mjg console.log('Still children left')
            }

        }
    }

    addChildren(child, children, me) {
       //mjg console.log('addChildren')
       //mjg console.log(child)
       //mjg console.log(children)
        var childComponents = []
        var childItem = {parentCmp: {}, childCmp: {}}
        for (var i = children.length-1; i > -1; i--) {
            var item = children[i]
            childItem = {parentCmp: {}, childCmp: {}}
            childItem.parentCmp = child.ext
            childItem.childCmp = item.ext
            childComponents.push(childItem)
        }
        for (var i = childComponents.length-1; i > -1; i--) {
            var childItem = {parentCmp: {}, childCmp: {}}
            childItem = childComponents[i]
            me.addTheChild(childItem.parentCmp, childItem.childCmp, me)
        }
    }

    addTheChild(parentCmp, childCmp, me, location) {
        var parentxtype = parentCmp.xtype
        var childxtype = childCmp.xtype
        //console.log('addTheChild: ' + parentxtype + '(' + parentCmp.ext + ')' + ' - ' + childxtype + '(' + childCmp.ext + ')')
        //if (childxtype == 'widget')
        if (me.node.ext.initialConfig.align != undefined) {
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
                               //mjg console.log(parentCmp)
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

        // if (me.parentNode.childrenYetToBeDefined > 0) {
        //     me.parentNode.childrenYetToBeDefined--
        // }
        // //console.log('childrenYetToBeDefined(after) '  + me.parentNode.childrenYetToBeDefined)
        // if (me.parentNode.childrenYetToBeDefined == 0) {
        //     me.parentNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: me.parentNode.ext}}))
        // }
    }

    baseOnChanges(changes: SimpleChanges) {
       //mjg console.log(`ngOnChanges`)
       //mjg console.log(changes)
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
            if (this.node.ext != undefined) {
            var capPropName = propName.charAt(0).toUpperCase() + propName.slice(1)
            var setFunction = 'set' + capPropName
            if (this.node.ext[setFunction] != undefined) {
                this.node.ext[setFunction](val)
            }
            else {
                console.error(setFunction + ' not found for ' + this.node.ext.xtype)
            }
            }
            else {
            if (verb == 'changed') {
               //mjg console.log('change needed and ext not defined')
            }
            }
            changesMsgs.push(`$ $ to "$"`)
        }
        //console.log(`OnChanges: ${changesMsgs.join('; ')}`)
    }

    ngOnDestroy() {
        var childCmp
        var parentCmp
        try {
            childCmp = this.currentComponent.node.ext
            if (this.parentComponent != null) {
                parentCmp = this.parentComponent.node.ext
               //mjg console.log(childCmp)
               //mjg console.log(parentCmp)
                if (childCmp == undefined || parentCmp == undefined) {return}
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
                   //mjg console.log('no destroy')
                }
            }
        }
        catch(e) {
            console.error(e)
           //mjg console.log('*****')
           //mjg console.log(parentCmp)
           //mjg console.log(childCmp)
           //mjg console.log('*****')
        }
    }
}