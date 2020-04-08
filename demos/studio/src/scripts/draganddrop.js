
Ext.on("viewportready", function() {
    var viewport = document.getElementById("ext-viewport");
    viewport.ondragover = function(event){
        //console.log('ondragover')
        event.preventDefault();
        if (prevElement != undefined) {
            prevElement.classList.remove("highlight");
        }
        var elementMouseIsOver = document.elementFromPoint(event.clientX, event.clientY);
        var currElement = elementMouseIsOver
        while (!currElement.className.includes("x-component ")) {
            currElement = currElement.parentNode
        }
        currElement.classList.add("highlight");
        prevElement = currElement;
    };
    viewport.ondrop = function(event){
//        console.log('ondrop')
event.preventDefault();
        var data = event.dataTransfer.getData("text");
        console.log('data')
        console.log(data)
        var elementMouseIsOver = document.elementFromPoint(event.clientX, event.clientY);
        var currElement = elementMouseIsOver
        while (!currElement.className.includes("x-component ")) {
            currElement = currElement.parentNode
        }
        //currElement.classList.add("highlight");
        var o = Ext.getCmp(currElement.id)
        var theClass = Ext.getClass(o);
        var x
        var prefix = theClass.$className.substring(0, 3);

        var classname; 
        if (prefix == 'Ext') {
            classname = theClass.$className
        }
        else {
            classname = theClass.superclass.$className
        }
        console.dir(Ext)
        console.dir(theClass)
        //console.log(o.xtype)
        //console.dir(event)
        document.getElementById("m-target").innerHTML = o.xtype
        document.getElementById("m-classname").innerHTML = classname
        document.getElementById("m-xtype").innerHTML = data

        const likeIt = document.getElementById('like-it');
        const modal = document.getElementById('demo-modal');
        modal.showModal(); 
    
        likeIt.addEventListener('click', () => {
            console.log('clicked')
            modal.close('Like it');
            vscode.postMessage({
                command: 'columnSet',
                data: {text: 'the phone', dataIndex: 'phone'}
            });

        });
    





        //var xtype = this.eparser.getProperty('xtype');
        //console.log(xtype)







    };


})
