import * as vscode from 'vscode';
//import * as path from 'path';
import { HtmlProvider } from './htmlProvider';
let fs = require("fs");

export default class Main {
    private  _panel: any;
    public  _filePath: any;
    public  _fileName: any;
    public  _context: any;
    public  _htmlprovider: HtmlProvider;

    constructor(context: any) {
        this._context = context;
        this._htmlprovider = new HtmlProvider(this._context);
    }

    createThePanel() {
        this._filePath = vscode.window.activeTextEditor.document.fileName
        this._fileName = this._filePath.substr(this._filePath.lastIndexOf("/") + 1);
    
        if (this._panel == undefined) {
            this._panel = this._htmlprovider.createWebviewPanel();
            this._panel.webview.html = this.getTheHTML();

            this._panel.onDidDispose(() => {
                    this._panel = undefined
                },
                null,
                this._context.subscriptions
            );

            //just for dev
            setTimeout(function(){ 
                vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools");
                //vscode.commands.executeCommand("workbench.action.terminal.toggleTerminal").then(function () {});
            }, 1000);

            this.setMessages();
        }
    }

    getTheHTML() {
       //var viewStart = vscode.window.activeTextEditor.document.fileName.indexOf('View.js');
        var viewStart = this._filePath.indexOf('View.js');

        if (viewStart != -1) {
            console.log('is EXT view')
            try {
                var lastSlash = this._filePath.lastIndexOf("/");
                var folder = this._filePath.substring(0, lastSlash+1);
                var name = this._filePath.substring(lastSlash+1, viewStart);

 //               const view = vscode.window.activeTextEditor.document.getText();
                var view = '';
                try {view = fs.readFileSync(folder + name + 'View.js').toString()}
                catch(e) { view = '' }

                var viewcontroller = '';
                try {viewcontroller = fs.readFileSync(folder + name + 'ViewController.js').toString()}
                catch(e) { viewcontroller = '' }
    
                var viewmodel = '';
                try {viewmodel = fs.readFileSync(folder + name + 'ViewModel.js').toString()}
                catch(e) { viewmodel = '' }
    
                var viewstore = '';
                try {viewstore = fs.readFileSync(folder + name + 'ViewStore.js').toString()}
                catch(e) { viewstore = '' }
    
                var html = this._htmlprovider.getHtmlEXT(view, viewcontroller, viewmodel, viewstore, this._filePath, this._fileName);
                return html;
            }
            catch(e) {
                console.log(e)
                return ''
            }
        }
        else {
            console.log(vscode.window.activeTextEditor.document.fileName)
        }
    }

    setMessages() {
        this._panel.webview.onDidReceiveMessage (
            message => {
                console.log('got message: ' + message.command)

                switch (message.command) {
                    case 'columnSet':
                        try {
                            var addColumnReturn = this._htmlprovider.eparser.addColumn(message.data.text, message.data.dataIndex);
                            if (addColumnReturn == 0) {
                                var code = this._htmlprovider.eparser.generate()
                                let fs = require("fs");
                                fs.writeFileSync(this._filePath, code);
                                 var h = this.getTheHTML();
                                this._panel.webview.html = this.getTheHTML();
                            }
                            else {
                                vscode.window.showErrorMessage('addColumnReturn: ' + setPropertyReturn);
                            }
                        }
                        catch(e) {
                            console.log(e)
                        }
                        break;

                    case 'propertySet':
                        var setPropertyReturn = this._htmlprovider.eparser.setProperty(message.data.name, message.data.value)
                        if (setPropertyReturn == 0) {
                            var code = this._htmlprovider.eparser.generate()
                            let fs = require("fs");
                            fs.writeFileSync(this._filePath, code)
                        }
                        else {
                            vscode.window.showErrorMessage('setPropertyReturn: ' + setPropertyReturn);
                        }
                        break;

                    case 'showTerminal':
                        vscode.commands.executeCommand("workbench.action.terminal.toggleTerminal").then(function () {});
                        break;

                }
            },
            null,
            //this._disposables
        );
    }


}

    //public  get panel(): any {return this._panel}
    //public  set panel(value:any) {this._panel = value;}
