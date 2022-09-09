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
