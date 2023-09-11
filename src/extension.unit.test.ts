import { commands, mockRegisterCommand } from '../__mocks__/vscode';
import { runStrykerOnFileCommand, runStrykerOnSelectionCommand } from './commands';
import { activate, deactivate } from './extension';
import { commandRunner } from './stryker';

jest.mock('./stryker');
jest.mock('./commands');

const mockCommandRunner = commandRunner as jest.MockedFn<typeof commandRunner>;
const mockRunStrykerOnFileCommand = runStrykerOnFileCommand as jest.MockedFn<typeof runStrykerOnFileCommand>;
const mockRunStrykerOnSelectionCommand = runStrykerOnSelectionCommand as jest.MockedFn<
  typeof runStrykerOnSelectionCommand
>;

describe('Extension', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe('Activate', () => {
    it('should register commands', () => {
      mockCommandRunner.mockReturnValue('command runner' as any);
      mockRunStrykerOnFileCommand.mockReturnValueOnce('run strkyer on file' as any);
      mockRunStrykerOnSelectionCommand.mockReturnValueOnce('run strkyer on selection' as any);
      mockRegisterCommand.mockReturnValueOnce('on file command registered' as any);
      mockRegisterCommand.mockReturnValueOnce('on selection command registered' as any);
      const context = {
        subscriptions: {
          push: jest.fn(),
        },
      };

      activate(context as any);

      expect(commandRunner).toHaveBeenCalledTimes(1);
      expect(runStrykerOnFileCommand).toHaveBeenCalledTimes(1);
      expect(runStrykerOnFileCommand).toHaveBeenCalledWith('command runner');
      expect(runStrykerOnSelectionCommand).toHaveBeenCalledTimes(1);
      expect(runStrykerOnSelectionCommand).toHaveBeenCalledWith('command runner');
      expect(commands.registerCommand).toHaveBeenCalledTimes(2);
      expect(commands.registerCommand).toHaveBeenCalledWith(
        'stryker-runner.run-stryker-on-file',
        'run strkyer on file',
      );
      expect(commands.registerCommand).toHaveBeenCalledWith(
        'stryker-runner.run-stryker-on-selection',
        'run strkyer on selection',
      );
      expect(context.subscriptions.push).toHaveBeenCalledTimes(2);
      expect(context.subscriptions.push).toHaveBeenCalledWith('on file command registered');
      expect(context.subscriptions.push).toHaveBeenCalledWith('on selection command registered');
    });
  });
  describe('Deactivate', () => {
    it('should do nothing', () => {
      deactivate();
    });
  });
});
