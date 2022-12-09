import {AxiosResponse} from 'axios';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {apiFindFolderFilesByIdUrl} from '../../../shared/requests/contants';
import {File, Folder, Page} from '../../../shared/types';

export const getFolderFiles = async (
  folder: Folder,
  pageNumber: number,
): Promise<AxiosResponse<Page<File[]>>> => {
  const uri = apiFindFolderFilesByIdUrl(folder.id);
  return await axiosInstance.get<Page<File[]>>(uri, {
    params: {page: pageNumber},
  });
};
