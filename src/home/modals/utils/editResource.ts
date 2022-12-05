import {
  emitFolderUpdateFile,
  emitFolderUpdateFolder,
} from '../../../shared/emitter';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {
  apiFilesEditUrl,
  apiFoldersEditUril,
} from '../../../shared/requests/contants';
import {
  displayToast,
  genericErrorMessage,
  updateResourceSuccessMessage,
} from '../../../shared/toast';
import {
  EditResourceRequest,
  File,
  FileVisibility,
  Folder,
} from '../../../shared/types';

type EditOptions = {
  file: File | Folder;
  newName: string;
  from: string;
  visibility: FileVisibility;
};

export const editResource = async (options: EditOptions) => {
  const request: EditResourceRequest = {
    from: options.from,
    resourceId: options.file.id,
    name: options.newName,
    visibility: options.visibility,
  };

  const isFile = (options.file as File).contentType !== undefined;
  const uri = isFile ? apiFilesEditUrl : apiFoldersEditUril;

  try {
    if (isFile) {
      const {data} = await axiosInstance.patch<File>(uri, request);
      emitFolderUpdateFile(options.from, data);

      const message = updateResourceSuccessMessage(
        options.file.name,
        options.newName,
        'file',
      );
      displayToast(message);
    } else {
      const {data} = await axiosInstance.patch<Folder>(uri, request);
      emitFolderUpdateFolder(options.from, data);

      const message = updateResourceSuccessMessage(
        options.file.name,
        options.newName,
        'folder',
      );
      displayToast(message);
    }
  } catch (e) {
    displayToast(genericErrorMessage);
  }
};
