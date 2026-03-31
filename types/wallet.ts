export type AnalyzeResult = {
  address: string;
  totalValue: number | null;
  personas: string[];
  primaryChain: string | null;
  aiSummary: string;
  dailyChange?: number | null;
  dailyPercent?: number | null;
};

export type AnalyzeApiResponse = {
  ok: boolean;
  result?: AnalyzeResult;
  raw?: unknown;
  error?: string;
};