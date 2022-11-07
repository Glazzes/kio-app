import {File} from '../../types';
import RNFS from 'react-native-fs';
import {staticFileUrl} from '../contants';
import {Platform} from 'react-native';
import {displayToast} from '../../navigation/displayToast';
import {Notification} from '../../../enums/notification';
import authState from '../../../store/authStore';

export const downloadFile = (file: File) => {
  const uri = staticFileUrl(file.id);
  const toFile =
    (Platform.OS === 'android' ? 'file://' : '') +
    RNFS.CachesDirectoryPath +
    '/' +
    file.name;

  RNFS.downloadFile({
    fromUrl: uri,
    toFile,
    headers: {
      Authorization: `Bearer ${authState.tokens.accessToken}`,
    },
  })
    .promise.then(_ => {
      displayToast(
        'Download success',
        `Downloaded ${file.name} successfully to your downloads folder!`,
        Notification.SUCCESS,
      );
    })
    .catch(e => {
      console.log(e);
      displayToast(
        'Download error',
        `Could not download ${file.name}, try again later`,
        Notification.SUCCESS,
      );
    });
};
