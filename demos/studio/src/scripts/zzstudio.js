var prevElement;
var currentElementSelected;


var supers = [];
var configurators = [];
var allconfigs = [];
var initialconfigs = [];
var ultimate = [];

Ext.on("viewportready", function() {
    var viewport = document.getElementById("ext-viewport");
    document.getElementById('main').appendChild(viewport);

    setTimeout(function() {
        var bodyEl = document.getElementsByClassName("x-viewport-body-el");
         var rootId = bodyEl[0].childNodes[0].id;
        var o = Ext.getCmp(rootId);
        var c = Ext.getClass(o)

        for (var property in c.$config.values) {
            var set = 'no'
            if (c.$config.values.hasOwnProperty(property)) {
                set = 'yes'
            }
            var value = ''
            if (c.$config.values[property] != undefined) {
                //value = c.$config.values[property].toString()
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


        function getChildren(o, parentId, parentObject) {
            var rootItem = {a1_id: o.id, a2_class: c, a3_cmp: o, a4_class_$config_values: c.$config.values, a5_class_listeners: c.listeners, a9_xtype: o.xtype, parentId: parentId, a4_config: o.config, a5_initialConfig: o.initialConfig, a6_children: []};
            if (o.items != undefined) {
                o.items.items.forEach(function (currentValue,index,arr) {
                    getChildren(currentValue, o.id, rootItem.a6_children)
                })
            }
            parentObject.push(rootItem)
        }

        var rootArray = [];
        getChildren(o, '', rootArray);
        console.dir('rootArray');
        console.dir(rootArray);


    }, 1000);


}); //viewportready

    // var headerHeight = 50;
    // var footerHeight = 50;
    // var leftsideWidth = 250;
    // var rightsideWidth = 250;
    // var paddingMain = 10;

    // var w; w = leftsideWidth + rightsideWidth + paddingMain + paddingMain;
    // var h; h = headerHeight + footerHeight + paddingMain + paddingMain;
    // var t; t = headerHeight + paddingMain;
    // var l; l = leftsideWidth + paddingMain;
    // viewport.style.width = `calc(100% - ${w}px)`;
    // viewport.style.height = `calc(100% - ${h}px)`;
    // viewport.style.top = `${t}px`;
    // viewport.style.left = `${l}px`;