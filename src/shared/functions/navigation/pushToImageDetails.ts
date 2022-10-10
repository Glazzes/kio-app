import {Navigation} from 'react-native-navigation';
import Animated from 'react-native-reanimated';
import {Screens} from '../../../enums/screens';
import {Dimension, File} from '../../types';

export function pushToImageDetails(
  file: File,
  uri: string,
  opacity: Animated.SharedValue<number>,
  dimensions: Dimension,
) {
  Navigation.showModal({
    component: {
      name: Screens.IMAGE_DETAILS,
      passProps: {
        file,
        uri,
        opacity,
        dimensions,
      },
    },
  }).then(() => (opacity.value = 0));
}
