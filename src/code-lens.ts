import * as vscode from 'vscode';
import { loadStrykerResults } from './fs-helpers';

export class StrykerRunnerCodeLensProvider implements vscode.CodeLensProvider {
  constructor() {}

  public async provideCodeLenses(document: vscode.TextDocument): Promise<vscode.CodeLens[]> {
    const results = loadStrykerResults(document.uri);
    const mutationsFileKey = Object.keys(results.files).find((f) => document.uri.path.includes(f));
    const fileMutations = results.files[mutationsFileKey as string];
    const mutations = fileMutations.mutants;

    const codeLens: vscode.CodeLens[] = [];
    mutations.forEach((m) =>
      codeLens.push(
        new vscode.CodeLens(
          new vscode.Range(
            new vscode.Position(m.location.start.line, 0),
            new vscode.Position(m.location.start.line, 1),
          ),
          {
            title: 'Hello',
            command: 'string',
            tooltip: 'Blah',
            arguments: [],
          },
        ),
      ),
    );
    return codeLens;
  }
}
