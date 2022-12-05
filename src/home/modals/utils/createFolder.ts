import {Navigation} from 'react-native-navigation';
import {
  emitFolderAddFolders,
  emitFolderUpdatePreview,
} from '../../../shared/emitter';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {newFolderUrl} from '../../../shared/requests/contants';
import {
  createFolderSuccessMessage,
  displayToast,
  genericErrorMessage,
} from '../../../shared/toast';
import {Folder} from '../../../shared/types';

export const createFolder = async (
  folderId: string,
  folderName: string,
  componentId: string,
) => {
  try {
    const uri = newFolderUrl(folderId);

    const {data} = await axiosInstance.post<Folder>(uri, undefined, {
      params: {
        name: folderName,
      },
    });

    emitFolderAddFolders(folderId, [data]);
    emitFolderUpdatePreview(folderId, 0, 1);

    Navigation.dismissModal(componentId);

    const message = createFolderSuccessMessage(folderName);
    displayToast(message);
  } catch (e) {
    displayToast(genericErrorMessage);
  }
};
