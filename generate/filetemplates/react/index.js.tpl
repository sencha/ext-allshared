import ReactDOM from 'react-dom';

//import './overrides';
//export { default as Template } from './Template';

const Ext = window['Ext'];
export function render(element, container, callback) {
  //console.log('in render')

  try {
  Ext.onReady(function () {
    //console.log('before render')
    ReactDOM.render(element, container, callback);
  });
  }
  catch(e) {
    console.log(e)
  }

};

const ExtReactDOM = {
  render: render
}
export default ExtReactDOM;

{reactImports}
{reactExports}
{reactExports70}
{reactExportsCase}