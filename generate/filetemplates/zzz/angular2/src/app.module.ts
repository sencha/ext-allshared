declare var Ext: any
import 'script-loader!node_modules/@sencha/ext-angular-gridall/ext/ext.gridall.prod';
import 'script-loader!node_modules/@sencha/ext-angular-gridall/ext/css.prod';
import { ExtGridComponent } from '@sencha/ext-angular-gridall/esm5/src/ext-grid.component';
import { ExtColumnComponent } from '@sencha/ext-angular-gridall/esm5/src/ext-column.component';
import { ExtPanelComponent } from '@sencha/ext-angular-gridall/esm5/src/ext-panel.component';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    ExtGridComponent,
    ExtColumnComponent,
    ExtPanelComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  entryComponents: [AppComponent]
  //bootstrap: [AppComponent]
})
export class AppModule {
    ngDoBootstrap(app) {
        Ext.onReady(function () {
            console.log('in ready here')
            app.bootstrap(AppComponent);
        });
    }
}