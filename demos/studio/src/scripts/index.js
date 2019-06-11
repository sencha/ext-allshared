const vscode = acquireVsCodeApi();
var prevElement;
var currentElementSelected;

var supers = [];
var configurators = [];
var allconfigs = [];
var initialconfigs = [];
var ultimate = [];

Ext.on("viewportready", function() {

    var viewport = document.getElementById("ext-viewport");
    document.getElementById('content').appendChild(viewport);
    viewport.style.boxShadow = "0 0 5px 5px rgba(0, 0, 0, 0.4)"

    Split({
        columnGutters: [
            {track: 1, element: document.querySelector('.split1')},
            {track: 3, element: document.querySelector('.split2')}
        ]
    })

    setTimeout(function() {
        var bodyEl = document.getElementsByClassName("x-viewport-body-el");
        var rootId = bodyEl[0].childNodes[0].id;
        var o = Ext.getCmp(rootId);
        window.o = o;
        var c = Ext.getClass(o)

        for (var property in c.$config.values) {
            var set = 'no'
            if (c.$config.values.hasOwnProperty(property)) {
                set = 'yes'
            }
            var value = ''
            if (c.$config.values[property] != undefined) {
                if (typeof c.$config.values[property] == "string") {
                    value = c.$config.values[property];
                }
                else {
                    try {
                    value = JSON.stringify(c.$config.values[property])
                    }
                    catch(e) {
                        value = ''
                    }
                }
            }
            
            o = { configName: property, value1: value, set: set}
            initialconfigs.push(o)
        }

        initialconfigs.sort((a,b) => (a.configName > b.configName) ? 1 : ((b.configName > a.configName) ? -1 : 0)); 
        window.dispatchEvent(new CustomEvent('initialconfigsEvent', {detail:{configs:initialconfigs}}));

        const viewconfigs = initialconfigs.filter(element => element.set == 'yes');
        window.dispatchEvent(new CustomEvent('viewconfigsEvent', {detail:{configs:viewconfigs}}));

        // function getChildren(o, parentId, parentObject) {
        //     var rootItem = {a1_id: o.id, a2_class: c, a3_cmp: o, a4_class_$config_values: c.$config.values, a5_class_listeners: c.listeners, a9_xtype: o.xtype, parentId: parentId, a4_config: o.config, a5_initialConfig: o.initialConfig, a6_children: []};
        //     if (o.items != undefined) {
        //         o.items.items.forEach(function (currentValue,index,arr) {
        //             getChildren(currentValue, o.id, rootItem.a6_children)
        //         })
        //     }
        //     parentObject.push(rootItem)
        // }

        // var rootArray = [];
        // getChildren(o, '', rootArray);
        // console.dir('rootArray');
        // console.dir(rootArray);


    }, 1000);




});