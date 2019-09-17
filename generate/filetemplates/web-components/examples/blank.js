exports.angular = (what, info) => {
    var r = ''
    switch(what) {

case 'module':
r =
`
import { ExtAngularAllModule } from '@sencha/ext-angular-all'
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
  declarations: [{declarationsx}
    AppComponent
  ],
  imports: [
    BrowserModule
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

@Component({
    selector: 'app-root',
    template: \`
<ext-panel viewport="true" title="panel" layout="fit">
    <ext-toolbar docked="top">
        <ext-button text="toolbar button"></ext-button>
    </ext-toolbar>
    <ext-grid
        title="title"
        onready="readyGrid($event)"
    >
        <ext-column text="name" dataIndex="name"></ext-column>
        <ext-column text="email" dataIndex="email" flex="1"></ext-column>
    </ext-grid>
</ext-panel>
    \`,
    styles: []
})
export class AppComponent {
    title = 'the grid';
    data=[
        {name: 'Marc', email: 'marc@gmail.com'},
        {name: 'Nick', email: 'nick@gmail.com'},
        {name: 'Andy', email: 'andy@gmail.com'},
    ]
    readyGrid(event) {
        var grid = event.target.ext;
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
