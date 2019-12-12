//******* props start */
//createProps(properties, propertiesobject, events, eventnames) {
createProps(properties, events) {
    var props = this.currentEl.A.props;
    props.xtype = this.xtype;
    let listenersProvided = false;
    for (var i = 0; i < properties.length; i++) {
        var prop = properties[i];
        if (prop == 'handler') {
            if (this[prop] != undefined) {
                props[prop] = this[prop];
            }
        }
        //need to handle listeners coming in here
        if ((props.xtype === 'cartesian' || props.xtype === 'polar') && prop === 'layout') {
        }
        else if (prop == 'listeners' && this[prop] != undefined) {
            props[prop] = this[prop];
            listenersProvided = true;
        }
        else {
            if (this[prop] != undefined &&
                prop != 'listeners' &&
                prop != 'config' &&
                prop != 'handler' &&
                prop != 'fitToParent') {
                props[prop] = this[prop];
            }
        }
    }
    if (true === this['fitToParent']) {
        props.top = 0,
            props.left = 0,
            props.width = '100%',
            props.height = '100%';
    }
    if (this['config'] !== {}) {
        Ext.apply(props, this['config']);
    }
    if (!listenersProvided) {
        props.listeners = {};
        var me = this;
        events.forEach(function (event) {
            let eventname = event.name;
            let eventparameters = event.parameters;
            me.currentEl.A.props.listeners[eventname] = function () {
                //console.log('in the event ' + eventname)
                let parameters = eventparameters;
                let parms = parameters.split(',');
                let args = Array.prototype.slice.call(arguments);
                let emitparms = {};
                if (me._extitems != undefined) {
                    for (let i = 0, j = parms.length; i < j; i++) {
                        emitparms[parms[i]] = args[i];
                    }
                    me[eventname].emit(emitparms);
                }
                else {
                }
            };
        });
    }
    //dup??
    if (this._extitems != undefined) {
        events.forEach((event, n) => {
            if (event != 'fullscreen') {
                this[event] = new EventEmitter();
            }
            else {
                this[event + 'event'] = new EventEmitter();
            }
        });
    }
}
//******* props end */
