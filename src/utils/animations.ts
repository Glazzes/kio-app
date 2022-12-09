import {Dimensions, ViewStyle} from 'react-native';
import Animated from 'react-native-reanimated';
import {Vector} from 'react-native-redash';
import {Dimension} from '../shared/types';

const {width} = Dimensions.get('window');

const set = (vector: Vector<Animated.SharedValue<number>>, value: number) => {
  'worklet';
  vector.x.value = value;
  vector.y.value = value;
};

const imageStyles = (layout: Dimension): ViewStyle => {
  'worklet';
  const aspectRatio = layout.width / layout.height;
  const styles: ViewStyle = {
    width,
    height: undefined,
    maxWidth: width,
    maxHeight: undefined,
    aspectRatio,
  };

  return styles;
};

export {set, imageStyles};
