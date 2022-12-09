import {Navigation} from 'react-native-navigation';
import {Screens} from '../../enums/screens';
import {File} from '../../shared/types';

export function pushToVideoPlayer(
  componentId: string,
  thumbnail: string,
  file: File,
) {
  Navigation.push(componentId, {
    component: {
      name: Screens.VIDEO_PLAYER,
      passProps: {
        thumbnail,
        file,
      },
    },
  });
}
