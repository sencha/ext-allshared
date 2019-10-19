import {classname} from '{folder}.js'
import HTMLParsedElement from './HTMLParsedElement.js'

export class Ext{Xtype}Component extends {classname} {
    constructor() {
        super (
            [],
            []
        )
        this.xtype = '{xtype}'
    }
}

//(function () {
//    Ext.onReady(function() {
//        window.customElements.define('ext-{xtype}', Ext{Xtype}Component);
//    });
//})();

//const {withParsedCallback} = HTMLParsedElement;
window.customElements.define('ext-{xtype}', HTMLParsedElement.withParsedCallback(Ext{Xtype}Component))
