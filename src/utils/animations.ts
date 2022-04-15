type Point = {x: number; y: number};

const clamp = (right: number, value: number, left: number): number => {
  'worklet';
  return Math.max(right, Math.min(value, left));
};

const inRadius = (center: Point, focal: Point, R: number): boolean => {
  'worklet';
  const dx = Math.abs(center.x - focal.x);
  const dy = Math.abs(center.y - focal.y);

  const r = Math.sqrt(dx * dx + dy * dy);
  return R >= r;
};

export {clamp, inRadius};
