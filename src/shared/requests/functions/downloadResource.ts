import {Platform} from 'react-native';
import {File, Folder} from '../../types';
import RNFS from 'react-native-fs';
import {staticFileUrl, staticFolderUrl} from '../contants';
import {displayNotification} from '../../functions/displayNotification';
import authState from '../../../store/authStore';
import {displayToast, downloadErrorMessage} from '../../toast';

export const downloadResource = async (file: File | Folder) => {
  const isFile = (file as File).contentType !== undefined;
  const osPrefix = Platform.OS === 'android' ? 'file://' : '';
  const basePath = `${osPrefix}${RNFS.DownloadDirectoryPath}/`;
  const name = isFile ? file.name : file.name + '.zip';

  const {id} = await displayNotification({
    title: 'Preparing file',
    body: `Kio is preparing ${name} to be downloaded`,
  });

  const uri = isFile ? staticFileUrl(file.id) : staticFolderUrl(file.id);
  const endPath = basePath + name;
  RNFS.downloadFile({
    fromUrl: uri,
    toFile: endPath,
    headers: {
      Authorization: `Bearer ${authState.tokens.accessToken}`,
    },
  })
    .promise.then(async _ => {
      await displayNotification({
        id,
        title: 'Download completed',
        body: `${file.name} was downloaded successfully`,
      });
    })
    .catch(_ => {
      displayToast(downloadErrorMessage);
    });
};
