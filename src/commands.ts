import * as vscode from 'vscode';
import { CommandRunner } from './stryker';
import { isTestFile, showInvalidFileMessage } from './valid-files';
import { mutantDecorationManager } from './mutant-decorations';

export const runStrykerOnFileCommand =
  (run: CommandRunner) =>
  async (...args: unknown[]) => {
    if (!(args[0] && args[0] instanceof vscode.Uri)) return;
    const file = args[0];

    if (isTestFile(file)) {
      await showInvalidFileMessage();
      return;
    }

    run({ file });
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

    run({ file, lineRange });
  };

export const showMutantResultsCommand = async () => {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder found');
    return;
  }

  const success = await mutantDecorationManager.loadStrykerReport(workspaceFolder);
  if (success) {
    mutantDecorationManager.enable();
    vscode.window.showInformationMessage('Mutant results are now visible in the editor');
  }
};

export const hideMutantResultsCommand = () => {
  mutantDecorationManager.disable();
  vscode.window.showInformationMessage('Mutant results are now hidden');
};

export const toggleMutantResultsCommand = async () => {
  if (mutantDecorationManager.isDecorationEnabled()) {
    hideMutantResultsCommand();
  } else {
    await showMutantResultsCommand();
  }
};
