import { runCLI } from 'jest';
import path from 'path';

export async function run() {
  // This will repo the root - use __dirname?
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
    // Exit ourselves of throwing here will ensure a unhappy exit code
    process.exit(1);
  }
}
