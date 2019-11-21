exports.examples = (what, info) => {
    var r = ''
    switch(what) {

case 'component':
r = `
import React, { Component } from 'react';
import { ExtButton } from "@sencha/ext-react-button";

class App extends Component {

  render() {
    return (
      <ExtButton text="button1" shadow="true" onReady={ this.readyButton }></ExtButton>
    )
  }

  readyButton = event => {
    var button = event.detail.cmp;
    var data='ready';
    button.setText(data);
  }

}
export default App;
`
break;

default:
r = ``
break;

    }
    return r
}
