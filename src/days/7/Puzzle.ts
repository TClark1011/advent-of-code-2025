const EMPTY = '.';
const SPLITTER = '^';

type Coordinates = [x: number, y: number];

const cooridnatesComparator =
  (coords: Coordinates) =>
  (otherCoords: Coordinates): boolean => {
    return coords[0] === otherCoords[0] && coords[1] === otherCoords[1];
  };

const beamSplits = (
  startFrom: Coordinates,
  grid: string[][],
  previousSplitsAt: Coordinates[]
): Coordinates[] => {
  const x = startFrom[0];
  let y = startFrom[1];

  // Check if the current beam will ever hit a splitter, if it doesn't
  // we can return
  let everHitsSplitter = false;
  for (let projectedY = y; projectedY < grid.length; projectedY++) {
    if (grid[projectedY][x] === EMPTY) continue;

    everHitsSplitter = true;
    break;
  }
  if (!everHitsSplitter) return [];

  const splitsAt: Coordinates[] = [];
  while (y < grid.length) {
    if (grid[y][x] === SPLITTER) {
      if (!previousSplitsAt.some(cooridnatesComparator([x, y]))) {
        splitsAt.push([x, y]);
        previousSplitsAt.push([x, y]);
        splitsAt.push(
          ...beamSplits([x + 1, y], grid, previousSplitsAt),
          ...beamSplits([x - 1, y], grid, previousSplitsAt)
        );
      }
      break;
    }

    y++;
  }

  return splitsAt;
};

const first = (input: string) => {
  const grid = input.split('\n').map((row) => row.split(''));

  const startingX = grid[0].indexOf('S');

  const splits = beamSplits([startingX, 0], grid, []);

  return splits.length;
};

const expectedFirstSolution = 21;

const second = (input: string) => {
  input;
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { expectedFirstSolution, expectedSecondSolution, first, second };
