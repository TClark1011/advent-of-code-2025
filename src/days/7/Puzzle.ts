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

const toHex = (num: number): string => num.toString(16);
const parseHex = (hex: string): number => parseInt(hex, 16);

const parseTileValue = (tile: string): number => {
  if (tile === SPLITTER || tile === EMPTY) return 0;
  return parseHex(tile);
};

/**
 * Wasn't able to solve this myself, had to look up an explainer
 * for the algorithm, but the code is all mine.
 */
const second = (input: string) => {
  const grid = input.split('\n').map((row) => row.split(''));
  const splitterCoordinates: Coordinates[] = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === SPLITTER) {
        splitterCoordinates.push([x, y]);
      }
    }
  }

  const startingX = grid[0].indexOf('S');
  const activeXs = new Set([startingX]);

  grid[0][startingX] = '1';

  const getCellValue = (x: number, y: number) => {
    let sum = 0;
    [x - 1, x + 1].forEach((newX) => {
      const tile = grid[y][newX];
      if (tile === SPLITTER) {
        sum += parseTileValue(grid[y - 1][newX]);
      }
    });

    sum += parseTileValue(grid[y - 1][x]);

    return toHex(sum);
  };

  for (let y = 1; y < grid.length; y++) {
    activeXs.forEach((x) => {
      const tile = grid[y][x];
      if (tile === SPLITTER) {
        activeXs.delete(x);
        activeXs.add(x - 1);
        activeXs.add(x + 1);
      } else {
        grid[y][x] = getCellValue(x, y);
      }
    });
  }

  const finalRow = grid[grid.length - 1];

  let sum = 0;
  for (const cell of finalRow) {
    try {
      sum += parseTileValue(cell);
    } catch {}
  }

  return sum;
};

const expectedSecondSolution = 40;

export { expectedFirstSolution, expectedSecondSolution, first, second };
