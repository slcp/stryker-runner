import { window } from "../__mocks__/vscode";
import { isTestFile, showInvalidFileMessage } from "./valid-files";

describe("Valid files", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Is test file?", () => {
    it.each([
      "src/config.unit.test.ts",
      "src/config.test.ts",
      "src/config.spec.ts",
      "src/config.unit.test.js",
      "src/config.test.js",
      "src/config.spec.js",
      "src/nest/config.unit.test.ts",
      "src/nest/config.test.ts",
      "src/nest/config.spec.ts",
      "src/nest/config.unit.test.js",
      "src/nest/config.test.js",
      "src/nest/config.spec.js",
    ])("should validate the path '%s' as a test file", (path) => {
      expect(isTestFile({ path } as any)).toEqual(true);
    });
    it.each([
      "src/config.ts",
      "src/config.ts",
      "src/config.ts",
      "src/config.js",
      "src/config.js",
      "src/config.js",
      "src/nest/config.ts",
      "src/nest/config.ts",
      "src/nest/config.ts",
      "src/nest/config.js",
      "src/nest/config.js",
      "src/nest/config.js",
    ])("should validate the path '%s' as not a test file", (path) => {
      expect(isTestFile({ path } as any)).toEqual(false);
    });
  });
  describe("Show invalid file message", () => {
    it("should show an error message to the user", async () => {
      await showInvalidFileMessage();

      expect(window.showErrorMessage).toHaveBeenCalled();
    });
  });
});
