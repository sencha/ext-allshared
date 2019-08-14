import EwcBaseComponent from '../ewc-base.component'

export default class {classname} extends EwcBaseComponent {
//events
{sEVENTGETSET}//configs
{sGETSET}
static XTYPE() {return '{xtype}'}
static PROPERTIESOBJECT() { return {
{sPROPERTIESOBJECT}"ewc": ["string"],
"align": ["string"],
"viewport":["boolean"],
"plugins":["Array","Ext.enums.Plugin","Object","Ext.plugin.Abstract"],
"responsiveConfig":["Object"],
"responsiveFormulas":["Object"]
}}
static EVENTS() { return [
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
        attrs.push('on' + 'ready')
        return attrs
    }

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
}