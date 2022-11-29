import {EventEmitter} from 'fbemitter';
import {UpdateFolderEvent} from '../home/utils/types';
import {File, Folder} from './types';

const emitter = new EventEmitter();
export default emitter;

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
