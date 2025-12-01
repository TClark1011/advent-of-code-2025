const first = (input: string) => {
  const lines = input.split('\n');

  let zeroCount = 0;
  let location = 50;

  for (const line of lines) {
    const direction = line.at(0);
    const fullDistance = Number(line.slice(1));

    const effectiveDistance = fullDistance % 100;

    if (direction === 'L') {
      location = (location - effectiveDistance) % 100;
    } else {
      location = (location + effectiveDistance) % 100;
    }
    if (location < 0) {
      location = 100 + location;
    }
    if (location === 0) {
      zeroCount++;
    }
  }

  return zeroCount;
};

const expectedFirstSolution = 3;

// const second = (input: string) => {
//   const lines = input.split('\n');

//   let zeroCount = 0;
//   let location = 50;

//   for (const line of lines) {
//     const direction = line.at(0);
//     const fullDistance = Number(line.slice(1));

//     const previousZeros = zeroCount;
//     const fullRevolutions = Math.floor(fullDistance / 100);
//     zeroCount += fullRevolutions;

//     const effectiveDistance = fullDistance % 100;

//     const previousLocation = location;

//     if (direction === 'L') {
//       location = (location - effectiveDistance) % 100;
//     } else {
//       location = (location + effectiveDistance) % 100;
//     }
//     if (location < 0) {
//       location = 100 + location;
//     }

//     if (
//       previousLocation !== 0 &&
//       ((direction === 'L' && location >= previousLocation) ||
//         (direction === 'R' && location <= previousLocation))
//     ) {
//       zeroCount++;
//     }
//     if (fullDistance !== effectiveDistance) {
//       console.log({
//         d: direction,
//         l: location,
//         pl: previousLocation,
//         z: zeroCount,
//         pz: previousZeros,
//         fd: fullDistance,
//         r: fullRevolutions,
//         ed: effectiveDistance,
//       });
//     }
//   }

//   return zeroCount;
// };

const second = (input: string) => {
  const lines = input.split('\n');

  let zeroCount = 0;
  let location = 50;

  for (const line of lines) {
    const direction = line.at(0);
    const distance = Number(line.slice(1));

    const diffMultiplier = direction === 'L' ? -1 : 1;
    const diff = distance * diffMultiplier;
    for (
      let i = 0;
      direction === 'L' ? i > diff : i < diff;
      i += diffMultiplier
    ) {
      location += diffMultiplier;
      if (location === -1) {
        location = 99;
      } else if (location === 100) {
        location = 0;
      }
      if (location === 0) {
        zeroCount++;
      }
    }
  }

  return zeroCount;
};

const expectedSecondSolution = 6;

export { expectedFirstSolution, expectedSecondSolution, first, second };
