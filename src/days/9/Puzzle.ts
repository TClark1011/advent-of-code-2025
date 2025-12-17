import { myInspect } from '../../helpers/log-helpers.ts';

type Coordinates = [x: number, y: number];

type Line = [Coordinates, Coordinates];

const COLLINEAR = 0; // straight
const CLOCKWISE = 1;
const COUNTERCLOCKWISE = 2;

/**
 * Given a line drawn between three points, determine what
 * direction the segment between the second and third points
 * would have to turn
 */
const orientation = (a: Coordinates, b: Coordinates, c: Coordinates) => {
  const val = (b[1] - a[1]) * (c[0] - b[0]) - (b[0] - a[0]) * (c[1] - b[1]);
  if (val === 0) return COLLINEAR;
  if (val > 0) return CLOCKWISE;
  return COUNTERCLOCKWISE;
};

const doLinesIntersect = (lineA: Line, lineB: Line): boolean => {
  const orientationA = orientation(lineA[0], lineA[1], lineB[0]);
  const orientationB = orientation(lineA[0], lineA[1], lineB[1]);
  const orientationC = orientation(lineB[0], lineB[1], lineA[0]);
  const orientationD = orientation(lineB[0], lineB[1], lineA[1]);

  return orientationA !== orientationB && orientationC !== orientationD;
};

const isBetweenValues = (checking: number, a: number, b: number): boolean => {
  const lesser = Math.min(a, b);
  const greater = Math.max(a, b);

  return checking >= lesser && checking <= greater;
};

/**
 * Relines on the restriction of this problem that all lines
 * are either purely vertical or purely horizontal
 */
const simpleIsOnLine = (line: Line, [x, y]: Coordinates): boolean => {
  const lineIsHorizontal = line[0][1] === line[1][1];

  if (lineIsHorizontal) {
    return y === line[0][1] && isBetweenValues(x, line[0][0], line[1][0]);
  }

  return x === line[0][0] && isBetweenValues(y, line[0][1], line[1][0]);
};

const rectangleArea = (cornerA: Coordinates, cornerB: Coordinates): number => {
  const height = Math.abs(cornerA[1] - cornerB[1]) + 1;
  const width = Math.abs(cornerA[0] - cornerB[0]) + 1;

  return height * width;
};

const first = (input: string) => {
  const coordinates: Coordinates[] = input.split('\n').map(
    (row) =>
      row
        .split(',')
        .filter((v) => !!v)
        .map(Number) as Coordinates
  );

  let maxRectangleArea = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    for (let j = i + 1; j < coordinates.length; j++) {
      maxRectangleArea = Math.max(
        maxRectangleArea,
        rectangleArea(coordinates[i], coordinates[j])
      );
    }
  }

  return maxRectangleArea;
};

const expectedFirstSolution = 50;

const RED = '🟥';
const GREEN = '🟩';
const EMPTY = '⬜';
const RAY_FILL = '⬛';

const wrapIndex = (arr: unknown[], index: number) => {
  if (index >= 0) return index % arr.length;

  return (arr.length + (index % arr.length)) % arr.length;
};

type Rectangle = {
  cornerA: Coordinates;
  cornerB: Coordinates;
  area: number;
};

const forEachBetween = (
  coordinatesA: Coordinates,
  coordinatesB: Coordinates,
  callback: (coords: Coordinates) => void
) => {
  const xAdjustment = coordinatesA[0] > coordinatesB[0] ? -1 : 1;
  const yAdjustment = coordinatesA[1] > coordinatesB[1] ? -1 : 1;

  for (
    let x = coordinatesA[0] + xAdjustment;
    coordinatesA[0] > coordinatesB[0]
      ? x >= coordinatesB[0]
      : x <= coordinatesB[0];
    x += xAdjustment
  ) {
    for (
      let y = coordinatesA[1] + yAdjustment;
      coordinatesA[1] > coordinatesB[1]
        ? y >= coordinatesB[1]
        : y <= coordinatesB[1];
      y += yAdjustment
    ) {
      // console.log(x);
      callback([x, y]);
    }
  }
};

const second = (input: string) => {
  const coordinates: Coordinates[] = input.split('\n').map(
    (row) =>
      row
        .split(',')
        .filter((v) => !!v)
        .map(Number) as Coordinates
  );

  const allRectangles: Rectangle[] = [];

  for (let i = 0; i < coordinates.length - 1; i++) {
    for (let j = i + 1; j < coordinates.length; j++) {
      allRectangles.push({
        cornerA: coordinates[i],
        cornerB: coordinates[j],
        area: rectangleArea(coordinates[i], coordinates[j]),
      });
    }
  }

  allRectangles.sort((a, b) => b.area - a.area);

  let maxX = 0;
  let maxY = 0;

  for (const [x, y] of coordinates) {
    maxX = Math.max(x, maxX);
    maxY = Math.max(y, maxY);
  }

  // Extra column/row of padding so that raycasting works
  maxX += 1;
  maxY += 1;

  const grid: string[][] = [];

  const logGrid = (prefix?: string) => {
    // console.log('-----------');
    // if (prefix) {
    //   console.log(prefix);
    // }
    // console.log(grid.map((r) => r.join('')).join('\n'));
  };

  // Base empty layer
  for (let y = 0; y <= maxY; y++) {
    grid[y] = [];
    for (let x = 0; x <= maxX; x++) {
      grid[y].push(EMPTY);
    }
  }

  logGrid('Base');

  const lines: Line[] = [];

  // Outline
  for (let i = 0; i < coordinates.length; i++) {
    const [x, y] = coordinates[i];
    const [previousX, previousY] = coordinates[wrapIndex(coordinates, i - 1)];

    lines.push([
      [x, y],
      [previousX, previousY],
    ]);

    if (previousX === x) {
      for (
        let cursorY = previousY;
        cursorY !== y;
        cursorY = previousY > y ? cursorY - 1 : cursorY + 1
      ) {
        grid[cursorY][x] = GREEN;
      }
    }

    if (previousY === y) {
      for (
        let cursorX = previousX;
        cursorX !== x;
        cursorX = previousX > x ? cursorX - 1 : cursorX + 1
      ) {
        grid[y][cursorX] = GREEN;
      }
    }
  }

  logGrid('Outline');

  const lineIntersectsWithShape = (line: Line) =>
    lines.some((shapeLine) => doLinesIntersect(shapeLine, line));

  // console.log('intersection testing:', {
  //   '[0,0] -> [0,1] (false)': lineIntersectsWithShape([
  //     [0, 0],
  //     [0, 1],
  //   ]),
  //   '[1,4] -> [3,4] (true)': lineIntersectsWithShape([
  //     [1, 4],
  //     [3, 4],
  //   ]),
  // });

  const isInsideShape = ([x, y]: Coordinates): boolean => {
    let xRayIntersections = 0;
    for (let rayX = x + 1; rayX <= maxX - 1; rayX++) {
      const startingPoint: Coordinates = [rayX, y];

      const startingPointLiesOnLine = lines.find((line) =>
        simpleIsOnLine(line, [rayX, y])
      );

      // console.log('(Puzzle): ', { rayX });

      // console.log('(Puzzle): ', { startingPointLiesOnLine, coords: [rayX, y] });

      if (!startingPointLiesOnLine) {
        const endingPoint: Coordinates = [rayX + 1, y];
        if (lineIntersectsWithShape([startingPoint, endingPoint])) {
          xRayIntersections++;
        }
        continue;
      }

      const nextNonIntersectingX = Math.max(
        startingPointLiesOnLine[0][0],
        startingPointLiesOnLine[0][1]
      );

      const endingPoint: Coordinates = [nextNonIntersectingX + 1, y];
      if (lineIntersectsWithShape([startingPoint, endingPoint])) {
        xRayIntersections++;
      }

      rayX = Math.max(rayX, nextNonIntersectingX);
    }

    return xRayIntersections % 2 === 0;

    // let yRayIntersections = 0;
    // for (let rayY = y + 1; rayY <= maxY - 1; rayY++) {
    //   const startingPoint: Coordinates = [x, rayY];
    //   const endingPoint: Coordinates = [x, rayY + 1];

    //   if (lineIntersectsWithShape([startingPoint, endingPoint])) {
    //     yRayIntersections++;
    //   }
    // }

    // return yRayIntersections % 2 !== 0 && xRayIntersections % 2 !== 0;
  };

  // console.log('inside shape testing', {
  //   '[3,4] (true)': isInsideShape([3, 4]),
  //   '[0,0] (false)': isInsideShape([0, 0]),
  // });

  // // Horizontal Fill
  // for (let y = 0; y < grid.length; y++) {
  //   for (let x = 0; x <= maxX; x++) {
  //     let intersectionCount = 0;

  //     if (grid[y][x] === GREEN) continue;

  //     for (let rayX = x + 1; rayX <= maxX; rayX++) {
  //       if (grid[y][rayX] === GREEN) {
  //         intersectionCount++;
  //         const nextNonBoundaryIndex = grid[y].indexOf(EMPTY, rayX);
  //         if (nextNonBoundaryIndex > rayX + 1) {
  //           intersectionCount++;
  //         } else {
  //         }
  //         rayX = nextNonBoundaryIndex;
  //       }
  //     }

  //     if (intersectionCount % 2 === 1) {
  //       grid[y][x] = RAY_FILL;
  //     }
  //   }
  // }

  // logGrid('Fill (first pass)');

  // for (let x = 0; x <= maxX; x++) {
  //   for (let y = 0; y <= maxY; y++) {
  //     let intersectionCount = 0;

  //     const tile = grid[y][x];

  //     if (tile === GREEN) continue;

  //     for (let rayY = y + 1; rayY <= maxY; rayY++) {
  //       if (grid[rayY][x] === GREEN) {
  //         intersectionCount++;
  //       }
  //     }

  //     if (intersectionCount % 2 === 1 && tile === RAY_FILL) {
  //       grid[y][x] = GREEN;
  //     } else if (tile === RAY_FILL) {
  //       grid[y][x] = EMPTY;
  //     }
  //   }
  // }

  // logGrid('Fill (final pass)');

  // New Fill
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x <= maxX; x++) {
      if (isInsideShape([x, y])) {
        grid[y][x] = GREEN;
      }
    }
  }

  logGrid('New Fill');

  for (const rect of allRectangles) {
    try {
      forEachBetween(rect.cornerA, rect.cornerB, (coords) => {
        // console.log('(Puzzle): ', myInspect({ coords, rect }));
        if (grid[coords[1]][coords[0]] !== GREEN) throw new Error('');
      });
      return rect.area;
    } catch {}
  }

  logGrid('Fill (final)');

  return 'solution 2';
};

const expectedSecondSolution = 24;

export { expectedFirstSolution, expectedSecondSolution, first, second };
