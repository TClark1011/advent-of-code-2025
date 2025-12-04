export type BenchmarkStatistics = {
  mean: number;
  min: number;
  max: number;
  p50: number;
  p75: number;
  p99: number;
  sd: number;
  variance: number;
  samplesCount: number;
};

export type PercentileSample = {
  percentile: string;
  label: string;
  runNumber: number;
  time: number;
  diffPercent: number;
};

export type BenchmarkResult = {
  name: string;
  mean: number;
  min: number;
  max: number;
  hz: number;
  samples: number;
  samplesArray: number[] | undefined;
  statistics: BenchmarkStatistics | undefined;
};

export type BenchmarkData = {
  day: string;
  iterations: number;
  timestamp: string;
  results: BenchmarkResult[];
  totalMean: number;
  insights: string[];
};
