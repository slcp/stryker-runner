import { Uri, window } from '../__mocks__/vscode';
import {
  runStrykerOnFileCommand,
  runStrykerOnSelectionCommand,
  showMutantResultsCommand,
  hideMutantResultsCommand,
  toggleMutantResultsCommand,
} from './commands';
import { mockConsoleLog } from './test-helpers';
import { isTestFile, showInvalidFileMessage } from './valid-files';
import { mutantDecorationManager } from './mutant-decorations';

jest.mock('./valid-files');
jest.mock('./mutant-decorations', () => ({
  mutantDecorationManager: {
    loadStrykerReport: jest.fn(),
    enable: jest.fn(),
    disable: jest.fn(),
    isDecorationEnabled: jest.fn(),
  },
}));

const mockIsTestFile = isTestFile as jest.MockedFn<typeof isTestFile>;
const mockMutantDecorationManager = mutantDecorationManager as jest.Mocked<typeof mutantDecorationManager>;

describe('Commands', () => {
  mockConsoleLog();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Run Stryker on file', () => {
    it('should return a function', () => {
      expect(runStrykerOnFileCommand(jest.fn())).toEqual(expect.any(Function));
    });
    it('should do nothing if no URI is passed as an argument', async () => {
      const run = jest.fn();

      await runStrykerOnFileCommand(run)();

      expect(run).not.toHaveBeenCalled();
      expect(isTestFile).not.toHaveBeenCalled();
      expect(showInvalidFileMessage).not.toHaveBeenCalled();
    });
    it('should show an error message if the file is a test file', async () => {
      const run = jest.fn();
      mockIsTestFile.mockReturnValue(true);

      await runStrykerOnFileCommand(run)(new Uri({ path: 'x.test.ts' }));

      console.log((isTestFile as jest.Mock).mock.calls);

      expect(run).not.toHaveBeenCalled();
      expect(isTestFile).toHaveBeenCalledWith(expect.objectContaining({ path: 'x.test.ts' }));
      expect(showInvalidFileMessage).toHaveBeenCalledWith();
    });
    it('should run a command if the file is not a test file', async () => {
      const run = jest.fn();
      mockIsTestFile.mockReturnValue(false);

      await runStrykerOnFileCommand(run)(new Uri({ path: 'x.ts' }));

      expect(run).toHaveBeenCalledWith({ file: expect.objectContaining({ path: 'x.ts' }) });
      expect(isTestFile).toHaveBeenCalledWith(expect.objectContaining({ path: 'x.ts' }));
      expect(showInvalidFileMessage).not.toHaveBeenCalledWith();
    });
  });
  describe('Run Stryker on selection', () => {
    it('should return a function', () => {
      expect(runStrykerOnSelectionCommand(jest.fn())).toEqual(expect.any(Function));
    });
    it('should do nothing if no URI is passed as an argument', async () => {
      const run = jest.fn();

      await runStrykerOnSelectionCommand(run)();

      expect(run).not.toHaveBeenCalled();
      expect(isTestFile).not.toHaveBeenCalled();
      expect(showInvalidFileMessage).not.toHaveBeenCalled();
    });
    it('should show an error message if the file is a test file', async () => {
      const run = jest.fn();
      mockIsTestFile.mockReturnValue(true);

      await runStrykerOnSelectionCommand(run)(new Uri({ path: 'x.test.ts' }));

      expect(run).not.toHaveBeenCalled();
      expect(isTestFile).toHaveBeenCalledWith(expect.objectContaining({ path: 'x.test.ts' }));
      expect(showInvalidFileMessage).toHaveBeenCalledWith();
    });
    it('should do nothing if there is no active editor', async () => {
      const run = jest.fn();
      mockIsTestFile.mockReturnValue(false);
      window.activeTextEditor = null as any;

      await runStrykerOnSelectionCommand(run)(new Uri({ path: 'x.ts' }));

      expect(run).not.toHaveBeenCalled();
      expect(isTestFile).toHaveBeenCalledWith(expect.objectContaining({ path: 'x.ts' }));
      expect(showInvalidFileMessage).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('No action, no active editor');
    });
    it('should do nothing when the selection is empty', async () => {
      const run = jest.fn();
      mockIsTestFile.mockReturnValue(false);
      window.activeTextEditor = { selection: { isEmpty: true } };

      await runStrykerOnSelectionCommand(run)(new Uri({ path: 'x.ts' }));

      expect(run).not.toHaveBeenCalled();
      expect(isTestFile).toHaveBeenCalledWith(expect.objectContaining({ path: 'x.ts' }));
      expect(showInvalidFileMessage).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('No action, selection is single character');
    });
    it('should show run a command if the file is not a test file', async () => {
      const run = jest.fn();
      mockIsTestFile.mockReturnValue(false);
      window.activeTextEditor = {
        selection: { start: { line: 4 }, end: { line: 6 } },
      };

      await runStrykerOnSelectionCommand(run)(new Uri({ path: 'x.ts' }));

      expect(run).toHaveBeenCalledWith({ file: expect.objectContaining({ path: 'x.ts' }), lineRange: '5-7' });
      expect(isTestFile).toHaveBeenCalledWith(expect.objectContaining({ path: 'x.ts' }));
      expect(showInvalidFileMessage).not.toHaveBeenCalled();
    });
  });

  describe('Mutant Results Commands', () => {
    describe('showMutantResultsCommand', () => {
      it('should load report and enable decorations when successful', async () => {
        const mockWorkspaceFolder = { uri: { fsPath: '/workspace' } };
        // Mock workspace.workspaceFolders by modifying the imported workspace object
        const vscode = require('vscode');
        vscode.workspace.workspaceFolders = [mockWorkspaceFolder];

        mockMutantDecorationManager.loadStrykerReport.mockResolvedValue(true);

        await showMutantResultsCommand();

        expect(mockMutantDecorationManager.loadStrykerReport).toHaveBeenCalledWith(mockWorkspaceFolder);
        expect(mockMutantDecorationManager.enable).toHaveBeenCalled();
      });

      it('should not enable decorations when loading fails', async () => {
        const mockWorkspaceFolder = { uri: { fsPath: '/workspace' } };
        const vscode = require('vscode');
        vscode.workspace.workspaceFolders = [mockWorkspaceFolder];

        mockMutantDecorationManager.loadStrykerReport.mockResolvedValue(false);

        await showMutantResultsCommand();

        expect(mockMutantDecorationManager.loadStrykerReport).toHaveBeenCalledWith(mockWorkspaceFolder);
        expect(mockMutantDecorationManager.enable).not.toHaveBeenCalled();
      });
    });

    describe('hideMutantResultsCommand', () => {
      it('should disable decorations', () => {
        hideMutantResultsCommand();

        expect(mockMutantDecorationManager.disable).toHaveBeenCalled();
      });
    });

    describe('toggleMutantResultsCommand', () => {
      it('should hide when decorations are enabled', async () => {
        mockMutantDecorationManager.isDecorationEnabled.mockReturnValue(true);

        await toggleMutantResultsCommand();

        expect(mockMutantDecorationManager.disable).toHaveBeenCalled();
      });

      it('should show when decorations are disabled', async () => {
        const mockWorkspaceFolder = { uri: { fsPath: '/workspace' } };
        const vscode = require('vscode');
        vscode.workspace.workspaceFolders = [mockWorkspaceFolder];

        mockMutantDecorationManager.isDecorationEnabled.mockReturnValue(false);
        mockMutantDecorationManager.loadStrykerReport.mockResolvedValue(true);

        await toggleMutantResultsCommand();

        expect(mockMutantDecorationManager.loadStrykerReport).toHaveBeenCalledWith(mockWorkspaceFolder);
        expect(mockMutantDecorationManager.enable).toHaveBeenCalled();
      });
    });
  });
});
