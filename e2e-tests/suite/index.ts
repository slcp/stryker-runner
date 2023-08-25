import { runCLI } from 'jest';
import path from 'path';

export async function run() {
  // This will repo the root - use __dirname?
  // The script should always be invoked from the root/package.json location - so cwd?
  const repoRoot = process.cwd();
  const projectRootPath = repoRoot;
  const config = path.join(repoRoot, 'jest.e2e.config.js');

  try {
    const results = await runCLI({ config } as any, [projectRootPath]);

    if (results.results.numFailedTests > 0) {
      throw new Error('Some tests failed.');
    }
  } catch (error) {
    console.error((error as Error).message);
    // Exit ourselves or throwing here will ensure an unhappy exit code
    process.exit(1);
  }
}
