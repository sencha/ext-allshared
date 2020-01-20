import ReactDOM from 'react-dom';

import './overrides';
export { default as Template } from './Template';

const Ext = window['Ext'];
export function render(element, container, callback) {
  //console.log('in render')
  Ext.onReady(function () {
    //console.log('before render')
    ReactDOM.render(element, container, callback);
  });
};

const ExtReactDOM = {
  render: render
}
export default ExtReactDOM;

{reactImports}
{reactExports}
{reactExports70}
{reactExportsCase}