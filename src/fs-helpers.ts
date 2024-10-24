import * as vscode from 'vscode';
import path from 'path';
import { existsSync } from 'fs';

export const findFileInTree = (root: vscode.Uri, start: vscode.Uri, file: string): vscode.Uri | undefined => {
  const pathToTest = `${start.path}${path.sep}${file}`;
  if (existsSync(pathToTest)) return vscode.Uri.file(pathToTest);
  if (root.path === start.path) return undefined;
  // Not using path.dirname here allows more meaningful unit testing of windows paths
  return findFileInTree(root, vscode.Uri.file(start.path.substring(0, start.path.lastIndexOf(path.sep))), file);
};

export const fileExistsInTree = (root: vscode.Uri, start: vscode.Uri, file: string): boolean =>
  !!findFileInTree(root, start, file);

export const workspaceHasYarnLockFile = (file: vscode.Uri): boolean => {
  const root = vscode.workspace.getWorkspaceFolder(file);
  if (!root) return false;
  if (!file.path.includes(root.uri.path)) return false;
  return fileExistsInTree(root.uri, file, 'yarn.lock');
};

export const findNearestPackageJsonAncestor = (file: vscode.Uri): { success: boolean; uri: vscode.Uri | undefined } => {
  const root = vscode.workspace.getWorkspaceFolder(file);
  if (!root) return { success: false, uri: undefined };
  if (!file.path.includes(root.uri.path)) return { success: false, uri: undefined };
  const maybeUri = findFileInTree(root.uri, file, 'package.json');
  return { success: !!maybeUri, uri: maybeUri };
};
