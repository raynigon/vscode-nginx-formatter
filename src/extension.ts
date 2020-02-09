"use strict";

import * as vscode from "vscode";
import * as nginxbeautifier from "nginxbeautifier";
import { FormattingOptions } from "vscode";

function formatText(text: string) {
  let lines = nginxbeautifier.clean_lines(text);
  lines = nginxbeautifier.join_opening_bracket(lines);
  lines = nginxbeautifier.perform_indentation(lines);
  // Disable perform_alignment due to Bug in Library
  // lines = nginxbeautifier.perform_alignment(lines);
  return lines.join("\n");
}

function replaceTextInDocument(newText: string, document: vscode.TextDocument) {
  const firstLine = document.lineAt(0);
  const lastLine = document.lineAt(document.lineCount - 1);
  const range = new vscode.Range(
    0,
    firstLine.range.start.character,
    document.lineCount - 1,
    lastLine.range.end.character
  );
  return vscode.TextEdit.replace(range, newText);
}

export function activate(context: vscode.ExtensionContext) {
  // 👍 formatter implemented using API
  vscode.languages.registerDocumentFormattingEditProvider("nginx", {
    async provideDocumentFormattingEdits(
      document: vscode.TextDocument,
      options: FormattingOptions
    ): Promise<vscode.TextEdit[]> {
      nginxbeautifier.modifyOptions({
        INDENTATION: options.insertSpaces ? " ".repeat(options.tabSize) : "\t"
      });
      const text = formatText(document.getText());
      return [replaceTextInDocument(text, document)];
    }
  });
}
