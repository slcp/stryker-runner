import * as vscode from "vscode";

const IS_TEST_FILE_REGEX = new RegExp(/^.*(?<!\.test)\.[tj]s$/);

export const isTestFile = (file: vscode.Uri) =>
  !file.path.match(IS_TEST_FILE_REGEX);

export const showInvalidFileMessage = () =>
  vscode.window.showErrorMessage("Cannot run Stryker on test files");
