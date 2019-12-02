exports.examples = (what, info) => {
    var r = ''
    switch(what) {

case 'component':
r = `
import React, { Component } from 'react';
import { ExtPanel } from "@sencha/ext-react-button";

class App extends Component {

  render() {
    return (
      <ExtPanel title="panel1" shadow="true" onReady={ this.readyPanel }></ExtPanel>
    )
  }

  readyPanel = event => {
    var panel = event.detail.cmp;
    var data='ready';
    panel.setTitle(data);
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
