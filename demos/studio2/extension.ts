import { Uri, WebviewOptions, commands, ExtensionContext, window, TreeDataProvider } from 'vscode';
import * as vscode from 'vscode';
//import { basename } from 'path';
//import * as path from 'path';
import { FileExplorer } from './fileExplorer';


import { WebProvider } from './webProvider';
var _provider;
var _panel;
//var _extensionPath;
var _text = '';

export function activate(context: ExtensionContext) {

    context.subscriptions.push(window.onDidChangeActiveTextEditor(e => {
        console.log('onDidChangeActiveTextEditor')
        _text = window.activeTextEditor.document.getText();
        console.log(_text)
        _panel.webview.html = _provider.getHtml(_text);
       _panel.webview.postMessage({ command: 'refactor' });
    }));



    //_extensionPath = context.extensionPath;
    _provider = new WebProvider(context);
    _panel = _provider.createWebviewPanel(context);
    _text = `
<ext-panel title="Panel title2">
    <ext-button text="Employees"></ext-button>
    <ext-button text="Employees"></ext-button>
</ext-panel>
    `
    _panel.webview.html = _provider.getHtml(_text);



    new FileExplorer(context);

    // commands.executeCommand("explorer.openEditors.visible", false).then(function () {
    // });

//    let uri = Uri.file('/some/path/to/folder');
//let success = await commands.executeCommand('vscode.openFolder', uri);

//	const nodeDependenciesProvider = new DepNodeProvider();
//	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);

    context.subscriptions.push(
        commands.registerCommand("extension.toggleTerminal", () => {
            console.log('here')
            _panel.reveal();
            commands.executeCommand("workbench.action.terminal.toggleTerminal").then(function () {
            });
    }));

//    commands.getCommands().then(function(value) {
 //   });

  _panel.webview.onDidReceiveMessage(
    message => {
      console.log('message')
      switch (message.command) {
        case 'alert':
          vscode.window.showErrorMessage(message.text);
          return;
      }
    },
    null,
    this._disposables
  );

//   _panel.onDidChangeViewState(e => {
//       const panel = e.webviewPanel;
//       console.log('onDidChangeViewState')
//       console.log(panel)
//     },
//     null,
//     context.subscriptions
//   );

}

export function deactivate() {}





// function getEditorInfo(): { editorText: string; } {
//     const editor = window.activeTextEditor;
//     const editorText = editor.document.getText();
//     return { editorText };
//   }




// function setPanel(): void {
//     console.log('setPanel')
//     //const info = getEditorInfo();

//     //_text = info.editorText
//     _text = window.activeTextEditor.document.getText();

// //    _panel.webview.html = _provider.getHtmlForWebview3(_text, _extensionPath);
//     _panel.webview.html = _provider.getHtml(_text);

//    //_panel.reveal();
//    _panel.webview.postMessage({ command: 'refactor' });
// }
