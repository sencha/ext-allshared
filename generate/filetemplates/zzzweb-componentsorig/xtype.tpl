import {classname} from '{folder}.js';
import HTMLParsedElement from './HTMLParsedElement.js';

export default class Ext{Xtype} extends {classname} {
    constructor() {
        super ([],[])
        this.xtype = '{xtype}';
    }
}
window.customElements.define('ext-{xtype}', HTMLParsedElement.withParsedCallback(Ext{Xtype}))
