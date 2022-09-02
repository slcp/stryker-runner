import { strykerCommand, strykerConfigFilePath, useYarn } from "./config";
import { workspace, mockGet } from "../__mocks__/vscode";

describe("Config", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Stryker config file path", () => {
    it("should return an empty string when nothing is present in config", () => {
      const res = strykerConfigFilePath();

      expect(workspace.getConfiguration).toHaveBeenCalledWith();
      expect(mockGet).toHaveBeenCalledWith("strykerRunner.stryker.configFile");
      expect(res).toEqual("");
    });
  });
  describe("Use yarn", () => {
    it("should return false when nothing is present in config", () => {
      const res = useYarn();

      expect(workspace.getConfiguration).toHaveBeenCalledWith();
      expect(mockGet).toHaveBeenCalledWith("strykerRunner.node.useYarn");
      expect(res).toEqual(false);
    });
  });
  describe("Stryker command", () => {
    it("should return node command when nothing is present in config", () => {
      const res = strykerCommand();

      expect(workspace.getConfiguration).toHaveBeenCalledWith();
      expect(mockGet).toHaveBeenCalledWith("strykerRunner.node.useYarn");
      expect(mockGet).toHaveBeenCalledWith("strykerRunner.stryker.command");
      expect(res).toEqual("npx stryker");
    });
    it("should return yarn command when useYarn is set to true", () => {
      mockGet.mockImplementation((s: string) => {
        if (s === "strykerRunner.node.useYarn") return true
      })

      const res = strykerCommand();

      expect(workspace.getConfiguration).toHaveBeenCalledWith();
      expect(mockGet).toHaveBeenCalledWith("strykerRunner.node.useYarn");
      expect(mockGet).toHaveBeenCalledWith("strykerRunner.stryker.command");
      expect(res).toEqual("yarn stryker");
    });
  });
});
