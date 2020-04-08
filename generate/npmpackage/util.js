
exports.getCreatesForPackage = (xtypes, classes) => {
    var creates = ''
    var i;
    for (i = 0; i < xtypes.length; i++) {
        creates += 'Ext.create({"xtype":"' + xtypes[i] + '"});' + '\n';
    }
    for (i = 0; i < classes.length; i++) {
        creates += 'Ext.require("' + classes[i] + '",{});' + '\n';
    }
    return creates;
}
