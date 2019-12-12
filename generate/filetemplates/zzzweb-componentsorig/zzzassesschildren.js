assessChildren2() {
    var me = this;

    Ext.onReady(function () {





    var parentEWS = false
    var parentCONNECTED = false
    me.CONNECTED = true
    me.EWSCHILDRENCOUNT = 0

    for (var i = 0; i < me.children.length; i++) {
        if (me.children[i].nodeName.substring(0, 4) == 'EXT-') {
            me.EWSCHILDRENCOUNT++
        }
    }
    me.EWSCHILDRENLEFT = me.EWSCHILDRENCOUNT
    if (me.EWSCHILDREN != undefined) {
        me.EWSCHILDRENLEFT = me.EWSCHILDRENCOUNT - me.EWSCHILDREN.length
    }
    if (me.parentNode.nodeName.substring(0, 4) == 'EXT-') {
        parentEWS = true
        if (me.parentNode.CONNECTED == true) {
            parentCONNECTED = true
        }
    }
    else {
        parentEWS = false
        parentCONNECTED = true
    }
    // console.log('children: ' + me.children.length)
    // console.log('parentEWS: ' + parentEWS)
    // console.log('parentCONNECTED: ' + parentCONNECTED)
    // console.log('EWSCHILDRENCOUNT: ' + me.EWSCHILDRENCOUNT)
    // console.log('parent EWSCHILDRENCOUNT: ' + me.parentNode.EWSCHILDRENCOUNT)
    // console.log('EWSCHILDRENLEFT: ' + me.EWSCHILDRENLEFT)

    if (me.EWSCHILDRENCOUNT == 0) {
        var me = this;
        setTimeout(function(){
            me.dispatchEvent(new CustomEvent('ready',{detail:{cmp: me.ext}}))
        }, 0);
        //me.dispatchEvent(new CustomEvent('ready',{detail:{cmp: me.ext}}))
    }

    if (me.EWSCHILDREN == undefined) {
        if (me.EWSCHILDRENCOUNT != 0) {
            // console.log('no children defined yet')
        }
    }
    else {
        // console.log('EWSCHILDREN.length: ' + me.EWSCHILDREN.length)
    }

    if (parentEWS == true) {
        if (me.parentNode.EWSCHILDREN == undefined) {
            me.parentNode.EWSCHILDREN = []
        }
        me.parentNode.EWSCHILDREN.push(this)
        me.parentNode.EWSCHILDRENLEFT--
        if (me.parentNode.EWSCHILDRENLEFT == 0) {
            // console.log('TOP to BOTTOM')
            // console.log('this is the last child')
            // console.log('ready to go')
            // console.dir(me.parentNode)
            // console.dir(me.parentNode.children)
            // console.dir(me.parentNode.EWSCHILDREN)

            var children = me.parentNode.children
            var child = me.parentNode
            me.addChildren(child, children)
            me.parentNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: me.parentNode.ext}}))
        }
        else {
            // console.log('after EWSCHILDRENLEFT: ' + me.EWSCHILDRENLEFT)
        }
    }

    if(me.EWSCHILDREN == undefined) {me.EWSCHILDREN = []}

    if ((me.EWSCHILDRENCOUNT > 0 && me.EWSCHILDRENCOUNT == me.EWSCHILDREN.length) ||
        (me.children.length > 0 && me.EWSCHILDRENCOUNT == 0)) {
        var children = me.children
        var child = this
        // console.log('BOTTOM to TOP')
        // console.log('children were done first')
        // console.log('ready to go')
        // console.log(me.children)
        // console.log(me.EWSCHILDREN)

        // console.dir(me.children)
        // console.dir(child)
        me.addChildren(child, children)
        me.dispatchEvent(new CustomEvent('ready',{detail:{cmp: me.ext}}))
        //console.log(me.parentNode.EWSCHILDRENLEFT)
    }
    else {
        //console.log('after EWSCHILDREN.length: ' + me.EWSCHILDREN.length)
    }


    });



}