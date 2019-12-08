var xtypes = [
    'gridcellbase',
    'booleancell',
    'gridcell',
    'checkcell',
    'datecell',
    'numbercell',
    'rownumberercell',
    'textcell',
    'treecell',
    'widgetcell',
    'celleditor',
    'booleancolumn',
    'checkcolumn',
    'gridcolumn',
    'column',
    'templatecolumn',
    'datecolumn',
    'dragcolumn',
    'numbercolumn',
    'rownumberer',
    'selectioncolumn',
    'textcolumn',
    'treecolumn',
    'grid',
    'headercontainer',
    'lockedgrid',
    'lockedgridregion',
    'gridcolumnsmenu',
    'gridgroupbythismenuitem',
    'gridshowingroupsmenuitem',
    'gridsortascmenuitem',
    'gridsortdescmenuitem',
    'pagingtoolbar',
    'gridrow',
    'rowbody',
    'roweditorbar',
    'roweditorcell',
    'roweditor',
    'roweditorgap',
    'rowheader',
    'gridsummaryrow',
    'tree'
]


var classes = [
    'Ext.data.TreeStore',
    'Ext.layout'
]

exports.getXtypes = () => {return xtypes};
exports.getCreates = () => {return require("../util").getCreatesForPackage(xtypes, classes)}
