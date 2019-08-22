## @sencha/ext-angular-{type}

last run: {now}

This npm package contains the minimum files that are needed to provide for the @sencha/ext-angular{bundle} package for an Angular application

## Test with an Angular CLI generated app

#### Install Angular CLI

```sh
npm install -g @angular/cli
```

should be @angular/cli@8.2.x


#### Create a new Angular CLI application

```sh
ng new ng-xng{bundle} --minimal=true --interactive=false -g=true --skipInstall=true
```

#### Open your editor

To open Visual Studio Code, type the following:

```sh
cd ng-xng{bundle}
code .
```

#### Add to package.json

In the dependencies section of package.json, add the following:

```sh
"@sencha/ext-angular{bundle}": "7.0.0",
```

#### Run npm install

in a terminal window at the root of your application, run the following:

```sh
npm install
```

#### Add to src/index.html

Add this BEFORE the ENDING </html> tag:

```sh
...
<style>
    :root {
        --base-color:black;
        --base-foreground-color:yellow;
        --color:white;
        --background-color:gray;
        --hovered-background-color:lightgray;
    }
    body {
        padding: '10px'
    }
    * {
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    }
</style>
</html>
```

#### Replace src/app/app.module.js

Open the src/app/app.module.js file in the editor and replace the contents with the following:

```sh
declare var Ext: any
import { ExtAngular{Bundle}Module } from '@sencha/ext-angular{bundle}'

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ExtAngular{Bundle}Module
  ],
  providers: [],
  entryComponents: [AppComponent]
})
export class AppModule {
    ngDoBootstrap(app) {
        Ext.onReady(function () {
            app.bootstrap(AppComponent);
        });
    }
}
```

#### Replace src/app/app.component.html

Open the src/app/app.component.html file in the editor and replace the contents with the following: {example}

```sh
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
<ext-panel viewport="true" title="panel" layout="fit">
    <ext-toolbar docked="top">
        <ext-button text="toolbar button"></ext-button>
    </ext-toolbar>
    <ext-grid
        [title]="title"
        (ready)="readyGrid($event)"
    >
        <ext-column text="name" dataIndex="name"></ext-column>
        <ext-column text="email" dataIndex="email" flex="1"></ext-column>
    </ext-grid>
</ext-panel>
    `,
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
        var grid = event.ext;
        grid.setData(this.data)
    }
}
```

#### Run the application

Type the following in a command/terminal window:

```sh
ng serve --open
```

open http://localhost:4200 in a browser - the ExtAngular application will load

#### components in this package:

{wantedxtypes}