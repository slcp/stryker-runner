import path from 'path';
import { fake, SinonSpy } from 'sinon';

export class Uri {
  path: string;
  scheme: string;
  authority: string;
  query: string;
  fragment: string;
  fsPath: string;
  with: SinonSpy;
  toJSON: SinonSpy;

  constructor(args: { path: string }) {
    this.path = args.path;
    this.scheme = '';
    this.authority = '';
    this.query = '';
    this.fragment = '';
    this.fsPath = path.resolve(args.path);
    this.with = fake();
    this.toJSON = fake();
  }

  static file(path: string) {
    return new Uri({ path });
  }
}

export const mockGet = fake();
export const mockGetWorkspaceFolder = fake();
export const mockShowErrorMessage = fake();
export const mockOnDidCloseTerminal = fake();
export const mockCreateTerminal = fake();
export const mockRegisterCommand = fake();

export const workspace = {
  getWorkspaceFolder: mockGetWorkspaceFolder,
  getConfiguration: fake.returns({
    get: mockGet,
  }),
};

export const window = {
  showErrorMessage: mockShowErrorMessage,
  onDidCloseTerminal: mockOnDidCloseTerminal,
  createTerminal: mockCreateTerminal,
  activeTextEditor: {},
};

export const commands = {
  registerCommand: mockRegisterCommand,
};
