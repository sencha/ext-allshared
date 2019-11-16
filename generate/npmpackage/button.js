var xtypes = [
    'button'
]

var classes = [
]

exports.getXtypes = () => {return xtypes};
exports.getCreates = () => {return require("../util").getCreatesForPackage(xtypes, classes)}

//'segmentedbutton',
//'splitbutton'