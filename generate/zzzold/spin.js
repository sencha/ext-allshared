const data = require(`./AllClassesFiles/modern-all-classes-flatten.json`)

for (i = 0; i < data.global.items.length; i++) {
    var processIt = shouldProcessIt(item)

    if (processIt == true) {
        
    }

}

function shouldProcessIt(o) {
    var processIt = false

    if (o.extended == undefined) {
        //console.log(o.name + ' not a widget')
        processIt = false;
    }
    else {
        var n = o.extended.indexOf("Ext.Widget");
        if (n != -1) {
            processIt = true;
        }
        else {
            //console.log(o.name + ' not a decendant of Ext.Widget')
            processIt = false;
        }
    }
    if (o.name == 'Ext.Widget') {
        processIt = true
    }
    if (o.name == 'Ext.Evented') {
        processIt = true
    }
    if (o.name == 'Ext.Base') {
        processIt = true
    }
    if (o.items == undefined) {
        //console.log(o.name + ' has no items')
        processIt = false
    }
    return processIt
}