## @sencha/ext-react-{toolkit}{bundle}

last run: {now}

This npm package contains the needed files to add the @sencha/ext-react-{toolkit}{bundle} package to a React application

## Login to the Sencha npm repo

production:

```sh
npm login --registry=https://npm.sencha.com/ --scope=@sencha
```

early adopter:

```sh
npm login --registry=https://sencha.myget.org/F/early-adopter/npm/ --scope=@sencha
```

## Create a React application with create-react-app

- Run the following:

```sh
npx create-react-app ext-react-{toolkit}{bundle}-demo --template @sencha/ext-react-{toolkit}{bundle}
```

create-react-app will create a new application using the ext-react-{toolkit}{bundle} template
(from the sencha/ext-react git repo)

- When create-react-app is completed, Run the following:

```sh
cd ext-react-{toolkit}{bundle}-demo
```

- Optionally, open your editor (You can use any editor)

To open Visual Studio Code, type the following:

```sh
code .
```

- To change the theme, edit 'public/index.html' and uncomment one of the links below this line:

```sh
<script src="%PUBLIC_URL%/ext-runtime-{toolkit}{bundle}/themes/css.{toolkit}.material.js"></script>
```

- To start the ExtReact application, run the following in a terminal window:

```sh
npm start
```

The ExtReact application will load in a browser window!

<hr>

#### The following was added to your ExtReact project

- Replaced ./src/index.js with:

```sh
import React from 'react';
//import ReactDOM from 'react-dom';
import ExtReactDOM from '@sencha/ext-react-classic';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ExtReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```

- Replaced ./src/App.js with:

```sh
import React, { Component } from 'react';
import { ExtGrid } from "@sencha/ext-react-classic";

class App extends Component {

  constructor() {
    super()
    var data=[
      { name: 'Marc', email: 'marc@gmail.com',priceChangePct: .25 },
      { name: 'Nick', email: 'nick@gmail.com',priceChangePct: .35 },
      { name: 'Andy', email: 'andy@gmail.com',priceChangePct: 1.45 }
    ]
    this.store = { xtype: 'store', data: data }
  }

  renderSign = (value, context) => {
    var iValue = parseInt(value);
    var color;
    if (iValue > 0)
      { color = 'green'; }
    else
      { color = 'red'; }
    return `<span style="color:${color};">
    ${value}
    <i class="fa fa-camera-retro fa-lg"></i>
    </span>`
  }

  render() {
    return (
      <ExtGrid
        extname="gridExt"
        viewport={ true }
        ref={ gridReact => this.gridReact = gridReact }
        title="The Grid"
        store={ this.store }
        onReady={ this.extReactDidMount }
        columns={[
          {text: "name", dataIndex: "name"},
          {text: "email", dataIndex: "email", flex: "1"},
          {text: "% Change", dataIndex: "priceChangePct", align: "right", producesHTML: false, renderer: this.renderSign}
        ]}
      >
      </ExtGrid>
    )
  }

  extReactDidMount = ({cmp, cmpObj}) => {
    for (var prop in cmpObj) {this[prop] = cmpObj[prop]}
    console.log(this['gridExt'])
    console.log(this.gridExt)
    console.log(this.gridReact.cmp)
  }

}
export default App;
```

