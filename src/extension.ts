import * as vscode from 'vscode';
import { runStrykerOnFileCommand, runStrykerOnSelectionCommand } from './commands';
import { commandRunner } from './stryker';

export function activate(context: vscode.ExtensionContext) {
  const run = commandRunner();

  let runStrykerOnFile = vscode.commands.registerCommand(
    'stryker-runner.run-stryker-on-file',
    runStrykerOnFileCommand(run),
  );

  let runStrykerOnSelection = vscode.commands.registerCommand(
    'stryker-runner.run-stryker-on-selection',
    runStrykerOnSelectionCommand(run),
  );

  context.subscriptions.push(runStrykerOnFile);
  context.subscriptions.push(runStrykerOnSelection);
}

export function deactivate() {}
