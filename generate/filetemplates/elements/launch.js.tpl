import ReactDOM from 'react-dom';
const Ext = window['Ext'];

export function launch(rootComponent, target) {
  //console.log('launch')
  Ext.onReady(function() {
    ReactDOM.render(rootComponent, target);
  });
}