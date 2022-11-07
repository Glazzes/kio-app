import {host} from '../constants';

export const apiFilesUrl = '/api/v1/files';

export const staticFileUrl = (id: string) => {
  return `${host}/static/file/${id}`;
};

export const staticFileThumbnail = (id: string) => {
  return `${host}/static/file/${id}/thumbnail`;
};
