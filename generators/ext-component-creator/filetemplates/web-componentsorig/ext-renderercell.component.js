import ExtBase from './base';

export class ExtRenderercellComponent extends ExtBase {
	get activeChildTabIndex(){return this.getAttribute('activeChildTabIndex')};set activeChildTabIndex(activeChildTabIndex){this.setAttribute('activeChildTabIndex',activeChildTabIndex)}

	static XTYPE() {return 'renderercell'}
  static PROPERTIESOBJECT() { return {
    "activeChildTabIndex": "Number",

  }}
  static EVENTS() { return [
		{name:'ready',parameters:''}

  ]}
  static METHODS() { return [
		{ name:'_addDeclaredListeners',function: function(listeners) { return this.ext._addDeclaredListeners(listeners) } },
  ]}

  constructor() {
    super()
    this.METHODS = ExtRenderercellComponent.METHODS()
    this.XTYPE = ExtRenderercellComponent.XTYPE()
    //this.PROPERTIES = ExtRenderercellComponent.PROPERTIES()
    this.PROPERTIESOBJECT = ExtRenderercellComponent.PROPERTIESOBJECT()
    this.EVENTS = ExtRenderercellComponent.EVENTS()
  }

  connectedCallback() {
    super.connectedCallback()
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    super.attributeChangedCallback(attrName, oldVal, newVal)
  }
}
(function () {
  Ext.onReady(function() {
    window.customElements.define('ext-renderercell', ExtRenderercellComponent);
  });
})();