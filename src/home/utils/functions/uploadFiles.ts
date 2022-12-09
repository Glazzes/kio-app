import notifee from '@notifee/react-native';
import {getFileFormData} from './getFileFormData';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {File} from '../../../shared/types';
import {apiFilesUrl} from '../../../shared/requests/contants';
import {
  emitFolderAddFiles,
  emitFolderUpdatePreview,
} from '../../../shared/emitter';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {displayToast, genericErrorMessage} from '../../../shared/toast';

export const uploadFiles = async (
  parentFolderId: string,
  files: DocumentPickerResponse[],
) => {
  const channelId = await notifee.createChannel({id: 'upf', name: 'Upload'});
  const notiId = await notifee.displayNotification({
    title: 'Preparing files',
    body: `${files.length} files will be uploaded`,
    android: {
      channelId,
      onlyAlertOnce: true,
    },
  });

  try {
    const formData = await getFileFormData(parentFolderId, files);
    const {data} = await axiosInstance.post<File[]>(apiFilesUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    emitFolderAddFiles(parentFolderId, data);
    emitFolderUpdatePreview(parentFolderId, data.length, 0);

    notifee.displayNotification({
      id: notiId,
      title: 'Files uploaded',
      body: `${data.length} files have been uploaded`,
      android: {
        channelId,
        onlyAlertOnce: true,
      },
    });
  } catch (e) {
    displayToast(genericErrorMessage);
  }
};
