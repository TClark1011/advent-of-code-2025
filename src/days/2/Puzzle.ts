const first = (input: string) => {
  const ids: number[] = [];

  input
    .split(',')
    .map((rawIdRange) => rawIdRange.split('-').map(Number))
    .forEach((range) => {
      const min = range[0];
      const max = range[1];

      for (let i = min; i <= max; i++) {
        ids.push(i);
      }
    });

  const invalidIds = ids.filter((id) => {
    const stringId = String(id);
    if (stringId.length % 2 !== 0) return false;

    const midpoint = stringId.length / 2;
    const firstHalf = stringId.slice(0, midpoint);
    const secondHalf = stringId.slice(midpoint);

    return firstHalf === secondHalf;
  });

  let invalidIdsSum = 0;
  invalidIds.forEach((id) => {
    invalidIdsSum += id;
  });

  return invalidIdsSum;
};

const expectedFirstSolution = 1227775554;


const second = (input: string) => {
  const ids: number[] = [];

  input
    .split(',')
    .map((rawIdRange) => rawIdRange.split('-').map(Number))
    .forEach((range) => {
      const min = range[0];
      const max = range[1];

      for (let i = min; i <= max; i++) {
        ids.push(i);
      }
    });

  const invalidIds = ids.filter((id) => {
    const stringId = String(id);
    return /^(\d+)(?:\1)+$/.test(stringId);
  });

  let invalidIdsSum = 0;
  invalidIds.forEach((id) => {
    invalidIdsSum += id;
  });

  return invalidIdsSum;
};

const expectedSecondSolution = 4174379265;

export { expectedFirstSolution, expectedSecondSolution, first, second };
