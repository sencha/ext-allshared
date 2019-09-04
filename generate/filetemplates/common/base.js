

createRawChildren() {
    if (this.isAngular) {
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
}

atEnd() {
    console.log('*** at end');
    console.log('this - ' + this.currentElName)
    console.dir(this.currentEl.A);
    if (this.parentEl != null) {
        console.log('parent - ' + this.parentElName)
        console.dir(this.parentEl.A);
    }
    else {
        console.log('No EXT parent');
    }
}

initMe() {
    console.log('');
    console.log('*** initMe for ' + this.currentElName);

    this.createRawChildren()
    this.setHasParent();
    this.setDirection()
    this.figureOutA();
    this.createProps(this.properties, this.propertiesobject, this.events, this.eventnames);
    this.createExtComponent();
    this.assessChildren(this.base, this.xtype);
    this.atEnd();
    if (this.last == true){
        console.log('this is the end...')
    }
};

setHasParent() {
    var hasParent;
    if (this.parentEl == null) {
        this.hasParent = false;
    }
    else {
        if (this.parentElName.substring(0, 4) == 'EXT-') {
            this.hasParent = true
        }
        else {
            this.hasParent = false
        }
    }
    //return hasParent
}

setDirection() {
    if (this.base.count == 0) {
        this.base.count++;
        if (this.hasParent == false) {
            this.base.DIRECTION = 'TopToBottom';
        }
        else {
            if (this.parentElName.substring(0, 4) == 'EXT-') {
                this.base.DIRECTION = 'BottomToTop';
            }
            else {
                this.base.DIRECTION = 'TopToBottom';
            }
        }
    }
    console.log(this.base.DIRECTION)
}

figureOutA() {

    if (this.hasParent && this.parentEl.A == undefined) {
        this.init(this.parentEl, this.parentNode);
    }
    if (this.currentEl.A == undefined) {
        this.init(this.currentEl, this);
    }

    // if (hasParent) {
    //     if (this.parentEl.A == undefined) {
    //         //console.log('parent not created');
    //         this.init(this.parentEl, this.parentNode);
    //     }
    //     else {
    //         //console.log('parent A IS created');
    //     }
    // }

    // if (this.currentEl.A == undefined) {
    //     //console.log('no A');
    //     this.init(this.currentEl, this);
    // }
    // else {
    //     console.log('have A');
    // }
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
        component.A.CHILDRENCOMPONENTS = node.rawChildren;
        for (var i = 0; i < component.A.CHILDRENCOMPONENTS.length; i++) {
            if (this.getCurrentElName(component.A.CHILDRENCOMPONENTS[i]).substring(0, 4) == 'EXT-') {
                component.A.CHILDRENCOMPONENTSCOUNT++;
            }
        }
        component.A.CHILDRENCOMPONENTSLEFT = component.A.CHILDRENCOMPONENTSCOUNT;
    }
}
createExtComponent() {
    var A =this.currentEl.A
    if (A.props['viewport'] == true) {
        //A.APARENT = '';
        //this.newDiv.remove()
        A.ext = Ext.create(A.props);
        console.log('0-Ext.application: ' + A.props.xtype);
        var me = this;
        Ext.application({
            name: 'MyEWCApp',
            launch: function () {
                Ext.Viewport.add([me.currentEl.A.ext]);
                if (window['router']) {
                    window['router'].init();
                }

                console.log(me.base.DIRECTION + ' in launch ')
                if (me.base.DIRECTION == 'BottomToTop') {
                    console.log('the last thing to do...')
                    me.last = true
                }

            }
        });
    }
    else if (this.parentNode == null) {
        //A.APARENT = '';
        console.log('1- Ext.create: ' + this.currentElName + ' HTML parent: ' + this.currentElName);
        A.props.renderTo = this.newDiv;
        A.ext = Ext.create(A.props);
        //this.parentEl.replaceChild(A.ext.el.dom, this.newDiv)
        //console.log('replace newDiv')
    }
    else {
        if (this.parentElName.substring(0, 4) != 'EXT-') {
            console.log('2- Ext.create: ' + this.currentElName + '  HTML parent: ' + this.parentElName);
            A.props.renderTo = this.newDiv; //this.A.newDiv; //me.shadowRoot;
            this.currentEl.A.ext = Ext.create(A.props);
            //this.parentEl.replaceChild(A.ext.el.dom, this.newDiv)
        }
        else {
            console.log('3- Ext.create: ' + this.currentElName + '  Ext parent: ' + this.parentElName);
            A.ext = Ext.create(A.props);
        }
    }
}
assessChildren(base, xtype) {
    var A =this.currentEl.A
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
        this.parentEl == null) {
        console.log('Solo');
        console.log('ready event for ' + this.currentElName)
        this.sendReadyEvent(this);
    }
    else if (A.CHILDRENCOMPONENTSADDED > 0) {
        console.log('addChildren');
        console.dir(A.CHILDRENCOMPONENTS);
        this.addChildren(this, A.CHILDRENCOMPONENTS);
        //console.log('send ready for CHILDRENCOMPONENTSADDED > 0');
        console.log('ready event for ' + this.currentElName)
        this.sendReadyEvent(this);
        this.node.remove();
    }
    // else if (this.parentNode != null && this.A.CHILDRENCOMPONENTSCOUNT == 0) {
    //     console.log('send ready for ' + this.A.xtype);
    //     this.sendReadyEvent(this);
    // }
    if (this.parentEl != null) {
        if (base.DIRECTION == 'TopToBottom') {
            console.log('TopToBottom');
            this.parentEl.A.CHILDRENCOMPONENTS.push(this);
            this.parentEl.A.CHILDRENCOMPONENTSADDED++;
            this.parentEl.A.CHILDRENCOMPONENTSLEFT--;
            if (this.parentEl.A.CHILDRENCOMPONENTSLEFT == 0) {
                this.addChildren(this.parentEl, this.parentEl.A.CHILDRENCOMPONENTS);
                console.log('ready event for ' + this.parentElName + '(parent)')
                this.sendReadyEvent(this.parentEl);
            }
        }
        else {
            this.parentEl.A.CHILDRENCOMPONENTS.push(this.currentEl);
            this.parentEl.A.CHILDRENCOMPONENTSADDED++;
            console.log('ready event for ' + this.currentElName)
            this.sendReadyEvent(this);
        }
    }
}
addChildren(child, children) {
    //console.log('addChildren for ' + child.xtype + ' - num children: ' + children.length);
    //for (var i = children.length - 1; i > -1; i--) {
    //    var childItem = { parentCmp: {}, childCmp: {} };
    //    childItem.parentCmp = child.currentEl.A.ext;
    //    childItem.childCmp = children[i].A.ext;
    //    this.addTheChild(childItem.parentCmp, childItem.childCmp, null);
    //}
    for (var i = 0; i < children.length; i++) {
        var childItem = { parentCmp: {}, childCmp: {} };
        childItem.parentCmp = child.currentEl.A.ext;
        childItem.childCmp = children[i].A.ext;
        this.addTheChild(childItem.parentCmp, childItem.childCmp, null);
    }
}
addTheChild(parentCmp, childCmp, location) {
    var parentxtype = parentCmp.xtype;
    var childxtype = childCmp.xtype;
    //console.log('addTheChild: ' + parentxtype + '(' + parentCmp.ext + ')' + ' - ' + childxtype + '(' + childCmp.ext + ')');
    //if (childxtype == 'widget')
    if (this.currentEl.A.ext.initialConfig.align != undefined) {
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
// currentEl {
//     if (this._extitems != undefined) {
//         return this.node
//     }
//     else {
//         return this
//     }
// }

get currentEl() {
    if (this._extitems != undefined) {
        return this.node
    }
    else {
        return this
    }
}

getCurrentElName(component) {
    if (component._extitems != undefined) {
        return component.node.nodeName
    }
    else {
        return component.nodeName
    }
}



get currentElName() {
    if (this._extitems != undefined) {
        return this.node.nodeName
    }
    else {
        return this.nodeName
    }
}

get isAngular() {
    if (this._extitems != undefined) {
        return true
    }
    else {
        return false
    }
}

get parentEl() {
    if (this.isAngular) {
        if (this.parentNode == null) {
            return null
        }
        return this.parentNode.node;
    }
    else {
        return this.parentNode;
    }
}

get parentElName() {
    if (this.isAngular) {
        if (this.parentNode == null) {
            return null
        }
        return this.parentNode.node.nodeName;
    }
    else {
        return this.parentNode.nodeName;
    }
}


// parentEl {
//     if (this._extitems != undefined) {
//         if (this.parentNode == null) {
//             return null
//         }
//         return this.parentNode.node;
//     }
//     else {
//         return this.parentNode;
//     }
// }

// getNodeName(component) {
//     if (this._extitems != undefined) {
//         return component.node.nodeName
//     }
//     else {
//         return component.nodeName
//     }
// }

sendReadyEvent(component) {
    var cmp = component.currentEl.A.ext
    if (component._extitems != undefined) {
        component['ready'].emit({ detail: { cmp: cmp } });
    }
    else {
        component.dispatchEvent(new CustomEvent('ready', { detail: { cmp: cmp } }));
    }
}

