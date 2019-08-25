exports.angular = (what, info) => {
    var r = ''
    switch(what) {

case 'module':
r =
`
declare var Ext: any
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@sencha/ext-web-components${info.bundle}/ext-web-components${info.bundle}.module';

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
  //bootstrap: [ AppComponent ]
  entryComponents: [AppComponent]
})
export class AppModule {
    ngDoBootstrap(app) {
        Ext.onReady(function () {
            app.bootstrap(AppComponent);
        });
    }
}
`
break;

case 'component':
r = `
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: \`
<ext-button
    text="click me please"
    (ready)="readyButton($event)"
    (tap)="tapButton($event)"
>
</ext-button>
    \`,
    styles: []
})
export class AppComponent {
    button: any;
    readyButton = (event) => {
        this.button = event.detail.cmp;
    }
    tapButton = (event) => {
        alert('button text: ' + this.button.getText())
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
