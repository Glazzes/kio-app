import {HOST as host} from '@env';

const apiAuthUrl = '/api/v1/auth';
export const apiAuthLogin = `${apiAuthUrl}/login`;
export const apiAuthTokenUrl = `${apiAuthLogin}/token`;
export const apiAuthRevokeUrl = `${apiAuthUrl}/revoke`;
export const apiAuthTokenIntrospectUrl = `${apiAuthUrl}/introspect`;

export const apiUsersUrl = '/api/v1/users';
export const apiUsersPlanUrl = `${apiUsersUrl}/plan`;
export const apiUsersEditUrl = `${apiUsersUrl}/edit`;
export const apiUsersExistsUrl = `${apiUsersUrl}/exists`;
export const apiUsersMeUrl = `${apiUsersUrl}/me`;
export const apiUsersByIdUrl = (id: string) => {
  return `${apiUsersUrl}/${id}`;
};

export const apiProfilePictureByUserIdAndPictureId = (
  userId: string,
  pictureId: string,
) => {
  return `${host}/api/v1/pfp/${userId}/${pictureId}`;
};

export const apiFilesUrl = '/api/v1/files';
export const apiFilesEditUrl = `${apiFilesUrl}/edit`;
export const apiFilesFavoriteUrl = `${apiFilesUrl}/favorite`;

export const apiFoldersUrl = '/api/v1/folders';
export const apiFoldersEditUril = `${apiFoldersUrl}/edit`;
export const apiFoldersFavoriteUrl = `${apiFoldersUrl}/favorite`;

export const apiFoldersContributorsUrl = `${apiFoldersUrl}/contributors`;
export const apiFoldersContributorExistsUrl = `${apiFoldersUrl}/contributors/exists`;
export const apiFolderContributorsByIdUrl = (folderId: string) => {
  return `${apiFoldersUrl}/${folderId}/contributors`;
};
export const apiFolderContributorsPreviewByIdUrl = (folderId: string) => {
  return `${apiFoldersUrl}/${folderId}/contributors/preview`;
};

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
