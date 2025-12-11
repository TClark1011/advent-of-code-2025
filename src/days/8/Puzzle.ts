import { DisjoinSetUnion } from './disjoint-set-union.ts';

type Coordinates = [x: number, y: number, z: number];

type CoordinateDistanceRecord = {
  a: Coordinates;
  b: Coordinates;
  distance: number;
};

const getDistanceBetween = (a: Coordinates, b: Coordinates): number => {
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff += (a[i] - b[i]) ** 2;
  }

  return Math.sqrt(diff);
};

const first = (input: string) => {
  const coordinates = input
    .split('\n')
    .map((row) => row.split(',').map(Number) as Coordinates);

  const distances: CoordinateDistanceRecord[] = [];

  for (let i = 0; i < coordinates.length - 1; i++) {
    for (let j = i + 1; j < coordinates.length; j++) {
      distances.push({
        a: coordinates[i],
        b: coordinates[j],
        distance: getDistanceBetween(coordinates[i], coordinates[j]),
      });
    }
  }

  distances.sort((a, b) => a.distance - b.distance); // Shortest to longest distance

  const dsu = new DisjoinSetUnion(coordinates);

  for (let i = 0; i < coordinates.length; i++) {
    const distance = distances[i];

    dsu.mergeTrees(distance.a, distance.b);
  }

  const allSizes = dsu.getSizes();

  allSizes.sort((a, b) => b - a);

  let topThreeProduct = 1;
  allSizes.slice(0, 3).forEach((size) => {
    topThreeProduct *= size;
  });

  return topThreeProduct;
};

const expectedFirstSolution = 45;

const second = (input: string) => {
  const coordinates = input
    .split('\n')
    .map((row) => row.split(',').map(Number) as Coordinates);

  const distances: CoordinateDistanceRecord[] = [];

  for (let i = 0; i < coordinates.length - 1; i++) {
    for (let j = i + 1; j < coordinates.length; j++) {
      distances.push({
        a: coordinates[i],
        b: coordinates[j],
        distance: getDistanceBetween(coordinates[i], coordinates[j]),
      });
    }
  }

  distances.sort((a, b) => a.distance - b.distance); // Shortest to longest distance

  const dsu = new DisjoinSetUnion(coordinates);

  let prevA: Coordinates = [0, 0, 0];
  let prevB: Coordinates = [0, 0, 0];
  // while (dsu.getGroups().length > 1) {
  while (dsu.groupCount > 1) {
    const distance = distances.shift();

    if (!distance) throw new Error('All possible connections processed');

    prevA = distance.a;
    prevB = distance.b;

    dsu.mergeTrees(distance.a, distance.b);
  }

  return prevA[0] * prevB[0];
};

const expectedSecondSolution = 25272;

export { expectedFirstSolution, expectedSecondSolution, first, second };
