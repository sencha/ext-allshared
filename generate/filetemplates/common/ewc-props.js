//******* props start */
createProps(properties, propertiesobject, events, eventnames) {
    var o = {};
    o.xtype = this.currentEl.A.xtype;
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
    for (var i = 0; i < properties.length; i++) {
        var property = properties[i]
        //console.log(property)
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
    this.events.forEach(function (eventparameter, index, array) {
        me2.setEvent(eventparameter,o,me2)
    })

    this.currentEl.A.props = o
    //return o;
}
//******* props end */
