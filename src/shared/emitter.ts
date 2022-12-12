import {EventEmitter} from 'fbemitter';
import {UpdateFolderEvent} from '../home/utils/types';
import {File, Folder, User} from './types';

const emitter = new EventEmitter();
export default emitter;

export const updatePictureEventName = 'Update.Picture';
export const emitUpdateProfilePicture = (uri: string) => {
  emitter.emit(updatePictureEventName, uri);
};

// Favorite
export const getFavoriteEventName = (fileId: string) => {
  return `Favorite-${fileId}`;
};

export const emitFavoriteFile = (fileId: string) => {
  const eventName = getFavoriteEventName(fileId);
  emitter.emit(eventName);
};

// SearchBar events
export const getClenTextSearchEventName = (folderId: String) => {
  return `Clear.Text.Search-${folderId}`;
};

export const emitCleanTextSearch = (folderId: string) => {
  const eventName = getClenTextSearchEventName(folderId);
  emitter.emit(eventName);
};

export const getTextSearchEventName = (folderId: string) => {
  return `Text.Search-${folderId}`;
};

export const emitTextSearch = (folderId: string, text: string) => {
  const eventName = getTextSearchEventName(folderId);
  emitter.emit(eventName, text);
};

export const getTextSearchEndTypingEventName = (folderId: string) => {
  return `Text.Search.End.Typing-${folderId}`;
};

export const emitTextSearchEndTyping = (
  folderId: string,
  searchTerm: string,
) => {
  const eventName = getTextSearchEndTypingEventName(folderId);
  emitter.emit(eventName, searchTerm);
};

export const hideAppbarEventName = 'Hide.Appbar';
export const emitHideAppbar = () => {
  emitter.emit(hideAppbarEventName);
};

export const dismissLastModalEventName = 'Dismiss.Last.Modal';
export const emitDissLastModal = () => {
  emitter.emit(dismissLastModalEventName);
};

export const dismissToastsEventName = 'Dismiss.Toasts';

export const emitDismissAllToasts = (componentId: string) => {
  emitter.emit(dismissToastsEventName, componentId);
};

// Event names (files and folders)
export const getFolderUpdateFileEventName = (folderId: string) => {
  return `${UpdateFolderEvent.UPDATE_FILE}-${folderId}`;
};

export const emitFolderUpdateFile = (folderId: string, file: File) => {
  const eventName = getFolderUpdateFileEventName(folderId);
  emitter.emit(eventName, file);
};

export const getFolderUpdateFolderEventName = (folderId: string) => {
  return `${UpdateFolderEvent.UPDATE_FOLDER}-${folderId}`;
};

export const emitFolderUpdateFolder = (parentId: string, folder: Folder) => {
  const eventName = getFolderUpdateFolderEventName(parentId);
  emitter.emit(eventName, folder);
};

export const getClearSelectionEventName = (folderId: string) => {
  return `clear-selection-${folderId}`;
};

export const getFolderAddFilesEventName = (folderId: string) => {
  return `${UpdateFolderEvent.ADD_FILES}-${folderId}`;
};

export const getFolderDeleteFilesEventName = (folderId: string) => {
  return `${UpdateFolderEvent.DELETE_FILES}-${folderId}`;
};

export const getFolderAddFoldersEventName = (folderId: string) => {
  return `${UpdateFolderEvent.ADD_FOLDER}-${folderId}`;
};

export const getFolderDeleteFoldersEventName = (folderId: string) => {
  return `${UpdateFolderEvent.DELETE_FOLDERS}-${folderId}`;
};

export const getFolderUpdatePreviewEventName = (folderId: string) => {
  return `${UpdateFolderEvent.UPDATE_PREVIEW}-${folderId}`;
};

// Actions (files and folders)
export const emitClearSelection = (folderid: string) => {
  const eventName = getClearSelectionEventName(folderid);
  emitter.emit(eventName);
};

export const emitFolderAddFiles = (folderId: string, files: File[]) => {
  const eventName = getFolderAddFilesEventName(folderId);
  emitter.emit(eventName, files);
};

export const emitFolderDeleteFiles = (folderId: string, fileIds: string[]) => {
  const eventName = getFolderDeleteFilesEventName(folderId);
  emitter.emit(eventName, fileIds);
};

export const emitFolderAddFolders = (folderId: string, folders: Folder[]) => {
  const eventName = getFolderAddFoldersEventName(folderId);
  emitter.emit(eventName, folders);
};

export const emitFolderDeleteFolders = (
  folderId: string,
  folderIds: string[],
) => {
  const eventName = getFolderDeleteFoldersEventName(folderId);
  emitter.emit(eventName, folderIds);
};

export const emitFolderUpdatePreview = (
  folderId: string,
  files: number,
  folders: number,
) => {
  const eventName = getFolderUpdatePreviewEventName(folderId);
  emitter.emit(eventName, files, folders);
};

// Coowner events
export const getAddCoownerEventName = (parentFolderId: string) => {
  return `coowner-add-${parentFolderId}`;
};

export const emitAddCoowner = (parentFolderId: string, user: User) => {
  const eventName = getAddCoownerEventName(parentFolderId);
  emitter.emit(eventName, user);
};

export const getDeleteCoownerEventName = (parentFolderId: string) => {
  return `coowner-delete-${parentFolderId}`;
};

export const emitDeleteCoowner = (parentFolderId: string, userId: string) => {
  const eventName = getDeleteCoownerEventName(parentFolderId);
  emitter.emit(eventName, userId);
};

// contributors
export const getAddContributorsEventName = (folderId: string) => {
  return `contributor-add-${folderId}`;
};

export const emitAddContributors = (folderId: string, contributors: User[]) => {
  const eventName = getAddContributorsEventName(folderId);
  emitter.emit(eventName, contributors);
};

export const getDeleteContributorsEventName = (folderId: string) => {
  return `contributor-delete-${folderId}`;
};

export const emitDeleteContributor = (
  folderId: string,
  contributorId: string,
) => {
  const eventName = getDeleteContributorsEventName(folderId);
  emitter.emit(eventName, contributorId);
};

// Push to Image Details
export const getPushToImageDetailsEventName = (id: string) => {
  return `push-image-${id}`;
};

export const emitPushToImageDetails = (id: string) => {
  const eventName = getPushToImageDetailsEventName(id);
  emitter.emit(eventName);
};

// Miscelaneous
export const hideImagePicker = 'Hide.Image.Picker';
export const emitHideImagePicker = () => {
  emitter.emit(hideImagePicker);
};
