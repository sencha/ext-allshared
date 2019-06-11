var prevElement;
Ext.on('viewportready', function() {
    console.log('viewportready');
    var element = document.getElementById("ext-viewport");
    var fl = document.createElement('div');
    fl.id="floater";
    fl.innerHTML = "";
    fl.classList.add("floater");
    element.appendChild(fl);

    element.addEventListener("mousemove", function(e){
        if (prevElement != undefined) {
            prevElement.classList.remove("highlight");
        }
        var elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
        var currElement = elementMouseIsOver
        console.log(currElement.className)
        while (!currElement.className.includes("x-component ")) {
            currElement = currElement.parentNode
        }
        currElement.classList.add("highlight");
        prevElement = currElement
        //console.log(currElement.className)
        var components = [
            "x-panel",
            "x-button",
            "x-list",
            "x-dataview",
            "x-titlebar",
            "x-container",
            "x-field",
            "x-searchfield",
            "x-textfield",
            "x-component",
            "x-gridcolumn",
            "x-paneltitle"
        ];
        var classes = currElement.className.split(" ");
        var i;
        for (i = 0; i < classes.length; i++) { 
            if (components.includes(classes[i])) {
                break;
            }
        }
        var s = ""
        var displayValue;
        var value;
        var o = Ext.getCmp(currElement.id)
        for(var key in o.config) {
            value = o[key];
            try {
                const parsedProp = JSON.parse(value);
                if (parsedProp === null ||
                    parsedProp === undefined ||
                    parsedProp === true ||
                    parsedProp === false ||
                    parsedProp === Object(parsedProp) ||
                    (!isNaN(parsedProp) && parsedProp !== 0))
                {
                    displayValue = parsedProp;
                    if (parsedProp != undefined) {
                        s = s + key + ": " + parsedProp + "<br/>"
                    }
                } 
                else
                {
                    displayValue = value;
                    if (value != undefined) {
                        s = s + key + ": " + value + "<br/>"
                    }
                }
            }
            catch(e) {
                displayValue = value;
                if (value != undefined) {
                    s = s + key + ": " + value + "<br/>"
                }
            }
        }

        var fl = document.getElementById("floater");
        fl.innerHTML =
            Ext.getCmp(currElement.id).xtype
            + "<br/><br/>"
            + s
      });

});