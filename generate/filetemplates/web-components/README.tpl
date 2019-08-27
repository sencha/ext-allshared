## @sencha/ext-web-components-{type}

last run: {now}

## Test with an Angular CLI generated app

#### Install Angular CLI

```sh
npm install -g @angular/cli
```

should be @angular/cli@8.3.x


#### Create a new Angular CLI application

```sh
ng new ng-ewc{bundle} --minimal=true --interactive=false -g=true --skipInstall=true
```

#### Open your editor

To open Visual Studio Code, type the following:

```sh
cd ng-ewc{bundle}; code .
```

#### Add to package.json

In the dependencies section of package.json, add the following:

```sh
"@sencha/ext-web-components{bundle}": "~7.0.0",
"@webcomponents/webcomponentsjs": "^2.2.10",
```

#### Run npm install

in a terminal window at the root of your application, run the following:

```sh
npm install
```

#### Replace src/index.html (optional)

If you want to get a look at different styling...
Open the src/index.html file in the editor and replace the contents with the following:

```sh
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>ext-web-components{bundle} example</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
<style>
    :root {
        --base-color:black;
        --base-foreground-color:yellow;
        --color:darkblue;
        --background-color:lightgray;
        --hovered-background-color:darkgray;
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

#### Replace src/main.js

Open the src/main.js file in the editor and replace the contents with the following:

```sh
declare var Ext: any
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

function bootstrapModule() {
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.log(err));
}

//Ext.onReady(bootstrapModule)
window.addEventListener('WebComponentsReady', bootstrapModule);
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
```

#### Run the application

Type the following in a command/terminal window:

```sh
ng serve --open --port 4200
```

a page at http://localhost:4200 opens in a browser window and the EWC application will load

#### imports in the npm package module:
##### @sencha/ext-web-components{bundle}/ext-web-components{bundle}.module

{imports}