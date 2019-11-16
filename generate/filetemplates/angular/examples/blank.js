exports.examples = (what, info) => {
    var r = ''
    switch(what) {

case 'module':
r =
`
import { ExtAngularModule } from '@sencha/ext-angular'
//import '@sencha/ext-web-components${info.bundle}/ext-web-components${info.bundle}.module';
// import '@sencha/ext-web-components-all/lib/ext-panel.component';
// import '@sencha/ext-web-components-all/lib/ext-toolbar.component';
// import '@sencha/ext-web-components-all/lib/ext-button.component';
// import '@sencha/ext-web-components-all/lib/ext-grid.component';
// import '@sencha/ext-web-components-all/lib/ext-column.component';
{imports}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ExtAngularModule
  ],
  providers: [ ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
`
break;

case 'component':
r = `
import { Component } from '@angular/core';
var Ext = window['Ext'];

@Component({
  selector: 'app-root',
  template: \`
<div style="height:200px">
  <ExtGrid fitToParent="true"
    [title]="title"
    (ready)="readyGrid($event)"
    [columns]="gridcolumns"
  >
    <!--
    <ExtGridcolumn text="name" dataIndex="name"></ExtGridcolumn>
    <ExtGridcolumn text="email" dataIndex="email" flex="1"></ExtGridcolumn>
    -->
  </ExtGrid>
</div>
  \`,
  styles: []
})
export class AppComponent {
  title='the grid';
  gridcolumns=[
    {text:'name', dataIndex: 'name'},
    {text:'email', dataIndex: 'email', flex: 1}
  ]
  data=[
    {name: 'Marc', email: 'marc@gmail.com'},
    {name: 'Marc', email: 'marc@gmail.com'},
    {name: 'Nick', email: 'nick@gmail.com'},
    {name: 'Andy', email: 'andy@gmail.com'},
  ]
  readyGrid(event) {
    console.log('ready')
    var grid = event.cmp;

    var store = Ext.create('Ext.data.Store', {
      data: this.data,
      proxy: {
        type: 'memory',
        reader: {
          type: 'json'
        }
      }
    });
    grid.setStore(store)
  }
}
`
break;

default:
r = ``
break;

    }
    return r
}
