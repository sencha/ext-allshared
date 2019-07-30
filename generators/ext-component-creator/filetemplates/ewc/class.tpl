import {extendsclassname} from './{classextendsfilename}';

export default class {classname} extends {extendsclassname} {
//events
{sEVENTGETSET}//configs
{sGETSET}
static XTYPE() {return '{xtype}'}
static PROPERTIESOBJECT() { return {
{sPROPERTIESOBJECT}}}
static EVENTS() { return [
{sEVENTS}]}
static METHODS() { return [
{sMETHODS}]}

constructor() {
    super (
        {classname}.METHODS(),
        {classname}.XTYPE(),
        {classname}.PROPERTIESOBJECT(),
        {classname}.EVENTS()
    )
    this.XTYPE = {classname}.XTYPE()
    this.PROPERTIESOBJECT = this.extendObject(this.PROPERTIESOBJECT, {classname}.PROPERTIESOBJECT());
    this.METHODS = this.extendArray(this.METHODS, {classname}.METHODS());
    this.EVENTS = this.extendArray(this.EVENTS, {classname}.EVENTS());
  }

connectedCallback() {
    super.connectedCallback()
}

attributeChangedCallback(attrName, oldVal, newVal) {
    super.attributeChangedCallback(attrName, oldVal, newVal)
}

}
{webcomponentdef}
