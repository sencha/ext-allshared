export default class Common {

    static createProps(me, xtype, properties, events) {
        me.props = {};
        me.props.xtype = xtype; //me.XTYPE;
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
        for (var property in properties) { //me.PROPERTIESOBJECT
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

        //me.EVENTS
        events.forEach(function (eventparameter, index, array) {
            me.setEvent(eventparameter,me.props,me)
        })
    }

    static createExtComponent(me) {
        //console.log('createExtComponent')
        if (me.props['viewport'] == true) {
            me.newDiv.remove()
            me.ext = Ext.create(me.props)
            console.log('Ext.application for ' + me.props.xtype + '(' + me.props.ewc + ')')
            Ext.application({
                name: 'MyEWCApp',
                launch: function () {
                    Ext.Viewport.add([me.ext])
                    if (window.router) {window.router.init();}
                }
            });
        }
        else if (me.parentNode.nodeName.substring(0, 4) != 'EXT-') {
            console.log('parent of: ' + me.nodeName + ' is ' + me.parentNode.nodeName)
            me.props.renderTo = me.newDiv; //me.shadowRoot;
            me.ext = Ext.create(me.props)
            me.parentNode.replaceChild(me.ext.el.dom, me.newDiv)
        }
        else {
            console.log('parent of: ' + me.nodeName + ' is ' +'EXT')
            me.newDiv.remove()
            me.ext = Ext.create(me.props)
        }
    }

    static assessChildren(meNode, parentNode, me) {
        //console.log('assessChildren')
        var s = meNode.s;
        //var children = meNode.children;
        //var parentNode = parentNode;

        var parentEWS = false
        if (parentNode.nodeName.substring(0, 4) == 'EXT-') {
            parentEWS = true
            if (parentNode.s.CONNECTED == true) {
                //parentCONNECTED = true
            }
        }
        else {
            parentEWS = false
            //parentCONNECTED = true
        }


        //var parentCONNECTED = false
        //meNode.s.CONNECTED = true
        meNode.s.EWSCHILDRENCOUNT = 0

        for (var i = 0; i < meNode.children.length; i++) {
            if (meNode.children[i].nodeNameNode.substring(0, 4) == 'EXT-') {
                meNode.s.EWSCHILDRENCOUNT++
            }
        }
        meNode.s.EWSCHILDRENLEFT = meNode.s.EWSCHILDRENCOUNT
        if (meNode.s.EWSCHILDREN != undefined) {
            meNode.s.EWSCHILDRENLEFT = meNode.s.EWSCHILDRENCOUNT - meNode.s.EWSCHILDREN.length
        }

        console.log('***')
        console.log('parentEWS: ' + parentEWS)
        console.log('children: ' + meNode.children.length)
        //console.log('parentCONNECTED: ' + parentCONNECTED)
        console.log('EWSCHILDRENCOUNT: ' + meNode.s.EWSCHILDRENCOUNT)


        if (parentEWS == true) {
            console.log('parent EWSCHILDRENCOUNT: ' + parentNode.s.EWSCHILDRENCOUNT)
            console.log('parent EWSCHILDRENLEFT: ' + parentNode.s.EWSCHILDRENLEFT)
        }
        console.log('EWSCHILDRENLEFT: ' + meNode.s.EWSCHILDRENLEFT)
        console.log('***')

        if (meNode.s.EWSCHILDRENCOUNT == 0) {
            //var me = this;
            //setTimeout(function(){
            meNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: meNode.ext}}))
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
            if (parentNode.s.EWSCHILDRENLEFT == 0) {
                console.log('TOP to BOTTOM')
                // console.log('this is the last child')
                // console.log('ready to go')
                // console.dir(this.parentNode)
                // console.dir(this.parentNode.children)
                // console.dir(this.parentNode.EWSCHILDREN)

                //var children = parentNode.children
                //var child = parentNode
                Common.addChildren(parentNode, parentNode.children, me)
                parentNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: parentNode.ext}}))

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
            meNode.addChildren(me, meNode.children, me)
            meNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: meNode.ext}}))
            //console.log(this.parentNode.EWSCHILDRENLEFT)
        }
        else {
            //console.log('after EWSCHILDREN.length: ' + this.EWSCHILDREN.length)
        }
    }

    static addChildren(child, children, me) {
        console.log('addChildren')
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
                childItem.childCmp = Ext.create({xtype:'widget', ext:item.getAttribute('ext'), element:Ext.get(item.parentNode.removeChild(item))})
                childItems.push(childItem)
            }
        }
        for (var i = childItems.length-1; i > -1; i--) {
            var childItem = childItems[i]
            Common.addTheChild(childItem.parentCmp, childItem.childCmp, me)
        }
    }

    static addTheChild(parentCmp, childCmp, me, location) {
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

}