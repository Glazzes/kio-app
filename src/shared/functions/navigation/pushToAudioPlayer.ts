import {Navigation} from 'react-native-navigation';
import {Screens} from '../../../enums/screens';
import {File} from '../../types';

export function pushToAudioPlayer(componentId: string, file: File) {
  Navigation.push(componentId, {
    component: {
      name: Screens.AUDIO_PLAYER,
      passProps: {
        file,
      },
    },
  });
}
