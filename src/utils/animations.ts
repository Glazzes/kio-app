import Animated from 'react-native-reanimated';
import {Vector} from 'react-native-redash';

type Point = {
  x: number;
  y: number;
};

// simple
const set = (vector: Vector<Animated.SharedValue<number>>, value: number) => {
  'worklet';
  vector.x.value = value;
  vector.y.value = value;
};

const clamp = (right: number, value: number, left: number): number => {
  'worklet';
  return Math.max(right, Math.min(value, left));
};

const inRadius = (center: Point, focal: Point, R: number): boolean => {
  'worklet';
  const dx = Math.abs(focal.x - center.x);
  const dy = Math.abs(focal.y - center.y);

  const r = Math.sqrt(dx * dx + dy * dy);
  console.log(R, r);
  return r <= R;
};

// gestures
const pinch = (
  layout: Vector<Animated.SharedValue<number>>,
  translateOffset: Vector<Animated.SharedValue<number>>,
  event: {focalX: number; focalY: number; scale: number},
  originAssign: Animated.SharedValue<boolean>,
  origin: Vector<Animated.SharedValue<number>>,
): {translateX: number; translateY: number} => {
  'worklet';

  const adjustedFocalX = event.focalX - layout.x.value / 2;
  const adjustedFocalY = event.focalY - layout.y.value / 2;

  if (originAssign.value) {
    origin.x.value = adjustedFocalX;
    origin.y.value = adjustedFocalY;
    originAssign.value = false;
  }

  const pinchX = adjustedFocalX - origin.x.value;
  const pinchY = adjustedFocalY - origin.y.value;

  const translateX =
    pinchX +
    origin.x.value +
    translateOffset.x.value +
    -1 * event.scale * origin.x.value;

  const translateY =
    pinchY +
    origin.y.value +
    translateOffset.y.value +
    -1 * event.scale * origin.y.value;

  return {translateX, translateY};
};

export {clamp, inRadius, pinch, set};
