import {axiosInstance} from '../../shared/requests/axiosInstance';
import {apiFolderById} from '../../shared/requests/contants';

export const deleteFolder = async (folderId: string) => {
  try {
    const uri = apiFolderById(folderId);
    await axiosInstance.delete(uri);
  } catch (e) {
    console.log('Error deleting folder');
  }
};
