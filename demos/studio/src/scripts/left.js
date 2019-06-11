window.left = {}

window.left.dragover = function(event) {
    event.preventDefault();
};

window.left.drop = function(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
};

window.left.dragstart = function(event) {
    //    console.dir(ev.srcElement.innerText)
    //    var text = event.srcElement.innerText
    //event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text", event.target.id);
    //ev.dataTransfer.setData("text", ev.target.id);
}
