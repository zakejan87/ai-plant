
export enum DiagnosisStatus {
  Healthy = 'Healthy',
  Diseased = 'Diseased',
  Unknown = 'Unknown'
}

export interface DiagnosisResult {
  diagnosis: DiagnosisStatus;
  confidence: number;
  reasoning: string;
}
