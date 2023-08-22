/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  ignorePatterns: ['**/*', '!*.js', '!*.json', '!__mocks__/**/*', '!src/**/*', '!e2e-tests/test-workspace/*'],
  mutate: ['{src,lib,e2e-tests}/**/*.{ts,js}', '!{src,lib}/**/?(*.)+(spec|test).{ts,js}', '!src/test-helpers.ts'],
  testRunner: 'jest',
  packageManager: 'yarn',
  checkers: ['typescript'],
  reporters: ['html', 'clear-text', 'progress'],
  tsconfigFile: 'tsconfig.json',
  timeoutMS: 60000,
  thresholds: { high: 100, low: 100, break: 100 },
  jest: {
    configFile: './jest.stryker.config.js',
  },
  disableTypeChecks: '{e2e-tests,src,}/**/*.{js,ts}',
};
