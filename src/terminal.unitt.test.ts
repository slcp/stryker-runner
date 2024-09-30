import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import { fake, reset, SinonSpy, stub } from 'sinon';
import { window } from '../__mocks__/vscode';
import { makeReusableTerminal, runCommand } from './terminal';
import { mockConsoleLog } from './test-helpers';

const mockTerminal = {
  show: fake(),
  sendText: fake(),
};

describe('Terminal', () => {
  mockConsoleLog();
  beforeEach(() => {
    reset();
  });
  describe('Run command', () => {
    it('should return a function', () => {
      const res = runCommand(mockTerminal as any);

      expect(res).to.be.a('function');
    });
    it('should curry a terminal that can show and send a command', () => {
      runCommand(mockTerminal as any)('send me to the terminal');

      expect(mockTerminal.show.called).equals(true);
      expect(mockTerminal.sendText.calledWith('send me to the terminal')).equals(true);
    });
  });
  describe('Make resuable terminal', () => {
    it('should return a function and register a terminalDidClose listener', () => {
      const res = makeReusableTerminal({ name: 'a terminal' });

      expect(res).to.be.a('function');
      expect(window.onDidCloseTerminal.callCount).equals(1);
      expect(window.onDidCloseTerminal.firstCall.firstArg).to.be.a('function');
    });
    it('should return the same terminal when no terminal has been closed', () => {
      const terminalFn = makeReusableTerminal({ name: 'a terminal' });
      window.createTerminal = fake.returns({ processId: 1 });

      const terminal = terminalFn();

      expect(window.createTerminal.calledWith('a terminal')).equals(true);
      expect(
        (console.log as unknown as SinonSpy).calledWith('Created a new reusable terminal for Stryker Runner'),
      ).equals(true);
      expect((console.log as unknown as SinonSpy).calledWith('Reusing terminal for Stryker Runner')).equals(false);
      expect(terminal.processId).equals(1);

      const terminal2 = terminalFn();

      expect(window.createTerminal.callCount).equals(1);
      expect((console.log as unknown as SinonSpy).calledWith('Reusing terminal for Stryker Runner')).equals(true);
      expect(terminal2.processId).equals(1);
    });
    describe('With onDidCloseTerminal callback', () => {
      it('should return the same terminal when an unknown terminal has been closed', () => {
        const terminalFn = makeReusableTerminal({ name: 'a terminal' });
        const terminalDidCloseCallback = window.onDidCloseTerminal.firstCall.firstArg;
        window.createTerminal = fake.returns({ processId: 1 });

        const terminal = terminalFn();

        expect(window.createTerminal.calledWith('a terminal')).equals(true);
        expect(
          (console.log as unknown as SinonSpy).calledWith('Created a new reusable terminal for Stryker Runner'),
        ).equals(true);
        expect((console.log as unknown as SinonSpy).calledWith('Reusing terminal for Stryker Runner')).equals(false);
        expect(terminal.processId).equals(1);

        // Close the terminal that has just been opened
        terminalDidCloseCallback({ processId: 2 });

        const terminal2 = terminalFn();

        expect(window.createTerminal.callCount).equals(1);
        expect((console.log as unknown as SinonSpy).calledWith('Reusing terminal for Stryker Runner')).equals(true);
        expect(terminal2.processId).equals(1);
      });
      it('should create a new terminal if the old one has been closed', () => {
        const terminalFn = makeReusableTerminal({ name: 'a terminal' });
        const terminalDidCloseCallback = window.onDidCloseTerminal.firstCall.firstArg;
        const mockCreateTerminal = stub()
          .onFirstCall()
          .returns({ processId: 1 })
          .onSecondCall()
          .returns({ processId: 2 });
        window.createTerminal = mockCreateTerminal;

        const terminal = terminalFn();

        expect(window.createTerminal.calledWith('a terminal')).equals(true);
        expect(
          (console.log as unknown as SinonSpy).calledWith('Created a new reusable terminal for Stryker Runner'),
        ).equals(true);
        expect(terminal.processId).equals(1);

        // Close the terminal that has just been opened
        terminalDidCloseCallback({ processId: 1 });
        expect((console.log as unknown as SinonSpy).calledWith("Stryker Runner's reusable terminal was closed")).equals(
          true,
        );

        const terminal2 = terminalFn();

        expect(window.createTerminal.callCount).equals(2);
        expect((console.log as unknown as SinonSpy).calledWith('Reusing terminal for Stryker Runner')).equals(false);
        expect(terminal2.processId).equals(2);
      });
    });
    describe('The onDidCloseTerminal callback', () => {
      it('should do nothing if no terminal has been asked for', () => {
        makeReusableTerminal({ name: 'a terminal' });
        const terminalDidCloseCallback = window.onDidCloseTerminal.firstCall.firstArg;

        // Trigger the callback
        terminalDidCloseCallback({ processId: 1 });

        expect(
          (console.log as unknown as SinonSpy).calledWith('Created a new reusable terminal for Stryker Runner'),
        ).equals(false);
        expect((console.log as unknown as SinonSpy).calledWith('Reusing terminal for Stryker Runner')).equals(false);
      });
    });
  });
});
