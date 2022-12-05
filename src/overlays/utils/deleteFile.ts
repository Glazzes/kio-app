import {
  emitFolderDeleteFiles,
  emitFolderUpdatePreview,
} from '../../shared/emitter';
import {axiosInstance} from '../../shared/requests/axiosInstance';
import {apiFilesUrl} from '../../shared/requests/contants';
import {FileDeleteRequest} from '../../shared/requests/types';
import {
  displayToast,
  deleteSuccessMessage,
  genericErrorMessage,
} from '../../shared/toast';
import {File} from '../../shared/types';

export const deleteFile = async (parentFolderId: string, file: File) => {
  try {
    const request: FileDeleteRequest = {
      from: parentFolderId,
      files: [file.id],
    };

    await axiosInstance.delete(apiFilesUrl, {data: request});
    emitFolderDeleteFiles(request.from, request.files);
    emitFolderUpdatePreview(request.from, -1 * request.files.length, 0);

    const message = deleteSuccessMessage(file.name, 'file');
    displayToast(message);
  } catch (e) {
    displayToast(genericErrorMessage);
  }
};
