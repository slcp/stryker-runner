module.exports = {
  testRunner: 'jest-circus/runner',
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts', '!src/test/**/*'],
  coverageDirectory: './reports/coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testPathIgnorePatterns: ['/node_modules/', 'src/test/*', 'stryker-temp/*', 'e2e-tests/*'],
  reporters: ['default'],
  clearMocks: true,
};
