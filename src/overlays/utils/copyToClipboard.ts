import {File, Folder} from '../../shared/types';
import {setStringAsync} from 'expo-clipboard';
import {staticFileUrl, staticFolderUrl} from '../../shared/requests/contants';
import {displayToast} from '../../shared/toast';
import {NotificationType} from '../../enums/notification';

export const copyLinkToClipboard = async (file: File | Folder) => {
  const isFile = (file as File).contentType !== undefined;
  const uri = isFile ? staticFileUrl(file.id) : staticFolderUrl(file.id);
  await setStringAsync(uri);

  displayToast({
    title: 'Link copied',
    message: 'Link has been copied to your clipboard.',
    type: NotificationType.INFO,
  });
};
