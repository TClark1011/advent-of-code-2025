type Coordinates = [x: number, y: number];

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

const second = (input: string) => {
  input;
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { expectedFirstSolution, expectedSecondSolution, first, second };
