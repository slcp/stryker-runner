import * as vscode from "vscode";
import { strykerCommand, strykerConfigFilePath } from "./config";

export const run = ({
  path,
  lineRange,
}: {
  path: string;
  lineRange?: string;
}) => {
  const strykerBin = strykerCommand();
  const configFilePath = strykerConfigFilePath() || "";
  const target = `${path}${lineRange ? `:${lineRange}` : ""}`;
  const command = `${strykerBin} run --mutate ${target} ${configFilePath}`;

  const terminal = vscode.window.createTerminal("Stryker");
  terminal.show();
  terminal.sendText(command);
};
