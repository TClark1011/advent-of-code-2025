const deriveCombinedJoltage = (first: number, second: number) =>
  first * 10 + second;

const first = (input: string) => {
  const banks: number[][] = input
    .split('\n')
    .map((line) => line.split('').map(Number));

  const highestBankJoltages: number[] = banks.map((joltages) => {
    const lastJoltage = joltages.pop()!;

    let bestFirstDigitIndex = -1;
    let bestSecondDigitIndex = -1;
    for (let i = 9; i >= 0; i--) {
      if (bestFirstDigitIndex === -1) {
        const indexOfFirstDigit = joltages.indexOf(i);
        if (indexOfFirstDigit === -1) continue; // skip iteration if digit is not in the bank
        bestFirstDigitIndex = indexOfFirstDigit;
      }

      if (bestFirstDigitIndex > -1) {
        const indexOfSecondDigit = joltages.indexOf(i, bestFirstDigitIndex + 1);
        if (indexOfSecondDigit === -1) continue;
        bestSecondDigitIndex = indexOfSecondDigit;
      }

      if (bestFirstDigitIndex > -1 && bestSecondDigitIndex > -1) break;
    }

    const bestFirstDigit = joltages[bestFirstDigitIndex];
    let bestSecondDigit = Math.max(lastJoltage, joltages[bestSecondDigitIndex]);
    if (Number.isNaN(bestSecondDigit)) {
      bestSecondDigit = lastJoltage;
    }

    return deriveCombinedJoltage(bestFirstDigit, bestSecondDigit);
  });

  let result = 0;
  highestBankJoltages.forEach((joltage) => {
    result += joltage;
  });

  return result;
};

const expectedFirstSolution = 357;

const second = (input: string) => {
  input;
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { expectedFirstSolution, expectedSecondSolution, first, second };
