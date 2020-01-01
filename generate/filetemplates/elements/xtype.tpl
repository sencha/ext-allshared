import {classname} from '{folder}.js';
import ElementParser from './ElementParser.js';

export default class EWC{Xtype} extends {classname} {
  constructor() {
    super ([], []);
    this.xtype = '{xtype}';
  }
}
window.customElements.define('ext-{xtype}', ElementParser.withParsedCallback(EWC{Xtype}));
{ElementCell}