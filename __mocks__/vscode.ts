export const mockGet = jest.fn();
export const workspace = {
  getConfiguration: jest.fn(() => ({
    get: mockGet,
  })),
};
