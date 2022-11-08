import {host} from '../constants';

// files
export const apiFilesUrl = '/api/v1/files';

// folders
export const downloadFolderUrl = (folderId: string) => {
  return `${host}/static/folder/${folderId}`;
};

export const folderSizeUrl = (id: string) => {
  return `/api/v1/folders/${id}/size`;
};

export const newFolderUrl = (parenFolderId: string) => {
  return `/api/v1/folders/${parenFolderId}`;
};

// static
export const staticFileUrl = (id: string) => {
  return `${host}/static/file/${id}`;
};

export const staticFileThumbnail = (id: string) => {
  return `${host}/static/file/${id}/thumbnail`;
};
