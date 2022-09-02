# Stryker Runner

## What is it?

Stryker Runner is a [Visual Studio Code](https://code.visualstudio.com) Extention that is intended to allow users to easily and selectively run Stryker mutation tests against (currently) Javascript and Typescript projects.

## Why bother with it?

There is a lot of value in mutation testing your projects and for Javascript based projects Stryker is a great option. Because of the nature of what mutation testing is trying to achieve and how it works Stryker can be a little painful to use sometimes. Depending on the size and complexity of the codebases, as well as the computing resources available, Stryker tests can be time consuming to run.

Stryker does facilitate the execution of mutation testing of single files and on specific line ranges and the original idea of this extension was to surface this functionality into the VSCode workflow for developers.

## Visual Studio Code Marketplace

- VisualStudio Marketplace - TBC
- Open VSX Registry - TBC

## Features

Run Stryker tests against a specific file from:

- Context Menu

Run Stryker tests against a selected block of code (line range) in the editor.

## Extension Settings

Stryker Runner will work out of the box but there a few configurations that you may want to take advantage of:

| Command                          | Description                                                                                                                                                                                        |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| strykerRunner.stryker.configFile | Stryker config path (relative to ${workFolder} e.g. stryker-config-file.js). Stryker will attempt to auto-discover a settings file - https://stryker-mutator.io/docs/stryker-js/config-file/#usage |
| strykerRunner.stryker.command    | The command used to run Stryker, defaults to `[yarn\|npx] stryker`. This command should be able to have additional arguments appended to it.                                                       |
| strykerRunner.node.useYarn       | Set to true if your project uses yarn.                                                                                                                                                             |
