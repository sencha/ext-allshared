exports.angular = (what, info) => {
    var r = ''
    switch(what) {

case 'module':
r =
`
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//import '@sencha/ext-web-components${info.bundle}/ext-web-components${info.bundle}.module';
import '@sencha/ext-web-components/ext-web-components${info.bundle}.module';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
`
break;

case 'component':
r = `
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: \`
<ext-grid
    viewport="true"
    title="title"
    onready="readyGrid($event)"
>
    <ext-column text="name" dataIndex="name"></ext-column>
    <ext-column text="email" dataIndex="email" flex="1"></ext-column>
</ext-grid>
    \`,
    styles: []
})
export class AppComponent {
    title = 'the grid';
    data = [
        {name: 'Marc', email: 'marc@gmail.com'},
        {name: 'Nick', email: 'nick@gmail.com'},
        {name: 'Andy', email: 'andy@gmail.com'},
    ]
    readyGrid = (event) => {
        var grid = event.detail.cmp;
        grid.setData(this.data)
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
