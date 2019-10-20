import {classname} from '{folder}.js';
import HTMLParsedElement from './HTMLParsedElement.js';
//import reactify from './reactify.js';

export default class Ext{Xtype} extends {classname} {
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
//        window.customElements.define('ext-{xtype}', Ext{Xtype});
//    });
//})();

//const {withParsedCallback} = HTMLParsedElement;
window.customElements.define('ext-{xtype}', HTMLParsedElement.withParsedCallback(Ext{Xtype}))
//export default reactify(Ext{Xtype});