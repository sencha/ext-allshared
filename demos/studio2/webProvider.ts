/* tslint:disable:quotemark */
"use strict";
import * as vscode from "vscode";
import * as path from "path";

export class WebProvider {

// <ext-panel title="Panel title2">
//     <ext-button text="Employees"></ext-button>
//     <ext-button text="Employees"></ext-button>
// </ext-panel>


    public getHtml(_text) {
var a = `
<!DOCTYPE html>
<html lang="en">

<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes">
<script nonce="5ucQm9Z6LQhehDMEZnySYON17arig2AH"  src="vscode-resource:/Volumes/BOOTCAMP/sencha-studio-extension/web/main.js"></script>
<script nonce="5ucQm9Z6LQhehDMEZnySYON17arig2AH"  src="vscode-resource:/Volumes/BOOTCAMP/sencha-studio-extension/web/SampleData.js"></script>
<script nonce="5ucQm9Z6LQhehDMEZnySYON17arig2AH"  src="vscode-resource:/Volumes/BOOTCAMP/sencha-studio-extension/web/studio.js"></script>
<link   nonce="5ucQm9Z6LQhehDMEZnySYON17arig2AH" href="vscode-resource:/Volumes/BOOTCAMP/sencha-studio-extension/web/studio.css" rel="stylesheet">
<link   nonce="5ucQm9Z6LQhehDMEZnySYON17arig2AH" href="vscode-resource:/Volumes/BOOTCAMP/sencha-studio-extension/web/tabs.css" rel="stylesheet">
<script>

window.addEventListener('myCustomEvent', function(e) {
    document.getElementById("xtype").innerHTML = e.detail.xtype;
})

Ext.on('viewportready', function() {
    var v = document.getElementById("ext-viewport");
    v.style.width = "calc(100% - 340px)";
    v.style.height = "calc(100% - 120px)";
    v.style.margin = "60px 190px 220px 170px";
});

<script>
function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}
</script>


</script>
</head>
<body>

<div class="header">
Sencha Studio View Designer
</div>

<div class="sidenav">
    <div class="search">
        <input type="search" required="" placeholder="Search components">
    </div>
    <a href="#about">About</a>
    <a href="#services">Services</a>
    <a href="#clients">Clients</a>
    <a href="#contact">Contact</a>
    <br/><br/>
    <div class="xtype" id="xtype">xtype</div>
</div>

${_text}

<div class="footer">
Author: Marc Gusmano
</div>

<div class="rightside">
    <a href="#about">About</a>
    <a href="#services">Services</a>
    <a href="#clients">Clients</a>
    <a href="#contact">Contact</a>

    <div class="tab">
        <button class="tablinks" onclick="openCity(event, 'London')">London</button>
        <button class="tablinks" onclick="openCity(event, 'Paris')">Paris</button>
        <button class="tablinks" onclick="openCity(event, 'Tokyo')">Tokyo</button>
    </div>
    
    <div id="London" class="tabcontent">
        <h3>London</h3>
        <p>London is the capital city of England.</p>
    </div>
    
    <div id="Paris" class="tabcontent">
        <h3>Paris</h3>
        <p>Paris is the capital of France.</p> 
    </div>
    
    <div id="Tokyo" class="tabcontent">
        <h3>Tokyo</h3>
        <p>Tokyo is the capital of Japan.</p>
    </div>



</div>

</body>
</html>
`
//console.log(a)
return a;
}

 


// document.addEventListener("DOMContentLoaded", function(event){
//     document.documentElement.style.width = "100%";
//     document.documentElement.style.height = "100%";
//     document.getElementById("iframe1").style.width = "100%";
//     document.getElementById("iframe1").style.height = "100%";
//     var doc = document.getElementById('iframe1').contentWindow.document;
//     doc.open();
//     doc.write(\`${l}\`);
//     doc.close();



    public createWebviewPanel(_extensionPath) {
        var _panel = vscode.window.createWebviewPanel(
            'EWC',
            'Tab Title',
            {
                viewColumn: vscode.ViewColumn.Two,
                preserveFocus: true,
            },
            {
                enableCommandUris: true,
                enableScripts: true,
                enableFindWidget: true,
                retainContextWhenHidden: true,
                // localResourceRoots: [
                //     vscode.Uri.file(path.join(_extensionPath, 'web')),
                //     vscode.Uri.file(path.join(_extensionPath)),
                // ]
            }
        );
        return _panel;
    }
    
    public constructor(private _context: vscode.ExtensionContext) { }

}