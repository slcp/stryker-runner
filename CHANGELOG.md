# Change Log

All notable changes to the "stryker-runner" extension will be documented in this file.

## [Unreleased]

## [v0.0.39](https://github.com/slcp/stryker-runner/compare/v0.0.38...v0.0.39)

- Take extension out of preview
- Activate extension when user has shown intent, onCommand instead of on boot of VSCode
- Make available in OpenVSX store

## [v0.0.38](https://github.com/slcp/stryker-runner/compare/v0.0.37...v0.0.38)

- Run `npx` with `--no-install` as default to ensure that Stryker is available locally
- Attempt to discover a `yarn.lock` file in the workspace folder, default to running Stryker with yarn if found. `useYarn` config overrides this.

## [v0.0.37](https://github.com/slcp/stryker-runner/compare/v0.0.4...v0.0.37)

- A bit of messy release :(
- Version change to release to the VSCode Extension Marketplace

## [v0.0.4](https://github.com/slcp/stryker-runner/compare/v0.0.3...v0.0.4)

- Added deployment of `vsix` package to Github Releases

## [v0.0.3](https://github.com/slcp/stryker-runner/releases/tag/v0.0.3)

- Initial release
- Added running Stryker on a single file from the context menu
- Added running Stryker on a line selection in a single file from the context menu
