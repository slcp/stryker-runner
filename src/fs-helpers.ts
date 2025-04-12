import * as vscode from 'vscode';
import path from 'path';
import { existsSync, readFileSync } from 'fs';
import { StrykerResults } from './code-lens.type';

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

export const findNearestPackageJsonAncestor = (
  file: vscode.Uri,
): { success: true; uri: vscode.Uri } | { success: false; uri: undefined } => {
  const root = vscode.workspace.getWorkspaceFolder(file);
  if (!root) return { success: false, uri: undefined };
  if (!file.path.includes(root.uri.path)) return { success: false, uri: undefined };
  const maybeUri = findFileInTree(root.uri, file, 'package.json');
  if (maybeUri) return { success: true, uri: maybeUri };
  return { success: false, uri: maybeUri };
};

export const loadStrykerResults = (context: vscode.Uri): StrykerResults => {
  const folder = vscode.workspace.getWorkspaceFolder(context);
  const defaultResultsPath = 'reports/stryker-incremental.json';
  const strykerResults = JSON.parse(
    readFileSync(`${folder?.uri.path}/${defaultResultsPath}`).toString(),
  ) as StrykerResults;
  return strykerResults;
};
