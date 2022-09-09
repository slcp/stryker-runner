import * as vscode from 'vscode';
import { strykerCommand, strykerConfigFilePath } from './config';
import { makeReusableTerminal, runCommand } from './terminal';

export type CommandRunner = (args: { file: vscode.Uri; lineRange?: string }) => void;

const makeCommand = (file: vscode.Uri, lineRange?: string) => {
  const strykerBin = strykerCommand(file);
  const configFilePath = strykerConfigFilePath();
  const target = `${file.path}${lineRange ? `:${lineRange}` : ''}`;
  return `${strykerBin} run --mutate ${target}${configFilePath ? ` ${configFilePath}` : ''}`;
};

export const commandRunner = () => {
  const terminal = makeReusableTerminal({ name: 'Stryker' });

  return ({ file, lineRange }: { file: vscode.Uri; lineRange?: string }) => {
    const command = makeCommand(file, lineRange);

    runCommand(terminal())(command);
  };
};
