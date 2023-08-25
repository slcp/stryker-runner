import { runCLI } from 'jest';
import path from 'path';

export async function run() {
  // Relative to out/, These files are compiled into the 'out' dir before being run as JS
  const repoRoot = path.join(__dirname, '..', '..', '..');
  const config = path.join(repoRoot, 'jest.e2e.config.js');

  try {
    const results = await runCLI({ config } as any, [repoRoot]);

    if (results.results.numFailedTests > 0) {
      throw new Error('Some tests failed.');
    }
  } catch (error) {
    console.error((error as Error).message);
    // Exit ourselves or throwing here will ensure an unhappy exit code
    process.exit(1);
  }
}
