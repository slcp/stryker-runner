import * as vscode from 'vscode';
import { workspaceHasYarnLockFile } from './fs-helpers';

export const strykerCommand = (file?: vscode.Uri): string => {
  const userCommand = vscode.workspace.getConfiguration().get<string>('strykerRunner.stryker.command');
  if (userCommand) return userCommand;
  return useYarn(file) ? `yarn stryker` : `npx --no-install stryker`;
};

export const strykerConfigFilePath = (): string =>
  vscode.workspace.getConfiguration().get('strykerRunner.stryker.configFile') || '';

export const useYarn = (file?: vscode.Uri): boolean => {
  if (vscode.workspace.getConfiguration().get('strykerRunner.node.useYarn')) return true;
  if (!file) return false;
  if (workspaceHasYarnLockFile(file)) return true;
  return false;
};
