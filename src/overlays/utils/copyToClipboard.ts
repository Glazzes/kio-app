import {File, Folder} from '../../shared/types';
import {setStringAsync} from 'expo-clipboard';
import {staticFileUrl, staticFolderUrl} from '../../shared/requests/contants';

export const copyLinkToClipboard = async (file: File | Folder) => {
  const isFile = (file as File).contentType !== undefined;
  const uri = isFile ? staticFileUrl(file.id) : staticFolderUrl(file.id);
  await setStringAsync(uri);
};
