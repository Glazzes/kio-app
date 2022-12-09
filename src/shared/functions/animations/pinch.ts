import Animated from 'react-native-reanimated';
import {Vector} from 'react-native-redash';

type PinchEvent = {
  focalX: number;
  focalY: number;
  scale: number;
};

type PinchOptions = {
  center: Vector<number>;
  offset: Vector<number>;
  event: PinchEvent;
  origin: Vector<Animated.SharedValue<number>>;
  canAssignOrigin: Animated.SharedValue<boolean>;
};

type PinchReturnType = {
  translateX: number;
  translateY: number;
};

export const pinch = (options: PinchOptions): PinchReturnType => {
  'worklet';

  const {center, offset, event, canAssignOrigin, origin} = options;
  const adjustedFocalX = event.focalX - (center.x + offset.x);
  const adjustedFocalY = event.focalY - (center.y + offset.y);

  if (canAssignOrigin.value) {
    origin.x.value = adjustedFocalX;
    origin.y.value = adjustedFocalY;
    canAssignOrigin.value = false;
  }

  const pinchX = adjustedFocalX - origin.x.value;
  const pinchY = adjustedFocalY - origin.y.value;

  const translateX =
    pinchX + origin.x.value + -1 * event.scale * origin.x.value;
  const translateY =
    pinchY + origin.y.value + -1 * event.scale * origin.y.value;

  return {translateX, translateY};
};
