export default class ExtBase extends HTMLElement {

  constructor() {
    super()
  }

  connectedCallback() {
    if (this.extChildren == undefined) {
      this.extChildren = [];
      this.extChildrenDefined = false;
    }
    else {
      this.extChildrenDefined = true;
    }
    this.nodeParentName = this.parentNode.nodeName;
    if (this.parentNode['ext'] == undefined) {
      this.extParentDefined = false;
    }
    else {
      this.extParentDefined = true;
    }
    console.dir(`connectedCallback: ${this.nodeName} parent: ${this.nodeParentName} extParentDefined: ${this.extParentDefined} extChildrenDefined: ${this.extChildrenDefined}`)

    var parentCmp;
    var childCmp;
    var removeItems = [];

    this.props = {};
    this.props.xtype = this.XTYPE;
    //mjg fitToParent not working
    if (true === this.fitToParent) {
      this.props.top=0, 
      this.props.left=0, 
      this.props.width='100%', 
      this.props.height='100%'
    }
    for (var property in this.PROPERTIESOBJECT) {
      if (this.PROPERTIESOBJECT.hasOwnProperty(property)) {
        if(this.getAttribute(property) !== null) {
          try {
            this.props[property] = JSON.parse(this[property])
          }
          catch(e) {
            this.props[property] =  this[property]
          }
        }
      }
    }
    this.props.listeners = {}
    var me = this
    this.EVENTS.forEach(function (eventparameter, index, array) {
      me.setEvent(eventparameter,me.props,me)
    })

    //mjg this should not be hard-coded to APP-ROOT
    if (this.nodeParentName == 'APP-ROOT') {
      this.props.renderTo = this.parentNode
      this.doCreate()
    }
    else if (this.nodeParentName == 'BODY') {
      var me = this
      me.doCreate()
      Ext.application({
        name: 'MyExtWCApp',
        launch: function () {
          Ext.Viewport.add([me.ext])
        }
      });
    }
    else if(this.nodeParentName.substring(0, 3) != 'EXT') {
      this.props.renderTo = this.parentNode
      this.doCreate()
    }
    else {
      this.doCreate()


      console.log('deal with this item to attach to parent')
      //if extParentDefined is true, then this child to parent
      //if extParentDefined is false, add this child to the extChildren array of the parent
      if(this.extParentDefined == true) {
        parentCmp = this.parentNode['ext'];
        childCmp = this.ext;
        var location = null
        for (var i = 0; i < this.parentNode.children.length; i++) {
          var item = this.parentNode.children[i]
          if (item.props == this.props) {
            location = i
          }
        }
        this.addTheChild(parentCmp, childCmp, location)
      }
      else {
        if (this.parentNode.extChildren == undefined) {
          console.log('created the extChildren array')
          this.parentNode.extChildren = []
        }
        for (var i = 0; i < this.parentNode.children.length; i++) {
          var item = this.parentNode.children[i]
          if (item.nodeName.substring(0, 3) == "EXT") {
            if (item.props == this.props) {
              console.log(`added the child ${item.nodeName} to extChildren array of ${this.parentNode.nodeName}`)
              // console.log(this.ext)
              this.parentNode.extChildren.push({ADDORDER:i,XTYPE:item.XTYPE,EXT:this.ext})
            }
          }
          else {
            var cln = item.cloneNode(true);
            var el = Ext.get(cln);
            var ext = Ext.create({xtype:'widget', element:el})
            this.parentNode.extChildren.push({ADDORDER:i,XTYPE:'widget',EXT:ext})
            item.style.display = 'none';
            removeItems.push(item)
          }
        }
      }


      for (let item of removeItems) {
        item.remove(); 
      }
    }

    console.log(`deal with this item's ${this.children.length} extChildren`)
    console.dir(this.extChildren)

    for (var i = 0; i < this.extChildren.length; i++) {
      var item = this.extChildren[i]
        console.log(`item ${i} ext child`)
        var parentCmp = this.ext;
        var childCmp = item.EXT;
        var location = item.ADDORDER
        this.addTheChild(parentCmp, childCmp, location)
    }

    for (var i = 0; i < this.children.length; i++) {
      var item = this.children[i]

      if (item.nodeName.substring(0, 3) != "EXT") {
        console.log(`item ${i} NON ext child`)
        var cln = item.cloneNode(true);
        var el = Ext.get(cln);
        //elItems.push({i:i,el:el});
        //if (this.extParentDefined == true) {
          this.ext.insert(i,{xtype:'widget', element:el});
        //}
    //     else {
    // //          console.log('in else')
    //       var ext = Ext.create({xtype:'widget', element:el})
    // //          console.dir(this.extChildren)
    //       this.extChildren.push({ADDORDER:i,XTYPE:'widget',EXT:ext})
    //     }
        item.style.display = 'none';
        removeItems.push(item)
      }
    }
  }

  doCreate() {
    var me = this;
    me.ext = Ext.create(me.props)
    if (me.props.ariaLabel == 'mjg') {
      console.log(`Ext.create(${me.props.xtype}) ${me.props.html} `)
     }
    me.dispatchEvent(new CustomEvent('ready',{detail:{cmp: me.ext}}))
//     if (me.extChildren.length != 0) {
//       var parentCmp = me.ext;
//       for (var i = 0; i < me.extChildren.length; i++) {
//         for (var j = 0; j < me.extChildren.length; j++) {
//           if (i == me.extChildren[j].ADDORDER) {
//             var childCmp =  me.extChildren[j].EXT;
//             var location = me.extChildren[j].ADDORDER;
// //            console.log(`${childCmp.xtype}.insert(${location}, ${childCmp.xtype})`)
//             me.addTheChild(parentCmp,childCmp, location);
//           }
//         }
//       }
//     }
  }

  addTheChild(parentCmp, childCmp, location) {
    //console.log('addTheChild')
    //console.log(childCmp.xtype)
    //console.log(parentCmp.xtype)
//    if (me.props.ariaLabel == 'mjg') {



    // if(parentCmp.config.ariaLabel == 'mjg') {
    //   console.log('addTheChild parent:' +  parentCmp.xtype + ' child:' + childCmp.xtype)
    // }


    var childxtype = childCmp.xtype
    var parentxtype = parentCmp.xtype

    if (this.ext.initialConfig.align != undefined) {
      if (parentxtype != 'titlebar' && parentxtype != 'grid' && parentxtype != 'button') {
        console.error('Can only use align property if parent is a Titlebar or Grid or Button')
        return
      }
    }
    if (parentxtype === 'grid' || parentxtype === 'lockedgrid') {
      if (childxtype === 'column' || childxtype === 'treecolumn' || childxtype === 'textcolumn' || childxtype === 'checkcolumn' || childxtype === 'datecolumn' || childxtype === 'rownumberer' || childxtype === 'numbercolumn' || childxtype === 'booleancolumn' ) {
        parentCmp.addColumn(childCmp)
//        console.log(`${parentCmp.xtype}.addColumn(${childCmp.xtype})`)
        return
      }
      else if ((childxtype === 'toolbar' || childxtype === 'titlebar') && parentCmp.getHideHeaders != undefined) {
        if (parentCmp.getHideHeaders() === false) {
          parentCmp.insert(1, childCmp);
//          console.log('**')
          return
        }
        else {
          parentCmp.add(childCmp);
//          console.log('**')
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
//      console.log('**')
      return
    } 
    if (childxtype === 'plugin') {
      parentCmp.setPlugin(childCmp)
//      console.log('**')
      return
    } 
    else if (parentxtype === 'button') {
      if (childxtype === 'menu') {
        parentCmp.setMenu(childCmp)
//        console.log('**')
        return
      } else {
        console.log('child not added')
        console.log(childCmp)
        console.log(parentCmp)
      }
    } 
    if (childxtype === 'toolbar' && Ext.isClassic === true) {
      parentCmp.addDockedItems(childCmp)
      //console.log('**')
      return
    } 
    else if ((childxtype === 'toolbar' || childxtype === 'titlebar') && parentCmp.getHideHeaders != undefined) {
      if (parentCmp.getHideHeaders() === false) {
        parentCmp.insert(1, childCmp)
//        console.log('**')
        return
      } else {
        parentCmp.add(childCmp)
//        console.log(`${parentCmp.xtype}.add(${childCmp.xtype})`)
        return
      }
    } 
      if (parentCmp.add != undefined) {

        if(location == null) {
          parentCmp.add(childCmp)
//          console.log(`${parentCmp.xtype}.add(${childCmp.xtype})`)
          return
        }
        else {
          parentCmp.insert(location, childCmp)
          console.log(`${parentCmp.xtype}.insert(${location}, ${childCmp.xtype})`)
          return
        }
    }
    console.log('child not added')
    console.log(childCmp)
    console.log(parentCmp)
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (/^on/.test(attr)) {
      if (newVal) {
//mjg check if this event exists for this component
        this.addEventListener(attr.slice(2), function() {eval(newVal)});
      } else {
        //delete this[attr];
        //this.removeEventListener(attr.slice(2), this);
      }
    } else {
      if (this.ext === undefined) {
      }
      else {
//mjg check if this method exists for this component
        var method = 'set' + attr[0].toUpperCase() + attr.substring(1)
        this.ext[method](newVal)
      }
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

  static get observedAttributes() {
    var attrs = []
    for (var property in this.PROPERTIESOBJECT()) {
      attrs.push(property)
    }
    this.EVENTS().forEach(function (eventparameter, index, array) {
      attrs.push('on'+eventparameter.name)
    })
    return attrs
  }

  disconnectedCallback() {
    //console.log('ExtBase disconnectedCallback ' + this.ext.xtype)
    delete this.ext
  }
}






//     for (var i = 0; i < this.children.length; i++) {
//       var item = this.children[i]
// //      console.dir(item)
//       if (item.nodeName.substring(0, 3) != "EXT") {
//         var cln = item.cloneNode(true);
//         var el = Ext.get(cln);
//         //elItems.push({i:i,el:el});
//         if (this.extParentDefined == true) {
//           this.ext.insert(i,{xtype:'widget', element:el});
//         }
//         else {
// //          console.log('in else')
//           var ext = Ext.create({xtype:'widget', element:el})
// //          console.dir(this.extChildren)
//           this.extChildren.push({ADDORDER:i,XTYPE:'widget',EXT:ext})
//         }
//         item.style.display = 'none';
//         removeItems.push(item)
//       }
//       else {
//         console.log('add')
//         console.dir(this)
//         var parentCmp = this.ext;
//         var childCmp = item.ext;

//         this.addTheChild(parentCmp, childCmp, location)
//       }

//     }
    //Array.prototype.push.apply(this.extChildren,this.extArray);

//    console.log('this.extChildren')
    // console.log(this.nodeName)
//    console.dir(this.extChildren)










// for (var i = 0; i < this.children.length; i++) {
//   var item = this.children[i]





// //      console.dir(item)
//   if (item.nodeName.substring(0, 3) != "EXT") {
//     console.log('Adding a non ext child')
//     var cln = item.cloneNode(true);
//     var el = Ext.get(cln);
//     //elItems.push({i:i,el:el});
//     if (this.extParentDefined == true) {
//       this.ext.insert(i,{xtype:'widget', element:el});
//     }
//     else {
// //          console.log('in else')
//       var ext = Ext.create({xtype:'widget', element:el})
// //          console.dir(this.extChildren)
//       this.extChildren.push({ADDORDER:i,XTYPE:'widget',EXT:ext})
//     }
//     item.style.display = 'none';
//     removeItems.push(item)
//   }
//   else {
//     console.log(`item ${i} Adding an ext child`)
//     for (var i = 0; i < this.children.length; i++) {
//       var item = this.children[i]
//       //      console.dir(item)
//       if (item.nodeName.substring(0, 3) != "EXT") {
//         var cln = item.cloneNode(true);
//         var el = Ext.get(cln);
//         //elItems.push({i:i,el:el});
//         if (this.extParentDefined == true) {
//           this.ext.insert(i,{xtype:'widget', element:el});
//         }
//         else {
//           //          console.log('in else')
//           var ext = Ext.create({xtype:'widget', element:el})
//           //          console.dir(this.extChildren)
//           this.extChildren.push({ADDORDER:i,XTYPE:'widget',EXT:ext})
//         }
//         item.style.display = 'none';
//         removeItems.push(item)
//       }
//   else {
//     console.log('add')
//     console.dir(this.ext)
//     var parentCmp = this.ext;
//     var childCmp = item.ext;
//     this.addTheChild(parentCmp, childCmp, location)
//   }
// }
//     var parentCmp = this.ext;
//     var childCmp = item.ext;
//     this.addTheChild(parentCmp, childCmp, location)
//   }
// }
