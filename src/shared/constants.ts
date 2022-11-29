import {UpdateFolderEvent} from '../home/utils/types';

export const host = 'http://192.168.42.165:8080';
export const apiFilesUrl = '/api/v1/files';

export const addFolderEventName = (folderId: string): string => {
  return `${UpdateFolderEvent.ADD_FOLDER}-${folderId}`;
};
