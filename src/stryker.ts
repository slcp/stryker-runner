import path from 'path';
import * as vscode from 'vscode';
import { strykerCommand, strykerConfigFilePath } from './config';
import { findNearestPackageJsonAncestor } from './fs-helpers';
import { makeReusableTerminal, runCommand } from './terminal';

export type CommandRunner = (args: { file: vscode.Uri; lineRange?: string }) => void;

const getRelativePath = (cwd: vscode.Uri, file: vscode.Uri): string => path.relative(cwd.fsPath, file.fsPath);

const getDesiredWorkingDirectory = (data: {
  file: vscode.Uri;
  packageJson: vscode.Uri | undefined;
  workspace: vscode.WorkspaceFolder | undefined;
}): vscode.Uri => {
  const { file, packageJson, workspace } = data;
  if (packageJson) return vscode.Uri.file(path.dirname(packageJson.fsPath));
  if (workspace) return workspace.uri;
  return vscode.Uri.file(path.dirname(file.fsPath));
};

const makeCommand = (data: { file: vscode.Uri; lineRange?: string; cwd: vscode.Uri }) => {
  const { file, lineRange, cwd } = data;
  const strykerBin = strykerCommand(file);
  const configFilePath = strykerConfigFilePath();
  const target = `${getRelativePath(cwd, file)}${lineRange ? `:${lineRange}` : ''}`;
  return `${strykerBin} run --mutate ${target}${configFilePath ? ` ${configFilePath}` : ''}`;
};

export const commandRunner = () => {
  const terminal = makeReusableTerminal({ name: 'Stryker' });

  return ({ file, lineRange }: { file: vscode.Uri; lineRange?: string }) => {
    const { uri } = findNearestPackageJsonAncestor(file);
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(file);
    const desiredWorkingDirectory = getDesiredWorkingDirectory({
      file,
      workspace: workspaceFolder,
      packageJson: uri,
    });
    const command = makeCommand({ file, lineRange, cwd: desiredWorkingDirectory });

    // Stryker will look up the file tree for a node_modules folder to symlink into the sandbox.
    // This command is intended to ensure one can be found as much as possible.
    runCommand(terminal())(`cd ${desiredWorkingDirectory.fsPath}`);
    runCommand(terminal())(command);
  };
};
