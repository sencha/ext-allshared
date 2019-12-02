exports.examples = (what, info) => {
    var r = ''
    switch(what) {

case 'module':
r =
`
import { ExtAngularButtonModule } from '@sencha/ext-angular-button';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ExtAngularButtonModule
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
<ext-button
    [text]="title"
    (ready)="readyButton($event)"
    (tap)="tapButton($event)"
>
</ext-button>
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
    readyButton = (event) => {
        var button = event.detail.cmp;
    }
    tapButton = (event) => {
        alert('button text: ' + event.button.getText())
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
