import {Navigation} from 'react-native-navigation';
import {NotificationType} from '../../enums/notification';
import {Screens} from '../../enums/screens';

export const displayToast = (
  title: string,
  message: string,
  type: NotificationType,
) => {
  Navigation.showOverlay({
    component: {
      name: Screens.TOAST,
      passProps: {
        title,
        message,
        type,
      },
    },
  });
};
