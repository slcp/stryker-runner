import * as vscode from 'vscode';
import path from 'path';
import { existsSync, readFileSync } from 'fs';
import { StrykerResults } from './code-lens.type';

export const findFileInTree = (root: vscode.Uri, start: vscode.Uri, file: string): boolean => {
  if (existsSync(`${start.path}${path.sep}${file}`)) return true;
  if (root.path === start.path) return false;
  return findFileInTree(root, vscode.Uri.file(start.path.substring(0, start.path.lastIndexOf(path.sep))), file);
};

export const workspaceHasYarnLockFile = (file: vscode.Uri): boolean => {
  const root = vscode.workspace.getWorkspaceFolder(file);
  if (!root) return false;
  if (!file.path.includes(root.uri.path)) return false;
  return findFileInTree(root.uri, file, 'yarn.lock');
};

export const loadStrykerResults = (context: vscode.Uri): StrykerResults => {
  const folder = vscode.workspace.getWorkspaceFolder(context);
  // const defaultResultsPath = 'reports/stryker-incremental.json';
  const userPath = '/test/stryker/stryker-incremental.json';
  const strykerResults = JSON.parse(readFileSync(`${folder?.uri.path}/${userPath}`).toString()) as StrykerResults;
  return strykerResults;
};
