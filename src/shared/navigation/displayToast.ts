import {Navigation} from 'react-native-navigation';
import {Notification} from '../../enums/notification';
import {Screens} from '../../enums/screens';

export const displayToast = (
  title: string,
  message: string,
  type: Notification,
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
