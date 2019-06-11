export default function header(fileName) {
    var html = `
    <div>this view: ${fileName}</div>
    <div style="position: absolute;top:5px;right:10px;">
        <button onclick="btnClick('0', 'All')"  class="btn"><i id="btnI0" class="fa fa-eye-slash"></i><span id="btn0"> All Off</span></button>

        <button onclick="btnClick('1', 'Left')"  class="btn"><i id="btnI1" class="fa fa-eye-slash"></i><span id="btn1"> Left Off</span></button>
        <button onclick="btnClick('2', 'Right')" class="btn"><i id="btnI2" class="fa fa-eye-slash"></i><span id="btn2"> Right Off</span></button>
        <button onclick="doTerminal()" class="btn"><i class="fa fa-bars"></i> Terminal</button>

        <!--
        <button id="btn2"  onclick="doPE()" class="btn"><i class="fa fa-bars"></i> Menu</button>
        <button id="btn2" class="btn"><i class="fa fa-trash"></i> Trash</button>
        <button id="btn3" class="btn"><i class="fa fa-close"></i> Close</button>
        <button id="btn4" class="btn"><i class="fa fa-folder"></i> Folder</button>
        -->
    </div>
    `
    return html;
}