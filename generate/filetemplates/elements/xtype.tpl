//import {classname} from '@sencha/ext-runtime-base/dist/{folder}.js';
import {classname} from '{folder}.js';
import HTMLParsedElement from './HTMLParsedElement.js';

export default class EWC{Xtype} extends {classname} {
//    static get observedAttributes() {
//        var attrs = super.observedAttributes
//        attrs.push('fitToParent')
//        attrs.push('tab')
//        attrs.push('config')
//        attrs.push('platformConfig')
//        attrs.push('responsiveConfig')
//        return attrs
//    }
    constructor() {
        super ([], []);
        this.xtype = '{xtype}';
    }
}
window.customElements.define('ext-{xtype}', HTMLParsedElement.withParsedCallback(EWC{Xtype}));
