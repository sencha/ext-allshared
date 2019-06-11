
function getDocs(xtype) {
    var docs = [];

    var Xtype = xtype.charAt(0).toUpperCase() + xtype.slice(1);
    Xtype = 'Grid' //hard coded for testing
    var componentClass = eval('Ext' + Xtype + 'Def')

    //console.dir(componentClass)
    //console.dir(componentClass.properties)

    var o = {}
    for (var property in componentClass.properties) {
        var prop = componentClass.properties[property];
        //console.log('propertyName: ' + property + ' propertyType: ' +  prop[0] + ' numberOfTypes: ' + prop.length + '  allTypes: ' +  prop.toString())
        o = {}
        o.name = property;
        o.type = prop[0];
        o.num = prop.length;
        o.types = prop.toString();
        docs.push(o);


        // var types = obj.properties[configName]
        // var type
        // if (types != null) {
        //     type = types[0].toString()
        // }
        // else {
        //     type = "undefined"
        // }
    }


    return docs;
}