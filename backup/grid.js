class ExtGrid extends HTMLElement {

    get title() {
        console.log('get title');
        var v = this.getAttribute('title');
        //console.log(v)
        return v;
    };
    set title(val) {
        console.log('set title')
        if (val) {
            this.setAttribute('title', val)
        } else {
            this.removeAttribute('title')
        }
    }

    get data() {
        //console.log('get data');
        var v = this.getAttribute('data');
        //console.log(v)
        return v;
    };
    set data(val) {
        //console.log('set')
        if (val) {
            this.setAttribute('data', val)
        } else {
            this.removeAttribute('data')
        }
    }


    get config() {
        //console.log('get config');
        var v = this.getAttribute('config');
        //console.log(v)
        return v;
    };
    set config(val) {
        //console.log('set')
        if (val) {
            this.setAttribute('config', val)
        } else {
            this.removeAttribute('config')
        }
    }

    get onready() {
        //console.log('get ready')
        return this.getAttribute('onready')
    };
    set onready(val) {
        //console.log('set ready')
        if (val) {
            this.setAttribute('onready', val)
        }
        else {
            this.removeAttribute('onready')
        }
    }


    static get observedAttributes() {return ['config', 'title', 'data']};


    connectedCallback() {
        console.log('connectedCallback-grid2')
        console.dir(this)
        console.log(this.attributes)
        console.log(this.attributes.length)
        console.log(this.attributes.getNamedItem('title'))
        //return

        var o = {
            "xtype": "grid",
            "title":"Grid with a single config",
            "height":"300px",
            "width": "500px",
            "columns": [
                {"text": "Name", "width": "100", "dataIndex": "name"},
                {"text": "Email Address", "flex": "1", "dataIndex": "email"},
                {"text": "Phone Number", "width": "150", "dataIndex": "phone"}
            ]
        }
        o.renderTo = this
        this.ext = Ext.create(o)

        var me = this;
        setTimeout(function(){
            me.dispatchEvent(new CustomEvent('ready',{detail:{cmp: me.ext}}))
        }, 0);



        // console.dir(this)
        // var a = this.getAttribute('config')
        // var b = this.attributes.getNamedItem('config')
        // console.log(a)
        // console.log(b)
        // //console.log(this.onready)
        // //console.log(this.config)
        // var o = JSON.parse(this.config)
        // o.xtype = 'grid'
        // console.dir(this)
        // o.renderTo = this
        // this.ext = Ext.create(o)
        // this.dispatchEvent(new CustomEvent('ready',{detail:{cmp: this.ext}}))
        // console.log('after dispatch')
    }


    attributeChangedCallback(attr, oldVal, newVal) {
        //console.log('attr: ' + attr)
        var method = 'set' + attr[0].toUpperCase() + attr.substring(1)
        //console.log(method)
        this.ext[method](newVal)

        // if (/^on/.test(attr)) {
        //     if (newVal) {
        //         console.log('newVal: ' + newVal)
        //         this.addEventListener('ready', function (event) {
        //             console.log('eventlistener')
        //             console.log(event)
        //             var functionString = newVal;
        //             // todo: error check for only 1 dot
        //             var r = functionString.split('.');
        //             console.log(r)
        //             console.log(window['mjg'])
        //             var obj = r[0];
        //             var func = r[1];
        //             if (obj && func) {
        //                 console.log(window[obj])
        //                 //window[obj][func](event);
        //                 window[obj](event);
        //             }
        //         });
        //     }
        // }
    }


}


window.customElements.define('ext-grid2', ExtGrid)
