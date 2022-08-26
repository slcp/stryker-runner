import * as vscode from "vscode";

export const strykerCommand = (): string => {
  const defaultCommand = useYarn() ? `yarn stryker` : `npx stryker`;
  return (
    vscode.workspace.getConfiguration().get("strykerRunner.stryker.command") ||
    defaultCommand
  );
};

export const strykerConfigFilePath = (): string | undefined =>
  vscode.workspace.getConfiguration().get("strykerRunner.stryker.configFile");

export const useYarn = (): boolean =>
  vscode.workspace.getConfiguration().get("strykerRunner.node.useYarn") ||
  false;
