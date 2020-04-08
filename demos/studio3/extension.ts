import { Uri, ViewColumn, ExtensionContext, StatusBarAlignment, window, StatusBarItem, Selection, workspace, TextEditor, commands } from 'vscode';
import * as vscode from 'vscode';
import { basename } from 'path';
import * as path from 'path';
var _panel
var _extensionPath
var _text = 'start'

function getHtmlForWebview3(text, extensionPath) {
    var html = `
<ext-panel title="Panel title">
    <ext-button text="Employees"></ext-button>
    <ext-button text="Employees"></ext-button>
</ext-panel>
    `
    var page = `
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
</head>
<body>
    ${html}
</body>
`
    return page;
}

function getEditorInfo(): { editorText: string; } {
    const editor = window.activeTextEditor;
    const editorText = editor.document.getText();
    return { editorText };
  }
  

function setPanel(): void {
    console.log('setPanel')
    const info = getEditorInfo();
    _text = info.editorText
    _panel.webview.html = getHtmlForWebview3(_text, _extensionPath);
   //_panel.reveal();
   _panel.webview.postMessage({ command: 'refactor' });
}
  

export function activate(context: ExtensionContext) {
  _extensionPath = context.extensionPath
  _panel = window.createWebviewPanel(
    'EWC',
    'Tab Title',
    {
      viewColumn: vscode.ViewColumn.Two,
      preserveFocus: true,
    },
    {
      enableScripts: true,
    //   localResourceRoots: [
    //     vscode.Uri.file(path.join(_extensionPath, 'web')),
    //     vscode.Uri.file(path.join(_extensionPath)),
    //   ]
    }
  );
  console.log('_panel created');

  context.subscriptions.push(window.onDidChangeActiveTextEditor(e => setPanel()));

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
