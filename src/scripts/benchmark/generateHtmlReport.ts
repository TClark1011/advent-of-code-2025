import type { BenchmarkData, PercentileSample } from './types.ts';

const formatTime = (ms: number): string => {
  if (ms < 0.001) return `${(ms * 1000).toFixed(4)}µs`;
  if (ms < 1) return `${ms.toFixed(4)}ms`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

const formatOps = (hz: number): string => {
  if (hz > 1000000) return `${(hz / 1000000).toFixed(2)}M ops/s`;
  if (hz > 1000) return `${(hz / 1000).toFixed(2)}K ops/s`;
  return `${hz.toFixed(2)} ops/s`;
};

const selectSamplesByPercentile = (
  samplesArray: number[]
): PercentileSample[] => {
  const sorted = [...samplesArray].sort((a, b) => a - b);
  const percentiles = [
    { p: 1, label: 'p1 (Fastest)' },
    { p: 25, label: 'p25' },
    { p: 50, label: 'p50 (Median)' },
    { p: 75, label: 'p75' },
    { p: 99, label: 'p99 (Slowest)' },
  ];

  const mean =
    samplesArray.reduce((sum, val) => sum + val, 0) / samplesArray.length;

  return percentiles.map(({ p, label }) => {
    const index = Math.floor((sorted.length - 1) * (p / 100));
    const time = sorted[index];
    const originalIndex = samplesArray.indexOf(time);
    const diffPercent = ((time - mean) / mean) * 100;

    return {
      percentile: `p${p}`,
      label,
      runNumber: originalIndex + 1,
      time,
      diffPercent,
    };
  });
};

export function generateHtmlReport(data: BenchmarkData): string {
  const part1 = data.results[0];
  const part2 = data.results[1];
  const ratio = part2 ? part2.mean / part1.mean : 0;

  // Prepare chart data
  const part1Samples = part1.samplesArray
    ? selectSamplesByPercentile(part1.samplesArray)
    : [];
  const part2Samples = part2?.samplesArray
    ? selectSamplesByPercentile(part2.samplesArray)
    : [];

  const chartData = {
    comparison: {
      labels: ['Part 1', 'Part 2'],
      data: [part1.mean, part2?.mean ?? 0],
    },
    part1Distribution: {
      labels: part1Samples.map((s) => s.label),
      data: part1Samples.map((s) => s.time),
    },
    part2Distribution: {
      labels: part2Samples.map((s) => s.label),
      data: part2Samples.map((s) => s.time),
    },
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Benchmark Report - Day ${data.day}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
      color: #e8eaed;
      padding: 2rem;
      min-height: 100vh;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: #1a1a2e;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
      overflow: hidden;
      border: 1px solid #2d2d44;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3rem 2rem;
      text-align: center;
      border-bottom: 2px solid #8b7dd8;
    }
    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
    }
    .header p {
      font-size: 1.1rem;
      opacity: 0.95;
    }
    .content {
      padding: 2rem;
    }
    .section {
      margin-bottom: 3rem;
    }
    .section-title {
      font-size: 1.8rem;
      color: #a891f5;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 3px solid #667eea;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .card {
      background: #252538;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      border: 1px solid #3a3a52;
    }
    .card h3 {
      color: #a891f5;
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: #252538;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      border: 1px solid #3a3a52;
    }
    thead {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #3a3a52;
    }
    th {
      color: white;
      font-weight: 600;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:hover {
      background: #2d2d44;
    }
    .metric-value {
      font-weight: 600;
      color: #a891f5;
    }
    .chart-container {
      position: relative;
      height: 400px;
      margin-top: 1rem;
      background: #252538;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      border: 1px solid #3a3a52;
    }
    .insights {
      background: #3d3520;
      border-left: 4px solid #ffc107;
      padding: 1.5rem;
      border-radius: 8px;
      color: #f4e4a6;
      border: 1px solid #5a4f2a;
    }
    .insights.success {
      background: #1f3a2d;
      border-left-color: #4ade80;
      color: #b8f5d0;
      border: 1px solid #2d5a44;
    }
    .insights ul {
      list-style: none;
      padding-left: 0;
    }
    .insights li {
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
    }
    .insights li:before {
      content: "⚠️";
      position: absolute;
      left: 0;
    }
    .insights.success li:before {
      content: "✓";
    }
    .positive { color: #4ade80; font-weight: 600; }
    .negative { color: #f87171; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔥 Benchmark Report</h1>
      <p>Day ${data.day} • ${data.iterations} iterations • ${new Date(data.timestamp).toLocaleString()}</p>
    </div>
    
    <div class="content">
      <!-- Overall Comparison -->
      <section class="section">
        <h2 class="section-title">📊 Overall Comparison</h2>
        <table>
          <thead>
            <tr>
              <th>Part</th>
              <th>Mean Time</th>
              <th>% of Total</th>
              <th>Relative Speed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>⭐ Part 1</td>
              <td class="metric-value">${formatTime(part1.mean)}</td>
              <td>${((part1.mean / data.totalMean) * 100).toFixed(1)}%</td>
              <td>1.00x (baseline)</td>
            </tr>
            ${
              part2
                ? `
            <tr>
              <td>⭐ Part 2</td>
              <td class="metric-value">${formatTime(part2.mean)}</td>
              <td>${((part2.mean / data.totalMean) * 100).toFixed(1)}%</td>
              <td>${ratio.toFixed(2)}x ${ratio > 1 ? 'slower' : 'faster'}</td>
            </tr>
            `
                : ''
            }
          </tbody>
        </table>
        <div class="chart-container" style="margin-top: 2rem;">
          <canvas id="comparisonChart"></canvas>
        </div>
      </section>

      <!-- Part 1 Analysis -->
      <section class="section">
        <h2 class="section-title">⭐ Part 1 Analysis</h2>
        <div class="grid">
          <div class="card">
            <h3>📈 Statistics</h3>
            <table>
              <tbody>
                ${
                  part1.statistics
                    ? `
                <tr><td>Mean</td><td class="metric-value">${formatTime(part1.statistics.mean)}</td></tr>
                <tr><td>Min</td><td class="metric-value">${formatTime(part1.statistics.min)}</td></tr>
                <tr><td>Max</td><td class="metric-value">${formatTime(part1.statistics.max)}</td></tr>
                <tr><td>Median (p50)</td><td class="metric-value">${formatTime(part1.statistics.p50)}</td></tr>
                <tr><td>p75</td><td class="metric-value">${formatTime(part1.statistics.p75)}</td></tr>
                <tr><td>p99</td><td class="metric-value">${formatTime(part1.statistics.p99)}</td></tr>
                <tr><td>Std Dev</td><td class="metric-value">${formatTime(part1.statistics.sd)}</td></tr>
                <tr><td>Ops/sec</td><td class="metric-value">${formatOps(part1.hz)}</td></tr>
                <tr><td>Samples</td><td class="metric-value">${part1.statistics.samplesCount}</td></tr>
                `
                    : '<tr><td colspan="2">No statistics available</td></tr>'
                }
              </tbody>
            </table>
          </div>
          <div class="card">
            <h3>🎯 Sample Distribution</h3>
            ${
              part1Samples.length > 0
                ? `
            <table>
              <thead>
                <tr>
                  <th>Percentile</th>
                  <th>Time</th>
                  <th>vs Mean</th>
                </tr>
              </thead>
              <tbody>
                ${part1Samples
                  .map(
                    (s) => `
                <tr>
                  <td>${s.label}</td>
                  <td class="metric-value">${formatTime(s.time)}</td>
                  <td class="${s.diffPercent < 0 ? 'positive' : 'negative'}">
                    ${s.diffPercent >= 0 ? '+' : ''}${s.diffPercent.toFixed(1)}%
                  </td>
                </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
            `
                : '<p>No samples available</p>'
            }
          </div>
        </div>
        ${
          part1Samples.length > 0
            ? `
        <div class="chart-container">
          <canvas id="part1Chart"></canvas>
        </div>
        `
            : ''
        }
      </section>

      ${
        part2
          ? `
      <!-- Part 2 Analysis -->
      <section class="section">
        <h2 class="section-title">⭐ Part 2 Analysis</h2>
        <div class="grid">
          <div class="card">
            <h3>📈 Statistics</h3>
            <table>
              <tbody>
                ${
                  part2.statistics
                    ? `
                <tr><td>Mean</td><td class="metric-value">${formatTime(part2.statistics.mean)}</td></tr>
                <tr><td>Min</td><td class="metric-value">${formatTime(part2.statistics.min)}</td></tr>
                <tr><td>Max</td><td class="metric-value">${formatTime(part2.statistics.max)}</td></tr>
                <tr><td>Median (p50)</td><td class="metric-value">${formatTime(part2.statistics.p50)}</td></tr>
                <tr><td>p75</td><td class="metric-value">${formatTime(part2.statistics.p75)}</td></tr>
                <tr><td>p99</td><td class="metric-value">${formatTime(part2.statistics.p99)}</td></tr>
                <tr><td>Std Dev</td><td class="metric-value">${formatTime(part2.statistics.sd)}</td></tr>
                <tr><td>Ops/sec</td><td class="metric-value">${formatOps(part2.hz)}</td></tr>
                <tr><td>Samples</td><td class="metric-value">${part2.statistics.samplesCount}</td></tr>
                `
                    : '<tr><td colspan="2">No statistics available</td></tr>'
                }
              </tbody>
            </table>
          </div>
          <div class="card">
            <h3>🎯 Sample Distribution</h3>
            ${
              part2Samples.length > 0
                ? `
            <table>
              <thead>
                <tr>
                  <th>Percentile</th>
                  <th>Time</th>
                  <th>vs Mean</th>
                </tr>
              </thead>
              <tbody>
                ${part2Samples
                  .map(
                    (s) => `
                <tr>
                  <td>${s.label}</td>
                  <td class="metric-value">${formatTime(s.time)}</td>
                  <td class="${s.diffPercent < 0 ? 'positive' : 'negative'}">
                    ${s.diffPercent >= 0 ? '+' : ''}${s.diffPercent.toFixed(1)}%
                  </td>
                </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
            `
                : '<p>No samples available</p>'
            }
          </div>
        </div>
        ${
          part2Samples.length > 0
            ? `
        <div class="chart-container">
          <canvas id="part2Chart"></canvas>
        </div>
        `
            : ''
        }
      </section>
      `
          : ''
      }

      <!-- Performance Insights -->
      <section class="section">
        <h2 class="section-title">💡 Performance Insights</h2>
        <div class="insights ${data.insights.length === 0 ? 'success' : ''}">
          ${
            data.insights.length > 0
              ? `
          <ul>
            ${data.insights.map((insight) => `<li>${insight}</li>`).join('')}
          </ul>
          `
              : '<p><strong>✓ No performance issues detected!</strong></p>'
          }
        </div>
      </section>
    </div>
  </div>

  <script>
    const chartData = ${JSON.stringify(chartData)};
    
    // Common chart options with dark mode colors
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: '#e8eaed'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#a8a8b8'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          }
        },
        y: {
          ticks: {
            color: '#a8a8b8'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          }
        }
      }
    };
    
    // Comparison chart
    new Chart(document.getElementById('comparisonChart'), {
      type: 'bar',
      data: {
        labels: chartData.comparison.labels,
        datasets: [{
          label: 'Mean Time (ms)',
          data: chartData.comparison.data,
          backgroundColor: ['rgba(102, 126, 234, 0.9)', 'rgba(118, 75, 162, 0.9)'],
          borderColor: ['rgba(168, 145, 245, 1)', 'rgba(168, 145, 245, 1)'],
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        ...commonOptions,
        plugins: {
          ...commonOptions.plugins,
          title: { 
            display: true, 
            text: 'Mean Execution Time Comparison', 
            font: { size: 16, weight: 'bold' },
            padding: 20,
            color: '#e8eaed'
          },
          tooltip: {
            backgroundColor: 'rgba(37, 37, 56, 0.95)',
            titleColor: '#e8eaed',
            bodyColor: '#e8eaed',
            borderColor: '#667eea',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                return 'Time: ' + context.parsed.y.toFixed(4) + 'ms';
              }
            }
          }
        },
        scales: {
          y: { 
            beginAtZero: true, 
            title: { 
              display: true, 
              text: 'Time (ms)', 
              font: { weight: 'bold' },
              color: '#a8a8b8'
            },
            ticks: { color: '#a8a8b8' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          x: {
            ticks: { color: '#a8a8b8' },
            grid: { display: false }
          }
        }
      }
    });

    ${
      part1Samples.length > 0
        ? `
    // Part 1 distribution chart
    new Chart(document.getElementById('part1Chart'), {
      type: 'line',
      data: {
        labels: chartData.part1Distribution.labels,
        datasets: [{
          label: 'Execution Time',
          data: chartData.part1Distribution.data,
          borderColor: 'rgba(168, 145, 245, 1)',
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: 'rgba(168, 145, 245, 1)',
          pointBorderColor: '#252538',
          pointBorderWidth: 2
        }]
      },
      options: {
        ...commonOptions,
        plugins: {
          ...commonOptions.plugins,
          title: { 
            display: true, 
            text: 'Part 1 - Percentile Distribution', 
            font: { size: 16, weight: 'bold' },
            padding: 20,
            color: '#e8eaed'
          },
          tooltip: {
            backgroundColor: 'rgba(37, 37, 56, 0.95)',
            titleColor: '#e8eaed',
            bodyColor: '#e8eaed',
            borderColor: '#667eea',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                return 'Time: ' + context.parsed.y.toFixed(4) + 'ms';
              }
            }
          }
        },
        scales: {
          y: { 
            beginAtZero: true, 
            title: { 
              display: true, 
              text: 'Time (ms)', 
              font: { weight: 'bold' },
              color: '#a8a8b8'
            },
            ticks: { color: '#a8a8b8' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          x: {
            ticks: { color: '#a8a8b8' },
            grid: { display: false }
          }
        }
      }
    });
    `
        : ''
    }

    ${
      part2 && part2Samples.length > 0
        ? `
    // Part 2 distribution chart
    new Chart(document.getElementById('part2Chart'), {
      type: 'line',
      data: {
        labels: chartData.part2Distribution.labels,
        datasets: [{
          label: 'Execution Time',
          data: chartData.part2Distribution.data,
          borderColor: 'rgba(168, 145, 245, 1)',
          backgroundColor: 'rgba(118, 75, 162, 0.2)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: 'rgba(168, 145, 245, 1)',
          pointBorderColor: '#252538',
          pointBorderWidth: 2
        }]
      },
      options: {
        ...commonOptions,
        plugins: {
          ...commonOptions.plugins,
          title: { 
            display: true, 
            text: 'Part 2 - Percentile Distribution', 
            font: { size: 16, weight: 'bold' },
            padding: 20,
            color: '#e8eaed'
          },
          tooltip: {
            backgroundColor: 'rgba(37, 37, 56, 0.95)',
            titleColor: '#e8eaed',
            bodyColor: '#e8eaed',
            borderColor: '#667eea',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                return 'Time: ' + context.parsed.y.toFixed(4) + 'ms';
              }
            }
          }
        },
        scales: {
          y: { 
            beginAtZero: true, 
            title: { 
              display: true, 
              text: 'Time (ms)', 
              font: { weight: 'bold' },
              color: '#a8a8b8'
            },
            ticks: { color: '#a8a8b8' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          x: {
            ticks: { color: '#a8a8b8' },
            grid: { display: false }
          }
        }
      }
    });
    `
        : ''
    }
  </script>
</body>
</html>`;
}
