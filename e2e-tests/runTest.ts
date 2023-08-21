import { runTests } from '@vscode/test-electron';
import * as path from 'path';

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');

    // The path to the extension test runner script
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, './suite/index.js');

    // Using latest (1.81.something) crashes for an unknown reason
    const version = 'insiders';

    // Download VS Code, unzip it and run the integration test
    await runTests({ version, extensionDevelopmentPath, extensionTestsPath, launchArgs: ['--disable-extensions'] });
  } catch (err) {
    console.error('Failed to run tests');
    process.exit(1);
  }
}

main();
