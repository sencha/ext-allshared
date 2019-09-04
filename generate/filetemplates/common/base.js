
initMe() {
    console.log('');
    console.log('*** initMe for ' + this.getNode().nodeName);

    if (this._extitems != undefined) {
        this.rawChildren = this.childComponents;
    }
    else {
        this.ewcChildren = Array.prototype.slice.call(this.children);
        this.rawChildren = [];
        var num = 0;
        for (var i = 0; i < this.ewcChildren.length; i++) {
            if (this.ewcChildren[i].XTYPE != undefined) {
                this.rawChildren[num] = {};
                this.rawChildren[num] = this.ewcChildren[i];
                this.rawChildren[num].currentComponent = this.ewcChildren[i];
                this.rawChildren[num].node = this.ewcChildren[i];
                num++;
            }
        }
    }

    this.figureOutA();
    this.createProps(this.properties, this.propertiesobject, this.events, this.eventnames);
    this.createExtComponent();
    this.assessChildren(this.base, this.xtype);
    console.log('*** at end');
    console.log('this - ' + this.getNode().nodeName)
    console.dir(this.getNode().A);
    console.log('parent - ' + this.getParentNode().nodeName)
    if (this.getParentNode() != null) {
        console.dir(this.getParentNode().A);
    }
    else {
        console.log('No EXT parent');
    }
};
figureOutA() {
    var hasParent;
    if (this.getParentNode() == null) {
        hasParent = false;
    }
    else {
        if (this.getParentNode().nodeName.substring(0, 4) == 'EXT-') {
            hasParent = true
        }
        else {
            hasParent = false
        }
    }
    if (this.base.count == 0) {
        this.base.count++;
        if (hasParent == false) {
            this.base.DIRECTION = 'TopToBottom';
        }
        else {
            if (this.getParentNode().nodeName.substring(0, 4) == 'EXT-') {
                this.base.DIRECTION = 'BottomToTop';
            }
            else {
                this.base.DIRECTION = 'TopToBottom';
            }
        }
    }
    console.log(this.base.DIRECTION)

    if (hasParent) {
        if (this.getParentNode().A == undefined) {
            //console.log('parent not created');
            this.init(this.getParentNode(), this.parentNode);
        }
        else {
            //console.log('parent A IS created');
        }
    }

    if (this.getNode().A == undefined) {
        //console.log('no A');
        this.init(this.getNode(), this);
    }
    else {
        console.log('have A');
    }
}
init(component, node) {
    component.A = {};
    component.A.props = {};
    component.A.xtype = node.xtype;
    //component.A.ACURRENT = node.xtype;
    component.A.CHILDRENCOMPONENTS = [];
    component.A.CHILDRENCOMPONENTSCOUNT = 0;
    component.A.CHILDRENCOMPONENTSADDED = 0;
    if (this.base.DIRECTION == 'TopToBottom') {
        component.A.CHILDRENCOMPONENTS = component.rawChildren;
        for (var i = 0; i < component.A.CHILDRENCOMPONENTS.length; i++) {
            if (this.getNodeName(component.A.CHILDRENCOMPONENTS[i]).substring(0, 4) == 'EXT-') {
                component.A.CHILDRENCOMPONENTSCOUNT++;
            }
        }
        component.A.CHILDRENCOMPONENTSLEFT = component.A.CHILDRENCOMPONENTSCOUNT;
    }
}
createExtComponent() {
    var A =this.getNode().A
    if (A.props['viewport'] == true) {
        A.APARENT = '';
        //this.newDiv.remove()
        A.ext = Ext.create(A.props);
        console.log('0-Ext.application: ' + A.props.xtype);
        var me = this;
        Ext.application({
            name: 'MyEWCApp',
            launch: function () {
                Ext.Viewport.add([me.getNode().A.ext]);
                if (window['router']) {
                    window['router'].init();
                }

                console.log(me.base.DIRECTION + ' in launch ')
                if (me.base.DIRECTION == 'BottomToTop') {
                    console.log('the last thing to do...')
                }

            }
        });
    }
    else if (this.parentNode == null) {
        //A.APARENT = '';
        console.log('1- Ext.create: ' + this.getNode().nodeName + ' HTML parent: ' + this.getNode().nodeName);
        A.props.renderTo = this.newDiv;
        A.ext = Ext.create(A.props);
        //this.getParentNode().replaceChild(A.ext.el.dom, this.newDiv)
        //console.log('replace newDiv')
    }
    else {
        if (this.getParentNode().nodeName.substring(0, 4) != 'EXT-') {
            console.log('2- Ext.create: ' + this.getNode().nodeName + '  HTML parent: ' + this.getParentNode().nodeName);
            A.props.renderTo = this.newDiv; //this.A.newDiv; //me.shadowRoot;
            this.getNode().A.ext = Ext.create(A.props);
            //this.getParentNode().replaceChild(A.ext.el.dom, this.newDiv)
        }
        else {
            console.log('3- Ext.create: ' + this.getNode().nodeName + '  Ext parent: ' + this.getParentNode().nodeName);
            A.ext = Ext.create(A.props);
        }
    }
}
assessChildren(base, xtype) {
    var A =this.getNode().A
    console.log('assessChildren for: ' + xtype);
    if (this._extitems != undefined) {
        if (this._extitems.length == 1) {
            console.log('set html');
            A.ext.setHtml(this._extitem.nativeElement);
        }
    }
    if (this._extitems != undefined) {
        if (this._extroutes.length == 1) {
            console.log('set router');
            A.ext.setHtml(this._extroute.nativeElement);
            //childItem.childCmp = Ext.create({xtype:'widget', ewc:item.getAttribute('ewc'), element:Ext.get(item.parentNode.removeChild(item))})
        }
    }
    if (A.CHILDRENCOMPONENTSCOUNT == 0 &&
        A.CHILDRENCOMPONENTSLEFT == 0 &&
        A.CHILDRENCOMPONENTSADDED == 0 &&
        this.getParentNode() == null) {
        console.log('Solo');
        console.log('ready event for ' + this.getNode().nodeName)
        this.sendReadyEvent(this);
    }
    else if (A.CHILDRENCOMPONENTSADDED > 0) {
        console.log('addChildren');
        console.dir(A.CHILDRENCOMPONENTS);
        this.addChildren(this, A.CHILDRENCOMPONENTS);
        //console.log('send ready for CHILDRENCOMPONENTSADDED > 0');
        console.log('ready event for ' + this.getNode().nodeName)
        this.sendReadyEvent(this);
        this.node.remove();
    }
    // else if (this.parentNode != null && this.A.CHILDRENCOMPONENTSCOUNT == 0) {
    //     console.log('send ready for ' + this.A.xtype);
    //     this.sendReadyEvent(this);
    // }
    if (this.getParentNode() != null) {
        if (base.DIRECTION == 'TopToBottom') {
            console.log('TopToBottom');
            this.getParentNode().A.CHILDRENCOMPONENTS.push(this);
            this.getParentNode().A.CHILDRENCOMPONENTSADDED++;
            this.getParentNode().A.CHILDRENCOMPONENTSLEFT--;
            if (this.getParentNode().A.CHILDRENCOMPONENTSLEFT == 0) {
                this.addChildren(this.getParentNode(), this.getParentNode().A.CHILDRENCOMPONENTS);
                console.log('ready event for ' + this.getParentNode().nodeName + '(parent)')
                this.sendReadyEvent(this.getParentNode());
            }
        }
        else {
            this.getParentNode().A.CHILDRENCOMPONENTS.push(this.getNode());
            this.getParentNode().A.CHILDRENCOMPONENTSADDED++;
            console.log('ready event for ' + this.getNode().nodeName)
            this.sendReadyEvent(this);
        }
    }
}
addChildren(child, children) {
    //console.log('addChildren for ' + child.xtype + ' - num children: ' + children.length);
    //for (var i = children.length - 1; i > -1; i--) {
    //    var childItem = { parentCmp: {}, childCmp: {} };
    //    childItem.parentCmp = child.getNode().A.ext;
    //    childItem.childCmp = children[i].A.ext;
    //    this.addTheChild(childItem.parentCmp, childItem.childCmp, null);
    //}
    for (var i = 0; i < children.length; i++) {
        var childItem = { parentCmp: {}, childCmp: {} };
        childItem.parentCmp = child.getNode().A.ext;
        childItem.childCmp = children[i].A.ext;
        this.addTheChild(childItem.parentCmp, childItem.childCmp, null);
    }
}
addTheChild(parentCmp, childCmp, location) {
    var parentxtype = parentCmp.xtype;
    var childxtype = childCmp.xtype;
    //console.log('addTheChild: ' + parentxtype + '(' + parentCmp.ext + ')' + ' - ' + childxtype + '(' + childCmp.ext + ')');
    //if (childxtype == 'widget')
    if (this.getNode().A.ext.initialConfig.align != undefined) {
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
getNode() {
    if (this._extitems != undefined) {
        return this.node
    }
    else {
        return this
    }
}
getParentNode() {
    if (this._extitems != undefined) {
        if (this.parentNode == null) {
            return null
        }
        return this.parentNode.node;
    }
    else {
        return this.parentNode;
    }
}
getNodeName(component) {
    if (this._extitems != undefined) {
        return component.node.nodeName
    }
    else {
        return component.nodeName
    }
}
sendReadyEvent(component) {
    var cmp = component.getNode().A.ext
    if (component._extitems != undefined) {
        component['ready'].emit({ detail: { cmp: cmp } });
    }
    else {
        component.dispatchEvent(new CustomEvent('ready', { detail: { cmp: cmp } }));
    }
}

