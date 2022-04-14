const clamp = (right: number, value: number, left: number): number => {
  'worklet';
  return Math.max(right, Math.min(value, left));
};

export {clamp};
