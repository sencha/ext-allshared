import EwcBaseComponent from '../ewc-base.js'

export default class {classname} extends EwcBaseComponent {



//events
//get onready(){return this.getAttribute('onready')};set onready(onready){this.setAttribute('onready',onready)}

    static PROPERTIES() { return [
        'extname',
        'viewport',
        'align',
        'plugins',
        'responsiveConfig',
        'responsiveFormulas',
        {sPROPERTIES}]};
    static EVENTS() { return [{sEVENTS}]};
    static getProperties(properties) {
        return properties.concat({classname}.PROPERTIES)
    }
    static getEvents(events) {
        return events.concat({classname}.EVENTS)
    }

    static get observedAttributes() {
        var attrs = []
        //for (var property in {classname}.PROPERTIESOBJECT()) {
        //    attrs.push(property)
        //}
        //{classname}.EVENTS().forEach(function (eventparameter, index, array) {
        //    attrs.push('on' + eventparameter.name)
        //})

        {classname}.PROPERTIES().forEach(function (property, index, array) {
            attrs.push(property)
        })
        {classname}.EVENTS().forEach(function (eventparameter, index, array) {
            attrs.push('on' + eventparameter.name)
        })
        //attrs.push('onready')
        return attrs
    }

    constructor(properties, events) {
        super (
            properties.concat({classname}.PROPERTIES()),
            events.concat({classname}.EVENTS())
        )
    }
}