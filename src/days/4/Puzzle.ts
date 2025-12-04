type Paper = '@';
type Empty = '.';

const PAPER: Paper = '@';
const EMPTY: Empty = '.';

type Cell = Paper | Empty;

type Coordinates = {
  x: number;
  y: number;
};

const getAdjacentCoordinates = (
  currentCoordinates: Coordinates,
  maxCoordinates: Coordinates
): Coordinates[] => {
  const result: Coordinates[] = [];

  for (let yAdjustment = -1; yAdjustment <= 1; yAdjustment += 1) {
    const newY = currentCoordinates.y + yAdjustment;
    if (newY < 0 || newY > maxCoordinates.y) continue;

    for (let xAdjustment = -1; xAdjustment <= 1; xAdjustment += 1) {
      if (xAdjustment === 0 && yAdjustment === 0) continue;
      const newX = currentCoordinates.x + xAdjustment;
      if (newX < 0 || newX > maxCoordinates.x) continue;

      result.push({
        x: newX,
        y: newY,
      });
    }
  }

  return result;
};

const first = (input: string) => {
  const rows: Cell[][] = input
    .split('\n')
    .map((row) => row.split('') as Cell[]);

  let totalRolls = 0;
  let inaccessibleRolls = 0;

  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];

    for (let x = 0; x < row.length; x++) {
      const cell = row[x];
      if (cell !== PAPER) continue;
      totalRolls++;

      const surroundingCells = getAdjacentCoordinates(
        {
          x,
          y,
        },
        {
          x: row.length - 1,
          y: rows.length - 1,
        }
      );

      let filledSurroundingCells = 0;
      for (const surroundingCell of surroundingCells) {
        if (rows[surroundingCell.y][surroundingCell.x] === PAPER) {
          filledSurroundingCells++;
          if (filledSurroundingCells >= 4) {
            inaccessibleRolls++;
            break;
          }
        }
      }
    }
  }

  const accessibleRolls = totalRolls - inaccessibleRolls;

  return accessibleRolls;
};

const expectedFirstSolution = 13;

type RemovedRoll = '#';

const REMOVED_ROLL: RemovedRoll = '#';

type Cell2 = Cell | RemovedRoll;

const second = (input: string) => {
  const rows: Cell2[][] = input
    .split('\n')
    .map((row) => row.split('') as Cell2[]);

  let removedRolls = 0;
  let previousRemovedRolls = 0;

  do {
    previousRemovedRolls = removedRolls;
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];

      xLoop: for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell === REMOVED_ROLL) {
          rows[y][x] = EMPTY;
        }
        if (cell !== PAPER) continue;

        const surroundingCells = getAdjacentCoordinates(
          {
            x,
            y,
          },
          {
            x: row.length - 1,
            y: rows.length - 1,
          }
        );

        let filledSurroundingCells = 0;
        for (const surroundingCellCoordinates of surroundingCells) {
          const targetCell =
            rows[surroundingCellCoordinates.y][surroundingCellCoordinates.x];
          if (targetCell === PAPER) {
            filledSurroundingCells++;
            if (filledSurroundingCells >= 4) continue xLoop;
          }
        }
        rows[y][x] = REMOVED_ROLL;
        removedRolls++;
      }
    }
  } while (previousRemovedRolls !== removedRolls);

  return removedRolls;
};

const expectedSecondSolution = 43;

export { expectedFirstSolution, expectedSecondSolution, first, second };
