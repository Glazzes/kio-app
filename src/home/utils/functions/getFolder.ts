import {NotificationType} from '../../../enums/notification';
import {displayToast} from '../../../shared/navigation/displayToast';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {apiFolderById, apiUnitUrl} from '../../../shared/requests/contants';
import {Folder} from '../../../shared/types';

type Callback = (folder: Folder) => void;

export const getFolder = async (
  folder: Folder | undefined,
  callback: Callback,
) => {
  try {
    const url = folder !== undefined ? apiFolderById(folder.id) : apiUnitUrl;

    const {data: unit}: {data: Folder} = await axiosInstance.get(url);

    callback(unit);
  } catch (e) {
    const errorMessage = folder
      ? `Could not retrieve information about ${folder.name} folder`
      : 'Could not retrieve information about this folder';

    displayToast('Load error', errorMessage, NotificationType.ERROR);
  }
};
