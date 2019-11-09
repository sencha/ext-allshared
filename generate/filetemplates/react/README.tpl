## @sencha/ext-react

last run: {now}

This npm package contains the minimum files that are needed to provide for the @sencha/ext-react package for a React application

## Test with create-react-app

- Run the following:

```sh
npx create-react-app ext-react-example
cd ext-react-example
npm install @sencha/ext-react --save
cp node_modules/@sencha/ext-web-components/ext ./public/ext
```

- Add the following to ./public/index.html

```sh
    <script src="%PUBLIC_URL%/ext/ext.blank.js"></script>
    <link  href="%PUBLIC_URL%/ext/MaterialTheme/MaterialTheme-all.css" rel="stylesheet" type="text/css">
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
