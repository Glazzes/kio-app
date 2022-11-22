import {axiosInstance} from '../requests/axiosInstance';
import {apiFolderById} from '../requests/contants';

export const deleteFolder = async (folderId: string) => {
  const uri = apiFolderById(folderId);
  return await axiosInstance.delete(uri);
};
