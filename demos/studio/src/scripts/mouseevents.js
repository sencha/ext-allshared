Ext.on("viewportready", function() {
    var viewport = document.getElementById("ext-viewport");

    viewport.addEventListener("mousemove", function(e){
        if (prevElement != undefined) {
            prevElement.classList.remove("highlight");
        }
        var elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
        var currElement = elementMouseIsOver
        while (!currElement.className.includes("x-component ")) {
            currElement = currElement.parentNode
        }
        currElement.classList.add("highlight");
        prevElement = currElement;
   });


   viewport.addEventListener('mouseup', e => {
    if (currentElementSelected != undefined) {
        currentElementSelected.classList.remove("highlightselect");
    }
    currentElementSelected = prevElement

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
    var classes = currentElementSelected.className.split(" ");
    var i;
    for (i = 0; i < classes.length; i++) { 
        if (components.includes(classes[i])) {
            break;
        }
    }

    var s = ""
    var keys = ""
    var keyVal = "set"
    var keysArray = [];
    var configsObject = [];
    var displayValue;
    var value;

    ultimate = [];


    var rect = currentElementSelected.getBoundingClientRect();
    var x = rect.left
    var y = rect.top
    var w = rect.right - rect.left
    var h = rect.bottom - rect.top
    var top = y - 20
    var height = h + 20

    var infobox = document.getElementById('infobox');
    infobox.style.height = h + 'px';

    var focusbox = document.getElementById('focusbox');
    focusbox.style.left = x + 'px';
    focusbox.style.top = top + 'px';
    focusbox.style.width = w + 'px';
    focusbox.style.height = height + 'px';

    var o = Ext.getCmp(currentElementSelected.id)
    var theClass = Ext.getClass(o);
    window.o = o;
    var xtype = o.xtype;

    var docs = getDocs(xtype);

    var theSupers = []
    var allconfigs = []
    var ultimateconfigs = []

    getSuper(theClass, theClass.$config, theSupers, allconfigs, initialconfigs, ultimateconfigs, docs);

    window.dispatchEvent(new CustomEvent('xtypeEvent', {detail:{xtype:xtype}}));
    window.dispatchEvent(new CustomEvent('supersEvent', {detail:{supers:theSupers}}));
    window.dispatchEvent(new CustomEvent('ultimateEvent', {detail:{configs:ultimateconfigs}}));
    window.dispatchEvent(new CustomEvent('allEvent', {detail:{configs:allconfigs}}));

    console.dir(docs)
    console.dir(allconfigs)
    console.dir(initialconfigs)
    console.dir(ultimateconfigs)


    });


}); //viewportready