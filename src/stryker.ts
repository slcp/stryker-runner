import * as vscode from "vscode";

export const run = ({
  path,
  lineRange,
}: {
  path: string;
  lineRange?: string;
}) => {
  const strykerBin = "npx stryker";
  const target = `${path}${lineRange ? `:${lineRange}` : ""}`;
  const command = `${strykerBin} run --mutate ${target}`;
  const terminal = vscode.window.createTerminal("Stryker");
  terminal.show();
  terminal.sendText(command);
};
