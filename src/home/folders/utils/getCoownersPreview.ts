import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {apiFolderContributorsPreviewByIdUrl} from '../../../shared/requests/contants';
import {ContributorResponse} from '../../../shared/requests/types';

export const getCoownersPreview = (folderId: string) => {
  const uri = apiFolderContributorsPreviewByIdUrl(folderId);
  return axiosInstance.get<ContributorResponse>(uri);
};
