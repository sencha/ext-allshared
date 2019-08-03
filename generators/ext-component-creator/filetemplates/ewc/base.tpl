export default class {classname} extends HTMLElement {
//events
{sEVENTGETSET}//configs
{sGETSET}
static XTYPE() {return '{xtype}'}
static PROPERTIESOBJECT() { return {
{sPROPERTIESOBJECT}}}
static EVENTS() { return [
{sEVENTS}]}
static METHODS() { return [
{sMETHODS}]}

    static get observedAttributes() {
        var attrs = []
        for (var property in {classname}.PROPERTIESOBJECT()) {
            attrs.push(property)
        }
        {classname}.EVENTS().forEach(function (eventparameter, index, array) {
            attrs.push('on' + eventparameter.name)
        })
        attrs.push('on' + 'ready')
        return attrs
    }

    constructor() {
        super (
            {classname}.METHODS(),
            {classname}.XTYPE(),
            {classname}.PROPERTIESOBJECT(),
            {classname}.EVENTS()
        )
        this.XTYPE = {classname}.XTYPE()
        this.PROPERTIESOBJECT = this.extendObject(this.PROPERTIESOBJECT, {classname}.PROPERTIESOBJECT());
        this.METHODS = this.extendArray(this.METHODS, {classname}.METHODS());
        this.EVENTS = this.extendArray(this.EVENTS, {classname}.EVENTS());
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

    connectedCallback() {
        if (this.extChildren == undefined) {
            this.extChildren = [];
            this.extChildrenDefined = false;
            this.childrenYetToBeDefined = 0;
            for (let i = 0; i < this.children.length; i++) {
                console.dir(this.children[i])
                if (this.children[i].nodeName.substring(0, 4) == "EXT-") {
                    this.childrenYetToBeDefined++
                }
            }
        }
        else {
            this.extChildrenDefined = true;
            this.childrenYetToBeDefined = 0;
        }
        this.nodeParentName = this.parentNode.nodeName;
        if (this.parentNode['ext'] == undefined) {
            this.extParentDefined = false;
        }
        else {
            this.extParentDefined = true;
        }
        this.rawChildren = Array.from(this.children)

        if (this.extChildrenDefined == false && this.children.length > 0) {
            this.childrenCounter = this.children.length
        }

        var parentCmp;
        var childCmp;

        this.props = {};
        this.props.xtype = this.XTYPE;

        if (this.props.xtype == 'column' || this.props.xtype == 'gridcolumn') {
            var renderer = this.getAttribute('renderer')
            if (renderer != undefined) {
                this.props.cell = this.cell || {}
                this.props.cell.xtype = 'renderercell'
                console.log(renderer)
                this.props.cell.renderer = renderer
            }
        }

        //mjg fitToParent not working??
        if (true === this.fitToParent) {
            this.props.top=0,
            this.props.left=0,
            this.props.width='100%',
            this.props.height='100%'
        }

        for (var property in this.PROPERTIESOBJECT) {
            if (this.getAttribute(property) !== null) {
                if (property == 'handler') {
                    var functionString = this.getAttribute(property);
                    //error check for only 1 dot
                    var r = functionString.split('.');
                    var obj = r[0];
                    var func = r[1];
                    this.props[property] = window[obj][func];
                }
                else {
                    this.props[property] = this.filterProperty(this.getAttribute(property));
                }
            }
        }

        this.props.listeners = {}

        // for (var i = 0; i < this.attributes.length; i++) {
        //     var attr = this.attributes.item(i).nodeName;

        //     if (/^on/.test(attr)) {
        //     //if (/^on/.test(attr) && attr!='onitemdisclosure') {
        //         var name = attr.slice(2);
        //         var result = this.EVENTS.filter(obj => {return obj.name === name});
        //         this.setEvent(result[0],this.props,this)
        //     }
        // }

        var me = this;
        this.EVENTS.forEach(function (eventparameter, index, array) {
            me.setEvent(eventparameter,me.props,me)
        })

        //mjg this should not be hard-coded to APP-ROOT or root
        if (this.nodeParentName == 'APP-ROOT' || this.parentElement.id == 'root') {
            //this.props.renderTo = this.parentNode
            //this.doCreate()
            var me = this
            me.doCreate()

            var elem = document.getElementById('theGrid');
            //elem.parentNode.removeChild(elem);

            console.log('Ext.application')
            Ext.application({
                name: 'MyEWCApp',
                launch: function () {
                    console.log('Ext.Viewport.add(' + me.ext.xtype + ')')
                    Ext.Viewport.add([me.ext])
                }
            });
        }
        else if (this.nodeParentName == 'BODY') {
            var me = this
            me.doCreate()
            //console.log('Ext.application')

            //var elem = document.getElementById('theGrid');
            //elem.parentNode.removeChild(elem);

            Ext.application({
                name: 'MyEWCApp',
                launch: function () {
                    //console.log('Ext.Viewport.add(' + me.ext.xtype + ')')
                    Ext.Viewport.add([me.ext])
                    if (window.router) {
                        //console.log('router.init called')
                        window.router.init();
                    }
                }
            });
        }
        else if (this.nodeParentName.substring(0, 4) != 'EXT-') {
            this.props.renderTo = this
            this.doCreate()
        }
        else {
            this.doCreate()

            //mjgComment console.log('deal with this item to attach to parent')
            //if extParentDefined is true, then this child to parent
            //if extParentDefined is false, add this child to the extChildren array of the parent
            if (this.extParentDefined == true) {
                parentCmp = this.parentNode['ext'];
                childCmp = this.ext;
                var location = null

                // console.log(parentCmp.xtype)
                // console.log('this.parentNode.rawChildren')
                // console.dir(this.parentNode)
                // console.dir(this.parentNode.rawChildren)

                for (var i = 0; i < this.parentNode.rawChildren.length; i++) {
                    var item = this.parentNode.rawChildren[i]
                    if (item.props == this.props) {
                    location = i
                    }
                }
                this.addTheChild(parentCmp, childCmp, location)
            }
            else {
                if (this.parentNode.extChildren == undefined) {
                    //mjgComment console.log('created the extChildren array')
                    this.parentNode.extChildren = []
                }

                //this.parentNode.children2 = this.parentNode.children
                //for (var i = 0; i < this.parentNode.children.length; i++) {

                for (var i = this.parentNode.children.length-1; i > -1; i--) {
                    var item = this.parentNode.children[i]
                    if (item.nodeName.substring(0, 4) == "EXT-") {
                        if (item.props == this.props) {
                            //mjgComment console.log(`added the child item.nodeName} to extChildren array of this.parentNode.nodeName}`)
                            this.parentNode.extChildren.push({ADDORDER:i,XTYPE:item.XTYPE,EXT:this.ext})
                        }
                    }
                    else {
                        var par = item.parentNode
                        var cln = par.removeChild(item);
                        var el = Ext.get(cln);
                        //console.log('Ext.create(' + 'widget' + ')')
                        var ext = Ext.create({xtype:'widget', element:el})
                        this.parentNode.extChildren.push({ADDORDER:i,XTYPE:'widget',EXT:ext})
                    }
                }
            }
        }

        //deal with children

        //mjgComment console.log(`deal with this item's this.children.length} extChildren`)
        //mjg figure out how to make this 1 loop so items added in order

        for (var i = 0; i < this.extChildren.length; i++) {
            var item = this.extChildren[i]
            //mjgComment console.log(`item i} ext child`)
            var parentCmp = this.ext;
            var childCmp = item.EXT;
            var location = item.ADDORDER
            this.addTheChild(parentCmp, childCmp, location)
        }
        //console.log('children')
        //console.dir(this.rawChildren)
        //for (var i = 0; i < this.children.length; i++) {
        for (var i = this.rawChildren.length-1; i > -1; i--) {
            var item = this.rawChildren[i]
            if (item.nodeName.substring(0, 4) != "EXT-") {
            //mjgComment console.log(`item i} NON ext child`)
        //        var cln = item.cloneNode(true);
            //var cln = this.parentNode.removeChild(item);
            var par = item.parentNode
            var cln = par.removeChild(item);
            var el = Ext.get(cln);
            this.ext.insert(i,{xtype:'widget', element:el});
            }
        }

        if ( this.extChildrenDefined == true  ||
            (this.extChildrenDefined == false && (this.children.length == 0 || this.children.length == 1))
            ) {
            this.dispatchEvent(new CustomEvent('ready',{detail:{cmp: this.ext}}))
        }
    }

    doCreate() {
        this.ext = Ext.create(this.props)

        //console.log('Ext.create(' + this.ext.xtype + ')')
        //console.dir(this.props)
        //console.dir(this.ext)

        if (this.parentNode.childrenCounter != undefined) {
            this.parentNode.childrenCounter--
            if (this.parentNode.childrenCounter == 0) {
            //console.log(`ready event for this.parentNode.nodeName}`)
            //this.parentNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: this.parentNode.ext}}))
            }
        }
    }

    addTheChild(parentCmp, childCmp, location) {
        var parentxtype = parentCmp.xtype
        var childxtype = childCmp.xtype
        //console.log('addTheChild')
        //console.log('childrenYetToBeDefined(before) '  + this.parentNode.childrenYetToBeDefined)
        //console.log('parent: ' + parentxtype)
        //console.log('child: ' + childxtype)

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
            case 'gridcolumn':
            case 'column':
            case 'treecolumn':
            case 'textcolumn':
            case 'checkcolumn':
            case 'datecolumn':
            case 'rownumberer':
            case 'numbercolumn':
            case 'booleancolumn':
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
            console.log(parentxtype + '.add(' + childxtype + ')')
            parentCmp.add(childCmp)
        }

        if (this.parentNode.childrenYetToBeDefined > 0) {
            this.parentNode.childrenYetToBeDefined--
        }
        //console.log('childrenYetToBeDefined(after) '  + this.parentNode.childrenYetToBeDefined)
        if (this.parentNode.childrenYetToBeDefined == 0) {
            this.parentNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: this.parentNode.ext}}))
        }
        return



        if (parentxtype === 'column' || childxtype === 'renderercell') {
            parentCmp.setCell(childCmp)
        }

        else if (parentCmp.xtype == 'column' && childCmp.xtype == 'column') {
            parentCmp.add(childCmp)
        }

        else if (parentCmp.xtype == 'gridcolumn' && childCmp.xtype == 'gridcolumn') {
            parentCmp.add(childCmp)
        }

        else if (parentxtype === 'grid' || parentxtype === 'lockedgrid') {
            if (childxtype === 'gridcolumn' || childxtype === 'column' || childxtype === 'treecolumn' || childxtype === 'textcolumn' || childxtype === 'checkcolumn' || childxtype === 'datecolumn' || childxtype === 'rownumberer' || childxtype === 'numbercolumn' || childxtype === 'booleancolumn' ) {
            if(location == null) {

                parentCmp.addColumn(childCmp)
                // //console.log(`parentCmp.xtype}.addColumn(childCmp.xtype})`)

                // if (this.parentNode.childrenYetToBeDefined > 0) {
                //     this.parentNode.childrenYetToBeDefined--
                // }
                // console.log('childrenYetToBeDefined(after) '  + this.parentNode.childrenYetToBeDefined)
                // if (this.parentNode.childrenYetToBeDefined == 0) {
                //     this.parentNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: this.parentNode.ext}}))
                // }


        //        return
            }
            else {
                var regCols = 0;
                if(parentCmp.registeredColumns != undefined) {
                    regCols = parentCmp.registeredColumns.length;
                }
                parentCmp.insertColumn(location + regCols, childCmp)

                // if (this.parentNode.childrenYetToBeDefined > 0) {
                //     this.parentNode.childrenYetToBeDefined--
                // }
                // console.log('childrenYetToBeDefined(after) '  + this.parentNode.childrenYetToBeDefined)
                // if (this.parentNode.childrenYetToBeDefined == 0) {
                //     this.parentNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: this.parentNode.ext}}))
                // }




                //console.log(`parentCmp.xtype}.insertColumn(location}, childCmp.xtype})`)
                //return
            }
            }
            else if ((childxtype === 'toolbar' || childxtype === 'titlebar') && parentCmp.getHideHeaders != undefined) {
                if (parentCmp.getHideHeaders() === false) {
                    parentCmp.insert(1, childCmp);
            //          console.log('**')
            //        return
                }
                else {
                    parentCmp.add(childCmp);
            //          console.log('**')
            //        return
                }
            }
            else {
                console.log('unhandled else in addTheChild')
                //console.log(parentxtype)
                //console.log(childxtype)
            }
        }
        else if (childxtype === 'tooltip') {
            parentCmp.setTooltip(childCmp)
        //      console.log('**')
            //return
        }
        else if (childxtype === 'plugin') {
            parentCmp.setPlugin(childCmp)
        //      console.log('**')
            //return
        }
        else if (parentxtype === 'button') {
            if (childxtype === 'menu') {
            parentCmp.setMenu(childCmp)
        //        console.log('**')
            //return
            }
            else {
                console.log('child not added')
                console.log(childCmp)
                console.log(parentCmp)
            }
        }
        else if (childxtype === 'toolbar' && Ext.isClassic === true) {
            parentCmp.addDockedItems(childCmp)
            //console.log('**')
            //return
        }
        else if ((childxtype === 'toolbar' || childxtype === 'titlebar') && parentCmp.getHideHeaders != undefined) {
            if (parentCmp.getHideHeaders() === false) {
            parentCmp.insert(1, childCmp)
        //        console.log('**')
            //return
            }
            else {
                parentCmp.add(childCmp)
        //        console.log(`parentCmp.xtype}.add(childCmp.xtype})`)
            //return
            }
        }
        else if (parentCmp.add != undefined) {

            if(location == null) {
                parentCmp.add(childCmp)
        //          console.log(`parentCmp.xtype}.add(childCmp.xtype})`)
                //return
            }
            else {
                parentCmp.insert(location, childCmp)
                //mjgComment console.log(`parentCmp.xtype}.insert(location}, childCmp.xtype})`)
                //return
            }
        }
        else {
            console.log('child not added')
            console.log(childCmp)
            console.log(parentCmp)
        }


        if (this.parentNode.childrenYetToBeDefined > 0) {
            this.parentNode.childrenYetToBeDefined--
        }
        console.log('childrenYetToBeDefined(after) '  + this.parentNode.childrenYetToBeDefined)
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
            if (this.ext === undefined) {
                //mjg ??
            }
            else {
                //mjg check if this method exists for this component
                var method = 'set' + attr[0].toUpperCase() + attr.substring(1)
                this.ext[method](newVal)
            }
        }
    }

    disconnectedCallback() {
        //console.log('ExtBase disconnectedCallback ' + this.ext.xtype)
        delete this.ext
    }

}