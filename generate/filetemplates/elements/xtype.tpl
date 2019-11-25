//import {classname} from '@sencha/ext-runtime-base/dist/{folder}.js';
import {classname} from '{folder}.js';
import HTMLParsedElement from './HTMLParsedElement.js';

export default class EWC{Xtype} extends {classname} {
    constructor() {
        super ([], []);
        this.xtype = '{xtype}';
    }

}
window.customElements.define('ext-{xtype}', HTMLParsedElement.withParsedCallback(EWC{Xtype}));
{ElementCell}
