import path from 'path';

export class Uri {
  path: string;
  scheme: string;
  authority: string;
  query: string;
  fragment: string;
  fsPath: string;
  with: jest.Func;
  toJSON: jest.Func;

  constructor(args: { path: string }) {
    this.path = args.path;
    this.scheme = '';
    this.authority = '';
    this.query = '';
    this.fragment = '';
    this.fsPath = path.resolve(args.path);
    this.with = jest.fn();
    this.toJSON = jest.fn();
  }

  static file(path: string) {
    return new Uri({ path });
  }
}

export const mockGet = jest.fn();
export const mockGetWorkspaceFolder = jest.fn();
export const mockShowErrorMessage = jest.fn();
export const mockOnDidCloseTerminal = jest.fn();
export const mockCreateTerminal = jest.fn();
export const mockRegisterCommand = jest.fn();
export const mockCreateOutputChannel = jest.fn();

export const workspace = {
  getWorkspaceFolder: mockGetWorkspaceFolder,
  getConfiguration: jest.fn(() => ({
    get: mockGet,
  })),
};

export const outputChannel = {
  appendLine: jest.fn(),
};

export const window = {
  showErrorMessage: mockShowErrorMessage,
  onDidCloseTerminal: mockOnDidCloseTerminal,
  createTerminal: mockCreateTerminal,
  activeTextEditor: {},
  createOutputChannel: mockCreateOutputChannel,
};

export const commands = {
  registerCommand: mockRegisterCommand,
};
