class HTMLBaseElement extends HTMLElement {
    constructor(...args) {
      const self = super(...args)
      self.parsed = false // guard to make it easy to do certain stuff only once
      self.parentNodes = []
      return self
    }

    setup() {
      // collect the parentNodes
      let el = this;
      while (el.parentNode) {
        el = el.parentNode
        this.parentNodes.push(el)
      }
      // check if the parser has already passed the end tag of the component
      // in which case this element, or one of its parents, should have a nextSibling
      // if not (no whitespace at all between tags and no nextElementSiblings either)
      // resort to DOMContentLoaded or load having triggered
      if ([this, ...this.parentNodes].some(el=> el.nextSibling) || document.readyState !== 'loading') {
        this.childrenAvailableCallback();
      } else {
        this.mutationObserver = new MutationObserver(() => {
          if ([this, ...this.parentNodes].some(el=> el.nextSibling) || document.readyState !== 'loading') {
            this.childrenAvailableCallback()
            this.mutationObserver.disconnect()
          }
        });

        this.mutationObserver.observe(this, {childList: true});
      }
    }
  }

class ZTabs extends HTMLBaseElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = this.html + this.style + this.host;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        super.setup()
    }

    childrenAvailableCallback() {
        this.parsed = true

        var tabbuttonheader = this.shadowRoot.querySelector('div[class=tabbuttonheader]');
        var tabbutton;
        var tabname;
        var num = 0;
        var tabpanels = this._allTabPanels();
        tabpanels.forEach(tabpanel => {
            num++
            tabpanel.id = 'tab' + num + 'panel'
            tabpanel.style.height = "100%"
            tabpanel.classList.add("tabpanel");
            tabname = tabpanel.getAttribute('tabname');
            tabbutton = document.createElement("DIV");
            tabbutton.id = 'tab' + num;
            tabbutton.innerHTML = tabname;
            tabbutton.classList.add("tabbutton");
            tabbutton.addEventListener('click', (e) => this.tabClick(e, e.target.id));
            tabbuttonheader.appendChild(tabbutton);
        });
        this.resetAll();
        var tabpanelselected = this.querySelector(`#tab1panel`);
        if (tabpanelselected != null) {
            tabpanelselected.style.display = "flex";
            var tabbuttonselected = this.shadowRoot.getElementById('tab1')
            tabbuttonselected.classList.add("active");
        }
    }

    tabClick(event, tab) {
        var i, tabpanels, tabbuttons;
        tabpanels =  this._allTabPanels();
        for (i = 0; i < tabpanels.length; i++) {
            tabpanels[i].style.display = "none";
            if (tabpanels[i].id == tab + 'panel') {
                tabpanels[i].style.display = "flex";
            }
        }
        tabbuttons = this.shadowRoot.querySelectorAll(".tabbutton");
        for (i = 0; i < tabbuttons.length; i++) {
            tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
            if (tabbuttons[i].id == tab) {
                tabbuttons[i].className += " active";
            }
        }
    }

    resetAll() {
        const tabpanels = this._allTabPanels();
        tabpanels.forEach(tabpanel => tabpanel.style.display = "none");
    }

    _allTabPanels() {
        return Array.from(this.querySelectorAll('z-tabpanel'));
    }

      get html() { return `
<div class="tab">
<div class="tabtop">top</div>
<div class="tabbuttonheader"></div>
<div class="tabpanelheader">
    <slot class="slot"></slot>
</div>
</div>
      `}

      get style() { return `
      <style height=100px></style>

<style>

.tab {
    display: flex;
    height: 100%;
    width: 100%
    border-bottom: 1px solid var(--vscode-tab-activeBackground);
    padding: 5px 5px 0 5px;
    xbackground: var(--z-tab-activeBackground);
    background: red;
}

.tabtop {
    display: flex;
    height: 100%;
    width: 100%
    border-bottom: 1px solid var(--vscode-tab-activeBackground);
    padding: 5px 5px 0 5px;
    xbackground: var(--z-tab-activeBackground);
    background: red;
}

.tabbuttonheader {
    display: flex;
    xheight: 25px;
    border-bottom: 1px solid var(--vscode-tab-activeBackground);
    padding: 5px 5px 0 5px;
    xbackground: var(--z-tab-activeBackground);
    background:rgb(80,80,80);
}

.tabpanelheader {
    height: 20px;
    flex: auto;
    background: var(--vscode-tab-activeBackground);
    display: flex;
    flex-direction: column;
}
.tabpanel {
    flex: auto;
    background: yellow;
    display: flex;
    flex-direction: column;
}

.tabbutton {
    background-color: inherit;
    color: white;
    float: left;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 8px 12px;
    transition: 0.3s;
    font-size: 22px;
}

.tabbutton:hover {
    background-color: #ddd;
    color: black;
    border-radius: 4px 4px 0 0;
}

.tabbutton.active {
    xbackground: linear-gradient(#323639, #32373a);
    background: var(--vscode-tab-activeBackground);
    border-radius: 4px 4px 0 0;
    border-left-color: #24282b;
    border-right-color: #24282b;
    color: #fff;
    font-weight: normal;
 }

</style>
          `}

          get host() { return `
<style>

:host {
    flex: auto;
    display: flex;
    height: 100%;
    overflow: hidden;
    flex-direction: column;
}

::slotted(z-tabpanel) {
    height: 100%
    background-color: lightgray;
    flex: auto;
    display: flex;
    flex-direction: column;
  }

</style>
    `}

    disconnectedCallback() {}
}
window.customElements.define('z-tabs', ZTabs)
