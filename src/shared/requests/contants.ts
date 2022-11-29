import {host} from '../constants';

export const apiUsersUrl = '/api/v1/users';
export const apiFilesUrl = '/api/v1/files';
export const apiFoldersUrl = '/api/v1/folders';

export const apiUnitUrl = `${apiFoldersUrl}/my-unit`;
export const apiUnitSize = `${apiFoldersUrl}/unit/size`;

export const apiFolderById = (id: string) => {
  return `${apiFoldersUrl}/${id}`;
};

export const folderSizeUrl = (id: string) => {
  return `${apiFoldersUrl}/${id}/size`;
};

export const newFolderUrl = (parenFolderId: string) => {
  return `${apiFoldersUrl}/${parenFolderId}`;
};

export const apiFindFolderFilesByIdUrl = (folderId: string) => {
  return `${apiFoldersUrl}/${folderId}/files`;
};

// copy && cut
const copyUrl = '/api/v1/cc';
export const apiCopyFilesUrl = `${copyUrl}/files/copy`;
export const apiCutFilesUrl = `${copyUrl}/files/cut`;
export const apiCopyFoldersUrl = `${copyUrl}/folders/copy`;
export const apiCutFoldersUrl = `${copyUrl}/folders/cut`;

// static
export const staticFileUrl = (id: string) => {
  return `${host}/static/file/${id}`;
};

export const staticFileThumbnail = (id: string) => {
  return `${host}/static/file/${id}/thumbnail`;
};

export const staticFolderUrl = (folderId: string) => {
  return `${host}/static/folder/${folderId}`;
};
