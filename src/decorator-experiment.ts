import { readFileSync } from 'fs';
import * as vscode from 'vscode';

interface StrykerLocation {
  column: number;
  line: number;
}

interface StrykerMutant {
  id: string;
  mutatorName: string;
  replacement: string;
  statusReason: string;
  status: string;
  static: boolean;
  killedBy: [];
  coveredBy: [];
  location: {
    end: StrykerLocation;
    start: StrykerLocation;
  };
}

interface StrykerFile {
  language: string;
  mutants: StrykerMutant[];
}

export interface StrykerResults {
  files: {
    [relativePath: string]: StrykerFile;
  };
}

const loadStrykerResults = (context: vscode.Uri): StrykerResults => {
  const folder = vscode.workspace.getWorkspaceFolder(context);
  const defaultResultsPath = 'reports/stryker-incremental.json';
  // const userPath = '/reports/stryker/stryker-incremental.json';
  const strykerResults = JSON.parse(
    readFileSync(`${folder?.uri.path}/${defaultResultsPath}`).toString(),
  ) as StrykerResults;
  return strykerResults;
};

const update = (document: vscode.Uri) => {
  const results = loadStrykerResults(document);
  const mutationsFileKey = Object.keys(results.files).find((f) => document.path.includes(f));
  const fileMutations = results.files[mutationsFileKey as string];
  const mutations = fileMutations.mutants;

  const style = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'red',
  });

  const places: vscode.Range[] = mutations.map(
    (m) => new vscode.Range(m.location.start.line, m.location.start.column, m.location.end.line, m.location.end.column),
  );

  console.log(places);
  console.log('setting decorations');
  console.log('active editor: ', vscode.window.activeTextEditor);

  vscode.window.activeTextEditor?.setDecorations(style, places);
};

export const decorate = (context: vscode.ExtensionContext) => {
  let activeEditor = vscode.window.activeTextEditor;

  if (activeEditor) {
    update(activeEditor.document.uri);
  }

  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor;
      if (editor) {
        update(editor.document.uri);
      }
    },
    null,
    context.subscriptions,
  );

  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (activeEditor && event.document === activeEditor.document) {
        update(event.document.uri);
      }
    },
    null,
    context.subscriptions,
  );
};
