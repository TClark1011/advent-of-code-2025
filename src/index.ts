import Table from 'cli-table3';
import pc from 'picocolors';
import type { Puzzle } from './types/Puzzle.ts';
import readFile from './utils/readFile.ts';

const args = process.argv.slice(2);
const dayToSolve = args[0];

if (!dayToSolve) {
  console.error(pc.red('✗ No day specified - run with: npm run dev {day}'));
  process.exit(1);
}

// Header
console.log(`\n${pc.bold(pc.cyan('═'.repeat(50)))}`);
console.log(pc.bold(pc.green(`  🎄 Advent of Code 2025 - Day ${args[0]} 🎄`)));
console.log(`${pc.bold(pc.cyan('═'.repeat(50)))}\n`);

let input = '';
const puzzleName = args[0];
try {
  const puzzlePath = `src/days/${puzzleName}`;
  input = await readFile(`${puzzlePath}/input.txt`);
  console.log(pc.dim(`📂 Loaded input from ${puzzlePath}/input.txt\n`));
} catch (error) {
  console.error(pc.red('✗ Error loading input:'), error);
  process.exit(1);
}

const { first, second }: Puzzle = await import(
  `./days/${puzzleName}/Puzzle.ts`
);

// Part 1
const startTime1 = performance.now();
const solution1 = first(input);
const endTime1 = performance.now();
const time1 = endTime1 - startTime1;

// Part 2
const startTime2 = performance.now();
const solution2 = second(input);
const endTime2 = performance.now();
const time2 = endTime2 - startTime2;

// Create results table
const TIME_PRECISION = 4;
const table = new Table({
  head: ['', pc.bold(pc.white('Solution')), pc.bold(pc.white('Time'))],
  style: {
    head: [],
    border: ['dim'],
  },
});

table.push(
  [
    pc.cyan('#1'),
    pc.green(pc.bold(String(solution1))),
    pc.yellow(`${time1.toFixed(TIME_PRECISION)}ms`),
  ],
  [
    pc.cyan('#2'),
    pc.green(pc.bold(String(solution2))),
    pc.yellow(`${time2.toFixed(TIME_PRECISION)}ms`),
  ]
);

console.log(table.toString());

// Summary
const totalTime = time1 + time2;
console.log(`\n${pc.dim('─'.repeat(50))}`);
console.log(
  pc.bold(`⚡ Total execution time: ${pc.magenta(`${totalTime.toFixed(2)}ms`)}`)
);
console.log(`${pc.dim('─'.repeat(50))}\n`);
