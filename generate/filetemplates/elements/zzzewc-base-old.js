
    adjustNodes(children) {
        this.A = {}
        console.dir(this)
        this.A.childComponents = [];
        var num = 0
        for (var i = 0; i < children.length; i++) {
            if (children[i].XTYPE != undefined) {
                this.A.childComponents[num] = {};
                this.A.childComponents[num] = children[i];
                this.A.childComponents[num].currentComponent = children[i];
                this.A.childComponents[num].node = children[i];
                num++;
            }
        }
    }

    createProps(xtype, properties, events) {
        var o = {};
        o.xtype = xtype;
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

        return o;
    }

    createExtComponent() {
        if (this.A.props['viewport'] == true) {
            this.A.HASEXTPARENT = false
            this.A.APARENT = ''
            //this.newDiv.remove()
            this.A.ext = Ext.create(this.A.props)
            console.log('0-Ext.application: ' + this.A.props.xtype)
            var me = this
            Ext.application({
                name: 'MyEWCApp',
                launch: function () {
                    Ext.Viewport.add([me.A.ext])
                    if (window.router) {window.router.init();}
                }
            });
        }
        else if (this.parentNode == undefined) {
            this.A.HASEXTPARENT = false
            this.A.APARENT = ''
            console.log('1- Ext.create: ' + this.node.nodeName + ' parent: ' + this.node.nodeName)
            this.A.props.renderTo = this; //this.A.newDiv; //this.shadowRoot;
            this.A.ext = Ext.create(this.A.props)
            //this.node.parentNode.replaceChild(this.A.ext.el.dom, this.A.newDiv)
            //console.log('replace newDiv')
        }
        else if (this.parentNode.nodeName.substring(0, 4) != 'EXT-') {
            this.A.HASEXTPARENT = false
            this.A.APARENT = ''
            console.log('2- Ext.create: ' + this.node.nodeName + '  parent: ' + this.parentNode.nodeName)
            this.A.props.renderTo = this; //this.A.newDiv; //this.shadowRoot;
            this.A.ext = Ext.create(this.A.props)
            //this.node.parentNode.replaceChild(this.A.ext.el.dom, this.A.newDiv)
        }
         else {
            this.A.HASEXTPARENT = true
            this.A.APARENT = this.parentNode.nodeName
            console.log('3- Ext.create ' + this.nodeName + ' parent: ' + this.parentNode.nodeName)
            this.A.ext = Ext.create(this.A.props)
        }
    }

    createA(base) {
        if (base.count == 0) {
            base.count++
            if (this.A.HASEXTPARENT == false) {
                base.DIRECTION = 'TopToBottom'
            }
            else {
                base.DIRECTION = 'BottomToTop'
            }
        }

        this.A.ACURRENT = this.XTYPE
        this.A.CHILDRENNODES = []
        this.A.CHILDRENCOMPONENTSCOUNT = 0
        this.A.CHILDRENCOMPONENTS = this.A.childComponents //this.A.childComponents

        for (var i = 0; i < this.A.CHILDRENCOMPONENTS.length; i++) {
            if (this.A.CHILDRENCOMPONENTS[i].node.nodeName.substring(0, 4) == 'EXT-') {
                this.A.CHILDRENCOMPONENTSCOUNT++
            }
        }
        this.A.CHILDRENCOMPONENTSLEFT = this.A.CHILDRENCOMPONENTSCOUNT
        this.A.CHILDRENCOMPONENTSADDED = 0
    }

    assessChildren(base) {
        console.log('assessChildren for: ' + this.XTYPE)

        if (this._extitems != undefined) {
            if (this._extitems.length == 1) {
                //if (this._hostComponent != null) {
                //mjg console.log('item')
                console.log('set html')
                this.A.ext.setHtml(this._extitem.nativeElement)
                //}
            }
        }
        if (this._extitems != undefined) {
            if (this._extroutes.length == 1) {
                console.log('set router')
                this.A.ext.setHtml(this._extroute.nativeElement)
                //childItem.childCmp = Ext.create({xtype:'widget', ewc:item.getAttribute('ewc'), element:Ext.get(item.parentNode.removeChild(item))})
            }
        }

        if (this.A.CHILDRENCOMPONENTSCOUNT == 0 &&
            this.A.CHILDRENCOMPONENTSLEFT == 0 &&
            this.A.CHILDRENCOMPONENTSADDED == 0 &&
            this.parentNode == null) {
            console.log('Solo')
            this.sendReadyEvent(this)
        }
        else if (this.A.CHILDRENCOMPONENTSADDED > 0) {
            console.log('addChildren')
            this.addChildren(this, this.A.CHILDRENCOMPONENTS)
            console.log('send ready')
            this.sendReadyEvent(this)
        }
        else if ( this.parentComponent != null && currentComponent.A.CHILDRENCOMPONENTSCOUNT == 0) {
            console.log('send ready 2')
            this.sendReadyEvent(this)
        }

        if (this.A.HASEXTPARENT == true) {
            if (base.DIRECTION == 'TopToBottom') {
                console.log('TopToBottom')
                this.parentNode.A.CHILDRENNODES.push(this)
                this.parentNode.A.CHILDRENCOMPONENTSADDED++
                this.parentNode.A.CHILDRENCOMPONENTSLEFT--
                if (this.parentNode.A.CHILDRENCOMPONENTSLEFT == 0) {
                    this.addChildren(this.parentNode, this.parentNode.A.CHILDRENCOMPONENTS)
                    console.log('send ready to parent')
                    this.sendReadyEvent(this.parentNode)
                }
            }
            else {
                //mjg console.log('BottomToTop')
                //this.parentNode.A.CHILDRENNODES.push(this)
                //this.parentNode.A.CHILDRENCOMPONENTSADDED++
                //this.parentNode.A.CHILDRENCOMPONENTSLEFT--
            }
        }
    }

    addChildren(child, children) {
        console.log('addChildren for ' + child.A.ACURRENT + ' - num children: ' + children.length)
        for (var i = children.length - 1; i > -1; i--) {
            var childItem = {parentCmp: {}, childCmp: {}}
            childItem.parentCmp = child.A.ext
            childItem.childCmp = children[i].A.ext
            this.addTheChild(childItem.parentCmp, childItem.childCmp)
        }
    }

    addTheChild(parentCmp, childCmp, location) {
        var parentxtype = parentCmp.xtype
        var childxtype = childCmp.xtype
        console.log('addTheChild: ' + parentxtype + '(' + parentCmp.ext + ')' + ' - ' + childxtype + '(' + childCmp.ext + ')')
        //if (childxtype == 'widget')
        if (this.A.ext.initialConfig.align != undefined) {
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

        // if (this.parentNode.childrenYetToBeDefined > 0) {
        //     this.parentNode.childrenYetToBeDefined--
        // }
        // //console.log('childrenYetToBeDefined(after) '  + this.parentNode.childrenYetToBeDefined)
        // if (this.parentNode.childrenYetToBeDefined == 0) {
        //     this.parentNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: this.parentNode.ext}}))
        // }
    }

    sendReadyEvent(component) {
        console.log("send ready for ")
        console.dir(component)
        if (component._extitems != undefined) {
            component['ready'].emit({detail: {cmp: component.node.ext}});
         }
         else {
            component.dispatchEvent(new CustomEvent('ready',{detail:{cmp: component.A.ext}}));
         }
    }
