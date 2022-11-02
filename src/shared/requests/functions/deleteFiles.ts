import {axiosInstance} from '../axiosInstance';
import {FileDeleteRequest} from '../types';

export const deleteFiles = async (request: FileDeleteRequest) => {
  return await axiosInstance.delete('/api/v1/files', {data: request});
};
