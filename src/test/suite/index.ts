import { runCLI } from 'jest';
import path from 'path';

export async function run() {
  const projectRootPath = path.join(__dirname, '../../../..');
  const config = path.join(projectRootPath, 'jest.e2e.config.js');

  console.log('path to config: ', config);
  console.log('cwd: ', process.cwd());

  try {
    const res = await runCLI({ config } as any, [projectRootPath]);
    // reportTestResults(undefined, jestCliCallResult.results.numFailedTests);
    console.log('tests passed');
  } catch (e) {
    // reportTestResults(errorCaughtByJestRunner, 0);
    console.log('tests failed', e);
  }
}
