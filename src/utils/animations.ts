import {Dimensions} from 'react-native';
import Animated from 'react-native-reanimated';
import {Vector} from 'react-native-redash';
import {Dim, Styles} from './types';

const {width} = Dimensions.get('window');

// simple
const set = (vector: Vector<Animated.SharedValue<number>>, value: number) => {
  'worklet';
  vector.x.value = value;
  vector.y.value = value;
};

const clamp = (value: number, min: number, max: number): number => {
  'worklet';
  return Math.max(min, Math.min(value, max));
};

const imageStyles = (layout: Dim): Styles => {
  'worklet';
  const aspectRatio = layout.width / layout.height;
  const styles: Styles = {
    width,
    height: undefined,
    maxWidth: width,
    maxHeight: undefined,
    aspectRatio,
  };

  return styles;
};

// gestures
const pinch = (
  center: {x: number; y: number},
  offset: {x: number; y: number},
  event: {focalX: number; focalY: number; scale: number},
  origin: {x: Animated.SharedValue<number>; y: Animated.SharedValue<number>},
  assign: Animated.SharedValue<boolean>,
): {translateX: number; translateY: number} => {
  'worklet';

  const adjustedFocalX = event.focalX - (center.x + offset.x);
  const adjustedFocalY = event.focalY - (center.y + offset.y);

  if (assign.value) {
    origin.x.value = adjustedFocalX;
    origin.y.value = adjustedFocalY;
    assign.value = false;
  }

  const pinchX = adjustedFocalX - origin.x.value;
  const pinchY = adjustedFocalY - origin.y.value;

  const translateX =
    pinchX + origin.x.value + -1 * event.scale * origin.x.value;
  const translateY =
    pinchY + origin.y.value + -1 * event.scale * origin.y.value;

  return {translateX, translateY};
};

export {clamp, pinch, set, imageStyles};
