import { strykerCommand, strykerConfigFilePath, useYarn } from './config';
import { workspace, mockGet, Uri } from '../__mocks__/vscode';
import { workspaceHasYarnLockFile } from './fs-helpers';

jest.mock('./fs-helpers');

const mockWorkspaceHasYarnLockFile = workspaceHasYarnLockFile as jest.MockedFn<typeof workspaceHasYarnLockFile>;

const mockConfig = (key: string, value: unknown) =>
  mockGet.mockImplementationOnce((k: string) => {
    if (k === key) return value;
  });

describe('Config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Stryker config file path', () => {
    it('should return an empty string when nothing is present in config', () => {
      const res = strykerConfigFilePath();

      expect(workspace.getConfiguration).toHaveBeenCalledWith();
      expect(mockGet).toHaveBeenCalledWith('strykerRunner.stryker.configFile');
      expect(res).toEqual('');
    });
    it('should return value from config when configFile is set', () => {
      mockConfig('strykerRunner.stryker.configFile', 'custom config');

      const res = strykerConfigFilePath();

      expect(workspace.getConfiguration).toHaveBeenCalledWith();
      expect(mockGet).toHaveBeenCalledWith('strykerRunner.stryker.configFile');
      expect(res).toEqual('custom config');
    });
  });
  describe('Use yarn', () => {
    it('should return true when useYarn is set true', () => {
      mockConfig('strykerRunner.node.useYarn', true);

      const res = useYarn();

      expect(workspace.getConfiguration).toHaveBeenCalledWith();
      expect(mockGet).toHaveBeenCalledWith('strykerRunner.node.useYarn');
      expect(res).toEqual(true);
    });
    it('should return false when unothing is set in config and there is no file context', () => {
      const res = useYarn();

      expect(workspace.getConfiguration).toHaveBeenCalledWith();
      expect(mockGet).toHaveBeenCalledWith('strykerRunner.node.useYarn');
      expect(workspaceHasYarnLockFile).not.toHaveBeenCalled();
      expect(res).toEqual(false);
    });
    it('should return true when nothing is set in config, there is a file context and it cotains a yarn.lock file', () => {
      mockWorkspaceHasYarnLockFile.mockReturnValue(true);

      const res = useYarn(new Uri({ path: 'x.test.ts' }));

      expect(workspace.getConfiguration).toHaveBeenCalledWith();
      expect(mockGet).toHaveBeenCalledWith('strykerRunner.node.useYarn');
      expect(workspaceHasYarnLockFile).toHaveBeenCalledWith(expect.objectContaining({ path: 'x.test.ts' }));
      expect(res).toEqual(true);
    });
    it('should return true when nothing is set in config, there is a file context and it does not cotains a yarn.lock file', () => {
      mockWorkspaceHasYarnLockFile.mockReturnValue(false);

      const res = useYarn(new Uri({ path: 'x.test.ts' }));

      expect(workspace.getConfiguration).toHaveBeenCalledWith();
      expect(mockGet).toHaveBeenCalledWith('strykerRunner.node.useYarn');
      expect(workspaceHasYarnLockFile).toHaveBeenCalledWith(expect.objectContaining({ path: 'x.test.ts' }));
      expect(res).toEqual(false);
    });
  });
  describe('Stryker command', () => {
    it('should return node command when nothing is present in config', () => {
      const res = strykerCommand();

      expect(workspace.getConfiguration).toHaveBeenCalledWith();
      expect(mockGet).toHaveBeenCalledWith('strykerRunner.node.useYarn');
      expect(mockGet).toHaveBeenCalledWith('strykerRunner.stryker.command');
      expect(res).toEqual('npx --no-install stryker');
    });
    it('should return value from config when command is set', () => {
      mockConfig('strykerRunner.stryker.command', 'custom command');

      const res = strykerCommand();

      expect(workspace.getConfiguration).toHaveBeenCalledWith();
      expect(mockGet).toHaveBeenCalledWith('strykerRunner.stryker.command');
      expect(res).toEqual('custom command');
    });
    it('should return node command when nothing is present in config', () => {
      const res = strykerCommand();

      expect(workspace.getConfiguration).toHaveBeenCalledWith();
      expect(mockGet).toHaveBeenCalledWith('strykerRunner.node.useYarn');
      expect(mockGet).toHaveBeenCalledWith('strykerRunner.stryker.command');
      expect(res).toEqual('npx --no-install stryker');
    });
    it('should return yarn command when useYarn is set to true', () => {
      mockConfig('strykerRunner.stryker.command', undefined);
      mockConfig('strykerRunner.node.useYarn', true);

      const res = strykerCommand();

      expect(workspace.getConfiguration).toHaveBeenCalledWith();
      expect(mockGet).toHaveBeenCalledWith('strykerRunner.node.useYarn');
      expect(mockGet).toHaveBeenCalledWith('strykerRunner.stryker.command');
      expect(res).toEqual('yarn stryker');
    });
  });
});
