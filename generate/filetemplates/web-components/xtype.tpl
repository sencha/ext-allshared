import {classname} from '{folder}'
import HTMLParsedElement from './HTMLParsedElement'

export class Ext{Xtype}Component extends {classname} {
    constructor() {super ('','',{},'')}
}

//(function () {
//    Ext.onReady(function() {
//        window.customElements.define('ext-{xtype}', Ext{Xtype}Component);
//    });
//})();

//const {withParsedCallback} = HTMLParsedElement;
window.customElements.define('ext-{xtype}', HTMLParsedElement.withParsedCallback(Ext{Xtype}Component))
