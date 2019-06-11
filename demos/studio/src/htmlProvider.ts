/* tslint:disable:quotemark */
"use strict";
import * as vscode from "vscode";
import * as path from "path";
import Eparser from "./Eparser"

import head from "./html/head"
import header from "./html/header"
import left from "./html/left"
import right from "./html/right"
import footer from "./html/footer"

import colors from "./html/colors"
import dialogs from "./html/dialogs"
import focusbox from "./html/focusbox"

import { any } from "prop-types";

export class HtmlProvider {
    eparser: Eparser;
    className: any;
    properties: any;
    panel: any;
    filePath: any;
    fileName: any;

    public constructor(private context: vscode.ExtensionContext) {
 //       this.parser = new Parser();
    }

    public getHtmlEXT(_view, _viewcontroller, _viewmodel, _viewstore, _filePath, _fileName) {
        this.eparser = new Eparser(_view)
        this.filePath = _filePath;
        this.fileName = _fileName;
        this.className = this.eparser.className;
        this.properties = this.eparser.properties;
        var xtype = this.eparser.getProperty('xtype');

        var a = `
<!DOCTYPE HTML>
<html>
<head>${head()}</head>

<style>
.container {
    display: grid;
    width: 100vw;  height: 100vh;
    grid-template-columns: 300px 5px auto 5px 300px;
    grid-template-rows: 35px auto 35px;
    grid-template-areas:
        "header header header header header"
        "left split1 content split2 right"
        "footer footer footer footer footer";
}
.header  { grid-area: header;  padding: 10px; background: #3D474C; color: white; 
    box-shadow: inset 0 0 10px white;
    xbox-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2);

}
.left    { grid-area: left;    padding: 10px; background: #32373a; color: white; display: flex; flex-direction: column;}
.split1  { grid-area: split1;  cursor: ew-resize; background: var(--vscode-tab-activeBackground); }
.content { grid-area: content; padding: 20px;
    background-size: 20px 20px;
    xbackground-color: rgb(232, 232, 232);
    background-color: var(--vscode-tab-inactiveForeground);
    background-image: linear-gradient(0deg, rgb(245, 245, 245) 1.1px, transparent 0px), linear-gradient(90deg, rgb(245, 245, 245) 1.1px, transparent 0px);
}
.split2  { grid-area: split2;  cursor: ew-resize; background: var(--vscode-tab-activeBackground); }
.right   { grid-area: right;   padding: 10px; background: #32373a; color: white; display: flex; flex-direction: column;}
.footer  { grid-area: footer;  padding: 10px; background: #3D474C; color: white; }
</style>

<script>
    ${_viewcontroller}
    ${_viewmodel}
    ${_viewstore}
    ${_view}
    Ext.application({
        name: 'EXTApp',
        launch: function () {
            Ext.Viewport.add([{xtype: '${xtype}'}])
        }
    });
</script>

<body>
    <div id="container" class="container">
        <div class="header">${header(this.fileName)}</div>
        <div class="left">${left()}</div>
        <div id="split1" class="split1"></div>
        <div id="content" class="content"></div>
        <div id="split2" class="split2"></div>
        <div class="right">${right()}</div>
        <div class="footer">${footer(this.filePath)}</div>

    </div>
    ${focusbox()}
    <div class="dialogs">${dialogs()}</div>


</body>

</html>
`
        return a
    }

    public createWebviewPanel() {
        this.panel = vscode.window.createWebviewPanel(
            'EXT',
            'Ext JS Designer',
            {
                viewColumn: vscode.ViewColumn.Beside,
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
        return this.panel;
    }
}
