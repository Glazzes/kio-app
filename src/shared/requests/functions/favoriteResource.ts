import {displayToast, genericErrorMessage} from '../../toast';
import {Folder, File, FavoriteRequest} from '../../types';
import {axiosInstance} from '../axiosInstance';
import {apiFilesFavoriteUrl, apiFoldersFavoriteUrl} from '../contants';

export const favoriteResource = async (
  file: File | Folder,
  favorite: boolean,
) => {
  const isFile = (file as File).contentType !== undefined;
  const uri = isFile ? apiFilesFavoriteUrl : apiFoldersFavoriteUrl;

  try {
    const request: FavoriteRequest = {
      resourceId: file.id,
      favorite,
    };

    await axiosInstance.patch(uri, request);
  } catch (e) {
    displayToast(genericErrorMessage);
  }
};
