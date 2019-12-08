var xtypes = [
]


var classes = [
    'Ext.Evented'
]

exports.getXtypes = () => {return xtypes};
exports.getCreates = () => {return require("../util").getCreatesForPackage(xtypes, classes)}
