var _ = require('lodash');
exports.getBundleInfo = (framework, type, Items) => {

    var examplesSource = './filetemplates/' + framework + '/examples/' + type + '.js';
    var info = {};
    var rows = [];
    info.wantedxtypes = []
    info.wantedextended = []


    var theFunction = null
    switch(type) {
        case 'all':
            theFunction = function(o) {
                return o
            }
            break;
        case 'button':
            theFunction = function(o) {
                if (   o.xtype == 'button'
                ) {return o}
            }
            break;
        case 'panel':
            theFunction = function(o) {
                if (   o.xtype == 'panel'
                ) {return o}
            }
            break;
        case 'grid':
            theFunction = function(o) {
                if (   o.name.toLowerCase().includes('ext.grid')
                ) {return o}
            }
            break;
        case 'gridall':
            theFunction = function(o) {
                if (   o.xtype == 'd3'
                    || o.xtype == 'pivot'
                    || o.xtype == 'calendar'
                ) {return o}
            }
            break;
        default:
            console.log('not a valid bundle: ' + type)
            return -1;
    }
    //console.log(Items)
    rows = _.map(Items, theFunction);
    rows = _.without(rows, undefined)
    var uniquerows = _.uniqBy(rows, 'xtype');
    var count = 0
    _.forEach(uniquerows, function(row){
        //console.log(row)
        info.wantedextended.push(row.extended)
        info.wantedextended.push(row.name)
        info.wantedxtypes.push(row.xtype)
        //console.log(row.xtype)
        count++
    })
    //console.log('type: ' + type)
    //console.log(info.wantedxtypes)
    //console.log(count + ' xtypes')

    info.type = type;
    info.now = new Date().toString();
    info.Bundle = type.charAt(0).toUpperCase() + type.slice(1);
//same thing
    info.bundle = '-' + type
    info.name = info.bundle.substring(1)

    info.folder = '../../GeneratedFolders/ext-' + framework + info.bundle + '/ext';

    info.imports = ''
    info.declarations = ''
    info.elements = ''
    info.manifest = ''
    for (var i = 0; i < info.wantedxtypes.length; i++) {
        var w = info.wantedxtypes[i]
        //console.log(info.wantedxtypes[i]);
        var W = w.charAt(0).toUpperCase() + w.slice(1);

        info.manifest = info.manifest + `{"xtype":"${w}"},\n`
        info.elements = info.elements + `&lt;ext-${w}&gt;&lt;/\ext-${w}&gt;\n\n`
        info.declarations = info.declarations + `    Ext${W}Component,\n`
        info.importsxng = info.imports + `import {Ext${W}Component} from\n  '@sencha/ext-angular-${info.type}/esm5/src/ext-${w}.component';\n`
        info.importsewc = info.imports + `import '@sencha/ext-web-components-${info.type}/lib/ext-${w}.component';\n`
    }

    const angular = require(examplesSource).angular;
    info.angular = {}
    info.angular.module = angular('module', info)
    info.angular.component = angular('component', info)

    return info;
  }