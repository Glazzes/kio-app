import {AxiosResponse} from 'axios';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {Folder, Page} from '../../../shared/types';

export const getFolderSubFolders = async (
  folder: Folder,
  pageNumber: number,
): Promise<AxiosResponse<Page<Folder[]>>> => {
  return axiosInstance.get<Page<Folder[]>>(
    `/api/v1/folders/${folder.id}/sub-folders`,
    {params: {page: pageNumber}},
  );
};
