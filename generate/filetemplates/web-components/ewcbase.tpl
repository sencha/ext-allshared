import 'script-loader!node_modules/@sencha/ext-web-components{bundle}/ext/ext.{type}.prod';
import 'script-loader!node_modules/@sencha/ext-web-components{bundle}/ext/css.prod';

import HTMLParsedElement from './HTMLParsedElement'

export default class EwcBaseComponent extends HTMLElement {

    constructor() {
        super ()
        //console.log('in EwcBaseComponent')
    }

    connectedCallback() {
        this.newDiv = document.createElement("div");
        this.parentNode.insertBefore(this.newDiv,this);

        //var newContent = document.createTextNode("Hi there and greetings!");
        //this.newDiv.appendChild(newContent);
    }

    parsedCallback() {
        var me = this;
        console.log('parsedCallback')
        this.createProps()
        this.createExtComponent()
        this.assessChildren()
    }

    createProps() {
        var me = this;
        me.props = {};
        me.props.xtype = me.XTYPE;
        //if (me.props.xtype.substr(me.props.xtype.length - 6) == 'column') {
        if (me.props.xtype == 'column' ||
            me.props.xtype == 'gridcolumn') {
            var renderer = me.getAttribute('renderer')
            if (renderer != undefined) {
                me.props.cell = me.cell || {}
                me.props.cell.xtype = 'renderercell'
                //console.log(renderer)
                me.props.cell.renderer = renderer
            }
        }
        //mjg fitToParent not working??
        if (true === me.fitToParent) {
            me.props.top=0,
            me.props.left=0,
            me.props.width='100%',
            me.props.height='100%'
        }
        for (var property in me.PROPERTIESOBJECT) {
            if (me.getAttribute(property) !== null) {
                if (property == 'handler') {
                    var functionString = me.getAttribute(property);
                    //error check for only 1 dot
                    var r = functionString.split('.');
                    var obj = r[0];
                    var func = r[1];
                    me.props[property] = window[obj][func];
                }
                else {
                    me.props[property] = me.filterProperty(me.getAttribute(property));
                }
            }
        }
        me.props.listeners = {}

        // this would only add events to the ones that are
        // being used for this instance
        // for (var i = 0; i < me.attributes.length; i++) {
        //     var attr = me.attributes.item(i).nodeName;

        //     if (/^on/.test(attr)) {
        //     //if (/^on/.test(attr) && attr!='onitemdisclosure') {
        //         var name = attr.slice(2);
        //         var result = me.EVENTS.filter(obj => {return obj.name === name});
        //         me.setEvent(result[0],me.props,this)
        //     }
        // }

        var me = this;
        me.EVENTS.forEach(function (eventparameter, index, array) {
            me.setEvent(eventparameter,me.props,me)
        })
    }

    createExtComponent() {
        var me = this;
        if (me.props['viewport'] == true) {
            me.ext = Ext.create(me.props)
            //console.log('Ext.application for ' + me.props.xtype + '(' + me.props.ewc + ')')
            Ext.application({
                name: 'MyEWCApp',
                launch: function () {
                    Ext.Viewport.add([me.ext])
                    if (window.router) {window.router.init();}
                }
            });
        }
        else if (me.parentNode.nodeName.substring(0, 4) != 'EXT-') {
            //console.log('parent of: ' + this.nodeName + ' is ' + this.parentNode.nodeName)
            me.props.renderTo = this.newDiv;
            me.ext = Ext.create(me.props)
            //console.dir(me.ext.el.dom)
            //var a = Ext.get(me.ext)
            me.parentNode.replaceChild(me.ext.el.dom, this.newDiv)
        }
        else {
            // console.log('parent is EXT')
            me.ext = Ext.create(me.props)
        }
    }

    assessChildren() {
        var parentEWS = false
        var parentCONNECTED = false
        this.CONNECTED = true
        this.EWSCHILDRENCOUNT = 0

        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].nodeName.substring(0, 4) == 'EXT-') {
                this.EWSCHILDRENCOUNT++
            }
        }
        this.EWSCHILDRENLEFT = this.EWSCHILDRENCOUNT
        if (this.EWSCHILDREN != undefined) {
            this.EWSCHILDRENLEFT = this.EWSCHILDRENCOUNT - this.EWSCHILDREN.length
        }
        if (this.parentNode.nodeName.substring(0, 4) == 'EXT-') {
            parentEWS = true
            if (this.parentNode.CONNECTED == true) {
                parentCONNECTED = true
            }
        }
        else {
            parentEWS = false
            parentCONNECTED = true
        }
        // console.log('children: ' + this.children.length)
        // console.log('parentEWS: ' + parentEWS)
        // console.log('parentCONNECTED: ' + parentCONNECTED)
        // console.log('EWSCHILDRENCOUNT: ' + this.EWSCHILDRENCOUNT)
        // console.log('parent EWSCHILDRENCOUNT: ' + this.parentNode.EWSCHILDRENCOUNT)
        // console.log('EWSCHILDRENLEFT: ' + this.EWSCHILDRENLEFT)

        if (this.EWSCHILDRENCOUNT == 0) {
            var me = this;
            setTimeout(function(){
                me.dispatchEvent(new CustomEvent('ready',{detail:{cmp: me.ext}}))
            }, 0);
            //this.dispatchEvent(new CustomEvent('ready',{detail:{cmp: this.ext}}))
        }

        if (this.EWSCHILDREN == undefined) {
            if (this.EWSCHILDRENCOUNT != 0) {
                // console.log('no children defined yet')
            }
        }
        else {
            // console.log('EWSCHILDREN.length: ' + this.EWSCHILDREN.length)
        }

        if (parentEWS == true) {
            if (this.parentNode.EWSCHILDREN == undefined) {
                this.parentNode.EWSCHILDREN = []
            }
            this.parentNode.EWSCHILDREN.push(this)
            this.parentNode.EWSCHILDRENLEFT--
            if (this.parentNode.EWSCHILDRENLEFT == 0) {
                // console.log('TOP to BOTTOM')
                // console.log('this is the last child')
                // console.log('ready to go')
                // console.dir(this.parentNode)
                // console.dir(this.parentNode.children)
                // console.dir(this.parentNode.EWSCHILDREN)

                var children = this.parentNode.children
                var child = this.parentNode
                this.addChildren(child, children)
                this.parentNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: this.parentNode.ext}}))
            }
            else {
                // console.log('after EWSCHILDRENLEFT: ' + this.EWSCHILDRENLEFT)
            }
        }

        if(this.EWSCHILDREN == undefined) {this.EWSCHILDREN = []}

        if ((this.EWSCHILDRENCOUNT > 0 && this.EWSCHILDRENCOUNT == this.EWSCHILDREN.length) ||
            (this.children.length > 0 && this.EWSCHILDRENCOUNT == 0)) {
            var children = this.children
            var child = this
            // console.log('BOTTOM to TOP')
            // console.log('children were done first')
            // console.log('ready to go')
            // console.log(this.children)
            // console.log(this.EWSCHILDREN)

            // console.dir(this.children)
            // console.dir(child)
            this.addChildren(child, children)
            this.dispatchEvent(new CustomEvent('ready',{detail:{cmp: this.ext}}))
            //console.log(this.parentNode.EWSCHILDRENLEFT)
        }
        else {
            //console.log('after EWSCHILDREN.length: ' + this.EWSCHILDREN.length)
        }
    }

    addChildren(child, children) {
        var childItems = []
        var childItem = {}
        for (var i = children.length-1; i > -1; i--) {
            var item = children[i]
            if (item.nodeName.substring(0, 4) == 'EXT-') {
                childItem = {}
                childItem.parentCmp = child.ext
                childItem.childCmp = item.ext
                childItems.push(childItem)
            }
            else {
                childItem = {}
                childItem.parentCmp = child.ext
                childItem.childCmp = Ext.create({xtype:'widget', ewc:item.getAttribute('ewc'), element:Ext.get(item.parentNode.removeChild(item))})
                childItems.push(childItem)
            }
        }
        for (var i = childItems.length-1; i > -1; i--) {
            var childItem = childItems[i]
            this.addTheChild(childItem.parentCmp, childItem.childCmp)
        }
    }

    addTheChild(parentCmp, childCmp, location) {
        var parentxtype = parentCmp.xtype
        var childxtype = childCmp.xtype
        //console.log('addTheChild: ' + parentxtype + '(' + parentCmp.ewc + ')' + ' - ' + childxtype + '(' + childCmp.ewc + ')')
        if (childxtype == 'widget')
        if (this.ext.initialConfig.align != undefined) {
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

        if (this.parentNode.childrenYetToBeDefined > 0) {
            this.parentNode.childrenYetToBeDefined--
        }
        //console.log('childrenYetToBeDefined(after) '  + this.parentNode.childrenYetToBeDefined)
        if (this.parentNode.childrenYetToBeDefined == 0) {
            this.parentNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: this.parentNode.ext}}))
        }
    }

    setEvent(eventparameters,o, me) {
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
            me.dispatchEvent(new CustomEvent(eventname,{detail: event}))
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
            if (this.ext != undefined) {
                ischanged = true
                var method = 'set' + attr[0].toUpperCase() + attr.substring(1)
                this.ext[method](newVal)
            }
            else {
                ischanged = false
            }
            console.log('attr: ' + attr + ', changed is ' + ischanged)

            //if (this.ext === undefined) {
            //    //mjg ??
            //}
            //else {
            //    //mjg check if this method exists for this component
            //    var method = 'set' + attr[0].toUpperCase() + attr.substring(1)
            //    this.ext[method](newVal)
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
        //console.log('ExtBase disconnectedCallback ' + this.ext.xtype)
        delete this.ext
    }

}
