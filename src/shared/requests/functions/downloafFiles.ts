import {File} from '../../../utils/types';
import RNFS from 'react-native-fs';
import {staticFileUrl} from '../contants';
import {Platform} from 'react-native';
import {displayToast} from '../../navigation/displayToast';
import {NotificationType} from '../../../enums/notification';

export const downloadFiles = async (files: File[]) => {
  try {
    for (let file of files) {
      const uri = staticFileUrl(file.id);
      const toFile =
        (Platform.OS === 'android' ? 'file://' : '') +
        RNFS.DownloadDirectoryPath +
        `/${file.name}`;

      await RNFS.downloadFile({
        fromUrl: uri,
        toFile,
      }).promise;
    }

    const successMessage =
      files.length > 1
        ? 'All selected files have been saved to your downloads folder'
        : 'Your file has been downloaded successfuly';

    displayToast('Files downloaded', successMessage, NotificationType.SUCCESS);
  } catch (e) {
    const errorMessage = `An error ocurred while downloading your ${
      files.length > 1 ? 'selection' : 'file'
    }`;

    displayToast('Download error', errorMessage, NotificationType.ERROR);
  }
};
