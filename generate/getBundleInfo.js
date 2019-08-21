exports.getBundleInfo = (framework, type) => {

    if (type == undefined) {
        return -1
    }
console.log('here')
    var examplesSource = './filetemplates/' + framework + '/examples/' + type + '.js';
    var info = {};
    switch(type) {
        case 'all':
            info.wantedxtypes = [
                'all'
            ];
            break;
        case 'button':
            info.wantedxtypes = [
                'button'
            ];
            break;
        case 'panel':
            info.wantedxtypes = [
                'panel'
            ];
            break;
        case 'grid':
            info.wantedxtypes = [
                'grid',
                'column'
            ];
            break;
        case 'gridall':
            info.wantedxtypes = [
                'grid',
                'column',
                'panel'
            ];
            break;
        default:
            console.log('not a valid bundle: ' + type)
            return -1;
    }

    info.type = type;
    info.now = new Date().toString();
    info.Bundle = type.charAt(0).toUpperCase() + type.slice(1);
    info.bundle = '-' + type

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
        info.imports = info.imports + `import {Ext${W}Component} from\n  '@sencha/ext-angular-${type}/esm5/src/ext-${w}.component';\n`
    }

    const angular = require(examplesSource).angular;
    info.angular = {}
    info.angular.module = angular('module', info)
    info.angular.component = angular('component', info)

    return info;
  }