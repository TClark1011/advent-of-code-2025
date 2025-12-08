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
};

const expectedFirstSolution = 3;

const countIdsInRange = (min: number, max: number) => max - min + 1;

const second = (input: string) => {
  const freshIdRanges: [number, number][] = input
    .split('\n\n')[0]
    .split('\n')
    .map((idRangeRow) => idRangeRow.split('-').map(Number) as [number, number]);

  freshIdRanges.sort((a, b) => countIdsInRange(...a) - countIdsInRange(...b));
  freshIdRanges.sort((a, b) => a[0] - b[0]);
  // We apply multiple sorts with following priority
  // - Lowest to highest min value
  // - Lowest to highest id count

  let freshIdCount = 0;

  const cleanRanges: [number, number][] = [];

  const trackRange = (min: number, max: number) => {
    freshIdCount += countIdsInRange(min, max);
    cleanRanges.push([min, max]);
  };

  for (let i = 0; i < freshIdRanges.length; i++) {
    if (!freshIdRanges[i + 1]) {
      trackRange(...freshIdRanges[i]);
      continue;
    }

    const [currentMin, currentMax] = freshIdRanges[i];
    const [nextMin, nextMax] = freshIdRanges[i + 1];

    if (currentMin === nextMin && currentMax <= nextMax) continue;

    let finalCurrentMax = currentMax;

    if (currentMax >= nextMin && currentMax <= nextMax) {
      finalCurrentMax = nextMin - 1;
    }

    if (finalCurrentMax < currentMin) continue;

    const isIrrelevant = cleanRanges.some(
      ([existingMin, existingMax]) =>
        existingMin <= currentMin && existingMax >= finalCurrentMax
    );

    if (isIrrelevant) continue;
    trackRange(currentMin, finalCurrentMax);
  }

  return freshIdCount;
};

const expectedSecondSolution = 14;

export { expectedFirstSolution, expectedSecondSolution, first, second };
