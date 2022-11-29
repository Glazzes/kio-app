import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import authState from '../../../store/authStore';
import {Folder} from '../../types';
import {staticFolderUrl} from '../contants';

export const downloadFolder = (folder: Folder) => {
  const fromUrl = staticFolderUrl(folder.id);

  const toFile =
    (Platform.OS === 'android' ? 'file://' : '') +
    `${RNFS.DownloadDirectoryPath}/${folder.name}.zip`;

  RNFS.downloadFile({
    fromUrl,
    toFile,
    headers: {
      Authorization: `Bearer ${authState.tokens.accessToken}`,
    },
  }).promise.then(_ => console.log('folder downloaded'));
};
