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
  const inputRows = input.split('\n');
  const operatorsRow = inputRows.pop()!;

  const operators = operatorsRow.split(/\s+/).filter((v) => !!v);

  const columnLengths: number[] = [];
  let spaceStreak = 1;
  operatorsRow.split('').forEach((character) => {
    if (character !== ' ') {
      if (spaceStreak === 1) return;
      columnLengths.push(spaceStreak - 1);
      spaceStreak = 1;
      return;
    }
    spaceStreak++;
  });
  columnLengths.push(spaceStreak);

  const columns: string[][] = [];
  let parsedLength = 0;
  for (let i = 0; i < columnLengths.length; i++) {
    const column: string[] = [];
    const columnLength = columnLengths[i];
    inputRows.forEach((row) => {
      column.push(row.slice(parsedLength, parsedLength + columnLength));
    });
    parsedLength += columnLength + 1;
    columns.push(column);
  }

  let sum = 0;
  columns.forEach((column, colIndex) => {
    const columnLength = columnLengths[colIndex];
    const operator = operators[colIndex] as '*' | '+';

    let result = operator === '*' ? 1 : 0;
    for (let digitIndex = 0; digitIndex < columnLength; digitIndex++) {
      const digits: string[] = [];
      column.forEach((value) => {
        const digit = value.at(digitIndex)!;
        if (!digit.trim()) return;
        digits.push(digit);
      });

      const value = Number(digits.join(''));

      switch (operator) {
        case '*':
          result *= value;
          break;
        case '+':
          result += value;
          break;
      }
    }
    sum += result;
  });

  return sum;
};

const expectedSecondSolution = 3263827;

export { expectedFirstSolution, expectedSecondSolution, first, second };
