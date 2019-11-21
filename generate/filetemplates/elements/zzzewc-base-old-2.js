import 'script-loader!node_modules/@sencha/ext-web-components-all/ext/ext.all.prod';
import 'script-loader!node_modules/@sencha/ext-web-components-all/ext/css.prod';

import HTMLParsedElement from './HTMLParsedElement'
//import Common from './Common'

export default class EwcBaseComponent extends HTMLElement {

    constructor() {
        super ();
        this.node = this;
    }

    connectedCallback() {
        this.newDiv = document.createElement('div');
        this.node.insertAdjacentElement('beforebegin', this.newDiv);
        this.xtype = this.XTYPE;
        this.base = EwcBaseComponent;
    }

    getParentNode() {
        if (this._extitems != undefined) {
            return this.parentNode.node
        }
        else {
            return this.parentNode
        }
    }

    parsedCallback() {
        console.log('')
        console.log('*** parsedCallback for ' + this.xtype);

        if (this._extitems != undefined) {
            this.rawChildren = this.childComponents
        }
        else {
            this.rawChildren = Array.prototype.slice.call( this.children )
        }
        console.dir(this.rawChildren)
        this.childComponents = [];
        var num = 0;
        for (var i = 0; i < this.rawChildren.length; i++) {
            if (this.rawChildren[i].XTYPE != undefined) {
                this.childComponents[num] = {};
                this.childComponents[num] = this.rawChildren[i];
                this.childComponents[num].currentComponent = this.rawChildren[i];
                this.childComponents[num].node = this.rawChildren[i];
                num++;
            }
        }

        this.figureOutA();
        this.createPropsForEWC(this.PROPERTIESOBJECT, this.EVENTS);
        this.createExtComponent();
        this.assessChildren(this.base, this.XTYPE);
        console.log('*** at end');
        console.dir(this.A);
        if (this.A.HASEXTPARENT) {
            console.dir(this.parentNode.A);
        }
        else {
            console.log('No EXT parent')
        }
    }

    figureOutA() {
        if (this.A == undefined) {
            console.log('no A');
            this.init(this.base, this);
        }
        else {
            console.log('have A');
        }
        console.log(this.base.DIRECTION);
        console.log('HASPARENT ' + this.A.HASEXTPARENT);
        if (this.A.HASEXTPARENT) {
            if (this.parentNode.A == undefined) {
                console.log('parent not created');
                this.init(this.base, this.parentNode);
            }
            else {
                console.log('parent A IS created');
            }

        }
    }
    init(base, component) {
        component.A = {};
        component.A.props = {};
        component.A.xtype = component.xtype;
        if (component.parentNode == null) {
            component.A.HASEXTPARENT = false;
            component.A.APARENT = '';
        }
        else {
            if (this.getParentNode().nodeName.substring(0, 4) == 'EXT-') {
                component.A.HASEXTPARENT = true;
            }
            else {
                component.A.HASEXTPARENT = false;
            }
            if (component.parentNode.node == undefined) {
                component.A.APARENT = component.parentNode.nodeName;
            }
            else {
                component.A.APARENT = component.parentNode.node.nodeName;
            }
        }
        if (base.count == 0) {
            base.count++;
            if (component.A.HASEXTPARENT == false) {
                this.base.DIRECTION = 'TopToBottom';
            }
            else {
                console.dir(this)
                if (this.getParentNode().nodeName.substring(0, 4) == 'EXT-') {
                    this.base.DIRECTION = 'BottomToTop';
                }
                else {
                    this.base.DIRECTION = 'TopToBottom';
                }
            }
        }
        component.A.ACURRENT = component.xtype;
        //component.A.CHILDRENNODES = [];
        component.A.CHILDRENCOMPONENTS = [];
        component.A.CHILDRENCOMPONENTSCOUNT = 0;
        component.A.CHILDRENCOMPONENTSADDED = 0;
        if (this.base.DIRECTION = 'TopToBottom') {

            //component.A.CHILDRENCOMPONENTS = component.childComponents; //this.A.childComponents
            component.A.CHILDRENCOMPONENTS = component.childComponents; //this.A.childComponents

            for (var i = 0; i < component.A.CHILDRENCOMPONENTS.length; i++) {
                if (component.A.CHILDRENCOMPONENTS[i].nodeName.substring(0, 4) == 'EXT-') {
                    component.A.CHILDRENCOMPONENTSCOUNT++;
                }
            }
            component.A.CHILDRENCOMPONENTSLEFT = component.A.CHILDRENCOMPONENTSCOUNT;
        }

    }
    // adjustNodes(children, xtype) {
    //     this.A.xtype = xtype;
    //     this.A.childComponents = [];
    //     var num = 0;
    //     for (var i = 0; i < children.length; i++) {
    //         if (children[i].XTYPE != undefined) {
    //             this.A.childComponents[num] = {};
    //             this.A.childComponents[num] = children[i];
    //             this.A.childComponents[num].currentComponent = children[i];
    //             this.A.childComponents[num].node = children[i];
    //             num++;
    //         }
    //     }
    // }

    createPropsForEWC(properties, events) {
        var o = {};
        o.xtype = this.xtype;
        if (o.xtype == 'column' ||
            o.xtype == 'gridcolumn') {
            var renderer = this.getAttribute('renderer')
            if (renderer != undefined) {
                o.cell = this.cell || {}
                o.cell.xtype = 'renderercell'
                //console.log(renderer)
                o.cell.renderer = renderer
            }
        }
        //mjg fitToParent not working??
        if (true === this.fitToParent) {
            o.top=0,
            o.left=0,
            o.width='100%',
            o.height='100%'
        }
        for (var property in properties) { //this.PROPERTIESOBJECT
            if (this.getAttribute(property) !== null) {
                if (property == 'handler') {
                    var functionString = this.getAttribute(property);
                    //error check for only 1 dot
                    var r = functionString.split('.');
                    var obj = r[0];
                    var func = r[1];
                    o[property] = window[obj][func];
                }
                else {
                    o[property] = this.filterProperty(this.getAttribute(property));
                }
            }
        }
        o.listeners = {}

        // this would only add events to the ones that are
        // being used for this instance
        // for (var i = 0; i < this.attributes.length; i++) {
        //     var attr = this.attributes.item(i).nodeName;

        //     if (/^on/.test(attr)) {
        //     //if (/^on/.test(attr) && attr!='onitemdisclosure') {
        //         var name = attr.slice(2);
        //         var result = this.EVENTS.filter(obj => {return obj.name === name});
        //         this.setEvent(result[0],o,this)
        //     }
        // }

        //this.EVENTS
        var me2 = this
        events.forEach(function (eventparameter, index, array) {
            me2.setEvent(eventparameter,o,me2)
        })

        this.A.props = o
        //return o;
    }
    createPropsForENG(properties, events) {
        console.dir(this)
        this.A.props.xtype = this.xtype;
        let listenersProvided = false;
        for (var i = 0; i < properties.length; i++) {
            var prop = properties[i];
            if (prop == 'handler') {
                if (this[prop] != undefined) {
                    this.A.props[prop] = this[prop];
                }
            }
            //need to handle listeners coming in here
            if ((this.A.props.xtype === 'cartesian' || this.A.props.xtype === 'polar') && prop === 'layout') {
            }
            else if (prop == 'listeners' && this[prop] != undefined) {
                this.A.props[prop] = this[prop];
                listenersProvided = true;
            }
            else {
                if (this[prop] != undefined &&
                    prop != 'listeners' &&
                    prop != 'config' &&
                    prop != 'handler' &&
                    prop != 'fitToParent') {
                    this.A.props[prop] = this[prop];
                }
            }
        }
        if (true === this['fitToParent']) {
            this.A.props.top = 0,
                this.A.props.left = 0,
                this.A.props.width = '100%',
                this.A.props.height = '100%';
        }
        if (this['config'] !== {}) {
            Ext.apply(this.A.props, this['config']);
        }
        if (!listenersProvided) {
            this.A.props.listeners = {};
            //var EVENTS = metaData.EVENTS
            //var EVENTS = events
            var me = this;
            events.forEach(function (event, index, array) {
                let eventname = event.name;
                let eventparameters = event.parameters;
                me.A.props.listeners[eventname] = function () {
                    let parameters = eventparameters;
                    let parms = parameters.split(',');
                    let args = Array.prototype.slice.call(arguments);
                    let emitparms = {};
                    if (this._extitems != undefined) {
                        for (let i = 0, j = parms.length; i < j; i++) {
                            emitparms[parms[i]] = args[i];
                        }
                        me[eventname].emit(emitparms);
                    }
                    else {

                    }
                };
            });
        }
        if (this._extitems != undefined) {
            events.forEach((event, n) => {
                if (event != 'fullscreen') {
                    this[event] = new EventEmitter();
                }
                else {
                    this[event + 'event'] = new EventEmitter();
                }
            });
        }
    }

    createExtComponent() {
        if (this.A.props['viewport'] == true) {
            this.A.APARENT = '';
            //this.newDiv.remove()
            this.A.ext = Ext.create(this.A.props);
            console.log('0-Ext.application: ' + this.A.props.xtype);
            var me = this;
            Ext.application({
                name: 'MyEWCApp',
                launch: function () {
                    Ext.Viewport.add([me.A.ext]);
                    if (window['router']) {
                        window['router'].init();
                    }
                }
            });
        }
        else if (this.parentNode == null) {
            this.A.APARENT = '';
            console.log('1- Ext.create: ' + this.node.nodeName + ' parent: ' + this.node.nodeName);
            this.A.props.renderTo = this.newDiv; //this.node; //this.A.newDiv; //me.shadowRoot;
            this.A.ext = Ext.create(this.A.props);
            //me.currentComponent.node.parentNode.replaceChild(me.currentComponent.node.ext.el.dom, this.A.newDiv)
            //console.log('replace newDiv')
        }
        else {
            //getParentNode().

            //parentNode.node.



            //if (this.parentNode.node.nodeName.substring(0, 4) != 'EXT-') {
            if (this.getParentNode().nodeName.substring(0, 4) != 'EXT-') {
                console.log('2- Ext.create: ' + this.node.nodeName + '  parent: ' + this.parentNode.nodeName);
                this.A.props.renderTo = this.newDiv; //this.A.newDiv; //me.shadowRoot;
                this.A.ext = Ext.create(this.A.props);
                //me.currentComponent.node.parentNode.replaceChild(me.currentComponent.node.ext.el.dom, this.A.newDiv)
            }
            else {
                console.log('4- Ext.create: ' + this.node.nodeName + '  Ext parent: ' + this.parentNode.nodeName);
                //this.A.props.renderTo = this; //this.A.newDiv; //me.shadowRoot;
                this.A.ext = Ext.create(this.A.props);
            }
        }
        // else {
        //     this.A.APARENT = this.parentNode.node.nodeName;
        //     console.log('3-parent of: ' + me.this.node.nodeName + ' is ' + this.parentNode.node.nodeName)
        //     this.A.ext = Ext.create(this.A.props);
        // }
    }
    assessChildren(base, xtype) {
        console.log('assessChildren for: ' + xtype);
        if (this._extitems != undefined) {
            if (this._extitems.length == 1) {
                //if (this._hostComponent != null) {
                //mjg console.log('item')
                console.log('set html');
                this.A.ext.setHtml(this._extitem.nativeElement);
                //}
            }
        }
        if (this._extitems != undefined) {
            if (this._extroutes.length == 1) {
                console.log('set router');
                this.A.ext.setHtml(this._extroute.nativeElement);
                //childItem.childCmp = Ext.create({xtype:'widget', ewc:item.getAttribute('ewc'), element:Ext.get(item.parentNode.removeChild(item))})
            }
        }
        if (this.A.CHILDRENCOMPONENTSCOUNT == 0 &&
            this.A.CHILDRENCOMPONENTSLEFT == 0 &&
            this.A.CHILDRENCOMPONENTSADDED == 0 &&
            this.parentNode == null) {
            console.log('Solo');
            this.sendReadyEvent(this);
        }
        else if (this.A.CHILDRENCOMPONENTSADDED > 0) {
            console.log('addChildren');
            console.dir(this.A.CHILDRENCOMPONENTS);
            this.addChildren(this, this.A.CHILDRENCOMPONENTS);
            console.log('send ready for CHILDRENCOMPONENTSADDED > 0');
            this.sendReadyEvent(this);
            this.node.remove()
        }
        // else if (this.parentNode != null && this.A.CHILDRENCOMPONENTSCOUNT == 0) {
        //     console.log('send ready for ' + this.A.xtype);
        //     this.sendReadyEvent(this);
        // }
        if (this.A.HASEXTPARENT == true) {
            if (base.DIRECTION == 'TopToBottom') {
                console.log('TopToBottom');
                //this.parentNode.A.CHILDRENNODES.push(this);
                console.dir(this.getParentNode().A)
                this.getParentNode().A.CHILDRENCOMPONENTS.push(this);
                this.getParentNode().A.CHILDRENCOMPONENTSADDED++;
                this.getParentNode().A.CHILDRENCOMPONENTSLEFT--;
                if (this.getParentNode().A.CHILDRENCOMPONENTSLEFT == 0) {
                    this.addChildren(this.getParentNode(), this.getParentNode().A.CHILDRENCOMPONENTS);
                    console.log('send ready to parent');
                    this.sendReadyEvent(this.getParentNode());
                }
            }
            else {
                this.parentNode.A.CHILDRENCOMPONENTS.push(this);
                this.parentNode.A.CHILDRENCOMPONENTSADDED++;
            }
        }
    }
    addChildren(child, children) {
        console.log('addChildren for ' + child.A.ACURRENT + ' - num children: ' + children.length);
        for (var i = children.length - 1; i > -1; i--) {
            var childItem = { parentCmp: {}, childCmp: {} };
            childItem.parentCmp = child.A.ext;
            childItem.childCmp = children[i].A.ext;
            this.addTheChild(childItem.parentCmp, childItem.childCmp, null);
        }
    }
    addTheChild(parentCmp, childCmp, location) {
        var parentxtype = parentCmp.xtype;
        var childxtype = childCmp.xtype;
        console.log('addTheChild: ' + parentxtype + '(' + parentCmp.ext + ')' + ' - ' + childxtype + '(' + childCmp.ext + ')');
        //if (childxtype == 'widget')
        if (this.A.ext.initialConfig.align != undefined) {
            if (parentxtype != 'titlebar' && parentxtype != 'grid' && parentxtype != 'lockedgrid' && parentxtype != 'button') {
                console.error('Can only use align property if parent is a Titlebar or Grid or Button');
                return;
            }
        }
        var defaultparent = false;
        var defaultchild = false;
        switch (parentxtype) {
            case 'button':
                switch (childxtype) {
                    case 'menu':
                        parentCmp.setMenu(childCmp);
                        break;
                    default:
                        defaultparent = true;
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
                switch (childxtype) {
                    case 'renderercell':
                        parentCmp.setCell(childCmp);
                        break;
                    case 'column':
                    case 'gridcolumn':
                        parentCmp.add(childCmp);
                        break;
                    default:
                        defaultparent = true;
                        break;
                }
                break;
            case 'grid':
            case 'lockedgrid':
                switch (childxtype) {
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
                                parentCmp.addColumn(childCmp);
                            }
                            else {
                                parentCmp.add(childCmp);
                            }
                        }
                        else {
                            var regCols = 0;
                            if (parentCmp.registeredColumns != undefined) {
                                regCols = parentCmp.registeredColumns.length;
                            }
                            if (parentxtype == 'grid') {
                                //mjg console.log(parentCmp)
                                parentCmp.insertColumn(location + regCols, childCmp);
                            }
                            else {
                                parentCmp.insert(location + regCols, childCmp);
                            }
                        }
                        break;
                    default:
                        defaultparent = true;
                        break;
                }
                break;
            default:
                defaultparent = true;
                break;
        }
        ;
        switch (childxtype) {
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
                        if (location == null) {
                            parentCmp.add(childCmp);
                        }
                        else {
                            parentCmp.insert(location, childCmp);
                        }
                    }
                    else {
                        parentCmp.add(childCmp);
                    }
                }
                break;
            case 'tooltip':
                parentCmp.setTooltip(childCmp);
                break;
            case 'plugin':
                parentCmp.setPlugin(childCmp);
                break;
            default:
                defaultchild = true;
                break;
        }
        if (defaultparent == true && defaultchild == true) {
            //console.log(parentxtype + '.add(' + childxtype + ')')
            parentCmp.add(childCmp);
        }
        // if (this.parentNode.childrenYetToBeDefined > 0) {
        //     this.parentNode.childrenYetToBeDefined--
        // }
        // //console.log('childrenYetToBeDefined(after) '  + this.parentNode.childrenYetToBeDefined)
        // if (this.parentNode.childrenYetToBeDefined == 0) {
        //     this.parentNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: this.parentNode.ext}}))
        // }
    }


    sendReadyEvent(component) {
        if (component._extitems != undefined) {
            component['ready'].emit({ detail: { cmp: component.A.ext } });
        }
        else {
            component.dispatchEvent(new CustomEvent('ready', { detail: { cmp: component.A.ext } }));
        }
    }

    setEvent(eventparameters,o, me3) {
        o.listeners[eventparameters.name] = function() {
            let eventname = eventparameters.name
            //console.log('in event: ' + eventname + ' ' + o.xtype)
            let parameters = eventparameters.parameters;
            let parms = parameters.split(',');
            let args = Array.prototype.slice.call(arguments);
            let event = {};
            for (let i = 0, j = parms.length; i < j; i++ ) {
                event[parms[i]] = args[i];
            }
            me3.dispatchEvent(new CustomEvent(eventname,{detail: event}))
        }
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        if (/^on/.test(attr)) {
            if (newVal) {
            this.addEventListener(attr.slice(2), function(event) {
                var functionString = newVal;
                // todo: error check for only 1 dot
                var r = functionString.split('.');
                var obj = r[0];
                var func = r[1];
                if (obj && func) {
                window[obj][func](event);
                }
            });
            } else {
            //delete this[attr];
            //this.removeEventListener(attr.slice(2), this);
            }
        } else {

            var ischanged
            if (this.A) {
                if (this.A.ext != undefined) {
                    ischanged = true
                    var method = 'set' + attr[0].toUpperCase() + attr.substring(1)
                    this.A.ext[method](newVal)
                }
                else {
                    ischanged = false
                }
            }
            //console.log('attr: ' + attr + ', changed is ' + ischanged)

            //if (this.A.ext === undefined) {
            //    //mjg ??
            //}
            //else {
            //    //mjg check if this method exists for this component
            //    var method = 'set' + attr[0].toUpperCase() + attr.substring(1)
            //    this.A.ext[method](newVal)
            //}
        }
    }

    extendObject(obj, src) {
        if (obj == undefined) {obj = {}}
        for (var key in src) {
            if (src.hasOwnProperty(key)) obj[key] = src[key];
        }
        return obj;
    }

    extendArray(obj, src) {
        if (obj == undefined) {obj = []}
        Array.prototype.push.apply(obj,src);
        return obj;
    }

    filterProperty(propertyValue) {
        try {
            const parsedProp = JSON.parse(propertyValue);

            if (parsedProp === null ||
                parsedProp === undefined ||
                parsedProp === true ||
                parsedProp === false ||
                parsedProp === Object(parsedProp) ||
                (!isNaN(parsedProp) && parsedProp !== 0)
            ) {
                return parsedProp;
            } else {
                return propertyValue;
            }
        }
        catch(e) {
            return propertyValue;
        }
    }

    disconnectedCallback() {
        //console.log('ExtBase disconnectedCallback ' + this.A.ext.xtype)
        delete this.A.ext
    }

}

EwcBaseComponent.count = 0;
EwcBaseComponent.DIRECTION = '';
