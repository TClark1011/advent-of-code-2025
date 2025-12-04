import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import open from 'open';
import pc from 'picocolors';
import { collectBenchmarkData } from './collectBenchmarkData.ts';
import { generateHtmlReport } from './generateHtmlReport.ts';

const args = process.argv.slice(2);
const dayToBenchmark = args[0];
const iterations = Number.parseInt(args[1]) || 100;

if (!dayToBenchmark) {
  console.error(
    pc.red(
      '✗ No day specified - run with: npm run benchmark {day} [iterations]'
    )
  );
  process.exit(1);
}

console.log(`\n${pc.bold(pc.cyan('═'.repeat(60)))}`);
console.log(
  pc.bold(
    pc.magenta(
      `  🔥 Benchmarking Day ${dayToBenchmark} - ${iterations} iterations 🔥`
    )
  )
);
console.log(`${pc.bold(pc.cyan('═'.repeat(60)))}\n`);

try {
  // Collect benchmark data
  console.log(pc.dim('📊 Collecting benchmark data...'));
  const benchmarkData = await collectBenchmarkData(dayToBenchmark, iterations);
  console.log(pc.green('✓ Benchmark complete!\n'));

  // Generate HTML report
  console.log(pc.dim('🎨 Generating HTML report...'));
  const html = generateHtmlReport(benchmarkData);

  // Write to file
  const reportPath = join(process.cwd(), 'benchmark-report.html');
  await writeFile(reportPath, html, 'utf-8');
  console.log(pc.green(`✓ Report saved to: ${reportPath}\n`));

  // Open in browser
  console.log(pc.cyan('🚀 Opening report in browser...\n'));
  await open(reportPath);

  console.log(
    pc.bold(pc.green('✨ Done! Check your browser for the full report.\n'))
  );
} catch (error) {
  console.error(pc.red('✗ Error during benchmark:'), error);
  process.exit(1);
}
