import React from 'react';
import ReactDOM from 'react-dom';
//import ReactCell from './ReactCell.js';
//<script src="%PUBLIC_URL%/css.all.js"></script>
//<script src="%PUBLIC_URL%/ext.all.js"></script>
//<script src="%PUBLIC_URL%/ReactCell.js"></script>

function syncEvent(node, eventName, newEventHandler) {
    const eventNameLc = eventName[0].toLowerCase() + eventName.substring(1);
    const eventStore = node.__events || (node.__events = {});
    const oldEventHandler = eventStore[eventNameLc];
    if (oldEventHandler) {
        node.removeEventListener(eventNameLc, oldEventHandler);
    }
    if (newEventHandler) {
        node.addEventListener(eventNameLc, eventStore[eventNameLc] = function handler(e) {
            newEventHandler.call(this, e);
        });
    }
}

export default function (CustomElement) {
    if (typeof CustomElement !== 'function') {
        throw new Error('Given element is not a valid constructor');
    }
    const tagName = (new CustomElement()).tagName;

    function toPascalCase(s) {
        return s.match(/[a-z]+/gi)
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
            })
            .join('')
    }
    const displayName = toPascalCase(tagName)

    class ReactComponent extends React.Component {
        constructor() {
            super()
        }

        static get displayName() {
            return displayName;
        }

        componentDidMount() {
            const node = ReactDOM.findDOMNode(this);

            Object.keys(this.props).forEach(name => {
                //console.log(name)
                if (name === 'children' || name === 'style') {
                    return;
                }
                if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
                    syncEvent(node, name.substring(2), this.props[name]);
                }
                else {
                    node[name] = this.props[name];
                }
            });
        }

        // componentDidUpdate(prevProps, prevState) {
        //     //console.log('componentDidUpdate')
        // }

        // componentWillUnmount() {
        //     //console.log('componentWillUnmount')
        //     //console.log(this.element)
        //     //var r = React.isValidElement(this.element)
        //     //console.log(r)
        // }

        render() {
            this.element = React.createElement(tagName, { style: this.props.style }, this.props.children);
            return this.element;
        }
    }

    const proto = CustomElement.prototype;
    Object.getOwnPropertyNames(proto).forEach(prop => {
       Object.defineProperty(ReactComponent.prototype, prop, Object.getOwnPropertyDescriptor(proto, prop));
    });

    return ReactComponent;
}
