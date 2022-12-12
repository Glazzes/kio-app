import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {apiFilesUrl, apiFolderById} from '../../../shared/requests/contants';
import {FileDeleteRequest} from '../../../shared/requests/types';
import {
  deleteSelectionErrorMessage,
  deleteSelectionSuccessMessage,
  displayToast,
} from '../../../shared/toast';
import {File, Folder} from '../../../shared/types';
import {clearFileSelection} from '../../../store/fileSelection';
import {
  emitClearSelection,
  emitFolderDeleteFiles,
  emitFolderDeleteFolders,
  emitFolderUpdatePreview,
} from '../../../shared/emitter';

export const deleteSelection = async (
  from: string,
  files: File[],
  folders: Folder[],
) => {
  const fileIds = files.map(f => f.id);
  const fileDeleteRequest: FileDeleteRequest = {
    from,
    files: fileIds,
  };

  try {
    if (files.length > 0) {
      await axiosInstance.delete(apiFilesUrl, {data: fileDeleteRequest});
      emitFolderDeleteFiles(from, fileIds);
      emitFolderUpdatePreview(from, -1 * files.length, 0);
    }

    if (folders.length > 0) {
      for (let folder of folders) {
        try {
          const uri = apiFolderById(folder.id);
          await axiosInstance.delete(uri);
          emitFolderDeleteFolders(from, [folder.id]);
          emitFolderUpdatePreview(from, 0, -1);
        } catch (e) {
          console.log(e);
          displayToast(deleteSelectionErrorMessage);
        }
      }
    }

    displayToast(deleteSelectionSuccessMessage);
  } catch (e) {
    displayToast(deleteSelectionErrorMessage);
  } finally {
    emitClearSelection(from);
    clearFileSelection();
  }
};
