var xtypes = [
    'button',
    'segmentedbutton',
    'splitbutton'
]

var classes = [
]

exports.getXtypes = () => {return xtypes};
exports.getCreates = () => {return require("../util").getCreatesForPackage(xtypes, classes)}
