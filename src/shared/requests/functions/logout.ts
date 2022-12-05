import {Navigation} from 'react-native-navigation';
import {onBoardingRoot} from '../../../navigation/roots';
import {mmkv} from '../../../store/mmkv';
import {
  displayToast,
  genericErrorMessage,
  logoutSuccessMessage,
} from '../../toast';
import {axiosInstance} from '../axiosInstance';
import {apiAuthRevokeUrl} from '../contants';

export const logout = async () => {
  try {
    await axiosInstance.post(apiAuthRevokeUrl);

    mmkv.delete('tokens');
    Navigation.setRoot(onBoardingRoot);
    displayToast(logoutSuccessMessage);
  } catch (e) {
    displayToast(genericErrorMessage);
  }
};
