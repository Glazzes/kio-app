import {NotificationType} from '../../../enums/notification';
import {displayToast} from '../../../shared/navigation/displayToast';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {apiFindFolderFilesByIdUrl} from '../../../shared/requests/contants';
import {File, Folder, Page} from '../../../shared/types';

type Callback = (file: Page<File[]>) => void;

export const getFolderFiles = async (
  folder: Folder,
  pageNumber: number,
  callback: Callback,
) => {
  try {
    const uri = apiFindFolderFilesByIdUrl(folder.id);
    const {data: page}: {data: Page<File[]>} = await axiosInstance.get(uri, {
      params: {page: pageNumber},
    });

    callback(page);
  } catch (e) {
    // @ts-ignore
    if (e.response.status === 403) {
      displayToast(
        'Unahotirzed',
        `You do not have access to ${folder.name}'s files`,
        NotificationType.ERROR,
      );

      return;
    }

    displayToast(
      'Load error',
      'Could not load files from this folder, try again later',
      NotificationType.ERROR,
    );
  }
};
