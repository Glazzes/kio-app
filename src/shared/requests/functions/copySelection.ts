import {AxiosResponse} from 'axios';
import {CopyRequest, File, Folder} from '../../types';
import {axiosInstance} from '../axiosInstance';
import {apiCopyFilesUrl, apiCopyFoldersUrl} from '../contants';

type ItemType = 'files' | 'folders';
type CopyResult<T extends ItemType> = T extends 'files' ? File[] : Folder[];

export const copySelection = async <T extends ItemType>(
  request: CopyRequest,
  itemType: T,
): Promise<AxiosResponse<CopyResult<T>>> => {
  const uri = itemType === 'files' ? apiCopyFilesUrl : apiCopyFoldersUrl;
  return axiosInstance.put(uri, request);
};
