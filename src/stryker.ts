import * as vscode from "vscode";
import { strykerCommand, strykerConfigFilePath } from "./config";

const makeCommand = (path: string, lineRange?: string) => {
  const strykerBin = strykerCommand();
  const configFilePath = strykerConfigFilePath();
  const target = `${path}${lineRange ? `:${lineRange}` : ""}`;
  return `${strykerBin} run --mutate ${target} ${configFilePath}`;
};

const makeReusableTerminal = () => {
  let terminal: vscode.Terminal | undefined;
  vscode.window.onDidCloseTerminal((t) => {
    if (terminal && t.processId === terminal.processId) {
      console.log(
        `Stryker Runner's reusable terminal (pid: ${terminal.processId}) was closed`
      );
      terminal = undefined;
    }
  });

  return () => {
    if (!terminal) {
      terminal = vscode.window.createTerminal("Stryker");
      console.log(
        `Created a new reusable terminal for Stryker Runner with pid: ${terminal.processId}`
      );
    }
    console.log(
      `Reusing terminal for Stryker Runner with pid: ${terminal.processId}`
    );
    return terminal;
  };
};

const runCommand = (terminal: vscode.Terminal) => (command: string) => {
  terminal.show();
  terminal.sendText(command);
};

export const commandRunner = () => {
  const terminal = makeReusableTerminal();

  return ({ path, lineRange }: { path: string; lineRange?: string }) => {
    const command = makeCommand(path, lineRange);

    runCommand(terminal())(command);
  };
};
