window.addEventListener('initialconfigsEvent', function(e) {
    //    console.log('in viewconfigsEvent')
        var initialconfigs = document.getElementById('initialconfigs');
        initialconfigs.data = e.detail.configs;
    });


window.addEventListener('viewconfigsEvent', function(e) {
//    console.log('in viewconfigsEvent')
    var viewconfigs = document.getElementById('viewconfigs');
    viewconfigs.data = e.detail.configs;
});

window.addEventListener('ultimateEvent', function(e) {
//    console.log('in ultimateEvent')
    var ultimateconfigs = document.getElementById('ultimateconfigs');
//    console.dir(e.detail.configs)
    ultimateconfigs.data = e.detail.configs;
});

window.addEventListener('allEvent', function(e) {
        var allconfigs = document.getElementById('allconfigs');
        allconfigs.data = e.detail.configs;
    });

window.addEventListener('xtypeEvent', function(e) {
    document.getElementById("xtype").innerHTML = e.detail.xtype;
});

window.addEventListener('supersEvent', function(e) {
    var supers = document.getElementById('supers');
    supers.data = e.detail.supers;
});


window.addEventListener('configsEvent', function(e) {

    var pe = document.getElementById('pe');
    // var a = [
    //     {"className": "text", "field": "element", "value": "title1", "hint": "hint"},
    //     {"className": "text", "field": "element", "value": "title2", "hint": "hint"},
    //     {"className": "text", "field": "element", "value": "title3", "hint": "hint"}
    // ]
    pe.data = e.detail.configs;



    // var store = Ext.create('Ext.data.Store', {
    //     autoLoad: true,
    //     proxy: {
    //         type: 'memory',
    //         data: e.detail.configs
    //     },
    // });
    //app.listCmp.setStore(store);
});

