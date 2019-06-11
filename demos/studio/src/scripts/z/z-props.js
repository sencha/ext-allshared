class ZProps extends HTMLElement {

    get data(){return JSON.parse(this.getAttribute('data'))};
    set data(data){this.setAttribute('data',JSON.stringify(data))};
    static get observedAttributes() {return ['data']}

    constructor() {
      super()
      const shadowRoot = this.attachShadow({ mode: 'open' })
      const template = document.createElement('template');
      template.innerHTML = `${this.html}${this.style}${this.host}`;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {}

    get html() { return `
<div id="propertiesheader" class="propertiesheader"></div>
    `}

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case 'data':
                var rows = this.shadowRoot.querySelectorAll(".row")
                for (var i = 0; i < rows.length; i++) {
                    rows[i].remove()
                }
                //console.dir(newValue)
                var data = JSON.parse(newValue)
                for (var key in data) {
                    this.doIt(data[key]);
                }
                break;
            default:
                break;
        }
    }

    doIt(o) {
        var className = o.className;
        var configName
        var thevalue

        if (o.configName != undefined) {
            configName = o.configName
        }
        else if (o.name != undefined) {
            configName = o.name
        } 
        else {
            configName =""
        }

        if (o.value1 != undefined) {
            thevalue = o.value1
        }
        else if (o.value2 != undefined)
        {
            thevalue = o.value2
        }
        else {
            thevalue = null
        }
        var rowClassName = "text";
        var row;
        var name;
        var value;
        var element;

        row = document.createElement("DIV");
        row.classList.add("row");

        name = document.createElement("DIV");
        name.innerHTML = configName;
        name.align = "right"
        name.classList.add("name");

        value = document.createElement("INPUT");
        value.classList.add("value");
        if (o.set == 'yes') {
            value.classList.add("set");
            value.setAttribute("oninput", "app.getInput(" + "this.id,this.value" + ")");
        }
        else {
            value.setAttribute("disabled", true);
        }
        if (thevalue == null) {
            value.setAttribute("hidden", true);
        }

        value.setAttribute("type", "text");
        value.setAttribute("id", configName);
        value.setAttribute("value", thevalue);

        row.appendChild(name);
        row.appendChild(value);
        var propertiesheader = this.shadowRoot.getElementById('propertiesheader')
        //this.shadowRoot.appendChild(row);
        propertiesheader.appendChild(row);

    }

    get style() { 
       var editorBackground = 'rgb(86,86,86)';
        return `
<style>

.propertiesheader {
    flex: auto;
}

.row {
    display: flex;
    padding: 1px 2px 0 2px;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;
}

.name {
    font-size: 12px;
    padding-right: 10px;
    color: white;
}

.value {
    width: 50%;
    border: 2px solid rgb(56,56,56);
    background: rgb(186,186,186);
    border-radius: 3px;
}

input:focus {
    outline: none !important;
    border: 2px solid yellow;
    border-radius: 3px;
}

.set {
    background: white;
}

</style>
    `}

    get host() { 
        var editorBackground = 'var(--vscode-tab-activeBackground)'
        return `
<style>
:host {
    height: 100%;
    display: flex;
    flex-direction: column;
    contain: content;
    background: ${editorBackground};
    margin: 0;
    overflow-y: auto;
}
</style>
    `}
}
window.customElements.define('z-props', ZProps)
