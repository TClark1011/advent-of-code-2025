import { inspect } from 'util';

export const myInspect = (input: unknown) =>
  inspect(input, {
    colors: true,
    depth: 10,
  });
