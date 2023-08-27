import { existsSync } from 'fs';
import path from 'path';
import * as vscode from 'vscode';

export const findFileInTree = (root: vscode.Uri, start: vscode.Uri, file: string): boolean => {
  if (existsSync(path.join(start.path, file))) return true;
  if (root.path === start.path) return false;
  return findFileInTree(root, vscode.Uri.file(path.dirname(start.path)), file);
};

export const workspaceHasYarnLockFile = (file: vscode.Uri): boolean => {
  const root = vscode.workspace.getWorkspaceFolder(file);
  if (!root) return false;
  if (!file.path.includes(root.uri.path)) return false;
  return findFileInTree(root.uri, file, 'yarn.lock');
};
