import Animated, {Extrapolate, interpolate} from 'react-native-reanimated';
import {Vector} from 'react-native-redash';

type Dim = {
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

type CropPoint = {
  originX: number;
  originY: number;
  size: number;
};

const clamp = (right: number, value: number, left: number): number => {
  'worklet';
  return Math.max(right, Math.min(value, left));
};

// crops from top left of the svg circle
const cropPoint = (
  dimensions: Dim,
  layout: Vector<Animated.SharedValue<number>>,
  translate: {x: number; y: number},
  scale: number,
  R: number,
): CropPoint => {
  'worklet';
  const offsetX = (layout.x.value * scale - R * 2) / 2;
  const offsetY = (layout.y.value * scale - R * 2) / 2;

  const maxXPercent = Math.abs(1 - (R * 2) / (layout.x.value * scale));
  const maxYPercent = Math.abs(1 - (R * 2) / (layout.y.value * scale));

  const x = interpolate(
    translate.x,
    [-offsetX, offsetX],
    [maxXPercent, 0],
    Extrapolate.CLAMP,
  );

  const y = interpolate(
    translate.y,
    [-offsetY, offsetY],
    [maxYPercent, 0],
    Extrapolate.CLAMP,
  );

  const originX = dimensions.width * x;
  const originY = dimensions.height * y;
  const size = dimensions.width / scale;

  return {originX, originY, size};
};

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

const inRadius = (center: Point, focal: Point, R: number): boolean => {
  'worklet';
  const dx = Math.abs(focal.x - center.x);
  const dy = Math.abs(focal.y - center.y);

  const r = Math.sqrt(dx * dx + dy * dy);
  console.log(R, r);
  return r <= R;
};

export {clamp, inRadius, pinch, cropPoint};
