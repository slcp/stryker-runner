import { strykerCommand, strykerConfigFilePath } from "./config";
import { makeReusableTerminal, runCommand } from "./terminal";

const makeCommand = (path: string, lineRange?: string) => {
  const strykerBin = strykerCommand();
  const configFilePath = strykerConfigFilePath();
  const target = `${path}${lineRange ? `:${lineRange}` : ""}`;
  return `${strykerBin} run --mutate ${target}${
    configFilePath ? ` ${configFilePath}` : ""
  }`;
};

export const commandRunner = () => {
  const terminal = makeReusableTerminal({ name: "Stryker" });

  return ({ path, lineRange }: { path: string; lineRange?: string }) => {
    const command = makeCommand(path, lineRange);

    runCommand(terminal())(command);
  };
};
