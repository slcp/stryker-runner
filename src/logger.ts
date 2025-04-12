import * as vscode from 'vscode';

type Logger = {
  log: (message: string) => void;
  info: (message: string) => void;
  error: (message: string) => void;
};

let channel: vscode.OutputChannel | undefined;
let logger: Logger | undefined;

export const getLogger = () => {
  if (!channel) {
    channel = vscode.window.createOutputChannel('Stryker Runner');
  }
  // Stryker disable next-line BooleanLiteral,BlockStatement
  if (!logger) {
    logger = createLogger(channel);
  }
  return logger;
};

export const createLogger = (channel: vscode.OutputChannel): Logger => {
  const timestamp = () => new Date().toISOString();

  const logWithLevel = (level: string, message: string) => {
    const line = `[${timestamp()}] [${level}] ${message}`;
    channel.appendLine(line);
  };

  return {
    log: (message: string) => logWithLevel('LOG', message),
    info: (message: string) => logWithLevel('INFO', message),
    error: (message: string) => logWithLevel('ERROR', message),
  };
};
