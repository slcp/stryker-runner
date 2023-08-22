import vscode, { Terminal } from 'vscode';

const waitForTerminal = async (name: string): Promise<Terminal> => {
  while (true) {
    const terminals = vscode.window.terminals;
    const terminal = terminals.find((t) => t.name === name);
    if (terminal) {
      return terminal;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
};

const waitForTerminalExitCode = async (terminal: Terminal) => {
  while (true) {
    if (terminal.exitStatus) {
      return terminal.exitStatus;
    }
    // console.log("no exit code")
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

describe('some', () => {
  it('should do stuff', async () => {
    // Setup
    // Open the workspace containing test files to mutate
    const uri = vscode.Uri.parse(`file://${process.cwd()}`);
    const testFile = vscode.Uri.parse(`file://${process.cwd()}/e2e-tests/test-workspace/add.ts`);
    console.log(await vscode.commands.executeCommand('vscode.openFolder', uri));
    console.log(await vscode.commands.executeCommand('stryker-runner.run-stryker-on-file', testFile));

    const terminal = await waitForTerminal('Stryker');
    console.log('Got terminal', terminal);
    const exitCode = await waitForTerminalExitCode(terminal);

    console.log('Exit code: ', exitCode);

    expect(true).toEqual(true);
  }, 60000);
});
