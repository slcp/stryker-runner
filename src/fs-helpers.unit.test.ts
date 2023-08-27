import { existsSync } from 'fs';
import path from 'path';
import { mockGetWorkspaceFolder, Uri } from '../__mocks__/vscode';
import { findFileInTree, workspaceHasYarnLockFile } from './fs-helpers';

jest.mock('fs');

const mockExistsSync = existsSync as jest.MockedFn<typeof existsSync>;

const mockReturnValueTimes = <T extends jest.Mock, Y>(times: number, method: T, value: Y) => {
  new Array(times).fill(1).forEach(() => method.mockReturnValueOnce(value));
};

describe('Filesystem helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Find file in tree', () => {
    it('should check for file in every directory up to the root and return false if file is not found', () => {
      mockReturnValueTimes(1, mockExistsSync, false);

      const res = findFileInTree(
        new Uri({ path: 'root/path' }),
        new Uri({ path: 'root/path/to/nested/dir' }),
        'some.txt'
      );

      expect(existsSync).toHaveBeenCalledTimes(4);
      expect(existsSync).toHaveBeenCalledWith('root/path/to/nested/dir/some.txt');
      expect(existsSync).toHaveBeenCalledWith('root/path/to/nested/some.txt');
      expect(existsSync).toHaveBeenCalledWith('root/path/to/some.txt');
      expect(existsSync).toHaveBeenCalledWith('root/path/some.txt');
      expect(res).toEqual(false);
    });
    it('should check for file in every directory up to the root and return true and stop if the file is found', () => {
      mockReturnValueTimes(2, mockExistsSync, false);
      mockReturnValueTimes(1, mockExistsSync, true);

      const res = findFileInTree(
        new Uri({ path: 'root/path' }),
        new Uri({ path: 'root/path/to/nested/dir' }),
        'some.txt'
      );

      expect(existsSync).toHaveBeenCalledTimes(3);
      expect(existsSync).toHaveBeenCalledWith('root/path/to/nested/dir/some.txt');
      expect(existsSync).toHaveBeenCalledWith('root/path/to/nested/some.txt');
      expect(existsSync).toHaveBeenCalledWith('root/path/to/some.txt');
      expect(res).toEqual(true);
    });
  });
  describe('Workspace has yarn.lock file', () => {
    it('should do search and return false if file does not exist in a workspace folder', () => {
      mockReturnValueTimes(1, mockExistsSync, false);

      const res = workspaceHasYarnLockFile(new Uri({ path: 'x.test.ts' }));

      expect(mockGetWorkspaceFolder).toHaveBeenCalledWith(expect.objectContaining({ path: 'x.test.ts' }));
      expect(existsSync).not.toHaveBeenCalled();
      expect(res).toEqual(false);
    });
    it('should do search and return false if file path does not contain workspace folder path', () => {
      mockGetWorkspaceFolder.mockReturnValue({
        uri: { path: 'root/path' },
      });
      mockReturnValueTimes(1, mockExistsSync, false);

      const res = workspaceHasYarnLockFile(new Uri({ path: 'x.test.ts' }));

      expect(mockGetWorkspaceFolder).toHaveBeenCalledWith(expect.objectContaining({ path: 'x.test.ts' }));
      expect(existsSync).not.toHaveBeenCalled();
      expect(res).toEqual(false);
    });
    it('should check for file in every directory up to the root and return false if file is not found', () => {
      mockGetWorkspaceFolder.mockReturnValue({
        uri: { path: 'root/path' },
      });
      mockReturnValueTimes(1, mockExistsSync, false);

      const res = workspaceHasYarnLockFile(new Uri({ path: 'root/path/to/nested/dir/x.test.ts' }));

      expect(mockGetWorkspaceFolder).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'root/path/to/nested/dir/x.test.ts' })
      );
      expect(existsSync).toHaveBeenCalledTimes(5);
      expect(existsSync).toHaveBeenCalledWith('root/path/to/nested/dir/x.test.ts/yarn.lock');
      expect(existsSync).toHaveBeenCalledWith('root/path/to/nested/dir/yarn.lock');
      expect(existsSync).toHaveBeenCalledWith('root/path/to/nested/yarn.lock');
      expect(existsSync).toHaveBeenCalledWith('root/path/to/yarn.lock');
      expect(existsSync).toHaveBeenCalledWith('root/path/yarn.lock');
      expect(res).toEqual(false);
    });
    it('should check for file in every directory up to the root and return true and stop if the files is found', () => {
      mockGetWorkspaceFolder.mockReturnValue({
        uri: { path: 'root/path' },
      });
      mockReturnValueTimes(3, mockExistsSync, false);
      mockReturnValueTimes(1, mockExistsSync, true);

      const res = workspaceHasYarnLockFile(new Uri({ path: 'root/path/to/nested/dir/x.test.ts' }));

      expect(existsSync).toHaveBeenCalledTimes(4);
      expect(existsSync).toHaveBeenCalledWith('root/path/to/nested/dir/x.test.ts/yarn.lock');
      expect(existsSync).toHaveBeenCalledWith('root/path/to/nested/dir/yarn.lock');
      expect(existsSync).toHaveBeenCalledWith('root/path/to/nested/yarn.lock');
      expect(existsSync).toHaveBeenCalledWith('root/path/to/yarn.lock');
      expect(res).toEqual(true);
    });
  });
});
