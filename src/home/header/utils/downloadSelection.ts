import {File, Folder} from '../../../shared/types';
import {
  staticFileUrl,
  staticFolderUrl,
} from '../../../shared/requests/contants';
import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import notifee from '@notifee/react-native';
import authState from '../../../store/authStore';

type DownloadFile = {
  uri: string;
  name: string;
};

export const donwloadSelection = async (files: File[], folders: Folder[]) => {
  const folderUris: DownloadFile[] = folders.map(f => ({
    uri: staticFolderUrl(f.id),
    name: `${f.name}.zip`,
  }));

  const fileUris: DownloadFile[] = files.map(f => ({
    uri: staticFileUrl(f.id),
    name: f.name,
  }));

  const downloadFiles = fileUris.concat(folderUris);

  let downloadCount = 0;
  const content = files.length + folders.length;

  const channelId = await notifee.createChannel({id: 'DS', name: 'Download'});
  const notiId = await notifee.displayNotification({
    title: `Kio will download ${files.length + folders.length} files`,
    body: 'Kio is preparing your files to be downloaded',
    android: {
      channelId,
    },
  });

  for (let i = 0; i < downloadFiles.length; i++) {
    const file = downloadFiles[i];
    const toFile =
      (Platform.OS === 'android' ? 'file://' : '') +
      RNFS.DownloadDirectoryPath +
      '/' +
      file.name;

    await RNFS.downloadFile({
      fromUrl: file.uri,
      toFile,
      headers: {
        Authorization: `Bearer ${authState.tokens.accessToken}`,
      },
      progress(res) {
        console.log(res.bytesWritten);
      },
    }).promise;

    downloadCount++;

    try {
      await notifee.displayNotification({
        id: notiId,
        title: 'Download in progress',
        body: `${downloadCount} out of ${content} files downloaded`,
        android: {
          channelId,
          onlyAlertOnce: true,
          progress: {
            max: content,
            current: downloadCount,
            indeterminate: false,
          },
        },
      });
    } catch (e) {}
  }

  await notifee.displayNotification({
    id: notiId,
    title: 'Download complete',
    body: `${downloadCount} files were downloaded`,
    android: {
      channelId,
      onlyAlertOnce: true,
    },
  });
};
