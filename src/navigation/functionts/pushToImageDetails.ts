import {Navigation} from 'react-native-navigation';
import Animated from 'react-native-reanimated';
import {Screens} from '../../enums/screens';
import {Dimension, File} from '../../shared/types';

type PushOptions = {
  file: File;
  parentFolderId: string;
  opacity: Animated.SharedValue<number>;
  dimensions: Dimension;
};

export function pushToImageDetails(options: PushOptions) {
  Navigation.showModal({
    component: {
      name: Screens.IMAGE_DETAILS,
      passProps: options,
    },
  }).then(() => (options.opacity.value = 0));
}
