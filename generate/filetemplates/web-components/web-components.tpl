import {classname} from '{folder}.js';
import ElementParser from './ElementParser.js';

export default class EWC{Xtype} extends {classname} {
  constructor() {
    super ([], []);
    this.xtype = '{xtype}';
  }
}
try {
  window.customElements.define('ext-{xtype}', ElementParser.withParsedCallback(EWC{Xtype}));
}
catch(e) {
  window.customElements.define('ext-{xtype}', EWC{Xtype});
}
{ElementCell}