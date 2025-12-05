const first = (input: string) => {
  const [rawFreshIdRanges, rawIds] = input.split('\n\n');

  const availableIds = rawIds.split('\n').map(Number);

  const freshIdRanges: [number, number][] = rawFreshIdRanges
    .split('\n')
    .map((idRangeRow) => idRangeRow.split('-').map(Number) as [number, number]);

  let freshAvailableIdCount = 0;

  for (const id of availableIds) {
    for (const [start, end] of freshIdRanges) {
      const idIsInRange = id >= start && id <= end;
      if (!idIsInRange) continue;

      freshAvailableIdCount++;
      break;
    }
  }

  return freshAvailableIdCount;

  // return 0;
};

const expectedFirstSolution = 3;

const second = (input: string) => {
  input;
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { expectedFirstSolution, expectedSecondSolution, first, second };
