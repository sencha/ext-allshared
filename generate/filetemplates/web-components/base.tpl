import EwcBaseComponent from '../ewc-base.component'

export default class {classname} extends EwcBaseComponent {
//events
get onready(){return this.getAttribute('onready')};set onready(onready){this.setAttribute('onready',onready)}
{sEVENTGETSET}//configs
{sGETSET}
static XTYPE() {return '{xtype}'}
static PROPERTIESOBJECT() { return {
{sPROPERTIESOBJECT}"ext": ["string"],
"align": ["string"],
"viewport":["boolean"],
"plugins":["Array","Ext.enums.Plugin","Object","Ext.plugin.Abstract"],
"responsiveConfig":["Object"],
"responsiveFormulas":["Object"]
}}
static EVENTS() { return [
{name:'ready',parameters:''},
{sEVENTS}]}
static METHODS() { return [
{sMETHODS}]}

    static get observedAttributes() {
        var attrs = []
        for (var property in {classname}.PROPERTIESOBJECT()) {
            attrs.push(property)
        }
        {classname}.EVENTS().forEach(function (eventparameter, index, array) {
            attrs.push('on' + eventparameter.name)
        })
        attrs.push('onready')
        return attrs
    }

    constructor(propertiesobject, methods, events) {
        super (
            Object.assign(propertiesobject, {classname}.PROPERTIESOBJECT()),
            methods.concat({classname}.METHODS()),
            events.concat({classname}.EVENTS())
        )
        //this.XTYPE = {classname}.XTYPE()
        //this.PROPERTIESOBJECT = this.extendObject(this.PROPERTIESOBJECT, {classname}.PROPERTIESOBJECT());
        //this.METHODS = this.extendArray(this.METHODS, {classname}.METHODS());
        //this.EVENTS = this.extendArray(this.EVENTS, {classname}.EVENTS());
    }
}