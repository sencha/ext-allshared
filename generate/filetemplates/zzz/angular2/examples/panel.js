exports.examples = (what, info) => {
    var r = ''
    switch(what) {

case 'module':
r =
`
import { ExtAngularPanelModule } from '@sencha/ext-angular-panel';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ExtAngularPanelModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
`
break;

case 'component':
r = `
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: \`
<ext-panel
    [title]="title"
    (ready)="readyPanel($event)"
>
</ext-panel>
    \`,
    styles: []
})
export class AppComponent {
    title = 'the panel';
    readyPanel = (event) => {
        var panel = event.detail.cmp;
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
