import { before } from 'mocha';
import { fake } from 'sinon';

export const mockConsoleLog = () => {
  let originalConsoleLog: typeof console.log;
  before(() => {
    originalConsoleLog = console.log;
    console.log = fake();
  });
  after(() => {
    console.log = originalConsoleLog;
  });
};
