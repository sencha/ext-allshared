const fs = require('fs');
const path = require('path');
const components = {};
const byClassName = {};
const { capitalize } = require('lodash');
const generateComments = 'no'

const words = [
    'split',
    'button',
    'calendar',
    'view',
    'field',
    'data',
    'table',
    'color',
    'picker',
    'slider',
    'tree',
    'grid',
    'cell',
    'column',
    'value',
    'record',
    'manager',
    'edit',
    'header',
    'map',
    'tab',
    'iframe',
    'panel',
    'bar',
    'tip',
    'spacer',
    'text',
    'widget',
    'selector',
    'separator',
    'list',
    'menu',
    'progress',
    'pivot',
    'pie',
    'box',
    'bullet',
    'item',
    'fill',
    'saturation',
    'select',
    'hue',
    'alpha',
    'line',
    'discrete',
    'heat',
    'area',
    'upload',
    'component',
    'check',
    'item',
    'container',
    'config',
    'row',
    'cell',
    'range',
    'group',
    'title',
    'slot',
    'tool',
    'trigger',
    'native',
    'toolbar',
    'tristate',
    'preview',
    'up',
    'add',
    'end',
    'click',
    'front',
    'hide',
    'hidden',
    'max',
    'min',
    'show',
    'scrollable',
    'top',
    'left',
    'right',
    'bottom',
    'width',
    'height',
    'item',
    'active',
    'disabled',
    'docked',
    'centered',
    'expand',
    'collapse',
    'pick',
    'tap',
    'node',
    'update',
    'direction',
    'total',
    'cell',
    'double',
    'hold',
    'sort',
    'remove',
    'touch',
    'start',
    'submit',
    'move',
    'insert',
    'complete',
    'dbl',
    'store',
    'built',
    'model',
    'exception',
    'done',
    'leave',
    'enter',
    'mouse',
    'key',
    'down',
    'body',
    'exit',
    'resize',
    'action',
    'success',
    'failed',
    'validity',
    'error',
    'sync',
    'sort',
    'load',
    'drag',
    'drop',
    'over',
    'setup',
    'event',
    'ready',
    'key',
    'query',
    'cls',
    'layout',
    'activate',
    'animation',
    'cancel',
    'swipe', 
    'single',
    'pressed',
    'request',
    'before',
    'after',
    'property',
    'long',
    'create',
    'push',
    'prefetch',
    'sprite',
    'group',
    'extender',
    'change',
    'stop',
    'remove',
    'context',
    'reconfigure',
    'deselect',
    'arrow',
    'center',
    'render',
    'group',
    'restore',
    'save',
    'out',
    'toggle',
    'state',
    'destroy',
    'icon',
    'refresh',
    'close',
    'open',
    'legend',
    'deactivate',
    'indicator',
    'numberer',
    'orientation',
    'disclose',
    'disclosure',
    'interaction',
    'build',
    'rebuild',
    'reload'
].sort((a, b) => a.length - b.length);

const replacements = [
    { find: /^ux/i, replace: 'UX' },
    { find: /^tb/i, replace: 'TB' },
    { find: /d3/gi, replace: 'D3' },
    { find: /mz/gi, replace: 'MZ' },
    { find: /svg/gi, replace: 'SVG' },
    { find: /^url/gi, replace: 'URL' },
    { find: /itemappend/gi, replace: 'ItemAppend' },
    { find: /tofront/gi, replace: 'ToFront' },
    { find: /beforestore/gi, replace: 'BeforeStore' }
];

const strings = new Set();

function camelize(str) {
    str = str.split(/-/).map(capitalize).join('_');

    for (let word of words) {
        str = str.replace(new RegExp(word, 'gi'), capitalize(word));
    }

    for (let replacement of replacements) {
        str = str.replace(replacement.find, replacement.replace);
    }

    strings.add(str);

    return str;
}

function typeFor(doxiType) {
    if (!doxiType) return 'any';

    return Array.from(new Set(doxiType.split(/\//).map(type => {
        if (type.indexOf('Ext.') === 0) {
            return byClassName[type] || 'any'
        } else if (type.match(/^(string|number|boolean)(\[\])?$/i)) {
            return type.toLowerCase();
        } else if (type === 'HTMLElement') {
            return 'HTMLElement';
        } else if (['integer', 'decimal', 'float'].indexOf(type.toLowerCase()) !== -1) {
            return 'number';
        } else if (['integer[]', 'decimal[]', 'float[]'].indexOf(type.toLowerCase()) !== -1) {
            return 'number[]';
        } else if (type.match(/^"[^"]*"$/) || type.match(/^'[^']*'$/)) {
            return 'string';
        } else if (type.match(/^[0-9]+$/)) {
            return 'number';
        } else if (type.match(/^(Function|Object)(\[\])?$/)) {
            return type;
        } else if (type === 'Array') {
            return 'Object[]';
        } else {
            return 'any';
        }
    }))).join(' | ');
}

/**
 * Create a comment that can be inserted above a prop
 */
function formatComment(text, indent=0) {
    if (!text) return '';

    let tabs = '';

    for (let i=0; i<indent; i++) tabs += '\t';

    const body = text && text.replace(/{@link[^}]*}/g, link => {
        // just return the link text
        const parts = link.slice(1, link.length-1).split(/\s/);
        return parts[parts.length-1].replace(/^#/, '');
    }).replace(/\n/g, `\n${tabs} * `);

    return `\n${tabs}/**\n${tabs} * ${body}\n${tabs} */`;
}

const version = '6.7.0';

//for (let toolkit of ['classic', 'modern']) {
for (let toolkit of ['modern']) {
    const output = ["import React from 'react';"];
    //const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'doxi', '6.7.0', `${toolkit}-all-classes-flatten.json`)));
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'ext-component-creator', 'AllClassesFiles', `${toolkit}-all-classes-flatten.json`)));


    for (let cls of data.global.items) {
        if (cls.$type === 'class' && cls.alias && cls.alias.indexOf('widget.') === 0) {
            for (let alias of cls.alias.split(/,/)) {
                const xtype = alias.replace(/^widget\./, '');
                const name = cls.name.split(/\./);
                let componentName = name[name.length-1];

                if (xtype === componentName.toLowerCase()) {
                    byClassName[cls.name] = componentName;
                } else {
                    componentName = camelize(xtype);
                }

                if (componentName.indexOf('.') === -1) {
                    components[componentName] = cls;
                }
            }
        }
    }

    for (let name in components) {
        const cls = components[name];
        const propsInterface = `${name}Props`;
        const configs = cls.items && cls.items.find(i => i['$type'] === 'configs');

        if (generateComments == 'yes') {
            output.push(formatComment(cls.text));
        }
        output.push(`declare class ${name} extends React.Component<${propsInterface}, any> { }`);
        output.push(`export interface ${propsInterface} {`);

        const uniqueConfigs = {};

        if (configs) for (let config of configs.items) {
            let { name, type, required, access, text } = config;
            
            if (access === 'private' || access === 'protected' || // only show public configs
                name.indexOf('.') !== -1 || // some configs erroneously have '.' in the name - this must be a bug in doxi
                ['items', 'dockedItems', 'xtype'].indexOf(name) !== -1) continue; // these are not needed when using reactor

                if (generateComments == 'yes') {
                    uniqueConfigs[name] = `${formatComment(text, 1)}\n\t${name}${required ? '' : '?'}: ${typeFor(type)}`;
                }
                else {
                    uniqueConfigs[name] = `\t${name}${required ? '' : '?'}: ${typeFor(type)}`;
                }
        }

        for (let name in uniqueConfigs) {
            output.push(uniqueConfigs[name])
        }

        const events = cls.items && cls.items.find(i => i['$type'] === 'events');

        if (events) for (let config of events.items) {
            const { name, text, items } = config;
            const params = [];

            if (items) for (let item of items) {
                if (item.$type === 'param') {
                    params.push(`${item.name}: ${typeFor(item.type)}`)
                }
            }

            if (generateComments == 'yes') {
                output.push(`${formatComment(text, 1)}\n\ton${camelize(name)}?: (${params.join(', ')}) => void`)
            }
            else {
                output.push(`\ton${camelize(name)}?: (${params.join(', ')}) => void`)
            }
        }

        output.push('}');
    }

    const target = path.join(__dirname, '.', `${toolkit}.d.ts`);
    fs.writeFileSync(target, output.join('\n'), 'utf8');
    console.log(`Wrote ${target}`);
}

fs.writeFileSync(path.join(__dirname, 'words.txt'), Array.from(strings).join('\n'), 'utf8');

console.log('done');
