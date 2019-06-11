function getSuper(c, configurator, supers, allconfigs, initialconfigs, ultimate, obj) {
    //configurators.push({className: c.$className, configurator: configurator,  configuratorconfigs: configurator.configs})
    for (var configName in configurator.configs) {
        if (configurator.configs.hasOwnProperty(configName)) {
            var getter = 'get' + configName.charAt(0).toUpperCase() + configName.slice(1);
            var value = "N/A"
            var write = false
            try {
                var getterString = c[getter].toString();
                if (!getterString.includes('is a write-only config.')) {

                    //if (o[getter]() != undefined) {
                        write = true
                        value = o[getter]();
                    //}
                }
            }
            catch(e) {
                // console.log('error...')
                // console.dir(e)
                // console.dir(c)
            }

            var type = 'placeholder'; //obj.properties['type']

            // var types = obj.properties[name]
            // var type
            // if (types != null) {
            //     type = types[0].toString()
            // }
            // else {
            //     type = "undefined"
            // }
            //allconfigs.push({configName: configName, className: c.$className, value: value, write: write, types: types, type: type})
            allconfigs.push({"configName": configName, "className": c.$className, "value2": '', "type": type})
            }
    }

    //supers.push({name: c.$className, configs: theConfigs})
    supers.push({name: c.$className})

    if(c.superclass != undefined) {
        getSuper(c.superclass, configurator.superCfg, supers, allconfigs, initialconfigs, ultimate, obj)
    }
    else {
        allconfigs.sort((a,b) => (a.configName > b.configName) ? 1 : ((b.configName > a.configName) ? -1 : 0));
        // console.log('allconfigs')
        // console.dir(allconfigs)
        //use it
        //setTimeout(function() {
            // console.log(initialconfigs.length)
            // console.log(allconfigs.length)
    

            //ultimate = [];
            var i;
            if (initialconfigs.length == 0 ) {
                console.log('allconfigs')
                console.log(allconfigs)
                ultimate = allconfigs
                //ultimate.push(allconfigs)
            }
            else {
                for (i = 0; i < initialconfigs.length; i++) { 
                    //console.log(initialconfigs[i])
                    let obj = allconfigs.find(o => o.configName === initialconfigs[i].configName);
                    //console.log(obj)
                    const object3 = {...obj, ...initialconfigs[i] }
                    //console.log(object3)
                    ultimate.push(object3)
                }
            }



            //allconfigs = [];
            //initialconfigs = [];




//                }, 3000);
        //var allconfigsDOM = document.getElementById('allconfigs');
        //allconfigsDOM.data = ultimate;

        //window.dispatchEvent(new CustomEvent('configsEvent', {detail:{configs:allconfigs}}));
        //window.dispatchEvent(new CustomEvent('supersEvent', {detail:{supers:supers, configs:configs}}));
    }
}
