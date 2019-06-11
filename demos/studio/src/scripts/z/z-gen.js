class ZGen extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `${this.html}${this.style}${this.host}`;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    get html() { return `
<div>hi</div>
<slot>
<p>default</p>
</slot>
    `}

    get style() { return `
<style>
.mjg {
    height: 100%;
    width: 100%;
    display: block;
    contain: content;
    background: papayawhip;
    margin: 0;
}
</style>
    `}

    get host() { return `
<style>
:host {
    xheight: 100%;
    xwidth: 100%;
    display: block;
    contain: content;
    background: papayawhip;
    margin: 0;
}
</style>
    `}

    // connectedCallback() {
    // }

    // attributeChangedCallback(name, oldValue, newValue) {
    // }

}
window.customElements.define('z-gen', ZGen)
