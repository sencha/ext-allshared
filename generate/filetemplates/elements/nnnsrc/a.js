static assessChildren(meNode, parentNode) {
    //console.log('assessChildren')
    var s = meNode.s;
    //var children = meNode.children;
    //var parentNode = parentNode;

    var parentEWS = false
    //var parentCONNECTED = false
    meNode.s.CONNECTED = true
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
    if (meNode.parentNode.nodeNameNode.substring(0, 4) == 'EXT-') {
        parentEWS = true
        if (meNode.parentNode.s.CONNECTED == true) {
            //parentCONNECTED = true
        }
    }
    else {
        parentEWS = false
        //parentCONNECTED = true
    }
    console.log('***')
    console.log('parentEWS: ' + parentEWS)
    console.log('children: ' + meNode.children.length)
    //console.log('parentCONNECTED: ' + parentCONNECTED)
    console.log('EWSCHILDRENCOUNT: ' + meNode.s.EWSCHILDRENCOUNT)
    if (parentEWS == true) {
        console.log('parent EWSCHILDRENCOUNT: ' + meNode.parentNode.s.EWSCHILDRENCOUNT)
        console.log('parent EWSCHILDRENLEFT: ' + meNode.parentNode.s.EWSCHILDRENLEFT)
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
        if (meNode.parentNode.s.EWSCHILDREN == undefined) {
            meNode.parentNode.s.EWSCHILDREN = []
        }
        meNode.parentNode.s.EWSCHILDREN.push(this)
        meNode.parentNode.s.EWSCHILDRENLEFT--
        if (meNode.parentNode.s.EWSCHILDRENLEFT == 0) {
            console.log('TOP to BOTTOM')
            // console.log('this is the last child')
            // console.log('ready to go')
            // console.dir(this.parentNode)
            // console.dir(this.parentNode.children)
            // console.dir(this.parentNode.EWSCHILDREN)

            //var children = parentNode.children
            //var child = parentNode
            Common.addChildren(meNode.parentNode, meNode.parentNode.children, me)
            meNode.parentNode.dispatchEvent(new CustomEvent('ready',{detail:{cmp: meNode.parentNode.ext}}))

            // if (meNode.s.EWSCHILDRENCOUNT == 0) {
            //     console.log('remove')
            //     console.log(me)
            //     meNode.parentNode.remove(me)
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