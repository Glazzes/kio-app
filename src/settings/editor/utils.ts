import Animated from 'react-native-reanimated';
import {Vector} from 'react-native-redash';
import {Dim} from '../../utils/types';

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

const flip = (rotate: Animated.SharedValue<number>) => {
  rotate.value = rotate.value === 0 ? Math.PI : 0;
};

export {flip, maxScale};
