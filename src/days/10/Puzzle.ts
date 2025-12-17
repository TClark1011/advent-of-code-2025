// We represent the lights being on/off as a binary number
type Machine = {
  lights: number;
  buttons: number[];
  voltages: number[];
};

type SolveState = {
  lightsState: number;
  presses: number;
};

const getMinimumMachinePresses = (machine: Machine): number => {
  const queue: SolveState[] = [{ lightsState: 0, presses: 0 }];
  const previousLightStates = new Set<number>();

  while (queue.length > 0) {
    let currentState = queue.shift()!;
    previousLightStates.add(currentState.lightsState);
    if (currentState.lightsState === machine.lights) {
      return currentState.presses;
    }

    for (const button of machine.buttons) {
      const nextState = currentState.lightsState ^ button;
      if (previousLightStates.has(nextState)) continue;
      queue.push({
        lightsState: nextState,
        presses: currentState.presses + 1,
      });
    }
  }

  return -1;
};

const binaryWithOnesAt = (onesAt: number[]) => {
  let result: number = 0;
  for (const i of onesAt) {
    result += 2 ** i;
  }
  return result;
};

// const LIGHT_ON = '#';
const LIGHT_OFF = '.';

const first = (input: string) => {
  const machines: Machine[] = input.split('\n').map((row) => {
    const rawButtons = row.split(' ');
    const rawLights = rawButtons.shift()!.slice(1, -1).split('');
    const voltages = rawButtons.pop()!.slice(1, -1).split(',').map(Number);
    const buttons = rawButtons.map((text) => {
      const onesAt = text.slice(1, -1).split(',').map(Number);
      return binaryWithOnesAt(onesAt);
    });

    // Convert the on/off lights to binary numbers
    // When we iterate, we flip the order because
    // binary digits are indexed from the right
    const lightsOnesAt: number[] = [];
    rawLights.forEach((light, index) => {
      if (light === LIGHT_OFF) return;
      lightsOnesAt.push(index);
    });

    const lights = binaryWithOnesAt(lightsOnesAt);

    return {
      lights,
      buttons,
      voltages,
    };
  });

  const minimumPresses: number[] = machines.map((m) =>
    getMinimumMachinePresses(m)
  );

  let totalMinimumPresses = 0;

  for (const p of minimumPresses) {
    totalMinimumPresses += p;
  }

  return totalMinimumPresses;
};

const expectedFirstSolution = 7;

const second = (input: string) => {
  input;
  return 'solution 2';
};

const expectedSecondSolution = 'solution 2';

export { expectedFirstSolution, expectedSecondSolution, first, second };
