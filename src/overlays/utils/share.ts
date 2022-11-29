import {
  displayToast,
  shareErrorMessage,
  shareInforMessage,
  shareNotAvialableErrorMessage,
} from '../../shared/toast';
import RNFS from 'react-native-fs';
import {staticFileUrl, staticFolderUrl} from '../../shared/requests/contants';
import {Platform} from 'react-native';
import {File, Folder} from '../../shared/types';
import authState from '../../store/authStore';
import * as Sharing from 'expo-sharing';
import {emitDismissAllToasts} from '../../shared/emitter';

export const shareFile = async (file: File | Folder) => {
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    displayToast(shareNotAvialableErrorMessage);
    return;
  }

  displayToast(shareInforMessage);

  const isFile = (file as File).contentType !== undefined;
  const fromUrl = isFile ? staticFileUrl(file.id) : staticFolderUrl(file.id);

  const toFile =
    (Platform.OS === 'android' ? 'file://' : '') +
    RNFS.CachesDirectoryPath +
    '/' +
    (isFile ? file.name : file.name + '.zip');

  try {
    await RNFS.downloadFile({
      fromUrl,
      toFile,
      headers: {
        Authorization: `Bearer ${authState.tokens.accessToken}`,
      },
    }).promise;

    await Sharing.shareAsync(toFile, {
      mimeType: isFile ? (file as File).contentType : 'application/zip',
    });

    emitDismissAllToasts('');
  } catch (e) {
    displayToast(shareErrorMessage);
  } finally {
    RNFS.unlink(toFile).catch(e => {
      console.log('Delete file error', e);
    });
  }
};
