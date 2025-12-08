const first = (input: string) => {
  const rowsOfItems = input
    .split('\n')
    .map((row) => row.split(/\s+/).filter((i) => i !== ''));

  const ROW_LENGTH = rowsOfItems[0].length;

  const columns: string[][] = [];

  for (let ci = 0; ci < ROW_LENGTH; ci++) {
    const column: string[] = [];
    rowsOfItems.forEach((items) => {
      column.push(items[ci]);
    });
    columns.push(column);
  }

  let sum = 0;

  columns.forEach((column) => {
    const operator = column.pop()! as '*' | '+';
    let result = operator === '+' ? 0 : 1;
    column.forEach((cell) => {
      switch (operator) {
        case '*':
          result = Number(cell) * result;
          break;
        case '+':
          result += Number(cell);
          break;
      }
    });
    sum += result;
  });

  return sum;
};

const expectedFirstSolution = 4277556;

const second = (input: string) => {
  input;
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { expectedFirstSolution, expectedSecondSolution, first, second };
