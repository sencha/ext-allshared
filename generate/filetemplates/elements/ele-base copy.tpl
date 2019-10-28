//{now}
{import}

//Ext.define('Ext.ElementCell', {
//    extend: 'Ext.grid.cell.Cell',
//    xtype: 'elementcell'
//});

import {
    doProp,
    filterProp,
    isMenu,
    isRenderercell,
    isParentGridAndChildColumn,
    isTooltip,
    isPlugin
} from './util.js';

export default class {Shortname}BaseComponent extends HTMLElement {

    constructor(properties, events) {
        super ();
        this.properties = properties;
        this.events = events;
    }

    connectedCallback() {
        //console.log('connectedCallback')
        //console.log(this.xtype)
        var x = this.xtype
        //var props = ['text','align','title','extname','height','width','columns','data','layout','flex']
        // props.forEach( prop =>
        //     {
        //         doProp(this,prop)
        //     }
        // )
        const distinct = (value, index, self) => {
            return self.indexOf(value) === index;
        }
        var properties2 = [];
        //console.log(typeof properties2)
        //var myStringArray = ["Hello","World"];
        var arrayLength = this.properties.length;
        for (var i = 0; i < arrayLength; i++) {
            properties2.push(this.properties[i]);
        }
        //console.log(properties2)
        //console.log(typeof properties2)
        var p2 = properties2.filter(distinct);
        //this.properties = p2;
        p2.forEach( prop =>
            {
                doProp(this,prop)
            }
        )
        //this.methods = methods;
        //this.events = events;


        {Shortname}BaseComponent.elementcount++;
        //console.log('added: ' + this.tagName + ': elementcount is now ' + {Shortname}BaseComponent.elementcount);
        {Shortname}BaseComponent.elements.push(this);

        this.A = {};
        this.A.CHILDREN = [];
        this.A.ITEMS = [];
        this.A.o = {};
        this.attributeObjects = {};

        //console.log(this.children)

        for (let child of this.children) {
            if (child.nodeName.substring(0, 4) !== 'EXT-') {
                var el = Ext.get(child);
                var w = Ext.create({xtype:'widget', element: el});
                this.A.ITEMS.push(w);
            }
            else {
                var g = {}
                g.type = 'ext'
                this.A.ITEMS.push(g);
            }
        }

        //for (let child of this.children) {
        //    //console.dir(child)
        //    if (child.nodeName.substring(0, 4) !== 'EXT-') {
        //        //console.log(child);
        //        var el = Ext.get(child);
        //        var w = Ext.create({xtype:'widget', element: el});
        //        //this.A.CHILDREN.push(w);
        //    }
        //}

        this.base = {Shortname}BaseComponent;

        //this.properties = []
        //for (var property in this.propertiesobject) {
        //    this.properties.push(property)
        //}

        // this.newDiv = document.createElement('div');
        // //var textnode = document.createTextNode(this.xtype);
        // //this.newDiv.appendChild(textnode)
        // this.insertAdjacentElement('beforebegin', this.newDiv);
        this.xtype = x
    }

    parsedCallback() {
        this.initMe()
    }

//******* base start */
initMe() {
    this.newParsedCallback();
    return
    //console.log('');console.log('*** initMe for ' + this.currentElName);
    this.createRawChildren();
    this.setParentType();
    this.setDirection();
    this.figureOutA();
    this.createProps(this.properties, this.events);
    this.createExtComponent();
}

newParsedCallback() {
    var me = this;
    this.newCreateProps(this.properties, this.events)
    if (this.parentNode != null &&
        this.parentNode.nodeName.substring(0, 4) !== 'EXT-')
    {
        this.A.o.renderTo = this; //.parentNode;
        //this.A.o.renderTo = this.newDiv.parentNode;
        //this.newDiv.parentNode.removeChild(this.newDiv);
    }
    // this.A.o.listeners = {}
    // this.events.forEach(function (event, index, array) {
    //     me.setEvent(event,me.A.o,me)
    // })

    this.newDoExtCreate(me, this.A.o['viewport']);
}

newCreateProps(properties) {
    //console.log('store prop')
    //console.log(this.store)
    let listenersProvided = false;
    var o = {};
    o.xtype = this.xtype;

    if (this['config'] !== {}) {
        Ext.apply(o, this['config']);
    }

    if (true == this.fitToParent) {
        o.height='100%'
    }
    //if (o.xtype == 'column' ||
    //    o.xtype == 'gridcolumn') {
    //    //replace above with call from util
    //    var renderer = this.getAttribute('renderer')
    //    if (renderer != undefined) {
    //        o.cell = this.cell || {}
    //        o.cell.xtype = 'renderercell'
    //        //console.log(renderer)
    //        o.cell.renderer = renderer
    //    }
    //}
    for (var i = 0; i < properties.length; i++) {
        var property = properties[i]
        if (this.getAttribute(property) !== null) {

//this needs to be made more generic mjg


            if (property == 'renderer') {
                var cellxtype = ''
                try {
                    Ext.create({xtype: 'reactcell'})
                    cellxtype = 'reactcell'
                }
                catch(e) {
                    cellxtype = 'elementcell'
                }
                o.cell = {};
                o.cell.xtype = cellxtype;
                if (this.attributeObjects['renderer'] != undefined) {
                    o.renderer = this.attributeObjects['renderer'];
                }
                else {
                    o.renderer = eval(this['renderer']);
                }
            }

            else if (this.getAttribute(property) == 'object') {
                o[property] = this.attributeObjects[property];
            }


            else if (property == 'handler') {
                // if (this[property] != undefined) {
                //     o[property] = this[property];
                // }

                var functionString = this.getAttribute(property);
                eval(functionString + '(event)');

                ////error check for only 1 dot
                //var r = functionString.split('.');
                //var obj = r[0];
                //var func = r[1];
                //o[property] = window[obj][func];
            }



            // else if ((o.xtype === 'cartesian' || o.xtype === 'polar') && property === 'layout') {
            // }
            else if (property == 'listeners' && this[property] != undefined) {
                o[property] = this[property];
                listenersProvided = true;
            }
            else if (property == 'config') {
                var configs = JSON.parse(this.getAttribute(property))
                for (var configProp in configs) {
                    if (configs.hasOwnProperty(configProp)) {
                       //o[configProp] = filterProp(configs[configProp], property, this);
                       o[configProp] = filterProp(this.getAttribute(configs[configProp]), configProp, this);
                    }
                }
            }
            else if (this[property] != undefined &&
                property != 'listeners' &&
                property != 'config' &&
                property != 'handler' &&
                property != 'fitToParent') {
                //props[property] = property[prop];
                //console.log('here??')
                //console.log(property)
                o[property] = filterProp(this.getAttribute(property), property, this);
            }

            // else {
            //     o[property] = filterProp(this.getAttribute(property));
            // }
        }

        if (!listenersProvided) {
            o.listeners = {};
            var me = this;
            this.events.forEach(function (event, index, array) {
                me.setEvent(event,o,me)
            })
        }
    }
    this.A.o = o;
}


newDoExtCreate(me, isApplication) {
    //if (Ext != undefined) {
    if (window['Ext'] != undefined) {
        {Shortname}BaseComponent.isLoading = true;
        {Shortname}BaseComponent.isDone = true;
    }
    if ({Shortname}BaseComponent.isLoading == false) {
        {Shortname}BaseComponent.isLoading = true;
        var csstag = document.createElement("script");
        csstag.type = "text/javascript";
        csstag.src = "../ext/css.all.js";
        csstag.onload = function() {
            var exttag = document.createElement("script");
            exttag.type = "text/javascript";
            exttag.src = "../ext/ext.all.js";
            exttag.onload = function() {
                {Shortname}BaseComponent.isDone = true;
            }
            document.getElementsByTagName('head')[0].appendChild(exttag);
        }
        document.getElementsByTagName('head')[0].appendChild(csstag);
    }
    var myVar = setInterval(() => {
        if ({Shortname}BaseComponent.isDone === true) {
            clearInterval(myVar)
            Ext.onReady(function () {
                //console.log(me.A.o)
                me.A.ext = Ext.create(me.A.o)
                me.A.CHILDREN.forEach(function(child) {
                    me.addTheChild(me.A.ext,child);
                })
                //console.dir(me)
                if (me.parentNode != null && me.parentNode.nodeName.substring(0, 4) === 'EXT-') {
                    if (me.parentNode.A.ext !== undefined) {
                        me.addTheChild(me.parentNode.A.ext,me.A.ext);
                    }
                    else {
                        me.parentNode.A.CHILDREN.push(me.A.ext);
                    }
                }
                if (isApplication) {
                    Ext.application({
                        name: 'MyEWCApp',
                        launch: function () {
                            Ext.Viewport.add([me.A.ext]);
                        }
                    });
                }

                {Shortname}BaseComponent.elementcount--;
                //console.log('reduced: ' + me.tagName + ': elementcount reduced to ' + {Shortname}BaseComponent.elementcount)
                if ({Shortname}BaseComponent.elementcount == 0) {
                    //console.log('done');
                    //console.log({Shortname}BaseComponent.elements);
                    {Shortname}BaseComponent.elementsprior = [...{Shortname}BaseComponent.elements];
                    {Shortname}BaseComponent.elements = [];
                    //console.log({Shortname}BaseComponent.elementsprior);
                    var allExt = [];
                    {Shortname}BaseComponent.elementsprior.forEach(element => {

                        //console.dir(element)
                        if (element.A != undefined) {
                            for (var i = 0; i < element.A.ITEMS.length; i++) {
                                //console.log(element.A.ITEMS[i])
                                if(element.A.ITEMS[i].xtype == 'widget') {
                                    //console.log('do it for ' + i)
                                    //console.log(me)
                                    //console.dir(element)
                                    //console.log(me.A.ext)
                                    //console.log(element.A.ITEMS[i])
                                    //element.A.ext.insert(i,element.A.ITEMS[i])
                                    element.addTheChild(element.A.ext,element.A.ITEMS[i],i);
                                }
                            }
                        }
                        //console.log('after loop')

                        if (element.getAttribute('extname') != undefined) {
                            var o = {}
                            o.extname = element.getAttribute('extname');
                            o.ext = element.A.ext;
                            o.cmp = element.A.ext;
                            allExt.push(o);
                        }
                    })

                    //console.log({Shortname}BaseComponent.elementsprior)
                    {Shortname}BaseComponent.elementsprior.forEach(element => {
                        //console.dir(element)
                        element.dispatchEvent(new CustomEvent('ready', {
                            detail: {
                                cmp: element.A.ext,
                                allCmp: allExt,
                                ext: element.A.ext,
                                allExt: allExt
                            }
                        }))
                    })
                }
            })
        }
    }, 0)
}

addTheChild(parentCmp, childCmp, location) {
    var parentxtype = parentCmp.xtype;
    var childxtype = childCmp.xtype;
    //console.log('addTheChild: ' + parentxtype + '(' + parentCmp.ext + ')' + ' - ' + childxtype + '(' + childCmp.ext + ')');
    //if (childxtype == 'widget')
    if (this.A.ext.initialConfig.align != undefined) {
        if (parentxtype != 'tooltip' && parentxtype != 'titlebar' && parentxtype != 'grid' && parentxtype != 'lockedgrid' && parentxtype != 'button') {
            console.error('Can only use align property if parent is a Titlebar or Grid or Button');
            return;
        }
    }

    switch (true) {
        case isMenu(childxtype):
            parentCmp.setMenu(childCmp);
            break;
        case isRenderercell(childxtype):
            parentCmp.setCell(childCmp);
            break;
        case isParentGridAndChildColumn(parentxtype,childxtype):
            if (location == null) {
                parentCmp.addColumn(childCmp);
            }
            else {
                var regCols = 0;
                if (parentCmp.registeredColumns != undefined) {
                    regCols = parentCmp.registeredColumns.length;
                }
                if (parentxtype == 'grid') {
                    parentCmp.insertColumn(location + regCols, childCmp);
                }
                else {
                    parentCmp.insert(location + regCols, childCmp);
                }
            }
            break;
        case isTooltip(childxtype):
            parentCmp.setTooltip(childCmp);
            break;
        case isPlugin(childxtype):
            parentCmp.setPlugin(childCmp);
            break;
        default:
            if (location == null) {
                parentCmp.add(childCmp);
            }
            else {
                parentCmp.insert(location, childCmp);
            }
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

//this needs to be made more generic mjg
    attributeChangedCallback(attr, oldVal, newVal) {
        if (/^on/.test(attr)) {
            if (newVal) {
            this.addEventListener(attr.slice(2), function(event) {
                var functionString = newVal;
                eval(functionString + '(event)');


                //// todo: error check for only 1 dot
                //var r = functionString.split('.');
                //var obj = r[0];
                //var func = r[1];
                //if (obj && func) {
                //window[obj][func](event);
                //}
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
                    if (method != 'setExtname') {
                        //console.log(method)
                        this.A.ext[method](newVal)
                    }
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

{Shortname}BaseComponent.elementcount = 0;
{Shortname}BaseComponent.elements = [];
{Shortname}BaseComponent.elementsprior = [];

{Shortname}BaseComponent.isLoading = false;
{Shortname}BaseComponent.isDone = false;

{Shortname}BaseComponent.count = 0;
{Shortname}BaseComponent.DIRECTION = '';

//{Shortname}BaseComponent.getCmp = function getCmp(event, value) {
//    var array = event.detail.allCmp;
//    for (var i = 0; i < array.length; i++) {
//        if (array[i]['extname'] === value) {
//        return array[i].ext;
//        }
//    }
//    return null;
//};


//{Shortname}BaseComponent.extendArray = function(obj, src) {
//    if (obj == undefined) {obj = []}
//    Array.prototype.push.apply(obj,src);
//    return obj;
//}
