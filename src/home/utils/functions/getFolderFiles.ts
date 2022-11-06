import {Notification} from '../../../enums/notification';
import {displayToast} from '../../../shared/navigation/displayToast';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {File, Folder, Page} from '../../../shared/types';

type Callback = (file: Page<File[]>) => void;

export const getFolderFiles = async (folder: Folder, callback: Callback) => {
  try {
    const {data: page}: {data: Page<File[]>} = await axiosInstance.get(
      `/api/v1/folders/${folder?.id}/files`,
      {params: {page: 0}},
    );

    callback(page);
  } catch (e) {
    // @ts-ignore
    if (e.response.status === 403) {
      displayToast(
        'Unahotirzed',
        `You do not have access to ${folder.name}'s files`,
        Notification.ERROR,
      );

      return;
    }

    displayToast(
      'Load error',
      'Could not load files from this folder, try again later',
      Notification.ERROR,
    );
  }
};
