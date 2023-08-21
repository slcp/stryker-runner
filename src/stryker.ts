import * as vscode from 'vscode';
import { strykerCommand, strykerConfigFilePath } from './config';
import { makeReusableTerminal, runCommand } from './terminal';
import path from 'path';

export type CommandRunner = (args: { file: vscode.Uri; lineRange?: string }) => void;

const getRelativePath = (file: vscode.Uri): string => {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(file);
  if (workspaceFolder) {
    return path.relative(workspaceFolder.uri.fsPath, file.fsPath);
  }
  return file.fsPath;
};

const makeCommand = (file: vscode.Uri, lineRange?: string) => {
  const strykerBin = strykerCommand(file);
  const configFilePath = strykerConfigFilePath();
  const target = `${getRelativePath(file)}${lineRange ? `:${lineRange}` : ''}`;
  return `${strykerBin} run --mutate ${target}${configFilePath ? ` ${configFilePath}` : ''}`;
};

export const commandRunner = () => {
  const terminal = makeReusableTerminal({ name: 'Stryker' });

  return ({ file, lineRange }: { file: vscode.Uri; lineRange?: string }) => {
    const command = makeCommand(file, lineRange);

    runCommand(terminal())(command);
  };
};
