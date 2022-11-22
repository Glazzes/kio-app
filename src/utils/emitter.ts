import {EventEmitter} from 'fbemitter';
import {UpdateFolderEvent} from '../home/utils/types';
import {File, Folder} from '../shared/types';

const emitter = new EventEmitter();
export default emitter;

// events
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

// actions
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
  folderIds: string,
) => {
  const eventName = getFolderDeleteFoldersEventName(folderId);
  emitter.emit(eventName, folderIds);
};

export const emitFolderUpdatePreview = (
  parentFolderId: string,
  folderId: string,
  files: number,
  folders: number,
) => {
  const eventName = getFolderUpdatePreviewEventName(parentFolderId);
  emitter.emit(eventName, folderId, files, folders);
};
