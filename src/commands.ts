import * as vscode from 'vscode';
import { CommandRunner } from './stryker';
import { isTestFile, showInvalidFileMessage } from './valid-files';

export const runStrykerOnFileCommand =
  (run: CommandRunner) =>
  async (...args: unknown[]) => {
    if (!(args[0] && args[0] instanceof vscode.Uri)) return;
    const file = args[0];

    if (isTestFile(file)) {
      await showInvalidFileMessage();
      return;
    }

    run({ path: file.path });
  };

export const runStrykerOnSelectionCommand =
  (run: CommandRunner) =>
  async (...args: unknown[]) => {
    if (!(args[0] instanceof vscode.Uri)) return;
    const file = args[0];

    if (isTestFile(file)) {
      await showInvalidFileMessage();
      return;
    }

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      console.log('No action, no active editor');
      return;
    }
    if (editor.selection.isEmpty) {
      console.log('No action, selection is single character');
      return;
    }

    const {
      selection: { start, end },
    } = editor;
    const startLine = start.line + 1; // Need to offset, why? Jest extension does this also. Zero indexed?
    const endLine = end.line + 1; // Need to offset, why? Jest extension does this also. Zero indexed?
    const lineRange = `${startLine}-${endLine}`;

    run({ path: file.path, lineRange });
  };
