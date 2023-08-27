// see https://github.com/microsoft/vscode-test/issues/37#issuecomment-700167820
const path = require('path');

module.exports = {
  moduleFileExtensions: ['js'],
  testMatch: ['<rootDir>/out/e2e-tests/suite/*.test.js'],
  testEnvironment: './e2e-tests/vscode-environment.js',
  verbose: true,
  moduleNameMapper: {
    vscode: path.join(__dirname, 'e2e-tests', 'vscode.js'),
  },
};
