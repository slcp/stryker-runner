import { expect } from 'chai';
import fs from 'fs';
import { beforeEach, describe, it } from 'mocha';
import path from 'path';
import vscode, { Position, Range } from 'vscode';

const waitForFile = async (file: string): Promise<void> => {
  if (fs.existsSync(file)) {
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await waitForFile(file);
};

// Relative to the out directory
const pathToJsonReport = path.join(__dirname, '..', '..', '..', 'reports', 'mutation', 'mutation.json');

const getReport = async () => {
  // Wait for a JSON report to be output
  await waitForFile(pathToJsonReport);
  // Load the report
  const report = JSON.parse(String(fs.readFileSync(pathToJsonReport)));
  return report;
};

describe('Stryker Runner', () => {
  const repoRoot = path.join(__dirname, '..', '..', '..');
  const workspace = vscode.Uri.parse(`file://${repoRoot}`);

  beforeEach(async () => {
    try {
      fs.rmSync(pathToJsonReport);
    } catch {}
    // Open the workspace (this project)
    await vscode.commands.executeCommand('vscode.openFolder', workspace);
  });

  it('should successfully ask Stryker to mutate a single file', async () => {
    const expectedMutationTarget = 'e2e-tests/test-workspace/add.ts';
    const file = workspace.with({ path: `${workspace.path}/e2e-tests/test-workspace/add.ts` });

    // Issue command
    await vscode.commands.executeCommand('stryker-runner.run-stryker-on-file', file);

    const report = await getReport();

    // We only expect one mutation target, there could be multiple
    expect(report.config.mutate.length).to.equal(1);
    expect(report.config.mutate[0]).to.equal(expectedMutationTarget);
  }).timeout(90000);

  it('should successfully ask Stryker to mutate a line range in a file', async () => {
    const expectedMutationTarget = 'e2e-tests/test-workspace/add.ts:1-1';
    const file = workspace.with({ path: `${workspace.path}/e2e-tests/test-workspace/add.ts` });

    // Open test file to mutate with a text selection in place and holding focus
    await vscode.window.showTextDocument(file, {
      preserveFocus: true,
      selection: new Range(new Position(0, 0), new Position(0, 10)),
    });

    // Issue command
    await vscode.commands.executeCommand('stryker-runner.run-stryker-on-selection', file);

    const report = await getReport();

    // We only expect one mutation target, there could be multiple
    expect(report.config.mutate.length).to.equal(1);
    expect(report.config.mutate[0]).to.equal(expectedMutationTarget);
  }).timeout(90000);
});
