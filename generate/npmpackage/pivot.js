var xtypes = [
    'pivotgridcell',
    'pivotgridgroupcell',
    'pivotd3container',
    'pivotheatmap',
    'pivottreemap',
    'pivotgrid',
    'pivotconfigfield',
    'pivotconfigcontainer',
    'pivotconfigform',
    'pivotconfigpanel',
    'pivotsettings',
    'pivotrangeeditor',
    'pivotgridrow',
]

var classes = [
]

exports.getXtypes = () => {return xtypes};
exports.getCreates = () => {return require("../util").getCreatesForPackage(xtypes, classes)}
