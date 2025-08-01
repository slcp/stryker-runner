# Overview

This project, Stryker Runner, is a Visual Studio Code extension. It helps developers run Stryker mutation tests on Javascript and Typescript projects. The primary languages used are TypeScript (94.7%), JavaScript (4.6%), and Shell (0.7%).

# Purpose

Mutation testing with Stryker can be time-consuming, especially on large codebases. This extension makes the process more efficient by allowing developers to run tests on specific files or even selected lines of code, directly within the VSCode workflow. This targeted approach saves time and computational resources.

# How it Works

The Stryker Runner extension integrates with the VSCode user interface, adding options to the context menu. Users can right-click on a file or a selection of code in the editor to initiate Stryker tests for that specific scope.

The extension assumes that Stryker is already available in the project's environment, either as a project dependency or installed globally. The default command to run Stryker is [yarn/npx --no-install] stryker, but this can be customized in the settings. The extension can also be configured to use a specific Stryker configuration file.

# Development Guidelines

When working on this project:

- **Language**: Core logic is written in TypeScript
- **Environment**: Development and testing must be done within VSCode
- **Primary Function**: Integrate with Stryker mutation testing framework
- **Command Structure**: Extension appends arguments to base Stryker commands
- **Configuration**: Respect user-configurable settings for Stryker command and config file paths
- **Package Manager Detection**: Auto-discover yarn.lock files to determine package manager preference

# Architecture & Key Components

## Core Modules

- `extension.ts`: Main entry point with activation/deactivation logic
- `commands.ts`: Command handlers for file and selection-based operations
- `stryker.ts`: Core command execution and terminal management
- `config.ts`: Configuration management and workspace settings
- `fs-helpers.ts`: File system utilities for package.json/yarn.lock discovery
- `terminal.ts`: Reusable terminal management
- `valid-files.ts`: File validation (prevents running on test files)

## VSCode Integration Points

- **Commands**: `stryker-runner.run-stryker-on-file`, `stryker-runner.run-stryker-on-selection`
- **Menus**: Context menus for explorer and editor
- **Configuration**: Three settings under `strykerRunner` namespace
- **Terminal**: Uses VSCode terminal API for command execution
- **Workspace**: Leverages workspace folder detection and file system operations

## Key Dependencies

- `@types/vscode`: VSCode extension API types
- `@stryker-mutator/*`: Stryker mutation testing framework
- Standard Node.js modules: `path`, `fs`

# Coding Standards & Patterns

## Do's

- Use functional programming patterns with curried functions (see `commands.ts`)
- Implement comprehensive error handling with user-friendly messages
- Use VSCode's URI and workspace APIs for file operations
- Write unit tests for all functions using Jest with 100% coverage requirement
- Use TypeScript strict mode and maintain type safety
- Follow the existing pattern of separating concerns into focused modules

## Don'ts

- Don't run Stryker on test files (use regex validation: `/(?<!\.(test|spec))\.[tj]s$/`)
- Don't assume Stryker is globally available - respect user configuration
- Don't hardcode paths - use VSCode workspace and path utilities
- Don't execute commands without terminal context switching (`cd` before Stryker commands)
- Don't forget to handle Windows path separators in file operations

## Testing Patterns

- Mock VSCode APIs using the established `__mocks__/vscode.ts` pattern
- Use descriptive test names with `.each()` for parameterized tests
- Test both success and error paths
- Include e2e tests that verify actual VSCode integration

## **5. Additional Context for Better AI Assistance**

**Suggestion**: Add a troubleshooting and common patterns section:

```markdown
# Common Development Scenarios

## Adding New Configuration Options

1. Update `package.json` contributes.configuration
2. Add getter function in `config.ts`
3. Update relevant consumers (typically `stryker.ts`)
4. Add unit tests covering all configuration states

## Working Directory Resolution Logic

The extension uses this hierarchy for determining where to run Stryker:

1. Directory containing nearest `package.json` (preferred)
2. Workspace folder root
3. File's parent directory (fallback)

## File Validation Flow

1. Check if file is a test file using regex pattern
2. Show error message if invalid
3. Proceed with command execution if valid

This context helps when modifying file handling or validation logic.
```
