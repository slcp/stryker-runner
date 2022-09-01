import * as vscode from "vscode";

const IS_TEST_FILE_REGEX = new RegExp(/^.*(?<!\.(test|spec))\.[tj]s$/);

export const isTestFile = (file: vscode.Uri) =>
  !file.path.match(IS_TEST_FILE_REGEX);

export const showInvalidFileMessage = async () =>
  await vscode.window.showErrorMessage("Cannot run Stryker on test files");
