export const host = 'http://192.168.42.3:8080';

const apiAuthUrl = '/api/v1/auth';
export const apiAuthRevokeUrl = `${apiAuthUrl}/revoke`;

export const apiUsersUrl = '/api/v1/users';
export const apiUsersMeUrl = `${apiUsersUrl}/me`;
export const apiUsersByIdUrl = (id: string) => {
  return `${apiUsersUrl}/${id}`;
};

export const apiProfilePicture = '/api/v1/pfp';
export const apiProfilePictureMeUrl = `${apiProfilePicture}/me`;
export const apiProfilePictureByUserIdUrl = (id: string) => {
  return `${apiProfilePicture}/${id}`;
};

export const apiFilesUrl = '/api/v1/files';
export const apiFilesEditUrl = `${apiFilesUrl}/edit`;

export const apiFoldersUrl = '/api/v1/folders';
export const apiFoldersEditUril = `${apiFoldersUrl}/edit`;

export const apiUnitUrl = `${apiFoldersUrl}/my-unit`;
export const apiUnitSize = `${apiFoldersUrl}/unit/size`;

export const apiFileById = (id: string) => {
  return `${apiFilesUrl}/${id}`;
};

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
