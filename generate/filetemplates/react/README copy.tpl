## @sencha/ext-react{bundle}

last run: {now}

This npm package contains the files that are needed to add the @sencha/ext-react{bundle} package to a React application


## Create the React application with create-react-app

- Run the following:

```sh
npx create-react-app ext-react-demo
```

- Add ExtReact to your application by running the following:

```sh
cd ext-react-demo
npm install @sencha/ext-react --save
cp -R node_modules/@sencha/ext-web-components/ext-runtime/ ./public/ext-runtime
```

- Open your editor

To open Visual Studio Code, type the following:

```sh
code .
```

(You can use any editor)





- Add the following to ./public/index.html

```sh
    <script src="%PUBLIC_URL%/ext-runtime/engine.js"></script>
    <link
        href="%PUBLIC_URL%/ext-runtime/MaterialTheme/MaterialTheme-all.css"
        rel="stylesheet" type="text/css"
    >
    <!--https://www.rapidtables.com/web/color/-->
    <style>
        :root {
            --base-color: darkblue;
            --base-foreground-color: yellow;
            --background-color: lightblue;
            --color: green;
        }
    </style>
```

- Replace ./src/App.js with:

```sh
import React from 'react';
import { ExtPanel, ExtButton } from "@sencha/ext-react";

function App() {
  return (
    <ExtPanel title="hi" shadow="true">
        <ExtButton text="hi" shadow="true"/>
        <h1>hello</h1>
        <ExtButton text="hi" shadow="true"/>
    </ExtPanel>
  );
}
export default App;
```

or

```sh
import React from 'react';
import { Panel, Button } from "@sencha/ext-react";

function App() {
  return (
    <Panel title="hi" shadow="true">
        <Button text="hi" shadow="true"/>
        <h1>hello</h1>
        <Button text="hi" shadow="true"/>
    </Panel>
  );
}
export default App;
```

- Run the following:

```sh
npm start
```

the ExtReact application will load in a browser window