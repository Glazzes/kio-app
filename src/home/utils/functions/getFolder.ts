import {NotificationType} from '../../../enums/notification';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {apiFolderById, apiUnitUrl} from '../../../shared/requests/contants';
import {displayToast} from '../../../shared/toast';
import {Folder} from '../../../shared/types';

export const getFolder = async (
  folder: Folder | undefined,
): Promise<Folder> => {
  try {
    const url = folder !== undefined ? apiFolderById(folder.id) : apiUnitUrl;
    const {data} = await axiosInstance.get<Folder>(url);
    return data;
  } catch (e) {
    const errorMessage = folder
      ? `Could not retrieve information about ${folder.name} folder`
      : 'Could not retrieve information about this folder';

    displayToast({
      title: 'Load error',
      message: errorMessage,
      type: NotificationType.ERROR,
    });

    return Promise.reject(e);
  }
};
