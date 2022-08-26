import * as vscode from "vscode";

export const strykerCommand = (): string =>
  vscode.workspace.getConfiguration().get("strykerRunner.stryker.command") ||
  `npx stryker`;
