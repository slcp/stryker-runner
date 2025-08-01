import * as vscode from 'vscode';
import {
  runStrykerOnFileCommand,
  runStrykerOnSelectionCommand,
  showMutantResultsCommand,
  hideMutantResultsCommand,
  toggleMutantResultsCommand,
} from './commands';
import { commandRunner } from './stryker';
import { mutantDecorationManager } from './mutant-decorations';

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

  let showMutantResults = vscode.commands.registerCommand(
    'stryker-runner.show-mutant-results',
    showMutantResultsCommand,
  );

  let hideMutantResults = vscode.commands.registerCommand(
    'stryker-runner.hide-mutant-results',
    hideMutantResultsCommand,
  );

  let toggleMutantResults = vscode.commands.registerCommand(
    'stryker-runner.toggle-mutant-results',
    toggleMutantResultsCommand,
  );

  context.subscriptions.push(runStrykerOnFile);
  context.subscriptions.push(runStrykerOnSelection);
  context.subscriptions.push(showMutantResults);
  context.subscriptions.push(hideMutantResults);
  context.subscriptions.push(toggleMutantResults);
}

export function deactivate() {
  mutantDecorationManager.dispose();
}
