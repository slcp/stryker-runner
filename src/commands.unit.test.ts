import { Uri, window } from "../__mocks__/vscode";
import {
  runStrykerOnFileCommand,
  runStrykerOnSelectionCommand,
} from "./commands";
import { mockConsoleLog } from "./test-helpers";
import { isTestFile, showInvalidFileMessage } from "./valid-files";

jest.mock("./valid-files");

const mockIsTestFile = isTestFile as jest.MockedFn<typeof isTestFile>;

describe("Commands", () => {
  mockConsoleLog();
  describe("Run Stryker on file", () => {
    it("should return a function", () => {
      expect(runStrykerOnFileCommand(jest.fn())).toEqual(expect.any(Function));
    });
    it("should do nothing if no URI is passed as an argument", async () => {
      const run = jest.fn();

      await runStrykerOnFileCommand(run)();

      expect(run).not.toHaveBeenCalled();
      expect(isTestFile).not.toHaveBeenCalled();
      expect(showInvalidFileMessage).not.toHaveBeenCalled();
    });
    it("should show an error message if the file is a test file", async () => {
      const run = jest.fn();
      mockIsTestFile.mockReturnValue(true);

      await runStrykerOnFileCommand(run)(new Uri({ path: "x.test.ts" }));

      expect(run).not.toHaveBeenCalled();
      expect(isTestFile).toHaveBeenCalledWith({ path: "x.test.ts" });
      expect(showInvalidFileMessage).toHaveBeenCalledWith();
    });
    it("should show run a command if the file is not a test file", async () => {
      const run = jest.fn();
      mockIsTestFile.mockReturnValue(false);

      await runStrykerOnFileCommand(run)(new Uri({ path: "x.test.ts" }));

      expect(run).toHaveBeenCalledWith({ path: "x.test.ts" });
      expect(isTestFile).toHaveBeenCalledWith({ path: "x.test.ts" });
      expect(showInvalidFileMessage).not.toHaveBeenCalledWith();
    });
  });
  describe("Run Stryker on selection", () => {
    it("should return a function", () => {
      expect(runStrykerOnSelectionCommand(jest.fn())).toEqual(
        expect.any(Function)
      );
    });
    it("should do nothing if no URI is passed as an argument", async () => {
      const run = jest.fn();

      await runStrykerOnSelectionCommand(run)();

      expect(run).not.toHaveBeenCalled();
      expect(isTestFile).not.toHaveBeenCalled();
      expect(showInvalidFileMessage).not.toHaveBeenCalled();
    });
    it("should show an error message if the file is a test file", async () => {
      const run = jest.fn();
      mockIsTestFile.mockReturnValue(true);

      await runStrykerOnSelectionCommand(run)(new Uri({ path: "x.test.ts" }));

      expect(run).not.toHaveBeenCalled();
      expect(isTestFile).toHaveBeenCalledWith({ path: "x.test.ts" });
      expect(showInvalidFileMessage).toHaveBeenCalledWith();
    });
    it("should do nothing if there is no active editor", async () => {
      const run = jest.fn();
      mockIsTestFile.mockReturnValue(false);
      window.activeTextEditor = null as any;

      await runStrykerOnSelectionCommand(run)(new Uri({ path: "x.ts" }));

      expect(run).not.toHaveBeenCalled();
      expect(isTestFile).toHaveBeenCalledWith({ path: "x.ts" });
      expect(showInvalidFileMessage).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith("No action, no active editor");
    });
    it("should do nothing when the selection is empty", async () => {
      const run = jest.fn();
      mockIsTestFile.mockReturnValue(false);
      window.activeTextEditor = { selection: { isEmpty: true } };

      await runStrykerOnSelectionCommand(run)(new Uri({ path: "x.ts" }));

      expect(run).not.toHaveBeenCalled();
      expect(isTestFile).toHaveBeenCalledWith({ path: "x.ts" });
      expect(showInvalidFileMessage).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        "No action, selection is single character"
      );
    });
    it("should show run a command if the file is not a test file", async () => {
      const run = jest.fn();
      mockIsTestFile.mockReturnValue(false);
      window.activeTextEditor = {
        selection: { start: { line: 4 }, end: { line: 6 } },
      };

      await runStrykerOnSelectionCommand(run)(new Uri({ path: "x.ts" }));

      expect(run).toHaveBeenCalledWith({ path: "x.ts", lineRange: "5-7" });
      expect(isTestFile).toHaveBeenCalledWith({ path: "x.ts" });
      expect(showInvalidFileMessage).not.toHaveBeenCalled();
    });
  });
});
