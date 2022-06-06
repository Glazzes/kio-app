import Animated, {Extrapolate, interpolate} from 'react-native-reanimated';
import {Vector} from 'react-native-redash';
import {Dim, Styles} from '../../utils/types';

type CropPoint = {
  originX: number;
  originY: number;
  size: number;
};

const maxScale = (
  layout: Vector<Animated.SharedValue<number>>,
  dimensions: Dim,
  rotation: number,
): number => {
  'worklet';
  if (rotation === 0 || rotation === Math.PI) {
    return dimensions.height > dimensions.width
      ? dimensions.height / layout.y.value
      : dimensions.width / layout.x.value;
  }

  return dimensions.height > dimensions.width
    ? dimensions.height / layout.x.value
    : dimensions.width / layout.y.value;
};

const cropPoint = (
  translate: {x: number; y: number},
  layout: {x: number; y: number},
  dimensions: Dim,
  scale: number,
  rotationAngle: number,
  R: number,
): CropPoint => {
  const offsetX = (layout.x * scale - R * 2) / 2;
  const offsetY = (layout.y * scale - R * 2) / 2;

  const maxXPercent = Math.abs(1 - (R * 2) / (layout.x * scale));
  const maxYPercent = Math.abs(1 - (R * 2) / (layout.y * scale));

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

  if (
    rotationAngle === Math.PI / 2 ||
    rotationAngle === (3 / 4) * (Math.PI * 2)
  ) {
    const dx = dimensions.width;
    const dy = dimensions.height;

    dimensions.width = dy;
    dimensions.height = dx;
  }

  let originX = dimensions.width * x;
  let originY = dimensions.height * y;

  let size =
    dimensions.width > dimensions.height
      ? dimensions.height / scale
      : dimensions.width / scale;

  return {originX, originY, size};
};

const imageStyles = (dimensions: Dim, R: number): Styles => {
  const aspectRatio = dimensions.width / dimensions.height;
  const styles: Styles = {
    width: undefined,
    height: undefined,
    maxWidth: undefined,
    maxHeight: undefined,
    aspectRatio,
  };

  if (aspectRatio >= 1) {
    styles.height = R * 2;
    styles.maxHeight = R * 2;
  } else {
    styles.width = R * 2;
    styles.maxWidth = R * 2;
  }

  return styles;
};

const flip = (rotate: Animated.SharedValue<number>) => {
  rotate.value = rotate.value === 0 ? Math.PI : 0;
};

export {flip, imageStyles, cropPoint, maxScale};
