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
npm start
```

open http://localhost:4200 in a browser - the EWC application will load

#### components in this package:

{wantedxtypes}