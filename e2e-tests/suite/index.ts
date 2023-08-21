import { runCLI } from 'jest';
import path from 'path';

export async function run() {
  // This will repo the root for some reason - where the command is run from?
  const repoRoot = process.cwd();
  const projectRootPath = repoRoot;
  const config = path.join(repoRoot, 'jest.e2e.config.js');

  try {
    const jestCliCallResult = await runCLI({ config } as any, [projectRootPath]);
    console.log('running with jest');

    jestCliCallResult.results.testResults.forEach((testResult) => {
      testResult.testResults
        .filter((assertionResult) => assertionResult.status === 'passed')
        .forEach(({ ancestorTitles, title, status }) => {
          console.info(`  ● ${ancestorTitles} › ${title} (${status})`);
        });
    });

    jestCliCallResult.results.testResults.forEach((testResult) => {
      if (testResult.failureMessage) {
        console.error(testResult.failureMessage);
      }
    });

    console.log('succeeded with jest');
    // TODO: do we need this?
    // reportTestResults(undefined, jestCliCallResult.results.numFailedTests);
  } catch (errorCaughtByJestRunner) {
    console.log('failed with jest');
    console.log(errorCaughtByJestRunner);
    // TODO: do we need this?
    // reportTestResults(errorCaughtByJestRunner, 0);
  }
}
