## @sencha/ext-web-components-{type}

last run: {now}

## Test with an Angular CLI generated app

#### Install Angular CLI

```sh
npm install -g @angular/cli
```

should be @angular/cli@8.2.x


#### Create a new Angular CLI application

```sh
ng new ng-ewc{bundle} --minimal=true --interactive=false -g=true --skipInstall=true
```

#### Open your editor

To open Visual Studio Code, type the following:

```sh
cd ng-ewc{bundle}
code .
```

#### Add to package.json

In the dependencies section of package.json, add the following:

```sh
"@sencha/ext-web-components{bundle}": "7.0.0",
```

#### Run npm install

in a terminal window at the root of your application, run the following:

```sh
npm install
```

#### Replace src/app/app.module.js

Open the src/app/app.module.js file in the editor and replace the contents with the following:

```sh
{angular.module}
```

#### Replace src/app/app.component.ts

Open the src/app/app.component.ts file in the editor and replace the contents with the following:

```sh
{angular.component}
}
```

#### Run the application

Type the following in a command/terminal window:

```sh
npm start
```

open http://localhost:4200 in a browser - the EWC application will load

or...

#### Replace src/app/app.component.html

Open the src/app/app.component.html file in the editor and replace the contents with the following:

```sh
{examplex}
<ext-panel viewport="true" title="panel" layout="fit">
    <ext-toolbar docked="top">
        <ext-button text="hi"></ext-button>
    </ext-toolbar>
    <ext-grid
        [title]="title"
        (ready)="readyGrid($event)"
    >
        <ext-column text="name" dataIndex="name"></ext-column>
        <ext-column text="email" dataIndex="email" flex="1"></ext-column>
    </ext-grid>
</ext-panel>

```

#### Replace src/app/app.component.ts

Open the src/app/app.component.ts file in the editor and replace the contents with the following:

```sh
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
```

#### Run the application

Type the following in a command/terminal window:

```sh
npm start
```

open http://localhost:4200 in a browser - the EWC application will load
