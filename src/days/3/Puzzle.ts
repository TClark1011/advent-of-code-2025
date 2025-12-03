const first = (input: string) => {
  const banks: number[][] = input.split('\n')
    .map(line => 
      line.split('')
        .map(Number)
    )

  const highestBankJoltages: number[] =
    banks.map(joltages => {
      // let bestDigitOne = joltages[0];
      // let bestDigitTwo = joltages[1];
      let bestFirstDigitIndex = 0;
      let bestSecondDigitIndex = 1;
      
      for (let i = bestSecondDigitIndex + 1; i < joltages.length - 1; i++) {
        const currentFirstDigitIndex = i;
        const currentSecondDigitIndex = i + 1;

        const bestFirstDigit = joltages[bestFirstDigitIndex]
        const bestSecondDigit = joltages[bestSecondDigitIndex]

        const currentFirstDigit = joltages[currentFirstDigitIndex];
        const currentSecondDigit = joltages[currentSecondDigitIndex]

        // We have found a higher value for the first index...
        if (currentFirstDigit > bestFirstDigit) {
          if (bestSecondDigitIndex <= currentFirstDigitIndex) {
            // Second digit must come after first, so if the 
            // new first index would break that, we select the
            // current second index
            bestSecondDigitIndex = currentSecondDigitIndex
          }
          bestFirstDigitIndex = currentFirstDigitIndex
        }

        // We have found a higher value for the first index
        if (currentSecondDigit > bestSecondDigit) {
          bestSecondDigitIndex = currentSecondDigitIndex
        }
      }

      const bestFirstDigit = joltages[bestFirstDigitIndex];
      const bestSecondDigit = joltages[bestSecondDigitIndex];

      return bestFirstDigit * 10 + bestSecondDigit
    })

  let result = 0;
  highestBankJoltages.forEach(joltage => {
    result += joltage;
  })

  return result;
};

const expectedFirstSolution = 357;

const second = (input: string) => {
  input
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { expectedFirstSolution, expectedSecondSolution, first, second };
