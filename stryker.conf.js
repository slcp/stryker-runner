/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  ignorePatterns: ['.vscode-test'],
  mutate: ['src/**/*.ts', '!src/**/?(*.)+(spec|test).ts', '!src/test-helpers.ts'],
  testRunner: 'jest',
  packageManager: 'yarn',
  checkers: ['typescript'],
  reporters: ['html', 'clear-text', 'progress', 'json'],
  tsconfigFile: 'tsconfig.json',
  timeoutMS: 60000,
  thresholds: { high: 100, low: 100, break: 100 },
  jest: {
    configFile: './jest.stryker.config.js',
  },
  disableTypeChecks: '{e2e-tests,src,test-workspace}/**/*.{js,ts}',
};
