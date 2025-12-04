import { Bench } from 'tinybench';
import type { Puzzle } from '../../types/Puzzle.ts';
import readFile from '../../utils/readFile.ts';
import type { BenchmarkData, BenchmarkResult } from './types.ts';

export async function collectBenchmarkData(
  day: string,
  iterations: number
): Promise<BenchmarkData> {
  // Load input
  const puzzlePath = `src/days/${day}`;
  const input = await readFile(`${puzzlePath}/input.txt`);

  // Load puzzle
  const { first, second }: Puzzle = await import(`../../days/${day}/Puzzle.ts`);

  // Create benchmark suite
  const bench = new Bench({
    iterations,
    warmupIterations: 10,
    retainSamples: true,
  });

  bench
    .add('Part 1', () => {
      first(input);
    })
    .add('Part 2', () => {
      second(input);
    });

  // Run benchmarks
  await bench.run();

  // Extract results
  const results: BenchmarkResult[] = bench.tasks.map((task) => {
    const result = task.result;

    // Check if the result exists and is in a completed state with statistics
    if (
      result.state !== 'completed' &&
      result.state !== 'aborted-with-statistics'
    ) {
      return {
        name: task.name,
        mean: 0,
        min: 0,
        max: 0,
        hz: 0,
        samples: 0,
        samplesArray: undefined,
        statistics: undefined,
      };
    }

    const mean = result.latency.mean;
    const min = result.latency.min;
    const max = result.latency.max;

    return {
      name: task.name,
      mean,
      min,
      max,
      hz: result.throughput.mean,
      samples: result.latency.samplesCount,
      samplesArray: result.latency.samples,
      statistics: {
        mean: result.latency.mean,
        min: result.latency.min,
        max: result.latency.max,
        p50: result.latency.p50,
        p75: result.latency.p75,
        p99: result.latency.p99,
        sd: result.latency.sd,
        variance: result.latency.variance,
        samplesCount: result.latency.samplesCount,
      },
    };
  });

  const totalMean = results.reduce((sum, r) => sum + r.mean, 0);

  // Generate insights
  const insights: string[] = [];
  const part1 = results[0];
  const part2 = results[1];

  if (part1 && part1.mean > 100) {
    insights.push('Part 1 is taking over 100ms - consider optimization');
  }
  if (part2 && part2.mean > 100) {
    insights.push('Part 2 is taking over 100ms - consider optimization');
  }

  if (part1?.statistics && part1.mean > 1) {
    const part1VariancePercent = (part1.statistics.variance / part1.mean) * 100;
    if (part1VariancePercent > 50) {
      insights.push(
        `Part 1 shows high variance (${part1VariancePercent.toFixed(0)}%) - results may be unstable`
      );
    }
  }
  if (part2?.statistics && part2.mean > 1) {
    const part2VariancePercent = (part2.statistics.variance / part2.mean) * 100;
    if (part2VariancePercent > 50) {
      insights.push(
        `Part 2 shows high variance (${part2VariancePercent.toFixed(0)}%) - results may be unstable`
      );
    }
  }

  return {
    day,
    iterations,
    timestamp: new Date().toISOString(),
    results,
    totalMean,
    insights,
  };
}
