import {NotificationType} from '../../../enums/notification';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {apiFindFolderFilesByIdUrl} from '../../../shared/requests/contants';
import {displayToast} from '../../../shared/toast';
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
      displayToast({
        title: 'Unahotirzed',
        message: `You do not have access to ${folder.name}'s files`,
        type: NotificationType.ERROR,
      });

      return;
    }

    displayToast({
      title: 'Load error',
      message: 'Could not load files from this folder, try again later',
      type: NotificationType.ERROR,
    });
  }
};
