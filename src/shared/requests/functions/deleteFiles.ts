import {axiosInstance} from '../axiosInstance';
import {FileDeleteRequest} from '../types';

export const deleteFiles = (request: FileDeleteRequest) => {
  return axiosInstance.delete('/api/v1/files', {data: request});
};
