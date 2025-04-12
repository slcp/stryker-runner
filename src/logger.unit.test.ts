import * as vscode from 'vscode';
import { createLogger, getLogger } from './logger';

const mockDate = 1;
const mockOutputChannel = {
  appendLine: jest.fn(),
};

describe('Logger', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    (vscode.window.createOutputChannel as jest.Mock).mockReturnValue(mockOutputChannel);
  });

  describe('getLogger', () => {
    it('should reuse existing output channel and logger on subsequent calls', () => {
      const logger1 = getLogger();
      const logger2 = getLogger();

      expect(vscode.window.createOutputChannel).toHaveBeenCalledWith('Stryker Runner');
      expect(vscode.window.createOutputChannel).toHaveBeenCalledTimes(1);
      expect(logger1).toBe(logger2);
    });
  });

  describe('createLogger', () => {
    it.each(['log', 'error', 'info'] as const)(
      'should produce a logger that can send strings to the output channel with method: %s',
      (method) => {
        const logger = createLogger(mockOutputChannel as unknown as vscode.OutputChannel);

        expect(logger[method]).toBeDefined();
        logger[method]('test message');
        expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
          `[1970-01-01T00:00:00.001Z] [${method.toUpperCase()}] test message`,
        );
      },
    );
  });
});
