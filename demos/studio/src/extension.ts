import * as vscode from 'vscode';
import Main from './main';
var globalMain;
import { FileExplorer } from './fileExplorer';

export function activate(context: vscode.ExtensionContext) {
    var main = new Main(context);
    globalMain = main
 
    if (vscode.window.activeTextEditor != undefined) {
        main.createThePanel()
    }

    new FileExplorer(context);

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(e => {
        console.log('onDidChangeActiveTextEditor');
        if (vscode.window.activeTextEditor != undefined) {
            main.createThePanel()
        }
        else {
            //console.log('not EXT view')
        }
    }));

    context.subscriptions.push(
        vscode.commands.registerCommand("extension.toggleTerminal", () => {
//            _panel.reveal();
            vscode.commands.executeCommand("workbench.action.terminal.toggleTerminal").then(function () {});
        })
    );

}

export function deactivate() {}
