# Stryker Runner End-to-End Tests

The Stryker Runner extension has end-to-end tests that assert the core extension commands operate as expected in a live instance of VSCode.

## Requirements

These tests have their own dependencies that must be installed separately

- Run `yarn`

## Notes

The test suite uses `mocha` and `chai` because the `vscode-test-cli` expects this and does no support `jest`.

- These tests used to use `jest` as a test runner before `vscode-test-cli` was released but this was a custom implementation, using `vscode-test-cli` is lower maintenance and supported tooling.

## Running the tests

- Run `yarn test`
