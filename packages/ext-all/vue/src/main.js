import Vue from 'vue'
import App from './App.vue'

import '@sencha/ext-web-components/lib/ext-button.component';
import '@sencha/ext-web-components/lib/ext-panel.component';
import '@sencha/ext-web-components/lib/ext-grid.component';

Vue.config.productionTip = false

Ext.onReady(function() {
  new Vue({
    render: h => h(App),
  }).$mount('#app')
});
