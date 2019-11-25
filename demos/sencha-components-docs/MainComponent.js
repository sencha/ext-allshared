import { extnameToProperty } from './node_modules/@sencha/ext-web-components/src/util.js';

export default class MainComponent {
  constructor() {
    fetch('./MainComponent.html')
    .then(response => {return response.text()})
    .then(html => {document.body.innerHTML = html})
  }

  onViewportReady = function(event) {
    //gets all cmp properties for elements with extname defined
    extnameToProperty(event, this, 'Cmp');

    var navTreeRoot = {
      hash: 'elements',
      iconCls: 'x-fa fa-home',
      leaf: false,
      text: 'Elements',
      children: window.xtypemenu
    };
    var treeStore = Ext.create('Ext.data.TreeStore', {
      rootVisible: true,
      root: navTreeRoot
    });

    this.navTreelistCmp.setStore(treeStore);
    this.breadcrumbCmp.setStore(treeStore);

    var node = this.navTreelistCmp.getStore().findNode('xtype', 'actionsheet');
    this.navTreelistCmp.setSelection(node);
    this.breadcrumbCmp.setSelection(node);

    var propertiesdetailTpl = `
      <div class="mjg">
        <div style="font-weight:bold;font-size:14px;">{name}</div>
        <hr/>
        <div>{text}</div>
      </div>
    `;
    this.propertiesdetailCmp.setItemTpl(propertiesdetailTpl);
  }

  populateTabs(data) {
    var desc = data.desc;
    var text = data.text;

    var Text = text.charAt(0).toUpperCase() + text.substring(1);
    var s = `
## ${text} overview
<ext-button text="${text}" shadow="true">
</ext-button>





<ext-tabpanel shadow="true" height="300px">
<ext-panel title="Ext JS"></ext-panel>
<ext-panel title="Angular"></ext-panel>
<ext-panel title="React"></ext-panel>
<ext-panel title="Web Components"></ext-panel>
</ext-tabpanel>



<ext-button text="${text}" shadow="true"></ext-button>

* Angular: \`&lt;Ext${Text}&gt;\`
* React: \`&lt;Ext${Text}&gt;\`
* Web Components: \`&lt;ext-${text}&gt;\`





${desc}
        `
    document.querySelector("#mjg-wc-markdown").value = s

    var pString = `<H1>${text} Properties</H1><hr/>`
    var propertyCount = 0
    data.properties.forEach( property => {
      // pString = pString + '<H3>' + property.name + '</H3>' + '<H4>' + property.text + '</H4>'
      //pString = pString + '<hr/>'
      propertyCount++
    })
    this.propertiesheaderCmp.setHtml(pString)
    this.propertiesdetailCmp.setData(data.properties);
    //this.propertiesCmp.setHtml(pString)
    if (propertyCount == 0) {propertyCount = 'O'}
    this.propertiesCmp.tab.setBadgeText(propertyCount)

    var mString = `<H1>${text} Methods</H1><hr/>`
    var methodCount = 0
    data.methods.forEach( method => {
      mString = mString + '<H3>' + method.name + '</H3>' + '<H4>' + method.text + '</H4>'
      mString = mString + '<hr/>'
      methodCount++
    })
    this.methodsCmp.setHtml(mString)
    if (methodCount == 0) {methodCount = 'O'}
    this.methodsCmp.tab.setBadgeText(methodCount)

    var eString = `<H1>${text} Events</H1><hr/>`
    var eventCount = 0
    data.events.forEach( event => {
      eString = eString + '<H2>' + event.name + '(' + event.parameters.toString() + ')' + '</H2>'
      eString = eString + '<H3>' + event.text  + '</H3>'
      eString = eString + event.ewc
      eString = eString + '<hr/>'
      eventCount++
    })
    this.eventsCmp.setHtml(eString)
    if (eventCount == 0) {eventCount = 'O'}
    this.eventsCmp.tab.setBadgeText(eventCount)

    var examplesString = `<H1>${text} Examples</H1><hr/>`
    var examplesCount = 0

    this.examplesCmp.setHtml(examplesString)

    if (eventCount == 0) {eventCount = 'O'}
    this.examplesCmp.tab.setBadgeText(examplesCount)
  }

  navTreelistSelectionChange = (event) => {
    var node = event.detail.record;
    this.navigate('tree', node);
  }

  breadcrumbClick = (event) => {
    var node = event.detail.node;
    this.navigate('breadcrumb', node);
  }

  navigate = (who, node) => {
    if (node.data.properties == undefined) {return}
    if (this.navInProcess) {
        return;
    }
    if (node == null) {return;}
    this.navInProcess = true;
    this.populateTabs(node.data);
    this.navTreelistCmp.setSelection(node);
    var node2 = this.breadcrumbCmp.getStore().findNode('xtype', node.data.xtype);
    this.breadcrumbCmp.setSelection(node2);
    this.navInProcess = false;
  }
}
