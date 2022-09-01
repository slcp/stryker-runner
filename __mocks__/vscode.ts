export const mockGet = jest.fn();
export const mockShowErrorMessage = jest.fn();
export const mockOnDidCloseTerminal = jest.fn();
export const mockCreateTerminal = jest.fn();
export const workspace = {
  getConfiguration: jest.fn(() => ({
    get: mockGet,
  })),
};
export const window = {
  showErrorMessage: mockShowErrorMessage,
  onDidCloseTerminal: mockOnDidCloseTerminal,
  createTerminal: mockCreateTerminal,
};
