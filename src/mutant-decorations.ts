import * as vscode from 'vscode';
import * as path from 'path';
import { findStrykerOutputFile } from './fs-helpers';

export interface MutantResult {
  id: string;
  location: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
  mutatorName: string;
  replacement: string;
  status: 'Killed' | 'Survived' | 'Timeout' | 'NoCoverage' | 'RuntimeError' | 'CompileError';
  statusReason?: string;
  killedBy?: string[];
  coveredBy?: string[];
  testsCompleted?: number;
  description?: string;
}

export interface FileResult {
  language: string;
  mutants: MutantResult[];
  source: string;
}

export interface StrykerReport {
  files: Record<string, FileResult>;
  schemaVersion: string;
  thresholds: any;
  projectRoot?: string;
}

class MutantDecorationManager {
  private decorationTypes: Map<string, vscode.TextEditorDecorationType> = new Map();
  private mutantsByFile: Map<string, MutantResult[]> = new Map();
  private isEnabled = false;

  constructor() {
    this.createDecorationTypes();
    this.setupEventListeners();
  }

  private createDecorationTypes() {
    // Survived mutants - red background
    this.decorationTypes.set(
      'Survived',
      vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        border: '1px solid rgba(255, 0, 0, 0.8)',
        borderRadius: '2px',
        isWholeLine: false,
        overviewRulerColor: 'red',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        after: {
          contentText: ' 🔴 Survived',
          color: 'rgba(255, 255, 255, 0.8)',
          fontWeight: 'bold',
          margin: '0 0 0 10px',
        },
      }),
    );

    // Killed mutants - green background
    this.decorationTypes.set(
      'Killed',
      vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        border: '1px solid rgba(0, 255, 0, 0.6)',
        borderRadius: '2px',
        isWholeLine: false,
        overviewRulerColor: 'green',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        after: {
          contentText: ' ✅ Killed',
          color: 'rgba(255, 255, 255, 0.8)',
          fontWeight: 'bold',
          margin: '0 0 0 10px',
        },
      }),
    );

    // Timeout mutants - yellow background
    this.decorationTypes.set(
      'Timeout',
      vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 255, 0, 0.3)',
        border: '1px solid rgba(255, 255, 0, 0.8)',
        borderRadius: '2px',
        isWholeLine: false,
        overviewRulerColor: 'yellow',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        after: {
          contentText: ' ⏱️ Timeout',
          color: 'rgba(0, 0, 0, 0.8)',
          fontWeight: 'bold',
          margin: '0 0 0 10px',
        },
      }),
    );

    // NoCoverage mutants - orange background
    this.decorationTypes.set(
      'NoCoverage',
      vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 165, 0, 0.3)',
        border: '1px solid rgba(255, 165, 0, 0.8)',
        borderRadius: '2px',
        isWholeLine: false,
        overviewRulerColor: 'orange',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        after: {
          contentText: ' 🔶 No Coverage',
          color: 'rgba(255, 255, 255, 0.8)',
          fontWeight: 'bold',
          margin: '0 0 0 10px',
        },
      }),
    );

    // RuntimeError mutants - dark red background
    this.decorationTypes.set(
      'RuntimeError',
      vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(139, 0, 0, 0.3)',
        border: '1px solid rgba(139, 0, 0, 0.8)',
        borderRadius: '2px',
        isWholeLine: false,
        overviewRulerColor: 'darkred',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        after: {
          contentText: ' ❌ Runtime Error',
          color: 'rgba(255, 255, 255, 0.8)',
          fontWeight: 'bold',
          margin: '0 0 0 10px',
        },
      }),
    );

    // CompileError mutants - purple background
    this.decorationTypes.set(
      'CompileError',
      vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(128, 0, 128, 0.3)',
        border: '1px solid rgba(128, 0, 128, 0.8)',
        borderRadius: '2px',
        isWholeLine: false,
        overviewRulerColor: 'purple',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        after: {
          contentText: ' 🔧 Compile Error',
          color: 'rgba(255, 255, 255, 0.8)',
          fontWeight: 'bold',
          margin: '0 0 0 10px',
        },
      }),
    );
  }

  private setupEventListeners() {
    // Update decorations when active editor changes
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && this.isEnabled) {
        this.updateDecorations(editor);
      }
    });

    // Update decorations when text changes
    vscode.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === event.document && this.isEnabled) {
        this.updateDecorations(editor);
      }
    });
  }

  async loadStrykerReport(workspaceFolder: vscode.WorkspaceFolder): Promise<boolean> {
    try {
      const reportFile = findStrykerOutputFile(workspaceFolder.uri);
      if (!reportFile) {
        vscode.window.showWarningMessage('No Stryker output file found. Run Stryker first.');
        return false;
      }

      const reportContent = await vscode.workspace.fs.readFile(reportFile);
      const report: StrykerReport = JSON.parse(reportContent.toString());

      this.mutantsByFile.clear();

      // Convert absolute paths to relative paths and normalize
      for (const [filePath, fileResult] of Object.entries(report.files)) {
        let normalizedPath = filePath;

        // If we have a project root, make paths relative to workspace
        if (report.projectRoot) {
          const absolutePath = path.resolve(report.projectRoot, filePath);
          normalizedPath = path.relative(workspaceFolder.uri.fsPath, absolutePath);
        }

        // Normalize path separators for current platform
        normalizedPath = path.normalize(normalizedPath);

        this.mutantsByFile.set(normalizedPath, fileResult.mutants);
      }

      vscode.window.showInformationMessage(`Loaded mutant results for ${Object.keys(report.files).length} files`);
      return true;
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to load Stryker report: ${error}`);
      return false;
    }
  }

  private getRelativeFilePath(document: vscode.TextDocument, workspaceFolder: vscode.WorkspaceFolder): string {
    return path.relative(workspaceFolder.uri.fsPath, document.uri.fsPath);
  }

  private updateDecorations(editor: vscode.TextEditor) {
    if (!this.isEnabled) {
      return;
    }

    const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
    if (!workspaceFolder) {
      return;
    }

    const relativeFilePath = this.getRelativeFilePath(editor.document, workspaceFolder);
    const mutants = this.mutantsByFile.get(relativeFilePath);

    if (!mutants) {
      // Clear all decorations if no mutants for this file
      this.decorationTypes.forEach((decorationType) => {
        editor.setDecorations(decorationType, []);
      });
      return;
    }

    // Group mutants by status
    const mutantsByStatus = new Map<string, vscode.DecorationOptions[]>();

    for (const mutant of mutants) {
      const status = mutant.status;
      if (!mutantsByStatus.has(status)) {
        mutantsByStatus.set(status, []);
      }

      const startPos = new vscode.Position(
        Math.max(0, mutant.location.start.line - 1), // Convert from 1-based to 0-based
        Math.max(0, mutant.location.start.column - 1),
      );
      const endPos = new vscode.Position(
        Math.max(0, mutant.location.end.line - 1),
        Math.max(0, mutant.location.end.column - 1),
      );

      const range = new vscode.Range(startPos, endPos);

      // Create hover message with mutant details
      const hoverMessage = this.createMutantHoverMessage(mutant);

      const decoration: vscode.DecorationOptions = {
        range,
        hoverMessage,
      };

      mutantsByStatus.get(status)!.push(decoration);
    }

    // Apply decorations for each status
    this.decorationTypes.forEach((decorationType, status) => {
      const decorations = mutantsByStatus.get(status) || [];
      editor.setDecorations(decorationType, decorations);
    });
  }

  private createMutantHoverMessage(mutant: MutantResult): vscode.MarkdownString {
    const markdown = new vscode.MarkdownString();
    markdown.isTrusted = true;

    markdown.appendMarkdown(`**Mutant #${mutant.id}**\n\n`);
    markdown.appendMarkdown(`**Status:** ${mutant.status}\n\n`);
    markdown.appendMarkdown(`**Mutator:** ${mutant.mutatorName}\n\n`);
    markdown.appendMarkdown(`**Replacement:** \`${mutant.replacement}\`\n\n`);

    if (mutant.description) {
      markdown.appendMarkdown(`**Description:** ${mutant.description}\n\n`);
    }

    if (mutant.statusReason) {
      markdown.appendMarkdown(`**Reason:** ${mutant.statusReason}\n\n`);
    }

    if (mutant.testsCompleted !== undefined) {
      markdown.appendMarkdown(`**Tests Completed:** ${mutant.testsCompleted}\n\n`);
    }

    if (mutant.killedBy && mutant.killedBy.length > 0) {
      markdown.appendMarkdown(`**Killed By:** ${mutant.killedBy.join(', ')}\n\n`);
    }

    if (mutant.coveredBy && mutant.coveredBy.length > 0) {
      markdown.appendMarkdown(
        `**Covered By:** ${mutant.coveredBy.slice(0, 5).join(', ')}${mutant.coveredBy.length > 5 ? '...' : ''}\n\n`,
      );
    }

    return markdown;
  }

  enable(): void {
    this.isEnabled = true;
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      this.updateDecorations(editor);
    }
  }

  disable(): void {
    this.isEnabled = false;
    // Clear all decorations
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      this.decorationTypes.forEach((decorationType) => {
        editor.setDecorations(decorationType, []);
      });
    }
  }

  toggle(): void {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  isDecorationEnabled(): boolean {
    return this.isEnabled;
  }

  dispose(): void {
    this.decorationTypes.forEach((decorationType) => {
      decorationType.dispose();
    });
    this.decorationTypes.clear();
    this.mutantsByFile.clear();
  }
}

export const mutantDecorationManager = new MutantDecorationManager();
