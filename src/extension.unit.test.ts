import { commands, mockRegisterCommand } from "../__mocks__/vscode";
import {
  runStrykerOnFileCommand,
  runStrykerOnSelectionCommand,
} from "./commands";
import { activate, deactivate } from "./extension";
import { commandRunner } from "./stryker";

jest.mock("./stryker");
jest.mock("./commands");

const mockCommandRunner = commandRunner as jest.MockedFn<typeof commandRunner>;

describe("Extension", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("Activate", () => {
    it("should register commands", () => {
      mockCommandRunner.mockReturnValue("command runner" as any);
      mockRegisterCommand.mockReturnValueOnce("on file command" as any);
      mockRegisterCommand.mockReturnValueOnce("on selection command" as any);
      const context = {
        subscriptions: {
          push: jest.fn(),
        },
      };

      activate(context as any);

      expect(commandRunner).toHaveBeenCalledTimes(1);
      expect(runStrykerOnFileCommand).toHaveBeenCalledTimes(1);
      expect(runStrykerOnFileCommand).toHaveBeenCalledWith("command runner");
      expect(runStrykerOnSelectionCommand).toHaveBeenCalledTimes(1);
      expect(runStrykerOnSelectionCommand).toHaveBeenCalledWith(
        "command runner"
      );
      expect(commands.registerCommand).toHaveBeenCalledTimes(2);
      expect(context.subscriptions.push).toHaveBeenCalledTimes(2);
      expect(context.subscriptions.push).toHaveBeenCalledWith(
        "on file command"
      );
      expect(context.subscriptions.push).toHaveBeenCalledWith(
        "on selection command"
      );
    });
  });
  describe("Deactivate", () => {
    it("should do nothing", () => {
      deactivate();
    });
  });
});
