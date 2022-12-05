import {
  emitFolderDeleteFolders,
  emitFolderUpdatePreview,
} from '../../shared/emitter';
import {axiosInstance} from '../../shared/requests/axiosInstance';
import {apiFolderById} from '../../shared/requests/contants';
import {
  deleteSuccessMessage,
  displayToast,
  genericErrorMessage,
} from '../../shared/toast';
import {Folder} from '../../shared/types';

export const deleteFolder = async (parentFolderId: string, folder: Folder) => {
  try {
    const uri = apiFolderById(folder.id);
    await axiosInstance.delete(uri);

    emitFolderDeleteFolders(parentFolderId, [folder.id]);
    emitFolderUpdatePreview(parentFolderId, 0, -1);

    const message = deleteSuccessMessage(folder.name, 'folder');
    displayToast(message);
  } catch (e) {
    displayToast(genericErrorMessage);
  }
};
