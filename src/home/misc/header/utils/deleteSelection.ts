import {apiFilesUrl} from '../../../../shared/constants';
import {axiosInstance} from '../../../../shared/requests/axiosInstance';
import {apiFolderById} from '../../../../shared/requests/contants';
import {FileDeleteRequest} from '../../../../shared/requests/types';
import {
  deleteSelectionErrorMessage,
  deleteSelectionSuccessMessage,
  displayToast,
} from '../../../../shared/toast';
import {File, Folder} from '../../../../shared/types';
import {clearFileSelection} from '../../../../store/fileSelection';
import {
  emitFolderDeleteFiles,
  emitFolderDeleteFolders,
} from '../../../../shared/emitter';

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
    }

    if (folders.length > 0) {
      for (let folder of folders) {
        try {
          const uri = apiFolderById(folder.id);
          await axiosInstance.delete(uri);
          emitFolderDeleteFolders(from, [folder.id]);
        } catch (e) {
          displayToast(deleteSelectionErrorMessage);
        }
      }
    }

    displayToast(deleteSelectionSuccessMessage);
  } catch (e) {
    displayToast(deleteSelectionErrorMessage);
  } finally {
    clearFileSelection();
  }
};
