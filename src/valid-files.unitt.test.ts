import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import { reset } from 'sinon';
import { window } from '../__mocks__/vscode';
import { isTestFile, showInvalidFileMessage } from './valid-files';

describe('Valid files', () => {
  beforeEach(() => {
    reset();
  });
  describe('Is test file?', () => {
    [
      'src/config.unit.test.ts',
      'src/config.test.ts',
      'src/config.spec.ts',
      'src/config.unit.test.js',
      'src/config.test.js',
      'src/config.spec.js',
      'src/nest/config.unit.test.ts',
      'src/nest/config.test.ts',
      'src/nest/config.spec.ts',
      'src/nest/config.unit.test.js',
      'src/nest/config.test.js',
      'src/nest/config.spec.js',
      'src/nest/config.js.exe',
    ].forEach((path) =>
      it(`should validate the path '${path}' as a test file`, () => {
        expect(isTestFile({ path } as any)).equals(true);
      }),
    );
    [
      'src/config.ts',
      'src/config.ts',
      'src/config.ts',
      'src/config.js',
      'src/config.js',
      'src/config.js',
      'src/nest/config.ts',
      'src/nest/config.ts',
      'src/nest/config.ts',
      'src/nest/config.js',
      'src/nest/config.js',
      'src/nest/config.js',
    ].forEach((path) =>
      it(`should validate the path '${path}' as not a test file`, () => {
        expect(isTestFile({ path } as any)).equals(false);
      }),
    );
  });
  describe('Show invalid file message', () => {
    it('should show an error message to the user', async () => {
      await showInvalidFileMessage();

      expect(window.showErrorMessage.calledWith('Cannot run Stryker on test files')).equals(true);
    });
  });
});
