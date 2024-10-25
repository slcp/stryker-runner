import { defineConfig } from '@vscode/test-cli';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  files: path.join(__dirname, 'out/suite/extension.test.js'),
  extensionDevelopmentPath: path.join(__dirname, '..'),
  version: 'insiders',
  workspaceFolder: path.join(__dirname, '..'),
  launchArgs: ['--disable-extensions'],
});
