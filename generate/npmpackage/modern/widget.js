var xtypes = [
    'widget'
]

var classes = [
]

exports.getXtypes = () => {return xtypes};
exports.getCreates = () => {return require("../util").getCreatesForPackage(xtypes, classes)}
