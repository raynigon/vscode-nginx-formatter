'use strict';

import * as vscode from 'vscode';
import * as nginx from 'nginx-conf';

export function activate(context: vscode.ExtensionContext) {

    // 👍 formatter implemented using API
    vscode.languages.registerDocumentFormattingEditProvider('NGINX', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
            const promise = new Promise<vscode.TextEdit[]>((resolve, reject)=>{
                nginx.parse(document.getText(), (error, tree)=>{
                    if(error!=null){
                        vscode.window.showErrorMessage("Unable to parse Document: "+error);
                        reject("Unable to parse Document: "+error);
                        return;
                    }
                    const text = (new nginx.NginxConfFile(tree)).toString();
                    const firstLine = document.lineAt(0);
                    const lastLine = document.lineAt(document.lineCount - 1);
                    const range = new vscode.Range(0, 
                        firstLine.range.start.character, 
                        document.lineCount - 1, 
                        lastLine.range.end.character);
                    resolve([vscode.TextEdit.replace(range, text)]);
                });
            });
           return promise;
        }
    });
}


