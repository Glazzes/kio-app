import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import authState from '../../../store/authStore';
import {Folder} from '../../types';
import {downloadFolderUrl} from '../contants';

export const downloadFolder = (folder: Folder) => {
  const fromUrl = downloadFolderUrl(folder.id);

  const toFile =
    (Platform.OS === 'android' ? 'file://' : '') +
    `${RNFS.DownloadDirectoryPath}/${folder.name}.zip`;

  console.log(toFile);

  RNFS.downloadFile({
    fromUrl,
    toFile,
    headers: {
      Authorization: `Bearer ${authState.tokens.accessToken}`,
    },
  }).promise.then(_ => console.log('folder downloaded'));
};
