import {Origin} from './data';

export const buildPath = (
  origins: Origin[],
  length: number,
  R: number,
  bigR?: number,
): string[] => {
  const paths = [];
  for (let i = 0; i < length; i++) {
    const {start, end} = origins[i];
    const currentPath = [
      `M ${end.x} ${end.y}`,
      `A ${R} ${R} 0 0 1 ${start.x} ${start.y}`,
      `L ${bigR ?? R} ${bigR ?? R} z`,
    ];

    paths.push(currentPath.join(' '));
  }

  return paths;
};
