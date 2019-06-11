export default function dialogs() {
    var html = `
<div id="focusbox" style="z-index: 20000; position: fixed; left: -40px; top: -40px; width: 1px; height: 1px;">
    <div id="buttons" style="background: #025B80; border: 0px solid black; left: 0px; top: 0px; width: 50px; height: 20px;">
        <button onclick="focusbtnClick('1', 'Left')" class="focusbtn"><i id="btnI1" class="fa fa-eye-slash"></i><span></span></button>
    </div>
    <div id="infobox" style="box-shadow: 0 0 10px;background: blue; opacity: 0.2; border: 0px solid black; height: 41.9792px;"></div>
</div>
    `
    return html;
}