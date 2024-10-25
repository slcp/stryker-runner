import path from 'path';
import { Uri, mockGetWorkspaceFolder } from '../__mocks__/vscode';
import { strykerCommand, strykerConfigFilePath } from './config';
import { commandRunner } from './stryker';
import { makeReusableTerminal, runCommand } from './terminal';
import { findNearestPackageJsonAncestor } from './fs-helpers';

jest.mock('./terminal');
jest.mock('./config');
jest.mock('./fs-helpers');

const mockTerminal = jest.fn();
const mockRunCommandReturn = jest.fn();
const mockStrykerCommand = strykerCommand as jest.MockedFn<typeof strykerCommand>;
const mockStrykerConfigFilePath = strykerConfigFilePath as jest.MockedFn<typeof strykerConfigFilePath>;
const mockFindNearestPackageJsonAncestor = findNearestPackageJsonAncestor as jest.MockedFn<
  typeof findNearestPackageJsonAncestor
>;
(makeReusableTerminal as jest.Mock).mockReturnValue(mockTerminal);
(runCommand as jest.Mock).mockReturnValue(mockRunCommandReturn);

describe('Stryker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Command runner', () => {
    describe('Currying a reusable terminal', () => {
      it('should return a command runner func with a reusable terminal', () => {
        const res = commandRunner();

        expect(makeReusableTerminal).toHaveBeenCalledWith({ name: 'Stryker' });
        expect(res).toEqual(expect.any(Function));
      });
    });
    describe('Curried command runner function', () => {
      const stubFileName = 'file.ts';
      const stubFilePath = `/path/to/${stubFileName}`;
      const stubLineRange = '1-10';
      const stubFileFsPath = path.resolve(stubFilePath);
      const expectedRelativePathFile = path.relative(path.resolve('/path'), stubFileFsPath);

      beforeEach(() => {
        mockGetWorkspaceFolder.mockReturnValue({ uri: new Uri({ path: '/path' }) });
        mockFindNearestPackageJsonAncestor.mockReturnValue({ success: true, uri: Uri.file('/path/package.json') });
      });

      it('should execute a Stryker command with a custom config file path', () => {
        mockTerminal.mockReturnValueOnce('a terminal');
        mockStrykerCommand.mockReturnValueOnce('a command');
        mockStrykerConfigFilePath.mockReturnValueOnce('a path');

        commandRunner()({ file: new Uri({ path: stubFilePath }), lineRange: stubLineRange });

        expect(makeReusableTerminal).toHaveBeenCalledWith({ name: 'Stryker' });
        expect(strykerCommand).toHaveBeenCalled();
        expect(strykerConfigFilePath).toHaveBeenCalled();
        expect(mockTerminal).toHaveBeenCalled();
        expect(runCommand).toHaveBeenCalledWith('a terminal');
        expect(mockRunCommandReturn).toHaveBeenCalledWith(`cd /path`);
        expect(mockRunCommandReturn).toHaveBeenCalledWith(
          `a command run --mutate ${expectedRelativePathFile}:${stubLineRange} a path`,
        );
      });
      it('should execute a Stryker command without a custom config file path', () => {
        mockTerminal.mockReturnValueOnce('a terminal');
        mockStrykerCommand.mockReturnValueOnce('a command');

        commandRunner()({ file: new Uri({ path: stubFilePath }), lineRange: stubLineRange });

        expect(makeReusableTerminal).toHaveBeenCalledWith({ name: 'Stryker' });
        expect(strykerCommand).toHaveBeenCalled();
        expect(strykerConfigFilePath).toHaveBeenCalled();
        expect(mockTerminal).toHaveBeenCalled();
        expect(runCommand).toHaveBeenCalledWith('a terminal');
        expect(mockRunCommandReturn).toHaveBeenCalledWith(`cd /path`);
        expect(mockRunCommandReturn).toHaveBeenCalledWith(
          `a command run --mutate ${expectedRelativePathFile}:${stubLineRange}`,
        );
      });
      it('should execute a Stryker command without a line range', () => {
        mockTerminal.mockReturnValueOnce('a terminal');
        mockStrykerCommand.mockReturnValueOnce('a command');

        commandRunner()({ file: new Uri({ path: stubFilePath }) });

        expect(makeReusableTerminal).toHaveBeenCalledWith({ name: 'Stryker' });
        expect(strykerCommand).toHaveBeenCalled();
        expect(strykerConfigFilePath).toHaveBeenCalled();
        expect(mockTerminal).toHaveBeenCalled();
        expect(runCommand).toHaveBeenCalledWith('a terminal');
        expect(mockRunCommandReturn).toHaveBeenCalledWith(`cd /path`);
        expect(mockRunCommandReturn).toHaveBeenCalledWith(`a command run --mutate ${expectedRelativePathFile}`);
      });
      it('should execute a Stryker command using package.json as context', () => {
        mockTerminal.mockReturnValueOnce('a terminal');
        mockStrykerCommand.mockReturnValueOnce('a command');

        commandRunner()({ file: new Uri({ path: stubFilePath }) });

        expect(mockRunCommandReturn).toHaveBeenCalledWith(`cd /path`);
        expect(mockRunCommandReturn).toHaveBeenCalledWith(`a command run --mutate ${expectedRelativePathFile}`);
      });
      it('should execute a Stryker command using the workspace as context', () => {
        mockTerminal.mockReturnValueOnce('a terminal');
        mockStrykerCommand.mockReturnValueOnce('a command');
        mockFindNearestPackageJsonAncestor.mockReturnValue({ success: false, uri: undefined });

        commandRunner()({ file: new Uri({ path: stubFilePath }) });

        expect(mockRunCommandReturn).toHaveBeenCalledWith(`cd /path`);
        expect(mockRunCommandReturn).toHaveBeenCalledWith(`a command run --mutate to/${stubFileName}`);
      });
      it('should execute a Stryker command using the file uri as context', () => {
        mockGetWorkspaceFolder.mockReturnValue(undefined);
        mockTerminal.mockReturnValueOnce('a terminal');
        mockStrykerCommand.mockReturnValueOnce('a command');
        mockFindNearestPackageJsonAncestor.mockReturnValue({ success: false, uri: undefined });

        commandRunner()({ file: new Uri({ path: stubFilePath }) });

        expect(mockRunCommandReturn).toHaveBeenCalledWith(`cd /path/to`);
        expect(mockRunCommandReturn).toHaveBeenCalledWith(`a command run --mutate ${stubFileName}`);
      });
    });
  });
});
