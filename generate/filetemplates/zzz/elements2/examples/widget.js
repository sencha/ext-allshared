exports.angular = (what, info) => {
    var r = ''
    switch(what) {

case 'module':
r =
`declare var Ext: any
import '@sencha/ext-web-components-widget/ext-web-components-widget.module'

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
<ext-widget
    (ready)="readyWidget($event)"
>
</ext-widget>
    \`,
    styles: []
})
export class AppComponent {
    title = 'the widget';
    readyWidget = (event) => {
        var widget = event.detail.cmp;
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
