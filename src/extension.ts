import * as vscode from 'vscode';
import { StrykerRunnerCodeLensProvider } from './code-lens';
import { runStrykerOnFileCommand, runStrykerOnSelectionCommand } from './commands';
import { commandRunner } from './stryker';
import { getLogger } from './logger';

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

  getLogger().log('Activating prior to registering lense provider');
  const codeLensProvider = new StrykerRunnerCodeLensProvider();
  const codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(
    [
      { language: 'typescript', scheme: 'file' },
      { language: 'javascript', scheme: 'file' },
    ],
    codeLensProvider,
  );
  context.subscriptions.push(codeLensProviderDisposable);

  context.subscriptions.push(runStrykerOnFile);
  context.subscriptions.push(runStrykerOnSelection);
}

export function deactivate() {}
