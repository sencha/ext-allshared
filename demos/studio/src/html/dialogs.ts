export default function dialogs() {
    var html = `

<dialog id="demo-modal">
    <h3 class="modal-header">
        <span>dropped...</span>
    </h3>
    <div class="modal-body">
        <div>drag component: <span id="m-xtype"></span></div>

        <div>drop target: <span id="m-target"></span></div>
        <div>target class name: <span id="m-classname"></span></div>

    </div>
    <footer class="modal-footer">
        <button id="like-it" type="button">Close</button>
    </footer>
    <button id="close" class="close" type="button">
        <span>&times;</span>
    </button>
</dialog>

<dialog id="focus-modal">
    <h3 class="focus-header">
        <span>dropped...</span>
    </h3>
    <div class="focus-body">
        <div>drag component: <span id="focus-xtype"></span></div>

        <div>drop target: <span id="focus-target"></span></div>
        <div>target class name: <span id="focus-classname"></span></div>

    </div>
    <footer class="focus-footer">
        <button id="like-it" type="button">Close</button>
    </footer>
    <button id="close" class="close" type="button">
        <span>&times;</span>
    </button>
</dialog>


    `
    return html;
}