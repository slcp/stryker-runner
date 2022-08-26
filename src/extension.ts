import * as vscode from "vscode";
import { commandRunner } from "./stryker";
import { isTestFile, showInvalidFileMessage } from "./valid-files";

export function activate(context: vscode.ExtensionContext) {
  const run = commandRunner();

  let runStrykerOnFile = vscode.commands.registerCommand(
    "stryker-runner.run-stryker-on-file",
    (...args) => {
      if (!(args[0] instanceof vscode.Uri)) return;
      const file = args[0];

      if (isTestFile(file)) {
        showInvalidFileMessage();
        return;
      }

      run({ path: file.path });
    }
  );

  let runStrykerOnSelection = vscode.commands.registerCommand(
    "stryker-runner.run-stryker-on-selection",
    (...args) => {
      if (!(args[0] instanceof vscode.Uri)) return;
      const file = args[0];

      if (isTestFile(file)) {
        showInvalidFileMessage();
        return;
      }

      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        console.log("No action, no active editor");
        return;
      }
      if (editor.selection.isEmpty) {
        console.log("No action, selection is single character");
        return;
      }

      const {
        selection: { start, end },
      } = editor;
      const startLine = start.line + 1; // Need to offset, why? Jest extension does this also. Zero indexed?
      const endLine = end.line + 1; // Need to offset, why? Jest extension does this also. Zero indexed?
      const lineRange = `${startLine}-${endLine}`;

      run({ path: file.path, lineRange });
    }
  );

  context.subscriptions.push(runStrykerOnFile);
  context.subscriptions.push(runStrykerOnSelection);
}

export function deactivate() {}
