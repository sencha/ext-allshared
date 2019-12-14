import ReactDOM from 'react-dom';
const Ext = window['Ext'];
function render(element, container, callback) {
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