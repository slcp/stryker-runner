import { strykerCommand, strykerConfigFilePath } from './config';
import { commandRunner } from './stryker';
import { makeReusableTerminal, runCommand } from './terminal';

jest.mock('./terminal');
jest.mock('./config');

const mockTerminal = jest.fn();
const mockRunCommandReturn = jest.fn();
const mockStrykerCommand = strykerCommand as jest.MockedFn<typeof strykerCommand>;
const mockStrykerConfigFilePath = strykerConfigFilePath as jest.MockedFn<typeof strykerConfigFilePath>;
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
      it('should execute a Stryker command with a custom config file path', () => {
        mockTerminal.mockReturnValueOnce('a terminal');
        mockStrykerCommand.mockReturnValueOnce('a command');
        mockStrykerConfigFilePath.mockReturnValueOnce('a path');

        commandRunner()({ path: '/path/to/file', lineRange: '1-10' });

        expect(makeReusableTerminal).toHaveBeenCalledWith({ name: 'Stryker' });
        expect(strykerCommand).toHaveBeenCalled();
        expect(strykerConfigFilePath).toHaveBeenCalled();
        expect(mockTerminal).toHaveBeenCalled();
        expect(runCommand).toHaveBeenCalledWith('a terminal');
        expect(mockRunCommandReturn).toHaveBeenCalledWith('a command run --mutate /path/to/file:1-10 a path');
      });
      it('should execute a Stryker command without a custom config file path', () => {
        mockTerminal.mockReturnValueOnce('a terminal');
        mockStrykerCommand.mockReturnValueOnce('a command');

        commandRunner()({ path: '/path/to/file', lineRange: '1-10' });

        expect(makeReusableTerminal).toHaveBeenCalledWith({ name: 'Stryker' });
        expect(strykerCommand).toHaveBeenCalled();
        expect(strykerConfigFilePath).toHaveBeenCalled();
        expect(mockTerminal).toHaveBeenCalled();
        expect(runCommand).toHaveBeenCalledWith('a terminal');
        expect(mockRunCommandReturn).toHaveBeenCalledWith('a command run --mutate /path/to/file:1-10');
      });
      it('should execute a Stryker command without a line range', () => {
        mockTerminal.mockReturnValueOnce('a terminal');
        mockStrykerCommand.mockReturnValueOnce('a command');

        commandRunner()({ path: '/path/to/file' });

        expect(makeReusableTerminal).toHaveBeenCalledWith({ name: 'Stryker' });
        expect(strykerCommand).toHaveBeenCalled();
        expect(strykerConfigFilePath).toHaveBeenCalled();
        expect(mockTerminal).toHaveBeenCalled();
        expect(runCommand).toHaveBeenCalledWith('a terminal');
        expect(mockRunCommandReturn).toHaveBeenCalledWith('a command run --mutate /path/to/file');
      });
    });
  });
});
