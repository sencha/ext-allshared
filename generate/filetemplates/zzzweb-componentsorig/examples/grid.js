exports.angular = (what, info) => {
    var r = ''
    switch(what) {

case 'module':
r =
`declare var Ext: any
import '@sencha/ext-web-components-grid/ext-web-components-grid.module'

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule {}
`
break;

case 'component':
r = `import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: \`
<ext-grid
    [title]="title"
    height="300px"
    (ready)="this.readyGrid($event)"
    columns='[
        {"text":"name","dataIndex": "name", "width": 100},
        {"text":"email","dataIndex": "email", "flex": 1}
    ]'
>
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
