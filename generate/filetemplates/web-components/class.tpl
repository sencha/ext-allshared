import {extendsclassname} from '{pathprefix}{extendpath}{classextendsfilename}';

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

    static get observedAttributes() {
        var attrs = super.observedAttributes
        for (var property in {classname}.PROPERTIESOBJECT()) {
            attrs.push(property)
        }
        {classname}.EVENTS().forEach(function (eventparameter, index, array) {
            attrs.push('on' + eventparameter.name)
        })
        return attrs
    }

    constructor(propertiesobject, methods, events) {
        super (
            Object.assign(propertiesobject, {classname}.PROPERTIESOBJECT()),
            //{propertiesobject, {classname}.PROPERTIESOBJECT()},
            methods.concat({classname}.METHODS()),
            events.concat({classname}.EVENTS())



            //events.concat({classname}.EVENTS()),
            //propertiesobject.concat({classname}.PROPERTIESOBJECT()),
            //methods.concat({classname}.METHODS())

            //EwcBaseComponent.extendArray(events, {classname}.EVENTS()),
            //EwcBaseComponent.extendArray(propertiesobject, {classname}.PROPERTIESOBJECT()),
            //EwcBaseComponent.extendArray(methods, {classname}.METHODS())
        )
        //this.XTYPE = {classname}.XTYPE()
        //this.PROPERTIESOBJECT = this.extendObject(this.PROPERTIESOBJECT, {classname}.PROPERTIESOBJECT());
        //this.methods = this.extendArray(this.methods, {classname}.METHODS());
        //this.events = this.extendArray(this.events, {classname}.EVENTS());

    }

    connectedCallback() {
        super.connectedCallback()
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        super.attributeChangedCallback(attrName, oldVal, newVal)
    }

}
