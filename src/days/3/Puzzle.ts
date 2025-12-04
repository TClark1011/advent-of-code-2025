const getLastElement = <T>(arr: T[]): T | undefined => {
  if (arr.length === 0) return undefined;

  return arr[arr.length - 1];
};

/**
 * Like `Array.indexOf`, but returns undefined if item
 * is not found
 */
const indexOf = <T>(arr: T[], searchFor: T): number | undefined => {
  const rawIndexOf = arr.indexOf(searchFor);
  if (rawIndexOf === -1) return undefined;

  return rawIndexOf;
};

const assembleTotalJoltage = (joltageDigits: number[]): number => {
  let result = 0;
  joltageDigits.forEach((joltageDigit, i) => {
    const multiplier = 10 ** (joltageDigits.length - i - 1);
    result += joltageDigit * multiplier;
  });

  return result;
};

/**
 * TODO OPTIMISATION: After selecting an index that is the last
 * selectable one, we know that all following indexes will be
 * selected
 */
const solveBankProblem = (input: string, joltagesPerBank: number) => {
  const banks: number[][] = input
    .split('\n')
    .map((line) => line.split('').map(Number));

  const highestBankJoltages: number[] = banks.map((joltages) => {
    const bestDigitIndexes: number[] = [];
    const lastJoltageIndex = joltages.length - 1;

    rootLoop: for (
      let joltageNumber = joltagesPerBank;
      joltageNumber > 0 && bestDigitIndexes.length < joltagesPerBank;
      joltageNumber--
    ) {
      // Must leave room for all future indexes to be selected
      const maximumSelectableIndex = joltages.length - joltageNumber;

      const lastSelectedIndex = getLastElement(bestDigitIndexes);

      // Can only select indexes that come after any previously selected
      // indexes
      const minimumSelectableIndex =
        lastSelectedIndex === undefined ? 0 : lastSelectedIndex + 1;

      const selectableJoltages = joltages.slice(
        minimumSelectableIndex,
        maximumSelectableIndex + 1 //slice's maximum is non-inclusive
      );

      // We search for our next digit, starting at the highest
      // value and progressing down
      for (let targetDigit = 9; targetDigit > 0; targetDigit--) {
        const indexWithinSelectable = indexOf(selectableJoltages, targetDigit);

        if (indexWithinSelectable === undefined) continue;

        const indexOfTargetDigit =
          indexWithinSelectable + minimumSelectableIndex;

        // If the number of remaining joltages is equal to the
        // number of joltages we have left to select, we can
        // select all the remaining joltages and stop searching
        if (indexOfTargetDigit === maximumSelectableIndex) {
          for (let i = indexOfTargetDigit; i <= lastJoltageIndex; i++) {
            bestDigitIndexes.push(i);
          }
          break rootLoop;
        }

        // If we have found a new digit, add it to the array
        // and begin the search for the next index
        bestDigitIndexes.push(indexOfTargetDigit);
        continue rootLoop;
      }
    }

    return assembleTotalJoltage(
      bestDigitIndexes.map((digitIndex) => joltages[digitIndex])
    );
  });

  let result = 0;
  for (const joltage of highestBankJoltages) {
    result += joltage;
  }

  return result;
};

const first = (input: string) => {
  return solveBankProblem(input, 2);
};

const expectedFirstSolution = 357;

const second = (input: string) => {
  return solveBankProblem(input, 12);
};

const expectedSecondSolution = 3121910778619;

export { expectedFirstSolution, expectedSecondSolution, first, second };
