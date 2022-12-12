import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {apiFolderContributorsByIdUrl} from '../../../shared/requests/contants';
import {Page, User} from '../../../shared/types';

export const getFolderCoowners = (folderId: string, pageNumber: 0) => {
  const uri = apiFolderContributorsByIdUrl(folderId);
  return axiosInstance.get<Page<User[]>>(uri, {
    params: {
      page: pageNumber,
    },
  });
};
