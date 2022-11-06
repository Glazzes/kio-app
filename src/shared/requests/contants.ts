import {host} from '../constants';

export const staticFileUrl = (id: string) => {
  return `${host}/static/file/${id}`;
};
