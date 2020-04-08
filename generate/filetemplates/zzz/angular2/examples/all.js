exports.angular = (what, info) => {
    var r = ''
    switch(what) {

case 'module':
r =
`
import { ExtAngularModule } from '@sencha/Extangular';
//import '@sencha/Extweb-components${info.bundle}/Extweb-components${info.bundle}.module';
// import '@sencha/Extweb-components-all/lib/Extpanel.component';
// import '@sencha/Extweb-components-all/lib/Exttoolbar.component';
// import '@sencha/Extweb-components-all/lib/Extbutton.component';
// import '@sencha/Extweb-components-all/lib/Extgrid.component';
// import '@sencha/Extweb-components-all/lib/Extcolumn.component';
{imports}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [{declarationsx}
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
<div style="height:300px">
  <ExtGrid fitToParent
    [title]="title"
    (ready)="readyGrid($event)"
  >
    <ExtGridcolumn text="name" dataIndex="name"></ExtGridcolumn>
    <ExtGridcolumn text="email" dataIndex="email" flex="1"></ExtGridcolumn>
  </ExtGrid>
</div>
  \`,
  styles: []
})
export class AppComponent {
  title='the grid';

  //columns can also be a property of grid
  //[columns]="gridcolumns"
  // gridcolumns=[
  //   {text:'name', dataIndex: 'name'},
  //   {text:'email', dataIndex: 'email', flex: 1}
  // ]
  data=[
    {name: 'Marc', email: 'marc@gmail.com'},
    {name: 'Marc', email: 'marc@gmail.com'},
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
      groupField: 'name',
      proxy: {type: 'memory', reader: {type: 'json'}}
    });
    grid.setStore(store)
    store.setGrouper(null);
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
