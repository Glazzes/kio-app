import Animated, {
  cancelAnimation,
  Extrapolate,
  interpolate,
} from 'react-native-reanimated';
import {Vector} from 'react-native-redash';

export type Styles = {
  width: number | undefined;
  maxWidth: number | undefined;
  height: number | undefined;
  maxHeight: number | undefined;
  aspectRatio: number;
};

type Dim = {
  width: number;
  height: number;
};

type CropPoint = {
  originX: number;
  originY: number;
  size: number;
};

const cropPoint = (
  layout: Vector<Animated.SharedValue<number>>,
  translate: Vector<Animated.SharedValue<number>>,
  scale: number,
  dimensions: Dim,
  R: number,
): CropPoint => {
  'worklet';
  cancelAnimation(translate.x);
  cancelAnimation(translate.y);

  const offsetX = (layout.x.value * scale - R * 2) / 2;
  const offsetY = (layout.y.value * scale - R * 2) / 2;

  const maxXPercent = Math.abs(1 - (R * 2) / (layout.x.value * scale));
  const maxYPercent = Math.abs(1 - (R * 2) / (layout.y.value * scale));

  const x = interpolate(
    translate.x.value,
    [-offsetX, offsetX],
    [maxXPercent, 0],
    Extrapolate.CLAMP,
  );

  const y = interpolate(
    translate.y.value,
    [-offsetY, offsetY],
    [maxYPercent, 0],
    Extrapolate.CLAMP,
  );

  let originX = dimensions.width * x;
  let originY = dimensions.height * y;

  let size =
    dimensions.width > dimensions.height
      ? dimensions.height / scale
      : dimensions.width / scale;

  return {originX, originY, size};
};

const imageStyles = (dimensions: {w: number; h: number}, R: number): Styles => {
  const aspectRatio = dimensions.w / dimensions.h;
  const styles: Styles = {
    width: 0,
    height: 0,
    maxWidth: 0,
    maxHeight: 0,
    aspectRatio,
  };

  if (aspectRatio >= 1) {
    styles.height = R * 2;
    styles.maxHeight = R * 2;
    styles.maxWidth = undefined;
    styles.width = undefined;
  } else {
    styles.width = R * 2;
    styles.maxWidth = R * 2;
    styles.maxHeight = undefined;
    styles.height = undefined;
  }

  return styles;
};

const flip = (rotate: Animated.SharedValue<number>) => {
  rotate.value = rotate.value === 0 ? Math.PI : 0;
};

export {flip, imageStyles, cropPoint};
