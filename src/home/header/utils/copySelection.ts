import {AxiosResponse} from 'axios';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {
  apiCopyFilesUrl,
  apiCopyFoldersUrl,
} from '../../../shared/requests/contants';
import {File, Folder, CopyRequest} from '../../../shared/types';

type ItemType = 'files' | 'folders';
type CopyResult<T extends ItemType> = T extends 'files' ? File[] : Folder[];

export const copySelection = async <T extends ItemType>(
  request: CopyRequest,
  itemType: T,
): Promise<AxiosResponse<CopyResult<T>>> => {
  const uri = itemType === 'files' ? apiCopyFilesUrl : apiCopyFoldersUrl;
  return axiosInstance.put(uri, request);
};
